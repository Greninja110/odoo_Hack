# In rewear/server/api/swaps.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from config.database import db
from models.user import User
from models.item import Item
from models.swap import Swap
import logging

logger = logging.getLogger(__name__)

swaps_bp = Blueprint('swaps', __name__)

@swaps_bp.route('', methods=['POST'])
@jwt_required()
def request_swap():
    """Request a swap with another user's item"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        if not all(k in data for k in ('requester_item_id', 'provider_item_id')):
            return jsonify({
                'status': 'error',
                'message': 'Missing required fields'
            }), 400
        
        # Check if requester item exists and belongs to current user
        requester_item = Item.query.get(data['requester_item_id'])
        if not requester_item:
            return jsonify({
                'status': 'error',
                'message': 'Requester item not found'
            }), 404
        
        if requester_item.owner_id != current_user_id:
            return jsonify({
                'status': 'error',
                'message': 'You can only offer your own items for swap'
            }), 403
        
        # Check if provider item exists
        provider_item = Item.query.get(data['provider_item_id'])
        if not provider_item:
            return jsonify({
                'status': 'error',
                'message': 'Provider item not found'
            }), 404
        
        # Check if items belong to different users
        if requester_item.owner_id == provider_item.owner_id:
            return jsonify({
                'status': 'error',
                'message': 'Cannot swap with your own item'
            }), 400
        
        # Check if provider item is available
        if provider_item.status != 'approved':
            return jsonify({
                'status': 'error',
                'message': 'Provider item is not available for swap'
            }), 400
        
        # Check if there's already a pending swap request
        existing_swap = Swap.query.filter_by(
            requester_id=current_user_id,
            provider_id=provider_item.owner_id,
            requester_item_id=requester_item.id,
            provider_item_id=provider_item.id,
            status='pending'
        ).first()
        
        if existing_swap:
            return jsonify({
                'status': 'error',
                'message': 'You already have a pending swap request for this item'
            }), 409
        
        # Create new swap request
        new_swap = Swap(
            requester_id=current_user_id,
            provider_id=provider_item.owner_id,
            requester_item_id=requester_item.id,
            provider_item_id=provider_item.id
        )
        
        db.session.add(new_swap)
        db.session.commit()
        
        logger.info(f"Swap request created: {new_swap.id}")
        
        return jsonify({
            'status': 'success',
            'message': 'Swap request sent successfully',
            'data': {
                'swap_id': new_swap.id
            }
        }), 201
    
    except Exception as e:
        db.session.rollback()
        logger.error(f"Create swap request error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'An error occurred while creating swap request'
        }), 500

@swaps_bp.route('', methods=['GET'])
@jwt_required()
def get_swaps():
    """Get user's swaps with pagination and filtering"""
    try:
        current_user_id = get_jwt_identity()
        
        # Get query parameters
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 10, type=int)
        status = request.args.get('status')
        role = request.args.get('role', 'all')  # all, requester, provider
        
        # Base query
        if role == 'requester':
            query = Swap.query.filter_by(requester_id=current_user_id)
        elif role == 'provider':
            query = Swap.query.filter_by(provider_id=current_user_id)
        else:
            query = Swap.query.filter(
                (Swap.requester_id == current_user_id) | 
                (Swap.provider_id == current_user_id)
            )
        
        # Apply status filter if provided
        if status and status != 'all':
            query = query.filter_by(status=status)
        
        # Order by creation date (newest first)
        query = query.order_by(Swap.created_at.desc())
        
        # Paginate results
        swaps_paginated = query.paginate(page=page, per_page=limit, error_out=False)
        
        # Create response data
        swaps_data = [swap.to_dict() for swap in swaps_paginated.items]
        
        return jsonify({
            'status': 'success',
            'data': {
                'swaps': swaps_data,
                'pagination': {
                    'page': page,
                    'limit': limit,
                    'total': swaps_paginated.total,
                    'pages': swaps_paginated.pages
                }
            }
        }), 200
    
    except Exception as e:
        logger.error(f"Get swaps error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'An error occurred while fetching swaps'
        }), 500

@swaps_bp.route('/<swap_id>', methods=['GET'])
@jwt_required()
def get_swap_by_id(swap_id):
    """Get swap by ID"""
    try:
        current_user_id = get_jwt_identity()
        
        # Find the swap
        swap = Swap.query.get(swap_id)
        
        if not swap:
            return jsonify({
                'status': 'error',
                'message': 'Swap not found'
            }), 404
        
        # Check if user is involved in the swap
        if swap.requester_id != current_user_id and swap.provider_id != current_user_id:
            return jsonify({
                'status': 'error',
                'message': 'Unauthorized to view this swap'
            }), 403
        
        return jsonify({
            'status': 'success',
            'data': swap.to_dict()
        }), 200
    
    except Exception as e:
        logger.error(f"Get swap by ID error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'An error occurred while fetching swap'
        }), 500

@swaps_bp.route('/<swap_id>/respond', methods=['PUT'])
@jwt_required()
def respond_to_swap(swap_id):
    """Respond to a swap request (accept/reject)"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate response
        if 'response' not in data or data['response'] not in ['accept', 'reject']:
            return jsonify({
                'status': 'error',
                'message': 'Invalid response. Must be "accept" or "reject"'
            }), 400
        
        # Find the swap
        swap = Swap.query.get(swap_id)
        
        if not swap:
            return jsonify({
                'status': 'error',
                'message': 'Swap not found'
            }), 404
        
        # Check if user is the provider
        if swap.provider_id != current_user_id:
            return jsonify({
                'status': 'error',
                'message': 'Only the item provider can respond to this swap request'
            }), 403
        
        # Check if swap is pending
        if swap.status != 'pending':
            return jsonify({
                'status': 'error',
                'message': f'Cannot respond to a swap that is already {swap.status}'
            }), 400
        
        # Update swap status
        if data['response'] == 'accept':
            swap.status = 'accepted'
            
            # Update items status
            requester_item = Item.query.get(swap.requester_item_id)
            provider_item = Item.query.get(swap.provider_item_id)
            
            if requester_item and provider_item:
                requester_item.status = 'swapped'
                provider_item.status = 'swapped'
            
            logger.info(f"Swap {swap_id} accepted by {current_user_id}")
        else:
            swap.status = 'rejected'
            logger.info(f"Swap {swap_id} rejected by {current_user_id}")
        
        db.session.commit()
        
        return jsonify({
            'status': 'success',
            'message': f'Swap request {data["response"]}ed successfully',
            'data': {
                'swap_id': swap.id,
                'status': swap.status
            }
        }), 200
    
    except Exception as e:
        db.session.rollback()
        logger.error(f"Respond to swap error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'An error occurred while responding to swap'
        }), 500