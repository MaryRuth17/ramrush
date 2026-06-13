const fs = require('fs');
const path = require('path');

function getSection(content, startPattern, endPattern, startIsExact = false, searchBackwardFrom = null) {
    let startIdx = content.indexOf(startPattern);
    if (startIdx === -1) return '';

    if (!startIsExact) {
        // Try to include the preceding comment
        const commentStart = content.lastIndexOf('<!-- ===', startIdx);
        if (commentStart !== -1 && (startIdx - commentStart) < 500) {
            startIdx = commentStart;
        }
    }

    let endIdx;
    if (endPattern === '<!-- [HTML-END]') {
        endIdx = content.indexOf(endPattern, startIdx);
    } else {
        endIdx = content.indexOf(endPattern, startIdx);
        if (endIdx !== -1) {
            endIdx += endPattern.length;
        }
    }

    if (endIdx === -1) {
        endIdx = content.length;
    }

    return content.substring(startIdx, endIdx);
}

function main() {
    const content = fs.readFileSync('index.html', 'utf-8');

    fs.mkdirSync('partials', { recursive: true });
    fs.mkdirSync('partials/screens', { recursive: true });
    fs.mkdirSync('partials/modals', { recursive: true });

    // 1. Head
    const headEnd = content.indexOf('<section id="openingScreen"');
    const headContent = content.substring(0, headEnd);
    fs.writeFileSync('partials/head.html', headContent, 'utf-8');

    // 2. Screens
    const screens = [
        'openingScreen', 'topicScreen', 'modeScreen', 'algorithmScreen',
        'playStageTypeScreen', 'simulationCompactionScreen', 'playScreen',
        'simulationScreen', 'cpuAlgorithmScreen', 'cpuScreen',
        'vmAlgorithmScreen', 'vmScreen', 'diskAlgorithmScreen', 'diskScreen'
    ];

    screens.forEach(screen => {
        const startPattern = `<section id="${screen}"`;
        const endPattern = '</section>';
        const screenContent = getSection(content, startPattern, endPattern) + '\n\n';
        fs.writeFileSync(`partials/screens/${screen}.html`, screenContent, 'utf-8');
    });

    // 3. Modals
    const modals = ['compactionModal', 'resultsModal'];
    modals.forEach(modal => {
        const startPattern = `<div id="${modal}"`;
        let modalContent = '';
        
        let startIdx = content.indexOf(startPattern);
        if (startIdx !== -1) {
            const commentStart = content.lastIndexOf('<!-- ===', startIdx);
            if (commentStart !== -1 && (startIdx - commentStart) < 500) {
                startIdx = commentStart;
            }
            
            let endIdx;
            if (modal === 'compactionModal') {
                const nextStart = content.indexOf('<div id="resultsModal"', startIdx);
                const nextComment = content.lastIndexOf('<!-- ===', nextStart);
                endIdx = nextComment !== -1 ? nextComment : nextStart;
            } else {
                endIdx = content.indexOf('<!-- [HTML-END]', startIdx);
            }
            
            modalContent = content.substring(startIdx, endIdx).trim() + '\n\n';
        }
        
        fs.writeFileSync(`partials/modals/${modal}.html`, modalContent, 'utf-8');
    });

    // 4. Scripts
    const scriptsStart = content.indexOf('<!-- [HTML-END]');
    const scriptsContent = content.substring(scriptsStart);
    fs.writeFileSync('partials/scripts.html', scriptsContent, 'utf-8');

    console.log("Successfully split index.html into partials!");
}

main();
