# ============================================
# INTERVIEWMATE AI - AUTH SERVICE
# ============================================

from models import User, ProgressTracking
from extensions import db
from flask_jwt_extended import create_access_token, create_refresh_token
from datetime import datetime

class AuthService:
    def __init__(self):
        pass
    
    def register_user(self, data):
        required = ['name', 'email', 'password', 'college', 'branch', 'year']
        for field in required:
            if not data.get(field):
                return None, f'{field} is required'
        
        if User.query.filter_by(email=data['email'].lower()).first():
            return None, 'Email already registered'
        
        user = User(
            name=data['name'],
            email=data['email'].lower(),
            college=data['college'],
            branch=data['branch'],
            year=int(data['year']) if data['year'] else None
        )
        user.set_password(data['password'])
        
        progress = ProgressTracking(user=user)
        
        db.session.add(user)
        db.session.add(progress)
        db.session.commit()
        
        access_token = create_access_token(identity=user.user_id)
        refresh_token = create_refresh_token(identity=user.user_id)
        
        return {
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': user.to_dict()
        }, None
    
    def login_user(self, email, password):
        user = User.query.filter_by(email=email.lower()).first()
        
        if not user or not user.check_password(password):
            return None, 'Invalid email or password'
        
        if not user.is_active:
            return None, 'Account is deactivated'
        
        user.updated_at = datetime.utcnow()
        db.session.commit()
        
        access_token = create_access_token(identity=user.user_id)
        refresh_token = create_refresh_token(identity=user.user_id)
        
        return {
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': user.to_dict()
        }, None
    
    def get_user_by_id(self, user_id):
        return User.query.get(user_id)
    
    def update_user_profile(self, user_id, data):
        user = User.query.get(user_id)
        if not user:
            return None, 'User not found'
        
        allowed = ['name', 'college', 'branch', 'year', 'avatar_url']
        for field in allowed:
            if field in data:
                setattr(user, field, data[field])
        
        db.session.commit()
        return user.to_dict(), None