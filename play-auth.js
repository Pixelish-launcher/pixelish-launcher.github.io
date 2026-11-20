// Optional account box for the play page (title screen only). Playing never requires an account.
(function () {
  var API = 'https://pixelish-launcher-accounts.knoel99-morcik.workers.dev', KEY = 'pl_session_token', user = null, mode = 'login';
  fetch('/api-config.json', { cache: 'no-store' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (c) { if (c && typeof c.apiBase === 'string' && c.apiBase.indexOf('https://') === 0) API = c.apiBase.replace(/\/+$/, ''); }).catch(function () {}).then(refresh);
  function tok() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function setTok(t) { try { t ? localStorage.setItem(KEY, t) : localStorage.removeItem(KEY); } catch (e) {} }
  function api(p, b) { var h = {}, t = tok(); if (t) h.Authorization = 'Bearer ' + t; if (b) h['Content-Type'] = 'application/json';
    return fetch(API + p, b ? { method: 'POST', headers: h, credentials: 'omit', body: JSON.stringify(b) } : { headers: h, credentials: 'omit', cache: 'no-store' })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { j._s = r.status; return j; }); }); }
  var css = document.createElement('style');
  css.textContent = "#pla{position:fixed;top:10px;right:10px;z-index:99999;display:none;gap:8px;align-items:center;font-family:'Pixelify Sans',monospace;font-variant-ligatures:none}"
  + "body.intitle #pla{display:flex}#pla b{color:#ffd84a;text-shadow:2px 2px 0 #140e18;font-size:16px;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}"
  + ".pla-b{font:inherit;font-size:15px;font-weight:700;padding:6px 12px;cursor:pointer;border:0;color:#2a1606;background:linear-gradient(180deg,#ffe27a,#f5a623);box-shadow:0 0 0 2px #140e18,inset 0 -3px 0 #b3661a}"
  + ".pla-b.g{color:#f3ead7;background:#2a2140;box-shadow:0 0 0 2px #140e18,inset 0 -3px 0 #1d172a}.pla-b:hover{filter:brightness(1.15)}"
  + "#plaDlg{position:fixed;inset:0;margin:auto;height:fit-content;max-height:92vh;overflow:auto;border:0;padding:22px;background:#1d172a;color:#f3ead7;box-shadow:0 0 0 3px #140e18,0 0 0 6px #ffd84a;width:min(380px,92vw);font-family:'Pixelify Sans',monospace;font-variant-ligatures:none}#plaDlg::backdrop{background:rgba(5,4,10,.82)}"
  + "#plaDlg h3{color:#ffd84a;font-size:24px;margin:12px 0 6px}#plaDlg label{display:block;margin-top:10px;font-size:16px}"
  + "#plaDlg input{display:block;width:100%;box-sizing:border-box;margin-top:4px;padding:9px 11px;font:inherit;font-size:17px;color:#f3ead7;background:#0f0b18;border:0;box-shadow:inset 0 0 0 2px #4a3f66;outline:none}#plaDlg input:focus{box-shadow:inset 0 0 0 2px #ffd84a}"
  + "#plaDlg .t{display:flex;gap:8px;margin-right:26px}#plaDlg .t button{flex:1}#plaDlg .x{position:absolute;top:8px;right:10px;background:none;border:0;color:#b4a9c4;font-size:20px;cursor:pointer}"
  + "#plaDlg .e{margin-top:10px;padding:7px 9px;color:#ffd0c8;background:rgba(120,20,20,.35)}#plaDlg .h{font-size:13px;color:#b4a9c4;margin-top:5px}#plaDlg [hidden]{display:none!important}";
  document.head.appendChild(css);
  var bar = document.createElement('div'); bar.id = 'pla';
  var dlg = document.createElement('dialog'); dlg.id = 'plaDlg';
  dlg.innerHTML = '<button class="x" type="button" aria-label="Close">✕</button><div class="t"><button type="button" class="pla-b" data-m="login">Log in</button><button type="button" class="pla-b g" data-m="signup">Register</button></div>'
    + '<h3>Log in</h3><form novalidate><label>Username<input name="u" autocomplete="username" autocapitalize="none" spellcheck="false" maxlength="20"></label>'
    + '<p class="h" hidden>3–20 characters: letters, numbers and underscores (_). No email needed.</p>'
    + '<label>Password<input name="p" type="password" autocomplete="current-password" maxlength="128"></label>'
    + '<label class="p2" hidden>Confirm password<input name="p2" type="password" autocomplete="new-password" maxlength="128"></label>'
    + '<p class="e" role="alert" hidden></p><button class="pla-b" type="submit" style="width:100%;margin-top:16px">Log in</button>'
    + '<p class="h">You can play without an account.</p></form>';
  var f = dlg.querySelector('form'), err = dlg.querySelector('.e'), sub = f.querySelector('button[type=submit]');
  function stop(e) { e.stopPropagation(); }
  ['keydown', 'keyup', 'keypress'].forEach(function (k) { dlg.addEventListener(k, stop); });
  dlg.querySelector('.x').onclick = function () { dlg.close(); };
  dlg.querySelectorAll('[data-m]').forEach(function (b) { b.onclick = function () { setMode(b.dataset.m); }; });
  function setMode(m) { mode = m; dlg.querySelectorAll('[data-m]').forEach(function (b) { b.classList.toggle('g', b.dataset.m !== m); });
    dlg.querySelector('h3').textContent = sub.textContent = m === 'login' ? 'Log in' : 'Create account';
    if (m === 'login') dlg.querySelector('h3').textContent = 'Log in';
    dlg.querySelector('.p2').hidden = m === 'login'; dlg.querySelector('.h').hidden = m === 'login';
    f.p.autocomplete = m === 'login' ? 'current-password' : 'new-password'; showErr(''); }
  function showErr(t) { err.textContent = t; err.hidden = !t; }
  function open(m) { setMode(m); f.reset(); if (!dlg.open) dlg.showModal(); setTimeout(function () { f.u.focus(); }, 30); }
  f.onsubmit = function (e) { e.preventDefault(); var u = f.u.value.trim(), p = f.p.value;
    if (!u || !p) return showErr('Enter your username and password.');
    if (mode === 'signup') { if (!/^[A-Za-z0-9_]{3,20}$/.test(u)) return showErr('Username: 3–20 letters, numbers or _.'); if (p !== f.p2.value) return showErr('The passwords do not match.'); }
    sub.disabled = true; showErr('');
    api('/api/auth/' + mode, { username: u, password: p }).then(function (r) { sub.disabled = false;
      if (r.token) { setTok(r.token); user = r.user || { username: r.username || u }; render(); dlg.close(); refresh(); }
      else showErr(r.error || (r._s === 401 ? 'Wrong username or password.' : 'Something went wrong. Try again.'));
    }).catch(function () { sub.disabled = false; showErr('Could not reach the server. Try again.'); }); };
  function render() { bar.innerHTML = '';
    if (user) { var n = document.createElement('b'); n.textContent = user.username; var o = document.createElement('button'); o.className = 'pla-b g'; o.type = 'button'; o.textContent = 'Log out';
      o.onclick = function () { var d = function () { setTok(null); user = null; render(); }; api('/api/auth/logout', {}).then(d, d); }; bar.appendChild(n); bar.appendChild(o); }
    else { var l = document.createElement('button'); l.className = 'pla-b g'; l.type = 'button'; l.textContent = 'Log in'; l.onclick = function () { open('login'); };
      var s = document.createElement('button'); s.className = 'pla-b'; s.type = 'button'; s.textContent = 'Register'; s.onclick = function () { open('signup'); };
      bar.appendChild(l); bar.appendChild(s); }
    window.PixelishUser = user; }
  function refresh() { if (!tok()) { user = null; render(); return; }
    api('/api/me').then(function (r) { if (r.loggedIn) user = r; else { user = null; if (r._s === 200) setTok(null); } render(); }).catch(render); }
  function mount() { document.body.appendChild(bar); document.body.appendChild(dlg); render(); }
  document.body ? mount() : document.addEventListener('DOMContentLoaded', mount);
})();
