# run_cycle2.ps1
$ErrorActionPreference = "Stop"

# 1) Katalogi
$paths = @("reports/coverage","reports/security","reports/flakecheck","logs","docs")
$paths | ForEach-Object { if (-not (Test-Path $_)) { New-Item -ItemType Directory -Force -Path $_ | Out-Null } }

# 2) Zależności dev
if (Test-Path "requirements-dev.txt") {
  pip install -r requirements-dev.txt
} else {
  Write-Host "requirements-dev.txt not found" -ForegroundColor Yellow
}

# 3) QA / testy / coverage / security
$ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
"=== OrthoBase Cycle #2 run @ $ts ===" | Tee-Object -File "logs/qa.log"

inv qa       | Tee-Object -File "logs/qa.log" -Append
inv test     | Tee-Object -File "logs/test.log"
# coverage do HTML + zapis terminalowy do pliku
pytest --cov=./ --cov-report=term-missing --cov-report=html:reports/coverage `
  | Tee-Object -File "logs/coverage_term.log"

# security
pip-audit -r requirements.txt        | Tee-Object -File "reports/security/pip-audit.requirements.txt.txt"
pip-audit -r requirements-dev.txt    | Tee-Object -File "reports/security/pip-audit.requirements-dev.txt.txt"
bandit -q -r . -x tests              | Tee-Object -File "reports/security/bandit.txt"

# 4) Wyciągnięcie % pokrycia z outputu
$coveragePct = Select-String -Path "logs/coverage_term.log" -Pattern "TOTAL\s+\d+\s+\d+\s+(\d+)%"
if ($coveragePct) {
  $cov = $coveragePct.Matches[0].Groups[1].Value
} else {
  $cov = "n/a"
}

# 5) Złożenie daily_report.txt
$report = @()
$report += "OrthoBase AI — Cycle #2 Report"
$report += "Timestamp: $ts"
$report += ""
$report += "Coverage: $cov % (HTML: reports/coverage/index.html)"
$report += ""
$report += "QA:"
$report += "  - logs/qa.log"
$report += "Tests:"
$report += "  - logs/test.log"
$report += "Security:"
$report += "  - reports/security/pip-audit.requirements.txt.txt"
$report += "  - reports/security/pip-audit.requirements-dev.txt.txt"
$report += "  - reports/security/bandit.txt"
$report += ""
$report += "Next (Cycle #3 — proposal):"
$report += "  - /healthz and /readyz endpoints + tests"
$report += "  - scripts/smoke_e2e.py + inv smoke"
$report += "  - optional log rotation (file mode toggle)"
$report += "  - coverage target ≥ 75% for critical modules"
$report -join "`r`n" | Set-Content "logs/daily_report.txt" -Encoding UTF8

Write-Host "`nDone. Open coverage: reports/coverage/index.html" -ForegroundColor Green
Write-Host "Daily report: logs/daily_report.txt" -ForegroundColor Green
