import uuid
from typing import List
from models.scenario import ScenarioInput
from models.result import SimulationResult, MetricValue, TimeSeriesPoint
from engine.constants import *

class UrbanEngine:
    
    def simulate(self, scenario: ScenarioInput) -> SimulationResult:
        scale_mult = SCALE_MULTIPLIERS.get(scenario.scale, 1.0)
        
        # Urban specifics
        zoning = scenario.domain_params.get("housing_zoning_reform_pct", 10.0)
        transit_budget = scenario.domain_params.get("transit_budget_bn", 2.0)
        density = scenario.domain_params.get("density_limit_increase_pct", 15.0)
        
        T = scenario.timeframe_years
        budget = scenario.budget_billion_usd
        
        # 1. Housing Supply Unlocked (K)
        base_housing = 50.0
        housing = base_housing + (zoning * 2.5 * scale_mult) + (density * 1.5 * scale_mult)
        
        # 2. Transit Ridership (%)
        base_transit = 15.0
        transit = min(80.0, base_transit + (transit_budget * 2) + (density * 0.5))
        
        # 3. Traffic Congestion Drop (%)
        congestion_drop = transit * 0.8 + zoning * 0.2
        
        # 4. Air Quality Index
        aqi = max(10, 85 - (transit * 1.2) - (congestion_drop * 0.5))
        
        # 5. Gentrification Risk
        gentrification = 20 + (zoning * 1.5) + (density * 0.8) - (transit_budget * 2)
        gentrification = min(max(gentrification, 0), 100)
        
        # 6. Infrastructure Cost
        govt_spend = budget + transit_budget * scale_mult
        
        risk_score = min(max((gentrification * 0.4) + (govt_spend * 0.2), 0), 100)
        risk_level = self._risk_category(risk_score)
        
        confidence = max(BASE_CONFIDENCE - (T * 2.5), 35.0)
        
        primary_ts = self._time_series(base_housing, housing, T)
        sec_ts = self._time_series(base_transit, transit, T)
        spend_ts = self._time_series(budget, govt_spend, T)
        
        narrative = f"A {zoning}% zoning reform paired with ${transit_budget}B in transit funding and {density}% density allowance over {T} years. Urban housing supply expands by {housing:.0f}K units, shifting {transit:.1f}% of commuters to transit and dropping congestion by {congestion_drop:.1f}%."
        
        return SimulationResult(
            scenario_id=str(uuid.uuid4())[:8],
            domain="urban",
            title=scenario.title,
            metrics=[
                MetricValue(key="housing", value=round(housing, 0), unit="K units", label="Housing Unlocked", trend="positive"),
                MetricValue(key="transit", value=round(transit, 1), unit="%", label="Transit Ridership", trend="positive"),
                MetricValue(key="cong", value=round(congestion_drop, 1), unit="%", label="Congestion Drop", trend="positive"),
                MetricValue(key="aqi", value=round(aqi, 0), unit=" AQI", label="Air Quality Index", trend="positive" if aqi <= 50 else "warning"),
                MetricValue(key="gent", value=round(gentrification, 0), unit="/100", label="Gentrification Rsk", trend="warning" if gentrification > 60 else "neutral"),
                MetricValue(key="spend", value=round(govt_spend, 2), unit="$B", label="Infra Spend", trend="neutral"),
            ],
            primary_timeseries=primary_ts,
            secondary_timeseries=sec_ts,
            spending_over_time=spend_ts,
            risk_level=risk_level,
            risk_score=round(risk_score, 1),
            confidence_pct=round(confidence, 1),
            ai_explanation=narrative,
            ai_recommendation=self._get_recommendation(risk_level),
            key_risks=["Displacement of low-income residents", "Transit funding shortfalls"] if gentrification > 50 else ["Construction delays"],
            key_benefits=["Walkable neighborhood creation", "Affordable housing threshold met"]
        )

    def _risk_category(self, score: float) -> str:
        if score < 35: return "low"
        if score < 60: return "medium"
        if score < 80: return "high"
        return "critical"
        
    def _time_series(self, start: float, end: float, years: int) -> List[TimeSeriesPoint]:
        return [TimeSeriesPoint(year=2024 + i, value=round(start + (end - start) * (i / years if years else 1), 2)) for i in range(years + 1)]

    def _get_recommendation(self, risk: str) -> str:
        if risk == "low": return "✅ APPROVE — balanced urban growth."
        if risk == "medium": return "⚡ ITERATE — bolster anti-displacement policies."
        return "⚠️ HALT — severe gentrification risk."
