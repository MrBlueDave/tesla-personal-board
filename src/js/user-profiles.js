/**
 * MULTI-USER PIN PROFILE SYSTEM FOR TESLA PERSONAL BOARD v0.8.3
 * Features real-time cross-browser & cross-device server disk synchronization (/api/profiles)
 */

import { invalidateCatalogCache } from './catalog.js';

const STORAGE_KEY_ACTIVE_PIN = 'tesla_board_active_pin';
const STORAGE_KEY_PROFILES = 'tesla_board_user_profiles';

const DEFAULT_PIN = '0000';
const DEFAULT_PROFILE = {
  pin: '0000',
  name: 'Default User',
  catalog: [],
  hiddenPresets: [],
  favorites: [],
  hiddenCategories: []
};

let isServerOnline = true;

/**
 * INITIALIZES PROFILE SYSTEM AND SYNCS WITH SERVER DISK IN REAL-TIME
 * GUARANTEES FETCH FROM SERVER FIRST BEFORE EVER WRITING TO DISK
 */
export async function initProfileSystem() {
  const urlParams = new URLSearchParams(window.location.search);
  const pinFromUrl = urlParams.get('pin');
  let urlPinSet = false;

  if (pinFromUrl && pinFromUrl.trim() !== '') {
    localStorage.setItem(STORAGE_KEY_ACTIVE_PIN, pinFromUrl.trim());
    urlPinSet = true;
  }

  // 1. ALWAYS FETCH SERVER PROFILES FIRST BEFORE DOING LOCAL DISK SAVES
  let serverReachable = false;
  try {
    const res = await fetch('/api/profiles');
    if (res.ok) {
      serverReachable = true;
      isServerOnline = true;
      const serverData = await res.json();
      
      if (serverData && serverData.profiles && Object.keys(serverData.profiles).length > 0) {
        const localProfiles = getProfilesMap();
        const mergedProfiles = { ...localProfiles, ...serverData.profiles };
        localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(mergedProfiles));
        if (!urlPinSet && !localStorage.getItem(STORAGE_KEY_ACTIVE_PIN)) {
          localStorage.setItem(STORAGE_KEY_ACTIVE_PIN, serverData.activePin || DEFAULT_PIN);
        }
        syncToServerDisk(getActivePin(), mergedProfiles);
        return; // Successfully loaded from server!
      } else if (serverData && Object.keys(serverData).length > 0 && !serverData.profiles) {
        const localProfiles = getProfilesMap();
        const mergedProfiles = { ...localProfiles, ...serverData };
        localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(mergedProfiles));
        syncToServerDisk(getActivePin(), mergedProfiles);
        return;
      }
    } else {
      isServerOnline = false;
    }
  } catch (e) {
    isServerOnline = false;
    console.log('Server profiles sync offline, falling back to local storage.');
  }

  // 2. ONLY IF SERVER RETURNED EMPTY/OFFLINE, CHECK LOCALSTORAGE OR INITIALIZE DEFAULT
  let localProfiles = getProfilesMap();
  if (!localProfiles[DEFAULT_PIN]) {
    localProfiles[DEFAULT_PIN] = { ...DEFAULT_PROFILE };
    localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(localProfiles));
  }
  
  if (!localStorage.getItem(STORAGE_KEY_ACTIVE_PIN)) {
    localStorage.setItem(STORAGE_KEY_ACTIVE_PIN, DEFAULT_PIN);
  }

  // Push initial default to server ONLY if server was reachable but empty (not if offline)
  if (serverReachable) {
    syncToServerDisk(getActivePin(), localProfiles);
  }
}

/**
 * RE-SYNCS PROFILES FROM SERVER DISK ON DEMAND (E.G. WHEN OPENING PROFILE MODAL)
 */
export async function refreshProfilesFromServer() {
  try {
    const res = await fetch('/api/profiles');
    if (res.ok) {
      isServerOnline = true;
      const serverData = await res.json();
      if (serverData && serverData.profiles && Object.keys(serverData.profiles).length > 0) {
        const localProfiles = getProfilesMap();
        const mergedProfiles = { ...localProfiles, ...serverData.profiles };
        localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(mergedProfiles));
        syncToServerDisk(getActivePin(), mergedProfiles);
        return true;
      }
    }
  } catch (e) {
    isServerOnline = false;
  }
  return false;
}

export async function syncToServerDisk(activePin, map, _retryCount = 0) {
  const MAX_RETRIES = 3;
  try {
    const payload = {
      activePin: activePin || getActivePin(),
      profiles: map || getProfilesMap()
    };
    const res = await fetch('/api/profiles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      isServerOnline = true;
    } else if (_retryCount < MAX_RETRIES) {
      const delay = Math.pow(2, _retryCount) * 1000;
      setTimeout(() => syncToServerDisk(activePin, map, _retryCount + 1), delay);
    }
  } catch (e) {
    isServerOnline = false;
    if (_retryCount < MAX_RETRIES) {
      const delay = Math.pow(2, _retryCount) * 1000;
      setTimeout(() => syncToServerDisk(activePin, map, _retryCount + 1), delay);
    }
  }
}

export function getActivePin() {
  return localStorage.getItem(STORAGE_KEY_ACTIVE_PIN) || DEFAULT_PIN;
}

export function setActivePin(pin, customName = null) {
  const cleanPin = String(pin).trim();
  if (!cleanPin) return;

  const profiles = getProfilesMap();
  if (!profiles[cleanPin]) {
    profiles[cleanPin] = {
      pin: cleanPin,
      name: (customName && customName.trim()) ? customName.trim() : `Utente ${cleanPin}`,
      catalog: [],
      hiddenPresets: [],
      favorites: [],
      hiddenCategories: []
    };
  } else {
    if (customName !== null && customName !== undefined && customName.trim() !== '') {
      profiles[cleanPin].name = customName.trim();
    }
  }
  
  localStorage.setItem(STORAGE_KEY_ACTIVE_PIN, cleanPin);
  invalidateCatalogCache();
  saveProfilesMap(profiles);
}

export function updateProfileName(pin, name) {
  const cleanPin = String(pin).trim();
  const cleanName = String(name).trim();
  if (!cleanPin || !cleanName) return;

  const map = getProfilesMap();
  if (map[cleanPin]) {
    map[cleanPin].name = cleanName;
    saveProfilesMap(map);
  }
}

export function getProfilesMap() {
  const data = localStorage.getItem(STORAGE_KEY_PROFILES);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Error parsing profiles map', e);
    }
  }
  return { [DEFAULT_PIN]: { ...DEFAULT_PROFILE } };
}

export function saveProfilesMap(map) {
  localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(map));
  invalidateCatalogCache();
  syncToServerDisk(getActivePin(), map);
}

export function getActiveProfileData() {
  const pin = getActivePin();
  const map = getProfilesMap();
  if (!map[pin]) {
    setActivePin(pin);
    return getProfilesMap()[pin];
  }
  return map[pin];
}

export function updateActiveProfileData(updaterFn) {
  const pin = getActivePin();
  const map = getProfilesMap();
  if (!map[pin]) {
    map[pin] = { pin, name: `Utente ${pin}`, catalog: [], hiddenPresets: [], favorites: [], hiddenCategories: [] };
  }

  map[pin] = updaterFn(map[pin]);
  saveProfilesMap(map);
}

export function createNewProfile(pin, name) {
  const cleanPin = String(pin).trim();
  if (!cleanPin) return false;

  const map = getProfilesMap();
  map[cleanPin] = {
    pin: cleanPin,
    name: name || `Utente ${cleanPin}`,
    catalog: [],
    hiddenPresets: [],
    favorites: [],
    hiddenCategories: []
  };
  setActivePin(cleanPin, name);
  return true;
}

export function deleteProfile(pin) {
  const cleanPin = String(pin).trim();
  if (cleanPin === DEFAULT_PIN) return false;

  const map = getProfilesMap();
  delete map[cleanPin];
  
  if (getActivePin() === cleanPin) {
    localStorage.setItem(STORAGE_KEY_ACTIVE_PIN, DEFAULT_PIN);
  }
  saveProfilesMap(map);
  return true;
}
