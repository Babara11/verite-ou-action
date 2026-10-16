'use strict';
/*
 * VÉRITÉ OU ACTION 18+ — Serveur de jeu (prototype)
 * - Max 5 sessions simultanées, 2 à 6 joueurs par session
 * - Invitation valable 7 minutes (rafraîchie à chaque fois que l'admin partage)
 * - Roue qui désigne un joueur → 60s pour choisir Vérité ou Action
 * - 120s pour répondre (texte ou audio), sinon "non-réponse" comptée
 * - 2 non-réponses = exclusion automatique
 * - Pause : le joueur n'est plus désigné ; > 5 min de pause = exclu par l'admin (manuel)
 * - Si l'admin quitte, son rôle est transféré automatiquement
 * - Tout est en mémoire vive : à la fermeture de la session, TOUT est supprimé
 */
const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const BANKS = { fr: require('./questions.fr.json'), en: require('./questions.en.json') };

const MAX_ROOMS = 5, MAX_PLAYERS = 6, MIN_PLAYERS = 2;
const INVITE_TTL = 7 * 60 * 1000;          // le lien expire au bout de 7 minutes
const CHOICE_TIME = 60 * 1000;             // 1 min pour choisir Action ou Vérité
const ANSWER_TIME = 120 * 1000;            // 2 min pour répondre
const REACT_TIME = 25 * 1000;              // fenêtre de réactions après la réponse
const SPIN_TIME = 4200;                    // durée de l'animation de la roue
const PAUSE_LIMIT = 5 * 60 * 1000;         // pause > 5 min => exclu possible par l'admin
const GRACE = 60 * 1000;                   // délai de reconnexion avant d'être retiré
const MAX_MISSES = 2;
const FEED_MAX = 40;
const AUDIO_MAX = 1600000;                 // ~1,2 Mo d'audio en base64
const TEXT_MAX = 300, NAME_MAX = 14;
const EMOJIS = ['🔥','😂','😍','😱','👏','❤️','💀','🥵'];

const rooms = new Map();
const socketRoom = new Map();   // socketId -> room (fonctionne pour admin ET joueurs)

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
const server = http.createServer(app);
const io = new Server(server, { maxHttpBufferSize: 2e6 });

/* ---------------- Utilitaires ---------------- */
function genCode() {
  const A = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let c;
  do { c = Array.from({ length: 4 }, () => A[Math.floor(Math.random() * A.length)]).join(''); }
  while (rooms.has(c));
  return c;
}
const cleanName = (n) => String(n || '').replace(/\s+/g, ' ').trim().slice(0, NAME_MAX) || 'Joueur';
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/* ---------------- État d'une room ---------------- */
function createRoom(socket, { name, lang, theme, difficulty }) {
  const room = {
    code: genCode(),
    lang: lang === 'en' ? 'en' : 'fr',
    theme: ['neon', 'nuit', 'rose'].includes(theme) ? theme : 'neon',
    difficulty: [1, 2, 3].includes(+difficulty) ? +difficulty : 2,
    createdAt: Date.now(),
    inviteAt: Date.now(),
    lastEmptyAt: 0,
    players: new Map(),        // socketId -> player
    pending: [],               // demandes de.join {id, name, at}
    phase: 'lobby',            // lobby | spinning | choosing | answering | reacting | idle
    turn: null,
    lastTargetId: null,
    used: new Set(),
    timer: null,
    feed: [],
  };
  rooms.set(room.code, room);
  addPlayer(room, socket, name, true);
  return room;
}

function addPlayer(room, socket, name, isAdmin) {
  const p = {
    id: socket.id, name,
    isAdmin: !!isAdmin,
    misses: 0, paused: false, pausedAt: 0,
    connected: true, disconnectedAt: 0,
    joinedAt: Date.now(),
  };
  room.players.set(socket.id, p);
  socket.join(room.code);
  socketRoom.set(socket.id, room);
  sysFeed(room, 'joined', { name });
  return p;
}

function serialize(room) {
  const now = Date.now();
  return {
    code: room.code,
    phase: room.phase,
    lang: room.lang,
    theme: room.theme,
    difficulty: room.difficulty,
    inviteExpiresAt: room.inviteAt + INVITE_TTL,
    inviteFresh: now < room.inviteAt + INVITE_TTL,
    players: [...room.players.values()]
      .sort((a, b) => a.joinedAt - b.joinedAt)
      .map(p => ({
        id: p.id, name: p.name, isAdmin: p.isAdmin, misses: p.misses,
        paused: p.paused, pausedAt: p.pausedAt, connected: p.connected,
        pauseExpired: p.paused && now - p.pausedAt > PAUSE_LIMIT,
      })),
    turn: room.turn ? {
      targetId: room.turn.targetId,
      type: room.turn.type || null,
      question: room.turn.question || null,
      deadline: room.turn.deadline || 0,
      answered: !!room.turn.answered,
    } : null,
    maxPlayers: MAX_PLAYERS,
    maxMisses: MAX_MISSES,
  };
}
const broadcast = (room) => io.to(room.code).emit('room:state', serialize(room));

function pushFeed(room, item) {
  item.ts = Date.now();
  room.feed.push(item);
  if (room.feed.length > FEED_MAX) room.feed.splice(0, room.feed.length - FEED_MAX);
  io.to(room.code).emit('feed:new', item);
}
function sysFeed(room, key, vars = {}) { pushFeed(room, { kind: 'sys', key, vars }); }

/* ---------------- Machine à états du tour ---------------- */
function clearTimer(room) { if (room.timer) { clearTimeout(room.timer); room.timer = null; } }

function availablePlayers(room) {
  return [...room.players.values()].filter(p => p.connected && !p.paused);
}

function nextTurn(room) {
  clearTimer(room);
  room.turn = null;
  const pool = availablePlayers(room);
  if (pool.length === 0) {
    room.phase = 'idle';
    sysFeed(room, 'allpaused');
    room.timer = setTimeout(() => nextTurn(room), 5000);
    broadcast(room);
    return;
  }
  let candidates = pool.filter(p => p.id !== room.lastTargetId);
  if (candidates.length === 0) candidates = pool;
  const target = pick(candidates);
  room.lastTargetId = target.id;
  room.phase = 'spinning';
  room.turn = { targetId: target.id };
  io.to(room.code).emit('wheel', { targetId: target.id, duration: SPIN_TIME });
  room.timer = setTimeout(() => beginChoosing(room), SPIN_TIME);
  broadcast(room);
}

function beginChoosing(room) {
  const t = room.players.get(room.turn?.targetId);
  if (!t || !t.connected || t.paused) return nextTurn(room);
  room.phase = 'choosing';
  room.turn = { targetId: t.id, deadline: Date.now() + CHOICE_TIME };
  room.timer = setTimeout(() => {
    if (registerMiss(room, t)) return;
    sysFeed(room, 'skipchoice', { name: t.name });
    nextTurn(room);
  }, CHOICE_TIME);
  broadcast(room);
}

function beginAnswering(room, type) {
  const t = room.players.get(room.turn.targetId);
  const q = drawQuestion(room, type);
  room.phase = 'answering';
  room.turn = { targetId: t.id, type, question: q, deadline: Date.now() + ANSWER_TIME, answered: false };
  room.timer = setTimeout(() => {
    if (registerMiss(room, t)) return;
    sysFeed(room, 'skipanswer', { name: t.name });
    nextTurn(room);
  }, ANSWER_TIME);
  broadcast(room);
}

function beginReacting(room) {
  clearTimer(room);
  room.turn.answered = true;
  room.phase = 'reacting';
  room.turn.deadline = Date.now() + REACT_TIME;
  room.timer = setTimeout(() => nextTurn(room), REACT_TIME);
  broadcast(room);
}

/* Retourne true si le joueur vient d'être exclu automatiquement */
function registerMiss(room, player) {
  player.misses += 1;
  if (player.misses >= MAX_MISSES) {
    sysFeed(room, 'excluded', { name: player.name });
    removePlayer(room, player.id, null, true);
    return true;
  }
  sysFeed(room, 'miss', { name: player.name, count: player.misses, max: MAX_MISSES });
  broadcast(room);
  return false;
}

function removePlayer(room, id, reason, auto) {
  const p = room.players.get(id);
  if (!p) return;
  room.players.delete(id);
  socketRoom.delete(id);
  room.pending = room.pending.filter(r => r.id !== id);
  if (auto) { /* message déjà envoyé (exclusion) */ }
  else sysFeed(room, reason === 'kicked' ? 'kicked' : 'left', { name: p.name });

  const wasTarget = room.turn && room.turn.targetId === id;
  const midTurn = ['spinning', 'choosing', 'answering'].includes(room.phase);
  const wasAdmin = p.isAdmin;

  if (room.players.size === 0) { room.lastEmptyAt = Date.now(); broadcastOrCleanup(room); return; }

  if (wasAdmin) transferAdmin(room);
  if (wasTarget && midTurn) { nextTurn(room); return; }
  broadcast(room);
}

function transferAdmin(room) {
  const next = [...room.players.values()].sort((a, b) => a.joinedAt - b.joinedAt)
    .find(p => p.connected) || [...room.players.values()][0];
  if (!next) return;
  room.players.forEach(p => (p.isAdmin = false));
  next.isAdmin = true;
  sysFeed(room, 'admintransfer', { name: next.name });
}

function closeRoom(room, reason) {
  clearTimer(room);
  io.to(room.code).emit('room:closed', { reason });
  room.players.forEach((_, id) => socketRoom.delete(id));
  rooms.delete(room.code); // 🔥 tout disparaît : feed, audios, joueurs
}

function broadcastOrCleanup(room) { broadcast(room); }

function drawQuestion(room, type) {
  const bank = BANKS[room.lang][room.difficulty][type];
  const prefix = `${room.lang}:${room.difficulty}:${type}:`;
  let idxs = bank.map((_, i) => i).filter(i => !room.used.has(prefix + i));
  if (idxs.length === 0) {
    bank.forEach((_, i) => room.used.delete(prefix + i));
    idxs = bank.map((_, i) => i);
  }
  const i = pick(idxs);
  room.used.add(prefix + i);
  return bank[i];
}

/* ---------------- Socket.io ---------------- */
io.on('connection', (socket) => {

  socket.on('room:create', (data = {}) => {
    if (socketRoom.has(socket.id)) return;
    if (rooms.size >= MAX_ROOMS) return socket.emit('error:msg', { key: 'fullsessions' });
    const room = createRoom(socket, {
      name: cleanName(data.name), lang: data.lang, theme: data.theme, difficulty: data.difficulty,
    });
    socket.emit('joined', { code: room.code });
    broadcast(room);
  });

  socket.on('room:join', (data = {}) => {
    if (socketRoom.has(socket.id)) return;
    const room = rooms.get(String(data.code || '').toUpperCase().trim());
    const name = cleanName(data.name);
    if (!room) return socket.emit('error:msg', { key: 'notfound' });
    if (room.players.size >= MAX_PLAYERS) return socket.emit('error:msg', { key: 'full' });
    if (Date.now() >= room.inviteAt + INVITE_TTL) return socket.emit('error:msg', { key: 'expired' });
    room.pending = room.pending.filter(r => r.name.toLowerCase() !== name.toLowerCase());
    room.pending.push({ id: socket.id, name, at: Date.now() });
    room.pending = room.pending.filter(r => Date.now() - r.at < 60000).slice(-4);
    socket.join(room.code); // reçoit les états en attente de validation
    socket.emit('join:waiting', { code: room.code });
    io.to(room.code).emit('join:pending', { pending: room.pending.map(r => ({ id: r.id, name: r.name })) });
  });

  socket.on('join:respond', ({ id, ok } = {}) => {
    const room = socketRoom.get(socket.id); if (!room || room.closed) return;
    const me = room.players.get(socket.id); if (!me || !me.isAdmin) return;
    const req = room.pending.find(r => r.id === id);
    if (!req) return;
    room.pending = room.pending.filter(r => r.id !== id);
    io.to(room.code).emit('join:pending', { pending: room.pending.map(r => ({ id: r.id, name: r.name })) });
    const targetSock = io.sockets.sockets.get(id);
    if (!ok || !targetSock) {
      io.to(id).emit('join:rejected');                            // si le socket revit
      io.to(socket.id).emit('join:failed', { name: req.name });   // feedback admin : la personne a perdu la connexion
      return;
    }
    if (room.players.size >= MAX_PLAYERS) { io.to(id).emit('error:msg', { key: 'full' }); return; }
    const p = addPlayer(room, targetSock, req.name, false);
    targetSock.emit('joined', { code: room.code });
    io.to(id).emit('feed:init', { feed: room.feed.slice(-FEED_MAX) });
    broadcast(room);
  });

  socket.on('room:rejoin', (data = {}) => {
    if (socketRoom.has(socket.id)) return;
    const room = rooms.get(String(data.code || '').toUpperCase().trim());
    const name = cleanName(data.name);
    if (!room) return socket.emit('error:msg', { key: 'notfound' });
    // Reprendre la place d'un joueur du même nom (refresh, reconnexion, onglet rouvert)
    const p = [...room.players.values()].find(pl => pl.name.toLowerCase() === name.toLowerCase());
    if (p) {
      room.players.delete(p.id);
      socketRoom.delete(p.id);
      p.id = socket.id; p.connected = true; p.disconnectedAt = 0;
      room.players.set(socket.id, p);
      socket.join(room.code);
      socketRoom.set(socket.id, room);
      socket.emit('joined', { code: room.code });
      io.to(socket.id).emit('feed:init', { feed: room.feed.slice(-FEED_MAX) });
      sysFeed(room, 'rejoined', { name });
      broadcast(room);
      return;
    }
    // Sinon : demande classique (si lien valide et place disponible)
    if (room.players.size >= MAX_PLAYERS) return socket.emit('error:msg', { key: 'full' });
    if (Date.now() >= room.inviteAt + INVITE_TTL) {
      room.inviteAt = Date.now() - INVITE_TTL; // expiré : on refuse, l'admin devra repartager
      return socket.emit('error:msg', { key: 'expired' });
    }
    room.pending = room.pending.filter(r => r.name.toLowerCase() !== name.toLowerCase());
    room.pending.push({ id: socket.id, name, at: Date.now() });
    room.pending = room.pending.filter(r => Date.now() - r.at < 60000).slice(-4);
    socket.join(room.code);
    socket.emit('join:waiting', { code: room.code });
    io.to(room.code).emit('join:pending', { pending: room.pending.map(r => ({ id: r.id, name: r.name })) });
  });

  socket.on('room:leave', () => {
    const room = socketRoom.get(socket.id);
    if (!room || room.closed) return;
    removePlayer(room, socket.id, 'left');
  });

  socket.on('room:settings', (data = {}) => {
    const room = socketRoom.get(socket.id); if (!room || room.closed) return;
    const me = room.players.get(socket.id); if (!me || !me.isAdmin) return;
    if (data.lang) room.lang = data.lang === 'en' ? 'en' : 'fr';
    if (data.theme && ['neon', 'nuit', 'rose'].includes(data.theme)) room.theme = data.theme;
    if (data.difficulty) room.difficulty = [1, 2, 3].includes(+data.difficulty) ? +data.difficulty : room.difficulty;
    broadcast(room);
  });

  socket.on('invite:refresh', () => {
    const room = socketRoom.get(socket.id); if (!room || room.closed) return;
    const me = room.players.get(socket.id); if (!me || !me.isAdmin) return;
    room.inviteAt = Date.now();
    broadcast(room);
  });

  socket.on('game:start', () => {
    const room = socketRoom.get(socket.id); if (!room || room.closed) return;
    const me = room.players.get(socket.id); if (!me || !me.isAdmin) return;
    if (room.players.size < MIN_PLAYERS) return socket.emit('error:msg', { key: 'need2' });
    sysFeed(room, 'gamestart');
    nextTurn(room);
  });

  socket.on('turn:choose', ({ type } = {}) => {
    const room = socketRoom.get(socket.id); if (!room || room.closed) return;
    if (room.phase !== 'choosing' || !room.turn) return;
    if (socket.id !== room.turn.targetId) return;
    if (!['verite', 'action'].includes(type)) return;
    clearTimer(room);
    beginAnswering(room, type);
  });

  socket.on('turn:next', () => {
    const room = socketRoom.get(socket.id); if (!room || room.closed) return;
    const me = room.players.get(socket.id); if (!me || !me.isAdmin) return;
    if (['spinning', 'choosing', 'answering', 'reacting', 'idle'].includes(room.phase)) nextTurn(room);
  });

  socket.on('chat:text', ({ text } = {}) => {
    const room = socketRoom.get(socket.id); if (!room || room.closed) return;
    const p = room.players.get(socket.id); if (!p || !p.connected) return;
    const t = String(text || '').trim().slice(0, TEXT_MAX);
    if (!t) return;
    const isAnswer = room.phase === 'answering' && room.turn && room.turn.targetId === socket.id && !room.turn.answered;
    if (isAnswer) {
      pushFeed(room, { kind: 'answer', mid: socket.id, name: p.name, text: t });
      beginReacting(room);
    } else {
      pushFeed(room, { kind: 'text', mid: socket.id, name: p.name, text: t });
    }
  });

  socket.on('chat:audio', ({ b64, ms } = {}) => {
    const room = socketRoom.get(socket.id); if (!room || room.closed) return;
    const p = room.players.get(socket.id); if (!p || !p.connected) return;
    if (typeof b64 !== 'string' || !b64.startsWith('data:audio') || b64.length > AUDIO_MAX) return;
    const dur = Math.min(+ms || 0, 31000);
    const isAnswer = room.phase === 'answering' && room.turn && room.turn.targetId === socket.id && !room.turn.answered;
    if (isAnswer) {
      pushFeed(room, { kind: 'answer-audio', mid: socket.id, name: p.name, b64, ms: dur });
      beginReacting(room);
    } else {
      pushFeed(room, { kind: 'audio', mid: socket.id, name: p.name, b64, ms: dur });
    }
  });

  socket.on('reaction', ({ emoji } = {}) => {
    const room = socketRoom.get(socket.id); if (!room || room.closed) return;
    const p = room.players.get(socket.id); if (!p) return;
    if (!EMOJIS.includes(emoji)) return;
    io.to(room.code).emit('reaction', { emoji, name: p.name });
  });

  socket.on('player:pause', ({ paused } = {}) => {
    const room = socketRoom.get(socket.id); if (!room || room.closed) return;
    const p = room.players.get(socket.id); if (!p) return;
    p.paused = !!paused;
    p.pausedAt = p.paused ? Date.now() : 0;
    const isTarget = room.turn && room.turn.targetId === socket.id;
    if (p.paused && isTarget && ['choosing', 'answering'].includes(room.phase)) {
      sysFeed(room, 'pauseskip', { name: p.name });
      nextTurn(room);
      return;
    }
    broadcast(room);
  });

  socket.on('player:kick', ({ id } = {}) => {
    const room = socketRoom.get(socket.id); if (!room || room.closed) return;
    const me = room.players.get(socket.id); if (!me || !me.isAdmin) return;
    if (id === socket.id) return;
    removePlayer(room, id, 'kicked');
  });

  socket.on('player:promote', ({ id } = {}) => {
    const room = socketRoom.get(socket.id); if (!room || room.closed) return;
    const me = room.players.get(socket.id); if (!me || !me.isAdmin) return;
    const target = room.players.get(id); if (!target) return;
    room.players.forEach(p => (p.isAdmin = false));
    target.isAdmin = true;
    sysFeed(room, 'promoted', { name: target.name });
    broadcast(room);
  });

  socket.on('game:stop', () => {
    const room = socketRoom.get(socket.id); if (!room || room.closed) return;
    const me = room.players.get(socket.id); if (!me || !me.isAdmin) return;
    closeRoom(room, 'stopped');
  });

  socket.on('disconnect', () => {
    const room = socketRoom.get(socket.id); if (!room || room.closed) return;
    // visiteur en attente qui se déconnecte → on retire sa demande
    if (room.pending.some(r => r.id === socket.id)) {
      room.pending = room.pending.filter(r => r.id !== socket.id);
      io.to(room.code).emit('join:pending', { pending: room.pending.map(r => ({ id: r.id, name: r.name })) });
    }
    const p = room.players.get(socket.id); if (!p) return;
    p.connected = false;
    p.disconnectedAt = Date.now();
    sysFeed(room, 'offline', { name: p.name });
    const isTarget = room.turn && room.turn.targetId === socket.id;
    if (isTarget && ['choosing', 'answering'].includes(room.phase)) { nextTurn(room); return; }
    broadcast(room);
    setTimeout(() => {
      const cur = room.players.get(socket.id);
      if (cur && !cur.connected) removePlayer(room, socket.id, 'left');
    }, GRACE);
  });
});

/* ---------------- Nettoyage périodique ---------------- */
setInterval(() => {
  const now = Date.now();
  for (const [code, room] of rooms) {
    if (room.players.size === 0 && room.lastEmptyAt && now - room.lastEmptyAt > 60000) {
      rooms.delete(code); // session vide → tout est supprimé
    }
  }
}, 10000);

server.listen(process.env.PORT || 3000, '0.0.0.0', () => {
  console.log('🔥 Vérité ou Action (18+) — serveur démarré sur le port', process.env.PORT || 3000);
});
