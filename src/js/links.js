/**
 * GRID RENDERING & LINK INTERACTION MODULE FOR TESLA PERSONAL BOARD v0.6.2
 * Unified Single iOS App Icons View, Dynamic Empty-Category Hiding & Re-Sorting Engine
 */

import { 
  getCatalog, 
  getGlobalOpenMode, 
  deleteCatalogItem, 
  getCustomCategories,
  getOrderedCategoryIds,
  getAppSortMode,
  isEditModeActive,
  isFavoriteId,
  isCategoryVisible
} from './catalog.js';
import { getYouTubeRedirectUrl, getLogoUrl, showToast } from './utils.js';
import { isEffectiveThemeLight } from './theme.js';
import { openLinkModal, showConfirmModal } from './modal.js';
import { t, updateDOMTranslations } from './i18n.js';
import { createIcons, Star, Search, SearchX, Plus, Globe, X } from 'lucide';

const usedIcons = { Star, Search, SearchX, Plus, Globe, X };

let currentCategoryFilter = 'all';
let currentSearchQuery = '';

const _failedLogoCache = new Set();

if (typeof window !== 'undefined') {
  document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG' && e.target.classList.contains('app-squircle-img')) {
      _failedLogoCache.add(e.target.src);
    }
  }, true);
}

const CATEGORY_NAMES = {
  favorites: '★ Preferiti',
  smarthome: 'Home & Smart Home',
  social: 'Social & Media',
  streaming: 'Streaming & Intrattenimento',
  livetv: 'Live TV',
  sports: 'Sport',
  auto: 'Auto & Mappe',
  utilities: 'Utility & IA',
  games: 'Giochi & Svago',
  vm18: 'VM18'
};

function getCategoryDisplayName(catKey) {
  if (!catKey || typeof catKey !== 'string') return 'Senza Categoria';
  if (catKey === 'all') return t('catAll') || 'Tutti i Link';
  if (catKey === 'favorites') return t('catFavorites') || '★ Preferiti';
  if (catKey === 'livetv') return t('catLivetv') || 'Live TV';
  if (catKey === 'vm18') return t('catVm18') || 'VM18';

  const i18nKey = 'cat' + catKey.charAt(0).toUpperCase() + catKey.slice(1);
  const translated = t(i18nKey);
  if (translated && translated !== i18nKey) return translated;

  const customCats = getCustomCategories();
  const custom = Array.isArray(customCats) ? customCats.find(c => c && c.id === catKey) : null;
  if (custom && custom.name) return custom.name;

  return CATEGORY_NAMES[catKey] || catKey.toUpperCase();
}

export function setCategoryFilter(cat) {
  currentCategoryFilter = cat;
}

export function setSearchQuery(query) {
  currentSearchQuery = query.toLowerCase().trim();
}

/**
 * RENDERS DYNAMIC CATEGORY PILLS NEXT TO SORT SELECTOR IN STREAMLINED TOOLBAR
 * Hides empty categories (categories with 0 active items)
 */
export function renderCategoryPills() {
  const nav = document.getElementById('category-pills');
  if (!nav) return;

  const catalog = getCatalog();
  const orderedCatIds = getOrderedCategoryIds();

  const visibleCatIds = orderedCatIds.filter(id => {
    if (!isCategoryVisible(id)) return false;

    if (id === 'favorites') {
      return catalog.some(item => isFavoriteId(item.id) || (item.parentPresetId && isFavoriteId(item.parentPresetId)));
    }

    return catalog.some(item => item.category === id);
  });

  const pillsList = ['all', ...visibleCatIds];

  if (!pillsList.includes(currentCategoryFilter)) {
    currentCategoryFilter = 'all';
  }

  nav.innerHTML = pillsList.map(catId => {
    const isActive = (currentCategoryFilter === catId);
    const label = getCategoryDisplayName(catId);
    const icon = catId === 'favorites' ? '<i data-lucide="star" style="font-size:0.85rem; color:#ffcc00;"></i>' : '';

    return `
      <button class="pill-btn ${isActive ? 'active' : ''}" data-category="${catId}">
        ${icon}
        <span>${escapeHtml(label)}</span>
      </button>
    `;
  }).join('');

  createIcons({ icons: usedIcons, nameAttr: 'data-lucide', root: nav });

  nav.querySelectorAll('.pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-category');
      setCategoryFilter(cat);
      renderCategoryPills();
      renderGrid();
    });
  });
}

/**
 * MAIN RENDERER (UNIFIED SINGLE APP ICONS GRID & RE-SORTING)
 */
export function renderGrid() {
  const container = document.getElementById('cards-grid');
  if (!container) return;

  const catalog = getCatalog();
  const globalMode = getGlobalOpenMode();
  const sortMode = getAppSortMode();
  const isLight = isEffectiveThemeLight();

  // Sync Sort Popover Button Label
  const sortTextEl = document.getElementById('sort-trigger-text');
  if (sortTextEl) {
    if (sortMode === 'title_az') sortTextEl.innerText = t('sortAZ');
    else if (sortMode === 'title_za') sortTextEl.innerText = t('sortZA');
    else sortTextEl.innerText = `Ordina: ${t('sortCategory')}`;
  }

  // Sync active item state in sort popover dropdown
  const sortMenu = document.getElementById('sort-popover-menu');
  if (sortMenu) {
    sortMenu.querySelectorAll('.popover-item').forEach(item => {
      if (item.getAttribute('data-sort-mode') === sortMode) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  // Filter items by Category / Favorites / Search
  let filtered = catalog.filter(item => {
    let matchesCategory = false;

    if (currentCategoryFilter === 'all') {
      matchesCategory = true;
    } else if (currentCategoryFilter === 'favorites') {
      matchesCategory = isFavoriteId(item.id) || (item.parentPresetId && isFavoriteId(item.parentPresetId));
    } else {
      matchesCategory = (item.category === currentCategoryFilter);
    }

    const matchesSearch = !currentSearchQuery || 
      item.title.toLowerCase().includes(currentSearchQuery) ||
      item.url.toLowerCase().includes(currentSearchQuery);

    return matchesCategory && matchesSearch;
  });

  // Sort items if alphabetical
  if (sortMode === 'title_az') {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortMode === 'title_za') {
    filtered.sort((a, b) => b.title.localeCompare(a.title));
  }

  if (filtered.length === 0) {
    container.className = 'cards-grid';
    container.innerHTML = `
      <div class="empty-state">
        <i data-lucide="search-x" class="empty-state-icon"></i>
        <h3>Nessun risultato trovato</h3>
        <p>Nessun link corrisponde ai criteri di ricerca o alla categoria selezionata.</p>
        <button class="btn btn-primary" id="empty-add-btn">
          <i data-lucide="plus"></i> <span data-i18n="btnNewLink">Aggiungi Nuovo Link</span>
        </button>
      </div>
    `;
    
    const emptyAddBtn = document.getElementById('empty-add-btn');
    if (emptyAddBtn) {
      emptyAddBtn.addEventListener('click', () => openLinkModal(null));
    }
    updateDOMTranslations();
    createIcons({ icons: usedIcons, nameAttr: 'data-lucide', root: container });
    return;
  }

  renderAppIconsView(container, filtered, globalMode, catalog, sortMode, isLight);

  updateDOMTranslations();
  createIcons({ icons: usedIcons, nameAttr: 'data-lucide', root: container });
}

/**
 * APP ICONS VIEW (UNIFIED DISPLAY WITH iOS TOUCH PHYSICS)
 */
function renderAppIconsView(container, items, globalMode, fullCatalog, sortMode, isLight) {
  container.className = 'icons-view-container';

  let categoriesToRender = [];
  if (sortMode === 'category' && currentCategoryFilter === 'all') {
    const orderedCatIds = getOrderedCategoryIds();
    const grouped = {};

    items.forEach(item => {
      const cat = item.category || 'utilities';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(item);
    });

    const favItems = items.filter(item => isFavoriteId(item.id) || (item.parentPresetId && isFavoriteId(item.parentPresetId)));
    if (favItems.length > 0) {
      grouped['favorites'] = favItems;
    }

    orderedCatIds.forEach(catKey => {
      if (grouped[catKey] && grouped[catKey].length > 0 && isCategoryVisible(catKey)) {
        categoriesToRender.push({
          key: catKey,
          title: getCategoryDisplayName(catKey),
          items: grouped[catKey]
        });
      }
    });

    Object.keys(grouped).forEach(catKey => {
      if (!orderedCatIds.includes(catKey) && isCategoryVisible(catKey)) {
        categoriesToRender.push({
          key: catKey,
          title: getCategoryDisplayName(catKey),
          items: grouped[catKey]
        });
      }
    });
  } else {
    let sectionTitle = getCategoryDisplayName(currentCategoryFilter);
    if (sortMode === 'title_az') sectionTitle += ' (A - Z)';
    if (sortMode === 'title_za') sectionTitle += ' (Z - A)';

    categoriesToRender = [{
      key: currentCategoryFilter,
      title: sectionTitle,
      items: items
    }];
  }

  container.innerHTML = categoriesToRender.map(group => `
    <div class="icons-category-group">
      <h2 class="icons-category-title">${escapeHtml(group.title)}</h2>
      <div class="icons-row-grid">
        ${group.items.map(app => {
          const normalUrl = app.url;
          const fullscreenUrl = getYouTubeRedirectUrl(app.url, app.customFullscreenUrl);
          const isPrimaryFullscreen = (globalMode === 'fullscreen');
          const primaryUrl = isPrimaryFullscreen ? fullscreenUrl : normalUrl;

          const pngLogoUrl = getLogoUrl(app, isLight, 'png');
          const altPngUrl = getLogoUrl(app, !isLight, 'png');
          const svgLogoUrl = getLogoUrl(app, isLight, 'svg');
          const hasLucideIcon = !!app.icon;
          const bgStyle = (app.bgColor && app.bgColor !== 'transparent') ? app.bgColor : 'rgba(255, 255, 255, 0.06)';

          return `
            <div class="app-squircle-tile" data-id="${app.id}">
              <!-- TOP-LEFT RED DELETE BADGE (EDIT MODE) -->
              <button class="edit-delete-badge" data-id="${app.id}" title="Elimina / Nascondi link">
                <i data-lucide="x"></i>
              </button>

              <div class="app-squircle-box" style="background: ${bgStyle};" data-primary-url="${primaryUrl}">
                ${pngLogoUrl && !_failedLogoCache.has(pngLogoUrl) ? `<img src="${pngLogoUrl}" class="app-squircle-img" alt="${app.title}" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';" />` : ''}
                <div class="app-squircle-icon" style="${pngLogoUrl ? 'display:none;' : ''}">
                  <i data-lucide="${hasLucideIcon ? app.icon : 'globe'}"></i>
                </div>
              </div>
              <div class="app-squircle-label" data-primary-url="${primaryUrl}">${escapeHtml(app.title)}</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `).join('');

  bindTileEvents(container, fullCatalog);
}

function bindTileEvents(container, fullCatalog) {
  container.querySelectorAll('.app-squircle-tile').forEach(tile => {
    const id = tile.getAttribute('data-id');
    const appData = fullCatalog.find(item => item.id === id);
    const box = tile.querySelector('.app-squircle-box');
    const label = tile.querySelector('.app-squircle-label');
    const deleteBadge = tile.querySelector('.edit-delete-badge');

    let touchTimer = null;
    let isLongPress = false;

    // IN-PAGE WEB CONFIRM MODAL ON RED BADGE CLICK
    if (deleteBadge && appData) {
      const executeDelete = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        
        const itemTitle = appData.title || 'questo link';
        showConfirmModal(
          'Conferma Rimozione',
          `Vuoi davvero rimuovere "${itemTitle}" dalla dashboard?`,
          () => {
            deleteCatalogItem(appData.id);
            showToast(t('toastLinkDeleted'), 'info');
            renderCategoryPills();
            renderGrid();
          }
        );
      };

      deleteBadge.addEventListener('click', executeDelete);
    }

    const handlePrimaryClick = (e) => {
      e.stopPropagation();
      if (isLongPress) {
        isLongPress = false;
        return;
      }

      if (isEditModeActive() && appData) {
        openLinkModal(appData);
        return;
      }

      const targetUrl = box.getAttribute('data-primary-url');
      if (targetUrl) window.open(targetUrl, '_blank');
    };

    let touchStartX = 0;
    let touchStartY = 0;
    const TOUCH_SLOP = 15;

    tile.addEventListener('touchstart', (e) => {
      if (e.target.closest('.edit-delete-badge')) return;
      isLongPress = false;
      const touch = e.touches[0];
      if (!touch) return;
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      touchTimer = setTimeout(() => {
        isLongPress = true;
        if (appData) {
          if (navigator.vibrate) navigator.vibrate(40);
          openLinkModal(appData);
        }
      }, 500);
    }, { passive: true });

    tile.addEventListener('touchend', () => clearTimeout(touchTimer));
    tile.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      if (!touch) return;
      const dx = Math.abs(touch.clientX - touchStartX);
      const dy = Math.abs(touch.clientY - touchStartY);
      if (dx > TOUCH_SLOP || dy > TOUCH_SLOP) {
        clearTimeout(touchTimer);
      }
    }, { passive: true });

    box.addEventListener('click', handlePrimaryClick);
    label.addEventListener('click', handlePrimaryClick);

    tile.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      if (appData) openLinkModal(appData);
    });
  });
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
