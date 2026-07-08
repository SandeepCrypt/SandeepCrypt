# ============================================
# INTERVIEWMATE AI - FLASK APPLICATION
# ============================================

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from config import Config
from models import db
from routes import register_routes
from utils.exceptions import register_error_handlers
import os

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    db.init_app(app)
    JWTManager(app)
    Migrate(app, db)
    CORS(app, resources={
        r"/api/*": {
            "origins": app.config['CORS_ORIGINS'],
            "supports_credentials": True
        }
    })
    
    # Register blueprints
    register_routes(app)
    
    # Register error handlers
    register_error_handlers(app)
    
    # Create upload directories
    with app.app_context():
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
        os.makedirs(app.config['REPORT_FOLDER'], exist_ok=True)
        os.makedirs(app.config['AUDIO_FOLDER'], exist_ok=True)
    
    return app

app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)