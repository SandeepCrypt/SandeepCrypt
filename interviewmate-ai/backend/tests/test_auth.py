# ============================================
# INTERVIEWMATE AI - AUTH TESTS
# ============================================

import pytest
import json

def test_register(client):
    response = client.post('/api/auth/register', json={
        'name': 'Test User',
        'email': 'test@example.com',
        'password': 'TestPass123!',
        'college': 'Test College',
        'branch': 'CS',
        'year': 2024
    })
    assert response.status_code == 201
    data = json.loads(response.data)
    assert 'access_token' in data

def test_login(client):
    # First register
    client.post('/api/auth/register', json={
        'name': 'Test User',
        'email': 'test@example.com',
        'password': 'TestPass123!',
        'college': 'Test College',
        'branch': 'CS',
        'year': 2024
    })
    
    # Then login
    response = client.post('/api/auth/login', json={
        'email': 'test@example.com',
        'password': 'TestPass123!'
    })
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'access_token' in data

def test_invalid_login(client):
    response = client.post('/api/auth/login', json={
        'email': 'wrong@example.com',
        'password': 'wrongpass'
    })
    assert response.status_code == 401