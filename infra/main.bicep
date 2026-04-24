@description('Name of the Static Web App')
param staticWebAppName string = 'my-angular-ui'

@description('Location for the resource')
param location string = resourceGroup().location

@description('SKU for Static Web App')
@allowed([
  'Free'
  'Standard'
])
param sku string = 'Standard'

@description('Tags for resources')
param tags object = {
  environment: 'production'
  project: 'PaymentsConsume'
  managed: 'azd'
}

resource staticWebApp 'Microsoft.Web/staticSites@2023-12-01' = {
  name: staticWebAppName
  location: location
  sku: {
    name: sku
    tier: sku
  }
  tags: tags
  properties: {
    buildProperties: {
      appLocation: '/'
      outputLocation: 'dist/PaymentsConsumeApp'
      apiLocation: ''
    }
    provider: 'DevOps'
    enterpriseGradeCdnStatus: 'Enabled'
  }
}

resource staticWebAppAppSettings 'Microsoft.Web/staticSites/config@2023-12-01' = {
  parent: staticWebApp
  name: 'appsettings'
  properties: {
    API_ENDPOINT: 'https://payment-api-parthodave-c8hmc4a7h0chekdv.centralindia-01.azurewebsites.net'
    ENVIRONMENT: 'production'
  }
}

output endpoint string = 'https://${staticWebApp.properties.defaultHostname}'
output resourceId string = staticWebApp.id
output staticWebAppName string = staticWebApp.name
