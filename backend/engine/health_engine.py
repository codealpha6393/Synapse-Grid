import uuid
from typing import List
from models.scenario import ScenarioInput
from models.result import SimulationResult, MetricValue, TimeSeriesPoint
from engine.constants import *

class HealthEngine:
    
    def simulate(self, scenario: ScenarioInput) -> SimulationResult:
        scale_mult = SCALE_MULTIPLIERS.get(scenario.scale, 1.0)
        
        # Health specifics
        hosp_budget = scenario.domain_params.get("hospital_budget_bn", 5.0)
        telehealth = scenario.domain_params.get("telehealth_mandate_pct", 10.0)
        prev_care = scenario.domain_params.get("preventative_care_pct", 5.0)
        
        T = scenario.timeframe_years
        budget = scenario.budget_billion_usd
        
        # 1. Wait Times (Days)
        base_wait = 45.0
        wait_times = max(5.0, base_wait - (hosp_budget * 2 * scale_mult) - (telehealth * 0.5))
        
        # 2. Bed Strain (/100)
        bed_strain = max(10.0, 85.0 - (hosp_budget * 1.5 * scale_mult) - (prev_care * 0.2))
        
        # 3. Public Health Index (/100)
        health_index = min(100.0, 70.0 + (prev_care * 1.2) + (hosp_budget * 0.8 * scale_mult))
        
        # 4. ER Admissions (%)
        er_admissions = max(5.0, 25.0 - (prev_care * 0.8) - (telehealth * 0.2))
        
        # 5. Cost per Capita ($)
        cost_capita = 4500 + (+ hosp_budget * 50 / scale_mult) - (telehealth * 15)
        
        # 6. Govt Spending
        govt_spend = budget + hosp_budget
        
        risk_score = min(max((bed_strain * 0.6) + (wait_times * 0.3), 0), 100)
        risk_level = self._risk_category(risk_score)
        
        confidence = max(BASE_CONFIDENCE - (T * 2), 40.0)
        
        primary_ts = self._time_series(70.0, health_index, T)
        sec_ts = self._time_series(base_wait, wait_times, T)
        spend_ts = self._time_series(budget, govt_spend, T)
        
        narrative = f"Deploying ${hosp_budget}B hospital budgets across {T} years with a {telehealth}% telehealth mandate. Bed strain drops to {bed_strain:.0f}/100 and wait times shorten to {wait_times:.0f} days. Overall public health hits {health_index:.1f}/100."
        
        return SimulationResult(
            scenario_id=str(uuid.uuid4())[:8],
            domain="healthcare",
            title=scenario.title,
            metrics=[
                MetricValue(key="wait", value=round(wait_times, 0), unit=" days", label="Avg Wait Time", trend="positive" if wait_times < 30 else "negative"),
                MetricValue(key="strain", value=round(bed_strain, 0), unit="/100", label="Bed Strain Index", trend="warning" if bed_strain > 80 else "positive"),
                MetricValue(key="phi", value=round(health_index, 0), unit="/100", label="Public Health Idx", trend="positive" if health_index > 75 else "neutral"),
                MetricValue(key="er", value=round(er_admissions, 1), unit="%", label="ER Admissions", trend="positive" if er_admissions < 15 else "negative"),
                MetricValue(key="cost", value=round(cost_capita, 0), unit="$/pp", label="Cost per Capita", trend="neutral"),
                MetricValue(key="spend", value=round(govt_spend, 2), unit="$B", label="Govt. Spending", trend="neutral"),
            ],
            primary_timeseries=primary_ts,
            secondary_timeseries=sec_ts,
            spending_over_time=spend_ts,
            risk_level=risk_level,
            risk_score=round(risk_score, 1),
            confidence_pct=round(confidence, 1),
            ai_explanation=narrative,
            ai_recommendation=self._get_recommendation(risk_level),
            key_risks=["Provider burnout", "Rural telehealth gap"] if risk_score > 50 else ["Acceptable healthcare strain"],
            key_benefits=["Reduced specialist wait times", "Higher preventative catch rates"]
        )

    def _risk_category(self, score: float) -> str:
        if score < 35: return "low"
        if score < 60: return "medium"
        if score < 80: return "high"
        return "critical"
        
    def _time_series(self, start: float, end: float, years: int) -> List[TimeSeriesPoint]:
        return [TimeSeriesPoint(year=2024 + i, value=round(start + (end - start) * (i / years if years else 1), 2)) for i in range(years + 1)]

    def _get_recommendation(self, risk: str) -> str:
        if risk == "low": return "✅ OPTIMAL — strong care improvements."
        if risk == "medium": return "⚡ MONITORED — scale up staffing."
        return "⚠️ CRITICAL — hospital systems overcapacity."
