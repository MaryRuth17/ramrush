import os
import re

with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace state variables with state.varName
state_vars = [
    'selectedMode', 'selectedAlgorithm', 'selectedStageType', 'simulationUseCompaction',
    'memory', 'processQueue', 'processedProcesses', 'unprocessedProcesses',
    'hearts', 'score', 'generatedProcessCount', 'isRoundLocked',
    'timerInterval', 'timerRemaining', 'simulationAutoInterval', 'pendingCompactionContext',
    'cpuAlgorithm', 'cpuGantt', 'cpuRevealed', 'cpuAutoInterval',
    'vmAlgorithm', 'vmFrameSlots', 'vmFifoOrder', 'vmRecency', 'vmIndex',
    'vmFaults', 'vmHits', 'vmLog', 'vmAutoInterval',
    'diskAlgorithm', 'diskOrder', 'diskRevealed', 'diskAutoInterval'
]

# We must avoid replacing memory inside 'memoryTemplate' or 'STARTING_MEMORY', etc.
# Using word boundaries
for var in state_vars:
    content = re.sub(rf'\b{var}\b', f'state.{var}', content)

# Remove the 'let state.selectedMode = null;' lines
# since they will be moved to state.js
content = re.sub(r'let state\.[a-zA-Z0-9_]+\s*=\s*[^;]+;\n?', '', content)

# Now extract sections to write to different files
def get_section(start_marker, end_marker=None):
    start_idx = content.find(start_marker)
    if end_marker:
        end_idx = content.find(end_marker, start_idx)
        if end_idx == -1: end_idx = len(content)
        return content[start_idx:end_idx]
    return content[start_idx:]

dom_code = get_section('/* ===', '/* ===\n   [JS-02]')
data_code = get_section('/* ===\n   [JS-02]', '/* ===\n   [JS-05]') + \
            get_section('/* ===\n   [JS-26]', 'let state.cpuAlgorithm') + \
            get_section('/* ===\n   [JS-28]', 'let state.vmAlgorithm') + \
            get_section('/* ===\n   [JS-30]', 'let state.diskAlgorithm')

# The remaining code goes to main.js, we will also extract memory, cpu, vm, disk logic
# Wait, for simplicity, I'll put everything else in main.js, and just separate DOM, Data, State
# But the plan says: dom.js, state.js, data.js, memory.js, cpu.js, vm.js, disk.js, main.js.

cpu_code = get_section('function getCpuAlgoLabel', '/* ===\n   [JS-28]')
vm_code = get_section('function getVmAlgoLabel', '/* ===\n   [JS-30]')
disk_code = get_section('function getDiskAlgoLabel', '/* ===\n   [JS-32]')

memory_code = get_section('/* ===\n   [JS-11]', '/* ===\n   [JS-13]') + get_section('/* ===\n   [JS-16]', '/* ===\n   [JS-17]')

main_code = get_section('/* ===\n   [JS-06]', '/* ===\n   [JS-11]') + \
            get_section('/* ===\n   [JS-13]', '/* ===\n   [JS-16]') + \
            get_section('/* ===\n   [JS-17]', '/* ===\n   [JS-26]') + \
            get_section('/* ===\n   [JS-32]')

state_code = f"""export const state = {{
    selectedMode: null,
    selectedAlgorithm: null,
    selectedStageType: null,
    simulationUseCompaction: false,
    memory: [],
    processQueue: [],
    processedProcesses: [],
    unprocessedProcesses: [],
    hearts: {content.find('MAX_HEARTS') and 4},
    score: 0,
    generatedProcessCount: 0,
    isRoundLocked: false,
    timerInterval: null,
    timerRemaining: 3,
    simulationAutoInterval: null,
    pendingCompactionContext: null,
    cpuAlgorithm: null,
    cpuGantt: [],
    cpuRevealed: 0,
    cpuAutoInterval: null,
    vmAlgorithm: null,
    vmFrameSlots: [],
    vmFifoOrder: [],
    vmRecency: [],
    vmIndex: 0,
    vmFaults: 0,
    vmHits: 0,
    vmLog: [],
    vmAutoInterval: null,
    diskAlgorithm: null,
    diskOrder: [],
    diskRevealed: 0,
    diskAutoInterval: null
}};
"""

# Now write them without complex export/import injection:
# Wait, ES modules REQUIRE imports to access variables from other files.
# If `main.js` uses `state`, it must import `state` from `state.js`.
# If `main.js` uses `STARTING_MEMORY`, it must import from `data.js`.
# This is extremely tedious to wire up dynamically.

# Alternative: expose everything to window.
# In dom.js: window.screens = { ... }; window.startButton = ...
# In data.js: window.STARTING_MEMORY = ...
# Then we just include them as module scripts or normal scripts.
"""
We can just use standard script tags in HTML and NOT use ES modules.
But the user approved ES modules.
To make ES modules work easily without a bundler, we attach shared globals to `window`.
"""
