cd "c:\github\escaperoom"

REM set NODE_OPTIONS=--openssl-legacy-provider
start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" http://localhost:8081 --start-fullscreen --no-first-run
npm run start:dev


