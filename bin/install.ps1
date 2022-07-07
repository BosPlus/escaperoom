Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

refreshenv
choco install git -y

choco install npm -y

refreshenv

mkdir c:\github
Set-Location "c:\github\"

git clone https://github.com/BosPlus/escaperoom.git

Copy-Item -Path "C:\github\escaperoom\bin\start escaperoom.lnk" -Destination "C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Startup"
Copy-Item -Path "C:\github\escaperoom\bin\update escaperoom.lnk" -Destination [Environment]::GetFolderPath("Desktop")
Copy-Item -Path "C:\github\escaperoom\bin\start escaperoom.lnk" -Destination [Environment]::GetFolderPath("Desktop")

