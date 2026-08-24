/**
 * MAIN APPLICATION ORCHESTRATOR FOR TESLA PERSONAL BOARD v0.9.0
 * Supports real-time cross-browser profile server disk sync & URL PIN parameter.
 */

import { initThemeEngine, getThemeMode, setThemeMode } from './theme.js';
import { initDensityEngine } from './density.js';
import { updateDOMTranslations, t } from './i18n.js';
import { startLiveClock } from './clock.js';
import { fetchLiveWeather, initGeolocation } from './weather.js';
import { initDebugHud } from './debug.js';
import { 
  getGlobalOpenMode, 
  setGlobalOpenMode, 
  getAppSortMode,
  setAppSortMode,
  toggleEditMode
} from './catalog.js';
import { setCategoryFilter, setSearchQuery, renderCategoryPills, renderGrid } from './links.js';
import { 
  setRenderCallback, 
  openLinkModal, 
  closeLinkModal, 
  initUrlPrefixButtons,
  handleSaveLink, 
  openPresetsModal,
  closePresetsModal,
  openSettingsModal, 
  closeSettingsModal,
  handleExportConfig,
  handleImportConfig,
  handleResetToDefault
} from './modal.js';
import { getYouTubeRedirectUrl, showToast } from './utils.js';
import { 
  initProfileSystem, 
  refreshProfilesFromServer,
  getActivePin, 
  setActivePin, 
  updateProfileName,
  getProfilesMap, 
  deleteProfile 
} from './user-profiles.js';
import { initAuthSystem, lockBrowser } from './auth.js';
import {
  createIcons,
  Sun, Moon, Search, Plus, Tv, User, Settings, Layers,
  RotateCw, Maximize2, Pencil, ChevronDown, ArrowUpDown,
  ArrowDownAZ, ArrowUpZA, FolderTree, X, Star,
  Trash2, RotateCcw, Download, Upload, Database,
  Palette, Sliders, Info, Globe, Eye, EyeOff,
  CheckCircle, AlertCircle, Cloud, CloudSun, CloudFog,
  CloudDrizzle, CloudRain, Snowflake, CloudLightning,
  ArrowUp, ArrowDown, ChevronRight, SearchX, KeyRound, Lock
} from 'lucide';

const usedIcons = {
  Sun, Moon, Search, Plus, Tv, User, Settings, Layers,
  RotateCw, Maximize2, Pencil, ChevronDown, ArrowUpDown,
  ArrowDownAZ, ArrowUpZA, FolderTree, X, Star,
  Trash2, RotateCcw, Download, Upload, Database,
  Palette, Sliders, Info, Globe, Eye, EyeOff,
  CheckCircle, AlertCircle, Cloud, CloudSun, CloudFog,
  CloudDrizzle, CloudRain, Snowflake, CloudLightning,
  ArrowUp, ArrowDown, ChevronRight, SearchX, KeyRound, Lock
};

function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

document.addEventListener('DOMContentLoaded', async () => {
  // -2. Initialize Tesla 2026.26 Layout Density Compensator
  initDensityEngine();

  // -1. Initialize Master Authentication System & Tesla Lock Screen
  await initAuthSystem();

  // 0. Initialize Multi-User Profile PIN System with Server Disk Sync (Guaranteed Server Fetch First)
  await initProfileSystem();

  // 1. Initialize Diagnostic HUD Overlay
  initDebugHud();

  // 2. Initialize Theme System & i18n Translations
  initThemeEngine();
  updateDOMTranslations();

  // 3. Initialize Apple-Style Floating Theme Popover Menu
  initAppleThemePopover();

  // 4. Initialize Apple-Style Floating App Sort Popover Menu
  initAppleSortPopover();

  // 5. Initialize Live Clock & Date
  startLiveClock(({ timeString, dateString }) => {
    const timeEl = document.getElementById('clock-time');
    const dateEl = document.getElementById('clock-date');
    if (timeEl) timeEl.innerText = timeString;
    if (dateEl) dateEl.innerText = dateString;
  });

  // 6. Initialize Live Weather Widget
  updateWeatherWidget();
  initGeolocation(() => updateWeatherWidget());

  // 7. Register Render Callback for Modals
  setRenderCallback(() => {
    renderCategoryPills();
    renderGrid();
  });

  // 8. Initialize Touch Edit Mode Toggle & Search Overlay
  initEditModeToggle();
  initSearchModalOverlay();

  // 9. Initialize Hard Refresh & Launch Fullscreen Buttons
  initHeaderActionButtons();

  // 10. Initialize Multi-User PIN Profile Modal
  initPinProfileModal();

  // 11. Render Category Pills & Initial Grid
  renderCategoryPills();
  renderGrid();

  // 12. Global Mode Toggle Switcher ("ON" vs "OFF")
  initGlobalModeToggle();

  // 13. Modal Event Binds & URL Prefix Buttons
  initModalListeners();
  initUrlPrefixButtons();

  // 14. Lucide Icons render
  createIcons({ icons: usedIcons, root: document.getElementById('app') });
});

/**
 * UPDATES WEATHER WIDGET IN HEADER
 */
async function updateWeatherWidget() {
  const weatherData = await fetchLiveWeather();
  const tempEl = document.getElementById('weather-temp');
  const iconEl = document.getElementById('weather-icon');

  if (tempEl) tempEl.innerText = `${weatherData.temp}°C`;

  if (iconEl && weatherData.icon) {
    iconEl.setAttribute('data-lucide', weatherData.icon);
    createIcons({ icons: usedIcons, nameAttr: 'data-lucide', root: document.getElementById('weather-widget') });
  }
}

/**
 * INITIALIZES HARD REFRESH & LAUNCH FULLSCREEN BUTTONS
 */
function initHeaderActionButtons() {
  const refreshBtn = document.getElementById('header-refresh-btn');
  const launchFullscreenBtn = document.getElementById('header-launch-fullscreen-btn');

  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      window.location.href = window.location.pathname + '?refresh=' + Date.now();
    });
  }

  if (launchFullscreenBtn) {
    launchFullscreenBtn.addEventListener('click', () => {
      const fullUrl = getYouTubeRedirectUrl(window.location.href);
      window.location.href = fullUrl;
    });
  }
}

/**
 * INITIALIZES MULTI-USER PIN PROFILE MODAL & SWITCHER
 */
function initPinProfileModal() {
  const userProfileBtn = document.getElementById('header-user-profile-btn');
  const pinModal = document.getElementById('pin-profile-modal');
  const closeModalBtn = document.getElementById('pin-profile-modal-close');
  const doneModalBtn = document.getElementById('pin-profile-modal-done');
  const pinInput = document.getElementById('pin-input-field');
  const profileNameInput = document.getElementById('profile-name-input-field');
  const pinForm = document.getElementById('pin-profile-form');
  const switchPinBtn = document.getElementById('btn-switch-pin');
  const profilesList = document.getElementById('profiles-list-container');
  const pinBadgeText = document.getElementById('active-profile-pin-text');

  function syncActivePinBadge() {
    const activePin = getActivePin();
    if (pinBadgeText) pinBadgeText.innerText = activePin;
  }

  syncActivePinBadge();

  if (!userProfileBtn || !pinModal) return;

  function renderProfilesList() {
    if (!profilesList) return;
    const activePin = getActivePin();
    const map = getProfilesMap();
    const pins = Object.keys(map);

    profilesList.innerHTML = pins.map(pin => {
      const prof = map[pin];
      const isActive = pin === activePin;
      return `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: var(--bg-tertiary); border: 1px solid ${isActive ? 'var(--accent-primary)' : 'var(--glass-border)'}; border-radius: var(--radius-sm);">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-family: var(--font-mono); font-weight: 800; font-size: 1.15rem; color: ${isActive ? 'var(--accent-primary)' : '#ffffff'};">PIN ${pin}</span>
            <span style="font-size: 0.95rem; color: var(--text-secondary); font-weight: 700;">${prof.name || 'Utente ' + pin}</span>
          </div>
          <div style="display: flex; gap: 8px;">
            ${!isActive ? `<button type="button" class="btn btn-glass btn-switch-to-pin" data-pin="${pin}" style="padding: 4px 12px; font-size: 0.88rem; font-weight: 800;">Usa Questo</button>` : `<span style="font-size: 0.85rem; font-weight: 800; color: var(--accent-primary); padding: 4px 8px;">In Uso</span>`}
            ${pin !== '0000' && !isActive ? `<button type="button" class="btn btn-glass btn-del-pin" data-pin="${pin}" style="padding: 4px 10px; color: #ff4d4d; border-color: rgba(232,33,39,0.3);"><i data-lucide="trash-2"></i></button>` : ''}
          </div>
        </div>
      `;
    }).join('');

    createIcons({ icons: usedIcons, root: profilesList });

    profilesList.querySelectorAll('.btn-switch-to-pin').forEach(btn => {
      btn.addEventListener('click', () => {
        const pin = btn.getAttribute('data-pin');
        const mapData = getProfilesMap();
        const existingName = mapData[pin]?.name || '';
        setActivePin(pin, existingName);
        if (pinInput) pinInput.value = pin;
        if (profileNameInput) profileNameInput.value = existingName;
        syncActivePinBadge();
        renderProfilesList();
        renderCategoryPills();
        renderGrid();
        showToast(`Profilo PIN ${pin} attivato!`, 'success');
        pinModal.classList.remove('active');
      });
    });

    profilesList.querySelectorAll('.btn-del-pin').forEach(btn => {
      btn.addEventListener('click', () => {
        const pin = btn.getAttribute('data-pin');
        deleteProfile(pin);
        renderProfilesList();
        renderCategoryPills();
        renderGrid();
        showToast(`Profilo PIN ${pin} eliminato`, 'info');
      });
    });
  }

  userProfileBtn.addEventListener('click', async () => {
    await refreshProfilesFromServer();
    const activePin = getActivePin();
    const map = getProfilesMap();
    if (pinInput) pinInput.value = activePin;
    if (profileNameInput) profileNameInput.value = map[activePin]?.name || '';
    renderProfilesList();
    pinModal.classList.add('active');
  });

  if (closeModalBtn) closeModalBtn.addEventListener('click', () => pinModal.classList.remove('active'));
  if (doneModalBtn) doneModalBtn.addEventListener('click', () => pinModal.classList.remove('active'));

  function handleSaveProfile(e) {
    if (e) e.preventDefault();
    const pinVal = pinInput ? pinInput.value.trim() : '';
    const nameVal = profileNameInput ? profileNameInput.value.trim() : '';
    if (!pinVal) {
      showToast('Inserisci un PIN valido', 'error');
      return;
    }

    setActivePin(pinVal, nameVal);
    syncActivePinBadge();
    renderProfilesList();
    renderCategoryPills();
    renderGrid();
    showToast(`Profilo PIN ${pinVal} (${nameVal || 'Utente ' + pinVal}) salvato ed attivato!`, 'success');
    pinModal.classList.remove('active');
  }

  if (pinForm) pinForm.addEventListener('submit', handleSaveProfile);
  if (switchPinBtn) switchPinBtn.addEventListener('click', handleSaveProfile);
}

/**
 * INITIALIZES TOUCH EDIT MODE TOGGLE BUTTON (ICON-ONLY PENCIL)
 */
function initEditModeToggle() {
  const btn = document.getElementById('edit-mode-toggle-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const active = toggleEditMode();
    document.body.classList.toggle('edit-mode-active', active);
    btn.classList.toggle('active', active);
    renderGrid();
  });
}

/**
 * INITIALIZES APPLE-STYLE FLOATING THEME POPOVER MENU (ICON-ONLY TRIGGER)
 */
function initAppleThemePopover() {
  const trigger = document.getElementById('theme-popover-trigger');
  const menu = document.getElementById('theme-popover-menu');
  const iconBox = document.getElementById('theme-trigger-icon-box');
  if (!trigger || !menu) return;

  function syncTriggerUI() {
    const currentMode = getThemeMode();

    if (iconBox) {
      if (currentMode === 'light') {
        iconBox.innerHTML = `<i data-lucide="sun"></i>`;
      } else if (currentMode === 'dark') {
        iconBox.innerHTML = `<i data-lucide="moon"></i>`;
      } else {
        iconBox.innerHTML = `
          <svg class="diag-svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"></path>
            <path d="M12 2a10 10 0 1 0 10 10 0 0 1-10 10" fill="currentColor" opacity="0.35"></path>
            <line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" stroke-width="2"></line>
          </svg>
        `;
      }
      createIcons({ icons: usedIcons, root: iconBox });
    }

    menu.querySelectorAll('.popover-item').forEach(item => {
      if (item.getAttribute('data-theme-mode') === currentMode) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  syncTriggerUI();

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('active');
    const sortMenu = document.getElementById('sort-popover-menu');
    if (sortMenu) sortMenu.classList.remove('active');
  });

  menu.querySelectorAll('.popover-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const mode = item.getAttribute('data-theme-mode');
      setThemeMode(mode);
      syncTriggerUI();
      menu.classList.remove('active');
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#theme-popover-wrapper')) {
      menu.classList.remove('active');
    }
  });
}

/**
 * INITIALIZES APPLE-STYLE FLOATING SORT POPOVER MENU
 */
function initAppleSortPopover() {
  const trigger = document.getElementById('sort-popover-trigger');
  const menu = document.getElementById('sort-popover-menu');
  const textEl = document.getElementById('sort-trigger-text');
  if (!trigger || !menu) return;

  function syncSortTriggerUI() {
    const currentSort = getAppSortMode();
    if (textEl) {
      if (currentSort === 'title_az') textEl.innerText = t('sortAZ');
      else if (currentSort === 'title_za') textEl.innerText = t('sortZA');
      else textEl.innerText = `Ordina: ${t('sortCategory')}`;
    }

    menu.querySelectorAll('.popover-item').forEach(item => {
      if (item.getAttribute('data-sort-mode') === currentSort) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  syncSortTriggerUI();

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('active');
    const themeMenu = document.getElementById('theme-popover-menu');
    if (themeMenu) themeMenu.classList.remove('active');
  });

  menu.querySelectorAll('.popover-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const mode = item.getAttribute('data-sort-mode');
      setAppSortMode(mode);
      syncSortTriggerUI();
      menu.classList.remove('active');
      renderGrid();
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#sort-popover-wrapper')) {
      menu.classList.remove('active');
    }
  });
}

/**
 * INITIALIZES COMPACT FLOATING SPOTLIGHT SEARCH BOX (FORCES CLOSED STATE ON PAGE LOAD)
 */
function initSearchModalOverlay() {
  const searchTriggerBtn = document.getElementById('search-trigger-btn');
  const searchModal = document.getElementById('search-modal');
  const searchInput = document.getElementById('search-modal-input');
  const clearBtn = document.getElementById('btn-clear-search');

  if (!searchTriggerBtn || !searchModal || !searchInput) return;

  // STRICTLY FORCE SEARCH MODAL CLOSED ON PAGE LOAD
  searchModal.classList.remove('active');
  searchInput.value = '';
  setSearchQuery('');

  function syncSearchTriggerHighlight() {
    const val = searchInput.value.trim();
    if (val.length > 0) {
      searchTriggerBtn.classList.add('active');
    } else {
      searchTriggerBtn.classList.remove('active');
    }
  }

  syncSearchTriggerHighlight();

  function openSearchModal() {
    searchModal.classList.add('active');
    setTimeout(() => searchInput.focus(), 50);
  }

  function closeSearchModal() {
    searchModal.classList.remove('active');
    syncSearchTriggerHighlight();
  }

  searchTriggerBtn.addEventListener('click', openSearchModal);

  const debouncedRenderGrid = debounce(() => renderGrid(), 250);

  searchInput.addEventListener('input', (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    syncSearchTriggerHighlight();
    debouncedRenderGrid();

    if (clearBtn) {
      clearBtn.style.display = val.trim().length > 0 ? 'flex' : 'none';
    }
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      setSearchQuery('');
      syncSearchTriggerHighlight();
      clearBtn.style.display = 'none';
      renderGrid();
      searchInput.focus();
    });
  }

  searchModal.addEventListener('click', (e) => {
    if (e.target === searchModal || !e.target.closest('.search-floating-box')) {
      closeSearchModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === '/' && !searchModal.classList.contains('active') && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      openSearchModal();
    } else if (e.key === 'Escape' && searchModal.classList.contains('active')) {
      closeSearchModal();
    }
  });
}

/**
 * INITIALIZES GLOBAL OPEN MODE TOGGLE BUTTON (ICON + "ON" vs "OFF" ONLY)
 */
function initGlobalModeToggle() {
  const modeBtn = document.getElementById('global-mode-btn');
  const modeText = document.getElementById('mode-text');

  function syncModeUI(mode) {
    if (mode === 'fullscreen') {
      modeBtn.classList.add('is-fullscreen');
      if (modeText) modeText.innerText = 'ON';
    } else {
      modeBtn.classList.remove('is-fullscreen');
      if (modeText) modeText.innerText = 'OFF';
    }
    createIcons({ icons: usedIcons, root: modeBtn });
  }

  const currentMode = getGlobalOpenMode();
  syncModeUI(currentMode);

  modeBtn.addEventListener('click', () => {
    const active = getGlobalOpenMode();
    const newMode = (active === 'fullscreen') ? 'normal' : 'fullscreen';
    setGlobalOpenMode(newMode);
    syncModeUI(newMode);
    renderGrid();
  });
}

/**
 * INITIALIZES MODAL EVENT LISTENERS
 */
function initModalListeners() {
  // Add Link Modal
  const headerAddBtn = document.getElementById('header-add-btn');
  const linkModalClose = document.getElementById('link-modal-close');
  const linkModalCancel = document.getElementById('link-modal-cancel');
  const linkForm = document.getElementById('link-form');

  if (headerAddBtn) headerAddBtn.addEventListener('click', () => openLinkModal(null));
  if (linkModalClose) linkModalClose.addEventListener('click', closeLinkModal);
  if (linkModalCancel) linkModalCancel.addEventListener('click', closeLinkModal);
  if (linkForm) linkForm.addEventListener('submit', handleSaveLink);

  // Presets Manager Modal
  const headerPresetsBtn = document.getElementById('header-presets-btn');
  const presetsModalClose = document.getElementById('presets-modal-close');
  const presetsModalDone = document.getElementById('presets-modal-done');

  if (headerPresetsBtn) headerPresetsBtn.addEventListener('click', () => openPresetsModal(false));
  if (presetsModalClose) presetsModalClose.addEventListener('click', closePresetsModal);
  if (presetsModalDone) presetsModalDone.addEventListener('click', closePresetsModal);

  // Settings Modal
  const headerSettingsBtn = document.getElementById('header-settings-btn');
  const settingsModalClose = document.getElementById('settings-modal-close');
  const settingsModalDone = document.getElementById('settings-modal-done');
  const exportJsonBtn = document.getElementById('export-json-btn');
  const importJsonInput = document.getElementById('import-json-input');
  const lockBrowserBtn = document.getElementById('lock-browser-btn');
  const resetDefaultBtn = document.getElementById('reset-default-btn');

  if (headerSettingsBtn) headerSettingsBtn.addEventListener('click', openSettingsModal);
  if (settingsModalClose) settingsModalClose.addEventListener('click', closeSettingsModal);
  if (settingsModalDone) settingsModalDone.addEventListener('click', closeSettingsModal);
  if (exportJsonBtn) exportJsonBtn.addEventListener('click', handleExportConfig);
  if (importJsonInput) importJsonInput.addEventListener('change', handleImportConfig);
  if (lockBrowserBtn) lockBrowserBtn.addEventListener('click', () => {
    closeSettingsModal();
    lockBrowser();
  });
  if (resetDefaultBtn) resetDefaultBtn.addEventListener('click', handleResetToDefault);
}
