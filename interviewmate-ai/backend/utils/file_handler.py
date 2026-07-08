# ============================================
# INTERVIEWMATE AI - FILE HANDLER
# ============================================

import os
import uuid
from werkzeug.utils import secure_filename
from config import Config

ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_file(file, subfolder=''):
    """Save uploaded file and return path"""
    if not file or not allowed_file(file.filename):
        raise ValueError("Invalid file")
    
    filename = secure_filename(file.filename)
    unique_filename = f"{uuid.uuid4().hex}_{filename}"
    
    upload_path = os.path.join(Config.UPLOAD_FOLDER, subfolder)
    os.makedirs(upload_path, exist_ok=True)
    
    file_path = os.path.join(upload_path, unique_filename)
    file.save(file_path)
    
    return {
        'original_name': filename,
        'saved_name': unique_filename,
        'path': file_path,
        'url': f"/uploads/{subfolder}/{unique_filename}" if subfolder else f"/uploads/{unique_filename}"
    }

def delete_file(file_path):
    """Delete file from disk"""
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            return True
    except Exception as e:
        print(f"Failed to delete file: {str(e)}")
    return False

def get_file_size(file_path):
    """Get file size in bytes"""
    if os.path.exists(file_path):
        return os.path.getsize(file_path)
    return 0