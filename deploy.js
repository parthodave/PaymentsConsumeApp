const fs = require('fs');
const path = require('path');
const https = require('https');

const DEPLOYMENT_TOKEN = 'a8d40362070bd9218b2cab2d536855b9ed580b61952cabd265ca2ce55151412e07-e8136f86-d710-4611-b897-2aefad3e6c020002004081633c00';
const APP_HOSTNAME = 'happy-ocean-081633c00.7.azurestaticapps.net';
const SRC_PATH = './dist/PaymentsConsumeApp/browser';

console.log('🚀 Starting Azure Static Web App Deployment');
console.log(`Source: ${SRC_PATH}`);
console.log('');

// Parse token to get environment ID
const [apiToken, ...envParts] = DEPLOYMENT_TOKEN.split('-');
const environmentId = envParts.join('-');

console.log('Analyzing files to deploy...');

// Get all files recursively
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

const files = getAllFiles(SRC_PATH);
console.log(`Found ${files.length} files to deploy`);
console.log('');

// Upload each file
let uploadedCount = 0;
let failedCount = 0;

async function uploadFiles() {
  for (const file of files) {
    const relativePath = file.replace(SRC_PATH, '').replace(/\\/g, '/').replace(/^\//, '');
    const fileContent = fs.readFileSync(file);
    
    // Use the correct deployment endpoint with the app hostname
    const deploymentUrl = `https://${APP_HOSTNAME}/api/publish/uploads/${relativePath}`;
    
    try {
      await uploadFile(deploymentUrl, fileContent, relativePath);
      uploadedCount++;
      console.log(`✅ Uploaded: ${relativePath} (${uploadedCount}/${files.length})`);
    } catch (error) {
      failedCount++;
      console.log(`❌ Failed: ${relativePath}`);
      console.log(`   Error: ${error.message}`);
    }
  }
}

function uploadFile(url, content, fileName) {
  return new Promise((resolve, reject) => {
    try {
      const urlObj = new URL(url);
      
      const options = {
        hostname: urlObj.hostname,
        port: 443,
        path: urlObj.pathname + urlObj.search,
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${DEPLOYMENT_TOKEN}`,
          'Content-Type': 'application/octet-stream',
          'Content-Length': content.length
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve();
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        });
      });

      req.on('error', reject);
      req.write(content);
      req.end();
    } catch (error) {
      reject(error);
    }
  });
}

uploadFiles().then(() => {
  console.log('');
  console.log('📊 Deployment Summary:');
  console.log(`   ✅ Uploaded: ${uploadedCount}`);
  console.log(`   ❌ Failed: ${failedCount}`);
  console.log('');
  
  if (failedCount === 0) {
    console.log('🎉 Deployment Complete!');
    console.log(`Your app is live at: https://${APP_HOSTNAME}`);
  } else {
    console.log('⚠️  Deployment completed with errors');
    process.exit(1);
  }
}).catch(error => {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
});
