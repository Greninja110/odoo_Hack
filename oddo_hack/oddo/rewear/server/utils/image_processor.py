# File: rewear/server/utils/image_processor.py

import os
import json
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

class ImageProcessor:
    """
    Class to process images from a structured directory
    and generate metadata for use in the web application.
    """
    
    def __init__(self, base_directory):
        """
        Initialize with the base directory containing the image folder structure.
        
        Args:
            base_directory (str): Path to the base directory (e.g., "Bewakoof/")
        """
        self.base_directory = Path(base_directory)
        self.image_data = {}
        self.supported_extensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
        
        # Ensure the directory exists
        if not os.path.exists(self.base_directory):
            logger.error(f"Base directory not found: {self.base_directory}")
            raise FileNotFoundError(f"Base directory not found: {self.base_directory}")
    
    def scan_directory(self):
        """
        Scan the directory structure and build metadata for all images.
        
        Returns:
            dict: Hierarchical structure of categories and images
        """
        try:
            logger.info(f"Scanning directory: {self.base_directory}")
            
            # Initialize the data structure
            self.image_data = {}
            
            # Walk through the directory structure
            for root, dirs, files in os.walk(self.base_directory):
                # Skip hidden directories
                dirs[:] = [d for d in dirs if not d.startswith('.')]
                
                # Skip if no image files in this directory
                image_files = [f for f in files if self._is_image_file(f)]
                if not image_files:
                    continue
                
                # Get relative path from base directory
                rel_path = os.path.relpath(root, self.base_directory)
                if rel_path == '.':
                    continue  # Skip the base directory itself
                
                # Parse the path to create category hierarchy
                path_parts = rel_path.split(os.sep)
                
                # Build the nested dictionary structure
                self._add_to_structure(path_parts, image_files, root)
            
            logger.info(f"Scan completed. Found {self._count_images(self.image_data)} images.")
            return self.image_data
            
        except Exception as e:
            logger.error(f"Error scanning directory: {str(e)}")
            raise
    
    def _add_to_structure(self, path_parts, image_files, full_path):
        """
        Add images to the hierarchical structure.
        
        Args:
            path_parts (list): Parts of the path representing categories
            image_files (list): List of image filenames
            full_path (str): Full path to the directory containing images
        """
        # Start at the root of the structure
        current = self.image_data
        
        # Build the nested structure
        for i, part in enumerate(path_parts):
            if part not in current:
                current[part] = {}
            
            current = current[part]
        
        # Add images to the current level
        current['_images'] = []
        for image in image_files:
            if self._is_image_file(image):
                image_url = os.path.join(full_path, image).replace('\\', '/')
                
                # Extract metadata from filename
                metadata = self._extract_metadata_from_filename(image)
                
                current['_images'].append({
                    'filename': image,
                    'path': image_url,
                    'url': f'/uploads/{os.path.relpath(image_url, self.base_directory).replace("\\", "/")}',
                    'metadata': metadata
                })
    
    def _is_image_file(self, filename):
        """
        Check if a file is an image based on its extension.
        
        Args:
            filename (str): Name of the file to check
            
        Returns:
            bool: True if the file is an image, False otherwise
        """
        _, ext = os.path.splitext(filename.lower())
        return ext in self.supported_extensions
    
    def _extract_metadata_from_filename(self, filename):
        """
        Extract structured metadata from the filename.
        For example: "men-s-black-oversized-t-shirt-555522-1707221351-1.webp"
        might extract gender, color, fit, type, etc.
        
        Args:
            filename (str): Name of the image file
            
        Returns:
            dict: Extracted metadata
        """
        # Remove extension
        name = os.path.splitext(filename)[0]
        
        # Split by hyphens
        parts = name.split('-')
        
        metadata = {
            'original_name': filename
        }
        
        # Try to extract common patterns
        try:
            # Check if it starts with gender
            if parts[0].lower() in ['men', 'women']:
                metadata['gender'] = parts[0].lower()
            
            # Look for colors (this is a simple approach, could be improved)
            colors = ['black', 'white', 'blue', 'red', 'green', 'yellow', 'purple', 
                    'brown', 'grey', 'gray', 'pink', 'orange', 'beige', 'tan', 'navy']
            
            for part in parts:
                if part.lower() in colors:
                    metadata['color'] = part.lower()
                    break
            
            # Look for fit types
            fits = ['oversized', 'slim', 'regular', 'relaxed', 'loose', 'super loose']
            for i, part in enumerate(parts):
                if part.lower() in fits:
                    metadata['fit'] = part.lower()
                    # If "fit" is followed by "fit", combine them
                    if i+1 < len(parts) and parts[i+1].lower() == 'fit':
                        metadata['fit'] = f"{part.lower()} fit"
                    break
            
            # Extract product type
            product_types = ['t-shirt', 'shirt', 'joggers', 'pants', 'jeans', 'cargo', 
                           'boxer', 'watch', 'sunglasses', 'shoes', 'backpack']
            
            for i, part in enumerate(parts):
                # Check if this part combined with the next forms a product type
                if i < len(parts) - 1:
                    combined = f"{part.lower()}-{parts[i+1].lower()}"
                    if combined in product_types:
                        metadata['product_type'] = combined
                        break
                
                # Check single part
                if part.lower() in product_types:
                    metadata['product_type'] = part.lower()
                    break
        
        except Exception as e:
            logger.warning(f"Error extracting metadata from filename {filename}: {str(e)}")
        
        return metadata
    
    def _count_images(self, data):
        """
        Count the total number of images in the data structure.
        
        Args:
            data (dict): The hierarchical data structure
            
        Returns:
            int: Total number of images
        """
        count = 0
        for key, value in data.items():
            if key == '_images':
                count += len(value)
            elif isinstance(value, dict):
                count += self._count_images(value)
        return count
    
    def export_to_json(self, output_file):
        """
        Export the image data to a JSON file.
        
        Args:
            output_file (str): Path to the output JSON file
        """
        try:
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(self.image_data, f, indent=2)
            logger.info(f"Data exported to {output_file}")
            return True
        except Exception as e:
            logger.error(f"Error exporting data to JSON: {str(e)}")
            return False
    
    def get_categories(self):
        """
        Get a flat list of all categories.
        
        Returns:
            list: List of category dictionaries with path and name
        """
        categories = []
        self._extract_categories(self.image_data, [], categories)
        return categories
    
    def _extract_categories(self, data, current_path, result):
        """
        Extract categories recursively.
        
        Args:
            data (dict): Current level of the hierarchical data
            current_path (list): Current path in the hierarchy
            result (list): List to store the results
        """
        for key, value in data.items():
            if key != '_images' and isinstance(value, dict):
                new_path = current_path + [key]
                result.append({
                    'path': '/'.join(new_path),
                    'name': key,
                    'parent': '/'.join(current_path) if current_path else None
                })
                self._extract_categories(value, new_path, result)
    
    def get_images_by_category(self, category_path):
        """
        Get images for a specific category path.
        
        Args:
            category_path (str): Path to the category, e.g. "MEN'S/TOPWARE/TSHIRT/Oversized"
            
        Returns:
            list: List of image dictionaries in the category
        """
        if not category_path:
            return []
        
        # Split the path into parts
        parts = category_path.split('/')
        
        # Navigate to the specified category
        current = self.image_data
        for part in parts:
            if part in current:
                current = current[part]
            else:
                return []  # Category not found
        
        # Return images if available
        return current.get('_images', [])