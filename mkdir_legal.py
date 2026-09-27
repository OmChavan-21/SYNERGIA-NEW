import os

base = r"C:\opencode\SYNERGIA\synergia-pnpm\src\app\(legal)"
dirs = [
    os.path.join(base, "privacy"),
    os.path.join(base, "terms"),
    os.path.join(base, "cookies")
]
for d in dirs:
    os.makedirs(d, exist_ok=True)
print("Legal directories created.")
