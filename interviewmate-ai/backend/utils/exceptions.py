# ============================================
# INTERVIEWMATE AI - CUSTOM EXCEPTIONS
# ============================================

class APIError(Exception):
    """Base API error"""
    def __init__(self, message, status_code=500, payload=None):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.payload = payload
    
    def to_dict(self):
        rv = dict(self.payload or ())
        rv['success'] = False
        rv['message'] = self.message
        return rv

class ValidationError(APIError):
    """Validation error"""
    def __init__(self, message, payload=None):
        super().__init__(message, status_code=400, payload=payload)

class AuthenticationError(APIError):
    """Authentication error"""
    def __init__(self, message="Authentication failed", payload=None):
        super().__init__(message, status_code=401, payload=payload)

class NotFoundError(APIError):
    """Resource not found error"""
    def __init__(self, message="Resource not found", payload=None):
        super().__init__(message, status_code=404, payload=payload)

class ConflictError(APIError):
    """Conflict error"""
    def __init__(self, message="Resource conflict", payload=None):
        super().__init__(message, status_code=409, payload=payload)