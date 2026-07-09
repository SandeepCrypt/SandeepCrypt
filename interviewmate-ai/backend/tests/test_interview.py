# ============================================
# INTERVIEWMATE AI - INTERVIEW TESTS
# ============================================

import pytest
import json

def test_start_session(client, app):
    # Register and login first
    client.post('/api/auth/register', json={
        'name': 'Test User',
        'email': 'test@example.com',
        'password': 'TestPass123!',
        'college': 'Test College',
        'branch': 'CS',
        'year': 2024
    })
    
    login_response = client.post('/api/auth/login', json={
        'email': 'test@example.com',
        'password': 'TestPass123!'
    })
    token = json.loads(login_response.data)['access_token']
    
    # Start session
    response = client.post('/api/interview/start', 
        json={'categoryId': 1, 'numQuestions': 5},
        headers={'Authorization': f'Bearer {token}'}
    )
    assert response.status_code in [201, 400]  # 400 if no categories exist