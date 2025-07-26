// Global variables
let codeEditor;
let currentChallengeId = 'caesar_cipher';
let currentTestCases = [];
let challengeOrder = Object.keys(window.CHALLENGES_DATA);

// Initialize the application
// (Assume dashboard and challenge views are both present in index.html)
document.addEventListener('DOMContentLoaded', function() {
    setupDashboard();
    initializeCodeEditor();
    setupEventListeners();
    loadChallenge(currentChallengeId);
});

// Setup dashboard cards and navigation
function setupDashboard() {
    const dashboardDiv = document.getElementById('dashboardView');
    let html = '';
    challengeOrder.forEach(challengeId => {
        const c = window.CHALLENGES_DATA[challengeId];
        html += `
        <div class="challenge-card ${getDifficultyClass(c.difficulty)}">
            <h3 class="challenge-title">${c.title}</h3>
            <div class="challenge-meta">
                <span class="badge-difficulty badge-${c.difficulty.toLowerCase()}">${c.difficulty}</span>
                <span class="badge-marks">${c.marks}</span>
            </div>
            <p class="challenge-description">${c.description}</p>
            <button class="btn start-btn" onclick="showChallenge('${challengeId}')">
                <i class="fas fa-play me-2"></i>Start Challenge
            </button>
        </div>`;
    });
    dashboardDiv.innerHTML = `<div class="challenge-grid">${html}</div>`;
}

function getDifficultyClass(difficulty) {
    switch (difficulty.toLowerCase()) {
        case 'easy': return 'easy';
        case 'medium': return 'medium';
        case 'hard': return 'hard';
        default: return '';
    }
}

// Show challenge view
window.showChallenge = function(challengeId) {
    currentChallengeId = challengeId;
    document.getElementById('dashboardView').style.display = 'none';
    document.getElementById('challengeView').style.display = '';
    loadChallenge(challengeId);
};

// Show dashboard view
window.showDashboard = function() {
    document.getElementById('dashboardView').style.display = '';
    document.getElementById('challengeView').style.display = 'none';
};

// Initialize CodeMirror editor
function initializeCodeEditor() {
    const textarea = document.getElementById('codeEditor');
    codeEditor = CodeMirror.fromTextArea(textarea, {
        mode: 'python',
        theme: 'material-darker',
        lineNumbers: true,
        indentUnit: 4,
        indentWithTabs: false,
        matchBrackets: true,
        autoCloseBrackets: true,
        lineWrapping: false,
        extraKeys: {
            "Ctrl-Space": "autocomplete",
            "Ctrl-/": "toggleComment",
            "F11": function(cm) {
                cm.setOption("fullScreen", !cm.getOption("fullScreen"));
            },
            "Esc": function(cm) {
                if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
            }
        }
    });
    codeEditor.setSize(null, "100%");
    window.addEventListener('resize', function() { codeEditor.refresh(); });
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('runCode').addEventListener('click', function() {
        showTestInputModal();
    });
    document.getElementById('executeTestCases').addEventListener('click', function() {
        executeAllTestCases();
    });
    document.getElementById('executeWithInput').addEventListener('click', function() {
        const input = document.getElementById('testInput').value.replace(/\r?\n/g, '\n');
        executeCode(input);
        bootstrap.Modal.getInstance(document.getElementById('testInputModal')).hide();
    });
    document.getElementById('copyCode').addEventListener('click', function() {
        copyCodeToEditor();
    });
    document.getElementById('nextChallenge').addEventListener('click', function() {
        loadNextChallenge();
    });
    document.getElementById('previousChallenge').addEventListener('click', function() {
        loadPreviousChallenge();
    });
    // Back to dashboard
    document.querySelectorAll('.btn.btn-outline-secondary').forEach(btn => {
        btn.addEventListener('click', showDashboard);
    });
}

// Show test input modal
function showTestInputModal() {
    const modal = new bootstrap.Modal(document.getElementById('testInputModal'));
    document.getElementById('testInput').value = '';
    modal.show();
}

// Load challenge data and update UI
function loadChallenge(challengeId) {
    const problemData = window.CHALLENGES_DATA[challengeId];
    if (!problemData) return;
    // Update UI fields
    document.getElementById('challengeTitle').textContent = problemData.title;
    document.getElementById('challengeDifficulty').textContent = problemData.difficulty;
    document.getElementById('challengeDifficulty').className = `badge bg-${getDifficultyClass(problemData.difficulty)} me-2`;
    document.getElementById('challengeMarks').textContent = problemData.marks;
    document.title = `${problemData.title} - Python Code Editor`;
    document.getElementById('problemDescription').textContent = problemData.description;
    // How it works
    const howList = document.getElementById('howItWorksList');
    howList.innerHTML = '';
    problemData.how_it_works.forEach(step => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fas fa-check-circle text-success me-2"></i>${step}`;
        howList.appendChild(li);
    });
    // Examples
    const examplesList = document.getElementById('examplesList');
    examplesList.innerHTML = '';
    problemData.examples.forEach(example => {
        const div = document.createElement('div');
        div.className = 'example-card mb-3';
        div.innerHTML = `<div class="input-example"><strong class="text-primary">Input:</strong> ${example.input}</div><div class="output-example"><strong class="text-success">Output:</strong> ${example.output}</div>`;
        examplesList.appendChild(div);
    });
    // Solution tab
    document.getElementById('solutionTitle').textContent = `Solution for ${problemData.title} - ${problemData.marks}`;
    document.getElementById('solutionCode').textContent = problemData.starter_code;
    // Editor
    if (codeEditor) codeEditor.setValue(problemData.starter_code);
    // Test cases
    currentTestCases = problemData.test_cases || [];
}

// Load next/previous challenge
function loadNextChallenge() {
    let idx = challengeOrder.indexOf(currentChallengeId);
    idx = (idx + 1) % challengeOrder.length;
    showChallenge(challengeOrder[idx]);
}
function loadPreviousChallenge() {
    let idx = challengeOrder.indexOf(currentChallengeId);
    idx = (idx - 1 + challengeOrder.length) % challengeOrder.length;
    showChallenge(challengeOrder[idx]);
}

// Execute code with given input using Piston API
function executeCode(input = '') {
    const code = codeEditor.getValue();
    if (!code.trim()) {
        showMessage('Please write some code first!', 'warning');
        return;
    }
    clearErrorHighlighting();
    const outputDiv = document.getElementById('executionOutput');
    outputDiv.innerHTML = '<div class="loading">Executing code...</div>';
    document.getElementById('output-tab').click();
    // Piston API call
    fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            language: 'python3',
            source: code,
            stdin: input
        })
    })
    .then(response => response.json())
    .then(data => {
        displayPistonResult(data);
    })
    .catch(error => {
        outputDiv.innerHTML = `<div class="output-error">Network error: ${error.message}</div>`;
    });
}

// Display Piston API result
function displayPistonResult(result) {
    const outputDiv = document.getElementById('executionOutput');
    const errorDiv = document.getElementById('errorOutput');
    if (result.run && result.run.code === 0) {
        outputDiv.innerHTML = `<div class="output-success">${escapeHtml(result.run.output) || 'Code executed successfully (no output)'}</div>`;
        errorDiv.innerHTML = '<div class="text-muted">No errors to display</div>';
        document.getElementById('output-tab').click();
    } else {
        outputDiv.innerHTML = '<div class="text-muted">Code execution failed</div>';
        errorDiv.innerHTML = `<div class="output-error">${escapeHtml(result.run ? result.run.stderr : 'Unknown error')}</div>`;
        document.getElementById('errors-tab').click();
    }
}

// Execute all test cases using Piston API
function executeAllTestCases() {
    if (currentTestCases.length === 0) {
        showMessage('No test cases available', 'warning');
        return;
    }
    const outputDiv = document.getElementById('executionOutput');
    outputDiv.innerHTML = '<div class="loading">Running test cases...</div>';
    document.getElementById('output-tab').click();
    const code = codeEditor.getValue();
    let results = [];
    let completed = 0;
    currentTestCases.forEach((testCase, idx) => {
        fetch('https://emkc.org/api/v2/piston/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                language: 'python3',
                source: code,
                stdin: testCase.input
            })
        })
        .then(response => response.json())
        .then(data => {
            let output = (data.run && data.run.output) ? data.run.output.trim() : '';
            let expected = testCase.expected_output.trim();
            let passed = expected && output.toLowerCase().includes(expected.toLowerCase());
            results[idx] = {
                name: testCase.name,
                passed: passed,
                output: output,
                expected: expected,
                error: (data.run && data.run.code !== 0) ? (data.run.stderr || 'Error') : null
            };
            completed++;
            if (completed === currentTestCases.length) {
                displayClientTestResults(results);
            }
        })
        .catch(error => {
            results[idx] = {
                name: testCase.name,
                passed: false,
                output: '',
                expected: testCase.expected_output,
                error: 'Network error: ' + error.message
            };
            completed++;
            if (completed === currentTestCases.length) {
                displayClientTestResults(results);
            }
        });
    });
}

// Display test results (client-side)
function displayClientTestResults(results) {
    const outputDiv = document.getElementById('executionOutput');
    let html = '<div class="test-results">';
    let passedCount = 0;
    results.forEach((testResult, index) => {
        if (testResult.passed) passedCount++;
        html += `
            <div class="test-case-result ${testResult.passed ? 'success' : 'failure'}">
                <div class="test-case-name">${testResult.name} ${testResult.passed ? '✓' : '✗'}</div>
                <div class="test-case-details">
                    <strong>Expected:</strong> ${escapeHtml(testResult.expected)}<br>
                    <strong>Got:</strong> ${testResult.error ? `Error: ${escapeHtml(testResult.error)}` : escapeHtml(testResult.output)}
                </div>
            </div>
        `;
    });
    html += `</div><div class="mt-3"><strong>Results: ${passedCount}/${results.length} tests passed</strong></div>`;
    outputDiv.innerHTML = html;
}

// Copy code to editor
function copyCodeToEditor() {
    const solutionCode = document.querySelector('#solutionCode').textContent;
    codeEditor.setValue(solutionCode);
    showMessage('Code copied to editor!', 'success');
}

// Highlight error line (not supported by Piston, so just clear)
function highlightErrorLine(lineNumber) { clearErrorHighlighting(); }
function clearErrorHighlighting() {
    if (!codeEditor) return;
    const totalLines = codeEditor.lineCount();
    for (let i = 0; i < totalLines; i++) {
        codeEditor.removeLineClass(i, 'background', 'error-line');
        codeEditor.setGutterMarker(i, 'CodeMirror-linenumbers', null);
    }
}

// Show message to user
function showMessage(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `alert alert-${type === 'success' ? 'success' : type === 'warning' ? 'warning' : type === 'error' ? 'danger' : 'info'} position-fixed`;
    toast.style.cssText = 'top: 70px; right: 20px; z-index: 9999; min-width: 300px;';
    toast.innerHTML = `
        ${message}
        <button type="button" class="btn-close float-end" onclick="this.parentElement.remove()"></button>
    `;
    document.body.appendChild(toast);
    setTimeout(() => { if (toast.parentElement) toast.remove(); }, 3000);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Keyboard shortcuts
// Ctrl+Enter or Cmd+Enter to run code
// Ctrl+S or Cmd+S to save (show info)
document.addEventListener('keydown', function(event) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        showTestInputModal();
    }
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        showMessage('Auto-save feature coming soon!', 'info');
    }
});
