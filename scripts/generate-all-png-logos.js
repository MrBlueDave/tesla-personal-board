import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { DEFAULT_CATALOG } from '../src/data/default-catalog.js';
import { BRANDS as FALLBACK_BRANDS } from './build-all-logos.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const targetDirs = {
  squareDark: path.join(rootDir, 'public', 'logos', 'square', 'dark'),
  squareLight: path.join(rootDir, 'public', 'logos', 'square', 'light'),
  bannerDark: path.join(rootDir, 'public', 'logos', 'banner', 'dark'),
  bannerLight: path.join(rootDir, 'public', 'logos', 'banner', 'light')
};

// 1. Clean directories completely (remove both png and svg or any other leftover files)
Object.values(targetDirs).forEach(dir => {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
      fs.unlinkSync(path.join(dir, f));
    }
  } else {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Candidate slug mappings for Simple Icons CDN
const SIMPLE_ICONS_SLUGS = {
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

function extractSvgInnerContent(svgStr) {
  if (!svgStr) return '';
  const match = svgStr.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  if (match && match[1]) {
    return match[1].replace(/<title>[\s\S]*?<\/title>/gi, '').trim();
  }
  return '';
}

function getIconColor(brand, isLight) {
  const bg = (brand.bgColor || '#000000').toUpperCase();
  const darkBrands = ['#000000', '#181717', '#111111', '#1A1A1A', '#141526', '#202124'];
  const lightBrands = ['#FFFFFF', '#FFFC00'];

  if (isLight) {
    if (lightBrands.includes(bg)) return '#111827';
    if (darkBrands.includes(bg)) return '#111827';
    return bg;
  } else {
    if (darkBrands.includes(bg)) return '#FFFFFF';
    return bg;
  }
}

function getCleanTitle(item) {
  let title = item.title;
  if (title.includes(' (')) title = title.split(' (')[0];
  if (title === 'Twitter / X') title = 'Twitter';
  if (title === 'Element / Matrix') title = 'Element';
  if (title === 'IPTV Web Player') title = 'IPTV';
  if (title === 'Samsung TV Plus') title = 'Samsung TV';
  if (title === 'Supercharge.info') title = 'Supercharge';
  if (title === 'Open Charge Map') title = 'OpenCharge';
  if (title === 'EmulatorJS (Retro Games)') title = 'EmulatorJS';
  if (title === '2048 Game') title = '2048';
  if (title === 'Krunker.io') title = 'Krunker';
  if (title === 'Xbox Cloud Gaming') title = 'Xbox Cloud';
  if (title === 'Mediaset Infinity') title = 'Mediaset';
  return title;
}

async function getBrandSvgContent(item) {
  const slug = item.brandSlug;
  const candidates = SIMPLE_ICONS_SLUGS[slug] || [slug];

  for (const cand of candidates) {
    const url = `https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/${cand}.svg`;
    const svgData = await fetchUrl(url);
    if (svgData && svgData.includes('<path')) {
      const inner = extractSvgInnerContent(svgData);
      if (inner) return { source: 'simple-icons', inner };
    }
  }

  const fb = FALLBACK_BRANDS[slug];
  if (fb && fb.iconSvg) {
    return { source: 'fallback', fn: fb.iconSvg };
  }

  return null;
}

function buildSquareSvg(contentObj, color) {
  let innerHtml = '';
  if (contentObj.source === 'simple-icons') {
    innerHtml = `<g transform="translate(38, 38) scale(7.5)" fill="${color}">${contentObj.inner}</g>`;
  } else if (contentObj.source === 'fallback') {
    const raw = contentObj.fn(color);
    innerHtml = `<g transform="translate(64, 64) scale(1.6) translate(-64, -64)">${raw}</g>`;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  ${innerHtml}
</svg>`;
}

function buildBannerSvg(contentObj, color, title, textColor) {
  let iconHtml = '';
  if (contentObj.source === 'simple-icons') {
    iconHtml = `<g transform="translate(28, 36) scale(5.33)" fill="${color}">${contentObj.inner}</g>`;
  } else if (contentObj.source === 'fallback') {
    const raw = contentObj.fn(color);
    iconHtml = `<g transform="translate(90, 100) scale(1.1) translate(-64, -64)">${raw}</g>`;
  }

  const safeTitle = title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const fontSize = safeTitle.length > 12 ? 34 : (safeTitle.length > 9 ? 38 : 42);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 200" width="512" height="200">
  ${iconHtml}
  <text x="175" y="116" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="700" font-size="${fontSize}" fill="${textColor}">${safeTitle}</text>
</svg>`;
}

async function main() {
  console.log(`Starting logo generation for ${DEFAULT_CATALOG.length} brands...`);
  let successCount = 0;

  const tasks = DEFAULT_CATALOG.map(async (item) => {
    const slug = item.brandSlug;
    const title = getCleanTitle(item);
    const contentObj = await getBrandSvgContent(item);

    if (!contentObj) {
      console.error(`Failed to get SVG content for ${slug}`);
      return;
    }

    const darkIconColor = getIconColor(item, false);
    const lightIconColor = getIconColor(item, true);

    // 1. Square Dark
    const sqDarkSvg = buildSquareSvg(contentObj, darkIconColor);
    const sqDarkBuffer = Buffer.from(sqDarkSvg);
    await sharp(sqDarkBuffer)
      .resize(256, 256, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9, quality: 100 })
      .toFile(path.join(targetDirs.squareDark, `${slug}.png`));

    // 2. Square Light
    const sqLightSvg = buildSquareSvg(contentObj, lightIconColor);
    const sqLightBuffer = Buffer.from(sqLightSvg);
    await sharp(sqLightBuffer)
      .resize(256, 256, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9, quality: 100 })
      .toFile(path.join(targetDirs.squareLight, `${slug}.png`));

    // 3. Banner Dark
    const bnDarkSvg = buildBannerSvg(contentObj, darkIconColor, title, '#FFFFFF');
    const bnDarkBuffer = Buffer.from(bnDarkSvg);
    await sharp(bnDarkBuffer)
      .resize(512, 200, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9, quality: 100 })
      .toFile(path.join(targetDirs.bannerDark, `${slug}.png`));

    // 4. Banner Light
    const bnLightSvg = buildBannerSvg(contentObj, lightIconColor, title, '#111827');
    const bnLightBuffer = Buffer.from(bnLightSvg);
    await sharp(bnLightBuffer)
      .resize(512, 200, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9, quality: 100 })
      .toFile(path.join(targetDirs.bannerLight, `${slug}.png`));

    successCount++;
  });

  await Promise.all(tasks);

  console.log(`Generated all logos for ${successCount}/${DEFAULT_CATALOG.length} brands.`);

  // Verify total PNG count and SVG count
  let totalPngs = 0;
  let totalSvgs = 0;
  Object.entries(targetDirs).forEach(([key, dir]) => {
    const pngs = fs.readdirSync(dir).filter(f => f.endsWith('.png')).length;
    const svgs = fs.readdirSync(dir).filter(f => f.endsWith('.svg')).length;
    console.log(`Folder ${key}: ${pngs} PNG files, ${svgs} SVG files.`);
    totalPngs += pngs;
    totalSvgs += svgs;
  });

  console.log(`Total PNG files created across 4 subfolders: ${totalPngs}/432`);
  if (totalPngs !== 432 || totalSvgs !== 0) {
    console.log(`Verification: PNGs = ${totalPngs}, SVGs = ${totalSvgs}`);
  }
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
