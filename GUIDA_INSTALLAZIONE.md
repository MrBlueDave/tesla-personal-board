# 🚀 Tesla Personal Board v0.8.3 — Guida all'Installazione su Proxmox LXC / Linux

Questa guida descrive i passaggi completi per installare e configurare la **Tesla Personal Board** su un container LXC (Debian/Ubuntu) in Proxmox o qualsiasi server Linux con Node.js.

---

## 📦 1. Requisiti di Sistema
- **Node.js**: v18.x o v20.x+
- **NPM**: v9.x+
- **Cartella di destinazione consigliata**: `/var/www/tesla-board`

---

## 🛠️ 2. Installazione Rapida

1. **Estrai il pacchetto ZIP nella cartella di produzione**:
   ```bash
   mkdir -p /var/www/tesla-board
   unzip Tesla-Personal-Board-Release.zip -d /var/www/tesla-board
   cd /var/www/tesla-board
   ```

2. **Crea la cartella dati ed imposta i permessi di scrittura**:
   ```bash
   mkdir -p /var/www/tesla-board/data
   chmod -R 777 /var/www/tesla-board/data
   ```

3. **Installazione dipendenze e Build (se non già presente dist/)**:
   ```bash
   npm install
   npm run build
   ```

---

## 🔑 3. Configurazione Password Master

La password iniziale è memorizzata nel file `data/config.json`:
```json
{
  "masterPassword": "tesla"
}
```
Per cambiare la password master di primo accesso al browser:
- Modifica il file `data/config.json` con il tuo editor preferito (es. `nano data/config.json`).

---

## ⚙️ 4. Configurazione Servizio Systemd (Boot Automatico)

Crea il file di servizio systemd per mantenere l'applicazione sempre attiva in background anche al riavvio del server:

1. **Apri/crea il file di servizio**:
   ```bash
   nano /etc/systemd/system/tesla-board.service
   ```

2. **Inserisci la seguente configurazione**:
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

3. **Abilita ed avvia il servizio**:
   ```bash
   systemctl daemon-reload
   systemctl enable tesla-board.service
   systemctl start tesla-board.service
   ```

4. **Verifica lo stato ed i log in tempo reale**:
   ```bash
   systemctl status tesla-board.service
   journalctl -u tesla-board.service -f -n 50
   ```

---

## 🌐 5. Configurazione Reverse Proxy (Nginx Proxy Manager)

Se utilizzi Nginx Proxy Manager per accedere dall'esterno (es. con dominio SSL/HTTPS):
- **Scheme**: `http`
- **Forward IP**: IP interno del container LXC (es. `192.168.1.214`)
- **Forward Port**: `80` (o la porta configurata in PORT)
- **Websockets Support**: Attivato

---

## 🎉 6. Primo Accesso da Browser / Tesla MCU
1. Apri il browser all'indirizzo `http://192.168.1.XXX` oppure al tuo dominio HTTPS proxy.
2. Inserisci la password master (`tesla` di default).
3. La sessione verrà memorizzata nel browser ed i profili PIN saranno sincronizzati in tempo reale su disco.
