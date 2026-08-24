/**
 * MODAL MANAGEMENT & EVENT HANDLERS FOR TESLA PERSONAL BOARD v0.7.6
 * Supports Adding, Editing, Deleting, In-Page Confirm Modal, Presets Accordion & Full Multi-Profile Backup/Restore
 */

import { 
  addCatalogItem, 
  updateCatalogItem, 
  deleteCatalogItem, 
  PRESET_SERVICES, 
  getHiddenPresetIds, 
  togglePresetVisibility, 
  restorePresetOriginal,
  getCustomApps,
  getCustomCategories,
  addCustomCategory,
  getOrderedCategoryIds,
  saveCategoryOrder,
  resetCatalogToDefault,
  isFavoriteId,
  toggleFavoriteId,
  isCategoryVisible,
  toggleCategoryDashboardVisibility,
  hideAllInCategory,
  showAllInCategory
} from './catalog.js';
import { 
  getLayoutDensity, 
  setLayoutDensity,
  getDashboardZoom,
  setDashboardZoom,
  getServicesDefaultZoom,
  setServicesDefaultZoom,
  getAutoDprEnabled,
  setAutoDprEnabled
} from './density.js';
import { 
  getDarkThemePreset, 
  setDarkThemePreset, 
  getLightThemePreset, 
  setLightThemePreset, 
  DARK_THEMES, 
  LIGHT_THEMES,
  isAnimatedBgEnabled,
  setAnimatedBgEnabled
} from './theme.js';
import { isDebugHudEnabled, setDebugHudEnabled } from './debug.js';
import { getLogoUrl, exportConfigAsJson, showToast } from './utils.js';
import { setLanguage, getLanguage, LANGUAGES, t } from './i18n.js';
import {
  createIcons,
  ChevronDown, ChevronRight, Eye, EyeOff,
  ArrowUp, ArrowDown, Trash2, X, Tv, Info, Settings, Plus, Save, RotateCcw, RotateCw, ExternalLink, Globe
} from 'lucide';

const usedIcons = {
  ChevronDown, ChevronRight, Eye, EyeOff,
  ArrowUp, ArrowDown, Trash2, X, Tv, Info, Settings, Plus, Save, RotateCcw, RotateCw, ExternalLink, Globe
};

let editingAppId = null;
let editingAppIsSystem = false;
let renderGridCallback = null;
let openCategoryKeys = new Set(); // CLOSED BY DEFAULT

export function setRenderCallback(cb) {
  renderGridCallback = cb;
}

function generateId() {
  return 'app_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * SHOWS IN-PAGE WEB CONFIRMATION MODAL (NO BROWSER POPUPS)
 */
export function showConfirmModal(title, message, onConfirm) {
  const modal = document.getElementById('confirm-modal');
  const titleEl = document.getElementById('confirm-modal-title');
  const msgEl = document.getElementById('confirm-modal-message');
  const cancelBtn = document.getElementById('confirm-modal-cancel');
  const actionBtn = document.getElementById('confirm-modal-action');

  if (!modal || !actionBtn || !cancelBtn) {
    if (onConfirm) onConfirm();
    return;
  }

  if (titleEl) titleEl.innerText = title;
  if (msgEl) msgEl.innerText = message;

  const closeConfirm = () => {
    modal.classList.remove('active');
  };

  cancelBtn.onclick = () => {
    closeConfirm();
  };

  actionBtn.onclick = () => {
    closeConfirm();
    if (onConfirm) onConfirm();
  };

  modal.classList.add('active');
}

/**
 * OPENS ADD / EDIT LINK MODAL
 */
export function openLinkModal(app = null) {
  const modal = document.getElementById('link-modal');
  const form = document.getElementById('link-form');
  const modalTitle = document.getElementById('link-modal-title');
  const noticeBox = document.getElementById('preset-notice-box');
  const catSelect = document.getElementById('form-category');
  const deleteBtn = document.getElementById('link-modal-delete');
  const deleteText = document.getElementById('link-modal-delete-text');

  if (!modal || !form) return;

  populateCategoryDropdown();

  if (app) {
    editingAppId = app.id;
    editingAppIsSystem = !!app.isSystem;

    if (modalTitle) modalTitle.innerText = t('modalEditTitle');
    if (noticeBox) noticeBox.style.display = app.isSystem ? 'flex' : 'none';

    if (deleteBtn) {
      if (!app.isSystem) {
        deleteBtn.style.display = 'inline-flex';
        if (deleteText) {
          deleteText.innerText = app.parentPresetId ? 'Elimina Copia Personalizzata' : 'Elimina Link';
        }
      } else {
        deleteBtn.style.display = 'none';
      }
    }

    document.getElementById('form-title').value = app.title || '';
    document.getElementById('form-url').value = app.url || '';
    if (catSelect) catSelect.value = app.category || 'utilities';
    document.getElementById('form-custom-redirect').value = app.customFullscreenUrl || '';
    document.getElementById('form-logo-url').value = app.customLogoUrl || '';
    document.getElementById('form-wide-logo-url').value = app.wideLogoUrl || '';
    document.getElementById('form-icon').value = app.icon || '';
    document.getElementById('form-color').value = app.backgroundColor || '#1f2937';
    const scaleSelect = document.getElementById('form-scale');
    if (scaleSelect) scaleSelect.value = app.scale ? String(app.scale) : '1.0';
  } else {
    editingAppId = null;
    editingAppIsSystem = false;

    if (modalTitle) modalTitle.innerText = t('modalAddTitle');
    if (noticeBox) noticeBox.style.display = 'none';
    if (deleteBtn) deleteBtn.style.display = 'none';

    form.reset();
    document.getElementById('form-color').value = '#1f2937';
    const scaleSelect = document.getElementById('form-scale');
    if (scaleSelect) scaleSelect.value = '1.0';
  }

  modal.classList.add('active');
}

export function closeLinkModal() {
  const modal = document.getElementById('link-modal');
  if (modal) modal.classList.remove('active');
}

function populateCategoryDropdown() {
  const select = document.getElementById('form-category');
  if (!select) return;

  const defaultCats = [
    { id: 'smarthome', name: t('catSmarthome') },
    { id: 'social', name: t('catSocial') },
    { id: 'streaming', name: t('catStreaming') },
    { id: 'livetv', name: t('catLivetv') },
    { id: 'sports', name: t('catSports') },
    { id: 'auto', name: t('catAuto') },
    { id: 'utilities', name: t('catUtilities') },
    { id: 'games', name: t('catGames') },
    { id: 'vm18', name: t('catVm18') }
  ];

  const customCats = getCustomCategories();
  const allCats = [...defaultCats, ...customCats];

  select.innerHTML = allCats.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
}

export function initUrlPrefixButtons() {
  const btnHttps = document.getElementById('btn-prefix-https');
  const btnHttp = document.getElementById('btn-prefix-http');
  const urlInput = document.getElementById('form-url');
  const btnAddCat = document.getElementById('btn-add-custom-cat');
  const deleteBtn = document.getElementById('link-modal-delete');

  if (btnHttps && urlInput) {
    btnHttps.addEventListener('click', () => {
      let val = urlInput.value.trim();
      val = val.replace(/^https?:\/\//, '');
      urlInput.value = 'https://' + val;
      urlInput.focus();
    });
  }

  if (btnHttp && urlInput) {
    btnHttp.addEventListener('click', () => {
      let val = urlInput.value.trim();
      val = val.replace(/^https?:\/\//, '');
      urlInput.value = 'http://' + val;
      urlInput.focus();
    });
  }

  if (btnAddCat) {
    btnAddCat.addEventListener('click', () => {
      const catName = prompt('Inserisci il nome della nuova categoria:');
      if (catName && catName.trim() !== '') {
        const catId = 'cat_' + Date.now();
        addCustomCategory({ id: catId, name: catName.trim() });
        populateCategoryDropdown();
        const select = document.getElementById('form-category');
        if (select) select.value = catId;
        showToast(`Categoria "${catName.trim()}" creata!`, 'success');
      }
    });
  }

  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      if (!editingAppId) return;
      showConfirmModal(
        'Conferma Eliminazione',
        'Sei sicuro di voler eliminare questo link dalla tua dashboard?',
        () => {
          deleteCatalogItem(editingAppId);
          showToast('Link eliminato!', 'info');
          closeLinkModal();
          if (renderGridCallback) renderGridCallback();
        }
      );
    });
  }

  const swatches = document.querySelectorAll('.swatch-btn');
  const colorInput = document.getElementById('form-color');
  swatches.forEach(sw => {
    sw.addEventListener('click', () => {
      const color = sw.getAttribute('data-color');
      if (colorInput && color) colorInput.value = color === 'transparent' ? '#1f2937' : color;
    });
  });
}

/**
 * SAVES LINK FORM
 */
export function handleSaveLink(event) {
  event.preventDefault();
  const title = document.getElementById('form-title').value.trim();
  let url = document.getElementById('form-url').value.trim();
  const category = document.getElementById('form-category').value;
  const customFullscreenUrl = document.getElementById('form-custom-redirect').value.trim();
  const customLogoUrl = document.getElementById('form-logo-url').value.trim();
  const wideLogoUrl = document.getElementById('form-wide-logo-url').value.trim();
  const icon = document.getElementById('form-icon').value.trim() || 'globe';
  const bgColor = document.getElementById('form-color').value || '#1f2937';
  const scaleSelect = document.getElementById('form-scale');
  const scaleVal = scaleSelect ? parseFloat(scaleSelect.value) : 1.0;

  if (!title || !url) {
    showToast(t('modalErrorRequired'), 'error');
    return;
  }

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  const appData = {
    title,
    url,
    category,
    customFullscreenUrl,
    customLogoUrl,
    wideLogoUrl,
    icon,
    backgroundColor: bgColor,
    scale: isNaN(scaleVal) ? 1.0 : scaleVal
  };

  if (editingAppId) {
    updateCatalogItem(editingAppId, appData);
    showToast(t('toastUpdated') || 'Link aggiornato!', 'success');
  } else {
    addCatalogItem({
      ...appData,
      id: generateId(),
      isSystem: false
    });
    showToast(t('toastSaved') || 'Nuovo link aggiunto!', 'success');
  }

  closeLinkModal();
  if (renderGridCallback) renderGridCallback();
}

/**
 * PRESET SERVICES MANAGER MODAL (WITH ACCORDION & FAV STARS)
 */
export function openPresetsModal(autoExpandAll = false) {
  const modal = document.getElementById('presets-modal');
  if (!modal) return;

  if (autoExpandAll) {
    openCategoryKeys = new Set(['smarthome', 'social', 'streaming', 'livetv', 'sports', 'auto', 'utilities', 'games', 'vm18']);
  }

  renderPresetsAccordion();
  modal.classList.add('active');
}

export function closePresetsModal() {
  const modal = document.getElementById('presets-modal');
  if (modal) modal.classList.remove('active');
  if (renderGridCallback) renderGridCallback();
}

function renderPresetsAccordion() {
  const container = document.getElementById('presets-accordion-container');
  if (!container) return;

  const hiddenIds = getHiddenPresetIds();

  const CATEGORIES = [
    { id: 'smarthome', name: t('catSmarthome') },
    { id: 'social', name: t('catSocial') },
    { id: 'streaming', name: t('catStreaming') },
    { id: 'livetv', name: t('catLivetv') },
    { id: 'sports', name: t('catSports') },
    { id: 'auto', name: t('catAuto') },
    { id: 'utilities', name: t('catUtilities') },
    { id: 'games', name: t('catGames') },
    { id: 'vm18', name: t('catVm18') }
  ];

  container.innerHTML = CATEGORIES.map(cat => {
    const services = PRESET_SERVICES.filter(s => s.category === cat.id);
    if (services.length === 0) return '';

    const isOpen = openCategoryKeys.has(cat.id);

    return `
      <div class="preset-accordion-item">
        <div class="preset-accordion-header" data-cat-id="${cat.id}">
          <div style="display: flex; align-items: center; gap: 10px;">
            <i data-lucide="${isOpen ? 'chevron-down' : 'chevron-right'}"></i>
            <span>${cat.name} (${services.length})</span>
          </div>

          <div class="cat-header-actions" onclick="event.stopPropagation()">
            <button type="button" class="cat-batch-btn btn-show-all" data-cat-id="${cat.id}">Attiva Tutti</button>
            <button type="button" class="cat-batch-btn btn-hide-all" data-cat-id="${cat.id}">Disattiva Tutti</button>
          </div>
        </div>

        ${isOpen ? `
          <div class="preset-accordion-body">
            ${services.map(s => {
              const isHidden = hiddenIds.includes(s.id);
              const logo = getLogoUrl(s);
              const isFav = isFavoriteId(s.id);

              return `
                <div class="preset-item-row">
                  <div class="preset-item-info">
                    <button type="button" class="btn-fav-star ${isFav ? 'is-fav' : ''}" data-fav-id="${s.id}" title="Aggiungi ai Preferiti">★</button>

                    <div class="preset-item-icon">
                      ${logo ? `<img src="${logo}" class="preset-item-img" alt="${s.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" /><i data-lucide="${s.icon || 'tv'}" style="display:none;"></i>` : `<i data-lucide="${s.icon || 'tv'}"></i>`}
                    </div>

                    <div>
                      <div class="preset-item-title">${s.title}</div>
                      <div style="font-size: 0.76rem; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px;">${s.url}</div>
                    </div>
                  </div>

                  <div class="preset-actions">
                    <button type="button" class="cat-vis-toggle-btn ${isHidden ? 'is-hidden' : ''}" data-toggle-preset-id="${s.id}">
                      <i data-lucide="${isHidden ? 'eye-off' : 'eye'}"></i>
                      <span>${isHidden ? 'Nascosto' : 'Attivo'}</span>
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }).join('');

  createIcons({ icons: usedIcons, root: container });

  container.querySelectorAll('.preset-accordion-header').forEach(hdr => {
    hdr.addEventListener('click', () => {
      const catId = hdr.getAttribute('data-cat-id');
      if (openCategoryKeys.has(catId)) {
        openCategoryKeys.delete(catId);
      } else {
        openCategoryKeys.add(catId);
      }
      renderPresetsAccordion();
    });
  });

  container.querySelectorAll('.btn-show-all').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const catId = btn.getAttribute('data-cat-id');
      showAllInCategory(catId);
      renderPresetsAccordion();
      if (renderGridCallback) renderGridCallback();
    });
  });

  container.querySelectorAll('.btn-hide-all').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const catId = btn.getAttribute('data-cat-id');
      hideAllInCategory(catId);
      renderPresetsAccordion();
      if (renderGridCallback) renderGridCallback();
    });
  });

  container.querySelectorAll('.btn-fav-star').forEach(star => {
    star.addEventListener('click', (e) => {
      e.stopPropagation();
      const favId = star.getAttribute('data-fav-id');
      toggleFavoriteId(favId);
      renderPresetsAccordion();
      if (renderGridCallback) renderGridCallback();
    });
  });

  container.querySelectorAll('[data-toggle-preset-id]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const presetId = btn.getAttribute('data-toggle-preset-id');
      togglePresetVisibility(presetId);
      renderPresetsAccordion();
      if (renderGridCallback) renderGridCallback();
    });
  });
}

/**
 * SETTINGS MODAL
 */
export function openSettingsModal() {
  const modal = document.getElementById('settings-modal');
  if (!modal) return;

  populateLanguageDropdown();
  populateThemeDropdowns();
  populateSettingsCheckboxes();
  renderCategoryOrderList();
  initSettingsAccordions();

  modal.classList.add('active');
}

function initSettingsAccordions() {
  const modal = document.getElementById('settings-modal');
  if (!modal) return;
  modal.querySelectorAll('.settings-accordion-header').forEach(header => {
    header.onclick = () => {
      const card = header.closest('.settings-accordion-card');
      if (!card) return;
      const isAlreadyActive = card.classList.contains('active');
      modal.querySelectorAll('.settings-accordion-card').forEach(c => c.classList.remove('active'));
      if (!isAlreadyActive) {
        card.classList.add('active');
      }
    };
  });
}

let topbarTimer = null;

export function openServiceViewer(appData, targetUrl) {
  const modal = document.getElementById('service-viewer-modal');
  const iframe = document.getElementById('service-viewer-iframe');
  const topbar = document.getElementById('service-viewer-topbar');
  const handle = document.getElementById('service-topbar-handle');
  const titleEl = document.getElementById('service-topbar-title');
  const iconBox = document.getElementById('service-topbar-icon-box');
  const zoomSlider = document.getElementById('service-live-zoom-slider');
  const zoomVal = document.getElementById('service-live-zoom-val');
  const refreshBtn = document.getElementById('service-refresh-btn');
  const newtabBtn = document.getElementById('service-newtab-btn');
  const hideBtn = document.getElementById('service-hide-topbar-btn');
  const closeBtn = document.getElementById('service-close-btn');

  if (!modal || !iframe) {
    if (targetUrl) window.open(targetUrl, '_blank');
    return;
  }

  const appTitle = appData ? (appData.title || 'Servizio') : 'Servizio';
  if (titleEl) titleEl.innerText = appTitle;

  // App Logo/Icon
  if (iconBox) {
    if (appData && appData.icon) {
      iconBox.innerHTML = `<i data-lucide="${appData.icon}"></i>`;
      createIcons({ icons: usedIcons, root: iconBox });
    } else {
      iconBox.innerHTML = `<i data-lucide="globe"></i>`;
      createIcons({ icons: usedIcons, root: iconBox });
    }
  }

  // Zoom logic
  const defaultZoom = getServicesDefaultZoom();
  const serviceZoom = (appData && appData.scale) ? Math.round(appData.scale * 100) : defaultZoom;
  
  const applyIframeZoom = (val) => {
    if (!iframe) return;
    const factor = val / 100;
    iframe.style.transform = `scale(${factor})`;
    iframe.style.width = `${(100 / factor).toFixed(2)}%`;
    iframe.style.height = `${(100 / factor).toFixed(2)}%`;
    if (zoomVal) zoomVal.innerText = `${val}%`;
  };

  if (zoomSlider) {
    zoomSlider.value = serviceZoom;
    applyIframeZoom(serviceZoom);
    zoomSlider.oninput = (e) => {
      applyIframeZoom(parseInt(e.target.value, 10));
    };
  } else {
    applyIframeZoom(serviceZoom);
  }

  // Set iframe source
  iframe.src = targetUrl;

  // Auto-hide topbar logic (1.5 SECONDS)
  const showTopbar = () => {
    if (topbar) topbar.classList.remove('is-hidden');
    if (topbarTimer) clearTimeout(topbarTimer);
    topbarTimer = setTimeout(() => {
      if (topbar) topbar.classList.add('is-hidden');
    }, 1500);
  };

  showTopbar();

  if (handle) {
    handle.onclick = () => showTopbar();
  }

  // Hover or touch near top edge
  modal.onmousemove = (e) => {
    if (e.clientY <= 50) showTopbar();
  };
  modal.ontouchstart = (e) => {
    if (e.touches && e.touches[0] && e.touches[0].clientY <= 60) showTopbar();
  };

  if (refreshBtn) {
    refreshBtn.onclick = () => {
      iframe.src = targetUrl;
      showToast('Ricarica servizio in corso...', 'info');
    };
  }

  if (newtabBtn) {
    newtabBtn.onclick = () => {
      window.open(targetUrl, '_blank');
    };
  }

  if (hideBtn) {
    hideBtn.onclick = () => {
      if (topbar) topbar.classList.add('is-hidden');
      if (topbarTimer) clearTimeout(topbarTimer);
    };
  }

  if (closeBtn) {
    closeBtn.onclick = () => {
      modal.classList.remove('active');
      iframe.src = 'about:blank';
      if (topbarTimer) clearTimeout(topbarTimer);
    };
  }

  createIcons({ icons: usedIcons, root: modal });
  modal.classList.add('active');
}

export function closeSettingsModal() {
  const modal = document.getElementById('settings-modal');
  if (modal) modal.classList.remove('active');
  if (renderGridCallback) renderGridCallback();
}

function populateLanguageDropdown() {
  const select = document.getElementById('language-select');
  if (!select) return;

  const currentLang = getLanguage();
  select.innerHTML = LANGUAGES.map(l => 
    `<option value="${l.code}" ${l.code === currentLang ? 'selected' : ''}>${l.name}</option>`
  ).join('');

  select.onchange = (e) => {
    setLanguage(e.target.value);
    updateDOMTranslations();
    if (renderGridCallback) renderGridCallback();
  };
}

function populateThemeDropdowns() {
  const darkSelect = document.getElementById('dark-theme-select');
  const lightSelect = document.getElementById('light-theme-select');

  if (darkSelect) {
    const curDark = getDarkThemePreset();
    darkSelect.innerHTML = DARK_THEMES.map(t => 
      `<option value="${t.id}" ${t.id === curDark ? 'selected' : ''}>${t.name}</option>`
    ).join('');
    darkSelect.onchange = (e) => {
      setDarkThemePreset(e.target.value);
      if (renderGridCallback) renderGridCallback();
    };
  }

  if (lightSelect) {
    const curLight = getLightThemePreset();
    lightSelect.innerHTML = LIGHT_THEMES.map(t => 
      `<option value="${t.id}" ${t.id === curLight ? 'selected' : ''}>${t.name}</option>`
    ).join('');
    lightSelect.onchange = (e) => {
      setLightThemePreset(e.target.value);
      if (renderGridCallback) renderGridCallback();
    };
  }
}

function populateSettingsCheckboxes() {
  const bgCheckbox = document.getElementById('toggle-animated-bg-checkbox');
  const debugCheckbox = document.getElementById('toggle-debug-hud-checkbox');
  const dashSlider = document.getElementById('dashboard-zoom-slider');
  const dashVal = document.getElementById('dashboard-zoom-val');
  const servSlider = document.getElementById('services-zoom-slider');
  const servVal = document.getElementById('services-zoom-val');
  const autoDprCheckbox = document.getElementById('toggle-auto-dpr-checkbox');

  if (bgCheckbox) {
    bgCheckbox.checked = isAnimatedBgEnabled();
    bgCheckbox.onchange = (e) => setAnimatedBgEnabled(e.target.checked);
  }

  if (debugCheckbox) {
    debugCheckbox.checked = isDebugHudEnabled();
    debugCheckbox.onchange = (e) => setDebugHudEnabled(e.target.checked);
  }

  if (dashSlider) {
    const curZoom = getDashboardZoom();
    dashSlider.value = curZoom;
    if (dashVal) dashVal.innerText = `${curZoom}%`;
    dashSlider.oninput = (e) => {
      const val = setDashboardZoom(e.target.value);
      if (dashVal) dashVal.innerText = `${val}%`;
      if (renderGridCallback) renderGridCallback();
    };
  }

  if (servSlider) {
    const curServZoom = getServicesDefaultZoom();
    servSlider.value = curServZoom;
    if (servVal) servVal.innerText = `${curServZoom}%`;
    servSlider.oninput = (e) => {
      const val = setServicesDefaultZoom(e.target.value);
      if (servVal) servVal.innerText = `${val}%`;
    };
  }

  if (autoDprCheckbox) {
    autoDprCheckbox.checked = getAutoDprEnabled();
    autoDprCheckbox.onchange = (e) => {
      setAutoDprEnabled(e.target.checked);
      if (renderGridCallback) renderGridCallback();
    };
  }
}

function renderCategoryOrderList() {
  const container = document.getElementById('category-order-list');
  if (!container) return;

  const orderedIds = getOrderedCategoryIds();
  const customCats = getCustomCategories();

  const BUILTIN_NAMES = {
    favorites: '★ Preferiti',
    smarthome: 'Home & Smart Home',
    social: 'Social & Media',
    streaming: 'Streaming & Intrattenimento',
    livetv: 'Live TV',
    sports: 'Sport & Fitness',
    auto: 'Auto, Mappe & Viaggi',
    utilities: 'Utility & Strumenti',
    games: 'Giochi & Svago',
    vm18: 'VM18'
  };

  container.innerHTML = orderedIds.map((id, index) => {
    let label = BUILTIN_NAMES[id];
    if (!label) {
      const custom = customCats.find(c => c.id === id);
      label = custom ? custom.name : id.toUpperCase();
    }
    const isVisible = isCategoryVisible(id);

    return `
      <div class="cat-order-item" data-id="${id}">
        <span>${label}</span>
        <div style="display: flex; align-items: center; gap: 8px;">
          <button type="button" class="cat-vis-toggle-btn ${!isVisible ? 'is-hidden' : ''}" data-cat-id="${id}" title="Mostra/Nascondi categoria nella dashboard GUI">
            <i data-lucide="${isVisible ? 'eye' : 'eye-off'}"></i>
            <span>${isVisible ? 'Visibile' : 'Nascosta'}</span>
          </button>

          ${index > 0 ? `<button type="button" class="cat-move-btn move-up-btn" data-index="${index}"><i data-lucide="arrow-up"></i></button>` : ''}
          ${index < orderedIds.length - 1 ? `<button type="button" class="cat-move-btn move-down-btn" data-index="${index}"><i data-lucide="arrow-down"></i></button>` : ''}
        </div>
      </div>
    `;
  }).join('');

  createIcons({ icons: usedIcons, root: container });

  container.querySelectorAll('.cat-vis-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const catId = btn.getAttribute('data-cat-id');
      toggleCategoryDashboardVisibility(catId);
      renderCategoryOrderList();
      if (renderGridCallback) renderGridCallback();
    });
  });

  container.querySelectorAll('.move-up-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      const newOrder = [...orderedIds];
      const temp = newOrder[idx];
      newOrder[idx] = newOrder[idx - 1];
      newOrder[idx - 1] = temp;
      saveCategoryOrder(newOrder);
      renderCategoryOrderList();
      if (renderGridCallback) renderGridCallback();
    });
  });

  container.querySelectorAll('.move-down-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      const newOrder = [...orderedIds];
      const temp = newOrder[idx];
      newOrder[idx] = newOrder[idx + 1];
      newOrder[idx + 1] = temp;
      saveCategoryOrder(newOrder);
      renderCategoryOrderList();
      if (renderGridCallback) renderGridCallback();
    });
  });
}

/**
 * EXPORT / IMPORT / RESET (FULL MULTI-PROFILE BACKUP AND RESTORE)
 */
export function handleExportConfig() {
  const fullBackup = {
    version: '0.9.0',
    exportDate: new Date().toISOString(),
    profiles: JSON.parse(localStorage.getItem('tesla_board_user_profiles') || '{}'),
    activePin: localStorage.getItem('tesla_board_active_pin') || '0000',
    customCategories: JSON.parse(localStorage.getItem('tesla_board_custom_categories') || '[]'),
    categoryOrder: JSON.parse(localStorage.getItem('tesla_board_category_order') || '[]'),
    darkTheme: localStorage.getItem('tesla_board_theme_preset_dark') || 'tesla-dark',
    lightTheme: localStorage.getItem('tesla_board_theme_preset_light') || 'tesla-light',
    themeMode: localStorage.getItem('tesla_board_theme_mode') || 'auto'
  };

  const jsonStr = JSON.stringify(fullBackup, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `tesla-board-all-profiles-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Tutti i profili esportati con successo!', 'success');
}

export function handleImportConfig(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target.result);
      if (data.profiles) {
        localStorage.setItem('tesla_board_user_profiles', JSON.stringify(data.profiles));
        if (data.activePin) localStorage.setItem('tesla_board_active_pin', data.activePin);
        if (data.customCategories) localStorage.setItem('tesla_board_custom_categories', JSON.stringify(data.customCategories));
        if (data.categoryOrder) localStorage.setItem('tesla_board_category_order', JSON.stringify(data.categoryOrder));
        if (data.darkTheme) localStorage.setItem('tesla_board_theme_preset_dark', data.darkTheme);
        if (data.lightTheme) localStorage.setItem('tesla_board_theme_preset_light', data.lightTheme);
        if (data.themeMode) localStorage.setItem('tesla_board_theme_mode', data.themeMode);
        
        showToast('Tutti i profili e le impostazioni sono stati ripristinati!', 'success');
        setTimeout(() => window.location.reload(), 800);
      } else if (data.catalog && Array.isArray(data.catalog)) {
        showToast('Catalogo importato!', 'success');
        if (renderGridCallback) renderGridCallback();
      }
    } catch (err) {
      showToast('File JSON non valido.', 'error');
    }
  };
  reader.readAsText(file);
}

export function handleResetToDefault() {
  showConfirmModal(
    'Ripristina Catalogo Iniziale',
    'Ripristinare il catalogo iniziale alle impostazioni di fabbrica?',
    () => {
      resetCatalogToDefault();
      showToast('Catalogo ripristinato!', 'info');
      closeSettingsModal();
      if (renderGridCallback) renderGridCallback();
    }
  );
}
