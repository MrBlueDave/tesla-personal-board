import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { BRANDS } from './build-all-logos.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const squareDarkDir = path.join(rootDir, 'public', 'logos', 'square', 'dark');
const squareLightDir = path.join(rootDir, 'public', 'logos', 'square', 'light');

// Ensure directories exist
[squareDarkDir, squareLightDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// App Store search queries for each brand
const SEARCH_TERMS = {
  homeassistant: "Home Assistant",
  immich: "Immich",
  solaredge: "SolarEdge Monitoring",
  shelly: "Shelly Smart Control",
  homebridge: "Homebridge",
  portainer: "Portainer",
  pihole: "Pi-hole Remote",
  adguard: "AdGuard Home",
  zigbee2mqtt: "Zigbee2MQTT",
  esphome: "ESPHome",
  nodered: "Node-RED",
  octoprint: "OctoPod for OctoPrint",
  homepage: "Homepage",
  paperless: "Paperless Mobile",
  tasmoadmin: "TasmoAdmin",
  facebook: "Facebook",
  reddit: "Reddit",
  instagram: "Instagram",
  twitter: "X",
  whatsapp: "WhatsApp Messenger",
  telegram: "Telegram Messenger",
  threads: "Threads",
  linkedin: "LinkedIn",
  tiktok: "TikTok",
  discord: "Discord",
  mastodon: "Mastodon",
  bluesky: "Bluesky Social",
  lemmy: "Memmy for Lemmy",
  pinterest: "Pinterest",
  element: "Element Messenger",
  snapchat: "Snapchat",
  youtube: "YouTube",
  netflix: "Netflix",
  disneyplus: "Disney+",
  primevideo: "Amazon Prime Video",
  twitch: "Twitch",
  plex: "Plex",
  spotify: "Spotify",
  applemusic: "Apple Music",
  paramountplus: "Paramount+",
  max: "Max Stream HBO",
  crunchyroll: "Crunchyroll",
  ytmusic: "YouTube Music",
  deezer: "Deezer",
  soundcloud: "SoundCloud",
  dazn: "DAZN",
  jellyfin: "Jellyfin Mobile",
  navidrome: "Navidrome",
  audiobookshelf: "Audiobookshelf",
  emby: "Emby",
  tidal: "Tidal",
  kick: "Kick Live Streaming",
  vimeo: "Vimeo",
  plutotv: "Pluto TV",
  raiplay: "RaiPlay",
  mediaset: "Mediaset Infinity",
  discoveryplus: "Discovery+",
  rakutentv: "Rakuten TV",
  iptvorg: "IPTV",
  samsungtv: "Samsung Smart View",
  tubi: "Tubi TV",
  zattoo: "Zattoo",
  abrp: "A Better Routeplanner",
  waze: "Waze Navigation",
  googlemaps: "Google Maps",
  chargemap: "Chargemap",
  plugshare: "PlugShare",
  ionity: "IONITY",
  enelxway: "Enel X Way",
  supercharge: "Supercharge",
  teslamate: "Tesla",
  teslalogger: "TeslaLogger",
  openchargemap: "Open Charge Map",
  openstreetmap: "OsmAnd Maps",
  electrifyamerica: "Electrify America",
  herewego: "HERE WeGo",
  chatgpt: "ChatGPT",
  wikipedia: "Wikipedia",
  claude: "Claude AI",
  google: "Google",
  weather: "AccuWeather",
  speedtest: "Speedtest by Ookla",
  notion: "Notion",
  github: "GitHub",
  openwebui: "Open WebUI",
  n8n: "n8n",
  excalidraw: "Excalidraw",
  cyberchef: "CyberChef",
  gemini: "Google",
  perplexity: "Perplexity Ask Anything",
  deepseek: "DeepSeek",
  duckduckgo: "DuckDuckGo Private Browser",
  chess: "Chess Play & Learn",
  geoguessr: "GeoGuessr",
  lichess: "Lichess Chess",
  xbox: "Xbox",
  geforce: "GeForce NOW",
  emulatorjs: "Delta Game Emulator",
  game2048: "2048",
  wordle: "NYT Games",
  krunker: "Krunker"
};

// Create iOS squircle mask (256x256 with rx=56)
const squircleMask = Buffer.from(`<svg width="256" height="256">
  <rect x="0" y="0" width="256" height="256" rx="56" ry="56" fill="#ffffff"/>
</svg>`);

// Helper to fetch iOS app icon URL from iTunes Search API
async function fetchAppStoreIconUrl(term) {
  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=software&limit=1`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      let artwork = data.results[0].artworkUrl512 || data.results[0].artworkUrl100;
      if (artwork) {
        return artwork.replace(/100x100bb/, '512x512bb');
      }
    }
  } catch (err) {
    // ignore fetch errors
  }
  return null;
}

// Fallback: Generate an authentic iOS squircle app icon using official brand vector logo & brand background color
function generateFallbackIosIcon(slug) {
  const brand = BRANDS[slug] || { name: slug, brandColor: "#1E293B", iconSvg: () => "" };
  const bg = brand.brandColor || "#1E293B";
  const iconContent = brand.iconSvg("#FFFFFF");

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <rect width="256" height="256" rx="56" ry="56" fill="${bg}"/>
  <g transform="translate(48, 48) scale(1.25)">
    ${iconContent.trim()}
  </g>
</svg>`;
  return Buffer.from(svg);
}

async function processAllBrands() {
  const slugs = Object.keys(BRANDS);
  console.log(`Processing ${slugs.length} brands for official iPhone App Icons...`);

  let appStoreCount = 0;
  let fallbackCount = 0;

  for (const slug of slugs) {
    const term = SEARCH_TERMS[slug] || slug;
    let iconBuffer = null;
    let isFromAppStore = false;

    // Adult apps and custom non-appstore items use fallback iOS squircle icon directly
    const isAdult = ['pornhub', 'xvideos', 'xhamster', 'onlyfans', 'redtube', 'youporn', 'chaturbate'].includes(slug);

    if (!isAdult) {
      const artworkUrl = await fetchAppStoreIconUrl(term);
      if (artworkUrl) {
        try {
          const imgRes = await fetch(artworkUrl);
          if (imgRes.ok) {
            const rawBuffer = Buffer.from(await imgRes.arrayBuffer());
            // Resize and apply iOS squircle mask
            iconBuffer = await sharp(rawBuffer)
              .resize(256, 256)
              .composite([{ input: squircleMask, blend: 'dest-in' }])
              .png({ compressionLevel: 9, quality: 100 })
              .toBuffer();
            isFromAppStore = true;
            appStoreCount++;
          }
        } catch (e) {
          // ignore download error
        }
      }
    }

    if (!iconBuffer) {
      // Use synthesized iOS squircle app icon
      const svgBuf = generateFallbackIosIcon(slug);
      iconBuffer = await sharp(svgBuf)
        .resize(256, 256)
        .png({ compressionLevel: 9, quality: 100 })
        .toBuffer();
      fallbackCount++;
    }

    // Save to square dark & square light
    const darkPath = path.join(squareDarkDir, `${slug}.png`);
    const lightPath = path.join(squareLightDir, `${slug}.png`);

    fs.writeFileSync(darkPath, iconBuffer);
    fs.writeFileSync(lightPath, iconBuffer);

    console.log(`[${isFromAppStore ? 'App Store' : 'iOS Squircle'}] ${slug} -> Saved ${slug}.png`);
  }

  console.log(`\nCompleted! Official App Store icons: ${appStoreCount}, Custom iOS Squircles: ${fallbackCount}.`);
}

processAllBrands().catch(err => {
  console.error("Error fetching iPhone icons:", err);
  process.exit(1);
});
