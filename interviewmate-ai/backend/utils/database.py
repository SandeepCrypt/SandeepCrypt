# ============================================
# INTERVIEWMATE AI - DATABASE CONFIGURATION
# ============================================

from flask_sqlalchemy import SQLAlchemy
from pymongo import MongoClient
from config import Config

db = SQLAlchemy()

# MongoDB client (for unstructured data like emotion frames)
mongo_client = None
mongo_db = None

def init_db(app):
    """Initialize SQL database and MongoDB connections"""
    db.init_app(app)
    
    # Create tables
    with app.app_context():
        db.create_all()
    
    # Initialize MongoDB
    global mongo_client, mongo_db
    mongo_client = MongoClient(Config.MONGODB_URI)
    mongo_db = mongo_client.get_database()

def get_mongo_db():
    """Get MongoDB database instance"""
    return mongo_db

def get_mongo_collection(collection_name):
    """Get MongoDB collection"""
    if mongo_db is None:
        raise RuntimeError("MongoDB not initialized")
    return mongo_db[collection_name]