/* ============================================
   NIDS.AI — Main Application Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    loadDashboard();
});


/* -------------------------------------------
   Navigation
   ------------------------------------------- */
function initNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            switchSection(section);
        });
    });
}


function switchSection(sectionId) {
    // Update nav links
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    const activeLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
    if (activeLink) activeLink.classList.add('active');

    // Update sections
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    const section = document.getElementById(sectionId);
    if (section) section.classList.add('active');

    // Lazy load section data
    if (sectionId === 'metrics') loadMetrics();
}


/* -------------------------------------------
   Animated Counter
   ------------------------------------------- */
function animateValue(el, end, duration = 800) {
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (end - start) * eased);

        if (typeof end === 'number' && end % 1 !== 0) {
            el.textContent = (start + (end - start) * eased).toFixed(2) + '%';
        } else {
            el.textContent = current.toLocaleString();
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}


/* -------------------------------------------
   Dashboard
   ------------------------------------------- */
async function loadDashboard() {
    try {
        const [info, dist] = await Promise.all([
            apiGet('/api/info'),
            apiGet('/api/distribution')
        ]);

        // Animate stats
        animateValue(document.getElementById('stat-total'), info.total_samples);
        animateValue(document.getElementById('stat-classes'), info.num_classes);
        animateValue(document.getElementById('stat-features'), info.num_features);

        // Load accuracy separately
        apiGet('/api/metrics').then(m => {
            const accEl = document.getElementById('stat-accuracy');
            animateValue(accEl, m.accuracy * 100);
        }).catch(() => {
            document.getElementById('stat-accuracy').textContent = 'N/A';
        });

        // Charts
        createAttackChart(dist.attack_distribution);
        createRiskChart(dist.risk_distribution);

    } catch (err) {
        console.error('Dashboard load failed:', err);
    }
}


/* -------------------------------------------
   Single Sample Analyzer
   ------------------------------------------- */
async function predictSingle() {
    const idx = parseInt(document.getElementById('sampleIndex').value) || 0;
    showLoading();

    try {
        const data = await apiPost('/api/predict/single', { index: idx });
        displayResult(data);
        showToast('Analysis complete', 'success');
    } catch (err) {
        console.error(err);
    } finally {
        hideLoading();
    }
}


async function predictRandom() {
    showLoading();

    try {
        const data = await apiGet('/api/predict/random');
        document.getElementById('sampleIndex').value = data.index;
        displayResult(data);
        showToast(`Random sample #${data.index} analyzed`, 'success');
    } catch (err) {
        console.error(err);
    } finally {
        hideLoading();
    }
}


function displayResult(data) {
    document.getElementById('analyzerEmpty').style.display = 'none';
    document.getElementById('resultContent').style.display = 'block';

    // Values
    document.getElementById('resPredicted').textContent = data.predicted_attack;
    document.getElementById('resActual').textContent = data.actual_attack;
    document.getElementById('resRisk').textContent = data.risk_level;

    // Correct/Incorrect
    const correctEl = document.getElementById('resCorrect');
    if (data.correct) {
        correctEl.textContent = '✓ Correct';
        correctEl.className = 'result-value correct-badge';
    } else {
        correctEl.textContent = '✕ Incorrect';
        correctEl.className = 'result-value incorrect-badge';
    }

    // Risk styling
    const riskClass = `risk-${data.risk_level.toLowerCase()}`;
    const riskBox = document.getElementById('riskBox');
    riskBox.className = `result-box result-box-risk ${riskClass}`;

    // Gauge
    const gauge = document.getElementById('gaugeFill');
    gauge.className = 'gauge-fill';
    setTimeout(() => {
        gauge.classList.add(`gauge-${data.risk_level.toLowerCase()}`);
    }, 50);

    // Features table
    const featTable = document.getElementById('featuresTable');
    featTable.innerHTML = '';

    if (data.top_features) {
        data.top_features.forEach((f, i) => {
            const row = document.createElement('div');
            row.className = 'feature-row';
            row.style.animationDelay = `${i * 0.04}s`;
            row.innerHTML = `
                <span class="feature-name">${f.name}</span>
                <span class="feature-value">${typeof f.value === 'number' ? f.value.toFixed(4) : f.value}</span>
            `;
            featTable.appendChild(row);
        });
    }
}


/* -------------------------------------------
   Batch Scanner
   ------------------------------------------- */
async function runBatch() {
    const count = parseInt(document.getElementById('batchCount').value);
    const start = parseInt(document.getElementById('batchStart').value) || 0;

    showLoading();

    try {
        const data = await apiPost('/api/predict/batch', { count, start });
        displayBatchResults(data.results);
        showToast(`${data.total} samples scanned`, 'success');
    } catch (err) {
        console.error(err);
    } finally {
        hideLoading();
    }
}


function displayBatchResults(results) {
    // Summary counts
    const counts = { Low: 0, Medium: 0, High: 0, Critical: 0 };
    results.forEach(r => {
        if (counts.hasOwnProperty(r.risk_level)) counts[r.risk_level]++;
    });

    document.getElementById('sumLow').textContent = counts.Low;
    document.getElementById('sumMedium').textContent = counts.Medium;
    document.getElementById('sumHigh').textContent = counts.High;
    document.getElementById('sumCritical').textContent = counts.Critical;
    document.getElementById('batchSummary').style.display = 'block';

    // Table
    const tbody = document.getElementById('batchBody');
    tbody.innerHTML = '';

    results.forEach((r, i) => {
        const tr = document.createElement('tr');
        tr.style.animationDelay = `${i * 0.03}s`;

        const riskClass = r.risk_level.toLowerCase();
        const statusClass = r.correct ? 'status-correct' : 'status-incorrect';
        const statusText = r.correct ? '✓ Match' : '✕ Mismatch';

        tr.innerHTML = `
            <td>${r.index}</td>
            <td>${r.predicted_attack}</td>
            <td>${r.actual_attack}</td>
            <td><span class="risk-badge risk-badge-${riskClass}">${r.risk_level}</span></td>
            <td><span class="${statusClass}">${statusText}</span></td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById('batchTableContainer').style.display = 'block';
}


/* -------------------------------------------
   Model Metrics
   ------------------------------------------- */
let metricsLoaded = false;

async function loadMetrics() {
    if (metricsLoaded) return;

    try {
        const data = await apiGet('/api/metrics');
        metricsLoaded = true;

        // Accuracy ring
        const accPct = (data.accuracy * 100).toFixed(2);
        document.getElementById('metricsAccuracy').textContent = accPct + '%';
        document.getElementById('metricsTestSamples').textContent = data.total_test_samples.toLocaleString();

        // Animate ring
        const ring = document.getElementById('accuracyRing');
        const circumference = 2 * Math.PI * 52; // r=52
        const offset = circumference - (data.accuracy * circumference);

        // Add gradient def to SVG
        const svg = ring.closest('svg');
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        grad.id = 'ring-gradient';
        grad.innerHTML = '<stop offset="0%" stop-color="#10b981"/><stop offset="100%" stop-color="#34d399"/>';
        defs.appendChild(grad);
        svg.prepend(defs);

        setTimeout(() => {
            ring.style.strokeDashoffset = offset;
        }, 300);

        // Per-class table
        const tbody = document.getElementById('metricsBody');
        tbody.innerHTML = '';

        data.per_class.forEach((cls, i) => {
            const tr = document.createElement('tr');
            tr.style.animationDelay = `${i * 0.05}s`;

            const precColor = cls.precision > 0.9 ? 'var(--success)' : cls.precision > 0.7 ? 'var(--warning)' : 'var(--danger)';
            const recColor = cls.recall > 0.9 ? 'var(--success)' : cls.recall > 0.7 ? 'var(--warning)' : 'var(--danger)';
            const f1Color = cls.f1 > 0.9 ? 'var(--success)' : cls.f1 > 0.7 ? 'var(--warning)' : 'var(--danger)';

            tr.innerHTML = `
                <td style="font-weight:600; font-family: var(--font-body);">${cls.class}</td>
                <td style="color:${precColor}">${(cls.precision * 100).toFixed(1)}%</td>
                <td style="color:${recColor}">${(cls.recall * 100).toFixed(1)}%</td>
                <td style="color:${f1Color}">${(cls.f1 * 100).toFixed(1)}%</td>
                <td>${cls.support.toLocaleString()}</td>
            `;
            tbody.appendChild(tr);
        });

        // Confusion Matrix
        buildConfusionMatrix(data.confusion_matrix, data.class_names);

    } catch (err) {
        console.error('Metrics load failed:', err);
    }
}


function buildConfusionMatrix(matrix, classNames) {
    const container = document.getElementById('confusionMatrix');
    container.innerHTML = '';

    const n = classNames.length;
    const grid = document.createElement('div');
    grid.className = 'confusion-grid';
    grid.style.gridTemplateColumns = `60px repeat(${n}, 1fr)`;

    // Find max for color scaling
    const maxVal = Math.max(...matrix.flat());

    // Corner cell
    const corner = document.createElement('div');
    corner.className = 'cm-cell cm-corner';
    grid.appendChild(corner);

    // Header row (predicted)
    classNames.forEach(name => {
        const cell = document.createElement('div');
        cell.className = 'cm-cell cm-header';
        cell.textContent = name;
        grid.appendChild(cell);
    });

    // Data rows
    matrix.forEach((row, i) => {
        // Row header (actual)
        const header = document.createElement('div');
        header.className = 'cm-cell cm-header cm-header-y';
        header.textContent = classNames[i];
        grid.appendChild(header);

        row.forEach((val, j) => {
            const cell = document.createElement('div');
            cell.className = 'cm-cell';

            const intensity = maxVal > 0 ? val / maxVal : 0;
            const isDiagonal = i === j;

            if (isDiagonal) {
                cell.style.background = `rgba(16, 185, 129, ${0.1 + intensity * 0.6})`;
                cell.style.color = intensity > 0.4 ? '#ffffff' : '#10b981';
            } else {
                cell.style.background = `rgba(239, 68, 68, ${intensity * 0.5})`;
                cell.style.color = intensity > 0.3 ? '#ffffff' : '#64748b';
            }

            cell.textContent = val;
            cell.title = `Actual: ${classNames[i]}, Predicted: ${classNames[j]}: ${val}`;
            grid.appendChild(cell);
        });
    });

    container.appendChild(grid);
}
