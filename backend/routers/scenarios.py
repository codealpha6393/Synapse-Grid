from fastapi import APIRouter
import json, os

router = APIRouter()

SAMPLE_SCENARIOS_PATH = os.path.join(os.path.dirname(__file__), "../data/sample_scenarios.json")

@router.get("/scenarios/suggestions")
async def get_scenario_suggestions():
    with open(SAMPLE_SCENARIOS_PATH) as f:
        return json.load(f)
