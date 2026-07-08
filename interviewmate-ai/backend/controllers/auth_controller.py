# ============================================
# INTERVIEWMATE AI - AUTH CONTROLLER
# ============================================

from models import db, User
from flask_jwt_extended import create_access_token, create_refresh_token
import secrets
from datetime import datetime, timedelta

class AuthController:
    """Handle authentication logic."""
    
    @staticmethod
    def register_user(data):
        """Register new user."""
        user = User(
            name=data['name'],
            email=data['email'],
            college=data.get('college'),
            branch=data.get('branch'),
            year=data.get('year')
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        return user
    
    @staticmethod
    def authenticate(email, password):
        """Authenticate user credentials."""
        user = User.query.filter_by(email=email).first()
        
        if user and user.check_password(password):
            return user
        return None
    
    @staticmethod
    def generate_tokens(user_id):
        """Generate JWT tokens."""
        access_token = create_access_token(identity=user_id)
        refresh_token = create_refresh_token(identity=user_id)
        return access_token, refresh_token
    
    @staticmethod
    def create_password_reset_token(email):
        """Create password reset token."""
        user = User.query.filter_by(email=email).first()
        if not user:
            return None
        
        token = secrets.token_urlsafe(32)
        # Store token with expiration
        # Implementation depends on your token storage (Redis, DB, etc.)
        return token
    
    @staticmethod
    def verify_reset_token(token):
        """Verify reset token."""
        # Implementation
        return True