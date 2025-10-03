#!/bin/bash

# 本地 PWA 测试脚本
# 创建自签名证书并启动 HTTPS 服务器

set -e

echo "🔧 设置本地 HTTPS 测试环境..."

# 创建证书目录
mkdir -p certs

# 检查是否已有证书
if [ ! -f "certs/cert.pem" ] || [ ! -f "certs/key.pem" ]; then
    echo "📜 生成自签名证书..."
    
    # 生成私钥
    openssl genrsa -out certs/key.pem 2048
    
    # 生成证书
    openssl req -new -x509 -key certs/key.pem -out certs/cert.pem -days 365 -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
    
    echo "✅ 证书生成完成"
else
    echo "✅ 证书已存在"
fi

# 构建应用
echo "🔨 构建应用..."
npm run build:prod

# 启动 HTTPS 服务器
echo "🚀 启动 HTTPS 服务器..."
echo "📱 访问地址: https://localhost:8080"
echo "⚠️  浏览器会显示安全警告，请点击 '高级' → '继续访问'"
echo "🛑 按 Ctrl+C 停止服务器"

npx http-server dist/ng-water-buddy -p 8080 -S -C certs/cert.pem -K certs/key.pem
