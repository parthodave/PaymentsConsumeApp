# 🚀 Azure Static Web App Deployment - Complete Setup Guide

## ✅ What's Already Done

### 1. **Configuration Files Created**
- ✅ `staticwebapp.config.json` - Handles SPA routing and security headers
- ✅ `azure.yaml` - Azure Developer CLI configuration
- ✅ `infra/main.bicep` - Infrastructure as Code template
- ✅ `src/app/app.ts` - Updated with platform-aware API endpoint handling

### 2. **Application Built Successfully**
- ✅ `npm run build` completed without errors
- ✅ Output location: `dist/PaymentsConsumeApp/browser`
- ✅ Bundle size: 253.10 kB (70.33 kB gzipped)

### 3. **GitHub Actions Workflow Created**
- ✅ `.github/workflows/azure-static-web-apps-deploy.yml` - Automated CI/CD pipeline
- ✅ Configured to:
  - Trigger on every push to `master` branch
  - Install dependencies (`npm ci`)
  - Build Angular app (`npm run build`)
  - Deploy to Azure Static Web App

### 4. **Code Pushed to GitHub**
- ✅ Repository: https://github.com/parthodave/PaymentsConsumeApp
- ✅ All files synced (branch: master)

---

## 🔧 Final Step: Add GitHub Secret (ONE Manual Step Required)

The GitHub Actions workflow is ready but needs the Azure deployment token to authenticate with Azure.

### How to Add the Secret:

1. **Go to GitHub Repository Settings**
   - Navigate to: https://github.com/parthodave/PaymentsConsumeApp/settings/secrets/actions
   - Or: Your repo → Settings tab (top right) → Secrets and variables → Actions

2. **Click "New repository secret"**

3. **Add Secret Details**
   - **Name**: `AZURE_STATIC_WEB_APPS_API_TOKEN_MY_ANGULAR_UI`
   - **Value**: Copy the deployment token from Azure Portal:
     - Portal → my-angular-ui → Settings → Deployment
     - Copy the token value
     - Paste into the GitHub secret field

4. **Click "Add secret"**

---

## ⚡ What Happens After You Add the Secret

1. **GitHub Actions Automatically Triggers**
   - GitHub detects the new secret
   - Starts the `azure-static-web-apps-deploy.yml` workflow
   - Takes 2-3 minutes to complete

2. **Watch the Deployment**
   - Go to: https://github.com/parthodave/PaymentsConsumeApp/actions
   - You'll see the workflow running with status updates
   - Green checkmark ✅ = Success
   - Red X ❌ = Failed (rare, will show error details)

3. **App Goes Live**
   - After success, your app is deployed to:
   - **https://my-angular-ui.azurestaticapps.net**

---

## ✅ Verify the Deployment

Once GitHub Actions shows ✅ **Success**:

1. **Open the App**
   - https://my-angular-ui.azurestaticapps.net

2. **Test Payment Submission**
   - Account Number: `12345`
   - Amount: `100`
   - Click "Submit Payment"
   - Expected: "Payment submitted successfully"

3. **Check Browser Console** (F12)
   - Should show no CORS errors
   - Confirm API call to payment API succeeded

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│   Your Local Machine                                │
│  ┌──────────────────────────────────────────────┐  │
│  │  PaymentsConsumeApp (Angular 21)             │  │
│  │  • src/app/ (TypeScript components)          │  │
│  │  • dist/ (Built output)                      │  │
│  │  • .github/workflows/ (CI/CD)                │  │
│  └──────────────────────────────────────────────┘  │
│           ↓ git push                                │
└─────────────────────────────────────────────────────┘
                     ↓
        ┌────────────────────────────────┐
        │   GitHub Repository            │
        │   parthodave/PaymentsConsume    │
        │                                │
        │   GitHub Actions (CI/CD)       │
        │   • Builds Angular app         │
        │   • Runs npm install & build   │
        │   • Deploys to Azure           │
        └────────────────────────────────┘
                     ↓
        ┌────────────────────────────────┐
        │   Azure Static Web App         │
        │   (my-angular-ui)              │
        │                                │
        │   Free Tier                    │
        │   • Automatic HTTPS            │
        │   • 100GB bandwidth/month       │
        │   • Global CDN                 │
        └────────────────────────────────┘
                     ↓
        ┌────────────────────────────────┐
        │   External Payment API         │
        │   payment-api-parthodave       │
        │   (Azure Web App)              │
        │                                │
        │   CORS: Allows requests from   │
        │   https://my-angular-ui...     │
        └────────────────────────────────┘
```

---

## 📝 Summary of All Changes

| File | Purpose | Status |
|------|---------|--------|
| `staticwebapp.config.json` | SPA routing configuration | ✅ Created |
| `azure.yaml` | Azure CLI/azd configuration | ✅ Created |
| `infra/main.bicep` | Infrastructure as Code | ✅ Created |
| `src/app/app.ts` | Updated API endpoint handling | ✅ Updated |
| `.github/workflows/azure-static-web-apps-deploy.yml` | Automated deployment workflow | ✅ Created |
| `dist/PaymentsConsumeApp/` | Built production app | ✅ Generated |
| GitHub Repository | Code synced | ✅ Pushed |

---

## 🎯 What Each Component Does

### **staticwebapp.config.json**
- Handles SPA routing (all requests → index.html for Angular routing)
- Adds security headers (X-Frame-Options, X-Content-Type-Options)
- Caches static assets (CSS, JS, images)
- Rewrites 404 errors to index.html (SPA requirement)

### **azure.yaml**
- Tells Azure Developer CLI about your project structure
- Specifies: TypeScript project, Static Web App host
- Enables automated builds with `azd up` or `azd deploy`

### **infra/main.bicep**
- Infrastructure-as-Code for your Azure resources
- Defines: Static Web App SKU, build properties, app settings
- Allows reproducible infrastructure provisioning
- Uses Standard tier for production-grade service

### **.github/workflows/azure-static-web-apps-deploy.yml**
- GitHub Actions workflow (automation)
- Triggered on every push to `master` branch
- Steps:
  1. Checkout code
  2. Install dependencies (`npm ci`)
  3. Build app (`npm run build`)
  4. Deploy to Azure (using API token)

### **Updated src/app/app.ts**
- Added `PLATFORM_ID` injection (for SSR compatibility)
- Added `isPlatformBrowser()` check (prevents "window is not defined" errors)
- Made API endpoint configurable (reads from Azure environment variables)
- Fallback to hardcoded production endpoint if env vars unavailable

---

## 🔐 Security Considerations

✅ **Implemented:**
- HTTPS enforced (Azure Static Web App auto-HTTPS)
- CORS configured on payment API
- Security headers set (X-Frame-Options, X-Content-Type-Options)
- GitHub secret for deployment token (not in code)
- No sensitive data in public files

---

## 🚨 Troubleshooting

### If GitHub Actions Fails
1. Go to: GitHub repo → Actions tab
2. Click the failed workflow
3. Read the error log
4. Common issues:
   - Secret name typo → Check exact name matches workflow file
   - Expired token → Get fresh token from Azure Portal
   - Build failed → Run `npm run build` locally to debug

### If App Shows Blank Page
1. Verify `app_location` in workflow = `/dist/PaymentsConsumeApp/browser`
2. Check browser console (F12) for errors
3. Verify `staticwebapp.config.json` has correct paths

### If Payment API Shows CORS Error
1. Verify CORS is configured on `payment-api-parthodave`
2. Ensure domain is exactly: `https://my-angular-ui.azurestaticapps.net`
3. Allow POST and OPTIONS methods

---

## ✨ Next Steps After Deployment

1. **Monitor Performance**
   - Azure Portal → my-angular-ui → Application Insights
   - GitHub Actions → Check workflow logs

2. **Make Changes**
   - Edit code locally
   - Run `npm run build` to test
   - `git push origin master` to deploy automatically

3. **Scale Up (if needed)**
   - Upgrade to Standard tier for:
     - Custom domains
     - Advanced authentication
     - Staging environments
     - SLA guarantee

---

**🎉 Your Angular app is ready for automated deployment!**
