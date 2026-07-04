(function () {
  function injectMarkup() {
    const wrap = document.createElement('div');
    wrap.id = 'wd-acct-overlay';
    wrap.innerHTML = `
      <div id="wd-acct-panel">
        <div id="wd-acct-close"></div>

        <!-- HOME VIEW -->
        <div class="wd-acct-view" data-view="home">
          <div class="wd-acct-title">Account</div>
          <div id="wd-acct-home-status" class="wd-acct-subtitle">Not logged in<br>Create an account to back up and load your data from the cloud</div>
          <div id="wd-acct-home-loggedin" style="display:none;">
            <div class="wd-acct-loggedin-user" id="wd-acct-loggedin-username"></div>
          </div>
          <div class="wd-acct-stack" id="wd-acct-home-loggedout-btns">
            <div class="wd-acct-btn wd-acct-btn-confirm wd-acct-btn-wide" data-action="show-login">Log In</div>
            <div class="wd-acct-btn wd-acct-btn-cancel wd-acct-btn-wide" data-action="show-register">Register</div>
          </div>
          <div class="wd-acct-stack" id="wd-acct-home-loggedin-btns" style="display:none;">
            <div class="wd-acct-btn wd-acct-btn-cancel wd-acct-btn-wide" data-action="logout">Log Out</div>
          </div>
        </div>

        <!-- LOGIN VIEW -->
        <div class="wd-acct-view" data-view="login">
          <div class="wd-acct-title">Login</div>
          <div class="wd-acct-error" id="wd-acct-login-error"></div>
          <div class="wd-acct-field">
            <div class="wd-acct-label">Username:</div>
            <input class="wd-acct-input" id="wd-acct-login-username" type="text" maxlength="16" autocomplete="username">
          </div>
          <div class="wd-acct-field">
            <div class="wd-acct-label">Password:</div>
            <input class="wd-acct-input" id="wd-acct-login-password" type="password" maxlength="64" autocomplete="current-password">
          </div>
          <div class="wd-acct-btn-row">
            <div class="wd-acct-btn wd-acct-btn-cancel" data-action="show-home">Cancel</div>
            <div class="wd-acct-btn wd-acct-btn-confirm" data-action="do-login">Login</div>
          </div>
        </div>

        <!-- REGISTER VIEW -->
        <div class="wd-acct-view" data-view="register">
          <div class="wd-acct-title">Register Account</div>
          <div class="wd-acct-field">
            <div class="wd-acct-label">Username: <span class="wd-acct-label-note">(shown to other players)</span></div>
            <div class="wd-acct-error" id="wd-acct-register-username-error"></div>
            <input class="wd-acct-input" id="wd-acct-register-username" type="text" maxlength="16" autocomplete="username">
          </div>
          <div class="wd-acct-field">
            <div class="wd-acct-label">Password:</div>
            <input class="wd-acct-input" id="wd-acct-register-password" type="password" maxlength="64" autocomplete="new-password">
          </div>
          <div class="wd-acct-field">
            <div class="wd-acct-label">Confirm Password:</div>
            <div class="wd-acct-error" id="wd-acct-register-password-error"></div>
            <input class="wd-acct-input" id="wd-acct-register-password2" type="password" maxlength="64" autocomplete="new-password">
          </div>
          <div class="wd-acct-field">
            <div class="wd-acct-label">Email: <span class="wd-acct-label-note">(optional)</span></div>
            <div class="wd-acct-error" id="wd-acct-register-email-error"></div>
            <input class="wd-acct-input" id="wd-acct-register-email" type="email" maxlength="255" autocomplete="email">
          </div>
          <div class="wd-acct-btn-row">
            <div class="wd-acct-btn wd-acct-btn-cancel" data-action="show-home">Cancel</div>
            <div class="wd-acct-btn wd-acct-btn-confirm" data-action="do-register">Submit</div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(wrap);
    return wrap;
  }

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    const overlay = injectMarkup();
    const views = overlay.querySelectorAll('.wd-acct-view');

    function showView(name) {
      views.forEach(v => v.classList.toggle('active', v.dataset.view === name));
      clearErrors();
      if (name === 'home') refreshHomeView();
    }

    function clearErrors() {
      overlay.querySelectorAll('.wd-acct-error').forEach(el => {
        el.classList.remove('visible');
        el.textContent = '';
      });
    }

    function setError(id, message) {
      const el = overlay.querySelector('#' + id);
      if (!el) return;
      el.textContent = message;
      el.classList.add('visible');
    }

    function refreshHomeView() {
      const loggedIn = !!window.AccountAPI.currentUser;
      overlay.querySelector('#wd-acct-home-loggedout-btns').style.display = loggedIn ? 'none' : 'flex';
      overlay.querySelector('#wd-acct-home-loggedin-btns').style.display = loggedIn ? 'flex' : 'none';
      overlay.querySelector('#wd-acct-home-loggedin').style.display = loggedIn ? 'block' : 'none';
      overlay.querySelector('#wd-acct-home-status').style.display = loggedIn ? 'none' : 'block';
      if (loggedIn) {
        overlay.querySelector('#wd-acct-loggedin-username').textContent = window.AccountAPI.currentUser.username;
      }
    }

    overlay.addEventListener('click', async (e) => {
      const actionEl = e.target.closest('[data-action]');
      if (actionEl) {
        const action = actionEl.dataset.action;
        if (action === 'show-home') showView('home');
        else if (action === 'show-login') showView('login');
        else if (action === 'show-register') showView('register');
        else if (action === 'do-login') await doLogin();
        else if (action === 'do-register') await doRegister();
        else if (action === 'logout') await doLogout();
        return;
      }
      if (e.target.id === 'wd-acct-close' || e.target === overlay) {
        window.WDAccountUI.close();
      }
    });

    async function doLogin() {
      clearErrors();
      const username = overlay.querySelector('#wd-acct-login-username').value.trim();
      const password = overlay.querySelector('#wd-acct-login-password').value;
      if (!username || !password) {
        setError('wd-acct-login-error', 'Please enter a username and password');
        return;
      }
      try {
        await window.AccountAPI.login(username, password);
        showView('home');
      } catch (err) {
        setError('wd-acct-login-error', err.message || 'Login failed');
      }
    }

    async function doRegister() {
      clearErrors();
      const username = overlay.querySelector('#wd-acct-register-username').value.trim();
      const password = overlay.querySelector('#wd-acct-register-password').value;
      const password2 = overlay.querySelector('#wd-acct-register-password2').value;
      const email = overlay.querySelector('#wd-acct-register-email').value.trim();

      let hasError = false;
      if (!username) {
        setError('wd-acct-register-username-error', 'Username is required');
        hasError = true;
      }
      if (password !== password2) {
        setError('wd-acct-register-password-error', 'Passwords do not match');
        hasError = true;
      }
      if (hasError) return;

      try {
        await window.AccountAPI.register(username, email, password, password2);
        showView('home');
      } catch (err) {
        const msg = err.message || 'Registration failed';
        if (/username/i.test(msg) && /use/i.test(msg)) {
          setError('wd-acct-register-username-error', msg);
        } else if (/email/i.test(msg) && /use/i.test(msg)) {
          setError('wd-acct-register-email-error', msg);
        } else if (/match/i.test(msg)) {
          setError('wd-acct-register-password-error', msg);
        } else {
          setError('wd-acct-register-email-error', msg);
        }
      }
    }

    async function doLogout() {
      await window.AccountAPI.logout();
      window.AccountAPI.clearClientData();
      refreshHomeView();
    }

    window.WDAccountUI = {
      open() {
        overlay.classList.add('visible');
        showView('home');
      },
      close() {
        overlay.classList.remove('visible');
      },
    };
  });
})();
