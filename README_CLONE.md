# Cloning endless.design

To get an exact clone of endless.design with all assets, run:

```bash
cd /Users/sametozkale/Desktop/Studio
python3 clone_endless.py
```

This will:
1. Download the main HTML page
2. Extract all CSS, JS, font, and image references
3. Download all assets to the `endless.design/` directory
4. Preserve the exact directory structure

After cloning, start a local server:

```bash
cd endless.design
python3 -m http.server 8000
```

Then open http://localhost:8000 in your browser.

