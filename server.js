'use strict';
/* ═══════════════════════════════════════════════════════════════════
   🌶️ VÉRITÉ OU ACTION 18+ — VERSION 8 « ULTRA SIMPLE »
   TOUT EST DANS CE FICHIER : serveur + page web + style + questions.
   Déploiement = remplacer CE fichier, rien d'autre.
   ═══════════════════════════════════════════════════════════════════ */
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

/* ---------------- Réglages du jeu ---------------- */
const MAX_ROOMS = 5, MAX_PLAYERS = 6;
const INVITE_TTL = 7 * 60 * 1000;     // lien valable 7 minutes
const SPIN_TIME = 4000;               // durée de la roue
const CHOICE_TIME = 60 * 1000;        // 1 min pour choisir Vérité/Action
const ANSWER_TIME = 120 * 1000;       // 2 min pour répondre
const REACT_TIME = 20 * 1000;         // réactions puis tour suivant
const MAX_MISSES = 2;                 // 2 non-réponses = exclu
const AUDIO_MAX = 1600000;

/* ---------------- Questions (français, 3 niveaux) ---------------- */
const QUESTIONS = {
  1: {
    verite: [
      "C'est quoi ton plus mauvais plan séduction ? Raconte le crash.",
      "As-tu déjà envoyé un message coquin à la mauvaise personne ?",
      "Qui a été la dernière personne que tu as embrassée ?",
      "As-tu déjà eu un crush sur un(e) prof ?",
      "C'est quoi le mensonge le plus bidon que tu aies dit pour éviter un rencard ?",
      "As-tu déjà stalké le profil de ton crush jusqu'à une photo de 2015 ?",
      "C'est quoi ton plus grand complexe physique ?",
      "As-tu déjà menti sur ton âge ? Pour quoi faire ?",
      "Combien de personnes as-tu embrassées cette année ?",
      "C'est quoi le surnom le plus honteux qu'on t'ait donné ?",
      "As-tu déjà relu 15 fois un message avant de répondre à ton crush ?",
      "As-tu déjà déclaré tes feelings par texto, par peur de le faire en vrai ?"
    ],
    action: [
      "Fais le compliment le plus chaud possible à la personne à ta gauche.",
      "Envoie 🔥 au 5e contact de ta liste de discussions récentes.",
      "Danse 30 secondes sur ton titre préféré.",
      "Imite ton meilleur move de séduction.",
      "Regarde fixement la caméra 20 secondes sans rire.",
      "Chante le refrain d'une chanson d'amour avec un maximum d'émotion.",
      "Fais une déclaration dramatique à un objet de ta pièce.",
      "Montre la 6e photo de ta galerie. Pas de triche.",
      "Rejoue une scène de film romantique en jouant les deux rôles.",
      "Envoie un vocal « je pense trop à toi » à ton crush... ou à ta mère 😄",
      "Garde ton plus beau sourire de mannequin 15 secondes.",
      "Laisse les joueurs choisir ta nouvelle photo de profil pour 24h."
    ]
  },
  2: {
    verite: [
      "Décris ton premier baiser : âge, lieu, ambiance. Détails exigés.",
      "As-tu déjà couché avec quelqu'un dès le premier soir ?",
      "C'est quoi le fantasme que tu n'as jamais raconté à personne ?",
      "As-tu déjà été surpris(e) en pleine action ? Par qui ?",
      "Quel est l'endroit le plus insolite où tu as fait l'amour ?",
      "As-tu déjà envoyé une photo osée ? À qui ?",
      "As-tu déjà fantasmé sur quelqu'un de ton entourage proche ?",
      "As-tu déjà simulé ? Environ combien de fois ? 😅",
      "C'est quoi la chose la plus folle que tu aies dite au lit ?",
      "As-tu déjà craqué pour un(e) ami(e) déjà en couple ?",
      "As-tu déjà eu une histoire avec quelqu'un de beaucoup plus âgé ou plus jeune ?",
      "Ton pire baiser de ta vie ? Raconte la catastrophe."
    ],
    action: [
      "Fais un strip-tease d'UN seul vêtement. Les chaussettes ne comptent pas 😄",
      "Envoie un message très chaud à ton crush.",
      "Raconte ta dernière nuit chaude comme un conte de fées.",
      "Mime (sans mots) ta position préférée. Le groupe doit deviner.",
      "Envoie un vocal où tu gémis le mot « encore » de façon théâtrale 😏",
      "Fais un compliment salé à chaque joueur, un par un.",
      "Danse comme dans un clip... mode séduction activée 🔥",
      "Imite ton meilleur regard « invitation au péché ».",
      "Envoie un selfie « bonne nuit » sous ta plus belle lumière au joueur de ton choix.",
      "Laisse l'admin écrire un message coquin que tu dois envoyer à un contact.",
      "Chante un couplet transformé en déclaration très hot adressée à un joueur.",
      "Fais un slow très rapproché avec ta caméra."
    ]
  },
  3: {
    verite: [
      "C'est la chose la plus folle que tu aies faite au lit ? Sans filtre.",
      "As-tu déjà eu une aventure avec quelqu'un déjà en couple ?",
      "Ta position préférée ? Le groupe exige des détails.",
      "As-tu déjà fantasmé sur quelqu'un présent dans cette partie ? Qui ? 😏",
      "Le plus grand nombre de rounds en une seule nuit ? Donne le chiffre.",
      "As-tu déjà simulé l'orgasme pour sauver la situation ? Raconte.",
      "Ta plus courte aventure : combien de temps ça a duré ? 😅",
      "As-tu déjà couché avec un(e) collègue ou un(e) camarade ?",
      "C'est ton plus grand secret entre les draps que personne ne connaît ?",
      "La personne de cette partie que tu emmènerais direct chez toi ? 😈",
      "As-tu déjà laissé (ou reçu) une morsure marqueuse ? Où ?",
      "Le plus bizarre qu'on t'ait demandé au lit... et tu as dit oui ?"
    ],
    action: [
      "Envoie un audio « chaud » de 15 secondes à la personne que le groupe choisit.",
      "Envoie le sexto que tu n'as jamais osé écrire. Copie-le ici.",
      "Décris ce que tu ferais à la personne de ton choix ici, si elle était là 😈",
      "Fais 10 pompes... en sous-vêtements. Le groupe compte à voix haute.",
      "Gémis le prénom de la personne à ta droite comme dans un film. Deux fois.",
      "Envoie une photo de toi dans la tenue que tu portes VRAIMENT maintenant.",
      "Imite (voix + visage) ton orgasme... version cinéma muet 😂🔥",
      "Fais un lap dance sur une chaise. Cam ouverte.",
      "Raconte ta meilleure nuit en la chantant 🎤",
      "Déclare ton « plan de la nuit » à la personne désignée par le groupe 😈",
      "Strip-tease intégral, cam ouverte. Tu vas jusqu'où tu oses 🔥",
      "Pendant 1h, ta photo de profil devient une photo choisie par le groupe."
    ]
  }
};

QUESTIONS[4] = {
  verite: [
    "C'est quoi ton fantasme le plus torride que tu n'as JAMAIS raconté ? Détails obligatoires.",
    "Décris la dernière fois que tu as fait l'amour : quand, où, comment. Sans sauter une étape.",
    "Quelle est la position que tu pratiques le plus ? Et celle que tu n'oses pas tester ?",
    "Le nombre EXACT de personnes avec qui tu as couché. Le vrai chiffre.",
    "Raconte ton meilleur coup de ta vie. Qu'est-ce qui l'a rendu inoubliable ?",
    "As-tu déjà couché avec quelqu'un d'ici ? Qui ? (les autres ferment les yeux 😈)",
    "C'est quoi le truc le plus pervers que quelqu'un t'ait demandé... et que tu as accepté ?",
    "Combien de temps tiens-tu ? Le groupe veut une estimation honnête 😏",
    "Bande son ou silence total au lit ? Décris ce que tu aimes entendre.",
    "Ton pire échec au lit ? Ramolissage, finition express... Raconte le drame.",
    "Où est l'endroit LE PLUS risqué où tu as fait l'amour ? Presque surpris(e) ?",
    "Si tu devais coucher avec 2 personnes de cette partie, lesquelles ? 😈"
  ],
  action: [
    "Envoie un vocal de 20 secondes décrivant ce que tu ferais ce soir à la personne de ton choix ici. Sans censure.",
    "Décris en détail, à voix haute, ton dernier rapport. Le groupe juge les détails.",
    "Fais un strip COMPLET, cam ouverte. 30 secondes chrono 🔥",
    "Gémis de la manière la plus réaliste possible pendant 10 secondes. Le groupe note /10.",
    "Envoie à ton crush le message le plus osé que tu oses écrire. Copie-le ici, preuve à l'appui.",
    "Mime ta position préférée pendant 15 secondes. Le groupe doit la deviner exactement.",
    "Raconte ta meilleure nuit en imitant les bruits et les gestes. Théâtre intégral.",
    "Le groupe choisit un joueur : déclare-lui ce que tu lui ferais si vous étiez seuls ce soir. 30 secondes, sans détour.",
    "Envoie une photo de toi en sous-vêtements (ou ce que tu portes) au joueur de ton choix.",
    "Fais 20 pompes en sous-vêtements, cam ouverte. Le groupe compte et applaudit.",
    "Simule un préliminaire complet... sur un coussin. 1 minute, cam ouverte 😈",
    "Laisse le groupe écrire UN mot que tu dois gémir de la façon la plus convaincante. 3 fois."
  ]
};

/* ---------------- État des salons ---------------- */
const rooms = new Map();
const socketRoom = new Map();

const genCode = () => {
  const A = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let c;
  do { c = Array.from({ length: 4 }, () => A[Math.floor(Math.random() * A.length)]).join(''); } while (rooms.has(c));
  return c;
};
const cleanName = (n) => String(n || '').replace(/\s+/g, ' ').trim().slice(0, 14) || 'Joueur';
const pick = (a) => a[Math.floor(Math.random() * a.length)];

function createRoom(socket, name, difficulty, gender) {
  const room = {
    code: genCode(),
    difficulty: [1, 2, 3, 4].includes(+difficulty) ? +difficulty : 2,
    inviteAt: Date.now(),
    lastEmptyAt: 0,
    players: new Map(),
    pending: [],
    phase: 'lobby',
    turn: null,
    lastTargetId: null,
    used: new Set(),
    timer: null,
    feed: [],
  };
  rooms.set(room.code, room);
  addPlayer(room, socket, name, true, gender);
  return room;
}

function addPlayer(room, socket, name, isAdmin, gender) {
  const p = { id: socket.id, name, isAdmin: !!isAdmin, isBot: false, gender: gender === 'femme' ? 'femme' : 'homme', misses: 0, connected: true, joinedAt: Date.now() };
  room.players.set(socket.id, p);
  socket.join(room.code);
  socketRoom.set(socket.id, room);
  sys(room, name + ' (' + p.gender + ') a rejoint le salon 👋');
  return p;
}

function addBot(room) {
  const used = new Set([...room.players.values()].map(p => p.name));
  const NAMES = ['Bot Awa', 'Bot Modou', 'Bot Fatou', 'Bot Serigne', 'Bot Amy'];
  const nm = NAMES.find(n => !used.has(n)) || ('Bot ' + Math.floor(Math.random() * 90 + 10));
  const bot = { id: 'bot_' + Date.now().toString(36) + Math.floor(Math.random() * 99), name: nm, isAdmin: false, isBot: true, gender: Math.random() < 0.5 ? 'homme' : 'femme', misses: 0, connected: true, joinedAt: Date.now() };
  room.players.set(bot.id, bot);
  sys(room, nm + ' (robot) a rejoint 🤖');
  return bot;
}

function serialize(room) {
  return {
    code: room.code,
    phase: room.phase,
    difficulty: room.difficulty,
    inviteExpiresAt: room.inviteAt + INVITE_TTL,
    players: [...room.players.values()].sort((a, b) => a.joinedAt - b.joinedAt)
      .map(p => ({ id: p.id, name: p.name, isAdmin: p.isAdmin, isBot: p.isBot, gender: p.gender || 'homme', misses: p.misses, connected: p.connected })),
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
  if (room.feed.length > 40) room.feed.shift();
  io.to(room.code).emit('feed:new', item);
}
const sys = (room, text) => pushFeed(room, { kind: 'sys', text });

/* ---------------- Machine à tours ---------------- */
const clearTimer = (room) => { if (room.timer) { clearTimeout(room.timer); room.timer = null; } };
const active = (room) => [...room.players.values()].filter(p => p.connected);

function nextTurn(room) {
  clearTimer(room);
  room.turn = null;
  const pool = active(room);
  if (pool.length === 0) {
    room.phase = 'idle';
    sys(room, 'Tout le monde est parti... 😴');
    broadcast(room);
    return;
  }
  let cand = pool.filter(p => p.id !== room.lastTargetId);
  if (!cand.length) cand = pool;
  const t = pick(cand);
  room.lastTargetId = t.id;
  room.phase = 'spinning';
  room.turn = { targetId: t.id };
  io.to(room.code).emit('wheel', { targetId: t.id, duration: SPIN_TIME });
  room.timer = setTimeout(() => beginChoosing(room), SPIN_TIME);
  broadcast(room);
}

function beginChoosing(room) {
  const t = room.players.get(room.turn.targetId);
  if (!t || !t.connected) return nextTurn(room);
  room.phase = 'choosing';
  room.turn = { targetId: t.id, deadline: Date.now() + CHOICE_TIME };
  if (t.isBot) {
    room.timer = setTimeout(() => beginAnswering(room, Math.random() < 0.5 ? 'verite' : 'action'), 6000 + Math.random() * 4000);
  } else {
    room.timer = setTimeout(() => {
      if (miss(room, t)) return;
      sys(room, t.name + ' n\u2019a pas choisi — la roue retourne ! ⌛');
      nextTurn(room);
    }, CHOICE_TIME);
  }
  broadcast(room);
}

async function aiQuestion(diff, type, name, gender) {
  if (!process.env.GROQ_API_KEY) return null;
  const niveau = { 1: 'légère et fun', 2: 'coquine', 3: 'très directe, sans filtre', 4: 'TRÈS CHAUD : explicite, intime, sans AUCUN filtre (adultes consentants)' }[diff] || 'coquine';
  const prompt = 'Tu es le meneur d\u2019un jeu de Vérité ou Action pour adultes consentants (18+). Génère UNE seule '
    + (type === 'verite' ? 'question de VÉRITÉ (intime, à répondre honnêtement)' : 'ACTION (défi osé à accomplir immédiatement devant le groupe)')
    + ' pour le joueur "' + name + '" (' + (gender === 'femme' ? 'une femme' : 'un homme') + '). Niveau demandé : ' + niveau
    + '. En français. Réponds UNIQUEMENT avec un JSON valide : {"question": "..."}';
  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + process.env.GROQ_API_KEY },
      body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages: [{ role: 'user', content: prompt }], temperature: 1, max_tokens: 250, response_format: { type: 'json_object' } }),
      signal: AbortSignal.timeout(9000),
    });
    if (!r.ok) { console.log('⚠️ IA erreur HTTP', r.status); return null; }
    const j = await r.json();
    const q = JSON.parse(j.choices[0].message.content).question;
    return (typeof q === 'string' && q.length > 8 && q.length < 500) ? q.trim() : null;
  } catch (e) { console.log('⚠️ IA indisponible :', e.message); return null; }
}

function beginAnswering(room, type) {
  const t = room.players.get(room.turn.targetId);
  const q = drawQuestion(room, type);
  room.phase = 'answering';
  room.turn = { targetId: t.id, type, question: q, deadline: Date.now() + ANSWER_TIME, answered: false, ai: false };
  // L'IA (si clé configurée) remplace la question par une question générée, personnalisée
  aiQuestion(room.difficulty, type, t.name, t.gender).then(aiq => {
    if (aiq && room.turn && room.turn.targetId === t.id && room.phase === 'answering' && !room.turn.answered) {
      room.turn.question = aiq; room.turn.ai = true;
      broadcast(room);
    }
  });
  if (t.isBot) {
    room.timer = setTimeout(() => {
      const ANS = ['Oula... je refuse de répondre 😂', 'Ma réponse est OUI. Point.', 'Franchement ? C\u2019est compliqué 😬', 'C\u2019est vrai mais chut 🤫', 'Je le savais, et j\u2019ai honte 😅', 'Demandez au prochain !'];
      pushFeed(room, { kind: 'answer', mid: t.id, name: t.name, text: pick(ANS) });
      beginReacting(room);
    }, 2500 + Math.random() * 4500);
  } else {
    room.timer = setTimeout(() => {
      if (miss(room, t)) return;
      sys(room, t.name + ' n\u2019a pas répondu — tour passé ! ⌛');
      nextTurn(room);
    }, ANSWER_TIME);
  }
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

function miss(room, p) {
  p.misses += 1;
  if (p.misses >= MAX_MISSES) {
    sys(room, p.name + ' est exclu(e) (' + MAX_MISSES + ' non-réponses) 🚫');
    removePlayer(room, p.id, null, true);
    return true;
  }
  sys(room, '⚠️ ' + p.name + ' : non-réponse ' + p.misses + '/' + MAX_MISSES);
  broadcast(room);
  return false;
}

function removePlayer(room, id, kicked) {
  const p = room.players.get(id);
  if (!p) return;
  room.players.delete(id);
  socketRoom.delete(id);
  room.pending = room.pending.filter(r => r.id !== id);
  if (kicked === true) { /* message déjà affiché */ }
  else if (kicked) sys(room, p.name + ' a été exclu(e) par l\u2019admin 🚫');
  else sys(room, p.name + ' a quitté la partie 🚪');

  if (room.players.size === 0) { room.lastEmptyAt = Date.now(); broadcast(room); return; }
  const wasAdmin = p.isAdmin;
  const wasTarget = room.turn && room.turn.targetId === id;
  const midTurn = ['spinning', 'choosing', 'answering'].includes(room.phase);
  if (wasAdmin) {
    const next = [...room.players.values()].sort((a, b) => a.joinedAt - b.joinedAt)[0];
    if (next) { room.players.forEach(x => (x.isAdmin = false)); next.isAdmin = true; sys(room, '👑 ' + next.name + ' devient admin'); }
  }
  if (wasTarget && midTurn) { nextTurn(room); return; }
  broadcast(room);
}

function drawQuestion(room, type) {
  const bank = QUESTIONS[room.difficulty][type];
  const prefix = room.difficulty + ':' + type + ':';
  let idxs = bank.map((_, i) => i).filter(i => !room.used.has(prefix + i));
  if (!idxs.length) { bank.forEach((_, i) => room.used.delete(prefix + i)); idxs = bank.map((_, i) => i); }
  const i = pick(idxs);
  room.used.add(prefix + i);
  return bank[i];
}

function closeRoom(room) {
  clearTimer(room);
  io.to(room.code).emit('room:closed');
  room.players.forEach((_, id) => socketRoom.delete(id));
  rooms.delete(room.code);
}

/* ---------------- Page web (TOUT EST DEDANS) ---------------- */
const HTML = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, viewport-fit=cover">
<meta http-equiv="Cache-Control" content="no-store">
<title>Vérité ou Action 🔥 18+</title>
<style>
* { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
html, body { overscroll-behavior: none; }
:root { --bg:#0b0b14; --bg2:#14142a; --card:#1b1b36; --line:#2d2d55; --txt:#f2f2fa; --mut:#9a9ac0; --hot:#ff2e63; --hot2:#ff7a3d; --ok:#21c07a; --warn:#ffb020; }
body { font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; background: radial-gradient(1200px 800px at 50% -10%, var(--bg2), var(--bg) 60%); color: var(--txt); min-height: 100vh; }
.screen { display: none; min-height: 100vh; padding-bottom: 24px; }
.screen.active { display: block; }
.card { max-width: 440px; margin: 5vh auto 20px; padding: 26px 20px; background: var(--card); border: 1px solid var(--line); border-radius: 24px; display: flex; flex-direction: column; gap: 13px; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,.45); }
.logo { font-size: 60px; }
h1.title { font-size: 32px; font-weight: 900; background: linear-gradient(90deg, var(--hot), var(--hot2)); -webkit-background-clip: text; background-clip: text; color: transparent; }
.badge18 { align-self: center; background: var(--hot); color: #fff; font-weight: 900; padding: 3px 14px; border-radius: 999px; font-size: 14px; }
.ver { font-size: 11px; color: var(--mut); letter-spacing: 1px; }
.check { display: flex; gap: 8px; align-items: center; justify-content: center; font-size: 14px; color: var(--mut); cursor: pointer; }
.check input { width: 18px; height: 18px; accent-color: var(--hot); }
.input { width: 100%; padding: 14px 16px; border-radius: 14px; border: 1.5px solid var(--line); background: var(--bg2); color: var(--txt); font-size: 16px; outline: none; text-align: center; }
.input:focus { border-color: var(--hot); }
.input.code { letter-spacing: 10px; font-size: 26px; font-weight: 800; text-transform: uppercase; }
.btn { padding: 12px 18px; border-radius: 14px; border: 1.5px solid var(--line); background: var(--bg2); color: var(--txt); font-size: 15px; font-weight: 700; cursor: pointer; }
.btn:active { transform: scale(.97); }
.btn:disabled { opacity: .4; cursor: not-allowed; }
.btn.big { padding: 15px; font-size: 17px; }
.btn.primary { background: linear-gradient(90deg, var(--hot), var(--hot2)); border: none; color: #fff; }
.btn.wa { background: #25d366; border: none; color: #06331a; }
.btn.small { padding: 7px 12px; font-size: 13px; border-radius: 10px; }
.btn.danger { border-color: var(--hot); color: var(--hot); }
.divider { color: var(--mut); font-size: 13px; }
.hint { color: var(--mut); font-size: 12.5px; line-height: 1.5; }
.topbar { display: flex; align-items: center; gap: 8px; padding: 10px 12px; position: sticky; top: 0; z-index: 5; background: rgba(11,11,20,.85); backdrop-filter: blur(8px); border-bottom: 1px solid var(--line); }
.code-big { font-size: 20px; font-weight: 900; letter-spacing: 6px; color: var(--hot2); background: var(--card); border: 1px solid var(--line); padding: 6px 14px; border-radius: 12px; cursor: pointer; }
.wrap { max-width: 560px; margin: 12px auto; padding: 0 12px; display: flex; flex-direction: column; gap: 12px; }
.panel { background: var(--card); border: 1px solid var(--line); border-radius: 18px; padding: 14px; }
.panel h3 { font-size: 15px; margin-bottom: 10px; }
.grid6 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
@media (min-width: 560px) { .grid6 { grid-template-columns: repeat(6, 1fr); } }
.cell { position: relative; background: var(--bg2); border: 1.5px solid var(--line); border-radius: 14px; padding: 14px 4px 8px; min-height: 70px; display: flex; flex-direction: column; gap: 3px; align-items: center; justify-content: center; font-size: 12.5px; font-weight: 800; }
.cell .num { position: absolute; top: 3px; left: 7px; font-size: 9px; color: var(--mut); }
.cell .dot { position: absolute; top: 5px; right: 6px; width: 8px; height: 8px; border-radius: 50%; background: var(--hot); }
.cell .dot.on { background: var(--ok); box-shadow: 0 0 6px var(--ok); }
.cell.empty { border-style: dashed; opacity: .45; }
.cell.me { border-color: var(--hot2); }
.cell.target { border-color: var(--hot); box-shadow: 0 0 10px rgba(255,46,99,.6); }
.cell .x { position: absolute; bottom: 3px; right: 4px; border: none; background: transparent; color: var(--hot); cursor: pointer; font-size: 11px; }
.pending { background: var(--card); border: 1.5px solid var(--warn); border-radius: 14px; padding: 10px 12px; display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 14px; }
.pending span { flex: 1; }
.diffrow { display: flex; gap: 8px; }
.diffrow .btn { flex: 1; }
.diffrow .btn.sel { background: linear-gradient(90deg, var(--hot), var(--hot2)); border: none; color: #fff; }
.invrow { display: flex; gap: 8px; flex-wrap: wrap; }
.invrow .btn { flex: 1; min-width: 130px; }
#phase { text-align: center; font-weight: 800; font-size: 15px; padding: 10px; border-radius: 14px; background: var(--card); border: 1px solid var(--line); }
.timetrack { height: 7px; border-radius: 99px; background: var(--bg2); border: 1px solid var(--line); overflow: hidden; }
.timefill { height: 100%; width: 100%; background: linear-gradient(90deg, var(--ok), var(--warn), var(--hot)); }
.wheelzone { position: relative; width: min(76vw, 280px); margin: 0 auto; }
#wheel { width: 100%; height: auto; display: block; }
.pointer { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); font-size: 24px; color: var(--hot); }
#choice { display: flex; gap: 12px; }
#choice .btn { flex: 1; padding: 22px 8px; font-size: 19px; border-radius: 18px; }
.btn.v { background: linear-gradient(160deg, #7c4dff, #4a2bd6); border: none; color: #fff; }
.btn.a { background: linear-gradient(160deg, #ff2e63, #c40e46); border: none; color: #fff; }
#qcard { background: var(--card); border: 1.5px solid var(--hot); border-radius: 18px; padding: 16px; text-align: center; }
#qtype { font-weight: 900; letter-spacing: 2px; font-size: 12px; color: var(--hot2); margin-bottom: 6px; }
#qtext { font-size: 18px; font-weight: 700; line-height: 1.45; }
.row { display: flex; gap: 8px; }
.row .input { text-align: left; flex: 1; }
#mic { width: 100%; padding: 15px; font-size: 16px; }
#mic.rec { background: var(--hot); color: #fff; animation: pulse 1s infinite; }
@keyframes pulse { 50% { transform: scale(1.04); } }
.rea { display: flex; gap: 6px; justify-content: center; flex-wrap: wrap; }
.rea button { font-size: 20px; background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 5px 10px; cursor: pointer; }
.feed { display: flex; flex-direction: column; gap: 7px; max-height: 34vh; overflow-y: auto; padding: 4px; }
.msg { max-width: 85%; background: var(--card); border: 1px solid var(--line); border-radius: 13px; padding: 8px 11px; font-size: 14px; word-break: break-word; }
.msg .who { font-size: 11px; color: var(--hot2); font-weight: 800; margin-bottom: 2px; }
.msg.answer { border-color: var(--ok); }
.msg.sys { align-self: center; background: transparent; border: none; color: var(--mut); font-size: 12px; text-align: center; }
.audio { display: flex; align-items: center; gap: 8px; cursor: pointer; font-weight: 800; }
.audio .p { width: 30px; height: 30px; border-radius: 50%; background: var(--hot); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 13px; }
#float { position: fixed; inset: 0; pointer-events: none; overflow: hidden; z-index: 50; }
.fe { position: absolute; bottom: -40px; font-size: 32px; animation: rise 2.5s ease-out forwards; }
@keyframes rise { to { transform: translateY(-105vh) rotate(25deg); opacity: .1; } }
#toast { position: fixed; bottom: 22px; left: 50%; transform: translateX(-50%); background: var(--hot); color: #fff; font-weight: 700; padding: 12px 18px; border-radius: 14px; z-index: 99; font-size: 14px; max-width: 92vw; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,.5); }
[hidden] { display: none !important; }
.feedhead { display: flex; gap: 8px; align-items: center; padding: 10px; border-bottom: 1px solid var(--line); }
.badge-unread { background: var(--hot); color: #fff; border-radius: 99px; padding: 1px 7px; font-size: 11px; font-weight: 800; }
#inapp { position: fixed; inset: 0; background: rgba(0,0,0,.94); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 16px; }
#inapp[hidden] { display: none !important; }
.inapp-card { max-width: 400px; background: var(--card); border: 1.5px solid var(--hot); border-radius: 20px; padding: 22px; text-align: center; }
.media-img, .media-vid { max-width: 100%; border-radius: 12px; margin-top: 4px; }
.msg.mine { align-self: flex-end; background: color-mix(in srgb, var(--hot) 16%, var(--card)); }
.diffrow .btn { padding: 11px 4px; font-size: 13.5px; }
</style>
</head>
<body>

<section id="s-home" class="screen active">
  <div class="card">
    <div class="logo">🌶️</div>
    <h1 class="title">VÉRITÉ ou ACTION</h1>
    <div class="badge18">18+</div>
    <div class="ver">VERSION 11 · MOBILE PARFAIT</div>
    <label class="check"><input type="checkbox" id="age18"> J'ai 18 ans ou plus 🍾</label>
    <div class="diffrow" id="genderrow">
      <button class="btn sel" data-g="homme">👨 Homme</button>
      <button class="btn" data-g="femme">👩 Femme</button>
    </div>
    <input type="text" id="in-name" class="input" maxlength="14" placeholder="Ton pseudo...">
    <button id="btn-create" class="btn big primary">🎓 CRÉER UN SALON</button>
    <div class="divider">— ou —</div>
    <input type="text" id="in-code" class="input code" maxlength="4" placeholder="CODE">
    <button id="btn-join" class="btn big">🚪 REJOINDRE</button>
    <p class="hint">⚠️ Respect et consentement obligatoires.<br>Tout disparaît à la fin de la session. 🧹</p>
  </div>
</section>

<section id="s-wait" class="screen">
  <div class="card">
    <div class="logo">⏳</div>
    <h2>En attente de l'accord de l'admin...</h2>
    <p class="hint" id="wait-code"></p>
    <button id="btn-wait-cancel" class="btn">Annuler</button>
  </div>
</section>

<section id="s-lobby" class="screen">
  <div class="topbar">
    <span class="code-big" id="lobby-code" title="Cliquer pour copier">----</span>
    <button id="btn-invite" class="btn small wa">💬 WhatsApp</button>
    <button id="btn-leave-lobby" class="btn small danger" style="margin-left:auto">Quitter</button>
  </div>
  <div class="wrap">
    <div id="pending-box"></div>
    <div class="panel">
      <h3>👥 Les 6 cases <span class="hint" id="count"></span></h3>
      <div class="grid6" id="lobby-grid"></div>
      <p class="hint" style="margin-top:8px">Il faut au moins 2 joueurs. 🤖 = robot de test qui joue tout seul.</p>
    </div>
    <div class="panel">
      <h3>🔥 Difficulté des questions</h3>
      <div class="diffrow" id="diffrow">
        <button class="btn" data-d="1">😄 Facile</button>
        <button class="btn" data-d="2">😏 Moyen</button>
        <button class="btn" data-d="3">🔥 Direct</button>
        <button class="btn" data-d="4">🌶️ CHAUD</button>
      </div>
    </div>
    <button id="btn-addbot" class="btn" hidden>🤖 Ajouter un robot (test solo)</button>
    <button id="btn-start" class="btn big primary">▶️ LANCER LA PARTIE</button>
    <p class="hint" id="start-hint"></p>
  </div>
</section>

<section id="s-game" class="screen">
  <div class="topbar">
    <span class="code-big" id="g-code" title="Cliquer pour copier">----</span>
    <button id="btn-invite2" class="btn small wa">💬</button>
    <button id="btn-stop" class="btn small danger" style="margin-left:auto" hidden>Terminer</button>
  </div>
  <div class="wrap">
    <div class="grid6" id="game-grid"></div>
    <div id="phase">…</div>
    <div class="timetrack" id="timetrack" hidden><div class="timefill" id="timefill"></div></div>
    <div class="wheelzone">
      <canvas id="wheel" width="560" height="560"></canvas>
      <div class="pointer">▼</div>
    </div>
    <div id="choice" hidden>
      <button id="btn-verite" class="btn v">💬 VÉRITÉ</button>
      <button id="btn-action" class="btn a">🎯 ACTION</button>
    </div>
    <div id="qcard" hidden>
      <div id="qtype"></div>
      <div id="qtext"></div>
    </div>
    <div id="answer" hidden>
      <div class="row">
        <input type="text" id="in-answer" class="input" maxlength="300" placeholder="Ta réponse...">
        <button id="btn-send" class="btn primary">➤</button>
      </div>
      <p class="hint" style="text-align:center;margin:4px 0">— ou réponds en vocal —</p>
      <button id="mic" class="btn">🎤 Appuie pour enregistrer (30s max)</button>
    </div>
    <div class="panel" style="padding:0">
      <div class="feedhead">
        <button id="feedtoggle" class="btn small">💬 Messages <span id="unread" class="badge-unread" hidden></span> <span id="feedarrow">▼</span></button>
        <button id="btn-media" class="btn small">📎 Partager</button>
      </div>
      <div id="feedbody" style="padding:10px">
        <div class="rea" id="rea"></div>
        <div id="mediaform" hidden style="border:1px dashed var(--line);border-radius:12px;padding:10px;margin-top:8px">
          <p class="hint" style="margin-bottom:6px">📷 Photo (comprimée auto) ou 🎬 vidéo courte (max ~2 Mo)</p>
          <input type="file" id="mediafile" accept="image/*,video/*" style="max-width:100%;font-size:12px">
          <p class="hint" style="margin:6px 0 2px">Envoyer à :</p>
          <div id="media-to" class="hint" style="display:flex;flex-wrap:wrap;gap:6px"></div>
          <div class="row" style="margin-top:8px">
            <button id="btn-media-send" class="btn primary" style="flex:1">📤 Envoyer</button>
            <button id="btn-media-cancel" class="btn small">Annuler</button>
          </div>
        </div>
        <div class="feed" id="feed" style="margin-top:8px"></div>
        <div class="row" style="margin-top:8px">
          <input type="text" id="in-chat" class="input" maxlength="300" placeholder="Message libre...">
          <button id="btn-chat" class="btn primary">➤</button>
        </div>
      </div>
    </div>
  </div>
  <div id="float"></div>
</section>

<section id="s-end" class="screen">
  <div class="card">
    <div class="logo">🧹</div>
    <h2>Session fermée</h2>
    <p class="hint">Tous les messages, audios et données ont été définitivement supprimés.</p>
    <button id="btn-home" class="btn big primary">🏠 Retour à l'accueil</button>
  </div>
</section>

<div id="inapp" hidden>
  <div class="inapp-card">
    <div style="font-size:44px">⚠️</div>
    <h2 style="margin:6px 0">Ouvre le jeu dans ton NAVIGATEUR</h2>
    <p class="hint">Tu es dans le navigateur intégré d'une application (Instagram, etc.). Si tu fermes l'application, <b>le jeu se ferme aussi</b> et tu perds ta place !</p>
    <p class="hint" style="margin:8px 0"><b>1.</b> Appuie sur <b>📋 Copier le lien</b><br><b>2.</b> Ouvre <b>Chrome</b> (Android) ou <b>Safari</b> (iPhone)<br><b>3.</b> Colle le lien et joue tranquille ✅</p>
    <button id="btn-copylink" class="btn big primary">📋 Copier le lien du jeu</button><br>
    <button id="btn-inapp-continue" class="btn small" style="margin-top:10px;background:transparent;border:none;color:var(--mut);text-decoration:underline">Continuer quand même (déconseillé)</button>
  </div>
</div>
<div id="toast" hidden></div>
<script src="/socket.io/socket.io.js"></script>
<script>
'use strict';
var socket = io();
var S = null, myName = '', myPending = null, wheelRot = -Math.PI / 2, wheelAnim = null, rec = null, recChunks = [], recT0 = 0, recInt = null;
var $ = function (s) { return document.querySelector(s); };

function show(id) { document.querySelectorAll('.screen').forEach(function (s) { s.classList.remove('active'); }); $('#' + id).classList.add('active'); }
var toastT = null;
function toast(m, long) { var t = $('#toast'); t.textContent = m; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(function () { t.hidden = true; }, long ? 6000 : 3000); }
function save(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
function read(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
function del(k) { try { localStorage.removeItem(k); } catch (e) {} }

/* ---------- Mobile : bloquer le zoom à 2 doigts ---------- */
document.addEventListener('touchmove', function (e) { if (e.touches && e.touches.length > 1) e.preventDefault(); }, { passive: false });
document.addEventListener('gesturestart', function (e) { e.preventDefault(); });
document.addEventListener('gesturechange', function (e) { e.preventDefault(); });

/* ---------- Mobile : boutons ultra réactifs (tap instantané) ---------- */
function tap(el, fn) {
  if (!el) return;
  var last = 0;
  function fire(e) {
    var t = Date.now();
    if (t - last < 600) { if (e.cancelable) e.preventDefault(); return; }  // anti double-déclenchement
    last = t;
    if (e.cancelable) e.preventDefault();
    fn(e);
  }
  el.addEventListener('touchend', fire, { passive: false });
  el.addEventListener('click', fire);
}

/* ---------- Navigateur intégré (Instagram...) : alerte + copie du lien ---------- */
(function () {
  var UA = navigator.userAgent || '';
  var INAPP = /Instagram|FBAN|FBAV|FB_IAB|Snapchat|TikTok|musical_ly|Line\/|LinkedIn|Pinterest|WebView/i.test(UA) || (/iPhone|iPad|iPod/.test(UA) && !/Safari\//.test(UA));
  if (!INAPP) return;
  var ov = document.getElementById('inapp');
  if (!ov) return;
  ov.hidden = false;
  document.getElementById('btn-copylink').onclick = function () {
    if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(function () { toast('📋 Lien copié ! Colle-le dans Chrome ou Safari', true); }, function () { toast(location.href, true); });
    else toast(location.href, true);
  };
  document.getElementById('btn-inapp-continue').onclick = function () { ov.hidden = true; };
})();

/* ---------- Connexion + reprise auto ---------- */
socket.on('connect', function () {
  var s = read('voa_code'), n = read('voa_name');
  if (s && n && !S) { myName = n; socket.emit('room:join', { name: n, code: s }); }
});
socket.on('error:msg', function (d) {
  var M = { notfound: 'Salon introuvable ou fermé 😕', full: 'Salon complet 😵', expired: 'Lien expiré — demande un nouveau code ⏱️', fullsessions: 'Serveur plein, réessaie dans un instant 🙏' };
  toast(M[d.key] || d.key, true);
  del('voa_code');
  if (!S) show('s-home');
});
socket.on('join:waiting', function () { $('#wait-code').textContent = 'Salon ' + (myPending || ''); show('s-wait'); });
socket.on('join:rejected', function () { toast('Refusé par l\u2019admin 😕', true); show('s-home'); });
socket.on('joined', function (d) {
  myPending = null; del('voa_wait');
  document.getElementById('feed').innerHTML = '';
  if (d && d.code) toast('✅ Salon ' + d.code + ' !');
});
socket.on('feed:init', function (d) { d.feed.forEach(addMsg); drawFeed(); });
socket.on('feed:new', function (it) { addMsg(it); drawFeed(); });

socket.on('room:state', function (st) {
  S = st;
  save('voa_code', st.code); save('voa_name', myName);
  if (st.phase === 'lobby') { renderLobby(); show('s-lobby'); }
  else { renderGame(); show('s-game'); }
});
socket.on('wheel', function (d) { spin(d.targetId, d.duration || 4000); });
socket.on('reaction', function (d) { float(d.emoji); });
socket.on('player:offline', function (d) { toast('📴 ' + d.name + ' s\u2019est déconnecté !', true); });
socket.on('player:back', function (d) { toast('🔄 ' + d.name + ' est revenu !'); });
socket.on('media:new', function (it) { addMsg(it); drawFeed(); if (it.mid !== socket.id) toast('📷 ' + it.name + ' t\u2019a envoyé du contenu privé'); });
socket.on('room:closed', function () { del('voa_code'); S = null; show('s-end'); });

/* ---------- Accueil : genre ---------- */
var myGender = read('voa_gender') || 'homme';
(function () {
  var gr = document.querySelectorAll('#genderrow .btn');
  function paint() { for (var j = 0; j < gr.length; j++) gr[j].classList.toggle('sel', gr[j].dataset.g === myGender); }
  paint();
  for (var i = 0; i < gr.length; i++) {
    (function (btn) {
      tap(btn, function () { myGender = btn.dataset.g; save('voa_gender', myGender); paint(); });
    })(gr[i]);
  }
})();
var gIcon = function (p) { return (p && p.gender === 'femme') ? '\uD83D\uDC69 ' : '\uD83D\uDC68 '; };

/* ---------- Accueil ---------- */
tap($('#btn-create'), function () {
  if (!$('#age18').checked) return toast('Confirme d\u2019abord que tu as 18 ans 🍾');
  var n = $('#in-name').value.trim();
  if (!n) { $('#in-name').focus(); return toast('Choisis ton pseudo 😄'); }
  myName = n; save('voa_name', n);
  socket.emit('room:create', { name: n, difficulty: 2, gender: myGender });
});
tap($('#btn-join'), function () {
  if (!$('#age18').checked) return toast('Confirme d\u2019abord que tu as 18 ans 🍾');
  var n = $('#in-name').value.trim(), c = $('#in-code').value.trim().toUpperCase();
  if (!n) { $('#in-name').focus(); return toast('Choisis ton pseudo 😄'); }
  if (c.length < 4) { $('#in-code').focus(); return toast('Tape le code à 4 lettres 🔤'); }
  myName = n; myPending = c; save('voa_name', n);
  socket.emit('room:join', { name: n, code: c, gender: myGender });
});
$('#btn-wait-cancel').onclick = function () { myPending = null; del('voa_code'); show('s-home'); };
$('#btn-home').onclick = function () { location.reload(); };
(function () {
  var n = read('voa_name'); if (n) $('#in-name').value = n;
  var c = read('voa_code'); if (c) $('#in-code').value = c;
})();

/* ---------- Lobby ---------- */
var me = function () { if (!S) return null; for (var i = 0; i < S.players.length; i++) if (S.players[i].id === socket.id) return S.players[i]; return null; };
var isAdmin = function () { var m = me(); return !!(m && m.isAdmin); };

function renderLobby() {
  $('#lobby-code').textContent = S.code;
  $('#count').textContent = '(' + S.players.length + '/6)';
  var adm = isAdmin();
  $('#btn-addbot').hidden = !adm;
  $('#btn-start').disabled = S.players.length < 2 || !adm;
  $('#start-hint').textContent = adm
    ? (S.players.length < 2 ? 'Ajoute des joueurs ou des robots 🤖 pour lancer.' : 'Tout est prêt. Que le jeu commence !')
    : 'Seul l\u2019admin (' + (S.players.filter(function (p) { return p.isAdmin; })[0] || {}).name + ') peut lancer.';
  var dr = document.querySelectorAll('#diffrow .btn');
  for (var i = 0; i < dr.length; i++) {
    dr[i].classList.toggle('sel', +dr[i].dataset.d === S.difficulty);
    dr[i].style.display = adm ? '' : 'none';
  }
  var g = $('#lobby-grid'); g.innerHTML = '';
  for (var k = 0; k < S.maxPlayers; k++) {
    var p = S.players[k];
    var cell = document.createElement('div');
    cell.className = 'cell' + (p ? (p.connected ? '' : ' ') : ' empty') + (p && p.id === socket.id ? ' me' : '');
    cell.innerHTML = '<span class="num">Case ' + (k + 1) + '</span><span class="dot' + (p && (p.connected || p.isBot) ? ' on' : '') + '"></span>';
    if (p) {
      var nm = document.createElement('span');
      nm.textContent = (p.isAdmin ? '👑 ' : '') + (p.isBot ? '🤖 ' : gIcon(p)) + p.name;
      cell.appendChild(nm);
      if (adm && p.id !== socket.id && !p.isBot) {
        var x = document.createElement('button'); x.className = 'x'; x.textContent = '✖';
        x.onclick = (function (id) { return function () { if (confirm('Exclure ce joueur ?')) socket.emit('player:kick', { id: id }); }; })(p.id);
        cell.appendChild(x);
      }
    } else {
      var lib = document.createElement('span'); lib.textContent = '➕ libre'; cell.appendChild(lib);
    }
    g.appendChild(cell);
  }
  drawPending();
}
function drawPending() {
  var box = $('#pending-box'); box.innerHTML = '';
  if (!lastPending.length || !isAdmin()) { return; }
  lastPending.forEach(function (r) {
    var d = document.createElement('div'); d.className = 'pending';
    var s = document.createElement('span'); s.textContent = '🔔 ' + r.name + ' veut rejoindre';
    var ok = document.createElement('button'); ok.className = 'btn small primary'; ok.textContent = '✔️ Accepter';
    ok.onclick = function () { socket.emit('join:respond', { id: r.id, ok: true }); };
    var no = document.createElement('button'); no.className = 'btn small danger'; no.textContent = '✖️';
    no.onclick = function () { socket.emit('join:respond', { id: r.id, ok: false }); };
    d.appendChild(s); d.appendChild(ok); d.appendChild(no); box.appendChild(d);
  });
}
var lastPending = [];
socket.on('join:pending', function (d) { lastPending = d.pending; drawPending(); });

$('#btn-addbot').onclick = function () { socket.emit('bot:add'); };
$('#btn-start').onclick = function () { socket.emit('game:start'); };
$('#btn-leave-lobby').onclick = function () { socket.emit('room:leave'); del('voa_code'); S = null; show('s-home'); };
document.querySelectorAll('#diffrow .btn').forEach(function (b) {
  tap(b, function () { socket.emit('difficulty', { d: +b.dataset.d }); });
});
function inviteLink() { return '🔥 On joue à Vérité ou Action (18+) ! Rejoins ma partie : ' + location.origin + '/#/join/' + S.code; }
$('#btn-invite').onclick = function () { socket.emit('invite:refresh'); window.open('https://wa.me/?text=' + encodeURIComponent(inviteLink()), '_blank'); };
$('#btn-invite2').onclick = function () { socket.emit('invite:refresh'); window.open('https://wa.me/?text=' + encodeURIComponent(inviteLink()), '_blank'); };
function copyCode() { if (!S) return; if (navigator.clipboard) navigator.clipboard.writeText(S.code).then(function () { toast('📋 Code copié : ' + S.code); }, function () { toast('Code : ' + S.code, true); }); else toast('Code : ' + S.code, true); }
$('#lobby-code').onclick = copyCode;
$('#g-code').onclick = copyCode;
if (location.hash.indexOf('#join/') === 0) { $('#in-code').value = location.hash.slice(6, 10).toUpperCase(); }

/* ---------- Jeu ---------- */
var PH = { choosing: 60000, answering: 120000, reacting: 20000 };
function renderGame() {
  var m = me(); if (!m) return;
  $('#g-code').textContent = S.code;
  $('#btn-stop').hidden = !isAdmin();
  var t = S.turn, tp = null;
  if (t) for (var i = 0; i < S.players.length; i++) if (S.players[i].id === t.targetId) tp = S.players[i];
  var isMe = !!(t && t.targetId === socket.id);
  var ph = $('#phase');
  if (S.phase === 'spinning') ph.textContent = '🎡 La roue tourne...';
  else if (S.phase === 'choosing') ph.textContent = isMe ? 'À TOI ! Choisis vite (60s) :' : '🎯 ' + (tp ? tp.name : '?') + ' choisit...';
  else if (S.phase === 'answering') ph.textContent = isMe ? '💬 Réponds sans filtrer (2 min) !' : '💬 ' + (tp ? tp.name : '?') + ' répond...';
  else if (S.phase === 'reacting') ph.textContent = '🔥 Réactions ! Tour suivant imminent...';
  else ph.textContent = '⏸️ En pause...';
  var showT = t && t.deadline && PH[S.phase];
  $('#timetrack').hidden = !showT;
  $('#choice').hidden = !(S.phase === 'choosing' && isMe);
  var showQ = !!(t && t.question && (S.phase === 'answering' || S.phase === 'reacting'));
  $('#qcard').hidden = !showQ;
  if (showQ) {
    $('#qtype').textContent = (t.ai ? '🤖 IA · ' : '') + (t.type === 'verite' ? 'VÉRITÉ 💬 — réponds sans mentir' : 'ACTION 🎯 — à toi d\u2019oser');
    $('#qtext').textContent = t.question;
  }
  $('#answer').hidden = !(S.phase === 'answering' && isMe && !t.answered);
  var g = $('#game-grid'); g.innerHTML = '';
  for (var k = 0; k < S.maxPlayers; k++) {
    var p = S.players[k];
    var cell = document.createElement('div');
    cell.className = 'cell' + (p ? '' : ' empty') + (p && p.id === socket.id ? ' me' : '') + (p && t && t.targetId === p.id ? ' target' : '');
    cell.innerHTML = '<span class="num">Case ' + (k + 1) + '</span><span class="dot' + (p && (p.connected || p.isBot) ? ' on' : '') + '"></span>';
    if (p) {
      var nm = document.createElement('span');
      nm.textContent = (p.isAdmin ? '👑 ' : '') + (p.isBot ? '🤖 ' : gIcon(p)) + p.name + (p.misses ? ' ⚠️' + p.misses : '');
      cell.appendChild(nm);
    } else {
      var lib = document.createElement('span'); lib.textContent = '➕'; cell.appendChild(lib);
    }
    g.appendChild(cell);
  }
  drawWheel();
}
setInterval(function () {
  if (S && S.turn && S.turn.deadline && PH[S.phase]) {
    var left = Math.max(0, S.turn.deadline - Date.now());
    $('#timefill').style.width = (100 * left / PH[S.phase]) + '%';
  }
}, 200);

/* ---------- Roue ---------- */
var COLORS = ['#ff2e63', '#7c4dff', '#21c07a', '#ff9f1c', '#3d8bff', '#ff5ca8'];
function drawWheel() {
  var cv = $('#wheel'); if (!cv) return;
  var ctx = cv.getContext('2d');
  var W = cv.width, cx = W / 2, R = W / 2 - 12;
  ctx.clearRect(0, 0, W, W);
  var ps = S ? S.players : [];
  var n = Math.max(ps.length, 2), seg = 2 * Math.PI / n;
  ctx.save(); ctx.translate(cx, cx); ctx.rotate(wheelRot);
  for (var i = 0; i < n; i++) {
    var p = ps[i];
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, R, i * seg, (i + 1) * seg); ctx.closePath();
    ctx.fillStyle = p ? COLORS[i % COLORS.length] : '#20203a';
    ctx.globalAlpha = p ? (p.connected ? 1 : .4) : .25;
    ctx.fill(); ctx.globalAlpha = 1;
    ctx.save();
    ctx.rotate(i * seg + seg / 2); ctx.translate(R * .58, 0); ctx.rotate(Math.PI / 2);
    ctx.fillStyle = '#fff'; ctx.font = '800 32px system-ui, sans-serif'; ctx.textAlign = 'center';
    if (p) { var nm = p.name; if (nm.length > 10) nm = nm.slice(0, 9) + '…'; ctx.fillText(nm, 0, 12); }
    ctx.restore();
  }
  ctx.restore();
  ctx.beginPath(); ctx.arc(cx, cx, 38, 0, Math.PI * 2);
  ctx.fillStyle = '#1b1b36'; ctx.fill();
  ctx.font = '36px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('🌶️', cx, cx + 2);
  ctx.textBaseline = 'alphabetic';
}
function spin(targetId, duration) {
  if (wheelAnim) cancelAnimationFrame(wheelAnim);
  if (!S) return;
  var idx = -1;
  for (var i = 0; i < S.players.length; i++) if (S.players[i].id === targetId) idx = i;
  if (idx < 0) return;
  var n = Math.max(S.players.length, 2), seg = 2 * Math.PI / n;
  var want = -Math.PI / 2 - (idx * seg + seg / 2);
  while (want < wheelRot + 6 * 2 * Math.PI) want += 2 * Math.PI;
  var start = wheelRot, t0 = performance.now();
  function frame(t) {
    var k = Math.min(1, (t - t0) / duration), e = 1 - Math.pow(1 - k, 3);
    wheelRot = start + (want - start) * e;
    drawWheel();
    if (k < 1) wheelAnim = requestAnimationFrame(frame);
  }
  wheelAnim = requestAnimationFrame(frame);
}
window.addEventListener('resize', drawWheel);
drawWheel();

/* ---------- Choix / réponses / chat ---------- */
$('#btn-verite').onclick = function () { socket.emit('turn:choose', { type: 'verite' }); };
$('#btn-action').onclick = function () { socket.emit('turn:choose', { type: 'action' }); };
function sendAnswer() { var v = $('#in-answer').value.trim(); if (!v) return; $('#in-answer').value = ''; socket.emit('chat:text', { text: v }); }
$('#btn-send').onclick = sendAnswer;
$('#in-answer').addEventListener('keydown', function (e) { if (e.key === 'Enter') sendAnswer(); });
function sendChat() { var v = $('#in-chat').value.trim(); if (!v) return; $('#in-chat').value = ''; socket.emit('chat:text', { text: v }); }
$('#btn-chat').onclick = sendChat;
$('#in-chat').addEventListener('keydown', function (e) { if (e.key === 'Enter') sendChat(); });
$('#btn-stop').onclick = function () { if (confirm('Terminer ? TOUT sera supprimé (messages + audios).')) socket.emit('game:stop'); };

/* ---------- Réactions ---------- */
['🔥', '😂', '😍', '😱', '👏', '❤️', '💀', '🥵'].forEach(function (e) {
  var b = document.createElement('button'); b.textContent = e;
  b.onclick = function () { socket.emit('reaction', { emoji: e }); };
  $('#rea').appendChild(b);
});
function float(e) {
  var d = document.createElement('div'); d.className = 'fe'; d.textContent = e;
  d.style.left = (8 + Math.random() * 84) + 'vw';
  $('#float').appendChild(d);
  setTimeout(function () { d.remove(); }, 2600);
}

/* ---------- Feed ---------- */
var items = [];
var feedOpen = true, unread = 0;
function updateUnread() { var b = $('#unread'); if (!b) return; b.hidden = feedOpen || unread === 0; b.textContent = unread + ' nouveaux'; }
function addMsg(it) { items.push(it); if (items.length > 60) items.shift(); if (!feedOpen && it.kind !== 'sys') { unread++; updateUnread(); } }
$('#feedtoggle').onclick = function () {
  feedOpen = !feedOpen;
  $('#feedbody').hidden = !feedOpen;
  $('#feedarrow').textContent = feedOpen ? '\u25BC' : '\u25B6';
  if (feedOpen) { unread = 0; updateUnread(); }
};
$('#btn-media').onclick = function () {
  if (!S) return;
  var box = $('#media-to'); box.innerHTML = '';
  S.players.forEach(function (p) {
    if (p.isBot || p.id === socket.id) return;
    var lab = document.createElement('label');
    lab.style.cssText = 'border:1px solid var(--line);border-radius:99px;padding:4px 10px;cursor:pointer;font-weight:700';
    var cb = document.createElement('input'); cb.type = 'checkbox'; cb.value = p.id; cb.checked = true;
    lab.appendChild(cb);
    lab.appendChild(document.createTextNode(' ' + p.name));
    box.appendChild(lab);
  });
  if (!box.children.length) box.textContent = 'Aucun autre joueur — invite quelqu\u2019un !';
  $('#mediafile').value = '';
  $('#mediaform').hidden = false;
};
$('#btn-media-cancel').onclick = function () { $('#mediaform').hidden = true; };
$('#btn-media-send').onclick = function () {
  var f = $('#mediafile').files[0];
  if (!f) return toast('Choisis d\u2019abord une photo ou vidéo');
  var to = [];
  document.querySelectorAll('#media-to input[type=checkbox]').forEach(function (cb) { if (cb.checked) to.push(cb.value); });
  if (!to.length) return toast('Choisis au moins un joueur');
  if (f.type.indexOf('image/') === 0) {
    var r = new FileReader();
    r.onload = function () {
      var img = new Image();
      img.onload = function () {
        var cv = document.createElement('canvas'), mx = 1000;
        var sc = Math.min(1, mx / Math.max(img.width, img.height));
        cv.width = Math.round(img.width * sc); cv.height = Math.round(img.height * sc);
        cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
        var q = 0.8, b64 = cv.toDataURL('image/jpeg', q);
        while (b64.length > 2600000 && q > 0.3) { q -= 0.15; b64 = cv.toDataURL('image/jpeg', q); }
        if (b64.length > 3200000) return toast('Photo trop lourde, réessaie');
        socket.emit('media:send', { b64: b64, kind: 'photo', to: to });
        $('#mediaform').hidden = true;
        toast('📤 Envoyé !');
      };
      img.src = r.result;
    };
    r.readAsDataURL(f);
  } else if (f.type.indexOf('video/') === 0) {
    if (f.size > 2200000) return toast('Vidéo trop lourde ! Max ~2 Mo (clip très court)');
    var r2 = new FileReader();
    r2.onload = function () {
      socket.emit('media:send', { b64: r2.result, kind: 'video', to: to });
      $('#mediaform').hidden = true;
      toast('📤 Envoyé !');
    };
    r2.readAsDataURL(f);
  } else toast('Format non supporté');
};
function drawFeed() {
  var f = $('#feed'); if (!f) return;
  f.innerHTML = '';
  items.forEach(function (it) {
    var el = document.createElement('div');
    if (it.kind === 'sys') { el.className = 'msg sys'; el.textContent = it.text; }
    else if (it.kind === 'audio' || it.kind === 'answer-audio') {
      el.className = 'msg' + (it.kind === 'answer-audio' ? ' answer' : '');
      var w = document.createElement('div'); w.className = 'who'; w.textContent = '🎙️ ' + it.name;
      var a = document.createElement('div'); a.className = 'audio';
      a.innerHTML = '<span class="p">▶</span><span>' + Math.round((it.ms || 0) / 1000) + 's — appuie pour écouter</span>';
      a.onclick = (function (b64) { return function () { try { new Audio(b64).play(); } catch (e) {} }; })(it.b64);
      el.appendChild(w); el.appendChild(a);
    } else if (it.kind === 'photo' || it.kind === 'video') {
      el.className = 'msg' + (it.mid === socket.id ? ' mine' : '');
      var w3 = document.createElement('div'); w3.className = 'who';
      w3.textContent = '\uD83D\uDD10 ' + (it.mid === socket.id ? 'Toi' : it.name) + (it.kind === 'photo' ? ' · \uD83D\uDCF7' : ' · \uD83C\uDFAC');
      el.appendChild(w3);
      if (it.kind === 'photo') { var im = document.createElement('img'); im.src = it.b64; im.className = 'media-img'; el.appendChild(im); }
      else { var v = document.createElement('video'); v.src = it.b64; v.className = 'media-vid'; v.controls = true; el.appendChild(v); }
    } else {
      el.className = 'msg' + (it.kind === 'answer' ? ' answer' : '');
      var w2 = document.createElement('div'); w2.className = 'who'; w2.textContent = (it.kind === 'answer' ? '💬 ' : '') + it.name;
      var tx = document.createElement('span'); tx.textContent = it.text;
      el.appendChild(w2); el.appendChild(tx);
    }
    f.appendChild(el);
  });
  f.scrollTop = f.scrollHeight;
}

/* ---------- Micro ---------- */
function pickMime() {
  if (!window.MediaRecorder) return '';
  var c = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'];
  for (var i = 0; i < c.length; i++) if (MediaRecorder.isTypeSupported(c[i])) return c[i];
  return '';
}
$('#mic').onclick = function () {
  if (rec && rec.state === 'recording') { rec.stop(); return; }
  navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
    var mime = pickMime();
    try { rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined); }
    catch (e) { toast('Micro indisponible 😬'); return; }
    recChunks = [];
    rec.ondataavailable = function (e) { if (e.data && e.data.size) recChunks.push(e.data); };
    rec.onstop = function () {
      clearInterval(recInt);
      $('#mic').classList.remove('rec');
      stream.getTracks().forEach(function (t) { t.stop(); });
      var dur = Date.now() - recT0;
      if (dur < 600) { toast('Trop court ! 1 seconde minimum.'); return; }
      var blob = new Blob(recChunks, { type: rec.mimeType || 'audio/webm' });
      var r = new FileReader();
      r.onload = function () { socket.emit('chat:audio', { b64: r.result, ms: dur }); };
      r.readAsDataURL(blob);
    };
    rec.start();
    recT0 = Date.now();
    $('#mic').classList.add('rec');
    $('#mic').textContent = '🔴 Enregistrement... appuie pour envoyer';
    recInt = setInterval(function () {
      if (Date.now() - recT0 > 30000 && rec.state === 'recording') rec.stop();
    }, 300);
  }, function () { toast('Micro inaccessible 😬 Vérifie les permissions.'); });
};
</script>
</body>
</html>`;

const app = express();
app.get('/', (req, res) => {
  res.set('Cache-Control', 'no-store, must-revalidate');
  res.send(HTML);
});
const server = http.createServer(app);
const io = new Server(server, { maxHttpBufferSize: 4e6 });

io.on('connection', (socket) => {
  socket.on('room:create', (data = {}) => {
    if (socketRoom.has(socket.id)) return;
    if (rooms.size >= MAX_ROOMS) return socket.emit('error:msg', { key: 'fullsessions' });
    const room = createRoom(socket, cleanName(data.name), data.difficulty, data.gender);
    socket.emit('joined', { code: room.code });
    broadcast(room);
  });

  socket.on('room:join', (data = {}) => {
    if (socketRoom.has(socket.id)) return;
    const room = rooms.get(String(data.code || '').toUpperCase().trim());
    const name = cleanName(data.name);
    if (!room) return socket.emit('error:msg', { key: 'notfound' });
    // Reprise de place : même pseudo = on reprend sa case (refresh, reconnexion)
    const p = [...room.players.values()].find(x => x.name.toLowerCase() === name.toLowerCase() && !x.isBot);
    if (p) {
      room.players.delete(p.id);
      socketRoom.delete(p.id);
      p.id = socket.id; p.connected = true;
      room.players.set(socket.id, p);
      socket.join(room.code);
      socketRoom.set(socket.id, room);
      socket.emit('joined', { code: room.code });
      io.to(socket.id).emit('feed:init', { feed: room.feed.slice(-40) });
      sys(room, name + ' est de retour 🔄');
      io.to(room.code).emit('player:back', { name });
      return broadcast(room);
    }
    if (room.players.size >= MAX_PLAYERS) return socket.emit('error:msg', { key: 'full' });
    if (Date.now() >= room.inviteAt + INVITE_TTL) return socket.emit('error:msg', { key: 'expired' });
    room.pending = room.pending.filter(r => r.name.toLowerCase() !== name.toLowerCase());
    room.pending.push({ id: socket.id, name, gender: data.gender === 'femme' ? 'femme' : 'homme', at: Date.now() });
    room.pending = room.pending.filter(r => Date.now() - r.at < 60000).slice(-4);
    socket.join(room.code);
    socket.emit('join:waiting', { code: room.code });
    io.to(room.code).emit('join:pending', { pending: room.pending.map(r => ({ id: r.id, name: r.name })) });
  });

  socket.on('join:respond', ({ id, ok } = {}) => {
    const room = socketRoom.get(socket.id); if (!room) return;
    const me = room.players.get(socket.id); if (!me || !me.isAdmin) return;
    const req = room.pending.find(r => r.id === id);
    if (!req) return;
    room.pending = room.pending.filter(r => r.id !== id);
    io.to(room.code).emit('join:pending', { pending: room.pending.map(r => ({ id: r.id, name: r.name })) });
    const sock = io.sockets.sockets.get(id);
    if (!ok || !sock) { io.to(id).emit('join:rejected'); return; }
    if (room.players.size >= MAX_PLAYERS) { io.to(id).emit('error:msg', { key: 'full' }); return; }
    addPlayer(room, sock, req.name, false, req.gender);
    sock.emit('joined', { code: room.code });
    io.to(id).emit('feed:init', { feed: room.feed.slice(-40) });
    broadcast(room);
  });

  socket.on('difficulty', ({ d } = {}) => {
    const room = socketRoom.get(socket.id); if (!room) return;
    const me = room.players.get(socket.id); if (!me || !me.isAdmin) return;
    if ([1, 2, 3, 4].includes(+d)) { room.difficulty = +d; sys(room, 'Difficulté : ' + ['Facile 😄', 'Moyen 😏', 'Direct 🔥', 'CHAUD 🌶️'][+d - 1]); broadcast(room); }
  });

  socket.on('invite:refresh', () => {
    const room = socketRoom.get(socket.id); if (!room) return;
    const me = room.players.get(socket.id); if (!me || !me.isAdmin) return;
    room.inviteAt = Date.now();
  });

  socket.on('bot:add', () => {
    const room = socketRoom.get(socket.id); if (!room) return;
    const me = room.players.get(socket.id); if (!me || !me.isAdmin) return;
    if (room.players.size >= MAX_PLAYERS) return;
    addBot(room);
    broadcast(room);
  });

  socket.on('game:start', () => {
    const room = socketRoom.get(socket.id); if (!room) return;
    const me = room.players.get(socket.id); if (!me || !me.isAdmin) return;
    if (room.players.size < 2) return;
    sys(room, '🔥 C\u2019est parti !');
    nextTurn(room);
  });

  socket.on('turn:choose', ({ type } = {}) => {
    const room = socketRoom.get(socket.id); if (!room) return;
    if (room.phase !== 'choosing' || !room.turn) return;
    if (socket.id !== room.turn.targetId) return;
    if (!['verite', 'action'].includes(type)) return;
    clearTimer(room);
    beginAnswering(room, type);
  });

  socket.on('chat:text', ({ text } = {}) => {
    const room = socketRoom.get(socket.id); if (!room) return;
    const p = room.players.get(socket.id); if (!p) return;
    const t = String(text || '').trim().slice(0, 300);
    if (!t) return;
    const isAnswer = room.phase === 'answering' && room.turn && room.turn.targetId === socket.id && !room.turn.answered;
    if (isAnswer) { pushFeed(room, { kind: 'answer', mid: p.id, name: p.name, text: t }); beginReacting(room); }
    else pushFeed(room, { kind: 'text', mid: p.id, name: p.name, text: t });
  });

  socket.on('chat:audio', ({ b64, ms } = {}) => {
    const room = socketRoom.get(socket.id); if (!room) return;
    const p = room.players.get(socket.id); if (!p) return;
    if (typeof b64 !== 'string' || !b64.startsWith('data:audio') || b64.length > AUDIO_MAX) return;
    const dur = Math.min(+ms || 0, 31000);
    const isAnswer = room.phase === 'answering' && room.turn && room.turn.targetId === socket.id && !room.turn.answered;
    if (isAnswer) { pushFeed(room, { kind: 'answer-audio', mid: p.id, name: p.name, b64, ms: dur }); beginReacting(room); }
    else pushFeed(room, { kind: 'audio', mid: p.id, name: p.name, b64, ms: dur });
  });

  socket.on('media:send', ({ b64, kind, to } = {}) => {
    const room = socketRoom.get(socket.id); if (!room) return;
    const p = room.players.get(socket.id); if (!p) return;
    if (typeof b64 !== 'string' || b64.length > 3300000) return;
    if (kind === 'photo' && !b64.startsWith('data:image')) return;
    if (kind === 'video' && !b64.startsWith('data:video')) return;
    if (!['photo', 'video'].includes(kind)) return;
    const item = { kind, mid: p.id, name: p.name, b64, ts: Date.now() };
    io.to(socket.id).emit('media:new', item);
    if (Array.isArray(to)) to.forEach(id => { if (room.players.has(id) && id !== socket.id) io.to(id).emit('media:new', item); });
  });

  socket.on('reaction', ({ emoji } = {}) => {
    const room = socketRoom.get(socket.id); if (!room) return;
    const p = room.players.get(socket.id); if (!p) return;
    io.to(room.code).emit('reaction', { emoji, name: p.name });
  });

  socket.on('player:kick', ({ id } = {}) => {
    const room = socketRoom.get(socket.id); if (!room) return;
    const me = room.players.get(socket.id); if (!me || !me.isAdmin) return;
    if (id === socket.id) return;
    removePlayer(room, id, true);
    broadcast(room);
  });

  socket.on('room:leave', () => {
    const room = socketRoom.get(socket.id); if (!room) return;
    removePlayer(room, socket.id, false);
    broadcast(room);
  });

  socket.on('game:stop', () => {
    const room = socketRoom.get(socket.id); if (!room) return;
    const me = room.players.get(socket.id); if (!me || !me.isAdmin) return;
    closeRoom(room);
  });

  socket.on('disconnect', () => {
    const room = socketRoom.get(socket.id); if (!room) return;
    if (room.pending.some(r => r.id === socket.id)) {
      room.pending = room.pending.filter(r => r.id !== socket.id);
      io.to(room.code).emit('join:pending', { pending: room.pending.map(r => ({ id: r.id, name: r.name })) });
    }
    const p = room.players.get(socket.id); if (!p) return;
    p.connected = false;
    if (room.players.size > 1) {
      sys(room, '\uD83D\uDCF4 ' + p.name + ' s\u2019est déconnecté');
      io.to(room.code).emit('player:offline', { name: p.name });
    }
    const isTarget = room.turn && room.turn.targetId === socket.id;
    if (isTarget && ['choosing', 'answering'].includes(room.phase)) { nextTurn(room); return; }
    broadcast(room);
    setTimeout(() => {
      const cur = room.players.get(socket.id);
      if (cur && !cur.connected) { removePlayer(room, socket.id, false); broadcast(room); }
    }, 60000);
  });
});

setInterval(() => {
  const now = Date.now();
  for (const [code, room] of rooms) {
    if (room.players.size === 0 && room.lastEmptyAt && now - room.lastEmptyAt > 60000) rooms.delete(code);
    room.players.forEach(p => { if (!p.isBot && !p.connected) { /* grace déjà géré par timeout */ } });
  }
}, 10000);

server.listen(process.env.PORT || 3000, '0.0.0.0', () => {
  console.log('🌶️ Vérité ou Action v11 — démarré sur le port', process.env.PORT || 3000);
  console.log('🤖 IA Groq :', process.env.GROQ_API_KEY ? 'CLÉ TROUVÉE ✅' : 'ABSENTE ❌ (ajoute GROQ_API_KEY dans Environment)');
});
