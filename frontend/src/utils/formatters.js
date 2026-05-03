export const fmt = {
    co2: (v) => `${v.toFixed(2)} MT/yr`,
    adoption: (v) => `${v.toFixed(1)}%`,
    jobs: (v) => `${v.toFixed(1)}K`,
    spend: (v) => `$${v.toFixed(2)}B`,
    price: (v) => `${v > 0 ? '+' : ''}${v.toFixed(1)}%`,
    grid: (v) => `${v.toFixed(0)}/100`,
    confidence: (v) => `${v.toFixed(0)}%`,
    risk: (v) => v.toUpperCase(),
};

export const riskColor = (level) => ({
    low: 'var(--emerald)',
    medium: 'var(--cyan)',
    high: 'var(--orange)',
    critical: 'var(--red)',
}[level] || 'var(--text-secondary)');

export const trendIcon = (trend) => ({
    positive: '↑',
    negative: '↓',
    warning: '⚠',
    neutral: '→',
}[trend] || '→');
