const fs = require('fs');
const path = require('path');

function main() {
    const screens = [
        'openingScreen', 'topicScreen', 'modeScreen', 'algorithmScreen',
        'playStageTypeScreen', 'simulationCompactionScreen', 'playScreen',
        'simulationScreen', 'cpuAlgorithmScreen', 'cpuScreen',
        'vmAlgorithmScreen', 'vmScreen', 'diskAlgorithmScreen', 'diskScreen'
    ];
    
    const modals = ['compactionModal', 'resultsModal'];

    let fullHtml = '';

    // 1. Head
    fullHtml += fs.readFileSync('partials/head.html', 'utf-8');

    // 2. Screens
    screens.forEach(screen => {
        fullHtml += fs.readFileSync(`partials/screens/${screen}.html`, 'utf-8');
    });

    // 3. Modals
    modals.forEach(modal => {
        fullHtml += fs.readFileSync(`partials/modals/${modal}.html`, 'utf-8');
    });

    // 4. Scripts
    fullHtml += fs.readFileSync('partials/scripts.html', 'utf-8');

    fs.writeFileSync('index.html', fullHtml, 'utf-8');
    console.log("Successfully built index.html from partials!");
}

main();
