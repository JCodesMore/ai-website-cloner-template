#Requires -Version 5.1
<#
.SYNOPSIS
  Assemble and link Windows x86-64 tools under asm/native/ into dist/asm/.
#>
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $Root

$Nasm = @(
  "$env:LOCALAPPDATA\bin\NASM\nasm.exe",
  "C:\Program Files\NASM\nasm.exe",
  "C:\Program Files (x86)\NASM\nasm.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $Nasm) {
  throw "NASM not found. Install from https://www.nasm.us/ or: winget install NASM.NASM"
}

$vswhere = "${env:ProgramFiles(x86)}\Microsoft Visual Studio\Installer\vswhere.exe"
$vsPath = $null
if (Test-Path $vswhere) {
  $vsPath = & $vswhere -latest -products * -requires Microsoft.VisualStudio.Component.VC.Tools.x86.x64 -property installationPath
}
if (-not $vsPath) {
  throw "MSVC Build Tools not found (need link.exe + kernel32.lib)."
}

$msvc = Get-ChildItem "$vsPath\VC\Tools\MSVC" | Sort-Object Name -Descending | Select-Object -First 1
$link = Join-Path $msvc.FullName "bin\Hostx64\x64\link.exe"
$libPath = Join-Path $msvc.FullName "lib\x64"

$kitRoot = "C:\Program Files (x86)\Windows Kits\10"
$kitVer = Get-ChildItem "$kitRoot\Lib" | Sort-Object Name -Descending | Select-Object -First 1
$um = Join-Path $kitVer.FullName "um\x64"
$ucrt = Join-Path $kitVer.FullName "ucrt\x64"

$outDir = Join-Path $Root "bin"
$objDir = Join-Path $outDir "obj"
New-Item -ItemType Directory -Force -Path $outDir, $objDir | Out-Null

$targets = @("sync-skills", "sync-agent-rules")
foreach ($name in $targets) {
  $asm = Join-Path $Root "asm\native\$name.asm"
  $obj = Join-Path $objDir "$name.obj"
  $exe = Join-Path $outDir "$name.exe"

  Write-Host "Assembling $name.asm ..."
  & $Nasm -f win64 -o $obj $asm
  if ($LASTEXITCODE -ne 0) { throw "nasm failed for $name" }

  Write-Host "Linking $name.exe ..."
  & $link /NOLOGO /SUBSYSTEM:CONSOLE /ENTRY:mainCRTStartup `
    /LIBPATH:$libPath /LIBPATH:$um /LIBPATH:$ucrt `
    /OUT:$exe $obj kernel32.lib
  if ($LASTEXITCODE -ne 0) { throw "link failed for $name" }

  Write-Host "  -> $exe"
}

Write-Host "Native asm build complete."
