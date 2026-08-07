/**
 * CATALOG ORCHESTRATION MODULE FOR TESLA PERSONAL BOARD v0.6.1
 * Combines System Presets Catalog with User Catalog, Favorites & Category Visibility
 */

import { DEFAULT_CATALOG } from '../data/default-catalog.js';
import { 
  getUserCatalog, 
  addUserLink, 
  updateUserLink, 
  deleteUserLink, 
  getHiddenPresetIds, 
  hideSystemPresetId,
  unhideSystemPresetId,
  toggleSystemPresetVisibility, 
  restoreOriginalPreset,
  getFavoriteIds,
  isFavoriteId,
  toggleFavoriteId,
  getHiddenCategoryIds,
  isCategoryVisible,
  toggleCategoryDashboardVisibility,
  clearUserCatalog 
} from './user-catalog.js';

export { 
  getHiddenPresetIds,
  getFavoriteIds,
  isFavoriteId,
  toggleFavoriteId,
  getHiddenCategoryIds,
  isCategoryVisible,
  toggleCategoryDashboardVisibility
};

const STORAGE_KEY_GLOBAL_MODE = 'tesla_board_global_mode'; // 'fullscreen' | 'normal'
const STORAGE_KEY_CUSTOM_CATEGORIES = 'tesla_board_custom_categories';
const STORAGE_KEY_CATEGORY_ORDER = 'tesla_board_category_order';
const STORAGE_KEY_APP_SORT_MODE = 'tesla_board_app_sort_mode'; // 'category' | 'title_az' | 'title_za'

let editModeActive = false;

// In-memory caches to avoid synchronous localStorage reads during render
let _cachedCustomCategories = null;
let _cachedCategoryOrder = null;
let _cachedAppSortMode = null;
let _cachedGlobalMode = null;
let _cachedCombinedCatalog = null;
let _catalogDirty = true;

export const DEFAULT_CATEGORIES = [
  { id: 'favorites', key: 'catFavorites' },
  { id: 'smarthome', key: 'catSmarthome' },
  { id: 'social', key: 'catSocial' },
  { id: 'streaming', key: 'catStreaming' },
  { id: 'livetv', key: 'catLivetv' },
  { id: 'sports', key: 'catSports' },
  { id: 'auto', key: 'catAuto' },
  { id: 'utilities', key: 'catUtilities' },
  { id: 'games', key: 'catGames' },
  { id: 'vm18', key: 'catVm18' }
];

// System Presets out-of-the-box
export const PRESET_SERVICES = DEFAULT_CATALOG.map(item => ({
  ...item,
  isSystem: true
}));

export function isEditModeActive() {
  return editModeActive;
}

export function setEditModeActive(active) {
  editModeActive = active;
}

export function toggleEditMode() {
  editModeActive = !editModeActive;
  return editModeActive;
}

export function invalidateCatalogCache() {
  _catalogDirty = true;
  _cachedCombinedCatalog = null;
  _cachedCustomCategories = null;
  _cachedCategoryOrder = null;
}

export function getCustomApps() {
  return getUserCatalog(PRESET_SERVICES);
}

/**
 * RESOLVES DYNAMIC COMBINED CATALOG FOR MAIN GUI GRID
 */
export function getCatalog() {
  if (!_catalogDirty && _cachedCombinedCatalog !== null) return _cachedCombinedCatalog;

  const hiddenIds = getHiddenPresetIds();
  const userCatalog = getUserCatalog(PRESET_SERVICES);

  const activeSystemPresets = PRESET_SERVICES.filter(preset => {
    if (hiddenIds.includes(preset.id)) return false;
    const isOverridden = userCatalog.some(userItem => 
      userItem.parentPresetId === preset.id ||
      (userItem.title && userItem.title.toLowerCase().trim() === preset.title.toLowerCase().trim())
    );
    if (isOverridden) return false;
    return true;
  });

  _cachedCombinedCatalog = [...activeSystemPresets, ...userCatalog];
  _catalogDirty = false;
  return _cachedCombinedCatalog;
}

export function addCatalogItem(item) {
  _catalogDirty = true; _cachedCombinedCatalog = null;
  addUserLink(item);
}

export function updateCatalogItem(id, updatedData) {
  _catalogDirty = true; _cachedCombinedCatalog = null;
  updateUserLink(id, updatedData, PRESET_SERVICES);
}

export function deleteCatalogItem(id) {
  _catalogDirty = true; _cachedCombinedCatalog = null;
  deleteUserLink(id, PRESET_SERVICES);
}

export function hidePreset(presetId) {
  _catalogDirty = true; _cachedCombinedCatalog = null;
  hideSystemPresetId(presetId);
}

export function showPreset(presetId) {
  _catalogDirty = true; _cachedCombinedCatalog = null;
  unhideSystemPresetId(presetId);
}

export function togglePresetVisibility(presetId) {
  _catalogDirty = true; _cachedCombinedCatalog = null;
  toggleSystemPresetVisibility(presetId);
}

export function restorePresetOriginal(presetId) {
  _catalogDirty = true; _cachedCombinedCatalog = null;
  restoreOriginalPreset(presetId);
}

/**
 * BATCH CATEGORY SHOW / HIDE IN PRESETS MANAGER
 */
export function hideAllInCategory(catId) {
  _catalogDirty = true;
  _cachedCombinedCatalog = null;
  const allServices = [...PRESET_SERVICES, ...getUserCatalog(PRESET_SERVICES)];
  const inCat = allServices.filter(s => s.category === catId);
  inCat.forEach(s => {
    const idToHide = s.parentPresetId || s.id;
    hideSystemPresetId(idToHide);
  });
}

export function showAllInCategory(catId) {
  _catalogDirty = true;
  _cachedCombinedCatalog = null;
  const allServices = [...PRESET_SERVICES, ...getUserCatalog(PRESET_SERVICES)];
  const inCat = allServices.filter(s => s.category === catId);
  inCat.forEach(s => {
    const idToShow = s.parentPresetId || s.id;
    unhideSystemPresetId(idToShow);
  });
}

export function getGlobalOpenMode() {
  if (_cachedGlobalMode !== null) return _cachedGlobalMode;
  _cachedGlobalMode = localStorage.getItem(STORAGE_KEY_GLOBAL_MODE) || 'fullscreen';
  return _cachedGlobalMode;
}

export function setGlobalOpenMode(mode) {
  _cachedGlobalMode = null;
  localStorage.setItem(STORAGE_KEY_GLOBAL_MODE, mode);
}

export function getCustomCategories() {
  if (_cachedCustomCategories !== null) return _cachedCustomCategories;
  const data = localStorage.getItem(STORAGE_KEY_CUSTOM_CATEGORIES);
  _cachedCustomCategories = data ? JSON.parse(data) : [];
  return _cachedCustomCategories;
}

export function addCustomCategory(name) {
  _cachedCustomCategories = null;
  const categories = getCustomCategories();
  const newCat = {
    id: 'custom_' + Date.now(),
    name
  };
  categories.push(newCat);
  localStorage.setItem(STORAGE_KEY_CUSTOM_CATEGORIES, JSON.stringify(categories));
  return newCat.id;
}

export function getOrderedCategoryIds() {
  if (_cachedCategoryOrder !== null) return _cachedCategoryOrder;

  const data = localStorage.getItem(STORAGE_KEY_CATEGORY_ORDER);
  const customCats = getCustomCategories();
  const allCurrentIds = [
    ...DEFAULT_CATEGORIES.map(c => c.id),
    ...customCats.map(c => c.id)
  ];

  if (!data) { _cachedCategoryOrder = allCurrentIds; return _cachedCategoryOrder; }

  try {
    const savedOrder = JSON.parse(data);
    const validSaved = savedOrder.filter(id => allCurrentIds.includes(id));
    const missing = allCurrentIds.filter(id => !validSaved.includes(id));
    _cachedCategoryOrder = [...validSaved, ...missing]; return _cachedCategoryOrder;
  } catch (e) {
    _cachedCategoryOrder = allCurrentIds; return _cachedCategoryOrder;
  }
}

export function saveCategoryOrder(orderArray) {
  _cachedCategoryOrder = null;
  localStorage.setItem(STORAGE_KEY_CATEGORY_ORDER, JSON.stringify(orderArray));
}

export function getAppSortMode() {
  if (_cachedAppSortMode !== null) return _cachedAppSortMode;
  _cachedAppSortMode = localStorage.getItem(STORAGE_KEY_APP_SORT_MODE) || 'category';
  return _cachedAppSortMode;
}

export function setAppSortMode(mode) {
  _cachedAppSortMode = null;
  localStorage.setItem(STORAGE_KEY_APP_SORT_MODE, mode);
}

export function resetCatalogToDefault() {
  _catalogDirty = true; _cachedCombinedCatalog = null;
  _cachedCustomCategories = null; _cachedCategoryOrder = null;
  clearUserCatalog();
  localStorage.removeItem(STORAGE_KEY_CUSTOM_CATEGORIES);
  localStorage.removeItem(STORAGE_KEY_CATEGORY_ORDER);
}
