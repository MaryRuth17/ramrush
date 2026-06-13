RAM RUSH v11 — EDIT GUIDE
=========================

WHAT THIS VERSION ADDS
----------------------
1. Play Mode now follows the exact flow:
   START -> PLAY -> ALGORITHM -> STAGE TYPE -> PLAY SCREEN.
2. Stage Type is only for Play Mode.
3. Simulation Mode is unchanged:
   START -> SIMULATION -> ALGORITHM -> WITH/NO COMPACTION -> SIMULATION SCREEN.
4. Play stage memory sizes:
   EASY   = 1 GB  = 1024 MB total memory
   NORMAL = 2 GB  = 2048 MB total memory
   HARD   = 3 GB  = 3072 MB total memory
5. The game still has the 3-second timer.
6. Wrong block = -1 heart.
7. Timeout = current process becomes unprocessed and -1 heart.
8. End screen shows processed and unprocessed processes.
9. Block splitting is still active:
   FREE 300 MB + chrome.exe 180 MB = USED 180 MB + FREE 120 MB.
10. Play Mode compaction prompt only appears if compaction can actually help.

FILES
-----
index.html = screen structure and elements
style.css  = colors, layout, cyberdeck look, memory block visuals
script.js  = game logic, timer, algorithms, compaction, end screen, stage memory

IMPORTANT PARTS TO EDIT
-----------------------

INDEX.HTML
[SCREEN-01] OPENING SCREEN
- First screen with START button.

[SCREEN-02] MODE SELECT SCREEN
- PLAY or SIMULATION selection.

[SCREEN-03] ALGORITHM SELECT SCREEN
- First Fit, Best Fit, Worst Fit.
- Used by both Play and Simulation.

[SCREEN-04] PLAY STAGE TYPE SCREEN
- Easy, Normal, Hard.
- Used only after selecting an algorithm in Play Mode.

[SCREEN-05] SIMULATION COMPACTION CHOICE SCREEN
- With Compaction or No Compaction.
- Used only by Simulation Mode.

[SCREEN-06] PLAY SCREEN
- Timer, hearts, process queue, memory blocks, compaction button.

[SCREEN-07] SIMULATION SCREEN
- Step, Auto Run, and algorithm info only.

SCRIPT.JS
[JS-02] STARTING MEMORY BLOCKS
- Simulation uses this memory template.
- Do not edit this if you want Simulation Mode unchanged.

[JS-02A] PLAY MODE STAGE MEMORY PROFILES
- Edit Play Mode memory sizes here.
- easy = 1024 MB total
- normal = 2048 MB total
- hard = 3072 MB total

[JS-03] PROCESS POOL
- Change process names and sizes.

[JS-04] GAME SETTINGS
- TIME_LIMIT_SECONDS = 3
- MAX_HEARTS = 4
- QUEUE_SIZE = visible queue count
- MAX_PROCESSES_PER_RUN = total processes before run ends

[JS-06] SCREEN NAVIGATION
- Controls switching between screens.

[JS-11] ALGORITHM TARGET FINDERS
- First Fit, Best Fit, Worst Fit logic.

[JS-12] ALLOCATION WITH BLOCK SPLITTING
- This is the first-version system that creates leftover free blocks.

[JS-13] PLAY MODE START / UI UPDATE
- Starts Play Mode after algorithm and stage type are selected.

[JS-14] PLAY MODE TIMER
- The 3-second countdown.

[JS-15] PLAY MODE BLOCK CLICK
- Correct/wrong block checking.

[JS-16] COMPACTION SYSTEM
- Combines all free memory into one block.

[JS-18] SIMULATION MODE START / UI UPDATE
- Shows algorithm info and selected compaction mode.

[JS-19] SIMULATION STEP / AUTO RUN
- Handles Step, Auto Run, and simulation compaction behavior.

[JS-20] END GAME / RESULTS SYSTEM
- Shows processed and unprocessed processes.

STYLE.CSS
[CSS-02] COLOR PALETTE
- Change all game colors.

[CSS-13] MEMORY BLOCKS
- Replace CSS block look with pixel assets later.

ASSET-READY MEMORY BLOCKS
-------------------------
When you create assets, you can add them in CSS like this:

.memory-block.free {
    background-image: url('assets/free_block.png');
    background-size: 100% 100%;
}

.memory-block.used {
    background-image: url('assets/used_block.png');
    background-size: 100% 100%;
}

RECOMMENDED ASSET SIZES
-----------------------
free_block.png          64 x 64 px
used_block.png          64 x 64 px
logo_ram_rush.png       256 x 128 px
heart_full.png          16 x 16 or 32 x 32 px
heart_empty.png         16 x 16 or 32 x 32 px
start_button.png        96 x 32 px
play_button.png         96 x 32 px
simulation_button.png   128 x 32 px
crt_panel.png           640 x 480 px
first_fit.png           32 x 32 px
best_fit.png            32 x 32 px
worst_fit.png           32 x 32 px
compact.png             32 x 32 px

PLAY MODE FLOW
--------------
1. START
2. PLAY
3. Choose Algorithm:
   - First Fit
   - Best Fit
   - Worst Fit
4. Choose Stage Type:
   - Easy = 1 GB
   - Normal = 2 GB
   - Hard = 3 GB
5. Play the timed block-clicking challenge.

PLAY MODE RULES
---------------
1. Look at the current process and process queue.
2. You have 3 seconds to click the correct memory block.
3. Correct block depends on the selected algorithm:
   First Fit = first free block large enough.
   Best Fit = smallest valid free block.
   Worst Fit = largest valid free block.
4. Wrong block = -1 heart.
5. Timeout = process becomes unprocessed and -1 heart.
6. If memory is fragmented/full, compaction alert appears only if compaction can help.
7. End screen shows processed and unprocessed processes.

SIMULATION MODE RULES
---------------------
1. Choose an algorithm.
2. Choose WITH COMPACTION or NO COMPACTION.
3. The simulation screen only shows STEP, AUTO RUN, and algorithm info.
4. If NO COMPACTION is selected, the chosen algorithm stops when no current free block can fit the process.
5. If WITH COMPACTION is selected, the simulator automatically compacts memory only when no single block can fit but total free memory is enough.
6. When the run stops or completes, the results screen shows processed and unprocessed processes.
7. Use TRY ANOTHER ALGORITHM to compare First Fit, Best Fit, and Worst Fit.

IMPORTANT NOTE
--------------
The Easy/Normal/Hard memory size selection affects PLAY MODE ONLY.
Simulation Mode was left unchanged.

=========================================================
NEW IN THIS UPDATE — 3 ADDITIONAL OS TOPICS
=========================================================
A new TOPIC SELECT screen appears after START. It lets the
player choose one of four topics:

1. MEMORY ALLOCATION (the original game — unchanged)
2. CPU SCHEDULING   -> FCFS, SJF, Priority, Round Robin
3. VIRTUAL MEMORY   -> FIFO, LRU, Optimal page replacement
4. DISK SCHEDULING  -> FCFS, SSTF, SCAN, C-SCAN, LOOK

Each new topic has its own algorithm-select screen and its
own simulation screen with STEP / AUTO RUN / RESTART / EXIT.

SCRIPT.JS — NEW SECTIONS
-------------------------
[JS-26] CPU SCHEDULING DATA & ALGORITHMS
- CPU_PROCESSES_TEMPLATE = the 5 example processes
- CPU_QUANTUM = Round Robin time slice (2)
- computeCpuGantt() builds the Gantt chart for each algorithm

[JS-27] CPU SCHEDULING RENDER & CONTROLS
- Renders the process table, Gantt chart, and results
  (completion, turnaround, waiting times, averages)

[JS-28] VIRTUAL MEMORY DATA & ALGORITHMS
- VM_REFERENCE_STRING = the page reference sequence
- VM_FRAME_COUNT = number of memory frames (3)
- findVmVictim() picks which page to evict per algorithm

[JS-29] VIRTUAL MEMORY RENDER & CONTROLS
- Shows the reference string (hit/fault colored), frame
  contents, and final fault/hit ratio

[JS-30] DISK SCHEDULING DATA & ALGORITHMS
- DISK_REQUESTS_TEMPLATE = disk track requests
- DISK_HEAD_START = initial head position (53)
- computeDiskOrder() builds the service order per algorithm

[JS-31] DISK SCHEDULING RENDER & CONTROLS
- Shows requests, a visual disk track line, the service
  order, and total head movement

[JS-32] EVENT LISTENERS — NEW TOPIC SCREENS

INDEX.HTML — NEW SCREENS
-------------------------
[SCREEN-01B] TOPIC SELECT SCREEN
[SCREEN-08]  CPU SCHEDULING ALGORITHM SELECT
[SCREEN-09]  CPU SCHEDULING SIMULATION SCREEN
[SCREEN-10]  VIRTUAL MEMORY ALGORITHM SELECT
[SCREEN-11]  VIRTUAL MEMORY SIMULATION SCREEN
[SCREEN-12]  DISK SCHEDULING ALGORITHM SELECT
[SCREEN-13]  DISK SCHEDULING SIMULATION SCREEN

STYLE.CSS — NEW SECTIONS
-------------------------
[CSS-17] Topic select grid
[CSS-18] Gantt chart blocks (CPU Scheduling)
[CSS-19] Results tables (CPU / VM / Disk)
[CSS-20] Reference string + frame styling (Virtual Memory)
[CSS-21] Disk track line and head marker (Disk Scheduling)

EDITING TIPS
-------------------------
- To change the CPU example processes, edit
  CPU_PROCESSES_TEMPLATE in [JS-26].
- To change the page reference string or frame count, edit
  VM_REFERENCE_STRING / VM_FRAME_COUNT in [JS-28].
- To change the disk requests or starting head position, edit
  DISK_REQUESTS_TEMPLATE / DISK_HEAD_START in [JS-30].
