# 🚀 Tesla Personal Board v0.8.3 — Self-Hosted Automotive Dashboard

An ultra-fast, responsive, multi-user self-hosted personal board specifically engineered and UI-optimized for **Tesla Vehicle Touchscreens** (1180x919 viewport), tablets, desktop, and mobile browsers.

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

## 📦 1. System Requirements

- **Node.js**: v18.x or v20.x+
- **NPM**: v9.x+
- **Recommended Linux Path**: `/var/www/tesla-board`

---

## 🛠️ 2. Quick Installation Guide (Linux / Proxmox LXC)

1. **Extract the release ZIP archive into your web server directory**:
   ```bash
   mkdir -p /var/www/tesla-board
   unzip Tesla-Personal-Board-Release.zip -d /var/www/tesla-board
   cd /var/www/tesla-board
   ```

2. **Create the data directory and grant write permissions**:
   ```bash
   mkdir -p /var/www/tesla-board/data
   chmod -R 777 /var/www/tesla-board/data
   ```

3. **Install dependencies and build production bundle** (if building from source):
   ```bash
   npm install
   npm run build
   ```

---

## 🔑 3. Master Password Configuration

The default master password is stored in `data/config.json`:
```json
{
  "masterPassword": "tesla"
}
```

To change the master password required for first-time browser logins:
- Edit `data/config.json` with your preferred editor (e.g. `nano data/config.json`).

---

## ⚙️ 4. Systemd Service Setup (Automatic Boot)

Keep the Node.js production server running as a persistent background daemon on system startup.

1. **Create the systemd service file**:
   ```bash
   nano /etc/systemd/system/tesla-board.service
   ```

2. **Paste the following service configuration**:
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

3. **Enable and start the service**:
   ```bash
   systemctl daemon-reload
   systemctl enable tesla-board.service
   systemctl start tesla-board.service
   ```

4. **Verify service status and inspect live logs**:
   ```bash
   systemctl status tesla-board.service
   journalctl -u tesla-board.service -f -n 50
   ```

---

## 🌐 5. Reverse Proxy Configuration (Nginx Proxy Manager)

If accessing externally via Nginx Proxy Manager or Nginx Reverse Proxy with SSL/HTTPS:
- **Scheme**: `http`
- **Forward IP**: Internal LXC IP address (e.g., `192.168.1.214`)
- **Forward Port**: `80` (or your configured `PORT`)
- **Websockets Support**: Enabled (`ON`)

---

## 🖥️ 6. Running Locally in Development Mode

To run the app locally with Vite dev server:
```bash
npm install
npm run dev
```
The development server will start on `http://localhost:3000`.

---

## 📄 License
Released under the MIT License.
