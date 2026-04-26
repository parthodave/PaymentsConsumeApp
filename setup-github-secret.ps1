# This script adds the Azure deployment token as a GitHub secret
# You need to set your GitHub token first

# Get the Azure deployment token (from Azure Portal)
$azureToken = "a8d40362070bd9218b2cab2d536855b9ed580b61952cabd265ca2ce55151412e07-e8136f86-d710-4611-b897-2aefad3e6c020002004081633c00"

# GitHub credentials
$gitHubUser = "parthodave"
$gitHubRepo = "PaymentsConsumeApp"
$secretName = "AZURE_STATIC_WEB_APPS_API_TOKEN"

# You'll need to paste your GitHub Personal Access Token when prompted
Write-Host "Opening GitHub to create/use Personal Access Token..."
Write-Host "Go to: https://github.com/settings/tokens"
Write-Host "Create a new token with 'repo' scope"
$gitHubToken = Read-Host "Paste your GitHub Personal Access Token"

# Base64 encode the token
$tokenBase64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($azureToken))

# Get the repository public key (needed for secret encryption)
$headers = @{
    "Authorization" = "token $gitHubToken"
    "Accept" = "application/vnd.github+json"
}

$keyResponse = Invoke-WebRequest -Uri "https://api.github.com/repos/$gitHubUser/$gitHubRepo/actions/secrets/public-key" `
    -Headers $headers -ErrorAction Stop

$keyData = $keyResponse.Content | ConvertFrom-Json
$publicKey = $keyData.key
$keyId = $keyData.key_id

Write-Host "Public key obtained. Setting secret..."

# Encrypt the token using libsodium (you'd need to install it, so instead use GitHub CLI or web UI)
# For now, we'll just show what to do manually
Write-Host ""
Write-Host "⚠️  SECRET SETUP REQUIRED (Manual Step):"
Write-Host "===================================="
Write-Host "1. Go to: https://github.com/$gitHubUser/$gitHubRepo/settings/secrets/actions"
Write-Host "2. Click 'New repository secret'"
Write-Host "3. Name: $secretName"
Write-Host "4. Value: $azureToken"
Write-Host "5. Click 'Add secret'"
Write-Host ""
Write-Host "The deployment will start automatically after you add the secret!"
