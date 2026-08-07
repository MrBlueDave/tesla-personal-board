/**
 * UTILITY HELPERS MODULE FOR TESLA PERSONAL BOARD (WITH PNG & SVG THEME RESOLUTION)
 */

import { isEffectiveThemeLight } from './theme.js';

/**
 * GENERATES A UNIQUE RANDOM ID
 */
export function generateId() {
  return 'app_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * CONVERTS NORMAL URL TO YOUTUBE FULLSCREEN REDIRECT URL
 * Tesla's in-car browser opens youtube.com/redirect?q=... inside its video layer
 */
export function getYouTubeRedirectUrl(targetUrl, customRedirect = '') {
  if (customRedirect && customRedirect.trim() !== '') {
    return customRedirect.trim();
  }
  
  if (!targetUrl) return '';

  let finalTarget = targetUrl;
  if (!finalTarget.startsWith('http://') && !finalTarget.startsWith('https://')) {
    finalTarget = 'https://' + finalTarget;
  }

  return `https://www.youtube.com/redirect?q=${encodeURIComponent(finalTarget)}`;
}

/**
 * GETS LOCAL OR CUSTOM SQUARE LOGO URL BASED ON ACTIVE THEME (PRIORITIZES PNG HD)
 */
export function getLogoUrl(app, forceLight = false, format = 'png') {
  if (!app) return '';

  if (app.customLogoUrl && app.customLogoUrl.trim() !== '' && !app.customLogoUrl.startsWith('/logos/')) {
    return app.customLogoUrl.trim();
  }

  const isLight = forceLight || isEffectiveThemeLight();
  const themeSubfolder = isLight ? 'light' : 'dark';
  const slug = app.brandSlug || app.id;
  const ext = format || 'png';

  return `/logos/square/${themeSubfolder}/${slug}.${ext}`;
}

/**
 * GETS LOCAL OR CUSTOM WIDE BANNER LOGO URL BASED ON ACTIVE THEME (PRIORITIZES PNG HD)
 */
export function getWideLogoUrl(app, forceLight = false, format = 'png') {
  if (!app) return '';

  if (app.wideLogoUrl && app.wideLogoUrl.trim() !== '' && !app.wideLogoUrl.startsWith('/logos/')) {
    return app.wideLogoUrl.trim();
  }

  const isLight = forceLight || isEffectiveThemeLight();
  const themeSubfolder = isLight ? 'light' : 'dark';
  const slug = app.brandSlug || app.id;
  const ext = format || 'png';

  return `/logos/banner/${themeSubfolder}/${slug}.${ext}`;
}

/**
 * EXPORTS CONFIG AS JSON FILE
 */
export function exportConfigAsJson(catalog, settings = {}) {
  const data = {
    version: '0.2.0',
    exportDate: new Date().toISOString(),
    catalog,
    settings
  };

  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `tesla-board-config-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * SHOWS TOAST NOTIFICATION
 */
export function showToast(message, type = 'info') {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconName = 'info';
  if (type === 'success') iconName = 'check-circle';
  if (type === 'error') iconName = 'alert-circle';

  toast.innerHTML = `<i data-lucide="${iconName}"></i> <span>${message}</span>`;
  toastContainer.appendChild(toast);

  if (window.lucide) {
    window.lucide.createIcons();
  }

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3000);
}
