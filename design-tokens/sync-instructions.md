# Figma-Code Sync Guide

## Initial Setup

1. Get Figma Personal Access Token from Figma → Account Settings → Personal Access Tokens
2. Get Figma File Key from your design system file URL
3. Set environment variables: FIGMA_TOKEN and FIGMA_FILE_KEY
4. Install Figma Tokens plugin in your Figma file
5. Run initial sync: npm run sync-figma

## Daily Sync Workflow

🔄 Code → Figma:
  1. Make changes to CSS variables or components
  2. Run: npm run extract-tokens
  3. Import updated design-tokens/figma-tokens.json to Figma
  4. Update component documentation in Figma

🔄 Figma → Code:
  1. Export tokens from Figma Tokens plugin
  2. Compare with current tokens for conflicts
  3. Update CSS variables if needed
  4. Run: npm run extract-tokens to verify

## Automation Options

• Git hooks (pre-commit): Auto-extract tokens on commit
• GitHub Actions: Auto-update tokens on main branch changes
• Figma Webhooks: Get notified when design files change
• Slack Integration: Team notifications for sync events

## Common Issues

Token conflicts: Use npm run sync-figma --validate-only to check
Missing components: Ensure all UI components have proper exports
Theme issues: Verify CSS variable format matches expectations
Figma API errors: Check token permissions and file access

