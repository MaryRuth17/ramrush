import os
import re

with open('style.css', 'r', encoding='utf-8') as f:
    content = f.read()

# Define boundaries
boundaries = {
    'variables': (content.find('/* ===', content.find('[CSS-02]')), content.find('/* ===', content.find('[CSS-03]'))),
    'base': (content.find('/* ===', content.find('[CSS-01]')), content.find('/* ===', content.find('[CSS-06]'))),
    'screens': (content.find('/* ===', content.find('[CSS-06]')), content.find('/* ===', content.find('[CSS-09]'))),
    'components': (content.find('/* ===', content.find('[CSS-09]')), content.find('/* ===', content.find('[CSS-17]'))),
    'topics': (content.find('/* ===', content.find('[CSS-17]')), len(content))
}

# The variables actually goes from [CSS-02] up to [CSS-03], wait, I can just slice manually
def get_section(start_idx, end_idx):
    if end_idx == -1:
        end_idx = len(content)
    return content[start_idx:end_idx]

# Wait, CSS-01 is before CSS-02, so base includes CSS-01, CSS-03, 04, 05
variables_content = get_section(content.find('/* ===', content.find('[CSS-02]') - 100), content.find('/* ===', content.find('[CSS-03]') - 100))
base_content = get_section(content.find('/* ===', content.find('[CSS-01]') - 100), content.find('/* ===', content.find('[CSS-02]') - 100)) + get_section(content.find('/* ===', content.find('[CSS-03]') - 100), content.find('/* ===', content.find('[CSS-06]') - 100))
screens_content = get_section(content.find('/* ===', content.find('[CSS-06]') - 100), content.find('/* ===', content.find('[CSS-09]') - 100))
components_content = get_section(content.find('/* ===', content.find('[CSS-09]') - 100), content.find('/* ===', content.find('[CSS-17]') - 100))
topics_content = get_section(content.find('/* ===', content.find('[CSS-17]') - 100), len(content))

with open('css/variables.css', 'w', encoding='utf-8') as f:
    f.write(variables_content)
with open('css/base.css', 'w', encoding='utf-8') as f:
    f.write(base_content)
with open('css/screens.css', 'w', encoding='utf-8') as f:
    f.write(screens_content)
with open('css/components.css', 'w', encoding='utf-8') as f:
    f.write(components_content)
with open('css/topics.css', 'w', encoding='utf-8') as f:
    f.write(topics_content)

main_css = '''@import 'variables.css';
@import 'base.css';
@import 'screens.css';
@import 'components.css';
@import 'topics.css';
'''
with open('css/main.css', 'w', encoding='utf-8') as f:
    f.write(main_css)

print("CSS split successful.")
