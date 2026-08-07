/**
 * MASTER AUTHENTICATION MODULE & TESLA LOCK SCREEN CONTROLLER v0.8.4
 * Handles first-time browser authentication, Tesla PIN pad UI, and persistent token storage.
 */

import { showToast } from './utils.js';

const STORAGE_KEY_AUTH_TOKEN = 'tesla_board_auth_token';

export function getStoredAuthToken() {
  return localStorage.getItem(STORAGE_KEY_AUTH_TOKEN) || '';
}

export function saveAuthToken(token) {
  localStorage.setItem(STORAGE_KEY_AUTH_TOKEN, token);
}

export function clearAuthToken() {
  localStorage.removeItem(STORAGE_KEY_AUTH_TOKEN);
}

/**
 * INITIALIZES AUTHENTICATION SYSTEM & TESLA LOCK SCREEN
 */
export async function initAuthSystem() {
  const lockOverlay = document.getElementById('auth-lock-overlay');
  const lockForm = document.getElementById('auth-lock-form');
  const passInput = document.getElementById('auth-password-input');
  const keypad = document.getElementById('auth-pin-keypad');
  const lockBox = document.getElementById('auth-lock-box');

  if (!lockOverlay) return;

  // 1. Verify current stored token against server status
  let isAuthorized = false;
  try {
    const res = await fetch('/api/auth/status');
    if (res.ok) {
      const data = await res.json();
      const currentToken = getStoredAuthToken();
      if (currentToken && data.validToken && currentToken === data.validToken) {
        isAuthorized = true;
      }
    }
  } catch (e) {
    console.log('Auth status check offline, trusting local session if token exists');
    if (getStoredAuthToken()) {
      isAuthorized = true;
    }
  }

  if (isAuthorized) {
    document.documentElement.classList.remove('needs-auth');
    lockOverlay.classList.remove('active');
    document.body.classList.remove('is-locked');
  } else {
    document.documentElement.classList.add('needs-auth');
    lockOverlay.classList.add('active');
    document.body.classList.add('is-locked');
    setTimeout(() => {
      if (passInput) passInput.focus();
    }, 100);
  }

  // Bind Form Submit
  if (lockForm) {
    lockForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const passVal = passInput ? passInput.value.trim() : '';
      if (!passVal) {
        triggerLockError('Inserisci la password');
        return;
      }

      await attemptLogin(passVal);
    });
  }

  // Bind Touch PIN Keypad Buttons
  if (keypad && passInput) {
    keypad.querySelectorAll('.auth-key-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-action');
        const num = btn.getAttribute('data-num');

        if (action === 'clear') {
          passInput.value = '';
        } else if (action === 'backspace') {
          passInput.value = passInput.value.slice(0, -1);
        } else if (num !== null) {
          passInput.value += num;
        }
        passInput.focus();
      });
    });
  }
}

/**
 * ATTEMPTS LOGIN WITH PASSWORD
 */
export async function attemptLogin(password) {
  const lockOverlay = document.getElementById('auth-lock-overlay');
  const passInput = document.getElementById('auth-password-input');

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });

    const data = await res.json();

    if (res.ok && data.success && data.token) {
      saveAuthToken(data.token);
      document.documentElement.classList.remove('needs-auth');
      if (lockOverlay) {
        lockOverlay.classList.remove('active');
      }
      document.body.classList.remove('is-locked');
      showToast('Accesso autorizzato!', 'success');
      return true;
    } else {
      triggerLockError(data.error || 'Password non corretta');
      return false;
    }
  } catch (e) {
    triggerLockError('Errore di connessione al server');
    return false;
  }
}

/**
 * TRIGGERS VISUAL SHAKE ANIMATION ON ERROR
 */
function triggerLockError(msg) {
  const lockBox = document.getElementById('auth-lock-box');
  const passInput = document.getElementById('auth-password-input');

  showToast(msg, 'error');

  if (lockBox) {
    lockBox.classList.add('shake-error');
    setTimeout(() => lockBox.classList.remove('shake-error'), 450);
  }

  if (passInput) {
    passInput.value = '';
    passInput.focus();
  }
}

/**
 * MANUALLY LOCKS THE BROWSER (LOGOUT)
 */
export function lockBrowser() {
  clearAuthToken();
  const lockOverlay = document.getElementById('auth-lock-overlay');
  const passInput = document.getElementById('auth-password-input');

  if (passInput) passInput.value = '';
  document.documentElement.classList.add('needs-auth');
  if (lockOverlay) lockOverlay.classList.add('active');
  document.body.classList.add('is-locked');
  showToast('Schermo bloccato!', 'info');
}
