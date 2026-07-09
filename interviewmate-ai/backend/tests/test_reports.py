# ============================================
# INTERVIEWMATE AI - REPORT TESTS
# ============================================

import pytest

def test_get_report_unauthorized(client):
    response = client.get('/api/reports/1')
    assert response.status_code == 401