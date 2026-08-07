import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const squareDarkDir = path.join(rootDir, 'public', 'logos', 'square', 'dark');
const squareLightDir = path.join(rootDir, 'public', 'logos', 'square', 'light');

// Premium 3D Glossy iOS App Icon Generators for Utilities, Games, and VM18
const RICH_ICONS = {
  // --- UTILITIES & TOOLS ---
  chatgpt: {
    name: "ChatGPT",
    bgGradient: ["#0B192C", "#10A37F"],
    svgIcon: `
      <g filter="url(#dropShadow)">
        <circle cx="128" cy="128" r="64" fill="none" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round"/>
        <path d="M128 64v128M64 128h128M83 83l90 90M83 173l90-90" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round"/>
      </g>`
  },
  wikipedia: {
    name: "Wikipedia",
    bgGradient: ["#F1F5F9", "#CBD5E1"],
    svgIcon: `
      <g filter="url(#dropShadow)" fill="#0F172A">
        <path d="M60 76l32 96h16l18-56 18 56h16l32-96h-18l-22 68-18-68h-14l-18 68-22-68H60z"/>
      </g>`
  },
  claude: {
    name: "Claude AI",
    bgGradient: ["#2A1810", "#D97757"],
    svgIcon: `
      <g filter="url(#dropShadow)" fill="#FFFFFF">
        <circle cx="128" cy="128" r="28"/>
        <rect x="116" y="52" width="24" height="44" rx="12"/>
        <rect x="116" y="160" width="24" height="44" rx="12"/>
        <rect x="52" y="116" width="44" height="24" rx="12"/>
        <rect x="160" y="116" width="44" height="24" rx="12"/>
      </g>`
  },
  google: {
    name: "Google",
    bgGradient: ["#FFFFFF", "#F8FAFC"],
    svgIcon: `
      <g filter="url(#dropShadow)">
        <path fill="#4285F4" d="M196 129c0-6-1-13-2-19H128v36h38c-2 10-7 19-16 25v21h26c15-14 24-35 24-63z"/>
        <path fill="#34A853" d="M128 198c19 0 35-6 47-17l-26-21c-6 4-14 7-21 7-17 0-31-11-36-27H65v22c12 24 37 36 63 36z"/>
        <path fill="#FBBC05" d="M92 140c-2-6-3-12-3-12s1-6 3-12V94H65a64 64 0 0 0 0 68l27-22z"/>
        <path fill="#EA4335" d="M128 58c10 0 20 4 27 10l20-20C163 36 147 30 128 30 102 30 77 42 65 66l27 22c5-16 19-30 36-30z"/>
      </g>`
  },
  weather: {
    name: "AccuWeather",
    bgGradient: ["#0B192C", "#F05023"],
    svgIcon: `
      <g filter="url(#dropShadow)">
        <circle cx="104" cy="104" r="40" fill="#FFC107"/>
        <path fill="#FFFFFF" opacity="0.95" d="M84 172c-20 0-36-16-36-36 0-16 11-30 27-34 5-18 21-30 41-30 23 0 43 18 43 41 11 2 21 11 21 23 0 14-12 27-27 27H84z"/>
      </g>`
  },
  speedtest: {
    name: "Speedtest",
    bgGradient: ["#0F172A", "#141526"],
    svgIcon: `
      <g filter="url(#dropShadow)">
        <path fill="none" stroke="#00FDFF" stroke-width="16" stroke-linecap="round" d="M60 164a80 80 0 1 1 136 0"/>
        <polygon fill="#00FDFF" points="128,128 168,72 144,128"/>
        <circle cx="128" cy="128" r="12" fill="#00FDFF"/>
      </g>`
  },
  notion: {
    name: "Notion",
    bgGradient: ["#18181B", "#000000"],
    svgIcon: `
      <g filter="url(#dropShadow)" fill="#FFFFFF">
        <path d="M60 52h136v152H60V52zm24 24v104h24V104l40 72h24V76h-24v72L108 76H84z"/>
      </g>`
  },
  github: {
    name: "GitHub",
    bgGradient: ["#1E293B", "#090D16"],
    svgIcon: `
      <g filter="url(#dropShadow)" fill="#FFFFFF">
        <path d="M128 40C79 40 40 79 40 128c0 39 25 72 60 84 4 1 6-2 6-4v-15c-24 5-29-12-29-12-4-10-10-13-10-13-8-5 1-5 1-5 9 1 14 9 14 9 8 14 21 10 26 8 1-6 3-10 5-12-19-2-40-10-40-44 0-10 4-18 9-25-1-2-4-11 1-24 0 0 8-2 25 10 7-2 15-3 23-3s16 1 23 3c17-12 25-10 25-10 5 13 2 22 1 24 6 7 9 15 9 25 0 34-21 42-41 44 3 3 6 9 6 18v27c0 2 2 5 6 4 35-12 60-45 60-84 0-49-39-88-88-88z"/>
      </g>`
  },
  openwebui: {
    name: "Open WebUI",
    bgGradient: ["#020617", "#0F172A"],
    svgIcon: `
      <g filter="url(#dropShadow)">
        <circle cx="128" cy="100" r="32" fill="#10A37F"/>
        <path d="M80 168c0-24 20-40 48-40s48 16 48 40" fill="none" stroke="#10A37F" stroke-width="16" stroke-linecap="round"/>
      </g>`
  },
  n8n: {
    name: "n8n",
    bgGradient: ["#450A0A", "#FF6D5A"],
    svgIcon: `
      <g filter="url(#dropShadow)" fill="#FFFFFF">
        <circle cx="88" cy="128" r="20"/>
        <circle cx="168" cy="128" r="20"/>
        <path d="M88 128C88 100 168 100 168 128S88 156 88 128Z" fill="none" stroke="#FFFFFF" stroke-width="12"/>
      </g>`
  },
  excalidraw: {
    name: "Excalidraw",
    bgGradient: ["#1E1B4B", "#6965DB"],
    svgIcon: `
      <g filter="url(#dropShadow)" fill="#FFFFFF">
        <path d="M80 176l72-96 24 24-96 72H80z"/>
      </g>`
  },
  cyberchef: {
    name: "CyberChef",
    bgGradient: ["#052E16", "#14532D"],
    svgIcon: `
      <g filter="url(#dropShadow)" stroke="#00FF00" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" fill="none">
        <path d="M72 80l40 48-40 48M120 176h64"/>
      </g>`
  },
  gemini: {
    name: "Google Gemini",
    bgGradient: ["#030712", "#312E81"],
    svgIcon: `
      <g filter="url(#dropShadow)">
        <path fill="url(#geminiStarGrad)" d="M128 48c0 44-36 80-80 80 44 0 80 36 80 80 0-44 36-80 80-80-44 0-80-36-80-80z"/>
      </g>`
  },
  perplexity: {
    name: "Perplexity",
    bgGradient: ["#042F2E", "#0891B2"],
    svgIcon: `
      <g filter="url(#dropShadow)" stroke="#FFFFFF" stroke-width="16" stroke-linecap="round">
        <path d="M88 88l80 80M168 88L88 168"/>
      </g>`
  },
  deepseek: {
    name: "DeepSeek",
    bgGradient: ["#0F172A", "#2563EB"],
    svgIcon: `
      <g filter="url(#dropShadow)" fill="#FFFFFF">
        <path d="M80 152c40 0 72-24 72-56 0-16-10-28-24-36l-16 24c8 4 12 10 12 16 0 16-20 28-44 28-16 0-28-6-28-16 0-12 16-20 36-20v-16c-32 0-52 16-52 36 0 24 20 40 44 40z"/>
      </g>`
  },
  duckduckgo: {
    name: "DuckDuckGo",
    bgGradient: ["#451A03", "#DE5833"],
    svgIcon: `
      <g filter="url(#dropShadow)">
        <circle cx="128" cy="128" r="72" fill="#DE5833"/>
        <circle cx="112" cy="104" r="12" fill="#FFFFFF"/>
        <polygon points="128,120 176,136 128,152" fill="#FFB704"/>
      </g>`
  },

  // --- GAMES & LEISURE ---
  chess: {
    name: "Chess.com",
    bgGradient: ["#143618", "#769656"],
    svgIcon: `
      <g filter="url(#dropShadow)" fill="#FFFFFF">
        <path d="M128 64c-16 0-28 12-28 28 0 8 4 16 10 20-12 8-20 20-20 36h76c0-16-8-28-20-36 6-4 10-12 10-20 0-16-12-28-28-28zM88 160h80v16H88v-16z"/>
      </g>`
  },
  geoguessr: {
    name: "GeoGuessr",
    bgGradient: ["#1E3A8A", "#6B9E3A"],
    svgIcon: `
      <g filter="url(#dropShadow)">
        <polygon fill="#FFFFFF" points="128,56 152,128 128,112 104,128"/>
        <polygon fill="#E53935" points="128,200 152,128 128,144 104,128"/>
      </g>`
  },
  lichess: {
    name: "Lichess",
    bgGradient: ["#09090B", "#27272A"],
    svgIcon: `
      <g filter="url(#dropShadow)" fill="#FFFFFF">
        <path d="M128 40C80 40 64 72 64 104c0 24 12 44 32 56v24h64v-24c20-12 32-32 32-56 0-32-16-64-64-64zm-16 48a8 8 0 1 1 0 16 8 8 0 0 1 0-16z"/>
      </g>`
  },
  xbox: {
    name: "Xbox",
    bgGradient: ["#022C22", "#107C41"],
    svgIcon: `
      <g filter="url(#dropShadow)">
        <circle cx="128" cy="128" r="76" fill="#107C41"/>
        <path fill="#FFFFFF" d="M76 68c28 24 52 60 52 88 0-28 24-64 52-88-20-16-46-24-72-24S96 52 76 68z"/>
      </g>`
  },
  geforce: {
    name: "GeForce NOW",
    bgGradient: ["#052E16", "#76B900"],
    svgIcon: `
      <g filter="url(#dropShadow)" fill="#76B900">
        <path d="M128 48C82 48 48 82 48 128s34 80 80 80 80-34 80-80c0-24-10-46-28-60l-16 16c12 10 20 26 20 44 0 32-24 56-56 56s-56-24-56-56 24-56 56-56c14 0 28 6 38 16l16-16c-14-14-34-24-54-24z"/>
      </g>`
  },
  emulatorjs: {
    name: "EmulatorJS",
    bgGradient: ["#2E1065", "#8C52FF"],
    svgIcon: `
      <g filter="url(#dropShadow)">
        <rect x="40" y="64" width="176" height="128" rx="32" fill="#8C52FF"/>
        <path d="M88 96v64M56 128h64" stroke="#FFFFFF" stroke-width="16" stroke-linecap="round"/>
        <circle cx="160" cy="112" r="12" fill="#FFFFFF"/>
        <circle cx="184" cy="136" r="12" fill="#FFFFFF"/>
      </g>`
  },
  game2048: {
    name: "2048",
    bgGradient: ["#78350F", "#EDC22E"],
    svgIcon: `
      <g filter="url(#dropShadow)">
        <rect x="48" y="48" width="160" height="160" rx="32" fill="#EDC22E"/>
        <text x="128" y="148" font-family="-apple-system, Arial, sans-serif" font-weight="900" font-size="52" fill="#FFFFFF" text-anchor="middle">2048</text>
      </g>`
  },
  wordle: {
    name: "Wordle",
    bgGradient: ["#14532D", "#6AAA64"],
    svgIcon: `
      <g filter="url(#dropShadow)">
        <rect x="72" y="72" width="48" height="48" rx="8" fill="#FFFFFF"/>
        <rect x="136" y="72" width="48" height="48" rx="8" fill="#FFFFFF"/>
        <rect x="72" y="136" width="48" height="48" rx="8" fill="#FFFFFF"/>
        <rect x="136" y="136" width="48" height="48" rx="8" fill="#538D4E"/>
      </g>`
  },
  krunker: {
    name: "Krunker.io",
    bgGradient: ["#451A03", "#FF9900"],
    svgIcon: `
      <g filter="url(#dropShadow)">
        <circle cx="128" cy="128" r="56" fill="none" stroke="#FFFFFF" stroke-width="16"/>
        <circle cx="128" cy="128" r="16" fill="#FFFFFF"/>
      </g>`
  },

  // --- ADULT (VM18) ---
  pornhub: {
    name: "Pornhub",
    bgGradient: ["#0A0A0A", "#1C1917"],
    svgIcon: `
      <g filter="url(#dropShadow)">
        <rect x="32" y="72" width="192" height="112" rx="16" fill="#000000"/>
        <rect x="120" y="84" width="92" height="88" rx="12" fill="#FFA300"/>
        <text x="72" y="142" font-family="-apple-system, Arial, sans-serif" font-weight="900" font-size="44" fill="#FFFFFF">Porn</text>
        <text x="130" y="142" font-family="-apple-system, Arial, sans-serif" font-weight="900" font-size="44" fill="#000000">hub</text>
      </g>`
  },
  xvideos: {
    name: "XVideos",
    bgGradient: ["#450A0A", "#C80000"],
    svgIcon: `
      <g filter="url(#dropShadow)">
        <polygon fill="#C80000" points="128,40 152,96 212,96 164,132 184,188 128,152 72,188 92,132 44,96 104,96"/>
      </g>`
  },
  xhamster: {
    name: "xHamster",
    bgGradient: ["#451A03", "#FF6600"],
    svgIcon: `
      <g filter="url(#dropShadow)" fill="#FF6600">
        <circle cx="128" cy="128" r="80"/>
        <circle cx="88" cy="96" r="16" fill="#FFFFFF"/>
        <circle cx="168" cy="96" r="16" fill="#FFFFFF"/>
        <path fill="#FFFFFF" d="M128 144c16 0 28-8 28-16H100c0 8 12 16 28 16z"/>
      </g>`
  },
  onlyfans: {
    name: "OnlyFans",
    bgGradient: ["#083344", "#00AFF0"],
    svgIcon: `
      <g filter="url(#dropShadow)">
        <circle cx="128" cy="128" r="76" fill="#00AFF0"/>
        <circle cx="128" cy="128" r="36" fill="none" stroke="#FFFFFF" stroke-width="16"/>
        <circle cx="128" cy="128" r="12" fill="#FFFFFF"/>
      </g>`
  },
  redtube: {
    name: "RedTube",
    bgGradient: ["#450A0A", "#E62117"],
    svgIcon: `
      <g filter="url(#dropShadow)" fill="#E62117">
        <rect x="40" y="64" width="176" height="128" rx="32"/>
        <polygon points="104,88 160,128 104,168" fill="#FFFFFF"/>
      </g>`
  },
  youporn: {
    name: "YouPorn",
    bgGradient: ["#4C0519", "#FF0055"],
    svgIcon: `
      <g filter="url(#dropShadow)" fill="#FF0055">
        <circle cx="128" cy="128" r="80"/>
        <text x="128" y="148" font-family="-apple-system, Arial, sans-serif" font-weight="900" font-size="56" fill="#FFFFFF" text-anchor="middle">YP</text>
      </g>`
  },
  chaturbate: {
    name: "Chaturbate",
    bgGradient: ["#451A03", "#FF7B00"],
    svgIcon: `
      <g filter="url(#dropShadow)" fill="#FF7B00">
        <rect x="40" y="64" width="176" height="128" rx="32"/>
        <circle cx="128" cy="128" r="32" fill="#FFFFFF"/>
      </g>`
  }
};

// Generate high quality 3D Glossy iOS App Icon SVG string
function generateRichIosSvg(slug) {
  const cfg = RICH_ICONS[slug];
  const [gradStart, gradEnd] = cfg.bgGradient;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <defs>
    <!-- Background Radial Gradient -->
    <radialGradient id="bgGrad" cx="50%" cy="30%" r="80%">
      <stop offset="0%" stop-color="${gradEnd}"/>
      <stop offset="100%" stop-color="${gradStart}"/>
    </radialGradient>
    
    <!-- Gemini Star Special Gradient -->
    <linearGradient id="geminiStarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#93C5FD"/>
      <stop offset="50%" stop-color="#818CF8"/>
      <stop offset="100%" stop-color="#C084FC"/>
    </linearGradient>

    <!-- Top Specular Glass Glare -->
    <linearGradient id="glassGlare" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.35"/>
      <stop offset="40%" stop-color="#FFFFFF" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>

    <!-- Drop Shadow Filter -->
    <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000000" flood-opacity="0.45"/>
    </filter>
  </defs>

  <!-- Base Squircle -->
  <rect x="0" y="0" width="256" height="256" rx="56" ry="56" fill="url(#bgGrad)"/>
  
  <!-- Icon Emblem Content -->
  ${cfg.svgIcon.trim()}

  <!-- Top Glass Glare Overlay -->
  <rect x="0" y="0" width="256" height="112" rx="56" ry="56" fill="url(#glassGlare)"/>

  <!-- Subtle Inner Border Frame -->
  <rect x="1" y="1" width="254" height="254" rx="55" ry="55" fill="none" stroke="#FFFFFF" stroke-opacity="0.15" stroke-width="2"/>
</svg>`;
}

async function buildRichIcons() {
  const slugs = Object.keys(RICH_ICONS);
  console.log(`Building Ultra-HD 3D Glossy iOS Icons for ${slugs.length} target services...`);

  // Mask for squircle clip
  const squircleMask = Buffer.from(`<svg width="256" height="256">
    <rect x="0" y="0" width="256" height="256" rx="56" ry="56" fill="#ffffff"/>
  </svg>`);

  for (const slug of slugs) {
    const svgStr = generateRichIosSvg(slug);
    const pngBuffer = await sharp(Buffer.from(svgStr))
      .resize(256, 256)
      .composite([{ input: squircleMask, blend: 'dest-in' }])
      .png({ compressionLevel: 9, quality: 100 })
      .toBuffer();

    const darkPath = path.join(squareDarkDir, `${slug}.png`);
    const lightPath = path.join(squareLightDir, `${slug}.png`);

    fs.writeFileSync(darkPath, pngBuffer);
    fs.writeFileSync(lightPath, pngBuffer);

    console.log(`[Ultra-HD iOS Icon] ${slug} -> Saved ${slug}.png`);
  }

  console.log(`Successfully updated all ${slugs.length} icons in Utilities, Games & VM18!`);
}

buildRichIcons().catch(err => {
  console.error("Error building rich icons:", err);
  process.exit(1);
});
