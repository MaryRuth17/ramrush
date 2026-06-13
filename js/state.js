/* =============================================================
   [JS-05] GAME STATE
   These variables change while the game runs.
============================================================== */
let selectedMode = null;          // 'play' or 'simulation'
let selectedAlgorithm = null;     // 'firstFit', 'bestFit', or 'worstFit'
let selectedStageType = null;      // Play only: 'easy', 'normal', or 'hard'
let simulationUseCompaction = false; // true only if user selects WITH COMPACTION before simulation starts

let memory = [];
let processQueue = [];
let processedProcesses = [];
let unprocessedProcesses = [];

let hearts = MAX_HEARTS;
let score = 0;
let generatedProcessCount = 0;
let isRoundLocked = false;

let timerInterval = null;
let timerRemaining = TIME_LIMIT_SECONDS;

let simulationAutoInterval = null;
let pendingCompactionContext = null; // Play mode only for automatic prompts. Simulation compaction is optional button only.

