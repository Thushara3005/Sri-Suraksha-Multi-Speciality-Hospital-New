$src = "C:\Users\Admin\Downloads\WhatsApp Image 2026-08-14 at 14.21.03.jpeg"
$dst = "d:\SriSurakshaHospital-Fresh\public\dr-triveni-reddy-new.png"

Write-Host "Source: $src"
Write-Host "Source exists: $(Test-Path $src)"

if (Test-Path $src) {
    Copy-Item -Path $src -Destination $dst -Force
    Start-Sleep -Milliseconds 500
    if (Test-Path $dst) {
        Write-Host "SUCCESS - File copied"
        Get-Item $dst | Select-Object FullName, Length
    } else {
        Write-Host "FAILED - File not found after copy"
    }
} else {
    Write-Host "ERROR - Source not found"
}
