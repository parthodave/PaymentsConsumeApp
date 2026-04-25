#!/usr/bin/env pwsh
# Deploy Angular app to Azure Static Web App using deployment token

param(
    [string]$SrcPath = "./dist/PaymentsConsumeApp/browser",
    [string]$DeploymentToken = "a8d40362070bd9218b2cab2d536855b9ed580b61952cabd265ca2ce55151412e07-e8136f86-d710-4611-b897-2aefad3e6c020002004081633c00",
    [string]$EnvironmentUrl = "https://happy-stone-0e821531f.azurestaticapps.net"
)

Write-Host "🚀 Starting Azure Static Web App Deployment" -ForegroundColor Green
Write-Host "Source: $SrcPath"
Write-Host "Target: $EnvironmentUrl"
Write-Host ""

# Function to upload files
function Upload-StaticWebAppFiles {
    param(
        [string]$SourcePath,
        [string]$DeploymentToken,
        [string]$EnvironmentUrl
    )

    # Extract environment ID from token
    $parts = $DeploymentToken -split "-"
    $environmentId = "$($parts[-3])-$($parts[-2])-$($parts[-1])"
    $apiToken = $parts[0]

    Write-Host "Uploading files to $EnvironmentUrl..."
    
    # Get all files recursively
    $files = Get-ChildItem -Path $SourcePath -Recurse -File
    $totalFiles = $files.Count
    $uploadedFiles = 0

    foreach ($file in $files) {
        $relativePath = $file.FullName.Replace($SourcePath, "").Replace("\", "/").TrimStart("/")
        $fileContent = [System.IO.File]::ReadAllBytes($file.FullName)
        
        # Create API endpoint for file upload
        $apiUrl = "$EnvironmentUrl/api/publish/uploads/$relativePath"
        
        try {
            # Upload file with authorization header
            $headers = @{
                "Authorization" = "Bearer $DeploymentToken"
                "Content-Type" = "application/octet-stream"
            }
            
            Invoke-WebRequest -Uri $apiUrl `
                -Method Put `
                -Headers $headers `
                -Body $fileContent `
                -ErrorAction Stop | Out-Null
            
            $uploadedFiles++
            Write-Host "✅ Uploaded: $relativePath ($uploadedFiles/$totalFiles)" -ForegroundColor Green
        }
        catch {
            Write-Host "⚠️  Failed to upload: $relativePath" -ForegroundColor Yellow
            Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        }
    }

    Write-Host ""
    Write-Host "📊 Upload Summary: $uploadedFiles/$totalFiles files uploaded" -ForegroundColor Cyan
}

# Execute upload
try {
    Upload-StaticWebAppFiles -SourcePath $SrcPath -DeploymentToken $DeploymentToken -EnvironmentUrl $EnvironmentUrl
    Write-Host ""
    Write-Host "✅ Deployment Complete!" -ForegroundColor Green
    Write-Host "Your app is live at: $EnvironmentUrl" -ForegroundColor Cyan
}
catch {
    Write-Host "❌ Deployment failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
