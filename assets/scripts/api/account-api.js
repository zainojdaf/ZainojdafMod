window.AccountAPI = {
  currentUser: null,

  _url(path) {
    return `${window._apiBase}${path}`;
  },

  async _postJson(path, body) {
    const res = await fetch(this._url(path), {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body || {}),
    });
    let data = {};
    try { data = await res.json(); } catch {}
    if (!res.ok) {
      const err = new Error(data.error || 'Request failed');
      err.status = res.status;
      throw err;
    }
    return data;
  },

  async checkSession() {
    try {
      const res = await fetch(this._url('/api/auth/me'), { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        this.currentUser = data.user;
      } else {
        this.currentUser = null;
      }
    } catch {
      this.currentUser = null;
    }
    return this.currentUser;
  },

  async login(username, password) {
    const data = await this._postJson('/api/auth/login', { username, password });
    this.currentUser = data.user;
    return data.user;
  },

  async register(username, email, password, confirmPassword) {
    const data = await this._postJson('/api/auth/register', {
      username, email: email || undefined, password, confirmPassword,
    });
    this.currentUser = data.user;
    return data.user;
  },

  async logout() {
    try {
      await fetch(this._url('/api/auth/logout'), { method: 'POST', credentials: 'include' });
    } catch {}
    this.currentUser = null;
  },

  clearClientData() {
    try {
      const keys = [
        'gd_settings', 'gd_totalAttempts', 'gd_totalJumps', 'gd_totalDeaths',
        'gd_completedLevels', 'created_levels', 'iconMainColor', 'iconSecondaryColor',
        'iconCurrentPlayer', 'iconCurrentShip', 'iconCurrentBall', 'iconCurrentWave',
        'iconCurrentSpider', 'iconCurrentBird', 'userMusicVol', 'userSfxVol',
        'menuMusicEnabled',
      ];
      for (const key of keys) localStorage.removeItem(key);
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('bestPercent_') || key.startsWith('practiceBestPercent_'))) {
          localStorage.removeItem(key);
        }
      }
    } catch {}
    try { sessionStorage.clear(); } catch {}
  },

  async getCloudSave() {
    const res = await fetch(this._url('/api/saves'), { credentials: 'include' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load save');
    return data.save;
  },

  async setCloudSave(saveData) {
    const res = await fetch(this._url('/api/saves'), {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ save: saveData }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to save');
  },

  // Snapshot every localStorage key/value (progress, icons, settings, etc.)
  // and push it to the cloud save for the logged-in account.
  async pushLocalSaveToCloud() {
    const snapshot = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      snapshot[key] = localStorage.getItem(key);
    }
    await this.setCloudSave(snapshot);
  },

  // Pull the cloud save down and overwrite matching localStorage keys.
  // Returns true if a save was found and applied, false if there was nothing saved yet.
  async pullCloudSaveToLocal() {
    const snapshot = await this.getCloudSave();
    if (!snapshot) return false;
    for (const key in snapshot) {
      if (Object.prototype.hasOwnProperty.call(snapshot, key)) {
        localStorage.setItem(key, snapshot[key]);
      }
    }
    return true;
  },
};

// Check session silently on page load so currentUser is populated before
// the player opens the settings screen.
window.AccountAPI.checkSession().catch(() => {});
