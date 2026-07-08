# ============================================
# INTERVIEWMATE AI - USER MODEL
# ============================================

from . import db
from datetime import datetime
import bcrypt

class User(db.Model):
    __tablename__ = 'users'
    
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    password_hash = db.Column(db.String(255), nullable=False)
    college = db.Column(db.String(200))
    branch = db.Column(db.String(100))
    year = db.Column(db.Integer)
    avatar_path = db.Column(db.String(255))
    role = db.Column(db.String(20), default='user')  # user, counselor, admin
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    sessions = db.relationship('InterviewSession', backref='user', lazy='dynamic')
    progress = db.relationship('ProgressTracking', backref='user', uselist=False)
    
    def set_password(self, password):
        """Hash and set password."""
        self.password_hash = bcrypt.hashpw(
            password.encode('utf-8'), 
            bcrypt.gensalt(rounds=12)
        ).decode('utf-8')
    
    def check_password(self, password):
        """Verify password."""
        return bcrypt.checkpw(
            password.encode('utf-8'),
            self.password_hash.encode('utf-8')
        )
    
    def to_dict(self):
        return {
            'user_id': self.user_id,
            'name': self.name,
            'email': self.email,
            'college': self.college,
            'branch': self.branch,
            'year': self.year,
            'avatar': self.avatar_path,
            'role': self.role,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        return f'<User {self.email}>'