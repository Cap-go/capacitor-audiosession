#!/usr/bin/env bash
set -euo pipefail

platform="${1:-}"
case "$platform" in
  android | ios | web) ;;
  *)
    echo "Usage: $0 <android|ios|web>"
    exit 1
    ;;
esac

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
tmp_root="${RUNNER_TEMP:-$(mktemp -d)}"
pack_dir="$tmp_root/plugin-package"
test_app="$tmp_root/plugin-example-app"

cd "$repo_root"

bun run build

rm -rf "$pack_dir" "$test_app"
mkdir -p "$pack_dir" "$test_app"
bun pm pack --destination "$pack_dir" --quiet

shopt -s nullglob
packed_packages=("$pack_dir"/*.tgz)
shopt -u nullglob
if [ "${#packed_packages[@]}" -ne 1 ]; then
  echo "Expected exactly one package tarball, found ${#packed_packages[@]}"
  exit 1
fi

plugin_name="$(bun -e 'console.log(require("./package.json").name)')"
if [ -d example-app ]; then
  cp -R example-app/. "$test_app/"
else
  cat > "$test_app/package.json" <<'JSON'
{
  "private": true,
  "type": "module",
  "scripts": {
    "build": "mkdir -p dist && cp index.html dist/index.html"
  },
  "dependencies": {
    "@capacitor/android": "^8.0.0",
    "@capacitor/cli": "^8.0.0",
    "@capacitor/core": "^8.0.0",
    "@capacitor/ios": "^8.0.0"
  },
  "devDependencies": {}
}
JSON
  cat > "$test_app/capacitor.config.json" <<'JSON'
{
  "appId": "com.capgo.pluginexample",
  "appName": "Plugin Example",
  "webDir": "dist"
}
JSON
  cat > "$test_app/index.html" <<'HTML'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Plugin Example</title>
  </head>
  <body></body>
</html>
HTML
fi
cd "$test_app"
bun install
bun remove "$plugin_name" || true
bun add "${packed_packages[0]}"
bun run build

case "$platform" in
  android)
    bunx cap add android
    bunx cap sync android
    cd android
    ./gradlew build test
    ;;
  ios)
    bunx cap add ios
    bunx cap sync ios
    xcodebuild -project ios/App/App.xcodeproj -scheme App -destination generic/platform=iOS CODE_SIGNING_ALLOWED=NO
    ;;
  web)
    ;;
esac
