from fastapi import APIRouter, HTTPException
from models.scenario import ScenarioInput
from models.result import SimulationResult
from engine.climate_engine import ClimateEngine
from engine.finance_engine import FinanceEngine
from engine.health_engine import HealthEngine
from engine.urban_engine import UrbanEngine
from engine.ai_engine import AIEngine

router = APIRouter()
engines = {
    "climate": ClimateEngine(),
    "finance": FinanceEngine(),
    "healthcare": HealthEngine(),
    "urban": UrbanEngine()
}
ai_engine = AIEngine()

@router.post("/simulate", response_model=SimulationResult)
async def run_simulation(scenario: ScenarioInput):
    engine = engines.get(scenario.domain)
    
    if not engine:
        raise HTTPException(
            status_code=422,
            detail=f"Domain '{scenario.domain}' logic engine not implemented."
        )
    try:
        # Run standard math simulation
        result = engine.simulate(scenario)
        
        # Overlay AI Insights if enabled
        ai_data = await ai_engine.generate_insight(
            domain=scenario.domain,
            scenario_title=scenario.title,
            metrics=result.metrics,
            risk_score=result.risk_score
        )
        
        if ai_data:
            result.ai_explanation = ai_data.get("explanation", result.ai_explanation)
            result.ai_recommendation = ai_data.get("recommendation", result.ai_recommendation)
            
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
