# 🌌 SYNAPSE GRID — Decision Logic Engine

**The Decision OS for a Multi-Domain Future.**

Synapse Grid is a high-fidelity, futuristic decision support system designed to simulate the impact of complex policy, fiscal, and urban interventions. Built with a sleek "Glassmorphism" aesthetic and powered by domain-agnostic logic engines, it allows leaders to "simulate the future" across four critical sectors.

![Synapse Preview](https://img.shields.io/badge/Status-Operational-00f5ff?style=for-the-badge&logo=probot&logoColor=white)
![Tech](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Backend](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)

---

## 🚀 Vision
The Synapse Grid bridges the gap between raw data and actionable strategy. By utilizing vectorized simulation models, the platform provides real-time projections for:
- **Climate Infrastructure**: EV adoption, CO₂ reduction, and grid stress.
- **Macro-Economic Policy**: Interest rates, stimulus impact, and unemployment.
- **Healthcare Systems**: Hospital bed strain, wait times, and public health indices.
- **Urban Planning**: Zoning reforms, transit ridership, and gentrification risk.

## ✨ Key Features
- **Neural Background**: Real-time canvas-based data-stream background for a specialized high-tech feel.
- **Multi-Domain Logic**: Four distinct simulation engines with sector-specific KPI mapping.
- **Scenario Comparison**: Side-by-side "Head-to-Head" analysis with dynamic delta tracking.
- **Future Snapshot**: Export high-fidelity, shareable outcome cards using `html2canvas`.
- **AI Recommendation**: Integrated summary logic for risk mitigation and strategic approval.

## 🛠️ Technical Stack
### Frontend
- **React 18** + **Vite** (High-performance HMR)
- **Zustand** (Atomic state management)
- **Recharts** (Vectorized data visualization)
- **Lucide-React** (Futuristic iconography)
- **Vanilla CSS** (Custom high-tier design system with CSS tokens)

### Backend
- **FastAPI** (Python 3.10+)
- **Pydantic v2** (Type-safe data modeling)
- **Uvicorn** (ASGI server)
- **Pytest** (Automated logic verification)

---

## 🏃 Quick Start

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Navigate to `http://localhost:5173`.

---

## 🧩 Project Structure
```text
project-root/
├── backend/
│   ├── engine/        # Domain logic engines (Climate, Finance, etc.)
│   ├── models/        # Pydantic simulation schemas
│   ├── routers/       # API endpoints (Simulate, Compare, Suggestions)
│   └── data/          # Seeded scenario suggestions
└── frontend/
    ├── src/
    │   ├── components/ # Atomic UI components (KPICards, Sliders, Charts)
    │   ├── store/      # Centralized decision state
    │   └── utils/      # API communication layer
    └── public/         # Static assets
```

## 🛡️ License
Proprietary — Synapse Strategic Systems 2026.
Designed with ❤️ for the future.
