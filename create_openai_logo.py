#!/usr/bin/env python3
"""
Create OpenAI logo PNG from base64 encoded data
"""
import base64
from PIL import Image
import io

# OpenAI logo as base64 encoded PNG (20x20 black logo)
# This is a simple black OpenAI logo in PNG format
openai_logo_base64 = '''iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAA
AAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QkY3RkE3QzY3QzE0MTFFQjk5N0JBRjE3QzY3QzE0IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkJGN0ZBN0M2N0MxNDExRUI5OTdCQUYxN0M2N0MxNCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkJGN0ZBN0M2N0MxNDExRUI5OTdCQUYxN0M2N0MxNCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCRjdGQTdDNjdDMTQxMUVCOjk3QkFGMTdDNjdDMTQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4B//9ofyIAAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAUABQDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='''

try:
    # Decode base64 and create PNG
    img_data = base64.b64decode(openai_logo_base64.replace('\n', ''))
    img = Image.open(io.BytesIO(img_data))
    
    # Resize to 20x20 if needed
    if img.size != (20, 20):
        img = img.resize((20, 20), Image.Resampling.LANCZOS)
    
    # Save as PNG
    img.save('openai-logo.png', 'PNG')
    print("✓ Created openai-logo.png (20x20)")
except Exception as e:
    print(f"Error creating PNG: {e}")
    # Fallback: Create a simple black OpenAI logo using PIL
    try:
        from PIL import Image, ImageDraw
        
        # Create a 20x20 image with transparent background
        img = Image.new('RGBA', (20, 20), (255, 255, 255, 0))
        draw = ImageDraw.Draw(img)
        
        # Draw OpenAI logo shape (simplified version)
        # This is a basic representation - you may want to use the actual logo
        draw.ellipse([2, 2, 18, 18], fill='black')
        draw.ellipse([6, 6, 14, 14], fill='white')
        draw.ellipse([9, 9, 11, 11], fill='black')
        
        img.save('openai-logo.png', 'PNG')
        print("✓ Created openai-logo.png (20x20) - simplified version")
    except Exception as e2:
        print(f"Error creating fallback PNG: {e2}")
