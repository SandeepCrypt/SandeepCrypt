# ============================================
# INTERVIEWMATE AI - AUTH ROUTES
# ============================================

from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity, get_jwt
)
from models import db, User
from services.auth_service import AuthService
from utils.validators import validate_registration, validate_login

auth_bp = Blueprint('auth', __name__)
auth_service = AuthService()

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user."""
    data = request.get_json()
    
    # Validate input
    errors = validate_registration(data)
    if errors:
        return jsonify({'success': False, 'errors': errors}), 400
    
    # Check if email exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'success': False, 'message': 'Email already registered'}), 409
    
    # Create user
    try:
        user = auth_service.create_user(data)
        
        # Generate tokens
        access_token = create_access_token(identity=user.user_id)
        refresh_token = create_refresh_token(identity=user.user_id)
        
        return jsonify({
            'success': True,
            'message': 'Registration successful',
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Authenticate user and return tokens."""
    data = request.get_json()
    
    errors = validate_login(data)
    if errors:
        return jsonify({'success': False, 'errors': errors}), 400
    
    user = auth_service.authenticate_user(data['email'], data['password'])
    
    if not user:
        return jsonify({'success': False, 'message': 'Invalid credentials'}), 401
    
    access_token = create_access_token(identity=user.user_id)
    refresh_token = create_refresh_token(identity=user.user_id)
    
    return jsonify({
        'success': True,
        'access_token': access_token,
        'refresh_token': refresh_token,
        'user': user.to_dict()
    })

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'success': False, 'message': 'User not found'}), 404
    
    new_token = create_access_token(identity=current_user_id)
    
    return jsonify({
        'success': True,
        'access_token': new_token,
        'user': user.to_dict()
    })

@auth_bp.route('/verify', methods=['GET'])
@jwt_required()
def verify():
    """Verify token validity."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'success': False, 'message': 'User not found'}), 404
    
    return jsonify({
        'success': True,
        'user': user.to_dict()
    })

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """Logout user (revoke token)."""
    jti = get_jwt()['jti']
    auth_service.revoke_token(jti)
    return jsonify({'success': True, 'message': 'Successfully logged out'})

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get current user profile."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    return jsonify({'success': True, 'user': user.to_dict()})

@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update user profile."""
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    try:
        user = auth_service.update_user(current_user_id, data)
        return jsonify({'success': True, 'user': user.to_dict()})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@auth_bp.route('/password', methods=['PUT'])
@jwt_required()
def update_password():
    """Update user password."""
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    success = auth_service.change_password(
        current_user_id,
        data.get('current_password'),
        data.get('new_password')
    )
    
    if not success:
        return jsonify({'success': False, 'message': 'Current password is incorrect'}), 400
    
    return jsonify({'success': True, 'message': 'Password updated successfully'})

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    """Send password reset email."""
    data = request.get_json()
    email = data.get('email')
    
    auth_service.send_reset_email(email)
    return jsonify({'success': True, 'message': 'Reset email sent if account exists'})

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    """Reset password with token."""
    data = request.get_json()
    result = auth_service.reset_password(data.get('token'), data.get('new_password'))
    
    if not result:
        return jsonify({'success': False, 'message': 'Invalid or expired token'}), 400
    
    return jsonify({'success': True, 'message': 'Password reset successful'})