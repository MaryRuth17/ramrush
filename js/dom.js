/* =============================================================
   RAM RUSH v11 — SCRIPT.JS
   This file controls the GAME LOGIC.

   EDITING GUIDE:
   - Change memory sizes in [JS-02]
   - Change process names/sizes in [JS-03]
   - Change timer length in [JS-04]
   - Change hearts in [JS-04]
   - Change algorithm behavior in [JS-11]
   - Change compaction in [JS-16]
   - Change simulation stop behavior in [JS-19]
============================================================== */

/* =============================================================
   [JS-01] DOM ELEMENT SHORTCUTS
   These connect JavaScript to HTML elements.
============================================================== */
const screens = {
    opening: document.getElementById('openingScreen'),
    topic: document.getElementById('topicScreen'),
    mode: document.getElementById('modeScreen'),
    algorithm: document.getElementById('algorithmScreen'),
    playStageType: document.getElementById('playStageTypeScreen'),
    play: document.getElementById('playScreen'),
    simulationCompaction: document.getElementById('simulationCompactionScreen'),
    simulation: document.getElementById('simulationScreen'),
    cpuAlgorithm: document.getElementById('cpuAlgorithmScreen'),
    cpu: document.getElementById('cpuScreen'),
    vmAlgorithm: document.getElementById('vmAlgorithmScreen'),
    vm: document.getElementById('vmScreen'),
    diskAlgorithm: document.getElementById('diskAlgorithmScreen'),
    disk: document.getElementById('diskScreen')
};

const startButton = document.getElementById('startButton');
const openPlaySelectButton = document.getElementById('openPlaySelectButton');
const openSimSelectButton = document.getElementById('openSimSelectButton');
const modeBackButton = document.getElementById('modeBackButton');
const algorithmBackButton = document.getElementById('algorithmBackButton');
const algorithmTitle = document.getElementById('algorithmTitle');
const algorithmSubtitle = document.getElementById('algorithmSubtitle');
const simulationSetupSubtitle = document.getElementById('simulationSetupSubtitle');
const playStageSetupSubtitle = document.getElementById('playStageSetupSubtitle');
const playStageBackButton = document.getElementById('playStageBackButton');
const simWithCompactionButton = document.getElementById('simWithCompactionButton');
const simNoCompactionButton = document.getElementById('simNoCompactionButton');
const simSetupBackButton = document.getElementById('simSetupBackButton');

const playStageLabel = document.getElementById('playStageLabel');
const heartDisplay = document.getElementById('heartDisplay');
const playScore = document.getElementById('playScore');
const processedCount = document.getElementById('processedCount');
const unprocessedCount = document.getElementById('unprocessedCount');
const currentProcessText = document.getElementById('currentProcessText');
const timerText = document.getElementById('timerText');
const timerBar = document.getElementById('timerBar');
const playQueueDisplay = document.getElementById('playQueueDisplay');
const playMemoryBlocks = document.getElementById('playMemoryBlocks');
const playRuleText = document.getElementById('playRuleText');
const playMessage = document.getElementById('playMessage');
const playCompactButton = document.getElementById('playCompactButton');
const playRestartButton = document.getElementById('playRestartButton');
const playExitButton = document.getElementById('playExitButton');

const simulationStageLabel = document.getElementById('simulationStageLabel');
const simulationProcessText = document.getElementById('simulationProcessText');
const simulationQueueDisplay = document.getElementById('simulationQueueDisplay');
const simulationMemoryBlocks = document.getElementById('simulationMemoryBlocks');
const simulationStepButton = document.getElementById('simulationStepButton');
const simulationAutoButton = document.getElementById('simulationAutoButton');
const simulationAlgorithmInfo = document.getElementById('simulationAlgorithmInfo');
const simulationCompactionInfo = document.getElementById('simulationCompactionInfo');
const simulationExitButton = document.getElementById('simulationExitButton');
const simulationMessage = document.getElementById('simulationMessage');

const compactionModal = document.getElementById('compactionModal');
const compactionModalText = document.getElementById('compactionModalText');
const confirmCompactionButton = document.getElementById('confirmCompactionButton');
const declineCompactionButton = document.getElementById('declineCompactionButton');

const resultsModal = document.getElementById('resultsModal');
const resultsTitle = document.getElementById('resultsTitle');
const resultsSummary = document.getElementById('resultsSummary');
const processedList = document.getElementById('processedList');
const unprocessedList = document.getElementById('unprocessedList');
const resultsRestartButton = document.getElementById('resultsRestartButton');
const resultsTryAlgorithmButton = document.getElementById('resultsTryAlgorithmButton');
const resultsMenuButton = document.getElementById('resultsMenuButton');

/* =============================================================
   [JS-01B] DOM ELEMENT SHORTCUTS — NEW TOPICS
   CPU Scheduling, Virtual Memory, Disk Scheduling.
============================================================== */
const topicBackButton = document.getElementById('topicBackButton');

const cpuAlgoBackButton = document.getElementById('cpuAlgoBackButton');
const cpuStageLabel = document.getElementById('cpuStageLabel');
const cpuProcessTable = document.getElementById('cpuProcessTable');
const cpuGanttChart = document.getElementById('cpuGanttChart');
const cpuResultsTable = document.getElementById('cpuResultsTable');
const cpuStepButton = document.getElementById('cpuStepButton');
const cpuAutoButton = document.getElementById('cpuAutoButton');
const cpuRestartButton = document.getElementById('cpuRestartButton');
const cpuAlgorithmInfo = document.getElementById('cpuAlgorithmInfo');
const cpuMessage = document.getElementById('cpuMessage');
const cpuExitButton = document.getElementById('cpuExitButton');

const vmAlgoBackButton = document.getElementById('vmAlgoBackButton');
const vmStageLabel = document.getElementById('vmStageLabel');
const vmReferenceRow = document.getElementById('vmReferenceRow');
const vmFrames = document.getElementById('vmFrames');
const vmResultsTable = document.getElementById('vmResultsTable');
const vmStepButton = document.getElementById('vmStepButton');
const vmAutoButton = document.getElementById('vmAutoButton');
const vmRestartButton = document.getElementById('vmRestartButton');
const vmAlgorithmInfo = document.getElementById('vmAlgorithmInfo');
const vmMessage = document.getElementById('vmMessage');
const vmExitButton = document.getElementById('vmExitButton');

const diskAlgoBackButton = document.getElementById('diskAlgoBackButton');
const diskStageLabel = document.getElementById('diskStageLabel');
const diskRequestRow = document.getElementById('diskRequestRow');
const diskTrackLine = document.getElementById('diskTrackLine');
const diskOrderRow = document.getElementById('diskOrderRow');
const diskResultsTable = document.getElementById('diskResultsTable');
const diskStepButton = document.getElementById('diskStepButton');
const diskAutoButton = document.getElementById('diskAutoButton');
const diskRestartButton = document.getElementById('diskRestartButton');
const diskAlgorithmInfo = document.getElementById('diskAlgorithmInfo');
const diskMessage = document.getElementById('diskMessage');
const diskExitButton = document.getElementById('diskExitButton');

