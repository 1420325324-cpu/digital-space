#!/bin/bash
# Digital Space - 部署脚本

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"

echo "🚀 Deploying Digital Space..."

# 1. 构建项目
echo "📦 Building..."
npm run build

# 2. 提交更新
echo "💾 Committing changes..."
git add data/state.json
git commit -m "chore: update state $(date +%Y-%m-%d)" || true

# 3. 推送到 GitHub（如果配置了远程仓库）
if git remote -v | grep -q origin; then
    echo "📤 Pushing to GitHub..."
    git push origin main || echo "⚠️  Push failed, please configure remote"
fi

# 4. 部署到 Vercel（如果安装了 vercel CLI）
if command -v vercel &> /dev/null; then
    echo "🌐 Deploying to Vercel..."
    vercel --prod
else
    echo "ℹ️  Vercel CLI not found. Install with: npm i -g vercel"
    echo "   Then run: vercel --prod"
fi

echo "✅ Done!"
