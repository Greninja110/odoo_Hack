import uuid
from datetime import datetime
from sqlalchemy.dialects.mysql import CHAR
from config.database import db

class Item(db.Model):
    __tablename__ = 'items'
    
    id = db.Column(CHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    size = db.Column(db.String(20), nullable=False)
    condition = db.Column(db.String(20), nullable=False)
    tags = db.Column(db.String(255))
    status = db.Column(db.String(20), default='pending')  # pending, approved, rejected, swapped, sold
    is_featured = db.Column(db.Boolean, default=False)
    owner_id = db.Column(CHAR(36), db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    images = db.relationship('ItemImage', backref='item', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self, include_owner=False):
        """Convert item object to dictionary"""
        item_dict = {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'category': self.category,
            'size': self.size,
            'condition': self.condition,
            'tags': self.tags,
            'status': self.status,
            'is_featured': self.is_featured,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'images': [image.to_dict() for image in self.images]
        }
        
        if include_owner:
            from models.user import User
            owner = User.query.get(self.owner_id)
            if owner:
                item_dict['owner'] = {
                    'id': owner.id,
                    'username': owner.username,
                    'profile_image': owner.profile_image,
                    'city': owner.city
                }
        
        return item_dict
    
    def __repr__(self):
        return f"<Item {self.title}>"


class ItemImage(db.Model):
    __tablename__ = 'item_images'
    
    id = db.Column(CHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    item_id = db.Column(CHAR(36), db.ForeignKey('items.id'), nullable=False)
    file_path = db.Column(db.String(255), nullable=False)
    is_primary = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        """Convert image object to dictionary"""
        return {
            'id': self.id,
            'file_path': self.file_path,
            'is_primary': self.is_primary,
            'created_at': self.created_at.isoformat()
        }
    
    def __repr__(self):
        return f"<ItemImage {self.id}>"