from typing import Literal

from pydantic import BaseModel


class MetricValue(BaseModel):
    key: str
    value: float
    unit: str
    label: str
    trend: Literal["positive", "negative", "neutral", "warning"]


class TimeSeriesPoint(BaseModel):
    year: int
    value: float


class SimulationResult(BaseModel):
    scenario_id: str
    domain: str
    title: str
    metrics: list[MetricValue]
    primary_timeseries: list[TimeSeriesPoint]
    secondary_timeseries: list[TimeSeriesPoint]
    spending_over_time: list[TimeSeriesPoint]
    risk_level: Literal["low", "medium", "high", "critical"]
    risk_score: float
    confidence_pct: float
    ai_explanation: str
    ai_recommendation: str | None
    key_risks: list[str]
    key_benefits: list[str]


class ComparisonResult(BaseModel):
    scenario_a: SimulationResult
    scenario_b: SimulationResult
    recommended: Literal["a", "b"]
    recommendation_reason: str
    delta_metrics: dict[str, float]
