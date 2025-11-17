#!/usr/bin/env python3
"""
Comprehensive script to clone endless.design with all assets
"""
import os
import urllib.request
import urllib.error
from urllib.parse import urljoin, urlparse
import re
from pathlib import Path
import json

def download_file(url, filepath, retries=3):
    """Download a file from URL to filepath with retries"""
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            })
            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            with urllib.request.urlopen(req, timeout=30) as response:
                with open(filepath, 'wb') as f:
                    f.write(response.read())
            return True
        except Exception as e:
            if attempt == retries - 1:
                print(f"  ✗ Failed after {retries} attempts: {e}")
                return False
            print(f"  ⚠ Retry {attempt + 1}/{retries}...")
    return False

def extract_assets(html_content, base_url):
    """Extract all asset URLs from HTML"""
    assets = {
        'css': set(),
        'js': set(),
        'images': set(),
        'fonts': set(),
        'media': set()
    }
    
    # CSS files
    css_pattern = r'href=["\']([^"\']*\.css[^"\']*)["\']'
    for match in re.finditer(css_pattern, html_content):
        url = match.group(1)
        if url.startswith('/') or url.startswith('http'):
            assets['css'].add(urljoin(base_url, url) if not url.startswith('http') else url)
    
    # JS files
    js_pattern = r'src=["\']([^"\']*\.js[^"\']*)["\']'
    for match in re.finditer(js_pattern, html_content):
        url = match.group(1)
        if url.startswith('/') or url.startswith('http'):
            assets['js'].add(urljoin(base_url, url) if not url.startswith('http') else url)
    
    # Images (including data URLs and srcset)
    img_pattern = r'src=["\']([^"\']*\.(?:jpg|jpeg|png|gif|svg|webp)[^"\']*)["\']'
    for match in re.finditer(img_pattern, html_content, re.IGNORECASE):
        url = match.group(1)
        if url.startswith('/') or url.startswith('http'):
            assets['images'].add(urljoin(base_url, url) if not url.startswith('http') else url)
    
    # Fonts - also check preload links
    font_pattern = r'href=["\']([^"\']*\.(?:woff2|woff|ttf|otf)[^"\']*)["\']'
    for match in re.finditer(font_pattern, html_content, re.IGNORECASE):
        url = match.group(1)
        if url.startswith('/') or url.startswith('http'):
            assets['fonts'].add(urljoin(base_url, url) if not url.startswith('http') else url)
    
    # Fonts from preload tags
    preload_pattern = r'href=["\']([^"\']*\.woff2[^"\']*)["\']'
    for match in re.finditer(preload_pattern, html_content, re.IGNORECASE):
        url = match.group(1)
        if url.startswith('/') or url.startswith('http'):
            assets['fonts'].add(urljoin(base_url, url) if not url.startswith('http') else url)
    
    # Media files from _next/static/media - more comprehensive pattern
    media_pattern = r'/_next/static/media/[^"\'\s\)\]]+'
    for match in re.finditer(media_pattern, html_content):
        url = match.group(0)
        # Clean up the URL
        url = url.rstrip('\\').rstrip('"').rstrip("'")
        assets['media'].add(urljoin(base_url, url))
    
    # Also check for media in JSON-like structures in script tags
    script_pattern = r'<script[^>]*>(.*?)</script>'
    for match in re.finditer(script_pattern, html_content, re.DOTALL):
        script_content = match.group(1)
        # Look for media URLs in script content
        media_in_script = re.findall(r'/_next/static/media/[^"\'\s\)\]]+', script_content)
        for url in media_in_script:
            url = url.rstrip('\\').rstrip('"').rstrip("'")
            assets['media'].add(urljoin(base_url, url))
    
    return assets

def clone_website():
    base_url = "https://endless.design"
    output_dir = "endless.design"
    
    print("=" * 60)
    print("Cloning endless.design website")
    print("=" * 60)
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Download main HTML
    print("\n[1/4] Downloading main page...")
    try:
        req = urllib.request.Request(base_url, headers={
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        })
        with urllib.request.urlopen(req, timeout=30) as response:
            html_content = response.read().decode('utf-8')
        
        # Save HTML
        with open(f"{output_dir}/index.html", 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        print(f"✓ Saved HTML ({len(html_content):,} bytes)")
    except Exception as e:
        print(f"✗ Error downloading main page: {e}")
        return
    
    # Extract assets
    print("\n[2/4] Extracting assets...")
    assets = extract_assets(html_content, base_url)
    print(f"✓ Found {len(assets['css'])} CSS, {len(assets['js'])} JS, {len(assets['images'])} images, {len(assets['fonts'])} fonts, {len(assets['media'])} media files")
    
    # Download CSS files
    print("\n[3/4] Downloading CSS files...")
    for i, url in enumerate(sorted(assets['css']), 1):
        parsed = urlparse(url)
        filepath = os.path.join(output_dir, parsed.path.lstrip('/'))
        if filepath.endswith('.css') or '/css/' in filepath:
            print(f"  [{i}/{len(assets['css'])}] {os.path.basename(filepath)}...", end=" ")
            if download_file(url, filepath):
                print("✓")
    
    # Download JS files
    print("\n[3/4] Downloading JS files...")
    for i, url in enumerate(sorted(assets['js']), 1):
        parsed = urlparse(url)
        filepath = os.path.join(output_dir, parsed.path.lstrip('/'))
        if filepath.endswith('.js') or '/chunks/' in filepath or '/static/' in filepath:
            print(f"  [{i}/{len(assets['js'])}] {os.path.basename(filepath)}...", end=" ")
            if download_file(url, filepath):
                print("✓")
    
    # Download media files (fonts, images from _next/static/media)
    print("\n[4/4] Downloading media files (fonts, images)...")
    all_media = assets['fonts'] | assets['media'] | assets['images']
    downloaded_count = 0
    for i, url in enumerate(sorted(all_media), 1):
        parsed = urlparse(url)
        filepath = os.path.join(output_dir, parsed.path.lstrip('/'))
        # Only download from endless.design domain or relative paths
        if 'endless.design' in url or url.startswith('/'):
            # Skip if already exists
            if os.path.exists(filepath):
                print(f"  [{i}/{len(all_media)}] {os.path.basename(filepath)}... (exists)")
                downloaded_count += 1
                continue
            print(f"  [{i}/{len(all_media)}] {os.path.basename(filepath)}...", end=" ")
            if download_file(url, filepath):
                print("✓")
                downloaded_count += 1
    print(f"\n  Downloaded {downloaded_count}/{len(all_media)} media files")
    
    print("\n" + "=" * 60)
    print("Clone complete!")
    print(f"Files saved to: {os.path.abspath(output_dir)}/")
    print("=" * 60)
    print("\nTo view the site:")
    print(f"  cd {output_dir}")
    print("  python3 -m http.server 8000")
    print("  Then open: http://localhost:8000")

if __name__ == "__main__":
    clone_website()

