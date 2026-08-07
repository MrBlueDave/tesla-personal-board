/**
 * THEME & DYNAMIC ANIMATED BACKGROUND ENGINE FOR TESLA PERSONAL BOARD
 */

const STORAGE_KEY_DARK_PRESET = 'tesla_board_dark_preset';
const STORAGE_KEY_LIGHT_PRESET = 'tesla_board_light_preset';
const STORAGE_KEY_THEME_MODE = 'tesla_board_theme_mode'; // 'auto' | 'dark' | 'light'
const STORAGE_KEY_ANIMATED_BG = 'tesla_board_animated_bg';

export const DARK_THEMES = [
  { id: 'tesla-dark', name: 'Tesla Dark Futuristic (Vetro & Red/Cyan)', accent: '#E82127' },
  { id: 'oled-black', name: 'OLED Pure Black (#000000)', accent: '#00E676' },
  { id: 'slate-minimal', name: 'Slate Minimal (Indigo/Violet)', accent: '#6366f1' },
  { id: 'cyberpunk', name: 'Cyberpunk Neon (Pink/Yellow)', accent: '#ff007f' }
];

export const LIGHT_THEMES = [
  { id: 'light-tesla', name: 'Tesla Light Pure (Rosso Tesla)', accent: '#E82127' },
  { id: 'light-nordic', name: 'Nordic Slate & Frost (Indigo)', accent: '#4F46E5' },
  { id: 'light-champagne', name: 'Champagne Sand Quartz (Sabbia & Bronzo)', accent: '#D97706' },
  { id: 'light-emerald', name: 'Emerald Cyber Light (Smeraldo & Blu)', accent: '#059669' }
];

export const THEMES = [...DARK_THEMES, ...LIGHT_THEMES];

export function getDarkThemePreset() {
  return localStorage.getItem(STORAGE_KEY_DARK_PRESET) || 'tesla-dark';
}

export function setDarkThemePreset(themeId) {
  localStorage.setItem(STORAGE_KEY_DARK_PRESET, themeId);
  refreshActiveTheme();
}

export function getLightThemePreset() {
  return localStorage.getItem(STORAGE_KEY_LIGHT_PRESET) || 'light-tesla';
}

export function setLightThemePreset(themeId) {
  localStorage.setItem(STORAGE_KEY_LIGHT_PRESET, themeId);
  refreshActiveTheme();
}

/**
 * Gets theme mode: 'auto' | 'dark' | 'light'
 */
export function getThemeMode() {
  return localStorage.getItem(STORAGE_KEY_THEME_MODE) || 'auto';
}

/**
 * Sets theme mode: 'auto' | 'dark' | 'light'
 */
export function setThemeMode(mode) {
  const validMode = ['auto', 'dark', 'light'].includes(mode) ? mode : 'auto';
  localStorage.setItem(STORAGE_KEY_THEME_MODE, validMode);
  refreshActiveTheme();
  return validMode;
}

/**
 * Resolves effective theme preset based on theme mode & system preference
 */
export function getEffectiveThemePreset() {
  const mode = getThemeMode();
  if (mode === 'dark') {
    return getDarkThemePreset();
  } else if (mode === 'light') {
    return getLightThemePreset();
  } else {
    // 'auto': check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? getDarkThemePreset() : getLightThemePreset();
  }
}

export function isEffectiveThemeLight() {
  const preset = getEffectiveThemePreset();
  return LIGHT_THEMES.some(t => t.id === preset);
}

export function refreshActiveTheme() {
  const preset = getEffectiveThemePreset();
  document.documentElement.setAttribute('data-theme', preset);
  syncAnimatedBgDOM(isAnimatedBgEnabled());
}

export function isAnimatedBgEnabled() {
  const stored = localStorage.getItem(STORAGE_KEY_ANIMATED_BG);
  return stored !== null ? JSON.parse(stored) : true;
}

export function setAnimatedBgEnabled(enabled) {
  localStorage.setItem(STORAGE_KEY_ANIMATED_BG, JSON.stringify(enabled));
  syncAnimatedBgDOM(enabled);
}

function syncAnimatedBgDOM(enabled) {
  const bgContainer = document.querySelector('.dynamic-bg-container');
  if (bgContainer) {
    bgContainer.style.display = enabled ? 'block' : 'none';
  }
}

export function initThemeEngine() {
  refreshActiveTheme();

  // Listen to system color scheme changes if mode is 'auto'
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (getThemeMode() === 'auto') {
      refreshActiveTheme();
    }
  });
}
