/**
 * TESLA DPR & DYNAMIC ZOOM DENSITY ENGINE v0.9.1
 * Manages Dashboard Zoom (70%-130%), Services Zoom (70%-130%), and Tesla Auto DPR Detection.
 */

const STORAGE_KEY_LAYOUT_DENSITY = 'tesla_board_layout_density'; // 'auto' | 'compact' | 'standard'
const STORAGE_KEY_DASHBOARD_ZOOM = 'tesla_board_dashboard_zoom'; // 70 to 130
const STORAGE_KEY_SERVICES_ZOOM = 'tesla_board_services_zoom';   // 70 to 130
const STORAGE_KEY_AUTO_DPR = 'tesla_board_auto_dpr';             // 'true' | 'false'

export function getLayoutDensity() {
  return localStorage.getItem(STORAGE_KEY_LAYOUT_DENSITY) || 'auto';
}

export function setLayoutDensity(mode) {
  const validMode = ['auto', 'compact', 'standard'].includes(mode) ? mode : 'auto';
  localStorage.setItem(STORAGE_KEY_LAYOUT_DENSITY, validMode);
  refreshLayoutDensity();
  return validMode;
}

export function getAutoDprEnabled() {
  const val = localStorage.getItem(STORAGE_KEY_AUTO_DPR);
  return val !== 'false'; // default true
}

export function setAutoDprEnabled(enabled) {
  localStorage.setItem(STORAGE_KEY_AUTO_DPR, enabled ? 'true' : 'false');
  refreshLayoutDensity();
}

export function getDashboardZoom() {
  const val = parseInt(localStorage.getItem(STORAGE_KEY_DASHBOARD_ZOOM), 10);
  return (val >= 70 && val <= 130) ? val : 100;
}

export function setDashboardZoom(percent) {
  const clamped = Math.max(70, Math.min(130, parseInt(percent, 10) || 100));
  localStorage.setItem(STORAGE_KEY_DASHBOARD_ZOOM, clamped);
  refreshLayoutDensity();
  return clamped;
}

export function getServicesDefaultZoom() {
  const val = parseInt(localStorage.getItem(STORAGE_KEY_SERVICES_ZOOM), 10);
  return (val >= 70 && val <= 130) ? val : 100;
}

export function setServicesDefaultZoom(percent) {
  const clamped = Math.max(70, Math.min(130, parseInt(percent, 10) || 100));
  localStorage.setItem(STORAGE_KEY_SERVICES_ZOOM, clamped);
  return clamped;
}

export function isTesla2026Mode() {
  if (!getAutoDprEnabled()) return false;
  const mode = getLayoutDensity();
  if (mode === 'compact') return true;
  if (mode === 'standard') return false;

  const dpr = window.devicePixelRatio || 1;
  const innerH = window.innerHeight;
  const ua = navigator.userAgent;
  const isTeslaBrowser = /Tesla/i.test(ua) || /QtCarBrowser/i.test(ua);

  return (dpr >= 1.35) || (innerH > 0 && innerH <= 650) || isTeslaBrowser;
}

export function refreshLayoutDensity() {
  const root = document.documentElement;
  const teslaMode = isTesla2026Mode();
  const zoom = getDashboardZoom();
  const servicesZoom = getServicesDefaultZoom();

  if (teslaMode) {
    root.setAttribute('data-tesla-dpr', 'high');
    root.classList.add('tesla-2026-mode');
  } else {
    root.removeAttribute('data-tesla-dpr');
    root.classList.remove('tesla-2026-mode');
  }

  root.style.setProperty('--dashboard-zoom', `${zoom}%`);
  root.style.setProperty('--services-default-zoom', `${servicesZoom}%`);
  root.style.setProperty('--app-zoom-factor', (zoom / 100).toFixed(2));

  const mainApp = document.getElementById('app');
  if (mainApp) {
    if (zoom !== 100) {
      mainApp.style.zoom = `${zoom}%`;
    } else {
      mainApp.style.zoom = '';
    }
  }
}

export function initDensityEngine() {
  refreshLayoutDensity();

  window.addEventListener('resize', () => {
    if (getLayoutDensity() === 'auto' && getAutoDprEnabled()) {
      refreshLayoutDensity();
    }
  });
}
