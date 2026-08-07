import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const targetDirs = {
  squareDark: path.join(rootDir, 'public', 'logos', 'square', 'dark'),
  squareLight: path.join(rootDir, 'public', 'logos', 'square', 'light'),
  bannerDark: path.join(rootDir, 'public', 'logos', 'banner', 'dark'),
  bannerLight: path.join(rootDir, 'public', 'logos', 'banner', 'light')
};

// Ensure directories exist
Object.values(targetDirs).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Full Catalog Brand definitions with high quality SVG vector generators
export const BRANDS = {
  // --- SMART HOME & SELF HOSTED ---
  homeassistant: {
    name: "Home Assistant",
    brandColor: "#03A9F4",
    iconSvg: (fill) => `<path fill="${fill}" d="M64 16L16 56v56h32V80h32v32h32V56L64 16zm0 20a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm-20 28a6 6 0 1 1 0 12 6 6 0 0 1 0-12zm40 0a6 6 0 1 1 0 12 6 6 0 0 1 0-12z"/>`
  },
  immich: {
    name: "Immich",
    brandColor: "#FF5722",
    iconSvg: () => `
      <g>
        <circle cx="64" cy="40" r="20" fill="#6155F5"/>
        <circle cx="88" cy="64" r="20" fill="#FF5722"/>
        <circle cx="64" cy="88" r="20" fill="#4CAF50"/>
        <circle cx="40" cy="64" r="20" fill="#00BCD4"/>
      </g>`
  },
  solaredge: {
    name: "SolarEdge",
    brandColor: "#E53935",
    iconSvg: () => `
      <g fill="#E53935">
        <path d="M24 24h36v36H24z"/>
        <path d="M68 24h36v36H68z"/>
        <path d="M46 68h36v36H46z"/>
      </g>`
  },
  shelly: {
    name: "Shelly",
    brandColor: "#00AEEF",
    iconSvg: () => `
      <g fill="none" stroke="#00AEEF" stroke-width="12" stroke-linecap="round">
        <path d="M64 24a40 40 0 1 1-28 68"/>
        <path d="M64 44a20 20 0 1 1-14 34"/>
      </g>`
  },
  homebridge: {
    name: "Homebridge",
    brandColor: "#8C52FF",
    iconSvg: (fill) => `
      <g>
        <path fill="${fill}" d="M64 20L20 58v50h88V58L64 20z"/>
        <path fill="none" stroke="#8C52FF" stroke-width="8" d="M34 50c18-18 42-18 60 0"/>
      </g>`
  },
  portainer: {
    name: "Portainer",
    brandColor: "#13BEF9",
    iconSvg: () => `
      <g fill="#13BEF9">
        <rect x="24" y="24" width="36" height="36" rx="4"/>
        <rect x="68" y="24" width="36" height="36" rx="4"/>
        <rect x="24" y="68" width="36" height="36" rx="4"/>
        <rect x="68" y="68" width="36" height="36" rx="4"/>
      </g>`
  },
  pihole: {
    name: "Pi-hole",
    brandColor: "#960000",
    iconSvg: () => `
      <g fill="#960000">
        <path d="M64 16L24 32v32c0 26 40 48 40 48s40-22 40-48V32L64 16z"/>
        <circle cx="64" cy="56" r="14" fill="#FFFFFF"/>
        <circle cx="64" cy="56" r="8" fill="#960000"/>
      </g>`
  },
  adguard: {
    name: "AdGuard",
    brandColor: "#67B279",
    iconSvg: () => `
      <g>
        <path fill="#67B279" d="M64 16L20 32v32c0 28 44 48 44 48s44-20 44-48V32L64 16z"/>
        <path fill="none" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" d="M44 64l14 14 26-26"/>
      </g>`
  },
  zigbee2mqtt: {
    name: "Zigbee2MQTT",
    brandColor: "#FFB704",
    iconSvg: () => `
      <g fill="#FFB704">
        <circle cx="64" cy="64" r="48"/>
        <path fill="#FFFFFF" d="M38 42h52L46 86h44" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
      </g>`
  },
  esphome: {
    name: "ESPHome",
    brandColor: "#0288D1",
    iconSvg: (fill) => `
      <g fill="#0288D1">
        <rect x="24" y="24" width="80" height="80" rx="16"/>
        <path fill="${fill}" d="M40 50h48v8H40zm0 16h48v8H40zm0 16h32v8H40z"/>
        <circle cx="84" cy="86" r="6" fill="#FFC107"/>
      </g>`
  },
  nodered: {
    name: "Node-RED",
    brandColor: "#8F0000",
    iconSvg: () => `
      <g fill="#8F0000">
        <rect x="20" y="20" width="88" height="88" rx="16"/>
        <circle cx="44" cy="44" r="10" fill="#FFFFFF"/>
        <circle cx="84" cy="44" r="10" fill="#FFFFFF"/>
        <circle cx="64" cy="84" r="10" fill="#FFFFFF"/>
        <path stroke="#FFFFFF" stroke-width="6" d="M44 44L84 44 64 84Z" fill="none"/>
      </g>`
  },
  octoprint: {
    name: "OctoPrint",
    brandColor: "#0088CC",
    iconSvg: () => `
      <g fill="#0088CC">
        <circle cx="64" cy="64" r="48"/>
        <circle cx="48" cy="52" r="8" fill="#FFFFFF"/>
        <circle cx="80" cy="52" r="8" fill="#FFFFFF"/>
        <path d="M40 76c12 12 36 12 48 0" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" fill="none"/>
      </g>`
  },
  homepage: {
    name: "Homepage",
    brandColor: "#00AEEF",
    iconSvg: () => `
      <g fill="#00AEEF">
        <rect x="20" y="20" width="40" height="40" rx="8"/>
        <rect x="68" y="20" width="40" height="40" rx="8"/>
        <rect x="20" y="68" width="40" height="40" rx="8"/>
        <rect x="68" y="68" width="40" height="40" rx="8"/>
      </g>`
  },
  paperless: {
    name: "Paperless-ngx",
    brandColor: "#007BFF",
    iconSvg: () => `
      <g fill="#007BFF">
        <rect x="28" y="20" width="72" height="88" rx="12"/>
        <path d="M44 40h40M44 56h40M44 72h28" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round"/>
      </g>`
  },
  tasmoadmin: {
    name: "TasmoAdmin",
    brandColor: "#1E88E5",
    iconSvg: () => `
      <g fill="#1E88E5">
        <circle cx="64" cy="64" r="48"/>
        <path d="M40 44h48M40 64h48M40 84h48" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round"/>
        <circle cx="52" cy="44" r="8" fill="#FFFFFF"/>
        <circle cx="76" cy="64" r="8" fill="#FFFFFF"/>
        <circle cx="60" cy="84" r="8" fill="#FFFFFF"/>
      </g>`
  },

  // --- SOCIAL & MEDIA ---
  facebook: {
    name: "Facebook",
    brandColor: "#1877F2",
    iconSvg: () => `
      <g>
        <circle cx="64" cy="64" r="48" fill="#1877F2"/>
        <path fill="#FFFFFF" d="M72 64h12l2-16H72V38c0-4 1-7 7-7h9V17c-3 0-8-1-14-1-14 0-22 8-22 23v11H38v16h14v44h20V64z"/>
      </g>`
  },
  reddit: {
    name: "Reddit",
    brandColor: "#FF4500",
    iconSvg: () => `
      <g>
        <circle cx="64" cy="64" r="48" fill="#FF4500"/>
        <circle cx="48" cy="60" r="6" fill="#FFFFFF"/>
        <circle cx="80" cy="60" r="6" fill="#FFFFFF"/>
        <path fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" d="M44 76c10 8 30 8 40 0"/>
      </g>`
  },
  instagram: {
    name: "Instagram",
    brandColor: "#E4405F",
    iconSvg: () => `
      <g>
        <rect x="20" y="20" width="88" height="88" rx="24" fill="none" stroke="#E4405F" stroke-width="10"/>
        <circle cx="64" cy="64" r="22" fill="none" stroke="#E4405F" stroke-width="10"/>
        <circle cx="88" cy="40" r="6" fill="#E4405F"/>
      </g>`
  },
  twitter: {
    name: "X / Twitter",
    brandColor: "#000000",
    iconSvg: (fill) => `
      <path fill="${fill}" d="M78 24h18L60 67l42 57H66L40 86l-29 38H13l39-46L12 24h37l23 31 16-31zm-6 81h10L33 34H22l40 71z"/>`
  },
  whatsapp: {
    name: "WhatsApp",
    brandColor: "#25D366",
    iconSvg: () => `
      <g>
        <circle cx="64" cy="64" r="48" fill="#25D366"/>
        <path fill="#FFFFFF" d="M64 28c-20 0-36 16-36 36 0 7 2 13 6 18L28 100l19-5c5 3 11 5 17 5 20 0 36-16 36-36S84 28 64 28zm18 48c-1 3-5 5-8 5-3 0-7-1-12-4-8-5-14-11-19-19-3-5-4-9-4-12 0-3 2-7 5-8l4-1c1 0 2 0 2 2l3 7c1 1 0 2 0 3l-2 3c-1 1-1 2 0 3 2 4 6 8 10 10 1 1 2 1 3 0l3-2c1 0 2-1 3 0l7 3c2 1 2 2 1 3z"/>
      </g>`
  },
  telegram: {
    name: "Telegram",
    brandColor: "#2AABEE",
    iconSvg: () => `
      <g>
        <circle cx="64" cy="64" r="48" fill="#2AABEE"/>
        <path fill="#FFFFFF" d="M36 63l46-19c4-2 7 0 6 4l-8 37c-1 4-3 5-6 3l-16-12-8 8c-1 1-2 2-4 2l1-14 26-23c1-1 0-2-2-1L39 71l-13-4c-3-1-3-3 1-4z"/>
      </g>`
  },
  threads: {
    name: "Threads",
    brandColor: "#000000",
    iconSvg: (fill) => `
      <path fill="${fill}" d="M64 16c-26 0-48 22-48 48s22 48 48 48 48-22 48-48-22-48-48-48zm16 48c0 10-6 16-16 16-9 0-14-6-14-14 0-9 6-15 15-15 4 0 8 1 11 3v-3c0-6-4-10-10-10-5 0-9 2-11 5l-6-5c4-5 10-8 18-8 12 0 19 8 19 20v19c0 4 1 6 3 6 1 0 3-1 4-2l3 6c-3 3-7 4-10 4-5 0-8-3-8-8v-4zm-4-1c-2-1-4-2-7-2-5 0-8 3-8 8 0 4 3 7 7 7 5 0 8-4 8-9v-4z"/>`
  },
  linkedin: {
    name: "LinkedIn",
    brandColor: "#0A66C2",
    iconSvg: () => `
      <g>
        <rect x="20" y="20" width="88" height="88" rx="16" fill="#0A66C2"/>
        <path fill="#FFFFFF" d="M36 48h14v44H36V48zm7-20a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm21 20h13v6h1c2-3 7-7 13-7 14 0 17 9 17 21v24H94V70c0-6 0-13-8-13-8 0-9 6-9 13v22H64V48z"/>
      </g>`
  },
  tiktok: {
    name: "TikTok",
    brandColor: "#000000",
    iconSvg: () => `
      <g>
        <path fill="#25F4EE" d="M70 30a24 24 0 0 0 16 12v12a36 36 0 0 1-16-5v23c0 15-12 28-28 28S14 88 14 73s12-28 28-28c2 0 4 0 6 1v14a14 14 0 1 0 8 13V20h14v10z"/>
        <path fill="#FE2C55" d="M72 32a24 24 0 0 0 16 12v8a36 36 0 0 1-16-5v23c0 15-12 28-28 28S16 86 16 71s12-28 28-28c2 0 4 0 6 1v10a14 14 0 1 0 8 13V22h14v10z"/>
      </g>`
  },
  discord: {
    name: "Discord",
    brandColor: "#5865F2",
    iconSvg: () => `
      <g>
        <path fill="#5865F2" d="M96 28A76 76 0 0 0 78 22c-1 2-2 5-3 7a71 71 0 0 0-26 0l-3-7a76 76 0 0 0-18 6C15 47 11 76 16 104a77 77 0 0 0 23 12l5-9c-3-1-5-3-7-4l2-1a52 52 0 0 0 50 0l2 1c-2 2-5 3-7 4l5 9a77 77 0 0 0 23-12c6-33-2-62-13-76zM46 76c-5 0-8-4-8-9s4-9 8-9 9 4 8 9-4 9-8 9zm36 0c-5 0-8-4-8-9s4-9 8-9 9 4 9 9-4 9-9 9z"/>
      </g>`
  },
  mastodon: {
    name: "Mastodon",
    brandColor: "#6364FF",
    iconSvg: () => `
      <g fill="#6364FF">
        <rect x="20" y="20" width="88" height="88" rx="20"/>
        <path fill="#FFFFFF" d="M40 76V48c0-6 4-10 10-10s10 4 10 10v16h8V48c0-6 4-10 10-10s10 4 10 10v28h-8V48c0-3-2-5-5-5s-5 2-5 5v28H56V48c0-3-2-5-5-5s-5 2-5 5v28H40z"/>
      </g>`
  },
  bluesky: {
    name: "Bluesky",
    brandColor: "#0085FF",
    iconSvg: () => `
      <g fill="#0085FF">
        <circle cx="64" cy="64" r="48"/>
        <path fill="#FFFFFF" d="M64 40c8-12 28-16 28 4 0 16-16 28-28 40C52 72 36 60 36 44c0-20 20-16 28-4z"/>
      </g>`
  },
  lemmy: {
    name: "Lemmy",
    brandColor: "#54C875",
    iconSvg: () => `
      <g fill="#54C875">
        <circle cx="64" cy="64" r="48"/>
        <circle cx="48" cy="56" r="6" fill="#FFFFFF"/>
        <circle cx="80" cy="56" r="6" fill="#FFFFFF"/>
        <path d="M44 76c10 8 30 8 40 0" stroke="#FFFFFF" stroke-width="6" fill="none"/>
      </g>`
  },
  pinterest: {
    name: "Pinterest",
    brandColor: "#E60023",
    iconSvg: () => `
      <g fill="#E60023">
        <circle cx="64" cy="64" r="48"/>
        <path fill="#FFFFFF" d="M64 28c-20 0-32 14-32 30 0 11 6 20 16 24-2-6 0-12 2-17l4-17c-3-6-1-14 4-14 6 0 9 7 5 13-3 6-5 13-1 16 4 3 11-1 13-9 3-12-4-21-17-21-14 0-22 10-22 21 0 7 3 14 8 16 1 0 1 2 1 3l-1 6c0 1-1 2-3 1-9-4-13-14-13-24 0-18 15-31 35-31 19 0 31 13 31 27 0 18-10 31-24 31-5 0-9-3-10-6l-3 12c-2 6-6 13-8 17 6 2 12 3 18 3 26 0 44-21 44-46 0-22-17-38-44-38z"/>
      </g>`
  },
  element: {
    name: "Element",
    brandColor: "#0DBD8B",
    iconSvg: () => `
      <g fill="#0DBD8B">
        <rect x="20" y="20" width="88" height="88" rx="20"/>
        <path fill="#FFFFFF" d="M44 36h-8v56h8V36zm48 0h-8v56h8V36zm-36 12h24v8H56v-8zm0 16h24v8H56v-8zm0 16h24v8H56v-8z"/>
      </g>`
  },
  snapchat: {
    name: "Snapchat",
    brandColor: "#FFFC00",
    iconSvg: () => `
      <g fill="#FFFC00">
        <rect x="20" y="20" width="88" height="88" rx="20"/>
        <path fill="#000000" d="M64 32c-12 0-20 8-20 18 0 4 1 8 3 10-3 1-7 3-7 6 0 3 4 4 7 4 1 5 4 14 17 14s16-9 17-14c3 0 7-1 7-4 0-3-4-5-7-6 2-2 3-6 3-10 0-10-8-18-20-18z"/>
      </g>`
  },

  // --- STREAMING & ENTERTAINMENT ---
  youtube: {
    name: "YouTube",
    brandColor: "#FF0000",
    iconSvg: () => `
      <g>
        <path fill="#FF0000" d="M110 40c-1-5-5-9-10-10-9-3-44-3-44-3s-35 0-44 3c-5 1-9 5-10 10-3 9-3 28-3 28s0 19 3 28c1 5 5 9 10 10 9 3 44 3 44 3s35 0 44-3c5-1 9-5 10-10 3-9 3-28 3-28s0-19-3-28z"/>
        <polygon fill="#FFFFFF" points="52,46 80,64 52,82"/>
      </g>`
  },
  netflix: {
    name: "Netflix",
    brandColor: "#E50914",
    iconSvg: () => `
      <g>
        <path fill="#E50914" d="M38 18h16v92H38zM74 18h16v92H74z"/>
        <path fill="#B81D24" d="M38 18l52 92H74L38 28z"/>
      </g>`
  },
  disneyplus: {
    name: "Disney+",
    brandColor: "#113CCF",
    iconSvg: (fill) => `
      <g fill="${fill}">
        <path d="M32 24c20 0 36 12 36 32S52 88 32 88H16V24h16zm-4 12v40h4c12 0 20-8 20-20s-8-20-20-20h-4z"/>
        <path stroke="${fill}" stroke-width="6" fill="none" d="M20 30c40-20 80 0 90 40"/>
        <path d="M96 52h8v12h-8v12H84V64h-8V52h8V40h12v12z"/>
      </g>`
  },
  primevideo: {
    name: "Prime Video",
    brandColor: "#00A8E1",
    iconSvg: () => `
      <g>
        <rect x="20" y="24" width="88" height="52" rx="8" fill="#00A8E1"/>
        <path fill="#FFFFFF" d="M40 40h16c6 0 10 3 10 8s-4 8-10 8H48v12H40V40zm8 7v9h8c2 0 4-1 4-4 0-3-2-5-4-5h-8z"/>
        <path fill="#00A8E1" stroke="#00A8E1" stroke-width="4" stroke-linecap="round" d="M32 84c24 10 48 10 64 0l-8-4 16 0 0 16-8-12"/>
      </g>`
  },
  twitch: {
    name: "Twitch",
    brandColor: "#9146FF",
    iconSvg: () => `
      <g>
        <path fill="#9146FF" d="M24 16L16 32v72h24v16h16l16-16h16l24-24V16H24zm80 56l-16 16H64l-16 16v-16H32V24h72v48z"/>
        <rect x="56" y="40" width="8" height="24" fill="#9146FF"/>
        <rect x="76" y="40" width="8" height="24" fill="#9146FF"/>
      </g>`
  },
  plex: {
    name: "Plex",
    brandColor: "#E5A00D",
    iconSvg: () => `
      <g fill="#E5A00D">
        <polygon points="32,16 64,64 32,112 56,112 88,64 56,16"/>
      </g>`
  },
  spotify: {
    name: "Spotify",
    brandColor: "#1DB954",
    iconSvg: () => `
      <g>
        <circle cx="64" cy="64" r="48" fill="#1DB954"/>
        <path fill="none" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" d="M36 50c20-6 40-2 56 6M40 66c16-4 32-1 44 5M44 80c12-3 24 0 32 4"/>
      </g>`
  },
  applemusic: {
    name: "Apple Music",
    brandColor: "#FA243C",
    iconSvg: () => `
      <g>
        <rect x="20" y="20" width="88" height="88" rx="22" fill="#FA243C"/>
        <path fill="#FFFFFF" d="M78 36v36c0 6-5 10-11 10s-11-4-11-10 5-10 11-10c2 0 4 1 5 2V46L48 52v26c0 6-5 10-11 10s-11-4-11-10 5-10 11-10c2 0 4 1 5 2V36l30-6z"/>
      </g>`
  },
  paramountplus: {
    name: "Paramount+",
    brandColor: "#0064FF",
    iconSvg: (fill) => `
      <g>
        <path fill="#0064FF" d="M64 20L24 92h80L64 20z"/>
        <path fill="${fill}" d="M64 40L44 80h40L64 40z"/>
      </g>`
  },
  max: {
    name: "Max",
    brandColor: "#002BE7",
    iconSvg: (fill) => `
      <g fill="${fill}">
        <path d="M20 32h16l16 32 16-32h16v64H72V56L56 88 40 56v40H20V32z"/>
        <circle cx="98" cy="64" r="16"/>
      </g>`
  },
  crunchyroll: {
    name: "Crunchyroll",
    brandColor: "#F47521",
    iconSvg: () => `
      <g>
        <circle cx="64" cy="64" r="44" fill="#F47521"/>
        <circle cx="76" cy="64" r="24" fill="#FFFFFF"/>
        <circle cx="82" cy="64" r="12" fill="#F47521"/>
      </g>`
  },
  ytmusic: {
    name: "YouTube Music",
    brandColor: "#FF0000",
    iconSvg: () => `
      <g>
        <circle cx="64" cy="64" r="48" fill="#FF0000"/>
        <circle cx="64" cy="64" r="28" fill="none" stroke="#FFFFFF" stroke-width="8"/>
        <polygon fill="#FFFFFF" points="56,48 80,64 56,80"/>
      </g>`
  },
  deezer: {
    name: "Deezer",
    brandColor: "#FEAA2D",
    iconSvg: () => `
      <g fill="#FEAA2D">
        <rect x="20" y="72" width="16" height="24" rx="2"/>
        <rect x="42" y="52" width="16" height="44" rx="2"/>
        <rect x="64" y="32" width="16" height="64" rx="2"/>
        <rect x="86" y="48" width="16" height="48" rx="2"/>
      </g>`
  },
  soundcloud: {
    name: "SoundCloud",
    brandColor: "#FF5500",
    iconSvg: () => `
      <g fill="#FF5500">
        <path d="M72 44c12 0 22 10 22 22s-10 22-22 22H32V58c0-8 6-14 14-14 3 0 7 1 9 3 4-8 11-13 17-13z"/>
        <rect x="16" y="54" width="4" height="34" rx="2"/>
        <rect x="24" y="48" width="4" height="40" rx="2"/>
      </g>`
  },
  dazn: {
    name: "DAZN",
    brandColor: "#111111",
    iconSvg: (fill) => `
      <g fill="${fill}">
        <rect x="20" y="20" width="88" height="88" rx="12" fill="#111111"/>
        <path fill="#FFFFFF" d="M32 36h20c8 0 14 5 14 12s-6 12-14 12H44v16H32V36zm12 16h6c3 0 5-2 5-4s-2-4-5-4h-6v8zm28-16h24v10L80 66h16v10H72V66l16-20H72V36z"/>
      </g>`
  },
  jellyfin: {
    name: "Jellyfin",
    brandColor: "#00A4DC",
    iconSvg: () => `
      <g fill="none" stroke="#00A4DC" stroke-width="12" stroke-linejoin="round">
        <path d="M64 24L24 88h80L64 24z"/>
        <path d="M64 48L44 88h40L64 48z" stroke="#AA5CC3"/>
      </g>`
  },
  navidrome: {
    name: "Navidrome",
    brandColor: "#0085FF",
    iconSvg: () => `
      <g fill="#0085FF">
        <circle cx="64" cy="64" r="48"/>
        <path d="M44 40v48l40-24Z" fill="#FFFFFF"/>
      </g>`
  },
  audiobookshelf: {
    name: "Audiobookshelf",
    brandColor: "#7B1FA2",
    iconSvg: () => `
      <g fill="#7B1FA2">
        <rect x="20" y="20" width="88" height="88" rx="20"/>
        <path fill="#FFFFFF" d="M40 36h48v56H40zm8 8v40h32V44H48z"/>
      </g>`
  },
  emby: {
    name: "Emby",
    brandColor: "#52B54B",
    iconSvg: () => `
      <g fill="#52B54B">
        <circle cx="64" cy="64" r="48"/>
        <polygon points="52,40 84,64 52,88" fill="#FFFFFF"/>
      </g>`
  },
  tidal: {
    name: "Tidal",
    brandColor: "#000000",
    iconSvg: (fill) => `
      <g fill="${fill}">
        <polygon points="40,40 56,24 72,40 56,56"/>
        <polygon points="72,40 88,24 104,40 88,56"/>
        <polygon points="40,72 56,56 72,72 56,88"/>
        <polygon points="8,40 24,24 40,40 24,56"/>
      </g>`
  },
  kick: {
    name: "Kick",
    brandColor: "#53FC18",
    iconSvg: () => `
      <g fill="#000000">
        <rect x="20" y="20" width="88" height="88" rx="16" fill="#53FC18"/>
        <path d="M40 36h12v56H40zm36 0H64v20L48 36H36l20 28-20 28h12l16-20v20h12V36z"/>
      </g>`
  },
  vimeo: {
    name: "Vimeo",
    brandColor: "#1AB7EA",
    iconSvg: () => `
      <g fill="#1AB7EA">
        <circle cx="64" cy="64" r="48"/>
        <path fill="#FFFFFF" d="M40 44c2 0 4 2 5 5l6 20 8-30h8L56 80h-8L36 50c-1-3-2-6-2-6z"/>
      </g>`
  },

  // --- LIVE TV & CHANNELS ---
  plutotv: {
    name: "Pluto TV",
    brandColor: "#FFF000",
    iconSvg: () => `
      <g>
        <circle cx="64" cy="64" r="44" fill="#000000"/>
        <circle cx="64" cy="64" r="32" fill="none" stroke="#FFF000" stroke-width="10"/>
        <circle cx="64" cy="64" r="12" fill="#FFF000"/>
      </g>`
  },
  raiplay: {
    name: "RaiPlay",
    brandColor: "#00509E",
    iconSvg: () => `
      <g>
        <rect x="20" y="20" width="88" height="88" rx="16" fill="#00509E"/>
        <polygon fill="#FFFFFF" points="50,42 84,64 50,86"/>
      </g>`
  },
  mediaset: {
    name: "Mediaset Infinity",
    brandColor: "#192A45",
    iconSvg: () => `
      <g>
        <rect x="20" y="20" width="88" height="88" rx="16" fill="#192A45"/>
        <path fill="#00AEEF" d="M40 64c0-10 8-18 18-18s14 18 24 18 18-8 18-18-8-18-18-18-14 18-24 18-18-8-18-18z"/>
      </g>`
  },
  discoveryplus: {
    name: "Discovery+",
    brandColor: "#002D42",
    iconSvg: () => `
      <g>
        <circle cx="56" cy="64" r="32" fill="none" stroke="#00AEEF" stroke-width="10"/>
        <path fill="#00AEEF" d="M92 48h8v12h-8v12H84V60h-8V48h8V36h8v12z"/>
      </g>`
  },
  rakutentv: {
    name: "Rakuten TV",
    brandColor: "#E4001B",
    iconSvg: () => `
      <g>
        <circle cx="64" cy="64" r="44" fill="#E4001B"/>
        <path fill="#FFFFFF" d="M48 36h18c8 0 14 4 14 10 0 5-4 9-9 11l10 17H68L60 58h-4v19H48V36zm12 14h6c3 0 5-1 5-3s-2-3-5-3h-6v6z"/>
      </g>`
  },
  iptvorg: {
    name: "IPTV Web Player",
    brandColor: "#28A745",
    iconSvg: () => `
      <g fill="#28A745">
        <rect x="20" y="24" width="88" height="64" rx="12"/>
        <polygon points="56,40 80,56 56,72" fill="#FFFFFF"/>
        <path d="M44 96h40" stroke="#28A745" stroke-width="8" stroke-linecap="round"/>
      </g>`
  },
  samsungtv: {
    name: "Samsung TV Plus",
    brandColor: "#1428A0",
    iconSvg: () => `
      <g fill="#1428A0">
        <rect x="20" y="20" width="88" height="88" rx="20"/>
        <path fill="#FFFFFF" d="M44 52h40v8H44zm20-20h8v40h-8z"/>
      </g>`
  },
  tubi: {
    name: "Tubi TV",
    brandColor: "#FA3200",
    iconSvg: () => `
      <g fill="#FA3200">
        <circle cx="64" cy="64" r="48"/>
        <path fill="#FFFFFF" d="M44 40h40v12H64v36H52V52H44V40z"/>
      </g>`
  },
  zattoo: {
    name: "Zattoo",
    brandColor: "#000000",
    iconSvg: (fill) => `
      <g fill="${fill}">
        <rect x="20" y="20" width="88" height="88" rx="20" fill="#000000"/>
        <path fill="#FFFFFF" d="M40 40h48L48 76h40v12H40l40-36H40V40z"/>
      </g>`
  },

  // --- AUTOMOTIVE & NAVIGATION ---
  abrp: {
    name: "ABRP",
    brandColor: "#2B5C8F",
    iconSvg: () => `
      <g>
        <rect x="20" y="20" width="88" height="88" rx="20" fill="#2B5C8F"/>
        <path fill="#FFFFFF" d="M40 76l24-48 24 48-10-6-14-22-14 22-10 6z"/>
      </g>`
  },
  waze: {
    name: "Waze",
    brandColor: "#33CCFF",
    iconSvg: () => `
      <g>
        <path fill="#33CCFF" d="M64 24c-22 0-40 16-40 36 0 8 3 15 8 21l-4 11 13-3c7 5 15 7 23 7 22 0 40-16 40-36S86 24 64 24z"/>
        <circle cx="50" cy="54" r="6" fill="#000000"/>
        <circle cx="78" cy="54" r="6" fill="#000000"/>
        <path fill="none" stroke="#000000" stroke-width="4" stroke-linecap="round" d="M54 70c6 4 14 4 20 0"/>
      </g>`
  },
  googlemaps: {
    name: "Google Maps",
    brandColor: "#4285F4",
    iconSvg: () => `
      <g>
        <path fill="#EA4335" d="M64 16c-20 0-36 16-36 36 0 27 36 60 36 60s36-33 36-60c0-20-16-36-36-36z"/>
        <circle cx="64" cy="52" r="14" fill="#FFFFFF"/>
      </g>`
  },
  chargemap: {
    name: "Chargemap",
    brandColor: "#FF7900",
    iconSvg: () => `
      <g>
        <path fill="#FF7900" d="M64 16c-18 0-32 14-32 32 0 24 32 56 32 56s32-32 32-56c0-18-14-32-32-32z"/>
        <polygon fill="#FFFFFF" points="66,32 50,52 64,52 62,68 78,48 64,48"/>
      </g>`
  },
  plugshare: {
    name: "PlugShare",
    brandColor: "#4178BE",
    iconSvg: () => `
      <g>
        <circle cx="64" cy="64" r="44" fill="#4178BE"/>
        <path fill="#FFFFFF" d="M52 36h24v12H52V36zm-4 16h32v8H48v-8zm8 12h16v20H56V64z"/>
      </g>`
  },
  ionity: {
    name: "IONITY",
    brandColor: "#1B2A4A",
    iconSvg: () => `
      <g fill="#1B2A4A">
        <rect x="24" y="24" width="80" height="80" rx="16"/>
        <path fill="#FF2A00" d="M40 40l32 24-32 24V40z"/>
      </g>`
  },
  enelxway: {
    name: "Enel X Way",
    brandColor: "#802781",
    iconSvg: () => `
      <g fill="#802781">
        <rect x="20" y="20" width="88" height="88" rx="20"/>
        <path fill="#FFFFFF" d="M40 40l48 48M88 40L40 88" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round"/>
      </g>`
  },
  supercharge: {
    name: "Supercharge.info",
    brandColor: "#CC0000",
    iconSvg: () => `
      <g>
        <circle cx="64" cy="64" r="44" fill="#CC0000"/>
        <polygon fill="#FFFFFF" points="68,28 44,60 62,60 56,100 84,62 66,62"/>
      </g>`
  },
  teslamate: {
    name: "TeslaMate",
    brandColor: "#E82127",
    iconSvg: () => `
      <g fill="#E82127">
        <rect x="20" y="20" width="88" height="88" rx="20"/>
        <path fill="#FFFFFF" d="M36 40c16-8 40-8 56 0l-28 48L36 40z"/>
      </g>`
  },
  teslalogger: {
    name: "TeslaLogger",
    brandColor: "#00509E",
    iconSvg: () => `
      <g fill="#00509E">
        <circle cx="64" cy="64" r="48"/>
        <path stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" d="M36 76l16-24 16 12 20-32" fill="none"/>
      </g>`
  },
  openchargemap: {
    name: "Open Charge Map",
    brandColor: "#00A3DA",
    iconSvg: () => `
      <g fill="#00A3DA">
        <circle cx="64" cy="64" r="48"/>
        <polygon fill="#FFFFFF" points="66,32 50,56 64,56 62,88 78,52 64,52"/>
      </g>`
  },
  openstreetmap: {
    name: "OpenStreetMap",
    brandColor: "#7EBF37",
    iconSvg: () => `
      <g fill="#7EBF37">
        <circle cx="64" cy="64" r="48"/>
        <path fill="#FFFFFF" d="M64 28c-14 0-24 10-24 24 0 18 24 44 24 44s24-26 24-44c0-14-10-24-24-24zm0 32a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"/>
      </g>`
  },
  electrifyamerica: {
    name: "Electrify America",
    brandColor: "#00A859",
    iconSvg: () => `
      <g fill="#00A859">
        <rect x="20" y="20" width="88" height="88" rx="20"/>
        <polygon fill="#FFFFFF" points="66,28 44,60 62,60 56,100 84,56 66,56"/>
      </g>`
  },
  herewego: {
    name: "HERE WeGo",
    brandColor: "#00C8B3",
    iconSvg: () => `
      <g fill="#00C8B3">
        <circle cx="64" cy="64" r="48"/>
        <polygon points="64,28 88,88 64,72 40,88" fill="#FFFFFF"/>
      </g>`
  },

  // --- UTILITIES & TOOLS ---
  chatgpt: {
    name: "ChatGPT",
    brandColor: "#10A37F",
    iconSvg: () => `
      <g fill="none" stroke="#10A37F" stroke-width="8" stroke-linecap="round">
        <circle cx="64" cy="64" r="40"/>
        <path d="M64 24v80M24 64h80M36 36l56 56M36 92l56-56"/>
      </g>`
  },
  wikipedia: {
    name: "Wikipedia",
    brandColor: "#636466",
    iconSvg: (fill) => `
      <g fill="${fill}">
        <path d="M28 36l18 56h8l10-32 10 32h8l18-56h-10l-12 40-10-40h-8l-10 40-12-40H28z"/>
      </g>`
  },
  claude: {
    name: "Claude AI",
    brandColor: "#D97757",
    iconSvg: () => `
      <g fill="#D97757">
        <circle cx="64" cy="64" r="16"/>
        <rect x="58" y="20" width="12" height="24" rx="6"/>
        <rect x="58" y="84" width="12" height="24" rx="6"/>
        <rect x="20" y="58" width="24" height="12" rx="6"/>
        <rect x="84" y="58" width="24" height="12" rx="6"/>
      </g>`
  },
  google: {
    name: "Google",
    brandColor: "#4285F4",
    iconSvg: () => `
      <g>
        <path fill="#4285F4" d="M104 65c0-3-1-7-1-10H64v20h23c-1 5-4 10-9 13v11h14c9-8 14-20 14-34z"/>
        <path fill="#34A853" d="M64 106c11 0 21-4 28-11L78 84c-4 3-9 4-14 4-11 0-21-7-24-17H25v12c7 14 22 23 39 23z"/>
        <path fill="#FBBC05" d="M40 71c-1-3-2-7-2-11s1-8 2-11V37H25a42 42 0 0 0 0 54l15-12z"/>
        <path fill="#EA4335" d="M64 22c6 0 12 2 17 6l13-13C85 7 75 3 64 3 47 3 32 12 25 26l15 11c3-10 13-15 24-15z"/>
      </g>`
  },
  weather: {
    name: "AccuWeather",
    brandColor: "#F05023",
    iconSvg: () => `
      <g>
        <circle cx="50" cy="50" r="22" fill="#F05023"/>
        <path fill="#4A90E2" d="M40 84c-11 0-20-9-20-20 0-9 6-17 15-19 3-10 12-17 23-17 13 0 24 10 24 23 6 1 12 6 12 13 0 8-7 15-15 15H40z"/>
      </g>`
  },
  speedtest: {
    name: "Speedtest",
    brandColor: "#141526",
    iconSvg: () => `
      <g>
        <path fill="none" stroke="#00FDFF" stroke-width="10" stroke-linecap="round" d="M30 84a44 44 0 1 1 68 0"/>
        <polygon fill="#00FDFF" points="64,64 84,36 72,64"/>
      </g>`
  },
  notion: {
    name: "Notion",
    brandColor: "#000000",
    iconSvg: (fill) => `
      <g fill="${fill}">
        <path d="M28 24h68v80H28V24zm12 12v56h12V52l20 36h12V36H72v36L52 36H40z"/>
      </g>`
  },
  github: {
    name: "GitHub",
    brandColor: "#181717",
    iconSvg: (fill) => `
      <path fill="${fill}" d="M64 16C37 16 16 37 16 64c0 21 14 40 33 46 2 0 3-1 3-2v-8c-14 3-17-6-17-6-2-6-6-7-6-7-4-3 0-3 0-3 5 0 8 5 8 5 4 8 12 5 15 4 0-3 1-5 3-7-11-1-23-6-23-25 0-6 2-10 5-14-1-1-2-6 1-14 0 0 4-1 14 6 4-1 9-2 14-2s10 1 14 2c10-7 14-6 14-6 3 8 1 13 1 14 3 4 5 8 5 14 0 19-12 24-23 25 2 2 3 5 3 10v15c0 1 1 2 3 2 19-6 33-25 33-46 0-27-21-48-48-48z"/>`
  },
  openwebui: {
    name: "Open WebUI",
    brandColor: "#000000",
    iconSvg: (fill) => `
      <g fill="${fill}">
        <rect x="20" y="20" width="88" height="88" rx="20" fill="#000000"/>
        <circle cx="64" cy="50" r="16" fill="#10A37F"/>
        <path d="M40 84c0-12 10-20 24-20s24 8 24 20" fill="none" stroke="#10A37F" stroke-width="8"/>
      </g>`
  },
  n8n: {
    name: "n8n",
    brandColor: "#FF6D5A",
    iconSvg: () => `
      <g fill="#FF6D5A">
        <rect x="20" y="20" width="88" height="88" rx="20"/>
        <circle cx="44" cy="64" r="12" fill="#FFFFFF"/>
        <circle cx="84" cy="64" r="12" fill="#FFFFFF"/>
        <path d="M44 64C44 50 84 50 84 64S44 78 44 64Z" fill="none" stroke="#FFFFFF" stroke-width="6"/>
      </g>`
  },
  excalidraw: {
    name: "Excalidraw",
    brandColor: "#6965DB",
    iconSvg: () => `
      <g fill="#6965DB">
        <rect x="20" y="20" width="88" height="88" rx="20"/>
        <path d="M40 88l36-48 12 12-48 36H40z" fill="#FFFFFF"/>
      </g>`
  },
  cyberchef: {
    name: "CyberChef",
    brandColor: "#202124",
    iconSvg: () => `
      <g fill="#202124">
        <rect x="20" y="20" width="88" height="88" rx="20"/>
        <path d="M36 40l20 24-20 24M60 88h32" stroke="#00FF00" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      </g>`
  },
  gemini: {
    name: "Google Gemini",
    brandColor: "#8E75FF",
    iconSvg: () => `
      <g fill="#8E75FF">
        <circle cx="64" cy="64" r="48"/>
        <path fill="#FFFFFF" d="M64 28c0 20-16 36-36 36 20 0 36 16 36 36 0-20 16-36 36-36-20 0-36-16-36-36z"/>
      </g>`
  },
  perplexity: {
    name: "Perplexity",
    brandColor: "#22B8CF",
    iconSvg: () => `
      <g fill="#22B8CF">
        <circle cx="64" cy="64" r="48"/>
        <path d="M44 44l40 40M84 44L44 84" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round"/>
      </g>`
  },
  deepseek: {
    name: "DeepSeek",
    brandColor: "#4D6BFE",
    iconSvg: () => `
      <g fill="#4D6BFE">
        <circle cx="64" cy="64" r="48"/>
        <path fill="#FFFFFF" d="M40 76c20 0 36-12 36-28 0-8-5-14-12-18l-8 12c4 2 6 5 6 8 0 8-10 14-22 14-8 0-14-3-14-8 0-6 8-10 18-10v-8c-16 0-26 8-26 18 0 12 10 20 22 20z"/>
      </g>`
  },
  duckduckgo: {
    name: "DuckDuckGo",
    brandColor: "#DE5833",
    iconSvg: () => `
      <g fill="#DE5833">
        <circle cx="64" cy="64" r="48"/>
        <circle cx="56" cy="52" r="6" fill="#FFFFFF"/>
        <polygon points="64,60 88,68 64,76" fill="#FFB704"/>
      </g>`
  },

  // --- GAMES & EMULATORS ---
  chess: {
    name: "Chess.com",
    brandColor: "#769656",
    iconSvg: () => `
      <g>
        <rect x="20" y="20" width="88" height="88" rx="16" fill="#769656"/>
        <path fill="#FFFFFF" d="M64 32c-8 0-14 6-14 14 0 4 2 8 5 10-6 4-10 10-10 18h38c0-8-4-14-10-18 3-2 5-6 5-10 0-8-6-14-14-14zM44 80h40v8H44v-8z"/>
      </g>`
  },
  geoguessr: {
    name: "GeoGuessr",
    brandColor: "#6B9E3A",
    iconSvg: () => `
      <g>
        <circle cx="64" cy="64" r="44" fill="#6B9E3A"/>
        <polygon fill="#FFFFFF" points="64,28 76,64 64,56 52,64"/>
        <polygon fill="#E53935" points="64,100 76,64 64,72 52,64"/>
      </g>`
  },
  lichess: {
    name: "Lichess",
    brandColor: "#1A1A1A",
    iconSvg: (fill) => `
      <g fill="${fill}">
        <path d="M64 20C40 20 32 36 32 52c0 12 6 22 16 28v12h32V80c10-6 16-16 16-28 0-16-8-32-32-32zm-8 24a4 4 0 1 1 0 8 4 4 0 0 1 0-8z"/>
      </g>`
  },
  xbox: {
    name: "Xbox Cloud Gaming",
    brandColor: "#107C41",
    iconSvg: () => `
      <g>
        <circle cx="64" cy="64" r="44" fill="#107C41"/>
        <path fill="#FFFFFF" d="M38 34c14 12 26 30 26 44 0-14 12-32 26-44-10-8-23-12-36-12S48 26 38 34z"/>
      </g>`
  },
  geforce: {
    name: "GeForce NOW",
    brandColor: "#76B900",
    iconSvg: () => `
      <g fill="#76B900">
        <path d="M64 24C41 24 24 41 24 64s17 40 40 40 40-17 40-40c0-12-5-23-14-30l-8 8c6 5 10 13 10 22 0 16-12 28-28 28S36 80 36 64s12-28 28-28c7 0 14 3 19 8l8-8c-7-7-17-12-27-12z"/>
      </g>`
  },
  emulatorjs: {
    name: "EmulatorJS",
    brandColor: "#8C52FF",
    iconSvg: () => `
      <g fill="#8C52FF">
        <rect x="20" y="32" width="88" height="64" rx="16"/>
        <path d="M44 48v32M28 64h32" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round"/>
        <circle cx="80" cy="56" r="6" fill="#FFFFFF"/>
        <circle cx="92" cy="68" r="6" fill="#FFFFFF"/>
      </g>`
  },
  game2048: {
    name: "2048",
    brandColor: "#EDC22E",
    iconSvg: () => `
      <g fill="#EDC22E">
        <rect x="20" y="20" width="88" height="88" rx="16"/>
        <text x="64" y="74" font-family="Arial, sans-serif" font-weight="900" font-size="28" fill="#FFFFFF" text-anchor="middle">2048</text>
      </g>`
  },
  wordle: {
    name: "Wordle",
    brandColor: "#6AAA64",
    iconSvg: () => `
      <g fill="#6AAA64">
        <rect x="20" y="20" width="88" height="88" rx="16"/>
        <rect x="36" y="36" width="24" height="24" rx="4" fill="#FFFFFF"/>
        <rect x="68" y="36" width="24" height="24" rx="4" fill="#FFFFFF"/>
        <rect x="36" y="68" width="24" height="24" rx="4" fill="#FFFFFF"/>
        <rect x="68" y="68" width="24" height="24" rx="4" fill="#538D4E"/>
      </g>`
  },
  krunker: {
    name: "Krunker.io",
    brandColor: "#FF9900",
    iconSvg: () => `
      <g fill="#FF9900">
        <rect x="20" y="20" width="88" height="88" rx="16"/>
        <circle cx="64" cy="64" r="28" fill="none" stroke="#FFFFFF" stroke-width="8"/>
        <circle cx="64" cy="64" r="8" fill="#FFFFFF"/>
      </g>`
  },

  // --- ADULT (VM18) ---
  pornhub: {
    name: "Pornhub",
    brandColor: "#FFA300",
    iconSvg: () => `
      <g>
        <rect x="16" y="36" width="96" height="56" rx="8" fill="#000000"/>
        <rect x="60" y="42" width="46" height="44" rx="6" fill="#FFA300"/>
        <text x="36" y="71" font-family="Arial, sans-serif" font-weight="bold" font-size="22" fill="#FFFFFF">Porn</text>
        <text x="65" y="71" font-family="Arial, sans-serif" font-weight="bold" font-size="22" fill="#000000">hub</text>
      </g>`
  },
  xvideos: {
    name: "XVideos",
    brandColor: "#C80000",
    iconSvg: () => `
      <g>
        <polygon fill="#C80000" points="64,20 76,48 106,48 82,66 92,94 64,76 36,94 46,66 22,48 52,48"/>
      </g>`
  },
  xhamster: {
    name: "xHamster",
    brandColor: "#FF6600",
    iconSvg: () => `
      <g fill="#FF6600">
        <circle cx="64" cy="64" r="44"/>
        <path fill="#FFFFFF" d="M44 48c4 0 8 4 8 8s-4 8-8 8-8-4-8-8 4-8 8-8zm40 0c4 0 8 4 8 8s-4 8-8 8-8-4-8-8 4-8 8-8zM64 72c8 0 14-4 14-8H50c0 4 6 8 14 8z"/>
      </g>`
  },
  onlyfans: {
    name: "OnlyFans",
    brandColor: "#00AFF0",
    iconSvg: () => `
      <g>
        <circle cx="64" cy="64" r="44" fill="#00AFF0"/>
        <circle cx="64" cy="64" r="20" fill="none" stroke="#FFFFFF" stroke-width="8"/>
        <circle cx="64" cy="64" r="6" fill="#FFFFFF"/>
      </g>`
  },
  redtube: {
    name: "RedTube",
    brandColor: "#E62117",
    iconSvg: () => `
      <g fill="#E62117">
        <rect x="20" y="32" width="88" height="64" rx="16"/>
        <polygon points="52,44 80,64 52,84" fill="#FFFFFF"/>
      </g>`
  },
  youporn: {
    name: "YouPorn",
    brandColor: "#FF0055",
    iconSvg: () => `
      <g fill="#FF0055">
        <circle cx="64" cy="64" r="48"/>
        <text x="64" y="74" font-family="Arial, sans-serif" font-weight="900" font-size="28" fill="#FFFFFF" text-anchor="middle">YP</text>
      </g>`
  },
  chaturbate: {
    name: "Chaturbate",
    brandColor: "#FF7B00",
    iconSvg: () => `
      <g fill="#FF7B00">
        <rect x="20" y="32" width="88" height="64" rx="16"/>
        <circle cx="64" cy="64" r="16" fill="#FFFFFF"/>
      </g>`
  }
};

// Helper: Generate Square SVG string (256x256 ViewBox)
function generateSquareSvg(brandKey, isLight) {
  const brand = BRANDS[brandKey];
  const fill = isLight ? "#111827" : "#FFFFFF";
  const content = brand.iconSvg(fill);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="256" height="256">
  ${content.trim()}
</svg>`;
}

// Helper: Generate Banner SVG string (512x200 ViewBox)
function generateBannerSvg(brandKey, isLight) {
  const brand = BRANDS[brandKey];
  const textColor = isLight ? "#111827" : "#FFFFFF";
  const iconFill = isLight ? "#111827" : "#FFFFFF";
  const content = brand.iconSvg(iconFill);
  
  const safeName = brand.name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 200" width="512" height="200">
  <g transform="translate(20, 36) scale(1.0)">
    ${content.trim()}
  </g>
  <text x="170" y="122" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="700" font-size="40" fill="${textColor}">${safeName}</text>
</svg>`;
}

async function buildAllLogos() {
  console.log(`Starting HD Transparent PNG generation for ${Object.keys(BRANDS).length} brands...`);

  let count = 0;
  for (const slug of Object.keys(BRANDS)) {
    // 1. Square Dark
    const sqDarkSvg = generateSquareSvg(slug, false);
    fs.writeFileSync(path.join(targetDirs.squareDark, `${slug}.svg`), sqDarkSvg, 'utf8');
    await sharp(Buffer.from(sqDarkSvg))
      .resize(256, 256, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9, quality: 100 })
      .toFile(path.join(targetDirs.squareDark, `${slug}.png`));

    // 2. Square Light
    const sqLightSvg = generateSquareSvg(slug, true);
    fs.writeFileSync(path.join(targetDirs.squareLight, `${slug}.svg`), sqLightSvg, 'utf8');
    await sharp(Buffer.from(sqLightSvg))
      .resize(256, 256, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9, quality: 100 })
      .toFile(path.join(targetDirs.squareLight, `${slug}.png`));

    // 3. Banner Dark
    const bnDarkSvg = generateBannerSvg(slug, false);
    fs.writeFileSync(path.join(targetDirs.bannerDark, `${slug}.svg`), bnDarkSvg, 'utf8');
    await sharp(Buffer.from(bnDarkSvg))
      .resize(512, 200, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9, quality: 100 })
      .toFile(path.join(targetDirs.bannerDark, `${slug}.png`));

    // 4. Banner Light
    const bnLightSvg = generateBannerSvg(slug, true);
    fs.writeFileSync(path.join(targetDirs.bannerLight, `${slug}.svg`), bnLightSvg, 'utf8');
    await sharp(Buffer.from(bnLightSvg))
      .resize(512, 200, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9, quality: 100 })
      .toFile(path.join(targetDirs.bannerLight, `${slug}.png`));

    count += 4;
  }

  console.log(`Successfully created ${count} HD transparent PNG (and SVG) files across all 4 subfolders!`);
}

buildAllLogos().catch(err => {
  console.error("Error generating logos:", err);
  process.exit(1);
});
