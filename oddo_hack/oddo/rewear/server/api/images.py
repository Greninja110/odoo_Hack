# File: rewear/server/api/images.py

from flask import Blueprint, jsonify, request, current_app
import os
from utils.image_processor import ImageProcessor
import logging

logger = logging.getLogger(__name__)

images_bp = Blueprint('images', __name__)

@images_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get all image categories"""
    try:
        # Initialize the image processor with the uploads directory
        images_dir = os.path.join(current_app.config['UPLOAD_FOLDER'], 'Bewakoof')
        processor = ImageProcessor(images_dir)
        
        # Scan the directory
        processor.scan_directory()
        
        # Get categories
        categories = processor.get_categories()
        
        return jsonify({
            'status': 'success',
            'data': {
                'categories': categories
            }
        }), 200
    
    except Exception as e:
        logger.error(f"Error getting image categories: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Failed to retrieve image categories'
        }), 500

@images_bp.route('/category/<path:category_path>', methods=['GET'])
def get_images_by_category(category_path):
    """Get images for a specific category"""
    try:
        # Initialize the image processor with the uploads directory
        images_dir = os.path.join(current_app.config['UPLOAD_FOLDER'], 'Bewakoof')
        processor = ImageProcessor(images_dir)
        
        # Scan the directory
        processor.scan_directory()
        
        # Get images for the specified category
        images = processor.get_images_by_category(category_path)
        
        return jsonify({
            'status': 'success',
            'data': {
                'category': category_path,
                'images': images
            }
        }), 200
    
    except Exception as e:
        logger.error(f"Error getting images for category {category_path}: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f'Failed to retrieve images for category {category_path}'
        }), 500

@images_bp.route('/scan', methods=['POST'])
def scan_images():
    """Scan the image directory and export the structure to a JSON file"""
    try:
        # Initialize the image processor with the uploads directory
        images_dir = os.path.join(current_app.config['UPLOAD_FOLDER'], 'Bewakoof')
        processor = ImageProcessor(images_dir)
        
        # Scan the directory
        data = processor.scan_directory()
        
        # Export to JSON file
        json_path = os.path.join(current_app.config['UPLOAD_FOLDER'], 'image_data.json')
        processor.export_to_json(json_path)
        
        return jsonify({
            'status': 'success',
            'message': 'Image directories scanned successfully',
            'data': {
                'json_path': json_path,
                'categories': len(processor.get_categories()),
                'total_images': processor._count_images(data)
            }
        }), 200
    
    except Exception as e:
        logger.error(f"Error scanning image directories: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Failed to scan image directories'
        }), 500