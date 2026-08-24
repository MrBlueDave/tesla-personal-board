/**
 * DIAGNOSTIC HUD OVERLAY & TESLA VEHICLE METRICS MONITOR
 */

import { getLayoutDensity, isTesla2026Mode } from './density.js';

const STORAGE_KEY_DEBUG_HUD = 'tesla_board_debug_hud';

export function isDebugHudEnabled() {
  const stored = localStorage.getItem(STORAGE_KEY_DEBUG_HUD);
  return stored !== null ? JSON.parse(stored) : false;
}

export function setDebugHudEnabled(enabled) {
  localStorage.setItem(STORAGE_KEY_DEBUG_HUD, JSON.stringify(enabled));
  syncDebugHudDOM(enabled);
}

export function toggleDebugHud() {
  const next = !isDebugHudEnabled();
  setDebugHudEnabled(next);
  return next;
}

/**
 * Collects exact client metrics
 */
export function getClientMetrics() {
  const ua = navigator.userAgent;
  const isTeslaBrowser = /Tesla/i.test(ua) || /QtCarBrowser/i.test(ua);
  const dpr = window.devicePixelRatio || 1;
  const innerW = window.innerWidth;
  const innerH = window.innerHeight;
  const screenW = window.screen ? window.screen.width : 0;
  const screenH = window.screen ? window.screen.height : 0;
  const orientation = window.screen && window.screen.orientation ? window.screen.orientation.type : 'landscape';

  return {
    isTeslaBrowser,
    dpr: dpr.toFixed(2),
    innerW,
    innerH,
    screenW,
    screenH,
    orientation,
    ua
  };
}

/**
 * Logs client metrics to console
 */
export function logDiagnosticMetrics() {
  const m = getClientMetrics();
  console.log('%c[TESLA BOARD DIAGNOSTIC METRICS]', 'color: #00F2FE; font-weight: bold; font-size: 14px;');
  console.log(`- Viewport Inner Size : ${m.innerW}px x ${m.innerH}px`);
  console.log(`- Screen Resolution   : ${m.screenW}px x ${m.screenH}px`);
  console.log(`- Device Pixel Ratio  : ${m.dpr}x`);
  console.log(`- Is Tesla Browser    : ${m.isTeslaBrowser ? 'YES (QtCarBrowser/Chromium)' : 'NO (Desktop/Standard)'}`);
  console.log(`- User Agent          : ${m.ua}`);
}

/**
 * Initializes Diagnostic HUD DOM Overlay
 */
export function initDebugHud() {
  logDiagnosticMetrics();

  // Create overlay element if missing
  let hudContainer = document.getElementById('debug-hud-overlay');
  if (!hudContainer) {
    hudContainer = document.createElement('div');
    hudContainer.id = 'debug-hud-overlay';
    hudContainer.className = 'debug-hud-overlay';
    document.body.appendChild(hudContainer);
  }

  function updateHudUI() {
    if (!isDebugHudEnabled()) {
      hudContainer.style.display = 'none';
      return;
    }

    const m = getClientMetrics();
    const isTesla2026 = isTesla2026Mode();
    const densityMode = getLayoutDensity();

    hudContainer.style.display = 'flex';
    hudContainer.innerHTML = `
      <div class="hud-header">
        <span>⚡ TESLA HUD DIAGNOSTICA</span>
        <button id="hud-close-btn" class="hud-close-btn">&times;</button>
      </div>
      <div class="hud-content">
        <div class="hud-row">
          <span class="hud-label">Viewport CSS:</span>
          <span class="hud-val highlight">${m.innerW} &times; ${m.innerH} px</span>
        </div>
        <div class="hud-row">
          <span class="hud-label">Screen Physical:</span>
          <span class="hud-val">${m.screenW} &times; ${m.screenH} px</span>
        </div>
        <div class="hud-row">
          <span class="hud-label">Scale DPR:</span>
          <span class="hud-val highlight">${m.dpr}x ${isTesla2026 ? '(Tesla 2026.26 ⚡)' : ''}</span>
        </div>
        <div class="hud-row">
          <span class="hud-label">Densità GUI:</span>
          <span class="hud-val highlight">${densityMode.toUpperCase()} (${isTesla2026 ? 'COMPATTO' : 'STANDARD'})</span>
        </div>
        <div class="hud-row">
          <span class="hud-label">Browser Client:</span>
          <span class="hud-val ${m.isTeslaBrowser ? 'tesla-detected' : ''}">
            ${m.isTeslaBrowser ? '🚘 Tesla QtCarBrowser' : '💻 Standard Browser'}
          </span>
        </div>
      </div>
    `;

    const closeBtn = document.getElementById('hud-close-btn');
    if (closeBtn) {
      closeBtn.onclick = () => setDebugHudEnabled(false);
    }
  }

  updateHudUI();

  window.addEventListener('resize', () => {
    logDiagnosticMetrics();
    if (isDebugHudEnabled()) updateHudUI();
  });
}

function syncDebugHudDOM(enabled) {
  const hudContainer = document.getElementById('debug-hud-overlay');
  if (hudContainer) {
    if (enabled) {
      initDebugHud();
    } else {
      hudContainer.style.display = 'none';
    }
  }
}
