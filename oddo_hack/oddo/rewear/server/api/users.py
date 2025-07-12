import os
import uuid
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from config.database import db
from models.user import User
from auth.jwt_handler import generate_tokens
import logging

logger = logging.getLogger(__name__)

users_bp = Blueprint('users', __name__)

@users_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not all(k in data for k in ('username', 'email', 'password')):
            return jsonify({
                'status': 'error',
                'message': 'Missing required fields'
            }), 400
        
        # Check if username or email already exists
        if User.query.filter_by(username=data['username']).first():
            return jsonify({
                'status': 'error',
                'message': 'Username already taken'
            }), 409
        
        if User.query.filter_by(email=data['email']).first():
            return jsonify({
                'status': 'error',
                'message': 'Email already registered'
            }), 409
        
        # Create new user
        new_user = User(
            username=data['username'],
            email=data['email'],
            password=data['password'],
            gender=data.get('gender')
        )
        
        # First user is automatically admin and approved
        if User.query.count() == 0:
            new_user.role = 'admin'
            new_user.status = 'approved'
        
        db.session.add(new_user)
        db.session.commit()
        
        logger.info(f"User {new_user.username} registered successfully")
        
        return jsonify({
            'status': 'success',
            'message': 'Registration successful',
            'data': {
                'user_id': new_user.id
            }
        }), 201
    
    except Exception as e:
        db.session.rollback()
        logger.error(f"Registration error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'An error occurred during registration'
        }), 500

@users_bp.route('/login', methods=['POST'])
def login():
    """Login route - implemented in jwt_handler.py"""
    from auth.jwt_handler import login_user
    return login_user()

@users_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh token route - implemented in jwt_handler.py"""
    from auth.jwt_handler import refresh_token
    return refresh_token()

@users_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get current user profile"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({
                'status': 'error',
                'message': 'User not found'
            }), 404
        
        return jsonify({
            'status': 'success',
            'data': {
                'user': user.to_dict()
            }
        }), 200
    
    except Exception as e:
        logger.error(f"Get profile error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'An error occurred while fetching profile'
        }), 500

@users_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update user profile"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({
                'status': 'error',
                'message': 'User not found'
            }), 404
        
        # Get update data
        data = request.get_json()
        
        # Update fields if provided
        if 'username' in data and data['username'] != user.username:
            # Check if username is already taken
            if User.query.filter_by(username=data['username']).first():
                return jsonify({
                    'status': 'error',
                    'message': 'Username already taken'
                }), 409
            user.username = data['username']
        
        if 'city' in data:
            user.city = data['city']
        
        if 'address' in data:
            user.address = data['address']
        
        if 'bio' in data:
            user.bio = data['bio']
        
        if 'swap_preference' in data:
            user.swap_preference = data['swap_preference']
        
        db.session.commit()
        
        return jsonify({
            'status': 'success',
            'message': 'Profile updated successfully',
            'data': {
                'user': user.to_dict()
            }
        }), 200
    
    except Exception as e:
        db.session.rollback()
        logger.error(f"Update profile error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'An error occurred while updating profile'
        }), 500

@users_bp.route('/profile/image', methods=['POST'])
@jwt_required()
def upload_profile_image():
    """Upload profile image"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({
                'status': 'error',
                'message': 'User not found'
            }), 404
        
        # Check if image file is provided
        if 'image' not in request.files:
            return jsonify({
                'status': 'error',
                'message': 'No image file provided'
            }), 400
        
        file = request.files['image']
        
        # Check if filename is empty
        if file.filename == '':
            return jsonify({
                'status': 'error',
                'message': 'No image selected'
            }), 400
        
        # Check if file type is allowed
        if not allowed_file(file.filename):
            return jsonify({
                'status': 'error',
                'message': 'File type not allowed'
            }), 400
        
        # Generate unique filename
        filename = secure_filename(file.filename)
        ext = filename.rsplit('.', 1)[1].lower()
        new_filename = f"{uuid.uuid4().hex}.{ext}"
        
        # Create upload directory if it doesn't exist
        upload_folder = os.path.join(current_app.config['UPLOAD_FOLDER'], 'profile_images')
        os.makedirs(upload_folder, exist_ok=True)
        
        # Save the file
        file_path = os.path.join(upload_folder, new_filename)
        file.save(file_path)
        
        # Update user's profile image path
        relative_path = f"/uploads/profile_images/{new_filename}"
        user.profile_image = relative_path
        db.session.commit()
        
        return jsonify({
            'status': 'success',
            'message': 'Profile image uploaded successfully',
            'data': {
                'image_url': relative_path
            }
        }), 200
    
    except Exception as e:
        db.session.rollback()
        logger.error(f"Profile image upload error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'An error occurred while uploading profile image'
        }), 500

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']