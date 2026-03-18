from pathlib import Path

results = []

for file in Path(".").iterdir():
    if file.is_file() and file.suffix.lower() == ".png":
        name = file.name
        if "_" in name:
            extracted = name.split("_", 1)[1].rsplit(".png", 1)[0]
            results.append(extracted)

print(results)
