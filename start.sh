#!/bin/bash

sleep 1

# directory of this script
DIR="$(cd "$(dirname "$0")" && pwd)"
CHROMIUM_DIR="$DIR/chromium"
ZIP="$CHROMIUM_DIR/chromium.zip"
mkdir -p "$CHROMIUM_DIR"

CHROMIUM_APP="$CHROMIUM_DIR/Chromium.app/Contents/MacOS/Chromium"

ARCH=$(uname -m)

if [ "$ARCH" = "arm64" ]; then
  PLATFORM="Mac_Arm"
else
  PLATFORM="Mac"
fi

echo "Detected architecture: $ARCH → $PLATFORM"

# 👉 Download (Intel Mac)
if [ ! -f "$CHROMIUM_DIR/Chromium.app/Contents/MacOS/Chromium" ]; then
  echo "Downloading Chromium for $PLATFORM..."

  curl -L --retry 3 --retry-delay 2 --fail "https://download-chromium.appspot.com/dl/$PLATFORM?type=snapshots" -o "$ZIP"

  unzip -o "$ZIP" -d "$CHROMIUM_DIR"
  mv "$CHROMIUM_DIR"/chrome-mac/* "$CHROMIUM_DIR"/
  rm -rf "$CHROMIUM_DIR/chrome-mac" "$ZIP"

  echo "Done."
fi

# 👉 Fix macOS block
xattr -dr com.apple.quarantine "$CHROMIUM_DIR" || true

# 👉 2. Kill Chromium cũ (nếu có)
killall "Chromium" 2>/dev/null || true

# 👉 4. Run Chromium kiosk + extension
"$CHROMIUM_APP" \
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
