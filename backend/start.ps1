# Stop old API servers, then start on a free port.
Write-Host "Stopping old Python servers on ports 8000-8002..."
foreach ($port in 8000, 8001, 8002) {
    Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue |
        ForEach-Object {
            $id = $_.OwningProcess
            if ($id -and $id -gt 0) {
                Stop-Process -Id $id -Force -ErrorAction SilentlyContinue
                taskkill /F /PID $id 2>$null
            }
        }
}
Start-Sleep -Seconds 2

$env:PORT = "8001"
Set-Location $PSScriptRoot
Write-Host "Starting backend (PORT=$env:PORT)..."
python main.py
