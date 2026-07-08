# ============================================
# INTERVIEWMATE AI - ROUTES INIT
# ============================================

from .auth_routes import auth_bp
from .user_routes import user_bp
from .interview_routes import interview_bp
from .question_routes import question_bp
from .category_routes import category_bp
from .company_routes import company_bp
from .report_routes import report_bp
from .progress_routes import progress_bp
from .upload_routes import upload_bp
from .pdf_routes import pdf_bp

def register_routes(app):
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(user_bp, url_prefix='/api/user')
    app.register_blueprint(interview_bp, url_prefix='/api/interview')
    app.register_blueprint(question_bp, url_prefix='/api/questions')
    app.register_blueprint(category_bp, url_prefix='/api/categories')
    app.register_blueprint(company_bp, url_prefix='/api/companies')
    app.register_blueprint(report_bp, url_prefix='/api/reports')
    app.register_blueprint(progress_bp, url_prefix='/api/progress')
    app.register_blueprint(upload_bp, url_prefix='/api/upload')
    app.register_blueprint(pdf_bp, url_prefix='/api/pdf')