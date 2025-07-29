#!/bin/bash

# TDP CLI Local Install Script
# This script allows you to test the CLI locally before publishing

echo "🎨 TDP CLI Local Install"
echo "========================"

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "dist" ]; then
    echo "❌ Error: Please run this script from the CLI directory"
    echo "   Make sure you've built the CLI with: npm run build"
    exit 1
fi

# Create global npm link
echo "🔗 Creating global npm link..."
npm link

if [ $? -eq 0 ]; then
    echo "✅ TDP CLI installed globally!"
    echo ""
    echo "You can now use:"
    echo "  tdp init     - Initialize TDP Design System"
    echo "  tdp add button - Add components"
    echo "  tdp --help   - See all commands"
    echo ""
    echo "To uninstall: npm unlink -g @tdp/cli"
else
    echo "❌ Installation failed"
    exit 1
fi 