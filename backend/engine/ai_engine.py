import os
from dotenv import load_dotenv

try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
except ImportError:
    genai = None
    GENAI_AVAILABLE = False

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
ENABLE_AI = os.getenv("ENABLE_AI", "false").lower() == "true"

if GENAI_AVAILABLE and GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

class AIEngine:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-1.5-flash') if (GENAI_AVAILABLE and GEMINI_API_KEY) else None

    async def generate_insight(self, domain: str, scenario_title: str, metrics: list, risk_score: float) -> dict:
        if not self.model or not ENABLE_AI:
            return None

        metrics_str = ", ".join([f"{m.label}: {m.value}{m.unit}" for m in metrics])
        
        prompt = f"""
        Act as a futuristic strategic AI for the Synapse Grid decision OS. 
        Sector: {domain.upper()}
        Scenario: {scenario_title}
        Key Metrics: {metrics_str}
        Systemic Risk Score: {risk_score}/100

        Provide a hyper-intelligent, concise technical summary (max 3 sentences). 
        Then provide one 'Strategic Recommendation' for a high-level leader.
        Format as JSON: {{"explanation": "...", "recommendation": "..."}}
        """

        try:
            response = await self.model.generate_content_async(prompt)
            # Simple cleanup for JSON parsing
            text = response.text.replace("```json", "").replace("```", "").strip()
            import json
            return json.loads(text)
        except Exception as e:
            print(f"AI Insight error: {e}")
            return None
