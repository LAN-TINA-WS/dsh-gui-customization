# GUICustomization 转正用的独立重启脚本：脱离 DSH 进程运行，
# 杀 3080 监听进程 → 等待端口释放 → 后台拉起新实例（dist 模式）。
$ErrorActionPreference = 'SilentlyContinue'

Start-Sleep -Seconds 2

$conn = Get-NetTCPConnection -LocalPort 3080 -State Listen -ErrorAction SilentlyContinue
if ($conn) {
  $conn | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object {
    Stop-Process -Id $_ -Force
  }
}

# 等待端口释放（最多 20 秒）
for ($i = 0; $i -lt 40; $i++) {
  if (-not (Get-NetTCPConnection -LocalPort 3080 -State Listen -ErrorAction SilentlyContinue)) { break }
  Start-Sleep -Milliseconds 500
}

Start-Sleep -Seconds 1

Start-Process -FilePath 'node' `
  -ArgumentList @('apps\cli\lib\bin.js', 'web') `
  -WorkingDirectory 'D:\Deploy\Warehouse\deepseek-harness' `
  -WindowStyle Hidden
