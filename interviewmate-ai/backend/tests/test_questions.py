# ============================================
# INTERVIEWMATE AI - QUESTION TESTS
# ============================================

import pytest

def test_get_categories(client):
    response = client.get('/api/categories')
    assert response.status_code == 200

def test_get_companies(client):
    response = client.get('/api/companies')
    assert response.status_code == 200