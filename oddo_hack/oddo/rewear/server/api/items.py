import os
import uuid
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from config.database import db
from models.user import User
from models.item import Item, ItemImage
import logging

logger = logging.getLogger(__name__)

items_bp = Blueprint('items', __name__)

@items_bp.route('', methods=['GET'])
def get_items():
    """Get items with pagination and filtering"""
    try:
        # Get query parameters
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 10, type=int)
        category = request.args.get('category')
        search = request.args.get('search')
        
        # Base query - only approved items
        query = Item.query.filter_by(status='approved')
        
        # Apply filters if provided
        if category:
            query = query.filter_by(category=category)
        
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
        logger.error(f"Get items error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'An error occurred while fetching items'
        }), 500

@items_bp.route('/featured', methods=['GET'])
def get_featured_items():
    """Get featured items"""
    try:
        # Get featured items (limited to 5)
        featured_items = Item.query.filter_by(
            status='approved', 
            is_featured=True
        ).order_by(Item.created_at.desc()).limit(5).all()
        
        # Create response data
        items_data = [item.to_dict(include_owner=True) for item in featured_items]
        
        return jsonify({
            'status': 'success',
            'data': items_data
        }), 200
    
    except Exception as e:
        logger.error(f"Get featured items error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'An error occurred while fetching featured items'
        }), 500

@items_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get all available categories"""
    try:
        # These are the predefined categories for now
        # In a real app, this would come from a database table
        categories = [
            {'id': 'shirts', 'name': 'Shirts'},
            {'id': 'tshirts', 'name': 'T-Shirts'},
            {'id': 'pants', 'name': 'Pants'},
            {'id': 'jeans', 'name': 'Jeans'},
            {'id': 'dresses', 'name': 'Dresses'},
            {'id': 'skirts', 'name': 'Skirts'},
            {'id': 'jackets', 'name': 'Jackets'},
            {'id': 'hoodies', 'name': 'Hoodies'},
            {'id': 'sweaters', 'name': 'Sweaters'},
            {'id': 'shoes', 'name': 'Shoes'},
            {'id': 'accessories', 'name': 'Accessories'}
        ]
        
        return jsonify({
            'status': 'success',
            'data': categories
        }), 200
    
    except Exception as e:
        logger.error(f"Get categories error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'An error occurred while fetching categories'
        }), 500

@items_bp.route('/<item_id>', methods=['GET'])
def get_item_by_id(item_id):
    """Get item by ID"""
    try:
        item = Item.query.get(item_id)
        
        if not item:
            return jsonify({
                'status': 'error',
                'message': 'Item not found'
            }), 404
        
        return jsonify({
            'status': 'success',
            'data': item.to_dict(include_owner=True)
        }), 200
    
    except Exception as e:
        logger.error(f"Get item by ID error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'An error occurred while fetching item'
        }), 500

@items_bp.route('/similar/<item_id>', methods=['GET'])
def get_similar_items(item_id):
    """Get similar items based on category and tags"""
    try:
        item = Item.query.get(item_id)
        
        if not item:
            return jsonify({
                'status': 'error',
                'message': 'Item not found'
            }), 404
        
        # Find items with same category (excluding the current item)
        similar_items = Item.query.filter(
            Item.category == item.category,
            Item.id != item_id,
            Item.status == 'approved'
        ).limit(4).all()
        
        # If we don't have enough items, add some based on tags
        if len(similar_items) < 4 and item.tags:
            tags_list = [tag.strip() for tag in item.tags.split(',')]
            for tag in tags_list:
                if len(similar_items) >= 4:
                    break
                
                tag_items = Item.query.filter(
                    Item.tags.like(f"%{tag}%"),
                    Item.id != item_id,
                    Item.id.notin_([i.id for i in similar_items]),
                    Item.status == 'approved'
                ).limit(4 - len(similar_items)).all()
                
                similar_items.extend(tag_items)
        
        # Create response data
        items_data = [item.to_dict(include_owner=True) for item in similar_items]
        
        return jsonify({
            'status': 'success',
            'data': items_data
        }), 200
    
    except Exception as e:
        logger.error(f"Get similar items error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'An error occurred while fetching similar items'
        }), 500

@items_bp.route('', methods=['POST'])
@jwt_required()
def create_item():
    """Create a new item"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({
                'status': 'error',
                'message': 'User not found'
            }), 404
        
        # Check if user is approved
        if user.status != 'approved' and not user.is_admin():
            return jsonify({
                'status': 'error',
                'message': 'Your account is pending approval'
            }), 403
        
        # Get form data
        title = request.form.get('title')
        description = request.form.get('description')
        category = request.form.get('category')
        size = request.form.get('size')
        condition = request.form.get('condition')
        tags = request.form.get('tags')
        
        # Validate required fields
        if not all([title, description, category, size, condition]):
            return jsonify({
                'status': 'error',
                'message': 'Missing required fields'
            }), 400
        
        # Create new item
        new_item = Item(
            title=title,
            description=description,
            category=category,
            size=size,
            condition=condition,
            tags=tags,
            owner_id=current_user_id,
            # Admin items are automatically approved
            status='approved' if user.is_admin() else 'pending'
        )
        
        db.session.add(new_item)
        db.session.flush()  # Get the ID without committing
        
        # Check if images are provided
        images = request.files.getlist('images[]')
        if not images or not images[0].filename:
            db.session.rollback()
            return jsonify({
                'status': 'error',
                'message': 'At least one image is required'
            }), 400
        
        # Process images
        upload_folder = os.path.join(current_app.config['UPLOAD_FOLDER'], 'items')
        os.makedirs(upload_folder, exist_ok=True)
        
        for index, file in enumerate(images):
            if file and allowed_file(file.filename):
                # Generate unique filename
                filename = secure_filename(file.filename)
                ext = filename.rsplit('.', 1)[1].lower()
                new_filename = f"{uuid.uuid4().hex}.{ext}"
                
                # Save the file
                file_path = os.path.join(upload_folder, new_filename)
                file.save(file_path)
                
                # Create image record
                relative_path = f"/uploads/items/{new_filename}"
                new_image = ItemImage(
                    item_id=new_item.id,
                    file_path=relative_path,
                    is_primary=(index == 0)  # First image is primary
                )
                
                db.session.add(new_image)
        
        db.session.commit()
        
        logger.info(f"Item '{new_item.title}' created by user {user.username}")
        
        return jsonify({
            'status': 'success',
            'message': 'Item created successfully',
            'data': {
                'item_id': new_item.id,
                'status': new_item.status
            }
        }), 201
    
    except Exception as e:
        db.session.rollback()
        logger.error(f"Create item error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'An error occurred while creating item'
        }), 500

@items_bp.route('/user', methods=['GET'])
@jwt_required()
def get_user_items():
    """Get items for the current user"""
    try:
        current_user_id = get_jwt_identity()
        
        # Get query parameters
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 10, type=int)
        
        # Get user items with pagination
        items_paginated = Item.query.filter_by(
            owner_id=current_user_id
        ).order_by(Item.created_at.desc()).paginate(
            page=page, per_page=limit, error_out=False
        )
        
        # Create response data
        items_data = [item.to_dict() for item in items_paginated.items]
        
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
        logger.error(f"Get user items error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'An error occurred while fetching user items'
        }), 500

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']