from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from config.database import db
from models.user import User
from models.item import Item
from auth.jwt_handler import admin_required
import logging

logger = logging.getLogger(__name__)

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/users', methods=['GET'])
@jwt_required()
@admin_required
def get_users():
    """Get all users with pagination and filtering"""
    try:
        # Get query parameters
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 10, type=int)
        status = request.args.get('status')
        search = request.args.get('search')
        
        # Base query
        query = User.query
        
        # Apply filters if provided
        if status and status != 'all':
            query = query.filter_by(status=status)
        
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                (User.username.like(search_term)) | 
                (User.email.like(search_term))
            )
        
        # Order by creation date (newest first)
        query = query.order_by(User.created_at.desc())
        
        # Paginate results
        users_paginated = query.paginate(page=page, per_page=limit, error_out=False)
        
        # Create response data
        users_data = [user.to_dict() for user in users_paginated.items]
        
        return jsonify({
            'status': 'success',
            'data': {
                'users': users_data,
                'pagination': {
                    'page': page,
                    'limit': limit,
                    'total': users_paginated.total,
                    'pages': users_paginated.pages
                }
            }
        }), 200
    
    except Exception as e:
        logger.error(f"Admin get users error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'An error occurred while fetching users'
        }), 500

@admin_bp.route('/users/<user_id>/status', methods=['PUT'])
@jwt_required()
@admin_required
def update_user_status(user_id):
    """Update user status (approve/reject)"""
    try:
        # Get data
        data = request.get_json()
        status = data.get('status')
        
        if not status or status not in ['approved', 'rejected']:
            return jsonify({
                'status': 'error',
                'message': 'Invalid status value'
            }), 400
        
        # Find the user
        user = User.query.get(user_id)
        if not user:
            return jsonify({
                'status': 'error',
                'message': 'User not found'
            }), 404
        
        # Update status
        user.status = status
        db.session.commit()
        
        logger.info(f"User {user.username} status updated to {status}")
        
        return jsonify({
            'status': 'success',
            'message': f'User status updated to {status}',
            'data': {
                'user_id': user.id,
                'status': user.status
            }
        }), 200
    
    except Exception as e:
        db.session.rollback()
        logger.error(f"Update user status error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'An error occurred while updating user status'
        }), 500

@admin_bp.route('/items', methods=['GET'])
@jwt_required()
@admin_required
def get_items():
    """Get all items with pagination and filtering"""
    try:
        # Get query parameters
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 10, type=int)
        status = request.args.get('status')
        search = request.args.get('search')
        
        # Base query
        query = Item.query
        
        # Apply filters if provided
        if status and status != 'all':
            query = query.filter_by(status=status)
        
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                (Item.title.like(search_term)) | 
                (Item.description.like(search_term)) |
                (Item.tags.like(search_term))
            )
        
        # Order by creation date (newest first)
        query = query.order_by(Item.created_at.desc())
        
        # Paginate results
        items_paginated = query.paginate(page=page, per_page=limit, error_out=False)
        
        # Create response data
        items_data = [item.to_dict(include_owner=True) for item in items_paginated.items]
        
        return jsonify({
            'status': 'success',
            'data': {
                'items': items_data,
                'pagination': {
                    'page': page,
                    'limit': limit,
                    'total': items_paginated.total,
                    'pages': items_paginated.pages
                }
            }
        }), 200
    
    except Exception as e:
        logger.error(f"Admin get items error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'An error occurred while fetching items'
        }), 500

@admin_bp.route('/items/<item_id>/status', methods=['PUT'])
@jwt_required()
@admin_required
def update_item_status(item_id):
    """Update item status (approve/reject)"""
    try:
        # Get data
        data = request.get_json()
        status = data.get('status')
        
        if not status or status not in ['approved', 'rejected']:
            return jsonify({
                'status': 'error',
                'message': 'Invalid status value'
            }), 400
        
        # Find the item
        item = Item.query.get(item_id)
        if not item:
            return jsonify({
                'status': 'error',
                'message': 'Item not found'
            }), 404
        
        # Update status
        item.status = status
        db.session.commit()
        
        logger.info(f"Item {item.title} status updated to {status}")
        
        return jsonify({
            'status': 'success',
            'message': f'Item status updated to {status}',
            'data': {
                'item_id': item.id,
                'status': item.status
            }
        }), 200
    
    except Exception as e:
        db.session.rollback()
        logger.error(f"Update item status error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'An error occurred while updating item status'
        }), 500

@admin_bp.route('/items/<item_id>/feature', methods=['PUT'])
@jwt_required()
@admin_required
def toggle_item_featured(item_id):
    """Toggle item featured status"""
    try:
        # Find the item
        item = Item.query.get(item_id)
        if not item:
            return jsonify({
                'status': 'error',
                'message': 'Item not found'
            }), 404
        
        # Check if item is approved
        if item.status != 'approved':
            return jsonify({
                'status': 'error',
                'message': 'Only approved items can be featured'
            }), 400
        
        # Toggle featured status
        item.is_featured = not item.is_featured
        db.session.commit()
        
        logger.info(f"Item {item.title} featured status changed to {item.is_featured}")
        
        return jsonify({
            'status': 'success',
            'message': f'Item featured status updated',
            'data': {
                'item_id': item.id,
                'is_featured': item.is_featured
            }
        }), 200
    
    except Exception as e:
        db.session.rollback()
        logger.error(f"Toggle item featured error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'An error occurred while updating item featured status'
        }), 500