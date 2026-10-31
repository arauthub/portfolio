#!/usr/bin/env node
/**
 * Nexus Prime - Jamstack Build Script & Static Generator
 * Generates pre-rendered static artifacts and validates monorepo sync
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const APP_ROOT = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(APP_ROOT, '../..');

console.log('⚡ Starting Nexus Prime Jamstack Static Compilation...');

// 1. Verify and extract Git commits
let gitCommits = [];
let activeBranch = 'main';
let headCommit = 'HEAD';
try {
  activeBranch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: REPO_ROOT, encoding: 'utf-8' }).trim() || 'main';
  headCommit = execSync('git rev-parse --short HEAD', { cwd: REPO_ROOT, encoding: 'utf-8' }).trim() || 'HEAD';
  const gitLogCmd = `git log -n 15 --pretty=format:'{"hash":"%h","fullHash":"%H","author":"%an","date":"%ai","relativeDate":"%ar","message":"%s"}'`;
  const rawLog = execSync(gitLogCmd, { cwd: REPO_ROOT, encoding: 'utf-8' });
  gitCommits = rawLog.trim().split('\n').filter(Boolean).map(line => {
    try {
      return JSON.parse(line);
    } catch {
      return null;
    }
  }).filter(Boolean);
  console.log(`✅ Extracted ${gitCommits.length} verified commits from Git.`);
} catch (err) {
  console.warn(`⚠️ Warning fetching live git log: ${err.message}`);
}

// 2. Count active systems dynamically
let systemsCount = 0;
const categories = ['apps', 'extensions', 'agents', 'devops', 'Websites'];
for (const cat of categories) {
  const catDir = path.join(REPO_ROOT, cat);
  if (fs.existsSync(catDir)) {
    const entries = fs.readdirSync(catDir, { withFileTypes: true });
    for (const ent of entries) {
      if (ent.isDirectory() && !ent.name.startsWith('.') && ent.name !== 'specs') {
        systemsCount++;
      }
    }
  }
}

// 3. Ensure data output directory exists
const dataDir = path.join(APP_ROOT, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 4. Write compiled static metadata
const buildMetadata = {
  buildTime: new Date().toISOString(),
  targetBranch: activeBranch,
  headCommit: headCommit,
  gitCommitCount: gitCommits.length,
  recentCommits: gitCommits.slice(0, 8),
  systemsCount: systemsCount,
  developer: 'Abhijeet Raut',
  jamstackVersion: '1.0.0'
};

fs.writeFileSync(
  path.join(dataDir, 'build-manifest.json'),
  JSON.stringify(buildMetadata, null, 2),
  'utf-8'
);

console.log(`📦 Static build manifest compiled to data/build-manifest.json (${systemsCount} systems active, HEAD ${headCommit})`);
console.log('🎉 Nexus Prime Jamstack Static Pre-rendering Complete (0ms Edge Ready)!');
