import uuid
from datetime import datetime
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from sqlalchemy.dialects.mysql import CHAR
from config.database import db

# Password hasher
ph = PasswordHasher()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(CHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    gender = db.Column(db.String(20))
    profile_image = db.Column(db.String(255))
    city = db.Column(db.String(100))
    address = db.Column(db.String(255))
    bio = db.Column(db.Text)
    swap_preference = db.Column(db.String(20), default='both')
    status = db.Column(db.String(20), default='pending')  # pending, approved, rejected
    role = db.Column(db.String(20), default='user')  # user, admin
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    items = db.relationship('Item', backref='owner', lazy=True)
    
    def __init__(self, username, email, password, gender=None):
        self.username = username
        self.email = email
        self.password_hash = ph.hash(password)
        self.gender = gender
    
    def verify_password(self, password):
        try:
            return ph.verify(self.password_hash, password)
        except VerifyMismatchError:
            return False
    
    def is_admin(self):
        return self.role == 'admin'
    
    def is_approved(self):
        return self.status == 'approved'
    
    def to_dict(self):
        """Convert user object to dictionary"""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'gender': self.gender,
            'profile_image': self.profile_image,
            'city': self.city,
            'address': self.address,
            'bio': self.bio,
            'swap_preference': self.swap_preference,
            'status': self.status,
            'role': self.role,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def __repr__(self):
        return f"<User {self.username}>"