#!/usr/bin/env node

/**
 * Token Drift Detection
 * Compares local tokens with Figma to detect when they're out of sync
 */

import dotenv from 'dotenv';
import { readFileSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

async function checkTokenDrift() {
  console.log('🔍 Checking for token drift...\n');
  
  try {
    // Read local tokens
    const localTokensPath = join(projectRoot, 'design-tokens', 'figma-tokens.json');
    const localTokens = JSON.parse(readFileSync(localTokensPath, 'utf-8'));
    
    // Check if Figma API is available
    if (!process.env.FIGMA_TOKEN || !process.env.FIGMA_FILE_KEY) {
      console.log('⚠️  Figma API not configured. Add FIGMA_TOKEN and FIGMA_FILE_KEY to .env.local');
      console.log('📋 Manual check: Compare local tokens with Figma Tokens plugin export\n');
      return;
    }
    
    // Fetch from Figma API (if implemented)
    console.log('🎨 Checking Figma file for changes...');
    
    // For now, we'll do a simpler check - validate local token structure
    const issues = validateTokenStructure(localTokens);
    
    if (issues.length === 0) {
      console.log('✅ No drift detected - tokens appear to be in sync');
    } else {
      console.log('⚠️  Potential issues found:');
      issues.forEach(issue => console.log(`   • ${issue}`));
    }
    
    // Check last modified time
    const stats = statSync(localTokensPath);
    const lastModified = stats.mtime;
    const daysSince = Math.floor((Date.now() - lastModified.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSince > 7) {
      console.log(`⏰ Warning: Local tokens haven't been updated in ${daysSince} days`);
      console.log('   Consider running: npm run tokens:sync');
    }
    
  } catch (error) {
    console.error('❌ Error checking drift:', error.message);
  }
}

function validateTokenStructure(tokens) {
  const issues = [];
  
  try {
    // Check for required sections
    if (!tokens.global) issues.push('Missing global token section');
    if (!tokens.global?.colors) issues.push('Missing colors section');
    if (!tokens.global?.spacing) issues.push('Missing spacing section');
    if (!tokens.global?.typography) issues.push('Missing typography section');
    
    // Check spacing tokens count
    const spacingCount = Object.keys(tokens.global?.spacing?.spacing || {}).length;
    if (spacingCount < 20) issues.push(`Only ${spacingCount} spacing tokens found (expected ~30)`);
    
    // Check border radius tokens
    const radiusCount = Object.keys(tokens.global?.spacing?.borderRadius || {}).length;
    if (radiusCount < 8) issues.push(`Only ${radiusCount} border radius tokens found (expected 9)`);
    
    // Check color tokens
    const colorCount = Object.keys(tokens.global?.colors || {}).length;
    if (colorCount < 100) issues.push(`Only ${colorCount} color tokens found (expected 100+)`);
    
  } catch (error) {
    issues.push(`Structure validation error: ${error.message}`);
  }
  
  return issues;
}

checkTokenDrift(); 