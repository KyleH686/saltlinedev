#!/bin/bash
# Builds dist/saltline.html (single file, as published to the Claude artifact) and index.html (the GitHub Pages app) from src/: shell.html + three.js + game.js, whitespace-minified.
set -e
cd "$(dirname "$0")"
mkdir -p dist
cat src/three.js src/game.js > dist/bundle.js
# stamp the build so a screenshot says exactly which version is running
STAMP=$(date -u +%m%d.%H%M)
sed -i "s/__SL_BUILD__/$STAMP/" dist/bundle.js
ES=$(command -v esbuild || ls /opt/npm-tools/node_modules/.bin/esbuild 2>/dev/null || echo 'npx --yes esbuild')
$ES dist/bundle.js --minify-whitespace --minify-syntax --log-level=warning --outfile=dist/bundle.min.js
python3 -I - <<'PY'
s=open('src/shell.html').read(); j=open('dist/bundle.min.js').read()
assert '<script>/*JS*/</script>' in s
j=j.replace('</script','<\\/script')
open('dist/saltline.html','w').write(s.replace('<script>/*JS*/</script>','<script>\n'+j+'\n</script>'))
PY
ls -la dist/saltline.html
# Home-screen app build for GitHub Pages: index.html at the repo root, plus manifest, service worker and icons
python3 -I - <<'PY'
h=open('dist/saltline.html').read(); head=open('pwa/head.html').read()
k=h.index('<div id="app">')
top=h[:k].replace('<meta name="claude:viewport-fit-sides" content="cover">\n','')
open('index.html','w').write('<!doctype html>\n<html lang="en">\n<head>\n'+head+top+'</head>\n<body>\n'+h[k:]+'\n</body>\n</html>\n')
PY
cp pwa/manifest.webmanifest pwa/sw.js pwa/icon-*.png .
ls -la index.html
