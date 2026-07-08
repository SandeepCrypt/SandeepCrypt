# ============================================
# INTERVIEWMATE AI - VALIDATION UTILITIES
# ============================================

import re
from typing import Tuple, Optional

EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')

def validate_email(email: str) -> Tuple[bool, Optional[str]]:
    """Validate email format"""
    if not email or not email.strip():
        return False, "Email is required"
    if not EMAIL_REGEX.match(email):
        return False, "Invalid email format"
    return True, None

def validate_password(password: str) -> Tuple[bool, Optional[str]]:
    """Validate password strength"""
    if not password:
        return False, "Password is required"
    if len(password) < 8:
        return False, "Password must be at least 8 characters"
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    if not re.search(r'\d', password):
        return False, "Password must contain at least one number"
    return True, None

def validate_file(file, allowed_extensions=None, max_size_mb=5):
    """Validate uploaded file"""
    if not file:
        return False, "No file provided"
    
    if allowed_extensions:
        ext = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else ''
        if ext not in allowed_extensions:
            return False, f"File type not allowed. Allowed: {', '.join(allowed_extensions)}"
    
    file.seek(0, 2)  # Seek to end
    size = file.tell()
    file.seek(0)  # Reset
    
    if size > max_size_mb * 1024 * 1024:
        return False, f"File size exceeds {max_size_mb}MB limit"
    
    return True, None

def validate_required_fields(data: dict, required_fields: list) -> Tuple[bool, Optional[str]]:
    """Validate that all required fields are present"""
    missing = [field for field in required_fields if field not in data or data[field] is None]
    if missing:
        return False, f"Missing required fields: {', '.join(missing)}"
    return True, None