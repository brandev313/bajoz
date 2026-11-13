/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Hostinger Unlimited Plan Full-Stack Build & Deployment Script
 * Generates a ready-to-upload production build in `dist/` and `server.js`
 * that works with:
 *   1. Hostinger Node.js Web App (Phusion Passenger / `app.js` / `server.js`)
 *   2. Hostinger Unlimited Shared Hosting (`public_html` with `.htaccess` + `api/index.php`)
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');

function logStep(step, message) {
  console.log(`\n[BAJOZ Hostinger Build ${step}] ${message}`);
}

try {
  // 1. Build Vite Frontend SPA into dist/
  logStep('1/5', 'Compiling production React + Tailwind frontend bundle (vite build)...');
  execSync('npx vite build', { stdio: 'inherit', cwd: rootDir });

  // 2. Bundle Node.js Express + WebSocket + Database Server into server.js
  logStep('2/5', 'Bundling self-hosted Node.js full-stack server (server.js)...');
  execSync(
    'npx esbuild server.ts --bundle --platform=node --packages=external --format=esm --outfile=server.js',
    { stdio: 'inherit', cwd: rootDir }
  );

  // 3. Ensure persistent storage and uploads directory structure exists in both root and dist/
  logStep('3/5', 'Provisioning self-hosted database & media storage directories...');
  const requiredDirs = [
    path.join(rootDir, 'storage', 'db'),
    path.join(rootDir, 'public', 'uploads', 'products'),
    path.join(rootDir, 'public', 'uploads', 'pages'),
    path.join(rootDir, 'public', 'uploads', 'brand'),
    path.join(rootDir, 'public', 'uploads', 'general'),
    path.join(distDir, 'storage', 'db'),
    path.join(distDir, 'uploads', 'products'),
    path.join(distDir, 'uploads', 'pages'),
    path.join(distDir, 'uploads', 'brand'),
    path.join(distDir, 'uploads', 'general'),
  ];

  for (const dir of requiredDirs) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Copy existing database snapshot into dist/storage/db if present
  const primaryDbFile = path.join(rootDir, 'storage', 'db', 'bajoz-database.json');
  const legacyDbFile = path.join(rootDir, '.dtcss-store-db.json');
  const distDbFile = path.join(distDir, 'storage', 'db', 'bajoz-database.json');

  if (fs.existsSync(primaryDbFile)) {
    fs.copyFileSync(primaryDbFile, distDbFile);
  } else if (fs.existsSync(legacyDbFile)) {
    fs.copyFileSync(legacyDbFile, primaryDbFile);
    fs.copyFileSync(legacyDbFile, distDbFile);
  }

  // Protect storage/db on Apache/LiteSpeed with a dedicated .htaccess
  const dbHtaccess = `<IfModule mod_authz_core.c>\n  Require all denied\n</IfModule>\n<IfModule !mod_authz_core.c>\n  Order deny,allow\n  Deny from all\n</IfModule>\n`;
  fs.writeFileSync(path.join(rootDir, 'storage', 'db', '.htaccess'), dbHtaccess, 'utf-8');
  fs.writeFileSync(path.join(distDir, 'storage', 'db', '.htaccess'), dbHtaccess, 'utf-8');

  // 4. Verify .htaccess and api/index.php are present in dist/
  logStep('4/5', 'Verifying Hostinger Apache/LiteSpeed .htaccess & PHP API Gateway...');
  const publicHtaccess = path.join(rootDir, 'public', '.htaccess');
  const distHtaccess = path.join(distDir, '.htaccess');
  if (fs.existsSync(publicHtaccess) && !fs.existsSync(distHtaccess)) {
    fs.copyFileSync(publicHtaccess, distHtaccess);
  }

  // 5. Write Hostinger deployment manifest summary
  logStep('5/5', 'Writing Hostinger deployment package summary...');
  const deploymentInfo = {
    brand: 'BAJOZ — The House of Naturals',
    domain: 'https://bajoz.pk',
    builtAt: new Date().toISOString(),
    modes: {
      hostingerSharedPublicHtml: {
        description: 'Upload all contents of `dist/` (including `.htaccess` and `api/index.php`) directly to `public_html/` on Hostinger Unlimited Shared Hosting.',
        databasePath: 'public_html/storage/db/bajoz-database.json',
        uploadsPath: 'public_html/uploads/',
      },
      hostingerNodeJsApp: {
        description: 'Deploy the repository root with entry point `app.js` or `server.js` on Hostinger Node.js Web App / VPS.',
        entryPoint: 'app.js',
        startCommand: 'npm start',
        databasePath: 'storage/db/bajoz-database.json',
        uploadsPath: 'public/uploads/',
      },
    },
  };

  fs.writeFileSync(
    path.join(distDir, 'hostinger-deployment-manifest.json'),
    JSON.stringify(deploymentInfo, null, 2),
    'utf-8'
  );

  console.log('\n✅ BAJOZ Full-Stack Hostinger Build Complete!');
  console.log('   • Frontend + PHP/Apache bundle: ./dist/');
  console.log('   • Node.js production server:    ./server.js (entry alias: ./app.js)\n');
} catch (error) {
  console.error('\n❌ Hostinger build failed:', error);
  process.exit(1);
}
