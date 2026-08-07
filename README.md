# 🚀 Tesla Personal Board v0.8.3 — Self-Hosted Automotive Dashboard

An ultra-fast, responsive, multi-user self-hosted personal board specifically engineered and UI-optimized for **Tesla Vehicle Touchscreens** (1180x919 viewport), tablets, desktop, and mobile browsers.

> ⚡ *Created & Enhanced with the support of **VibeCoding**.*

---

## 🌟 Key Features

- **Automotive Touch Optimized**: Minimum 48x48px touch targets, zero backdrop-blur GPU overhead, high-contrast typography, and native touch spring press feedback.
- **Master Password Security**: First-time browser authentication lock screen with a Tesla-style PIN keypad. Includes a zero-latency synchronous head guard (**0ms FOUC flicker**).
- **Multi-User PIN Profiles**: Supports switching profiles on the fly with real-time cross-browser disk synchronization (`/api/profiles`).
- **8 Automotive Themes**:
  - **4 Dark Themes**: Tesla Dark Futuristic (Default), OLED Pure Black (`#000000`), Slate Minimal, Cyberpunk Neon.
  - **4 Light Themes**: Tesla Light Pure, Nordic Slate & Frost, Champagne Sand Quartz, Emerald Cyber Light.
- **Full-Screen & YouTube Redirect Modes**: Launch web services directly or trigger full-screen vehicle web browser mode via YouTube URL redirect.
- **Live Widgets**: Real-time clock and Open-Meteo weather caching.
- **Backup & Maintenance**: Complete export/import of profile configurations to JSON files.

---

## ⚡ 1-Click Automated Installation (Proxmox LXC / Linux)

Run this single command on a clean Debian / Ubuntu / Proxmox LXC container to fully automate system dependencies (Node.js 20, Git, Build Tools), repository cloning, production build, and `systemd` background service auto-start:

```bash
curl -sSL https://raw.githubusercontent.com/MrBlueDave/tesla-board/main/install.sh | bash
```

Or clone first and run locally:

```bash
git clone https://github.com/MrBlueDave/tesla-board.git
cd tesla-board
chmod +x install.sh
sudo ./install.sh
```

---

## 🪟 Windows Installation

On Windows (CMD / PowerShell):

```cmd
git clone https://github.com/MrBlueDave/tesla-board.git
cd tesla-board
.\install.bat
```

---

## 🛠️ Manual Installation

If you prefer installing manually:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/MrBlueDave/tesla-board.git /var/www/tesla-board
   cd /var/www/tesla-board
   ```

2. **Initialize data directory**:
   ```bash
   mkdir -p data
   chmod -R 777 data
   ```

3. **Install dependencies & build**:
   ```bash
   npm install
   npm run build
   ```

4. **Start the production server**:
   ```bash
   npm start
   ```

---

## 🔑 Master Password & Configuration

The default master password for first-time browser login is stored in `data/config.json`:
```json
{
  "masterPassword": "tesla"
}
```

To change the master password:
- Edit `data/config.json` (e.g., `nano data/config.json`).
- Restart the server (`systemctl restart tesla-board.service` or `npm start`).

---

## ⚙️ Systemd Service Configuration (Auto-Boot)

The automated installer configures `/etc/systemd/system/tesla-board.service` automatically. Manual service configuration:

```ini
[Unit]
Description=Tesla Personal Board Production Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/tesla-board
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production PORT=80

[Install]
WantedBy=multi-user.target
```

Enable and control the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable tesla-board.service
sudo systemctl start tesla-board.service
sudo systemctl status tesla-board.service
```

---

## 🌐 Reverse Proxy Setup (Nginx / Nginx Proxy Manager)

If serving behind Nginx Proxy Manager or Nginx Reverse Proxy with SSL/HTTPS:
- **Scheme**: `http`
- **Forward IP**: Internal container/server IP (e.g. `192.168.1.233`)
- **Forward Port**: `80` (or your custom `PORT`)
- **Websockets Support**: `ON` (Enabled)

---

## 📄 License

Released under the MIT License.
