import uuid
import math
from typing import List
from models.scenario import ScenarioInput
from models.result import SimulationResult, MetricValue, TimeSeriesPoint
from engine.constants import *

class FinanceEngine:
    
    def simulate(self, scenario: ScenarioInput) -> SimulationResult:
        scale_mult = SCALE_MULTIPLIERS.get(scenario.scale, 1.0)
        
        # Finance specifics
        target_rate = scenario.domain_params.get("interest_rate_pct", 5.0)
        tax_change = scenario.domain_params.get("corporate_tax_pct", 0.0)
        stimulus = scenario.domain_params.get("stimulus_billion", 0.0)
        
        T = scenario.timeframe_years
        budget = scenario.budget_billion_usd
        
        # 1. GDP Growth
        base_gdp = 2.0
        gdp_growth = base_gdp - (target_rate * 0.15) - (tax_change * 0.08) + (stimulus * 0.05 * scale_mult)
        
        # 2. Inflation
        base_inflation = 3.5
        inflation = base_inflation - (target_rate * 0.25) + (stimulus * 0.1 * scale_mult)
        
        # 3. Unemployment
        base_unemp = 4.0
        unemployment = base_unemp + (target_rate * 0.1) + (tax_change * 0.05) - (stimulus * 0.02 * scale_mult)
        
        # 4. Govt Spending
        govt_spend = budget + stimulus * scale_mult
        
        # 5. Market Confidence
        market_conf = 100 - (abs(tax_change) * 2) - max(0, inflation - 2) * 5 + min(10, gdp_growth * 5)
        market_conf = min(max(market_conf, 0), 100)
        
        # 6. Default Risk
        default_risk = 20 + (target_rate * 3) + max(0, unemployment - 4) * 5
        default_risk = min(max(default_risk, 0), 100)
        
        # Risk Score
        risk_score = min(max((inflation * 5) + (unemployment * 4) + (default_risk * 0.4), 0), 100)
        risk_level = self._risk_category(risk_score)
        
        # Confidence
        confidence = max(BASE_CONFIDENCE - (T * 3) - (abs(stimulus) * 0.2), 30.0)
        
        # Time Series
        primary_ts = self._time_series(base_gdp, gdp_growth, T)
        sec_ts = self._time_series(base_inflation, inflation, T)
        spend_ts = self._time_series(budget, govt_spend, T)
        
        # Narrative
        narrative = f"Simulating a {target_rate}% target interest rate with ${stimulus}B stimulus over {T} years. GDP growth adjusts to {gdp_growth:.1f}% while inflation hits {inflation:.1f}%. Market confidence sits at {market_conf:.0f}/100."
        
        return SimulationResult(
            scenario_id=str(uuid.uuid4())[:8],
            domain="finance",
            title=scenario.title,
            metrics=[
                MetricValue(key="gdp", value=round(gdp_growth, 1), unit="%", label="GDP Growth", trend="positive" if gdp_growth >= 2 else "negative"),
                MetricValue(key="inf", value=round(inflation, 1), unit="%", label="Inflation Rate", trend="warning" if inflation > 4 else "positive"),
                MetricValue(key="unemp", value=round(unemployment, 1), unit="%", label="Unemployment", trend="warning" if unemployment > 5 else "positive"),
                MetricValue(key="spend", value=round(govt_spend, 2), unit="$B", label="Govt. Spending", trend="neutral"),
                MetricValue(key="conf", value=round(market_conf, 0), unit="/100", label="Market Confidence", trend="positive" if market_conf > 60 else "negative"),
                MetricValue(key="def", value=round(default_risk, 0), unit="/100", label="Default Risk Indx", trend="negative" if default_risk > 40 else "positive"),
            ],
            primary_timeseries=primary_ts,
            secondary_timeseries=sec_ts,
            spending_over_time=spend_ts,
            risk_level=risk_level,
            risk_score=round(risk_score, 1),
            confidence_pct=round(confidence, 1),
            ai_explanation=narrative,
            ai_recommendation=self._get_recommendation(risk_level, gdp_growth),
            key_risks=["Inflationary spirals from excessive stimulus", "Corporate defaults from high rates"] if risk_score > 50 else ["Normal market volatility"],
            key_benefits=[f"GDP stabilized near {gdp_growth:.1f}%", f"Inflation anchored at {inflation:.1f}%"]
        )

    def _risk_category(self, score: float) -> str:
        if score < 35: return "low"
        if score < 60: return "medium"
        if score < 80: return "high"
        return "critical"
        
    def _time_series(self, start: float, end: float, years: int) -> List[TimeSeriesPoint]:
        return [TimeSeriesPoint(year=2024 + i, value=round(start + (end - start) * (i / years if years else 1), 2)) for i in range(years + 1)]

    def _get_recommendation(self, risk: str, gdp: float) -> str:
        if risk == "low": return "✅ PROCEED — strong macro stability."
        if risk == "medium": return "⚡ PROCEED CAUTIOUSLY — monitor inflation."
        return "⚠️ AVERT — unacceptable unemployment or inflation risk."
