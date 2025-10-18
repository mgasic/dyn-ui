# DYN-UI Project Cleanup Script
# Ova skripta automatizuje čišćenje i standardizaciju dyn-ui projekta

Write-Host " POKRETANJE DYN-UI CLEANUP PROCESA..." -ForegroundColor Cyan
Write-Host ("=" * 50)

# Proverava da li smo u ispravnom direktorijumu
if (-not (Test-Path "packages/dyn-ui-react")) {
    Write-Host " GREŠKA: Nisi u root dyn-ui direktorijumu!" -ForegroundColor Red
    Write-Host "Prebaci se u direktorijum koji sadrži packages/dyn-ui-react folder." -ForegroundColor Yellow
    exit 1
}

Write-Host " Pronađen packages/dyn-ui-react folder" -ForegroundColor Green

# Funkcija za kreiranje backup-a
function Create-Backup {
    Write-Host " Kreiram backup branch..." -ForegroundColor Yellow

    # Proveri Git status
    $gitStatus = git status --porcelain
    if ($gitStatus) {
        Write-Host "  Imaš uncommitted promene. Želiš li da ih commit-uješ pre backup-a? (y/N): " -ForegroundColor Yellow -NoNewline
        $response = Read-Host

        if ($response -eq 'y' -or $response -eq 'Y') {
            git add .
            git commit -m "wip: pre-cleanup commit"
            Write-Host " Promene commit-ovane" -ForegroundColor Green
        }
    }

    $backupBranchName = "cleanup/project-standardization-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    git checkout -b $backupBranchName

    if ($LASTEXITCODE -eq 0) {
        Write-Host " Backup branch kreiran: $backupBranchName" -ForegroundColor Green
        return $backupBranchName
    } else {
        Write-Host " Greška pri kreiranju backup branch-a" -ForegroundColor Red
        exit 1
    }
}

# Funkcija za pronalaženje SCSS fajlova
function Find-SCSSFiles {
    Write-Host " Skeniram SCSS fajlove..." -ForegroundColor Yellow

    $scssFiles = @()
    if (Test-Path "packages/dyn-ui-react") {
        $scssFiles = Get-ChildItem -Path "packages/dyn-ui-react" -Filter "*.scss" -Recurse -File
    }

    if ($scssFiles.Count -gt 0) {
        Write-Host " Pronađeno $($scssFiles.Count) SCSS fajlova za konverziju:" -ForegroundColor Red
        foreach ($file in $scssFiles) {
            $relativePath = $file.FullName.Replace((Get-Location).Path + "\", "")
            Write-Host "  - $relativePath" -ForegroundColor Red
        }
        return $scssFiles
    } else {
        Write-Host " Nema SCSS fajlova za konverziju" -ForegroundColor Green
        return @()
    }
}

# Funkcija za kreiranje centralizovanog export fajla
function Create-CentralizedExports {
    Write-Host " Kreiram centralizovani export sistem..." -ForegroundColor Yellow

    $componentsPath = "packages/dyn-ui-react/src/components"

    if (-not (Test-Path $componentsPath)) {
        Write-Host " Ne mogu da pronađem: $componentsPath" -ForegroundColor Red
        return
    }

    $indexPath = Join-Path $componentsPath "index.ts"

    # Pronađi sve component direktorijume
    $componentFolders = Get-ChildItem -Path $componentsPath -Directory | Where-Object {
        $_.Name -like "Dyn*" -or $_.Name -eq "ThemeSwitcher"
    }

    if ($componentFolders.Count -eq 0) {
        Write-Host " Nema component foldere u $componentsPath" -ForegroundColor Red
        return
    }

    # Generiši export sadržaj
    $exportContent = @"
// Standardized exports for ALL DYN-UI components
// Ovaj fajl pokriva sve komponente - ne menjaj ručno!
// Generated on: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')

"@

    # Component exports
    $valueExports = @()

    foreach ($folder in $componentFolders) {
        $componentName = $folder.Name
        $exportContent += "export { $componentName } from './$componentName';`n"

        $typeFiles = Get-ChildItem -Path $folder.FullName -Filter '*.types.ts' -File -ErrorAction SilentlyContinue
        foreach ($typeFile in $typeFiles) {
            $fileContent = Get-Content -Path $typeFile.FullName -ErrorAction SilentlyContinue
            foreach ($line in $fileContent) {
                if ($line -match 'export\s+const\s+([A-Za-z0-9_]+)') {
                    $constName = $matches[1]
                    $relativePath = "./$componentName/$($typeFile.BaseName)"
                    $valueExports += "$constName|$relativePath"
                }
            }
        }
    }

    $valueExports = $valueExports | Sort-Object -Unique

    if ($valueExports.Count -gt 0) {
        $exportContent += "`n// Value exports`n"
        foreach ($valueExport in $valueExports) {
            $parts = $valueExport -split '\|', 2
            if ($parts.Length -eq 2) {
                $exportContent += "export { $($parts[0]) } from '$($parts[1])';`n"
            }
        }
    }

    $exportContent += "`n// Type exports`n"

    # Type exports
    foreach ($folder in $componentFolders) {
        $componentName = $folder.Name
        $exportContent += "export type * from './$componentName';`n"
    }

    # Sačuvaj fajl
    try {
        Set-Content -Path $indexPath -Value $exportContent -Encoding UTF8
        Write-Host " Centralizovani export kreiran: $indexPath" -ForegroundColor Green
        Write-Host "   Pokriveno $($componentFolders.Count) komponenti" -ForegroundColor Green
    }
    catch {
        Write-Host " Greška pri kreiranju export fajla: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# GLAVNI TOK IZVRŠAVANJA
try {
    Write-Host " Početak cleanup procesa za DYN-UI..." -ForegroundColor Cyan
    Write-Host ""

    # Korak 1: Backup
    $backupBranch = Create-Backup
    Write-Host ""

    # Korak 2: Pronađi SCSS fajlove
    $scssFiles = Find-SCSSFiles
    Write-Host ""

    # Korak 3: Kreiraj centralizovane exporte
    Write-Host " CENTRALIZOVANI EXPORT SISTEM" -ForegroundColor Cyan
    Write-Host ("" * 40)
    Create-CentralizedExports
    Write-Host ""

    Write-Host " DYN-UI CLEANUP ZAVRŠEN!" -ForegroundColor Green
    Write-Host ("=" * 50)
    Write-Host " Centralizovani export sistem implementiran" -ForegroundColor Green
    Write-Host ""
    Write-Host " Backup branch: $backupBranch" -ForegroundColor Gray

} catch {
    Write-Host ""
    Write-Host " GREŠKA TOKOM CLEANUP PROCESA:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red

    exit 1
}
