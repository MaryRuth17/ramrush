import os
import re

def main():
    with open('index.html', 'r', encoding='utf-8') as f:
        content = f.read()

    os.makedirs('partials', exist_ok=True)
    os.makedirs('partials/screens', exist_ok=True)
    os.makedirs('partials/modals', exist_ok=True)

    # We will use regex to find sections.
    # But it might be safer to manually split by the comment blocks.
    # The comment blocks look like:
    # <!-- =============================================================
    #      [SCREEN-01B] TOPIC SELECT SCREEN ...
    
    # Let's define the parts we want to extract
    
    # 1. Head
    head_end = content.find('<section id="openingScreen"')
    head_content = content[:head_end]
    with open('partials/head.html', 'w', encoding='utf-8') as f:
        f.write(head_content)
        
    # List of screens to extract
    screens = [
        'openingScreen', 'topicScreen', 'modeScreen', 'algorithmScreen',
        'playStageTypeScreen', 'simulationCompactionScreen', 'playScreen',
        'simulationScreen', 'cpuAlgorithmScreen', 'cpuScreen',
        'vmAlgorithmScreen', 'vmScreen', 'diskAlgorithmScreen', 'diskScreen'
    ]
    
    for screen in screens:
        start_pattern = f'<section id="{screen}"'
        start_idx = content.find(start_pattern)
        
        # To get the preceding comment, find the previous <!-- ===
        comment_start = content.rfind('<!-- ===', 0, start_idx)
        if comment_start != -1 and (start_idx - comment_start) < 500:
            start_idx = comment_start
            
        end_pattern = '</section>'
        end_idx = content.find(end_pattern, start_idx) + len(end_pattern)
        
        screen_content = content[start_idx:end_idx] + '\n\n'
        with open(f'partials/screens/{screen}.html', 'w', encoding='utf-8') as f:
            f.write(screen_content)

    # Extract Modals
    modals = ['compactionModal', 'resultsModal']
    for modal in modals:
        start_pattern = f'<div id="{modal}"'
        start_idx = content.find(start_pattern)
        
        comment_start = content.rfind('<!-- ===', 0, start_idx)
        if comment_start != -1 and (start_idx - comment_start) < 500:
            start_idx = comment_start
            
        # Modals end with their closing </div>. Wait, they have nested divs.
        # We can find the next <!-- === or <!-- [HTML-END]
        if modal == 'compactionModal':
            next_start = content.find('<div id="resultsModal"', start_idx)
            next_comment = content.rfind('<!-- ===', 0, next_start)
            end_idx = next_comment if next_comment != -1 else next_start
        else:
            end_idx = content.find('<!-- [HTML-END]')
            
        modal_content = content[start_idx:end_idx].strip() + '\n\n'
        with open(f'partials/modals/{modal}.html', 'w', encoding='utf-8') as f:
            f.write(modal_content)

    # Scripts
    scripts_start = content.find('<!-- [HTML-END]')
    scripts_content = content[scripts_start:]
    with open('partials/scripts.html', 'w', encoding='utf-8') as f:
        f.write(scripts_content)
        
    print("Successfully split index.html into partials!")

if __name__ == "__main__":
    main()
