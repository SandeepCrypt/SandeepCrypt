# InterviewMate AI - Deployment Guide

## Prerequisites
- Docker & Docker Compose
- Domain name (for production)
- SSL certificates

## Quick Start

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your values
3. Run: `docker-compose up -d`

## Manual Deployment

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python run.py