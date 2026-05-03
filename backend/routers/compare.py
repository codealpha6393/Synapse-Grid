from fastapi import APIRouter, HTTPException
from models.scenario import CompareRequest
from models.result import ComparisonResult
from engine.climate_engine import ClimateEngine
from engine.finance_engine import FinanceEngine
from engine.health_engine import HealthEngine
from engine.urban_engine import UrbanEngine

router = APIRouter()
engines = {
    "climate": ClimateEngine(),
    "finance": FinanceEngine(),
    "healthcare": HealthEngine(),
    "urban": UrbanEngine()
}

@router.post("/compare", response_model=ComparisonResult)
async def compare_scenarios(request: CompareRequest):
    domain = request.scenario_a.domain
    if request.scenario_b.domain != domain:
        raise HTTPException(400, "Can only compare scenarios within the same domain")
        
    engine = engines.get(domain)
    if not engine:
        raise HTTPException(422, f"Domain {domain} logic not implemented.")
        
    result_a = engine.simulate(request.scenario_a)
    result_b = engine.simulate(request.scenario_b)
    
    # Generic scoring based on risk
    score_a = -result_a.risk_score
    score_b = -result_b.risk_score
    
    recommended = "a" if score_a >= score_b else "b"
    winner = result_a if recommended == "a" else result_b
    loser = result_b if recommended == "a" else result_a
    
    # Calculate delta dynamically from metrics
    delta = {}
    for ma, mb in zip(result_a.metrics, result_b.metrics):
        delta[f"{ma.key}_delta"] = round(ma.value - mb.value, 2)
    delta["risk_delta"] = round(result_a.risk_score - result_b.risk_score, 1)
    
    reason = (
        f"Scenario {recommended.upper()} achieves better outcome balance: "
        f"lower systemic risk ({winner.risk_score:.1f} vs {loser.risk_score:.1f}) "
        f"and superior or comparable primary metrics."
    )
    
    return ComparisonResult(
        scenario_a=result_a,
        scenario_b=result_b,
        recommended=recommended,
        recommendation_reason=reason,
        delta_metrics=delta
    )
