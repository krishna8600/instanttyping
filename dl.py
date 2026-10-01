import urllib.request
import json
import os
import time

repo = 'hainguyents13/mechvibes'
path = 'src/audio/nk-cream'
api_url = f'https://api.github.com/repos/{repo}/contents/{path}'

req = urllib.request.Request(api_url)
req.add_header('User-Agent', 'Mozilla/5.0')
try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
    
    out_dir = r'c:\my things\practicetesttyping.com\public\sounds\nk-cream'
    os.makedirs(out_dir, exist_ok=True)
    
    for item in data:
        if item['type'] == 'file' and item['name'].endswith('.wav'):
            file_url = item['download_url']
            file_path = os.path.join(out_dir, item['name'])
            print(f"Downloading {item['name']}...")
            urllib.request.urlretrieve(file_url, file_path)
            time.sleep(0.1)
    
    print('Download complete!')
except Exception as e:
    print('Error:', e)
