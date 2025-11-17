#!/usr/bin/env python3
"""
Script to clone endless.design website with all assets
"""
import os
import urllib.request
import urllib.error
from urllib.parse import urljoin, urlparse
import re
from pathlib import Path

def download_file(url, filepath):
    """Download a file from URL to filepath"""
    try:
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        })
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        with urllib.request.urlopen(req, timeout=10) as response:
            with open(filepath, 'wb') as f:
                f.write(response.read())
        return True
    except Exception as e:
        print(f"Error downloading {url}: {e}")
        return False

def clone_website():
    base_url = "https://endless.design"
    output_dir = "endless.design"
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Download main HTML
    print("Downloading main page...")
    req = urllib.request.Request(base_url, headers={
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    })
    with urllib.request.urlopen(req, timeout=10) as response:
        html_content = response.read().decode('utf-8')
    
    # Save HTML
    with open(f"{output_dir}/index.html", 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print(f"Saved HTML to {output_dir}/index.html")
    print(f"HTML size: {len(html_content)} bytes")
    
    # Extract and download CSS files
    css_pattern = r'href=["\']([^"\']*\.css[^"\']*)["\']'
    css_files = re.findall(css_pattern, html_content)
    
    for css_url in css_files:
        if css_url.startswith('http'):
            full_url = css_url
        else:
            full_url = urljoin(base_url, css_url)
        
        parsed = urlparse(full_url)
        filepath = os.path.join(output_dir, parsed.path.lstrip('/'))
        print(f"Downloading CSS: {full_url}")
        download_file(full_url, filepath)
    
    # Extract and download JS files
    js_pattern = r'src=["\']([^"\']*\.js[^"\']*)["\']'
    js_files = re.findall(js_pattern, html_content)
    
    for js_url in js_files:
        if js_url.startswith('http'):
            full_url = js_url
        else:
            full_url = urljoin(base_url, js_url)
        
        parsed = urlparse(full_url)
        filepath = os.path.join(output_dir, parsed.path.lstrip('/'))
        print(f"Downloading JS: {full_url}")
        download_file(full_url, filepath)
    
    # Extract and download images
    img_pattern = r'src=["\']([^"\']*\.(?:jpg|jpeg|png|gif|svg|webp)[^"\']*)["\']'
    img_files = re.findall(img_pattern, html_content, re.IGNORECASE)
    
    for img_url in img_files:
        if img_url.startswith('http'):
            full_url = img_url
        else:
            full_url = urljoin(base_url, img_url)
        
        parsed = urlparse(full_url)
        filepath = os.path.join(output_dir, parsed.path.lstrip('/'))
        print(f"Downloading image: {full_url}")
        download_file(full_url, filepath)
    
    print(f"\nClone complete! Files saved to {output_dir}/")
    print("You can now open index.html in a browser or serve it with a local server.")

if __name__ == "__main__":
    clone_website()

