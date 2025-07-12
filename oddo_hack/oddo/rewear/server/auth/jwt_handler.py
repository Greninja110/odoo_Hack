from flask import jsonify, request
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt_identity,
    jwt_required
)
from models.user import User
import logging
from functools import wraps

logger = logging.getLogger(__name__)

def generate_tokens(user_id):
    """Generate access and refresh tokens for a user"""
    access_token = create_access_token(identity=user_id)
    refresh_token = create_refresh_token(identity=user_id)
    return access_token, refresh_token

def login_user():
    """Login a user and return tokens"""
    try:
        # Get login data
        data = request.get_json()
        email_or_username = data.get('email', '')
        password = data.get('password', '')
        
        # Find the user
        user = User.query.filter(
            (User.email == email_or_username) | (User.username == email_or_username)
        ).first()
        
        # Verify user and password
        if not user or not user.verify_password(password):
            return jsonify({
                'status': 'error',
                'message': 'Invalid credentials'
            }), 401
        
        # Check if user is approved
        if user.status != 'approved' and not user.is_admin():
            return jsonify({
                'status': 'error',
                'message': 'Your account is pending approval'
            }), 403
        
        # Generate tokens
        access_token, refresh_token = generate_tokens(user.id)
        
        logger.info(f"User {user.username} logged in successfully")
        
        return jsonify({
            'status': 'success',
            'message': 'Login successful',
            'data': {
                'user': user.to_dict(),
                'access_token': access_token,
                'refresh_token': refresh_token
            }
        }), 200
    
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'An error occurred during login'
        }), 500

def refresh_token():
    """Refresh access token using refresh token"""
    try:
        current_user_id = get_jwt_identity()
        
        # Find the user
        user = User.query.get(current_user_id)
        if not user:
            return jsonify({
                'status': 'error',
                'message': 'User not found'
            }), 404
        
        # Generate new access token
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'status': 'success',
            'message': 'Token refreshed',
            'data': {
                'access_token': access_token
            }
        }), 200
    
    except Exception as e:
        logger.error(f"Token refresh error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'An error occurred during token refresh'
        }), 500

# In rewear/server/auth/jwt_handler.py
# Find the admin_required decorator function and replace it with this:

from functools import wraps

def admin_required(fn):
    """Decorator to check if user is admin"""
    @wraps(fn)  # Add this line to preserve the original function's metadata
    @jwt_required()
    def wrapper(*args, **kwargs):
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or not user.is_admin():
            return jsonify({
                'status': 'error',
                'message': 'Admin access required'
            }), 403
        
        return fn(*args, **kwargs)
    
    return wrapper