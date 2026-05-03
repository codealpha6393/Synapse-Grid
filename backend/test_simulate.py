import sys
from fastapi.testclient import TestClient
from main import app
client = TestClient(app)
response = client.post(
    '/api/v1/simulate',
    json={
        'domain': 'finance',
        'title': 'Test finance',
        'description': 'test test test test',
        'timeframe_years': 3,
        'scale': 'national',
        'budget_billion_usd': 5.0,
        'domain_params': {
            'interest_rate_pct': 5.0
        }
    }
)
print("STATUS_CODE:", response.status_code)
print("BODY:", response.json())
