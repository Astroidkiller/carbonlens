import os
import re

directory = 'c:/Users/yashu/.gemini/antigravity/scratch/CarbonLens/frontend/src/pages'
classes_to_add = " text-gray-900 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 "

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith('.tsx'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            def replacer(match):
                tag = match.group(1)
                inner = match.group(2)
                class_pattern = r'className="([^"]+)"'
                
                def class_replacer(cls_match):
                    existing = cls_match.group(1)
                    if "text-gray-900" not in existing:
                        return f'className="{existing}{classes_to_add}"'
                    return cls_match.group(0)
                
                new_inner = re.sub(class_pattern, class_replacer, inner)
                return f'<{tag}{new_inner}>'
            
            new_content = re.sub(r'<(input|select|textarea)([^>]+)>', replacer, content)
            
            if new_content != content:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {file}")
