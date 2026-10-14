# 🌶️ Vérité ou Action 18+ — Prototype jouable

Jeu de soirée **Vérité ou Action (18+)** multijoueur en ligne, pensé pour des groupes
répartis partout (testé pour le Sénégal 🇸🇳) : 2 à 6 joueurs par salon, jusqu'à 5 salons
simultanés, questions tirées aléatoirement selon la difficulté, réponses par **texte ou
vocal éphémère**, et **tout est supprimé à la fermeture de la session**.

## 🚀 Lancer le jeu

```bash
npm install
npm start          # → http://localhost:3000
```

Ouvre ensuite l'aperçu en direct (preview) depuis ton navigateur — idéalement sur téléphone.

## 🎮 Comment jouer

1. **Créer un salon** → tu deviens **administrateur** de la session.
2. Réglages admin : **langue** (FR/EN), **thème** (Néon 🔥 / Nuit 🌙 / Rose 💦),
   **difficulté** (Facile 😄 / Moyen 😏 / Difficile 🔥).
3. Bouton **Inviter** :
   - 💬 **WhatsApp** (lien prêt à envoyer),
   - 📸 **Instagram** (copie le lien / partage système),
   - 🔗 **copier le code** à 4 lettres.
   ⏱️ Le lien d'invitation **expire au bout de 7 minutes** (il se rafraîchit à chaque partage).
4. Les personnes qui arrivent font une **demande** → l'admin **accepte ou refuse**.
5. L'admin lance la partie (minimum **2 joueurs**, maximum **6**).

### Le tour de jeu
- 🎡 La **roue** tourne et désigne un joueur au hasard.
- Le désigné a **60 secondes** pour choisir 💬 Vérité ou 🎯 Action.
  → Sans choix : il est sauté, la roue tourne à nouveau, et une **non-réponse** est comptée.
- La question est tirée aléatoirement selon la difficulté choisie.
- Le désigné a **2 minutes** pour répondre : **texte** ou **vocal** (30 s max, comme un vocal WhatsApp).
- Les autres réagissent avec des **emojis** 🎈 puis le tour suivant démarre tout seul.
- ⚠️ **2 non-réponses = exclusion automatique.**

### Règles admin & joueurs
- 👑 Si l'admin quitte, son rôle est **transféré automatiquement** à un autre joueur.
- 👑 L'admin peut aussi **nommer un autre admin** manuellement (bouton 👑 sur un joueur).
- ⏸️ Un joueur peut **se mettre en pause** : la roue ne le désigne plus.
  Après **5 minutes** de pause, l'admin peut l'exclure (badge ⏸️>5').
- ✖️ L'admin peut **exclure n'importe quel joueur** à tout moment.
- 📴 Un joueur déconnecté garde sa place **60 secondes** (le temps de se reconnecter),
  sinon il est retiré.
- 🧹 **Session fermée = tout disparaît** : messages, audios, pseudos. Rien n'est stocké
  (aucune base de données, tout vit en mémoire vive).

## 🎙️ Les audios éphémères
- Enregistrés dans le navigateur (MediaRecorder), relayés par le serveur **en mémoire uniquement**.
- Lisibles par tous les joueurs du salon (bouton ▶️).
- Maximum ~30 secondes par vocal.
- Supprimés définitivement quand la session se ferme.

## 🗂️ Structure du projet

```
verite-ou-action/
├── server.js              # Moteur de jeu temps réel (Socket.io) : salons, roue, minuteurs, règles
├── questions.fr.json      # Banque de questions 18+ en français (3 difficultés × Vérité/Action)
├── questions.en.json      # Banque de questions 18+ en anglais
├── public/
│   ├── index.html         # Interface (accueil, salon, jeu, fin)
│   ├── style.css          # 3 thèmes + responsive mobile
│   └── app.js             # Roue animée, minuteurs, enregistrement audio, i18n FR/EN
└── tests/test-game.js     # Test automatisé : simule une partie complète (19 vérifications)
```

## ✅ Tests

```bash
npm start &              # dans un terminal
node tests/test-game.js  # dans un autre — simule 3 joueurs et une partie complète
```

## 🔭 Idées pour la suite (V2)
- Vraie IA générative pour des questions infinies (clé API)
- Compteur de points / penalties
- Salons privés par mot de passe
- Version Wolof 🇸🇳
- Déploiement permanent (Render / Railway / Fly.io — gratuits au départ)

⚠️ **Jeu réservé aux adultes (18+). Consentement et respect obligatoires.**
