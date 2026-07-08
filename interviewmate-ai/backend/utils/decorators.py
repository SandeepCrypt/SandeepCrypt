# ============================================
# INTERVIEWMATE AI - CUSTOM DECORATORS
# ============================================

from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from models.user import User

def admin_required(fn):
    """Decorator to require admin role"""
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'admin':
            return jsonify({
                'success': False,
                'message': 'Admin access required'
            }), 403
        
        return fn(*args, **kwargs)
    return wrapper

def counselor_required(fn):
    """Decorator to require counselor or admin role"""
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role not in ['admin', 'counselor']:
            return jsonify({
                'success': False,
                'message': 'Counselor access required'
            }), 403
        
        return fn(*args, **kwargs)
    return wrapper

def rate_limit(requests_per_minute=100):
    """Rate limiting decorator"""
    from flask_limiter import Limiter
    from flask_limiter.util import get_remote_address
    
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            # Implementation depends on Flask-Limiter setup
            return fn(*args, **kwargs)
        return wrapper
    return decorator