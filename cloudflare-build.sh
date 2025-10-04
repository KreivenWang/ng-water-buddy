#!/bin/bash

# Cloudflare Pages 构建脚本
# 用于 Cloudflare Pages 的自动构建

echo "🚀 开始构建 Water Buddy PWA..."

# 安装依赖
echo "📦 安装依赖..."
npm ci

# 构建生产版本
echo "🔨 构建生产版本..."
npm run build:prod

# 复制 Cloudflare Pages 配置文件到构建输出目录
echo "📋 复制 Cloudflare Pages 配置文件..."
cp _headers dist/ng-water-buddy/
cp _redirects dist/ng-water-buddy/

# 创建 robots.txt
echo "🤖 创建 robots.txt..."
cat > dist/ng-water-buddy/robots.txt << EOF
User-agent: *
Allow: /

Sitemap: https://your-domain.pages.dev/sitemap.xml
EOF

# 创建 sitemap.xml
echo "🗺️ 创建 sitemap.xml..."
cat > dist/ng-water-buddy/sitemap.xml << EOF
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://your-domain.pages.dev/</loc>
    <lastmod>$(date -u +%Y-%m-%dT%H:%M:%S+00:00)</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://your-domain.pages.dev/dashboard</loc>
    <lastmod>$(date -u +%Y-%m-%dT%H:%M:%S+00:00)</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
EOF

echo "✅ 构建完成！"
echo "📁 构建输出目录: dist/ng-water-buddy/"
echo "🌐 准备部署到 Cloudflare Pages..."
