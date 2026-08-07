import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Import BRANDS keys from build-all-logos.js
import { BRANDS } from './build-all-logos.js';

// Category mappings for each item ID
const ITEM_CONFIGS = [
  // --- SMART HOME & SELF HOSTED ---
  { id: "homeassistant", title: "Home Assistant", category: "smarthome", url: "https://my.home-assistant.io", icon: "home", bgColor: "#03A9F4" },
  { id: "immich", title: "Immich", category: "smarthome", url: "https://immich.app", icon: "image", bgColor: "#FF5722" },
  { id: "solaredge", title: "SolarEdge", category: "smarthome", url: "https://monitoring.solaredge.com", icon: "zap", bgColor: "#E53935" },
  { id: "shelly", title: "Shelly", category: "smarthome", url: "https://control.shelly.cloud", icon: "cpu", bgColor: "#00AEEF" },
  { id: "homebridge", title: "Homebridge", category: "smarthome", url: "http://homebridge.local:8581", icon: "home", bgColor: "#8C52FF" },
  { id: "portainer", title: "Portainer", category: "smarthome", url: "http://localhost:9000", icon: "server", bgColor: "#13BEF9" },
  { id: "pihole", title: "Pi-hole", category: "smarthome", url: "http://pi.hole/admin", icon: "shield", bgColor: "#960000" },
  { id: "adguard", title: "AdGuard Home", category: "smarthome", url: "http://localhost:3000", icon: "shield-check", bgColor: "#66B933" },
  { id: "zigbee2mqtt", title: "Zigbee2MQTT", category: "smarthome", url: "http://localhost:8080", icon: "radio", bgColor: "#FFB704" },
  { id: "esphome", title: "ESPHome", category: "smarthome", url: "http://localhost:6052", icon: "cpu", bgColor: "#0288D1" },
  { id: "nodered", title: "Node-RED", category: "smarthome", url: "http://localhost:1880", icon: "workflow", bgColor: "#8F0000" },
  { id: "octoprint", title: "OctoPrint", category: "smarthome", url: "http://octopi.local", icon: "printer", bgColor: "#0088CC" },
  { id: "homepage", title: "Homepage", category: "smarthome", url: "http://localhost:3000", icon: "layout-dashboard", bgColor: "#00AEEF" },
  { id: "paperless", title: "Paperless-ngx", category: "smarthome", url: "http://localhost:8000", icon: "file-text", bgColor: "#007BFF" },
  { id: "tasmoadmin", title: "TasmoAdmin", category: "smarthome", url: "http://localhost:8001", icon: "sliders", bgColor: "#1E88E5" },

  // --- SOCIAL & MEDIA ---
  { id: "facebook", title: "Facebook", category: "social", url: "https://www.facebook.com", icon: "facebook", bgColor: "#1877F2" },
  { id: "reddit", title: "Reddit", category: "social", url: "https://www.reddit.com", icon: "message-square", bgColor: "#FF4500" },
  { id: "instagram", title: "Instagram", category: "social", url: "https://www.instagram.com", icon: "instagram", bgColor: "#E4405F" },
  { id: "twitter", title: "Twitter / X", category: "social", url: "https://x.com", icon: "twitter", bgColor: "#000000" },
  { id: "whatsapp", title: "WhatsApp", category: "social", url: "https://web.whatsapp.com", icon: "message-circle", bgColor: "#25D366" },
  { id: "telegram", title: "Telegram", category: "social", url: "https://web.telegram.org", icon: "send", bgColor: "#2AABEE" },
  { id: "threads", title: "Threads", category: "social", url: "https://www.threads.net", icon: "at-sign", bgColor: "#000000" },
  { id: "linkedin", title: "LinkedIn", category: "social", url: "https://www.linkedin.com", icon: "linkedin", bgColor: "#0A66C2" },
  { id: "tiktok", title: "TikTok", category: "social", url: "https://www.tiktok.com", icon: "video", bgColor: "#000000" },
  { id: "discord", title: "Discord", category: "social", url: "https://discord.com/app", icon: "message-square", bgColor: "#5865F2" },
  { id: "mastodon", title: "Mastodon", category: "social", url: "https://mastodon.social", icon: "share-2", bgColor: "#6364FF" },
  { id: "bluesky", title: "Bluesky", category: "social", url: "https://bsky.app", icon: "cloud", bgColor: "#0085FF" },
  { id: "lemmy", title: "Lemmy", category: "social", url: "https://lemmy.ml", icon: "message-square", bgColor: "#54C875" },
  { id: "pinterest", title: "Pinterest", category: "social", url: "https://www.pinterest.com", icon: "image", bgColor: "#E60023" },
  { id: "element", title: "Element / Matrix", category: "social", url: "https://app.element.io", icon: "message-square", bgColor: "#0DBD8B" },
  { id: "snapchat", title: "Snapchat", category: "social", url: "https://web.snapchat.com", icon: "ghost", bgColor: "#FFFC00" },

  // --- STREAMING & ENTERTAINMENT ---
  { id: "youtube", title: "YouTube", category: "streaming", url: "https://www.youtube.com", customFullscreenUrl: "https://www.youtube.com", icon: "youtube", bgColor: "#FF0000" },
  { id: "netflix", title: "Netflix", category: "streaming", url: "https://www.netflix.com", icon: "tv", bgColor: "#E50914" },
  { id: "disneyplus", title: "Disney+", category: "streaming", url: "https://www.disneyplus.com", icon: "film", bgColor: "#113CCF" },
  { id: "primevideo", title: "Prime Video", category: "streaming", url: "https://www.primevideo.com", icon: "video", bgColor: "#00A8E1" },
  { id: "twitch", title: "Twitch", category: "streaming", url: "https://www.twitch.tv", icon: "twitch", bgColor: "#9146FF" },
  { id: "plex", title: "Plex", category: "streaming", url: "https://app.plex.tv", icon: "server", bgColor: "#E5A00D" },
  { id: "spotify", title: "Spotify", category: "streaming", url: "https://open.spotify.com", icon: "music", bgColor: "#1DB954" },
  { id: "applemusic", title: "Apple Music", category: "streaming", url: "https://music.apple.com", icon: "disc", bgColor: "#FA243C" },
  { id: "paramountplus", title: "Paramount+", category: "streaming", url: "https://www.paramountplus.com", icon: "film", bgColor: "#0064FF" },
  { id: "max", title: "Max", category: "streaming", url: "https://www.max.com", icon: "tv", bgColor: "#002BE7" },
  { id: "crunchyroll", title: "Crunchyroll", category: "streaming", url: "https://www.crunchyroll.com", icon: "tv", bgColor: "#F47521" },
  { id: "ytmusic", title: "YouTube Music", category: "streaming", url: "https://music.youtube.com", icon: "music", bgColor: "#FF0000" },
  { id: "deezer", title: "Deezer", category: "streaming", url: "https://www.deezer.com", icon: "music", bgColor: "#FEAA2D" },
  { id: "soundcloud", title: "SoundCloud", category: "streaming", url: "https://soundcloud.com", icon: "radio", bgColor: "#FF5500" },
  { id: "dazn", title: "DAZN", category: "streaming", url: "https://www.dazn.com", icon: "tv", bgColor: "#111111" },
  { id: "jellyfin", title: "Jellyfin", category: "streaming", url: "http://localhost:8096", icon: "server", bgColor: "#00A4DC" },
  { id: "navidrome", title: "Navidrome", category: "streaming", url: "http://localhost:4533", icon: "music", bgColor: "#0085FF" },
  { id: "audiobookshelf", title: "Audiobookshelf", category: "streaming", url: "http://localhost:13378", icon: "book-open", bgColor: "#7B1FA2" },
  { id: "emby", title: "Emby", category: "streaming", url: "http://localhost:8096", icon: "play-circle", bgColor: "#52B54B" },
  { id: "tidal", title: "Tidal", category: "streaming", url: "https://listen.tidal.com", icon: "music", bgColor: "#000000" },
  { id: "kick", title: "Kick", category: "streaming", url: "https://kick.com", icon: "video", bgColor: "#53FC18" },
  { id: "vimeo", title: "Vimeo", category: "streaming", url: "https://vimeo.com", icon: "video", bgColor: "#1AB7EA" },

  // --- LIVE TV & CHANNELS ---
  { id: "plutotv", title: "Pluto TV", category: "livetv", url: "https://pluto.tv", icon: "tv", bgColor: "#000000" },
  { id: "raiplay", title: "RaiPlay", category: "livetv", url: "https://www.raiplay.it", icon: "tv", bgColor: "#00509E" },
  { id: "mediaset", title: "Mediaset Infinity", category: "livetv", url: "https://mediasetinfinity.mediaset.it", icon: "tv", bgColor: "#192A45" },
  { id: "discoveryplus", title: "Discovery+", category: "livetv", url: "https://www.discoveryplus.com", icon: "tv", bgColor: "#002D42" },
  { id: "rakutentv", title: "Rakuten TV", category: "livetv", url: "https://www.rakuten.tv", icon: "tv", bgColor: "#E4001B" },
  { id: "iptvorg", title: "IPTV Web Player", category: "livetv", url: "https://iptv-org.github.io", icon: "tv", bgColor: "#28A745" },
  { id: "samsungtv", title: "Samsung TV Plus", category: "livetv", url: "https://www.samsungtvplus.com", icon: "tv", bgColor: "#1428A0" },
  { id: "tubi", title: "Tubi TV", category: "livetv", url: "https://tubitv.com", icon: "tv", bgColor: "#FA3200" },
  { id: "zattoo", title: "Zattoo", category: "livetv", url: "https://zattoo.com", icon: "tv", bgColor: "#000000" },

  // --- AUTOMOTIVE & NAVIGATION ---
  { id: "abrp", title: "ABRP (A Better Routeplanner)", category: "auto", url: "https://abetterrouteplanner.com", icon: "navigation", bgColor: "#2B5C8F" },
  { id: "waze", title: "Waze Live Map", category: "auto", url: "https://www.waze.com/live-map", icon: "map-pin", bgColor: "#33CCFF" },
  { id: "googlemaps", title: "Google Maps", category: "auto", url: "https://maps.google.com", icon: "map", bgColor: "#4285F4" },
  { id: "chargemap", title: "Chargemap", category: "auto", url: "https://chargemap.com", icon: "zap", bgColor: "#FF7900" },
  { id: "plugshare", title: "PlugShare", category: "auto", url: "https://www.plugshare.com", icon: "zap", bgColor: "#4178BE" },
  { id: "ionity", title: "IONITY", category: "auto", url: "https://ionity.eu", icon: "zap", bgColor: "#1B2A4A" },
  { id: "enelxway", title: "Enel X Way", category: "auto", url: "https://www.enelxway.com", icon: "zap", bgColor: "#802781" },
  { id: "supercharge", title: "Supercharge.info", category: "auto", url: "https://supercharge.info", icon: "map-pin", bgColor: "#CC0000" },
  { id: "teslamate", title: "TeslaMate", category: "auto", url: "http://localhost:4000", icon: "gauge", bgColor: "#E82127" },
  { id: "teslalogger", title: "TeslaLogger", category: "auto", url: "http://localhost:8888", icon: "activity", bgColor: "#00509E" },
  { id: "openchargemap", title: "Open Charge Map", category: "auto", url: "https://openchargemap.org", icon: "zap", bgColor: "#00A3DA" },
  { id: "openstreetmap", title: "OpenStreetMap", category: "auto", url: "https://www.openstreetmap.org", icon: "map", bgColor: "#7EBF37" },
  { id: "electrifyamerica", title: "Electrify America", category: "auto", url: "https://www.electrifyamerica.com", icon: "zap", bgColor: "#00A859" },
  { id: "herewego", title: "HERE WeGo", category: "auto", url: "https://wego.here.com", icon: "navigation", bgColor: "#00C8B3" },

  // --- UTILITIES & TOOLS ---
  { id: "chatgpt", title: "ChatGPT", category: "utilities", url: "https://chatgpt.com", icon: "bot", bgColor: "#10A37F" },
  { id: "wikipedia", title: "Wikipedia", category: "utilities", url: "https://it.wikipedia.org", icon: "book-open", bgColor: "#6364FF" },
  { id: "claude", title: "Claude AI", category: "utilities", url: "https://claude.ai", icon: "bot", bgColor: "#D97757" },
  { id: "google", title: "Google", category: "utilities", url: "https://www.google.com", icon: "search", bgColor: "#4285F4" },
  { id: "weather", title: "AccuWeather", category: "utilities", url: "https://www.accuweather.com", icon: "cloud-sun", bgColor: "#F05023" },
  { id: "speedtest", title: "Speedtest", category: "utilities", url: "https://www.speedtest.net", icon: "gauge", bgColor: "#141526" },
  { id: "notion", title: "Notion", category: "utilities", url: "https://www.notion.so", icon: "file-text", bgColor: "#000000" },
  { id: "github", title: "GitHub", category: "utilities", url: "https://github.com", icon: "github", bgColor: "#181717" },
  { id: "openwebui", title: "Open WebUI", category: "utilities", url: "http://localhost:3000", icon: "bot", bgColor: "#000000" },
  { id: "n8n", title: "n8n", category: "utilities", url: "http://localhost:5678", icon: "workflow", bgColor: "#FF6D5A" },
  { id: "excalidraw", title: "Excalidraw", category: "utilities", url: "https://excalidraw.com", icon: "edit-3", bgColor: "#6965DB" },
  { id: "cyberchef", title: "CyberChef", category: "utilities", url: "https://gchq.github.io/CyberChef", icon: "terminal", bgColor: "#202124" },
  { id: "gemini", title: "Google Gemini", category: "utilities", url: "https://gemini.google.com", icon: "sparkles", bgColor: "#8E75FF" },
  { id: "perplexity", title: "Perplexity AI", category: "utilities", url: "https://www.perplexity.ai", icon: "search", bgColor: "#22B8CF" },
  { id: "deepseek", title: "DeepSeek AI", category: "utilities", url: "https://chat.deepseek.com", icon: "bot", bgColor: "#4D6BFE" },
  { id: "duckduckgo", title: "DuckDuckGo", category: "utilities", url: "https://duckduckgo.com", icon: "search", bgColor: "#DE5833" },

  // --- GAMES & EMULATORS ---
  { id: "chess", title: "Chess.com", category: "games", url: "https://www.chess.com", icon: "gamepad-2", bgColor: "#769656" },
  { id: "geoguessr", title: "GeoGuessr", category: "games", url: "https://www.geoguessr.com", icon: "compass", bgColor: "#6B9E3A" },
  { id: "lichess", title: "Lichess", category: "games", url: "https://lichess.org", icon: "gamepad-2", bgColor: "#1A1A1A" },
  { id: "xbox", title: "Xbox Cloud Gaming", category: "games", url: "https://www.xbox.com/play", icon: "gamepad-2", bgColor: "#107C41" },
  { id: "geforce", title: "GeForce NOW", category: "games", url: "https://play.geforcenow.com", icon: "monitor", bgColor: "#76B900" },
  { id: "emulatorjs", title: "EmulatorJS (Retro Games)", category: "games", url: "https://emulatorjs.org", icon: "gamepad-2", bgColor: "#8C52FF" },
  { id: "game2048", title: "2048 Game", category: "games", url: "https://play2048.co", icon: "grid", bgColor: "#EDC22E" },
  { id: "wordle", title: "Wordle", category: "games", url: "https://www.nytimes.com/games/wordle", icon: "type", bgColor: "#6AAA64" },
  { id: "krunker", title: "Krunker.io", category: "games", url: "https://krunker.io", icon: "crosshair", bgColor: "#FF9900" },

  // --- ADULT (VM18) ---
  { id: "pornhub", title: "Pornhub", category: "vm18", url: "https://www.pornhub.com", icon: "lock", bgColor: "#FFA300" },
  { id: "xvideos", title: "XVideos", category: "vm18", url: "https://www.xvideos.com", icon: "lock", bgColor: "#C80000" },
  { id: "xhamster", title: "xHamster", category: "vm18", url: "https://xhamster.com", icon: "lock", bgColor: "#FF6600" },
  { id: "onlyfans", title: "OnlyFans", category: "vm18", url: "https://onlyfans.com", icon: "lock", bgColor: "#00AFF0" },
  { id: "redtube", title: "RedTube", category: "vm18", url: "https://www.redtube.com", icon: "lock", bgColor: "#E62117" },
  { id: "youporn", title: "YouPorn", category: "vm18", url: "https://www.youporn.com", icon: "lock", bgColor: "#FF0055" },
  { id: "chaturbate", title: "Chaturbate", category: "vm18", url: "https://chaturbate.com", icon: "lock", bgColor: "#FF7B00" }
];

const defaultCatalogData = ITEM_CONFIGS.map(item => ({
  id: item.id,
  title: item.title,
  category: item.category,
  url: item.url,
  customFullscreenUrl: item.customFullscreenUrl || "",
  icon: item.icon,
  brandSlug: item.id,
  customLogoUrl: `/logos/square/dark/${item.id}.png`,
  wideLogoUrl: `/logos/banner/dark/${item.id}.png`,
  iconColor: "#ffffff",
  bgColor: item.bgColor,
  isSystem: true
}));

// 1. Write src/data/default-catalog.js
const defaultCatalogJsContent = `export const DEFAULT_CATALOG = ${JSON.stringify(defaultCatalogData, null, 2)};\n`;
fs.writeFileSync(path.join(rootDir, 'src', 'data', 'default-catalog.js'), defaultCatalogJsContent, 'utf8');

// 2. Write scripts/update-catalog.js
const updateCatalogJsContent = `import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const DEFAULT_CATALOG = ${JSON.stringify(defaultCatalogData, null, 2)};

fs.writeFileSync(
  path.join(rootDir, 'src', 'data', 'default-catalog.js'),
  \`export const DEFAULT_CATALOG = \${JSON.stringify(DEFAULT_CATALOG, null, 2)};\\n\`
);
console.log('Catalog updated successfully with ' + DEFAULT_CATALOG.length + ' items.');
`;
fs.writeFileSync(path.join(rootDir, 'scripts', 'update-catalog.js'), updateCatalogJsContent, 'utf8');

console.log(`Updated catalog files with ${defaultCatalogData.length} items.`);
