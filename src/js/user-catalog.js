/**
 * USER CATALOG MODULE FOR TESLA PERSONAL BOARD v0.7.3
 * Integrated with Multi-User PIN Profile System.
 */

import { getActiveProfileData, updateActiveProfileData } from './user-profiles.js';

/**
 * GETS ALL USER CUSTOM LINKS AND PRESET OVERRIDES FOR ACTIVE PIN PROFILE
 */
export function getUserCatalog(systemPresets = []) {
  const profile = getActiveProfileData();
  let userCatalog = profile.catalog || [];

  // Deduplicate and sanitize user catalog items against system presets
  if (systemPresets && systemPresets.length > 0 && userCatalog.length > 0) {
    let modified = false;

    userCatalog = userCatalog.filter((item, index, self) => {
      if (!item.parentPresetId) {
        const matchingPreset = systemPresets.find(p => 
          p.id === item.id ||
          (p.brandSlug && item.brandSlug && p.brandSlug === item.brandSlug) ||
          p.title.toLowerCase().trim() === item.title.toLowerCase().trim()
        );

        if (matchingPreset) {
          item.parentPresetId = matchingPreset.id;
          hideSystemPresetId(matchingPreset.id);
          modified = true;
        }
      }

      const firstIndex = self.findIndex(t => 
        t.id === item.id || (t.parentPresetId && item.parentPresetId && t.parentPresetId === item.parentPresetId)
      );

      if (firstIndex !== index) {
        modified = true;
        return false;
      }

      return true;
    });

    if (modified) {
      saveUserCatalog(userCatalog);
    }
  }

  return userCatalog;
}

/**
 * SAVES USER CATALOG TO ACTIVE PROFILE
 */
export function saveUserCatalog(userItems) {
  updateActiveProfileData(profile => ({
    ...profile,
    catalog: userItems
  }));
}

/**
 * ADDS A NEW USER CUSTOM LINK
 */
export function addUserLink(item) {
  const userCatalog = getUserCatalog();
  userCatalog.push({
    ...item,
    isSystem: false
  });
  saveUserCatalog(userCatalog);
}

/**
 * UPDATES A USER CUSTOM LINK OR CREATES AN OVERRIDE FOR A SYSTEM PRESET
 */
export function updateUserLink(id, updatedData, systemPresets = []) {
  const userCatalog = getUserCatalog(systemPresets);
  const index = userCatalog.findIndex(item => item.id === id || item.parentPresetId === id);

  if (index !== -1) {
    userCatalog[index] = { ...userCatalog[index], ...updatedData };
    saveUserCatalog(userCatalog);
    return userCatalog[index];
  } else {
    const preset = systemPresets.find(p => p.id === id);
    if (preset) {
      const overrideCopy = {
        ...preset,
        ...updatedData,
        id: 'user_' + Date.now(),
        isSystem: false,
        parentPresetId: preset.id
      };
      userCatalog.push(overrideCopy);
      saveUserCatalog(userCatalog);

      hideSystemPresetId(preset.id);
      return overrideCopy;
    }
  }
  return null;
}

/**
 * DELETES A USER LINK OR HIDES A SYSTEM PRESET
 */
export function deleteUserLink(id, systemPresets = []) {
  let userCatalog = getUserCatalog(systemPresets);

  const systemPreset = systemPresets.find(p => p.id === id);
  if (systemPreset) {
    hideSystemPresetId(systemPreset.id);
    userCatalog = userCatalog.filter(item => item.parentPresetId !== systemPreset.id && item.id !== systemPreset.id);
    saveUserCatalog(userCatalog);
    return;
  }

  const targetIndex = userCatalog.findIndex(item => item.id === id);
  if (targetIndex !== -1) {
    const targetItem = userCatalog[targetIndex];
    if (targetItem.parentPresetId) {
      hideSystemPresetId(targetItem.parentPresetId);
    }
    userCatalog.splice(targetIndex, 1);
    saveUserCatalog(userCatalog);
    return;
  }

  const parentPresetMatch = systemPresets.find(p => 
    userCatalog.some(item => item.id === id && item.parentPresetId === p.id) ||
    p.title.toLowerCase().trim() === id.toLowerCase().trim()
  );

  if (parentPresetMatch) {
    hideSystemPresetId(parentPresetMatch.id);
    userCatalog = userCatalog.filter(item => item.parentPresetId !== parentPresetMatch.id && item.id !== parentPresetMatch.id);
    saveUserCatalog(userCatalog);
  }
}

/**
 * GETS HIDDEN SYSTEM PRESET IDS FOR ACTIVE PROFILE
 */
export function getHiddenPresetIds() {
  const profile = getActiveProfileData();
  return profile.hiddenPresets || [];
}

/**
 * HIDES A SYSTEM PRESET BY ID
 */
export function hideSystemPresetId(presetId) {
  updateActiveProfileData(profile => {
    const hidden = profile.hiddenPresets || [];
    if (!hidden.includes(presetId)) {
      return { ...profile, hiddenPresets: [...hidden, presetId] };
    }
    return profile;
  });
}

/**
 * UNHIDES/RESTORES A SYSTEM PRESET BY ID
 */
export function unhideSystemPresetId(presetId) {
  updateActiveProfileData(profile => {
    const hidden = profile.hiddenPresets || [];
    return { ...profile, hiddenPresets: hidden.filter(id => id !== presetId) };
  });
}

/**
 * TOGGLES SYSTEM PRESET VISIBILITY
 */
export function toggleSystemPresetVisibility(presetId) {
  const hidden = getHiddenPresetIds();
  if (hidden.includes(presetId)) {
    unhideSystemPresetId(presetId);
  } else {
    hideSystemPresetId(presetId);
  }
}

/**
 * RESTORES ORIGINAL SYSTEM PRESET AND REMOVES USER OVERRIDE
 */
export function restoreOriginalPreset(presetId) {
  let userCatalog = getUserCatalog();
  userCatalog = userCatalog.filter(item => item.parentPresetId !== presetId && item.id !== presetId);
  saveUserCatalog(userCatalog);
  unhideSystemPresetId(presetId);
}

/* ==========================================================================
   FAVORITES MANAGEMENT (USER PREFERITI)
   ========================================================================== */
export function getFavoriteIds() {
  const profile = getActiveProfileData();
  return profile.favorites || [];
}

export function isFavoriteId(id) {
  const favorites = getFavoriteIds();
  return favorites.includes(id);
}

export function toggleFavoriteId(id) {
  let isFav = false;
  updateActiveProfileData(profile => {
    let favorites = profile.favorites || [];
    if (favorites.includes(id)) {
      favorites = favorites.filter(favId => favId !== id);
      isFav = false;
    } else {
      favorites = [...favorites, id];
      isFav = true;
    }
    return { ...profile, favorites };
  });
  return isFav;
}

/* ==========================================================================
   CATEGORY DASHBOARD VISIBILITY MANAGEMENT (SHOW / HIDE CATEGORY IN GUI)
   ========================================================================== */
export function getHiddenCategoryIds() {
  const profile = getActiveProfileData();
  return profile.hiddenCategories || [];
}

export function isCategoryVisible(catId) {
  const hidden = getHiddenCategoryIds();
  return !hidden.includes(catId);
}

export function toggleCategoryDashboardVisibility(catId) {
  let visible = false;
  updateActiveProfileData(profile => {
    let hidden = profile.hiddenCategories || [];
    if (hidden.includes(catId)) {
      hidden = hidden.filter(id => id !== catId);
      visible = true;
    } else {
      hidden = [...hidden, catId];
      visible = false;
    }
    return { ...profile, hiddenCategories: hidden };
  });
  return visible;
}

/**
 * CLEARS ALL USER CUSTOM LINKS AND OVERRIDES FOR ACTIVE PROFILE
 */
export function clearUserCatalog() {
  updateActiveProfileData(profile => ({
    ...profile,
    catalog: [],
    hiddenPresets: [],
    favorites: [],
    hiddenCategories: []
  }));
}
