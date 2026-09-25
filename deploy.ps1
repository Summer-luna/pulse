[CmdletBinding()]
param(
  [string]$Server = '192.168.1.49',
  [string]$SshUser = 'claude',
  [string]$AppDir = '/home/claude/apps/pulse',
  [string]$FrontendOrigins = 'http://192.168.1.49,https://pulse.esdemc.net',
  [switch]$SkipInstall,
  [switch]$SkipBuild
)

$ErrorActionPreference = 'Stop'
$repoRoot = $PSScriptRoot
$releaseId = Get-Date -Format 'yyyyMMdd-HHmmss'
$deployRoot = Join-Path $repoRoot '.deploy-temp'
$stageDir = Join-Path $deployRoot $releaseId
$archivePath = Join-Path $deployRoot "pulse-$releaseId.tar.gz"
$remoteArchive = "$AppDir/releases/pulse-$releaseId.tar.gz"
$remoteScript = "$AppDir/deploy/server-deploy.sh"
$target = "$SshUser@$Server"

function Invoke-Checked {
  param(
    [Parameter(Mandatory)] [string]$Command,
    [Parameter(Mandatory)] [string[]]$Arguments
  )

  & $Command @Arguments
  if ($LASTEXITCODE -ne 0) {
    throw "$Command failed with exit code $LASTEXITCODE"
  }
}

foreach ($command in @('npm.cmd', 'ssh.exe', 'scp.exe', 'tar.exe')) {
  if (-not (Get-Command $command -ErrorAction SilentlyContinue)) {
    throw "Required command not found: $command"
  }
}

Set-Location $repoRoot
$branch = (git branch --show-current).Trim()
Write-Host "Deploying branch '$branch' as release $releaseId" -ForegroundColor Cyan

try {
  if (-not $SkipInstall) {
    Invoke-Checked 'npm.cmd' @('ci')
  }

  if (-not $SkipBuild) {
    Invoke-Checked 'npm.cmd' @('run', 'build', '-w', 'backend')
    Invoke-Checked 'npm.cmd' @('run', 'build', '-w', 'frontend')
  }

  foreach ($path in @('backend/dist/main.js', 'frontend/dist/index.html')) {
    if (-not (Test-Path (Join-Path $repoRoot $path))) {
      throw "Build output not found: $path"
    }
  }

  New-Item -ItemType Directory -Force -Path (Join-Path $stageDir 'backend') | Out-Null
  New-Item -ItemType Directory -Force -Path (Join-Path $stageDir 'frontend') | Out-Null
  Copy-Item (Join-Path $repoRoot 'backend/dist/*') (Join-Path $stageDir 'backend') -Recurse -Force
  Copy-Item (Join-Path $repoRoot 'frontend/dist/*') (Join-Path $stageDir 'frontend') -Recurse -Force
  $manifestsDir = Join-Path $stageDir 'manifests'
  New-Item -ItemType Directory -Force -Path (Join-Path $manifestsDir 'backend') | Out-Null
  New-Item -ItemType Directory -Force -Path (Join-Path $manifestsDir 'frontend') | Out-Null
  Copy-Item (Join-Path $repoRoot 'package.json') $manifestsDir -Force
  Copy-Item (Join-Path $repoRoot 'package-lock.json') $manifestsDir -Force
  Copy-Item (Join-Path $repoRoot 'backend/package.json') (Join-Path $manifestsDir 'backend') -Force
  Copy-Item (Join-Path $repoRoot 'frontend/package.json') (Join-Path $manifestsDir 'frontend') -Force
  Copy-Item (Join-Path $repoRoot 'deploy/backend-runtime.Dockerfile') (Join-Path $manifestsDir 'Dockerfile') -Force

  New-Item -ItemType Directory -Force -Path $deployRoot | Out-Null
  Invoke-Checked 'tar.exe' @('-czf', $archivePath, '-C', $stageDir, '.')

  Write-Host 'Preparing server directories...' -ForegroundColor Cyan
  Invoke-Checked 'ssh.exe' @($target, "mkdir -p '$AppDir/releases' '$AppDir/deploy'")

  Write-Host 'Uploading release artifacts...' -ForegroundColor Cyan
  Invoke-Checked 'scp.exe' @($archivePath, "${target}:$remoteArchive")
  Invoke-Checked 'scp.exe' @(
    (Join-Path $repoRoot 'deploy/server-deploy.sh'),
    "${target}:$remoteScript"
  )

  Write-Host 'Activating release...' -ForegroundColor Cyan
  Invoke-Checked 'ssh.exe' @(
    $target,
    "chmod +x '$remoteScript' && '$remoteScript' '$releaseId' '$AppDir' '$FrontendOrigins'"
  )

  Write-Host "Deployment succeeded: http://$Server" -ForegroundColor Green
} finally {
  if (Test-Path $stageDir) {
    Remove-Item -LiteralPath $stageDir -Recurse -Force
  }
  if (Test-Path $archivePath) {
    Remove-Item -LiteralPath $archivePath -Force
  }
}
