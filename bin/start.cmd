cd "c:\github\escaperoom"

docker-compose down
docker-compose up -d

start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" http://localhost:8081 --start-fullscreen --no-first-run
