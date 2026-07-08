# ============================================
# INTERVIEWMATE AI - UPLOAD ROUTES
# ============================================

from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from services.resume_parser_service import ResumeParserService
import os

upload_bp = Blueprint('upload', __name__)
resume_parser = ResumeParserService()

ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@upload_bp.route('/resume', methods=['POST'])
@jwt_required()
def upload_resume():
    """Upload and parse resume."""
    if 'file' not in request.files:
        return jsonify({'success': False, 'message': 'No file provided'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'success': False, 'message': 'No file selected'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'success': False, 'message': 'Invalid file type'}), 400
    
    try:
        filename = secure_filename(file.filename)
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Parse resume
        parsed_data = resume_parser.parse(filepath)
        
        return jsonify({
            'success': True,
            'filename': filename,
            'parsed': parsed_data
        })
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@upload_bp.route('/avatar', methods=['POST'])
@jwt_required()
def upload_avatar():
    """Upload profile picture."""
    user_id = get_jwt_identity()
    
    if 'file' not in request.files:
        return jsonify({'success': False, 'message': 'No file provided'}), 400
    
    file = request.files['file']
    
    if not allowed_file(file.filename):
        return jsonify({'success': False, 'message': 'Invalid file type'}), 400
    
    try:
        filename = f"avatar_{user_id}_{secure_filename(file.filename)}"
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Update user avatar
        from models import User
        user = User.query.get(user_id)
        user.avatar_path = filepath
        from models import db
        db.session.commit()
        
        return jsonify({
            'success': True,
            'avatar_url': filepath
        })
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@upload_bp.route('/status/<upload_id>', methods=['GET'])
@jwt_required()
def get_upload_status(upload_id):
    """Get upload processing status."""
    # Implementation for checking upload status
    return jsonify({'success': True, 'status': 'completed'})

@upload_bp.route('/file', methods=['DELETE'])
@jwt_required()
def delete_file():
    """Delete uploaded file."""
    data = request.get_json()
    filepath = data.get('path')
    
    if filepath and os.path.exists(filepath):
        os.remove(filepath)
        return jsonify({'success': True, 'message': 'File deleted'})
    
    return jsonify({'success': False, 'message': 'File not found'}), 404