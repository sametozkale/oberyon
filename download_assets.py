#!/usr/bin/env python3
import re
import os
import urllib.request
from pathlib import Path

# Read the index.html file
html_file = Path("endless.design/index.html")
if not html_file.exists():
    print(f"Error: {html_file} not found")
    exit(1)

with open(html_file, 'r', encoding='utf-8') as f:
    html_content = f.read()

# Find all media file references
media_pattern = r'/_next/static/media/[^"\'\s\)]+'
media_files = set(re.findall(media_pattern, html_content))

# Also find font files
font_pattern = r'/_next/static/media/[^"\'\s\)]+\.woff2'
font_files = set(re.findall(font_pattern, html_content))

all_files = media_files | font_files

print(f"Found {len(all_files)} media/font files to download")

# Create media directory
media_dir = Path("endless.design/_next/static/media")
media_dir.mkdir(parents=True, exist_ok=True)

base_url = "https://endless.design"
downloaded = 0
failed = 0

for file_path in sorted(all_files):
    filename = os.path.basename(file_path)
    local_path = media_dir / filename
    
    if local_path.exists():
        print(f"✓ Already exists: {filename}")
        continue
    
    url = f"{base_url}{file_path}"
    try:
        print(f"Downloading: {filename}...", end=" ")
        urllib.request.urlretrieve(url, local_path)
        print("✓")
        downloaded += 1
    except Exception as e:
        print(f"✗ Failed: {e}")
        failed += 1

print(f"\nDownloaded: {downloaded}, Failed: {failed}, Total: {len(all_files)}")

