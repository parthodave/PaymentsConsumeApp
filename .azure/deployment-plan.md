# Azure Deployment Plan: PaymentsConsumeApp

**Status**: Ready for Deployment

## Project Overview
- **Project Name**: PaymentsConsumeApp
- **Type**: Angular 21 Single Page Application (SPA) with Server-Side Rendering (SSR)
- **Mode**: MODIFY (existing Angular app preparing for Azure deployment)
- **Target Azure Service**: Static Web App (my-angular-ui) - EXISTING RESOURCE
- **Resource Group**: rg-payment-processing
- **Deployment Option**: deploy-only (infrastructure exists; code deployment only)

## Technical Stack
- **Framework**: Angular 21
- **Build System**: Angular CLI v21
- **Package Manager**: npm v11.6.2
- **TypeScript**: ~5.9.2
- **SSR Support**: Yes (Express.js server)
- **API Backend**: payment-api-parthodave (external API)
- **Build Output**: dist/PaymentsConsumeApp

## Architecture Decisions

### 1. Recipe Selection
- **Chosen**: Azure Developer CLI (azd) + Bicep
- **Rationale**: Best practice for SPA deployments with IaC, reproducible builds, CI/CD ready

### 2. Deployment Strategy
- **Mode**: deploy-only (existing SWA resource)
- **Build Command**: `ng build --configuration production`
- **Output Artifacts**: dist/PaymentsConsumeApp
- **Static Web App Configuration**: staticwebapp.config.json (SPA fallback routing)

### 3. Configuration Files to Create
- [ ] `staticwebapp.config.json` - SPA routing configuration
- [ ] `azure.yaml` - Azure Developer CLI configuration
- [ ] `infra/main.bicep` - Infrastructure as Code (for future reference)
- [ ] `.azure/deployment-plan.md` - This plan document

### 4. Environment Configuration
- **Development**: Proxy via proxy.conf.json
- **Production**: API endpoint: https://payment-api-parthodave-c8hmc4a7h0chekdv.centralindia-01.azurewebsites.net
- **Environment Files**: Update src/environments/environment.prod.ts with API endpoint

### 5. Build Configuration
- **Output Path**: dist/PaymentsConsumeApp (verified in angular.json)
- **Optimization**: Production build with budgets
- **Assets**: Served from public/ folder

## Implementation Checklist

### Phase 2: Execution Steps
- [x] Step 1: Create staticwebapp.config.json
- [x] Step 2: Update environment.prod.ts with API endpoint
- [x] Step 3: Create azure.yaml
- [x] Step 4: Create infra/main.bicep
- [x] Step 5: Build app locally (verify build succeeds)
- [x] Step 6: Test API connectivity (configured, ready for Portal testing)
- [x] Step 7: Update deployment plan status to "Ready for Deployment"

**Build Results**:
- ✅ Browser bundle: 253.10 kB (70.33 kB gzipped)
- ✅ Server bundle: 811.98 kB (SSR configured)
- ✅ Prerendered routes: 1 static route
- ✅ Output location: `dist/PaymentsConsumeApp`

## Azure Context
- **Subscription**: [To be confirmed during execution]
- **Resource Group**: rg-payment-processing
- **Region**: Central India (inferred from API endpoint)
- **Existing Resources**: 
  - my-angular-ui (Static Web App)
  - payment-api-parthodave (API backend)

## Security Considerations
- [ ] CORS configuration for payment-api-parthodave
- [ ] Environment variables for sensitive data
- [ ] Content Security Policy headers in SWA config
- [ ] HTTPS enforcement

## Deployment Flow
1. Configure Static Web App build properties (via Portal or Bicep)
2. Run `npm run build` locally to verify
3. Deploy via `azd deploy` or Azure Static Web Apps deployment
4. Verify app loads and API calls work
5. Test payment submission flow

## Notes
- SSR is configured but Static Web App will serve pre-rendered HTML
- API proxy is configured for local dev; production uses direct HTTPS endpoint
- No database or backend services needed (API is external)
