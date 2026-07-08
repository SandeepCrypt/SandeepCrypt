# ============================================
# INTERVIEWMATE AI - RUN SCRIPT
# ============================================

from app import create_app
from models import db

app = create_app()

@app.cli.command()
def init_db():
    """Initialize the database."""
    db.create_all()
    print("Database initialized!")

@app.cli.command()
def seed_db():
    """Seed the database with initial data."""
    from question_bank.seed_questions import seed_all
    seed_all()
    print("Database seeded!")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)