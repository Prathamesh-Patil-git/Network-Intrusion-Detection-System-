/* ============================================
   NIDS.AI — Chart Configuration (Chart.js)
   ============================================ */

/* Chart.js defaults for our light theme */
Chart.defaults.color = '#64748b';
Chart.defaults.borderColor = 'rgba(0, 0, 0, 0.06)';
Chart.defaults.font.family = "'Inter', sans-serif";

let attackChartInstance = null;
let riskChartInstance = null;


function createAttackChart(data) {
    const ctx = document.getElementById('attackChart').getContext('2d');

    if (attackChartInstance) attackChartInstance.destroy();

    const labels = Object.keys(data);
    const values = Object.values(data);

    const colors = {
        'Normal': '#10b981',
        'DoS': '#ef4444',
        'Probe': '#f59e0b',
        'R2L': '#8b5cf6',
        'U2R': '#dc2626'
    };

    const bgColors = labels.map(l => colors[l] || '#94a3b8');

    attackChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: bgColors,
                borderColor: '#ffffff',
                borderWidth: 3,
                hoverBorderWidth: 0,
                hoverOffset: 8,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        padding: 16,
                        usePointStyle: true,
                        pointStyleWidth: 12,
                        font: { size: 12, weight: '500' }
                    }
                },
                tooltip: {
                    backgroundColor: '#1e293b',
                    titleColor: '#f1f5f9',
                    bodyColor: '#f1f5f9',
                    padding: 12,
                    cornerRadius: 8,
                    titleFont: { weight: '700' },
                    callbacks: {
                        label: function(ctx) {
                            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                            const pct = ((ctx.parsed / total) * 100).toFixed(1);
                            return ` ${ctx.label}: ${ctx.parsed.toLocaleString()} (${pct}%)`;
                        }
                    }
                }
            }
        }
    });
}


function createRiskChart(data) {
    const ctx = document.getElementById('riskChart').getContext('2d');

    if (riskChartInstance) riskChartInstance.destroy();

    const order = ['Low', 'Medium', 'High', 'Critical'];
    const labels = order.filter(k => data[k]);
    const values = labels.map(l => data[l]);

    const colorMap = {
        'Low': { bg: 'rgba(16, 185, 129, 0.15)', border: '#10b981' },
        'Medium': { bg: 'rgba(245, 158, 11, 0.15)', border: '#f59e0b' },
        'High': { bg: 'rgba(239, 68, 68, 0.15)', border: '#ef4444' },
        'Critical': { bg: 'rgba(220, 38, 38, 0.15)', border: '#dc2626' }
    };

    riskChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Samples',
                data: values,
                backgroundColor: labels.map(l => colorMap[l]?.bg || 'rgba(148,163,184,0.15)'),
                borderColor: labels.map(l => colorMap[l]?.border || '#94a3b8'),
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1e293b',
                    titleColor: '#f1f5f9',
                    bodyColor: '#f1f5f9',
                    padding: 12,
                    cornerRadius: 8,
                    titleFont: { weight: '700' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0, 0, 0, 0.04)' },
                    ticks: { font: { size: 11, weight: '500' } }
                },
                x: {
                    grid: { display: false },
                    ticks: { font: { size: 12, weight: '600' } }
                }
            }
        }
    });
}
