import React from 'react';
import './index.css';
import NeuralBackground from './components/layout/NeuralBackground';
import TopBar from './components/layout/TopBar';
import Sidebar from './components/layout/Sidebar';
import ScenarioBuilder from './components/scenario/ScenarioBuilder';
import ResultsDashboard from './components/results/ResultsDashboard';
import ComparisonMode from './components/comparison/ComparisonMode';
import LandingPage from './components/landing/LandingPage';
import FutureSnapshot from './components/export/FutureSnapshot';
import useStore from './store/useStore';

function App() {
  const { activeView, theme, snapshotOpen, closeSnapshot, result } = useStore();

  return (
    <div data-theme={theme} style={{ minHeight: '100vh', background: 'var(--bg-void)', position: 'relative' }}>
      <NeuralBackground />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <TopBar />
        <div style={{ display: 'flex' }}>
          {activeView !== 'landing' && <Sidebar />}
          <main style={{ flex: 1, minHeight: 'calc(100vh - 64px)', overflow: 'auto' }}>
            {activeView === 'landing' && <LandingPage />}
            {activeView === 'builder' && <ScenarioBuilder />}
            {activeView === 'results' && <ResultsDashboard />}
            {activeView === 'compare' && <ComparisonMode />}
          </main>
        </div>
      </div>
      {snapshotOpen && result && <FutureSnapshot result={result} onClose={closeSnapshot} />}
    </div>
  );
}

export default App;
