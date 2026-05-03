from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import simulate, scenarios, compare

app = FastAPI(
    title="SYNAPSE GRID API",
    description="Real-World Decision Simulation Engine",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(simulate.router, prefix="/api/v1", tags=["Simulation"])
app.include_router(scenarios.router, prefix="/api/v1", tags=["Scenarios"])
app.include_router(compare.router, prefix="/api/v1", tags=["Comparison"])

@app.get("/health")
async def health_check():
    return {"status": "operational", "engine": "SYNAPSE GRID v1.0"}
