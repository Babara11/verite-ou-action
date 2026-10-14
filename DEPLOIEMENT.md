# 🚀 Déployer le jeu sur Render (gratuit) — Guide pas à pas

> Objectif : obtenir un lien permanent du genre `https://verite-ou-action.onrender.com`
> que tes amis ouvrent depuis n'importe quel téléphone au Sénégal 🇸🇳

## 📋 Vue d'ensemble (3 étapes)

1. Mettre le code sur **GitHub** (gratuit)
2. Connecter **Render** à GitHub (gratuit)
3. Récupérer ton **lien public** 🎉

---

## Étape 1 — Créer un compte GitHub et envoyer le code

1. Va sur **https://github.com** → *Sign up* (compte gratuit).
2. Une fois connecté, clique sur le **+** en haut à droite → **New repository**.
   - Nom : `verite-ou-action`
   - Visibilité : **Private** (ou Public, peu importe)
   - Clique **Create repository**.
3. Sur la page du dépôt, clique le lien **uploading an existing file** (ou bouton *Add file → Upload files*).
4. Glisse-dépose **tous les fichiers du projet** :
   ```
   package.json  package-lock.json  server.js
   questions.fr.json  questions.en.json
   README.md
   public/ (index.html, style.css, app.js)
   ```
   ⚠️ **NE téléverse PAS** le dossier `node_modules` (il sera recréé automatiquement par Render).
5. Clique **Commit changes**. ✅ Le code est sur GitHub.

> 💡 Si tu as `git` installé, l'équivalent en ligne de commande :
> ```bash
> git init && git add . && git commit -m "Vérité ou Action 18+"
> git branch -M main
> git remote add origin https://github.com/TON-PSEUDO/verite-ou-action.git
> git push -u origin main
> ```

## Étape 2 — Créer le service sur Render

1. Va sur **https://render.com** → *Sign up* → choisis **Sign in with GitHub** (le plus simple).
2. Clique **New +** → **Web Service**.
3. Choisis **Connect** à côté du dépôt `verite-ou-action` (autorise l'accès si demandé).
4. Remplis la configuration :
   | Champ | Valeur |
   |---|---|
   | Name | `verite-ou-action` (ça donne le nom du lien) |
   | Region | le plus proche (ex. Europe) |
   | Branch | `main` |
   | Runtime | **Node** (auto-détecté) |
   | Build Command | `npm install` |
   | Start Command | `npm start` |
   | Instance Type | **Free** |
5. Clique **Deploy Web Service**. ⏳ Le déploiement prend 2–5 minutes.

## Étape 3 — Récupérer ton lien

En haut de la page du service, Render affiche ton URL :
```
https://verite-ou-action.onrender.com
```
Ouvre-la sur ton téléphone → le jeu s'affiche 🎉

Envoie ce lien via le bouton **WhatsApp** du jeu, comme tu le ferais en soirée.

---

## ⚠️ À savoir (plan gratuit)

| Point | Détail |
|---|---|
| 😴 Sommeil auto | Après **15 min sans visite**, le serveur s'endort. La prochaine visite met **30–60 s** pour le réveiller. *Astuce : ouvre le lien 1 min avant la soirée.* |
| 🎮 Pendant une partie | Le trafic des joueurs le garde éveillé → aucune coupure en pleine soirée. |
| 🕐 Sessions max 5 salons | Le prototype est conçu ainsi — parfait pour valider le concept. |
| 🧹 Éphémère | Si Render redémarre le service, tout est effacé (cohérent avec ta règle "rien ne persiste" 😄). |

## 🆘 Problèmes fréquents

| Problème | Solution |
|---|---|
| "Application not found" juste après le déploiement | Attends la fin du build (log visible sur Render), puis rafraîchis. |
| Le lien met 1 min à s'ouvrir | C'est le réveil du plan gratuit — normal. |
| J'ai modifié le jeu | Refais un *upload* des fichiers modifiés sur GitHub → Render redéploie tout seul. |
| Erreur au build | Vérifie que tu n'as pas téléversé `node_modules` et que `package.json` est bien à la racine du dépôt. |

## 🔭 Après (V2)
- Passer sur un plan payant (~7 $/mois) pour un serveur toujours éveillé, ou
- Garder Vercel pour le site vitrine du jeu + un vrai backend temps réel managé (Supabase Realtime), si tu veux absolument l'écosystème Vercel.
