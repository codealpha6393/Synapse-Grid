import uuid
import math
from typing import List
from models.scenario import ScenarioInput
from models.result import SimulationResult, MetricValue, TimeSeriesPoint
from engine.constants import *

class ClimateEngine:
    
    def simulate(self, scenario: ScenarioInput) -> SimulationResult:
        scale_mult = SCALE_MULTIPLIERS[scenario.scale]
        
        # Domain specifics
        s = scenario.domain_params.get("subsidy_change_pct", 20.0)
        base_adopt = scenario.domain_params.get("initial_ev_adoption_pct", 8.0)
        renewable = scenario.domain_params.get("renewable_investment_pct", 0.0)
        
        T = scenario.timeframe_years
        budget = scenario.budget_billion_usd
        
        # 1. EV Adoption Boost
        adoption_boost = s * EV_ADOPTION_ELASTICITY
        final_adoption = min(base_adopt + (adoption_boost * self._time_factor(T)), 95.0)
        
        # 2. CO2 Reduction
        adoption_delta = final_adoption - base_adopt
        co2_reduction = (adoption_delta * CO2_PER_ADOPTION_PCT * scale_mult * 
                        (1 + renewable / 200))
        
        # 3. Jobs Created
        effective_spend = budget * (s / 100) * scale_mult if s > 0 else 0
        jobs_k = (effective_spend * JOBS_PER_BILLION_USD / 1000) * self._time_factor(T)
        
        # 4. Government Spending
        govt_spend = budget * (1 + s / 100) * scale_mult * self._spending_curve(T)
        
        # 5. Consumer Price Impact
        price_delta = s * PRICE_SENSITIVITY * (1 - base_adopt / 100)
        
        # 6. Grid Stress
        grid_stress = self._calculate_grid_stress(final_adoption, scale_mult, T)
        
        # 7. Risk Score
        risk_score = self._calculate_risk(grid_stress, govt_spend, s, T)
        risk_level = self._risk_category(risk_score)
        
        # 8. Confidence
        confidence = max(
            BASE_CONFIDENCE 
            - (T * CONFIDENCE_TIME_DECAY)
            - CONFIDENCE_SCALE_PENALTY[scenario.scale]
            - (abs(s) / 50),
            35.0
        )
        
        # 9. Time Series
        primary_ts = self._time_series(base_adopt, final_adoption, T, "log")
        sec_ts = self._time_series(0, co2_reduction, T, "linear")
        spend_ts = self._time_series(budget, govt_spend, T, "linear")
        
        # 10. Narratives
        narrative = self._generate_narrative(scenario, final_adoption, co2_reduction, 
                                              jobs_k, grid_stress, risk_level, confidence)
        risks = self._identify_risks(grid_stress, govt_spend, s, final_adoption)
        benefits = self._identify_benefits(co2_reduction, jobs_k, adoption_delta, price_delta)
        
        return SimulationResult(
            scenario_id=str(uuid.uuid4())[:8],
            domain="climate",
            title=scenario.title,
            metrics=[
                MetricValue(key="co2", value=round(co2_reduction, 2), unit="MT/yr", label="CO₂ Reduction", trend="positive"),
                MetricValue(key="ev", value=round(final_adoption, 1), unit="%", label="EV Fleet Adoption", trend="positive"),
                MetricValue(key="jobs", value=round(jobs_k, 1), unit="K jobs", label="Jobs Created", trend="positive"),
                MetricValue(key="spend", value=round(govt_spend, 2), unit="$B", label="Govt. Spending", trend="warning" if govt_spend > budget * 1.5 else "neutral"),
                MetricValue(key="price", value=round(price_delta, 1), unit="%", label="Consumer Price Δ", trend="positive" if price_delta < 0 else "negative"),
                MetricValue(key="grid", value=round(grid_stress, 1), unit="/100", label="Grid Stress Index", trend="warning" if grid_stress > 55 else "neutral"),
            ],
            primary_timeseries=primary_ts,
            secondary_timeseries=sec_ts,
            spending_over_time=spend_ts,
            risk_level=risk_level,
            risk_score=round(risk_score, 1),
            confidence_pct=round(confidence, 1),
            ai_explanation=narrative,
            ai_recommendation=self._get_recommendation(risk_level, co2_reduction),
            key_risks=risks,
            key_benefits=benefits
        )
    
    def _time_factor(self, years: int) -> float:
        return sum(TIME_DECAY ** i for i in range(years)) / years * years
    
    def _spending_curve(self, years: int) -> float:
        return 1 + (years - 1) * 0.18
        
    def _calculate_grid_stress(self, adoption: float, scale: float, years: int) -> float:
        base = adoption * GRID_STRESS_PER_PCT_ADOPTION * scale
        if adoption > 25: base *= 1 + (adoption - 25) / 100
        if adoption > 50: base *= 1.3
        return min(base + (years * 0.8), 100.0)
    
    def _calculate_risk(self, grid_stress, spend, subsidy_pct, years) -> float:
        risk = (grid_stress * 0.45 + min(spend / 10, 30) * 0.30 + min(abs(subsidy_pct) / 5, 20) * 0.15 + min(years / 2, 5) * 1.0 * 0.10)
        return min(risk, 100.0)
    
    def _risk_category(self, score: float) -> str:
        for level, (lo, hi) in RISK_THRESHOLDS.items():
            if lo <= score < hi: return level
        return "critical"
    
    def _time_series(self, start: float, end: float, years: int, curve: str) -> List[TimeSeriesPoint]:
        pts = []
        for i in range(years + 1):
            if curve == "log":
                progress = 1 - math.exp(-2.5 * i / years) if years > 0 else 1
            else:
                progress = i / years if years > 0 else 1
            val = start + (end - start) * progress
            pts.append(TimeSeriesPoint(year=2024 + i, value=round(val, 2)))
        return pts
    
    def _generate_narrative(self, s, adoption, co2, jobs, grid, risk, conf) -> str:
        subsidy = s.domain_params.get('subsidy_change_pct', 20)
        return f"Simulating a {subsidy:+.0f}% subsidy change over {s.timeframe_years} years at {s.scale} scale: EV fleet adoption climbs to {adoption:.1f}%, delivering {co2:.2f} MT of annual CO₂ reduction and creating {jobs:.0f}K jobs. Simulation confidence: {conf:.0f}%. Risk classification: {risk.upper()}."
    
    def _get_recommendation(self, risk: str, co2: float) -> str:
        r = {"low": "✅ PROCEED — strong positive outcomes.", "medium": "⚡ PROCEED WITH CAUTION — upgrade grid.", "high": "⚠️ MODIFY — reduce scale.", "critical": "🔴 RESTRUCTURE — critical systemic risk."}
        return r.get(risk, "⚠️ MODIFY")
    
    def _identify_risks(self, grid, spend, subsidy_pct, adoption) -> list:
        risks = []
        if grid > 55: risks.append(f"Grid stress ({grid:.0f}/100) may cause outages")
        if spend > 15: risks.append(f"High fiscal exposure (${spend:.1f}B)")
        if subsidy_pct > 40: risks.append("Rapid market distortion")
        if adoption > 45: risks.append("Fast adoption outstrips charging availability")
        return risks or ["Risk profile within acceptable operational parameters"]
    
    def _identify_benefits(self, co2, jobs, adopt_delta, price_delta) -> list:
        b = []
        if co2 > 0: b.append(f"{co2:.2f} MT/yr CO₂ reduction")
        if jobs > 0: b.append(f"{jobs:.0f}K new energy jobs")
        if adopt_delta > 5: b.append(f"{adopt_delta:.1f}% increase in electrification")
        if price_delta < 0: b.append(f"{abs(price_delta):.1f}% reduction in EV cost")
        return b or ["Marginal baseline improvements"]
