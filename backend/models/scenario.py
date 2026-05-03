from typing import Literal

from pydantic import BaseModel, Field


class ScenarioInput(BaseModel):
    domain: Literal["climate", "finance", "healthcare", "urban"] = "climate"
    title: str = Field(..., min_length=5, max_length=200)
    description: str = Field(..., min_length=10, max_length=500)
    timeframe_years: int = Field(default=3, ge=1, le=20)
    scale: Literal["local", "regional", "national", "global"] = "national"
    budget_billion_usd: float = Field(default=7.5, ge=0.1, le=1000)
    domain_params: dict[str, float] = Field(default_factory=dict)


class CompareRequest(BaseModel):
    scenario_a: ScenarioInput
    scenario_b: ScenarioInput
