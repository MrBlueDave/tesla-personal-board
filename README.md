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

## 📦 System Requirements

- **Node.js**: v18.x or v20.x+
- **NPM**: v9.x+
- **Git**: Installed on your system

---

## ⚡ Quick Installation

### 1. Clone the Repository
```bash
git clone https://github.com/MrBlueDave/tesla-board.git
cd tesla-board
```

### 2. Run the Automatic Installer

#### 🐧 On Linux / macOS / Proxmox LXC:
```bash
chmod +x install.sh
./install.sh
```

#### 🪟 On Windows (CMD / PowerShell):
```cmd
.\install.bat
```

The installer automatically verifies dependencies, initializes default configuration files in `data/`, installs NPM packages, and builds the production bundle.

---

## 🛠️ Manual Installation

If you prefer installing manually without the script:

1. **Create the data directory & default config**:
   ```bash
   mkdir -p data
   ```
   Ensure `data/config.json` exists:
   ```json
   {
     "masterPassword": "tesla"
   }
   ```

2. **Install NPM dependencies**:
   ```bash
   npm install
   ```

3. **Build production assets**:
   ```bash
   npm run build
   ```

---

## 🚀 Starting the Application

### Production Server (Node.js)
To start the production server:
```bash
npm start
```
By default, the server runs on `http://localhost:3000` (or the port defined by `PORT=...`).

### Development Server (Vite Hot-Reload)
To run in development mode with live hot reloading:
```bash
npm run dev
```
Access the dev server at `http://localhost:3000`.

---

## 🔑 Master Password & Configuration

The initial master password for first-time browser access is stored in `data/config.json`:
```json
{
  "masterPassword": "tesla"
}
```

To change the master password:
- Edit `data/config.json` (e.g. `nano data/config.json`).
- Restart the server.

---

## ⚙️ Service Setup on Linux / Proxmox LXC (Systemd)

To keep the application running persistently in the background on system startup:

1. **Create the systemd service file**:
   ```bash
   sudo nano /etc/systemd/system/tesla-board.service
   ```

2. **Add the service configuration**:
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
   sudo systemctl daemon-reload
   sudo systemctl enable tesla-board.service
   sudo systemctl start tesla-board.service
   ```

4. **Check status and logs**:
   ```bash
   sudo systemctl status tesla-board.service
   sudo journalctl -u tesla-board.service -f -n 50
   ```

---

## 🌐 Reverse Proxy Setup (Nginx / Nginx Proxy Manager)

If serving the dashboard behind Nginx Proxy Manager with SSL/HTTPS:
- **Scheme**: `http`
- **Forward IP**: Internal server/container IP (e.g. `192.168.1.214`)
- **Forward Port**: `80` (or your custom `PORT`)
- **Websockets Support**: `ON` (Enabled)

---

## 📄 License

Released under the MIT License.
