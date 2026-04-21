#!/bin/bash

DIR="$(cd "$(dirname "$0")" && pwd)"

APP_NAME="YouTube Kids"
APP_PATH="$DIR/$APP_NAME.app"
ICON_PATH="$DIR/youtube-kids.icns"

mkdir -p "$APP_PATH/Contents/MacOS"
mkdir -p "$APP_PATH/Contents/Resources"

# 👉 executable launcher
cat > "$APP_PATH/Contents/MacOS/run" <<EOF
#!/bin/bash
cd "$DIR"
./start.sh
EOF

chmod +x "$APP_PATH/Contents/MacOS/run"

# 👉 Info.plist
cat > "$APP_PATH/Contents/Info.plist" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
"http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleName</key>
    <string>$APP_NAME</string>
    <key>CFBundleExecutable</key>
    <string>run</string>
    <key>CFBundleIdentifier</key>
    <string>com.local.youtube.kids</string>
    <key>CFBundleVersion</key>
    <string>1.0</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleIconFile</key>
    <string>youtube-kids</string>
</dict>
</plist>
EOF

# 👉 copy icon
cp "$ICON_PATH" "$APP_PATH/Contents/Resources/youtube-kids.icns"

echo "App created at: $APP_PATH"
