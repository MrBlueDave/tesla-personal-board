import fs from 'fs';
import https from 'https';
import { DEFAULT_CATALOG } from '../src/data/default-catalog.js';

const SLUG_MAPPINGS = {
  homeassistant: ['homeassistant'],
  immich: ['immich'],
  solaredge: ['solaredge'],
  shelly: ['shelly'],
  homebridge: ['homebridge'],
  portainer: ['portainer'],
  pihole: ['pihole'],
  adguard: ['adguard'],
  zigbee2mqtt: ['zigbee2mqtt'],
  esphome: ['esphome'],
  nodered: ['nodered'],
  octoprint: ['octoprint'],
  homepage: ['homepage', 'gethomepage'],
  paperless: ['paperlessngx', 'paperless'],
  tasmoadmin: ['tasmota', 'tasmoadmin'],
  facebook: ['facebook'],
  reddit: ['reddit'],
  instagram: ['instagram'],
  twitter: ['x', 'twitter'],
  whatsapp: ['whatsapp'],
  telegram: ['telegram'],
  threads: ['threads'],
  linkedin: ['linkedin'],
  tiktok: ['tiktok'],
  discord: ['discord'],
  mastodon: ['mastodon'],
  bluesky: ['bluesky'],
  lemmy: ['lemmy'],
  pinterest: ['pinterest'],
  element: ['element', 'matrix'],
  snapchat: ['snapchat'],
  youtube: ['youtube'],
  netflix: ['netflix'],
  disneyplus: ['disneyplus', 'disney'],
  primevideo: ['primevideo', 'amazonprime', 'amazon'],
  twitch: ['twitch'],
  plex: ['plex'],
  spotify: ['spotify'],
  applemusic: ['applemusic', 'apple'],
  paramountplus: ['paramountplus', 'paramount'],
  max: ['max', 'hbo'],
  crunchyroll: ['crunchyroll'],
  ytmusic: ['youtubemusic', 'youtube'],
  deezer: ['deezer'],
  soundcloud: ['soundcloud'],
  dazn: ['dazn'],
  jellyfin: ['jellyfin'],
  navidrome: ['navidrome'],
  audiobookshelf: ['audiobookshelf'],
  emby: ['emby'],
  tidal: ['tidal'],
  kick: ['kick'],
  vimeo: ['vimeo'],
  plutotv: ['plutotv'],
  raiplay: ['rai', 'raiplay'],
  mediaset: ['mediaset'],
  discoveryplus: ['discoveryplus', 'discovery'],
  rakutentv: ['rakuten'],
  iptvorg: ['iptv'],
  samsungtv: ['samsung'],
  tubi: ['tubi'],
  zattoo: ['zattoo'],
  abrp: ['abetterrouteplanner', 'abrp'],
  waze: ['waze'],
  googlemaps: ['googlemaps', 'google'],
  chargemap: ['chargemap'],
  plugshare: ['plugshare'],
  ionity: ['ionity'],
  enelxway: ['enel'],
  supercharge: ['tesla'],
  teslamate: ['tesla'],
  teslalogger: ['tesla'],
  openchargemap: ['openchargemap'],
  openstreetmap: ['openstreetmap'],
  electrifyamerica: ['electrifyamerica'],
  herewego: ['here'],
  chatgpt: ['openai'],
  wikipedia: ['wikipedia'],
  claude: ['anthropic'],
  google: ['google'],
  weather: ['accuweather'],
  speedtest: ['speedtest', 'ookla'],
  notion: ['notion'],
  github: ['github'],
  openwebui: ['openwebui', 'openai'],
  n8n: ['n8n'],
  excalidraw: ['excalidraw'],
  cyberchef: ['gchq'],
  gemini: ['googlegemini', 'google'],
  perplexity: ['perplexity'],
  deepseek: ['deepseek'],
  duckduckgo: ['duckduckgo'],
  chess: ['chessdotcom', 'chess'],
  geoguessr: ['geoguessr'],
  lichess: ['lichess'],
  xbox: ['xbox'],
  geforce: ['nvidia'],
  emulatorjs: ['retroarch'],
  game2048: ['2048'],
  wordle: ['wordle'],
  krunker: ['krunker'],
  pornhub: ['pornhub'],
  xvideos: ['xvideos'],
  xhamster: ['xhamster'],
  onlyfans: ['onlyfans'],
  redtube: ['redtube'],
  youporn: ['youporn'],
  chaturbate: ['chaturbate']
};

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchUrl(res.headers.location));
      }
      if (res.statusCode !== 200) {
        return resolve(null);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(null));
  });
}

async function checkItem(item) {
  const slug = item.brandSlug;
  const candidates = SLUG_MAPPINGS[slug] || [slug];
  for (const cand of candidates) {
    const url = `https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/${cand}.svg`;
    const svgData = await fetchUrl(url);
    if (svgData && svgData.includes('<path')) {
      return { slug, status: 'OK', cand, svg: svgData };
    }
  }
  return { slug, status: 'MISSING' };
}

async function testFetchAll() {
  const promises = DEFAULT_CATALOG.map(checkItem);
  const results = await Promise.all(promises);
  const ok = results.filter(r => r.status === 'OK');
  const missing = results.filter(r => r.status === 'MISSING').map(r => r.slug);
  console.log(`Fetched ${ok.length}/108 from Simple Icons CDN.`);
  console.log('Missing brand slugs:', missing);
}

testFetchAll();
