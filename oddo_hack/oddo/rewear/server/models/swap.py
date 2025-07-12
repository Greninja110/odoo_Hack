import uuid
from datetime import datetime
from sqlalchemy.dialects.mysql import CHAR
from config.database import db

class Swap(db.Model):
    __tablename__ = 'swaps'
    
    id = db.Column(CHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    requester_id = db.Column(CHAR(36), db.ForeignKey('users.id'), nullable=False)
    provider_id = db.Column(CHAR(36), db.ForeignKey('users.id'), nullable=False)
    requester_item_id = db.Column(CHAR(36), db.ForeignKey('items.id'), nullable=False)
    provider_item_id = db.Column(CHAR(36), db.ForeignKey('items.id'), nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending, accepted, rejected, completed, cancelled
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    requester = db.relationship('User', foreign_keys=[requester_id], backref='requested_swaps')
    provider = db.relationship('User', foreign_keys=[provider_id], backref='provided_swaps')
    requester_item = db.relationship('Item', foreign_keys=[requester_item_id])
    provider_item = db.relationship('Item', foreign_keys=[provider_item_id])
    
    def to_dict(self):
        """Convert swap object to dictionary"""
        return {
            'id': self.id,
            'requester_id': self.requester_id,
            'provider_id': self.provider_id,
            'requester_item_id': self.requester_item_id,
            'provider_item_id': self.provider_item_id,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'requester': {
                'id': self.requester.id,
                'username': self.requester.username,
                'profile_image': self.requester.profile_image
            },
            'provider': {
                'id': self.provider.id,
                'username': self.provider.username,
                'profile_image': self.provider.profile_image
            },
            'requester_item': {
                'id': self.requester_item.id,
                'title': self.requester_item.title,
                'image': self.requester_item.images[0].file_path if self.requester_item.images else None
            },
            'provider_item': {
                'id': self.provider_item.id,
                'title': self.provider_item.title,
                'image': self.provider_item.images[0].file_path if self.provider_item.images else None
            }
        }
    
    def __repr__(self):
        return f"<Swap {self.id}>"