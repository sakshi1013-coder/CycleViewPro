/* ============================================
   CycleView — Dashboard Charts & Interactivity
   Uses the EXACT provided dataset
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initBBTChart();
    initPainEnergyChart();
    initBleedingChart();
    initLHChart();
    initCycleLengthChart();
    initPeriodDurationChart();
    initOvulationDayChart();
    updateSymptomsPanel();
});

/* ============================================
   THE DATASET — Exact assignment data
   ============================================ */
const DATASET = [
    { day:1,  bbt:36.4, pain:9, bleeding:'Heavy',  lh:'Didn\'t test', energy:2 },
    { day:2,  bbt:36.4, pain:9, bleeding:'Heavy',  lh:'Didn\'t test', energy:2 },
    { day:3,  bbt:36.3, pain:8, bleeding:'Medium', lh:'Didn\'t test', energy:3 },
    { day:4,  bbt:36.3, pain:7, bleeding:'Medium', lh:'Didn\'t test', energy:3 },
    { day:5,  bbt:36.4, pain:7, bleeding:'Light',  lh:'Didn\'t test', energy:4 },
    { day:6,  bbt:36.3, pain:6, bleeding:'None',   lh:'Didn\'t test', energy:5 },
    { day:7,  bbt:36.3, pain:6, bleeding:'None',   lh:'Didn\'t test', energy:6 },
    { day:8,  bbt:36.2, pain:5, bleeding:'None',   lh:'Didn\'t test', energy:6 },
    { day:9,  bbt:36.3, pain:5, bleeding:'None',   lh:'Low',          energy:7 },
    { day:10, bbt:36.3, pain:5, bleeding:'None',   lh:'Low',          energy:7 },
    { day:11, bbt:36.4, pain:6, bleeding:'None',   lh:'High',         energy:8 },
    { day:12, bbt:36.4, pain:6, bleeding:'None',   lh:'High',         energy:8 },
    { day:13, bbt:36.2, pain:7, bleeding:'None',   lh:'Peak',         energy:7 },
    { day:14, bbt:36.3, pain:7, bleeding:'None',   lh:'Peak',         energy:7 },
    { day:15, bbt:36.5, pain:6, bleeding:'None',   lh:'High',         energy:7 },
    { day:16, bbt:36.7, pain:5, bleeding:'None',   lh:'Low',          energy:6 },
    { day:17, bbt:36.8, pain:5, bleeding:'None',   lh:'Didn\'t test', energy:6 },
    { day:18, bbt:36.8, pain:5, bleeding:'None',   lh:'Didn\'t test', energy:6 },
    { day:19, bbt:36.9, pain:6, bleeding:'None',   lh:'Didn\'t test', energy:5 },
    { day:20, bbt:36.9, pain:6, bleeding:'None',   lh:'Didn\'t test', energy:5 },
    { day:21, bbt:37.0, pain:6, bleeding:'None',   lh:'Didn\'t test', energy:5 },
    { day:22, bbt:36.9, pain:7, bleeding:'None',   lh:'Didn\'t test', energy:4 },
    { day:23, bbt:36.9, pain:7, bleeding:'None',   lh:'Didn\'t test', energy:4 },
    { day:24, bbt:36.8, pain:7, bleeding:'None',   lh:'Didn\'t test', energy:3 },
    { day:25, bbt:36.8, pain:8, bleeding:'None',   lh:'Didn\'t test', energy:3 },
    { day:26, bbt:36.7, pain:8, bleeding:'None',   lh:'Didn\'t test', energy:3 },
    { day:27, bbt:36.6, pain:8, bleeding:'None',   lh:'Didn\'t test', energy:2 },
    { day:28, bbt:36.5, pain:9, bleeding:'None',   lh:'Didn\'t test', energy:2 }
];

/* ---------- Derived Arrays ---------- */
const labels = DATASET.map(d => `CD ${d.day}`);
const bbtData = DATASET.map(d => d.bbt);
const painData = DATASET.map(d => d.pain);
const energyData = DATASET.map(d => d.energy);

// Bleeding: categorical → numeric (for chart)
const BLEEDING_MAP = { 'Heavy': 3, 'Medium': 2, 'Light': 1, 'None': 0 };
const bleedingData = DATASET.map(d => BLEEDING_MAP[d.bleeding]);

// LH: categorical → numeric (for chart)
const LH_MAP = { 'Didn\'t test': 0, 'Low': 1, 'High': 2, 'Peak': 3 };
const lhData = DATASET.map(d => LH_MAP[d.lh]);

/* ---------- Shared Chart Defaults ---------- */
Chart.defaults.font.family = "'Inter', -apple-system, sans-serif";
Chart.defaults.font.size = 11;
Chart.defaults.color = '#64748B';
Chart.defaults.plugins.tooltip.backgroundColor = '#0F172A';
Chart.defaults.plugins.tooltip.titleFont = { weight: '600', size: 12 };
Chart.defaults.plugins.tooltip.bodyFont = { size: 11 };
Chart.defaults.plugins.tooltip.cornerRadius = 8;
Chart.defaults.plugins.tooltip.padding = 10;
Chart.defaults.plugins.tooltip.displayColors = false;

/* ---------- Color Palette ---------- */
const COLORS = {
    coral: '#E07A6F',
    coralLight: 'rgba(224,122,111,0.15)',
    purple: '#9070E0',
    purpleLight: 'rgba(144,112,224,0.12)',
    teal: '#2DB8A8',
    tealLight: 'rgba(45,184,168,0.12)',
    red: '#E06060',
    redLight: 'rgba(224,96,96,0.12)',
    amber: '#E8A040',
    amberLight: 'rgba(232,160,64,0.12)',
    green: '#38C090',
    greenLight: 'rgba(56,192,144,0.1)',
    navy: '#1A2332',
    slate400: '#9BAABD',
    slate200: '#D1D9E6',
    slate100: '#E3E8F0',
    white: '#FFFFFF'
};

/* ============================================
   BBT Chart — Time-Series Line
   Uses exact BBT data from the dataset
   Key insight: BBT dip at CD13 (36.2°C) followed
   by biphasic shift from CD15 onward (>36.7°C)
   ============================================ */
function initBBTChart() {
    const ctx = document.getElementById('bbt-chart');
    if (!ctx) return;
    const context = ctx.getContext('2d');

    const gradient = context.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(224,122,111,0.2)');
    gradient.addColorStop(1, 'rgba(224,122,111,0.01)');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'BBT (°C)',
                data: bbtData,
                borderColor: COLORS.coral,
                backgroundColor: gradient,
                fill: true,
                tension: 0.35,
                borderWidth: 2.5,
                pointRadius: (ctx) => {
                    const i = ctx.dataIndex;
                    // Highlight ovulation-related days (dip + surge)
                    if (i >= 12 && i <= 15) return 5;
                    return 3;
                },
                pointBackgroundColor: (ctx) => {
                    const i = ctx.dataIndex;
                    if (i >= 12 && i <= 15) return COLORS.coral;
                    return COLORS.white;
                },
                pointBorderColor: COLORS.coral,
                pointBorderWidth: 2,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: COLORS.coral
            }]
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
                    grid: { color: 'rgba(209,217,230,0.5)', drawBorder: false },
                    ticks: {
                        callback: (v) => v.toFixed(1) + '°C'
                    }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        title: (items) => items[0].label,
                        label: (item) => {
                            const d = DATASET[item.dataIndex];
                            return [
                                `Temperature: ${d.bbt.toFixed(1)}°C`,
                                `Pain: ${d.pain}/10 | Energy: ${d.energy}/10`,
                                `Bleeding: ${d.bleeding} | LH: ${d.lh}`
                            ];
                        }
                    }
                },
                annotation: {
                    annotations: {
                        // Ovulation window: CD 13-15 (Peak LH on CD13-14, BBT shift CD15+)
                        ovulationWindow: {
                            type: 'box',
                            xMin: 11.5,
                            xMax: 15.5,
                            backgroundColor: COLORS.coralLight,
                            borderColor: 'rgba(224,122,111,0.3)',
                            borderWidth: 1,
                            borderDash: [4, 4],
                            label: {
                                display: true,
                                content: 'Ovulation Window',
                                position: 'start',
                                font: { size: 10, weight: '600' },
                                color: COLORS.coral,
                                backgroundColor: 'rgba(227,232,240,0.9)',
                                padding: 4
                            }
                        },
                        // Coverline: mean of pre-ovulatory temps = ~36.32
                        // Shift to 36.7+ confirms ovulation
                        coverline: {
                            type: 'line',
                            yMin: 36.5,
                            yMax: 36.5,
                            borderColor: COLORS.slate400,
                            borderWidth: 1,
                            borderDash: [6, 4],
                            label: {
                                display: true,
                                content: 'Coverline 36.5°C',
                                position: 'end',
                                font: { size: 9 },
                                color: COLORS.slate400,
                                backgroundColor: 'transparent'
                            }
                        },
                        // LH Peak marker on CD13
                        lhSurge: {
                            type: 'point',
                            xValue: 12,
                            yValue: 36.2,
                            backgroundColor: COLORS.amber,
                            borderColor: COLORS.white,
                            borderWidth: 2,
                            radius: 7
                        }
                    }
                }
            }
        }
    });
}

/* ============================================
   Pain & Energy Trends — Grouped Bar Chart
   Pain: 0–10 scale (from dataset)
   Energy: 0–10 scale (from dataset)
   Shows inverse correlation clearly
   ============================================ */
function initPainEnergyChart() {
    const ctx = document.getElementById('pain-energy-chart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: DATASET.map(d => d.day),
            datasets: [
                {
                    label: 'Pain (0–10)',
                    data: painData,
                    backgroundColor: (ctx) => {
                        const v = ctx.parsed.y;
                        if (v >= 8) return 'rgba(224,96,96,0.8)';
                        if (v >= 6) return 'rgba(224,122,111,0.6)';
                        if (v >= 4) return 'rgba(224,122,111,0.4)';
                        return 'rgba(224,122,111,0.2)';
                    },
                    borderRadius: 3,
                    barPercentage: 0.45,
                    categoryPercentage: 0.8
                },
                {
                    label: 'Energy (0–10)',
                    data: energyData,
                    backgroundColor: (ctx) => {
                        const v = ctx.parsed.y;
                        if (v >= 7) return 'rgba(56,192,144,0.7)';
                        if (v >= 5) return 'rgba(56,192,144,0.5)';
                        if (v >= 3) return 'rgba(232,160,64,0.5)';
                        return 'rgba(232,160,64,0.3)';
                    },
                    borderRadius: 3,
                    barPercentage: 0.45,
                    categoryPercentage: 0.8
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: { display: false },
                    ticks: {
                        callback: (val, i) => (i + 1) % 4 === 0 ? `CD${i + 1}` : ''
                    }
                },
                y: {
                    min: 0,
                    max: 10,
                    grid: { color: 'rgba(209,217,230,0.5)', drawBorder: false },
                    ticks: {
                        stepSize: 2,
                        callback: (v) => v
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        boxWidth: 10, boxHeight: 10, borderRadius: 2,
                        usePointStyle: true, pointStyle: 'rectRounded',
                        padding: 16, font: { size: 11, weight: '500' }
                    }
                },
                tooltip: {
                    callbacks: {
                        title: (items) => `Cycle Day ${items[0].label}`,
                        label: (item) => {
                            return `${item.dataset.label}: ${item.parsed.y}/10`;
                        }
                    }
                },
                annotation: {
                    annotations: {
                        menstrualZone: {
                            type: 'box', xMin: -0.5, xMax: 4.5,
                            backgroundColor: 'rgba(224,96,96,0.04)',
                            borderColor: 'transparent'
                        },
                        ovulationZone: {
                            type: 'box', xMin: 11.5, xMax: 15.5,
                            backgroundColor: 'rgba(224,122,111,0.04)',
                            borderColor: 'transparent'
                        }
                    }
                }
            }
        }
    });
}

/* ============================================
   Bleeding Pattern — Bar Chart
   Categorical: Heavy=3, Medium=2, Light=1, None=0
   (from exact dataset)
   ============================================ */
function initBleedingChart() {
    const ctx = document.getElementById('bleeding-chart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: DATASET.map(d => d.day),
            datasets: [{
                label: 'Bleeding Intensity',
                data: bleedingData,
                backgroundColor: (ctx) => {
                    const v = ctx.parsed.y;
                    if (v >= 3) return 'rgba(224,96,96,0.8)';
                    if (v >= 2) return 'rgba(224,96,96,0.55)';
                    if (v >= 1) return 'rgba(240,160,160,0.5)';
                    return 'rgba(209,217,230,0.25)';
                },
                borderRadius: 4,
                borderSkipped: false,
                barPercentage: 0.6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: { display: false },
                    ticks: {
                        callback: (val, i) => (i + 1) % 4 === 0 ? `CD${i + 1}` : ''
                    }
                },
                y: {
                    min: 0,
                    max: 4,
                    grid: { color: 'rgba(209,217,230,0.5)', drawBorder: false },
                    ticks: {
                        stepSize: 1,
                        callback: (v) => ['None', 'Light', 'Medium', 'Heavy', ''][v]
                    }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        title: (items) => `Cycle Day ${items[0].label}`,
                        label: (item) => {
                            const d = DATASET[item.dataIndex];
                            return `Bleeding: ${d.bleeding}`;
                        }
                    }
                }
            }
        }
    });
}

/* ============================================
   LH Surge — Stepped Line Chart
   Categorical: Didn't test=0, Low=1, High=2, Peak=3
   (from exact dataset)
   ============================================ */
function initLHChart() {
    const ctx = document.getElementById('lh-chart');
    if (!ctx) return;
    const context = ctx.getContext('2d');

    const gradient = context.createLinearGradient(0, 0, 0, 240);
    gradient.addColorStop(0, 'rgba(144,112,224,0.25)');
    gradient.addColorStop(1, 'rgba(144,112,224,0.01)');

    // Only show data points where LH was actually tested (not "Didn't test")
    const lhDisplayData = lhData.map(v => v === 0 ? null : v);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: DATASET.map(d => d.day),
            datasets: [{
                label: 'LH Level',
                data: lhDisplayData,
                borderColor: COLORS.purple,
                backgroundColor: gradient,
                fill: true,
                tension: 0.4,
                borderWidth: 2.5,
                pointRadius: (ctx) => {
                    const v = ctx.parsed.y;
                    if (v === 3) return 7;
                    if (v >= 1) return 4;
                    return 0;
                },
                pointBackgroundColor: (ctx) => {
                    const v = ctx.parsed.y;
                    if (v === 3) return COLORS.purple;
                    return COLORS.white;
                },
                pointBorderColor: COLORS.purple,
                pointBorderWidth: 2,
                spanGaps: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: { display: false },
                    ticks: {
                        callback: (val, i) => (i + 1) % 4 === 0 ? `CD${i + 1}` : ''
                    }
                },
                y: {
                    min: 0,
                    max: 4,
                    grid: { color: 'rgba(209,217,230,0.5)', drawBorder: false },
                    ticks: {
                        stepSize: 1,
                        callback: (v) => ['—', 'Low', 'High', 'Peak', ''][v]
                    }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        title: (items) => `Cycle Day ${items[0].label}`,
                        label: (item) => {
                            const d = DATASET[item.dataIndex];
                            return `LH Test: ${d.lh}`;
                        }
                    }
                },
                annotation: {
                    annotations: {
                        surgeWindow: {
                            type: 'box',
                            xMin: 11.5,
                            xMax: 13.5,
                            backgroundColor: 'rgba(144,112,224,0.08)',
                            borderColor: 'rgba(144,112,224,0.2)',
                            borderWidth: 1,
                            borderDash: [3, 3],
                            label: {
                                display: true,
                                content: 'LH Peak (CD 13–14)',
                                position: 'start',
                                font: { size: 9, weight: '600' },
                                color: COLORS.purple,
                                backgroundColor: 'rgba(227,232,240,0.9)',
                                padding: 3
                            }
                        }
                    }
                }
            }
        }
    });
}

/* ============================================
   Mini Comparison Charts (Historical)
   ============================================ */
function initCycleLengthChart() {
    const ctx = document.getElementById('cycle-length-chart');
    if (!ctx) return;
    miniBarChart(ctx.getContext('2d'), [27, 29, 31, 28, 29, 28], 'Cycle Length', COLORS.teal, COLORS.tealLight);
}

function initPeriodDurationChart() {
    const ctx = document.getElementById('period-duration-chart');
    if (!ctx) return;
    miniBarChart(ctx.getContext('2d'), [5, 4, 6, 5, 5, 5], 'Period Duration', COLORS.red, COLORS.redLight);
}

function initOvulationDayChart() {
    const ctx = document.getElementById('ovulation-day-chart');
    if (!ctx) return;
    miniBarChart(ctx.getContext('2d'), [14, 15, 17, 15, 13, 14], 'Ovulation Day', COLORS.coral, COLORS.coralLight);
}

function miniBarChart(ctx, data, label, color, bgColor) {
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map((_, i) => `C${i + 1}`),
            datasets: [{
                label,
                data,
                backgroundColor: (c) => c.dataIndex === data.length - 1 ? color : bgColor,
                borderColor: color,
                borderWidth: (c) => c.dataIndex === data.length - 1 ? 0 : 1,
                borderRadius: 4,
                barPercentage: 0.6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { x: { display: false }, y: { display: false } },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        title: (items) => `Cycle ${items[0].dataIndex + 1}`,
                        label: (item) => `${label}: ${item.parsed.y} days`
                    }
                }
            }
        }
    });
}

/* ============================================
   Update "Today's Symptoms" panel to match
   the exact dataset for CD 16
   ============================================ */
function updateSymptomsPanel() {
    // CD 16 data from the dataset
    const today = DATASET[15]; // CD 16 (0-indexed = 15)
    
    // Pain: 5/10
    const painBar = document.querySelector('#symptom-pain .pain-bar');
    const painValue = document.querySelector('#symptom-pain .symptom-value');
    const painNote = document.querySelector('#symptom-pain .symptom-note');
    if (painBar) painBar.style.width = `${(today.pain / 10) * 100}%`;
    if (painValue) painValue.textContent = `Moderate (${today.pain}/10)`;
    if (painNote) painNote.textContent = 'Cramping · Lower abdomen';

    // Energy: 6/10
    const energyBar = document.querySelector('#symptom-energy .energy-bar');
    const energyValue = document.querySelector('#symptom-energy .symptom-value');
    const energyNote = document.querySelector('#symptom-energy .symptom-note');
    if (energyBar) energyBar.style.width = `${(today.energy / 10) * 100}%`;
    if (energyValue) energyValue.textContent = `Moderate (${today.energy}/10)`;
    if (energyNote) energyNote.textContent = 'Moderate energy level';

    // Bleeding: None
    const bleedBar = document.querySelector('#symptom-bleeding .bleeding-bar');
    const bleedValue = document.querySelector('#symptom-bleeding .symptom-value');
    if (bleedBar) bleedBar.style.width = '0%';
    if (bleedValue) bleedValue.textContent = today.bleeding;

    // LH: Low
    const lhResult = document.querySelector('#symptom-lh .lh-result');
    if (lhResult) {
        lhResult.classList.remove('positive');
        lhResult.classList.add('negative');
        lhResult.innerHTML = `<span>${today.lh}</span>`;
    }
    const lhNote = document.querySelector('#symptom-lh .symptom-note');
    if (lhNote) lhNote.textContent = 'Peak detected CD 13–14';
}
