/* ============================================
   CycleView — Analytics Page Charts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    Chart.defaults.font.family = "'Inter', -apple-system, sans-serif";
    Chart.defaults.font.size = 11;
    Chart.defaults.color = '#64748B';
    Chart.defaults.plugins.tooltip.backgroundColor = '#0F172A';
    Chart.defaults.plugins.tooltip.cornerRadius = 8;
    Chart.defaults.plugins.tooltip.padding = 10;
    Chart.defaults.plugins.tooltip.displayColors = false;

    initCycleTrendChart();
    initBBTOverlayChart();
    initLHPatternChart();
});

/* Cycle Length Trend — Line + Range Band */
function initCycleTrendChart() {
    const ctx = document.getElementById('cycle-trend-chart');
    if (!ctx) return;

    const cycleLengths = [29, 28, 30, 27, 29, 28, 31, 29, 27, 29, 28, 28];
    const labels = cycleLengths.map((_, i) => `Cycle ${i + 1}`);

    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 280);
    gradient.addColorStop(0, 'rgba(20,184,166,0.2)');
    gradient.addColorStop(1, 'rgba(20,184,166,0.01)');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Cycle Length (days)',
                data: cycleLengths,
                borderColor: '#14B8A6',
                backgroundColor: gradient,
                fill: true,
                tension: 0.35,
                borderWidth: 2.5,
                pointRadius: 5,
                pointBackgroundColor: (context) => {
                    const v = context.parsed.y;
                    if (v > 35 || v < 21) return '#EF4444';
                    if (v > 31 || v < 25) return '#F59E0B';
                    return '#14B8A6';
                },
                pointBorderColor: '#FFFFFF',
                pointBorderWidth: 2,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: { display: false },
                    ticks: {
                        maxRotation: 0,
                        callback: (val, i) => `C${i + 1}`
                    }
                },
                y: {
                    min: 20,
                    max: 40,
                    grid: { color: 'rgba(226,232,240,0.5)', drawBorder: false },
                    ticks: {
                        callback: v => v + ' days'
                    }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        title: (items) => items[0].label,
                        label: (item) => `Length: ${item.parsed.y} days`
                    }
                },
                annotation: {
                    annotations: {
                        normalBand: {
                            type: 'box',
                            yMin: 25,
                            yMax: 35,
                            backgroundColor: 'rgba(20,184,166,0.04)',
                            borderColor: 'rgba(20,184,166,0.1)',
                            borderWidth: 1,
                            borderDash: [4, 4],
                            label: {
                                display: true,
                                content: 'Normal Range (25–35 days)',
                                position: 'start',
                                font: { size: 9, weight: '500' },
                                color: '#14B8A6',
                                backgroundColor: 'transparent'
                            }
                        },
                        avgLine: {
                            type: 'line',
                            yMin: 28.7,
                            yMax: 28.7,
                            borderColor: '#94A3B8',
                            borderWidth: 1,
                            borderDash: [6, 4],
                            label: {
                                display: true,
                                content: 'Avg: 28.7 days',
                                position: 'end',
                                font: { size: 9 },
                                color: '#94A3B8',
                                backgroundColor: 'rgba(255,255,255,0.9)',
                                padding: 3
                            }
                        }
                    }
                }
            }
        }
    });
}

/* BBT Multi-Cycle Overlay */
function initBBTOverlayChart() {
    const ctx = document.getElementById('bbt-overlay-chart');
    if (!ctx) return;

    const labels = Array.from({ length: 28 }, (_, i) => `CD ${i + 1}`);

    // 3 cycle datasets
    const cycle1 = [36.3,36.2,36.25,36.4,36.35,36.5,36.45,36.3,36.4,36.35,36.3,36.2,36.15,36.1,36.3,36.7,36.75,36.8,36.85,36.9,36.8,36.85,36.9,36.95,37.0,36.85,36.8,36.6];
    const cycle2 = [36.35,36.3,36.2,36.35,36.4,36.45,36.35,36.25,36.3,36.35,36.25,36.15,36.1,36.2,36.65,36.7,36.8,36.85,36.8,36.75,36.85,36.9,36.85,36.9,36.95,36.8,36.75,36.55];
    const cycle3 = [36.25,36.2,36.3,36.35,36.3,36.4,36.45,36.35,36.3,36.25,36.2,36.15,36.2,36.15,36.1,36.3,36.7,36.75,36.85,36.8,36.85,36.9,36.95,37.0,36.95,36.9,36.85,36.65];

    new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Current Cycle (#12)',
                    data: cycle1,
                    borderColor: '#E8736A',
                    backgroundColor: 'transparent',
                    borderWidth: 2.5,
                    tension: 0.35,
                    pointRadius: 3,
                    pointBackgroundColor: '#FFFFFF',
                    pointBorderColor: '#E8736A',
                    pointBorderWidth: 2
                },
                {
                    label: 'Cycle #11',
                    data: cycle2,
                    borderColor: '#8B5CF6',
                    backgroundColor: 'transparent',
                    borderWidth: 1.5,
                    borderDash: [6, 3],
                    tension: 0.35,
                    pointRadius: 0,
                    pointHoverRadius: 4
                },
                {
                    label: 'Cycle #10',
                    data: cycle3,
                    borderColor: '#14B8A6',
                    backgroundColor: 'transparent',
                    borderWidth: 1.5,
                    borderDash: [3, 3],
                    tension: 0.35,
                    pointRadius: 0,
                    pointHoverRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: {
                        maxRotation: 0,
                        callback: (val, i) => (i + 1) % 2 === 0 ? `CD${i + 1}` : ''
                    }
                },
                y: {
                    min: 35.9,
                    max: 37.2,
                    grid: { color: 'rgba(226,232,240,0.5)', drawBorder: false },
                    ticks: { callback: v => v.toFixed(1) + '°C' }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        boxWidth: 16,
                        boxHeight: 2,
                        usePointStyle: false,
                        padding: 20,
                        font: { size: 11, weight: '500' }
                    }
                },
                annotation: {
                    annotations: {
                        ovulation: {
                            type: 'box',
                            xMin: 12.5,
                            xMax: 16.5,
                            backgroundColor: 'rgba(232,115,106,0.06)',
                            borderColor: 'rgba(232,115,106,0.15)',
                            borderWidth: 1,
                            borderDash: [4, 4]
                        },
                        coverline: {
                            type: 'line',
                            yMin: 36.7,
                            yMax: 36.7,
                            borderColor: '#94A3B8',
                            borderWidth: 1,
                            borderDash: [6, 4]
                        }
                    }
                }
            }
        }
    });
}

/* LH Pattern — Bar chart showing LH+ day across cycles */
function initLHPatternChart() {
    const ctx = document.getElementById('lh-pattern-chart');
    if (!ctx) return;

    const lhDays = [14, 15, 14, 13, 14, 15, 16, 15, 13, 14, 14, 15];
    const labels = lhDays.map((_, i) => `C${i + 1}`);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'LH Surge Day',
                data: lhDays,
                backgroundColor: (context) => {
                    return context.dataIndex === lhDays.length - 1 
                        ? '#8B5CF6' 
                        : 'rgba(139,92,246,0.25)';
                },
                borderColor: '#8B5CF6',
                borderWidth: 1,
                borderRadius: 6,
                barPercentage: 0.5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'x',
            scales: {
                x: { grid: { display: false } },
                y: {
                    min: 10,
                    max: 20,
                    grid: { color: 'rgba(226,232,240,0.5)', drawBorder: false },
                    ticks: { callback: v => `CD ${v}` }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        title: (items) => `Cycle ${items[0].dataIndex + 1}`,
                        label: (item) => `LH+ on Cycle Day ${item.parsed.y}`
                    }
                },
                annotation: {
                    annotations: {
                        avgLine: {
                            type: 'line',
                            yMin: 14.3,
                            yMax: 14.3,
                            borderColor: '#E8736A',
                            borderWidth: 1.5,
                            borderDash: [6, 4],
                            label: {
                                display: true,
                                content: 'Avg: CD 14.3',
                                position: 'end',
                                font: { size: 9, weight: '600' },
                                color: '#E8736A',
                                backgroundColor: 'rgba(255,255,255,0.9)',
                                padding: 3
                            }
                        }
                    }
                }
            }
        }
    });
}
