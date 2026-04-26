import re

with open(r'C:\Users\M.Hasini\.gemini\antigravity\brain\2ba40e84-9a04-43ad-94dc-9742ba17eca6\.system_generated\steps\114\content.md', 'r', encoding='utf-8') as f:
    text = f.read()

keys = re.findall(r'"hc-key":"([^"]+)"', text)
print("KEYS:", keys)
