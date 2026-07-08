# ============================================
# INTERVIEWMATE AI - MODELS INIT
# ============================================

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Import all models
from .user import User
from .job_category import JobCategory
from .company import Company
from .question import Question
from .star_model_answer import StarModelAnswer
from .interview_session import InterviewSession
from .response import Response
from .confidence_report import ConfidenceReport
from .progress_tracking import ProgressTracking

__all__ = [
    'db', 'User', 'JobCategory', 'Company', 'Question',
    'StarModelAnswer', 'InterviewSession', 'Response',
    'ConfidenceReport', 'ProgressTracking'
]