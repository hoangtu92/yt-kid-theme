#!/bin/bash

killall "Google Chrome" 2>/dev/null
sleep 1

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

"$CHROME" \
  --kiosk \
  --start-fullscreen \
  --no-first-run \
  --disable-infobars \
  --disable-session-crashed-bubble \
  --disable-translate \
  --overscroll-history-navigation=0 \
  --autoplay-policy=no-user-gesture-required \
  --user-data-dir="/tmp/chrome-youtubekids" \
  "https://www.youtubekids.com"