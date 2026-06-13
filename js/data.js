/* =============================================================
   [JS-02] STARTING MEMORY BLOCKS
   These are the blocks shown at the start.
   The game SPLITS a block when leftover memory remains.
============================================================== */
const STARTING_MEMORY = [
    { size: 120, used: false, processName: null, usedSize: 0 },
    { size: 200, used: false, processName: null, usedSize: 0 },
    { size: 300, used: false, processName: null, usedSize: 0 },
    { size: 150, used: false, processName: null, usedSize: 0 },
    { size: 250, used: false, processName: null, usedSize: 0 }
];

/* =============================================================
   [JS-02A] PLAY MODE STAGE MEMORY PROFILES
   These are used ONLY in Play Mode.
   Simulation still uses STARTING_MEMORY and is not changed.

   EASY   = 1 GB = 1024 MB total memory
   NORMAL = 2 GB = 2048 MB total memory
   HARD   = 3 GB = 3072 MB total memory
============================================================== */
const PLAY_MEMORY_PROFILES = {
    easy: [
        { size: 128, used: false, processName: null, usedSize: 0 },
        { size: 256, used: false, processName: null, usedSize: 0 },
        { size: 256, used: false, processName: null, usedSize: 0 },
        { size: 384, used: false, processName: null, usedSize: 0 }
    ],
    normal: [
        { size: 256, used: false, processName: null, usedSize: 0 },
        { size: 384, used: false, processName: null, usedSize: 0 },
        { size: 512, used: false, processName: null, usedSize: 0 },
        { size: 384, used: false, processName: null, usedSize: 0 },
        { size: 512, used: false, processName: null, usedSize: 0 }
    ],
    hard: [
        { size: 512, used: false, processName: null, usedSize: 0 },
        { size: 512, used: false, processName: null, usedSize: 0 },
        { size: 768, used: false, processName: null, usedSize: 0 },
        { size: 640, used: false, processName: null, usedSize: 0 },
        { size: 640, used: false, processName: null, usedSize: 0 }
    ]
};

/* =============================================================
   [JS-03] PROCESS POOL
   Realistic process names. Edit this list to add/remove processes.
   size = memory requirement in MB.
============================================================== */
const PROCESS_POOL = [
    { name: 'chrome.exe', size: 180 },
    { name: 'discord.exe', size: 95 },
    { name: 'spotify.exe', size: 80 },
    { name: 'code.exe', size: 140 },
    { name: 'photoshop.exe', size: 260 },
    { name: 'steam.exe', size: 210 },
    { name: 'valorant.exe', size: 280 },
    { name: 'blender.exe', size: 240 },
    { name: 'obs64.exe', size: 160 },
    { name: 'teams.exe', size: 130 },
    { name: 'notepad.exe', size: 40 },
    { name: 'python.exe', size: 115 },
    { name: 'xampp.exe', size: 170 },
    { name: 'figma.exe', size: 155 },
    { name: 'unity.exe', size: 290 },
    { name: 'explorer.exe', size: 60 }
];

/* =============================================================
   [JS-04] GAME SETTINGS
   TIME_LIMIT_SECONDS = how long player has to think.
   MAX_HEARTS = player life count.
   QUEUE_SIZE = visible process queue size.
   MAX_PROCESSES_PER_RUN = better end condition: run ends after this many
   total processes are generated, then unprocessed are shown.
============================================================== */
const TIME_LIMIT_SECONDS = 3;
const MAX_HEARTS = 4;
const QUEUE_SIZE = 4;
const MAX_PROCESSES_PER_RUN = 14;

