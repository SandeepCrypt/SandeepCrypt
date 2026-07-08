# ============================================
# INTERVIEWMATE AI - EMAIL SENDER
# ============================================

from flask import render_template_string
from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer
from config import Config

mail = Mail()

def init_mail(app):
    mail.init_app(app)

def send_email(to, subject, body, html=None):
    """Send email"""
    try:
        msg = Message(
            subject=subject,
            recipients=[to],
            body=body,
            html=html
        )
        mail.send(msg)
        return True
    except Exception as e:
        print(f"Failed to send email: {str(e)}")
        return False

def generate_reset_token(email):
    """Generate password reset token"""
    serializer = URLSafeTimedSerializer(Config.SECRET_KEY)
    return serializer.dumps(email, salt='password-reset-salt')

def verify_reset_token(token, expiration=3600):
    """Verify password reset token"""
    serializer = URLSafeTimedSerializer(Config.SECRET_KEY)
    try:
        email = serializer.loads(
            token,
            salt='password-reset-salt',
            max_age=expiration
        )
        return email
    except Exception:
        return None

def send_reset_password_email(email, token):
    """Send password reset email"""
    reset_url = f"http://localhost:3000/reset-password?token={token}"
    
    html = f"""
    <h2>Password Reset Request</h2>
    <p>You requested a password reset for your InterviewMate AI account.</p>
    <p>Click the link below to reset your password:</p>
    <a href="{reset_url}" style="padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 8px;">Reset Password</a>
    <p>This link expires in 1 hour.</p>
    <p>If you didn't request this, please ignore this email.</p>
    """
    
    return send_email(
        to=email,
        subject='InterviewMate AI - Password Reset',
        body=f'Reset your password: {reset_url}',
        html=html
    )