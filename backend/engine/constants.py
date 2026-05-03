SCALE_MULTIPLIERS = {
    "local": 0.05,
    "regional": 0.18,
    "national": 1.0,
    "global": 6.2,
}

EV_ADOPTION_ELASTICITY = 0.23
CO2_PER_ADOPTION_PCT = 0.18
JOBS_PER_BILLION_USD = 6200
GRID_STRESS_PER_PCT_ADOPTION = 1.8
PRICE_SENSITIVITY = -0.12
TIME_DECAY = 0.85
BASE_CONFIDENCE = 91.0
CONFIDENCE_TIME_DECAY = 2.8
CONFIDENCE_SCALE_PENALTY = {
    "local": 0,
    "regional": 3,
    "national": 6,
    "global": 14,
}
RISK_THRESHOLDS = {
    "low": (0, 30),
    "medium": (30, 55),
    "high": (55, 75),
    "critical": (75, 100),
}
DOMAIN_STATUS = {
    "climate": "active",
    "finance": "active",
    "healthcare": "active",
    "urban": "active",
}
