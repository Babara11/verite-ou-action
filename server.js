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
      ai: !!room.turn.ai,
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

function beginAnswering(room, type) {
  const t = room.players.get(room.turn.targetId);
  const q = withName(drawQuestion(room, type), t.name);
  room.phase = 'answering';
  room.turn = { targetId: t.id, type, question: q, deadline: Date.now() + ANSWER_TIME, answered: false, ai: false };
  room.lastQs = ((room.lastQs || []).concat(q)).slice(-4);
  if (t.isBot) {
    room.timer = setTimeout(() => {
      const ANS = ['Oula... je refuse de répondre 😂', 'Ma réponse est OUI. Point.', 'Franchement ? C\u2019est compliqué 😬', 'C\u2019est vrai mais chut 🤫', 'Je le savais, et j\u2019ai honte 😅', 'Demandez au prochain !'];
      pushFeed(room, { kind: 'answer', mid: t.id, name: t.name, text: pick(ANS) });
      beginReacting(room);
    }, 8000 + Math.random() * 5000);
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
  const tp = room.players.get(room.turn.targetId);
  // v18 : c'est au répondeur de lancer la roue. Un bot s'exécute vite ; un humain a REACT_TIME en secours.
  room.timer = setTimeout(() => nextTurn(room), tp && tp.isBot ? 2200 + Math.random() * 2000 : REACT_TIME);
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

/* ===== v17 · BANQUE XXL : générateur → plus de 2000 questions ===== */
(function () {
  function fill(list) {
    const out = [];
    list.forEach(function (item) {
      const tpl = item[0], xs = item[1], ys = item[2];
      if (!ys) xs.forEach(x => out.push(tpl.replace('{x}', x)));
      else xs.forEach(x => ys.forEach(y => { if (x !== y) out.push(tpl.replace('{x}', x).replace('{y}', y)); }));
    });
    return out;
  }
  /* --- Niveau 4 🌶️ CHAUD : vérités --- */
  const D4 = [
    "couché avec quelqu'un rencontré le même soir", "envoyé un nude à la mauvaise personne", "reçu un nude et fait semblant de rien",
    "fait l'amour dans une voiture", "fait l'amour sous la douche", "couché avec un(e) collègue", "embrassé deux personnes le même soir",
    "menti sur ton nombre de coups", "fait un plan à trois", "fantasmé sur l'ex d'un(e) ami(e)", "couché avec l'ex d'un(e) ami(e)",
    "fait l'amour au téléphone", "regretté un coup dès le lendemain", "couché chez tes parents en cachette", "fait l'amour dans les toilettes d'un bar",
    "filmé un de tes plans", "fait un striptease devant quelqu'un", "couché avec quelqu'un de marié", "été surpris(e) en pleine action",
    "surpris deux personnes en pleine action", "couché avec ton/ta voisin(e)", "envoyé un message très osé au mauvais chat", "couché le premier soir",
    "fait durer les préliminaires plus d'une heure", "simulé un orgasme", "découvert que l'autre simulait", "couché avec deux personnes en 24 h",
    "dit je t'aime juste pour coucher", "testé les menottes", "testé la chantilly au lit", "fait l'amour devant un miroir", "couché sur la plage",
    "gardé les sous-vêtements de quelqu'un", "volé un baiser pendant que l'autre conduisait", "fait l'amour en pleine nature", "reçu un massage qui a mal tourné (dans le bon sens)",
    "couché avec quelqu'un de 10 ans plus âgé", "couché avec quelqu'un de 10 ans plus jeune", "revu un(e) ex juste pour un plan", "eu un plan encore secret aujourd'hui",
    "fantasmé sur un(e) prof", "murmuré un truc très osé à quelqu'un d'ici", "envoyé un vocal coquin à 3 h du matin", "fait l'amour avec la télé allumée",
    "couché après une dispute (maquillage torride)", "arrêté en pleine action — raconte pourquoi", "ri au lit au pire moment", "couché avec quelqu'un sans connaître son prénom",
    "fait l'amour dans la voiture de tes parents", "couché avec les colocs dans la pièce d'à côté", "testé une position vue dans un film", "eu des marques visibles le lendemain",
    "fait un jeu osé qui a fini au lit (comme ce soir ?)", "couché avec un(e) ami(e) puis plus jamais parlé de ça", "dit ça n'arrivera plus... puis re-couché",
    "couché avec quelqu'un juste pour se venger", "eu un coup que tu racontes à tout le monde", "eu un coup que tu n'avoueras jamais (sauf ce soir ?)",
    "testé dans l'eau (piscine ou mer)", "flirté juste pour un verre gratuit", "embrassé quelqu'un du même sexe", "été touché(e) sous la table en pleine soirée",
    "rentré(e) à pied à 6 h du matin de honte", "couché avec ton/ta chef", "couché pendant tes règles (assumé ?)", "envoyé des photos en pleine réunion",
    "porté les habits de l'autre le matin d'après", "eu un accident de préservatif (panique racontée)", "couché avec un(e) client(e) ou un(e) serveur/euse",
    "eu une aventure avec quelqu'un en couple", "couché dans un dressing ou un parking", "eu un coup de foudre 100 % physique", "dormi nu(e) chez quelqu'un la première nuit",
    "rechigné à partir au matin d'après", "mis fin à une relation pour une nuit", "gardé un plan en même temps qu'une relation",
    "eu une histoire avec deux amis proches", "fait un tattoo lié à un plan — toujours là ?", "couché le jour de ton anniversaire avec un(e) inconnu(e)"
  ];
  const AVECY = ["couché", "embrassé", "flirté", "douché", "dormi", "fantasmé", "dansé collé-serré", "échangé des nudes", "été coincé(e) en pleine action", "joué à ce genre de jeu"];
  const YQQN = ["quelqu'un de marié", "ton/ta chef", "un(e) voisin(e)", "l'ex d'un(e) ami(e)", "deux personnes le même jour", "quelqu'un rencontré le même soir", "ton/ta prof", "un(e) inconnu(e) dans un train", "le frère ou la sœur d'un ami", "quelqu'un présent(e) ce soir (pardon 😈)"];
  const FANT = ["deux personnes en même temps", "un lieu public", "les menottes", "une longue douche à deux", "le grand miroir d'une chambre", "un(e) parfait(e) inconnu(e)", "une star", "le/la voisin(e) d'en face", "un bureau vide", "une plage la nuit", "une voiture en pleine ville", "un mariage (pas le tien)"];
  const ANQ = ["cette année", "à deux reprises le même week-end", "en voyage", "avant tes 20 ans", "et que tu caches encore à tout le monde"];
  const PREF4 = [
    "un plan avec une star", "un plan d'un soir avec un(e) inconnu(e) magnifique", "une nuit avec ton crush de lycée", "un week-end entier au lit",
    "un quickie avant le travail", "des préliminaires d'une heure", "un massage très lent", "un strip privé", "un baiser volé sous la pluie",
    "une soirée qui finit à trois", "un plan en vacances", "un fantasme réalisé par messages", "un mois de relation secrète", "une déclaration torride en public",
    "un câlin qui dégénère", "un plan dans une voiture", "un plan sous la douche", "un plan avec les lumières allumées", "un plan avec une bande-son choisie",
    "un miroir face au lit", "les menottes", "la chantilly", "un rendez-vous qui commence par un massage", "un réveil à 3 h du matin pour un câlin",
    "un plan avec un(e) ami(e) de longue date", "une histoire interdite", "un plan à l'hôtel avec vue", "un pique-nique qui tourne chaud", "un bain à deux",
    "un plan un jour de pluie", "un plan juste avant un mariage", "un plan le jour de la Saint-Valentin", "un slow qui dure toute la nuit", "un petit-déjeuner au lit qui dégénère"
  ];
  QUESTIONS[4].verite.push(...fill([
    ["As-tu déjà {x} ?", D4],
    ["As-tu déjà {x} avec {y} ? Donne les détails.", AVECY, YQQN],
    ["Ton fantasme qui implique {x} : raconte TOUT.", FANT],
    ["Le truc le plus chaud que tu aies fait {x} ?", ANQ]
  ]));
  PREF4.forEach(a => PREF4.forEach(b => { if (a !== b) QUESTIONS[4].verite.push("Préfères-tu " + a + " ou " + b + " ? Défends ton choix devant le groupe 😈"); }));
  /* --- Niveau 4 🌶️ CHAUD : actions --- */
  const A1 = ["gémis le plus naturellement possible", "racontes ton dernier rêve coquin sans censure", "décris ce que tu portes et ce que tu enlèverais en premier", "chuchotes au joueur de ton choix ce que tu lui ferais ce soir", "imites ta voix séduction au téléphone", "décris ton dernier baiser en détail", "racontes ta première fois comme un reporter sportif", "expliques pourquoi tu es dangereux/dangereuse au lit"];
  const A2 = ["ta position préférée", "un striptease lent", "une nuit entière résumée en 15 secondes", "ce que tu fais seul(e) le matin", "un baiser qui monte trop vite", "le moment le plus gênant de ta vie intime"];
  const A3 = ["20 pompes en sous-vêtements", "ton meilleur regard de séduction sans rire", "un slow très collé en solo", "10 squats face cam en tenue (dé)correcte", "ta meilleure imitation de gémis de film", "une pose de mannequin en sous-vêtements"];
  const A4 = ["Ce soir, je voudrais…", "La chose la plus folle que je ferais pour toi…", "Si on était seuls maintenant…", "Mon fantasme avec toi, c'est…", "Je n'ai jamais osé te dire que…"];
  const A5 = ["ta nuit idéale avec lui/elle", "ta première heure si vous étiez en couple", "ton plan parfait, minute par minute"];
  QUESTIONS[4].action.push(...fill([
    ["Envoie un vocal de 15 secondes où tu {x}. 👄", A1],
    ["Mime {x} pendant 15 secondes — le groupe doit deviner.", A2],
    ["Fais {x} : cam ouverte, le groupe note sur 10.", A3],
    ["Envoie au joueur de ton choix un message qui commence par « {x} »", A4],
    ["Le groupe désigne quelqu'un : déclare-lui en 30 secondes {x}.", A5]
  ]));
  /* --- Niveau 3 🔥 DIRECT --- */
  const D3 = ["envoyé un message à 2 h du matin pour un plan", "eu un rencard qui a fini très très tard", "flirté toute une soirée avec quelqu'un de pris", "gardé un plan secret à ton/ta meilleur(e) ami(e)", "couché avec quelqu'un que tu as revu ensuite en public", "eu un coup de foudre purement physique", "embrassé quelqu'un juste pour rendre quelqu'un d'autre jaloux", "regretté de ne pas avoir osé quelque chose (quoi ?)", "fini la nuit chez quelqu'un sans prévenir personne", "échangé des messages très osés avec un(e) inconnu(e)", "accepté un verre juste pour rester près de quelqu'un", "eu une histoire qui a mal fini (raconte)", "couché avec un(e) ami(e) sans que ça casse l'amitié", "reçu un cadeau très osé (lequel ?)", "eu un surnom dans l'intimité (lequel ?)", "été repeché(e) par un(e) ex", "testé un site ou une app de rencontre (verdict ?)", "eu le coup de foudre pour la voix de quelqu'un", "pensé à quelqu'un d'ici sous la douche", "gardé un contact flou juste pour le plaisir", "été en couple ET en même temps attiré(e) par quelqu'un d'autre", "reçu un compliment très osé qui t'a marqué(e)", "proposé un plan qui a été refusé (raconte le drame)", "refusé un plan et regretté (lequel ?)"];
  const PREF3 = ["un dîner aux chandelles qui dégénère", "un massage qui s'éternise", "un baiser lent", "un baiser pressé", "une soirée dansante collée-serrée", "un chat coquin toute la nuit", "un vocal d'une heure", "un plan au réveil", "un plan avant de dormir", "une histoire d'un été", "une histoire d'un mois", "un crush que tu n'avoues jamais", "un secret partagé à deux", "un jeu de vérité qui monte", "un massage mis en musique", "un week-end sans téléphones à deux", "un bain à deux", "une sieste qui dégénère", "un baiser sous les étoiles", "un rendez-vous chez le/la voisin(e)", "un slow dans le salon", "un pique-nique secret", "un regard qui dure trop longtemps", "un sourire qui promet", "un câlin au cinéma", "un voyage à deux improvisé"];
  QUESTIONS[3].verite.push(...fill([
    ["As-tu déjà {x} ?", D3],
    ["Préfères-tu {x} ou {y} ? Justifie 🔥", PREF3, PREF3]
  ]));
  const B3 = ["Fais 10 pompes, le groupe compte à voix haute", "Imite le rire de quelqu'un d'ici jusqu'à ce que quelqu'un ris", "Fais un discours de déclaration d'amour à la lampe la plus proche", "Danse sans musique pendant 20 secondes, très sérieusement", "Raconte ta dernière soirée en chantant", "Fais ta pub de séduction : 15 secondes pour te vendre"];
  const C3 = ["Je pense très fort à toi quand…", "Ce qui me rend fou/folle chez toi…", "Si je devais t'embrasser maintenant…", "Mon plus beau souvenir avec toi (même inventé)…", "Je te préviens : avec moi, la nuit…", "La dernière fois que j'ai pensé à toi…"];
  QUESTIONS[3].action.push(...fill([
    ["{x} !", B3],
    ["Envoie au joueur de ton choix un message qui commence par « {x} »", C3]
  ]));
  /* --- Niveaux 1-2 : petites touches --- */
  const D2 = ["envoyé un message romantique à la mauvaise personne", "eu un crush sur un(e) ami(e) de longue date", "préparé un rencard parfait (raconte)", "fait un compliment hyper osé en public", "eu le béguin pour un(e) célébrité (qui ?)", "été surpris(e) à regarder quelqu'un un peu trop longtemps", " menti sur tes talents de séduction", "eu un rendez-vous entièrement payé par l'autre", "reçu un cadeau romantique inoubliable", "envoyé un vocal romantique", "danse collé-serré au ralenti", "eu un crush sur quelqu'un de ce groupe d'amis"];
  const B2 = ["Fais ton plus bel aimant à sourire pendant 10 secondes", "Chante le refrain d'une chanson d'amour, très sérieusement", "Fais un compliment très classe à chaque joueur en 30 secondes", "Danse les yeux fermés, le groupe met la musique", "Imite un slow avec la chaise la plus proche", "Raconte ton pire rencard en imitant les personnages"];
  const D1 = ["envoyé un message coquin au mauvais destinataire", "eu un crush sur un(e) prof", "stalké le profil de ton crush jusqu'en 2015", "menti pour éviter un rencard", "embrassé quelqu'un le premier soir", "fait un déclaration ratée (raconte le crash)"];
  const B1 = ["Raconte ta plus grosse honte de soirée en imitant les gens", "Fais 10 abdominaux en rigolant", "Danse comme ton artiste préféré pendant 15 secondes", "Fais ta meilleure imitation d'un(e) joueur d'ici", "Chante joyeux anniversaire à quelqu'un d'ici, version opéra", "Montre ta dernière photo galerie (sans tricher !)"];
  QUESTIONS[2].verite.push(...D2); QUESTIONS[2].action.push(...B2);
  QUESTIONS[1].verite.push(...D1); QUESTIONS[1].action.push(...B1);
  /* --- v19 · MÉGA-EXTENSION : objectif 10 000+ questions, les plus chaudes possibles --- */
  const WORST = ["un plan qui a duré 20 secondes", "un plan interrompu par un appel des parents", "être surpris(e) en pleine action par le/la coloc", "un bruit suspect entendu par les voisins", "un préservatif qui craque au mauvais moment", "tomber amoureux(se) d'un(e) menteur(se)", "un plan sans aucun baiser", "revoir ton ex au bras de quelqu'un d'autre", "un message osé envoyé au groupe familial par erreur", "un vocal coquin envoyé à la mauvaise personne", "un rire jaune en pleine intimité", "gémir si fort que les voisins frappent au mur", "oublier le prénom en pleine action", "une position ratée qui finit chez le kiné", "être largué(e) le jour de ton anniversaire", "un plan dévoilé à tout le groupe d'amis", "une nuit à trois qui vire au drame", "retrouver ses photos privées partagées partout", "un plan filmé à l'insu", "saouler au point d'oublier la fin de soirée", "une déclaration ratée devant tout le monde", "un plan chez les parents qui rentrent tôt", "flirter avec quelqu'un qui avoue être marié(e) après", "une gueule de bois de honte le lendemain", "un coup dont tout le salon a entendu parler", "une photo compromettante découverte par un(e) ami(e)", "un plan avec l'amour d'enfance de ton/ta meilleur(e) ami(e)", "un maillot qui lâche au pire moment", "un baiser volé par la mauvaise personne", "un plan où l'alcool t'a joué un mauvais tour"];
  QUESTIONS[4].verite.push(...fill([["Qu'est-ce qui est pire : {x} ou {y} ? Défends ta réponse.", WORST, WORST]]));
  const CHOICE = ["embrasser ton ex une dernière fois", "embrasser le/la voisin(e)", "embrasser quelqu'un d'ici", "rester sans rien pendant 1 an", "passer une nuit avec une star", "recevoir un massage d'un(e) parfait(e) inconnu(e)", "envoyer un nude à ton crush", "montrer ta galerie photos au groupe", "faire un strip maintenant en cam", "échanger vos téléphones pendant 5 minutes", "coucher avec ton/ta chef", "tester un plan à trois", "te laisser attacher par le groupe", "gémir en public maintenant", "embrasser la personne à ta gauche", "décrire ton dernier rêve coquin en détail", "envoyer un vocal sensuel au joueur de ton choix", "danser un slow très collé avec le joueur que le groupe choisit", "révéler ton pire secret de chambre à coucher", "accepter 3 gages du groupe"];
  QUESTIONS[4].verite.push(...fill([["Tu DOIS choisir : {x} ou {y} ? Le groupe valide 😈", CHOICE, CHOICE]]));
  QUESTIONS[4].verite.push(...[
    "Le dernier truc très chaud que tu as regardé seul(e) ? Précis.",
    "Combien de fois par semaine ? Le vrai chiffre, sans mentir.",
    "Le plan dont tu es le plus fier ? Raconte minute par minute.",
    "Ta plus grosse humiliation au lit ? Le groupe pardonne (presque).",
    "Ce que tu fais seul(e) que personne ne soupçonnerait ?",
    "L'endroit du corps où tu aimes être touché(e) en premier ?",
    "Le prénom que tu as crié sans le vouloir ?",
    "Ton record de fois en une seule nuit ?",
    "La personne la plus inattendue que tu aies embrassée ?",
    "Ce qui t'a fait dire oui alors que tu devais dire non ?",
    "Ton pire réveil après un plan ? Qui, où, comment ?",
    "Le compliment le plus chaud qu'on t'ait jamais fait ?",
    "Ce que tu portes quand tu veux séduire, vraiment ?",
    "Ta position préférée et celle que tu refuses ? Pourquoi ?",
    "Le message le plus osé de ta galerie ? Lis-le à voix haute.",
    "Le plan que tu refais mentalement depuis des mois ?",
    "Ce que tu as déjà fait par pur chagrin d'amour ?",
    "Le pari le plus fou que tu aies accepté pour un baiser ?",
    "Ta plus longue soirée câlins sans rien d'autre ? Vraiment rien ?",
    "Ce qui te fait perdre le contrôle instantanément ?",
    "L'odeur qui te rend fou/folle ? Raconte la scène.",
    "Ton plus grand tabou jamais avoué à personne ?",
    "Le secret que ton/ta ex garde encore sur toi ?",
    "Ce que tu regardes en premier chez quelqu'un ? Sois honnête.",
    "Le lieu public où tu as failli te faire prendre ?",
    "Ton pire « c'était censé être un plan d'un soir » ?",
    "Ce que tu as supprimé de ton téléphone en panique ?",
    "Ton niveau sur 10 au lit, noté par toi ? Le groupe ajuste.",
    "Le bruit que tu fais quand c'est très très bon ? Démontre.",
    "Ce que tu faisais la dernière fois que tu as simulé ?",
    "Le fantasme d'adolescence qui t'a marqué(e) à vie ?",
    "La photo la plus chaude de ta galerie ? Montre-la ou raconte.",
    "Ce que tu ne feras JAMAIS, même pour un milliard ?",
    "L'accessoire que tu rêves de tester un jour ?",
    "Ton plan idéal pour ce week-end, sans aucune limite ?",
    "La personne d'ici que tu imagines le mieux en mode torride ? Mensonge interdit.",
    "Ce que tu as déjà fait juste pour rendre quelqu'un jaloux ?",
    "Ton pire moment « on était censés dormir, pas ça » ?",
    "La nuit que tu refais en boucle dans ta tête ?",
    "Ce qui t'a déjà fait oublier un prénom en pleine action ?",
    "Le drame le plus drôle entendu par les voisins ?",
    "Ta technique de séduction la plus efficace ? Démontre sur la cam.",
    "Ce que tu changes dans ta vie si tu recommences à 18 ans ?",
    "Ton talon d'Achille quand on t'embrasse le cou ?",
    "Le plan le plus risqué réussi ? On salue le courage.",
    "Ce que tu as déjà murmuré qui a tout déclenché ?",
    "Le compliment que tu voudrais qu'on te fasse MAINTENANT ?",
    "Ce que ton miroir voit et que le groupe ne devine pas ?",
    "Le plan où tu as laissé le plus de preuves derrière toi ?",
    "Ton meilleur souvenir dans une voiture ? Détails.",
    "Ce que tu as déjà échangé contre une nuit ?",
    "Ton rituel avant un rencard qui doit marcher ?",
    "Le mot qui te fait fondre quand on le murmure ?",
    "Ce que tu as déjà fait en pensant à quelqu'un d'ici ? Confession.",
    "La vérité que tu n'avoues que parce que c'est ce jeu qui le demande ?",
    "Ce que tu as déjà fait sous la table pendant un dîner de famille ?",
    "Ton plus grand écart d'âge ? L'histoire en 3 phrases.",
    "La chose que tu as dite après et que tu regrettes encore ?",
    "Combien de nudes encore stockés dans ton téléphone ? Le total exact."
  ]);
  const PREF4B = ["un plan en avion", "un plan en train de nuit", "un plan avec un(e) artiste", "un plan avec le/la barman", "un plan avec ton/ta prof de sport", "un plan dans les vestiaires", "un plan sur un toit-terrasse", "un plan au lever du soleil", "un plan à la seule lumière du téléphone", "un plan filmé rien que pour vous deux", "un plan en tenue spéciale", "un plan sous la pluie d'été", "un plan avec un accent à faire fondre", "un plan avec des mains magiques", "un plan avec un(e) inconnu(e) au nom parfait", "un plan qui commence par un pari", "un plan qui commence par un massage des pieds", "un plan après un match gagné", "un plan au réveil d'un dimanche", "un plan avec petit-déjeuner préparé", "un plan avec playlist maison", "un plan chez un(e) ami(e) parti(e) en voyage", "un plan dans une voiture qui roule", "un plan au bord d'une falaise", "un plan avec vue sur la mer", "un plan sous les étoiles filantes", "un plan à minuit pile", "un plan avant un examen", "un plan pour fêter une victoire", "un plan en pleine canicule", "un plan sous la couverture en hiver", "un plan avec de la glace", "un plan avec du miel", "un plan dans une douche d'hôtel", "un plan dans un jacuzzi", "un plan après un massage qui dégénère", "un plan avec un miroir en face"];
  const PREF4ALL = PREF4.concat(PREF4B);
  const PREF4SEEN = new Set();
  PREF4.forEach(a => { PREF4.forEach(b => { if (a !== b) PREF4SEEN.add(a + '|' + b); }); });
  PREF4ALL.forEach(a => PREF4ALL.forEach(b => { if (a !== b && !PREF4SEEN.has(a + '|' + b)) QUESTIONS[4].verite.push("Préfères-tu " + a + " ou " + b + " ? Défends ton choix devant le groupe 😈"); }));
  const DARE = [
    "Envoie un nude au joueur de ton choix. Sans recadrer.",
    "Fais un strip complet jusqu'aux sous-vêtements, cam ouverte, 30 secondes.",
    "Décris en détail ce que tu portes en dessous en ce moment.",
    "Gémis ton plus réaliste pendant 10 secondes, cam allumée.",
    "Envoie un vocal de 20 secondes racontant ton plan parfait, sans censure.",
    "Mime ta position préférée : le groupe doit la deviner exactement.",
    "Envoie une photo de ta tenue de nuit au groupe.",
    "Chuchote au joueur de ton choix ce que tu lui ferais ce soir : 30 secondes.",
    "Décris ton dernier rapport en 5 phrases. Le groupe compte.",
    "Envoie au joueur de ton choix le message le plus osé que tu oses écrire.",
    "Fais 15 squats face cam en sous-vêtements.",
    "Lèche ton doigt lentement en regardant la cam pendant 10 secondes.",
    "Dis à voix haute ce que tu regardes en premier chez chaque joueur.",
    "Simule un baiser lent avec ta main, cam ouverte, 15 secondes.",
    "Envoie un vocal où tu gémis le prénom choisi par le groupe.",
    "Retire un vêtement maintenant. Le groupe choisit lequel.",
    "Décris tes sous-vêtements d'hier. Les détails comptent double.",
    "Raconte ta nuit la plus folle en 20 secondes chrono.",
    "Fais un compliment TRÈS osé à chaque joueur, l'un après l'autre.",
    "Écris ici le fantasme que tu as sur la personne que le groupe désigne.",
    "Fais un slow très collé avec le coussin, comme le joueur de ton choix.",
    "Envoie un selfie « sous la table » : ce qui se voit doit être chaud.",
    "Tiens 30 secondes sans rire pendant que le groupe te dit tes surnoms intimes.",
    "Mime un préliminaire complet avec un coussin. 20 secondes.",
    "Envoie ton meilleur regard de séduction suivi d'un baiser à la cam.",
    "Chante le prénom du joueur de ton choix comme une déclaration torride.",
    "Décris ta dernière douche en mode reporter. Tout.",
    "Envoie à un(e) ex : « j'ai pensé à toi ce soir ». Preuve à l'appui.",
    "Imite les bruits de ta meilleure nuit. 15 secondes. Sans rire.",
    "Envoie ta photo la plus chaude de la galerie. Le groupe juge.",
    "Raconte ta pire erreur de destinataire en imitant les deux personnes.",
    "Fais le tour de tes zones sensibles en les nommant. Le groupe note la précision.",
    "Envoie au joueur de ton choix : « si j'étais à côté de toi… » et complète.",
    "Laisse le groupe écrire ton prochain message à ton crush. Tu l'envoies.",
    "Fais un discours de 30 secondes pour convaincre le groupe de passer la nuit avec toi.",
    "Décris ce que tu vois quand tu penses au joueur que le groupe choisit.",
    "Envoie un selfie avec la langue sortie. Le groupe note sur 10.",
    "Reproduis ton dernier baiser avec le dos de ta main. 10 secondes.",
    "Fais 10 secondes de regard brûlant à la cam sans ciller.",
    "Raconte une fois où tu as été surpris(e) : rejoue la scène avec des voix.",
    "Mime ce que tu ferais seul(e) avec le joueur que le groupe désigne. 15 secondes.",
    "Envoie un vocal où tu souffles le prénom du joueur de ton choix 3 fois. Sensuel obligé.",
    "Fais semblant d'être pris(e) en flagrant délit. Scène complète, 20 secondes.",
    "Décris ton dernier « déshabillage mental » de quelqu'un d'ici. Initiales acceptées.",
    "Envoie ta meilleure photo « au lit ». Récente, sans tricher.",
    "Mime l'orgasme le moins convaincant du monde, puis le plus convaincant. Le groupe vote.",
    "Fais une déclaration d'amour brûlante à un objet de ta pièce. 20 secondes.",
    "Envoie ici la chose la plus chaude que tu oses écrire en message public.",
    "Raconte ton fantasme le plus récent en commençant par « hier soir, j'ai rêvé que… »",
    "Montre ton geste de séduction signature en 10 secondes de cam intense.",
    "Décris ta technique préférée comme un chef décrit sa recette : complète.",
    "Envoie un message public qui résume ton humeur de ce soir... version 18+.",
    "Tiens 20 secondes en tenue (dé)correcte sans bouger. Le groupe admire.",
    "Fais ta pub « pourquoi moi » en 15 secondes, version torride.",
    "Décris le baiser parfait en 3 gestes. Montre-les."
  ];
  QUESTIONS[4].action.push(...DARE);
  const DARE1 = ["envoyer un nude à quelqu'un d'ici", "faire un strip de 20 secondes", "gémir à la cam pendant 10 secondes", "décrire ton plan parfait en vocal", "embrasser à distance (en cam) la personne que le groupe désigne", "montrer ta dernière photo privée", "chanter une déclaration torride à quelqu'un d'ici", "faire un massage des épaules au joueur suivant", "raconter ton pire coup en détail", "envoyer un message très osé à ton crush", "imiter tes gémissements de film préférés", "décrire ce que tu ne portes PAS ce soir", "faire 20 pompes en sous-vêtements", "laisser le groupe écrire ton statut WhatsApp", "dévoiler ton fantasme interdit", "faire un striptease sur une chanson choisie par le groupe", "envoyer un selfie « bonne nuit » spécial", "chuchoter un secret de chambre à coucher", "faire 10 secondes de regard brûlant sans rire", "lécher tes lèvres très lentement en regardant la cam", "donner ton avis torride sur chaque joueur", "enregistrer un vocal qui finit par un gémis", "envoyer ta position du matin en photo", "montrer le haut de ta tenue de nuit", "écouter 3 confessions d'ici sans juger", "décrire ta nuit idéale avec le groupe qui note", "envoyer un selfie pris maintenant sans préparation", "répéter « je suis à toi ce soir » 5 fois à la cam"];
  const DARE2 = ["laisser quelqu'un d'ici te poser 3 questions SANS filtre", "envoyer ta plus belle photo en maillot", "accepter un défi du groupe pendant 1 minute", "laisser le groupe choisir ta photo de profil pendant 1 h", "raconter ta première fois minute par minute", "envoyer un vocal d'excuses à un(e) ex", "te laisser enregistrer en train de gémir", "faire un slow sensuel avec un coussin", "montrer le bas de ta tenue de ce soir", "faire un compliment très chaud à chaque joueur", "envoyer ta routine du matin version sensuelle", "accepter un pseudo ridicule pendant 2 tours", "décrire ton corps préféré... le tien, en détail", "faire ta pub « plan parfait » en 20 secondes", "raconter la fois où tu as été surpris(e)", "montrer ton meilleur pas de danse très serré", "t'adresser au groupe comme une star du X pendant 30 secondes", "laisser un joueur lire ton dernier message privé à voix haute", "faire 15 secondes de gémis en crescendo", "embrasser ton coussin comme un(e) professionnel(le)", "répondre à n'importe quoi pendant 1 minute sans dire non", "laisser le groupe te choisir le défi de la prochaine partie", "raconter ta plus belle nuit en poésie torride", "accepter le prochain gage sans discuter", "faire ton meilleur sourire de séduction et le garder 15 secondes", "montrer ta démarche de séduction légendaire", "improviser un slam torride sur le joueur de ton choix", "envoyer un vocal bonne nuit très suggestif"];
  QUESTIONS[4].action.push(...fill([["Au choix : {x} ou {y} — ton poison 😈", DARE1, DARE2]]));
  const WHO = ["au joueur le plus timide", "à la personne la plus osée d'ici", "au dernier joueur qui a répondu", "au joueur de ton choix", "à la personne que tu trouves la plus chaude ici", "au premier joueur qui a rejoint le salon", "au joueur le plus silencieux en ce moment", "à ton crush du salon (le groupe regarde)"];
  const MSG = ["Tu me rends fou/folle quand…", "Ce soir, j'aimerais…", "Mon fantasme avec toi…", "Si on était seuls maintenant…", "Je n'ai jamais osé te dire que…", "La chose la plus folle que je ferais pour toi…", "Ton parfum me fait…", "Ce que je regarderais en premier sur toi…", "Si je t'embrassais maintenant…", "Avec toi, la nuit…", "Je te préviens : moi, c'est…", "Mon secret sur toi…", "Ce que je ferais si tu frappais à ma porte…", "La première chose que j'ai pensée en te voyant…", "Là, tout de suite, j'ai envie de…", "Ton pseudo dans mon téléphone mérite…", "La dernière fois que j'ai pensé à toi…", "Ce qui me rend accro chez toi…", "Si je devais te garder pour une nuit…", "Ce que ton regard me fait…"];
  QUESTIONS[4].action.push(...fill([["Envoie {y} un message qui commence par « {x} »", MSG, WHO]]));
  const PREF3B = ["un plan interdit", "un plan sur la plage la nuit", "un plan avec un(e) inconnu(e) séduisant(e)", "un plan au clair de lune", "un plan après un bal", "un plan avec du chocolat", "un plan avec des bougies", "un plan en moto", "un plan dans un hammam", "un plan au sommet d'une colline", "un plan après un orage", "un plan en pyjama", "un plan avec un bouquet de roses", "un plan avec un vocal de 5 minutes"];
  const PREF3ALL = PREF3.concat(PREF3B);
  const PREF3SEEN = new Set();
  PREF3.forEach(a => { PREF3.forEach(b => { if (a !== b) PREF3SEEN.add(a + '|' + b); }); });
  PREF3ALL.forEach(a => PREF3ALL.forEach(b => { if (a !== b && !PREF3SEEN.has(a + '|' + b)) QUESTIONS[3].verite.push("Préfères-tu {x} ou {y} ?".replace('{x}', a).replace('{y}', b) + " Justifie 🔥"); }));
  QUESTIONS[3].verite.push(...fill([["As-tu déjà {x} ?", ["pris un vol juste pour voir quelqu'un", "écrit une lettre d'amour jamais envoyée", "gardé une bougie pour un rencard", "préparé un dîner qui a fini très tard", "dansé jusqu'à l'aube pour quelqu'un", "embrassé sous la pluie", "regretté de ne pas avoir embrassé quelqu'un", "eu un crush dans la salle en ce moment", "chanté pour quelqu'un", "envoyé des fleurs sans te nommer", "triché à ce jeu pour éviter un gage", "attendu un message toute la nuit", "eu un amour d'été resté secret", "dit oui à un rencard par surprise", "improvisé un slow dans le salon", "reçu un baiser surprise", "flirté par fenêtre interposée", "eu un coup de foudre au premier message", "gardé un souvenir intime précieusement", "répété un compliment dans ta tête toute la journée"], null]]));
  QUESTIONS[3].action.push(...[
    "Chante ta déclaration d'amour au joueur de ton choix, version opéra.",
    "Fais une déclaration dramatique à la lampe la plus proche.",
    "Envoie un selfie surprise au groupe maintenant.",
    "Raconte ton pire rencard en imitant les deux personnages.",
    "Danse les yeux fermés pendant que le groupe met la musique.",
    "Fais ta meilleure imitation du rire de quelqu'un d'ici.",
    "Écris un poème torride de 4 lignes ici, maintenant.",
    "Envoie un vocal en chantant une déclaration d'amour.",
    "Fais un compliment de star à chaque joueur en 30 secondes.",
    "Mime ton rencard de rêve avec le coussin.",
    "Imite un slow radio avec la chaise la plus proche.",
    "Décris ta tenue du soir comme un défilé de mode.",
    "Fais 10 abdominaux en rigolant.",
    "Chante la chanson de ton premier amour.",
    "Rejoue ta première impression de chacun ici, voix incluses.",
    "Fais ta pub de rencard en 15 secondes.",
    "Raconte ta plus grosse honte en mode compte-rendu officiel.",
    "Envoie ta photo la plus spontanée de la galerie.",
    "Fais semblant d'être en direct TV : le scoop de ta vie amoureuse.",
    "Imite ta réaction si ton crush t'embrassait maintenant.",
    "Danse une chanson de ton année de lycée.",
    "Fais une poésie sur le joueur à ta droite.",
    "Raconte ta plus belle surprise reçue d'un amour.",
    "Fais 15 secondes de mime silencieux amoureux.",
    "Décris ta première impression de chaque joueur en un mot.",
    "Imite ta démarche de séduction légendaire.",
    "Envoie un vocal « bonne nuit » à chaque joueur.",
    "Fais ton meilleur sourire de rencard et tiens 15 secondes.",
    "Envoie le message « j'ai pensé à toi » au joueur de ton choix, sans expliquer.",
    "Fais 20 secondes de regard amoureux à la cam sans rire."
  ]);

  QUESTIONS[4].verite.push(...fill([['Tu ne gardes qu un : {x} ou {y} ? Trop tard, tu réponds 😏', PREF4ALL, PREF4ALL]]));
  QUESTIONS[4].verite.push(...fill([['Tu effaces à vie l un des deux : {x} ou {y} ? Choisis ton sacrifice.', WORST, WORST]]));
  let tot = 0;
  Object.keys(QUESTIONS).forEach(d => { tot += QUESTIONS[d].verite.length + QUESTIONS[d].action.length; });
  console.log('📚 Banque de questions :', tot, '— 🌶️ niv.4 :', QUESTIONS[4].verite.length + QUESTIONS[4].action.length);
})();

/* v18 : la question s'adresse au joueur par son prénom : "Modou, ..." */
function withName(q, name) {
  q = String(q || '').trim();
  if (!q || !name || q.indexOf(name) === 0) return q;
  const c = q.slice(0, 1);
  if (/[A-Z\u00C0-\u00DD]/.test(c)) q = c.toLowerCase() + q.slice(1);
  return name + ', ' + q;
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
.grid6 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; }
@media (min-width: 560px) { .grid6 { grid-template-columns: repeat(6, 1fr); } }
.cell { position: relative; background: var(--bg2); border: 1.5px solid var(--line); border-radius: 10px; padding: 8px 3px 6px; min-height: 46px; display: flex; flex-direction: column; gap: 1px; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; overflow: hidden; }
.cell > span { max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cell .num { position: absolute; top: 2px; left: 5px; font-size: 8px; color: var(--mut); }
.cell .dot { position: absolute; top: 3px; right: 4px; width: 7px; height: 7px; border-radius: 50%; background: var(--hot); }
.cell .dot.on { background: var(--ok); box-shadow: 0 0 6px var(--ok); }
.cell.empty { border-style: dashed; opacity: .45; }
.cell.me { border-color: var(--hot2); }
.cell.target { border-color: var(--hot); box-shadow: 0 0 10px rgba(255,46,99,.6); }
.cell .x { position: absolute; bottom: 1px; right: 2px; border: none; background: transparent; color: var(--hot); cursor: pointer; font-size: 10px; }
.howto { margin: 8px 0 2px; text-align: left; font-size: 12.5px; background: var(--bg2); border: 1px dashed var(--line); border-radius: 12px; padding: 8px 11px; }
.howto summary { cursor: pointer; font-weight: 800; color: var(--hot2); }
.howto-body { margin-top: 7px; line-height: 1.55; color: var(--mut); }
.phasehint { font-size: 12px; color: var(--mut); text-align: center; margin: 2px 0 4px; }
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
    <div class="ver">VERSION 21 · SIMPLE POUR LES DÉBUTANTS</div>
    <label class="check"><input type="checkbox" id="age18"> J'ai 18 ans ou plus 🍾</label>
    <div class="diffrow" id="genderrow">
      <button class="btn sel" data-g="homme">👨 Homme</button>
      <button class="btn" data-g="femme">👩 Femme</button>
    </div>
    <details class="howto">
      <summary>🎲 Première fois ? Comment ça marche (30 sec)</summary>
      <div class="howto-body">
        👑 <b>1.</b> Un joueur crée le salon et partage le code à 4 lettres (bouton 💬).<br>
        🚪 <b>2.</b> Les autres tapent leur pseudo + le code puis « Rejoindre » (6 max).<br>
        🎡 <b>3.</b> La roue désigne quelqu un : il choisit 💬 <b>Vérité</b> (répond honnêtement) ou 🎯 <b>Action</b> (fait le défi).<br>
        🔥 <b>4.</b> Il répond par texte, vocal 🎤, photo 📷 ou vidéo 🎬 — puis <b>tout le monde</b> peut relancer la roue.<br>
        🌶️ <b>5.</b> L admin monte le niveau quand ça chauffe. 2 tours sans répondre = éliminé. Tout s efface à la fin 🧹
      </div>
    </details>
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
      <p class="hint" style="margin-top:6px">Il faut au moins 2 joueurs. 🤖 = robot de test qui joue tout seul.</p>
      <p class="hint" style="margin-top:4px">🎡 La roue désigne → 💬 Vérité ou 🎯 Action → il répond (texte, vocal, photo, vidéo) → tout le monde peut relancer !</p>
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
    <div class="phasehint" id="phasehint"></div>
    <div id="gamediff" style="display:flex;gap:6px;justify-content:center;align-items:center;margin:2px 0 8px;flex-wrap:wrap">
      <span class="hint" id="gamediff-label" style="font-weight:800"></span>
      <button class="btn small gd" data-d="1" style="padding:6px 10px">😄</button>
      <button class="btn small gd" data-d="2" style="padding:6px 10px">😏</button>
      <button class="btn small gd" data-d="3" style="padding:6px 10px">🔥</button>
      <button class="btn small gd" data-d="4" style="padding:6px 10px">🌶️</button>
    </div>
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
    <div id="spinrow" hidden style="text-align:center;margin:10px 0">
      <button id="btn-spin" class="btn" style="font-size:17px;padding:14px 22px">🎯 LANCER LA ROUE !</button>
      <p class="hint" style="margin-top:5px">Tout le monde peut lancer — le premier clic gagne 😉</p>
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

/* Détecteur d'erreur visible : tout plantage du script s'affiche à l'écran */
window.onerror = function (msg, src2, line) {
  var b = document.getElementById('jserror');
  if (!b) {
    b = document.createElement('div');
    b.id = 'jserror';
    b.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:#b00;color:#fff;font:12px monospace;padding:8px;z-index:9999';
    (document.body || document.documentElement).appendChild(b);
  }
  b.textContent = '⚠️ ERREUR SCRIPT (dis-le au dev) : ' + msg + ' @ligne ' + line;
};

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
  var INAPP = /Instagram|FBAN|FBAV|FB_IAB|Snapchat|TikTok|musical_ly|Line|LinkedIn|Pinterest|WebView/i.test(UA) || (/iPhone|iPad|iPod/.test(UA) && !/Safari/.test(UA));
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
document.querySelectorAll('#gamediff .gd').forEach(function (b) {
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
  else if (S.phase === 'reacting') ph.textContent = '🔥 Réactions… 🎯 TOUS peuvent lancer la roue !';
  else ph.textContent = '⏸️ En pause...';
  var hint = $('#phasehint');
  if (hint) {
    if (S.phase === 'spinning') hint.textContent = 'La roue cherche sa victime… 😈';
    else if (S.phase === 'choosing') hint.textContent = isMe ? '💬 Vérité = répondre honnêtement · 🎯 Action = oser le défi' : 'C est le moment de ' + (tp ? tp.name : '?') + '… respire 😈';
    else if (S.phase === 'answering') hint.textContent = isMe ? 'Réponds comme tu veux : texte 💬, vocal 🎤, photo 📷 ou vidéo 🎬' : 'Laisse ' + (tp ? tp.name : '?') + ' répondre… et prépare tes réactions 🔥';
    else if (S.phase === 'reacting') hint.textContent = 'Réagissez avec les emoji… et n importe qui tape 🎯 pour relancer !';
    else hint.textContent = '';
  }
  var gd = $('#gamediff'), gdl = $('#gamediff-label');
  if (gd && gdl) {
    gdl.textContent = 'Niveau : ' + ['😄 Facile', '😏 Moyen', '🔥 Direct', '🌶️ CHAUD'][S.difficulty - 1];
    var gdb = gd.querySelectorAll('.gd');
    for (var gi = 0; gi < gdb.length; gi++) {
      gdb[gi].classList.toggle('sel', +gdb[gi].dataset.d === S.difficulty);
      gdb[gi].style.display = isAdmin() ? '' : 'none';
    }
  }
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
  $('#spinrow').hidden = S.phase !== 'reacting';
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
  var ctx = cv.getContext && cv.getContext('2d'); if (!ctx) return;
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
tap($('#btn-spin'), function () { socket.emit('turn:spin'); });
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
<div style="position:fixed;bottom:4px;right:7px;font-size:10px;opacity:.45;z-index:99;font-family:sans-serif">🌶️ v21</div>
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
    if ([1, 2, 3, 4].includes(+d) && +d !== room.difficulty) { room.difficulty = +d; sys(room, '🎛️ ' + me.name + ' passe le niveau sur : ' + ['Facile 😄', 'Moyen 😏', 'Direct 🔥', 'CHAUD 🌶️ 🌶️'][+d - 1] + ' — la prochaine question arrive !'); broadcast(room); }
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
    // v18 : une photo/vidéo envoyée pendant TON tour compte comme ta réponse
    if (room.phase === 'answering' && room.turn && room.turn.targetId === socket.id && !room.turn.answered) {
      sys(room, (kind === 'photo' ? '📷 ' : '🎬 ') + p.name + ' a répondu en ' + (kind === 'photo' ? 'photo' : 'vidéo') + ' !');
      beginReacting(room);
    }
  });

  socket.on('turn:spin', () => {
    const room = socketRoom.get(socket.id); if (!room) return;
    const p = room.players.get(socket.id); if (!p) return;
    if (room.phase !== 'reacting') return;
    sys(room, '🎯 ' + p.name + ' lance la roue !');
    nextTurn(room);
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
  console.log('🌶️ Vérité ou Action v21 — démarré sur le port', process.env.PORT || 3000);
  console.log('🚫 IA désactivée (v21) — questions 100% banque locale XXL');
});
