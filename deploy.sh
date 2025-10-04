#!/bin/bash

# Water Buddy PWA 快速部署脚本
# 一键部署到 Cloudflare Pages

set -e

echo "🚀 Water Buddy PWA 快速部署脚本"
echo "=================================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查 Git 状态
echo -e "${BLUE}📋 检查 Git 状态...${NC}"
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${GREEN}✅ 工作目录干净${NC}"
else
    echo -e "${YELLOW}⚠️  检测到未提交的更改${NC}"
    read -p "是否继续部署？(y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}❌ 部署已取消${NC}"
        exit 1
    fi
fi

# 检查当前分支
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${BLUE}🌿 当前分支: ${CURRENT_BRANCH}${NC}"

if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
    echo -e "${YELLOW}⚠️  建议在 main 或 master 分支部署${NC}"
    read -p "是否继续？(y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}❌ 部署已取消${NC}"
        exit 1
    fi
fi

# 构建应用
echo -e "${BLUE}🔨 构建应用...${NC}"
npm run build:prod

# 复制 Cloudflare Pages 配置文件
echo -e "${BLUE}📋 复制配置文件...${NC}"
cp _headers dist/ng-water-buddy/ 2>/dev/null || echo -e "${YELLOW}⚠️  _headers 文件不存在${NC}"
cp _redirects dist/ng-water-buddy/ 2>/dev/null || echo -e "${YELLOW}⚠️  _redirects 文件不存在${NC}"

# 提交更改
echo -e "${BLUE}💾 提交更改...${NC}"
git add .
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')" || echo -e "${YELLOW}⚠️  没有新的更改需要提交${NC}"

# 推送到远程仓库
echo -e "${BLUE}📤 推送到 GitHub...${NC}"
git push origin "$CURRENT_BRANCH"

echo -e "${GREEN}✅ 代码已推送到 GitHub${NC}"
echo -e "${BLUE}🔄 Cloudflare Pages 将自动开始构建和部署...${NC}"

# 获取远程仓库信息
REMOTE_URL=$(git remote get-url origin)
if [[ $REMOTE_URL == *"github.com"* ]]; then
    REPO_NAME=$(basename "$REMOTE_URL" .git)
    echo -e "${BLUE}📱 部署状态可以在以下位置查看：${NC}"
    echo -e "   GitHub: https://github.com/$(echo $REMOTE_URL | sed 's/.*github.com[:/]\([^/]*\/[^/]*\).*/\1/')"
    echo -e "   Cloudflare: https://dash.cloudflare.com/pages"
fi

echo -e "${GREEN}🎉 部署流程已启动！${NC}"
echo -e "${YELLOW}💡 提示：${NC}"
echo -e "   - 部署通常需要 2-5 分钟完成"
echo -e "   - 可以在 Cloudflare Dashboard 查看构建进度"
echo -e "   - 部署完成后会收到通知邮件"

# 询问是否打开 Cloudflare Dashboard
read -p "是否打开 Cloudflare Pages Dashboard？(y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    open "https://dash.cloudflare.com/pages" 2>/dev/null || echo -e "${YELLOW}⚠️  请手动访问: https://dash.cloudflare.com/pages${NC}"
fi
