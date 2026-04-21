#!/bin/bash

sleep 1

ARCH=$(uname -m)

if [ "$ARCH" = "arm64" ]; then
  PLATFORM="mac-arm64"
else
  PLATFORM="mac-x64"
fi

echo "Detected architecture: $ARCH → $PLATFORM"

# directory of this script
DIR="$(cd "$(dirname "$0")" && pwd)"
CFT_DIR="$DIR/chrome-for-testing"
APP="$CFT_DIR/chrome-$PLATFORM/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing"
ZIP="$CFT_DIR/chrome.zip"

mkdir -p "$CFT_DIR"


# 👉 Download (Intel Mac)
# 👉 download Chrome for Testing nếu chưa có
if [ ! -f "$APP" ]; then
  echo "Downloading Chrome for Testing..."

  URL="https://storage.googleapis.com/chrome-for-testing-public/147.0.7727.57/$PLATFORM/chrome-$PLATFORM.zip"

  curl -L --retry 3 --fail "$URL" -o "$ZIP"

  unzip -o "$ZIP" -d "$CFT_DIR"
  rm "$ZIP"

  echo "Done."
fi

# 👉 Fix macOS block
xattr -dr com.apple.quarantine "$CHROMIUM_DIR" || true

# 👉 2. Kill Chromium cũ (nếu có)
killall "Chromium" 2>/dev/null || true

# 👉 4. Run Chromium kiosk + extension
"$APP" \
  --kiosk \
  --user-data-dir="$DIR/profile" \
  --load-extension="$DIR" \
  --disable-extensions-except="$DIR" \
  --enable-gpu-rasterization \
  --enable-zero-copy \
  --ignore-gpu-blocklist \
  --disable-background-networking \
  --disable-background-timer-throttling \
  --disable-backgrounding-occluded-windows \
  --disable-renderer-backgrounding \
  --disable-client-side-phishing-detection \
  --disable-default-apps \
  --disable-sync \
  --metrics-recording-only \
  --disable-component-update \
  --disable-domain-reliability \
  --no-pings \
  --process-per-site \
  --js-flags="--max-old-space-size=512" \
  --autoplay-policy=no-user-gesture-required \
  --disable-infobars \
  --no-first-run \
  --no-default-browser-check \
  --disable-session-crashed-bubble \
  --start-maximized \
  --new-window \
  "https://www.youtubekids.com"
