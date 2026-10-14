'use strict';
/* ============ Vérité ou Action 18+ — client ============ */
const $ = (s) => document.querySelector(s);
const socket = io();
const now = () => Date.now();

let S = null;              // dernier état de la room
let myPendingCode = null;  // code en attente de validation admin
const feedItems = [];      // feed local

/* ================= i18n ================= */
const T = {
  fr: {
    title: 'VÉRITÉ ou ACTION', tagline: 'Le jeu des soirées entre adultes — en ligne, partout au Sénégal 🇸🇳',
    ageok: "J'ai 18 ans ou plus 🍾", yourname: 'Ton pseudo...', create: '🎓 Créer un salon (je serai l\u2019admin)',
    or: '— ou —', join: '🚪 Rejoindre une partie',
    consent: '⚠️ Respect et consentement obligatoires. Tout le contenu (messages, audios) disparaît à la fin de la session.',
    waitingadmin: "En attente de l'accord de l'admin...", cancel: 'Annuler',
    leave: 'Quitter', players: 'Joueurs', need2hint: 'Il faut au moins 2 joueurs pour lancer la partie.',
    adminpanel: '👑 Réglages admin', lang: 'Langue', theme: 'Thème', difficulty: 'Difficulté',
    start: '▶️ Lancer la partie', requests: '🔔 Demandes pour rejoindre',
    invitefriends: '📩 Inviter des amis', invitetip: "Le lien expire au bout de 7 min ⏱️ — reste :",
    viaWA: '💬 WhatsApp', viaIG: '📸 Instagram', viaCopy: '🔗 Copier le code',
    end: 'Terminer', truth: '💬 VÉRITÉ', dare: '🎯 ACTION',
    anshere: 'Ta réponse...', orvoice: '— ou réponds en vocal —',
    record: 'Appuie pour enregistrer', rectip: '(30s max — envoi à l\u2019arrêt)',
    reactwait: 'Réponse donnée ! Réagissez 🔥', nextturn: '⏭️ Tour suivant',
    chatph: 'Message libre...', closed: 'Session fermée',
    closedmsg: 'Tous les messages, audios et données ont été définitivement supprimés. Rien n\u2019a été stocké.',
    home: '🏠 Retour à l\u2019accueil', invitemsg: '🔥 On joue à Vérité ou Action (18+) ! Rejoins ma partie :',
    copied: 'Code copié : ', linkcopied: 'Lien copié ! Colle-le dans Instagram 📸',
    phSpin: '🎡 La roue tourne...', phChooseMe: 'À TOI ! Choisis vite (60s) :', phChoose: 'choisit...',
    phAnswerMe: 'Réponds sans filtrer (2 min) !', phAnswer: 'répond...',
    phReact: '🔥 Réactions ! Tour suivant imminent...', phIdle: '⏸️ Tout le monde est en pause...',
    qverite: 'VÉRITÉ 💬 — réponds sans mentir', qaction: 'ACTION 🎯 — à toi d\u2019oser',
    you: '(toi)', confirmKick: 'Exclure ce joueur ?', confirmPromote: 'Donner le rôle d\u2019admin à ce joueur ?',
    confirmStop: 'Terminer la session ? TOUT sera supprimé (messages + audios).',
    micdenied: 'Micro inaccessible 😬 Vérifie les permissions.', shortrec: 'Trop court ! Enregistre au moins 1 seconde.',
    need18: 'Confirme que tu as 18 ans ou plus 🍾',
    needname: "Choisis d'abord ton pseudo 😄",
    needcode: 'Tape le code du salon (4 lettres) 🔤',
    pauseme: '⏸️ Pause', resume: '▶️ Reprendre', pausetip: 'En pause : tu n\u2019es plus désigné par la roue.',
  },
  en: {
    title: 'TRUTH or DARE', tagline: 'The ultimate adults party game — online, anywhere 🇸🇳',
    ageok: 'I am 18 or older 🍾', yourname: 'Your nickname...', create: '🎓 Create a room (I\u2019ll be admin)',
    or: '— or —', join: '🚪 Join a game',
    consent: '⚠️ Respect and consent required. All content (messages, audios) disappears when the session ends.',
    waitingadmin: "Waiting for the admin's approval...", cancel: 'Cancel',
    leave: 'Leave', players: 'Players', need2hint: 'At least 2 players are needed to start.',
    adminpanel: '👑 Admin settings', lang: 'Language', theme: 'Theme', difficulty: 'Difficulty',
    start: '▶️ Start the game', requests: '🔔 Join requests',
    invitefriends: '📩 Invite friends', invitetip: 'The link expires after 7 min ⏱️ — left:',
    viaWA: '💬 WhatsApp', viaIG: '📸 Instagram', viaCopy: '🔗 Copy code',
    end: 'End', truth: '💬 TRUTH', dare: '🎯 DARE',
    anshere: 'Your answer...', orvoice: '— or answer with a voice note —',
    record: 'Tap to record', rectip: '(30s max — sent on stop)',
    reactwait: 'Answer in! React 🔥', nextturn: '⏭️ Next turn',
    chatph: 'Free chat...', closed: 'Session closed',
    closedmsg: 'All messages, audios and data have been permanently deleted. Nothing was stored.',
    home: '🏠 Back home', invitemsg: '🔥 We are playing Truth or Dare (18+)! Join my game:',
    copied: 'Code copied: ', linkcopied: 'Link copied! Paste it on Instagram 📸',
    phSpin: '🎡 The wheel is spinning...', phChooseMe: 'YOUR TURN! Choose fast (60s):', phChoose: 'is choosing...',
    phAnswerMe: 'Answer, no filter (2 min)!', phAnswer: 'is answering...',
    phReact: '🔥 Reactions! Next turn soon...', phIdle: '⏸️ Everyone is on pause...',
    qverite: 'TRUTH 💬 — answer without lying', qaction: 'DARE 🎯 — dare to do it',
    you: '(you)', confirmKick: 'Kick this player?', confirmPromote: 'Give admin role to this player?',
    confirmStop: 'End the session? EVERYTHING will be deleted (messages + audios).',
    micdenied: 'Microphone unavailable 😬 Check permissions.', shortrec: 'Too short! Record at least 1 second.',
    need18: 'Please confirm you are 18 or older 🍾',
    needname: 'Pick a nickname first 😄',
    needcode: 'Type the room code (4 letters) 🔤',
    pauseme: '⏸️ Pause', resume: '▶️ Resume', pausetip: 'On pause: the wheel will not pick you.',
  },
};
const SYS = {
  fr: {
    joined: (v) => `👋 ${v.name} a rejoint le salon`, left: (v) => `🚪 ${v.name} a quitté la partie`,
    kicked: (v) => `🚫 ${v.name} a été exclu(e) par l'admin`, excluded: (v) => `🚫 ${v.name} est exclu(e) (2 non-réponses)`,
    offline: (v) => `📴 ${v.name} a perdu la connexion (60s avant retrait)`,
    miss: (v) => `⚠️ ${v.name} n'a pas répondu (${v.count}/${v.max}) — au suivant !`,
    skipchoice: (v) => `⌛ ${v.name} n'a pas choisi — la roue retourne !`,
    skipanswer: (v) => `⌛ ${v.name} n'a pas répondu — tour passé !`,
    pauseskip: (v) => `⏸️ ${v.name} est parti(e) en pause — nouveau tirage !`,
    allpaused: () => '😴 Tous les joueurs sont en pause...', gamestart: () => '🔥 C\u2019est parti !',
    admintransfer: (v) => `👑 ${v.name} devient admin`, promoted: (v) => `👑 ${v.name} est promu(e) admin`,
  },
  en: {
    joined: (v) => `👋 ${v.name} joined the room`, left: (v) => `🚪 ${v.name} left the game`,
    kicked: (v) => `🚫 ${v.name} was kicked by the admin`, excluded: (v) => `🚫 ${v.name} was removed (2 no-answers)`,
    offline: (v) => `📴 ${v.name} lost connection (removed in 60s)`,
    miss: (v) => `⚠️ ${v.name} didn't answer (${v.count}/${v.max}) — next!`,
    skipchoice: (v) => `⌛ ${v.name} didn't choose — spinning again!`,
    skipanswer: (v) => `⌛ ${v.name} didn't answer — turn skipped!`,
    pauseskip: (v) => `⏸️ ${v.name} went on pause — new spin!`,
    allpaused: () => '😴 All players are on pause...', gamestart: () => '🔥 Let\u2019s go!',
    admintransfer: (v) => `👑 ${v.name} is now admin`, promoted: (v) => `👑 ${v.name} was promoted admin`,
  },
};
const ERR = {
  fr: { notfound: 'Salon introuvable 😕', full: 'Salon complet (6 max) 😵', expired: 'Lien expiré (> 7 min) — demande un nouveau lien ⏱️', need2: 'Il faut au moins 2 joueurs !', fullsessions: 'Serveur plein (5 sessions max) — réessaie dans un instant 🙏' },
  en: { notfound: 'Room not found 😕', full: 'Room full (6 max) 😵', expired: 'Link expired (> 7 min) — ask for a new one ⏱️', need2: 'At least 2 players needed!', fullsessions: 'Server full (5 sessions max) — try again shortly 🙏' },
};
const tr = (k) => (T[S?.lang || 'fr'][k] ?? T.fr[k] ?? k);
const trE = (k) => (ERR[S?.lang || 'fr'][k] ?? k);

/* ================= Écrans ================= */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $('#' + id).classList.add('active');
}

/* ================= Toast ================= */
let toastTimer = null;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => (t.hidden = true), 3200);
}

/* ================= État de connexion (affiché sur l'accueil) ================= */
function setConn(state) {
  const card = document.querySelector('.home-card');
  if (!card) return;
  let d = document.getElementById('conn-badge');
  if (!d) {
    d = document.createElement('div');
    d.id = 'conn-badge';
    d.style.cssText = 'font-size:13px;font-weight:700;';
    card.prepend(d);
  }
  if (state === 'ok') { d.textContent = '🟢 Connecté au serveur'; d.style.color = 'var(--ok)'; }
  else if (state === 'err') { d.textContent = '🔴 Serveur injoignable — rafraîchis la page'; d.style.color = 'var(--hot)'; }
  else { d.textContent = '🟡 Connexion au serveur...'; d.style.color = 'var(--warn)'; }
}
socket.on('connect', () => setConn('ok'));
socket.on('connect_error', () => setConn('err'));
socket.io.on('reconnect', () => setConn('ok'));
setConn(socket.connected ? 'ok' : 'connecting');

/* ================= Accueil ================= */
function check18() {
  if (!$('#age18').checked) { toast(tr('need18')); return false; }
  return true;
}
$('#btn-create').addEventListener('click', () => {
  if (!check18()) return;
  const name = $('#in-name').value.trim();
  if (!name) { $('#in-name').focus(); toast(tr('needname')); return; }
  socket.emit('room:create', { name, lang: 'fr', theme: 'neon', difficulty: 2 });
});
$('#btn-join').addEventListener('click', () => {
  if (!check18()) return;
  const name = $('#in-name').value.trim();
  const code = $('#in-code').value.trim().toUpperCase();
  if (!name) { $('#in-name').focus(); toast(tr('needname')); return; }
  if (code.length < 4) { $('#in-code').focus(); toast(tr('needcode')); return; }
  myPendingCode = code;
  socket.emit('room:join', { name, code });
});
$('#btn-wait-cancel').addEventListener('click', () => { myPendingCode = null; showScreen('screen-home'); });
$('#btn-back-home').addEventListener('click', () => location.reload());

/* Lien d'invitation #join/CODE */
if (location.hash.startsWith('#join/')) {
  $('#in-code').value = location.hash.slice(6, 10).toUpperCase();
}

/* ================= Socket ================= */
socket.on('error:msg', (d) => { toast(trE(d.key)); showScreen('screen-home'); });
socket.on('join:waiting', () => { $('#wait-code').textContent = myPendingCode || ''; showScreen('screen-wait'); });
socket.on('join:rejected', () => { toast(trE('full')); showScreen('screen-home'); });
socket.on('joined', () => { feedItems.length = 0; $('#feed').innerHTML = ''; });
socket.on('feed:init', (d) => { d.feed.forEach(addFeedItem); renderFeed(); });
socket.on('feed:new', (item) => { addFeedItem(item); renderFeed(); });

socket.on('room:state', (st) => {
  S = st;
  document.body.dataset.theme = st.theme;
  document.documentElement.lang = st.lang;
  applyI18n();
  syncSettingsInputs();
  if (myPendingCode) { myPendingCode = null; }
  if (['lobby'].includes(st.phase)) { renderLobby(); showScreen('screen-lobby'); }
  else { renderGame(); showScreen('screen-game'); }
});

socket.on('wheel', (d) => { spinTo(d.targetId, d.duration || 4200); });

socket.on('reaction', (d) => { spawnEmoji(d.emoji); });

socket.on('room:closed', () => { S = null; showScreen('screen-end'); });

/* ================= i18n application ================= */
function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = tr(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = tr(el.dataset.i18nPh); });
  document.title = tr('title') + ' 🔥 18+';
}

function syncSettingsInputs() {
  if (!S) return;
  $('#set-lang').value = S.lang;
  $('#set-theme').value = S.theme;
  $('#set-difficulty').value = S.difficulty;
}

/* ================= Lobby ================= */
const me = () => (S ? S.players.find(p => p.id === socket.id) : null);

function renderLobby() {
  const m = me();
  $('#lobby-code').textContent = S.code;
  $('#lobby-count').textContent = S.players.length;
  $('#panel-admin').hidden = !(m && m.isAdmin);
  $('#btn-start').disabled = S.players.length < 2;

  const grid = $('#lobby-players'); grid.innerHTML = '';
  for (let i = 0; i < S.maxPlayers; i++) {
    const p = S.players[i];
    const card = document.createElement('div');
    card.className = 'pcard' + (p ? (p.connected ? '' : ' offline') : ' empty');
    if (p) {
      if (p.isAdmin) { const c = document.createElement('div'); c.className = 'crown'; c.textContent = '👑'; card.appendChild(c); }
      const nm = document.createElement('div'); nm.className = 'pname';
      nm.textContent = p.name + (p.id === socket.id ? ' ' + tr('you') : '');
      card.appendChild(nm);
      if (p.misses > 0) { const w = document.createElement('div'); w.textContent = '⚠️'.repeat(p.misses); card.appendChild(w); }
    } else {
      card.textContent = '➕';
    }
    grid.appendChild(card);
  }
  renderPending();
}

function renderPending() {
  // La liste des demandes arrive via l'événement join:pending (stockée dans lastPending)
  const wrap = $('#panel-pending');
  wrap.hidden = !lastPending.length;
  const list = $('#pending-list'); list.innerHTML = '';
  lastPending.forEach(r => {
    const row = document.createElement('div'); row.className = 'pending-item';
    const nm = document.createElement('span'); nm.textContent = r.name; row.appendChild(nm);
    const btns = document.createElement('div'); btns.className = 'btns';
    const ok = document.createElement('button'); ok.className = 'btn small primary'; ok.textContent = '✔️';
    ok.onclick = () => socket.emit('join:respond', { id: r.id, ok: true });
    const no = document.createElement('button'); no.className = 'btn small danger'; no.textContent = '✖️';
    no.onclick = () => socket.emit('join:respond', { id: r.id, ok: false });
    btns.append(ok, no); row.appendChild(btns); list.appendChild(row);
  });
}
let lastPending = [];

socket.on('join:pending', (d) => { lastPending = d.pending; renderPending(); });

/* Réglages admin */
['set-lang', 'set-theme', 'set-difficulty'].forEach(id => {
  $('#' + id).addEventListener('change', () => {
    socket.emit('room:settings', {
      lang: $('#set-lang').value, theme: $('#set-theme').value, difficulty: +$('#set-difficulty').value,
    });
  });
});
$('#btn-start').addEventListener('click', () => socket.emit('game:start'));
$('#btn-leave-lobby').addEventListener('click', confirmLeave);
$('#btn-stop-game').addEventListener('click', () => {
  if (confirm(tr('confirmStop'))) socket.emit('game:stop');
});
function confirmLeave() {
  socket.emit('room:leave'); S = null; showScreen('screen-home');
}

/* ================= Invitations ================= */
function inviteText() {
  return tr('invitemsg') + ' ' + location.origin + '/#/join/' + S.code;
}
function refreshInvite() { socket.emit('invite:refresh'); }
$('#btn-invite-wa').addEventListener('click', () => {
  refreshInvite();
  window.open('https://wa.me/?text=' + encodeURIComponent(inviteText()), '_blank');
});
$('#btn-invite-ig').addEventListener('click', async () => {
  refreshInvite();
  const txt = inviteText();
  try {
    if (navigator.share) { await navigator.share({ text: txt }); return; }
  } catch (e) { /* annulé */ }
  try { await navigator.clipboard.writeText(txt); toast(tr('linkcopied')); } catch (e) { toast(txt); }
});
$('#btn-invite-copy').addEventListener('click', async () => {
  refreshInvite();
  try { await navigator.clipboard.writeText(S.code); toast(tr('copied') + S.code); } catch (e) { toast(S.code); }
});

/* ================= Jeu ================= */
function isTarget() { return S && S.turn && S.turn.targetId === socket.id; }

function renderGame() {
  const m = me(); if (!m) return;
  $('#g-code').textContent = S.code;
  $('#g-diff').textContent = ['', 'Facile 😄', 'Moyen 😏', 'Difficile 🔥'][S.difficulty];
  $('#btn-stop-game').hidden = !m.isAdmin;
  $('#btn-next').hidden = !m.isAdmin;

  // bandeau de phase
  const pt = $('#phase-text');
  const targetP = S.players.find(p => p.id === S.turn?.targetId);
  if (S.phase === 'spinning') pt.textContent = tr('phSpin');
  else if (S.phase === 'choosing') pt.textContent = isTarget() ? tr('phChooseMe') : `🎯 ${targetP?.name || '?'} ${tr('phChoose')}`;
  else if (S.phase === 'answering') pt.textContent = isTarget() ? tr('phAnswerMe') : `💬 ${targetP?.name || '?'} ${tr('phAnswer')}`;
  else if (S.phase === 'reacting') pt.textContent = tr('phReact');
  else pt.textContent = tr('phIdle');

  // minuteur visible ?
  const showTimer = S.turn && S.turn.deadline && ['choosing', 'answering', 'reacting'].includes(S.phase);
  $('#timer-track').hidden = !showTimer;

  // boutons choix
  $('#choice-buttons').hidden = !(S.phase === 'choosing' && isTarget());
  // carte question
  const showQ = S.turn && S.turn.question && ['answering', 'reacting'].includes(S.phase);
  $('#question-card').hidden = !showQ;
  if (showQ) {
    $('#q-type').textContent = S.turn.type === 'verite' ? tr('qverite') : tr('qaction');
    $('#q-text').textContent = S.turn.question;
  }
  // zone de réponse (moi désigné)
  const showAns = S.phase === 'answering' && isTarget() && !S.turn.answered;
  $('#answer-zone').hidden = !showAns;
  // zone réactions
  $('#reacting-zone').hidden = S.phase !== 'reacting';

  renderPlayersStrip();
  drawWheel();
}

function renderPlayersStrip() {
  const wrap = $('#g-players'); wrap.innerHTML = '';
  const m = me();
  S.players.forEach(p => {
    const chip = document.createElement('div');
    chip.className = 'gp' + (p.id === socket.id ? ' me' : '') + (p.paused ? ' paused' : '') +
      (S.turn && S.turn.targetId === p.id ? ' target' : '');
    if (p.isAdmin) { const c = document.createElement('span'); c.textContent = '👑'; chip.appendChild(c); }
    const nm = document.createElement('span'); nm.className = 'nm';
    nm.textContent = p.name + (p.id === socket.id ? ' ' + tr('you') : '');
    chip.appendChild(nm);
    if (p.misses > 0) { const w = document.createElement('span'); w.className = 'warn'; w.textContent = '⚠️' + p.misses; chip.appendChild(w); }
    if (p.paused) { const z = document.createElement('span'); z.className = 'zzz'; z.textContent = p.pauseExpired ? '⏸️>5\u2019' : '⏸️'; chip.appendChild(z); }
    if (!p.connected) { const o = document.createElement('span'); o.textContent = '📴'; chip.appendChild(o); }
    if (m && m.isAdmin && p.id !== socket.id) {
      const kp = document.createElement('button'); kp.className = 'mini'; kp.title = tr('confirmPromote'); kp.textContent = '👑';
      kp.onclick = () => { if (confirm(tr('confirmPromote'))) socket.emit('player:promote', { id: p.id }); };
      const kx = document.createElement('button'); kx.className = 'mini red'; kx.title = tr('confirmKick'); kx.textContent = '✖';
      kx.onclick = () => { if (confirm(tr('confirmKick'))) socket.emit('player:kick', { id: p.id }); };
      chip.append(kp, kx);
    }
    wrap.appendChild(chip);
  });
  // bouton pause perso
  const pb = document.createElement('button');
  pb.className = 'btn small';
  pb.textContent = m.paused ? tr('resume') : tr('pauseme');
  pb.title = tr('pausetip');
  pb.onclick = () => socket.emit('player:pause', { paused: !m.paused });
  wrap.appendChild(pb);
}

/* ---------- Roue ---------- */
const COLORS = ['#ff2e63', '#7c4dff', '#21c07a', '#ff9f1c', '#3d8bff', '#ff5ca8'];
let wheelRot = -Math.PI / 2, wheelAnim = null;

function drawWheel() {
  const cv = $('#wheel'); if (!cv) return;
  const ctx = cv.getContext('2d');
  const W = cv.width, cx = W / 2, cy = W / 2, R = W / 2 - 12;
  ctx.clearRect(0, 0, W, W);
  const ps = S ? S.players : [];
  const n = Math.max(ps.length, 2), seg = (2 * Math.PI) / n;

  ctx.save(); ctx.translate(cx, cy); ctx.rotate(wheelRot);
  for (let i = 0; i < n; i++) {
    const p = ps[i];
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, R, i * seg, (i + 1) * seg); ctx.closePath();
    ctx.fillStyle = p ? COLORS[i % COLORS.length] : '#20203a';
    ctx.globalAlpha = p ? (p.connected ? 1 : 0.35) : 0.25;
    ctx.fill(); ctx.globalAlpha = 1;
    if (p && S?.turn && S.turn.targetId === p.id) { ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 7; ctx.stroke(); }
    ctx.save();
    ctx.rotate(i * seg + seg / 2); ctx.translate(R * 0.58, 0); ctx.rotate(Math.PI / 2);
    ctx.fillStyle = '#fff'; ctx.font = '800 34px system-ui, sans-serif'; ctx.textAlign = 'center';
    if (p) ctx.fillText(p.name.length > 10 ? p.name.slice(0, 9) + '…' : p.name, 0, 12);
    ctx.restore();
  }
  ctx.restore();

  // moyeu
  ctx.beginPath(); ctx.arc(cx, cy, 40, 0, Math.PI * 2);
  ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--card').trim() || '#1b1b36';
  ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = '#ffffff22'; ctx.stroke();
  ctx.font = '38px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('🌶️', cx, cy + 2);
  ctx.textBaseline = 'alphabetic';
}

function spinTo(targetId, duration) {
  if (wheelAnim) cancelAnimationFrame(wheelAnim);
  if (!S) return;
  const ps = S.players, i = ps.findIndex(p => p.id === targetId);
  if (i < 0) return;
  const n = Math.max(ps.length, 2), seg = (2 * Math.PI) / n;
  const desired = -Math.PI / 2 - (i * seg + seg / 2);
  let final = desired;
  while (final < wheelRot + 6 * 2 * Math.PI) final += 2 * Math.PI;
  const start = wheelRot, t0 = performance.now();
  const frame = (t) => {
    const k = Math.min(1, (t - t0) / duration);
    const e = 1 - Math.pow(1 - k, 3);
    wheelRot = start + (final - start) * e;
    drawWheel();
    if (k < 1) wheelAnim = requestAnimationFrame(frame);
    else drawWheel();
  };
  wheelAnim = requestAnimationFrame(frame);
}

/* ---------- Choix / réponse ---------- */
$('#btn-verite').addEventListener('click', () => socket.emit('turn:choose', { type: 'verite' }));
$('#btn-action').addEventListener('click', () => socket.emit('turn:choose', { type: 'action' }));
$('#btn-next').addEventListener('click', () => socket.emit('turn:next'));

function sendAnswer() {
  const v = $('#in-answer').value.trim();
  if (!v) return;
  $('#in-answer').value = '';
  socket.emit('chat:text', { text: v });
}
$('#btn-send-answer').addEventListener('click', sendAnswer);
$('#in-answer').addEventListener('keydown', (e) => { if (e.key === 'Enter') sendAnswer(); });

function sendChat() {
  const v = $('#in-chat').value.trim();
  if (!v) return;
  $('#in-chat').value = '';
  socket.emit('chat:text', { text: v });
}
$('#btn-send-chat').addEventListener('click', sendChat);
$('#in-chat').addEventListener('keydown', (e) => { if (e.key === 'Enter') sendChat(); });

/* ---------- Réactions ---------- */
const REA = ['🔥', '😂', '😍', '😱', '👏', '❤️', '💀', '🥵'];
const rrow = $('#reactions');
REA.forEach(e => {
  const b = document.createElement('button');
  b.textContent = e;
  b.onclick = () => socket.emit('reaction', { emoji: e });
  rrow.appendChild(b);
});
function spawnEmoji(e) {
  const d = document.createElement('div');
  d.className = 'femoji'; d.textContent = e;
  d.style.left = (8 + Math.random() * 84) + 'vw';
  $('#float-emojis').appendChild(d);
  setTimeout(() => d.remove(), 2700);
}

/* ---------- Feed / chat ---------- */
function addFeedItem(item) { feedItems.push(item); if (feedItems.length > 60) feedItems.shift(); }
function renderFeed() {
  const f = $('#feed');
  f.innerHTML = '';
  feedItems.forEach(item => {
    const el = document.createElement('div');
    if (item.kind === 'sys') {
      el.className = 'msg sys';
      const fn = SYS[S?.lang || 'fr'][item.key];
      el.textContent = fn ? fn(item.vars || {}) : item.key;
    } else if (item.kind === 'audio' || item.kind === 'answer-audio') {
      el.className = 'msg' + (item.kind === 'answer-audio' ? ' answer' : '');
      const who = document.createElement('div'); who.className = 'who';
      who.textContent = (item.kind === 'answer-audio' ? '🎙️ ' : '') + item.name;
      const bub = document.createElement('div'); bub.className = 'audio-bubble';
      const play = document.createElement('span'); play.className = 'play'; play.textContent = '▶';
      const dur = document.createElement('span'); dur.textContent = Math.round((item.ms || 0) / 1000) + 's';
      bub.append(play, dur);
      bub.onclick = () => { try { new Audio(item.b64).play(); } catch (e) {} };
      el.append(who, bub);
    } else {
      el.className = 'msg' + (item.kind === 'answer' ? ' answer' : '');
      const who = document.createElement('div'); who.className = 'who';
      who.textContent = (item.kind === 'answer' ? '💬 ' : '') + item.name;
      const tx = document.createElement('div'); tx.textContent = item.text;
      el.append(who, tx);
    }
    f.appendChild(el);
  });
  f.scrollTop = f.scrollHeight;
}

/* ---------- Enregistrement audio ---------- */
let recorder = null, recChunks = [], recT0 = 0, recInt = null, recStream = null;
function pickMime() {
  if (!window.MediaRecorder) return '';
  const cands = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus', 'audio/mpeg'];
  return cands.find(m => MediaRecorder.isTypeSupported(m)) || '';
}
function blobToDataUrl(blob) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result); r.onerror = rej;
    r.readAsDataURL(blob);
  });
}
async function toggleRec() {
  if (recorder && recorder.state === 'recording') { recorder.stop(); return; }
  try {
    recStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch (e) { toast(tr('micdenied')); return; }
  const mime = pickMime();
  try { recorder = new MediaRecorder(recStream, mime ? { mimeType: mime } : undefined); }
  catch (e) { toast(tr('micdenied')); recStream.getTracks().forEach(t => t.stop()); return; }
  recChunks = [];
  recorder.ondataavailable = (e) => { if (e.data && e.data.size) recChunks.push(e.data); };
  recorder.onstop = () => {
    clearInterval(recInt);
    $('#btn-mic').classList.remove('rec');
    $('#rec-info').hidden = true;
    recStream.getTracks().forEach(t => t.stop());
    const dur = now() - recT0;
    if (dur < 600) { toast(tr('shortrec')); return; }
    const blob = new Blob(recChunks, { type: recorder.mimeType || 'audio/webm' });
    blobToDataUrl(blob).then(u => socket.emit('chat:audio', { b64: u, ms: dur })).catch(() => {});
  };
  recorder.start();
  recT0 = now();
  $('#btn-mic').classList.add('rec');
  $('#rec-info').hidden = false;
  $('#rec-time').textContent = '0s';
  recInt = setInterval(() => { $('#rec-time').textContent = Math.floor((now() - recT0) / 1000) + 's'; }, 250);
  setTimeout(() => { if (recorder && recorder.state === 'recording') recorder.stop(); }, 30000);
}
$('#btn-mic').addEventListener('click', toggleRec);

/* ================= Boucle des minuteurs ================= */
const PHASE_DUR = { choosing: 60000, answering: 120000, reacting: 25000 };
setInterval(() => {
  // barre de tour
  if (S && S.turn && S.turn.deadline && PHASE_DUR[S.phase]) {
    const total = PHASE_DUR[S.phase];
    const left = Math.max(0, S.turn.deadline - now());
    $('#timer-fill').style.width = (100 * left / total) + '%';
  }
  // compte à rebours du lien d'invitation
  if (S) {
    const el = $('#invite-countdown');
    if (el && $('#screen-lobby').classList.contains('active')) {
      const left = Math.max(0, S.inviteExpiresAt - now());
      const mm = Math.floor(left / 60000), ss = Math.floor((left % 60000) / 1000);
      el.textContent = mm + ':' + String(ss).padStart(2, '0');
      el.style.color = left < 60000 ? 'var(--hot)' : '';
    }
  }
}, 200);

/* Redessine la roue quand les joueurs changent (hors animation) */
setInterval(() => { if (S && !wheelAnim && !$('#screen-game').classList.contains('active')) drawWheel(); }, 1000);
window.addEventListener('resize', () => drawWheel());
drawWheel();
applyI18n();
