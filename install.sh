#!/usr/bin/env bash
# ==============================================================================
# 🚀 Tesla Personal Board - One-Click Automated LXC / Production Installer
# Created with VibeCoding support
# ==============================================================================

set -e

# Visual formatting
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}==============================================================================${NC}"
echo -e "${GREEN}🚀 Tesla Personal Board — Full Automated LXC & Production Setup${NC}"
echo -e "${BLUE}==============================================================================${NC}"

# Check root privileges
if [ "$(id -u)" -ne 0 ]; then
    echo -e "${RED}❌ Error: This script must be run as root (or with sudo).${NC}"
    exit 1
fi

INSTALL_DIR="/var/www/tesla-board"
REPO_URL="https://github.com/MrBlueDave/tesla-board.git"

echo -e "${YELLOW}📋 Step 1/6: Updating system package repositories...${NC}"
export DEBIAN_FRONTEND=noninteractive
apt-get update -y

echo -e "${YELLOW}📦 Step 2/6: Installing core system dependencies (curl, git, build-essential)...${NC}"
apt-get install -y curl git ca-certificates gnupg build-essential

# Install Node.js 20 LTS if missing or outdated
if ! command -v node &> /dev/null || [ $(node -v | cut -d'.' -f1 | tr -d 'v') -lt 18 ]; then
    echo -e "${YELLOW}🟢 Installing Node.js 20 LTS from NodeSource...${NC}"
    mkdir -p /etc/apt/keyrings
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg --overwrite
    NODE_MAJOR=20
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
    apt-get update -y
    apt-get install -y nodejs
fi

NODE_VER=$(node -v)
NPM_VER=$(npm -v)
echo -e "${GREEN}✅ Node.js ($NODE_VER) & NPM ($NPM_VER) ready.${NC}"

# Setup Project Directory & Repository
echo -e "${YELLOW}📂 Step 3/6: Setting up project in $INSTALL_DIR...${NC}"
mkdir -p /var/www

if [ -d "$INSTALL_DIR/.git" ]; then
    echo -e "${YELLOW}🔄 Updating existing repository in $INSTALL_DIR...${NC}"
    cd "$INSTALL_DIR"
    git fetch origin main
    git reset --hard origin/main
else
    echo -e "${YELLOW}📥 Cloning repository from $REPO_URL...${NC}"
    rm -rf "$INSTALL_DIR"
    git clone "$REPO_URL" "$INSTALL_DIR"
    cd "$INSTALL_DIR"
fi

# Setup Data & Config
echo -e "${YELLOW}🔑 Step 4/6: Initializing data directory and configuration...${NC}"
mkdir -p "$INSTALL_DIR/data"
chmod -R 777 "$INSTALL_DIR/data"

if [ ! -f "$INSTALL_DIR/data/config.json" ]; then
    echo '{"masterPassword": "tesla"}' > "$INSTALL_DIR/data/config.json"
fi

if [ ! -f "$INSTALL_DIR/data/user_profiles.json" ]; then
    cat << 'EOF' > "$INSTALL_DIR/data/user_profiles.json"
{
  "activePin": "0000",
  "profiles": {
    "0000": {
      "pin": "0000",
      "name": "Default User",
      "catalog": [],
      "hiddenPresets": [],
      "favorites": [],
      "hiddenCategories": []
    }
  }
}
EOF
fi

# NPM Install & Build
echo -e "${YELLOW}📦 Step 5/6: Installing NPM packages & building production assets...${NC}"
cd "$INSTALL_DIR"
npm install
npm run build

# Systemd Service Setup
echo -e "${YELLOW}⚙️ Step 6/6: Configuring Systemd service (tesla-board.service)...${NC}"
NODE_BIN=$(which node || echo "/usr/bin/node")
cat << EOF > /etc/systemd/system/tesla-board.service
[Unit]
Description=Tesla Personal Board Production Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=$INSTALL_DIR
ExecStart=$NODE_BIN server.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production PORT=80

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable tesla-board.service
systemctl restart tesla-board.service

# Get primary IP address
SERVER_IP=$(hostname -I 2>/dev/null | awk '{print $1}' || echo "your-server-ip")

echo -e "${BLUE}==============================================================================${NC}"
echo -e "${GREEN}🎉 Tesla Personal Board successfully installed & deployed!${NC}"
echo -e "${BLUE}==============================================================================${NC}"
echo -e "🌐 Access Dashboard: ${GREEN}http://${SERVER_IP}${NC}"
echo -e "🔑 Master Password:  ${YELLOW}tesla${NC}"
echo -e "⚙️ Systemd Service:  ${GREEN}tesla-board.service (Active & Enabled on Boot)${NC}"
echo -e "📊 Status Check:     ${YELLOW}systemctl status tesla-board.service${NC}"
echo -e "${BLUE}==============================================================================${NC}"
