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

/* ═══ v31 · BANQUE 4000 QUESTIONS RÉELLES — 1000 par niveau (500 vérité + 500 action) ═══
   Français simple et direct, écrites pour des soirées entre adultes consentants.
   ⭐⭐⭐ TES QUESTIONS PERSO : ajoute-les dans les listes ci-dessous (une par ligne, entre " avec une virgule). ⭐⭐⭐ */
const QUESTIONS = {
  1: {
    verite: [
  "Qui ici tu trouves le plus beau ou la plus belle ?",
  "C'est quoi ton plus grand complexe physique ?",
  "As-tu déjà envoyé un message chaud à la mauvaise personne ?",
  "Donne l'initiale de la dernière personne que tu as embrassée.",
  "As-tu déjà menti sur ton âge ? Pourquoi ?",
  "As-tu déjà eu un crush sur un(e) prof ?",
  "Raconte ton pire plan séduction qui a raté.",
  "Combien de personnes as-tu embrassées cette année ?",
  "As-tu déjà relu 15 fois un message avant de répondre à ton crush ?",
  "C'est quoi le surnom le plus honteux qu'on t'ait donné ?",
  "As-tu déjà dit je t'aime sans le penser ?",
  "Raconte ton dernier rêve chaud en 3 phrases.",
  "As-tu déjà embrassé quelqu'un du même sexe ?",
  "As-tu déjà triché en couple ? Même un petit truc ?",
  "C'est quoi ta plus grande honte en amour ?",
  "As-tu déjà reçu un nude ? Qu'est-ce que tu en as fait ?",
  "Pour quel(le) ex as-tu pleuré le plus ?",
  "As-tu déjà flashé sur le/la copain/copine d'un(e) ami(e) ?",
  "C'est quelle partie de ton corps que tu préfères ?",
  "Combien de temps a duré ta plus longue relation ?",
  "Tu as déjà fouillé le téléphone de ton/ta partenaire ?",
  "Raconte ton pire rendez-vous galant, du début à la fin.",
  "As-tu déjà bloqué un(e) ex par vengeance ?",
  "Qui ici a la plus belle voix selon toi ?",
  "As-tu déjà embrassé deux personnes le même jour ?",
  "As-tu déjà flashé sur quelqu'un de beaucoup plus âgé(e) ?",
  "Ton plus gros mensonge pour séduire quelqu'un ?",
  "As-tu déjà pleuré après une rupture devant tout le monde ?",
  "Quelle chanson te fait penser à ton/ta ex ?",
  "Qui a été ton premier béguin ? Raconte.",
  "As-tu déjà déclaré tes feelings par texto par peur ?",
  "As-tu déjà testé une appli de rencontre ? Pire expérience ?",
  "Tu préfères être single ou en couple ? Pourquoi ?",
  "As-tu déjà embrassé quelqu'un juste par ennui ?",
  "C'est quoi ta plus grande peur en amour ?",
  "Raconte ta première honte amoureuse.",
  "As-tu déjà écrit à ton ex pendant la nuit ? Le contenu ?",
  "Quel est le message le plus gênant que tu aies envoyé ?",
  "Ton plus grand regret en amour ?",
  "As-tu déjà eu deux crushs en même temps ?",
  "C'est le compliment qui te fait fondre tout de suite ?",
  "Combien de selfies tu prends avant d'envoyer une photo ?",
  "As-tu déjà sorti avec quelqu'un surtout pour les cadeaux ?",
  "As-tu déjà utilisé un faux compte pour espionner quelqu'un ?",
  "Ton pire surnom qu'un(e) partenaire t'a donné ?",
  "Qui ici tu appelles en premier pour parler d'un crush ?",
  "Ta plus grosse excuse bidon pour éviter un rencard ?",
  "Ton premier bisou : âge et lieu. Détaille.",
  "As-tu déjà bu juste pour oser parler à ton crush ?",
  "Ton pire rejet par texto ? Raconte.",
  "Combien de fois par jour tu regardes la story de ton crush ?",
  "As-tu déjà dansé très collé(e) à un(e) inconnu(e) ?",
  "Raconte ta plus grosse honte en soirée.",
  "As-tu déjà caché un crush à tes meilleurs amis ?",
  "Ton record de temps sans écrire à ton crush avant de craquer ?",
  "As-tu déjà copié les gestes de séduction d'un film ? Lesquels ?",
  "C'est quoi le plus long silence gênant que tu as eu pendant un rencard ?",
  "As-tu déjà fantasmé sur un(e) collègue ou un(e) camarade ?",
  "Tu as déjà surpris tes amis en train de parler de toi en bien ? En mal ?",
  "Ton dernier mensonge pour impressionner quelqu'un ?",
  "Qui, parmi tes amis, embrasse le mieux selon toi ? Justifie.",
  "As-tu déjà reçu un compliment bizarre ? Lequel ?",
  "Ta plus grande folie faite pour quelqu'un ?",
  "C'est quoi ton plus grand défaut quand tu es amoureux(se) ?",
  "As-tu déjà raté un bisou ? Raconte le crash.",
  "Tu caches quoi dans ton téléphone que tu ne veux pas montrer ?",
  "La dernière photo de ta galerie : décris-la sans la montrer.",
  "Ton record de conversations en même temps avec plusieurs crushs ?",
  "As-tu déjà écrit le mauvais prénom sur un message ? À qui ?",
  "Quelle est ta plus grosse gêne quand tu es face à ton crush ?",
  "As-tu déjà embrassé quelqu'un dans un taxi ? Raconte.",
  "As-tu déjà envoyé un vocal gênant à ton crush ? Raconte.",
  "As-tu déjà trébuché(e) en marchant devant ton crush ? Raconte.",
  "As-tu déjà pleuré devant un film romantique ? Raconte.",
  "As-tu déjà été pris(e) en train de regarder un film X ? Raconte.",
  "As-tu déjà menti sur ton prénom pour tester quelqu'un ? Raconte.",
  "As-tu déjà flashé(e) sur un(e) serveur(se) ? Raconte.",
  "As-tu déjà embrassé(e) sous la pluie ? Raconte.",
  "As-tu déjà envoyé un selfie chaud par erreur ? Raconte.",
  "As-tu déjà dansé tout près d'un(e) inconnu(e) ? Raconte.",
  "As-tu déjà eu un béguin pour un(e) ami(e) d'enfance ? Raconte.",
  "As-tu déjà regardé les stories de ton ex ce matin ? Raconte.",
  "As-tu déjà envoyé un cœur à un(e) inconnu(e) par erreur ? Raconte.",
  "As-tu déjà eu un crush sur une star bien plus âgée ? Raconte.",
  "As-tu déjà fait un rêve chaud sur quelqu'un de connu ? Raconte.",
  "As-tu déjà hésité plus de 10 minutes avant d'envoyer un message ? Raconte.",
  "As-tu déjà dit « je suis occupé(e) » alors que tu étais au lit ? Raconte.",
  "As-tu déjà supprimé un message par peur du relire ? Raconte.",
  "As-tu déjà gardé un objet d'un(e) ex ? Lequel ? ? Raconte.",
  "As-tu déjà eu un coup de foudre juste pour une voix ? Raconte.",
  "As-tu déjà écrit à ton crush une nuit d'insomnie ? Raconte.",
  "As-tu déjà embrassé(e) quelqu'un qui sentait l'alcool ? Raconte.",
  "As-tu déjà été accusé(e) d'être trop collé(e) ? Raconte.",
  "As-tu déjà répondu à un message 3 jours après exprès ? Raconte.",
  "As-tu déjà porté ta plus belle tenue juste pour être vu(e) ? Raconte.",
  "As-tu déjà été jaloux(se) sans aucune raison ? Raconte.",
  "As-tu déjà changé de coiffure pour attirer l'attention ? Raconte.",
  "As-tu déjà envoyé 10 messages d'affilée sans réponse ? Raconte.",
  "As-tu déjà mis une musique d'amour en pensant à quelqu'un ? Raconte.",
  "As-tu déjà pleuré en écoutant une chanson d'amour ? Raconte.",
  "As-tu déjà dansé seul(e) devant le miroir comme dans un clip ? Raconte.",
  "As-tu déjà envoyé une photo de toi à la mauvaise discussion ? Raconte.",
  "As-tu déjà ris tout seul en lisant un message chaud ? Raconte.",
  "As-tu déjà imaginé ta vie avec un(e) inconnu(e) croisé(e) dans la rue ? Raconte.",
  "As-tu déjà voulu embrasser un(e) ami(e) sans jamais oser ? Raconte.",
  "As-tu déjà regretté de ne pas avoir osé un bisou ? Raconte.",
  "As-tu déjà eu un béguin pour un(e) professeur(e) de sport ? Raconte.",
  "As-tu déjà changé de look pour une personne ? Raconte.",
  "As-tu déjà marqué le mauvais prénom dans un message ? Raconte.",
  "As-tu déjà gardé une lettre d'amour jamais envoyée ? Raconte.",
  "As-tu déjà été surpris(e) en train de draguer par tes parents ? Raconte.",
  "As-tu déjà caché un message en pleine soirée ? Raconte.",
  "As-tu déjà choisi ta tenue pendant 3 heures pour un rencard ? Raconte.",
  "As-tu déjà mangé un chewing-gum juste avant un bisou ? Raconte.",
  "As-tu déjà regardé le profil d'un(e) ex jusqu'à de vieilles photos ? Raconte.",
  "As-tu déjà félicité un(e) ex pour un anniversaire juste pour relancer ? Raconte.",
  "As-tu déjà inventé un(e) copain/copine pour repousser quelqu'un ? Raconte.",
  "As-tu déjà eu le trac juste avant un premier bisou ? Raconte.",
  "As-tu déjà compté les minutes avant un premier rendez-vous ? Raconte.",
  "As-tu déjà craqué pour la voix d'un(e) animateur(trice) ? Raconte.",
  "As-tu déjà envoyé « je t'appelle dans 5 minutes » sans jamais appeler ? Raconte.",
  "As-tu déjà dit oui à un rencard par politesse et regretté ? Raconte.",
  "As-tu déjà fantasmé sur le/la barman / la barmaid ? Raconte.",
  "As-tu déjà pensé à ton premier amour aujourd'hui encore ? Raconte.",
  "As-tu déjà envoyé un cœur au lieu de répondre ? Raconte.",
  "As-tu déjà oublié le prénom de la personne en face pendant un rencard ? Raconte.",
  "As-tu déjà suivi quelqu'un dans la rue juste pour son odeur ? Raconte.",
  "As-tu déjà prêté ton sweat à un crush exprès ? Raconte.",
  "As-tu déjà fait semblant de lire pour éviter quelqu'un ? Raconte.",
  "As-tu déjà pris(e) une photo de ton crush sans qu'il/elle le sache ? Raconte.",
  "As-tu déjà dit à un(e) ami(e) que son crush est nul(le) alors que tu y pensais ? Raconte.",
  "Ton choix : baiser sous la pluie ou au bord de la mer ? Défends ta réponse.",
  "Ton choix : premier bisou en public ou en privé ? Défends ta réponse.",
  "Ton choix : être dominé(e) ou dominer ? Défends ta réponse.",
  "Ton choix : texto chaud ou vocal chaud ? Défends ta réponse.",
  "Ton choix : dîner aux chandelles ou nuit sur la plage ? Défends ta réponse.",
  "Ton choix : un(e) partenaire bavard(e) ou mystérieux(se) ? Défends ta réponse.",
  "Ton choix : lumière tamisée ou noir complet ? Défends ta réponse.",
  "Ton choix : un slow collé-collé ou un dancehall enflammé ? Défends ta réponse.",
  "Ton choix : un plan d'une nuit ou une belle histoire qui dure ? Défends ta réponse.",
  "Ton choix : retrouver ton ex ou découvrir un(e) inconnu(e) ? Défends ta réponse.",
  "Ton choix : un hôtel de luxe ou chez les parents ? Défends ta réponse.",
  "Ton choix : entendre des mots doux ou des mots sales ? Défends ta réponse.",
  "Ton choix : une soirée calme à deux ou une grosse soirée en groupe ? Défends ta réponse.",
  "Ton choix : le petit matin ou la pleine nuit ? Défends ta réponse.",
  "Ton choix : un bisou volé ou un bisou demandé ? Défends ta réponse.",
  "Ton choix : un(e) inconnu(e) séduisant(e) ou un(e) ami(e) très proche ? Défends ta réponse.",
  "Ton choix : rencontre sur appli ou dans la vraie vie ? Défends ta réponse.",
  "Ton choix : un massage du dos ou un massage des pieds ? Défends ta réponse.",
  "Ton choix : un rencard cuisine maison ou resto chic ? Défends ta réponse.",
  "Ton choix : être surpris(e) par un bisou ou le préparer ? Défends ta réponse.",
  "Ton choix : les yeux fermés ou les yeux dans les yeux ? Défends ta réponse.",
  "Ton choix : un massage long ou mille petits bisous ? Défends ta réponse.",
  "Ton choix : les textos le matin ou les appels la nuit ? Défends ta réponse.",
  "Ton choix : être courtisé(e) longtemps ou tout direct ? Défends ta réponse.",
  "Ton choix : une aventure en vacances ou dans ta ville ? Défends ta réponse.",
  "Ton choix : qu'on te chuchote à l'oreille ou qu'on t'écrive une lettre ? Défends ta réponse.",
  "Ton choix : commencer par un bisou sur la main ou sur la joue ? Défends ta réponse.",
  "Ton choix : un(e) partenaire tatoué(e) ou sans tatouage ? Défends ta réponse.",
  "Ton choix : la plage la nuit ou la montagne sous la neige ? Défends ta réponse.",
  "Ton choix : une relation secrète ou officielle tout de suite ? Défends ta réponse.",
  "Ton choix : les bougies ou la lumière des lampes ? Défends ta réponse.",
  "Ton choix : un vocal de 30 secondes ou 10 textos ? Défends ta réponse.",
  "Ton choix : un rencard improvisé ou préparé 3 jours ? Défends ta réponse.",
  "Ton choix : être désiré(e) pour ton corps ou ton esprit ? Défends ta réponse.",
  "Ton choix : l'odeur du parfum ou l'odeur de la peau propre ? Défends ta réponse.",
  "Ton choix : un seul grand amour ou plusieurs belles histoires ? Défends ta réponse.",
  "Ton choix : embrasser avec la langue ou sans la langue ? Défends ta réponse.",
  "Ton choix : le feu de la passion ou la chaleur du calme ? Défends ta réponse.",
  "Ton choix : les sous-vêtements rouges ou noirs ? Défends ta réponse.",
  "Ton choix : une première fois vite ou attendre longtemps ? Défends ta réponse.",
  "Ton choix : un(e) partenaire qui chante ou qui cuisine ? Défends ta réponse.",
  "Ton choix : être couvert(e) de bisous ou de câlins ? Défends ta réponse.",
  "Ton choix : baiser à la bougie ou sous les étoiles ? Défends ta réponse.",
  "Ton choix : un(a) ex qui revient ou une nouvelle personne qui débarque ? Défends ta réponse.",
  "Ton choix : qu'on t'écrive un poème ou qu'on te cuisine un plat ? Défends ta réponse.",
  "Ton choix : la salle de sport ou la plage pour draguer ? Défends ta réponse.",
  "Ton choix : un slow sous la lune ou un déjeuner au lit ? Défends ta réponse.",
  "Ton choix : être embrassé(e) dans le cou ou sur la main ? Défends ta réponse.",
  "Ton choix : un câlin long ou mille câlins courts ? Défends ta réponse.",
  "Ton choix : un(a) partenaire sportif(ve) ou cérébral(e) ? Défends ta réponse.",
  "Parmi les joueurs ici : qui est le plus fait pour faire le premier pas ?",
  "Parmi les joueurs ici : qui est le plus fait pour embrasser devant tout le monde ?",
  "Parmi les joueurs ici : qui est le plus fait pour coucher au premier rendez-vous ?",
  "Parmi les joueurs ici : qui est le plus fait pour envoyer un nude par erreur ?",
  "Parmi les joueurs ici : qui est le plus fait pour avoir le plus d'ex ?",
  "Parmi les joueurs ici : qui est le plus fait pour être le plus jaloux(se) ?",
  "Parmi les joueurs ici : qui est le plus fait pour revenir avec son ex ?",
  "Parmi les joueurs ici : qui est le plus fait pour faire un strip-tease un jour ?",
  "Parmi les joueurs ici : qui est le plus fait pour se marier le premier ou la première ?",
  "Parmi les joueurs ici : qui est le plus fait pour craquer pour quelqu'un de plus âgé(e) ?",
  "Parmi les joueurs ici : qui est le plus fait pour faire une déclaration publique ?",
  "Parmi les joueurs ici : qui est le plus fait pour chanter un slow torride ?",
  "Parmi les joueurs ici : qui est le plus fait pour coucher avec une star ?",
  "Parmi les joueurs ici : qui est le plus fait pour avoir le plus de culot ?",
  "Parmi les joueurs ici : qui est le plus fait pour draguer au téléphone toute la nuit ?",
  "Parmi les joueurs ici : qui est le plus fait pour être gêné(e) après un bisou ?",
  "Parmi les joueurs ici : qui est le plus fait pour oublier un anniversaire ?",
  "Parmi les joueurs ici : qui est le plus fait pour pleurer après un film d'amour ?",
  "Parmi les joueurs ici : qui est le plus fait pour surprendre tout le monde avec un plan fou ?",
  "Parmi les joueurs ici : qui est le plus fait pour être le plus romantique ?",
  "Parmi les joueurs ici : qui est le plus fait pour coucher dans un lieu interdit ?",
  "Parmi les joueurs ici : qui est le plus fait pour faire le plus de scandale ?",
  "Parmi les joueurs ici : qui est le plus fait pour garder le plus de secrets ?",
  "Parmi les joueurs ici : qui est le plus fait pour être le plus taquin(e) ?",
  "Parmi les joueurs ici : qui est le plus fait pour embrasser le mieux ?",
  "Parmi les joueurs ici : qui est le plus fait pour être le plus possessif(ve) ?",
  "Parmi les joueurs ici : qui est le plus fait pour craquer pour un(e) inconnu(e) en 2 minutes ?",
  "Parmi les joueurs ici : qui est le plus fait pour écrire le sexto le plus fou ?",
  "Parmi les joueurs ici : qui est le plus fait pour garder le plus de photos de son ex ?",
  "Parmi les joueurs ici : qui est le plus fait pour oser tout dire ce soir ?",
  "Parmi les joueurs ici : qui est le plus fait pour coucher pour un million ?",
  "Parmi les joueurs ici : qui est le plus fait pour avoir le corps le plus parfait ?",
  "Parmi les joueurs ici : qui est le plus fait pour être le plus doué(e) en bisous ?",
  "Parmi les joueurs ici : qui est le plus fait pour transformer un plan d'un soir en histoire d'amour ?",
  "Parmi les joueurs ici : qui est le plus fait pour avoir le rire le plus séduisant ?",
  "Parmi les joueurs ici : qui est le plus fait pour garder le plus de mystère ?",
  "Parmi les joueurs ici : qui est le plus fait pour faire tourner les têtes le plus facilement ?",
  "Parmi les joueurs ici : qui est le plus fait pour oublier un rendez-vous galant ?",
  "Parmi les joueurs ici : qui est le plus fait pour dire je t'aime le premier ou la première ?",
  "Parmi les joueurs ici : qui est le plus fait pour avoir le plus de prétendants ?",
  "Si tu devais embrasser quelqu'un d'ici maintenant, tu fais quoi ?",
  "Si tu devais recevoir un nude de ton crush, tu fais quoi ?",
  "Si tu devais te retrouver seul(e) ce soir avec le joueur de ton choix, tu fais quoi ?",
  "Si tu devais voir ton ex avec ton/ta meilleur(e) ami(e), tu fais quoi ?",
  "Si tu devais apprendre que ton crush t'aime en secret, tu fais quoi ?",
  "Si tu devais envoyer un message chaud à un contact au hasard, tu fais quoi ?",
  "Si tu devais te réveiller marié(e) avec un(e) joueur d'ici, tu fais quoi ?",
  "Si tu devais avoir un rencard avec ta star préférée, tu fais quoi ?",
  "Si tu devais être pris(e) en train d'écrire un sexto, tu fais quoi ?",
  "Si tu devais entendre ta mère lire ton dernier message chaud, tu fais quoi ?",
  "Si tu devais vivre une semaine sans téléphone ni crush, tu fais quoi ?",
  "Si tu devais recevoir un cadeau de ton ex, tu fais quoi ?",
  "Si tu devais voir ton crush embrasser quelqu'un d'autre devant toi, tu fais quoi ?",
  "Si tu devais choisir entre l'amour et l'argent, tu fais quoi ?",
  "Si tu devais être enfermé(e) une nuit avec un(e) joueur d'ici, tu fais quoi ?",
  "Si tu devais apprendre que quelqu'un d'ici rêve de toi, tu fais quoi ?",
  "Si tu devais danser un slow avec la personne en face de toi, tu fais quoi ?",
  "Si tu devais envoyer ta plus belle photo au joueur de ton choix, tu fais quoi ?",
  "Si tu devais écrire une déclaration d'amour ici, maintenant, tu fais quoi ?",
  "Si tu devais prendre le pseudo de ton crush pendant 24 h, tu fais quoi ?",
  "Si tu devais dire que la vérité pendant un mois, tu fais quoi ?",
  "Si tu devais supprimer le numéro de ton ex pour toujours, tu fais quoi ?",
  "Si tu devais recevoir un vocal chaud d'un(e) inconnu(e), tu fais quoi ?",
  "Si tu devais passer une journée entière collé(e) à ton crush, tu fais quoi ?",
  "Si tu devais échanger de téléphone avec ton/ta partenaire, tu fais quoi ?",
  "Si tu devais danser un slow sous la pluie, tu fais quoi ?",
  "Si tu devais répéter « je t'aime » en face d'un(e) joueur, tu fais quoi ?",
  "Si tu devais être sur une île déserte avec un(e) joueur d'ici, tu fais quoi ?",
  "Si tu devais décrire ton idéal en détail devant tous, tu fais quoi ?",
  "Si tu devais répéter à voix haute ton dernier message envoyé, tu fais quoi ?",
  "Si tu devais faire tout de suite ton plus beau selfie, tu fais quoi ?",
  "Si tu devais garder les yeux fermés 2 minutes pendant qu'on te regarde, tu fais quoi ?",
  "Si tu devais écouter un vocal de ton ex devant tout le monde, tu fais quoi ?",
  "Si tu devais embrasser (virtuellement) le joueur à ta droite, tu fais quoi ?",
  "Si tu devais dire le prénom de la dernière personne embrassée, tu fais quoi ?",
  "Si tu devais imiter la voix de séduction d'un(e) joueur, tu fais quoi ?",
  "Si tu devais montrer ta dernière photo prise, tu fais quoi ?",
  "Si tu devais écrire un compliment à chaque joueur ici, tu fais quoi ?",
  "Si tu devais recevoir un bisou surprise de quelqu'un d'ici, tu fais quoi ?",
  "Si tu devais te déclarer en public à ton crush, tu fais quoi ?",
  "C'est quoi ton avis sur les baisers dans le cou ? Sois honnête.",
  "C'est quoi ton avis sur les massages sensuels ? Sois honnête.",
  "C'est quoi ton avis sur les sextos du matin ? Sois honnête.",
  "C'est quoi ton avis sur les rencards surprises ? Sois honnête.",
  "C'est quoi ton avis sur les déclarations publiques ? Sois honnête.",
  "C'est quoi ton avis sur les vocaux chauds ? Sois honnête.",
  "C'est quoi ton avis sur les slows très collés ? Sois honnête.",
  "C'est quoi ton avis sur les bisous volés ? Sois honnête.",
  "C'est quoi ton avis sur les câlins qui durent des heures ? Sois honnête.",
  "C'est quoi ton avis sur les massages des pieds ? Sois honnête.",
  "C'est quoi ton avis sur les douches à deux ? Sois honnête.",
  "C'est quoi ton avis sur les plans en pleine nuit ? Sois honnête.",
  "C'est quoi ton avis sur les appels vidéo le soir ? Sois honnête.",
  "C'est quoi ton avis sur les lettres d'amour ? Sois honnête.",
  "C'est quoi ton avis sur les bougies dans la chambre ? Sois honnête.",
  "C'est quoi ton avis sur les sous-vêtements rouges ? Sois honnête.",
  "C'est quoi ton avis sur les talons hauts ? Sois honnête.",
  "C'est quoi ton avis sur les sweats empruntés à ton/ta partenaire ? Sois honnête.",
  "C'est quoi ton avis sur les longues séparations ? Sois honnête.",
  "C'est quoi ton avis sur les retrouvailles à l'aéroport ? Sois honnête.",
  "C'est quoi ton avis sur les jalousies au téléphone ? Sois honnête.",
  "C'est quoi ton avis sur les ex qui reviennent ? Sois honnête.",
  "C'est quoi ton avis sur les amitiés qui deviennent amour ? Sois honnête.",
  "C'est quoi ton avis sur les rendez-vous sur Internet ? Sois honnête.",
  "C'est quoi ton avis sur les fiançailles surprises ? Sois honnête.",
  "C'est quoi ton avis sur les bisous devant les parents ? Sois honnête.",
  "C'est quoi ton avis sur les mains dans les poches des autres ? Sois honnête.",
  "C'est quoi ton avis sur les miroirs dans la chambre ? Sois honnête.",
  "C'est quoi ton avis sur les piques-niques en amoureux ? Sois honnête.",
  "C'est quoi ton avis sur les photos de couple sur les réseaux ? Sois honnête.",
  "C'est quoi ton avis sur les surnoms mignons en public ? Sois honnête.",
  "C'est quoi ton avis sur les longues conversations jusqu'à l'aube ? Sois honnête.",
  "C'est quoi ton avis sur les blagues privées de couple ? Sois honnête.",
  "C'est quoi ton avis sur les câlins pendant le film ? Sois honnête.",
  "C'est quoi ton avis sur les baisers qui s'arrêtent trop tôt ? Sois honnête.",
  "C'est quoi ton avis sur les promesses du soir ? Sois honnête.",
  "C'est quoi ton avis sur les messages le lendemain du rencard ? Sois honnête.",
  "C'est quoi ton avis sur les fleurs offertes sans raison ? Sois honnête.",
  "C'est quoi ton avis sur les chansons dédiées ? Sois honnête.",
  "C'est quoi ton avis sur les câlins endormis ? Sois honnête.",
  "C'est quoi ton avis sur les bisous sur le front ? Sois honnête.",
  "C'est quoi ton avis sur les regards qui durent trop ? Sois honnête.",
  "C'est quoi ton avis sur les massages du cuir chevelu ? Sois honnête.",
  "C'est quoi ton avis sur les dîners préparés par l'autre ? Sois honnête.",
  "C'est quoi ton avis sur les surprises au travail ? Sois honnête.",
  "C'est quoi ton avis sur les baisers sous la pluie ? Sois honnête.",
  "C'est quoi ton avis sur les déjeuners au lit ? Sois honnête.",
  "C'est quoi ton avis sur les calins sur le canapé ? Sois honnête.",
  "C'est quoi ton avis sur les promenades main dans la main ? Sois honnête.",
  "C'est quoi ton avis sur les voix chuchotées au téléphone ? Sois honnête.",
  "C'est quoi ton avis sur les vocaux mignons ? Sois honnête.",
  "As-tu déjà testé les ex qui reviennent ? Raconte.",
  "les mains qui tremblent : oui, non, ou tu rêves ?",
  "Qu'est-ce qui change avec les rêves d'amour selon la personne ?",
  "Ton record avec les flirts au téléphone ? Le groupe demande le chiffre.",
  "les bisous volés : oui, non, ou tu rêves ?",
  "Ton pire souvenir avec les messages du matin ? Raconte.",
  "As-tu déjà testé les jalousies légères ? Raconte.",
  "Ton record avec les promesses douces ? Le groupe demande le chiffre.",
  "Tu recommencerais avec les fins de soirée à deux ? Pourquoi ?",
  "As-tu déjà testé les dimanches au lit ? Raconte.",
  "Tu recommencerais avec les déjeuners au lit ? Pourquoi ?",
  "Tu recommencerais avec les douches à deux ? Pourquoi ?",
  "Tu recommencerais avec les jalousies légères ? Pourquoi ?",
  "Tu recommencerais avec les baisers dans le cou ? Pourquoi ?",
  "As-tu déjà testé les dîners aux chandelles ? Raconte.",
  "les regards qui parlent : oui, non, ou tu rêves ?",
  "As-tu déjà testé les mains qui se cherchent ? Raconte.",
  "Tu recommencerais avec les cabines d'essayage ? Pourquoi ?",
  "C'est quoi ton meilleur souvenir avec les rêves d'amour ?",
  "As-tu déjà testé les photos de couple ? Raconte.",
  "Qu'est-ce qui change avec les câlins endormis selon la personne ?",
  "Ton record avec les piques-niques en amoureux ? Le groupe demande le chiffre.",
  "Qu'est-ce qui change avec les baisers sur le front selon la personne ?",
  "Qu'est-ce qui change avec les déclarations publiques selon la personne ?",
  "C'est quoi ton avis sur les promesses douces ? Sois honnête.",
  "C'est quoi ton meilleur souvenir avec les regards qui parlent ?",
  "Tu recommencerais avec les bougies ? Pourquoi ?",
  "Ton pire souvenir avec les dîners aux chandelles ? Raconte.",
  "C'est quoi ton meilleur souvenir avec les taxis du retour ?",
  "As-tu déjà testé les mains qui tremblent ? Raconte.",
  "Ton record avec les jalousies légères ? Le groupe demande le chiffre.",
  "Ton record avec les sourires cachés ? Le groupe demande le chiffre.",
  "Tu recommencerais avec les sourires cachés ? Pourquoi ?",
  "C'est quoi ton avis sur les confidences nocturnes ? Sois honnête.",
  "C'est quoi ton avis sur les amitiés qui basculent ? Sois honnête.",
  "les surprises en soirée : oui, non, ou tu rêves ?",
  "Qu'est-ce qui change avec les douches à deux selon la personne ?",
  "les sweats empruntés : oui, non, ou tu rêves ?",
  "Qu'est-ce qui change avec les notes vocales selon la personne ?",
  "les flirts au téléphone : oui, non, ou tu rêves ?",
  "C'est quoi ton avis sur les taxis du retour ? Sois honnête.",
  "C'est quoi ton meilleur souvenir avec les retrouvailles ?",
  "Qu'est-ce qui change avec les frissons discrets selon la personne ?",
  "Ton pire souvenir avec les dimanches au lit ? Raconte.",
  "C'est quoi ton avis sur les cabines d'essayage ? Sois honnête.",
  "Qu'est-ce qui change avec les regards qui parlent selon la personne ?",
  "Ton record avec les rêves d'amour ? Le groupe demande le chiffre.",
  "Ton pire souvenir avec les taxis du retour ? Raconte.",
  "Qu'est-ce qui change avec les surnoms d'amour selon la personne ?",
  "C'est quoi ton meilleur souvenir avec les baisers sous la pluie ?",
  "As-tu déjà testé les fins de soirée à deux ? Raconte.",
  "les frissons discrets : oui, non, ou tu rêves ?",
  "Qu'est-ce qui change avec les playlists d'amour selon la personne ?",
  "Tu recommencerais avec les notes vocales ? Pourquoi ?",
  "les déjeuners au lit : oui, non, ou tu rêves ?",
  "Ton pire souvenir avec les frissons discrets ? Raconte.",
  "Ton pire souvenir avec les vocaux mignons ? Raconte.",
  "C'est quoi ton avis sur les surnoms d'amour ? Sois honnête.",
  "Qu'est-ce qui change avec les retrouvailles selon la personne ?",
  "Ton record avec les surprises en soirée ? Le groupe demande le chiffre.",
  "Ton record avec les sweats empruntés ? Le groupe demande le chiffre.",
  "As-tu déjà testé les regards qui parlent ? Raconte.",
  "les baisers dans le cou : oui, non, ou tu rêves ?",
  "Ton record avec les odeurs de parfum ? Le groupe demande le chiffre.",
  "Ton pire souvenir avec les fins de soirée à deux ? Raconte.",
  "As-tu déjà testé les baisers sur le front ? Raconte.",
  "C'est quoi ton avis sur les regards qui parlent ? Sois honnête.",
  "les fous rires à 2 h du matin : oui, non, ou tu rêves ?",
  "Ton pire souvenir avec les rêves d'amour ? Raconte.",
  "As-tu déjà testé les cabines d'essayage ? Raconte.",
  "Qu'est-ce qui change avec les câlins sur le canapé selon la personne ?",
  "As-tu déjà testé les fous rires à 2 h du matin ? Raconte.",
  "C'est quoi ton meilleur souvenir avec les sourires cachés ?",
  "As-tu déjà testé les longues séparations ? Raconte.",
  "C'est quoi ton meilleur souvenir avec les mains qui tremblent ?",
  "C'est quoi ton meilleur souvenir avec les dîners aux chandelles ?",
  "Ton pire souvenir avec les promesses douces ? Raconte.",
  "Qu'est-ce qui change avec les flirts au téléphone selon la personne ?",
  "les câlins endormis : oui, non, ou tu rêves ?",
  "Ton record avec les rencards surprises ? Le groupe demande le chiffre.",
  "Tu recommencerais avec les dimanches au lit ? Pourquoi ?",
  "Tu recommencerais avec les promesses douces ? Pourquoi ?",
  "Ton pire souvenir avec les lettres jamais envoyées ? Raconte.",
  "As-tu déjà testé les voyages à deux ? Raconte.",
  "As-tu déjà testé les retrouvailles ? Raconte.",
  "Qu'est-ce qui change avec les chansons dédiées selon la personne ?",
  "les rencards surprises : oui, non, ou tu rêves ?",
  "Qu'est-ce qui change avec les promenades main dans la main selon la personne ?",
  "Ton record avec les massages des épaules ? Le groupe demande le chiffre.",
  "Qu'est-ce qui change avec les jalousies légères selon la personne ?",
  "Tu recommencerais avec les retrouvailles ? Pourquoi ?",
  "C'est quoi ton meilleur souvenir avec les notes vocales ?",
  "As-tu déjà testé les slows collés ? Raconte.",
  "Tu recommencerais avec les piques-niques en amoureux ? Pourquoi ?",
  "C'est quoi ton avis sur les premiers je t'aime ? Sois honnête.",
  "C'est quoi ton meilleur souvenir avec les bisous volés ?",
  "Ton record avec les premiers je t'aime ? Le groupe demande le chiffre.",
  "As-tu déjà testé les notes vocales ? Raconte.",
  "As-tu déjà testé les confidences nocturnes ? Raconte.",
  "As-tu déjà testé les surnoms d'amour ? Raconte.",
  "les câlins sur le canapé : oui, non, ou tu rêves ?",
  "Tu recommencerais avec les chansons dédiées ? Pourquoi ?",
  "les taxis du retour : oui, non, ou tu rêves ?",
  "C'est quoi ton avis sur les photos de couple ? Sois honnête.",
  "Qu'est-ce qui change avec les piques-niques en amoureux selon la personne ?",
  "Qu'est-ce qui change avec les sourires cachés selon la personne ?",
  "Tu recommencerais avec les photos de couple ? Pourquoi ?",
  "C'est quoi ton meilleur souvenir avec les messages du matin ?",
  "Tu recommencerais avec les longues séparations ? Pourquoi ?",
  "Ton record avec les douches à deux ? Le groupe demande le chiffre.",
  "C'est quoi ton meilleur souvenir avec les vocaux mignons ?",
  "C'est quoi ton avis sur les voyages à deux ? Sois honnête.",
  "C'est quoi ton meilleur souvenir avec les longues séparations ?",
  "Qu'est-ce qui change avec les fins de soirée à deux selon la personne ?",
  "Tu recommencerais avec les messages du matin ? Pourquoi ?",
  "Ton pire souvenir avec les amitiés qui basculent ? Raconte.",
  "Ton record avec les baisers sur le front ? Le groupe demande le chiffre.",
  "Ton record avec les mains dans les cheveux ? Le groupe demande le chiffre.",
  "les chansons dédiées : oui, non, ou tu rêves ?",
  "Ton record avec les dîners aux chandelles ? Le groupe demande le chiffre.",
  "Ton pire souvenir avec les bougies ? Raconte.",
  "Ton pire souvenir avec les longues séparations ? Raconte.",
  "les confidences nocturnes : oui, non, ou tu rêves ?",
  "les dimanches au lit : oui, non, ou tu rêves ?",
  "Ton pire souvenir avec les notes vocales ? Raconte.",
  "Qu'est-ce qui change avec les photos de couple selon la personne ?",
  "C'est quoi ton avis sur les flirts au téléphone ? Sois honnête.",
  "Qu'est-ce qui change avec les messages du matin selon la personne ?",
  "Qu'est-ce qui change avec les cabines d'essayage selon la personne ?",
  "C'est quoi ton avis sur les retrouvailles ? Sois honnête.",
  "les déclarations publiques : oui, non, ou tu rêves ?",
  "Ton pire souvenir avec les slows collés ? Raconte.",
  "Ton record avec les déclarations publiques ? Le groupe demande le chiffre.",
  "C'est quoi ton meilleur souvenir avec les baisers sur le front ?",
  "Qu'est-ce qui change avec les mains qui tremblent selon la personne ?",
  "les cabines d'essayage : oui, non, ou tu rêves ?",
  "C'est quoi ton meilleur souvenir avec les chansons dédiées ?",
  "C'est quoi ton meilleur souvenir avec les rencards surprises ?",
  "Qu'est-ce qui change avec les mains qui se cherchent selon la personne ?",
  "les slows collés : oui, non, ou tu rêves ?",
  "les promenades main dans la main : oui, non, ou tu rêves ?",
  "Tu recommencerais avec les mains qui tremblent ? Pourquoi ?",
  "As-tu déjà testé les rencards surprises ? Raconte.",
  "C'est quoi ton avis sur les mains qui tremblent ? Sois honnête.",
  "Ton pire souvenir avec les sweats empruntés ? Raconte.",
  "C'est quoi ton meilleur souvenir avec les mains dans les cheveux ?",
  "les rêves d'amour : oui, non, ou tu rêves ?",
  "Ton pire souvenir avec les voyages à deux ? Raconte.",
  "Ton record avec les cabines d'essayage ? Le groupe demande le chiffre.",
  "Ton pire souvenir avec les câlins sur le canapé ? Raconte.",
  "C'est quoi ton avis sur les câlins sur le canapé ? Sois honnête.",
  "As-tu déjà testé les surprises en soirée ? Raconte.",
  "C'est quoi ton meilleur souvenir avec les promenades main dans la main ?",
  "les promesses douces : oui, non, ou tu rêves ?",
  "C'est quoi ton meilleur souvenir avec les fins de soirée à deux ?",
  "Qu'est-ce qui change avec les amitiés qui basculent selon la personne ?",
  "les piques-niques en amoureux : oui, non, ou tu rêves ?",
  "C'est quoi ton meilleur souvenir avec les premiers je t'aime ?",
  "As-tu déjà testé les baisers dans le cou ? Raconte.",
  "C'est quoi ton meilleur souvenir avec les déjeuners au lit ?",
  "C'est quoi ton meilleur souvenir avec les slows collés ?",
  "Qu'est-ce qui change avec les taxis du retour selon la personne ?",
  "C'est quoi ton avis sur les baisers sur le front ? Sois honnête.",
  "Ton pire souvenir avec les chansons dédiées ? Raconte.",
  "les messages du matin : oui, non, ou tu rêves ?",
  "Tu recommencerais avec les mains qui se cherchent ? Pourquoi ?",
  "Ton record avec les vocaux mignons ? Le groupe demande le chiffre.",
  "Qu'est-ce qui change avec les premiers je t'aime selon la personne ?",
  "C'est quoi ton meilleur souvenir avec les douches à deux ?",
  "Ton record avec les câlins endormis ? Le groupe demande le chiffre.",
  "Tu recommencerais avec les rencards surprises ? Pourquoi ?",
  "les voyages à deux : oui, non, ou tu rêves ?",
  "Ton record avec les notes vocales ? Le groupe demande le chiffre.",
  "C'est quoi ton avis sur les dîners aux chandelles ? Sois honnête.",
  "Ton pire souvenir avec les flirts au téléphone ? Raconte.",
  "Qu'est-ce qui change avec les câlins longs selon la personne ?",
  "les bougies : oui, non, ou tu rêves ?",
  "Ton pire souvenir avec les baisers sur le front ? Raconte.",
  "Ton record avec les mains qui tremblent ? Le groupe demande le chiffre.",
  "Tu recommencerais avec les voyages à deux ? Pourquoi ?",
  "Ton record avec les déjeuners au lit ? Le groupe demande le chiffre.",
  "C'est quoi ton meilleur souvenir avec les massages des épaules ?",
  "As-tu déjà testé les baisers sous la pluie ? Raconte.",
  "Tu recommencerais avec les dîners aux chandelles ? Pourquoi ?",
  "Ton record avec les câlins longs ? Le groupe demande le chiffre.",
  "Ton record avec les voyages à deux ? Le groupe demande le chiffre.",
  "Qu'est-ce qui change avec les massages des épaules selon la personne ?",
  "C'est quoi ton avis sur les câlins longs ? Sois honnête."
],
    action: [
  "Fais le compliment le plus chaud possible à la personne à ta gauche.",
  "Envoie 🔥 au 5e contact de ta liste de discussions.",
  "Danse 30 secondes sur ton titre préféré.",
  "Imite ton meilleur move de séduction.",
  "Regarde fixement la caméra 20 secondes sans rire.",
  "Chante le refrain d'une chanson d'amour avec beaucoup d'émotion.",
  "Fais une déclaration dramatique à un objet de ta pièce.",
  "Montre la 6e photo de ta galerie. Pas de triche.",
  "Rejoue une scène de film romantique en jouant les deux rôles.",
  "Garde ton plus beau sourire de mannequin 15 secondes.",
  "Laisse le groupe choisir ta nouvelle photo de profil pour 24 h.",
  "Parle en voix sensuelle pendant 20 secondes.",
  "Masser les épaules du joueur à ta droite pendant 30 secondes.",
  "Embrasse ton propre bras très lentement en regardant la cam.",
  "Fais 10 squats face à la caméra.",
  "Décris ta tenue de ce soir comme un défilé de mode.",
  "Imite la façon dont tu réponds à un message de ton crush.",
  "Fais 15 secondes de regard de séduction à la caméra.",
  "Chante « joyeux anniversaire » à un(e) joueur comme si c'était une déclaration.",
  "Décris ta plus belle sortie de douche sans jamais montrer ton corps.",
  "Imite un rire ultra séduisant. Le groupe note sur 10.",
  "Fais un bisou volant très lent à la caméra.",
  "Décris le joueur de ton choix avec seulement 3 mots chauds.",
  "Envoie un emoji qui résume ton état d'esprit ce soir et explique.",
  "Montre comment tu retires ton pull de manière sexy (sans rien enlever).",
  "Fais 20 secondes de marche de mannequin dans ta pièce.",
  "Imite ta réaction quand ton crush écrit « tu es où ? ».",
  "Raconte ta meilleure histoire de drague en 30 secondes.",
  "Fais semblant d'appeler ton crush et dis-lui 3 phrases douces.",
  "Montre ta plus belle pose de photo de profil. 3 poses différentes.",
  "Imite le rire gêné après un premier bisou raté.",
  "Décris ta soirée idéale à deux en 20 secondes.",
  "Chante une berceuse comme si tu endormais ton amour.",
  "Fais un compliment sur la voix du joueur à ta gauche.",
  "Montre comment tu danses quand ta chanson arrive en club.",
  "Envoie « je pense à toi » à ton crush... si tu oses. Sinon, imite-le.",
  "Décris ton odeur de parfum préférée comme dans une pub.",
  "Fais 10 secondes de clignement d'œil très lent, regard caméra.",
  "Rejoue ta première rencontre idéale avec le joueur de ton choix.",
  "Imite quelqu'un qui lit un message chaud dans le bus.",
  "Montre comment tu prépares le petit-déjeuner en pyjama sexy.",
  "Fais une pub de 20 secondes pour vendre ton sourire.",
  "Dis 3 mots doux différents à 3 joueurs différents.",
  "Imite la façon dont tu te regardes dans le miroir avant de sortir.",
  "Danse 15 secondes sans musique, juste avec le regard du groupe.",
  "Montre ta meilleure imitation de bisou sur la joue.",
  "Décris le joueur en face comme un tableau célèbre.",
  "Envoie un message positif au joueur le plus silencieux du salon.",
  "Fais une imitation de voix d'enfant qui demande un bisou.",
  "Raconte ton plus beau rêve en chantant.",
  "Montre 10 secondes de regard innocent puis de regard coquin. Transition nette.",
  "Imite ta démarche quand tu passes devant ton crush.",
  "Fais semblant de dormir et de parler dans ton sommeil de ton crush.",
  "Chante le nom du joueur de ton choix 3 fois de manière romantique.",
  "Montre ta plus belle expression quand tu reçois un compliment.",
  "Décris la tenue que tu mettrais pour un premier rendez-vous.",
  "Fais une imitations de présentateur qui annonce « le couple de la soirée ».",
  "Montre comment tu salues quelqu'un que tu trouves très beau/belle.",
  "Imite ta réaction quand tu reçois un nude (version comique).",
  "Fais un discours de 15 secondes pour défendre l'amour.",
  "Montre comment tu tapes un message chaud avec le visage le plus sérieux.",
  "Décris le dernier film romantique que tu as regardé, en pleurant comiquement.",
  "Imite une star qui fait une déclaration à la caméra.",
  "Danse le slow de ta vie avec un coussin.",
  "Fais deviner ton crush par mime uniquement. 3 indices maximum.",
  "Montre comment tu fais pour être irrésistible en 10 secondes.",
  "Raconte ton dernier fou rire en amoureux comme un commentaire de match.",
  "Décris la couleur qui te va le mieux et pourquoi, en regardant la cam.",
  "Imite la personne la plus timide du salon qui doit faire un bisou.",
  "Fais une lecture dramatique d'un message que tu as vraiment envoyé.",
  "Montre ton plus beau sourire à la caméra. Maintenant.",
  "Montre ta tenue complète du jour à la caméra. Maintenant.",
  "Montre le fond de ton lit à la caméra. Maintenant.",
  "Montre ta dernière photo de galerie à la caméra. Maintenant.",
  "Montre ton geste de séduction préféré à la caméra. Maintenant.",
  "Montre comment tu fais un bisou (sur ta main) à la caméra. Maintenant.",
  "Montre ta plus belle pose de profil à la caméra. Maintenant.",
  "Montre la chaise où tu te plais le mieux à la caméra. Maintenant.",
  "Montre ta façon de te coiffer à la caméra. Maintenant.",
  "Montre ton plus beau regard à la caméra. Maintenant.",
  "Montre comment tu souris quand tu es gêné(e) à la caméra. Maintenant.",
  "Montre ton geste quand tu reçois un message de ton crush à la caméra. Maintenant.",
  "Montre ta main qui fait un geste doux à la caméra. Maintenant.",
  "Montre la position dans laquelle tu dors à la caméra. Maintenant.",
  "Montre ton plus beau changement d'expression à la caméra. Maintenant.",
  "Montre ce que tu as dans tes poches à la caméra. Maintenant.",
  "Montre ton duo préféré : regard puis sourire à la caméra. Maintenant.",
  "Montre comment tu enlèves tes cheveux de ton visage à la caméra. Maintenant.",
  "Montre ta façon de vous asseoir quand tu dragues à la caméra. Maintenant.",
  "Montre la photo de ton écran de téléphone en verrouillage à la caméra. Maintenant.",
  "Montre ta meilleure imitation de star à la caméra. Maintenant.",
  "Montre comment tu réagis à un compliment à la caméra. Maintenant.",
  "Montre ta tenue de nuit (version décente) à la caméra. Maintenant.",
  "Montre le parfum que tu portes (montre le flacon) à la caméra. Maintenant.",
  "Montre ta plus belle expression de surprise à la caméra. Maintenant.",
  "Montre comment tu fais semblant d'être sûr(e) de toi à la caméra. Maintenant.",
  "Montre ton rituel avant de sortir à la caméra. Maintenant.",
  "Montre la chanson que tu chantes sous la douche à la caméra. Maintenant.",
  "Montre comment tu bois ton café/thé de manière chic à la caméra. Maintenant.",
  "Montre ta plus belle façon de dire bonjour à la caméra. Maintenant.",
  "Envoie un vocal où tu chuchotes « viens ce soir ». 10 secondes minimum.",
  "Envoie un vocal où tu fais un rire ultra séduisant. 10 secondes minimum.",
  "Envoie un vocal où tu dis ton meilleur mot doux. 10 secondes minimum.",
  "Envoie un vocal où tu gémis légèrement (juste un petit). 10 secondes minimum.",
  "Envoie un vocal où tu dis « tu me manques » avec beaucoup d'émotion. 10 secondes minimum.",
  "Envoie un vocal où tu imites un réveil très sexy. 10 secondes minimum.",
  "Envoie un vocal où tu chuchotes un secret d'amour. 10 secondes minimum.",
  "Envoie un vocal où tu dis « bonne nuit » comme si tu couchais près de la personne. 10 secondes minimum.",
  "Envoie un vocal où tu racontes ta journée comme un poème. 10 secondes minimum.",
  "Envoie un vocal où tu chantes le prénom de ton crush. 10 secondes minimum.",
  "Envoie un vocal où tu fais un bisou sonore dans le micro. 10 secondes minimum.",
  "Envoie un vocal où tu dis « je pense à toi » de 3 façons différentes. 10 secondes minimum.",
  "Envoie un vocal où tu imites un message vocal d'un(e) ex jaloux(se). 10 secondes minimum.",
  "Envoie un vocal où tu dis ton numéro de téléphone d'une voix douce. 10 secondes minimum.",
  "Envoie un vocal où tu racontes une blague avec une voix de séduction. 10 secondes minimum.",
  "Envoie un vocal où tu dis « pardon » comme si tu avais fait une grosse bêtise. 10 secondes minimum.",
  "Envoie un vocal où tu chantes les félicitations pour un mariage. 10 secondes minimum.",
  "Envoie un vocal où tu dis « ouvre la porte » comme dans un film. 10 secondes minimum.",
  "Envoie un vocal où tu imites une star qui signe un autographe. 10 secondes minimum.",
  "Envoie un vocal où tu fais le ton du « j'arrive » le plus mignon. 10 secondes minimum.",
  "Envoie un vocal où tu dis à voix haute ta plus belle phrase de bonne nuit. 10 secondes minimum.",
  "Envoie un vocal où tu imites le ton d'un parent qui découvre un crush. 10 secondes minimum.",
  "Envoie un vocal où tu racontes ta plus belle rencontre en 10 secondes. 10 secondes minimum.",
  "Envoie un vocal où tu dis « je t'attends » d'une voix qui donne envie. 10 secondes minimum.",
  "Envoie un vocal où tu imites quelqu'un qui hésite à envoyer un message. 10 secondes minimum.",
  "Envoie un vocal où tu fais un compte à rebours de séduction de 5 à 1. 10 secondes minimum.",
  "Envoie un vocal où tu dis « ferme les yeux » très doucement. 10 secondes minimum.",
  "Envoie un vocal où tu imites une déclaration de mariage complète. 10 secondes minimum.",
  "Envoie un vocal où tu dis « viens ici » de 3 façons. 10 secondes minimum.",
  "Envoie un vocal où tu chantes « bisou bisou » comme une berceuse. 10 secondes minimum.",
  "Envoie un vocal où tu chuchotes ton premier prénom d'amour. 10 secondes minimum.",
  "Envoie un vocal où tu dis « tu sens trop bon » comme si la personne était là. 10 secondes minimum.",
  "Envoie un vocal où tu imites une réponse à un message reçu à 2 h du matin. 10 secondes minimum.",
  "Envoie un vocal où tu fais une imitations de répondeur romantique. 10 secondes minimum.",
  "Envoie un vocal où tu dis « aujourd'hui je pense à toi » en y ajoutant ta touche. 10 secondes minimum.",
  "Dis au joueur de ton choix, en le/la regardant : « tu sens trop bon »",
  "Dis au joueur de ton choix, en le/la regardant : « j'ai pensé à toi cette nuit »",
  "Dis au joueur de ton choix, en le/la regardant : « si tu m'embrasses, je ne repousse pas »",
  "Dis au joueur de ton choix, en le/la regardant : « ton sourire me fait perdre mes mots »",
  "Dis au joueur de ton choix, en le/la regardant : « je te prépare le meilleur petit-déjeuner du monde »",
  "Dis au joueur de ton choix, en le/la regardant : « avec toi, même le silence c'est bon »",
  "Dis au joueur de ton choix, en le/la regardant : « je garde ta photo dans mes préférées »",
  "Dis au joueur de ton choix, en le/la regardant : « si j'étais à côté de toi, je te tiendrais la main »",
  "Dis au joueur de ton choix, en le/la regardant : « tu as une voix qui rassure »",
  "Dis au joueur de ton choix, en le/la regardant : « quand tu écris, mon téléphone chauffe »",
  "Dis au joueur de ton choix, en le/la regardant : « je te fais un câlin gratuit quand tu veux »",
  "Dis au joueur de ton choix, en le/la regardant : « tu es le genre de personne qu'on ne laisse plus partir »",
  "Dis au joueur de ton choix, en le/la regardant : « ton rire, c'est ma chanson préférée »",
  "Dis au joueur de ton choix, en le/la regardant : « je te raccompagnerais sous n'importe quelle pluie »",
  "Dis au joueur de ton choix, en le/la regardant : « dis-moi ton secret pour être aussi attirant(e) »",
  "Dis au joueur de ton choix, en le/la regardant : « je choisis ton âge de cœur, pas ton âge réel »",
  "Dis au joueur de ton choix, en le/la regardant : « toi, tu es du genre à marquer une vie »",
  "Dis au joueur de ton choix, en le/la regardant : « je te confie mes plus grands secrets »",
  "Dis au joueur de ton choix, en le/la regardant : « avec toi, un plan canapé vaut tous les clubs »",
  "Dis au joueur de ton choix, en le/la regardant : « tu es ma plus belle surprise de la soirée »",
  "Dis au joueur de ton choix, en le/la regardant : « si je devais recommencer un premier rendez-vous, ce serait avec toi »",
  "Dis au joueur de ton choix, en le/la regardant : « ta présence rend cette partie meilleure »",
  "Dis au joueur de ton choix, en le/la regardant : « tu as le talent de rendre les gens heureux »",
  "Dis au joueur de ton choix, en le/la regardant : « j'emmenerais bien un café avec toi un matin »",
  "Dis au joueur de ton choix, en le/la regardant : « ton nom restera dans ma tête ce soir »",
  "Dis au joueur de ton choix, en le/la regardant : « je te prépare une playlist d'amour si tu veux »",
  "Dis au joueur de ton choix, en le/la regardant : « tu es la raison pour laquelle je souris à mon téléphone »",
  "Dis au joueur de ton choix, en le/la regardant : « on refait cette partie rien qu'à nous un jour ? »",
  "Dis au joueur de ton choix, en le/la regardant : « tu as le genre de regard qui fait oublier la suite »",
  "Dis au joueur de ton choix, en le/la regardant : « je te fais la promesse d'un meilleur bisou que ton ex »",
  "Fais le plus beau regard de séduction pendant 15 secondes. Le groupe juge.",
  "Fais le sourire le plus charmant pendant 15 secondes. Le groupe juge.",
  "Fais le bisou volant le plus lent pendant 15 secondes. Le groupe juge.",
  "Fais la pose de mannequin la plus confiante pendant 15 secondes. Le groupe juge.",
  "Fais le rire le plus charmeur pendant 15 secondes. Le groupe juge.",
  "Fais la marche la plus sexy de ta vie pendant 15 secondes. Le groupe juge.",
  "Fais le câlin le plus réaliste avec un coussin pendant 15 secondes. Le groupe juge.",
  "Fais le regard innocent le plus convaincant pendant 15 secondes. Le groupe juge.",
  "Fais le mouvement de danse le plus romantique pendant 15 secondes. Le groupe juge.",
  "Fais le clignement d'œil le plus teigneux pendant 15 secondes. Le groupe juge.",
  "Fais l'expression la plus surprise après un compliment pendant 15 secondes. Le groupe juge.",
  "Fais la voix la plus douce pendant 15 secondes. Le groupe juge.",
  "Fais le souffle le plus calme (on doit t'entendre) pendant 15 secondes. Le groupe juge.",
  "Fais le discours d'amour le plus dramatique pendant 15 secondes. Le groupe juge.",
  "Fais le mime du premier rendez-vous le plus réaliste pendant 15 secondes. Le groupe juge.",
  "Fais le geste du cœur le plus sincère pendant 15 secondes. Le groupe juge.",
  "Fais le regard timide le plus mignon pendant 15 secondes. Le groupe juge.",
  "Fais le sourire timide après un compliment pendant 15 secondes. Le groupe juge.",
  "Fais le regard sombre de jalousie pendant 15 secondes. Le groupe juge.",
  "Fais la pose la plus épique de photo de profil pendant 15 secondes. Le groupe juge.",
  "Fais le moue la plus mignonne pendant 15 secondes. Le groupe juge.",
  "Fais le regard du matin au réveil pendant 15 secondes. Le groupe juge.",
  "Fais l'expression du « c'est moi que tu regardes ? » pendant 15 secondes. Le groupe juge.",
  "Fais le regard du dernier message avant de dormir pendant 15 secondes. Le groupe juge.",
  "Fais le soupir amoureux le plus réaliste pendant 15 secondes. Le groupe juge.",
  "Fais le regard quand ton crush passe pendant 15 secondes. Le groupe juge.",
  "Fais le mime du « laisse-moi te raccompagner » pendant 15 secondes. Le groupe juge.",
  "Fais la déclaration muette la plus claire pendant 15 secondes. Le groupe juge.",
  "Fais le regard qui dit tout sans parler pendant 15 secondes. Le groupe juge.",
  "Fais le signe de « appelle-moi » le plus classe pendant 15 secondes. Le groupe juge.",
  "Fais la pose de la réconciliation pendant 15 secondes. Le groupe juge.",
  "Fais le sourire du lendemain de première rencontre pendant 15 secondes. Le groupe juge.",
  "Fais le regard de défi le plus joueur pendant 15 secondes. Le groupe juge.",
  "Fais la plus belle façon d'accueillir quelqu'un pendant 15 secondes. Le groupe juge.",
  "Fais le geste de « viens là » le plus convaincant pendant 15 secondes. Le groupe juge.",
  "Fais le regard de « dernière chance » pendant 15 secondes. Le groupe juge.",
  "Fais le mime du câlin de bon matin pendant 15 secondes. Le groupe juge.",
  "Fais la plus belle façon de dire merci à un compliment pendant 15 secondes. Le groupe juge.",
  "Fais le regard de promesse le plus sérieux pendant 15 secondes. Le groupe juge.",
  "Fais l'expression de la plus belle surprise de ta vie pendant 15 secondes. Le groupe juge.",
  "Fais le salut le plus charismatique pendant 15 secondes. Le groupe juge.",
  "Fais le regard de séduction à travers la pièce pendant 15 secondes. Le groupe juge.",
  "Fais le bras ouvert du « viens dans mes bras » pendant 15 secondes. Le groupe juge.",
  "Fais le sourire de derrière le micro pendant 15 secondes. Le groupe juge.",
  "Fais le « chut » le plus mystérieux pendant 15 secondes. Le groupe juge.",
  "Imite quelqu'un qui lit un message très chaud dans le bus comme si c'était normal. 20 secondes.",
  "Imite quelqu'un qui répète un bisou dans le miroir comme si c'était normal. 20 secondes.",
  "Imite quelqu'un qui s'entraîne à faire une déclaration comme si c'était normal. 20 secondes.",
  "Imite quelqu'un qui reçoit son premier compliment comme si c'était normal. 20 secondes.",
  "Imite quelqu'un qui découvre que son crush l'aime aussi comme si c'était normal. 20 secondes.",
  "Imite quelqu'un qui cache son téléphone quand sa mère arrive comme si c'était normal. 20 secondes.",
  "Imite quelqu'un qui attend un message qui ne vient jamais comme si c'était normal. 20 secondes.",
  "Imite quelqu'un qui boit son verre en regardant quelqu'un comme si c'était normal. 20 secondes.",
  "Imite quelqu'un qui fait semblant de dormir quand on l'appelle comme si c'était normal. 20 secondes.",
  "Imite quelqu'un qui danse quand sa chanson arrive comme si c'était normal. 20 secondes.",
  "Imite quelqu'un qui reçoit un bisou surprise comme si c'était normal. 20 secondes.",
  "Imite quelqu'un qui essaie de se rappeler le prénom de son rencard comme si c'était normal. 20 secondes.",
  "Imite quelqu'un qui fait semblant de connaître le vin au resto comme si c'était normal. 20 secondes.",
  "Imite quelqu'un qui fait le fier après avoir obtenu le numéro comme si c'était normal. 20 secondes.",
  "Imite quelqu'un qui explique la position où il dort à son chien comme si c'était normal. 20 secondes.",
  "Imite quelqu'un qui fait semblant d'être occupé quand son crush passe comme si c'était normal. 20 secondes.",
  "Imite quelqu'un qui choisit sa tenue 2 heures avant de sortir comme si c'était normal. 20 secondes.",
  "Imite quelqu'un qui envoie un message et regrette tout de suite comme si c'était normal. 20 secondes.",
  "Imite quelqu'un qui recopie une déclaration dans Google comme si c'était normal. 20 secondes.",
  "Imite quelqu'un qui regarde la story de son ex discrètement comme si c'était normal. 20 secondes.",
  "Imite quelqu'un qui attend le rendu de sa coiffure chez le coiffeur comme si c'était normal. 20 secondes.",
  "Imite quelqu'un qui fait semblant d'aimer le cadeau comme si c'était normal. 20 secondes.",
  "Imite quelqu'un qui chante sous la douche avec passion comme si c'était normal. 20 secondes.",
  "Imite quelqu'un qui récupère son courage pour appeler comme si c'était normal. 20 secondes.",
  "Imite quelqu'un qui fait la conversation avec un(e) inconnu(e) comme si c'était normal. 20 secondes.",
  "Imite quelqu'un qui découvre une faute dans son message déjà envoyé comme si c'était normal. 20 secondes.",
  "Imite quelqu'un qui jette un coup d'œil à son reflet dans la vitrine comme si c'était normal. 20 secondes.",
  "Imite quelqu'un qui imite la voix douce au téléphone comme si c'était normal. 20 secondes.",
  "Imite quelqu'un qui explique pourquoi il est en retard comme si c'était normal. 20 secondes.",
  "Imite quelqu'un qui essaie de rattraper un bisou raté comme si c'était normal. 20 secondes.",
  "Imite quelqu'un qui répète avant d'entrer dans la soirée comme si c'était normal. 20 secondes.",
  "Imite quelqu'un qui essaie de ne pas regarder quelqu'un comme si c'était normal. 20 secondes.",
  "Imite quelqu'un qui fait le branché au premier rendez-vous comme si c'était normal. 20 secondes.",
  "Imite quelqu'un qui répète son sourire le plus naturel comme si c'était normal. 20 secondes.",
  "Imite quelqu'un qui se prépare un « âme de séducteur » avant de sortir comme si c'était normal. 20 secondes.",
  "Fais une pub de 15 secondes pour vendre : ton sourire. Slogan obligatoire.",
  "Fais une pub de 15 secondes pour vendre : ton regard. Slogan obligatoire.",
  "Fais une pub de 15 secondes pour vendre : ta voix. Slogan obligatoire.",
  "Fais une pub de 15 secondes pour vendre : ton sens de l'humour. Slogan obligatoire.",
  "Fais une pub de 15 secondes pour vendre : ta façon d'embrasser (théorique). Slogan obligatoire.",
  "Fais une pub de 15 secondes pour vendre : tes câlins (version publicité). Slogan obligatoire.",
  "Fais une pub de 15 secondes pour vendre : ta patience en amour. Slogan obligatoire.",
  "Fais une pub de 15 secondes pour vendre : ton talent pour draguer. Slogan obligatoire.",
  "Fais une pub de 15 secondes pour vendre : ton romantisme. Slogan obligatoire.",
  "Fais une pub de 15 secondes pour vendre : ton courage d'avouer ses sentiments. Slogan obligatoire.",
  "Fais une pub de 15 secondes pour vendre : ta fidélité. Slogan obligatoire.",
  "Fais une pub de 15 secondes pour vendre : ton humour de couple. Slogan obligatoire.",
  "Fais une pub de 15 secondes pour vendre : ta présence réconfortante. Slogan obligatoire.",
  "Fais une pub de 15 secondes pour vendre : ton charme naturel. Slogan obligatoire.",
  "Fais une pub de 15 secondes pour vendre : ton flair pour trouver le/la bon(ne). Slogan obligatoire.",
  "Fais une pub de 15 secondes pour vendre : ton cœur d'artiste. Slogan obligatoire.",
  "Fais une pub de 15 secondes pour vendre : ta diplomatie après une dispute. Slogan obligatoire.",
  "Fais une pub de 15 secondes pour vendre : ton talent de cuisinier(ère) en amoureux. Slogan obligatoire.",
  "Fais une pub de 15 secondes pour vendre : ta façon de réconforter. Slogan obligatoire.",
  "Fais une pub de 15 secondes pour vendre : ton élégance naturelle. Slogan obligatoire.",
  "Danse le slow de ta vie pendant 20 secondes. La musique se choisit dans le salon.",
  "Danse le dancehall le plus chaud pendant 20 secondes. La musique se choisit dans le salon.",
  "Danse le pas de séduction le plus simple pendant 20 secondes. La musique se choisit dans le salon.",
  "Danse la danse de la victoire après un rencard réussi pendant 20 secondes. La musique se choisit dans le salon.",
  "Danse la danse de la jalousie pendant 20 secondes. La musique se choisit dans le salon.",
  "Danse la danse du « je ne fais pas semblant » pendant 20 secondes. La musique se choisit dans le salon.",
  "Danse le slow imaginé avec le joueur de ton choix pendant 20 secondes. La musique se choisit dans le salon.",
  "Danse la danse du matin au réveil pendant 20 secondes. La musique se choisit dans le salon.",
  "Danse la danse de la pluie trop romantique pendant 20 secondes. La musique se choisit dans le salon.",
  "Danse la danse du dernier message reçu pendant 20 secondes. La musique se choisit dans le salon.",
  "Danse la danse du « j'ai un rendez-vous ! » pendant 20 secondes. La musique se choisit dans le salon.",
  "Danse la danse de la paix intérieure après une rupture pendant 20 secondes. La musique se choisit dans le salon.",
  "Danse la danse de la météo : « il fait chaud ici » pendant 20 secondes. La musique se choisit dans le salon.",
  "Danse la danse du première fois où tu as osé pendant 20 secondes. La musique se choisit dans le salon.",
  "Danse la danse de l'anniversaire de couple pendant 20 secondes. La musique se choisit dans le salon.",
  "Danse la danse de la bougie : lente et douce pendant 20 secondes. La musique se choisit dans le salon.",
  "Danse la danse du vendredi soir pendant 20 secondes. La musique se choisit dans le salon.",
  "Danse la danse du dernier jour de célibataire pendant 20 secondes. La musique se choisit dans le salon.",
  "Danse la danse de l'attente du message pendant 20 secondes. La musique se choisit dans le salon.",
  "Danse la danse du sourire impossible à cacher pendant 20 secondes. La musique se choisit dans le salon.",
  "Danse la danse de la star préférée pendant 20 secondes. La musique se choisit dans le salon.",
  "Danse la danse de la déclaration réussie pendant 20 secondes. La musique se choisit dans le salon.",
  "Danse la danse de la pluie qui tombe doucement pendant 20 secondes. La musique se choisit dans le salon.",
  "Danse la danse du miroir avant de sortir pendant 20 secondes. La musique se choisit dans le salon.",
  "Danse la danse du câlin imaginaire pendant 20 secondes. La musique se choisit dans le salon.",
  "Raconte ton meilleur souvenir avec les déclarations publiques. 20 secondes.",
  "Fais une pub de 15 secondes pour les déclarations publiques. Slogan obligatoire.",
  "Raconte ton meilleur souvenir avec les retrouvailles. 20 secondes.",
  "Raconte ton meilleur souvenir avec les chansons dédiées. 20 secondes.",
  "Fais deviner les baisers dans le cou en 3 mimes maximum.",
  "Fais une pub de 15 secondes pour les bougies. Slogan obligatoire.",
  "Montre le geste parfait pour les premiers je t'aime. 10 secondes.",
  "Montre le geste parfait pour les mains qui tremblent. 10 secondes.",
  "Montre le geste parfait pour les massages des épaules. 10 secondes.",
  "Décris les mains qui se cherchent comme un commentateur sportif. 20 secondes.",
  "Raconte ton meilleur souvenir avec les jalousies légères. 20 secondes.",
  "Décris les bisous volés comme un commentateur sportif. 20 secondes.",
  "Fais deviner les frissons discrets en 3 mimes maximum.",
  "Mime ta plus belle scène avec les frissons discrets. 15 secondes.",
  "Montre le geste parfait pour les voyages à deux. 10 secondes.",
  "Imite quelqu'un qui découvre les jalousies légères. Le groupe devine.",
  "Imite quelqu'un qui découvre les ex qui reviennent. Le groupe devine.",
  "Mime ta plus belle scène avec les voyages à deux. 15 secondes.",
  "Explique les notes vocales comme une notice de montage. 20 secondes.",
  "Fais une pub de 15 secondes pour les câlins sur le canapé. Slogan obligatoire.",
  "Mime ta plus belle scène avec les câlins sur le canapé. 15 secondes.",
  "Imite quelqu'un qui découvre les chansons dédiées. Le groupe devine.",
  "Fais une pub de 15 secondes pour les taxis du retour. Slogan obligatoire.",
  "Raconte ton meilleur souvenir avec les cabines d'essayage. 20 secondes.",
  "Montre le geste parfait pour les flirts au téléphone. 10 secondes.",
  "Imite quelqu'un qui découvre les playlists d'amour. Le groupe devine.",
  "Raconte ton meilleur souvenir avec les mains dans les cheveux. 20 secondes.",
  "Raconte ton meilleur souvenir avec les playlists d'amour. 20 secondes.",
  "Fais une pub de 15 secondes pour les lettres jamais envoyées. Slogan obligatoire.",
  "Imite quelqu'un qui découvre les voyages à deux. Le groupe devine.",
  "Raconte ton meilleur souvenir avec les déjeuners au lit. 20 secondes.",
  "Montre le geste parfait pour les frissons discrets. 10 secondes.",
  "Décris les piques-niques en amoureux comme un commentateur sportif. 20 secondes.",
  "Fais deviner les mains qui se cherchent en 3 mimes maximum.",
  "Montre le geste parfait pour les baisers sur le front. 10 secondes.",
  "Mime ta plus belle scène avec les slows collés. 15 secondes.",
  "Mime ta plus belle scène avec les mains qui tremblent. 15 secondes.",
  "Raconte ton meilleur souvenir avec les baisers dans le cou. 20 secondes.",
  "Raconte ton meilleur souvenir avec les sourires cachés. 20 secondes.",
  "Décris les rencards surprises comme un commentateur sportif. 20 secondes.",
  "Fais une pub de 15 secondes pour les playlists d'amour. Slogan obligatoire.",
  "Raconte ton meilleur souvenir avec les piques-niques en amoureux. 20 secondes.",
  "Raconte ton meilleur souvenir avec les massages des épaules. 20 secondes.",
  "Fais une pub de 15 secondes pour les baisers sous la pluie. Slogan obligatoire.",
  "Explique les rencards surprises comme une notice de montage. 20 secondes.",
  "Décris les câlins longs comme un commentateur sportif. 20 secondes.",
  "Décris les amitiés qui basculent comme un commentateur sportif. 20 secondes.",
  "Fais deviner les surnoms d'amour en 3 mimes maximum.",
  "Décris les confidences nocturnes comme un commentateur sportif. 20 secondes.",
  "Décris les promesses douces comme un commentateur sportif. 20 secondes.",
  "Raconte ton meilleur souvenir avec les photos de couple. 20 secondes.",
  "Fais deviner les déclarations publiques en 3 mimes maximum.",
  "Fais deviner les voyages à deux en 3 mimes maximum.",
  "Imite quelqu'un qui découvre les baisers sous la pluie. Le groupe devine.",
  "Explique les fous rires à 2 h du matin comme une notice de montage. 20 secondes.",
  "Explique les confidences nocturnes comme une notice de montage. 20 secondes.",
  "Décris les dimanches au lit comme un commentateur sportif. 20 secondes.",
  "Explique les cabines d'essayage comme une notice de montage. 20 secondes.",
  "Imite quelqu'un qui découvre les douches à deux. Le groupe devine.",
  "Montre le geste parfait pour les fous rires à 2 h du matin. 10 secondes.",
  "Montre le geste parfait pour les lettres jamais envoyées. 10 secondes.",
  "Fais deviner les dimanches au lit en 3 mimes maximum.",
  "Imite quelqu'un qui découvre les sweats empruntés. Le groupe devine.",
  "Fais deviner les ex qui reviennent en 3 mimes maximum.",
  "Décris les fins de soirée à deux comme un commentateur sportif. 20 secondes.",
  "Décris les câlins sur le canapé comme un commentateur sportif. 20 secondes.",
  "Décris les frissons discrets comme un commentateur sportif. 20 secondes.",
  "Raconte ton meilleur souvenir avec les mains qui se cherchent. 20 secondes.",
  "Imite quelqu'un qui découvre les promenades main dans la main. Le groupe devine.",
  "Fais une pub de 15 secondes pour les déjeuners au lit. Slogan obligatoire.",
  "Mime ta plus belle scène avec les longues séparations. 15 secondes.",
  "Fais deviner les notes vocales en 3 mimes maximum.",
  "Fais deviner les promesses douces en 3 mimes maximum.",
  "Fais deviner les câlins longs en 3 mimes maximum.",
  "Fais deviner les odeurs de parfum en 3 mimes maximum.",
  "Mime ta plus belle scène avec les dimanches au lit. 15 secondes.",
  "Fais deviner les playlists d'amour en 3 mimes maximum.",
  "Raconte ton meilleur souvenir avec les fins de soirée à deux. 20 secondes.",
  "Mime ta plus belle scène avec les confidences nocturnes. 15 secondes.",
  "Fais deviner les bougies en 3 mimes maximum.",
  "Montre le geste parfait pour les câlins sur le canapé. 10 secondes.",
  "Fais une pub de 15 secondes pour les jalousies légères. Slogan obligatoire.",
  "Fais deviner les regards qui parlent en 3 mimes maximum.",
  "Raconte ton meilleur souvenir avec les premiers je t'aime. 20 secondes.",
  "Montre le geste parfait pour les déjeuners au lit. 10 secondes.",
  "Fais une pub de 15 secondes pour les messages du matin. Slogan obligatoire.",
  "Imite quelqu'un qui découvre les bisous volés. Le groupe devine.",
  "Décris les cabines d'essayage comme un commentateur sportif. 20 secondes.",
  "Explique les dîners aux chandelles comme une notice de montage. 20 secondes.",
  "Montre le geste parfait pour les ex qui reviennent. 10 secondes.",
  "Montre le geste parfait pour les slows collés. 10 secondes.",
  "Fais deviner les surprises en soirée en 3 mimes maximum.",
  "Fais deviner les photos de couple en 3 mimes maximum.",
  "Fais deviner les retrouvailles en 3 mimes maximum.",
  "Explique les massages des épaules comme une notice de montage. 20 secondes.",
  "Fais deviner les lettres jamais envoyées en 3 mimes maximum.",
  "Imite quelqu'un qui découvre les photos de couple. Le groupe devine.",
  "Décris les notes vocales comme un commentateur sportif. 20 secondes.",
  "Décris les retrouvailles comme un commentateur sportif. 20 secondes.",
  "Montre le geste parfait pour les sweats empruntés. 10 secondes.",
  "Montre le geste parfait pour les dîners aux chandelles. 10 secondes.",
  "Mime ta plus belle scène avec les câlins endormis. 15 secondes.",
  "Raconte ton meilleur souvenir avec les odeurs de parfum. 20 secondes.",
  "Fais deviner les câlins sur le canapé en 3 mimes maximum.",
  "Imite quelqu'un qui découvre les surprises en soirée. Le groupe devine.",
  "Raconte ton meilleur souvenir avec les câlins endormis. 20 secondes.",
  "Mime ta plus belle scène avec les piques-niques en amoureux. 15 secondes.",
  "Mime ta plus belle scène avec les mains dans les cheveux. 15 secondes.",
  "Mime ta plus belle scène avec les bougies. 15 secondes.",
  "Imite quelqu'un qui découvre les rencards surprises. Le groupe devine.",
  "Mime ta plus belle scène avec les surnoms d'amour. 15 secondes.",
  "Fais une pub de 15 secondes pour les promenades main dans la main. Slogan obligatoire.",
  "Fais une pub de 15 secondes pour les surprises en soirée. Slogan obligatoire.",
  "Fais deviner les rencards surprises en 3 mimes maximum.",
  "Fais une pub de 15 secondes pour les longues séparations. Slogan obligatoire.",
  "Imite quelqu'un qui découvre les vocaux mignons. Le groupe devine.",
  "Explique les premiers je t'aime comme une notice de montage. 20 secondes.",
  "Mime ta plus belle scène avec les premiers je t'aime. 15 secondes.",
  "Explique les dimanches au lit comme une notice de montage. 20 secondes.",
  "Décris les rêves d'amour comme un commentateur sportif. 20 secondes.",
  "Explique les chansons dédiées comme une notice de montage. 20 secondes.",
  "Décris les photos de couple comme un commentateur sportif. 20 secondes.",
  "Mime ta plus belle scène avec les jalousies légères. 15 secondes.",
  "Explique les câlins endormis comme une notice de montage. 20 secondes.",
  "Imite quelqu'un qui découvre les amitiés qui basculent. Le groupe devine.",
  "Mime ta plus belle scène avec les odeurs de parfum. 15 secondes.",
  "Explique les playlists d'amour comme une notice de montage. 20 secondes.",
  "Mime ta plus belle scène avec les regards qui parlent. 15 secondes.",
  "Raconte ton meilleur souvenir avec les bougies. 20 secondes.",
  "Fais une pub de 15 secondes pour les sweats empruntés. Slogan obligatoire.",
  "Mime ta plus belle scène avec les déjeuners au lit. 15 secondes.",
  "Décris les vocaux mignons comme un commentateur sportif. 20 secondes.",
  "Décris les massages des épaules comme un commentateur sportif. 20 secondes.",
  "Fais deviner les longues séparations en 3 mimes maximum.",
  "Imite quelqu'un qui découvre les piques-niques en amoureux. Le groupe devine.",
  "Fais une pub de 15 secondes pour les regards qui parlent. Slogan obligatoire.",
  "Fais deviner les promenades main dans la main en 3 mimes maximum.",
  "Fais une pub de 15 secondes pour les chansons dédiées. Slogan obligatoire.",
  "Mime ta plus belle scène avec les baisers sur le front. 15 secondes.",
  "Raconte ton meilleur souvenir avec les notes vocales. 20 secondes.",
  "Montre le geste parfait pour les messages du matin. 10 secondes.",
  "Explique les promenades main dans la main comme une notice de montage. 20 secondes.",
  "Raconte ton meilleur souvenir avec les surprises en soirée. 20 secondes.",
  "Imite quelqu'un qui découvre les notes vocales. Le groupe devine.",
  "Raconte ton meilleur souvenir avec les slows collés. 20 secondes.",
  "Montre le geste parfait pour les surnoms d'amour. 10 secondes.",
  "Imite quelqu'un qui découvre les massages des épaules. Le groupe devine.",
  "Imite quelqu'un qui découvre les premiers je t'aime. Le groupe devine.",
  "Montre le geste parfait pour les promenades main dans la main. 10 secondes.",
  "Explique les ex qui reviennent comme une notice de montage. 20 secondes.",
  "Fais une pub de 15 secondes pour les cabines d'essayage. Slogan obligatoire.",
  "Montre le geste parfait pour les mains dans les cheveux. 10 secondes.",
  "Raconte ton meilleur souvenir avec les câlins longs. 20 secondes.",
  "Raconte ton meilleur souvenir avec les baisers sous la pluie. 20 secondes.",
  "Mime ta plus belle scène avec les ex qui reviennent. 15 secondes.",
  "Mime ta plus belle scène avec les sourires cachés. 15 secondes.",
  "Mime ta plus belle scène avec les lettres jamais envoyées. 15 secondes.",
  "Raconte ton meilleur souvenir avec les promesses douces. 20 secondes.",
  "Mime ta plus belle scène avec les douches à deux. 15 secondes.",
  "Mime ta plus belle scène avec les rêves d'amour. 15 secondes.",
  "Montre le geste parfait pour les vocaux mignons. 10 secondes.",
  "Fais une pub de 15 secondes pour les massages des épaules. Slogan obligatoire.",
  "Fais deviner les confidences nocturnes en 3 mimes maximum.",
  "Fais deviner les câlins endormis en 3 mimes maximum.",
  "Montre le geste parfait pour les photos de couple. 10 secondes.",
  "Raconte ton meilleur souvenir avec les promenades main dans la main. 20 secondes.",
  "Mime ta plus belle scène avec les chansons dédiées. 15 secondes.",
  "Mime ta plus belle scène avec les playlists d'amour. 15 secondes.",
  "Montre le geste parfait pour les câlins longs. 10 secondes.",
  "Fais une pub de 15 secondes pour les premiers je t'aime. Slogan obligatoire.",
  "Fais deviner les jalousies légères en 3 mimes maximum.",
  "Fais deviner les bisous volés en 3 mimes maximum.",
  "Imite quelqu'un qui découvre les sourires cachés. Le groupe devine.",
  "Montre le geste parfait pour les mains qui se cherchent. 10 secondes.",
  "Raconte ton meilleur souvenir avec les mains qui tremblent. 20 secondes.",
  "Mime ta plus belle scène avec les vocaux mignons. 15 secondes.",
  "Imite quelqu'un qui découvre les fous rires à 2 h du matin. Le groupe devine.",
  "Explique les baisers sous la pluie comme une notice de montage. 20 secondes.",
  "Montre le geste parfait pour les chansons dédiées. 10 secondes.",
  "Mime ta plus belle scène avec les bisous volés. 15 secondes.",
  "Raconte ton meilleur souvenir avec les longues séparations. 20 secondes.",
  "Mime ta plus belle scène avec les sweats empruntés. 15 secondes.",
  "Explique les câlins sur le canapé comme une notice de montage. 20 secondes.",
  "Fais une pub de 15 secondes pour les notes vocales. Slogan obligatoire.",
  "Imite quelqu'un qui découvre les cabines d'essayage. Le groupe devine.",
  "Imite quelqu'un qui découvre les déjeuners au lit. Le groupe devine.",
  "Mime ta plus belle scène avec les fins de soirée à deux. 15 secondes.",
  "Décris les mains qui tremblent comme un commentateur sportif. 20 secondes.",
  "Mime ta plus belle scène avec les baisers dans le cou. 15 secondes.",
  "Mime ta plus belle scène avec les câlins longs. 15 secondes.",
  "Fais une pub de 15 secondes pour les dîners aux chandelles. Slogan obligatoire.",
  "Mime ta plus belle scène avec les promenades main dans la main. 15 secondes.",
  "Décris les dîners aux chandelles comme un commentateur sportif. 20 secondes.",
  "Raconte ton meilleur souvenir avec les vocaux mignons. 20 secondes.",
  "Montre le geste parfait pour les rencards surprises. 10 secondes.",
  "Décris les bougies comme un commentateur sportif. 20 secondes.",
  "Explique les déclarations publiques comme une notice de montage. 20 secondes.",
  "Fais deviner les fous rires à 2 h du matin en 3 mimes maximum.",
  "Explique les amitiés qui basculent comme une notice de montage. 20 secondes.",
  "Fais deviner les baisers sur le front en 3 mimes maximum.",
  "Fais deviner les fins de soirée à deux en 3 mimes maximum.",
  "Décris les déjeuners au lit comme un commentateur sportif. 20 secondes.",
  "Imite quelqu'un qui découvre les regards qui parlent. Le groupe devine.",
  "Imite quelqu'un qui découvre les rêves d'amour. Le groupe devine.",
  "Imite quelqu'un qui découvre les slows collés. Le groupe devine.",
  "Raconte ton meilleur souvenir avec les baisers sur le front. 20 secondes.",
  "Imite quelqu'un qui découvre les baisers sur le front. Le groupe devine.",
  "Explique les bisous volés comme une notice de montage. 20 secondes.",
  "Fais deviner les déjeuners au lit en 3 mimes maximum.",
  "Fais deviner les messages du matin en 3 mimes maximum."
]
  },
  2: {
    verite: [
  "Décris ton premier baiser : âge, lieu, ambiance. Détails exigés.",
  "As-tu déjà couché avec quelqu'un dès le premier soir ?",
  "C'est le fantasme que tu n'as jamais raconté à personne ?",
  "As-tu déjà été surpris(e) en pleine action ? Par qui ?",
  "Quel est l'endroit le plus insolite où tu as fait l'amour ?",
  "As-tu déjà envoyé une photo osée ? À qui ?",
  "As-tu déjà fantasmé sur un proche de ton entourage ?",
  "As-tu déjà simulé un orgasme ? Combien de fois environ ?",
  "C'est la chose la plus folle que tu aies dite au lit ?",
  "As-tu déjà craqué pour un(e) ami(e) déjà pris(e) ?",
  "Ton pire baiser de ta vie ? Raconte la catastrophe.",
  "Combien de personnes as-tu couchées avec ? Le vrai chiffre ou presque.",
  "Tu préfères les préliminaires longs ou l'action directe ?",
  "C'est ta position préférée ? Décris-la simplement.",
  "As-tu déjà fait l'amour dans une voiture ? Où exactement ?",
  "Tu regardes quoi quand tu es seul(e) ? Sois honnête.",
  "As-tu déjà dit le mauvais prénom pendant l'action ?",
  "C'est ton bruit le plus gênant au lit ? Raconte.",
  "As-tu déjà eu un coup d'un soir ? Comment ça s'est fini ?",
  "Tu as déjà couché avec un(e) collègue ou un(e) camarade ?",
  "C'est ta partie préférée chez un homme ? Chez une femme ?",
  "As-tu déjà testé la douche à deux ? Verdict ?",
  "Combien de temps durent tes préliminaires en moyenne ?",
  "As-tu déjà envoyé un nude ? Tu as regretté ou pas ?",
  "Quel est ton meilleur souvenir chaud ? Décris-le sans les noms.",
  "As-tu déjà couché chez les parents ? Presque surpris(e) ?",
  "C'est le mot sale qui t'excite le plus quand on le chuchote ?",
  "As-tu déjà filmé ou été filmé(e) pendant l'action (avec accord) ?",
  "Tu préfères la lumière ou l'obscurité pendant l'amour ? Pourquoi ?",
  "As-tu déjà eu une aventure avec un(e) voisin(e) ?",
  "C'est ton record de fois en une seule nuit ?",
  "As-tu déjà testé les menottes ou le bandeau sur les yeux ?",
  "Tu as déjà gémi le mauvais prénom ? Lequel est sorti ?",
  "C'est la chose la plus osée que tu aies faite en public ?",
  "As-tu déjà couché avec deux personnes le même week-end ?",
  "Tu préfères prendre ou donner les commandes ? Pourquoi ?",
  "As-tu déjà eu un plan qui a mal tourné ? Raconte.",
  "C'est ton plus grand manque quand tu es célibataire trop longtemps ?",
  "As-tu déjà embrassé quelqu'un qui avait un(e) copain/copine ?",
  "Tu regardes quoi en premier chez quelqu'un nu ?",
  "As-tu déjà eu un rapprochement dans un club ? Jusqu'où ?",
  "C'est ton vêtement le plus sexy ? Montre-le en le décrivant.",
  "As-tu déjà testé une position du net ? Verdict honnête ?",
  "Tu as déjà laissé une marque (hickey) ou reçu une ? Où ?",
  "C'est ton niveau sonore au lit : discret(e), normal(e) ou bruyant(e) ?",
  "As-tu déjà couché avec ton/ta ex après la rupture ? Comment ça s'est passé ?",
  "Tu préfères qu'on te murmure quoi à l'oreille ? Le mot exact.",
  "As-tu déjà testé la glace ou la plume pendant les préliminaires ?",
  "C'est ta plus grosse gaffe en pleine intimité ?",
  "As-tu déjà eu un rêve chaud avec quelqu'un d'ici ? Décris sans le nommer.",
  "Tu penses à quoi quand tu fermes les yeux sous la douche ?",
  "As-tu déjà eu une envie irrésistible pendant un reuni important ?",
  "C'est le compliment physique qui t'excite le plus ?",
  "As-tu déjà eu une relation qui a fini par un duo de c... compliqué ?",
  "As-tu déjà testé le téléphon chaud complet ? Jusqu'où tu es allé(e) ?",
  "C'est ton record de messages chauds en une soirée ?",
  "As-tu déjà fait l'amour pendant une coupure d'électricité ?",
  "Tu as déjà eu une envie pressante en pensant à quelqu'un d'ici ?",
  "C'est le geste le plus osé qu'on ait fait sur toi en public ?",
  "As-tu déjà embrassé quelqu'un dans un ascenseur ?",
  "C'est ta plus longue soirée qui a fini très tard le lendemain ?",
  "As-tu déjà adapté ton rythme au genre : doux ou sauvage ? Explique.",
  "Tu as déjà volé un sous-vêtement à un(e) partenaire comme souvenir ?",
  "C'est ton pire moment de gêne au déshabillage ?",
  "As-tu déjà simulé la fatigue pour éviter l'action ? Pourquoi ?",
  "Tu as déjà pensé à quelqu'un d'autre pendant l'action ? Qui (initiale) ?",
  "As-tu déjà eu un plan chez toi et regretter après ? Raconte.",
  "As-tu déjà couché dès le premier rendez-vous ? Raconte tout.",
  "As-tu déjà fait l'amour dans une voiture garée ? Raconte tout.",
  "As-tu déjà envoyé un nude à la mauvaise personne ? Raconte tout.",
  "As-tu déjà gardé un nude reçu ? Raconte tout.",
  "As-tu déjà simulé un orgasme pour que ça finisse ? Raconte tout.",
  "As-tu déjà été surpris(e) par un membre de ta famille ? Raconte tout.",
  "As-tu déjà fait l'amour chez les parents de l'autre ? Raconte tout.",
  "As-tu déjà dormi entièrement nu(e) avec quelqu'un ? Raconte tout.",
  "As-tu déjà eu une aventure avec un(e) voisin(e) ? Raconte tout.",
  "As-tu déjà embrassé un(e) ami(e) par jeu qui a dégénéré ? Raconte tout.",
  "As-tu déjà regardé un film X avec quelqu'un ? Raconte tout.",
  "As-tu déjà eu un coup d'un soir chez toi ? Raconte tout.",
  "As-tu déjà dit oui juste par fatigue ? Raconte tout.",
  "As-tu déjà couché avec un(e) collègue après une soirée ? Raconte tout.",
  "As-tu déjà testé la douche à deux ? Raconte tout.",
  "As-tu déjà couché dans la même pièce que des amis endormis ? Raconte tout.",
  "As-tu déjà reçu un appel pendant l'action et répondu ? Raconte tout.",
  "As-tu déjà eu une relation dans les toilettes d'un club ? Raconte tout.",
  "As-tu déjà embrassé deux personnes en une soirée ? Raconte tout.",
  "As-tu déjà laissé une marque sur le cou de quelqu'un ? Raconte tout.",
  "As-tu déjà eu une histoire avec un(e) professeur(e) ou un(e) chef ? Raconte tout.",
  "As-tu déjà couché pendant les règles sans problème ? Raconte tout.",
  "As-tu déjà eu une envie très forte pendant un cours ou une réunion ? Raconte tout.",
  "As-tu déjà fini une soirée chez un(e) inconnu(e) ? Raconte tout.",
  "As-tu déjà eu un plan qui a commencé par un simple massage ? Raconte tout.",
  "As-tu déjà recu une photo non demandée et répondu chaudement ? Raconte tout.",
  "As-tu déjà couché avec quelqu'un que tu ne supportais plus le lendemain ? Raconte tout.",
  "As-tu déjà retardé un rendez-vous à cause d'une nuit trop longue ? Raconte tout.",
  "As-tu déjà pleuré après une intimité trop forte ? Raconte tout.",
  "As-tu déjà eu un partenaire trop bruyant pour ton quartier ? Raconte tout.",
  "As-tu déjà été démasqué(e) pendant un mensonge chaud ? Raconte tout.",
  "As-tu déjà couché avec quelqu'un de ton quartier secret ? Raconte tout.",
  "As-tu déjà embrassé quelqu'un en conduisant ? Raconte tout.",
  "As-tu déjà couché dans un lit qui grince trop ? Raconte tout.",
  "As-tu déjà caché une relation à tout le monde ? Raconte tout.",
  "As-tu déjà eu une histoire secrète avec un(e) ami(e) du groupe ? Raconte tout.",
  "As-tu déjà fait l'amour alors qu'une série tournait à côté ? Raconte tout.",
  "As-tu déjà envoyé un vocal chaud qui a glitché en public ? Raconte tout.",
  "As-tu déjà couché sur une table, pas sur un lit ? Raconte tout.",
  "As-tu déjà laissé des traces de rouge à lèvres inexpliquées ? Raconte tout.",
  "As-tu déjà expliqué à un(e) voisin(e) un bruit gênant ? Raconte tout.",
  "As-tu déjà couché avec quelqu'un qui ronfle après ? Raconte tout.",
  "As-tu déjà eu une relation pendant qu'il pleuvait très fort ? Raconte tout.",
  "As-tu déjà testé l'amour tôt le matin avant le travail ? Raconte tout.",
  "As-tu déjà eu une envie pendant une coupure d'Internet ? Raconte tout.",
  "As-tu déjà couché avec la personne « interdite » du groupe ? Raconte tout.",
  "As-tu déjà couché avec un(e) champion(ne) qui dort tout de suite après ? Raconte tout.",
  "As-tu déjà couché avec quelqu'un qui parle trop pendant ? Raconte tout.",
  "As-tu déjà eu un rire fou pendant l'action ? Raconte tout.",
  "As-tu déjà raconté à tes amis le lendemain matin ? Raconte tout.",
  "As-tu déjà couché avec quelqu'un dont tu ne connais toujours pas le nom ? Raconte tout.",
  "As-tu déjà couché avec quelqu'un déjà marié(e) sans le savoir ? Raconte tout.",
  "As-tu déjà arrêté en plein milieu parce que trop fatigué(e) ? Raconte tout.",
  "As-tu déjà eu une chute du lit en pleine action ? Raconte tout.",
  "As-tu déjà couché avec la télé allumée toute la nuit ? Raconte tout.",
  "As-tu déjà couché avec une playlist très mal choisie ? Raconte tout.",
  "As-tu déjà couché avant de manger et fini par brûler le dîner ? Raconte tout.",
  "As-tu déjà couché après une grosse dispute (maquillage intensif) ? Raconte tout.",
  "As-tu déjà couché dans la voiture de tes parents ? Raconte tout.",
  "As-tu déjà couché avec un(e) ancien(ne) camarade d'école ? Raconte tout.",
  "As-tu déjà couché le jour de ton anniversaire en mode VIP ? Raconte tout.",
  "As-tu déjà couché avec quelqu'un qui a gardé ses chaussettes ? Raconte tout.",
  "Ta position ou ta préférence : la missionnaire, pourquoi elle reste un classique. Décris en une phrase.",
  "Ta position ou ta préférence : la cuillère, douce ou pas. Décris en une phrase.",
  "Ta position ou ta préférence : la cavalière, ce que tu y aimes. Décris en une phrase.",
  "Ta position ou ta préférence : contre le mur, la vraie raison. Décris en une phrase.",
  "Ta position ou ta préférence : la levrette, trop ou juste bien. Décris en une phrase.",
  "Ta position ou ta préférence : sur la table, l'expérience vécue. Décris en une phrase.",
  "Ta position ou ta préférence : dans la douche, le vrai problème. Décris en une phrase.",
  "Ta position ou ta préférence : le 69, trop compliqué ou parfait. Décris en une phrase.",
  "Ta position ou ta préférence : face au miroir, ce que ça change. Décris en une phrase.",
  "Ta position ou ta préférence : sur une chaise, la vraie histoire. Décris en une phrase.",
  "Ta position ou ta préférence : les jambes sur les épaules, l'avis sincère. Décris en une phrase.",
  "Ta position ou ta préférence : la position d'endormissement préférée après. Décris en une phrase.",
  "Ta position ou ta préférence : la position du matin avant le travail. Décris en une phrase.",
  "Ta position ou ta préférence : la position idéale dans une voiture. Décris en une phrase.",
  "Ta position ou ta préférence : la position parfaite pour ne pas être entendu(e). Décris en une phrase.",
  "Ta position ou ta préférence : la position où tu tiens le plus longtemps. Décris en une phrase.",
  "Ta position ou ta préférence : la position où tu perds le contrôle. Décris en une phrase.",
  "Ta position ou ta préférence : la position la plus fatigante de ta liste. Décris en une phrase.",
  "Ta position ou ta préférence : la position la plus sous-estimée. Décris en une phrase.",
  "Ta position ou ta préférence : la position que tu refuses toujours et pourquoi. Décris en une phrase.",
  "Ta position ou ta préférence : ta façon préférée d'être embrassé(e). Décris en une phrase.",
  "Ta position ou ta préférence : ta façon préférée d'être caressé(e). Décris en une phrase.",
  "Ta position ou ta préférence : l'endroit du corps où tu aimes être embrassé(e) le plus. Décris en une phrase.",
  "Ta position ou ta préférence : la vitesse parfaite : lente, normale ou rapide. Décris en une phrase.",
  "Ta position ou ta préférence : ton style : calme, joueur ou sauvage. Décris en une phrase.",
  "Ta position ou ta préférence : ton moment préféré : avant, pendant ou après. Décris en une phrase.",
  "Ta position ou ta préférence : ta préférence : avec ou sans musique. Décris en une phrase.",
  "Ta position ou ta préférence : ta préférence : lit, canapé ou sol. Décris en une phrase.",
  "Ta position ou ta préférence : ta préférence : nuit noire ou lampe allumée. Décris en une phrase.",
  "Ta position ou ta préférence : ta préférence : silence total ou mots sales. Décris en une phrase.",
  "Ta position ou ta préférence : la chose que tu adores qu'on te fasse (un seul exemple). Décris en une phrase.",
  "Ta position ou ta préférence : la chose que tu aimes faire le plus (un seul exemple). Décris en une phrase.",
  "Ta position ou ta préférence : le meilleur endroit où recevoir un bisou. Décris en une phrase.",
  "Ta position ou ta préférence : le meilleur endroit où poser tes mains. Décris en une phrase.",
  "Ta position ou ta préférence : ton tempo préféré pour les préliminaires. Décris en une phrase.",
  "Ta position ou ta préférence : le nombre parfait de rounds selon toi. Décris en une phrase.",
  "Ta position ou ta préférence : la durée parfaite d'une nuit parfaite. Décris en une phrase.",
  "Ta position ou ta préférence : le point de départ parfait d'une soirée chaude. Décris en une phrase.",
  "Ta position ou ta préférence : la chose la plus importante au lit selon toi. Décris en une phrase.",
  "Ta position ou ta préférence : le son que tu préfères entendre pendant. Décris en une phrase.",
  "Ta position ou ta préférence : le mot que tu aimes entendre dans l'oreille. Décris en une phrase.",
  "Ta position ou ta préférence : le vêtement que tu aimes laisser sur toi. Décris en une phrase.",
  "Ta position ou ta préférence : l'accessoire que tu voudrais tester. Décris en une phrase.",
  "Ta position ou ta préférence : l'endroit parfait pour les préliminaires. Décris en une phrase.",
  "Ta position ou ta préférence : la température parfaite de la chambre. Décris en une phrase.",
  "Ta position ou ta préférence : l'heure parfaite pour une nuit parfaite. Décris en une phrase.",
  "Ta position ou ta préférence : la chose que tu ne feras jamais (ton vrai limite). Décris en une phrase.",
  "Ta position ou ta préférence : la chose que tu as mise du temps à oser. Décris en une phrase.",
  "Ta position ou ta préférence : la chose que tu as adorée sans t'y attendre. Décris en une phrase.",
  "Ta position ou ta préférence : la chose que tu voudrais faire plus souvent. Décris en une phrase.",
  "Tu préfères : préliminaires longs ou action directe ? Argumente en une phrase.",
  "Tu préfères : lumières allumées ou éteintes ? Argumente en une phrase.",
  "Tu préfères : silence total ou musique forte ? Argumente en une phrase.",
  "Tu préfères : doucéur extrême ou côté sauvage ? Argumente en une phrase.",
  "Tu préfères : un(e) partenaire calme ou un(e) animal(e) ? Argumente en une phrase.",
  "Tu préfères : l'amour le matin ou le soir ? Argumente en une phrase.",
  "Tu préfères : avec ou sans sous-vêtements ? Argumente en une phrase.",
  "Tu préfères : lit king size ou espace réduit ? Argumente en une phrase.",
  "Tu préfères : un(e) partenaire expérimenté(e) ou débutant(e) ? Argumente en une phrase.",
  "Tu préfères : baiser puis dormir ou parler toute la nuit ? Argumente en une phrase.",
  "Tu préfères : les mots doux ou les ordres doux ? Argumente en une phrase.",
  "Tu préfères : un bisou long ou mille petits bisous ? Argumente en une phrase.",
  "Tu préfères : que ce soit toi qui initie ou l'autre ? Argumente en une phrase.",
  "Tu préfères : un rendez-vous qui finit tôt ou très tard ? Argumente en une phrase.",
  "Tu préfères : la spontanéité totale ou le plan préparé ? Argumente en une phrase.",
  "Tu préfères : un câlin chaud ou un câlin long ? Argumente en une phrase.",
  "Tu préfères : la passion d'un soir ou l'habitude confortable ? Argumente en une phrase.",
  "Tu préfères : la créativité totale ou la routine parfaite ? Argumente en une phrase.",
  "Tu préfères : les yeux bandés ou les mains liées ? Argumente en une phrase.",
  "Tu préfères : le parfum fort ou le corps naturel ? Argumente en une phrase.",
  "Tu préfères : un(a) partenaire qui ronfle ou qui parle en dormant ? Argumente en une phrase.",
  "Tu préfères : l'après-amour : dormir ou manger ? Argumente en une phrase.",
  "Tu préfères : les rencontres chez toi ou dehors ? Argumente en une phrase.",
  "Tu préfères : un plan suivi ou un plan isolé ? Argumente en une phrase.",
  "Tu préfères : l'amour rapide ou l'amour très lent ? Argumente en une phrase.",
  "Tu préfères : les grands gestes ou les petites attentions ? Argumente en une phrase.",
  "Tu préfères : qu'on te surprenne ou qu'on t'annonce tout ? Argumente en une phrase.",
  "Tu préfères : la pudeur ou l'audace totale ? Argumente en une phrase.",
  "Tu préfères : le téléphone éteint ou en mode musique ? Argumente en une phrase.",
  "Tu préfères : l'odeur de la nuit ou le parfum du matin ? Argumente en une phrase.",
  "Tu préfères : un câlin silencieux ou un câlin bavard ? Argumente en une phrase.",
  "Tu préfères : la tendresse extrême ou le défi constant ? Argumente en une phrase.",
  "Tu préfères : les surprises fréquentes ou la stabilité ? Argumente en une phrase.",
  "Tu préfères : le corps musclé ou le corps doux ? Argumente en une phrase.",
  "Tu préfères : les baisers publics ou les baisers privés seulement ? Argumente en une phrase.",
  "Tu préfères : la vérité brutale ou les mensonges doux ? Argumente en une phrase.",
  "Tu préfères : un(a) ex qui change ou un(e) nouveau/nouvelle qui découvre ? Argumente en une phrase.",
  "Tu préfères : la journée de repos après ou la soirée qui continue ? Argumente en une phrase.",
  "Tu préfères : les photos ensemble ou les souvenirs dans la tête ? Argumente en une phrase.",
  "Tu préfères : qu'on te fasse rire ou qu'on te fasse rêver ? Argumente en une phrase.",
  "Qu'est-ce que tu penses le plus souvent : le dernier baiser que tu as donné ? Décris.",
  "Qu'est-ce que tu penses le plus souvent : le prochain rendez-vous chaud ? Décris.",
  "Qu'est-ce que tu penses le plus souvent : le corps de ta dernière personne ? Décris.",
  "Qu'est-ce que tu penses le plus souvent : la nuit que tu refais en boucle ? Décris.",
  "Qu'est-ce que tu penses le plus souvent : le message que tu voudrais recevoir ? Décris.",
  "Qu'est-ce que tu penses le plus souvent : la position que tu veux tester ? Décris.",
  "Qu'est-ce que tu penses le plus souvent : le lieu interdit que tu veux essayer ? Décris.",
  "Qu'est-ce que tu penses le plus souvent : le mot que tu voudrais entendre ? Décris.",
  "Qu'est-ce que tu penses le plus souvent : la personne que tu ne devrais pas penser ? Décris.",
  "Qu'est-ce que tu penses le plus souvent : le moment où tu as perdu le contrôle ? Décris.",
  "Qu'est-ce que tu penses le plus souvent : la façon dont tu te touches quand tu es seul(e) ? Décris.",
  "Qu'est-ce que tu penses le plus souvent : la première fois que tu as tout compris ? Décris.",
  "Qu'est-ce que tu penses le plus souvent : le bruit que tu fais quand c'est trop bon ? Décris.",
  "Qu'est-ce que tu penses le plus souvent : l'odeur qui te rend fou/folle ? Décris.",
  "Qu'est-ce que tu penses le plus souvent : le contact que tu préfères ? Décris.",
  "Qu'est-ce que tu penses le plus souvent : la soirée où tu as trop osé ? Décris.",
  "Qu'est-ce que tu penses le plus souvent : la personne que tu voudrais ce soir ? Décris.",
  "Qu'est-ce que tu penses le plus souvent : le vêtement que tu veux voir tomber ? Décris.",
  "Qu'est-ce que tu penses le plus souvent : le réveil côte à côte ? Décris.",
  "Qu'est-ce que tu penses le plus souvent : la douche qui dure trop longtemps ? Décris.",
  "Qu'est-ce que tu penses le plus souvent : le lit trop grand sans personne ? Décris.",
  "Qu'est-ce que tu penses le plus souvent : le silence du matin après une nuit chaude ? Décris.",
  "Qu'est-ce que tu penses le plus souvent : la marque laissée sur ta peau ? Décris.",
  "Qu'est-ce que tu penses le plus souvent : le mot « encore » murmuré ? Décris.",
  "Qu'est-ce que tu penses le plus souvent : le souffle dans ton cou ? Décris.",
  "Qu'est-ce que tu penses le plus souvent : les mains qui se perdent ? Décris.",
  "Qu'est-ce que tu penses le plus souvent : le frisson du premier contact ? Décris.",
  "Qu'est-ce que tu penses le plus souvent : le regard qui demande la permission ? Décris.",
  "Qu'est-ce que tu penses le plus souvent : le soupir de fin de nuit ? Décris.",
  "Qu'est-ce que tu penses le plus souvent : le sourire du lendemain ? Décris.",
  "Qu'est-ce que tu penses le plus souvent : le taxi du retour à l'aube ? Décris.",
  "Qu'est-ce que tu penses le plus souvent : le message « je suis bien chez toi » ? Décris.",
  "Qu'est-ce que tu penses le plus souvent : la fatigue douce du matin après ? Décris.",
  "Qu'est-ce que tu penses le plus souvent : la soif bizarre du réveil ? Décris.",
  "Qu'est-ce que tu penses le plus souvent : le triomphe silencieux de la nuit passée ? Décris.",
  "Qu'est-ce que tu penses le plus souvent : le trou de mémoire du nom de la personne ? Décris.",
  "Qu'est-ce que tu penses le plus souvent : le pantalon trop difficile à trouver au sol ? Décris.",
  "Qu'est-ce que tu penses le plus souvent : l'alarme qui gâche tout ? Décris.",
  "Qu'est-ce que tu penses le plus souvent : le « il faut que j'y aille » trop tôt ? Décris.",
  "Qu'est-ce que tu penses le plus souvent : le dernier regard à la porte ? Décris.",
  "Décris ton niveau ou ton style sur : ton endurance au lit. Chiffre sur 10 obligatoire.",
  "Décris ton niveau ou ton style sur : ta douceur pendant les préliminaires. Chiffre sur 10 obligatoire.",
  "Décris ton niveau ou ton style sur : ton côté sauvage quand tu lâches prise. Chiffre sur 10 obligatoire.",
  "Décris ton niveau ou ton style sur : tes talents de baiser. Chiffre sur 10 obligatoire.",
  "Décris ton niveau ou ton style sur : tes talents de masseur/masseuse. Chiffre sur 10 obligatoire.",
  "Décris ton niveau ou ton style sur : ton audace pour faire le premier pas. Chiffre sur 10 obligatoire.",
  "Décris ton niveau ou ton style sur : tes talents pour les mots sales. Chiffre sur 10 obligatoire.",
  "Décris ton niveau ou ton style sur : ton niveau de bruit au lit. Chiffre sur 10 obligatoire.",
  "Décris ton niveau ou ton style sur : ta capacité à te lâcher vraiment. Chiffre sur 10 obligatoire.",
  "Décris ton niveau ou ton style sur : ton imagination pour surprendre. Chiffre sur 10 obligatoire.",
  "Décris ton niveau ou ton style sur : tes talents pour les retrouvailles. Chiffre sur 10 obligatoire.",
  "Décris ton niveau ou ton style sur : ta patience dans la séduction. Chiffre sur 10 obligatoire.",
  "Décris ton niveau ou ton style sur : ta capacité à oublier un(e) ex. Chiffre sur 10 obligatoire.",
  "Décris ton niveau ou ton style sur : ton courage pour dire non. Chiffre sur 10 obligatoire.",
  "Décris ton niveau ou ton style sur : ton niveau de jalousie. Chiffre sur 10 obligatoire.",
  "Décris ton niveau ou ton style sur : ta capacité à pardonner. Chiffre sur 10 obligatoire.",
  "Décris ton niveau ou ton style sur : ton énergie le matin après une nuit chaude. Chiffre sur 10 obligatoire.",
  "Décris ton niveau ou ton style sur : ta discrétion après un plan. Chiffre sur 10 obligatoire.",
  "Décris ton niveau ou ton style sur : ta sincérité dans les mots doux. Chiffre sur 10 obligatoire.",
  "Décris ton niveau ou ton style sur : ton niveau d'expérience totale. Chiffre sur 10 obligatoire.",
  "Décris ton niveau ou ton style sur : ta capacité à retenir un secret chaud. Chiffre sur 10 obligatoire.",
  "Décris ton niveau ou ton style sur : ton talent pour rendre quelqu'un fou/folle. Chiffre sur 10 obligatoire.",
  "Décris ton niveau ou ton style sur : ta facilité à tomber amoureux(se). Chiffre sur 10 obligatoire.",
  "Décris ton niveau ou ton style sur : ton niveau de fantaisie au lit. Chiffre sur 10 obligatoire.",
  "Décris ton niveau ou ton style sur : ta capacité à transformer un rencard en nuit. Chiffre sur 10 obligatoire.",
  "Décris ton niveau ou ton style sur : ta rapidité à t'attacher. Chiffre sur 10 obligatoire.",
  "Décris ton niveau ou ton style sur : ta force pour résister à un(a) ex. Chiffre sur 10 obligatoire.",
  "Décris ton niveau ou ton style sur : ton talent pour les messages chauds. Chiffre sur 10 obligatoire.",
  "Décris ton niveau ou ton style sur : ta façon de t'habiller pour séduire. Chiffre sur 10 obligatoire.",
  "Décris ton niveau ou ton style sur : ton instinct pour sentir le désir de l'autre. Chiffre sur 10 obligatoire.",
  "Ton record avec les pauses déjeuner chaudes ? Le groupe demande le chiffre.",
  "C'est quoi ton avis sur les vocaux chauds ? Sois honnête.",
  "les draps froissés : oui, non, ou tu rêves ?",
  "Ton record avec les vidéos qui donnent envie ? Le groupe demande le chiffre.",
  "Qu'est-ce qui change avec les chemises ouvertes selon la personne ?",
  "Tu recommencerais avec les morsures légères ? Pourquoi ?",
  "Qu'est-ce qui change avec les hôtels de passage selon la personne ?",
  "As-tu déjà testé les souffles courts ? Raconte.",
  "Qu'est-ce qui change avec les playlists chaudes selon la personne ?",
  "As-tu déjà testé les massages sensuels ? Raconte.",
  "Tu recommencerais avec les plumes et la glace ? Pourquoi ?",
  "C'est quoi ton meilleur souvenir avec les flirts au bureau ?",
  "les caresses lentes : oui, non, ou tu rêves ?",
  "Tu recommencerais avec les cuisines en pleine nuit ? Pourquoi ?",
  "Ton record avec les caresses lentes ? Le groupe demande le chiffre.",
  "Ton pire souvenir avec les tenues sous le manteau ? Raconte.",
  "C'est quoi ton meilleur souvenir avec les morsures légères ?",
  "les câlins de réconciliation : oui, non, ou tu rêves ?",
  "As-tu déjà testé les vidéos qui donnent envie ? Raconte.",
  "Ton pire souvenir avec les lumières tamisées ? Raconte.",
  "Ton record avec les week-ends hors de la ville ? Le groupe demande le chiffre.",
  "As-tu déjà testé les douches à deux ? Raconte.",
  "Qu'est-ce qui change avec les doigts qui glissent selon la personne ?",
  "C'est quoi ton meilleur souvenir avec les hôtels de passage ?",
  "Tu recommencerais avec les lendemains qui chantent ? Pourquoi ?",
  "As-tu déjà testé les plans qui commencent par un massage ? Raconte.",
  "C'est quoi ton avis sur les sextos du soir ? Sois honnête.",
  "C'est quoi ton meilleur souvenir avec les plages la nuit ?",
  "Qu'est-ce qui change avec les gémissements discrets selon la personne ?",
  "Ton record avec les hôtels de passage ? Le groupe demande le chiffre.",
  "Ton record avec les bandeaux sur les yeux ? Le groupe demande le chiffre.",
  "les nuits sans sommeil : oui, non, ou tu rêves ?",
  "Ton pire souvenir avec les miroirs ? Raconte.",
  "As-tu déjà testé les sous-vêtements sexy ? Raconte.",
  "Qu'est-ce qui change avec les morsures légères selon la personne ?",
  "Ton pire souvenir avec les douches à deux ? Raconte.",
  "Ton record avec les câlins de réconciliation ? Le groupe demande le chiffre.",
  "C'est quoi ton meilleur souvenir avec les mots murmurés à l'oreille ?",
  "Ton record avec les chemises ouvertes ? Le groupe demande le chiffre.",
  "C'est quoi ton meilleur souvenir avec les nuits sans sommeil ?",
  "C'est quoi ton avis sur les plages la nuit ? Sois honnête.",
  "Ton pire souvenir avec les caresses lentes ? Raconte.",
  "Ton pire souvenir avec les réveils à 5 h ? Raconte.",
  "Ton record avec les morsures légères ? Le groupe demande le chiffre.",
  "Qu'est-ce qui change avec les vocaux chauds selon la personne ?",
  "les jeux de mains : oui, non, ou tu rêves ?",
  "Qu'est-ce qui change avec les plages la nuit selon la personne ?",
  "Ton pire souvenir avec les câlins de réconciliation ? Raconte.",
  "Qu'est-ce qui change avec les week-ends hors de la ville selon la personne ?",
  "As-tu déjà testé les nuits sans sommeil ? Raconte.",
  "les plans qui commencent par un massage : oui, non, ou tu rêves ?",
  "C'est quoi ton meilleur souvenir avec les dîners qui finissent tôt ?",
  "Ton pire souvenir avec les sièges arrière de voiture ? Raconte.",
  "Qu'est-ce qui change avec les jeux de mains selon la personne ?",
  "Tu recommencerais avec les réveils à 5 h ? Pourquoi ?",
  "les talons au lit : oui, non, ou tu rêves ?",
  "Qu'est-ce qui change avec les nuits sans sommeil selon la personne ?",
  "C'est quoi ton meilleur souvenir avec les doigts qui glissent ?",
  "Ton record avec les vocaux chauds ? Le groupe demande le chiffre.",
  "Qu'est-ce qui change avec les taxis qui s'attardent selon la personne ?",
  "Qu'est-ce qui change avec les vidéos qui donnent envie selon la personne ?",
  "Ton pire souvenir avec les sous-vêtements sexy ? Raconte.",
  "As-tu déjà testé les gémissements discrets ? Raconte.",
  "C'est quoi ton avis sur les douches à deux ? Sois honnête.",
  "As-tu déjà testé les cuisines en pleine nuit ? Raconte.",
  "Tu recommencerais avec les tenues sous le manteau ? Pourquoi ?",
  "Qu'est-ce qui change avec les massages sensuels selon la personne ?",
  "Qu'est-ce qui change avec les miroirs selon la personne ?",
  "Ton pire souvenir avec les flirts au bureau ? Raconte.",
  "Ton record avec les réveils à 5 h ? Le groupe demande le chiffre.",
  "Qu'est-ce qui change avec les silences qui disent tout selon la personne ?",
  "Ton record avec les baisers dans le dos ? Le groupe demande le chiffre.",
  "Qu'est-ce qui change avec les lendemains qui chantent selon la personne ?",
  "Tu recommencerais avec les sextos du soir ? Pourquoi ?",
  "Qu'est-ce qui change avec les tenues sous le manteau selon la personne ?",
  "Ton record avec les photos prises au bon angle ? Le groupe demande le chiffre.",
  "As-tu déjà testé les réveils à 5 h ? Raconte.",
  "C'est quoi ton meilleur souvenir avec les lits trop petits ?",
  "Tu recommencerais avec les bandeaux sur les yeux ? Pourquoi ?",
  "C'est quoi ton avis sur les préliminaires longs ? Sois honnête.",
  "Ton pire souvenir avec les cuisines en pleine nuit ? Raconte.",
  "C'est quoi ton avis sur les morsures légères ? Sois honnête.",
  "Ton record avec les nudes assumés ? Le groupe demande le chiffre.",
  "les lits trop petits : oui, non, ou tu rêves ?",
  "C'est quoi ton avis sur les cuisines en pleine nuit ? Sois honnête.",
  "Tu recommencerais avec les jambes qui tremblent ? Pourquoi ?",
  "C'est quoi ton meilleur souvenir avec les préliminaires longs ?",
  "As-tu déjà testé les chemises ouvertes ? Raconte.",
  "As-tu déjà testé les plages la nuit ? Raconte.",
  "C'est quoi ton avis sur les balcons en plein air ? Sois honnête.",
  "Ton record avec les plages la nuit ? Le groupe demande le chiffre.",
  "Ton record avec les doigts qui glissent ? Le groupe demande le chiffre.",
  "As-tu déjà testé les positions contre le mur ? Raconte.",
  "Ton pire souvenir avec les regards interdits ? Raconte.",
  "Ton record avec les fuites du matin ? Le groupe demande le chiffre.",
  "As-tu déjà testé les regards interdits ? Raconte.",
  "les lumières tamisées : oui, non, ou tu rêves ?",
  "Ton pire souvenir avec les week-ends hors de la ville ? Raconte.",
  "Ton pire souvenir avec les hôtels de passage ? Raconte.",
  "C'est quoi ton avis sur les cravates ? Sois honnête.",
  "Ton record avec les douches à deux ? Le groupe demande le chiffre.",
  "Ton pire souvenir avec les taxis qui s'attardent ? Raconte.",
  "Tu recommencerais avec les week-ends hors de la ville ? Pourquoi ?",
  "les gémissements discrets : oui, non, ou tu rêves ?",
  "C'est quoi ton avis sur les plans qui commencent par un massage ? Sois honnête.",
  "Qu'est-ce qui change avec les sous-vêtements sexy selon la personne ?",
  "C'est quoi ton meilleur souvenir avec les pauses déjeuner chaudes ?",
  "Ton record avec les talons au lit ? Le groupe demande le chiffre.",
  "C'est quoi ton avis sur les plumes et la glace ? Sois honnête.",
  "C'est quoi ton meilleur souvenir avec les playlists chaudes ?",
  "C'est quoi ton avis sur les positions contre le mur ? Sois honnête.",
  "Tu recommencerais avec les nudes assumés ? Pourquoi ?",
  "As-tu déjà testé les lumières tamisées ? Raconte.",
  "Tu recommencerais avec les plans qui commencent par un massage ? Pourquoi ?",
  "Ton pire souvenir avec les disputes qui finissent au lit ? Raconte.",
  "Ton record avec les draps froissés ? Le groupe demande le chiffre.",
  "As-tu déjà testé les baisers dans le dos ? Raconte.",
  "Qu'est-ce qui change avec les sièges arrière de voiture selon la personne ?",
  "Ton record avec les taxis qui s'attardent ? Le groupe demande le chiffre.",
  "Qu'est-ce qui change avec les pauses déjeuner chaudes selon la personne ?",
  "C'est quoi ton avis sur les miroirs ? Sois honnête.",
  "les sous-vêtements sexy : oui, non, ou tu rêves ?",
  "Ton pire souvenir avec les chemises ouvertes ? Raconte.",
  "C'est quoi ton avis sur les nuits sans sommeil ? Sois honnête.",
  "Qu'est-ce qui change avec les photos prises au bon angle selon la personne ?",
  "Ton record avec les cravates ? Le groupe demande le chiffre.",
  "les salles de bain embuées : oui, non, ou tu rêves ?",
  "les lendemains qui chantent : oui, non, ou tu rêves ?",
  "Ton pire souvenir avec les lits trop petits ? Raconte.",
  "C'est quoi ton avis sur les photos prises au bon angle ? Sois honnête.",
  "Ton record avec les préliminaires longs ? Le groupe demande le chiffre.",
  "C'est quoi ton avis sur les playlists chaudes ? Sois honnête.",
  "Ton pire souvenir avec les préliminaires longs ? Raconte.",
  "Ton record avec les massages sensuels ? Le groupe demande le chiffre.",
  "C'est quoi ton avis sur les regards interdits ? Sois honnête.",
  "Tu recommencerais avec les douches à deux ? Pourquoi ?",
  "Qu'est-ce qui change avec les lits trop petits selon la personne ?",
  "Qu'est-ce qui change avec les regards interdits selon la personne ?",
  "C'est quoi ton avis sur les draps froissés ? Sois honnête.",
  "les tenues sous le manteau : oui, non, ou tu rêves ?",
  "les douches à deux : oui, non, ou tu rêves ?",
  "As-tu déjà testé les balcons en plein air ? Raconte.",
  "Ton pire souvenir avec les talons au lit ? Raconte.",
  "C'est quoi ton avis sur les sièges arrière de voiture ? Sois honnête.",
  "Qu'est-ce qui change avec les cuisines en pleine nuit selon la personne ?",
  "Tu recommencerais avec les massages sensuels ? Pourquoi ?",
  "les jambes qui tremblent : oui, non, ou tu rêves ?",
  "les cravates : oui, non, ou tu rêves ?",
  "Tu recommencerais avec les sièges arrière de voiture ? Pourquoi ?",
  "C'est quoi ton meilleur souvenir avec les sous-vêtements sexy ?",
  "C'est quoi ton meilleur souvenir avec les regards interdits ?",
  "Ton pire souvenir avec les pauses déjeuner chaudes ? Raconte.",
  "C'est quoi ton meilleur souvenir avec les lendemains qui chantent ?",
  "Ton record avec les plumes et la glace ? Le groupe demande le chiffre.",
  "C'est quoi ton meilleur souvenir avec les chemises ouvertes ?",
  "les baisers dans le dos : oui, non, ou tu rêves ?",
  "Tu recommencerais avec les talons au lit ? Pourquoi ?",
  "Tu recommencerais avec les caresses lentes ? Pourquoi ?",
  "Ton pire souvenir avec les lendemains qui chantent ? Raconte.",
  "Qu'est-ce qui change avec les positions contre le mur selon la personne ?",
  "Ton pire souvenir avec les massages sensuels ? Raconte.",
  "As-tu déjà testé les lendemains qui chantent ? Raconte.",
  "les nudes assumés : oui, non, ou tu rêves ?",
  "Ton pire souvenir avec les sextos du soir ? Raconte.",
  "Qu'est-ce qui change avec les dîners qui finissent tôt selon la personne ?",
  "Ton record avec les miroirs ? Le groupe demande le chiffre.",
  "C'est quoi ton avis sur les vidéos qui donnent envie ? Sois honnête.",
  "As-tu déjà testé les nudes assumés ? Raconte.",
  "Tu recommencerais avec les mots murmurés à l'oreille ? Pourquoi ?",
  "C'est quoi ton avis sur les mots murmurés à l'oreille ? Sois honnête.",
  "As-tu déjà testé les jambes qui tremblent ? Raconte.",
  "C'est quoi ton avis sur les pauses déjeuner chaudes ? Sois honnête.",
  "As-tu déjà testé les hôtels de passage ? Raconte.",
  "Ton pire souvenir avec les nuits sans sommeil ? Raconte.",
  "Qu'est-ce qui change avec les bandeaux sur les yeux selon la personne ?",
  "As-tu déjà testé les miroirs ? Raconte.",
  "As-tu déjà testé les morsures légères ? Raconte.",
  "Qu'est-ce qui change avec les plans qui commencent par un massage selon la personne ?",
  "Qu'est-ce qui change avec les préliminaires longs selon la personne ?",
  "C'est quoi ton meilleur souvenir avec les tenues sous le manteau ?",
  "C'est quoi ton meilleur souvenir avec les massages sensuels ?",
  "C'est quoi ton meilleur souvenir avec les miroirs ?",
  "Qu'est-ce qui change avec les sextos du soir selon la personne ?",
  "As-tu déjà testé les sextos du soir ? Raconte.",
  "les massages sensuels : oui, non, ou tu rêves ?",
  "Ton pire souvenir avec les bandeaux sur les yeux ? Raconte.",
  "Ton record avec les positions contre le mur ? Le groupe demande le chiffre.",
  "Ton record avec les gémissements discrets ? Le groupe demande le chiffre.",
  "Qu'est-ce qui change avec les mots murmurés à l'oreille selon la personne ?",
  "Ton pire souvenir avec les draps froissés ? Raconte.",
  "les mots murmurés à l'oreille : oui, non, ou tu rêves ?",
  "Tu recommencerais avec les regards interdits ? Pourquoi ?",
  "les réveils à 5 h : oui, non, ou tu rêves ?",
  "As-tu déjà testé les fuites du matin ? Raconte.",
  "Qu'est-ce qui change avec les baisers dans le dos selon la personne ?",
  "C'est quoi ton meilleur souvenir avec les fuites du matin ?",
  "As-tu déjà testé les câlins de réconciliation ? Raconte.",
  "Qu'est-ce qui change avec les cravates selon la personne ?",
  "As-tu déjà testé les playlists chaudes ? Raconte.",
  "C'est quoi ton meilleur souvenir avec les gémissements discrets ?",
  "Qu'est-ce qui change avec les lumières tamisées selon la personne ?",
  "les plumes et la glace : oui, non, ou tu rêves ?",
  "C'est quoi ton meilleur souvenir avec les sextos du soir ?",
  "Ton record avec les jambes qui tremblent ? Le groupe demande le chiffre.",
  "As-tu déjà testé les taxis qui s'attardent ? Raconte.",
  "Qu'est-ce qui change avec les câlins de réconciliation selon la personne ?",
  "les hôtels de passage : oui, non, ou tu rêves ?",
  "Tu recommencerais avec les salles de bain embuées ? Pourquoi ?",
  "C'est quoi ton meilleur souvenir avec les cravates ?",
  "les positions contre le mur : oui, non, ou tu rêves ?",
  "C'est quoi ton avis sur les flirts au bureau ? Sois honnête."
],
    action: [
  "Fais un strip-tease d'UN seul vêtement. Les chaussettes ne comptent pas.",
  "Envoie un message très chaud à ton crush maintenant.",
  "Raconte ta dernière nuit chaude comme un conte de fées.",
  "Mime (sans mots) ta position préférée. Le groupe doit deviner.",
  "Envoie un vocal où tu gémis le mot « encore » de façon théâtrale.",
  "Fais un compliment salé à chaque joueur, un par un.",
  "Danse comme dans un clip, mode séduction activée.",
  "Imite ton meilleur regard « invitation au péché ».",
  "Envoie un selfie « bonne nuit » sous ta plus belle lumière au joueur de ton choix.",
  "Chante un couplet transformé en déclaration très hot adressée à un joueur.",
  "Fais un slow très rapproché avec ta caméra.",
  "Suce un glaçon en regardant la caméra, 10 secondes.",
  "Lèche ton doigt lentement en fixant la caméra.",
  "Mime un baiser très lent à la caméra. 10 secondes.",
  "Décris ce que tu portes comme sous-vêtements sans les montrer.",
  "Fais deviner ton niveau de bruit au lit en l'imitant 5 secondes.",
  "Raconte ta pire galère de déshabillage en imitant les gestes.",
  "Montre la dernière photo que tu as envoyée à ton crush (défilement de la galerie interdit).",
  "Écris ici un sexto de 2 lignes. Le groupe note.",
  "Fais un massage imaginaire complet de la personne en face, mimes inclus.",
  "Mime comment tu embrasses dans le cou (avec ton pouce).",
  "Décris ton corps préféré chez l'autre en le montrant sur toi.",
  "Fais 20 secondes de look « j'attends quelque chose ».",
  "Imite ton bruit de lit le plus discret puis le plus bruyant.",
  "Envoie un message au joueur de ton choix : « si j'étais là, je ferais quoi ? ».",
  "Montre comment tu montes les escaliers quand tu es en mode séduction.",
  "Imite ta réaction quand la musique s'arrête en pleine action.",
  "Décris ta plus longue nuit en 30 secondes chrono.",
  "Mime la position où tu dors quand tu n'es pas seul(e).",
  "Fais deviner un mot chaud par dessin ou par mime. Le groupe a 3 essais.",
  "Envoie un vocal où tu chuchotes ce que tu ferais ce soir si tu n'étais pas seul(e).",
  "Montre ton meilleur regard puis ton pire regard. Différence nette exigée.",
  "Décris ta dernière envie secrète en regardant la caméra.",
  "Mime comment tu enlèves une chemise mouillée.",
  "Fais deviner ta position préférée en 3 mots seulement.",
  "Envoie un emoji qui décrit ta nuit idéale à chaque joueur.",
  "Raconte ta plus belle nuit comme un commentaire de match final.",
  "Imite le moment où tu hésites devant le lit de quelqu'un.",
  "Montre comment tu embrasses (version main) : rapide, lent, sauvage. 3 versions.",
  "Fais une présentation de 15 secondes de ta « maison de l'amour » (ta chambre).",
  "Envoie un vocal où tu répètes « je ne dirai jamais ça » de façon de plus en moins convaincue.",
  "Mime ta plus grande panne sèche de séduction.",
  "Décris le meilleur compliment que tu voudrais recevoir ce soir.",
  "Imite ta réaction si le groupe choisissait ta photo de profil pendant 24 h.",
  "Fais deviner un lieu chaud par mime uniquement.",
  "Raconte ta soirée idéale en mode bande-annonce de film.",
  "Montre ta meilleure imitation de quelqu'un qui refuse puis qui cède.",
  "Envoie un message poétique mais chaud au joueur le plus calme.",
  "Imite le silence gênant après une phrase trop osée.",
  "Décris ta tenue de nuit idéale pour ce soir, mimes compris.",
  "Envoie un vocal où tu gémis très doucement deux fois. 15 secondes maximum.",
  "Envoie un vocal où tu chuchotes « je pense à toi » d'une voix qui donne envie. 15 secondes maximum.",
  "Envoie un vocal où tu racontes ce que tu portes en ce moment. 15 secondes maximum.",
  "Envoie un vocal où tu fais un rire qui finit en soupir chaud. 15 secondes maximum.",
  "Envoie un vocal où tu dis « encore » comme dans un film. 15 secondes maximum.",
  "Envoie un vocal où tu chuchotes un compliment salé. 15 secondes maximum.",
  "Envoie un vocal où tu imites ton meilleur bruit de baiser. 15 secondes maximum.",
  "Envoie un vocal où tu fais deviner ta position par un seul son. 15 secondes maximum.",
  "Envoie un vocal où tu dis « je rentre chez toi maintenant » comme une menace adorable. 15 secondes maximum.",
  "Envoie un vocal où tu chuchotes la première chose que tu ferais à côté de la personne. 15 secondes maximum.",
  "Envoie un vocal où tu imites ton rire du lendemain matin. 15 secondes maximum.",
  "Envoie un vocal où tu fais une déclaration entière d'une voix de séduction. 15 secondes maximum.",
  "Envoie un vocal où tu dis « je suis ton/ta fan numéro un » en mode star. 15 secondes maximum.",
  "Envoie un vocal où tu chuchotes un mot sale (un seul). 15 secondes maximum.",
  "Envoie un vocal où tu fais un décompte de 5 à 1 en voix basse. 15 secondes maximum.",
  "Envoie un vocal où tu imites le souffle du tout début des préliminaires. 15 secondes maximum.",
  "Envoie un vocal où tu dis « monte » comme dans un film d'action romantique. 15 secondes maximum.",
  "Envoie un vocal où tu racontes ta dernière envie en 3 mots. 15 secondes maximum.",
  "Envoie un vocal où tu fais deviner un lieu chaud par ton seul ton. 15 secondes maximum.",
  "Envoie un vocal où tu chuchotes le prénom d'un joueur comme si tu dormais. 15 secondes maximum.",
  "Envoie un vocal où tu dis « ça va trop vite là » avec ton plus beau soupir. 15 secondes maximum.",
  "Envoie un vocal où tu imites un appel du matin : « j'arrive dans 10 minutes ». 15 secondes maximum.",
  "Envoie un vocal où tu fais une blague qui tourne en phrase chaude. 15 secondes maximum.",
  "Envoie un vocal où tu dis « je garde ça pour ce soir » en riant. 15 secondes maximum.",
  "Envoie un vocal où tu chuchotes ta promesse la plus folle. 15 secondes maximum.",
  "Envoie un vocal où tu imites le répondeur de ton plan préféré. 15 secondes maximum.",
  "Envoie un vocal où tu dis « ferme les yeux » et compte jusqu'à 10. 15 secondes maximum.",
  "Envoie un vocal où tu racontes une nuit entière en 15 secondes chrono. 15 secondes maximum.",
  "Envoie un vocal où tu fais deviner ton humeur par un seul gémissement. 15 secondes maximum.",
  "Envoie un vocal où tu dis « mon tour » comme dans un jeu de carte chaud. 15 secondes maximum.",
  "Envoie un vocal où tu imites un regard qui parle (version sonore). 15 secondes maximum.",
  "Envoie un vocal où tu chuchotes « personne ne saura ». 15 secondes maximum.",
  "Envoie un vocal où tu fais la promo de ta nuit en 3 phrases. 15 secondes maximum.",
  "Envoie un vocal où tu dis « tu me manques déjà » de 3 façons. 15 secondes maximum.",
  "Envoie un vocal où tu imites une mère qui surprend un appel chaud. 15 secondes maximum.",
  "Montre ou mime comment tu embrasses vraiment (version main ou coussin) à la caméra. 15 secondes.",
  "Montre ou mime ta façon de danser très près de quelqu'un à la caméra. 15 secondes.",
  "Montre ou mime comment tu enlèves ton t-shirt les yeux fermés à la caméra. 15 secondes.",
  "Montre ou mime le regard que tu fais avant d'embrasser à la caméra. 15 secondes.",
  "Montre ou mime comment tu te déplaces dans ta chambre le soir à la caméra. 15 secondes.",
  "Montre ou mime ta pose préférée dans un lit à la caméra. 15 secondes.",
  "Montre ou mime comment tu montres ton côté sauvage en 3 gestes à la caméra. 15 secondes.",
  "Montre ou mime ta façon de retirer une ceinture à la caméra. 15 secondes.",
  "Montre ou mime comment tu hésites avant un premier bisou à la caméra. 15 secondes.",
  "Montre ou mime le geste que tu fais quand c'est trop bon à la caméra. 15 secondes.",
  "Montre ou mime comment tu te réveilles dans les bras de quelqu'un à la caméra. 15 secondes.",
  "Montre ou mime ta façon d'inviter quelqu'un à s'approcher à la caméra. 15 secondes.",
  "Montre ou mime comment tu enlèves les cheveux de ton épaule à la caméra. 15 secondes.",
  "Montre ou mime ta version du « chut » à la caméra. 15 secondes.",
  "Montre ou mime comment tu enlèves tes chaussures en dansant à la caméra. 15 secondes.",
  "Montre ou mime ton pas de porte de séduction à la caméra. 15 secondes.",
  "Montre ou mime comment tu fais pour qu'on te regarde à la caméra. 15 secondes.",
  "Montre ou mime ta façon de te lever d'un canapé avec style à la caméra. 15 secondes.",
  "Montre ou mime le regard du lendemain matin au réveil à la caméra. 15 secondes.",
  "Montre ou mime comment tu fais confiance : main tendue, yeux fermés à la caméra. 15 secondes.",
  "Montre ou mime ta façon d'embrasser le front (version coussin) à la caméra. 15 secondes.",
  "Montre ou mime le mouvement que tu fais quand la musique est parfaite à la caméra. 15 secondes.",
  "Montre ou mime comment tu t'allonges quand tu es fatigué(e) mais pas endormi(e) à la caméra. 15 secondes.",
  "Montre ou mime ta façon de murmurer à l'oreille (version mimes) à la caméra. 15 secondes.",
  "Montre ou mime comment tu joues avec ta bouche quand tu réfléchis à la caméra. 15 secondes.",
  "Montre ou mime ton geste quand tu entends « viens » à la caméra. 15 secondes.",
  "Montre ou mime comment tu montres que tu es d'accord sans parler à la caméra. 15 secondes.",
  "Montre ou mime ta façon de te retourner en dansant à la caméra. 15 secondes.",
  "Montre ou mime le geste du dernier regard avant d'éteindre la lumière à la caméra. 15 secondes.",
  "Montre ou mime comment tu enlèves un pull trop chaud à la caméra. 15 secondes.",
  "Montre ou mime ta façon d'attendre devant une porte fermée à la caméra. 15 secondes.",
  "Montre ou mime comment tu salues quelqu'un que tu désires à la caméra. 15 secondes.",
  "Montre ou mime le miroir du matin : ta pose de check rapide à la caméra. 15 secondes.",
  "Montre ou mime ta façon de vous asseoir très près à la caméra. 15 secondes.",
  "Montre ou mime comment tu manges une fraise de manière classique à la caméra. 15 secondes.",
  "Écris ici, en public : un sexto de 2 lignes. Le groupe note sur 10.",
  "Écris ici, en public : le message que tu n'as jamais osé envoyer. Le groupe note sur 10.",
  "Écris ici, en public : ta déclaration la plus chaude en 1 phrase. Le groupe note sur 10.",
  "Écris ici, en public : ce que tu ferais ce soir si tu n'étais pas seul(e). Le groupe note sur 10.",
  "Écris ici, en public : le compliment le plus chaud sur le joueur de ton choix. Le groupe note sur 10.",
  "Écris ici, en public : le mot sale qui t'excite le plus. Le groupe note sur 10.",
  "Écris ici, en public : la phrase que tu voudrais entendre à l'oreille. Le groupe note sur 10.",
  "Écris ici, en public : ta promesse de la nuit en 10 mots. Le groupe note sur 10.",
  "Écris ici, en public : le message que tu enverrais à ton crush maintenant. Le groupe note sur 10.",
  "Écris ici, en public : la description de ta tenue de nuit idéale. Le groupe note sur 10.",
  "Écris ici, en public : le surnom chaud que tu donnes à ton/ta partenaire. Le groupe note sur 10.",
  "Écris ici, en public : ta phrase d'accroche parfaite pour draguer. Le groupe note sur 10.",
  "Écris ici, en public : le dernier sexto que tu as vraiment envoyé. Le groupe note sur 10.",
  "Écris ici, en public : la phrase qui te fait craquer tout de suite. Le groupe note sur 10.",
  "Écris ici, en public : ton idée de nuit parfaite en 3 étapes. Le groupe note sur 10.",
  "Écris ici, en public : le compliment physique que tu voudrais recevoir. Le groupe note sur 10.",
  "Écris ici, en public : le message du matin parfait. Le groupe note sur 10.",
  "Écris ici, en public : la phrase de fin de nuit parfaite. Le groupe note sur 10.",
  "Écris ici, en public : ton record de mots chauds en une phrase. Le groupe note sur 10.",
  "Écris ici, en public : le message que ton ex t'a envoyé et que tu as gardé. Le groupe note sur 10.",
  "Écris ici, en public : la déclaration que tu ferais en public sans honte. Le groupe note sur 10.",
  "Écris ici, en public : le mot qui décrit ton niveau ce soir. Le groupe note sur 10.",
  "Écris ici, en public : la phrase que tu ne diras jamais à tes parents. Le groupe note sur 10.",
  "Écris ici, en public : ton plus beau mensonge de séduction (pour rire). Le groupe note sur 10.",
  "Écris ici, en public : la phrase pour sauver une soirée ratée. Le groupe note sur 10.",
  "Écris ici, en public : le compliment sur la voix du joueur à ta gauche. Le groupe note sur 10.",
  "Écris ici, en public : la phrase d'excuse après un bisou volé. Le groupe note sur 10.",
  "Écris ici, en public : le message qui fait répondre en 3 secondes. Le groupe note sur 10.",
  "Écris ici, en public : la phrase de rappel à 2 h du matin. Le groupe note sur 10.",
  "Écris ici, en public : ta définition de l'amour en une ligne chaude. Le groupe note sur 10.",
  "Fais deviner ta position préférée au groupe. 3 essais, mimes autorisés.",
  "Fais deviner ton lieu chaud de rêve au groupe. 3 essais, mimes autorisés.",
  "Fais deviner ton bruit de lit signature au groupe. 3 essais, mimes autorisés.",
  "Fais deviner ton meilleur geste de séduction au groupe. 3 essais, mimes autorisés.",
  "Fais deviner le mot que tu dis trop souvent au lit au groupe. 3 essais, mimes autorisés.",
  "Fais deviner la chanson qui te met d'humeur au groupe. 3 essais, mimes autorisés.",
  "Fais deviner le vêtement que tu préfères voir tomber au groupe. 3 essais, mimes autorisés.",
  "Fais deviner ta soirée parfaite en 3 scènes au groupe. 3 essais, mimes autorisés.",
  "Fais deviner ton niveau de jalousie au groupe. 3 essais, mimes autorisés.",
  "Fais deviner ton plus grand fantasme (version tout public) au groupe. 3 essais, mimes autorisés.",
  "Fais deviner le lieu le plus osé où tu as été au groupe. 3 essais, mimes autorisés.",
  "Fais deviner la chose que tu ne feras jamais au groupe. 3 essais, mimes autorisés.",
  "Fais deviner ta plus grande panne de séduction au groupe. 3 essais, mimes autorisés.",
  "Fais deviner ton style : doux, joueur ou sauvage au groupe. 3 essais, mimes autorisés.",
  "Fais deviner le compliment qui marche toujours avec toi au groupe. 3 essais, mimes autorisés.",
  "Fais deviner ta durée parfaite de préliminaires au groupe. 3 essais, mimes autorisés.",
  "Fais deviner ton énergie ce soir sur 10 au groupe. 3 essais, mimes autorisés.",
  "Fais deviner la position que tu ne testeras jamais au groupe. 3 essais, mimes autorisés.",
  "Fais deviner ton record de rounds au groupe. 3 essais, mimes autorisés.",
  "Fais deviner la personne d'ici que tu trouves la plus chaude (mime son initiale) au groupe. 3 essais, mimes autorisés.",
  "Fais deviner ton pire après-amour au groupe. 3 essais, mimes autorisés.",
  "Fais deviner le mot qui te fait fondre au groupe. 3 essais, mimes autorisés.",
  "Fais deviner ton préliminaire préféré au groupe. 3 essais, mimes autorisés.",
  "Fais deviner ton vêtement de séduction préféré au groupe. 3 essais, mimes autorisés.",
  "Fais deviner le bruit que fait ton lit au groupe. 3 essais, mimes autorisés.",
  "Fais deviner ton regard signature au groupe. 3 essais, mimes autorisés.",
  "Fais deviner la chanson de ton dernier slow au groupe. 3 essais, mimes autorisés.",
  "Fais deviner ta plus grosse honte chaude au groupe. 3 essais, mimes autorisés.",
  "Fais deviner le moment où tu as dit oui trop vite au groupe. 3 essais, mimes autorisés.",
  "Fais deviner le cadeau qui te fait craquer au groupe. 3 essais, mimes autorisés.",
  "Décris en détail, à voix haute : ta meilleure nuit (sans les noms). 20 secondes.",
  "Décris en détail, à voix haute : ton premier baiser complet. 20 secondes.",
  "Décris en détail, à voix haute : ta douche préférée de ta vie. 20 secondes.",
  "Décris en détail, à voix haute : la tenue que tu portes maintenant. 20 secondes.",
  "Décris en détail, à voix haute : ton dernier rêve chaud. 20 secondes.",
  "Décris en détail, à voix haute : la personne la plus attirante que tu aies croisée. 20 secondes.",
  "Décris en détail, à voix haute : ta soirée de rêve si tout était permis. 20 secondes.",
  "Décris en détail, à voix haute : le lit parfait selon toi. 20 secondes.",
  "Décris en détail, à voix haute : ton lieu chaud préféré. 20 secondes.",
  "Décris en détail, à voix haute : ton rituel avant de dormir. 20 secondes.",
  "Décris en détail, à voix haute : ta façon de séduire, étape par étape. 20 secondes.",
  "Décris en détail, à voix haute : la dernière fois que tu as trop osé. 20 secondes.",
  "Décris en détail, à voix haute : le massage parfait selon toi. 20 secondes.",
  "Décris en détail, à voix haute : ton réveil idéal avec quelqu'un. 20 secondes.",
  "Décris en détail, à voix haute : la voix qui te fait craquer. 20 secondes.",
  "Décris en détail, à voix haute : le parfum qui te rend fou/folle. 20 secondes.",
  "Décris en détail, à voix haute : ton dernier fou rire intime. 20 secondes.",
  "Décris en détail, à voix haute : ton plus beau câlin de ta vie. 20 secondes.",
  "Décris en détail, à voix haute : la nuit que tu referais sans changer un détail. 20 secondes.",
  "Décris en détail, à voix haute : ta plus belle erreur qui a fini très bien. 20 secondes.",
  "Raconte ton meilleur souvenir avec les sextos du soir. 20 secondes.",
  "Décris les sextos du soir comme un commentateur sportif. 20 secondes.",
  "Explique les playlists chaudes comme une notice de montage. 20 secondes.",
  "Décris les talons au lit comme un commentateur sportif. 20 secondes.",
  "Raconte ton meilleur souvenir avec les lumières tamisées. 20 secondes.",
  "Montre le geste parfait pour les chemises ouvertes. 10 secondes.",
  "Explique les lendemains qui chantent comme une notice de montage. 20 secondes.",
  "Imite quelqu'un qui découvre les morsures légères. Le groupe devine.",
  "Raconte ton meilleur souvenir avec les salles de bain embuées. 20 secondes.",
  "Montre le geste parfait pour les playlists chaudes. 10 secondes.",
  "Montre le geste parfait pour les miroirs. 10 secondes.",
  "Explique les miroirs comme une notice de montage. 20 secondes.",
  "Fais une pub de 15 secondes pour les flirts au bureau. Slogan obligatoire.",
  "Raconte ton meilleur souvenir avec les disputes qui finissent au lit. 20 secondes.",
  "Fais une pub de 15 secondes pour les jeux de mains. Slogan obligatoire.",
  "Montre le geste parfait pour les douches à deux. 10 secondes.",
  "Raconte ton meilleur souvenir avec les sous-vêtements sexy. 20 secondes.",
  "Imite quelqu'un qui découvre les souffles courts. Le groupe devine.",
  "Imite quelqu'un qui découvre les cuisines en pleine nuit. Le groupe devine.",
  "Imite quelqu'un qui découvre les jambes qui tremblent. Le groupe devine.",
  "Raconte ton meilleur souvenir avec les silences qui disent tout. 20 secondes.",
  "Explique les chemises ouvertes comme une notice de montage. 20 secondes.",
  "Explique les fuites du matin comme une notice de montage. 20 secondes.",
  "Raconte ton meilleur souvenir avec les jambes qui tremblent. 20 secondes.",
  "Raconte ton meilleur souvenir avec les préliminaires longs. 20 secondes.",
  "Raconte ton meilleur souvenir avec les souffles courts. 20 secondes.",
  "Raconte ton meilleur souvenir avec les massages sensuels. 20 secondes.",
  "Explique les balcons en plein air comme une notice de montage. 20 secondes.",
  "Décris les hôtels de passage comme un commentateur sportif. 20 secondes.",
  "Fais une pub de 15 secondes pour les fuites du matin. Slogan obligatoire.",
  "Montre le geste parfait pour les morsures légères. 10 secondes.",
  "Mime ta plus belle scène avec les sextos du soir. 15 secondes.",
  "Fais une pub de 15 secondes pour les lumières tamisées. Slogan obligatoire.",
  "Raconte ton meilleur souvenir avec les plans qui commencent par un massage. 20 secondes.",
  "Imite quelqu'un qui découvre les balcons en plein air. Le groupe devine.",
  "Mime ta plus belle scène avec les plumes et la glace. 15 secondes.",
  "Fais une pub de 15 secondes pour les tenues sous le manteau. Slogan obligatoire.",
  "Montre le geste parfait pour les bandeaux sur les yeux. 10 secondes.",
  "Mime ta plus belle scène avec les plages la nuit. 15 secondes.",
  "Montre le geste parfait pour les salles de bain embuées. 10 secondes.",
  "Décris les préliminaires longs comme un commentateur sportif. 20 secondes.",
  "Fais une pub de 15 secondes pour les lits trop petits. Slogan obligatoire.",
  "Fais deviner les jambes qui tremblent en 3 mimes maximum.",
  "Montre le geste parfait pour les mots murmurés à l'oreille. 10 secondes.",
  "Fais deviner les baisers dans le dos en 3 mimes maximum.",
  "Décris les doigts qui glissent comme un commentateur sportif. 20 secondes.",
  "Montre le geste parfait pour les photos prises au bon angle. 10 secondes.",
  "Fais deviner les vidéos qui donnent envie en 3 mimes maximum.",
  "Décris les nuits sans sommeil comme un commentateur sportif. 20 secondes.",
  "Mime ta plus belle scène avec les gémissements discrets. 15 secondes.",
  "Raconte ton meilleur souvenir avec les week-ends hors de la ville. 20 secondes.",
  "Décris les plumes et la glace comme un commentateur sportif. 20 secondes.",
  "Mime ta plus belle scène avec les jeux de mains. 15 secondes.",
  "Explique les morsures légères comme une notice de montage. 20 secondes.",
  "Fais deviner les plans qui commencent par un massage en 3 mimes maximum.",
  "Mime ta plus belle scène avec les lendemains qui chantent. 15 secondes.",
  "Raconte ton meilleur souvenir avec les fuites du matin. 20 secondes.",
  "Montre le geste parfait pour les vocaux chauds. 10 secondes.",
  "Fais deviner les caresses lentes en 3 mimes maximum.",
  "Raconte ton meilleur souvenir avec les morsures légères. 20 secondes.",
  "Imite quelqu'un qui découvre les dîners qui finissent tôt. Le groupe devine.",
  "Montre le geste parfait pour les week-ends hors de la ville. 10 secondes.",
  "Montre le geste parfait pour les nuits sans sommeil. 10 secondes.",
  "Montre le geste parfait pour les souffles courts. 10 secondes.",
  "Imite quelqu'un qui découvre les chemises ouvertes. Le groupe devine.",
  "Raconte ton meilleur souvenir avec les bandeaux sur les yeux. 20 secondes.",
  "Imite quelqu'un qui découvre les plumes et la glace. Le groupe devine.",
  "Raconte ton meilleur souvenir avec les playlists chaudes. 20 secondes.",
  "Décris les dîners qui finissent tôt comme un commentateur sportif. 20 secondes.",
  "Fais une pub de 15 secondes pour les plans qui commencent par un massage. Slogan obligatoire.",
  "Fais une pub de 15 secondes pour les cuisines en pleine nuit. Slogan obligatoire.",
  "Explique les dîners qui finissent tôt comme une notice de montage. 20 secondes.",
  "Montre le geste parfait pour les pauses déjeuner chaudes. 10 secondes.",
  "Mime ta plus belle scène avec les photos prises au bon angle. 15 secondes.",
  "Décris les sous-vêtements sexy comme un commentateur sportif. 20 secondes.",
  "Fais deviner les cravates en 3 mimes maximum.",
  "Mime ta plus belle scène avec les préliminaires longs. 15 secondes.",
  "Mime ta plus belle scène avec les pauses déjeuner chaudes. 15 secondes.",
  "Mime ta plus belle scène avec les playlists chaudes. 15 secondes.",
  "Décris les positions contre le mur comme un commentateur sportif. 20 secondes.",
  "Fais une pub de 15 secondes pour les vocaux chauds. Slogan obligatoire.",
  "Décris les réveils à 5 h comme un commentateur sportif. 20 secondes.",
  "Montre le geste parfait pour les dîners qui finissent tôt. 10 secondes.",
  "Raconte ton meilleur souvenir avec les câlins de réconciliation. 20 secondes.",
  "Montre le geste parfait pour les sextos du soir. 10 secondes.",
  "Fais deviner les doigts qui glissent en 3 mimes maximum.",
  "Explique les jambes qui tremblent comme une notice de montage. 20 secondes.",
  "Montre le geste parfait pour les draps froissés. 10 secondes.",
  "Explique les caresses lentes comme une notice de montage. 20 secondes.",
  "Montre le geste parfait pour les balcons en plein air. 10 secondes.",
  "Décris les bandeaux sur les yeux comme un commentateur sportif. 20 secondes.",
  "Mime ta plus belle scène avec les nudes assumés. 15 secondes.",
  "Imite quelqu'un qui découvre les silences qui disent tout. Le groupe devine.",
  "Mime ta plus belle scène avec les balcons en plein air. 15 secondes.",
  "Fais une pub de 15 secondes pour les positions contre le mur. Slogan obligatoire.",
  "Montre le geste parfait pour les talons au lit. 10 secondes.",
  "Imite quelqu'un qui découvre les draps froissés. Le groupe devine.",
  "Raconte ton meilleur souvenir avec les plages la nuit. 20 secondes.",
  "Raconte ton meilleur souvenir avec les chemises ouvertes. 20 secondes.",
  "Explique les week-ends hors de la ville comme une notice de montage. 20 secondes.",
  "Mime ta plus belle scène avec les chemises ouvertes. 15 secondes.",
  "Mime ta plus belle scène avec les dîners qui finissent tôt. 15 secondes.",
  "Imite quelqu'un qui découvre les vocaux chauds. Le groupe devine.",
  "Décris les baisers dans le dos comme un commentateur sportif. 20 secondes.",
  "Fais deviner les fuites du matin en 3 mimes maximum.",
  "Fais deviner les silences qui disent tout en 3 mimes maximum.",
  "Décris les sièges arrière de voiture comme un commentateur sportif. 20 secondes.",
  "Raconte ton meilleur souvenir avec les draps froissés. 20 secondes.",
  "Montre le geste parfait pour les caresses lentes. 10 secondes.",
  "Explique les disputes qui finissent au lit comme une notice de montage. 20 secondes.",
  "Raconte ton meilleur souvenir avec les tenues sous le manteau. 20 secondes.",
  "Fais une pub de 15 secondes pour les caresses lentes. Slogan obligatoire.",
  "Fais deviner les lits trop petits en 3 mimes maximum.",
  "Raconte ton meilleur souvenir avec les hôtels de passage. 20 secondes.",
  "Imite quelqu'un qui découvre les sous-vêtements sexy. Le groupe devine.",
  "Fais deviner les lumières tamisées en 3 mimes maximum.",
  "Mime ta plus belle scène avec les vidéos qui donnent envie. 15 secondes.",
  "Mime ta plus belle scène avec les douches à deux. 15 secondes.",
  "Montre le geste parfait pour les cravates. 10 secondes.",
  "Fais une pub de 15 secondes pour les jambes qui tremblent. Slogan obligatoire.",
  "Montre le geste parfait pour les lendemains qui chantent. 10 secondes.",
  "Imite quelqu'un qui découvre les caresses lentes. Le groupe devine.",
  "Imite quelqu'un qui découvre les gémissements discrets. Le groupe devine.",
  "Fais une pub de 15 secondes pour les préliminaires longs. Slogan obligatoire.",
  "Explique les tenues sous le manteau comme une notice de montage. 20 secondes.",
  "Fais une pub de 15 secondes pour les nudes assumés. Slogan obligatoire.",
  "Raconte ton meilleur souvenir avec les cravates. 20 secondes.",
  "Fais deviner les salles de bain embuées en 3 mimes maximum.",
  "Mime ta plus belle scène avec les week-ends hors de la ville. 15 secondes.",
  "Décris les week-ends hors de la ville comme un commentateur sportif. 20 secondes.",
  "Décris les jambes qui tremblent comme un commentateur sportif. 20 secondes.",
  "Fais deviner les balcons en plein air en 3 mimes maximum.",
  "Mime ta plus belle scène avec les miroirs. 15 secondes.",
  "Explique les doigts qui glissent comme une notice de montage. 20 secondes.",
  "Imite quelqu'un qui découvre les câlins de réconciliation. Le groupe devine.",
  "Fais deviner les disputes qui finissent au lit en 3 mimes maximum.",
  "Montre le geste parfait pour les massages sensuels. 10 secondes.",
  "Fais une pub de 15 secondes pour les mots murmurés à l'oreille. Slogan obligatoire.",
  "Mime ta plus belle scène avec les câlins de réconciliation. 15 secondes.",
  "Décris les draps froissés comme un commentateur sportif. 20 secondes.",
  "Imite quelqu'un qui découvre les lumières tamisées. Le groupe devine.",
  "Fais deviner les pauses déjeuner chaudes en 3 mimes maximum.",
  "Fais deviner les miroirs en 3 mimes maximum.",
  "Imite quelqu'un qui découvre les mots murmurés à l'oreille. Le groupe devine.",
  "Mime ta plus belle scène avec les vocaux chauds. 15 secondes.",
  "Mime ta plus belle scène avec les positions contre le mur. 15 secondes.",
  "Fais deviner les sous-vêtements sexy en 3 mimes maximum.",
  "Décris les câlins de réconciliation comme un commentateur sportif. 20 secondes.",
  "Fais une pub de 15 secondes pour les nuits sans sommeil. Slogan obligatoire.",
  "Raconte ton meilleur souvenir avec les douches à deux. 20 secondes.",
  "Fais deviner les playlists chaudes en 3 mimes maximum.",
  "Fais une pub de 15 secondes pour les week-ends hors de la ville. Slogan obligatoire.",
  "Explique les flirts au bureau comme une notice de montage. 20 secondes.",
  "Explique les cuisines en pleine nuit comme une notice de montage. 20 secondes.",
  "Décris les lumières tamisées comme un commentateur sportif. 20 secondes.",
  "Raconte ton meilleur souvenir avec les pauses déjeuner chaudes. 20 secondes.",
  "Fais deviner les regards interdits en 3 mimes maximum.",
  "Décris les douches à deux comme un commentateur sportif. 20 secondes.",
  "Mime ta plus belle scène avec les cuisines en pleine nuit. 15 secondes.",
  "Fais une pub de 15 secondes pour les dîners qui finissent tôt. Slogan obligatoire.",
  "Mime ta plus belle scène avec les regards interdits. 15 secondes.",
  "Raconte ton meilleur souvenir avec les positions contre le mur. 20 secondes.",
  "Imite quelqu'un qui découvre les positions contre le mur. Le groupe devine.",
  "Décris les plans qui commencent par un massage comme un commentateur sportif. 20 secondes.",
  "Montre le geste parfait pour les doigts qui glissent. 10 secondes.",
  "Décris les vocaux chauds comme un commentateur sportif. 20 secondes.",
  "Décris les miroirs comme un commentateur sportif. 20 secondes.",
  "Imite quelqu'un qui découvre les douches à deux. Le groupe devine.",
  "Mime ta plus belle scène avec les réveils à 5 h. 15 secondes.",
  "Décris les cravates comme un commentateur sportif. 20 secondes.",
  "Mime ta plus belle scène avec les caresses lentes. 15 secondes.",
  "Fais deviner les cuisines en pleine nuit en 3 mimes maximum.",
  "Fais deviner les vocaux chauds en 3 mimes maximum.",
  "Fais une pub de 15 secondes pour les massages sensuels. Slogan obligatoire.",
  "Décris les massages sensuels comme un commentateur sportif. 20 secondes.",
  "Explique les bandeaux sur les yeux comme une notice de montage. 20 secondes.",
  "Fais une pub de 15 secondes pour les doigts qui glissent. Slogan obligatoire.",
  "Montre le geste parfait pour les cuisines en pleine nuit. 10 secondes.",
  "Explique les taxis qui s'attardent comme une notice de montage. 20 secondes.",
  "Imite quelqu'un qui découvre les réveils à 5 h. Le groupe devine.",
  "Fais une pub de 15 secondes pour les baisers dans le dos. Slogan obligatoire.",
  "Explique les massages sensuels comme une notice de montage. 20 secondes.",
  "Raconte ton meilleur souvenir avec les nuits sans sommeil. 20 secondes.",
  "Explique les hôtels de passage comme une notice de montage. 20 secondes.",
  "Raconte ton meilleur souvenir avec les baisers dans le dos. 20 secondes.",
  "Fais une pub de 15 secondes pour les miroirs. Slogan obligatoire.",
  "Explique les lumières tamisées comme une notice de montage. 20 secondes.",
  "Raconte ton meilleur souvenir avec les flirts au bureau. 20 secondes.",
  "Fais une pub de 15 secondes pour les taxis qui s'attardent. Slogan obligatoire.",
  "Raconte ton meilleur souvenir avec les vidéos qui donnent envie. 20 secondes.",
  "Explique les nuits sans sommeil comme une notice de montage. 20 secondes.",
  "Fais deviner les souffles courts en 3 mimes maximum.",
  "Montre le geste parfait pour les positions contre le mur. 10 secondes.",
  "Fais deviner les câlins de réconciliation en 3 mimes maximum.",
  "Raconte ton meilleur souvenir avec les dîners qui finissent tôt. 20 secondes.",
  "Montre le geste parfait pour les fuites du matin. 10 secondes.",
  "Imite quelqu'un qui découvre les hôtels de passage. Le groupe devine.",
  "Mime ta plus belle scène avec les doigts qui glissent. 15 secondes.",
  "Fais une pub de 15 secondes pour les souffles courts. Slogan obligatoire.",
  "Explique les mots murmurés à l'oreille comme une notice de montage. 20 secondes.",
  "Décris les flirts au bureau comme un commentateur sportif. 20 secondes.",
  "Imite quelqu'un qui découvre les flirts au bureau. Le groupe devine.",
  "Fais une pub de 15 secondes pour les playlists chaudes. Slogan obligatoire.",
  "Raconte ton meilleur souvenir avec les gémissements discrets. 20 secondes.",
  "Fais deviner les jeux de mains en 3 mimes maximum.",
  "Décris les cuisines en pleine nuit comme un commentateur sportif. 20 secondes.",
  "Raconte ton meilleur souvenir avec les vocaux chauds. 20 secondes.",
  "Fais une pub de 15 secondes pour les sièges arrière de voiture. Slogan obligatoire.",
  "Montre le geste parfait pour les baisers dans le dos. 10 secondes.",
  "Mime ta plus belle scène avec les mots murmurés à l'oreille. 15 secondes.",
  "Montre le geste parfait pour les nudes assumés. 10 secondes.",
  "Montre le geste parfait pour les gémissements discrets. 10 secondes.",
  "Fais deviner les draps froissés en 3 mimes maximum.",
  "Explique les plages la nuit comme une notice de montage. 20 secondes.",
  "Montre le geste parfait pour les jeux de mains. 10 secondes.",
  "Fais une pub de 15 secondes pour les cravates. Slogan obligatoire.",
  "Explique les gémissements discrets comme une notice de montage. 20 secondes.",
  "Montre le geste parfait pour les plumes et la glace. 10 secondes.",
  "Raconte ton meilleur souvenir avec les miroirs. 20 secondes.",
  "Décris les gémissements discrets comme un commentateur sportif. 20 secondes.",
  "Fais une pub de 15 secondes pour les réveils à 5 h. Slogan obligatoire.",
  "Imite quelqu'un qui découvre les doigts qui glissent. Le groupe devine.",
  "Décris les nudes assumés comme un commentateur sportif. 20 secondes.",
  "Mime ta plus belle scène avec les massages sensuels. 15 secondes.",
  "Imite quelqu'un qui découvre les pauses déjeuner chaudes. Le groupe devine.",
  "Explique les positions contre le mur comme une notice de montage. 20 secondes.",
  "Explique les vocaux chauds comme une notice de montage. 20 secondes.",
  "Explique les sous-vêtements sexy comme une notice de montage. 20 secondes.",
  "Montre le geste parfait pour les câlins de réconciliation. 10 secondes.",
  "Mime ta plus belle scène avec les disputes qui finissent au lit. 15 secondes.",
  "Mime ta plus belle scène avec les nuits sans sommeil. 15 secondes.",
  "Décris les lendemains qui chantent comme un commentateur sportif. 20 secondes.",
  "Fais deviner les flirts au bureau en 3 mimes maximum.",
  "Fais deviner les photos prises au bon angle en 3 mimes maximum.",
  "Décris les taxis qui s'attardent comme un commentateur sportif. 20 secondes.",
  "Raconte ton meilleur souvenir avec les sièges arrière de voiture. 20 secondes.",
  "Décris les disputes qui finissent au lit comme un commentateur sportif. 20 secondes.",
  "Explique les regards interdits comme une notice de montage. 20 secondes.",
  "Mime ta plus belle scène avec les tenues sous le manteau. 15 secondes.",
  "Montre le geste parfait pour les vidéos qui donnent envie. 10 secondes.",
  "Mime ta plus belle scène avec les sièges arrière de voiture. 15 secondes.",
  "Décris les morsures légères comme un commentateur sportif. 20 secondes.",
  "Mime ta plus belle scène avec les taxis qui s'attardent. 15 secondes.",
  "Fais deviner les sièges arrière de voiture en 3 mimes maximum.",
  "Explique les douches à deux comme une notice de montage. 20 secondes.",
  "Explique les câlins de réconciliation comme une notice de montage. 20 secondes.",
  "Fais une pub de 15 secondes pour les chemises ouvertes. Slogan obligatoire.",
  "Fais une pub de 15 secondes pour les douches à deux. Slogan obligatoire.",
  "Explique les pauses déjeuner chaudes comme une notice de montage. 20 secondes.",
  "Mime ta plus belle scène avec les jambes qui tremblent. 15 secondes.",
  "Fais deviner les gémissements discrets en 3 mimes maximum.",
  "Fais deviner les sextos du soir en 3 mimes maximum.",
  "Imite quelqu'un qui découvre les baisers dans le dos. Le groupe devine.",
  "Fais une pub de 15 secondes pour les bandeaux sur les yeux. Slogan obligatoire.",
  "Montre le geste parfait pour les hôtels de passage. 10 secondes.",
  "Raconte ton meilleur souvenir avec les lendemains qui chantent. 20 secondes.",
  "Mime ta plus belle scène avec les plans qui commencent par un massage. 15 secondes.",
  "Imite quelqu'un qui découvre les cravates. Le groupe devine.",
  "Fais deviner les positions contre le mur en 3 mimes maximum.",
  "Décris les tenues sous le manteau comme un commentateur sportif. 20 secondes.",
  "Décris les plages la nuit comme un commentateur sportif. 20 secondes.",
  "Explique les cravates comme une notice de montage. 20 secondes.",
  "Imite quelqu'un qui découvre les regards interdits. Le groupe devine.",
  "Imite quelqu'un qui découvre les taxis qui s'attardent. Le groupe devine.",
  "Fais une pub de 15 secondes pour les vidéos qui donnent envie. Slogan obligatoire.",
  "Imite quelqu'un qui découvre les plages la nuit. Le groupe devine.",
  "Décris les balcons en plein air comme un commentateur sportif. 20 secondes.",
  "Explique les plans qui commencent par un massage comme une notice de montage. 20 secondes.",
  "Imite quelqu'un qui découvre les playlists chaudes. Le groupe devine.",
  "Décris les chemises ouvertes comme un commentateur sportif. 20 secondes.",
  "Fais deviner les dîners qui finissent tôt en 3 mimes maximum.",
  "Fais deviner les plages la nuit en 3 mimes maximum.",
  "Explique les silences qui disent tout comme une notice de montage. 20 secondes.",
  "Imite quelqu'un qui découvre les miroirs. Le groupe devine.",
  "Imite quelqu'un qui découvre les préliminaires longs. Le groupe devine.",
  "Montre le geste parfait pour les silences qui disent tout. 10 secondes.",
  "Montre le geste parfait pour les réveils à 5 h. 10 secondes.",
  "Raconte ton meilleur souvenir avec les caresses lentes. 20 secondes.",
  "Explique les nudes assumés comme une notice de montage. 20 secondes.",
  "Montre le geste parfait pour les préliminaires longs. 10 secondes.",
  "Explique les souffles courts comme une notice de montage. 20 secondes.",
  "Mime ta plus belle scène avec les talons au lit. 15 secondes.",
  "Imite quelqu'un qui découvre les week-ends hors de la ville. Le groupe devine.",
  "Imite quelqu'un qui découvre les lits trop petits. Le groupe devine.",
  "Fais deviner les douches à deux en 3 mimes maximum.",
  "Fais deviner les mots murmurés à l'oreille en 3 mimes maximum.",
  "Montre le geste parfait pour les tenues sous le manteau. 10 secondes.",
  "Imite quelqu'un qui découvre les photos prises au bon angle. Le groupe devine.",
  "Raconte ton meilleur souvenir avec les lits trop petits. 20 secondes.",
  "Mime ta plus belle scène avec les sous-vêtements sexy. 15 secondes.",
  "Montre le geste parfait pour les jambes qui tremblent. 10 secondes.",
  "Imite quelqu'un qui découvre les nudes assumés. Le groupe devine.",
  "Décris les photos prises au bon angle comme un commentateur sportif. 20 secondes.",
  "Raconte ton meilleur souvenir avec les mots murmurés à l'oreille. 20 secondes.",
  "Fais une pub de 15 secondes pour les balcons en plein air. Slogan obligatoire.",
  "Fais deviner les taxis qui s'attardent en 3 mimes maximum.",
  "Montre le geste parfait pour les sous-vêtements sexy. 10 secondes.",
  "Montre le geste parfait pour les taxis qui s'attardent. 10 secondes.",
  "Décris les pauses déjeuner chaudes comme un commentateur sportif. 20 secondes.",
  "Fais une pub de 15 secondes pour les hôtels de passage. Slogan obligatoire."
]
  },
  3: {
    verite: [
  "C'est la chose la plus folle que tu aies faite au lit ? Sans filtre.",
  "As-tu déjà eu une aventure avec quelqu'un déjà pris(e) ?",
  "Ta position préférée ? Le groupe exige les détails.",
  "As-tu déjà fantasmé sur quelqu'un présent dans cette partie ? Qui ?",
  "Le plus grand nombre de rounds en une seule nuit ? Le chiffre.",
  "As-tu déjà simulé l'orgasme pour sauver la situation ? Raconte.",
  "Ta plus courte aventure : combien de temps ça a duré ?",
  "C'est ton plus grand secret entre les draps ?",
  "La personne de cette partie que tu emmènerais direct chez toi ?",
  "As-tu déjà laissé ou reçu une morsure marqueuse ? Où exactement ?",
  "Le plus bizarre qu'on t'ait demandé au lit... et tu as dit oui ?",
  "Décris ta dernière fois : quand, où, combien de temps.",
  "C'est quoi ton préliminaire préféré, étape par étape ?",
  "Combien de temps tu tiens en moyenne ? Sois honnête.",
  "Tu préfères donner ou recevoir ? Pourquoi ?",
  "Raconte ta pire panne au lit. Toute l'histoire.",
  "Le mot sale qui te fait perdre le contrôle ?",
  "As-tu déjà testé les sextoys ? Lequel et verdict ?",
  "C'est le bruit de ton/ta partenaire qui te fait le plus craquer ?",
  "Décris ton dernier rêve X en détail.",
  "Où exactement tu aimes être embrassé(e) ? Montre sur toi.",
  "As-tu déjà fait l'amour pendant les règles ? Ton avis franc ?",
  "Ta plus grosse frousse de surprise pendant l'action ?",
  "Combien de nudes tu as dans ton téléphone en ce moment ?",
  "As-tu déjà couché avec le/la ex d'un(e) ami(e) ?",
  "Décris ta façon de toucher préférée : lente, ferme ou rapide ?",
  "Qu'est-ce que tu penses quand tu te touches ? La vraie image.",
  "Ta dernière recherche dans l'historique de vidéos X ? Mot pour mot.",
  "As-tu déjà eu un plan avec quelqu'un de ton quartier ? Qui le sait ?",
  "Le lieu le plus risqué où tu as fait l'amour ? Presque surpris(e) ?",
  "Raconte ta nuit la plus longue : de l'heure de départ à la fin.",
  "Tu préfères être mordu(e), griffé(e) ou soufflé(e) dans l'oreille ?",
  "Combien de personnes du groupe tu trouverais chaudes si tu étais en mode chasse ?",
  "Décris la dernière fois que tu as perdu le contrôle. Tout.",
  "Quel est ton record de nuits enchaînées avec la même personne ?",
  "As-tu déjà testé la fessée ? Ton verdict technique ?",
  "C'est le compliment sexuel qui te touche le plus ? Mot exact.",
  "As-tu déjà crié sans le vouloir ? Les voisins ont dit quoi ?",
  "Ton pire déshabillage raté ? Détails comiques acceptés.",
  "As-tu déjà eu un plan sans jamais connaître le prénom ?",
  "Décris la tenue qui te fait perdre la tête sur quelqu'un.",
  "Combien de temps tes préliminaires ont duré au maximum ?",
  "As-tu déjà fini une soirée direct à l'hôtel ? Avec qui (initiale) ?",
  "La chose que ton ex faisait et que tu cherches encore ailleurs ?",
  "Décris ta façon de baiser en 3 adjectifs seulement.",
  "As-tu déjà gémi le nom de quelqu'un d'autre ? Ça s'est vu ?",
  "Quel est le message chaud le plus direct que tu aies envoyé ? Copie-le.",
  "Ton avis franc : la lumière allumée change tout ou pas ?",
  "As-tu déjà testé deux personnes la même nuit ? Comment tu as géré ?",
  "C'est ta zone la plus sensible ? Désigne-la sur toi.",
  "As-tu déjà utilisé de la nourriture au lit ? Laquelle ?",
  "Raconte le plan le plus désordonné de ta vie : lieu, durée, fin.",
  "Tu préfères le matin, l'après-midi ou 3 h du matin ? Pourquoi ?",
  "As-tu déjà été bloqué(e) chez quelqu'un toute la nuit à cause d'une panne ?",
  "Décris ton orgasm parfait en une phrase précise.",
  "Ta réaction si quelqu'un d'ici t'envoyait un nude maintenant ?",
  "As-tu déjà couché pour régler une dispute ? Ça a marché ?",
  "Le fantasme que tu cacherais même à ton/ta partenaire de vie ?",
  "As-tu déjà filmé le plafond en te remémorant une nuit ? Laquelle ?",
  "Ton avis franc sur les plans à trois : oui, non, condition ?",
  "Décris le dernier son qui t'a réveillé(e) chez quelqu'un.",
  "Ta plus grosse dépense pour une nuit (hôtel, tenue, transport) ?",
  "As-tu déjà pris une douche avec quelqu'un sans rien faire ? C'était intense ?",
  "Décris ton niveau de contrôle ce soir sur 10, la preuve.",
  "Le dernier mot que tu as murmuré après l'action ?",
  "As-tu déjà pleuré de plaisir ? Raconte la scène.",
  "C'est ta façon signature d'embrasser ? Démontre en le décrivant.",
  "Combien de douches après une nuit avec la même personne ? Record ?",
  "Décris ta dernière fois : quand et où ? Tous les détails.",
  "Décris ta dernière fois : la position de départ et la position de fin ? Tous les détails.",
  "Décris ta dernière fois : la durée totale ? Tous les détails.",
  "Décris ta dernière fois : le nombre de rounds ? Tous les détails.",
  "Décris ta dernière fois : le bruit que vous avez fait ? Tous les détails.",
  "Décris ta dernière fois : la chose la plus folle de la nuit ? Tous les détails.",
  "Décris ta dernière fois : le moment où tu as perdu le contrôle ? Tous les détails.",
  "Décris ta dernière fois : la phrase qui a tout lancé ? Tous les détails.",
  "Décris ta dernière fois : ce que tu portes au moment où on te l'a demandé ? Tous les détails.",
  "Décris ta dernière fois : la chose que tu as regrettée ? Tous les détails.",
  "Décris ta dernière fois : la chose que tu as adorée ? Tous les détails.",
  "Décris ta dernière fois : le moment le plus gênant ? Tous les détails.",
  "Décris ta dernière fois : le mot qui a été murmuré à la fin ? Tous les détails.",
  "Décris ta dernière fois : la marque laissée sur ta peau ? Tous les détails.",
  "Décris ta dernière fois : ce que vous avez regardé pendant ? Tous les détails.",
  "Décris ta dernière fois : la chose que tu as mangée après ? Tous les détails.",
  "Décris ta dernière fois : le message envoyé juste après ? Tous les détails.",
  "Décris ta dernière fois : la douche de fin : courte ou interminable ? Tous les détails.",
  "Décris ta dernière fois : le rêve que tu as fait après ? Tous les détails.",
  "Décris ta dernière fois : la première chose que tu as dite au réveil ? Tous les détails.",
  "Décris ta dernière fois : la chose que tu n'as pas osé demander ? Tous les détails.",
  "Décris ta dernière fois : l'endroit exact de la pièce où ça a commencé ? Tous les détails.",
  "Décris ta dernière fois : la tenue au départ et son état à la fin ? Tous les détails.",
  "Décris ta dernière fois : le bruit du lit et des voisins ? Tous les détails.",
  "Décris ta dernière fois : la faute de goût de la nuit (musique, lumière, odeur) ? Tous les détails.",
  "Décris ta dernière fois : le geste que tu as repris la fois suivante ? Tous les détails.",
  "Décris ta dernière fois : le secret que tu as gardé de cette nuit ? Tous les détails.",
  "Décris ta dernière fois : la phrase de départ et la phrase de fin ? Tous les détails.",
  "Décris ta dernière fois : ce que tu as pensé à ce moment précis ? Tous les détails.",
  "Décris ta dernière fois : la chose que tu voudrais refaire tout de suite ? Tous les détails.",
  "Décris ta dernière fois : le niveau sur 10 et pourquoi ? Tous les détails.",
  "Décris ta dernière fois : la photo prise pendant ou après ? Tous les détails.",
  "Décris ta dernière fois : le fou rire du milieu de la nuit ? Tous les détails.",
  "Décris ta dernière fois : la chute ou le crash comique de la nuit ? Tous les détails.",
  "Décris ta dernière fois : le temps avant de vous rendormir ? Tous les détails.",
  "Décris ta dernière fois : le réveil : collage ou fuite rapide ? Tous les détails.",
  "Décris ta dernière fois : le déjeuner du lendemain ensemble ou pas ? Tous les détails.",
  "Décris ta dernière fois : le nom que tu as évité de prononcer ? Tous les détails.",
  "Décris ta dernière fois : la main qui a tremblé à un moment ? Tous les détails.",
  "Décris ta dernière fois : le mot « encore » : dit combien de fois ? Tous les détails.",
  "As-tu déjà couché avec quelqu'un du cercle d'amis ? Détaille tout.",
  "As-tu déjà couché avec un(e) voisin(e) toujours visible aujourd'hui ? Détaille tout.",
  "As-tu déjà fini dans les bras d'un(e) inconnu(e) après une dispute ? Détaille tout.",
  "As-tu déjà essayé une position trouvée sur Internet ? Détaille tout.",
  "As-tu déjà testé le bandana sur les yeux ? Détaille tout.",
  "As-tu déjà testé les poignets tenus fermement ? Détaille tout.",
  "As-tu déjà mordu(e) quelqu'un jusqu'à la marque ? Détaille tout.",
  "As-tu déjà crié le mauvais prénom ? Détaille tout.",
  "As-tu déjà pleuré pendant l'action (de plaisir ou pas) ? Détaille tout.",
  "As-tu déjà ri aux éclats en pleine action ? Détaille tout.",
  "As-tu déjà arrêté(e) en plein milieu par un appel de tes parents ? Détaille tout.",
  "As-tu déjà couché avec un(e) ami(e) qui veut plus après ? Détaille tout.",
  "As-tu déjà couché avec un(e) ex deux fois le même week-end ? Détaille tout.",
  "As-tu déjà eu un plan dans un lieu religieux ou à côté ? Détaille tout.",
  "As-tu déjà eu un plan juste après le mariage d'un(e) autre ? Détaille tout.",
  "As-tu déjà couché avec quelqu'un pendant qu'il pleuvait très fort ? Détaille tout.",
  "As-tu déjà été démasqué(e) par un(e) voisin(e) bavard(e) ? Détaille tout.",
  "As-tu déjà couché pendant qu'une série jouait à côté ? Détaille tout.",
  "As-tu déjà reçu la visite d'un(e) voisin(e) à cause du bruit ? Détaille tout.",
  "As-tu déjà couché dans une voiture en mouvement (conducteur arrêté) ? Détaille tout.",
  "As-tu déjà couché avec quelqu'un qui ronflait juste après ? Détaille tout.",
  "As-tu déjà couché avec la lumière du téléphone qui restait allumée ? Détaille tout.",
  "As-tu déjà couché avec quelqu'un qui parlait de son ex ? Détaille tout.",
  "As-tu déjà couché avec une playlist honteuse ? Détaille tout.",
  "As-tu déjà couché avec quelqu'un de très bavard ? Détaille tout.",
  "As-tu déjà couché avec quelqu'un qui a dormi tout de suite ? Détaille tout.",
  "As-tu déjà couché sur le sol car le lit était trop petit ? Détaille tout.",
  "As-tu déjà couché dans une chambre avec un bébé qui dormait ? Détaille tout.",
  "As-tu déjà couché pendant que la nourriture brûlait ? Détaille tout.",
  "As-tu déjà couché avec quelqu'un qui photographiait (avec accord) ? Détaille tout.",
  "As-tu déjà couché avec quelqu'un qui a laissé des traces rouges partout ? Détaille tout.",
  "As-tu déjà couché avec quelqu'un qui a brisé quelque chose ? Détaille tout.",
  "As-tu déjà couché avec quelqu'un qui a répété « pardonne-moi » après ? Détaille tout.",
  "As-tu déjà couché avec quelqu'un qui a parlé de mariage ? Détaille tout.",
  "As-tu déjà couché avec quelqu'un qui a pleuré après ? Détaille tout.",
  "As-tu déjà couché avec quelqu'un qui a filé à l'aube ? Détaille tout.",
  "As-tu déjà couché avec quelqu'un qui a téléphoné à sa mère dans le dos ? Détaille tout.",
  "As-tu déjà couché avec quelqu'un qui a demandé un score sur 10 ? Détaille tout.",
  "As-tu déjà couché avec quelqu'un qui a gardé ses chaussettes et son bonnet ? Détaille tout.",
  "As-tu déjà couché avec quelqu'un qui a mis 20 minutes à trouver la porte ? Détaille tout.",
  "Qu'est-ce qui t'excite le plus : un baiser dans le cou ou dans le dos ? Décris précisément.",
  "Qu'est-ce qui t'excite le plus : les mains qui descendent ou les mains qui montent ? Décris précisément.",
  "Qu'est-ce qui t'excite le plus : une voix grave ou une voix douce ? Décris précisément.",
  "Qu'est-ce qui t'excite le plus : les mots sales à l'oreille ou les regards longs ? Décris précisément.",
  "Qu'est-ce qui t'excite le plus : être dominé(e) ou dominer ? Décris précisément.",
  "Qu'est-ce qui t'excite le plus : le début des préliminaires ou le moment final ? Décris précisément.",
  "Qu'est-ce qui t'excite le plus : la lumière qui reste ou la nuit totale ? Décris précisément.",
  "Qu'est-ce qui t'excite le plus : un bisou lent ou une morsure rapide ? Décris précisément.",
  "Qu'est-ce qui t'excite le plus : le souffle dans l'oreille ou sur le cou ? Décris précisément.",
  "Qu'est-ce qui t'excite le plus : les griffures légères ou les pressions fortes ? Décris précisément.",
  "Qu'est-ce qui t'excite le plus : la peau douce ou les mains rugueuses ? Décris précisément.",
  "Qu'est-ce qui t'excite le plus : les vêtements qui craquent ou le silence ? Décris précisément.",
  "Qu'est-ce qui t'excite le plus : le nom murmuré ou le mot « encore » ? Décris précisément.",
  "Qu'est-ce qui t'excite le plus : le danger d'être surpris(e) ou le confort total ? Décris précisément.",
  "Qu'est-ce qui t'excite le plus : l'odeur du parfum ou l'odeur de la peau ? Décris précisément.",
  "Qu'est-ce qui t'excite le plus : le sourire au milieu ou les yeux fermés ? Décris précisément.",
  "Qu'est-ce qui t'excite le plus : la vitesse lente ou la vitesse montée ? Décris précisément.",
  "Qu'est-ce qui t'excite le plus : la nuit entière ou l'heure rapide du matin ? Décris précisément.",
  "Qu'est-ce qui t'excite le plus : les préliminaires à la bouche ou aux mains ? Décris précisément.",
  "Qu'est-ce qui t'excite le plus : le teasing long ou l'action directe ? Décris précisément.",
  "Qu'est-ce qui t'excite le plus : les jambes qui tremblent ou le souffle coupé ? Décris précisément.",
  "Qu'est-ce qui t'excite le plus : la marque sur la peau ou le souvenir dans la tête ? Décris précisément.",
  "Qu'est-ce qui t'excite le plus : la douche avant ou la douche à deux ? Décris précisément.",
  "Qu'est-ce qui t'excite le plus : le lit douillet ou le lieu interdit ? Décris précisément.",
  "Qu'est-ce qui t'excite le plus : le réveil en pleine nuit ou le réveil du matin ? Décris précisément.",
  "Qu'est-ce qui t'excite le plus : le taxi collé-collé ou le canapé seul au monde ? Décris précisément.",
  "Qu'est-ce qui t'excite le plus : la robe qui glisse ou la chemise ouverte ? Décris précisément.",
  "Qu'est-ce qui t'excite le plus : les mains dans les cheveux ou les mains sur la taille ? Décris précisément.",
  "Qu'est-ce qui t'excite le plus : le mot doux public ou le mot sale privé ? Décris précisément.",
  "Qu'est-ce qui t'excite le plus : le control parfait ou le chaos total ? Décris précisément.",
  "Le groupe exige : le chiffre exact de personnes avec qui tu as couché. Réponds sans contourner.",
  "Le groupe exige : ton record de fois en une nuit. Réponds sans contourner.",
  "Le groupe exige : la durée exacte de ta plus longue nuit. Réponds sans contourner.",
  "Le groupe exige : la durée de ta plus courte aventure. Réponds sans contourner.",
  "Le groupe exige : l'heure la plus tardive où tu as écrit pour un plan. Réponds sans contourner.",
  "Le groupe exige : le nombre de nudes actuellement dans ton téléphone. Réponds sans contourner.",
  "Le groupe exige : le nombre de personnes d'ici que tu as déjà imaginées au lit. Réponds sans contourner.",
  "Le groupe exige : le nombre de positions que tu maîtrises vraiment. Réponds sans contourner.",
  "Le groupe exige : le nombre de personnes qui t'ont déjà fait perdre le contrôle. Réponds sans contourner.",
  "Le groupe exige : le nombre d'organes... non : le nombre de lieux différents où tu as fait l'amour. Réponds sans contourner.",
  "Le groupe exige : le nombre de fois où tu as simulé (estimation honnête). Réponds sans contourner.",
  "Le groupe exige : le nombre de douches à deux de ta vie. Réponds sans contourner.",
  "Le groupe exige : le nombre de marques laissées ou reçues. Réponds sans contourner.",
  "Le groupe exige : le nombre de plans qui ont fini en fuite à l'aube. Réponds sans contourner.",
  "Le groupe exige : le nombre de fois où tu as crié le mauvais nom. Réponds sans contourner.",
  "Le groupe exige : le nombre de fois où tu as dit oui sans envie. Réponds sans contourner.",
  "Le groupe exige : le nombre de plans conclus par un simple « ok » à 2 h du matin. Réponds sans contourner.",
  "Le groupe exige : le nombre de soirs où tu as pensé à quelqu'un d'ici. Réponds sans contourner.",
  "Le groupe exige : le nombre de messages chauds envoyés cette semaine. Réponds sans contourner.",
  "Le groupe exige : le nombre de vidéos X regardées ce mois-ci. Réponds sans contourner.",
  "Le groupe exige : le nombre de jouets ou d'accessoires chez toi. Réponds sans contourner.",
  "Le groupe exige : le nombre de nuits blanches à cause de quelqu'un. Réponds sans contourner.",
  "Le groupe exige : le nombre d'histoires que tes amis connaissent déjà sur toi. Réponds sans contourner.",
  "Le groupe exige : le nombre de fois où tu as été presque surpris(e). Réponds sans contourner.",
  "Le groupe exige : le nombre de fois où tu as repensé à une nuit en te douchant. Réponds sans contourner.",
  "Le groupe exige : le nombre de personnes qui t'ont demandé un plan cette année. Réponds sans contourner.",
  "Le groupe exige : le nombre de fois où tu as pleuré de plaisir. Réponds sans contourner.",
  "Le groupe exige : le nombre de fois où tu as ris en pleine action. Réponds sans contourner.",
  "Le groupe exige : le nombre de tenues « spéciales nuit » dans ton placard. Réponds sans contourner.",
  "Le groupe exige : le nombre de bougies ou de lampes d'ambiance chez toi. Réponds sans contourner.",
  "Ta confession la plus crue sur : ton fantasme le plus précis. Le groupe ferme les yeux.",
  "Ta confession la plus crue sur : ta pire envie jamais réprimée. Le groupe ferme les yeux.",
  "Ta confession la plus crue sur : la chose que tu as faite sans le dire à personne. Le groupe ferme les yeux.",
  "Ta confession la plus crue sur : le lieu interdit où tu as éprouvé une envie. Le groupe ferme les yeux.",
  "Ta confession la plus crue sur : le contenu de ta dernière recherche X. Le groupe ferme les yeux.",
  "Ta confession la plus crue sur : la personne la plus inattendue dans tes rêves. Le groupe ferme les yeux.",
  "Ta confession la plus crue sur : ton plus grand mensonge au lit. Le groupe ferme les yeux.",
  "Ta confession la plus crue sur : la chose que tu voudrais qu'on te fasse ce soir. Le groupe ferme les yeux.",
  "Ta confession la plus crue sur : la chose que tu voudrais faire à quelqu'un d'ici. Le groupe ferme les yeux.",
  "Ta confession la plus crue sur : ton plus grand raté sexuel jamais caché. Le groupe ferme les yeux.",
  "Ta confession la plus crue sur : la phrase que tu as dite uniquement pour exciter. Le groupe ferme les yeux.",
  "Ta confession la plus crue sur : ton odeur préférée sur une peau. Le groupe ferme les yeux.",
  "Ta confession la plus crue sur : tonRecord de messages chauds en une nuit. Le groupe ferme les yeux.",
  "Ta confession la plus crue sur : la partie de ton corps la plus réactive. Le groupe ferme les yeux.",
  "Ta confession la plus crue sur : la première image qui te vient quand tu fermes les yeux. Le groupe ferme les yeux.",
  "Ta confession la plus crue sur : la chose que tu as cachée à tes amis le lendemain. Le groupe ferme les yeux.",
  "Ta confession la plus crue sur : le plan dont tu es le plus fier/fière. Le groupe ferme les yeux.",
  "Ta confession la plus crue sur : le plan dont tu as le plus honte. Le groupe ferme les yeux.",
  "Ta confession la plus crue sur : la nuit que tu refais en boucle dans ta tête. Le groupe ferme les yeux.",
  "Ta confession la plus crue sur : le geste que tu répètes seul(e) et que tu ne dévoiles jamais. Le groupe ferme les yeux.",
  "Ta confession la plus crue sur : la chose que tu as volée comme souvenir d'une nuit. Le groupe ferme les yeux.",
  "Ta confession la plus crue sur : la promesse que tu as faite sans jamais la tenir. Le groupe ferme les yeux.",
  "Ta confession la plus crue sur : le prénom que tu as murmuré sans le vouloir. Le groupe ferme les yeux.",
  "Ta confession la plus crue sur : l'excuse bidon pour quitter le lit à l'aube. Le groupe ferme les yeux.",
  "Ta confession la plus crue sur : la chose la plus sale dite par texto. Le groupe ferme les yeux.",
  "Ta confession la plus crue sur : la photo jamais montrée que tu gardes depuis longtemps. Le groupe ferme les yeux.",
  "Ta confession la plus crue sur : le lieu public où tu as eu la plus grosse envie. Le groupe ferme les yeux.",
  "Ta confession la plus crue sur : la chose que tu as cassée en pleine action. Le groupe ferme les yeux.",
  "Ta confession la plus crue sur : le bruit que tu as fait sans le vouloir. Le groupe ferme les yeux.",
  "Ta confession la plus crue sur : la confesse que tu n'as jamais faite à ton/ta partenaire. Le groupe ferme les yeux.",
  "Ton avis franc et direct sur : les plans à trois. Une phrase claire.",
  "Ton avis franc et direct sur : les échanges de partenaires. Une phrase claire.",
  "Ton avis franc et direct sur : la fessée. Une phrase claire.",
  "Ton avis franc et direct sur : les menottes. Une phrase claire.",
  "Ton avis franc et direct sur : le bandeau sur les yeux. Une phrase claire.",
  "Ton avis franc et direct sur : les sextoys en couple. Une phrase claire.",
  "Ton avis franc et direct sur : la filme de ses nuits (avec accord). Une phrase claire.",
  "Ton avis franc et direct sur : les relations ouvertes. Une phrase claire.",
  "Ton avis franc et direct sur : coucher au premier rendez-vous. Une phrase claire.",
  "Ton avis franc et direct sur : les plans qui deviennent amour. Une phrase claire.",
  "Ton avis franc et direct sur : les massages nus. Une phrase claire.",
  "Ton avis franc et direct sur : la douche à deux. Une phrase claire.",
  "Ton avis franc et direct sur : les marques sur la peau. Une phrase claire.",
  "Ton avis franc et direct sur : les mots sales à voix haute. Une phrase claire.",
  "Ton avis franc et direct sur : les vocaux chauds. Une phrase claire.",
  "Ton avis franc et direct sur : les sextos le matin. Une phrase claire.",
  "Ton avis franc et direct sur : le sexe sans conversation après. Une phrase claire.",
  "Ton avis franc et direct sur : le silence total pendant l'action. Une phrase claire.",
  "Ton avis franc et direct sur : la musique forte pendant. Une phrase claire.",
  "Ton avis franc et direct sur : la lumière rouge. Une phrase claire.",
  "Ton avis franc et direct sur : les tenues (lingerie, déguisement). Une phrase claire.",
  "Ton avis franc et direct sur : les talons au lit. Une phrase claire.",
  "Ton avis franc et direct sur : les jeux de rôle au lit. Une phrase claire.",
  "Ton avis franc et direct sur : les rôles inversés (domination). Une phrase claire.",
  "Ton avis franc et direct sur : le sexe en pleine nature. Une phrase claire.",
  "Ton avis franc et direct sur : le sexe en vacances avec un(e) inconnu(e). Une phrase claire.",
  "Ton avis franc et direct sur : les rappels à 2 h du matin. Une phrase claire.",
  "Ton avis franc et direct sur : les douches qui durent 30 minutes. Une phrase claire.",
  "Ton avis franc et direct sur : les câlins sans suite. Une phrase claire.",
  "Ton avis franc et direct sur : les promesses de minuit. Une phrase claire.",
  "Tu recommencerais avec les poignets tenus ? Pourquoi ?",
  "C'est quoi ton meilleur souvenir avec les croisées de la salle de sport ?",
  "As-tu déjà testé les serveurs et serveuses trop beaux ? Raconte.",
  "les hôtels où l'on revient : oui, non, ou tu rêves ?",
  "Qu'est-ce qui change avec les bureaux après les heures selon la personne ?",
  "C'est quoi ton avis sur les chutes du lit ? Sois honnête.",
  "C'est quoi ton meilleur souvenir avec les huiles de massage ?",
  "Qu'est-ce qui change avec les miroirs au plafond selon la personne ?",
  "As-tu déjà testé les cabines de plage ? Raconte.",
  "Ton record avec les bains de minuit ? Le groupe demande le chiffre.",
  "Ton record avec les tentes qui bougent ? Le groupe demande le chiffre.",
  "Tu recommencerais avec les lendemains sans prénom ? Pourquoi ?",
  "As-tu déjà testé les douches à trois températures ? Raconte.",
  "Tu recommencerais avec les buanderies improvisées ? Pourquoi ?",
  "les voitures embuées : oui, non, ou tu rêves ?",
  "Ton record avec les voisins curieux ? Le groupe demande le chiffre.",
  "Ton pire souvenir avec les cris étouffés ? Raconte.",
  "Ton record avec les cabines de plage ? Le groupe demande le chiffre.",
  "C'est quoi ton avis sur les liens en soie ? Sois honnête.",
  "Qu'est-ce qui change avec les promesses de 4 h du matin selon la personne ?",
  "Ton record avec les morsures qui marquent ? Le groupe demande le chiffre.",
  "C'est quoi ton meilleur souvenir avec les glaçons qui fondent ?",
  "C'est quoi ton meilleur souvenir avec les salles de réunion vides ?",
  "C'est quoi ton avis sur les douches à trois températures ? Sois honnête.",
  "C'est quoi ton avis sur les amis avec avantages ? Sois honnête.",
  "les cris étouffés : oui, non, ou tu rêves ?",
  "C'est quoi ton avis sur les piscines nocturnes ? Sois honnête.",
  "C'est quoi ton meilleur souvenir avec les appels interrompus ?",
  "Tu recommencerais avec les serveurs et serveuses trop beaux ? Pourquoi ?",
  "les huiles de massage : oui, non, ou tu rêves ?",
  "les poignets tenus : oui, non, ou tu rêves ?",
  "Tu recommencerais avec les tentes qui bougent ? Pourquoi ?",
  "C'est quoi ton meilleur souvenir avec les griffures dans le dos ?",
  "les serveurs et serveuses trop beaux : oui, non, ou tu rêves ?",
  "As-tu déjà testé les griffures dans le dos ? Raconte.",
  "C'est quoi ton avis sur les messages à 3 h du matin ? Sois honnête.",
  "Qu'est-ce qui change avec les griffures dans le dos selon la personne ?",
  "Ton pire souvenir avec les salles de réunion vides ? Raconte.",
  "Qu'est-ce qui change avec les bains de minuit selon la personne ?",
  "les piscines nocturnes : oui, non, ou tu rêves ?",
  "Tu recommencerais avec les orgasmes simulés ? Pourquoi ?",
  "Tu recommencerais avec les appels interrompus ? Pourquoi ?",
  "Ton pire souvenir avec les messages à 3 h du matin ? Raconte.",
  "Ton pire souvenir avec les promesses de 4 h du matin ? Raconte.",
  "Qu'est-ce qui change avec les buanderies improvisées selon la personne ?",
  "les messages à 3 h du matin : oui, non, ou tu rêves ?",
  "Ton record avec les marques sur la nuque ? Le groupe demande le chiffre.",
  "C'est quoi ton meilleur souvenir avec les liens en soie ?",
  "les collègues trop proches : oui, non, ou tu rêves ?",
  "Ton record avec les collègues trop proches ? Le groupe demande le chiffre.",
  "Ton pire souvenir avec les ascenseurs bloqués ? Raconte.",
  "Tu recommencerais avec les croisées de la salle de sport ? Pourquoi ?",
  "Tu recommencerais avec les records battus ? Pourquoi ?",
  "Qu'est-ce qui change avec les morsures qui marquent selon la personne ?",
  "Ton record avec les soirées qui dégénèrent ? Le groupe demande le chiffre.",
  "Tu recommencerais avec les messages à 3 h du matin ? Pourquoi ?",
  "C'est quoi ton meilleur souvenir avec les cabines de plage ?",
  "Ton pire souvenir avec les garages bruyants ? Raconte.",
  "Ton pire souvenir avec les goûts qui surprennent ? Raconte.",
  "Qu'est-ce qui change avec les collègues trop proches selon la personne ?",
  "Qu'est-ce qui change avec les lits qui craquent selon la personne ?",
  "Qu'est-ce qui change avec les jambes qui lâchent selon la personne ?",
  "les cages d'escalier : oui, non, ou tu rêves ?",
  "les terrasses à minuit : oui, non, ou tu rêves ?",
  "C'est quoi ton avis sur les promesses de 4 h du matin ? Sois honnête.",
  "As-tu déjà testé les chutes du lit ? Raconte.",
  "As-tu déjà testé les buanderies improvisées ? Raconte.",
  "C'est quoi ton meilleur souvenir avec les buanderies improvisées ?",
  "Ton record avec les serveurs et serveuses trop beaux ? Le groupe demande le chiffre.",
  "Qu'est-ce qui change avec les orgasmes simulés selon la personne ?",
  "Ton pire souvenir avec les positions acrobatiques ? Raconte.",
  "As-tu déjà testé les voitures embuées ? Raconte.",
  "les cabines de plage : oui, non, ou tu rêves ?",
  "As-tu déjà testé les gémissements forts ? Raconte.",
  "Ton pire souvenir avec les soirées qui dégénèrent ? Raconte.",
  "Ton record avec les miroirs au plafond ? Le groupe demande le chiffre.",
  "Qu'est-ce qui change avec les records battus selon la personne ?",
  "Qu'est-ce qui change avec les garages bruyants selon la personne ?",
  "As-tu déjà testé les défis d'endurance ? Raconte.",
  "Qu'est-ce qui change avec les amis avec avantages selon la personne ?",
  "As-tu déjà testé les salles de réunion vides ? Raconte.",
  "Tu recommencerais avec les odeurs intimes ? Pourquoi ?",
  "Ton record avec les hôtels où l'on revient ? Le groupe demande le chiffre.",
  "Qu'est-ce qui change avec les terrasses à minuit selon la personne ?",
  "Ton record avec les croisées de la salle de sport ? Le groupe demande le chiffre.",
  "C'est quoi ton meilleur souvenir avec les cheveux tirés (gentiment) ?",
  "As-tu déjà testé les odeurs intimes ? Raconte.",
  "Ton pire souvenir avec les liens en soie ? Raconte.",
  "les salles de réunion vides : oui, non, ou tu rêves ?",
  "C'est quoi ton meilleur souvenir avec les ascenseurs bloqués ?",
  "C'est quoi ton avis sur les morsures qui marquent ? Sois honnête.",
  "Qu'est-ce qui change avec les gémissements forts selon la personne ?",
  "les douches à trois températures : oui, non, ou tu rêves ?",
  "As-tu déjà testé les piscines nocturnes ? Raconte.",
  "Tu recommencerais avec les bains de minuit ? Pourquoi ?",
  "les lendemains sans prénom : oui, non, ou tu rêves ?",
  "Ton record avec les garages bruyants ? Le groupe demande le chiffre.",
  "les tentes qui bougent : oui, non, ou tu rêves ?",
  "C'est quoi ton avis sur les poignets tenus ? Sois honnête.",
  "les positions acrobatiques : oui, non, ou tu rêves ?",
  "les chutes du lit : oui, non, ou tu rêves ?",
  "C'est quoi ton avis sur les bandeaux serrés ? Sois honnête.",
  "Ton record avec les lits qui craquent ? Le groupe demande le chiffre.",
  "Ton pire souvenir avec les odeurs intimes ? Raconte.",
  "Qu'est-ce qui change avec les salles de réunion vides selon la personne ?",
  "Tu recommencerais avec les essais trouvés sur Internet ? Pourquoi ?",
  "C'est quoi ton avis sur les voisins curieux ? Sois honnête.",
  "C'est quoi ton avis sur les ordres doux ? Sois honnête.",
  "Qu'est-ce qui change avec les liens en soie selon la personne ?",
  "Qu'est-ce qui change avec les voitures embuées selon la personne ?",
  "les odeurs intimes : oui, non, ou tu rêves ?",
  "Ton record avec les amis avec avantages ? Le groupe demande le chiffre.",
  "As-tu déjà testé les amis avec avantages ? Raconte.",
  "Ton record avec les salles de réunion vides ? Le groupe demande le chiffre.",
  "Ton record avec les buanderies improvisées ? Le groupe demande le chiffre.",
  "Ton pire souvenir avec les hôtels où l'on revient ? Raconte.",
  "Qu'est-ce qui change avec les ascenseurs bloqués selon la personne ?",
  "Qu'est-ce qui change avec les voisins curieux selon la personne ?",
  "Ton pire souvenir avec les appels interrompus ? Raconte.",
  "C'est quoi ton meilleur souvenir avec les amis avec avantages ?",
  "les plans express : oui, non, ou tu rêves ?",
  "As-tu déjà testé les lits qui craquent ? Raconte.",
  "As-tu déjà testé les promesses de 4 h du matin ? Raconte.",
  "As-tu déjà testé les morsures qui marquent ? Raconte.",
  "Ton pire souvenir avec les orgasmes simulés ? Raconte.",
  "Ton pire souvenir avec les cheveux tirés (gentiment) ? Raconte.",
  "les jambes qui lâchent : oui, non, ou tu rêves ?",
  "Tu recommencerais avec les marques sur la nuque ? Pourquoi ?",
  "As-tu déjà testé les liens en soie ? Raconte.",
  "C'est quoi ton avis sur les griffures dans le dos ? Sois honnête.",
  "Tu recommencerais avec les nuits à 4 rounds ? Pourquoi ?",
  "Tu recommencerais avec les douches à trois températures ? Pourquoi ?",
  "Ton record avec les essais trouvés sur Internet ? Le groupe demande le chiffre.",
  "Qu'est-ce qui change avec les glaçons qui fondent selon la personne ?",
  "C'est quoi ton meilleur souvenir avec les marques sur la nuque ?",
  "C'est quoi ton avis sur les gémissements forts ? Sois honnête.",
  "Tu recommencerais avec les liens en soie ? Pourquoi ?",
  "Tu recommencerais avec les amis avec avantages ? Pourquoi ?",
  "As-tu déjà testé les bureaux après les heures ? Raconte.",
  "C'est quoi ton avis sur les goûts qui surprennent ? Sois honnête.",
  "C'est quoi ton avis sur les odeurs intimes ? Sois honnête.",
  "les bureaux après les heures : oui, non, ou tu rêves ?",
  "Ton record avec les piscines nocturnes ? Le groupe demande le chiffre.",
  "les lits qui craquent : oui, non, ou tu rêves ?",
  "Ton record avec les ascenseurs bloqués ? Le groupe demande le chiffre.",
  "C'est quoi ton avis sur les croisées de la salle de sport ? Sois honnête.",
  "Ton record avec les nuits à 4 rounds ? Le groupe demande le chiffre.",
  "C'est quoi ton meilleur souvenir avec les bureaux après les heures ?",
  "C'est quoi ton avis sur les lits qui craquent ? Sois honnête.",
  "As-tu déjà testé les huiles de massage ? Raconte.",
  "Ton pire souvenir avec les tentes qui bougent ? Raconte.",
  "Qu'est-ce qui change avec les poignets tenus selon la personne ?",
  "les orgasmes simulés : oui, non, ou tu rêves ?",
  "C'est quoi ton meilleur souvenir avec les soirées qui dégénèrent ?",
  "C'est quoi ton avis sur les hôtels où l'on revient ? Sois honnête.",
  "Qu'est-ce qui change avec les ex de retour pour une nuit selon la personne ?",
  "C'est quoi ton avis sur les terrasses à minuit ? Sois honnête.",
  "les bandeaux serrés : oui, non, ou tu rêves ?",
  "Ton record avec les cages d'escalier ? Le groupe demande le chiffre.",
  "C'est quoi ton meilleur souvenir avec les jambes qui lâchent ?",
  "As-tu déjà testé les poignets tenus ? Raconte.",
  "Tu recommencerais avec les positions acrobatiques ? Pourquoi ?",
  "C'est quoi ton meilleur souvenir avec les cages d'escalier ?",
  "C'est quoi ton avis sur les tentes qui bougent ? Sois honnête.",
  "C'est quoi ton meilleur souvenir avec les terrasses à minuit ?",
  "les miroirs au plafond : oui, non, ou tu rêves ?",
  "Qu'est-ce qui change avec les nuits à 4 rounds selon la personne ?",
  "As-tu déjà testé les bandeaux serrés ? Raconte.",
  "Ton record avec les appels interrompus ? Le groupe demande le chiffre.",
  "Qu'est-ce qui change avec les douches à trois températures selon la personne ?",
  "C'est quoi ton avis sur les marques sur la nuque ? Sois honnête.",
  "Tu recommencerais avec les voitures embuées ? Pourquoi ?",
  "C'est quoi ton avis sur les records battus ? Sois honnête.",
  "Qu'est-ce qui change avec les soirées qui dégénèrent selon la personne ?",
  "As-tu déjà testé les tentes qui bougent ? Raconte.",
  "C'est quoi ton meilleur souvenir avec les goûts qui surprennent ?",
  "As-tu déjà testé les records battus ? Raconte.",
  "C'est quoi ton meilleur souvenir avec les voisins curieux ?",
  "C'est quoi ton meilleur souvenir avec les poignets tenus ?",
  "Ton record avec les glaçons qui fondent ? Le groupe demande le chiffre.",
  "C'est quoi ton meilleur souvenir avec les chutes du lit ?",
  "Tu recommencerais avec les miroirs au plafond ? Pourquoi ?",
  "Qu'est-ce qui change avec les plans express selon la personne ?",
  "C'est quoi ton meilleur souvenir avec les positions acrobatiques ?",
  "C'est quoi ton meilleur souvenir avec les défis d'endurance ?",
  "Qu'est-ce qui change avec les cris étouffés selon la personne ?",
  "C'est quoi ton avis sur les lendemains sans prénom ? Sois honnête.",
  "As-tu déjà testé les messages à 3 h du matin ? Raconte.",
  "C'est quoi ton meilleur souvenir avec les tentes qui bougent ?",
  "Ton pire souvenir avec les records battus ? Raconte.",
  "Qu'est-ce qui change avec les piscines nocturnes selon la personne ?",
  "Qu'est-ce qui change avec les huiles de massage selon la personne ?",
  "As-tu déjà testé les appels interrompus ? Raconte.",
  "As-tu déjà testé les ex de retour pour une nuit ? Raconte.",
  "C'est quoi ton meilleur souvenir avec les records battus ?",
  "Qu'est-ce qui change avec les cheveux tirés (gentiment) selon la personne ?",
  "Tu recommencerais avec les salles de réunion vides ? Pourquoi ?",
  "Tu recommencerais avec les glaçons qui fondent ? Pourquoi ?",
  "Qu'est-ce qui change avec les cabines de plage selon la personne ?",
  "As-tu déjà testé les soirées qui dégénèrent ? Raconte.",
  "C'est quoi ton avis sur les nuits à 4 rounds ? Sois honnête.",
  "Qu'est-ce qui change avec les essais trouvés sur Internet selon la personne ?",
  "C'est quoi ton avis sur les ex de retour pour une nuit ? Sois honnête.",
  "As-tu déjà testé les bains de minuit ? Raconte.",
  "C'est quoi ton avis sur les serveurs et serveuses trop beaux ? Sois honnête.",
  "Tu recommencerais avec les collègues trop proches ? Pourquoi ?",
  "As-tu déjà testé les voisins curieux ? Raconte.",
  "Qu'est-ce qui change avec les positions acrobatiques selon la personne ?",
  "Tu recommencerais avec les ordres doux ? Pourquoi ?",
  "C'est quoi ton meilleur souvenir avec les ordres doux ?",
  "Tu recommencerais avec les griffures dans le dos ? Pourquoi ?",
  "Tu recommencerais avec les jambes qui lâchent ? Pourquoi ?",
  "Ton pire souvenir avec les poignets tenus ? Raconte.",
  "les essais trouvés sur Internet : oui, non, ou tu rêves ?",
  "Ton record avec les cris étouffés ? Le groupe demande le chiffre.",
  "Qu'est-ce qui change avec les goûts qui surprennent selon la personne ?",
  "C'est quoi ton avis sur les collègues trop proches ? Sois honnête.",
  "C'est quoi ton avis sur les jambes qui lâchent ? Sois honnête.",
  "Tu recommencerais avec les terrasses à minuit ? Pourquoi ?",
  "C'est quoi ton meilleur souvenir avec les morsures qui marquent ?",
  "As-tu déjà testé les hôtels où l'on revient ? Raconte.",
  "les nuits à 4 rounds : oui, non, ou tu rêves ?",
  "les garages bruyants : oui, non, ou tu rêves ?",
  "Ton pire souvenir avec les serveurs et serveuses trop beaux ? Raconte.",
  "C'est quoi ton avis sur les appels interrompus ? Sois honnête.",
  "As-tu déjà testé les lendemains sans prénom ? Raconte.",
  "Tu recommencerais avec les soirées qui dégénèrent ? Pourquoi ?",
  "Tu recommencerais avec les cris étouffés ? Pourquoi ?",
  "As-tu déjà testé les jambes qui lâchent ? Raconte.",
  "Tu recommencerais avec les chutes du lit ? Pourquoi ?",
  "Ton record avec les ordres doux ? Le groupe demande le chiffre.",
  "Tu recommencerais avec les lits qui craquent ? Pourquoi ?"
],
    action: [
  "Envoie un audio « chaud » de 15 secondes à la personne que le groupe choisit.",
  "Envoie le sexto que tu n'as jamais osé écrire. Copie-le ici.",
  "Décris ce que tu ferais à la personne de ton choix ici, si elle était là.",
  "Fais 10 pompes... en sous-vêtements. Le groupe compte à voix haute.",
  "Gémis le prénom de la personne à ta droite comme dans un film. Deux fois.",
  "Envoie une photo de toi dans la tenue que tu portes VRAIMENT maintenant.",
  "Imite (voix + visage) ton orgasme... version cinéma muet.",
  "Fais un lap dance sur une chaise. Cam ouverte.",
  "Raconte ta meilleure nuit en la chantant.",
  "Déclare ton « plan de la nuit » à la personne désignée par le groupe.",
  "Strip-tease : enlève deux vêtements, lentement, sans rien montrer d'interdit.",
  "Décris ton dernier rapport à voix haute : début, milieu, fin. 30 secondes.",
  "Chuchote à la caméra le mot sale qui t'excite le plus. 3 fois.",
  "Mime la position que tu n'as jamais testée. Le groupe devine.",
  "Lèche ton doigt, touche ta lèvre en regardant la cam. 10 secondes. Silence total.",
  "Fais deviner ton niveau d'endurance en imitant ton souffle de fin.",
  "Décris la première image qui te vient quand tu fermes les yeux. Directement.",
  "Envoie un vocal où tu comptes de 10 à 1 avec une voix de plus en plus basse.",
  "Montre le dernier emoji que tu as envoyé à quelqu'un chaud et explique.",
  "Mime comment tu touches quelqu'un la première fois : lent, hésitant, puis sûr.",
  "Envoie un message vocal où tu répètes « je suis sage » de façon de moins en moins crédible.",
  "Imite la voix que tu fais quand tu demandes « encore ».",
  "Décris la tenue que tu enlèverais en premier chez la personne en face.",
  "Fais deviner ton fantasme avec 3 mots-indices. 2 essais pour le groupe.",
  "Mime un déshabillage qui tourne mal (comédie totale).",
  "Chuchote ton fantasme du moment comme si le groupe était ton amoureux secret.",
  "Envoie un vocal de rire qui finit en gémissement. Le groupe juge la transition.",
  "Décris ton rituel avant une nuit chaude, mimes compris.",
  "Mime ce que tu ferais si tu étais seul(e) ce soir. 20 secondes, sans gêne.",
  "Envoie ta routine de réveil version torride : 15 secondes de cam matinale.",
  "Fais un vocal en chuchotant comme si quelqu'un dormait juste à côté de toi.",
  "Prends la pose exacte de ta meilleure photo chaude. 10 secondes, immobile.",
  "Mime un baiser lent avec la main de quelqu'un d'ici (avec son accord).",
  "Décris ton menu de nuit : entrée, plat, dessert... version intime.",
  "Écris un sexto de 3 lignes ici. Le joueur à droite note sur 10.",
  "Raconte ta première fois en 5 mots exactement. Le groupe devine le reste.",
  "Montre comment tu embrasserais quelqu'un de plus grand que toi. Support : coussin.",
  "Imite ta démarche après une nuit parfaite. 15 secondes de satisfaction visible.",
  "Fais la promo d'un faux parfum nommé « Toi ce soir ». Slogan obligatoire.",
  "Laisse le groupe choisir un mot : dis-le de la manière la plus sensuelle possible.",
  "Fais deviner une zone de ton corps en la touchant. 3 essais pour le groupe.",
  "Mime ta plus grosse honte intime. Le groupe devine l'histoire complète.",
  "Décris ce que tu regardes en premier chez un corps nu. Sois précis.",
  "Envoie un vocal où tu répètes « là, tout de suite, maintenant » de 3 façons.",
  "Imite ta réaction si quelqu'un te surprenait dans un moment intime. Théâtre complet.",
  "Décris ton dernier baiser détaillé au millimètre. 20 secondes.",
  "Montre comment tu ôtes une robe ou une chemise de façon irrésistible (sur toi).",
  "Fais un commentaire sportif complet de ta dernière nuit. Score final autorisé.",
  "Mime le moment exact où tu perds le contrôle. 10 secondes.",
  "Chante le mot « encore » comme un refrain de mariage.",
  "Envoie un vocal où tu décris ce que tu ferais ce soir à la personne de ton choix, sans censure. 20 secondes maximum.",
  "Envoie un vocal où tu gémis de la manière la plus réaliste possible, le groupe note sur 10. 20 secondes maximum.",
  "Envoie un vocal où tu chuchotes le prénom d'un joueur comme au lit, 5 fois. 20 secondes maximum.",
  "Envoie un vocal où tu racontes ta dernière nuit en chuchotant à l'oreille de la caméra. 20 secondes maximum.",
  "Envoie un vocal où tu répètes « encore » en montant d'intensité à chaque fois. 20 secondes maximum.",
  "Envoie un vocal où tu imites ton souffle du moment exact avant la fin. 20 secondes maximum.",
  "Envoie un vocal où tu décris la tenue que tu portes en ce moment, ton la plus intime. 20 secondes maximum.",
  "Envoie un vocal où tu fais deviner ta position favorite uniquement par des sons. 20 secondes maximum.",
  "Envoie un vocal où tu imites la voix que tu fais quand tu demandes un service chaud. 20 secondes maximum.",
  "Envoie un vocal où tu racontes ce que tu regardes chez un corps, du haut vers le bas. 20 secondes maximum.",
  "Envoie un vocal où tu chuchotes un secret que tu n'as jamais dit à voix haute. 20 secondes maximum.",
  "Envoie un vocal où tu répètes « je suis à toi » de 3 façons différentes. 20 secondes maximum.",
  "Envoie un vocal où tu imites une soirée qui dégénère : rire, soupir, gémissement. 20 secondes maximum.",
  "Envoie un vocal où tu décris ton odeur de peau du moment comme une pub de parfum. 20 secondes maximum.",
  "Envoie un vocal où tu chantes un slow en remplaçant tous les mots par « toi ». 20 secondes maximum.",
  "Envoie un vocal où tu imites la dernière phrase que tu as dite après l'action. 20 secondes maximum.",
  "Envoie un vocal où tu racontes ta panne la plus honteuse en mode actualité télé. 20 secondes maximum.",
  "Envoie un vocal où tu décris les mains parfaites : où elles commencent, où elles finissent. 20 secondes maximum.",
  "Envoie un vocal où tu fais une météo du désir : « aujourd'hui, fortes envies sur la côte… ». 20 secondes maximum.",
  "Envoie un vocal où tu imites l'appel que tu ferais à 2 h du matin. 20 secondes maximum.",
  "Envoie un vocal où tu chuchotes « je ne devrais pas dire ça » puis dis-le quand même. 20 secondes maximum.",
  "Envoie un vocal où tu décris en 5 mots exactement ton niveau ce soir. 20 secondes maximum.",
  "Envoie un vocal où tu imites le répondeur de ton plan : « laisse un message après le bip ». 20 secondes maximum.",
  "Envoie un vocal où tu fais deviner un mot sale par ta seule intonation. 20 secondes maximum.",
  "Envoie un vocal où tu racontes ta dernière envie en pleine journée, où et avec qui. 20 secondes maximum.",
  "Envoie un vocal où tu chuchotes ta promesse de nuit comme un serment. 20 secondes maximum.",
  "Envoie un vocal où tu imites un slow radio en le transformant en déclaration directe. 20 secondes maximum.",
  "Envoie un vocal où tu décris le bruit parfait du lit, du mur et du voisin. 20 secondes maximum.",
  "Envoie un vocal où tu répètes « chut » comme si la maison était pleine. 20 secondes maximum.",
  "Envoie un vocal où tu fais l'annonce officielle de ton « talent caché » de la nuit. 20 secondes maximum.",
  "Envoie un vocal où tu imites ta réaction à un nude reçu : 3 sons, 3 étages. 20 secondes maximum.",
  "Envoie un vocal où tu décris la nuit parfaite en 20 secondes chrono, du début à la fin. 20 secondes maximum.",
  "Envoie un vocal où tu chuchotes ce que tu enlèverais en premier, puis en deuxième. 20 secondes maximum.",
  "Envoie un vocal où tu imites un commentateur de match pendant 10 secondes d'action. 20 secondes maximum.",
  "Envoie un vocal où tu racontes la nuit dont tes amis ne connaissent rien. 20 secondes maximum.",
  "Fais un lap dance complet sur une chaise. Cam ouverte, sans gêne. Le groupe juge.",
  "Fais un strip des deux vêtements choisis par le groupe (rien d'interdit à montrer). Cam ouverte, sans gêne. Le groupe juge.",
  "Fais le mime exact de ta position préférée. Cam ouverte, sans gêne. Le groupe juge.",
  "Fais le regard « viens » le plus profond de ta vie, 10 secondes. Cam ouverte, sans gêne. Le groupe juge.",
  "Fais le mime d'un baiser qui monte en intensité, 15 secondes. Cam ouverte, sans gêne. Le groupe juge.",
  "Fais la démonstration de ta main sur ta propre nuque puis ton épaule. Cam ouverte, sans gêne. Le groupe juge.",
  "Fais le mime de « presque » : t'arrêtes juste avant la morsure. Cam ouverte, sans gêne. Le groupe juge.",
  "Fais le miroir : ton imitation de toi-même qui se prépare pour une nuit. Cam ouverte, sans gêne. Le groupe juge.",
  "Fais la pose de ta plus belle photo chaude, 3 angles. Cam ouverte, sans gêne. Le groupe juge.",
  "Fais le soupir le plus réaliste après une longue nuit. Cam ouverte, sans gêne. Le groupe juge.",
  "Fais la marche du retour à l'aube : démarche complète. Cam ouverte, sans gêne. Le groupe juge.",
  "Fais le mime d'une main qui glisse sous une chemise (la tienne). Cam ouverte, sans gêne. Le groupe juge.",
  "Fais la démonstration de comment tu mordrais (sur ton poignet). Cam ouverte, sans gêne. Le groupe juge.",
  "Fais le silence : 10 secondes de regard qui dit tout. Cam ouverte, sans gêne. Le groupe juge.",
  "Fais le mime d'un bouton qu'on n'arrive pas à défaire, tension maximale. Cam ouverte, sans gêne. Le groupe juge.",
  "Fais la démonstration de ton massage signature (sur ton propre bras). Cam ouverte, sans gêne. Le groupe juge.",
  "Fais le miroir : le regard du lendemain matin, sourire inclus. Cam ouverte, sans gêne. Le groupe juge.",
  "Fais le mime du « chut » avec le doigt sur les lèvres, 10 secondes. Cam ouverte, sans gêne. Le groupe juge.",
  "Fais la démonstration du sourire qui excuse tout. Cam ouverte, sans gêne. Le groupe juge.",
  "Fais la pose de la personne qui attend dans le noir. Cam ouverte, sans gêne. Le groupe juge.",
  "Fais le mime du frisson quand on te souffle dans le cou. Cam ouverte, sans gêne. Le groupe juge.",
  "Fais la démonstration de comment tu montres ton accord sans un mot. Cam ouverte, sans gêne. Le groupe juge.",
  "Fais le regard qui monte puis qui descend : deux secondes chaque. Cam ouverte, sans gêne. Le groupe juge.",
  "Fais le mime du câlin qui ne veut pas lâcher, 15 secondes. Cam ouverte, sans gêne. Le groupe juge.",
  "Fais la démonstration de ta façon d'ouvrir une porte le soir. Cam ouverte, sans gêne. Le groupe juge.",
  "Fais le mime du téléphone posé en mode « ne me dérange plus ». Cam ouverte, sans gêne. Le groupe juge.",
  "Fais la démonstration de ta façon d'attendre contre un mur. Cam ouverte, sans gêne. Le groupe juge.",
  "Fais le mime de la chute douce sur le lit, 3 secondes. Cam ouverte, sans gêne. Le groupe juge.",
  "Fais la démonstration de ta respiration du début à la fin. Cam ouverte, sans gêne. Le groupe juge.",
  "Fais le regard du « dernière question : chez toi ou chez moi ? ». Cam ouverte, sans gêne. Le groupe juge.",
  "Fais le mime de la ceinture qu'on défait d'un geste sec. Cam ouverte, sans gêne. Le groupe juge.",
  "Fais la démonstration de ta façon de boire en regardant quelqu'un. Cam ouverte, sans gêne. Le groupe juge.",
  "Fais le mime du vêtement qui glisse tout seul. Cam ouverte, sans gêne. Le groupe juge.",
  "Fais la pose du réveil : étirement complet, 10 secondes. Cam ouverte, sans gêne. Le groupe juge.",
  "Fais le mime du dernier regard avant d'éteindre. Cam ouverte, sans gêne. Le groupe juge.",
  "Écris ici, en public, sans t'arrêter : un sexto de 3 lignes. Le groupe valide ou tu recommences.",
  "Écris ici, en public, sans t'arrêter : la phrase la plus directe que tu n'as jamais osé envoyer. Le groupe valide ou tu recommences.",
  "Écris ici, en public, sans t'arrêter : tout ce que tu ferais ce soir en 5 étapes. Le groupe valide ou tu recommences.",
  "Écris ici, en public, sans t'arrêter : la description exacte de ton ideal physique en 4 lignes. Le groupe valide ou tu recommences.",
  "Écris ici, en public, sans t'arrêter : le message qui ferait craquer le joueur de ton choix. Le groupe valide ou tu recommences.",
  "Écris ici, en public, sans t'arrêter : ta dernière envie précise avec le lieu et l'heure. Le groupe valide ou tu recommences.",
  "Écris ici, en public, sans t'arrêter : le compliment physique le plus chaud sur chaque joueur. Le groupe valide ou tu recommences.",
  "Écris ici, en public, sans t'arrêter : la promesse la plus folle que tu peux tenir. Le groupe valide ou tu recommences.",
  "Écris ici, en public, sans t'arrêter : le mot sale qui t'excite le plus, répété 3 fois avec des variations. Le groupe valide ou tu recommences.",
  "Écris ici, en public, sans t'arrêter : ta définition d'une nuit parfaite en une phrase unique. Le groupe valide ou tu recommences.",
  "Écris ici, en public, sans t'arrêter : la phrase qui te fait dire oui immédiatement. Le groupe valide ou tu recommences.",
  "Écris ici, en public, sans t'arrêter : le texte de la voix que tu envoierais à 2 h du matin. Le groupe valide ou tu recommences.",
  "Écris ici, en public, sans t'arrêter : ton menu du soir : 3 plats, version intime. Le groupe valide ou tu recommences.",
  "Écris ici, en public, sans t'arrêter : la lettre d'amour en 3 lignes qui finit très chaud. Le groupe valide ou tu recommences.",
  "Écris ici, en public, sans t'arrêter : la phrase que tu murmures quand tu perds le contrôle. Le groupe valide ou tu recommences.",
  "Écris ici, en public, sans t'arrêter : le compliment sur la voix du joueur le plus silencieux. Le groupe valide ou tu recommences.",
  "Écris ici, en public, sans t'arrêter : la confession la plus directe jamais écrite ici. Le groupe valide ou tu recommences.",
  "Écris ici, en public, sans t'arrêter : la phrase d'ouverture parfaite pour un plan. Le groupe valide ou tu recommences.",
  "Écris ici, en public, sans t'arrêter : le script de tes 10 premières secondes avec la personne désirée. Le groupe valide ou tu recommences.",
  "Écris ici, en public, sans t'arrêter : le mot que tu serais incapable de dire devant tes parents. Le groupe valide ou tu recommences.",
  "Imite ton orgasme version cinéma muet. Le groupe note le réalisme sur 10.",
  "Imite le rire qui finit en gémissement. Le groupe note le réalisme sur 10.",
  "Imite la voix de quelqu'un qui demande encore. Le groupe note le réalisme sur 10.",
  "Imite le réveil en pleine nuit par un câlin surprise. Le groupe note le réalisme sur 10.",
  "Imite le moment où tu as failli être surpris(e). Le groupe note le réalisme sur 10.",
  "Imite la marche du lendemain après une longue nuit. Le groupe note le réalisme sur 10.",
  "Imite la discussion de couloir entre deux voisines curieuses. Le groupe note le réalisme sur 10.",
  "Imite le son de ta ceinture qui tombe en pleine action. Le groupe note le réalisme sur 10.",
  "Imite le silence radio quand on te demande « tu as fait quoi hier ? ». Le groupe note le réalisme sur 10.",
  "Imite le visage de la personne qui découvre ton secret. Le groupe note le réalisme sur 10.",
  "Imite l'appel de ta mère au pire moment. Le groupe note le réalisme sur 10.",
  "Imite le fou rire au pire moment. Le groupe note le réalisme sur 10.",
  "Imite le moment où le lit crie plus fort que vous. Le groupe note le réalisme sur 10.",
  "Imite la personne qui fait semblant de dormir. Le groupe note le réalisme sur 10.",
  "Imite le soupir du soulagement à la fin. Le groupe note le réalisme sur 10.",
  "Imite le frisson du premier contact glacial. Le groupe note le réalisme sur 10.",
  "Imite le regard paniqué quand la porte s'ouvre. Le groupe note le réalisme sur 10.",
  "Imite le faux départ : prêt puis plus rien. Le groupe note le réalisme sur 10.",
  "Imite le résumé télé de ta semaine : « il paraît que tu… ». Le groupe note le réalisme sur 10.",
  "Imite la voisinne qui répète tout ce qu'elle a entendu. Le groupe note le réalisme sur 10.",
  "Imite le moment où tu dis oui sans réfléchir. Le groupe note le réalisme sur 10.",
  "Imite l'hésitation : trois faux départs avant d'embrasser. Le groupe note le réalisme sur 10.",
  "Imite la tête de la personne qui ouvre le cadeau bizarre. Le groupe note le réalisme sur 10.",
  "Imite le regard innocent après avoir fait une bêtise. Le groupe note le réalisme sur 10.",
  "Imite le « je fais quoi là ? » du matin suivant. Le groupe note le réalisme sur 10.",
  "Décris à voix haute, précisément : le corps parfait selon toi, de la tête aux pieds. 30 secondes.",
  "Décris à voix haute, précisément : ta nuit parfaite, minute par minute. 30 secondes.",
  "Décris à voix haute, précisément : ce que tu ferais avec 24 heures et la personne de ton choix. 30 secondes.",
  "Décris à voix haute, précisément : ton préliminaire préféré comme une recette de cuisine. 30 secondes.",
  "Décris à voix haute, précisément : la dernière fois que tu as perdu la tête. 30 secondes.",
  "Décris à voix haute, précisément : le lieu de tes rêves pour ce soir. 30 secondes.",
  "Décris à voix haute, précisément : la tenue parfaite sur la personne parfaite. 30 secondes.",
  "Décris à voix haute, précisément : le massage complet que tu offrerais. 30 secondes.",
  "Décris à voix haute, précisément : le son le plus excitant du monde selon toi. 30 secondes.",
  "Décris à voix haute, précisément : ton rituel complet avant une nuit chaude. 30 secondes.",
  "Décris à voix haute, précisément : le baiser parfait, du regard à la fin. 30 secondes.",
  "Décris à voix haute, précisément : la façon exacte dont tu aimes être touché(e). 30 secondes.",
  "Décris à voix haute, précisément : ta position favorite et son plan de bataille. 30 secondes.",
  "Décris à voix haute, précisément : le réveil parfait à côté de quelqu'un. 30 secondes.",
  "Décris à voix haute, précisément : la soirée parfaite qui finit dans les draps. 30 secondes.",
  "Décris à voix haute, précisément : le dernier détail que tu as remarqué sur quelqu'un. 30 secondes.",
  "Décris à voix haute, précisément : le lieu public où l'envie t'a gagné(e) et comment tu as tenu. 30 secondes.",
  "Décris à voix haute, précisément : la promesse que tu ferais pour une nuit inoubliable. 30 secondes.",
  "Décris à voix haute, précisément : le téléphone du matin : premier message, ton mot exact. 30 secondes.",
  "Décris à voix haute, précisément : le trou noir de 3 h du matin : à quoi tu penses exactement. 30 secondes.",
  "Explique les amis avec avantages comme une notice de montage. 20 secondes.",
  "Imite quelqu'un qui découvre les messages à 3 h du matin. Le groupe devine.",
  "Raconte ton meilleur souvenir avec les douches à trois températures. 20 secondes.",
  "Explique les piscines nocturnes comme une notice de montage. 20 secondes.",
  "Mime ta plus belle scène avec les douches à trois températures. 15 secondes.",
  "Mime ta plus belle scène avec les appels interrompus. 15 secondes.",
  "Décris les huiles de massage comme un commentateur sportif. 20 secondes.",
  "Raconte ton meilleur souvenir avec les hôtels où l'on revient. 20 secondes.",
  "Fais deviner les voitures embuées en 3 mimes maximum.",
  "Explique les promesses de 4 h du matin comme une notice de montage. 20 secondes.",
  "Mime ta plus belle scène avec les croisées de la salle de sport. 15 secondes.",
  "Mime ta plus belle scène avec les salles de réunion vides. 15 secondes.",
  "Fais deviner les marques sur la nuque en 3 mimes maximum.",
  "Décris les bandeaux serrés comme un commentateur sportif. 20 secondes.",
  "Fais deviner les bandeaux serrés en 3 mimes maximum.",
  "Fais deviner les bureaux après les heures en 3 mimes maximum.",
  "Mime ta plus belle scène avec les marques sur la nuque. 15 secondes.",
  "Fais une pub de 15 secondes pour les appels interrompus. Slogan obligatoire.",
  "Fais deviner les essais trouvés sur Internet en 3 mimes maximum.",
  "Fais deviner les ascenseurs bloqués en 3 mimes maximum.",
  "Montre le geste parfait pour les poignets tenus. 10 secondes.",
  "Décris les essais trouvés sur Internet comme un commentateur sportif. 20 secondes.",
  "Montre le geste parfait pour les positions acrobatiques. 10 secondes.",
  "Mime ta plus belle scène avec les orgasmes simulés. 15 secondes.",
  "Explique les jambes qui lâchent comme une notice de montage. 20 secondes.",
  "Fais une pub de 15 secondes pour les terrasses à minuit. Slogan obligatoire.",
  "Imite quelqu'un qui découvre les cages d'escalier. Le groupe devine.",
  "Fais une pub de 15 secondes pour les cheveux tirés (gentiment). Slogan obligatoire.",
  "Mime ta plus belle scène avec les bains de minuit. 15 secondes.",
  "Imite quelqu'un qui découvre les miroirs au plafond. Le groupe devine.",
  "Fais une pub de 15 secondes pour les orgasmes simulés. Slogan obligatoire.",
  "Fais une pub de 15 secondes pour les liens en soie. Slogan obligatoire.",
  "Explique les voisins curieux comme une notice de montage. 20 secondes.",
  "Imite quelqu'un qui découvre les lits qui craquent. Le groupe devine.",
  "Raconte ton meilleur souvenir avec les collègues trop proches. 20 secondes.",
  "Raconte ton meilleur souvenir avec les soirées qui dégénèrent. 20 secondes.",
  "Fais une pub de 15 secondes pour les cages d'escalier. Slogan obligatoire.",
  "Raconte ton meilleur souvenir avec les appels interrompus. 20 secondes.",
  "Décris les bains de minuit comme un commentateur sportif. 20 secondes.",
  "Mime ta plus belle scène avec les liens en soie. 15 secondes.",
  "Décris les garages bruyants comme un commentateur sportif. 20 secondes.",
  "Mime ta plus belle scène avec les lendemains sans prénom. 15 secondes.",
  "Montre le geste parfait pour les liens en soie. 10 secondes.",
  "Montre le geste parfait pour les jambes qui lâchent. 10 secondes.",
  "Décris les lits qui craquent comme un commentateur sportif. 20 secondes.",
  "Mime ta plus belle scène avec les cris étouffés. 15 secondes.",
  "Imite quelqu'un qui découvre les huiles de massage. Le groupe devine.",
  "Décris les odeurs intimes comme un commentateur sportif. 20 secondes.",
  "Explique les ascenseurs bloqués comme une notice de montage. 20 secondes.",
  "Fais deviner les ex de retour pour une nuit en 3 mimes maximum.",
  "Fais deviner les buanderies improvisées en 3 mimes maximum.",
  "Montre le geste parfait pour les voisins curieux. 10 secondes.",
  "Fais une pub de 15 secondes pour les défis d'endurance. Slogan obligatoire.",
  "Décris les serveurs et serveuses trop beaux comme un commentateur sportif. 20 secondes.",
  "Décris les cabines de plage comme un commentateur sportif. 20 secondes.",
  "Fais deviner les appels interrompus en 3 mimes maximum.",
  "Montre le geste parfait pour les essais trouvés sur Internet. 10 secondes.",
  "Montre le geste parfait pour les morsures qui marquent. 10 secondes.",
  "Décris les miroirs au plafond comme un commentateur sportif. 20 secondes.",
  "Montre le geste parfait pour les plans express. 10 secondes.",
  "Fais deviner les serveurs et serveuses trop beaux en 3 mimes maximum.",
  "Montre le geste parfait pour les collègues trop proches. 10 secondes.",
  "Fais une pub de 15 secondes pour les buanderies improvisées. Slogan obligatoire.",
  "Fais deviner les tentes qui bougent en 3 mimes maximum.",
  "Explique les miroirs au plafond comme une notice de montage. 20 secondes.",
  "Fais une pub de 15 secondes pour les griffures dans le dos. Slogan obligatoire.",
  "Mime ta plus belle scène avec les bureaux après les heures. 15 secondes.",
  "Fais deviner les gémissements forts en 3 mimes maximum.",
  "Fais une pub de 15 secondes pour les croisées de la salle de sport. Slogan obligatoire.",
  "Explique les cris étouffés comme une notice de montage. 20 secondes.",
  "Montre le geste parfait pour les appels interrompus. 10 secondes.",
  "Fais une pub de 15 secondes pour les voisins curieux. Slogan obligatoire.",
  "Montre le geste parfait pour les soirées qui dégénèrent. 10 secondes.",
  "Imite quelqu'un qui découvre les chutes du lit. Le groupe devine.",
  "Fais deviner les cabines de plage en 3 mimes maximum.",
  "Raconte ton meilleur souvenir avec les bandeaux serrés. 20 secondes.",
  "Fais une pub de 15 secondes pour les chutes du lit. Slogan obligatoire.",
  "Raconte ton meilleur souvenir avec les marques sur la nuque. 20 secondes.",
  "Fais une pub de 15 secondes pour les messages à 3 h du matin. Slogan obligatoire.",
  "Raconte ton meilleur souvenir avec les voisins curieux. 20 secondes.",
  "Imite quelqu'un qui découvre les morsures qui marquent. Le groupe devine.",
  "Explique les serveurs et serveuses trop beaux comme une notice de montage. 20 secondes.",
  "Décris les plans express comme un commentateur sportif. 20 secondes.",
  "Décris les amis avec avantages comme un commentateur sportif. 20 secondes.",
  "Imite quelqu'un qui découvre les amis avec avantages. Le groupe devine.",
  "Décris les jambes qui lâchent comme un commentateur sportif. 20 secondes.",
  "Fais deviner les hôtels où l'on revient en 3 mimes maximum.",
  "Mime ta plus belle scène avec les messages à 3 h du matin. 15 secondes.",
  "Explique les hôtels où l'on revient comme une notice de montage. 20 secondes.",
  "Raconte ton meilleur souvenir avec les morsures qui marquent. 20 secondes.",
  "Raconte ton meilleur souvenir avec les bains de minuit. 20 secondes.",
  "Décris les douches à trois températures comme un commentateur sportif. 20 secondes.",
  "Explique les poignets tenus comme une notice de montage. 20 secondes.",
  "Raconte ton meilleur souvenir avec les voitures embuées. 20 secondes.",
  "Mime ta plus belle scène avec les tentes qui bougent. 15 secondes.",
  "Fais deviner les lendemains sans prénom en 3 mimes maximum.",
  "Montre le geste parfait pour les défis d'endurance. 10 secondes.",
  "Décris les collègues trop proches comme un commentateur sportif. 20 secondes.",
  "Décris les glaçons qui fondent comme un commentateur sportif. 20 secondes.",
  "Montre le geste parfait pour les piscines nocturnes. 10 secondes.",
  "Imite quelqu'un qui découvre les ascenseurs bloqués. Le groupe devine.",
  "Fais deviner les nuits à 4 rounds en 3 mimes maximum.",
  "Fais deviner les garages bruyants en 3 mimes maximum.",
  "Raconte ton meilleur souvenir avec les plans express. 20 secondes.",
  "Décris les cages d'escalier comme un commentateur sportif. 20 secondes.",
  "Imite quelqu'un qui découvre les garages bruyants. Le groupe devine.",
  "Explique les soirées qui dégénèrent comme une notice de montage. 20 secondes.",
  "Explique les salles de réunion vides comme une notice de montage. 20 secondes.",
  "Raconte ton meilleur souvenir avec les lits qui craquent. 20 secondes.",
  "Raconte ton meilleur souvenir avec les cheveux tirés (gentiment). 20 secondes.",
  "Explique les odeurs intimes comme une notice de montage. 20 secondes.",
  "Montre le geste parfait pour les miroirs au plafond. 10 secondes.",
  "Explique les buanderies improvisées comme une notice de montage. 20 secondes.",
  "Montre le geste parfait pour les promesses de 4 h du matin. 10 secondes.",
  "Imite quelqu'un qui découvre les bandeaux serrés. Le groupe devine.",
  "Mime ta plus belle scène avec les essais trouvés sur Internet. 15 secondes.",
  "Mime ta plus belle scène avec les ordres doux. 15 secondes.",
  "Fais deviner les chutes du lit en 3 mimes maximum.",
  "Fais deviner les morsures qui marquent en 3 mimes maximum.",
  "Imite quelqu'un qui découvre les cheveux tirés (gentiment). Le groupe devine.",
  "Montre le geste parfait pour les records battus. 10 secondes.",
  "Explique les morsures qui marquent comme une notice de montage. 20 secondes.",
  "Fais deviner les goûts qui surprennent en 3 mimes maximum.",
  "Montre le geste parfait pour les voitures embuées. 10 secondes.",
  "Montre le geste parfait pour les lits qui craquent. 10 secondes.",
  "Explique les liens en soie comme une notice de montage. 20 secondes.",
  "Mime ta plus belle scène avec les ex de retour pour une nuit. 15 secondes.",
  "Montre le geste parfait pour les hôtels où l'on revient. 10 secondes.",
  "Explique les goûts qui surprennent comme une notice de montage. 20 secondes.",
  "Raconte ton meilleur souvenir avec les essais trouvés sur Internet. 20 secondes.",
  "Montre le geste parfait pour les glaçons qui fondent. 10 secondes.",
  "Raconte ton meilleur souvenir avec les miroirs au plafond. 20 secondes.",
  "Explique les tentes qui bougent comme une notice de montage. 20 secondes.",
  "Décris les goûts qui surprennent comme un commentateur sportif. 20 secondes.",
  "Raconte ton meilleur souvenir avec les amis avec avantages. 20 secondes.",
  "Explique les huiles de massage comme une notice de montage. 20 secondes.",
  "Mime ta plus belle scène avec les lits qui craquent. 15 secondes.",
  "Raconte ton meilleur souvenir avec les tentes qui bougent. 20 secondes.",
  "Décris les salles de réunion vides comme un commentateur sportif. 20 secondes.",
  "Décris les cris étouffés comme un commentateur sportif. 20 secondes.",
  "Montre le geste parfait pour les tentes qui bougent. 10 secondes.",
  "Mime ta plus belle scène avec les buanderies improvisées. 15 secondes.",
  "Mime ta plus belle scène avec les huiles de massage. 15 secondes.",
  "Décris les cheveux tirés (gentiment) comme un commentateur sportif. 20 secondes.",
  "Raconte ton meilleur souvenir avec les records battus. 20 secondes.",
  "Raconte ton meilleur souvenir avec les croisées de la salle de sport. 20 secondes.",
  "Explique les lits qui craquent comme une notice de montage. 20 secondes.",
  "Fais deviner les piscines nocturnes en 3 mimes maximum.",
  "Fais une pub de 15 secondes pour les ex de retour pour une nuit. Slogan obligatoire.",
  "Décris les poignets tenus comme un commentateur sportif. 20 secondes.",
  "Raconte ton meilleur souvenir avec les défis d'endurance. 20 secondes.",
  "Mime ta plus belle scène avec les cages d'escalier. 15 secondes.",
  "Fais deviner les jambes qui lâchent en 3 mimes maximum.",
  "Mime ta plus belle scène avec les hôtels où l'on revient. 15 secondes.",
  "Mime ta plus belle scène avec les amis avec avantages. 15 secondes.",
  "Fais une pub de 15 secondes pour les amis avec avantages. Slogan obligatoire.",
  "Montre le geste parfait pour les odeurs intimes. 10 secondes.",
  "Montre le geste parfait pour les bandeaux serrés. 10 secondes.",
  "Fais deviner les cages d'escalier en 3 mimes maximum.",
  "Montre le geste parfait pour les goûts qui surprennent. 10 secondes.",
  "Imite quelqu'un qui découvre les douches à trois températures. Le groupe devine.",
  "Explique les croisées de la salle de sport comme une notice de montage. 20 secondes.",
  "Imite quelqu'un qui découvre les appels interrompus. Le groupe devine.",
  "Imite quelqu'un qui découvre les tentes qui bougent. Le groupe devine.",
  "Raconte ton meilleur souvenir avec les buanderies improvisées. 20 secondes.",
  "Imite quelqu'un qui découvre les collègues trop proches. Le groupe devine.",
  "Raconte ton meilleur souvenir avec les nuits à 4 rounds. 20 secondes.",
  "Fais une pub de 15 secondes pour les collègues trop proches. Slogan obligatoire.",
  "Raconte ton meilleur souvenir avec les huiles de massage. 20 secondes.",
  "Explique les garages bruyants comme une notice de montage. 20 secondes.",
  "Fais deviner les croisées de la salle de sport en 3 mimes maximum.",
  "Imite quelqu'un qui découvre les lendemains sans prénom. Le groupe devine.",
  "Explique les cages d'escalier comme une notice de montage. 20 secondes.",
  "Fais une pub de 15 secondes pour les promesses de 4 h du matin. Slogan obligatoire.",
  "Fais deviner les huiles de massage en 3 mimes maximum.",
  "Imite quelqu'un qui découvre les buanderies improvisées. Le groupe devine.",
  "Fais deviner les glaçons qui fondent en 3 mimes maximum.",
  "Montre le geste parfait pour les ex de retour pour une nuit. 10 secondes.",
  "Fais deviner les records battus en 3 mimes maximum.",
  "Mime ta plus belle scène avec les positions acrobatiques. 15 secondes.",
  "Mime ta plus belle scène avec les voisins curieux. 15 secondes.",
  "Fais deviner les collègues trop proches en 3 mimes maximum.",
  "Raconte ton meilleur souvenir avec les bureaux après les heures. 20 secondes.",
  "Fais une pub de 15 secondes pour les garages bruyants. Slogan obligatoire.",
  "Fais deviner les amis avec avantages en 3 mimes maximum.",
  "Mime ta plus belle scène avec les voitures embuées. 15 secondes.",
  "Raconte ton meilleur souvenir avec les jambes qui lâchent. 20 secondes.",
  "Imite quelqu'un qui découvre les orgasmes simulés. Le groupe devine.",
  "Explique les ex de retour pour une nuit comme une notice de montage. 20 secondes.",
  "Fais deviner les terrasses à minuit en 3 mimes maximum.",
  "Fais deviner les défis d'endurance en 3 mimes maximum.",
  "Mime ta plus belle scène avec les ascenseurs bloqués. 15 secondes.",
  "Fais une pub de 15 secondes pour les records battus. Slogan obligatoire.",
  "Décris les terrasses à minuit comme un commentateur sportif. 20 secondes.",
  "Imite quelqu'un qui découvre les essais trouvés sur Internet. Le groupe devine.",
  "Montre le geste parfait pour les cages d'escalier. 10 secondes.",
  "Décris les ascenseurs bloqués comme un commentateur sportif. 20 secondes.",
  "Fais une pub de 15 secondes pour les voitures embuées. Slogan obligatoire.",
  "Explique les bains de minuit comme une notice de montage. 20 secondes.",
  "Explique les cabines de plage comme une notice de montage. 20 secondes.",
  "Raconte ton meilleur souvenir avec les salles de réunion vides. 20 secondes.",
  "Décris les liens en soie comme un commentateur sportif. 20 secondes.",
  "Mime ta plus belle scène avec les poignets tenus. 15 secondes.",
  "Fais une pub de 15 secondes pour les lits qui craquent. Slogan obligatoire.",
  "Fais une pub de 15 secondes pour les jambes qui lâchent. Slogan obligatoire.",
  "Raconte ton meilleur souvenir avec les gémissements forts. 20 secondes.",
  "Fais une pub de 15 secondes pour les gémissements forts. Slogan obligatoire.",
  "Décris les voitures embuées comme un commentateur sportif. 20 secondes.",
  "Montre le geste parfait pour les cris étouffés. 10 secondes.",
  "Fais une pub de 15 secondes pour les serveurs et serveuses trop beaux. Slogan obligatoire.",
  "Explique les essais trouvés sur Internet comme une notice de montage. 20 secondes.",
  "Fais une pub de 15 secondes pour les odeurs intimes. Slogan obligatoire.",
  "Imite quelqu'un qui découvre les serveurs et serveuses trop beaux. Le groupe devine.",
  "Décris les hôtels où l'on revient comme un commentateur sportif. 20 secondes.",
  "Montre le geste parfait pour les lendemains sans prénom. 10 secondes.",
  "Fais deviner les soirées qui dégénèrent en 3 mimes maximum.",
  "Mime ta plus belle scène avec les records battus. 15 secondes.",
  "Raconte ton meilleur souvenir avec les ex de retour pour une nuit. 20 secondes.",
  "Fais deviner les promesses de 4 h du matin en 3 mimes maximum.",
  "Raconte ton meilleur souvenir avec les liens en soie. 20 secondes.",
  "Explique les plans express comme une notice de montage. 20 secondes.",
  "Décris les messages à 3 h du matin comme un commentateur sportif. 20 secondes.",
  "Décris les morsures qui marquent comme un commentateur sportif. 20 secondes.",
  "Imite quelqu'un qui découvre les cris étouffés. Le groupe devine.",
  "Décris les griffures dans le dos comme un commentateur sportif. 20 secondes.",
  "Imite quelqu'un qui découvre les promesses de 4 h du matin. Le groupe devine.",
  "Explique les lendemains sans prénom comme une notice de montage. 20 secondes.",
  "Raconte ton meilleur souvenir avec les griffures dans le dos. 20 secondes.",
  "Imite quelqu'un qui découvre les poignets tenus. Le groupe devine.",
  "Explique les terrasses à minuit comme une notice de montage. 20 secondes.",
  "Montre le geste parfait pour les marques sur la nuque. 10 secondes.",
  "Explique les défis d'endurance comme une notice de montage. 20 secondes.",
  "Décris les appels interrompus comme un commentateur sportif. 20 secondes.",
  "Explique les glaçons qui fondent comme une notice de montage. 20 secondes.",
  "Mime ta plus belle scène avec les goûts qui surprennent. 15 secondes.",
  "Fais une pub de 15 secondes pour les douches à trois températures. Slogan obligatoire.",
  "Raconte ton meilleur souvenir avec les cris étouffés. 20 secondes.",
  "Fais deviner les liens en soie en 3 mimes maximum.",
  "Montre le geste parfait pour les ascenseurs bloqués. 10 secondes.",
  "Mime ta plus belle scène avec les nuits à 4 rounds. 15 secondes.",
  "Fais une pub de 15 secondes pour les cris étouffés. Slogan obligatoire.",
  "Raconte ton meilleur souvenir avec les poignets tenus. 20 secondes.",
  "Imite quelqu'un qui découvre les odeurs intimes. Le groupe devine.",
  "Mime ta plus belle scène avec les morsures qui marquent. 15 secondes.",
  "Explique les bandeaux serrés comme une notice de montage. 20 secondes.",
  "Décris les soirées qui dégénèrent comme un commentateur sportif. 20 secondes.",
  "Raconte ton meilleur souvenir avec les odeurs intimes. 20 secondes.",
  "Imite quelqu'un qui découvre les goûts qui surprennent. Le groupe devine.",
  "Mime ta plus belle scène avec les odeurs intimes. 15 secondes.",
  "Fais une pub de 15 secondes pour les tentes qui bougent. Slogan obligatoire.",
  "Fais une pub de 15 secondes pour les miroirs au plafond. Slogan obligatoire.",
  "Raconte ton meilleur souvenir avec les piscines nocturnes. 20 secondes.",
  "Fais une pub de 15 secondes pour les soirées qui dégénèrent. Slogan obligatoire.",
  "Fais une pub de 15 secondes pour les marques sur la nuque. Slogan obligatoire.",
  "Fais une pub de 15 secondes pour les piscines nocturnes. Slogan obligatoire.",
  "Décris les records battus comme un commentateur sportif. 20 secondes.",
  "Imite quelqu'un qui découvre les jambes qui lâchent. Le groupe devine.",
  "Montre le geste parfait pour les chutes du lit. 10 secondes.",
  "Décris les bureaux après les heures comme un commentateur sportif. 20 secondes.",
  "Fais deviner les messages à 3 h du matin en 3 mimes maximum.",
  "Fais une pub de 15 secondes pour les plans express. Slogan obligatoire.",
  "Décris les positions acrobatiques comme un commentateur sportif. 20 secondes.",
  "Explique les ordres doux comme une notice de montage. 20 secondes.",
  "Mime ta plus belle scène avec les chutes du lit. 15 secondes.",
  "Montre le geste parfait pour les terrasses à minuit. 10 secondes.",
  "Explique les voitures embuées comme une notice de montage. 20 secondes.",
  "Imite quelqu'un qui découvre les piscines nocturnes. Le groupe devine.",
  "Mime ta plus belle scène avec les serveurs et serveuses trop beaux. 15 secondes.",
  "Montre le geste parfait pour les ordres doux. 10 secondes.",
  "Fais deviner les griffures dans le dos en 3 mimes maximum.",
  "Décris les croisées de la salle de sport comme un commentateur sportif. 20 secondes.",
  "Explique les chutes du lit comme une notice de montage. 20 secondes.",
  "Raconte ton meilleur souvenir avec les serveurs et serveuses trop beaux. 20 secondes.",
  "Fais une pub de 15 secondes pour les essais trouvés sur Internet. Slogan obligatoire.",
  "Explique les orgasmes simulés comme une notice de montage. 20 secondes.",
  "Imite quelqu'un qui découvre les croisées de la salle de sport. Le groupe devine.",
  "Montre le geste parfait pour les garages bruyants. 10 secondes.",
  "Décris les lendemains sans prénom comme un commentateur sportif. 20 secondes.",
  "Mime ta plus belle scène avec les plans express. 15 secondes.",
  "Imite quelqu'un qui découvre les positions acrobatiques. Le groupe devine.",
  "Mime ta plus belle scène avec les gémissements forts. 15 secondes.",
  "Imite quelqu'un qui découvre les gémissements forts. Le groupe devine.",
  "Fais une pub de 15 secondes pour les bandeaux serrés. Slogan obligatoire.",
  "Imite quelqu'un qui découvre les défis d'endurance. Le groupe devine.",
  "Fais une pub de 15 secondes pour les positions acrobatiques. Slogan obligatoire.",
  "Raconte ton meilleur souvenir avec les ordres doux. 20 secondes.",
  "Montre le geste parfait pour les buanderies improvisées. 10 secondes.",
  "Imite quelqu'un qui découvre les records battus. Le groupe devine.",
  "Décris les chutes du lit comme un commentateur sportif. 20 secondes.",
  "Montre le geste parfait pour les salles de réunion vides. 10 secondes.",
  "Imite quelqu'un qui découvre les bains de minuit. Le groupe devine.",
  "Explique les griffures dans le dos comme une notice de montage. 20 secondes.",
  "Montre le geste parfait pour les orgasmes simulés. 10 secondes.",
  "Imite quelqu'un qui découvre les liens en soie. Le groupe devine.",
  "Imite quelqu'un qui découvre les plans express. Le groupe devine.",
  "Explique les messages à 3 h du matin comme une notice de montage. 20 secondes.",
  "Fais une pub de 15 secondes pour les bureaux après les heures. Slogan obligatoire.",
  "Fais deviner les lits qui craquent en 3 mimes maximum.",
  "Imite quelqu'un qui découvre les ordres doux. Le groupe devine.",
  "Fais deviner les miroirs au plafond en 3 mimes maximum.",
  "Imite quelqu'un qui découvre les marques sur la nuque. Le groupe devine.",
  "Fais une pub de 15 secondes pour les morsures qui marquent. Slogan obligatoire.",
  "Mime ta plus belle scène avec les glaçons qui fondent. 15 secondes.",
  "Fais une pub de 15 secondes pour les nuits à 4 rounds. Slogan obligatoire.",
  "Raconte ton meilleur souvenir avec les lendemains sans prénom. 20 secondes.",
  "Raconte ton meilleur souvenir avec les terrasses à minuit. 20 secondes.",
  "Fais une pub de 15 secondes pour les hôtels où l'on revient. Slogan obligatoire.",
  "Explique les records battus comme une notice de montage. 20 secondes.",
  "Décris les défis d'endurance comme un commentateur sportif. 20 secondes.",
  "Fais deviner les salles de réunion vides en 3 mimes maximum.",
  "Mime ta plus belle scène avec les collègues trop proches. 15 secondes.",
  "Fais deviner les poignets tenus en 3 mimes maximum.",
  "Fais une pub de 15 secondes pour les ascenseurs bloqués. Slogan obligatoire.",
  "Imite quelqu'un qui découvre les salles de réunion vides. Le groupe devine.",
  "Imite quelqu'un qui découvre les voitures embuées. Le groupe devine."
]
  },
  4: {
    verite: [
  "C'est ton fantasme le plus torride que tu n'as JAMAIS raconté ? Détails obligatoires.",
  "Décris la dernière fois que tu as baisé : quand, où, comment. Sans sauter une étape.",
  "Quelle position tu pratiques le plus ? Et celle que tu n'oses pas tester ?",
  "Le nombre EXACT de personnes avec qui tu as couché. Le vrai chiffre.",
  "Raconte ton meilleur coup de ta vie. Pourquoi c'était inoubliable ?",
  "As-tu déjà couché avec quelqu'un d'ici ? Qui ? (les autres ferment les yeux)",
  "C'est le truc le plus pervers qu'on t'ait demandé... et que tu as accepté ?",
  "Combien de temps tu tiens ? Le groupe veut une estimation honnête.",
  "Bande son ou silence total au lit ? Décris ce que tu aimes entendre.",
  "Ton pire échec au lit ? Panne, finition express... Raconte le drame.",
  "Où est l'endroit LE PLUS risqué où tu as baisé ? Presque surpris(e) ?",
  "Si tu devais coucher avec 2 personnes de cette partie, lesquelles ?",
  "As-tu déjà utilisé un jouet intime avec quelqu'un ? Raconte la scène complète.",
  "C'est le bruit de ton/ta partenaire qui te fait le plus craquer ?",
  "Quelle odeur te met instantanément d'humeur ? Raconte la dernière fois.",
  "As-tu déjà couché avec quelqu'un pour de l'argent ou un cadeau ? Assume.",
  "Ta jalousie au lit : qu'est-ce qui te rend furieux/furieuse ? Sois vrai(e).",
  "As-tu déjà eu un rêve érotique avec quelqu'un de CE salon ? Raconte.",
  "Ta scène de film X préférée ? Décris l'image exacte qui te revient.",
  "As-tu déjà testé la glace, la plume ou la cire au lit ? Verdict honnête.",
  "As-tu déjà baisé dans un avion ou un train ? Le club très fermé ?",
  "Tes préliminaires en vrai : combien de minutes ? Chronomètre mental.",
  "La chose que ton/ta partenaire fait sans le savoir et qui te rend fou/folle ?",
  "Sextoys : lequel tu utilises ou tu rêves d'utiliser ? Détails techniques.",
  "As-tu déjà filmé un rapport (avec accord) ? C'était comment ?",
  "Ton plus grand regret : celui/celle que tu as laissé(e) filer sans rien tenter ?",
  "As-tu déjà été attiré(e) par le/la copain/copine d'un proche ? Ça s'est su ?",
  "Ta réaction VRAIE si un(e) joueur d'ici t'envoyait un nude ce soir ?",
  "As-tu déjà laissé quelqu'un regarder ? Ou regardé ? Raconte la scène.",
  "Ton rapport le plus rapide de ta vie ? Chronomètre honnête.",
  "Ta plus grande faiblesse physique : nuque, oreilles, dos ? L'endroit exact.",
  "As-tu déjà pleuré après un rapport ? Le vrai pourquoi.",
  "Quelle chanson t'a déjà mis d'humeur en pleine soirée ?",
  "As-tu déjà réalisé un fantasme pendant que quelqu'un conduisait ?",
  "Le miroir pendant l'action : oui, non, pourquoi ? Sois graphique.",
  "Quelle est la promesse la plus folle que tu as faite au lit ? Tenue ou pas ?",
  "As-tu déjà dormi collé(e) à quelqu'un sans rien faire alors que ça brûlait ?",
  "Ton record de temps SANS y penser ? Personne ne te croit.",
  "Qu'est-ce qui te fait dire oui plus vite : un regard, un mot ou une main ?",
  "Ta première réaction quand on t'embrasse le bas du dos ? Décris la montée.",
  "As-tu déjà été surpris(e) en train de te toucher ? Scène complète.",
  "Ton moment préféré : l'avant, le pendant ou l'après ? Pourquoi ?",
  "As-tu déjà enchaîné deux personnes le même week-end ? Énergie légendaire ?",
  "Quel est le compliment au lit que tu voudrais entendre tout le temps ?",
  "Ta plus grosse dépense cochonne (hôtel, lingerie, jouet) ? Le ticket de caisse.",
  "As-tu déjà flirté avec deux personnes du même groupe d'amis ? Lesquelles ?",
  "Ton sexto le plus osé envoyé ? Résume-le ici, censure interdite.",
  "Qu'est-ce que tu regardes EN PREMIER chez quelqu'un nu ? Sois précis.",
  "As-tu déjà simulé pour raccourcir ? Ou pour ne pas blesser ? Raconte.",
  "La position où tu tiens le plus longtemps ? Et celle où tu lâches en 2 minutes ?",
  "As-tu déjà testé les menottes ou le bandage des yeux ? Ce que ça a changé ?",
  "Ton fantasme qui restera à jamais non réalisé ? Et pourquoi ?",
  "Ta plus grande phobie au lit ? Panne, rire mal placé, fatigue soudaine ?",
  "As-tu déjà enchaîné une soirée et un plan sans dormir ? Raconte la nuit blanche.",
  "Le dernier truc coquin que tu as cherché sur ton téléphone ? L'historique parle.",
  "As-tu déjà pensé à quelqu'un d'ici pendant un moment intime ? Initiales acceptées.",
  "Ta plus longue abstinence ? Ce que la libération a donné ?",
  "Quel est ton pire achat coquin ? Description complète demandée.",
  "As-tu déjà eu un plan qui a fini en relation sérieuse ? Retournement complet ?",
  "Ton premier réflexe quand quelqu'un glisse une main dans ton dos ?",
  "As-tu déjà dit je t'aime au moment le moins approprié ? Le moment exact.",
  "La phrase chuchotée qui te fait fondre à 100 % ? Dis-la au groupe.",
  "As-tu déjà testé les jeux de rôle au lit (docteur, patron, prof) ? Raconte.",
  "Ta partie préférée du corps d'une femme ? D'un homme ? Sois clinique.",
  "Le plus de fois en une nuit : ton record réel et l'âge que tu avais.",
  "As-tu déjà avalé ou fait avaler ? Tu en penses quoi, vraiment ?",
  "Ta technique signature avec la langue ? Le groupe demande des détails.",
  "As-tu déjà eu envie de quelqu'un dans cette pièce il y a moins d'une heure ?",
  "C'est ton side chaud préféré : la voix, la bouche, les mains ou les hanches ?",
  "Décris, sans filtre : la dernière fois que tu as baiser : position de départ et de fin. Le groupe exige la vérité.",
  "Décris, sans filtre : ton orgasme le plus mémorable et ce qui l'a causé. Le groupe exige la vérité.",
  "Décris, sans filtre : la chose la plus sale jamais dite dans ton oreille. Le groupe exige la vérité.",
  "Décris, sans filtre : la marque la plus visible jamais laissée sur toi. Le groupe exige la vérité.",
  "Décris, sans filtre : le rapport le plus bruyant de ta vie et les voisins. Le groupe exige la vérité.",
  "Décris, sans filtre : ta façon exacte de te toucher quand tu es seul(e). Le groupe exige la vérité.",
  "Décris, sans filtre : le sextoy de tes rêves et ce que tu en ferais. Le groupe exige la vérité.",
  "Décris, sans filtre : la nuit où tu as le plus osé : chaque étape. Le groupe exige la vérité.",
  "Décris, sans filtre : la chose que tu as avalée ou fait avaler sans le dire. Le groupe exige la vérité.",
  "Décris, sans filtre : le moment où tu as perdu le contrôle complètement. Le groupe exige la vérité.",
  "Décris, sans filtre : la position que tu jugeais nulle et qui t'a surpris(e). Le groupe exige la vérité.",
  "Décris, sans filtre : le plus long préliminaire jamais fait : la durée exacte. Le groupe exige la vérité.",
  "Décris, sans filtre : la partie du corps où tu aimes jouir ou faire jouir. Le groupe exige la vérité.",
  "Décris, sans filtre : le bruit que tu fais quand c'est trop bon. Le groupe exige la vérité.",
  "Décris, sans filtre : la nuit où tu as pleuré de plaisir. Le groupe exige la vérité.",
  "Décris, sans filtre : le rapport le plus rapide jamais réussi. Le groupe exige la vérité.",
  "Décris, sans filtre : le rapport le plus raté de ta vie. Le groupe exige la vérité.",
  "Décris, sans filtre : la première fois que tu as vu un corps nu en vrai. Le groupe exige la vérité.",
  "Décris, sans filtre : la première image X que tu as vue et l'effet produit. Le groupe exige la vérité.",
  "Décris, sans filtre : la chose que ton corps réclame quand tu bois. Le groupe exige la vérité.",
  "Décris, sans filtre : le fantasme lié à un lieu public précis. Le groupe exige la vérité.",
  "Décris, sans filtre : la chose que tu regardes dans une vidéo X en premier. Le groupe exige la vérité.",
  "Décris, sans filtre : le mot sale qui déclenche tout chez toi. Le groupe exige la vérité.",
  "Décris, sans filtre : l'odeur corporelle qui te fait perdre la tête. Le groupe exige la vérité.",
  "Décris, sans filtre : le réveil le plus chaud de ta vie. Le groupe exige la vérité.",
  "Décris, sans filtre : la douche la plus longue jamais partagée. Le groupe exige la vérité.",
  "Décris, sans filtre : le message vocal le plus osé jamais envoyé. Le groupe exige la vérité.",
  "Décris, sans filtre : la promesse cochonne jamais tenue. Le groupe exige la vérité.",
  "Décris, sans filtre : le mensonge le plus gros dit pour coucher. Le groupe exige la vérité.",
  "Décris, sans filtre : la chose la plus étrange jamais faite au lit. Le groupe exige la vérité.",
  "Décris, sans filtre : le fou rire le plus mal placé pendant l'action. Le groupe exige la vérité.",
  "Décris, sans filtre : la chute ou la casse la plus spectaculaire au lit. Le groupe exige la vérité.",
  "Décris, sans filtre : le moment où tu as cru que la maison allait s'effondrer de bruit. Le groupe exige la vérité.",
  "Décris, sans filtre : le lieu le plus inconfortable jamais utilisé. Le groupe exige la vérité.",
  "Décris, sans filtre : la fatigue la plus extrême pendant l'action. Le groupe exige la vérité.",
  "Décris, sans filtre : la faim la plus soudaine au pire moment. Le groupe exige la vérité.",
  "Décris, sans filtre : le téléphone qui a sonné au pire moment. Le groupe exige la vérité.",
  "Décris, sans filtre : la honte la plus grande jamais ressentie au lit. Le groupe exige la vérité.",
  "Décris, sans filtre : le jouet ou l'objet improvisé le plus fou. Le groupe exige la vérité.",
  "Décris, sans filtre : la tenue qui t'a fait dire oui tout de suite. Le groupe exige la vérité.",
  "As-tu déjà baisé dans la même pièce que des amis endormis ? Assume à 100 %.",
  "As-tu déjà baisé pendant que quelqu'un appelait et répondu normal ? Assume à 100 %.",
  "As-tu déjà testé la domination complète ( donner et recevoir les ordres) ? Assume à 100 %.",
  "As-tu déjà mordu jusqu'au sang, presque ? Assume à 100 %.",
  "As-tu déjà griffé le dos jusqu'aux traces blanches ? Assume à 100 %.",
  "As-tu déjà testé la fessée à main nue et avec un objet ? Assume à 100 %.",
  "As-tu déjà lié ou été ligoté(e) (foulard, menottes) ? Assume à 100 %.",
  "As-tu déjà bandé les yeux ou été aveuglé(e) ? Assume à 100 %.",
  "As-tu déjà eu un plan à trois ou refusé une proposition ? Assume à 100 %.",
  "As-tu déjà échangé un regard chaud avec un(e) autre en couple ? Assume à 100 %.",
  "As-tu déjà filmé un rapport ou regardé la vidéo ensuite ? Assume à 100 %.",
  "As-tu déjà envoyé un vocal gémissant par erreur à ta famille ? Assume à 100 %.",
  "As-tu déjà couché sur un balcon ou une terrasse la nuit ? Assume à 100 %.",
  "As-tu déjà couché sous une table ou derrière un comptoir ? Assume à 100 %.",
  "As-tu déjà interrompu une réunion ou un cours par une envie impossible ? Assume à 100 %.",
  "As-tu déjà couché avec quelqu'un qui parlait une autre langue ? Assume à 100 %.",
  "As-tu déjà couché avec une différence d'âge de plus de 15 ans ? Assume à 100 %.",
  "As-tu déjà couché avec le/la patron(ne) ou un(e) employé(e) ? Assume à 100 %.",
  "As-tu déjà couché avec un(e) livreur, chauffeur ou serveur(se) ? Assume à 100 %.",
  "As-tu déjà couché juste après une grosse dispute (version maquillage) ? Assume à 100 %.",
  "As-tu déjà couché pour faire taire un fou rire ? Assume à 100 %.",
  "As-tu déjà couché par vengeance sur un(e) ex ? Assume à 100 %.",
  "As-tu déjà couché pour oublier quelqu'un ? Assume à 100 %.",
  "As-tu déjà couché avec la personne que ton groupe déteste ? Assume à 100 %.",
  "As-tu déjà couché avec le/la fameux ex d'un(e) ami(e) ? Assume à 100 %.",
  "As-tu déjà couché le jour d'un enterrement ou d'un mariage ? Assume à 100 %.",
  "As-tu déjà couché dans la voiture de ta mère ou de ton père ? Assume à 100 %.",
  "As-tu déjà couché avec une tenue complète de jeu de rôle ? Assume à 100 %.",
  "As-tu déjà utilisé de la nourriture (chocolat, crème, glace) ? Assume à 100 %.",
  "As-tu déjà utilisé de la glace sur un corps qui brûle ? Assume à 100 %.",
  "As-tu déjà testé les liens de soie ou les foulards ? Assume à 100 %.",
  "As-tu déjà testé le sexe contre une fenêtre en pleine ville ? Assume à 100 %.",
  "As-tu déjà testé le sexe sous la pluie battante ? Assume à 100 %.",
  "As-tu déjà testé le sexe avec la télé allumée sur un dessin animé ? Assume à 100 %.",
  "As-tu déjà testé le sexe avec quelqu'un qui ne parle pas ta langue ? Assume à 100 %.",
  "As-tu déjà crié un prénom inventé pour cacher le vrai ? Assume à 100 %.",
  "As-tu déjà fait semblant d'un orgasme complet avec théâtre ? Assume à 100 %.",
  "As-tu déjà eu un orgasme juste par un baiser long ? Assume à 100 %.",
  "As-tu déjà eu un orgasme pendant un rêve ? Assume à 100 %.",
  "As-tu déjà eu une envie pendant un enterrement ou un moment grave ? Assume à 100 %.",
  "Le groupe veut le détail brut sur : ta taille préférée chez l'autre. Une phrase claire, pas de poésie.",
  "Le groupe veut le détail brut sur : la chose que tu adores faire avec ta langue. Une phrase claire, pas de poésie.",
  "Le groupe veut le détail brut sur : l'endroit exact où tu aimes être touché(e) au maximum. Une phrase claire, pas de poésie.",
  "Le groupe veut le détail brut sur : le geste qui te rend fou/folle en moins de 10 secondes. Une phrase claire, pas de poésie.",
  "Le groupe veut le détail brut sur : la position qui te fait jouir le plus vite. Une phrase claire, pas de poésie.",
  "Le groupe veut le détail brut sur : le bruit que fait ton corps quand tu lâches prise. Une phrase claire, pas de poésie.",
  "Le groupe veut le détail brut sur : la durée exacte de ton préliminaire parfait. Une phrase claire, pas de poésie.",
  "Le groupe veut le détail brut sur : le nombre de doigts ou de mains dont tu as besoin pour tout comprendre. Une phrase claire, pas de poésie.",
  "Le groupe veut le détail brut sur : la partie de la bite ou de la chatte que tu préfères (tu connais la tienne). Une phrase claire, pas de poésie.",
  "Le groupe veut le détail brut sur : le goût que tu préfères ou que tu redoutes. Une phrase claire, pas de poésie.",
  "Le groupe veut le détail brut sur : le parfum d'entrejambe : tabou ou excitation. Une phrase claire, pas de poésie.",
  "Le groupe veut le détail brut sur : la façon exacte dont tu aimes être mordu(e). Une phrase claire, pas de poésie.",
  "Le groupe veut le détail brut sur : la force parfaite d'une poigne sur tes hanches. Une phrase claire, pas de poésie.",
  "Le groupe veut le détail brut sur : le rythme parfait : lent du début ou montée progressive. Une phrase claire, pas de poésie.",
  "Le groupe veut le détail brut sur : l'angle parfait que personne ne trouve jamais. Une phrase claire, pas de poésie.",
  "Le groupe veut le détail brut sur : le mot le plus sale que tu as déjà gémi. Une phrase claire, pas de poésie.",
  "Le groupe veut le détail brut sur : le surnom cochonne que tu donnes ou aimes recevoir. Une phrase claire, pas de poésie.",
  "Le groupe veut le détail brut sur : le moment exact où tu sais que ça va jouir. Une phrase claire, pas de poésie.",
  "Le groupe veut le détail brut sur : la chose que tu fais toujours juste avant la fin. Une phrase claire, pas de poésie.",
  "Le groupe veut le détail brut sur : la façon dont tu récupères après : minutes exactes. Une phrase claire, pas de poésie.",
  "Le groupe veut le détail brut sur : la partie de la nuit où tu es le/la plus bruyant(e). Une phrase claire, pas de poésie.",
  "Le groupe veut le détail brut sur : la chose que ton corps fait sans ton permission quand c'est trop bon. Une phrase claire, pas de poésie.",
  "Le groupe veut le détail brut sur : le réveil le plus chaud : la scène exacte. Une phrase claire, pas de poésie.",
  "Le groupe veut le détail brut sur : la chose que tu as jamais faite par pure envie de transgresser. Une phrase claire, pas de poésie.",
  "Le groupe veut le détail brut sur : la chose que tu ne feras JAMAIS même pour un million. Une phrase claire, pas de poésie.",
  "Le groupe veut le détail brut sur : le fantasme le plussale que tu oses décrire ici. Une phrase claire, pas de poésie.",
  "Le groupe veut le détail brut sur : la chose que tu regardes en premier dans un film X. Une phrase claire, pas de poésie.",
  "Le groupe veut le détail brut sur : le son de la fin : décrit-le pour le groupe. Une phrase claire, pas de poésie.",
  "Le groupe veut le détail brut sur : la chose que tu as promise à quelqu'un dans le noir. Une phrase claire, pas de poésie.",
  "Le groupe veut le détail brut sur : le détail de ta dernière douche solitaire sans le dire à personne. Une phrase claire, pas de poésie.",
  "Ta réaction sincère si un(e) joueur d'ici t'embrassait maintenant ? Réponds vrai ou faux, sans détour.",
  "Ta réaction sincère si on t'envoyait un nude dans les 10 secondes ? Réponds vrai ou faux, sans détour.",
  "Ta réaction sincère si le groupe choisissait une personne pour coucher avec toi ? Réponds vrai ou faux, sans détour.",
  "Ta réaction sincère si ton ex t'écrivait « je suis à côté, ouvre » ? Réponds vrai ou faux, sans détour.",
  "Ta réaction sincère si on te proposait un plan à trois ce soir ? Réponds vrai ou faux, sans détour.",
  "Ta réaction sincère si on te proposait de l'argent pour une nuit ? Réponds vrai ou faux, sans détour.",
  "Ta réaction sincère si quelqu'un d'ici avait déjà rêvé de toi (et le raconte) ? Réponds vrai ou faux, sans détour.",
  "Ta réaction sincère si la personne en face de toi se déshabillait lentement ? Réponds vrai ou faux, sans détour.",
  "Ta réaction sincère si on te demandait un nude maintenant ? Réponds vrai ou faux, sans détour.",
  "Ta réaction sincère si le groupe lisait ton dernier message chaud à voix haute ? Réponds vrai ou faux, sans détour.",
  "Ta réaction sincère si quelqu'un te mordait le cou pendant un câlin innocent ? Réponds vrai ou faux, sans détour.",
  "Ta réaction sincère si ton/ta partenaire te demandait les menottes ? Réponds vrai ou faux, sans détour.",
  "Ta réaction sincère si le voisin tapait au mur au bon moment ? Réponds vrai ou faux, sans détour.",
  "Ta réaction sincère si quelqu'un filmait (avec ton accord) et la vidéo fuyait ? Réponds vrai ou faux, sans détour.",
  "Ta réaction sincère si on te chuchotait le mot sale au milieu d'un diner de famille ? Réponds vrai ou faux, sans détour.",
  "Ta réaction sincère si la personne de tes rêves disait « je suis à toi ce soir » ? Réponds vrai ou faux, sans détour.",
  "Ta réaction sincère si on te demandait de géminer le prénom de quelqu'un d'ici ? Réponds vrai ou faux, sans détour.",
  "Ta réaction sincère si le groupe décidait ta tenue pour un rencard chaud ? Réponds vrai ou faux, sans détour.",
  "Ta réaction sincère si on te proposait une nuit d'hôtel avec la personne en face ? Réponds vrai ou faux, sans détour.",
  "Ta réaction sincère si quelqu'un te prenait la main et la posait sur sa cuisse ? Réponds vrai ou faux, sans détour.",
  "Ta réaction sincère si on te demandait ton chiffre réel devant tes parents ? Réponds vrai ou faux, sans détour.",
  "Ta réaction sincère si la personne à ta droite se penchait à ton oreille maintenant ? Réponds vrai ou faux, sans détour.",
  "Ta réaction sincère si on te demandait d'écrire ton sexto le plus osé en public ? Réponds vrai ou faux, sans détour.",
  "Ta réaction sincère si ton crush de toujours disait oui à tout ce soir ? Réponds vrai ou faux, sans détour.",
  "Ta réaction sincère si on te proposait un week-end complet sans règles ? Réponds vrai ou faux, sans détour.",
  "Ta réaction sincère si on te montrait la photo la plus chaude de ton/ta ex ? Réponds vrai ou faux, sans détour.",
  "Ta réaction sincère si quelqu'un d'ici avouait penser à toi en se touchant ? Réponds vrai ou faux, sans détour.",
  "Ta réaction sincère si le groupe te forçait à choisir : jamais de baise ou jamais d'amour ? Réponds vrai ou faux, sans détour.",
  "Ta réaction sincère si on t'enfermait 2 heures avec la personne la plus chaude d'ici ? Réponds vrai ou faux, sans détour.",
  "Ta réaction sincère si on te demandait de refaire ta meilleure nuit en direct audio ? Réponds vrai ou faux, sans détour.",
  "Ton secret le plus lourd sur : la personne interdite à qui tu as pensé hier soir. Le groupe jure de se taire.",
  "Ton secret le plus lourd sur : le plan que tu as caché à tout le monde jusqu'ici. Le groupe jure de se taire.",
  "Ton secret le plus lourd sur : la chose que tu as faite seule(se) en pensant à quelqu'un d'ici. Le groupe jure de se taire.",
  "Ton secret le plus lourd sur : le message que tu as supprimé par honte. Le groupe jure de se taire.",
  "Ton secret le plus lourd sur : la photo que tu gardes et que personne ne doit voir. Le groupe jure de se taire.",
  "Ton secret le plus lourd sur : le lieu où tu as eu la plus grosse envie de ta vie. Le groupe jure de se taire.",
  "Ton secret le plus lourd sur : la chose que tu as faite pour un(e) ex et jamais avouée. Le groupe jure de se taire.",
  "Ton secret le plus lourd sur : le mensonge le plus gros dit au lit. Le groupe jure de se taire.",
  "Ton secret le plus lourd sur : le prénom que tu as gémi en pensant à un(e) autre. Le groupe jure de se taire.",
  "Ton secret le plus lourd sur : la chose que ton corps a faite sans ta permission. Le groupe jure de se taire.",
  "Ton secret le plus lourd sur : le rapport que tu as arrêté et le vrai pourquoi. Le groupe jure de se taire.",
  "Ton secret le plus lourd sur : la personne que tu as fait attendre trop longtemps. Le groupe jure de se taire.",
  "Ton secret le plus lourd sur : la promesse cochonne que tu n'as pas tenue. Le groupe jure de se taire.",
  "Ton secret le plus lourd sur : la nuit dont tu as changé tous les détails en la racontant. Le groupe jure de se taire.",
  "Ton secret le plus lourd sur : la chose que tu as testée seule(se) avant d'oser le dire. Le groupe jure de se taire.",
  "Ton secret le plus lourd sur : le jouet ou l'objet que tu caches encore. Le groupe jure de se taire.",
  "Ton secret le plus lourd sur : la vidéo ou la photo jamais montrée. Le groupe jure de se taire.",
  "Ton secret le plus lourd sur : le plan qui a failli tout casser avec tes amis. Le groupe jure de se taire.",
  "Ton secret le plus lourd sur : la chose que tu as acceptée juste pour la curiosité. Le groupe jure de se taire.",
  "Ton secret le plus lourd sur : le fantasme lié à quelqu'un de ta famille éloignée ou d'un cercle interdit. Le groupe jure de se taire.",
  "Ton secret le plus lourd sur : le son que tu refais tout seul(se) en te rappelant une nuit. Le groupe jure de se taire.",
  "Ton secret le plus lourd sur : la chose que tu as faite dans le noir que personne ne sait. Le groupe jure de se taire.",
  "Ton secret le plus lourd sur : la raison exacte d'une fuite à l'aube. Le groupe jure de se taire.",
  "Ton secret le plus lourd sur : le mot que tu as inventé pour cacher ta jouissance. Le groupe jure de se taire.",
  "Ton secret le plus lourd sur : la chose que tu as dite uniquement pour exciter et qui a trop marché. Le groupe jure de se taire.",
  "Ton secret le plus lourd sur : le profil secret que tu as utilisé pour draguer. Le groupe jure de se taire.",
  "Ton secret le plus lourd sur : la chose que tu as volée comme souvenir de nuit. Le groupe jure de se taire.",
  "Ton secret le plus lourd sur : le lieu où tu t'es touché(e) en public sans te faire prendre. Le groupe jure de se taire.",
  "Ton secret le plus lourd sur : la chose que tu as envoyée à la mauvaise personne et la suite. Le groupe jure de se taire.",
  "Ton secret le plus lourd sur : le souvenir que tu rejoues en boucle depuis des mois. Le groupe jure de se taire.",
  "Tu recommencerais avec les glaçons sur la peau chaude ? Pourquoi ?",
  "C'est quoi ton avis sur les quêtes d'orgasme simultané ? Sois honnête.",
  "Qu'est-ce qui change avec les morsures jusqu'aux marques selon la personne ?",
  "Ton record avec les cris sans voisin pour juger ? Le groupe demande le chiffre.",
  "C'est quoi ton avis sur les chevilles attachées ? Sois honnête.",
  "Ton pire souvenir avec les envies exprimées sans honte ? Raconte.",
  "les douches qui brûlent la peau : oui, non, ou tu rêves ?",
  "Tu recommencerais avec les dominations totales ? Pourquoi ?",
  "Tu recommencerais avec les promesses cochonnes tenues ? Pourquoi ?",
  "Qu'est-ce qui change avec les huiles partout selon la personne ?",
  "C'est quoi ton meilleur souvenir avec les douches qui brûlent la peau ?",
  "C'est quoi ton avis sur les mains liées dans le dos ? Sois honnête.",
  "C'est quoi ton avis sur les morsures jusqu'aux marques ? Sois honnête.",
  "les marques visibles au bureau : oui, non, ou tu rêves ?",
  "Qu'est-ce qui change avec les corps qu'on redemande selon la personne ?",
  "Qu'est-ce qui change avec les ordres obéis sans question selon la personne ?",
  "Ton record avec les transpirations partagées ? Le groupe demande le chiffre.",
  "C'est quoi ton meilleur souvenir avec les défis de 24 h au lit ?",
  "Tu recommencerais avec les nuits qui marquent une vie ? Pourquoi ?",
  "C'est quoi ton avis sur les contacts dans la foule ? Sois honnête.",
  "C'est quoi ton meilleur souvenir avec les films maison ?",
  "Ton record avec les films maison ? Le groupe demande le chiffre.",
  "Ton record avec les glaçons sur la peau chaude ? Le groupe demande le chiffre.",
  "Ton pire souvenir avec les quêtes d'orgasme simultané ? Raconte.",
  "C'est quoi ton avis sur les griffures profondes ? Sois honnête.",
  "Qu'est-ce qui change avec les soirs où tout est permis selon la personne ?",
  "les murs qui tremblent : oui, non, ou tu rêves ?",
  "les interdits qu'on franchit enfin : oui, non, ou tu rêves ?",
  "les fantasmes à trois : oui, non, ou tu rêves ?",
  "les contacts dans la foule : oui, non, ou tu rêves ?",
  "les mains liées dans le dos : oui, non, ou tu rêves ?",
  "Ton record avec les corps offerts ? Le groupe demande le chiffre.",
  "As-tu déjà testé les ordres obéis sans question ? Raconte.",
  "Ton record avec les orgasmes multiples ? Le groupe demande le chiffre.",
  "C'est quoi ton meilleur souvenir avec les cris sans voisin pour juger ?",
  "C'est quoi ton avis sur les secrets jamais racontés ? Sois honnête.",
  "Qu'est-ce qui change avec les positions du Kamasutra non testées selon la personne ?",
  "C'est quoi ton avis sur les films maison ? Sois honnête.",
  "As-tu déjà testé les plages de rêve sans vêtements ? Raconte.",
  "les envies exprimées sans honte : oui, non, ou tu rêves ?",
  "Qu'est-ce qui change avec les murs qui tremblent selon la personne ?",
  "C'est quoi ton meilleur souvenir avec les ordres obéis sans question ?",
  "Ton record avec les morsures jusqu'aux marques ? Le groupe demande le chiffre.",
  "C'est quoi ton avis sur les yeux bandés toute la nuit ? Sois honnête.",
  "Ton record avec les réveils de 4 h du matin ? Le groupe demande le chiffre.",
  "Qu'est-ce qui change avec les douches qui brûlent la peau selon la personne ?",
  "As-tu déjà testé les huiles partout ? Raconte.",
  "Ton pire souvenir avec les fellations mémorables ? Raconte.",
  "Ton record avec les huiles partout ? Le groupe demande le chiffre.",
  "Ton pire souvenir avec les dominations totales ? Raconte.",
  "les langues expertes : oui, non, ou tu rêves ?",
  "As-tu déjà testé les promesses cochonnes tenues ? Raconte.",
  "les matelas qui tombent : oui, non, ou tu rêves ?",
  "Ton record avec les contacts dans la foule ? Le groupe demande le chiffre.",
  "As-tu déjà testé les yeux bandés toute la nuit ? Raconte.",
  "Ton pire souvenir avec les morsures jusqu'aux marques ? Raconte.",
  "C'est quoi ton avis sur les fantasmes à trois ? Sois honnête.",
  "C'est quoi ton avis sur les soirées sans aucun sommeil ? Sois honnête.",
  "Qu'est-ce qui change avec les films maison selon la personne ?",
  "C'est quoi ton avis sur les huiles partout ? Sois honnête.",
  "Qu'est-ce qui change avec les fessées assumées selon la personne ?",
  "As-tu déjà testé les films maison ? Raconte.",
  "Ton pire souvenir avec les huiles partout ? Raconte.",
  "Qu'est-ce qui change avec les interdits qu'on franchit enfin selon la personne ?",
  "Tu recommencerais avec les griffures profondes ? Pourquoi ?",
  "C'est quoi ton meilleur souvenir avec les nudes archivés ?",
  "les dominations totales : oui, non, ou tu rêves ?",
  "Ton record avec les secrets jamais racontés ? Le groupe demande le chiffre.",
  "Tu recommencerais avec les matelas qui tombent ? Pourquoi ?",
  "Tu recommencerais avec les quêtes d'orgasme simultané ? Pourquoi ?",
  "Qu'est-ce qui change avec les fellations mémorables selon la personne ?",
  "Tu recommencerais avec les yeux bandés toute la nuit ? Pourquoi ?",
  "les huiles partout : oui, non, ou tu rêves ?",
  "Qu'est-ce qui change avec les cris sans voisin pour juger selon la personne ?",
  "Ton record avec les fessées jusqu'au rouge ? Le groupe demande le chiffre.",
  "les orgasmes multiples : oui, non, ou tu rêves ?",
  "C'est quoi ton meilleur souvenir avec les fessées jusqu'au rouge ?",
  "Ton record avec les mains liées dans le dos ? Le groupe demande le chiffre.",
  "C'est quoi ton meilleur souvenir avec les gémissements profonds ?",
  "Tu recommencerais avec les fessées jusqu'au rouge ? Pourquoi ?",
  "As-tu déjà testé les fellations mémorables ? Raconte.",
  "C'est quoi ton meilleur souvenir avec les griffures profondes ?",
  "Ton pire souvenir avec les transpirations partagées ? Raconte.",
  "les piscines sans maillot : oui, non, ou tu rêves ?",
  "Tu recommencerais avec les plages de rêve sans vêtements ? Pourquoi ?",
  "C'est quoi ton avis sur les corps qu'on redemande ? Sois honnête.",
  "les réveils de 4 h du matin : oui, non, ou tu rêves ?",
  "C'est quoi ton meilleur souvenir avec les soirs où tout est permis ?",
  "Tu recommencerais avec les réveils de 4 h du matin ? Pourquoi ?",
  "C'est quoi ton meilleur souvenir avec les promesses cochonnes tenues ?",
  "Tu recommencerais avec les mains liées dans le dos ? Pourquoi ?",
  "Tu recommencerais avec les murs qui tremblent ? Pourquoi ?",
  "C'est quoi ton avis sur les douches qui brûlent la peau ? Sois honnête.",
  "les chevilles attachées : oui, non, ou tu rêves ?",
  "C'est quoi ton avis sur les défis de 24 h au lit ? Sois honnête.",
  "As-tu déjà testé les corps offerts ? Raconte.",
  "Tu recommencerais avec les fessées assumées ? Pourquoi ?",
  "C'est quoi ton meilleur souvenir avec les balcons entièrement nus ?",
  "Ton record avec les corps qu'on redemande ? Le groupe demande le chiffre.",
  "les transpirations partagées : oui, non, ou tu rêves ?",
  "les fessées jusqu'au rouge : oui, non, ou tu rêves ?",
  "les corps offerts : oui, non, ou tu rêves ?",
  "Ton record avec les liens et les menottes ? Le groupe demande le chiffre.",
  "C'est quoi ton meilleur souvenir avec les échanges de partenaires ?",
  "Ton pire souvenir avec les orgasmes multiples ? Raconte.",
  "Qu'est-ce qui change avec les draps déchirés selon la personne ?",
  "As-tu déjà testé les fessées jusqu'au rouge ? Raconte.",
  "C'est quoi ton avis sur les ordres obéis sans question ? Sois honnête.",
  "As-tu déjà testé les murs qui tremblent ? Raconte.",
  "Tu recommencerais avec les orgasmes multiples ? Pourquoi ?",
  "As-tu déjà testé les jouets bruyants ? Raconte.",
  "C'est quoi ton meilleur souvenir avec les mains liées dans le dos ?",
  "As-tu déjà testé les mains liées dans le dos ? Raconte.",
  "Qu'est-ce qui change avec les nudes archivés selon la personne ?",
  "C'est quoi ton meilleur souvenir avec les quêtes d'orgasme simultané ?",
  "les nudes archivés : oui, non, ou tu rêves ?",
  "Ton pire souvenir avec les interdits qu'on franchit enfin ? Raconte.",
  "Qu'est-ce qui change avec les contacts dans la foule selon la personne ?",
  "As-tu déjà testé les gémissements profonds ? Raconte.",
  "As-tu déjà testé les corps qu'on redemande ? Raconte.",
  "Tu recommencerais avec les morsures jusqu'aux marques ? Pourquoi ?",
  "C'est quoi ton meilleur souvenir avec les yeux bandés toute la nuit ?",
  "les positions du Kamasutra non testées : oui, non, ou tu rêves ?",
  "Ton record avec les jouets bruyants ? Le groupe demande le chiffre.",
  "Qu'est-ce qui change avec les chevilles attachées selon la personne ?",
  "Tu recommencerais avec les reprises après 10 minutes ? Pourquoi ?",
  "As-tu déjà testé les interdits qu'on franchit enfin ? Raconte.",
  "Ton pire souvenir avec les marques visibles au bureau ? Raconte.",
  "Qu'est-ce qui change avec les secrets jamais racontés selon la personne ?",
  "As-tu déjà testé les mots les plus sales ? Raconte.",
  "Ton record avec les piscines sans maillot ? Le groupe demande le chiffre.",
  "Qu'est-ce qui change avec les griffures profondes selon la personne ?",
  "C'est quoi ton avis sur les plages de rêve sans vêtements ? Sois honnête.",
  "Ton record avec les fessées assumées ? Le groupe demande le chiffre.",
  "C'est quoi ton meilleur souvenir avec les marques visibles au bureau ?",
  "Qu'est-ce qui change avec les fessées jusqu'au rouge selon la personne ?",
  "les films maison : oui, non, ou tu rêves ?",
  "Tu recommencerais avec les douches qui brûlent la peau ? Pourquoi ?",
  "Ton record avec les chevilles attachées ? Le groupe demande le chiffre.",
  "C'est quoi ton meilleur souvenir avec les plages de rêve sans vêtements ?",
  "les corps qu'on redemande : oui, non, ou tu rêves ?",
  "As-tu déjà testé les liens et les menottes ? Raconte.",
  "Qu'est-ce qui change avec les mains liées dans le dos selon la personne ?",
  "As-tu déjà testé les cunnilingus interminables ? Raconte.",
  "Ton record avec les plages de rêve sans vêtements ? Le groupe demande le chiffre.",
  "Tu recommencerais avec les envies exprimées sans honte ? Pourquoi ?",
  "C'est quoi ton meilleur souvenir avec les huiles partout ?",
  "Ton record avec les mots les plus sales ? Le groupe demande le chiffre.",
  "Ton record avec les nudes archivés ? Le groupe demande le chiffre.",
  "C'est quoi ton avis sur les cunnilingus interminables ? Sois honnête.",
  "C'est quoi ton avis sur les liens et les menottes ? Sois honnête.",
  "Tu recommencerais avec les défis de 24 h au lit ? Pourquoi ?",
  "C'est quoi ton avis sur les gémissements profonds ? Sois honnête.",
  "Ton pire souvenir avec les jouets bruyants ? Raconte.",
  "Tu recommencerais avec les positions du Kamasutra non testées ? Pourquoi ?",
  "Ton record avec les griffures profondes ? Le groupe demande le chiffre.",
  "Ton record avec les envies exprimées sans honte ? Le groupe demande le chiffre.",
  "C'est quoi ton meilleur souvenir avec les matelas qui tombent ?",
  "C'est quoi ton meilleur souvenir avec les contacts dans la foule ?",
  "les soirs où tout est permis : oui, non, ou tu rêves ?",
  "Tu recommencerais avec les piscines sans maillot ? Pourquoi ?",
  "As-tu déjà testé les dominations totales ? Raconte.",
  "As-tu déjà testé les soirs où tout est permis ? Raconte.",
  "As-tu déjà testé les matelas qui tombent ? Raconte.",
  "C'est quoi ton avis sur les langues expertes ? Sois honnête.",
  "les glaçons sur la peau chaude : oui, non, ou tu rêves ?",
  "Tu recommencerais avec les cunnilingus interminables ? Pourquoi ?",
  "C'est quoi ton avis sur les draps déchirés ? Sois honnête.",
  "As-tu déjà testé les réveils de 4 h du matin ? Raconte.",
  "As-tu déjà testé les griffures profondes ? Raconte.",
  "Tu recommencerais avec les contacts dans la foule ? Pourquoi ?",
  "C'est quoi ton avis sur les marques visibles au bureau ? Sois honnête.",
  "C'est quoi ton meilleur souvenir avec les soirées sans aucun sommeil ?",
  "Ton pire souvenir avec les défis de 24 h au lit ? Raconte.",
  "As-tu déjà testé les contacts dans la foule ? Raconte.",
  "Ton record avec les gémissements profonds ? Le groupe demande le chiffre.",
  "C'est quoi ton meilleur souvenir avec les langues expertes ?",
  "As-tu déjà testé les défis de 24 h au lit ? Raconte.",
  "C'est quoi ton meilleur souvenir avec les corps qu'on redemande ?",
  "C'est quoi ton meilleur souvenir avec les glaçons sur la peau chaude ?",
  "Ton pire souvenir avec les murs qui tremblent ? Raconte.",
  "Tu recommencerais avec les secrets jamais racontés ? Pourquoi ?",
  "Ton record avec les soirs où tout est permis ? Le groupe demande le chiffre.",
  "C'est quoi ton avis sur les balcons entièrement nus ? Sois honnête.",
  "C'est quoi ton avis sur les jouets bruyants ? Sois honnête.",
  "Ton record avec les séries de rounds sans pause ? Le groupe demande le chiffre.",
  "C'est quoi ton avis sur les dominations totales ? Sois honnête.",
  "Qu'est-ce qui change avec les séries de rounds sans pause selon la personne ?",
  "As-tu déjà testé les fessées assumées ? Raconte.",
  "As-tu déjà testé les morsures jusqu'aux marques ? Raconte.",
  "Tu recommencerais avec les langues expertes ? Pourquoi ?",
  "Ton record avec les fantasmes à trois ? Le groupe demande le chiffre.",
  "Ton pire souvenir avec les positions du Kamasutra non testées ? Raconte.",
  "Tu recommencerais avec les balcons entièrement nus ? Pourquoi ?",
  "les plages de rêve sans vêtements : oui, non, ou tu rêves ?",
  "Ton record avec les langues expertes ? Le groupe demande le chiffre.",
  "Ton record avec les dominations totales ? Le groupe demande le chiffre.",
  "Ton pire souvenir avec les matelas qui tombent ? Raconte.",
  "As-tu déjà testé les soirées sans aucun sommeil ? Raconte.",
  "As-tu déjà testé les quêtes d'orgasme simultané ? Raconte.",
  "C'est quoi ton avis sur les nuits qui marquent une vie ? Sois honnête.",
  "Qu'est-ce qui change avec les cunnilingus interminables selon la personne ?",
  "Ton pire souvenir avec les glaçons sur la peau chaude ? Raconte.",
  "Qu'est-ce qui change avec les jeux de rôle intimes selon la personne ?",
  "Qu'est-ce qui change avec les promesses cochonnes tenues selon la personne ?",
  "les griffures profondes : oui, non, ou tu rêves ?",
  "C'est quoi ton avis sur les séries de rounds sans pause ? Sois honnête.",
  "C'est quoi ton meilleur souvenir avec les interdits qu'on franchit enfin ?",
  "Ton pire souvenir avec les fessées jusqu'au rouge ? Raconte.",
  "C'est quoi ton avis sur les murs qui tremblent ? Sois honnête.",
  "C'est quoi ton meilleur souvenir avec les chevilles attachées ?",
  "Tu recommencerais avec les transpirations partagées ? Pourquoi ?",
  "Tu recommencerais avec les mots les plus sales ? Pourquoi ?",
  "les morsures jusqu'aux marques : oui, non, ou tu rêves ?",
  "C'est quoi ton meilleur souvenir avec les positions du Kamasutra non testées ?",
  "C'est quoi ton meilleur souvenir avec les nuits qui marquent une vie ?",
  "Qu'est-ce qui change avec les piscines sans maillot selon la personne ?",
  "As-tu déjà testé les fantasmes à trois ? Raconte.",
  "les soirées sans aucun sommeil : oui, non, ou tu rêves ?",
  "Qu'est-ce qui change avec les liens et les menottes selon la personne ?",
  "Tu recommencerais avec les films maison ? Pourquoi ?",
  "Tu recommencerais avec les fellations mémorables ? Pourquoi ?",
  "Qu'est-ce qui change avec les plages de rêve sans vêtements selon la personne ?",
  "Qu'est-ce qui change avec les orgasmes multiples selon la personne ?",
  "les liens et les menottes : oui, non, ou tu rêves ?",
  "C'est quoi ton avis sur les transpirations partagées ? Sois honnête.",
  "C'est quoi ton avis sur les mots les plus sales ? Sois honnête.",
  "C'est quoi ton avis sur les réveils de 4 h du matin ? Sois honnête.",
  "C'est quoi ton avis sur les cris sans voisin pour juger ? Sois honnête.",
  "Qu'est-ce qui change avec les nuits qui marquent une vie selon la personne ?",
  "Ton pire souvenir avec les draps déchirés ? Raconte.",
  "C'est quoi ton avis sur les piscines sans maillot ? Sois honnête.",
  "les gémissements profonds : oui, non, ou tu rêves ?",
  "C'est quoi ton avis sur les envies exprimées sans honte ? Sois honnête.",
  "Ton record avec les yeux bandés toute la nuit ? Le groupe demande le chiffre.",
  "C'est quoi ton meilleur souvenir avec les orgasmes multiples ?",
  "Ton record avec les fellations mémorables ? Le groupe demande le chiffre.",
  "As-tu déjà testé les nudes archivés ? Raconte.",
  "As-tu déjà testé les reprises après 10 minutes ? Raconte.",
  "les ordres obéis sans question : oui, non, ou tu rêves ?",
  "Ton record avec les marques visibles au bureau ? Le groupe demande le chiffre.",
  "Ton record avec les matelas qui tombent ? Le groupe demande le chiffre.",
  "As-tu déjà testé les échanges de partenaires ? Raconte.",
  "Tu recommencerais avec les ordres obéis sans question ? Pourquoi ?",
  "Qu'est-ce qui change avec les corps offerts selon la personne ?",
  "Ton record avec les draps déchirés ? Le groupe demande le chiffre.",
  "Qu'est-ce qui change avec les réveils de 4 h du matin selon la personne ?",
  "As-tu déjà testé les envies exprimées sans honte ? Raconte.",
  "Ton record avec les balcons entièrement nus ? Le groupe demande le chiffre.",
  "Tu recommencerais avec les corps qu'on redemande ? Pourquoi ?",
  "les cris sans voisin pour juger : oui, non, ou tu rêves ?",
  "les fessées assumées : oui, non, ou tu rêves ?",
  "Ton pire souvenir avec les plages de rêve sans vêtements ? Raconte.",
  "As-tu déjà testé les langues expertes ? Raconte.",
  "Ton record avec les murs qui tremblent ? Le groupe demande le chiffre.",
  "C'est quoi ton avis sur les reprises après 10 minutes ? Sois honnête.",
  "Ton pire souvenir avec les contacts dans la foule ? Raconte.",
  "Ton pire souvenir avec les séries de rounds sans pause ? Raconte.",
  "Ton pire souvenir avec les liens et les menottes ? Raconte.",
  "As-tu déjà testé les orgasmes multiples ? Raconte.",
  "Ton pire souvenir avec les échanges de partenaires ? Raconte."
],
    action: [
  "Envoie un vocal de 20 secondes décrivant ce que tu ferais ce soir à la personne de ton choix ici. Sans censure.",
  "Décris en détail, à voix haute, ton dernier rapport. Le groupe juge les détails.",
  "Fais un strip COMPLET, cam ouverte. 30 secondes chrono.",
  "Gémis de la manière la plus réaliste possible pendant 10 secondes. Le groupe note sur 10.",
  "Envoie une photo de ta tenue complète du moment. Le groupe évalue la chaleur.",
  "Chuchote à la caméra le mot sale qui t'excite le plus. Prononce-le 3 fois.",
  "Mime la position que tu rêves de tester. Aucune censure, mimes réalistes.",
  "Décris ce que tu ferais à la personne en face si vous étiez seuls. 20 secondes.",
  "Envoie un vocal où tu gémins le prénom du joueur de ton choix. 5 fois de suite.",
  "Montre la zone de ton corps la plus sensible en la désignant précisément.",
  "Fais deviner ton fantasme le plus fou avec 3 mots-indices. 2 essais au groupe.",
  "Décris ton dernier rêve X comme un commentaire de match. Score final inclus.",
  "Envoie un message vocal : « je suis ton plan ce soir » en ta meilleure voix.",
  "Mime comment tu enlèverais la chemise de quelqu'un. Sans la chemise de quelqu'un.",
  "Décris ton corps préféré chez l'autre en le traçant sur le tien. Partie par partie.",
  "Fais 20 secondes de simulation complète du « à côté de toi ». Coussin obligatoire.",
  "Envoie un vocal où tu répètes « là, tout de suite » en montant à chaque fois.",
  "Raconte ta meilleure nuit comme une recette : ingrédients, temps de cuisson, dégustation.",
  "Chante un slow en remplaçant chaque mot par « baise-moi » version radio famille (essaie).",
  "Mime le massage complet de la personne en face : dos, épaules, puis plus bas (mimes).",
  "Décris ton niveau ce soir sur 10 et prouve-le avec un regard de 10 secondes.",
  "Envoie ta plus belle pose de lit en photo. Le groupe note la chaleur sur 10.",
  "Imite le son exact que fait ton lit quand tu y vas fort.",
  "Décris l'ordre exact dans lequel tu enlèverais les vêtements de la personne en face.",
  "Fais deviner le mot sale de ta vie en mimes uniquement. 3 essais au groupe.",
  "Envoie un vocal où tu souffles puis gémis puis souffles. Rythme imposé : 5 secondes.",
  "Décris la première minute parfaite avec la personne de tes rêves. Minute par minute.",
  "Mime ta technique signature avec la langue. Le groupe a les yeux bandés (blague).",
  "Envoie un vocal en mode répondeur : « le plan est annulé » ta plus grande déception.",
  "Chuchote la promesse cochonne que tu ferais pour une nuit inoubliable.",
  "Décris comment tu embrasses le cou en traçant ton chemin avec ton doigt.",
  "Fais une météo du désir : annonce la chaleur du salon et le taux d'humidité.",
  "Envoie un vocal où tu comptes tes 3 zones favorites en les nommant.",
  "Mime le moment où tu perds le contrôle. 10 secondes de théâtre pur.",
  "Décris ta technique pour faire mouiller ou durcir en une phrase de 10 mots.",
  "Envoie un vocal : « viens chez moi maintenant » version menaçante adorable.",
  "Prends la pose exacte de ta nuit la plus sauvage. 10 secondes, immobile.",
  "Décris le parfum que tu porterais ce soir et où tu voudrais qu'il soit senti.",
  "Mime un baiser qui descend : front, joue, cou... jusqu'à ce que le groupe crie stop.",
  "Envoie un vocal où tu fais le test : soupir, gémissement, cri. 3 niveaux.",
  "Décris ce que tu regardes en premier chez un corps nu en traçant l'ordre avec ton doigt.",
  "Fais deviner ta position de prédilection avec un seul son répété. 2 essais.",
  "Envoie un message au joueur de ton choix : décris-lui sa plus belle qualité physique.",
  "Chante « encore » comme un refrain de mariage avec une gestuelle complète.",
  "Mime la scène exacte de ta première fois. Le groupe devine l'année.",
  "Décris ton plan parfait à trois : qui, où, quel ordre. En supposant tout le monde d'accord.",
  "Envoie un vocal de 15 secondes : ton meilleur bruit de fin, version longue.",
  "Décris la tenue de nuit que tu mettrais ce soir et ce qu'elle laisserait voir.",
  "Mime comment tu tiendrais quelqu'un contre le mur. Coussin à la place de la personne.",
  "Envoie un vocal où tu expliques pourquoi tu es dangereux(se) ce soir.",
  "Envoie un vocal où tu gémis le prénom d'un joueur comme si tu étais au sommet. 20 secondes. Zéro censure.",
  "Envoie un vocal où tu décris ce que ta langue ferait en premier. 20 secondes. Zéro censure.",
  "Envoie un vocal où tu chuchotes l'ordre la plus sale que tu oses donner. 20 secondes. Zéro censure.",
  "Envoie un vocal où tu racontes ta dernière baise en mode audio-book sensuel. 20 secondes. Zéro censure.",
  "Envoie un vocal où tu répètes « plus fort » de 5 façons différentes. 20 secondes. Zéro censure.",
  "Envoie un vocal où tu imites ton bruit de fin, version intégrale. 20 secondes. Zéro censure.",
  "Envoie un vocal où tu décris la bite ou la chatte parfaite selon toi, sans détour. 20 secondes. Zéro censure.",
  "Envoie un vocal où tu fais deviner ta position par des sons uniquement. 20 secondes. Zéro censure.",
  "Envoie un vocal où tu chuchotes « je mouille » ou « je bande » avec ta meilleure intonation. 20 secondes. Zéro censure.",
  "Envoie un vocal où tu racontes ce que tu ferais avec 30 minutes et la personne en face. 20 secondes. Zéro censure.",
  "Envoie un vocal où tu décris ton préliminaire préféré comme un coach sportif. 20 secondes. Zéro censure.",
  "Envoie un vocal où tu imites un rapport téléphonique complet avec la personne fictive en face. 20 secondes. Zéro censure.",
  "Envoie un vocal où tu chuchotes ta promesse si on te donne la personne de ton choix ce soir. 20 secondes. Zéro censure.",
  "Envoie un vocal où tu décris la marque que tu laisserais et où exactement. 20 secondes. Zéro censure.",
  "Envoie un vocal où tu répètes « baise-moi » version chuchotée puis version criée. 20 secondes. Zéro censure.",
  "Envoie un vocal où tu racontes la scène exacte de ta nuit de rêve : minute par minute. 20 secondes. Zéro censure.",
  "Envoie un vocal où tu imites le réveil parfait : soupir, étirement, main qui cherche. 20 secondes. Zéro censure.",
  "Envoie un vocal où tu décris le goût que tu préfères ou que tu cherches encore. 20 secondes. Zéro censure.",
  "Envoie un vocal où tu chuchotes ce que tu ferais si le groupe éteignait la lumière maintenant. 20 secondes. Zéro censure.",
  "Envoie un vocal où tu décris la première chose que tu regardes quand un(e) partenaire se déshabille. 20 secondes. Zéro censure.",
  "Envoie un vocal où tu imites l'appel de 2 h du matin le plus direct de ta vie. 20 secondes. Zéro censure.",
  "Envoie un vocal où tu fais la météo de ton corps ce soir : températures locales. 20 secondes. Zéro censure.",
  "Envoie un vocal où tu racontes ton meilleur coup en 20 secondes chrono. 20 secondes. Zéro censure.",
  "Envoie un vocal où tu décris comment tu serres les draps quand c'est trop bon. 20 secondes. Zéro censure.",
  "Envoie un vocal où tu chuchotes le secret que tu ne dirais jamais à voix haute normalement. 20 secondes. Zéro censure.",
  "Envoie un vocal où tu imites ta respiration du début, du milieu et de la fin. 20 secondes. Zéro censure.",
  "Envoie un vocal où tu décris l'endroit exact où tu voudrais être mordu(e) maintenant. 20 secondes. Zéro censure.",
  "Envoie un vocal où tu racontes la nuit que tu referais sans changer un seul geste. 20 secondes. Zéro censure.",
  "Envoie un vocal où tu décris l'orgasme parfait selon toi comme un musicien décrit un accord. 20 secondes. Zéro censure.",
  "Envoie un vocal où tu chuchotes « après ce message, tu penses à moi toute la nuit ». 20 secondes. Zéro censure.",
  "Envoie un vocal où tu imites ta tête ET ta voix quand tu demandes pardon après une bêtise chaude. 20 secondes. Zéro censure.",
  "Envoie un vocal où tu décris la main parfaite : force, vitesse, destination. 20 secondes. Zéro censure.",
  "Envoie un vocal où tu fais l'annonce radio : « ce soir, un seul gagnant… ». 20 secondes. Zéro censure.",
  "Envoie un vocal où tu racontes la fois où tu as dû te taire à tout prix : l'histoire du silence. 20 secondes. Zéro censure.",
  "Envoie un vocal où tu décris la tenue de nuit parfaite et ce qu'elle cacherait encore. 20 secondes. Zéro censure.",
  "Fais un strip complet jusqu'à ta limite, 30 secondes chrono, cam ouverte. Le groupe note sur 10.",
  "Fais un lap dance comme si la personne désirée était sur la chaise, cam ouverte. Le groupe note sur 10.",
  "Fais le mime intégral de ta position favorite, cam ouverte. Le groupe note sur 10.",
  "Fais la démonstration complète de ton baiser : lent, moyen, sauvage, cam ouverte. Le groupe note sur 10.",
  "Fais le regard qui monte du visage aux pieds et remonte, 10 secondes, cam ouverte. Le groupe note sur 10.",
  "Fais le mime du « mur » : tu prends quelqu'un d'imaginaire contre le mur, cam ouverte. Le groupe note sur 10.",
  "Fais la marche de fin de nuit : démarche complète avec sourire, cam ouverte. Le groupe note sur 10.",
  "Fais le mime du câlin possessif avec un coussin, 15 secondes, cam ouverte. Le groupe note sur 10.",
  "Fais le regard de fin : 10 secondes qui disent tout, cam ouverte. Le groupe note sur 10.",
  "Fais la démonstration de ta main dans tes cheveux puis sur ta nuque, cam ouverte. Le groupe note sur 10.",
  "Fais le mime de la ceinture arrachée, tension maximum, cam ouverte. Le groupe note sur 10.",
  "Fais la pose du matin après une nuit forte : étirement complet, cam ouverte. Le groupe note sur 10.",
  "Fais le mime du frisson complet quand on te souffle dans le cou, cam ouverte. Le groupe note sur 10.",
  "Fais la démonstration de ta façon de mordre ton propre poignet, cam ouverte. Le groupe note sur 10.",
  "Fais le mime du « chut » avec montée du regard, 10 secondes, cam ouverte. Le groupe note sur 10.",
  "Fais la démonstration du sourire qui pardonne tout, cam ouverte. Le groupe note sur 10.",
  "Fais le mime d'un baiser qui descend : front, joue, cou, stop au signal, cam ouverte. Le groupe note sur 10.",
  "Fais la pose du réveil de la personne qui ne veut pas partir, cam ouverte. Le groupe note sur 10.",
  "Fais le mime du vêtement qui glisse seul, 10 secondes, cam ouverte. Le groupe note sur 10.",
  "Fais la démonstration de ta façon de boire en fixant quelqu'un, cam ouverte. Le groupe note sur 10.",
  "Fais le mime du téléphone jeté parce que la personne est arrivée, cam ouverte. Le groupe note sur 10.",
  "Fais la pose « je t'attends depuis 20 minutes » version sexy, cam ouverte. Le groupe note sur 10.",
  "Fais le mime du soupir de soulagement le plus réaliste, cam ouverte. Le groupe note sur 10.",
  "Fais la démonstration du regard qui demande la permission, cam ouverte. Le groupe note sur 10.",
  "Fais le mime de la main qui glisse sous le drap (ton drap), cam ouverte. Le groupe note sur 10.",
  "Fais le regard de « dernière chance » avant de tourner la page, cam ouverte. Le groupe note sur 10.",
  "Fais le mime du câlin qui refuse de lâcher, 15 secondes, cam ouverte. Le groupe note sur 10.",
  "Fais la démonstration de ta respiration complète : début, montée, fin, cam ouverte. Le groupe note sur 10.",
  "Fais la pose exacte de ta meilleure photo jamais envoyée, cam ouverte. Le groupe note sur 10.",
  "Fais le mime du « viens » avec le doigt, version lente, cam ouverte. Le groupe note sur 10.",
  "Fais la démonstration du « surprise » : un câlin par derrière avec un coussin, cam ouverte. Le groupe note sur 10.",
  "Fais le mime de la porte fermée à clé : geste sec et regard, cam ouverte. Le groupe note sur 10.",
  "Fais le regard de « j'ai tout entendu » version voisin(e), cam ouverte. Le groupe note sur 10.",
  "Fais la pose du « c'est mon tour » : main tendue, regard fixe, cam ouverte. Le groupe note sur 10.",
  "Fais le mime du dernier baiser de la nuit : lent, long, coupé net, cam ouverte. Le groupe note sur 10.",
  "Écris ici, en public, sans filtre : ton sexto le plus osé jamais écrit. Le groupe valide ou tu recommences.",
  "Écris ici, en public, sans filtre : tout ce que tu ferais ce soir en 6 étapes chronologiques. Le groupe valide ou tu recommences.",
  "Écris ici, en public, sans filtre : la description brute de ton corps préféré. Le groupe valide ou tu recommences.",
  "Écris ici, en public, sans filtre : la phrase la plus sale de ton répertoire. Le groupe valide ou tu recommences.",
  "Écris ici, en public, sans filtre : ta nuit parfaite du coucher au lever, en 5 lignes. Le groupe valide ou tu recommences.",
  "Écris ici, en public, sans filtre : le compliment sexuel le plus direct au joueur de ton choix. Le groupe valide ou tu recommences.",
  "Écris ici, en public, sans filtre : la promesse cochonne que tu tiendras vraiment. Le groupe valide ou tu recommences.",
  "Écris ici, en public, sans filtre : le mot qui te fait dire oui en 1 seconde. Le groupe valide ou tu recommences.",
  "Écris ici, en public, sans filtre : la chose exacte que tu voudrais qu'on te fasse maintenant. Le groupe valide ou tu recommences.",
  "Écris ici, en public, sans filtre : le message qui ferait craquer même un(e) saint(e). Le groupe valide ou tu recommences.",
  "Écris ici, en public, sans filtre : ta technique signature en 3 phrases techniques. Le groupe valide ou tu recommences.",
  "Écris ici, en public, sans filtre : la description de ta marque de fiel favorite à laisser. Le groupe valide ou tu recommences.",
  "Écris ici, en public, sans filtre : le résumé de ta vie sexuelle en une phrase qui choque. Le groupe valide ou tu recommences.",
  "Écris ici, en public, sans filtre : le fantasme n°1 que tu cacherais à ton/ta partenaire de vie. Le groupe valide ou tu recommences.",
  "Écris ici, en public, sans filtre : la phrase de fin de nuit qui rend accro. Le groupe valide ou tu recommences.",
  "Écris ici, en public, sans filtre : le surnom cochonne que tu donnerais au joueur à ta droite. Le groupe valide ou tu recommences.",
  "Écris ici, en public, sans filtre : la chose que tu ferais pour un week-end avec la personne de tes rêves. Le groupe valide ou tu recommences.",
  "Écris ici, en public, sans filtre : le script complet de tes 60 premières secondes avec ta star préférée. Le groupe valide ou tu recommences.",
  "Écris ici, en public, sans filtre : la confession la plus crue jamais écrite dans ce salon. Le groupe valide ou tu recommences.",
  "Écris ici, en public, sans filtre : le mot que tu chuchoterais à l'oreille pour tout déclencher. Le groupe valide ou tu recommences.",
  "Décris à voix haute, sans détour : ta nuit la plus sauvage, acte par acte. 30 secondes. Le groupe écoute.",
  "Décris à voix haute, sans détour : le corps de tes rêves, zone par zone, de la tête aux pieds. 30 secondes. Le groupe écoute.",
  "Décris à voix haute, sans détour : ton meilleur coup : lieu, durée, bruit, fin. 30 secondes. Le groupe écoute.",
  "Décris à voix haute, sans détour : ta technique avec la langue comme un mode d'emploi. 30 secondes. Le groupe écoute.",
  "Décris à voix haute, sans détour : la façon exacte dont tu aimes jouir ou faire jouir. 30 secondes. Le groupe écoute.",
  "Décris à voix haute, sans détour : le plan à trois parfait : qui, où, dans quel ordre. 30 secondes. Le groupe écoute.",
  "Décris à voix haute, sans détour : le massage qui finit toujours au même endroit, étape par étape. 30 secondes. Le groupe écoute.",
  "Décris à voix haute, sans détour : ta première fois : lieu, âge, durée, verdict. 30 secondes. Le groupe écoute.",
  "Décris à voix haute, sans détour : le rapport le plus risqué de ta vie : lieu, danger, fin. 30 secondes. Le groupe écoute.",
  "Décris à voix haute, sans détour : ton réveil parfait : chaque minute, chaque geste. 30 secondes. Le groupe écoute.",
  "Décris à voix haute, sans détour : la nuit où tu as dit oui à tout : tout, tout, tout. 30 secondes. Le groupe écoute.",
  "Décris à voix haute, sans détour : la scène de film X qui t'a le plus marqué(e), image par image. 30 secondes. Le groupe écoute.",
  "Décris à voix haute, sans détour : le son le plus excitant du monde selon toi et pourquoi. 30 secondes. Le groupe écoute.",
  "Décris à voix haute, sans détour : la promesse que tu ferais pour la personne en face, à voix haute. 30 secondes. Le groupe écoute.",
  "Décris à voix haute, sans détour : la façon dont tu te touches : technique complète, pas de honte. 30 secondes. Le groupe écoute.",
  "Décris à voix haute, sans détour : le baiser parfait selon toi : durée, langue, mains, souffle. 30 secondes. Le groupe écoute.",
  "Décris à voix haute, sans détour : le vêtement que tu déchirerais en premier et pourquoi. 30 secondes. Le groupe écoute.",
  "Décris à voix haute, sans détour : ton rituel de séduction complet, du regard à la fin. 30 secondes. Le groupe écoute.",
  "Décris à voix haute, sans détour : la chose que tu n'as jamais osé demander et à qui. 30 secondes. Le groupe écoute.",
  "Décris à voix haute, sans détour : le plan idéal avec quelqu'un d'ici, en supposant que tout le monde accepte. 30 secondes. Le groupe écoute.",
  "Fais une pub de 15 secondes pour les huiles partout. Slogan obligatoire.",
  "Mime ta plus belle scène avec les reprises après 10 minutes. 15 secondes.",
  "Fais une pub de 15 secondes pour les corps qu'on redemande. Slogan obligatoire.",
  "Décris les matelas qui tombent comme un commentateur sportif. 20 secondes.",
  "Mime ta plus belle scène avec les liens et les menottes. 15 secondes.",
  "Fais une pub de 15 secondes pour les mots les plus sales. Slogan obligatoire.",
  "Imite quelqu'un qui découvre les huiles partout. Le groupe devine.",
  "Raconte ton meilleur souvenir avec les plages de rêve sans vêtements. 20 secondes.",
  "Montre le geste parfait pour les échanges de partenaires. 10 secondes.",
  "Montre le geste parfait pour les corps qu'on redemande. 10 secondes.",
  "Décris les soirs où tout est permis comme un commentateur sportif. 20 secondes.",
  "Raconte ton meilleur souvenir avec les films maison. 20 secondes.",
  "Fais deviner les envies exprimées sans honte en 3 mimes maximum.",
  "Fais deviner les douches qui brûlent la peau en 3 mimes maximum.",
  "Montre le geste parfait pour les mots les plus sales. 10 secondes.",
  "Mime ta plus belle scène avec les fessées jusqu'au rouge. 15 secondes.",
  "Raconte ton meilleur souvenir avec les ordres obéis sans question. 20 secondes.",
  "Décris les interdits qu'on franchit enfin comme un commentateur sportif. 20 secondes.",
  "Décris les réveils de 4 h du matin comme un commentateur sportif. 20 secondes.",
  "Décris les cunnilingus interminables comme un commentateur sportif. 20 secondes.",
  "Décris les langues expertes comme un commentateur sportif. 20 secondes.",
  "Fais une pub de 15 secondes pour les nudes archivés. Slogan obligatoire.",
  "Montre le geste parfait pour les séries de rounds sans pause. 10 secondes.",
  "Montre le geste parfait pour les jeux de rôle intimes. 10 secondes.",
  "Mime ta plus belle scène avec les échanges de partenaires. 15 secondes.",
  "Fais deviner les griffures profondes en 3 mimes maximum.",
  "Fais une pub de 15 secondes pour les balcons entièrement nus. Slogan obligatoire.",
  "Montre le geste parfait pour les quêtes d'orgasme simultané. 10 secondes.",
  "Fais deviner les fessées jusqu'au rouge en 3 mimes maximum.",
  "Montre le geste parfait pour les fantasmes à trois. 10 secondes.",
  "Décris les nudes archivés comme un commentateur sportif. 20 secondes.",
  "Imite quelqu'un qui découvre les langues expertes. Le groupe devine.",
  "Explique les fellations mémorables comme une notice de montage. 20 secondes.",
  "Mime ta plus belle scène avec les mots les plus sales. 15 secondes.",
  "Raconte ton meilleur souvenir avec les interdits qu'on franchit enfin. 20 secondes.",
  "Raconte ton meilleur souvenir avec les jouets bruyants. 20 secondes.",
  "Fais une pub de 15 secondes pour les cris sans voisin pour juger. Slogan obligatoire.",
  "Explique les films maison comme une notice de montage. 20 secondes.",
  "Montre le geste parfait pour les réveils de 4 h du matin. 10 secondes.",
  "Décris les morsures jusqu'aux marques comme un commentateur sportif. 20 secondes.",
  "Explique les matelas qui tombent comme une notice de montage. 20 secondes.",
  "Mime ta plus belle scène avec les jeux de rôle intimes. 15 secondes.",
  "Explique les cunnilingus interminables comme une notice de montage. 20 secondes.",
  "Imite quelqu'un qui découvre les gémissements profonds. Le groupe devine.",
  "Explique les ordres obéis sans question comme une notice de montage. 20 secondes.",
  "Montre le geste parfait pour les cunnilingus interminables. 10 secondes.",
  "Montre le geste parfait pour les ordres obéis sans question. 10 secondes.",
  "Fais une pub de 15 secondes pour les jouets bruyants. Slogan obligatoire.",
  "Raconte ton meilleur souvenir avec les liens et les menottes. 20 secondes.",
  "Explique les douches qui brûlent la peau comme une notice de montage. 20 secondes.",
  "Décris les yeux bandés toute la nuit comme un commentateur sportif. 20 secondes.",
  "Mime ta plus belle scène avec les glaçons sur la peau chaude. 15 secondes.",
  "Raconte ton meilleur souvenir avec les jeux de rôle intimes. 20 secondes.",
  "Fais deviner les marques visibles au bureau en 3 mimes maximum.",
  "Raconte ton meilleur souvenir avec les mots les plus sales. 20 secondes.",
  "Imite quelqu'un qui découvre les dominations totales. Le groupe devine.",
  "Fais deviner les draps déchirés en 3 mimes maximum.",
  "Montre le geste parfait pour les soirées sans aucun sommeil. 10 secondes.",
  "Raconte ton meilleur souvenir avec les gémissements profonds. 20 secondes.",
  "Mime ta plus belle scène avec les plages de rêve sans vêtements. 15 secondes.",
  "Fais deviner les cris sans voisin pour juger en 3 mimes maximum.",
  "Imite quelqu'un qui découvre les marques visibles au bureau. Le groupe devine.",
  "Montre le geste parfait pour les glaçons sur la peau chaude. 10 secondes.",
  "Explique les défis de 24 h au lit comme une notice de montage. 20 secondes.",
  "Fais deviner les promesses cochonnes tenues en 3 mimes maximum.",
  "Mime ta plus belle scène avec les ordres obéis sans question. 15 secondes.",
  "Mime ta plus belle scène avec les dominations totales. 15 secondes.",
  "Montre le geste parfait pour les morsures jusqu'aux marques. 10 secondes.",
  "Mime ta plus belle scène avec les balcons entièrement nus. 15 secondes.",
  "Montre le geste parfait pour les soirs où tout est permis. 10 secondes.",
  "Explique les échanges de partenaires comme une notice de montage. 20 secondes.",
  "Raconte ton meilleur souvenir avec les cris sans voisin pour juger. 20 secondes.",
  "Fais deviner les orgasmes multiples en 3 mimes maximum.",
  "Fais deviner les glaçons sur la peau chaude en 3 mimes maximum.",
  "Montre le geste parfait pour les nuits qui marquent une vie. 10 secondes.",
  "Explique les interdits qu'on franchit enfin comme une notice de montage. 20 secondes.",
  "Mime ta plus belle scène avec les secrets jamais racontés. 15 secondes.",
  "Explique les balcons entièrement nus comme une notice de montage. 20 secondes.",
  "Raconte ton meilleur souvenir avec les défis de 24 h au lit. 20 secondes.",
  "Décris les nuits qui marquent une vie comme un commentateur sportif. 20 secondes.",
  "Imite quelqu'un qui découvre les corps offerts. Le groupe devine.",
  "Décris les liens et les menottes comme un commentateur sportif. 20 secondes.",
  "Fais deviner les dominations totales en 3 mimes maximum.",
  "Mime ta plus belle scène avec les quêtes d'orgasme simultané. 15 secondes.",
  "Explique les cris sans voisin pour juger comme une notice de montage. 20 secondes.",
  "Montre le geste parfait pour les draps déchirés. 10 secondes.",
  "Fais une pub de 15 secondes pour les quêtes d'orgasme simultané. Slogan obligatoire.",
  "Fais une pub de 15 secondes pour les séries de rounds sans pause. Slogan obligatoire.",
  "Fais deviner les chevilles attachées en 3 mimes maximum.",
  "Raconte ton meilleur souvenir avec les reprises après 10 minutes. 20 secondes.",
  "Montre le geste parfait pour les chevilles attachées. 10 secondes.",
  "Explique les jeux de rôle intimes comme une notice de montage. 20 secondes.",
  "Explique les griffures profondes comme une notice de montage. 20 secondes.",
  "Montre le geste parfait pour les interdits qu'on franchit enfin. 10 secondes.",
  "Fais deviner les fellations mémorables en 3 mimes maximum.",
  "Explique les envies exprimées sans honte comme une notice de montage. 20 secondes.",
  "Raconte ton meilleur souvenir avec les corps qu'on redemande. 20 secondes.",
  "Raconte ton meilleur souvenir avec les mains liées dans le dos. 20 secondes.",
  "Fais deviner les nudes archivés en 3 mimes maximum.",
  "Explique les nuits qui marquent une vie comme une notice de montage. 20 secondes.",
  "Montre le geste parfait pour les plages de rêve sans vêtements. 10 secondes.",
  "Explique les corps qu'on redemande comme une notice de montage. 20 secondes.",
  "Fais une pub de 15 secondes pour les soirées sans aucun sommeil. Slogan obligatoire.",
  "Fais une pub de 15 secondes pour les marques visibles au bureau. Slogan obligatoire.",
  "Explique les nudes archivés comme une notice de montage. 20 secondes.",
  "Décris les douches qui brûlent la peau comme un commentateur sportif. 20 secondes.",
  "Mime ta plus belle scène avec les cris sans voisin pour juger. 15 secondes.",
  "Explique les séries de rounds sans pause comme une notice de montage. 20 secondes.",
  "Fais deviner les murs qui tremblent en 3 mimes maximum.",
  "Imite quelqu'un qui découvre les nudes archivés. Le groupe devine.",
  "Imite quelqu'un qui découvre les promesses cochonnes tenues. Le groupe devine.",
  "Raconte ton meilleur souvenir avec les corps offerts. 20 secondes.",
  "Décris les draps déchirés comme un commentateur sportif. 20 secondes.",
  "Mime ta plus belle scène avec les huiles partout. 15 secondes.",
  "Explique les marques visibles au bureau comme une notice de montage. 20 secondes.",
  "Fais deviner les transpirations partagées en 3 mimes maximum.",
  "Décris les transpirations partagées comme un commentateur sportif. 20 secondes.",
  "Explique les dominations totales comme une notice de montage. 20 secondes.",
  "Fais une pub de 15 secondes pour les matelas qui tombent. Slogan obligatoire.",
  "Décris les corps qu'on redemande comme un commentateur sportif. 20 secondes.",
  "Décris les cris sans voisin pour juger comme un commentateur sportif. 20 secondes.",
  "Explique les promesses cochonnes tenues comme une notice de montage. 20 secondes.",
  "Raconte ton meilleur souvenir avec les glaçons sur la peau chaude. 20 secondes.",
  "Mime ta plus belle scène avec les douches qui brûlent la peau. 15 secondes.",
  "Fais une pub de 15 secondes pour les cunnilingus interminables. Slogan obligatoire.",
  "Montre le geste parfait pour les films maison. 10 secondes.",
  "Mime ta plus belle scène avec les fellations mémorables. 15 secondes.",
  "Décris les orgasmes multiples comme un commentateur sportif. 20 secondes.",
  "Fais une pub de 15 secondes pour les reprises après 10 minutes. Slogan obligatoire.",
  "Imite quelqu'un qui découvre les nuits qui marquent une vie. Le groupe devine.",
  "Fais deviner les séries de rounds sans pause en 3 mimes maximum.",
  "Imite quelqu'un qui découvre les piscines sans maillot. Le groupe devine.",
  "Montre le geste parfait pour les murs qui tremblent. 10 secondes.",
  "Raconte ton meilleur souvenir avec les balcons entièrement nus. 20 secondes.",
  "Raconte ton meilleur souvenir avec les dominations totales. 20 secondes.",
  "Décris les mains liées dans le dos comme un commentateur sportif. 20 secondes.",
  "Montre le geste parfait pour les langues expertes. 10 secondes.",
  "Montre le geste parfait pour les fessées assumées. 10 secondes.",
  "Décris les jouets bruyants comme un commentateur sportif. 20 secondes.",
  "Fais deviner les fessées assumées en 3 mimes maximum.",
  "Imite quelqu'un qui découvre les échanges de partenaires. Le groupe devine.",
  "Explique les secrets jamais racontés comme une notice de montage. 20 secondes.",
  "Fais une pub de 15 secondes pour les promesses cochonnes tenues. Slogan obligatoire.",
  "Fais une pub de 15 secondes pour les fessées assumées. Slogan obligatoire.",
  "Imite quelqu'un qui découvre les réveils de 4 h du matin. Le groupe devine.",
  "Fais une pub de 15 secondes pour les jeux de rôle intimes. Slogan obligatoire.",
  "Décris les défis de 24 h au lit comme un commentateur sportif. 20 secondes.",
  "Décris les séries de rounds sans pause comme un commentateur sportif. 20 secondes.",
  "Raconte ton meilleur souvenir avec les orgasmes multiples. 20 secondes.",
  "Raconte ton meilleur souvenir avec les morsures jusqu'aux marques. 20 secondes.",
  "Mime ta plus belle scène avec les défis de 24 h au lit. 15 secondes.",
  "Explique les chevilles attachées comme une notice de montage. 20 secondes.",
  "Imite quelqu'un qui découvre les murs qui tremblent. Le groupe devine.",
  "Fais une pub de 15 secondes pour les draps déchirés. Slogan obligatoire.",
  "Explique les contacts dans la foule comme une notice de montage. 20 secondes.",
  "Fais une pub de 15 secondes pour les envies exprimées sans honte. Slogan obligatoire.",
  "Fais une pub de 15 secondes pour les nuits qui marquent une vie. Slogan obligatoire.",
  "Fais une pub de 15 secondes pour les liens et les menottes. Slogan obligatoire.",
  "Fais une pub de 15 secondes pour les films maison. Slogan obligatoire.",
  "Explique les gémissements profonds comme une notice de montage. 20 secondes.",
  "Imite quelqu'un qui découvre les positions du Kamasutra non testées. Le groupe devine.",
  "Mime ta plus belle scène avec les nudes archivés. 15 secondes.",
  "Mime ta plus belle scène avec les matelas qui tombent. 15 secondes.",
  "Fais une pub de 15 secondes pour les interdits qu'on franchit enfin. Slogan obligatoire.",
  "Fais une pub de 15 secondes pour les défis de 24 h au lit. Slogan obligatoire.",
  "Mime ta plus belle scène avec les piscines sans maillot. 15 secondes.",
  "Mime ta plus belle scène avec les draps déchirés. 15 secondes.",
  "Raconte ton meilleur souvenir avec les séries de rounds sans pause. 20 secondes.",
  "Raconte ton meilleur souvenir avec les matelas qui tombent. 20 secondes.",
  "Explique les fantasmes à trois comme une notice de montage. 20 secondes.",
  "Décris les huiles partout comme un commentateur sportif. 20 secondes.",
  "Fais deviner les corps offerts en 3 mimes maximum.",
  "Montre le geste parfait pour les balcons entièrement nus. 10 secondes.",
  "Montre le geste parfait pour les marques visibles au bureau. 10 secondes.",
  "Raconte ton meilleur souvenir avec les soirées sans aucun sommeil. 20 secondes.",
  "Décris les secrets jamais racontés comme un commentateur sportif. 20 secondes.",
  "Mime ta plus belle scène avec les cunnilingus interminables. 15 secondes.",
  "Imite quelqu'un qui découvre les plages de rêve sans vêtements. Le groupe devine.",
  "Imite quelqu'un qui découvre les séries de rounds sans pause. Le groupe devine.",
  "Mime ta plus belle scène avec les nuits qui marquent une vie. 15 secondes.",
  "Raconte ton meilleur souvenir avec les langues expertes. 20 secondes.",
  "Mime ta plus belle scène avec les séries de rounds sans pause. 15 secondes.",
  "Raconte ton meilleur souvenir avec les chevilles attachées. 20 secondes.",
  "Fais deviner les plages de rêve sans vêtements en 3 mimes maximum.",
  "Fais une pub de 15 secondes pour les contacts dans la foule. Slogan obligatoire.",
  "Explique les mains liées dans le dos comme une notice de montage. 20 secondes.",
  "Décris les positions du Kamasutra non testées comme un commentateur sportif. 20 secondes.",
  "Fais deviner les langues expertes en 3 mimes maximum.",
  "Raconte ton meilleur souvenir avec les positions du Kamasutra non testées. 20 secondes.",
  "Explique les reprises après 10 minutes comme une notice de montage. 20 secondes.",
  "Décris les glaçons sur la peau chaude comme un commentateur sportif. 20 secondes.",
  "Imite quelqu'un qui découvre les corps qu'on redemande. Le groupe devine.",
  "Fais une pub de 15 secondes pour les langues expertes. Slogan obligatoire.",
  "Imite quelqu'un qui découvre les mains liées dans le dos. Le groupe devine.",
  "Montre le geste parfait pour les gémissements profonds. 10 secondes.",
  "Montre le geste parfait pour les nudes archivés. 10 secondes.",
  "Fais une pub de 15 secondes pour les morsures jusqu'aux marques. Slogan obligatoire.",
  "Explique les mots les plus sales comme une notice de montage. 20 secondes.",
  "Mime ta plus belle scène avec les mains liées dans le dos. 15 secondes.",
  "Raconte ton meilleur souvenir avec les cunnilingus interminables. 20 secondes.",
  "Fais deviner les mains liées dans le dos en 3 mimes maximum.",
  "Fais deviner les soirs où tout est permis en 3 mimes maximum.",
  "Montre le geste parfait pour les orgasmes multiples. 10 secondes.",
  "Décris les corps offerts comme un commentateur sportif. 20 secondes.",
  "Montre le geste parfait pour les liens et les menottes. 10 secondes.",
  "Explique les réveils de 4 h du matin comme une notice de montage. 20 secondes.",
  "Fais deviner les positions du Kamasutra non testées en 3 mimes maximum.",
  "Décris les chevilles attachées comme un commentateur sportif. 20 secondes.",
  "Raconte ton meilleur souvenir avec les envies exprimées sans honte. 20 secondes.",
  "Explique les murs qui tremblent comme une notice de montage. 20 secondes.",
  "Raconte ton meilleur souvenir avec les réveils de 4 h du matin. 20 secondes.",
  "Raconte ton meilleur souvenir avec les fessées assumées. 20 secondes.",
  "Fais une pub de 15 secondes pour les plages de rêve sans vêtements. Slogan obligatoire.",
  "Montre le geste parfait pour les positions du Kamasutra non testées. 10 secondes.",
  "Imite quelqu'un qui découvre les glaçons sur la peau chaude. Le groupe devine.",
  "Fais une pub de 15 secondes pour les corps offerts. Slogan obligatoire.",
  "Montre le geste parfait pour les mains liées dans le dos. 10 secondes.",
  "Raconte ton meilleur souvenir avec les douches qui brûlent la peau. 20 secondes.",
  "Fais une pub de 15 secondes pour les transpirations partagées. Slogan obligatoire.",
  "Fais une pub de 15 secondes pour les piscines sans maillot. Slogan obligatoire.",
  "Montre le geste parfait pour les secrets jamais racontés. 10 secondes.",
  "Imite quelqu'un qui découvre les liens et les menottes. Le groupe devine.",
  "Raconte ton meilleur souvenir avec les quêtes d'orgasme simultané. 20 secondes.",
  "Explique les orgasmes multiples comme une notice de montage. 20 secondes.",
  "Décris les dominations totales comme un commentateur sportif. 20 secondes.",
  "Raconte ton meilleur souvenir avec les fessées jusqu'au rouge. 20 secondes.",
  "Montre le geste parfait pour les dominations totales. 10 secondes.",
  "Raconte ton meilleur souvenir avec les fantasmes à trois. 20 secondes.",
  "Décris les piscines sans maillot comme un commentateur sportif. 20 secondes.",
  "Explique les draps déchirés comme une notice de montage. 20 secondes.",
  "Explique les piscines sans maillot comme une notice de montage. 20 secondes.",
  "Décris les fantasmes à trois comme un commentateur sportif. 20 secondes.",
  "Mime ta plus belle scène avec les fessées assumées. 15 secondes.",
  "Mime ta plus belle scène avec les corps offerts. 15 secondes.",
  "Mime ta plus belle scène avec les orgasmes multiples. 15 secondes.",
  "Imite quelqu'un qui découvre les soirs où tout est permis. Le groupe devine.",
  "Explique les fessées assumées comme une notice de montage. 20 secondes.",
  "Montre le geste parfait pour les piscines sans maillot. 10 secondes.",
  "Mime ta plus belle scène avec les fantasmes à trois. 15 secondes.",
  "Raconte ton meilleur souvenir avec les huiles partout. 20 secondes.",
  "Décris les mots les plus sales comme un commentateur sportif. 20 secondes.",
  "Raconte ton meilleur souvenir avec les murs qui tremblent. 20 secondes.",
  "Fais une pub de 15 secondes pour les griffures profondes. Slogan obligatoire.",
  "Décris les échanges de partenaires comme un commentateur sportif. 20 secondes.",
  "Fais une pub de 15 secondes pour les fellations mémorables. Slogan obligatoire.",
  "Fais une pub de 15 secondes pour les soirs où tout est permis. Slogan obligatoire.",
  "Fais deviner les réveils de 4 h du matin en 3 mimes maximum.",
  "Imite quelqu'un qui découvre les défis de 24 h au lit. Le groupe devine.",
  "Mime ta plus belle scène avec les envies exprimées sans honte. 15 secondes.",
  "Montre le geste parfait pour les défis de 24 h au lit. 10 secondes.",
  "Mime ta plus belle scène avec les transpirations partagées. 15 secondes.",
  "Fais une pub de 15 secondes pour les fantasmes à trois. Slogan obligatoire.",
  "Fais deviner les mots les plus sales en 3 mimes maximum.",
  "Explique les positions du Kamasutra non testées comme une notice de montage. 20 secondes.",
  "Fais deviner les reprises après 10 minutes en 3 mimes maximum.",
  "Explique les quêtes d'orgasme simultané comme une notice de montage. 20 secondes.",
  "Imite quelqu'un qui découvre les secrets jamais racontés. Le groupe devine.",
  "Explique les glaçons sur la peau chaude comme une notice de montage. 20 secondes.",
  "Montre le geste parfait pour les jouets bruyants. 10 secondes.",
  "Mime ta plus belle scène avec les griffures profondes. 15 secondes.",
  "Fais une pub de 15 secondes pour les dominations totales. Slogan obligatoire.",
  "Imite quelqu'un qui découvre les balcons entièrement nus. Le groupe devine.",
  "Montre le geste parfait pour les huiles partout. 10 secondes.",
  "Fais une pub de 15 secondes pour les douches qui brûlent la peau. Slogan obligatoire.",
  "Imite quelqu'un qui découvre les envies exprimées sans honte. Le groupe devine.",
  "Décris les reprises après 10 minutes comme un commentateur sportif. 20 secondes.",
  "Montre le geste parfait pour les promesses cochonnes tenues. 10 secondes.",
  "Fais deviner les morsures jusqu'aux marques en 3 mimes maximum.",
  "Imite quelqu'un qui découvre les interdits qu'on franchit enfin. Le groupe devine.",
  "Explique les corps offerts comme une notice de montage. 20 secondes.",
  "Fais deviner les quêtes d'orgasme simultané en 3 mimes maximum.",
  "Raconte ton meilleur souvenir avec les promesses cochonnes tenues. 20 secondes.",
  "Décris les quêtes d'orgasme simultané comme un commentateur sportif. 20 secondes.",
  "Explique les soirées sans aucun sommeil comme une notice de montage. 20 secondes.",
  "Imite quelqu'un qui découvre les quêtes d'orgasme simultané. Le groupe devine.",
  "Explique les liens et les menottes comme une notice de montage. 20 secondes.",
  "Mime ta plus belle scène avec les murs qui tremblent. 15 secondes.",
  "Fais deviner les balcons entièrement nus en 3 mimes maximum.",
  "Mime ta plus belle scène avec les soirs où tout est permis. 15 secondes.",
  "Raconte ton meilleur souvenir avec les piscines sans maillot. 20 secondes.",
  "Fais une pub de 15 secondes pour les orgasmes multiples. Slogan obligatoire.",
  "Décris les jeux de rôle intimes comme un commentateur sportif. 20 secondes.",
  "Imite quelqu'un qui découvre les soirées sans aucun sommeil. Le groupe devine.",
  "Explique les plages de rêve sans vêtements comme une notice de montage. 20 secondes.",
  "Mime ta plus belle scène avec les morsures jusqu'aux marques. 15 secondes.",
  "Décris les contacts dans la foule comme un commentateur sportif. 20 secondes.",
  "Fais deviner les interdits qu'on franchit enfin en 3 mimes maximum.",
  "Fais une pub de 15 secondes pour les yeux bandés toute la nuit. Slogan obligatoire.",
  "Fais une pub de 15 secondes pour les ordres obéis sans question. Slogan obligatoire.",
  "Mime ta plus belle scène avec les soirées sans aucun sommeil. 15 secondes.",
  "Raconte ton meilleur souvenir avec les échanges de partenaires. 20 secondes.",
  "Raconte ton meilleur souvenir avec les contacts dans la foule. 20 secondes.",
  "Fais deviner les soirées sans aucun sommeil en 3 mimes maximum.",
  "Imite quelqu'un qui découvre les cris sans voisin pour juger. Le groupe devine.",
  "Raconte ton meilleur souvenir avec les nuits qui marquent une vie. 20 secondes.",
  "Mime ta plus belle scène avec les langues expertes. 15 secondes.",
  "Mime ta plus belle scène avec les interdits qu'on franchit enfin. 15 secondes.",
  "Imite quelqu'un qui découvre les jeux de rôle intimes. Le groupe devine.",
  "Décris les soirées sans aucun sommeil comme un commentateur sportif. 20 secondes.",
  "Imite quelqu'un qui découvre les orgasmes multiples. Le groupe devine.",
  "Fais deviner les jouets bruyants en 3 mimes maximum.",
  "Montre le geste parfait pour les matelas qui tombent. 10 secondes.",
  "Raconte ton meilleur souvenir avec les marques visibles au bureau. 20 secondes.",
  "Imite quelqu'un qui découvre les jouets bruyants. Le groupe devine.",
  "Décris les envies exprimées sans honte comme un commentateur sportif. 20 secondes.",
  "Mime ta plus belle scène avec les marques visibles au bureau. 15 secondes.",
  "Raconte ton meilleur souvenir avec les draps déchirés. 20 secondes.",
  "Imite quelqu'un qui découvre les fantasmes à trois. Le groupe devine.",
  "Fais deviner les films maison en 3 mimes maximum.",
  "Mime ta plus belle scène avec les contacts dans la foule. 15 secondes.",
  "Montre le geste parfait pour les envies exprimées sans honte. 10 secondes.",
  "Fais une pub de 15 secondes pour les secrets jamais racontés. Slogan obligatoire.",
  "Fais deviner les piscines sans maillot en 3 mimes maximum.",
  "Explique les transpirations partagées comme une notice de montage. 20 secondes.",
  "Imite quelqu'un qui découvre les morsures jusqu'aux marques. Le groupe devine.",
  "Montre le geste parfait pour les fessées jusqu'au rouge. 10 secondes.",
  "Explique les langues expertes comme une notice de montage. 20 secondes.",
  "Fais une pub de 15 secondes pour les mains liées dans le dos. Slogan obligatoire.",
  "Montre le geste parfait pour les douches qui brûlent la peau. 10 secondes.",
  "Raconte ton meilleur souvenir avec les griffures profondes. 20 secondes.",
  "Imite quelqu'un qui découvre les griffures profondes. Le groupe devine.",
  "Fais deviner les matelas qui tombent en 3 mimes maximum.",
  "Fais deviner les corps qu'on redemande en 3 mimes maximum.",
  "Fais deviner les nuits qui marquent une vie en 3 mimes maximum.",
  "Décris les ordres obéis sans question comme un commentateur sportif. 20 secondes.",
  "Imite quelqu'un qui découvre les fessées assumées. Le groupe devine.",
  "Imite quelqu'un qui découvre les reprises après 10 minutes. Le groupe devine.",
  "Mime ta plus belle scène avec les promesses cochonnes tenues. 15 secondes.",
  "Mime ta plus belle scène avec les positions du Kamasutra non testées. 15 secondes.",
  "Imite quelqu'un qui découvre les draps déchirés. Le groupe devine.",
  "Montre le geste parfait pour les fellations mémorables. 10 secondes.",
  "Décris les gémissements profonds comme un commentateur sportif. 20 secondes.",
  "Fais une pub de 15 secondes pour les échanges de partenaires. Slogan obligatoire.",
  "Fais deviner les contacts dans la foule en 3 mimes maximum.",
  "Montre le geste parfait pour les reprises après 10 minutes. 10 secondes.",
  "Fais deviner les jeux de rôle intimes en 3 mimes maximum.",
  "Mime ta plus belle scène avec les chevilles attachées. 15 secondes.",
  "Décris les griffures profondes comme un commentateur sportif. 20 secondes.",
  "Fais une pub de 15 secondes pour les fessées jusqu'au rouge. Slogan obligatoire.",
  "Décris les fessées jusqu'au rouge comme un commentateur sportif. 20 secondes."
]
  }
};
/* ⭐ Ajout perso facile : colle ici tes questions, elles s'ajoutent automatiquement ⭐ */
const PERSO = { 1:{verite:[],action:[]}, 2:{verite:[],action:[]}, 3:{verite:[],action:[]}, 4:{verite:[],action:[]} };
Object.keys(PERSO).forEach(d => { QUESTIONS[d].verite.push(...PERSO[d].verite); QUESTIONS[d].action.push(...PERSO[d].action); });
let TOT = 0; Object.keys(QUESTIONS).forEach(d => { TOT += QUESTIONS[d].verite.length + QUESTIONS[d].action.length; });
console.log('📚 Banque v31 : ' + TOT + ' questions réelles — 1000 par niveau');

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
    feedSeq: 0,
    seen: {},
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
      spinAt: room.turn.spinAt || 0,
      answered: !!room.turn.answered,
      ai: !!room.turn.ai,
    } : null,
    aiErr: room.aiErr || null,
    maxPlayers: MAX_PLAYERS,
    maxMisses: MAX_MISSES,
    theme: room.theme || 'grenade',
  };
}
const broadcast = (room) => io.to(room.code).emit('room:state', serialize(room));

function pushFeed(room, item) {
  item.ts = Date.now();
  item.id = String((room.feedSeq = (room.feedSeq || 0) + 1));
  room.feed.push(item);
  if (room.feed.length > 40) room.feed.shift();
  io.to(room.code).emit('feed:new', item);
  botSeen(room);
  botReact(room, item);
}
/* v30 : les bots « voient » le salon (👁️ Vu) et réagissent parfois ❤️ */
function botSeen(room) {
  room.players.forEach(p => {
    if (!p.isBot) return;
    setTimeout(() => {
      if (rooms.get(room.code) !== room || !room.feed.length) return;
      const last = room.feed[room.feed.length - 1].id;
      if (room.seen[p.name] === last) return;
      room.seen[p.name] = last;
      io.to(room.code).emit('feed:seen', { name: p.name, id: last });
    }, 1200 + Math.random() * 3500);
  });
}
function botReact(room, item) {
  if (!item.mid || item.kind === 'sys' || item.kind === 'audio' || item.kind === 'answer-audio') return;
  const bots = [...room.players.values()].filter(p => p.isBot);
  if (!bots.length || Math.random() > 0.35) return;
  const b = bots[Math.floor(Math.random() * bots.length)];
  const emo = ['❤️', '😂', '🔥', '😮'][Math.floor(Math.random() * 4)];
  setTimeout(() => {
    if (rooms.get(room.code) !== room) return;
    item.re = item.re || {};
    const arr = item.re[emo] = item.re[emo] || [];
    if (!arr.includes(b.name)) arr.push(b.name);
    io.to(room.code).emit('feed:re', { id: item.id, re: item.re });
  }, 2000 + Math.random() * 4000);
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
  room.turn = { targetId: t.id, spinAt: Date.now(), deadline: Date.now() + SPIN_TIME };
  io.to(room.code).emit('wheel', { targetId: t.id, duration: SPIN_TIME, spinAt: room.turn.spinAt });
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

/* ═══ v31 · IA GROQ : question FAVORITE, illimitée, français simple — JAMAIS de wolof ═══ */
let AI_MODELS = null, AI_MODELS_AT = 0;

function aiWarn(room, msg) {
  console.log('⚠️ IA (caché aux joueurs, retente au prochain tour) :', msg);
  if (room) { room.aiErr = msg; }
}

async function pickModel() {
  if (AI_MODELS && AI_MODELS.length && Date.now() - AI_MODELS_AT < 600000) return AI_MODELS[0];
  try {
    const r = await fetch('https://api.groq.com/openai/v1/models', {
      headers: { Authorization: 'Bearer ' + process.env.GROQ_API_KEY },
      signal: AbortSignal.timeout(6000),
    });
    if (r.ok) {
      const ids = ((await r.json()).data || []).map(m => m.id);
      const pref = [process.env.AI_MODEL, 'openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.6-27b', 'llama-3.3-70b-versatile'].filter(Boolean);
      const list = pref.filter(p => ids.indexOf(p) >= 0);
      AI_MODELS = list.length ? list : ids.filter(id => !/whisper|guard|orpheus|tts|embed/i.test(id)).slice(0, 3);
      AI_MODELS_AT = Date.now();
      if (AI_MODELS.length) { console.log('🤖 IA modèle sélectionné :', AI_MODELS[0]); return AI_MODELS[0]; }
    } else { console.log('⚠️ IA liste modèles HTTP', r.status); }
  } catch (e) { console.log('⚠️ IA liste modèles injoignable :', e.message); }
  return null;
}

async function aiQuestion(room, diff, type, name, gender) {
  if (!process.env.GROQ_API_KEY) return null;
  /* v31 : la question IA est FAVORITE (elle remplace le tirage quand elle répond) — français simple, JAMAIS de wolof */
  const niveau = { 1: 'légère et fun, tout public adulte', 2: 'coquine, très chaude', 3: 'très directe, sans AUCUN filtre', 4: 'EXPLICITE : vocabulaire cru et sale voulu (bite, chatte, seins, fessée…), zéro censure, adultes consentants' }[diff] || 'coquine';
  const THEMES = ['un fantasme jamais avoué', 'une première fois', 'un lieu risqué', 'les préliminaires', 'une position précise', 'les sextoys', 'les sextos', 'un souvenir très chaud', 'la jalousie au lit', 'le corps de quelqu un ici', 'un rêve érotique', 'la durée et l endurance', 'une confession gênante mais excitante', 'le massage', 'un vêtement précis', 'le moment où tu as perdu le contrôle', 'la bouche (mordre, lécher, sucer)', 'une nuit que tu refais mentalement', 'un jeu interdit entre adultes', 'l admirer en secret'];
  const theme = THEMES[Math.floor(Math.random() * THEMES.length)];
  const eviter = ((room && room.lastQs) || []).filter(Boolean).slice(-3);
  const prompt = 'Tu es le meneur TRÈS CHAUD d un Vérité ou Action 18+ entre adultes consentants. '
    + 'Génère UNE seule ' + (type === 'verite' ? 'question de VÉRITÉ très intime' : 'ACTION très osée à faire MAINTENANT (peut exiger une photo ou une vidéo en privé 📎)')
    + ' pour le joueur "' + name + '" (' + (gender === 'femme' ? 'une femme' : 'un homme') + '). Niveau demandé : ' + niveau + '. '
    + 'Thème imposé : ' + theme + '. '
    + 'RÈGLES ABSOLUES : français SIMPLE de tous les jours, mots courts, DIRECTE sans détour, UNE seule phrase COURTE (15 à 25 mots maximum), brûlante — le contexte est 18+. '
    + 'INTERDIT ABSOLU d écrire en wolof ou dans toute autre langue : UNIQUEMENT du français simple et clair. '
    + 'La question COMMENCE par le prénom du joueur suivi d une virgule (exemple : « ' + name + ', … »). '
    + (eviter.length ? 'Ne ressemble à AUCUNE de ces questions déjà posées : "' + eviter.join('" / "') + '". ' : '')
    + 'Réponds UNIQUEMENT avec un JSON valide : {"question": "..."}';
  const tentes = [];
  for (let essai = 0; essai < 3; essai++) {
    try {
      const model = await pickModel();
      if (!model || tentes.indexOf(model) >= 0) break;
      tentes.push(model);
      const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + process.env.GROQ_API_KEY },
        body: JSON.stringify({ model: model, messages: [{ role: 'user', content: prompt }], temperature: 1.15, max_tokens: 600, response_format: { type: 'json_object' } }),
        signal: AbortSignal.timeout(9000),
      });
      if (r.status === 404) {
        console.log('⚠️ IA : modèle', model, 'inaccessible (404) → suivant');
        if (AI_MODELS) AI_MODELS = AI_MODELS.filter(m => m !== model);
        AI_MODELS_AT = 0;
        continue;
      }
      if (!r.ok) {
        let detail = '';
        try { detail = (await r.text()).slice(0, 120); } catch (e) {}
        aiWarn(room, 'IA (HTTP ' + r.status + ') : ' + (r.status === 401 ? 'clé INVALIDE — recrée-la sur console.groq.com' : r.status === 429 ? 'limite atteinte, réessaie dans quelques minutes' : detail || 'erreur Groq'));
        return null;
      }
      const j = await r.json();
      const ch = (j.choices && j.choices[0]) || {};
      const content = (ch.message && ch.message.content) || '';
      let q = null;
      try { q = JSON.parse(content).question; } catch (e2) { q = null; }
      if (typeof q === 'string' && q.length > 8 && q.length < 500) {
        if (room) { room.aiWarned = false; room.aiErr = null; }
        return q.trim();
      }
      aiWarn(room, 'IA : réponse illisible (modèle ' + model + ', fin=' + (ch.finish_reason || '?') + ', contenu=' + String(content).slice(0, 60) + ')');
      return null;
    } catch (e) {
      aiWarn(room, 'IA injoignable : ' + e.message);
      return null;
    }
  }
  if (tentes.length) aiWarn(room, 'IA : modèle(s) inaccessible(s) pour cette clé (' + tentes.join(', ') + ')');
  else aiWarn(room, 'IA : aucun modèle disponible');
  return null;
}

function beginAnswering(room, type) {
  const t = room.players.get(room.turn.targetId);
  const q = withName(drawQuestion(room, type), t.name);
  room.phase = 'answering';
  room.turn = { targetId: t.id, type, question: q, deadline: Date.now() + ANSWER_TIME, answered: false, ai: false };
  room.lastQs = ((room.lastQs || []).concat(q)).slice(-4);
  // v31 : l'IA (si clé configurée) = question FAVORITE — elle remplace le tirage. Français simple, JAMAIS de wolof
  aiQuestion(room, room.difficulty, type, t.name, t.gender).then(aiq => {
    if (aiq) aiq = withName(aiq, t.name);
    if (aiq && room.turn && room.turn.targetId === t.id && room.phase === 'answering' && !room.turn.answered) {
      room.turn.question = aiq; room.turn.ai = true; room.aiWarned = false; room.aiErr = null;
      room.lastQs = ((room.lastQs || []).concat(aiq)).slice(-4);
      broadcast(room);
    }
  });
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

/* v18 : la question s'adresse au joueur par son prénom : "Modou, ..." */
function withName(q, name) {
  q = String(q || '').trim();
  if (!q) return q;
  if (!name || q.indexOf(name) === 0) return q;
  const c = q.slice(0, 1);
  if (/[A-Z\u00C0-\u00DD]/.test(c)) q = c.toLowerCase() + q.slice(1);
  return name + ', ' + q;
}

function drawQuestion(room, type) {
  /* v31 : tirage pur dans la banque 4000 (plus de wolof) */
  const bank = QUESTIONS[room.difficulty][type];
  const prefix = room.difficulty + ':' + type + ':';
  let idxs = bank.map((_, i) => i).filter(i => !room.used.has(prefix + i));
  if (!idxs.length) { bank.forEach((_, i) => room.used.delete(prefix + i)); idxs = bank.map((_, i) => i); }
  const i = pick(idxs);
  room.used.add(prefix + i);
  return bank[i];
}

function closeRoom(room, why) {
  clearTimer(room);
  io.to(room.code).emit('room:closed', { why: why || 'stop' });
  room.players.forEach((_, id) => socketRoom.delete(id));
  rooms.delete(room.code);
}

/* ---------------- Page web (TOUT EST DEDANS) ---------------- */
const HTML = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, viewport-fit=cover">
    <link rel="manifest" href="/manifest.webmanifest">
    <script src="/bank.js" defer><\/script>
    <link rel="icon" type="image/png" href="/icon-192.png">
    <link rel="apple-touch-icon" href="/icon-192.png">
    <meta name="theme-color" content="#14090f">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="V ou A 🌶️">
<meta http-equiv="Cache-Control" content="no-store">
<title>Vérité ou Action 🔥 18+</title>
<style>
* { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
html, body { overscroll-behavior: none; }
:root { --bg:#160910; --bg2:#2a1220; --card:#1f0e19; --line:#3d2033; --txt:#fff5f7; --mut:#c9a3b5; --hot:#ff3b5c; --hot2:#ff8a3d; --ok:#2fd08a; --warn:#ffc046; }
body[data-theme="sunset"] { --bg:#0d0a1a; --bg2:#2a1538; --card:#211230; --line:#422a5c; --mut:#c0a8d8; --hot:#ff8a3d; --hot2:#ff4da6; }
body[data-theme="honey"] { --bg:#171006; --bg2:#33240f; --card:#29200f; --line:#4d3c1c; --mut:#d8c39a; --hot:#ffb020; --hot2:#ffe45c; }
body[data-theme="velvet"] { --bg:#180a12; --bg2:#3a1327; --card:#2c1020; --line:#55223c; --mut:#d8a8c0; --hot:#ff2e63; --hot2:#ff6a8e; }
body[data-theme="ocean"] { --bg:#04121c; --bg2:#0a2436; --card:#0a1e2e; --line:#16445e; --mut:#9ac4d8; --hot:#19c8c8; --hot2:#5cffb0; }
body[data-theme="lavender"] { --bg:#120d1c; --bg2:#241a38; --card:#1d1430; --line:#3a2b58; --mut:#c2b2e0; --hot:#a86bff; --hot2:#ff6ad5; }
body[data-theme="mint"] { --bg:#07160f; --bg2:#0f2b1c; --card:#0d2418; --line:#1d4a30; --mut:#a8d8bd; --hot:#2fe08a; --hot2:#b8ff5c; }
body[data-theme="coffee"] { --bg:#140f08; --bg2:#2b2013; --card:#231a0f; --line:#4a3823; --mut:#d8c0a0; --hot:#e0903c; --hot2:#ffb84d; }
body[data-theme="neon"] { --bg:#05050f; --bg2:#12122e; --card:#0e0e24; --line:#2a2a5e; --mut:#a0a0e8; --hot:#00e5ff; --hot2:#ff00e5; }
body[data-theme="gold"] { --bg:#0d0c07; --bg2:#241f0e; --card:#1e1a0c; --line:#4a4020; --mut:#e0d0a0; --hot:#ffd700; --hot2:#fff2a8; }
.plugcount { font-size: 13px; font-weight: 900; background: var(--bg2); border: 1.5px solid var(--line); border-radius: 999px; padding: 6px 11px; white-space: nowrap; }
.segbar { display: flex; gap: 6px; }
.segbar .btn { flex: 1; padding: 12px 4px; font-size: 13px; line-height: 1.3; border-radius: 14px; text-align: center; }
.segbar .btn.sel { background: linear-gradient(135deg, var(--hot), var(--hot2)); border: none; color: #fff; font-weight: 900; box-shadow: 0 4px 16px rgba(255, 59, 92, .35); transform: scale(1.03); }
@keyframes tutozoom { from { transform: scale(.94); opacity: .4; } to { transform: none; opacity: 1; } }
.tuto-scene { animation: tutozoom .45s ease; }
.tuto-mock { background: var(--bg2); border: 1.5px solid var(--line); border-radius: 14px; padding: 10px 14px; font-size: 13px; font-weight: 800; display: flex; align-items: center; gap: 8px; }
.tuto-arrow { font-size: 18px; }
.gearbtn { width: 40px; height: 40px; border-radius: 12px; border: 1.5px solid var(--line); background: var(--bg2); font-size: 19px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: transform .3s ease, border-color .2s ease; }
.gearbtn:hover { transform: rotate(45deg); border-color: var(--hot); }
.setpanel { display: none; background: var(--card); border: 1px solid var(--line); border-radius: 18px; padding: 16px; margin: 10px 0; }
.setpanel.open { display: block; animation: slidein .25s ease; }
.setpanel h3 { font-size: 15px; font-weight: 900; margin-bottom: 4px; }
.setpanel .setrow { display: flex; gap: 11px; justify-content: center; align-items: center; margin: 10px 0; flex-wrap: wrap; }
.setpanel .setlbl { font-size: 12px; color: var(--mut); font-weight: 800; text-align: left; margin-top: 8px; }
.swatch { width: 38px; height: 38px; border-radius: 50%; border: 2.5px solid var(--line); background: var(--bg2); font-size: 17px; cursor: pointer; padding: 0; display: flex; align-items: center; justify-content: center; transition: transform .15s ease, border-color .2s ease; }
.swatch.sel { border-color: var(--hot); transform: scale(1.18); }
@keyframes slidein { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
body { font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; background: radial-gradient(1200px 800px at 50% -10%, var(--bg2), var(--bg) 60%); color: var(--txt); min-height: 100vh; overflow-x: hidden; padding-top: env(safe-area-inset-top, 0px); padding-left: env(safe-area-inset-left, 0px); padding-right: env(safe-area-inset-right, 0px); scroll-behavior: smooth; }
.screen { display: none; min-height: 100vh; padding-bottom: calc(24px + env(safe-area-inset-bottom)); }
.screen.active { display: block; animation: slidein .3s ease; }
.card { max-width: 440px; margin: calc(4vh + env(safe-area-inset-top, 0px)) auto 20px; padding: 30px 22px; background: var(--card); border: 1px solid var(--line); border-radius: 24px; display: flex; flex-direction: column; gap: 15px; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,.45); }
.logo { font-size: 60px; }
h1.title { font-size: 32px; font-weight: 900; background: linear-gradient(90deg, var(--hot), var(--hot2)); -webkit-background-clip: text; background-clip: text; color: transparent; }
.badge18 { align-self: center; background: var(--hot); color: #fff; font-weight: 900; padding: 3px 14px; border-radius: 999px; font-size: 14px; }
.ver { font-size: 11px; color: var(--mut); letter-spacing: 1px; }
.check { display: flex; gap: 8px; align-items: center; justify-content: center; font-size: 14px; color: var(--mut); cursor: pointer; }
.check input { width: 18px; height: 18px; accent-color: var(--hot); }
.input { width: 100%; padding: 14px 16px; border-radius: 14px; border: 1.5px solid var(--line); background: var(--bg2); color: var(--txt); font-size: 16px; outline: none; text-align: center; }
.input:focus { border-color: var(--hot); }
.input.code { letter-spacing: 10px; font-size: 26px; font-weight: 800; text-transform: uppercase; }
.btn { padding: 13px 18px; border-radius: 14px; border: 1.5px solid var(--line); background: var(--bg2); color: var(--txt); font-size: 15px; font-weight: 700; cursor: pointer; transition: transform .12s ease, background .2s ease, border-color .2s ease, box-shadow .2s ease; }
.btn:active { transform: scale(.97); }
.btn:disabled { opacity: .4; cursor: not-allowed; }
.btn.big { padding: 15px; font-size: 17px; }
.btn.primary { background: linear-gradient(90deg, var(--hot), var(--hot2)); border: none; color: #fff; }
.btn.wa { background: #25d366; border: none; color: #06331a; }
.btn.small { padding: 7px 12px; font-size: 13px; border-radius: 10px; }
.btn.danger { border-color: var(--hot); color: var(--hot); }
.divider { color: var(--mut); font-size: 13px; }
.hint { color: var(--mut); font-size: 12.5px; line-height: 1.5; }
.topbar { display: flex; align-items: center; gap: 8px; padding: 10px 12px; padding-top: calc(10px + env(safe-area-inset-top, 0px)); position: sticky; top: 0; z-index: 5; background: var(--bg); backdrop-filter: blur(8px); border-bottom: 1px solid var(--line); }
.code-big { font-size: 20px; font-weight: 900; letter-spacing: 6px; color: var(--hot2); background: var(--card); border: 1px solid var(--line); padding: 6px 14px; border-radius: 12px; cursor: pointer; }
.wrap { max-width: 560px; margin: 14px auto; margin-top: calc(14px + env(safe-area-inset-top, 0px)); padding: 0 15px; display: flex; flex-direction: column; gap: 15px; }
.panel { background: var(--card); border: 1px solid var(--line); border-radius: 18px; padding: 17px 16px; }
.panel h3 { font-size: 15px; margin-bottom: 10px; }
.grid6 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; }
@media (min-width: 560px) { .grid6 { grid-template-columns: repeat(6, 1fr); } }
.cell { position: relative; background: var(--bg2); border: 1.5px solid var(--line); border-radius: 10px; padding: 5px 3px 4px; min-height: 36px; display: flex; flex-direction: column; gap: 1px; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; overflow: hidden; }
.cell > span { max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cell .num { position: absolute; top: 1px; left: 4px; font-size: 7px; color: var(--mut); }
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
#mic { font-size: 18px; }
#mic.rec { background: var(--hot); color: #fff; animation: pulse 1s infinite; }
@keyframes pulse { 50% { transform: scale(1.04); } }
.rea { display: flex; gap: 6px; justify-content: center; flex-wrap: wrap; }
.rea button { font-size: 20px; background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 5px 10px; cursor: pointer; }
.feed { display: flex; flex-direction: column; gap: 7px; }
/* ═══ v30 · VRAI INSTA : le salon EST l'écran ═══ */
/* v30.2 FIX : la classe posée par show() est .active (pas .on) — c'était la cause de la roue géante sur la topbar */
#s-game.active { display: flex; flex-direction: column; min-height: 100dvh; padding-bottom: calc(10px + env(safe-area-inset-bottom)); }
#s-game .wrap { flex: 1; min-height: 0; gap: 8px; margin: 8px auto 0; }
#s-game #phase, #s-game #phasehint { display: none; }
#qband { display: flex; align-items: center; gap: 10px; background: var(--card); border: 1px solid var(--hot); border-radius: 15px; padding: 12px 14px; margin-bottom: 8px; flex-shrink: 0; box-shadow: 0 4px 18px rgba(0,0,0,.35); }
#qbadge { background: linear-gradient(135deg, var(--hot), var(--hot2)); color: #fff; font-weight: 900; font-size: 11.5px; letter-spacing: .5px; border-radius: 99px; padding: 5px 12px; white-space: nowrap; flex-shrink: 0; }
#qtext2 { font-size: 15px; font-weight: 700; line-height: 1.4; min-width: 0; }
#qwho { margin-left: auto; font-size: 11px; color: var(--mut); white-space: nowrap; flex-shrink: 0; }
#stage { position: relative; flex: 1; min-height: 0; display: flex; flex-direction: column; }
#feedwrap { position: relative; flex: 1; min-height: 200px; }
.chatbody { position: absolute; inset: 0; display: flex; flex-direction: column; gap: 7px; padding: 4px 2px 8px; overflow-y: auto; -webkit-overflow-scrolling: touch; }
.feed { display: flex; flex-direction: column; gap: 7px; }
#typing { position: absolute; bottom: 8px; left: 10px; z-index: 5; background: rgba(0,0,0,.55); color: #eee; font-size: 11.5px; padding: 5px 12px; border-radius: 99px; }
.chatbar { display: flex; gap: 8px; align-items: center; padding: 8px 2px 2px; flex-shrink: 0; }
.pillwrap { position: relative; flex: 1; min-width: 0; display: flex; }
.chatinput { flex: 1; min-width: 0; padding: 11px 46px 11px 16px; border-radius: 999px; border: 1.5px solid var(--line); background: var(--bg2); color: var(--txt); font-size: 15px; outline: none; }
.chatinput:focus { border-color: var(--hot); }
#btn-media { position: absolute; right: 6px; top: 50%; transform: translateY(-50%); width: 32px; height: 32px; border-radius: 50%; border: none; background: var(--card); font-size: 15px; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0; }
#wheelzone { position: absolute; inset: 0; z-index: 6; display: flex; align-items: center; justify-content: center; background: transparent; pointer-events: none; } /* v30.3 : plus de voile noir — les messages restent visibles derrière la roue */
#wheelzone .wheelinner { position: relative; width: min(62vw, 238px); }
#stage #choice { position: absolute; left: 8px; right: 8px; bottom: 10px; z-index: 6; }
#stage #choice .btn { box-shadow: 0 8px 30px rgba(0,0,0,.5); }
#stage #spinrow { position: absolute; left: 8px; right: 8px; bottom: 10px; z-index: 6; }
#qcard { display: none; }
.roundbtn { width: 44px; height: 44px; border-radius: 50%; border: 1.5px solid var(--line); background: var(--bg2); font-size: 18px; cursor: pointer; flex-shrink: 0; display: flex; align-items: center; justify-content: center; padding: 0; }
.roundbtn.send { background: linear-gradient(135deg, var(--hot), var(--hot2)); border: none; color: #fff; font-size: 16px; }
#mediaform:not([hidden]) { position: absolute; top: 6px; left: 6px; right: 6px; z-index: 7; box-shadow: 0 14px 40px rgba(0,0,0,.55); }
.msg { max-width: 82%; background: rgba(255,255,255,.9); color: #131313; border: none; border-radius: 16px; padding: 8px 12px; font-size: 14px; word-break: break-word; box-shadow: 0 2px 12px rgba(0,0,0,.28); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); }
.msg.mine { align-self: flex-end; border-radius: 16px; }
.msg.answer { box-shadow: 0 0 0 2px var(--ok), 0 2px 12px rgba(0,0,0,.28); }
.msg .who { font-size: 11px; color: #9a9a9a; font-weight: 800; margin-bottom: 2px; }
.msg.sys { align-self: center; background: rgba(255,255,255,.14); color: #ddd; font-size: 11.5px; padding: 4px 12px; text-align: center; box-shadow: none; }
.res { display: flex; gap: 4px; flex-wrap: wrap; margin-top: 4px; }
.res span { background: rgba(0,0,0,.08); border-radius: 99px; font-size: 11.5px; padding: 1px 7px; color: #333; font-weight: 700; }
.seenrow { align-self: flex-end; font-size: 10.5px; color: var(--mut); margin-top: -3px; }
#reactpop { position: fixed; z-index: 120; background: var(--card); border: 1px solid var(--line); border-radius: 99px; padding: 5px 7px; display: flex; gap: 2px; box-shadow: 0 12px 40px rgba(0,0,0,.65); }
#reactpop button { border: none; background: transparent; font-size: 23px; padding: 4px 6px; cursor: pointer; }
.audio { display: flex; align-items: center; gap: 8px; cursor: pointer; font-weight: 800; }
.audio .p { width: 30px; height: 30px; border-radius: 50%; background: var(--hot); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 13px; }
#float { position: fixed; inset: 0; pointer-events: none; overflow: hidden; z-index: 50; }
.fe { position: absolute; bottom: -40px; font-size: 32px; animation: rise 2.5s ease-out forwards; }
@keyframes rise { to { transform: translateY(-105vh) rotate(25deg); opacity: .1; } }
#toast { position: fixed; bottom: 22px; left: 50%; transform: translateX(-50%); background: var(--hot); color: #fff; font-weight: 700; padding: 12px 18px; border-radius: 14px; z-index: 99; font-size: 14px; max-width: 92vw; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,.5); }
[hidden] { display: none !important; }
.badge-unread { background: var(--hot); color: #fff; border-radius: 99px; padding: 1px 7px; font-size: 11px; font-weight: 800; }
#inapp { position: fixed; inset: 0; background: rgba(0,0,0,.94); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 16px; }
#inapp[hidden] { display: none !important; }
.inapp-card { max-width: 400px; background: var(--card); border: 1.5px solid var(--hot); border-radius: 20px; padding: 22px; text-align: center; }
.media-img, .media-vid { max-width: 100%; border-radius: 12px; margin-top: 4px; }
.diffrow .btn { padding: 11px 4px; font-size: 13.5px; }
</style>
</head>
<body>

<section id="s-home" class="screen active">
  <div class="card">
    <div class="logo">🌶️</div>
    <h1 class="title">VÉRITÉ ou ACTION</h1>
    <div class="badge18">18+</div>
    <div class="ver">VERSION 31 · 4000 QUESTIONS 🔥</div>
    <label class="check"><input type="checkbox" id="age18"> J'ai 18 ans ou plus 🍾</label>
    <div class="diffrow" id="genderrow">
      <button class="btn sel" data-g="homme">👨 Homme</button>
      <button class="btn" data-g="femme">👩 Femme</button>
    </div>
    <details class="howto">
      <summary>🎲 Première fois ? Comment ça marche (30 sec)</summary>
      <div class="howto-body"><button id="btn-tuto" class="btn small" style="width:100%">🎬 Revoir la mini-vidéo tuto</button></div>
      <div class="howto-body">
        👑 <b>1.</b> Un joueur crée le salon et partage le code à 4 lettres (bouton 💬).<br>
        🚪 <b>2.</b> Les autres tapent leur pseudo + le code puis « Rejoindre » (6 max).<br>
        🎡 <b>3.</b> La roue désigne quelqu un : il choisit 💬 <b>Vérité</b> (répond honnêtement) ou 🎯 <b>Action</b> (fait le défi).<br>
        🔥 <b>4.</b> Il répond par texte, vocal 🎤, photo 📷 ou vidéo 🎬 — puis <b>tout le monde</b> peut relancer la roue.<br>
        🌶️ <b>5.</b> L admin monte le niveau quand ça chauffe. 2 tours sans répondre = éliminé. Tout s efface à la fin 🧹
        📲 <b>BONUS :</b> installe l app sur ton téléphone — <b>Android</b> : menu ⋮ du navigateur → « Ajouter à l écran d accueil » · <b>iPhone</b> : bouton Partager ⬆️ → « Sur l écran d accueil ». Icône 🌶️ comme une vraie app !
      </div>
    </details>
    <input type="text" id="in-name" class="input" maxlength="14" placeholder="Ton pseudo...">
    <button id="btn-create" class="btn big primary">🎓 CRÉER UN SALON</button>
    <div class="divider">— ou —</div>
    <input type="text" id="in-code" class="input code" maxlength="4" placeholder="CODE">
    <button id="btn-join" class="btn big">🚪 REJOINDRE</button>
    <button id="btn-solo" class="btn big">🎲 HORS LIGNE (1 téléphone)</button>
    <p class="hint" style="margin-top:4px">📴 Sans connexion : le groupe joue sur un seul téléphone, on se le passe !</p>
    <button id="btn-homeset" class="btn small" style="align-self:center;border-radius:999px">⚙️ Paramètres</button>
    <div class="setpanel" id="setpanel-home" style="margin:0">
      <div class="setlbl">🎨 Thème de mon téléphone (utilisé hors ligne) :</div>
      <div class="setrow" id="hometheme"></div>
    </div>
    <p class="hint">⚠️ Respect et consentement obligatoires.<br>Tout disparaît à la fin de la session. 🧹</p>
  </div>
</section>

<section id="s-wait" class="screen">
  <div class="card">
    <div class="logo">⏳</div>
    <h2>⏳ En attente de l'admin...</h2>
    <p class="hint" id="wait-code"></p>
    <p class="hint" style="margin-top:6px">Garde cette page ouverte : dès que l admin t accepte, tu entres dans le salon automatiquement 🎉</p>
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
      <p class="hint" style="margin-top:6px">2 joueurs min · 🤖 robot de test · le guide est sur l accueil 🎲</p>
    </div>
    <div class="panel">
      <h3>🔥 Difficulté des questions</h3>
      <div class="diffrow segbar" id="diffrow">
        <button class="btn" data-d="1">😄<br>Facile</button>
        <button class="btn" data-d="2">😏<br>Moyen</button>
        <button class="btn" data-d="3">🔥<br>Direct</button>
        <button class="btn" data-d="4">🌶️<br>CHAUD</button>
      </div>
      <p class="hint" style="margin-top:6px">🌶️ = le plus chaud : vocabulaire cru + gages photo/vidéo</p>
    </div>
    <button id="btn-addbot" class="btn" hidden>🤖 Ajouter un robot (test solo)</button>
    <button id="btn-start" class="btn big primary">▶️ LANCER LA PARTIE</button>
    <p class="hint" id="start-hint"></p>
  </div>
</section>

<section id="s-game" class="screen">
  <div class="topbar">
    <button id="btn-leave" class="gearbtn" title="Quitter le salon">🚪</button>
    <span class="code-big" id="g-code" title="Cliquer pour copier">----</span>
    <span id="plugcount" class="plugcount">👥 1/6</span>
    <button id="btn-settings" class="gearbtn" style="margin-left:auto" title="Paramètres">⚙️</button>
  </div>
  <div class="setpanel" id="setpanel-game">
    <h3>⚙️ Paramètres</h3>
    <div class="setlbl">🎚️ Niveau des questions (admin, même en pleine partie) :</div>
    <div class="segbar" id="setdiff">
      <button class="btn sd" data-d="1">😄<br>Facile</button>
      <button class="btn sd" data-d="2">😏<br>Moyen</button>
      <button class="btn sd" data-d="3">🔥<br>Direct</button>
      <button class="btn sd" data-d="4">🌶️<br>CHAUD</button>
    </div>
    <div class="setlbl">🎨 Thème de l app (admin, retenu hors ligne) :</div>
    <div class="setrow" id="themrow"></div>
    <button id="btn-invite-wa" class="btn wa" style="width:100%;margin-top:12px">📲 Partager le salon sur WhatsApp</button>
    <button id="btn-stop2" class="btn danger" style="width:100%;margin-top:12px" hidden>🏁 Terminer la partie (tout est supprimé)</button>
    <p class="hint" id="setinfo2" style="margin-top:8px"></p>
  </div>
  <div class="wrap">
    <div class="grid6" id="game-grid"></div>
    <div id="phase" hidden>…</div>
    <div class="phasehint" id="phasehint" hidden></div>
    <div id="qband" hidden>
      <span id="qbadge"></span>
      <span id="qtext2"></span>
      <span id="qwho"></span>
    </div>
    <div id="stage">
    <div id="choice" hidden>
      <button id="btn-verite" class="btn v">💬 VÉRITÉ</button>
      <button id="btn-action" class="btn a">🎯 ACTION</button>
    </div>
    <div id="qcard" hidden>
      <div id="qtype"></div>
      <div id="qtext"></div>
    </div>
    <div id="spinrow" hidden style="text-align:center;margin:10px 0">
      <button id="btn-spin" class="btn" style="font-size:17px;padding:14px 22px">🎯 LANCER LA ROUE !</button>
      <p class="hint" style="margin-top:5px">Tout le monde peut lancer — le premier clic gagne 😉</p>
    </div>
      <div id="feedwrap">
      <div id="feedbody" class="chatbody">
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
        <div class="feed" id="feed"></div>
      </div>
      <div id="typing" hidden></div>
      </div>
      <div class="wheelzone" id="wheelzone">
        <div class="wheelinner">
          <canvas id="wheel" width="560" height="560"></canvas>
          <div class="pointer">▼</div>
        </div>
      </div>
      <div id="choice" hidden>
        <button id="btn-verite" class="btn v">💬 VÉRITÉ</button>
        <button id="btn-action" class="btn a">🎯 ACTION</button>
      </div>
      <div id="qcard" hidden>
        <div id="qtype"></div>
        <div id="qtext"></div>
      </div>
      <div id="spinrow" hidden style="text-align:center;margin:0">
        <button id="btn-spin" class="btn" style="font-size:17px;padding:14px 22px">🎯 LANCER LA ROUE !</button>
        <p class="hint" style="margin-top:5px">Tout le monde peut lancer — le premier clic gagne 😉</p>
      </div>
    </div>
    <div class="chatbar">
      <div class="pillwrap">
        <input type="text" id="in-chat" class="chatinput" maxlength="300" placeholder="Message…" autocomplete="off">
        <button id="btn-media" title="Photo / vidéo">📷</button>
      </div>
      <button id="mic" class="roundbtn" title="Vocal (30s)">🎤</button>
      <button id="btn-chat" class="roundbtn send" title="Envoyer">➤</button>
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
const THEMES_UI = [['grenade', '🌶️'], ['sunset', '🌅'], ['honey', '🍯'], ['velvet', '🍷'], ['ocean', '🌊'], ['lavender', '💜'], ['mint', '🌿'], ['coffee', '☕'], ['neon', '🌌'], ['gold', '👑']];
const THEME_N = { grenade: '🌶️ Grenade', sunset: '🌅 Coucher de soleil', honey: '🍯 Miel', velvet: '🍷 Velours', ocean: '🌊 Océan', lavender: '💜 Lavande', mint: '🌿 Menthe', coffee: '☕ Café', neon: '🌌 Néon', gold: '👑 Or' };
function buildSwatches(boxId, isRoom) {
  var box = document.getElementById(boxId); if (!box) return;
  box.innerHTML = '';
  THEMES_UI.forEach(function (th) {
    var b = document.createElement('button');
    b.className = 'swatch'; b.dataset.t = th[0]; b.textContent = th[1]; b.title = THEME_N[th[0]];
    b.setAttribute('aria-label', THEME_N[th[0]]);
    if (isRoom) {
      b.style.display = isAdmin() ? '' : 'none';
      tap(b, function () { socket.emit('theme', { t: th[0] }); });
    } else {
      tap(b, function () {
        applyTheme(th[0]);
        var pan = box.closest('.setpanel');
        if (pan) pan.querySelectorAll('.swatch').forEach(function (x) { x.classList.toggle('sel', x === b); });
      });
    }
    box.appendChild(b);
  });
  paintSwatches(boxId, isRoom);
}
function paintSwatches(boxId, isRoom) {
  var cur = (isRoom && S && S.theme) ? S.theme : (function () { try { return localStorage.getItem('voa_theme') || 'grenade'; } catch (e) { return 'grenade'; } })();
  var box = document.getElementById(boxId); if (!box) return;
  box.querySelectorAll('.swatch').forEach(function (x) {
    x.classList.toggle('sel', x.dataset.t === cur);
    if (isRoom) x.style.display = isAdmin() ? '' : 'none';
  });
}
function togglePanel(id) { var p = document.getElementById(id); if (p) p.classList.toggle('open'); }
document.addEventListener('click', function (e) {
  if (e.target.closest && e.target.closest('#btn-settings')) togglePanel('setpanel-game');
  if (e.target.closest && e.target.closest('#btn-homeset')) togglePanel('setpanel-home');
});
$('#btn-homeset') && (function () {})();
function applyTheme(t) {
  try { document.body.setAttribute('data-theme', t || 'grenade'); } catch (e) {}
  save('voa_theme', t || 'grenade');
}
(function () { var t = null; try { t = localStorage.getItem('voa_theme'); } catch (e) {} if (t) { try { document.body.setAttribute('data-theme', t); } catch (e) {} } })();
document.addEventListener('DOMContentLoaded', function () { buildSwatches('hometheme', false); });

/* ---------- 🎬 Mini-vidéo tuto (lecteur animé 4 scènes) ---------- */
var TUTO = [
  { t: '🎓 Créer ton salon', l: ['Tape ton pseudo puis « CRÉER UN SALON »', 'Un CODE à 4 lettres apparaît — envoie-le sur WhatsApp 📲'], m: [['🙋', 'Alioune'], ['🎓', 'CRÉER UN SALON'], ['🔑', 'Code : WQ38 → 💬 WhatsApp']] },
  { t: '🚪 Rejoindre avec le CODE', l: ['Tes amis tapent leur pseudo + le code', 'L admin les accepte ✅ et ils apparaissent dans la grille'], m: [['🙋', 'Jacqueline'], ['🔤', 'Code : WQ38'], ['✅', 'Acceptée par l admin !']] },
  { t: '🎡 Jouer !', l: ['La roue désigne quelqu un → Vérité 💬 ou Action 🎯', 'Réponse par texte, vocal 🎤, photo 📷 ou vidéo 🎬'], m: [['🎡', 'La roue choisit…'], ['💬', 'Vérité ou 🎯 Action'], ['🔥', 'Il répond → on relance tous !']] },
  { t: '📴 Même sans internet', l: ['Installe l app : Partager ⬆️ → « Sur l écran d accueil »', 'Sans connexion → bouton « HORS LIGNE » : on joue sur 1 téléphone !'], m: [['✈️', 'Mode avion ON'], ['🌶️', 'Icône 🌶️ sur l écran'], ['🎲', 'HORS LIGNE (1 téléphone)']] }
];
var tutoIdx = 0, tutoTimer = null;
function tutoShow(i) {
  tutoIdx = (i + TUTO.length) % TUTO.length;
  var s = TUTO[tutoIdx], box = document.getElementById('tuto-scene');
  if (!box) return;
  box.innerHTML = '<div style="font-size:38px">' + s.t + '</div>'
    + s.m.map(function (x) { return '<div class="tuto-mock"><span style="font-size:20px">' + x[0] + '</span> ' + x[1] + '</div>'; }).join('<span class="tuto-arrow">↓</span>')
    + '<div style="font-size:12.5px;color:var(--mut);line-height:1.5">' + s.l.map(function (x) { return '• ' + x; }).join('<br>') + '</div>';
  box.style.animation = 'none'; void box.offsetWidth; box.style.animation = '';
  var dots = document.getElementById('tuto-dots');
  dots.innerHTML = TUTO.map(function (_, k) {
    return '<span style="width:9px;height:9px;border-radius:50%;background:' + (k === tutoIdx ? 'var(--hot)' : 'var(--line)') + '"></span>';
  }).join('');
  document.getElementById('tuto-next').textContent = (tutoIdx === TUTO.length - 1) ? 'Commencer 🌶️' : 'Suivant ▶';
}
function tutoOpen(auto) {
  var t = document.getElementById('tuto'); if (!t) return;
  t.hidden = false; tutoShow(0);
  clearInterval(tutoTimer);
  tutoTimer = setInterval(function () { tutoShow(tutoIdx + 1); }, 5000);
  try { if (auto) localStorage.setItem('voa_tuto', '1'); } catch (e) {}
}
function tutoClose() { var t = document.getElementById('tuto'); if (t) t.hidden = true; clearInterval(tutoTimer); try { localStorage.setItem('voa_tuto', '1'); } catch (e) {} }
document.addEventListener('click', function (e) {
  if (e.target.closest && e.target.closest('#btn-tuto')) tutoOpen(false);
  if (e.target.closest && e.target.closest('#tuto-skip')) tutoClose();
  if (e.target.closest && e.target.closest('#tuto-next')) { if (tutoIdx === TUTO.length - 1) tutoClose(); else tutoShow(tutoIdx + 1); }
});
(function () { var seen = null; try { seen = localStorage.getItem('voa_tuto'); } catch (e) {} if (!seen) setTimeout(function () { tutoOpen(true); }, 600); })();
try { if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(function () {}); } catch (e) {}

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
  if (s && n && !S) { myName = n; socket.emit('room:join', { name: n, code: s, gender: myGender }); }
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
socket.on('feed:init', function (d) { items = []; seenMap = d.seen || {}; d.feed.forEach(addMsg); drawFeed(); });
socket.on('feed:new', function (it) { addMsg(it); drawFeed(); });
socket.on('feed:seen', function (d) { if (d && d.name) { seenMap[d.name] = d.id; renderSeen(); } });
socket.on('feed:re', function (d) { for (var i = 0; i < items.length; i++) if (String(items[i].id) === String(d.id)) { items[i].re = d.re; break; } drawFeed(); });
socket.on('feed:typing', function (d) {
  var m = me(); if (!d || !d.name || (m && d.name === m.name)) return;
  var t = $('#typing'); if (!t) return;
  t.textContent = '✍️ ' + d.name + ' écrit…'; t.hidden = false;
  clearTimeout(tyT); tyT = setTimeout(function () { t.hidden = true; }, 2600);
});

socket.on('room:state', function (st) {
  if (myPending) return;   /* en attente d approbation : on reste sur l écran d attente */
  S = st;
  if (st.theme) applyTheme(st.theme);
  save('voa_code', st.code); save('voa_name', myName);
  if (st.phase === 'lobby') { renderLobby(); show('s-lobby'); }
  else { renderGame(); show('s-game'); }
});
socket.on('wheel', function (d) { lastSpinKey = (d.targetId || '') + ':' + (d.spinAt || 0); spin(d.targetId, d.duration || 4000); });
socket.on('reaction', function (d) { float(d.emoji); });
socket.on('player:offline', function (d) { toast('📴 ' + d.name + ' s\u2019est déconnecté !', true); });
socket.on('player:back', function (d) { toast('🔄 ' + d.name + ' est revenu !'); });
socket.on('media:new', function (it) { addMsg(it); drawFeed(); if (it.mid !== socket.id) toast('📷 ' + it.name + ' t\u2019a envoyé du contenu privé'); });
socket.on('room:closed', function (d) { del('voa_code'); S = null; myPending = null; if (d && d.why === 'parti') { show('s-home'); toast('🚪 Salon fermé — l\u2019autre joueur est parti'); } else show('s-end'); });

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
  if (isAdmin() && !lastPending.length) socket.emit('pending:list');
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
  var TR = document.getElementById('themrow');
  if (TR && !TR.children.length) buildSwatches('themrow', true);
  else if (TR) paintSwatches('themrow', true);
  var SI = document.getElementById('setinfo');
  if (SI) SI.textContent = isAdmin() ? 'Les joueurs verront ce thème, même hors ligne 📴' : 'Seul l admin change le thème — lui aussi sera retenu hors ligne 📴';
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
socket.on('join:expired', function () { toast('⌛ Demande expirée — demande au joueur de retaper le code', true); });

$('#btn-addbot').onclick = function () { socket.emit('bot:add'); };
$('#btn-start').onclick = function () { socket.emit('game:start'); };
$('#btn-leave-lobby').onclick = function () { socket.emit('room:leave'); del('voa_code'); S = null; show('s-home'); };
document.querySelectorAll('#diffrow .btn').forEach(function (b) {
  tap(b, function () { socket.emit('difficulty', { d: +b.dataset.d }); });
});

function inviteLink() { return '🔥 On joue à Vérité ou Action (18+) ! Rejoins ma partie : ' + location.origin + '/#/join/' + S.code; }
$('#btn-invite').onclick = function () { socket.emit('invite:refresh'); window.open('https://wa.me/?text=' + encodeURIComponent(inviteLink()), '_blank'); };
function inviteWA() { socket.emit('invite:refresh'); window.open('https://wa.me/?text=' + encodeURIComponent(inviteLink()), '_blank'); }
var biw = document.getElementById('btn-invite-wa');
if (biw) biw.onclick = inviteWA;
function copyCode() { if (!S) return; if (navigator.clipboard) navigator.clipboard.writeText(S.code).then(function () { toast('📋 Code copié : ' + S.code); }, function () { toast('Code : ' + S.code, true); }); else toast('Code : ' + S.code, true); }
$('#lobby-code').onclick = copyCode;
$('#g-code').onclick = copyCode;
if (location.hash.indexOf('#join/') === 0) { $('#in-code').value = location.hash.slice(6, 10).toUpperCase(); }

/* ---------- Jeu ---------- */
var PH = { choosing: 60000, answering: 120000, reacting: 20000 };
var lastSpinKey = null;   /* v30.3 : garantit que la roue tourne chez TOUT le monde (admin, joueur, reconnexions) */
function renderGame() {
  var m = me(); if (!m) return;
  $('#g-code').textContent = S.code;
  var pc = $('#plugcount');
  if (pc) pc.textContent = '👥 ' + S.players.filter(function (p) { return p.connected || p.isBot; }).length + '/' + S.maxPlayers;
  var t = S.turn, tp = null;
  if (t) for (var i = 0; i < S.players.length; i++) if (S.players[i].id === t.targetId) tp = S.players[i];
  var isMe = !!(t && t.targetId === socket.id);
  var ph = $('#phase');
  if (S.phase === 'spinning') ph.textContent = '🎡 La roue tourne...';
  else if (S.phase === 'choosing') ph.textContent = isMe ? 'À TOI ! Choisis :' : '🎯 ' + (tp ? tp.name : '?') + ' choisit...';
  else if (S.phase === 'answering') ph.textContent = isMe ? '💬 Réponds sans filtrer !' : '💬 ' + (tp ? tp.name : '?') + ' répond...';
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
  var sdb = document.querySelectorAll('#setdiff .sd');
  for (var gi = 0; gi < sdb.length; gi++) {
    sdb[gi].classList.toggle('sel', +sdb[gi].dataset.d === S.difficulty);
    sdb[gi].style.display = isAdmin() ? '' : 'none';
  }
  var si2 = document.getElementById('setinfo2');
  if (si2) si2.textContent = isAdmin() ? 'Niveau et thème s appliquent à toute la salle, même en pleine partie 🔥' : 'Seul l admin change le niveau et le thème';
  var bs2 = document.getElementById('btn-stop2');
  if (bs2) bs2.hidden = !isAdmin();
  $('#choice').hidden = !(S.phase === 'choosing' && isMe);
  var wz = document.getElementById('wheelzone');
  if (wz) wz.hidden = S.phase !== 'spinning';   /* la roue se rétracte dès que la question arrive */
  if (S.phase === 'spinning' && t && t.targetId) {          /* v30.3 : animation relancée localement si l'événement wheel a été raté */
    var sk = t.targetId + ':' + (t.spinAt || 0);
    if (sk !== lastSpinKey) {
      lastSpinKey = sk;
      var rem = t.deadline ? (t.deadline - Date.now()) : 4000;
      spin(t.targetId, Math.max(1500, Math.min(rem || 4000, 4500)));
    }
  } else if (S.phase !== 'spinning') lastSpinKey = null;
  var showQ = !!(t && t.question && (S.phase === 'answering' || S.phase === 'reacting'));
  $('#qcard').hidden = !showQ;
  if (showQ) {
    $('#qtype').textContent = (t.ai ? '🤖 IA · ' : '') + (t.type === 'verite' ? 'VÉRITÉ 💬 — réponds sans mentir' : 'ACTION 🎯 — à toi d\u2019oser');
    $('#qtext').textContent = t.question;
  }
  var qb = document.getElementById('qband');
  if (qb) {
    qb.hidden = !showQ;
    if (showQ) {
      var qb1 = document.getElementById('qbadge'), qb2 = document.getElementById('qtext2'), qb3 = document.getElementById('qwho');
      if (qb1) qb1.textContent = (t.ai ? '🤖 IA · ' : '') + (t.type === 'verite' ? 'VÉRITÉ' : 'ACTION');
      if (qb2) qb2.textContent = t.question;
      if (qb3) qb3.textContent = (t.ai ? '🤖 IA · ' : '') + (isMe ? 'À toi !' : (tp ? tp.name : '?') + ' répond');
    }
  }
  var ic = $('#in-chat');
  if (ic) ic.placeholder = (S.phase === 'answering' && isMe && t && !t.answered) ? '💬 Ta réponse… (texte)' : 'Message…';
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
  if (typeof requestAnimationFrame === 'undefined') { drawWheel(); return; }   /* v30.3 : vieux navigateurs / tests — pas de crash */
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
/* Réponse = le champ Message… (le serveur compte le message du joueur désigné comme sa réponse) */
function sendChat() { var v = $('#in-chat').value.trim(); if (!v) return; $('#in-chat').value = ''; socket.emit('chat:text', { text: v }); }
$('#btn-chat').onclick = sendChat;
$('#in-chat').addEventListener('keydown', function (e) { if (e.key === 'Enter') sendChat(); });
var bs2o = document.getElementById('btn-stop2');
if (bs2o) bs2o.onclick = function () { if (confirm('Terminer ? TOUT sera supprimé (messages + audios).')) socket.emit('game:stop'); };
document.querySelectorAll('#setdiff .sd').forEach(function (b) {
  tap(b, function () { socket.emit('difficulty', { d: +b.dataset.d }); });
});
tap($('#btn-leave'), function () {
  if (confirm('Quitter le salon ? Tu pourras revenir avec le code.')) { socket.emit('room:leave'); del('voa_code'); S = null; myPending = null; show('s-home'); }
});

/* ---------- Réactions : emoji libres du clavier via le chat ---------- */
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
  items.forEach(function (it) {           /* v30 : ordre Insta — anciens en haut, nouveaux EN BAS */
    var el = document.createElement('div');
    if (it.id) el.dataset.id = it.id;
    if (it.kind === 'sys') { el.className = 'msg sys'; el.textContent = it.text; }
    else if (it.kind === 'audio' || it.kind === 'answer-audio') {
      el.className = 'msg' + (it.kind === 'answer-audio' ? ' answer' : '') + (it.mid === socket.id ? ' mine' : '');
      var w = document.createElement('div'); w.className = 'who'; w.textContent = '🎙️ ' + (it.mid === socket.id ? 'Toi' : it.name);
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
      el.className = 'msg' + (it.kind === 'answer' ? ' answer' : '') + (it.mid === socket.id ? ' mine' : '');
      var w2 = document.createElement('div'); w2.className = 'who'; w2.textContent = (it.kind === 'answer' ? '💬 ' : '') + (it.mid === socket.id ? 'Toi' : it.name);
      var tx = document.createElement('span'); tx.textContent = it.text;
      el.appendChild(w2); el.appendChild(tx);
    }
    if (!el.classList.contains('sys') && it.re) {
      var rr = document.createElement('div'); rr.className = 'res';
      for (var rk in it.re) if (it.re[rk] && it.re[rk].length) { var rs = document.createElement('span'); rs.textContent = rk + (it.re[rk].length > 1 ? ' ' + it.re[rk].length : ''); rr.appendChild(rs); }
      if (rr.children.length) el.appendChild(rr);
    }
    f.appendChild(el);
  });
  renderSeen();
  f.scrollTop = f.scrollHeight;           /* v30 : on suit le dernier message, comme Insta */
  seenAck();
}
/* v30 · 👁️ « Vu » sous ton dernier message */
function renderSeen() {
  var f = $('#feed'); if (!f) return;
  var old = f.querySelector('.seenrow'); if (old) old.remove();
  var m = me(); if (!m || !S) return;
  var lastMine = null;
  for (var i = items.length - 1; i >= 0; i--) if (items[i].mid === socket.id && items[i].kind !== 'sys' && items[i].id) { lastMine = items[i]; break; }
  if (!lastMine) return;
  var who = [];
  for (var n in seenMap) {
    if (n === m.name || !seenMap[n]) continue;
    if (+seenMap[n] < +lastMine.id) continue;
    var inRoom = false;
    for (var q = 0; q < S.players.length; q++) if (S.players[q].name === n) inRoom = true;
    if (inRoom) who.push(n);
  }
  if (!who.length) return;
  var d = document.createElement('div'); d.className = 'seenrow';
  d.textContent = '👁️ Vu' + (who.length === 1 ? ' par ' + who[0] : ' · ' + who.length);
  f.appendChild(d);
}
var seenMap = {}, tyT = null, lastAck = 0;
function seenAck() {
  if (!S) return;
  var now = Date.now(); if (now - lastAck < 900) return; lastAck = now;
  for (var i = items.length - 1; i >= 0; i--) if (items[i].id) { socket.emit('feed:seen'); return; }
}

/* ---------- v30 · Réactions Insta : appui long ou double-tap sur une bulle ---------- */
var REP = ['❤️', '😂', '😮', '😢', '🔥', '👍'];
var rpEl = null, rpId = null, lpT = null, lpFired = false, dTapT = 0, dTapId = null;
function closeReact() { if (rpEl) { rpEl.remove(); rpEl = null; } rpId = null; }
function openReact(el, id) {
  closeReact(); rpId = id;
  rpEl = document.createElement('div'); rpEl.id = 'reactpop';
  REP.forEach(function (e) {
    var b = document.createElement('button'); b.type = 'button'; b.textContent = e;
    b.onclick = function (ev) { ev.stopPropagation(); socket.emit('chat:react', { id: rpId, emoji: e }); closeReact(); };
    rpEl.appendChild(b);
  });
  document.body.appendChild(rpEl);
  var r = el.getBoundingClientRect(), w = rpEl.offsetWidth || 230;
  var x = Math.max(8, Math.min((window.innerWidth || 360) - w - 8, r.left + r.width / 2 - w / 2));
  var y = Math.max(8, r.top - 56);
  rpEl.style.left = x + 'px'; rpEl.style.top = y + 'px';
}
var feedEl = document.getElementById('feed');
function feedMsgFrom(e) { var t = e.target; while (t && t !== feedEl) { if (t.classList && t.classList.contains('msg')) return t; t = t.parentElement; } return null; }
if (feedEl) {
  feedEl.addEventListener('contextmenu', function (e) { var m = feedMsgFrom(e); if (m && m.dataset.id && !m.classList.contains('sys')) { e.preventDefault(); openReact(m, m.dataset.id); } });
  feedEl.addEventListener('touchstart', function (e) { var m = feedMsgFrom(e); if (!m || !m.dataset.id || m.classList.contains('sys')) return; lpFired = false; lpT = setTimeout(function () { lpT = null; lpFired = true; openReact(m, m.dataset.id); }, 430); }, { passive: true });
  ['touchmove', 'touchcancel'].forEach(function (ev) { feedEl.addEventListener(ev, function () { if (lpT) { clearTimeout(lpT); lpT = null; } }, { passive: true }); });
  feedEl.addEventListener('touchend', function (e) {
    if (lpT) { clearTimeout(lpT); lpT = null; }
    if (lpFired) { lpFired = false; return; }
    if (rpEl) { closeReact(); return; }
    var m = feedMsgFrom(e); if (!m || !m.dataset.id || m.classList.contains('sys')) return;
    var now = Date.now();
    if (dTapId === m.dataset.id && now - dTapT < 350) { socket.emit('chat:react', { id: m.dataset.id, emoji: '❤️' }); dTapT = 0; }
    else { dTapT = now; dTapId = m.dataset.id; }
  }, { passive: true });
  feedEl.addEventListener('dblclick', function (e) { var m = feedMsgFrom(e); if (m && m.dataset.id && !m.classList.contains('sys')) socket.emit('chat:react', { id: m.dataset.id, emoji: '❤️' }); });
}
document.addEventListener('click', function (e) { if (rpEl && !(e.target.closest && e.target.closest('#reactpop'))) closeReact(); });
/* ✍️ « … écrit » */
var lastTy = 0;
$('#in-chat').addEventListener('input', function () { var now = Date.now(); if (now - lastTy > 1400) { lastTy = now; socket.emit('chat:typing'); } });

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
      $('#mic').textContent = '🎤';
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
    $('#mic').textContent = '🔴';
    recInt = setInterval(function () {
      if (Date.now() - recT0 > 30000 && rec.state === 'recording') rec.stop();
    }, 300);
  }, function () { toast('Micro inaccessible 😬 Vérifie les permissions.'); });
};
</script>
<section id="s-solo" class="screen">
  <div class="card">
    <div class="logo">🎲</div>
    <h1 class="title">HORS LIGNE</h1>
    <p class="hint">Plusieurs joueurs, <b>UN SEUL téléphone</b>. Zéro connexion 📴 — on se le passe à chaque tour !</p>
    <div id="solo-rows"></div>
    <button id="solo-add" class="btn small" style="margin-top:6px">➕ Ajouter un joueur</button>
    <div class="diffrow" id="solodiff" style="margin-top:10px">
      <button class="btn" data-d="1">😄</button>
      <button class="btn" data-d="2">😏</button>
      <button class="btn sel" data-d="3">🔥</button>
      <button class="btn" data-d="4">🌶️</button>
    </div>
    <button id="solo-start" class="btn big primary" style="margin-top:10px">▶️ COMMENCER</button>
    <button id="solo-back" class="btn small" style="margin-top:6px">← Retour</button>
  </div>
</section>
<section id="s-solo2" class="screen">
  <div class="wrap">
    <div class="topbar"><span class="code-big">🎲 HORS LIGNE</span><button id="solo-settings" class="gearbtn" style="margin-left:auto" title="Paramètres">⚙️</button><button id="solo-quit" class="btn small danger">Quitter</button></div>
    <div class="setpanel" id="setpanel-solo">
      <h3>⚙️ Paramètres</h3>
      <div class="setlbl">🎨 Thème (restera pour vos prochaines parties hors ligne) :</div>
      <div class="setrow" id="solotheme"></div>
    </div>
    <div id="solo-chips" style="display:flex;flex-wrap:wrap;gap:5px;justify-content:center;margin:4px 0"></div>
    <div id="phase">Prêt ?</div>
    <div class="wheelzone"><canvas id="swheel" width="330" height="330"></canvas><div class="pointer">▼</div></div>
    <div id="solo-spinrow" style="text-align:center"><button id="solo-gospin" class="btn" style="font-size:17px;padding:14px 22px">🎯 LANCER LA ROUE !</button></div>
    <div id="solo-choice" hidden><button id="solo-verite" class="btn v">💬 VÉRITÉ</button> <button id="solo-action" class="btn a">🎯 ACTION</button></div>
    <div id="solo-qcard" hidden><div id="solo-qtype" class="hint"></div><div id="solo-qtext" style="font-size:19px;font-weight:900;margin:8px 0"></div>
      <div style="display:flex;gap:8px;margin-top:10px"><button id="solo-done" class="btn primary" style="flex:1">✅ C est fait !</button><button id="solo-pass" class="btn" style="flex:1">⏭️ Passé</button></div>
    </div>
    <div id="solo-msg" class="hint" style="margin-top:8px"></div>
  </div>
</section>
<script>
(function () {
  var SO = null, spinning = false;
  function $(s) { return document.querySelector(s); }
  function show(id) { document.querySelectorAll('.screen').forEach(function (s) { s.classList.remove('active'); }); var e = document.getElementById(id); if (e) e.classList.add('active'); }
  function esc(t) { var d = document.createElement('div'); d.textContent = t; return d.innerHTML; }

  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('#btn-solo');
    if (b) {
      if (typeof QUESTIONS === 'undefined') { alert('Ouvre le jeu une première fois avec connexion 📥 — les questions se téléchargeront, après tu pourras jouer sans internet !'); return; }
      renderRows(); show('s-solo');
    }
  });
  function renderRows() {
    var n = document.querySelectorAll('#solo-rows input').length || 3;
    if (SO && SO.names) n = SO.names.length;
    var box = $('#solo-rows'); box.innerHTML = '';
    for (var i = 0; i < n; i++) {
      var inp = document.createElement('input');
      inp.className = 'input solo-name'; inp.maxLength = 14; inp.placeholder = 'Joueur ' + (i + 1) + '...';
      if (SO && SO.names && SO.names[i]) inp.value = SO.names[i];
      box.appendChild(inp);
    }
  }
  document.addEventListener('click', function (e) {
    if (e.target.id === 'solo-add') { SO = SO || { names: [] }; var ins = document.querySelectorAll('#solo-rows input'); if (ins.length < 10) { SO.names = collect(); SO.names.push(''); renderRows(); } }
    if (e.target.id === 'solo-back') { show('s-home'); }
    if (e.target.id === 'solo-quit') { if (confirm('Quitter la partie hors ligne ?')) { SO = null; spinning = false; show('s-home'); } }
  });
  function collect() { var out = []; document.querySelectorAll('#solo-rows input').forEach(function (i) { out.push(i.value.trim()); }); return out; }
  document.querySelectorAll('#solodiff .btn').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('#solodiff .btn').forEach(function (x) { x.classList.remove('sel'); });
      b.classList.add('sel');
    });
  });
  buildSwatches('solotheme', false);
  document.getElementById('solo-settings') && document.getElementById('solo-settings').addEventListener('click', function () { togglePanel('setpanel-solo'); });

  function soloQ(type) {
    var d = SO.diff;
    var bank = QUESTIONS[d][type], pre = d + ':' + type + ':';
    var idxs = bank.map(function (_, i) { return i; }).filter(function (i) { return !SO.used.has(pre + i); });
    if (!idxs.length) { bank.forEach(function (_, i) { SO.used.delete(pre + i); }); idxs = bank.map(function (_, i) { return i; }); }
    var i = idxs[Math.floor(Math.random() * idxs.length)];
    SO.used.add(pre + i);
    var q = bank[i];
    var nm = SO.players[SO.turn].name;
    var c = q.slice(0, 1);
    if (/[A-Z\u00C0-\u00DD]/.test(c)) q = c.toLowerCase() + q.slice(1);
    return nm + ', ' + q;
  }

  function drawW(rot) {
    var cv = $('#swheel'); if (!cv) return;
    var ctx = cv.getContext && cv.getContext('2d'); if (!ctx) return;
    var W = cv.width, cx = W / 2, R = W / 2 - 10, n = SO.players.length;
    ctx.clearRect(0, 0, W, W);
    for (var i = 0; i < n; i++) {
      var a0 = rot + i * 2 * Math.PI / n, a1 = rot + (i + 1) * 2 * Math.PI / n;
      ctx.beginPath(); ctx.moveTo(cx, cx); ctx.arc(cx, cx, R, a0, a1); ctx.closePath();
      ctx.fillStyle = i % 2 ? '#2a1220' : '#43142b';
      if (i === SO.turn) ctx.fillStyle = '#ff2e63';
      ctx.fill();
      ctx.strokeStyle = '#14090f'; ctx.lineWidth = 2; ctx.stroke();
      var am = (a0 + a1) / 2;
      ctx.save(); ctx.translate(cx + Math.cos(am) * R * 0.62, cx + Math.sin(am) * R * 0.62); ctx.rotate(am + Math.PI / 2);
      ctx.fillStyle = '#fff'; ctx.font = 'bold ' + Math.max(10, 16 - n) + 'px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(SO.players[i].name.slice(0, 10), 0, 4); ctx.restore();
    }
    ctx.beginPath(); ctx.arc(cx, cx, 12, 0, 7); ctx.fillStyle = '#fff'; ctx.fill();
  }

  function chips() {
    if (!SO) return;
    var c = $('#solo-chips'); c.innerHTML = '';
    SO.players.forEach(function (p, i) {
      var s = document.createElement('span');
      s.style.cssText = 'background:#2a1220;border:1.5px solid ' + (i === SO.turn ? '#ff2e63' : '#3a1f33') + ';border-radius:20px;padding:4px 10px;font-size:12px;font-weight:800';
      s.textContent = p.name + (p.misses ? ' ✖️'.repeat(p.misses) : '');
      c.appendChild(s);
    });
  }

  function nextTurn(msg) {
    if (!SO) return;
    SO.turn = (SO.turn + 1) % SO.players.length;
    SO.phase = 'spin';
    $('#solo-msg').textContent = msg || '';
    $('#solo-choice').hidden = true; $('#solo-qcard').hidden = true; $('#solo-spinrow').style.display = '';
    $('#phase').textContent = '🎯 Au tour de ' + SO.players[SO.turn].name + ' — lance la roue !';
    chips(); drawW(SO.rot || 0);
  }

  document.addEventListener('click', function (e) {
    if (e.target.id !== 'solo-start') return;
    var names = collect().filter(function (x) { return x; });
    if (names.length < 2) { alert('Il faut au moins 2 joueurs 😄'); return; }
    var d = 3; document.querySelectorAll('#solodiff .btn').forEach(function (x) { if (x.classList.contains('sel')) d = +x.dataset.d; });
    SO = { names: names, diff: d, players: names.map(function (n) { return { name: n, misses: 0 }; }), turn: -1, phase: 'spin', used: new Set(), rot: 0 };
    show('s-solo2'); nextTurn('📴 Mode hors ligne — tout le monde peut voir les réponses à voix haute !');
  });

  document.addEventListener('click', function (e) {
    if (e.target.id !== 'solo-gospin' || !SO || spinning) return;
    if (SO.rot === undefined) SO.rot = 0;
    spinning = true;
    $('#solo-spinrow').style.display = 'none';
    $('#phase').textContent = '🎡 La roue tourne...';
    var ctx = $('#swheel').getContext && $('#swheel').getContext('2d');
    if (!ctx) { SO.turn = Math.floor(Math.random() * SO.players.length); toChoose(); spinning = false; return; }
    var v = 0.35 + Math.random() * 0.25;
    (function anim() {
      if (!SO) { spinning = false; return; }   // partie quittée pendant la rotation → stop net
      SO.rot += v; v *= 0.981;
      try { drawW(SO.rot); } catch (e2) { spinning = false; return; }
      if (v > 0.004) requestAnimationFrame(anim);
      else {
        var n = SO.players.length, seg = 2 * Math.PI / n;
        var top = ((Math.PI * 1.5 - SO.rot) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        SO.turn = Math.min(n - 1, Math.floor(top / seg));
        drawW(SO.rot); toChoose(); spinning = false;
      }
    })();
  });

  function toChoose() {
    if (!SO) return;
    SO.phase = 'choose';
    chips();
    $('#phase').textContent = SO.players[SO.turn].name + ', choisis !';
    $('#solo-choice').hidden = false;
  }
  function pick(type) {
    SO.phase = 'question';
    $('#solo-choice').hidden = true;
    var q = soloQ(type);
    $('#solo-qtype').textContent = (type === 'verite' ? 'VÉRITÉ 💬 — réponds sans mentir' : 'ACTION 🎯 — à toi d oser') + ' · ' + ['😄', '😏', '🔥', '🌶️'][SO.diff - 1];
    $('#solo-qtext').textContent = q;
    $('#solo-qcard').hidden = false;
  }
  document.addEventListener('click', function (e) {
    if (!SO) return;
    if (SO.rot === undefined) SO.rot = 0;
    if (e.target.id === 'solo-verite') pick('verite');
    if (e.target.id === 'solo-action') pick('action');
    if (e.target.id === 'solo-done' && SO.phase === 'question') nextTurn('🔥 ' + SO.players[SO.turn].name + ' a assuré ! Au suivant.');
    if (e.target.id === 'solo-pass' && SO.phase === 'question') {
      var p = SO.players[SO.turn]; p.misses++;
      if (p.misses >= 2) {
        SO.players.splice(SO.turn, 1);
        if (SO.players.length < 2) { $('#phase').textContent = '🏆 ' + (SO.players[0] ? SO.players[0].name : '?') + ' survit, la partie est terminée !'; $('#solo-qcard').hidden = true; $('#solo-choice').hidden = true; $('#solo-spinrow').style.display = 'none'; chips(); return; }
        nextTurn('💀 ' + p.name + ' est éliminé (2 non-réponses) !');
      } else nextTurn('⌛ ' + p.name + ' a passé (avertissement ' + p.misses + '/2)');
    }
  });
})();
</script>
<div id="tuto" hidden style="position:fixed;inset:0;z-index:9998;background:rgba(12,4,10,.93);display:flex;align-items:center;justify-content:center;padding:16px">
  <div style="max-width:400px;width:100%;background:var(--card);border:1px solid var(--line);border-radius:22px;padding:18px;text-align:center">
    <div id="tuto-scene" class="tuto-scene" style="min-height:230px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:9px"></div>
    <div id="tuto-dots" style="display:flex;gap:7px;justify-content:center;margin:14px 0 10px"></div>
    <div style="display:flex;gap:8px">
      <button id="tuto-skip" class="btn" style="flex:1">Passer</button>
      <button id="tuto-next" class="btn primary" style="flex:1">Suivant ▶</button>
    </div>
  </div>
</div>
<div style="position:fixed;bottom:4px;right:7px;font-size:10px;opacity:.45;z-index:99;font-family:sans-serif">🌶️ v31</div>
</body>
</html>`;

const app = express();
/* v26 : icônes de l application (base64) — générées depuis icon-full.png */
const ICON512 = 'data:image/png;base64,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';
const ICON192 = 'data:image/png;base64,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';

app.get('/', (req, res) => {
  res.set('Cache-Control', 'no-store, must-revalidate');
  res.send(HTML);
});

/* ── v26 · PWA : l app s installe sur l écran d accueil ── */
app.get('/icon-512.png', (_, res) => {
  const b = Buffer.from(ICON512.split(',')[1], 'base64');
  res.set('Content-Type', 'image/png'); res.set('Cache-Control', 'public, max-age=86400');
  res.send(b);
});
app.get('/icon-192.png', (_, res) => {
  const b = Buffer.from(ICON192.split(',')[1], 'base64');
  res.set('Content-Type', 'image/png'); res.set('Cache-Control', 'public, max-age=86400');
  res.send(b);
});
const BANK_SRC = "/* ═══ v31 · BANQUE 4000 QUESTIONS RÉELLES — 1000 par niveau (500 vérité + 500 action) ═══\n   Français simple et direct, écrites pour des soirées entre adultes consentants.\n   ⭐⭐⭐ TES QUESTIONS PERSO : ajoute-les dans les listes ci-dessous (une par ligne, entre \" avec une virgule). ⭐⭐⭐ */\nconst QUESTIONS = {\n  1: {\n    verite: [\n  \"Qui ici tu trouves le plus beau ou la plus belle ?\",\n  \"C'est quoi ton plus grand complexe physique ?\",\n  \"As-tu déjà envoyé un message chaud à la mauvaise personne ?\",\n  \"Donne l'initiale de la dernière personne que tu as embrassée.\",\n  \"As-tu déjà menti sur ton âge ? Pourquoi ?\",\n  \"As-tu déjà eu un crush sur un(e) prof ?\",\n  \"Raconte ton pire plan séduction qui a raté.\",\n  \"Combien de personnes as-tu embrassées cette année ?\",\n  \"As-tu déjà relu 15 fois un message avant de répondre à ton crush ?\",\n  \"C'est quoi le surnom le plus honteux qu'on t'ait donné ?\",\n  \"As-tu déjà dit je t'aime sans le penser ?\",\n  \"Raconte ton dernier rêve chaud en 3 phrases.\",\n  \"As-tu déjà embrassé quelqu'un du même sexe ?\",\n  \"As-tu déjà triché en couple ? Même un petit truc ?\",\n  \"C'est quoi ta plus grande honte en amour ?\",\n  \"As-tu déjà reçu un nude ? Qu'est-ce que tu en as fait ?\",\n  \"Pour quel(le) ex as-tu pleuré le plus ?\",\n  \"As-tu déjà flashé sur le/la copain/copine d'un(e) ami(e) ?\",\n  \"C'est quelle partie de ton corps que tu préfères ?\",\n  \"Combien de temps a duré ta plus longue relation ?\",\n  \"Tu as déjà fouillé le téléphone de ton/ta partenaire ?\",\n  \"Raconte ton pire rendez-vous galant, du début à la fin.\",\n  \"As-tu déjà bloqué un(e) ex par vengeance ?\",\n  \"Qui ici a la plus belle voix selon toi ?\",\n  \"As-tu déjà embrassé deux personnes le même jour ?\",\n  \"As-tu déjà flashé sur quelqu'un de beaucoup plus âgé(e) ?\",\n  \"Ton plus gros mensonge pour séduire quelqu'un ?\",\n  \"As-tu déjà pleuré après une rupture devant tout le monde ?\",\n  \"Quelle chanson te fait penser à ton/ta ex ?\",\n  \"Qui a été ton premier béguin ? Raconte.\",\n  \"As-tu déjà déclaré tes feelings par texto par peur ?\",\n  \"As-tu déjà testé une appli de rencontre ? Pire expérience ?\",\n  \"Tu préfères être single ou en couple ? Pourquoi ?\",\n  \"As-tu déjà embrassé quelqu'un juste par ennui ?\",\n  \"C'est quoi ta plus grande peur en amour ?\",\n  \"Raconte ta première honte amoureuse.\",\n  \"As-tu déjà écrit à ton ex pendant la nuit ? Le contenu ?\",\n  \"Quel est le message le plus gênant que tu aies envoyé ?\",\n  \"Ton plus grand regret en amour ?\",\n  \"As-tu déjà eu deux crushs en même temps ?\",\n  \"C'est le compliment qui te fait fondre tout de suite ?\",\n  \"Combien de selfies tu prends avant d'envoyer une photo ?\",\n  \"As-tu déjà sorti avec quelqu'un surtout pour les cadeaux ?\",\n  \"As-tu déjà utilisé un faux compte pour espionner quelqu'un ?\",\n  \"Ton pire surnom qu'un(e) partenaire t'a donné ?\",\n  \"Qui ici tu appelles en premier pour parler d'un crush ?\",\n  \"Ta plus grosse excuse bidon pour éviter un rencard ?\",\n  \"Ton premier bisou : âge et lieu. Détaille.\",\n  \"As-tu déjà bu juste pour oser parler à ton crush ?\",\n  \"Ton pire rejet par texto ? Raconte.\",\n  \"Combien de fois par jour tu regardes la story de ton crush ?\",\n  \"As-tu déjà dansé très collé(e) à un(e) inconnu(e) ?\",\n  \"Raconte ta plus grosse honte en soirée.\",\n  \"As-tu déjà caché un crush à tes meilleurs amis ?\",\n  \"Ton record de temps sans écrire à ton crush avant de craquer ?\",\n  \"As-tu déjà copié les gestes de séduction d'un film ? Lesquels ?\",\n  \"C'est quoi le plus long silence gênant que tu as eu pendant un rencard ?\",\n  \"As-tu déjà fantasmé sur un(e) collègue ou un(e) camarade ?\",\n  \"Tu as déjà surpris tes amis en train de parler de toi en bien ? En mal ?\",\n  \"Ton dernier mensonge pour impressionner quelqu'un ?\",\n  \"Qui, parmi tes amis, embrasse le mieux selon toi ? Justifie.\",\n  \"As-tu déjà reçu un compliment bizarre ? Lequel ?\",\n  \"Ta plus grande folie faite pour quelqu'un ?\",\n  \"C'est quoi ton plus grand défaut quand tu es amoureux(se) ?\",\n  \"As-tu déjà raté un bisou ? Raconte le crash.\",\n  \"Tu caches quoi dans ton téléphone que tu ne veux pas montrer ?\",\n  \"La dernière photo de ta galerie : décris-la sans la montrer.\",\n  \"Ton record de conversations en même temps avec plusieurs crushs ?\",\n  \"As-tu déjà écrit le mauvais prénom sur un message ? À qui ?\",\n  \"Quelle est ta plus grosse gêne quand tu es face à ton crush ?\",\n  \"As-tu déjà embrassé quelqu'un dans un taxi ? Raconte.\",\n  \"As-tu déjà envoyé un vocal gênant à ton crush ? Raconte.\",\n  \"As-tu déjà trébuché(e) en marchant devant ton crush ? Raconte.\",\n  \"As-tu déjà pleuré devant un film romantique ? Raconte.\",\n  \"As-tu déjà été pris(e) en train de regarder un film X ? Raconte.\",\n  \"As-tu déjà menti sur ton prénom pour tester quelqu'un ? Raconte.\",\n  \"As-tu déjà flashé(e) sur un(e) serveur(se) ? Raconte.\",\n  \"As-tu déjà embrassé(e) sous la pluie ? Raconte.\",\n  \"As-tu déjà envoyé un selfie chaud par erreur ? Raconte.\",\n  \"As-tu déjà dansé tout près d'un(e) inconnu(e) ? Raconte.\",\n  \"As-tu déjà eu un béguin pour un(e) ami(e) d'enfance ? Raconte.\",\n  \"As-tu déjà regardé les stories de ton ex ce matin ? Raconte.\",\n  \"As-tu déjà envoyé un cœur à un(e) inconnu(e) par erreur ? Raconte.\",\n  \"As-tu déjà eu un crush sur une star bien plus âgée ? Raconte.\",\n  \"As-tu déjà fait un rêve chaud sur quelqu'un de connu ? Raconte.\",\n  \"As-tu déjà hésité plus de 10 minutes avant d'envoyer un message ? Raconte.\",\n  \"As-tu déjà dit « je suis occupé(e) » alors que tu étais au lit ? Raconte.\",\n  \"As-tu déjà supprimé un message par peur du relire ? Raconte.\",\n  \"As-tu déjà gardé un objet d'un(e) ex ? Lequel ? ? Raconte.\",\n  \"As-tu déjà eu un coup de foudre juste pour une voix ? Raconte.\",\n  \"As-tu déjà écrit à ton crush une nuit d'insomnie ? Raconte.\",\n  \"As-tu déjà embrassé(e) quelqu'un qui sentait l'alcool ? Raconte.\",\n  \"As-tu déjà été accusé(e) d'être trop collé(e) ? Raconte.\",\n  \"As-tu déjà répondu à un message 3 jours après exprès ? Raconte.\",\n  \"As-tu déjà porté ta plus belle tenue juste pour être vu(e) ? Raconte.\",\n  \"As-tu déjà été jaloux(se) sans aucune raison ? Raconte.\",\n  \"As-tu déjà changé de coiffure pour attirer l'attention ? Raconte.\",\n  \"As-tu déjà envoyé 10 messages d'affilée sans réponse ? Raconte.\",\n  \"As-tu déjà mis une musique d'amour en pensant à quelqu'un ? Raconte.\",\n  \"As-tu déjà pleuré en écoutant une chanson d'amour ? Raconte.\",\n  \"As-tu déjà dansé seul(e) devant le miroir comme dans un clip ? Raconte.\",\n  \"As-tu déjà envoyé une photo de toi à la mauvaise discussion ? Raconte.\",\n  \"As-tu déjà ris tout seul en lisant un message chaud ? Raconte.\",\n  \"As-tu déjà imaginé ta vie avec un(e) inconnu(e) croisé(e) dans la rue ? Raconte.\",\n  \"As-tu déjà voulu embrasser un(e) ami(e) sans jamais oser ? Raconte.\",\n  \"As-tu déjà regretté de ne pas avoir osé un bisou ? Raconte.\",\n  \"As-tu déjà eu un béguin pour un(e) professeur(e) de sport ? Raconte.\",\n  \"As-tu déjà changé de look pour une personne ? Raconte.\",\n  \"As-tu déjà marqué le mauvais prénom dans un message ? Raconte.\",\n  \"As-tu déjà gardé une lettre d'amour jamais envoyée ? Raconte.\",\n  \"As-tu déjà été surpris(e) en train de draguer par tes parents ? Raconte.\",\n  \"As-tu déjà caché un message en pleine soirée ? Raconte.\",\n  \"As-tu déjà choisi ta tenue pendant 3 heures pour un rencard ? Raconte.\",\n  \"As-tu déjà mangé un chewing-gum juste avant un bisou ? Raconte.\",\n  \"As-tu déjà regardé le profil d'un(e) ex jusqu'à de vieilles photos ? Raconte.\",\n  \"As-tu déjà félicité un(e) ex pour un anniversaire juste pour relancer ? Raconte.\",\n  \"As-tu déjà inventé un(e) copain/copine pour repousser quelqu'un ? Raconte.\",\n  \"As-tu déjà eu le trac juste avant un premier bisou ? Raconte.\",\n  \"As-tu déjà compté les minutes avant un premier rendez-vous ? Raconte.\",\n  \"As-tu déjà craqué pour la voix d'un(e) animateur(trice) ? Raconte.\",\n  \"As-tu déjà envoyé « je t'appelle dans 5 minutes » sans jamais appeler ? Raconte.\",\n  \"As-tu déjà dit oui à un rencard par politesse et regretté ? Raconte.\",\n  \"As-tu déjà fantasmé sur le/la barman / la barmaid ? Raconte.\",\n  \"As-tu déjà pensé à ton premier amour aujourd'hui encore ? Raconte.\",\n  \"As-tu déjà envoyé un cœur au lieu de répondre ? Raconte.\",\n  \"As-tu déjà oublié le prénom de la personne en face pendant un rencard ? Raconte.\",\n  \"As-tu déjà suivi quelqu'un dans la rue juste pour son odeur ? Raconte.\",\n  \"As-tu déjà prêté ton sweat à un crush exprès ? Raconte.\",\n  \"As-tu déjà fait semblant de lire pour éviter quelqu'un ? Raconte.\",\n  \"As-tu déjà pris(e) une photo de ton crush sans qu'il/elle le sache ? Raconte.\",\n  \"As-tu déjà dit à un(e) ami(e) que son crush est nul(le) alors que tu y pensais ? Raconte.\",\n  \"Ton choix : baiser sous la pluie ou au bord de la mer ? Défends ta réponse.\",\n  \"Ton choix : premier bisou en public ou en privé ? Défends ta réponse.\",\n  \"Ton choix : être dominé(e) ou dominer ? Défends ta réponse.\",\n  \"Ton choix : texto chaud ou vocal chaud ? Défends ta réponse.\",\n  \"Ton choix : dîner aux chandelles ou nuit sur la plage ? Défends ta réponse.\",\n  \"Ton choix : un(e) partenaire bavard(e) ou mystérieux(se) ? Défends ta réponse.\",\n  \"Ton choix : lumière tamisée ou noir complet ? Défends ta réponse.\",\n  \"Ton choix : un slow collé-collé ou un dancehall enflammé ? Défends ta réponse.\",\n  \"Ton choix : un plan d'une nuit ou une belle histoire qui dure ? Défends ta réponse.\",\n  \"Ton choix : retrouver ton ex ou découvrir un(e) inconnu(e) ? Défends ta réponse.\",\n  \"Ton choix : un hôtel de luxe ou chez les parents ? Défends ta réponse.\",\n  \"Ton choix : entendre des mots doux ou des mots sales ? Défends ta réponse.\",\n  \"Ton choix : une soirée calme à deux ou une grosse soirée en groupe ? Défends ta réponse.\",\n  \"Ton choix : le petit matin ou la pleine nuit ? Défends ta réponse.\",\n  \"Ton choix : un bisou volé ou un bisou demandé ? Défends ta réponse.\",\n  \"Ton choix : un(e) inconnu(e) séduisant(e) ou un(e) ami(e) très proche ? Défends ta réponse.\",\n  \"Ton choix : rencontre sur appli ou dans la vraie vie ? Défends ta réponse.\",\n  \"Ton choix : un massage du dos ou un massage des pieds ? Défends ta réponse.\",\n  \"Ton choix : un rencard cuisine maison ou resto chic ? Défends ta réponse.\",\n  \"Ton choix : être surpris(e) par un bisou ou le préparer ? Défends ta réponse.\",\n  \"Ton choix : les yeux fermés ou les yeux dans les yeux ? Défends ta réponse.\",\n  \"Ton choix : un massage long ou mille petits bisous ? Défends ta réponse.\",\n  \"Ton choix : les textos le matin ou les appels la nuit ? Défends ta réponse.\",\n  \"Ton choix : être courtisé(e) longtemps ou tout direct ? Défends ta réponse.\",\n  \"Ton choix : une aventure en vacances ou dans ta ville ? Défends ta réponse.\",\n  \"Ton choix : qu'on te chuchote à l'oreille ou qu'on t'écrive une lettre ? Défends ta réponse.\",\n  \"Ton choix : commencer par un bisou sur la main ou sur la joue ? Défends ta réponse.\",\n  \"Ton choix : un(e) partenaire tatoué(e) ou sans tatouage ? Défends ta réponse.\",\n  \"Ton choix : la plage la nuit ou la montagne sous la neige ? Défends ta réponse.\",\n  \"Ton choix : une relation secrète ou officielle tout de suite ? Défends ta réponse.\",\n  \"Ton choix : les bougies ou la lumière des lampes ? Défends ta réponse.\",\n  \"Ton choix : un vocal de 30 secondes ou 10 textos ? Défends ta réponse.\",\n  \"Ton choix : un rencard improvisé ou préparé 3 jours ? Défends ta réponse.\",\n  \"Ton choix : être désiré(e) pour ton corps ou ton esprit ? Défends ta réponse.\",\n  \"Ton choix : l'odeur du parfum ou l'odeur de la peau propre ? Défends ta réponse.\",\n  \"Ton choix : un seul grand amour ou plusieurs belles histoires ? Défends ta réponse.\",\n  \"Ton choix : embrasser avec la langue ou sans la langue ? Défends ta réponse.\",\n  \"Ton choix : le feu de la passion ou la chaleur du calme ? Défends ta réponse.\",\n  \"Ton choix : les sous-vêtements rouges ou noirs ? Défends ta réponse.\",\n  \"Ton choix : une première fois vite ou attendre longtemps ? Défends ta réponse.\",\n  \"Ton choix : un(e) partenaire qui chante ou qui cuisine ? Défends ta réponse.\",\n  \"Ton choix : être couvert(e) de bisous ou de câlins ? Défends ta réponse.\",\n  \"Ton choix : baiser à la bougie ou sous les étoiles ? Défends ta réponse.\",\n  \"Ton choix : un(a) ex qui revient ou une nouvelle personne qui débarque ? Défends ta réponse.\",\n  \"Ton choix : qu'on t'écrive un poème ou qu'on te cuisine un plat ? Défends ta réponse.\",\n  \"Ton choix : la salle de sport ou la plage pour draguer ? Défends ta réponse.\",\n  \"Ton choix : un slow sous la lune ou un déjeuner au lit ? Défends ta réponse.\",\n  \"Ton choix : être embrassé(e) dans le cou ou sur la main ? Défends ta réponse.\",\n  \"Ton choix : un câlin long ou mille câlins courts ? Défends ta réponse.\",\n  \"Ton choix : un(a) partenaire sportif(ve) ou cérébral(e) ? Défends ta réponse.\",\n  \"Parmi les joueurs ici : qui est le plus fait pour faire le premier pas ?\",\n  \"Parmi les joueurs ici : qui est le plus fait pour embrasser devant tout le monde ?\",\n  \"Parmi les joueurs ici : qui est le plus fait pour coucher au premier rendez-vous ?\",\n  \"Parmi les joueurs ici : qui est le plus fait pour envoyer un nude par erreur ?\",\n  \"Parmi les joueurs ici : qui est le plus fait pour avoir le plus d'ex ?\",\n  \"Parmi les joueurs ici : qui est le plus fait pour être le plus jaloux(se) ?\",\n  \"Parmi les joueurs ici : qui est le plus fait pour revenir avec son ex ?\",\n  \"Parmi les joueurs ici : qui est le plus fait pour faire un strip-tease un jour ?\",\n  \"Parmi les joueurs ici : qui est le plus fait pour se marier le premier ou la première ?\",\n  \"Parmi les joueurs ici : qui est le plus fait pour craquer pour quelqu'un de plus âgé(e) ?\",\n  \"Parmi les joueurs ici : qui est le plus fait pour faire une déclaration publique ?\",\n  \"Parmi les joueurs ici : qui est le plus fait pour chanter un slow torride ?\",\n  \"Parmi les joueurs ici : qui est le plus fait pour coucher avec une star ?\",\n  \"Parmi les joueurs ici : qui est le plus fait pour avoir le plus de culot ?\",\n  \"Parmi les joueurs ici : qui est le plus fait pour draguer au téléphone toute la nuit ?\",\n  \"Parmi les joueurs ici : qui est le plus fait pour être gêné(e) après un bisou ?\",\n  \"Parmi les joueurs ici : qui est le plus fait pour oublier un anniversaire ?\",\n  \"Parmi les joueurs ici : qui est le plus fait pour pleurer après un film d'amour ?\",\n  \"Parmi les joueurs ici : qui est le plus fait pour surprendre tout le monde avec un plan fou ?\",\n  \"Parmi les joueurs ici : qui est le plus fait pour être le plus romantique ?\",\n  \"Parmi les joueurs ici : qui est le plus fait pour coucher dans un lieu interdit ?\",\n  \"Parmi les joueurs ici : qui est le plus fait pour faire le plus de scandale ?\",\n  \"Parmi les joueurs ici : qui est le plus fait pour garder le plus de secrets ?\",\n  \"Parmi les joueurs ici : qui est le plus fait pour être le plus taquin(e) ?\",\n  \"Parmi les joueurs ici : qui est le plus fait pour embrasser le mieux ?\",\n  \"Parmi les joueurs ici : qui est le plus fait pour être le plus possessif(ve) ?\",\n  \"Parmi les joueurs ici : qui est le plus fait pour craquer pour un(e) inconnu(e) en 2 minutes ?\",\n  \"Parmi les joueurs ici : qui est le plus fait pour écrire le sexto le plus fou ?\",\n  \"Parmi les joueurs ici : qui est le plus fait pour garder le plus de photos de son ex ?\",\n  \"Parmi les joueurs ici : qui est le plus fait pour oser tout dire ce soir ?\",\n  \"Parmi les joueurs ici : qui est le plus fait pour coucher pour un million ?\",\n  \"Parmi les joueurs ici : qui est le plus fait pour avoir le corps le plus parfait ?\",\n  \"Parmi les joueurs ici : qui est le plus fait pour être le plus doué(e) en bisous ?\",\n  \"Parmi les joueurs ici : qui est le plus fait pour transformer un plan d'un soir en histoire d'amour ?\",\n  \"Parmi les joueurs ici : qui est le plus fait pour avoir le rire le plus séduisant ?\",\n  \"Parmi les joueurs ici : qui est le plus fait pour garder le plus de mystère ?\",\n  \"Parmi les joueurs ici : qui est le plus fait pour faire tourner les têtes le plus facilement ?\",\n  \"Parmi les joueurs ici : qui est le plus fait pour oublier un rendez-vous galant ?\",\n  \"Parmi les joueurs ici : qui est le plus fait pour dire je t'aime le premier ou la première ?\",\n  \"Parmi les joueurs ici : qui est le plus fait pour avoir le plus de prétendants ?\",\n  \"Si tu devais embrasser quelqu'un d'ici maintenant, tu fais quoi ?\",\n  \"Si tu devais recevoir un nude de ton crush, tu fais quoi ?\",\n  \"Si tu devais te retrouver seul(e) ce soir avec le joueur de ton choix, tu fais quoi ?\",\n  \"Si tu devais voir ton ex avec ton/ta meilleur(e) ami(e), tu fais quoi ?\",\n  \"Si tu devais apprendre que ton crush t'aime en secret, tu fais quoi ?\",\n  \"Si tu devais envoyer un message chaud à un contact au hasard, tu fais quoi ?\",\n  \"Si tu devais te réveiller marié(e) avec un(e) joueur d'ici, tu fais quoi ?\",\n  \"Si tu devais avoir un rencard avec ta star préférée, tu fais quoi ?\",\n  \"Si tu devais être pris(e) en train d'écrire un sexto, tu fais quoi ?\",\n  \"Si tu devais entendre ta mère lire ton dernier message chaud, tu fais quoi ?\",\n  \"Si tu devais vivre une semaine sans téléphone ni crush, tu fais quoi ?\",\n  \"Si tu devais recevoir un cadeau de ton ex, tu fais quoi ?\",\n  \"Si tu devais voir ton crush embrasser quelqu'un d'autre devant toi, tu fais quoi ?\",\n  \"Si tu devais choisir entre l'amour et l'argent, tu fais quoi ?\",\n  \"Si tu devais être enfermé(e) une nuit avec un(e) joueur d'ici, tu fais quoi ?\",\n  \"Si tu devais apprendre que quelqu'un d'ici rêve de toi, tu fais quoi ?\",\n  \"Si tu devais danser un slow avec la personne en face de toi, tu fais quoi ?\",\n  \"Si tu devais envoyer ta plus belle photo au joueur de ton choix, tu fais quoi ?\",\n  \"Si tu devais écrire une déclaration d'amour ici, maintenant, tu fais quoi ?\",\n  \"Si tu devais prendre le pseudo de ton crush pendant 24 h, tu fais quoi ?\",\n  \"Si tu devais dire que la vérité pendant un mois, tu fais quoi ?\",\n  \"Si tu devais supprimer le numéro de ton ex pour toujours, tu fais quoi ?\",\n  \"Si tu devais recevoir un vocal chaud d'un(e) inconnu(e), tu fais quoi ?\",\n  \"Si tu devais passer une journée entière collé(e) à ton crush, tu fais quoi ?\",\n  \"Si tu devais échanger de téléphone avec ton/ta partenaire, tu fais quoi ?\",\n  \"Si tu devais danser un slow sous la pluie, tu fais quoi ?\",\n  \"Si tu devais répéter « je t'aime » en face d'un(e) joueur, tu fais quoi ?\",\n  \"Si tu devais être sur une île déserte avec un(e) joueur d'ici, tu fais quoi ?\",\n  \"Si tu devais décrire ton idéal en détail devant tous, tu fais quoi ?\",\n  \"Si tu devais répéter à voix haute ton dernier message envoyé, tu fais quoi ?\",\n  \"Si tu devais faire tout de suite ton plus beau selfie, tu fais quoi ?\",\n  \"Si tu devais garder les yeux fermés 2 minutes pendant qu'on te regarde, tu fais quoi ?\",\n  \"Si tu devais écouter un vocal de ton ex devant tout le monde, tu fais quoi ?\",\n  \"Si tu devais embrasser (virtuellement) le joueur à ta droite, tu fais quoi ?\",\n  \"Si tu devais dire le prénom de la dernière personne embrassée, tu fais quoi ?\",\n  \"Si tu devais imiter la voix de séduction d'un(e) joueur, tu fais quoi ?\",\n  \"Si tu devais montrer ta dernière photo prise, tu fais quoi ?\",\n  \"Si tu devais écrire un compliment à chaque joueur ici, tu fais quoi ?\",\n  \"Si tu devais recevoir un bisou surprise de quelqu'un d'ici, tu fais quoi ?\",\n  \"Si tu devais te déclarer en public à ton crush, tu fais quoi ?\",\n  \"C'est quoi ton avis sur les baisers dans le cou ? Sois honnête.\",\n  \"C'est quoi ton avis sur les massages sensuels ? Sois honnête.\",\n  \"C'est quoi ton avis sur les sextos du matin ? Sois honnête.\",\n  \"C'est quoi ton avis sur les rencards surprises ? Sois honnête.\",\n  \"C'est quoi ton avis sur les déclarations publiques ? Sois honnête.\",\n  \"C'est quoi ton avis sur les vocaux chauds ? Sois honnête.\",\n  \"C'est quoi ton avis sur les slows très collés ? Sois honnête.\",\n  \"C'est quoi ton avis sur les bisous volés ? Sois honnête.\",\n  \"C'est quoi ton avis sur les câlins qui durent des heures ? Sois honnête.\",\n  \"C'est quoi ton avis sur les massages des pieds ? Sois honnête.\",\n  \"C'est quoi ton avis sur les douches à deux ? Sois honnête.\",\n  \"C'est quoi ton avis sur les plans en pleine nuit ? Sois honnête.\",\n  \"C'est quoi ton avis sur les appels vidéo le soir ? Sois honnête.\",\n  \"C'est quoi ton avis sur les lettres d'amour ? Sois honnête.\",\n  \"C'est quoi ton avis sur les bougies dans la chambre ? Sois honnête.\",\n  \"C'est quoi ton avis sur les sous-vêtements rouges ? Sois honnête.\",\n  \"C'est quoi ton avis sur les talons hauts ? Sois honnête.\",\n  \"C'est quoi ton avis sur les sweats empruntés à ton/ta partenaire ? Sois honnête.\",\n  \"C'est quoi ton avis sur les longues séparations ? Sois honnête.\",\n  \"C'est quoi ton avis sur les retrouvailles à l'aéroport ? Sois honnête.\",\n  \"C'est quoi ton avis sur les jalousies au téléphone ? Sois honnête.\",\n  \"C'est quoi ton avis sur les ex qui reviennent ? Sois honnête.\",\n  \"C'est quoi ton avis sur les amitiés qui deviennent amour ? Sois honnête.\",\n  \"C'est quoi ton avis sur les rendez-vous sur Internet ? Sois honnête.\",\n  \"C'est quoi ton avis sur les fiançailles surprises ? Sois honnête.\",\n  \"C'est quoi ton avis sur les bisous devant les parents ? Sois honnête.\",\n  \"C'est quoi ton avis sur les mains dans les poches des autres ? Sois honnête.\",\n  \"C'est quoi ton avis sur les miroirs dans la chambre ? Sois honnête.\",\n  \"C'est quoi ton avis sur les piques-niques en amoureux ? Sois honnête.\",\n  \"C'est quoi ton avis sur les photos de couple sur les réseaux ? Sois honnête.\",\n  \"C'est quoi ton avis sur les surnoms mignons en public ? Sois honnête.\",\n  \"C'est quoi ton avis sur les longues conversations jusqu'à l'aube ? Sois honnête.\",\n  \"C'est quoi ton avis sur les blagues privées de couple ? Sois honnête.\",\n  \"C'est quoi ton avis sur les câlins pendant le film ? Sois honnête.\",\n  \"C'est quoi ton avis sur les baisers qui s'arrêtent trop tôt ? Sois honnête.\",\n  \"C'est quoi ton avis sur les promesses du soir ? Sois honnête.\",\n  \"C'est quoi ton avis sur les messages le lendemain du rencard ? Sois honnête.\",\n  \"C'est quoi ton avis sur les fleurs offertes sans raison ? Sois honnête.\",\n  \"C'est quoi ton avis sur les chansons dédiées ? Sois honnête.\",\n  \"C'est quoi ton avis sur les câlins endormis ? Sois honnête.\",\n  \"C'est quoi ton avis sur les bisous sur le front ? Sois honnête.\",\n  \"C'est quoi ton avis sur les regards qui durent trop ? Sois honnête.\",\n  \"C'est quoi ton avis sur les massages du cuir chevelu ? Sois honnête.\",\n  \"C'est quoi ton avis sur les dîners préparés par l'autre ? Sois honnête.\",\n  \"C'est quoi ton avis sur les surprises au travail ? Sois honnête.\",\n  \"C'est quoi ton avis sur les baisers sous la pluie ? Sois honnête.\",\n  \"C'est quoi ton avis sur les déjeuners au lit ? Sois honnête.\",\n  \"C'est quoi ton avis sur les calins sur le canapé ? Sois honnête.\",\n  \"C'est quoi ton avis sur les promenades main dans la main ? Sois honnête.\",\n  \"C'est quoi ton avis sur les voix chuchotées au téléphone ? Sois honnête.\",\n  \"C'est quoi ton avis sur les vocaux mignons ? Sois honnête.\",\n  \"As-tu déjà testé les ex qui reviennent ? Raconte.\",\n  \"les mains qui tremblent : oui, non, ou tu rêves ?\",\n  \"Qu'est-ce qui change avec les rêves d'amour selon la personne ?\",\n  \"Ton record avec les flirts au téléphone ? Le groupe demande le chiffre.\",\n  \"les bisous volés : oui, non, ou tu rêves ?\",\n  \"Ton pire souvenir avec les messages du matin ? Raconte.\",\n  \"As-tu déjà testé les jalousies légères ? Raconte.\",\n  \"Ton record avec les promesses douces ? Le groupe demande le chiffre.\",\n  \"Tu recommencerais avec les fins de soirée à deux ? Pourquoi ?\",\n  \"As-tu déjà testé les dimanches au lit ? Raconte.\",\n  \"Tu recommencerais avec les déjeuners au lit ? Pourquoi ?\",\n  \"Tu recommencerais avec les douches à deux ? Pourquoi ?\",\n  \"Tu recommencerais avec les jalousies légères ? Pourquoi ?\",\n  \"Tu recommencerais avec les baisers dans le cou ? Pourquoi ?\",\n  \"As-tu déjà testé les dîners aux chandelles ? Raconte.\",\n  \"les regards qui parlent : oui, non, ou tu rêves ?\",\n  \"As-tu déjà testé les mains qui se cherchent ? Raconte.\",\n  \"Tu recommencerais avec les cabines d'essayage ? Pourquoi ?\",\n  \"C'est quoi ton meilleur souvenir avec les rêves d'amour ?\",\n  \"As-tu déjà testé les photos de couple ? Raconte.\",\n  \"Qu'est-ce qui change avec les câlins endormis selon la personne ?\",\n  \"Ton record avec les piques-niques en amoureux ? Le groupe demande le chiffre.\",\n  \"Qu'est-ce qui change avec les baisers sur le front selon la personne ?\",\n  \"Qu'est-ce qui change avec les déclarations publiques selon la personne ?\",\n  \"C'est quoi ton avis sur les promesses douces ? Sois honnête.\",\n  \"C'est quoi ton meilleur souvenir avec les regards qui parlent ?\",\n  \"Tu recommencerais avec les bougies ? Pourquoi ?\",\n  \"Ton pire souvenir avec les dîners aux chandelles ? Raconte.\",\n  \"C'est quoi ton meilleur souvenir avec les taxis du retour ?\",\n  \"As-tu déjà testé les mains qui tremblent ? Raconte.\",\n  \"Ton record avec les jalousies légères ? Le groupe demande le chiffre.\",\n  \"Ton record avec les sourires cachés ? Le groupe demande le chiffre.\",\n  \"Tu recommencerais avec les sourires cachés ? Pourquoi ?\",\n  \"C'est quoi ton avis sur les confidences nocturnes ? Sois honnête.\",\n  \"C'est quoi ton avis sur les amitiés qui basculent ? Sois honnête.\",\n  \"les surprises en soirée : oui, non, ou tu rêves ?\",\n  \"Qu'est-ce qui change avec les douches à deux selon la personne ?\",\n  \"les sweats empruntés : oui, non, ou tu rêves ?\",\n  \"Qu'est-ce qui change avec les notes vocales selon la personne ?\",\n  \"les flirts au téléphone : oui, non, ou tu rêves ?\",\n  \"C'est quoi ton avis sur les taxis du retour ? Sois honnête.\",\n  \"C'est quoi ton meilleur souvenir avec les retrouvailles ?\",\n  \"Qu'est-ce qui change avec les frissons discrets selon la personne ?\",\n  \"Ton pire souvenir avec les dimanches au lit ? Raconte.\",\n  \"C'est quoi ton avis sur les cabines d'essayage ? Sois honnête.\",\n  \"Qu'est-ce qui change avec les regards qui parlent selon la personne ?\",\n  \"Ton record avec les rêves d'amour ? Le groupe demande le chiffre.\",\n  \"Ton pire souvenir avec les taxis du retour ? Raconte.\",\n  \"Qu'est-ce qui change avec les surnoms d'amour selon la personne ?\",\n  \"C'est quoi ton meilleur souvenir avec les baisers sous la pluie ?\",\n  \"As-tu déjà testé les fins de soirée à deux ? Raconte.\",\n  \"les frissons discrets : oui, non, ou tu rêves ?\",\n  \"Qu'est-ce qui change avec les playlists d'amour selon la personne ?\",\n  \"Tu recommencerais avec les notes vocales ? Pourquoi ?\",\n  \"les déjeuners au lit : oui, non, ou tu rêves ?\",\n  \"Ton pire souvenir avec les frissons discrets ? Raconte.\",\n  \"Ton pire souvenir avec les vocaux mignons ? Raconte.\",\n  \"C'est quoi ton avis sur les surnoms d'amour ? Sois honnête.\",\n  \"Qu'est-ce qui change avec les retrouvailles selon la personne ?\",\n  \"Ton record avec les surprises en soirée ? Le groupe demande le chiffre.\",\n  \"Ton record avec les sweats empruntés ? Le groupe demande le chiffre.\",\n  \"As-tu déjà testé les regards qui parlent ? Raconte.\",\n  \"les baisers dans le cou : oui, non, ou tu rêves ?\",\n  \"Ton record avec les odeurs de parfum ? Le groupe demande le chiffre.\",\n  \"Ton pire souvenir avec les fins de soirée à deux ? Raconte.\",\n  \"As-tu déjà testé les baisers sur le front ? Raconte.\",\n  \"C'est quoi ton avis sur les regards qui parlent ? Sois honnête.\",\n  \"les fous rires à 2 h du matin : oui, non, ou tu rêves ?\",\n  \"Ton pire souvenir avec les rêves d'amour ? Raconte.\",\n  \"As-tu déjà testé les cabines d'essayage ? Raconte.\",\n  \"Qu'est-ce qui change avec les câlins sur le canapé selon la personne ?\",\n  \"As-tu déjà testé les fous rires à 2 h du matin ? Raconte.\",\n  \"C'est quoi ton meilleur souvenir avec les sourires cachés ?\",\n  \"As-tu déjà testé les longues séparations ? Raconte.\",\n  \"C'est quoi ton meilleur souvenir avec les mains qui tremblent ?\",\n  \"C'est quoi ton meilleur souvenir avec les dîners aux chandelles ?\",\n  \"Ton pire souvenir avec les promesses douces ? Raconte.\",\n  \"Qu'est-ce qui change avec les flirts au téléphone selon la personne ?\",\n  \"les câlins endormis : oui, non, ou tu rêves ?\",\n  \"Ton record avec les rencards surprises ? Le groupe demande le chiffre.\",\n  \"Tu recommencerais avec les dimanches au lit ? Pourquoi ?\",\n  \"Tu recommencerais avec les promesses douces ? Pourquoi ?\",\n  \"Ton pire souvenir avec les lettres jamais envoyées ? Raconte.\",\n  \"As-tu déjà testé les voyages à deux ? Raconte.\",\n  \"As-tu déjà testé les retrouvailles ? Raconte.\",\n  \"Qu'est-ce qui change avec les chansons dédiées selon la personne ?\",\n  \"les rencards surprises : oui, non, ou tu rêves ?\",\n  \"Qu'est-ce qui change avec les promenades main dans la main selon la personne ?\",\n  \"Ton record avec les massages des épaules ? Le groupe demande le chiffre.\",\n  \"Qu'est-ce qui change avec les jalousies légères selon la personne ?\",\n  \"Tu recommencerais avec les retrouvailles ? Pourquoi ?\",\n  \"C'est quoi ton meilleur souvenir avec les notes vocales ?\",\n  \"As-tu déjà testé les slows collés ? Raconte.\",\n  \"Tu recommencerais avec les piques-niques en amoureux ? Pourquoi ?\",\n  \"C'est quoi ton avis sur les premiers je t'aime ? Sois honnête.\",\n  \"C'est quoi ton meilleur souvenir avec les bisous volés ?\",\n  \"Ton record avec les premiers je t'aime ? Le groupe demande le chiffre.\",\n  \"As-tu déjà testé les notes vocales ? Raconte.\",\n  \"As-tu déjà testé les confidences nocturnes ? Raconte.\",\n  \"As-tu déjà testé les surnoms d'amour ? Raconte.\",\n  \"les câlins sur le canapé : oui, non, ou tu rêves ?\",\n  \"Tu recommencerais avec les chansons dédiées ? Pourquoi ?\",\n  \"les taxis du retour : oui, non, ou tu rêves ?\",\n  \"C'est quoi ton avis sur les photos de couple ? Sois honnête.\",\n  \"Qu'est-ce qui change avec les piques-niques en amoureux selon la personne ?\",\n  \"Qu'est-ce qui change avec les sourires cachés selon la personne ?\",\n  \"Tu recommencerais avec les photos de couple ? Pourquoi ?\",\n  \"C'est quoi ton meilleur souvenir avec les messages du matin ?\",\n  \"Tu recommencerais avec les longues séparations ? Pourquoi ?\",\n  \"Ton record avec les douches à deux ? Le groupe demande le chiffre.\",\n  \"C'est quoi ton meilleur souvenir avec les vocaux mignons ?\",\n  \"C'est quoi ton avis sur les voyages à deux ? Sois honnête.\",\n  \"C'est quoi ton meilleur souvenir avec les longues séparations ?\",\n  \"Qu'est-ce qui change avec les fins de soirée à deux selon la personne ?\",\n  \"Tu recommencerais avec les messages du matin ? Pourquoi ?\",\n  \"Ton pire souvenir avec les amitiés qui basculent ? Raconte.\",\n  \"Ton record avec les baisers sur le front ? Le groupe demande le chiffre.\",\n  \"Ton record avec les mains dans les cheveux ? Le groupe demande le chiffre.\",\n  \"les chansons dédiées : oui, non, ou tu rêves ?\",\n  \"Ton record avec les dîners aux chandelles ? Le groupe demande le chiffre.\",\n  \"Ton pire souvenir avec les bougies ? Raconte.\",\n  \"Ton pire souvenir avec les longues séparations ? Raconte.\",\n  \"les confidences nocturnes : oui, non, ou tu rêves ?\",\n  \"les dimanches au lit : oui, non, ou tu rêves ?\",\n  \"Ton pire souvenir avec les notes vocales ? Raconte.\",\n  \"Qu'est-ce qui change avec les photos de couple selon la personne ?\",\n  \"C'est quoi ton avis sur les flirts au téléphone ? Sois honnête.\",\n  \"Qu'est-ce qui change avec les messages du matin selon la personne ?\",\n  \"Qu'est-ce qui change avec les cabines d'essayage selon la personne ?\",\n  \"C'est quoi ton avis sur les retrouvailles ? Sois honnête.\",\n  \"les déclarations publiques : oui, non, ou tu rêves ?\",\n  \"Ton pire souvenir avec les slows collés ? Raconte.\",\n  \"Ton record avec les déclarations publiques ? Le groupe demande le chiffre.\",\n  \"C'est quoi ton meilleur souvenir avec les baisers sur le front ?\",\n  \"Qu'est-ce qui change avec les mains qui tremblent selon la personne ?\",\n  \"les cabines d'essayage : oui, non, ou tu rêves ?\",\n  \"C'est quoi ton meilleur souvenir avec les chansons dédiées ?\",\n  \"C'est quoi ton meilleur souvenir avec les rencards surprises ?\",\n  \"Qu'est-ce qui change avec les mains qui se cherchent selon la personne ?\",\n  \"les slows collés : oui, non, ou tu rêves ?\",\n  \"les promenades main dans la main : oui, non, ou tu rêves ?\",\n  \"Tu recommencerais avec les mains qui tremblent ? Pourquoi ?\",\n  \"As-tu déjà testé les rencards surprises ? Raconte.\",\n  \"C'est quoi ton avis sur les mains qui tremblent ? Sois honnête.\",\n  \"Ton pire souvenir avec les sweats empruntés ? Raconte.\",\n  \"C'est quoi ton meilleur souvenir avec les mains dans les cheveux ?\",\n  \"les rêves d'amour : oui, non, ou tu rêves ?\",\n  \"Ton pire souvenir avec les voyages à deux ? Raconte.\",\n  \"Ton record avec les cabines d'essayage ? Le groupe demande le chiffre.\",\n  \"Ton pire souvenir avec les câlins sur le canapé ? Raconte.\",\n  \"C'est quoi ton avis sur les câlins sur le canapé ? Sois honnête.\",\n  \"As-tu déjà testé les surprises en soirée ? Raconte.\",\n  \"C'est quoi ton meilleur souvenir avec les promenades main dans la main ?\",\n  \"les promesses douces : oui, non, ou tu rêves ?\",\n  \"C'est quoi ton meilleur souvenir avec les fins de soirée à deux ?\",\n  \"Qu'est-ce qui change avec les amitiés qui basculent selon la personne ?\",\n  \"les piques-niques en amoureux : oui, non, ou tu rêves ?\",\n  \"C'est quoi ton meilleur souvenir avec les premiers je t'aime ?\",\n  \"As-tu déjà testé les baisers dans le cou ? Raconte.\",\n  \"C'est quoi ton meilleur souvenir avec les déjeuners au lit ?\",\n  \"C'est quoi ton meilleur souvenir avec les slows collés ?\",\n  \"Qu'est-ce qui change avec les taxis du retour selon la personne ?\",\n  \"C'est quoi ton avis sur les baisers sur le front ? Sois honnête.\",\n  \"Ton pire souvenir avec les chansons dédiées ? Raconte.\",\n  \"les messages du matin : oui, non, ou tu rêves ?\",\n  \"Tu recommencerais avec les mains qui se cherchent ? Pourquoi ?\",\n  \"Ton record avec les vocaux mignons ? Le groupe demande le chiffre.\",\n  \"Qu'est-ce qui change avec les premiers je t'aime selon la personne ?\",\n  \"C'est quoi ton meilleur souvenir avec les douches à deux ?\",\n  \"Ton record avec les câlins endormis ? Le groupe demande le chiffre.\",\n  \"Tu recommencerais avec les rencards surprises ? Pourquoi ?\",\n  \"les voyages à deux : oui, non, ou tu rêves ?\",\n  \"Ton record avec les notes vocales ? Le groupe demande le chiffre.\",\n  \"C'est quoi ton avis sur les dîners aux chandelles ? Sois honnête.\",\n  \"Ton pire souvenir avec les flirts au téléphone ? Raconte.\",\n  \"Qu'est-ce qui change avec les câlins longs selon la personne ?\",\n  \"les bougies : oui, non, ou tu rêves ?\",\n  \"Ton pire souvenir avec les baisers sur le front ? Raconte.\",\n  \"Ton record avec les mains qui tremblent ? Le groupe demande le chiffre.\",\n  \"Tu recommencerais avec les voyages à deux ? Pourquoi ?\",\n  \"Ton record avec les déjeuners au lit ? Le groupe demande le chiffre.\",\n  \"C'est quoi ton meilleur souvenir avec les massages des épaules ?\",\n  \"As-tu déjà testé les baisers sous la pluie ? Raconte.\",\n  \"Tu recommencerais avec les dîners aux chandelles ? Pourquoi ?\",\n  \"Ton record avec les câlins longs ? Le groupe demande le chiffre.\",\n  \"Ton record avec les voyages à deux ? Le groupe demande le chiffre.\",\n  \"Qu'est-ce qui change avec les massages des épaules selon la personne ?\",\n  \"C'est quoi ton avis sur les câlins longs ? Sois honnête.\"\n],\n    action: [\n  \"Fais le compliment le plus chaud possible à la personne à ta gauche.\",\n  \"Envoie 🔥 au 5e contact de ta liste de discussions.\",\n  \"Danse 30 secondes sur ton titre préféré.\",\n  \"Imite ton meilleur move de séduction.\",\n  \"Regarde fixement la caméra 20 secondes sans rire.\",\n  \"Chante le refrain d'une chanson d'amour avec beaucoup d'émotion.\",\n  \"Fais une déclaration dramatique à un objet de ta pièce.\",\n  \"Montre la 6e photo de ta galerie. Pas de triche.\",\n  \"Rejoue une scène de film romantique en jouant les deux rôles.\",\n  \"Garde ton plus beau sourire de mannequin 15 secondes.\",\n  \"Laisse le groupe choisir ta nouvelle photo de profil pour 24 h.\",\n  \"Parle en voix sensuelle pendant 20 secondes.\",\n  \"Masser les épaules du joueur à ta droite pendant 30 secondes.\",\n  \"Embrasse ton propre bras très lentement en regardant la cam.\",\n  \"Fais 10 squats face à la caméra.\",\n  \"Décris ta tenue de ce soir comme un défilé de mode.\",\n  \"Imite la façon dont tu réponds à un message de ton crush.\",\n  \"Fais 15 secondes de regard de séduction à la caméra.\",\n  \"Chante « joyeux anniversaire » à un(e) joueur comme si c'était une déclaration.\",\n  \"Décris ta plus belle sortie de douche sans jamais montrer ton corps.\",\n  \"Imite un rire ultra séduisant. Le groupe note sur 10.\",\n  \"Fais un bisou volant très lent à la caméra.\",\n  \"Décris le joueur de ton choix avec seulement 3 mots chauds.\",\n  \"Envoie un emoji qui résume ton état d'esprit ce soir et explique.\",\n  \"Montre comment tu retires ton pull de manière sexy (sans rien enlever).\",\n  \"Fais 20 secondes de marche de mannequin dans ta pièce.\",\n  \"Imite ta réaction quand ton crush écrit « tu es où ? ».\",\n  \"Raconte ta meilleure histoire de drague en 30 secondes.\",\n  \"Fais semblant d'appeler ton crush et dis-lui 3 phrases douces.\",\n  \"Montre ta plus belle pose de photo de profil. 3 poses différentes.\",\n  \"Imite le rire gêné après un premier bisou raté.\",\n  \"Décris ta soirée idéale à deux en 20 secondes.\",\n  \"Chante une berceuse comme si tu endormais ton amour.\",\n  \"Fais un compliment sur la voix du joueur à ta gauche.\",\n  \"Montre comment tu danses quand ta chanson arrive en club.\",\n  \"Envoie « je pense à toi » à ton crush... si tu oses. Sinon, imite-le.\",\n  \"Décris ton odeur de parfum préférée comme dans une pub.\",\n  \"Fais 10 secondes de clignement d'œil très lent, regard caméra.\",\n  \"Rejoue ta première rencontre idéale avec le joueur de ton choix.\",\n  \"Imite quelqu'un qui lit un message chaud dans le bus.\",\n  \"Montre comment tu prépares le petit-déjeuner en pyjama sexy.\",\n  \"Fais une pub de 20 secondes pour vendre ton sourire.\",\n  \"Dis 3 mots doux différents à 3 joueurs différents.\",\n  \"Imite la façon dont tu te regardes dans le miroir avant de sortir.\",\n  \"Danse 15 secondes sans musique, juste avec le regard du groupe.\",\n  \"Montre ta meilleure imitation de bisou sur la joue.\",\n  \"Décris le joueur en face comme un tableau célèbre.\",\n  \"Envoie un message positif au joueur le plus silencieux du salon.\",\n  \"Fais une imitation de voix d'enfant qui demande un bisou.\",\n  \"Raconte ton plus beau rêve en chantant.\",\n  \"Montre 10 secondes de regard innocent puis de regard coquin. Transition nette.\",\n  \"Imite ta démarche quand tu passes devant ton crush.\",\n  \"Fais semblant de dormir et de parler dans ton sommeil de ton crush.\",\n  \"Chante le nom du joueur de ton choix 3 fois de manière romantique.\",\n  \"Montre ta plus belle expression quand tu reçois un compliment.\",\n  \"Décris la tenue que tu mettrais pour un premier rendez-vous.\",\n  \"Fais une imitations de présentateur qui annonce « le couple de la soirée ».\",\n  \"Montre comment tu salues quelqu'un que tu trouves très beau/belle.\",\n  \"Imite ta réaction quand tu reçois un nude (version comique).\",\n  \"Fais un discours de 15 secondes pour défendre l'amour.\",\n  \"Montre comment tu tapes un message chaud avec le visage le plus sérieux.\",\n  \"Décris le dernier film romantique que tu as regardé, en pleurant comiquement.\",\n  \"Imite une star qui fait une déclaration à la caméra.\",\n  \"Danse le slow de ta vie avec un coussin.\",\n  \"Fais deviner ton crush par mime uniquement. 3 indices maximum.\",\n  \"Montre comment tu fais pour être irrésistible en 10 secondes.\",\n  \"Raconte ton dernier fou rire en amoureux comme un commentaire de match.\",\n  \"Décris la couleur qui te va le mieux et pourquoi, en regardant la cam.\",\n  \"Imite la personne la plus timide du salon qui doit faire un bisou.\",\n  \"Fais une lecture dramatique d'un message que tu as vraiment envoyé.\",\n  \"Montre ton plus beau sourire à la caméra. Maintenant.\",\n  \"Montre ta tenue complète du jour à la caméra. Maintenant.\",\n  \"Montre le fond de ton lit à la caméra. Maintenant.\",\n  \"Montre ta dernière photo de galerie à la caméra. Maintenant.\",\n  \"Montre ton geste de séduction préféré à la caméra. Maintenant.\",\n  \"Montre comment tu fais un bisou (sur ta main) à la caméra. Maintenant.\",\n  \"Montre ta plus belle pose de profil à la caméra. Maintenant.\",\n  \"Montre la chaise où tu te plais le mieux à la caméra. Maintenant.\",\n  \"Montre ta façon de te coiffer à la caméra. Maintenant.\",\n  \"Montre ton plus beau regard à la caméra. Maintenant.\",\n  \"Montre comment tu souris quand tu es gêné(e) à la caméra. Maintenant.\",\n  \"Montre ton geste quand tu reçois un message de ton crush à la caméra. Maintenant.\",\n  \"Montre ta main qui fait un geste doux à la caméra. Maintenant.\",\n  \"Montre la position dans laquelle tu dors à la caméra. Maintenant.\",\n  \"Montre ton plus beau changement d'expression à la caméra. Maintenant.\",\n  \"Montre ce que tu as dans tes poches à la caméra. Maintenant.\",\n  \"Montre ton duo préféré : regard puis sourire à la caméra. Maintenant.\",\n  \"Montre comment tu enlèves tes cheveux de ton visage à la caméra. Maintenant.\",\n  \"Montre ta façon de vous asseoir quand tu dragues à la caméra. Maintenant.\",\n  \"Montre la photo de ton écran de téléphone en verrouillage à la caméra. Maintenant.\",\n  \"Montre ta meilleure imitation de star à la caméra. Maintenant.\",\n  \"Montre comment tu réagis à un compliment à la caméra. Maintenant.\",\n  \"Montre ta tenue de nuit (version décente) à la caméra. Maintenant.\",\n  \"Montre le parfum que tu portes (montre le flacon) à la caméra. Maintenant.\",\n  \"Montre ta plus belle expression de surprise à la caméra. Maintenant.\",\n  \"Montre comment tu fais semblant d'être sûr(e) de toi à la caméra. Maintenant.\",\n  \"Montre ton rituel avant de sortir à la caméra. Maintenant.\",\n  \"Montre la chanson que tu chantes sous la douche à la caméra. Maintenant.\",\n  \"Montre comment tu bois ton café/thé de manière chic à la caméra. Maintenant.\",\n  \"Montre ta plus belle façon de dire bonjour à la caméra. Maintenant.\",\n  \"Envoie un vocal où tu chuchotes « viens ce soir ». 10 secondes minimum.\",\n  \"Envoie un vocal où tu fais un rire ultra séduisant. 10 secondes minimum.\",\n  \"Envoie un vocal où tu dis ton meilleur mot doux. 10 secondes minimum.\",\n  \"Envoie un vocal où tu gémis légèrement (juste un petit). 10 secondes minimum.\",\n  \"Envoie un vocal où tu dis « tu me manques » avec beaucoup d'émotion. 10 secondes minimum.\",\n  \"Envoie un vocal où tu imites un réveil très sexy. 10 secondes minimum.\",\n  \"Envoie un vocal où tu chuchotes un secret d'amour. 10 secondes minimum.\",\n  \"Envoie un vocal où tu dis « bonne nuit » comme si tu couchais près de la personne. 10 secondes minimum.\",\n  \"Envoie un vocal où tu racontes ta journée comme un poème. 10 secondes minimum.\",\n  \"Envoie un vocal où tu chantes le prénom de ton crush. 10 secondes minimum.\",\n  \"Envoie un vocal où tu fais un bisou sonore dans le micro. 10 secondes minimum.\",\n  \"Envoie un vocal où tu dis « je pense à toi » de 3 façons différentes. 10 secondes minimum.\",\n  \"Envoie un vocal où tu imites un message vocal d'un(e) ex jaloux(se). 10 secondes minimum.\",\n  \"Envoie un vocal où tu dis ton numéro de téléphone d'une voix douce. 10 secondes minimum.\",\n  \"Envoie un vocal où tu racontes une blague avec une voix de séduction. 10 secondes minimum.\",\n  \"Envoie un vocal où tu dis « pardon » comme si tu avais fait une grosse bêtise. 10 secondes minimum.\",\n  \"Envoie un vocal où tu chantes les félicitations pour un mariage. 10 secondes minimum.\",\n  \"Envoie un vocal où tu dis « ouvre la porte » comme dans un film. 10 secondes minimum.\",\n  \"Envoie un vocal où tu imites une star qui signe un autographe. 10 secondes minimum.\",\n  \"Envoie un vocal où tu fais le ton du « j'arrive » le plus mignon. 10 secondes minimum.\",\n  \"Envoie un vocal où tu dis à voix haute ta plus belle phrase de bonne nuit. 10 secondes minimum.\",\n  \"Envoie un vocal où tu imites le ton d'un parent qui découvre un crush. 10 secondes minimum.\",\n  \"Envoie un vocal où tu racontes ta plus belle rencontre en 10 secondes. 10 secondes minimum.\",\n  \"Envoie un vocal où tu dis « je t'attends » d'une voix qui donne envie. 10 secondes minimum.\",\n  \"Envoie un vocal où tu imites quelqu'un qui hésite à envoyer un message. 10 secondes minimum.\",\n  \"Envoie un vocal où tu fais un compte à rebours de séduction de 5 à 1. 10 secondes minimum.\",\n  \"Envoie un vocal où tu dis « ferme les yeux » très doucement. 10 secondes minimum.\",\n  \"Envoie un vocal où tu imites une déclaration de mariage complète. 10 secondes minimum.\",\n  \"Envoie un vocal où tu dis « viens ici » de 3 façons. 10 secondes minimum.\",\n  \"Envoie un vocal où tu chantes « bisou bisou » comme une berceuse. 10 secondes minimum.\",\n  \"Envoie un vocal où tu chuchotes ton premier prénom d'amour. 10 secondes minimum.\",\n  \"Envoie un vocal où tu dis « tu sens trop bon » comme si la personne était là. 10 secondes minimum.\",\n  \"Envoie un vocal où tu imites une réponse à un message reçu à 2 h du matin. 10 secondes minimum.\",\n  \"Envoie un vocal où tu fais une imitations de répondeur romantique. 10 secondes minimum.\",\n  \"Envoie un vocal où tu dis « aujourd'hui je pense à toi » en y ajoutant ta touche. 10 secondes minimum.\",\n  \"Dis au joueur de ton choix, en le/la regardant : « tu sens trop bon »\",\n  \"Dis au joueur de ton choix, en le/la regardant : « j'ai pensé à toi cette nuit »\",\n  \"Dis au joueur de ton choix, en le/la regardant : « si tu m'embrasses, je ne repousse pas »\",\n  \"Dis au joueur de ton choix, en le/la regardant : « ton sourire me fait perdre mes mots »\",\n  \"Dis au joueur de ton choix, en le/la regardant : « je te prépare le meilleur petit-déjeuner du monde »\",\n  \"Dis au joueur de ton choix, en le/la regardant : « avec toi, même le silence c'est bon »\",\n  \"Dis au joueur de ton choix, en le/la regardant : « je garde ta photo dans mes préférées »\",\n  \"Dis au joueur de ton choix, en le/la regardant : « si j'étais à côté de toi, je te tiendrais la main »\",\n  \"Dis au joueur de ton choix, en le/la regardant : « tu as une voix qui rassure »\",\n  \"Dis au joueur de ton choix, en le/la regardant : « quand tu écris, mon téléphone chauffe »\",\n  \"Dis au joueur de ton choix, en le/la regardant : « je te fais un câlin gratuit quand tu veux »\",\n  \"Dis au joueur de ton choix, en le/la regardant : « tu es le genre de personne qu'on ne laisse plus partir »\",\n  \"Dis au joueur de ton choix, en le/la regardant : « ton rire, c'est ma chanson préférée »\",\n  \"Dis au joueur de ton choix, en le/la regardant : « je te raccompagnerais sous n'importe quelle pluie »\",\n  \"Dis au joueur de ton choix, en le/la regardant : « dis-moi ton secret pour être aussi attirant(e) »\",\n  \"Dis au joueur de ton choix, en le/la regardant : « je choisis ton âge de cœur, pas ton âge réel »\",\n  \"Dis au joueur de ton choix, en le/la regardant : « toi, tu es du genre à marquer une vie »\",\n  \"Dis au joueur de ton choix, en le/la regardant : « je te confie mes plus grands secrets »\",\n  \"Dis au joueur de ton choix, en le/la regardant : « avec toi, un plan canapé vaut tous les clubs »\",\n  \"Dis au joueur de ton choix, en le/la regardant : « tu es ma plus belle surprise de la soirée »\",\n  \"Dis au joueur de ton choix, en le/la regardant : « si je devais recommencer un premier rendez-vous, ce serait avec toi »\",\n  \"Dis au joueur de ton choix, en le/la regardant : « ta présence rend cette partie meilleure »\",\n  \"Dis au joueur de ton choix, en le/la regardant : « tu as le talent de rendre les gens heureux »\",\n  \"Dis au joueur de ton choix, en le/la regardant : « j'emmenerais bien un café avec toi un matin »\",\n  \"Dis au joueur de ton choix, en le/la regardant : « ton nom restera dans ma tête ce soir »\",\n  \"Dis au joueur de ton choix, en le/la regardant : « je te prépare une playlist d'amour si tu veux »\",\n  \"Dis au joueur de ton choix, en le/la regardant : « tu es la raison pour laquelle je souris à mon téléphone »\",\n  \"Dis au joueur de ton choix, en le/la regardant : « on refait cette partie rien qu'à nous un jour ? »\",\n  \"Dis au joueur de ton choix, en le/la regardant : « tu as le genre de regard qui fait oublier la suite »\",\n  \"Dis au joueur de ton choix, en le/la regardant : « je te fais la promesse d'un meilleur bisou que ton ex »\",\n  \"Fais le plus beau regard de séduction pendant 15 secondes. Le groupe juge.\",\n  \"Fais le sourire le plus charmant pendant 15 secondes. Le groupe juge.\",\n  \"Fais le bisou volant le plus lent pendant 15 secondes. Le groupe juge.\",\n  \"Fais la pose de mannequin la plus confiante pendant 15 secondes. Le groupe juge.\",\n  \"Fais le rire le plus charmeur pendant 15 secondes. Le groupe juge.\",\n  \"Fais la marche la plus sexy de ta vie pendant 15 secondes. Le groupe juge.\",\n  \"Fais le câlin le plus réaliste avec un coussin pendant 15 secondes. Le groupe juge.\",\n  \"Fais le regard innocent le plus convaincant pendant 15 secondes. Le groupe juge.\",\n  \"Fais le mouvement de danse le plus romantique pendant 15 secondes. Le groupe juge.\",\n  \"Fais le clignement d'œil le plus teigneux pendant 15 secondes. Le groupe juge.\",\n  \"Fais l'expression la plus surprise après un compliment pendant 15 secondes. Le groupe juge.\",\n  \"Fais la voix la plus douce pendant 15 secondes. Le groupe juge.\",\n  \"Fais le souffle le plus calme (on doit t'entendre) pendant 15 secondes. Le groupe juge.\",\n  \"Fais le discours d'amour le plus dramatique pendant 15 secondes. Le groupe juge.\",\n  \"Fais le mime du premier rendez-vous le plus réaliste pendant 15 secondes. Le groupe juge.\",\n  \"Fais le geste du cœur le plus sincère pendant 15 secondes. Le groupe juge.\",\n  \"Fais le regard timide le plus mignon pendant 15 secondes. Le groupe juge.\",\n  \"Fais le sourire timide après un compliment pendant 15 secondes. Le groupe juge.\",\n  \"Fais le regard sombre de jalousie pendant 15 secondes. Le groupe juge.\",\n  \"Fais la pose la plus épique de photo de profil pendant 15 secondes. Le groupe juge.\",\n  \"Fais le moue la plus mignonne pendant 15 secondes. Le groupe juge.\",\n  \"Fais le regard du matin au réveil pendant 15 secondes. Le groupe juge.\",\n  \"Fais l'expression du « c'est moi que tu regardes ? » pendant 15 secondes. Le groupe juge.\",\n  \"Fais le regard du dernier message avant de dormir pendant 15 secondes. Le groupe juge.\",\n  \"Fais le soupir amoureux le plus réaliste pendant 15 secondes. Le groupe juge.\",\n  \"Fais le regard quand ton crush passe pendant 15 secondes. Le groupe juge.\",\n  \"Fais le mime du « laisse-moi te raccompagner » pendant 15 secondes. Le groupe juge.\",\n  \"Fais la déclaration muette la plus claire pendant 15 secondes. Le groupe juge.\",\n  \"Fais le regard qui dit tout sans parler pendant 15 secondes. Le groupe juge.\",\n  \"Fais le signe de « appelle-moi » le plus classe pendant 15 secondes. Le groupe juge.\",\n  \"Fais la pose de la réconciliation pendant 15 secondes. Le groupe juge.\",\n  \"Fais le sourire du lendemain de première rencontre pendant 15 secondes. Le groupe juge.\",\n  \"Fais le regard de défi le plus joueur pendant 15 secondes. Le groupe juge.\",\n  \"Fais la plus belle façon d'accueillir quelqu'un pendant 15 secondes. Le groupe juge.\",\n  \"Fais le geste de « viens là » le plus convaincant pendant 15 secondes. Le groupe juge.\",\n  \"Fais le regard de « dernière chance » pendant 15 secondes. Le groupe juge.\",\n  \"Fais le mime du câlin de bon matin pendant 15 secondes. Le groupe juge.\",\n  \"Fais la plus belle façon de dire merci à un compliment pendant 15 secondes. Le groupe juge.\",\n  \"Fais le regard de promesse le plus sérieux pendant 15 secondes. Le groupe juge.\",\n  \"Fais l'expression de la plus belle surprise de ta vie pendant 15 secondes. Le groupe juge.\",\n  \"Fais le salut le plus charismatique pendant 15 secondes. Le groupe juge.\",\n  \"Fais le regard de séduction à travers la pièce pendant 15 secondes. Le groupe juge.\",\n  \"Fais le bras ouvert du « viens dans mes bras » pendant 15 secondes. Le groupe juge.\",\n  \"Fais le sourire de derrière le micro pendant 15 secondes. Le groupe juge.\",\n  \"Fais le « chut » le plus mystérieux pendant 15 secondes. Le groupe juge.\",\n  \"Imite quelqu'un qui lit un message très chaud dans le bus comme si c'était normal. 20 secondes.\",\n  \"Imite quelqu'un qui répète un bisou dans le miroir comme si c'était normal. 20 secondes.\",\n  \"Imite quelqu'un qui s'entraîne à faire une déclaration comme si c'était normal. 20 secondes.\",\n  \"Imite quelqu'un qui reçoit son premier compliment comme si c'était normal. 20 secondes.\",\n  \"Imite quelqu'un qui découvre que son crush l'aime aussi comme si c'était normal. 20 secondes.\",\n  \"Imite quelqu'un qui cache son téléphone quand sa mère arrive comme si c'était normal. 20 secondes.\",\n  \"Imite quelqu'un qui attend un message qui ne vient jamais comme si c'était normal. 20 secondes.\",\n  \"Imite quelqu'un qui boit son verre en regardant quelqu'un comme si c'était normal. 20 secondes.\",\n  \"Imite quelqu'un qui fait semblant de dormir quand on l'appelle comme si c'était normal. 20 secondes.\",\n  \"Imite quelqu'un qui danse quand sa chanson arrive comme si c'était normal. 20 secondes.\",\n  \"Imite quelqu'un qui reçoit un bisou surprise comme si c'était normal. 20 secondes.\",\n  \"Imite quelqu'un qui essaie de se rappeler le prénom de son rencard comme si c'était normal. 20 secondes.\",\n  \"Imite quelqu'un qui fait semblant de connaître le vin au resto comme si c'était normal. 20 secondes.\",\n  \"Imite quelqu'un qui fait le fier après avoir obtenu le numéro comme si c'était normal. 20 secondes.\",\n  \"Imite quelqu'un qui explique la position où il dort à son chien comme si c'était normal. 20 secondes.\",\n  \"Imite quelqu'un qui fait semblant d'être occupé quand son crush passe comme si c'était normal. 20 secondes.\",\n  \"Imite quelqu'un qui choisit sa tenue 2 heures avant de sortir comme si c'était normal. 20 secondes.\",\n  \"Imite quelqu'un qui envoie un message et regrette tout de suite comme si c'était normal. 20 secondes.\",\n  \"Imite quelqu'un qui recopie une déclaration dans Google comme si c'était normal. 20 secondes.\",\n  \"Imite quelqu'un qui regarde la story de son ex discrètement comme si c'était normal. 20 secondes.\",\n  \"Imite quelqu'un qui attend le rendu de sa coiffure chez le coiffeur comme si c'était normal. 20 secondes.\",\n  \"Imite quelqu'un qui fait semblant d'aimer le cadeau comme si c'était normal. 20 secondes.\",\n  \"Imite quelqu'un qui chante sous la douche avec passion comme si c'était normal. 20 secondes.\",\n  \"Imite quelqu'un qui récupère son courage pour appeler comme si c'était normal. 20 secondes.\",\n  \"Imite quelqu'un qui fait la conversation avec un(e) inconnu(e) comme si c'était normal. 20 secondes.\",\n  \"Imite quelqu'un qui découvre une faute dans son message déjà envoyé comme si c'était normal. 20 secondes.\",\n  \"Imite quelqu'un qui jette un coup d'œil à son reflet dans la vitrine comme si c'était normal. 20 secondes.\",\n  \"Imite quelqu'un qui imite la voix douce au téléphone comme si c'était normal. 20 secondes.\",\n  \"Imite quelqu'un qui explique pourquoi il est en retard comme si c'était normal. 20 secondes.\",\n  \"Imite quelqu'un qui essaie de rattraper un bisou raté comme si c'était normal. 20 secondes.\",\n  \"Imite quelqu'un qui répète avant d'entrer dans la soirée comme si c'était normal. 20 secondes.\",\n  \"Imite quelqu'un qui essaie de ne pas regarder quelqu'un comme si c'était normal. 20 secondes.\",\n  \"Imite quelqu'un qui fait le branché au premier rendez-vous comme si c'était normal. 20 secondes.\",\n  \"Imite quelqu'un qui répète son sourire le plus naturel comme si c'était normal. 20 secondes.\",\n  \"Imite quelqu'un qui se prépare un « âme de séducteur » avant de sortir comme si c'était normal. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour vendre : ton sourire. Slogan obligatoire.\",\n  \"Fais une pub de 15 secondes pour vendre : ton regard. Slogan obligatoire.\",\n  \"Fais une pub de 15 secondes pour vendre : ta voix. Slogan obligatoire.\",\n  \"Fais une pub de 15 secondes pour vendre : ton sens de l'humour. Slogan obligatoire.\",\n  \"Fais une pub de 15 secondes pour vendre : ta façon d'embrasser (théorique). Slogan obligatoire.\",\n  \"Fais une pub de 15 secondes pour vendre : tes câlins (version publicité). Slogan obligatoire.\",\n  \"Fais une pub de 15 secondes pour vendre : ta patience en amour. Slogan obligatoire.\",\n  \"Fais une pub de 15 secondes pour vendre : ton talent pour draguer. Slogan obligatoire.\",\n  \"Fais une pub de 15 secondes pour vendre : ton romantisme. Slogan obligatoire.\",\n  \"Fais une pub de 15 secondes pour vendre : ton courage d'avouer ses sentiments. Slogan obligatoire.\",\n  \"Fais une pub de 15 secondes pour vendre : ta fidélité. Slogan obligatoire.\",\n  \"Fais une pub de 15 secondes pour vendre : ton humour de couple. Slogan obligatoire.\",\n  \"Fais une pub de 15 secondes pour vendre : ta présence réconfortante. Slogan obligatoire.\",\n  \"Fais une pub de 15 secondes pour vendre : ton charme naturel. Slogan obligatoire.\",\n  \"Fais une pub de 15 secondes pour vendre : ton flair pour trouver le/la bon(ne). Slogan obligatoire.\",\n  \"Fais une pub de 15 secondes pour vendre : ton cœur d'artiste. Slogan obligatoire.\",\n  \"Fais une pub de 15 secondes pour vendre : ta diplomatie après une dispute. Slogan obligatoire.\",\n  \"Fais une pub de 15 secondes pour vendre : ton talent de cuisinier(ère) en amoureux. Slogan obligatoire.\",\n  \"Fais une pub de 15 secondes pour vendre : ta façon de réconforter. Slogan obligatoire.\",\n  \"Fais une pub de 15 secondes pour vendre : ton élégance naturelle. Slogan obligatoire.\",\n  \"Danse le slow de ta vie pendant 20 secondes. La musique se choisit dans le salon.\",\n  \"Danse le dancehall le plus chaud pendant 20 secondes. La musique se choisit dans le salon.\",\n  \"Danse le pas de séduction le plus simple pendant 20 secondes. La musique se choisit dans le salon.\",\n  \"Danse la danse de la victoire après un rencard réussi pendant 20 secondes. La musique se choisit dans le salon.\",\n  \"Danse la danse de la jalousie pendant 20 secondes. La musique se choisit dans le salon.\",\n  \"Danse la danse du « je ne fais pas semblant » pendant 20 secondes. La musique se choisit dans le salon.\",\n  \"Danse le slow imaginé avec le joueur de ton choix pendant 20 secondes. La musique se choisit dans le salon.\",\n  \"Danse la danse du matin au réveil pendant 20 secondes. La musique se choisit dans le salon.\",\n  \"Danse la danse de la pluie trop romantique pendant 20 secondes. La musique se choisit dans le salon.\",\n  \"Danse la danse du dernier message reçu pendant 20 secondes. La musique se choisit dans le salon.\",\n  \"Danse la danse du « j'ai un rendez-vous ! » pendant 20 secondes. La musique se choisit dans le salon.\",\n  \"Danse la danse de la paix intérieure après une rupture pendant 20 secondes. La musique se choisit dans le salon.\",\n  \"Danse la danse de la météo : « il fait chaud ici » pendant 20 secondes. La musique se choisit dans le salon.\",\n  \"Danse la danse du première fois où tu as osé pendant 20 secondes. La musique se choisit dans le salon.\",\n  \"Danse la danse de l'anniversaire de couple pendant 20 secondes. La musique se choisit dans le salon.\",\n  \"Danse la danse de la bougie : lente et douce pendant 20 secondes. La musique se choisit dans le salon.\",\n  \"Danse la danse du vendredi soir pendant 20 secondes. La musique se choisit dans le salon.\",\n  \"Danse la danse du dernier jour de célibataire pendant 20 secondes. La musique se choisit dans le salon.\",\n  \"Danse la danse de l'attente du message pendant 20 secondes. La musique se choisit dans le salon.\",\n  \"Danse la danse du sourire impossible à cacher pendant 20 secondes. La musique se choisit dans le salon.\",\n  \"Danse la danse de la star préférée pendant 20 secondes. La musique se choisit dans le salon.\",\n  \"Danse la danse de la déclaration réussie pendant 20 secondes. La musique se choisit dans le salon.\",\n  \"Danse la danse de la pluie qui tombe doucement pendant 20 secondes. La musique se choisit dans le salon.\",\n  \"Danse la danse du miroir avant de sortir pendant 20 secondes. La musique se choisit dans le salon.\",\n  \"Danse la danse du câlin imaginaire pendant 20 secondes. La musique se choisit dans le salon.\",\n  \"Raconte ton meilleur souvenir avec les déclarations publiques. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les déclarations publiques. Slogan obligatoire.\",\n  \"Raconte ton meilleur souvenir avec les retrouvailles. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les chansons dédiées. 20 secondes.\",\n  \"Fais deviner les baisers dans le cou en 3 mimes maximum.\",\n  \"Fais une pub de 15 secondes pour les bougies. Slogan obligatoire.\",\n  \"Montre le geste parfait pour les premiers je t'aime. 10 secondes.\",\n  \"Montre le geste parfait pour les mains qui tremblent. 10 secondes.\",\n  \"Montre le geste parfait pour les massages des épaules. 10 secondes.\",\n  \"Décris les mains qui se cherchent comme un commentateur sportif. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les jalousies légères. 20 secondes.\",\n  \"Décris les bisous volés comme un commentateur sportif. 20 secondes.\",\n  \"Fais deviner les frissons discrets en 3 mimes maximum.\",\n  \"Mime ta plus belle scène avec les frissons discrets. 15 secondes.\",\n  \"Montre le geste parfait pour les voyages à deux. 10 secondes.\",\n  \"Imite quelqu'un qui découvre les jalousies légères. Le groupe devine.\",\n  \"Imite quelqu'un qui découvre les ex qui reviennent. Le groupe devine.\",\n  \"Mime ta plus belle scène avec les voyages à deux. 15 secondes.\",\n  \"Explique les notes vocales comme une notice de montage. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les câlins sur le canapé. Slogan obligatoire.\",\n  \"Mime ta plus belle scène avec les câlins sur le canapé. 15 secondes.\",\n  \"Imite quelqu'un qui découvre les chansons dédiées. Le groupe devine.\",\n  \"Fais une pub de 15 secondes pour les taxis du retour. Slogan obligatoire.\",\n  \"Raconte ton meilleur souvenir avec les cabines d'essayage. 20 secondes.\",\n  \"Montre le geste parfait pour les flirts au téléphone. 10 secondes.\",\n  \"Imite quelqu'un qui découvre les playlists d'amour. Le groupe devine.\",\n  \"Raconte ton meilleur souvenir avec les mains dans les cheveux. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les playlists d'amour. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les lettres jamais envoyées. Slogan obligatoire.\",\n  \"Imite quelqu'un qui découvre les voyages à deux. Le groupe devine.\",\n  \"Raconte ton meilleur souvenir avec les déjeuners au lit. 20 secondes.\",\n  \"Montre le geste parfait pour les frissons discrets. 10 secondes.\",\n  \"Décris les piques-niques en amoureux comme un commentateur sportif. 20 secondes.\",\n  \"Fais deviner les mains qui se cherchent en 3 mimes maximum.\",\n  \"Montre le geste parfait pour les baisers sur le front. 10 secondes.\",\n  \"Mime ta plus belle scène avec les slows collés. 15 secondes.\",\n  \"Mime ta plus belle scène avec les mains qui tremblent. 15 secondes.\",\n  \"Raconte ton meilleur souvenir avec les baisers dans le cou. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les sourires cachés. 20 secondes.\",\n  \"Décris les rencards surprises comme un commentateur sportif. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les playlists d'amour. Slogan obligatoire.\",\n  \"Raconte ton meilleur souvenir avec les piques-niques en amoureux. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les massages des épaules. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les baisers sous la pluie. Slogan obligatoire.\",\n  \"Explique les rencards surprises comme une notice de montage. 20 secondes.\",\n  \"Décris les câlins longs comme un commentateur sportif. 20 secondes.\",\n  \"Décris les amitiés qui basculent comme un commentateur sportif. 20 secondes.\",\n  \"Fais deviner les surnoms d'amour en 3 mimes maximum.\",\n  \"Décris les confidences nocturnes comme un commentateur sportif. 20 secondes.\",\n  \"Décris les promesses douces comme un commentateur sportif. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les photos de couple. 20 secondes.\",\n  \"Fais deviner les déclarations publiques en 3 mimes maximum.\",\n  \"Fais deviner les voyages à deux en 3 mimes maximum.\",\n  \"Imite quelqu'un qui découvre les baisers sous la pluie. Le groupe devine.\",\n  \"Explique les fous rires à 2 h du matin comme une notice de montage. 20 secondes.\",\n  \"Explique les confidences nocturnes comme une notice de montage. 20 secondes.\",\n  \"Décris les dimanches au lit comme un commentateur sportif. 20 secondes.\",\n  \"Explique les cabines d'essayage comme une notice de montage. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les douches à deux. Le groupe devine.\",\n  \"Montre le geste parfait pour les fous rires à 2 h du matin. 10 secondes.\",\n  \"Montre le geste parfait pour les lettres jamais envoyées. 10 secondes.\",\n  \"Fais deviner les dimanches au lit en 3 mimes maximum.\",\n  \"Imite quelqu'un qui découvre les sweats empruntés. Le groupe devine.\",\n  \"Fais deviner les ex qui reviennent en 3 mimes maximum.\",\n  \"Décris les fins de soirée à deux comme un commentateur sportif. 20 secondes.\",\n  \"Décris les câlins sur le canapé comme un commentateur sportif. 20 secondes.\",\n  \"Décris les frissons discrets comme un commentateur sportif. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les mains qui se cherchent. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les promenades main dans la main. Le groupe devine.\",\n  \"Fais une pub de 15 secondes pour les déjeuners au lit. Slogan obligatoire.\",\n  \"Mime ta plus belle scène avec les longues séparations. 15 secondes.\",\n  \"Fais deviner les notes vocales en 3 mimes maximum.\",\n  \"Fais deviner les promesses douces en 3 mimes maximum.\",\n  \"Fais deviner les câlins longs en 3 mimes maximum.\",\n  \"Fais deviner les odeurs de parfum en 3 mimes maximum.\",\n  \"Mime ta plus belle scène avec les dimanches au lit. 15 secondes.\",\n  \"Fais deviner les playlists d'amour en 3 mimes maximum.\",\n  \"Raconte ton meilleur souvenir avec les fins de soirée à deux. 20 secondes.\",\n  \"Mime ta plus belle scène avec les confidences nocturnes. 15 secondes.\",\n  \"Fais deviner les bougies en 3 mimes maximum.\",\n  \"Montre le geste parfait pour les câlins sur le canapé. 10 secondes.\",\n  \"Fais une pub de 15 secondes pour les jalousies légères. Slogan obligatoire.\",\n  \"Fais deviner les regards qui parlent en 3 mimes maximum.\",\n  \"Raconte ton meilleur souvenir avec les premiers je t'aime. 20 secondes.\",\n  \"Montre le geste parfait pour les déjeuners au lit. 10 secondes.\",\n  \"Fais une pub de 15 secondes pour les messages du matin. Slogan obligatoire.\",\n  \"Imite quelqu'un qui découvre les bisous volés. Le groupe devine.\",\n  \"Décris les cabines d'essayage comme un commentateur sportif. 20 secondes.\",\n  \"Explique les dîners aux chandelles comme une notice de montage. 20 secondes.\",\n  \"Montre le geste parfait pour les ex qui reviennent. 10 secondes.\",\n  \"Montre le geste parfait pour les slows collés. 10 secondes.\",\n  \"Fais deviner les surprises en soirée en 3 mimes maximum.\",\n  \"Fais deviner les photos de couple en 3 mimes maximum.\",\n  \"Fais deviner les retrouvailles en 3 mimes maximum.\",\n  \"Explique les massages des épaules comme une notice de montage. 20 secondes.\",\n  \"Fais deviner les lettres jamais envoyées en 3 mimes maximum.\",\n  \"Imite quelqu'un qui découvre les photos de couple. Le groupe devine.\",\n  \"Décris les notes vocales comme un commentateur sportif. 20 secondes.\",\n  \"Décris les retrouvailles comme un commentateur sportif. 20 secondes.\",\n  \"Montre le geste parfait pour les sweats empruntés. 10 secondes.\",\n  \"Montre le geste parfait pour les dîners aux chandelles. 10 secondes.\",\n  \"Mime ta plus belle scène avec les câlins endormis. 15 secondes.\",\n  \"Raconte ton meilleur souvenir avec les odeurs de parfum. 20 secondes.\",\n  \"Fais deviner les câlins sur le canapé en 3 mimes maximum.\",\n  \"Imite quelqu'un qui découvre les surprises en soirée. Le groupe devine.\",\n  \"Raconte ton meilleur souvenir avec les câlins endormis. 20 secondes.\",\n  \"Mime ta plus belle scène avec les piques-niques en amoureux. 15 secondes.\",\n  \"Mime ta plus belle scène avec les mains dans les cheveux. 15 secondes.\",\n  \"Mime ta plus belle scène avec les bougies. 15 secondes.\",\n  \"Imite quelqu'un qui découvre les rencards surprises. Le groupe devine.\",\n  \"Mime ta plus belle scène avec les surnoms d'amour. 15 secondes.\",\n  \"Fais une pub de 15 secondes pour les promenades main dans la main. Slogan obligatoire.\",\n  \"Fais une pub de 15 secondes pour les surprises en soirée. Slogan obligatoire.\",\n  \"Fais deviner les rencards surprises en 3 mimes maximum.\",\n  \"Fais une pub de 15 secondes pour les longues séparations. Slogan obligatoire.\",\n  \"Imite quelqu'un qui découvre les vocaux mignons. Le groupe devine.\",\n  \"Explique les premiers je t'aime comme une notice de montage. 20 secondes.\",\n  \"Mime ta plus belle scène avec les premiers je t'aime. 15 secondes.\",\n  \"Explique les dimanches au lit comme une notice de montage. 20 secondes.\",\n  \"Décris les rêves d'amour comme un commentateur sportif. 20 secondes.\",\n  \"Explique les chansons dédiées comme une notice de montage. 20 secondes.\",\n  \"Décris les photos de couple comme un commentateur sportif. 20 secondes.\",\n  \"Mime ta plus belle scène avec les jalousies légères. 15 secondes.\",\n  \"Explique les câlins endormis comme une notice de montage. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les amitiés qui basculent. Le groupe devine.\",\n  \"Mime ta plus belle scène avec les odeurs de parfum. 15 secondes.\",\n  \"Explique les playlists d'amour comme une notice de montage. 20 secondes.\",\n  \"Mime ta plus belle scène avec les regards qui parlent. 15 secondes.\",\n  \"Raconte ton meilleur souvenir avec les bougies. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les sweats empruntés. Slogan obligatoire.\",\n  \"Mime ta plus belle scène avec les déjeuners au lit. 15 secondes.\",\n  \"Décris les vocaux mignons comme un commentateur sportif. 20 secondes.\",\n  \"Décris les massages des épaules comme un commentateur sportif. 20 secondes.\",\n  \"Fais deviner les longues séparations en 3 mimes maximum.\",\n  \"Imite quelqu'un qui découvre les piques-niques en amoureux. Le groupe devine.\",\n  \"Fais une pub de 15 secondes pour les regards qui parlent. Slogan obligatoire.\",\n  \"Fais deviner les promenades main dans la main en 3 mimes maximum.\",\n  \"Fais une pub de 15 secondes pour les chansons dédiées. Slogan obligatoire.\",\n  \"Mime ta plus belle scène avec les baisers sur le front. 15 secondes.\",\n  \"Raconte ton meilleur souvenir avec les notes vocales. 20 secondes.\",\n  \"Montre le geste parfait pour les messages du matin. 10 secondes.\",\n  \"Explique les promenades main dans la main comme une notice de montage. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les surprises en soirée. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les notes vocales. Le groupe devine.\",\n  \"Raconte ton meilleur souvenir avec les slows collés. 20 secondes.\",\n  \"Montre le geste parfait pour les surnoms d'amour. 10 secondes.\",\n  \"Imite quelqu'un qui découvre les massages des épaules. Le groupe devine.\",\n  \"Imite quelqu'un qui découvre les premiers je t'aime. Le groupe devine.\",\n  \"Montre le geste parfait pour les promenades main dans la main. 10 secondes.\",\n  \"Explique les ex qui reviennent comme une notice de montage. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les cabines d'essayage. Slogan obligatoire.\",\n  \"Montre le geste parfait pour les mains dans les cheveux. 10 secondes.\",\n  \"Raconte ton meilleur souvenir avec les câlins longs. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les baisers sous la pluie. 20 secondes.\",\n  \"Mime ta plus belle scène avec les ex qui reviennent. 15 secondes.\",\n  \"Mime ta plus belle scène avec les sourires cachés. 15 secondes.\",\n  \"Mime ta plus belle scène avec les lettres jamais envoyées. 15 secondes.\",\n  \"Raconte ton meilleur souvenir avec les promesses douces. 20 secondes.\",\n  \"Mime ta plus belle scène avec les douches à deux. 15 secondes.\",\n  \"Mime ta plus belle scène avec les rêves d'amour. 15 secondes.\",\n  \"Montre le geste parfait pour les vocaux mignons. 10 secondes.\",\n  \"Fais une pub de 15 secondes pour les massages des épaules. Slogan obligatoire.\",\n  \"Fais deviner les confidences nocturnes en 3 mimes maximum.\",\n  \"Fais deviner les câlins endormis en 3 mimes maximum.\",\n  \"Montre le geste parfait pour les photos de couple. 10 secondes.\",\n  \"Raconte ton meilleur souvenir avec les promenades main dans la main. 20 secondes.\",\n  \"Mime ta plus belle scène avec les chansons dédiées. 15 secondes.\",\n  \"Mime ta plus belle scène avec les playlists d'amour. 15 secondes.\",\n  \"Montre le geste parfait pour les câlins longs. 10 secondes.\",\n  \"Fais une pub de 15 secondes pour les premiers je t'aime. Slogan obligatoire.\",\n  \"Fais deviner les jalousies légères en 3 mimes maximum.\",\n  \"Fais deviner les bisous volés en 3 mimes maximum.\",\n  \"Imite quelqu'un qui découvre les sourires cachés. Le groupe devine.\",\n  \"Montre le geste parfait pour les mains qui se cherchent. 10 secondes.\",\n  \"Raconte ton meilleur souvenir avec les mains qui tremblent. 20 secondes.\",\n  \"Mime ta plus belle scène avec les vocaux mignons. 15 secondes.\",\n  \"Imite quelqu'un qui découvre les fous rires à 2 h du matin. Le groupe devine.\",\n  \"Explique les baisers sous la pluie comme une notice de montage. 20 secondes.\",\n  \"Montre le geste parfait pour les chansons dédiées. 10 secondes.\",\n  \"Mime ta plus belle scène avec les bisous volés. 15 secondes.\",\n  \"Raconte ton meilleur souvenir avec les longues séparations. 20 secondes.\",\n  \"Mime ta plus belle scène avec les sweats empruntés. 15 secondes.\",\n  \"Explique les câlins sur le canapé comme une notice de montage. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les notes vocales. Slogan obligatoire.\",\n  \"Imite quelqu'un qui découvre les cabines d'essayage. Le groupe devine.\",\n  \"Imite quelqu'un qui découvre les déjeuners au lit. Le groupe devine.\",\n  \"Mime ta plus belle scène avec les fins de soirée à deux. 15 secondes.\",\n  \"Décris les mains qui tremblent comme un commentateur sportif. 20 secondes.\",\n  \"Mime ta plus belle scène avec les baisers dans le cou. 15 secondes.\",\n  \"Mime ta plus belle scène avec les câlins longs. 15 secondes.\",\n  \"Fais une pub de 15 secondes pour les dîners aux chandelles. Slogan obligatoire.\",\n  \"Mime ta plus belle scène avec les promenades main dans la main. 15 secondes.\",\n  \"Décris les dîners aux chandelles comme un commentateur sportif. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les vocaux mignons. 20 secondes.\",\n  \"Montre le geste parfait pour les rencards surprises. 10 secondes.\",\n  \"Décris les bougies comme un commentateur sportif. 20 secondes.\",\n  \"Explique les déclarations publiques comme une notice de montage. 20 secondes.\",\n  \"Fais deviner les fous rires à 2 h du matin en 3 mimes maximum.\",\n  \"Explique les amitiés qui basculent comme une notice de montage. 20 secondes.\",\n  \"Fais deviner les baisers sur le front en 3 mimes maximum.\",\n  \"Fais deviner les fins de soirée à deux en 3 mimes maximum.\",\n  \"Décris les déjeuners au lit comme un commentateur sportif. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les regards qui parlent. Le groupe devine.\",\n  \"Imite quelqu'un qui découvre les rêves d'amour. Le groupe devine.\",\n  \"Imite quelqu'un qui découvre les slows collés. Le groupe devine.\",\n  \"Raconte ton meilleur souvenir avec les baisers sur le front. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les baisers sur le front. Le groupe devine.\",\n  \"Explique les bisous volés comme une notice de montage. 20 secondes.\",\n  \"Fais deviner les déjeuners au lit en 3 mimes maximum.\",\n  \"Fais deviner les messages du matin en 3 mimes maximum.\"\n]\n  },\n  2: {\n    verite: [\n  \"Décris ton premier baiser : âge, lieu, ambiance. Détails exigés.\",\n  \"As-tu déjà couché avec quelqu'un dès le premier soir ?\",\n  \"C'est le fantasme que tu n'as jamais raconté à personne ?\",\n  \"As-tu déjà été surpris(e) en pleine action ? Par qui ?\",\n  \"Quel est l'endroit le plus insolite où tu as fait l'amour ?\",\n  \"As-tu déjà envoyé une photo osée ? À qui ?\",\n  \"As-tu déjà fantasmé sur un proche de ton entourage ?\",\n  \"As-tu déjà simulé un orgasme ? Combien de fois environ ?\",\n  \"C'est la chose la plus folle que tu aies dite au lit ?\",\n  \"As-tu déjà craqué pour un(e) ami(e) déjà pris(e) ?\",\n  \"Ton pire baiser de ta vie ? Raconte la catastrophe.\",\n  \"Combien de personnes as-tu couchées avec ? Le vrai chiffre ou presque.\",\n  \"Tu préfères les préliminaires longs ou l'action directe ?\",\n  \"C'est ta position préférée ? Décris-la simplement.\",\n  \"As-tu déjà fait l'amour dans une voiture ? Où exactement ?\",\n  \"Tu regardes quoi quand tu es seul(e) ? Sois honnête.\",\n  \"As-tu déjà dit le mauvais prénom pendant l'action ?\",\n  \"C'est ton bruit le plus gênant au lit ? Raconte.\",\n  \"As-tu déjà eu un coup d'un soir ? Comment ça s'est fini ?\",\n  \"Tu as déjà couché avec un(e) collègue ou un(e) camarade ?\",\n  \"C'est ta partie préférée chez un homme ? Chez une femme ?\",\n  \"As-tu déjà testé la douche à deux ? Verdict ?\",\n  \"Combien de temps durent tes préliminaires en moyenne ?\",\n  \"As-tu déjà envoyé un nude ? Tu as regretté ou pas ?\",\n  \"Quel est ton meilleur souvenir chaud ? Décris-le sans les noms.\",\n  \"As-tu déjà couché chez les parents ? Presque surpris(e) ?\",\n  \"C'est le mot sale qui t'excite le plus quand on le chuchote ?\",\n  \"As-tu déjà filmé ou été filmé(e) pendant l'action (avec accord) ?\",\n  \"Tu préfères la lumière ou l'obscurité pendant l'amour ? Pourquoi ?\",\n  \"As-tu déjà eu une aventure avec un(e) voisin(e) ?\",\n  \"C'est ton record de fois en une seule nuit ?\",\n  \"As-tu déjà testé les menottes ou le bandeau sur les yeux ?\",\n  \"Tu as déjà gémi le mauvais prénom ? Lequel est sorti ?\",\n  \"C'est la chose la plus osée que tu aies faite en public ?\",\n  \"As-tu déjà couché avec deux personnes le même week-end ?\",\n  \"Tu préfères prendre ou donner les commandes ? Pourquoi ?\",\n  \"As-tu déjà eu un plan qui a mal tourné ? Raconte.\",\n  \"C'est ton plus grand manque quand tu es célibataire trop longtemps ?\",\n  \"As-tu déjà embrassé quelqu'un qui avait un(e) copain/copine ?\",\n  \"Tu regardes quoi en premier chez quelqu'un nu ?\",\n  \"As-tu déjà eu un rapprochement dans un club ? Jusqu'où ?\",\n  \"C'est ton vêtement le plus sexy ? Montre-le en le décrivant.\",\n  \"As-tu déjà testé une position du net ? Verdict honnête ?\",\n  \"Tu as déjà laissé une marque (hickey) ou reçu une ? Où ?\",\n  \"C'est ton niveau sonore au lit : discret(e), normal(e) ou bruyant(e) ?\",\n  \"As-tu déjà couché avec ton/ta ex après la rupture ? Comment ça s'est passé ?\",\n  \"Tu préfères qu'on te murmure quoi à l'oreille ? Le mot exact.\",\n  \"As-tu déjà testé la glace ou la plume pendant les préliminaires ?\",\n  \"C'est ta plus grosse gaffe en pleine intimité ?\",\n  \"As-tu déjà eu un rêve chaud avec quelqu'un d'ici ? Décris sans le nommer.\",\n  \"Tu penses à quoi quand tu fermes les yeux sous la douche ?\",\n  \"As-tu déjà eu une envie irrésistible pendant un reuni important ?\",\n  \"C'est le compliment physique qui t'excite le plus ?\",\n  \"As-tu déjà eu une relation qui a fini par un duo de c... compliqué ?\",\n  \"As-tu déjà testé le téléphon chaud complet ? Jusqu'où tu es allé(e) ?\",\n  \"C'est ton record de messages chauds en une soirée ?\",\n  \"As-tu déjà fait l'amour pendant une coupure d'électricité ?\",\n  \"Tu as déjà eu une envie pressante en pensant à quelqu'un d'ici ?\",\n  \"C'est le geste le plus osé qu'on ait fait sur toi en public ?\",\n  \"As-tu déjà embrassé quelqu'un dans un ascenseur ?\",\n  \"C'est ta plus longue soirée qui a fini très tard le lendemain ?\",\n  \"As-tu déjà adapté ton rythme au genre : doux ou sauvage ? Explique.\",\n  \"Tu as déjà volé un sous-vêtement à un(e) partenaire comme souvenir ?\",\n  \"C'est ton pire moment de gêne au déshabillage ?\",\n  \"As-tu déjà simulé la fatigue pour éviter l'action ? Pourquoi ?\",\n  \"Tu as déjà pensé à quelqu'un d'autre pendant l'action ? Qui (initiale) ?\",\n  \"As-tu déjà eu un plan chez toi et regretter après ? Raconte.\",\n  \"As-tu déjà couché dès le premier rendez-vous ? Raconte tout.\",\n  \"As-tu déjà fait l'amour dans une voiture garée ? Raconte tout.\",\n  \"As-tu déjà envoyé un nude à la mauvaise personne ? Raconte tout.\",\n  \"As-tu déjà gardé un nude reçu ? Raconte tout.\",\n  \"As-tu déjà simulé un orgasme pour que ça finisse ? Raconte tout.\",\n  \"As-tu déjà été surpris(e) par un membre de ta famille ? Raconte tout.\",\n  \"As-tu déjà fait l'amour chez les parents de l'autre ? Raconte tout.\",\n  \"As-tu déjà dormi entièrement nu(e) avec quelqu'un ? Raconte tout.\",\n  \"As-tu déjà eu une aventure avec un(e) voisin(e) ? Raconte tout.\",\n  \"As-tu déjà embrassé un(e) ami(e) par jeu qui a dégénéré ? Raconte tout.\",\n  \"As-tu déjà regardé un film X avec quelqu'un ? Raconte tout.\",\n  \"As-tu déjà eu un coup d'un soir chez toi ? Raconte tout.\",\n  \"As-tu déjà dit oui juste par fatigue ? Raconte tout.\",\n  \"As-tu déjà couché avec un(e) collègue après une soirée ? Raconte tout.\",\n  \"As-tu déjà testé la douche à deux ? Raconte tout.\",\n  \"As-tu déjà couché dans la même pièce que des amis endormis ? Raconte tout.\",\n  \"As-tu déjà reçu un appel pendant l'action et répondu ? Raconte tout.\",\n  \"As-tu déjà eu une relation dans les toilettes d'un club ? Raconte tout.\",\n  \"As-tu déjà embrassé deux personnes en une soirée ? Raconte tout.\",\n  \"As-tu déjà laissé une marque sur le cou de quelqu'un ? Raconte tout.\",\n  \"As-tu déjà eu une histoire avec un(e) professeur(e) ou un(e) chef ? Raconte tout.\",\n  \"As-tu déjà couché pendant les règles sans problème ? Raconte tout.\",\n  \"As-tu déjà eu une envie très forte pendant un cours ou une réunion ? Raconte tout.\",\n  \"As-tu déjà fini une soirée chez un(e) inconnu(e) ? Raconte tout.\",\n  \"As-tu déjà eu un plan qui a commencé par un simple massage ? Raconte tout.\",\n  \"As-tu déjà recu une photo non demandée et répondu chaudement ? Raconte tout.\",\n  \"As-tu déjà couché avec quelqu'un que tu ne supportais plus le lendemain ? Raconte tout.\",\n  \"As-tu déjà retardé un rendez-vous à cause d'une nuit trop longue ? Raconte tout.\",\n  \"As-tu déjà pleuré après une intimité trop forte ? Raconte tout.\",\n  \"As-tu déjà eu un partenaire trop bruyant pour ton quartier ? Raconte tout.\",\n  \"As-tu déjà été démasqué(e) pendant un mensonge chaud ? Raconte tout.\",\n  \"As-tu déjà couché avec quelqu'un de ton quartier secret ? Raconte tout.\",\n  \"As-tu déjà embrassé quelqu'un en conduisant ? Raconte tout.\",\n  \"As-tu déjà couché dans un lit qui grince trop ? Raconte tout.\",\n  \"As-tu déjà caché une relation à tout le monde ? Raconte tout.\",\n  \"As-tu déjà eu une histoire secrète avec un(e) ami(e) du groupe ? Raconte tout.\",\n  \"As-tu déjà fait l'amour alors qu'une série tournait à côté ? Raconte tout.\",\n  \"As-tu déjà envoyé un vocal chaud qui a glitché en public ? Raconte tout.\",\n  \"As-tu déjà couché sur une table, pas sur un lit ? Raconte tout.\",\n  \"As-tu déjà laissé des traces de rouge à lèvres inexpliquées ? Raconte tout.\",\n  \"As-tu déjà expliqué à un(e) voisin(e) un bruit gênant ? Raconte tout.\",\n  \"As-tu déjà couché avec quelqu'un qui ronfle après ? Raconte tout.\",\n  \"As-tu déjà eu une relation pendant qu'il pleuvait très fort ? Raconte tout.\",\n  \"As-tu déjà testé l'amour tôt le matin avant le travail ? Raconte tout.\",\n  \"As-tu déjà eu une envie pendant une coupure d'Internet ? Raconte tout.\",\n  \"As-tu déjà couché avec la personne « interdite » du groupe ? Raconte tout.\",\n  \"As-tu déjà couché avec un(e) champion(ne) qui dort tout de suite après ? Raconte tout.\",\n  \"As-tu déjà couché avec quelqu'un qui parle trop pendant ? Raconte tout.\",\n  \"As-tu déjà eu un rire fou pendant l'action ? Raconte tout.\",\n  \"As-tu déjà raconté à tes amis le lendemain matin ? Raconte tout.\",\n  \"As-tu déjà couché avec quelqu'un dont tu ne connais toujours pas le nom ? Raconte tout.\",\n  \"As-tu déjà couché avec quelqu'un déjà marié(e) sans le savoir ? Raconte tout.\",\n  \"As-tu déjà arrêté en plein milieu parce que trop fatigué(e) ? Raconte tout.\",\n  \"As-tu déjà eu une chute du lit en pleine action ? Raconte tout.\",\n  \"As-tu déjà couché avec la télé allumée toute la nuit ? Raconte tout.\",\n  \"As-tu déjà couché avec une playlist très mal choisie ? Raconte tout.\",\n  \"As-tu déjà couché avant de manger et fini par brûler le dîner ? Raconte tout.\",\n  \"As-tu déjà couché après une grosse dispute (maquillage intensif) ? Raconte tout.\",\n  \"As-tu déjà couché dans la voiture de tes parents ? Raconte tout.\",\n  \"As-tu déjà couché avec un(e) ancien(ne) camarade d'école ? Raconte tout.\",\n  \"As-tu déjà couché le jour de ton anniversaire en mode VIP ? Raconte tout.\",\n  \"As-tu déjà couché avec quelqu'un qui a gardé ses chaussettes ? Raconte tout.\",\n  \"Ta position ou ta préférence : la missionnaire, pourquoi elle reste un classique. Décris en une phrase.\",\n  \"Ta position ou ta préférence : la cuillère, douce ou pas. Décris en une phrase.\",\n  \"Ta position ou ta préférence : la cavalière, ce que tu y aimes. Décris en une phrase.\",\n  \"Ta position ou ta préférence : contre le mur, la vraie raison. Décris en une phrase.\",\n  \"Ta position ou ta préférence : la levrette, trop ou juste bien. Décris en une phrase.\",\n  \"Ta position ou ta préférence : sur la table, l'expérience vécue. Décris en une phrase.\",\n  \"Ta position ou ta préférence : dans la douche, le vrai problème. Décris en une phrase.\",\n  \"Ta position ou ta préférence : le 69, trop compliqué ou parfait. Décris en une phrase.\",\n  \"Ta position ou ta préférence : face au miroir, ce que ça change. Décris en une phrase.\",\n  \"Ta position ou ta préférence : sur une chaise, la vraie histoire. Décris en une phrase.\",\n  \"Ta position ou ta préférence : les jambes sur les épaules, l'avis sincère. Décris en une phrase.\",\n  \"Ta position ou ta préférence : la position d'endormissement préférée après. Décris en une phrase.\",\n  \"Ta position ou ta préférence : la position du matin avant le travail. Décris en une phrase.\",\n  \"Ta position ou ta préférence : la position idéale dans une voiture. Décris en une phrase.\",\n  \"Ta position ou ta préférence : la position parfaite pour ne pas être entendu(e). Décris en une phrase.\",\n  \"Ta position ou ta préférence : la position où tu tiens le plus longtemps. Décris en une phrase.\",\n  \"Ta position ou ta préférence : la position où tu perds le contrôle. Décris en une phrase.\",\n  \"Ta position ou ta préférence : la position la plus fatigante de ta liste. Décris en une phrase.\",\n  \"Ta position ou ta préférence : la position la plus sous-estimée. Décris en une phrase.\",\n  \"Ta position ou ta préférence : la position que tu refuses toujours et pourquoi. Décris en une phrase.\",\n  \"Ta position ou ta préférence : ta façon préférée d'être embrassé(e). Décris en une phrase.\",\n  \"Ta position ou ta préférence : ta façon préférée d'être caressé(e). Décris en une phrase.\",\n  \"Ta position ou ta préférence : l'endroit du corps où tu aimes être embrassé(e) le plus. Décris en une phrase.\",\n  \"Ta position ou ta préférence : la vitesse parfaite : lente, normale ou rapide. Décris en une phrase.\",\n  \"Ta position ou ta préférence : ton style : calme, joueur ou sauvage. Décris en une phrase.\",\n  \"Ta position ou ta préférence : ton moment préféré : avant, pendant ou après. Décris en une phrase.\",\n  \"Ta position ou ta préférence : ta préférence : avec ou sans musique. Décris en une phrase.\",\n  \"Ta position ou ta préférence : ta préférence : lit, canapé ou sol. Décris en une phrase.\",\n  \"Ta position ou ta préférence : ta préférence : nuit noire ou lampe allumée. Décris en une phrase.\",\n  \"Ta position ou ta préférence : ta préférence : silence total ou mots sales. Décris en une phrase.\",\n  \"Ta position ou ta préférence : la chose que tu adores qu'on te fasse (un seul exemple). Décris en une phrase.\",\n  \"Ta position ou ta préférence : la chose que tu aimes faire le plus (un seul exemple). Décris en une phrase.\",\n  \"Ta position ou ta préférence : le meilleur endroit où recevoir un bisou. Décris en une phrase.\",\n  \"Ta position ou ta préférence : le meilleur endroit où poser tes mains. Décris en une phrase.\",\n  \"Ta position ou ta préférence : ton tempo préféré pour les préliminaires. Décris en une phrase.\",\n  \"Ta position ou ta préférence : le nombre parfait de rounds selon toi. Décris en une phrase.\",\n  \"Ta position ou ta préférence : la durée parfaite d'une nuit parfaite. Décris en une phrase.\",\n  \"Ta position ou ta préférence : le point de départ parfait d'une soirée chaude. Décris en une phrase.\",\n  \"Ta position ou ta préférence : la chose la plus importante au lit selon toi. Décris en une phrase.\",\n  \"Ta position ou ta préférence : le son que tu préfères entendre pendant. Décris en une phrase.\",\n  \"Ta position ou ta préférence : le mot que tu aimes entendre dans l'oreille. Décris en une phrase.\",\n  \"Ta position ou ta préférence : le vêtement que tu aimes laisser sur toi. Décris en une phrase.\",\n  \"Ta position ou ta préférence : l'accessoire que tu voudrais tester. Décris en une phrase.\",\n  \"Ta position ou ta préférence : l'endroit parfait pour les préliminaires. Décris en une phrase.\",\n  \"Ta position ou ta préférence : la température parfaite de la chambre. Décris en une phrase.\",\n  \"Ta position ou ta préférence : l'heure parfaite pour une nuit parfaite. Décris en une phrase.\",\n  \"Ta position ou ta préférence : la chose que tu ne feras jamais (ton vrai limite). Décris en une phrase.\",\n  \"Ta position ou ta préférence : la chose que tu as mise du temps à oser. Décris en une phrase.\",\n  \"Ta position ou ta préférence : la chose que tu as adorée sans t'y attendre. Décris en une phrase.\",\n  \"Ta position ou ta préférence : la chose que tu voudrais faire plus souvent. Décris en une phrase.\",\n  \"Tu préfères : préliminaires longs ou action directe ? Argumente en une phrase.\",\n  \"Tu préfères : lumières allumées ou éteintes ? Argumente en une phrase.\",\n  \"Tu préfères : silence total ou musique forte ? Argumente en une phrase.\",\n  \"Tu préfères : doucéur extrême ou côté sauvage ? Argumente en une phrase.\",\n  \"Tu préfères : un(e) partenaire calme ou un(e) animal(e) ? Argumente en une phrase.\",\n  \"Tu préfères : l'amour le matin ou le soir ? Argumente en une phrase.\",\n  \"Tu préfères : avec ou sans sous-vêtements ? Argumente en une phrase.\",\n  \"Tu préfères : lit king size ou espace réduit ? Argumente en une phrase.\",\n  \"Tu préfères : un(e) partenaire expérimenté(e) ou débutant(e) ? Argumente en une phrase.\",\n  \"Tu préfères : baiser puis dormir ou parler toute la nuit ? Argumente en une phrase.\",\n  \"Tu préfères : les mots doux ou les ordres doux ? Argumente en une phrase.\",\n  \"Tu préfères : un bisou long ou mille petits bisous ? Argumente en une phrase.\",\n  \"Tu préfères : que ce soit toi qui initie ou l'autre ? Argumente en une phrase.\",\n  \"Tu préfères : un rendez-vous qui finit tôt ou très tard ? Argumente en une phrase.\",\n  \"Tu préfères : la spontanéité totale ou le plan préparé ? Argumente en une phrase.\",\n  \"Tu préfères : un câlin chaud ou un câlin long ? Argumente en une phrase.\",\n  \"Tu préfères : la passion d'un soir ou l'habitude confortable ? Argumente en une phrase.\",\n  \"Tu préfères : la créativité totale ou la routine parfaite ? Argumente en une phrase.\",\n  \"Tu préfères : les yeux bandés ou les mains liées ? Argumente en une phrase.\",\n  \"Tu préfères : le parfum fort ou le corps naturel ? Argumente en une phrase.\",\n  \"Tu préfères : un(a) partenaire qui ronfle ou qui parle en dormant ? Argumente en une phrase.\",\n  \"Tu préfères : l'après-amour : dormir ou manger ? Argumente en une phrase.\",\n  \"Tu préfères : les rencontres chez toi ou dehors ? Argumente en une phrase.\",\n  \"Tu préfères : un plan suivi ou un plan isolé ? Argumente en une phrase.\",\n  \"Tu préfères : l'amour rapide ou l'amour très lent ? Argumente en une phrase.\",\n  \"Tu préfères : les grands gestes ou les petites attentions ? Argumente en une phrase.\",\n  \"Tu préfères : qu'on te surprenne ou qu'on t'annonce tout ? Argumente en une phrase.\",\n  \"Tu préfères : la pudeur ou l'audace totale ? Argumente en une phrase.\",\n  \"Tu préfères : le téléphone éteint ou en mode musique ? Argumente en une phrase.\",\n  \"Tu préfères : l'odeur de la nuit ou le parfum du matin ? Argumente en une phrase.\",\n  \"Tu préfères : un câlin silencieux ou un câlin bavard ? Argumente en une phrase.\",\n  \"Tu préfères : la tendresse extrême ou le défi constant ? Argumente en une phrase.\",\n  \"Tu préfères : les surprises fréquentes ou la stabilité ? Argumente en une phrase.\",\n  \"Tu préfères : le corps musclé ou le corps doux ? Argumente en une phrase.\",\n  \"Tu préfères : les baisers publics ou les baisers privés seulement ? Argumente en une phrase.\",\n  \"Tu préfères : la vérité brutale ou les mensonges doux ? Argumente en une phrase.\",\n  \"Tu préfères : un(a) ex qui change ou un(e) nouveau/nouvelle qui découvre ? Argumente en une phrase.\",\n  \"Tu préfères : la journée de repos après ou la soirée qui continue ? Argumente en une phrase.\",\n  \"Tu préfères : les photos ensemble ou les souvenirs dans la tête ? Argumente en une phrase.\",\n  \"Tu préfères : qu'on te fasse rire ou qu'on te fasse rêver ? Argumente en une phrase.\",\n  \"Qu'est-ce que tu penses le plus souvent : le dernier baiser que tu as donné ? Décris.\",\n  \"Qu'est-ce que tu penses le plus souvent : le prochain rendez-vous chaud ? Décris.\",\n  \"Qu'est-ce que tu penses le plus souvent : le corps de ta dernière personne ? Décris.\",\n  \"Qu'est-ce que tu penses le plus souvent : la nuit que tu refais en boucle ? Décris.\",\n  \"Qu'est-ce que tu penses le plus souvent : le message que tu voudrais recevoir ? Décris.\",\n  \"Qu'est-ce que tu penses le plus souvent : la position que tu veux tester ? Décris.\",\n  \"Qu'est-ce que tu penses le plus souvent : le lieu interdit que tu veux essayer ? Décris.\",\n  \"Qu'est-ce que tu penses le plus souvent : le mot que tu voudrais entendre ? Décris.\",\n  \"Qu'est-ce que tu penses le plus souvent : la personne que tu ne devrais pas penser ? Décris.\",\n  \"Qu'est-ce que tu penses le plus souvent : le moment où tu as perdu le contrôle ? Décris.\",\n  \"Qu'est-ce que tu penses le plus souvent : la façon dont tu te touches quand tu es seul(e) ? Décris.\",\n  \"Qu'est-ce que tu penses le plus souvent : la première fois que tu as tout compris ? Décris.\",\n  \"Qu'est-ce que tu penses le plus souvent : le bruit que tu fais quand c'est trop bon ? Décris.\",\n  \"Qu'est-ce que tu penses le plus souvent : l'odeur qui te rend fou/folle ? Décris.\",\n  \"Qu'est-ce que tu penses le plus souvent : le contact que tu préfères ? Décris.\",\n  \"Qu'est-ce que tu penses le plus souvent : la soirée où tu as trop osé ? Décris.\",\n  \"Qu'est-ce que tu penses le plus souvent : la personne que tu voudrais ce soir ? Décris.\",\n  \"Qu'est-ce que tu penses le plus souvent : le vêtement que tu veux voir tomber ? Décris.\",\n  \"Qu'est-ce que tu penses le plus souvent : le réveil côte à côte ? Décris.\",\n  \"Qu'est-ce que tu penses le plus souvent : la douche qui dure trop longtemps ? Décris.\",\n  \"Qu'est-ce que tu penses le plus souvent : le lit trop grand sans personne ? Décris.\",\n  \"Qu'est-ce que tu penses le plus souvent : le silence du matin après une nuit chaude ? Décris.\",\n  \"Qu'est-ce que tu penses le plus souvent : la marque laissée sur ta peau ? Décris.\",\n  \"Qu'est-ce que tu penses le plus souvent : le mot « encore » murmuré ? Décris.\",\n  \"Qu'est-ce que tu penses le plus souvent : le souffle dans ton cou ? Décris.\",\n  \"Qu'est-ce que tu penses le plus souvent : les mains qui se perdent ? Décris.\",\n  \"Qu'est-ce que tu penses le plus souvent : le frisson du premier contact ? Décris.\",\n  \"Qu'est-ce que tu penses le plus souvent : le regard qui demande la permission ? Décris.\",\n  \"Qu'est-ce que tu penses le plus souvent : le soupir de fin de nuit ? Décris.\",\n  \"Qu'est-ce que tu penses le plus souvent : le sourire du lendemain ? Décris.\",\n  \"Qu'est-ce que tu penses le plus souvent : le taxi du retour à l'aube ? Décris.\",\n  \"Qu'est-ce que tu penses le plus souvent : le message « je suis bien chez toi » ? Décris.\",\n  \"Qu'est-ce que tu penses le plus souvent : la fatigue douce du matin après ? Décris.\",\n  \"Qu'est-ce que tu penses le plus souvent : la soif bizarre du réveil ? Décris.\",\n  \"Qu'est-ce que tu penses le plus souvent : le triomphe silencieux de la nuit passée ? Décris.\",\n  \"Qu'est-ce que tu penses le plus souvent : le trou de mémoire du nom de la personne ? Décris.\",\n  \"Qu'est-ce que tu penses le plus souvent : le pantalon trop difficile à trouver au sol ? Décris.\",\n  \"Qu'est-ce que tu penses le plus souvent : l'alarme qui gâche tout ? Décris.\",\n  \"Qu'est-ce que tu penses le plus souvent : le « il faut que j'y aille » trop tôt ? Décris.\",\n  \"Qu'est-ce que tu penses le plus souvent : le dernier regard à la porte ? Décris.\",\n  \"Décris ton niveau ou ton style sur : ton endurance au lit. Chiffre sur 10 obligatoire.\",\n  \"Décris ton niveau ou ton style sur : ta douceur pendant les préliminaires. Chiffre sur 10 obligatoire.\",\n  \"Décris ton niveau ou ton style sur : ton côté sauvage quand tu lâches prise. Chiffre sur 10 obligatoire.\",\n  \"Décris ton niveau ou ton style sur : tes talents de baiser. Chiffre sur 10 obligatoire.\",\n  \"Décris ton niveau ou ton style sur : tes talents de masseur/masseuse. Chiffre sur 10 obligatoire.\",\n  \"Décris ton niveau ou ton style sur : ton audace pour faire le premier pas. Chiffre sur 10 obligatoire.\",\n  \"Décris ton niveau ou ton style sur : tes talents pour les mots sales. Chiffre sur 10 obligatoire.\",\n  \"Décris ton niveau ou ton style sur : ton niveau de bruit au lit. Chiffre sur 10 obligatoire.\",\n  \"Décris ton niveau ou ton style sur : ta capacité à te lâcher vraiment. Chiffre sur 10 obligatoire.\",\n  \"Décris ton niveau ou ton style sur : ton imagination pour surprendre. Chiffre sur 10 obligatoire.\",\n  \"Décris ton niveau ou ton style sur : tes talents pour les retrouvailles. Chiffre sur 10 obligatoire.\",\n  \"Décris ton niveau ou ton style sur : ta patience dans la séduction. Chiffre sur 10 obligatoire.\",\n  \"Décris ton niveau ou ton style sur : ta capacité à oublier un(e) ex. Chiffre sur 10 obligatoire.\",\n  \"Décris ton niveau ou ton style sur : ton courage pour dire non. Chiffre sur 10 obligatoire.\",\n  \"Décris ton niveau ou ton style sur : ton niveau de jalousie. Chiffre sur 10 obligatoire.\",\n  \"Décris ton niveau ou ton style sur : ta capacité à pardonner. Chiffre sur 10 obligatoire.\",\n  \"Décris ton niveau ou ton style sur : ton énergie le matin après une nuit chaude. Chiffre sur 10 obligatoire.\",\n  \"Décris ton niveau ou ton style sur : ta discrétion après un plan. Chiffre sur 10 obligatoire.\",\n  \"Décris ton niveau ou ton style sur : ta sincérité dans les mots doux. Chiffre sur 10 obligatoire.\",\n  \"Décris ton niveau ou ton style sur : ton niveau d'expérience totale. Chiffre sur 10 obligatoire.\",\n  \"Décris ton niveau ou ton style sur : ta capacité à retenir un secret chaud. Chiffre sur 10 obligatoire.\",\n  \"Décris ton niveau ou ton style sur : ton talent pour rendre quelqu'un fou/folle. Chiffre sur 10 obligatoire.\",\n  \"Décris ton niveau ou ton style sur : ta facilité à tomber amoureux(se). Chiffre sur 10 obligatoire.\",\n  \"Décris ton niveau ou ton style sur : ton niveau de fantaisie au lit. Chiffre sur 10 obligatoire.\",\n  \"Décris ton niveau ou ton style sur : ta capacité à transformer un rencard en nuit. Chiffre sur 10 obligatoire.\",\n  \"Décris ton niveau ou ton style sur : ta rapidité à t'attacher. Chiffre sur 10 obligatoire.\",\n  \"Décris ton niveau ou ton style sur : ta force pour résister à un(a) ex. Chiffre sur 10 obligatoire.\",\n  \"Décris ton niveau ou ton style sur : ton talent pour les messages chauds. Chiffre sur 10 obligatoire.\",\n  \"Décris ton niveau ou ton style sur : ta façon de t'habiller pour séduire. Chiffre sur 10 obligatoire.\",\n  \"Décris ton niveau ou ton style sur : ton instinct pour sentir le désir de l'autre. Chiffre sur 10 obligatoire.\",\n  \"Ton record avec les pauses déjeuner chaudes ? Le groupe demande le chiffre.\",\n  \"C'est quoi ton avis sur les vocaux chauds ? Sois honnête.\",\n  \"les draps froissés : oui, non, ou tu rêves ?\",\n  \"Ton record avec les vidéos qui donnent envie ? Le groupe demande le chiffre.\",\n  \"Qu'est-ce qui change avec les chemises ouvertes selon la personne ?\",\n  \"Tu recommencerais avec les morsures légères ? Pourquoi ?\",\n  \"Qu'est-ce qui change avec les hôtels de passage selon la personne ?\",\n  \"As-tu déjà testé les souffles courts ? Raconte.\",\n  \"Qu'est-ce qui change avec les playlists chaudes selon la personne ?\",\n  \"As-tu déjà testé les massages sensuels ? Raconte.\",\n  \"Tu recommencerais avec les plumes et la glace ? Pourquoi ?\",\n  \"C'est quoi ton meilleur souvenir avec les flirts au bureau ?\",\n  \"les caresses lentes : oui, non, ou tu rêves ?\",\n  \"Tu recommencerais avec les cuisines en pleine nuit ? Pourquoi ?\",\n  \"Ton record avec les caresses lentes ? Le groupe demande le chiffre.\",\n  \"Ton pire souvenir avec les tenues sous le manteau ? Raconte.\",\n  \"C'est quoi ton meilleur souvenir avec les morsures légères ?\",\n  \"les câlins de réconciliation : oui, non, ou tu rêves ?\",\n  \"As-tu déjà testé les vidéos qui donnent envie ? Raconte.\",\n  \"Ton pire souvenir avec les lumières tamisées ? Raconte.\",\n  \"Ton record avec les week-ends hors de la ville ? Le groupe demande le chiffre.\",\n  \"As-tu déjà testé les douches à deux ? Raconte.\",\n  \"Qu'est-ce qui change avec les doigts qui glissent selon la personne ?\",\n  \"C'est quoi ton meilleur souvenir avec les hôtels de passage ?\",\n  \"Tu recommencerais avec les lendemains qui chantent ? Pourquoi ?\",\n  \"As-tu déjà testé les plans qui commencent par un massage ? Raconte.\",\n  \"C'est quoi ton avis sur les sextos du soir ? Sois honnête.\",\n  \"C'est quoi ton meilleur souvenir avec les plages la nuit ?\",\n  \"Qu'est-ce qui change avec les gémissements discrets selon la personne ?\",\n  \"Ton record avec les hôtels de passage ? Le groupe demande le chiffre.\",\n  \"Ton record avec les bandeaux sur les yeux ? Le groupe demande le chiffre.\",\n  \"les nuits sans sommeil : oui, non, ou tu rêves ?\",\n  \"Ton pire souvenir avec les miroirs ? Raconte.\",\n  \"As-tu déjà testé les sous-vêtements sexy ? Raconte.\",\n  \"Qu'est-ce qui change avec les morsures légères selon la personne ?\",\n  \"Ton pire souvenir avec les douches à deux ? Raconte.\",\n  \"Ton record avec les câlins de réconciliation ? Le groupe demande le chiffre.\",\n  \"C'est quoi ton meilleur souvenir avec les mots murmurés à l'oreille ?\",\n  \"Ton record avec les chemises ouvertes ? Le groupe demande le chiffre.\",\n  \"C'est quoi ton meilleur souvenir avec les nuits sans sommeil ?\",\n  \"C'est quoi ton avis sur les plages la nuit ? Sois honnête.\",\n  \"Ton pire souvenir avec les caresses lentes ? Raconte.\",\n  \"Ton pire souvenir avec les réveils à 5 h ? Raconte.\",\n  \"Ton record avec les morsures légères ? Le groupe demande le chiffre.\",\n  \"Qu'est-ce qui change avec les vocaux chauds selon la personne ?\",\n  \"les jeux de mains : oui, non, ou tu rêves ?\",\n  \"Qu'est-ce qui change avec les plages la nuit selon la personne ?\",\n  \"Ton pire souvenir avec les câlins de réconciliation ? Raconte.\",\n  \"Qu'est-ce qui change avec les week-ends hors de la ville selon la personne ?\",\n  \"As-tu déjà testé les nuits sans sommeil ? Raconte.\",\n  \"les plans qui commencent par un massage : oui, non, ou tu rêves ?\",\n  \"C'est quoi ton meilleur souvenir avec les dîners qui finissent tôt ?\",\n  \"Ton pire souvenir avec les sièges arrière de voiture ? Raconte.\",\n  \"Qu'est-ce qui change avec les jeux de mains selon la personne ?\",\n  \"Tu recommencerais avec les réveils à 5 h ? Pourquoi ?\",\n  \"les talons au lit : oui, non, ou tu rêves ?\",\n  \"Qu'est-ce qui change avec les nuits sans sommeil selon la personne ?\",\n  \"C'est quoi ton meilleur souvenir avec les doigts qui glissent ?\",\n  \"Ton record avec les vocaux chauds ? Le groupe demande le chiffre.\",\n  \"Qu'est-ce qui change avec les taxis qui s'attardent selon la personne ?\",\n  \"Qu'est-ce qui change avec les vidéos qui donnent envie selon la personne ?\",\n  \"Ton pire souvenir avec les sous-vêtements sexy ? Raconte.\",\n  \"As-tu déjà testé les gémissements discrets ? Raconte.\",\n  \"C'est quoi ton avis sur les douches à deux ? Sois honnête.\",\n  \"As-tu déjà testé les cuisines en pleine nuit ? Raconte.\",\n  \"Tu recommencerais avec les tenues sous le manteau ? Pourquoi ?\",\n  \"Qu'est-ce qui change avec les massages sensuels selon la personne ?\",\n  \"Qu'est-ce qui change avec les miroirs selon la personne ?\",\n  \"Ton pire souvenir avec les flirts au bureau ? Raconte.\",\n  \"Ton record avec les réveils à 5 h ? Le groupe demande le chiffre.\",\n  \"Qu'est-ce qui change avec les silences qui disent tout selon la personne ?\",\n  \"Ton record avec les baisers dans le dos ? Le groupe demande le chiffre.\",\n  \"Qu'est-ce qui change avec les lendemains qui chantent selon la personne ?\",\n  \"Tu recommencerais avec les sextos du soir ? Pourquoi ?\",\n  \"Qu'est-ce qui change avec les tenues sous le manteau selon la personne ?\",\n  \"Ton record avec les photos prises au bon angle ? Le groupe demande le chiffre.\",\n  \"As-tu déjà testé les réveils à 5 h ? Raconte.\",\n  \"C'est quoi ton meilleur souvenir avec les lits trop petits ?\",\n  \"Tu recommencerais avec les bandeaux sur les yeux ? Pourquoi ?\",\n  \"C'est quoi ton avis sur les préliminaires longs ? Sois honnête.\",\n  \"Ton pire souvenir avec les cuisines en pleine nuit ? Raconte.\",\n  \"C'est quoi ton avis sur les morsures légères ? Sois honnête.\",\n  \"Ton record avec les nudes assumés ? Le groupe demande le chiffre.\",\n  \"les lits trop petits : oui, non, ou tu rêves ?\",\n  \"C'est quoi ton avis sur les cuisines en pleine nuit ? Sois honnête.\",\n  \"Tu recommencerais avec les jambes qui tremblent ? Pourquoi ?\",\n  \"C'est quoi ton meilleur souvenir avec les préliminaires longs ?\",\n  \"As-tu déjà testé les chemises ouvertes ? Raconte.\",\n  \"As-tu déjà testé les plages la nuit ? Raconte.\",\n  \"C'est quoi ton avis sur les balcons en plein air ? Sois honnête.\",\n  \"Ton record avec les plages la nuit ? Le groupe demande le chiffre.\",\n  \"Ton record avec les doigts qui glissent ? Le groupe demande le chiffre.\",\n  \"As-tu déjà testé les positions contre le mur ? Raconte.\",\n  \"Ton pire souvenir avec les regards interdits ? Raconte.\",\n  \"Ton record avec les fuites du matin ? Le groupe demande le chiffre.\",\n  \"As-tu déjà testé les regards interdits ? Raconte.\",\n  \"les lumières tamisées : oui, non, ou tu rêves ?\",\n  \"Ton pire souvenir avec les week-ends hors de la ville ? Raconte.\",\n  \"Ton pire souvenir avec les hôtels de passage ? Raconte.\",\n  \"C'est quoi ton avis sur les cravates ? Sois honnête.\",\n  \"Ton record avec les douches à deux ? Le groupe demande le chiffre.\",\n  \"Ton pire souvenir avec les taxis qui s'attardent ? Raconte.\",\n  \"Tu recommencerais avec les week-ends hors de la ville ? Pourquoi ?\",\n  \"les gémissements discrets : oui, non, ou tu rêves ?\",\n  \"C'est quoi ton avis sur les plans qui commencent par un massage ? Sois honnête.\",\n  \"Qu'est-ce qui change avec les sous-vêtements sexy selon la personne ?\",\n  \"C'est quoi ton meilleur souvenir avec les pauses déjeuner chaudes ?\",\n  \"Ton record avec les talons au lit ? Le groupe demande le chiffre.\",\n  \"C'est quoi ton avis sur les plumes et la glace ? Sois honnête.\",\n  \"C'est quoi ton meilleur souvenir avec les playlists chaudes ?\",\n  \"C'est quoi ton avis sur les positions contre le mur ? Sois honnête.\",\n  \"Tu recommencerais avec les nudes assumés ? Pourquoi ?\",\n  \"As-tu déjà testé les lumières tamisées ? Raconte.\",\n  \"Tu recommencerais avec les plans qui commencent par un massage ? Pourquoi ?\",\n  \"Ton pire souvenir avec les disputes qui finissent au lit ? Raconte.\",\n  \"Ton record avec les draps froissés ? Le groupe demande le chiffre.\",\n  \"As-tu déjà testé les baisers dans le dos ? Raconte.\",\n  \"Qu'est-ce qui change avec les sièges arrière de voiture selon la personne ?\",\n  \"Ton record avec les taxis qui s'attardent ? Le groupe demande le chiffre.\",\n  \"Qu'est-ce qui change avec les pauses déjeuner chaudes selon la personne ?\",\n  \"C'est quoi ton avis sur les miroirs ? Sois honnête.\",\n  \"les sous-vêtements sexy : oui, non, ou tu rêves ?\",\n  \"Ton pire souvenir avec les chemises ouvertes ? Raconte.\",\n  \"C'est quoi ton avis sur les nuits sans sommeil ? Sois honnête.\",\n  \"Qu'est-ce qui change avec les photos prises au bon angle selon la personne ?\",\n  \"Ton record avec les cravates ? Le groupe demande le chiffre.\",\n  \"les salles de bain embuées : oui, non, ou tu rêves ?\",\n  \"les lendemains qui chantent : oui, non, ou tu rêves ?\",\n  \"Ton pire souvenir avec les lits trop petits ? Raconte.\",\n  \"C'est quoi ton avis sur les photos prises au bon angle ? Sois honnête.\",\n  \"Ton record avec les préliminaires longs ? Le groupe demande le chiffre.\",\n  \"C'est quoi ton avis sur les playlists chaudes ? Sois honnête.\",\n  \"Ton pire souvenir avec les préliminaires longs ? Raconte.\",\n  \"Ton record avec les massages sensuels ? Le groupe demande le chiffre.\",\n  \"C'est quoi ton avis sur les regards interdits ? Sois honnête.\",\n  \"Tu recommencerais avec les douches à deux ? Pourquoi ?\",\n  \"Qu'est-ce qui change avec les lits trop petits selon la personne ?\",\n  \"Qu'est-ce qui change avec les regards interdits selon la personne ?\",\n  \"C'est quoi ton avis sur les draps froissés ? Sois honnête.\",\n  \"les tenues sous le manteau : oui, non, ou tu rêves ?\",\n  \"les douches à deux : oui, non, ou tu rêves ?\",\n  \"As-tu déjà testé les balcons en plein air ? Raconte.\",\n  \"Ton pire souvenir avec les talons au lit ? Raconte.\",\n  \"C'est quoi ton avis sur les sièges arrière de voiture ? Sois honnête.\",\n  \"Qu'est-ce qui change avec les cuisines en pleine nuit selon la personne ?\",\n  \"Tu recommencerais avec les massages sensuels ? Pourquoi ?\",\n  \"les jambes qui tremblent : oui, non, ou tu rêves ?\",\n  \"les cravates : oui, non, ou tu rêves ?\",\n  \"Tu recommencerais avec les sièges arrière de voiture ? Pourquoi ?\",\n  \"C'est quoi ton meilleur souvenir avec les sous-vêtements sexy ?\",\n  \"C'est quoi ton meilleur souvenir avec les regards interdits ?\",\n  \"Ton pire souvenir avec les pauses déjeuner chaudes ? Raconte.\",\n  \"C'est quoi ton meilleur souvenir avec les lendemains qui chantent ?\",\n  \"Ton record avec les plumes et la glace ? Le groupe demande le chiffre.\",\n  \"C'est quoi ton meilleur souvenir avec les chemises ouvertes ?\",\n  \"les baisers dans le dos : oui, non, ou tu rêves ?\",\n  \"Tu recommencerais avec les talons au lit ? Pourquoi ?\",\n  \"Tu recommencerais avec les caresses lentes ? Pourquoi ?\",\n  \"Ton pire souvenir avec les lendemains qui chantent ? Raconte.\",\n  \"Qu'est-ce qui change avec les positions contre le mur selon la personne ?\",\n  \"Ton pire souvenir avec les massages sensuels ? Raconte.\",\n  \"As-tu déjà testé les lendemains qui chantent ? Raconte.\",\n  \"les nudes assumés : oui, non, ou tu rêves ?\",\n  \"Ton pire souvenir avec les sextos du soir ? Raconte.\",\n  \"Qu'est-ce qui change avec les dîners qui finissent tôt selon la personne ?\",\n  \"Ton record avec les miroirs ? Le groupe demande le chiffre.\",\n  \"C'est quoi ton avis sur les vidéos qui donnent envie ? Sois honnête.\",\n  \"As-tu déjà testé les nudes assumés ? Raconte.\",\n  \"Tu recommencerais avec les mots murmurés à l'oreille ? Pourquoi ?\",\n  \"C'est quoi ton avis sur les mots murmurés à l'oreille ? Sois honnête.\",\n  \"As-tu déjà testé les jambes qui tremblent ? Raconte.\",\n  \"C'est quoi ton avis sur les pauses déjeuner chaudes ? Sois honnête.\",\n  \"As-tu déjà testé les hôtels de passage ? Raconte.\",\n  \"Ton pire souvenir avec les nuits sans sommeil ? Raconte.\",\n  \"Qu'est-ce qui change avec les bandeaux sur les yeux selon la personne ?\",\n  \"As-tu déjà testé les miroirs ? Raconte.\",\n  \"As-tu déjà testé les morsures légères ? Raconte.\",\n  \"Qu'est-ce qui change avec les plans qui commencent par un massage selon la personne ?\",\n  \"Qu'est-ce qui change avec les préliminaires longs selon la personne ?\",\n  \"C'est quoi ton meilleur souvenir avec les tenues sous le manteau ?\",\n  \"C'est quoi ton meilleur souvenir avec les massages sensuels ?\",\n  \"C'est quoi ton meilleur souvenir avec les miroirs ?\",\n  \"Qu'est-ce qui change avec les sextos du soir selon la personne ?\",\n  \"As-tu déjà testé les sextos du soir ? Raconte.\",\n  \"les massages sensuels : oui, non, ou tu rêves ?\",\n  \"Ton pire souvenir avec les bandeaux sur les yeux ? Raconte.\",\n  \"Ton record avec les positions contre le mur ? Le groupe demande le chiffre.\",\n  \"Ton record avec les gémissements discrets ? Le groupe demande le chiffre.\",\n  \"Qu'est-ce qui change avec les mots murmurés à l'oreille selon la personne ?\",\n  \"Ton pire souvenir avec les draps froissés ? Raconte.\",\n  \"les mots murmurés à l'oreille : oui, non, ou tu rêves ?\",\n  \"Tu recommencerais avec les regards interdits ? Pourquoi ?\",\n  \"les réveils à 5 h : oui, non, ou tu rêves ?\",\n  \"As-tu déjà testé les fuites du matin ? Raconte.\",\n  \"Qu'est-ce qui change avec les baisers dans le dos selon la personne ?\",\n  \"C'est quoi ton meilleur souvenir avec les fuites du matin ?\",\n  \"As-tu déjà testé les câlins de réconciliation ? Raconte.\",\n  \"Qu'est-ce qui change avec les cravates selon la personne ?\",\n  \"As-tu déjà testé les playlists chaudes ? Raconte.\",\n  \"C'est quoi ton meilleur souvenir avec les gémissements discrets ?\",\n  \"Qu'est-ce qui change avec les lumières tamisées selon la personne ?\",\n  \"les plumes et la glace : oui, non, ou tu rêves ?\",\n  \"C'est quoi ton meilleur souvenir avec les sextos du soir ?\",\n  \"Ton record avec les jambes qui tremblent ? Le groupe demande le chiffre.\",\n  \"As-tu déjà testé les taxis qui s'attardent ? Raconte.\",\n  \"Qu'est-ce qui change avec les câlins de réconciliation selon la personne ?\",\n  \"les hôtels de passage : oui, non, ou tu rêves ?\",\n  \"Tu recommencerais avec les salles de bain embuées ? Pourquoi ?\",\n  \"C'est quoi ton meilleur souvenir avec les cravates ?\",\n  \"les positions contre le mur : oui, non, ou tu rêves ?\",\n  \"C'est quoi ton avis sur les flirts au bureau ? Sois honnête.\"\n],\n    action: [\n  \"Fais un strip-tease d'UN seul vêtement. Les chaussettes ne comptent pas.\",\n  \"Envoie un message très chaud à ton crush maintenant.\",\n  \"Raconte ta dernière nuit chaude comme un conte de fées.\",\n  \"Mime (sans mots) ta position préférée. Le groupe doit deviner.\",\n  \"Envoie un vocal où tu gémis le mot « encore » de façon théâtrale.\",\n  \"Fais un compliment salé à chaque joueur, un par un.\",\n  \"Danse comme dans un clip, mode séduction activée.\",\n  \"Imite ton meilleur regard « invitation au péché ».\",\n  \"Envoie un selfie « bonne nuit » sous ta plus belle lumière au joueur de ton choix.\",\n  \"Chante un couplet transformé en déclaration très hot adressée à un joueur.\",\n  \"Fais un slow très rapproché avec ta caméra.\",\n  \"Suce un glaçon en regardant la caméra, 10 secondes.\",\n  \"Lèche ton doigt lentement en fixant la caméra.\",\n  \"Mime un baiser très lent à la caméra. 10 secondes.\",\n  \"Décris ce que tu portes comme sous-vêtements sans les montrer.\",\n  \"Fais deviner ton niveau de bruit au lit en l'imitant 5 secondes.\",\n  \"Raconte ta pire galère de déshabillage en imitant les gestes.\",\n  \"Montre la dernière photo que tu as envoyée à ton crush (défilement de la galerie interdit).\",\n  \"Écris ici un sexto de 2 lignes. Le groupe note.\",\n  \"Fais un massage imaginaire complet de la personne en face, mimes inclus.\",\n  \"Mime comment tu embrasses dans le cou (avec ton pouce).\",\n  \"Décris ton corps préféré chez l'autre en le montrant sur toi.\",\n  \"Fais 20 secondes de look « j'attends quelque chose ».\",\n  \"Imite ton bruit de lit le plus discret puis le plus bruyant.\",\n  \"Envoie un message au joueur de ton choix : « si j'étais là, je ferais quoi ? ».\",\n  \"Montre comment tu montes les escaliers quand tu es en mode séduction.\",\n  \"Imite ta réaction quand la musique s'arrête en pleine action.\",\n  \"Décris ta plus longue nuit en 30 secondes chrono.\",\n  \"Mime la position où tu dors quand tu n'es pas seul(e).\",\n  \"Fais deviner un mot chaud par dessin ou par mime. Le groupe a 3 essais.\",\n  \"Envoie un vocal où tu chuchotes ce que tu ferais ce soir si tu n'étais pas seul(e).\",\n  \"Montre ton meilleur regard puis ton pire regard. Différence nette exigée.\",\n  \"Décris ta dernière envie secrète en regardant la caméra.\",\n  \"Mime comment tu enlèves une chemise mouillée.\",\n  \"Fais deviner ta position préférée en 3 mots seulement.\",\n  \"Envoie un emoji qui décrit ta nuit idéale à chaque joueur.\",\n  \"Raconte ta plus belle nuit comme un commentaire de match final.\",\n  \"Imite le moment où tu hésites devant le lit de quelqu'un.\",\n  \"Montre comment tu embrasses (version main) : rapide, lent, sauvage. 3 versions.\",\n  \"Fais une présentation de 15 secondes de ta « maison de l'amour » (ta chambre).\",\n  \"Envoie un vocal où tu répètes « je ne dirai jamais ça » de façon de plus en moins convaincue.\",\n  \"Mime ta plus grande panne sèche de séduction.\",\n  \"Décris le meilleur compliment que tu voudrais recevoir ce soir.\",\n  \"Imite ta réaction si le groupe choisissait ta photo de profil pendant 24 h.\",\n  \"Fais deviner un lieu chaud par mime uniquement.\",\n  \"Raconte ta soirée idéale en mode bande-annonce de film.\",\n  \"Montre ta meilleure imitation de quelqu'un qui refuse puis qui cède.\",\n  \"Envoie un message poétique mais chaud au joueur le plus calme.\",\n  \"Imite le silence gênant après une phrase trop osée.\",\n  \"Décris ta tenue de nuit idéale pour ce soir, mimes compris.\",\n  \"Envoie un vocal où tu gémis très doucement deux fois. 15 secondes maximum.\",\n  \"Envoie un vocal où tu chuchotes « je pense à toi » d'une voix qui donne envie. 15 secondes maximum.\",\n  \"Envoie un vocal où tu racontes ce que tu portes en ce moment. 15 secondes maximum.\",\n  \"Envoie un vocal où tu fais un rire qui finit en soupir chaud. 15 secondes maximum.\",\n  \"Envoie un vocal où tu dis « encore » comme dans un film. 15 secondes maximum.\",\n  \"Envoie un vocal où tu chuchotes un compliment salé. 15 secondes maximum.\",\n  \"Envoie un vocal où tu imites ton meilleur bruit de baiser. 15 secondes maximum.\",\n  \"Envoie un vocal où tu fais deviner ta position par un seul son. 15 secondes maximum.\",\n  \"Envoie un vocal où tu dis « je rentre chez toi maintenant » comme une menace adorable. 15 secondes maximum.\",\n  \"Envoie un vocal où tu chuchotes la première chose que tu ferais à côté de la personne. 15 secondes maximum.\",\n  \"Envoie un vocal où tu imites ton rire du lendemain matin. 15 secondes maximum.\",\n  \"Envoie un vocal où tu fais une déclaration entière d'une voix de séduction. 15 secondes maximum.\",\n  \"Envoie un vocal où tu dis « je suis ton/ta fan numéro un » en mode star. 15 secondes maximum.\",\n  \"Envoie un vocal où tu chuchotes un mot sale (un seul). 15 secondes maximum.\",\n  \"Envoie un vocal où tu fais un décompte de 5 à 1 en voix basse. 15 secondes maximum.\",\n  \"Envoie un vocal où tu imites le souffle du tout début des préliminaires. 15 secondes maximum.\",\n  \"Envoie un vocal où tu dis « monte » comme dans un film d'action romantique. 15 secondes maximum.\",\n  \"Envoie un vocal où tu racontes ta dernière envie en 3 mots. 15 secondes maximum.\",\n  \"Envoie un vocal où tu fais deviner un lieu chaud par ton seul ton. 15 secondes maximum.\",\n  \"Envoie un vocal où tu chuchotes le prénom d'un joueur comme si tu dormais. 15 secondes maximum.\",\n  \"Envoie un vocal où tu dis « ça va trop vite là » avec ton plus beau soupir. 15 secondes maximum.\",\n  \"Envoie un vocal où tu imites un appel du matin : « j'arrive dans 10 minutes ». 15 secondes maximum.\",\n  \"Envoie un vocal où tu fais une blague qui tourne en phrase chaude. 15 secondes maximum.\",\n  \"Envoie un vocal où tu dis « je garde ça pour ce soir » en riant. 15 secondes maximum.\",\n  \"Envoie un vocal où tu chuchotes ta promesse la plus folle. 15 secondes maximum.\",\n  \"Envoie un vocal où tu imites le répondeur de ton plan préféré. 15 secondes maximum.\",\n  \"Envoie un vocal où tu dis « ferme les yeux » et compte jusqu'à 10. 15 secondes maximum.\",\n  \"Envoie un vocal où tu racontes une nuit entière en 15 secondes chrono. 15 secondes maximum.\",\n  \"Envoie un vocal où tu fais deviner ton humeur par un seul gémissement. 15 secondes maximum.\",\n  \"Envoie un vocal où tu dis « mon tour » comme dans un jeu de carte chaud. 15 secondes maximum.\",\n  \"Envoie un vocal où tu imites un regard qui parle (version sonore). 15 secondes maximum.\",\n  \"Envoie un vocal où tu chuchotes « personne ne saura ». 15 secondes maximum.\",\n  \"Envoie un vocal où tu fais la promo de ta nuit en 3 phrases. 15 secondes maximum.\",\n  \"Envoie un vocal où tu dis « tu me manques déjà » de 3 façons. 15 secondes maximum.\",\n  \"Envoie un vocal où tu imites une mère qui surprend un appel chaud. 15 secondes maximum.\",\n  \"Montre ou mime comment tu embrasses vraiment (version main ou coussin) à la caméra. 15 secondes.\",\n  \"Montre ou mime ta façon de danser très près de quelqu'un à la caméra. 15 secondes.\",\n  \"Montre ou mime comment tu enlèves ton t-shirt les yeux fermés à la caméra. 15 secondes.\",\n  \"Montre ou mime le regard que tu fais avant d'embrasser à la caméra. 15 secondes.\",\n  \"Montre ou mime comment tu te déplaces dans ta chambre le soir à la caméra. 15 secondes.\",\n  \"Montre ou mime ta pose préférée dans un lit à la caméra. 15 secondes.\",\n  \"Montre ou mime comment tu montres ton côté sauvage en 3 gestes à la caméra. 15 secondes.\",\n  \"Montre ou mime ta façon de retirer une ceinture à la caméra. 15 secondes.\",\n  \"Montre ou mime comment tu hésites avant un premier bisou à la caméra. 15 secondes.\",\n  \"Montre ou mime le geste que tu fais quand c'est trop bon à la caméra. 15 secondes.\",\n  \"Montre ou mime comment tu te réveilles dans les bras de quelqu'un à la caméra. 15 secondes.\",\n  \"Montre ou mime ta façon d'inviter quelqu'un à s'approcher à la caméra. 15 secondes.\",\n  \"Montre ou mime comment tu enlèves les cheveux de ton épaule à la caméra. 15 secondes.\",\n  \"Montre ou mime ta version du « chut » à la caméra. 15 secondes.\",\n  \"Montre ou mime comment tu enlèves tes chaussures en dansant à la caméra. 15 secondes.\",\n  \"Montre ou mime ton pas de porte de séduction à la caméra. 15 secondes.\",\n  \"Montre ou mime comment tu fais pour qu'on te regarde à la caméra. 15 secondes.\",\n  \"Montre ou mime ta façon de te lever d'un canapé avec style à la caméra. 15 secondes.\",\n  \"Montre ou mime le regard du lendemain matin au réveil à la caméra. 15 secondes.\",\n  \"Montre ou mime comment tu fais confiance : main tendue, yeux fermés à la caméra. 15 secondes.\",\n  \"Montre ou mime ta façon d'embrasser le front (version coussin) à la caméra. 15 secondes.\",\n  \"Montre ou mime le mouvement que tu fais quand la musique est parfaite à la caméra. 15 secondes.\",\n  \"Montre ou mime comment tu t'allonges quand tu es fatigué(e) mais pas endormi(e) à la caméra. 15 secondes.\",\n  \"Montre ou mime ta façon de murmurer à l'oreille (version mimes) à la caméra. 15 secondes.\",\n  \"Montre ou mime comment tu joues avec ta bouche quand tu réfléchis à la caméra. 15 secondes.\",\n  \"Montre ou mime ton geste quand tu entends « viens » à la caméra. 15 secondes.\",\n  \"Montre ou mime comment tu montres que tu es d'accord sans parler à la caméra. 15 secondes.\",\n  \"Montre ou mime ta façon de te retourner en dansant à la caméra. 15 secondes.\",\n  \"Montre ou mime le geste du dernier regard avant d'éteindre la lumière à la caméra. 15 secondes.\",\n  \"Montre ou mime comment tu enlèves un pull trop chaud à la caméra. 15 secondes.\",\n  \"Montre ou mime ta façon d'attendre devant une porte fermée à la caméra. 15 secondes.\",\n  \"Montre ou mime comment tu salues quelqu'un que tu désires à la caméra. 15 secondes.\",\n  \"Montre ou mime le miroir du matin : ta pose de check rapide à la caméra. 15 secondes.\",\n  \"Montre ou mime ta façon de vous asseoir très près à la caméra. 15 secondes.\",\n  \"Montre ou mime comment tu manges une fraise de manière classique à la caméra. 15 secondes.\",\n  \"Écris ici, en public : un sexto de 2 lignes. Le groupe note sur 10.\",\n  \"Écris ici, en public : le message que tu n'as jamais osé envoyer. Le groupe note sur 10.\",\n  \"Écris ici, en public : ta déclaration la plus chaude en 1 phrase. Le groupe note sur 10.\",\n  \"Écris ici, en public : ce que tu ferais ce soir si tu n'étais pas seul(e). Le groupe note sur 10.\",\n  \"Écris ici, en public : le compliment le plus chaud sur le joueur de ton choix. Le groupe note sur 10.\",\n  \"Écris ici, en public : le mot sale qui t'excite le plus. Le groupe note sur 10.\",\n  \"Écris ici, en public : la phrase que tu voudrais entendre à l'oreille. Le groupe note sur 10.\",\n  \"Écris ici, en public : ta promesse de la nuit en 10 mots. Le groupe note sur 10.\",\n  \"Écris ici, en public : le message que tu enverrais à ton crush maintenant. Le groupe note sur 10.\",\n  \"Écris ici, en public : la description de ta tenue de nuit idéale. Le groupe note sur 10.\",\n  \"Écris ici, en public : le surnom chaud que tu donnes à ton/ta partenaire. Le groupe note sur 10.\",\n  \"Écris ici, en public : ta phrase d'accroche parfaite pour draguer. Le groupe note sur 10.\",\n  \"Écris ici, en public : le dernier sexto que tu as vraiment envoyé. Le groupe note sur 10.\",\n  \"Écris ici, en public : la phrase qui te fait craquer tout de suite. Le groupe note sur 10.\",\n  \"Écris ici, en public : ton idée de nuit parfaite en 3 étapes. Le groupe note sur 10.\",\n  \"Écris ici, en public : le compliment physique que tu voudrais recevoir. Le groupe note sur 10.\",\n  \"Écris ici, en public : le message du matin parfait. Le groupe note sur 10.\",\n  \"Écris ici, en public : la phrase de fin de nuit parfaite. Le groupe note sur 10.\",\n  \"Écris ici, en public : ton record de mots chauds en une phrase. Le groupe note sur 10.\",\n  \"Écris ici, en public : le message que ton ex t'a envoyé et que tu as gardé. Le groupe note sur 10.\",\n  \"Écris ici, en public : la déclaration que tu ferais en public sans honte. Le groupe note sur 10.\",\n  \"Écris ici, en public : le mot qui décrit ton niveau ce soir. Le groupe note sur 10.\",\n  \"Écris ici, en public : la phrase que tu ne diras jamais à tes parents. Le groupe note sur 10.\",\n  \"Écris ici, en public : ton plus beau mensonge de séduction (pour rire). Le groupe note sur 10.\",\n  \"Écris ici, en public : la phrase pour sauver une soirée ratée. Le groupe note sur 10.\",\n  \"Écris ici, en public : le compliment sur la voix du joueur à ta gauche. Le groupe note sur 10.\",\n  \"Écris ici, en public : la phrase d'excuse après un bisou volé. Le groupe note sur 10.\",\n  \"Écris ici, en public : le message qui fait répondre en 3 secondes. Le groupe note sur 10.\",\n  \"Écris ici, en public : la phrase de rappel à 2 h du matin. Le groupe note sur 10.\",\n  \"Écris ici, en public : ta définition de l'amour en une ligne chaude. Le groupe note sur 10.\",\n  \"Fais deviner ta position préférée au groupe. 3 essais, mimes autorisés.\",\n  \"Fais deviner ton lieu chaud de rêve au groupe. 3 essais, mimes autorisés.\",\n  \"Fais deviner ton bruit de lit signature au groupe. 3 essais, mimes autorisés.\",\n  \"Fais deviner ton meilleur geste de séduction au groupe. 3 essais, mimes autorisés.\",\n  \"Fais deviner le mot que tu dis trop souvent au lit au groupe. 3 essais, mimes autorisés.\",\n  \"Fais deviner la chanson qui te met d'humeur au groupe. 3 essais, mimes autorisés.\",\n  \"Fais deviner le vêtement que tu préfères voir tomber au groupe. 3 essais, mimes autorisés.\",\n  \"Fais deviner ta soirée parfaite en 3 scènes au groupe. 3 essais, mimes autorisés.\",\n  \"Fais deviner ton niveau de jalousie au groupe. 3 essais, mimes autorisés.\",\n  \"Fais deviner ton plus grand fantasme (version tout public) au groupe. 3 essais, mimes autorisés.\",\n  \"Fais deviner le lieu le plus osé où tu as été au groupe. 3 essais, mimes autorisés.\",\n  \"Fais deviner la chose que tu ne feras jamais au groupe. 3 essais, mimes autorisés.\",\n  \"Fais deviner ta plus grande panne de séduction au groupe. 3 essais, mimes autorisés.\",\n  \"Fais deviner ton style : doux, joueur ou sauvage au groupe. 3 essais, mimes autorisés.\",\n  \"Fais deviner le compliment qui marche toujours avec toi au groupe. 3 essais, mimes autorisés.\",\n  \"Fais deviner ta durée parfaite de préliminaires au groupe. 3 essais, mimes autorisés.\",\n  \"Fais deviner ton énergie ce soir sur 10 au groupe. 3 essais, mimes autorisés.\",\n  \"Fais deviner la position que tu ne testeras jamais au groupe. 3 essais, mimes autorisés.\",\n  \"Fais deviner ton record de rounds au groupe. 3 essais, mimes autorisés.\",\n  \"Fais deviner la personne d'ici que tu trouves la plus chaude (mime son initiale) au groupe. 3 essais, mimes autorisés.\",\n  \"Fais deviner ton pire après-amour au groupe. 3 essais, mimes autorisés.\",\n  \"Fais deviner le mot qui te fait fondre au groupe. 3 essais, mimes autorisés.\",\n  \"Fais deviner ton préliminaire préféré au groupe. 3 essais, mimes autorisés.\",\n  \"Fais deviner ton vêtement de séduction préféré au groupe. 3 essais, mimes autorisés.\",\n  \"Fais deviner le bruit que fait ton lit au groupe. 3 essais, mimes autorisés.\",\n  \"Fais deviner ton regard signature au groupe. 3 essais, mimes autorisés.\",\n  \"Fais deviner la chanson de ton dernier slow au groupe. 3 essais, mimes autorisés.\",\n  \"Fais deviner ta plus grosse honte chaude au groupe. 3 essais, mimes autorisés.\",\n  \"Fais deviner le moment où tu as dit oui trop vite au groupe. 3 essais, mimes autorisés.\",\n  \"Fais deviner le cadeau qui te fait craquer au groupe. 3 essais, mimes autorisés.\",\n  \"Décris en détail, à voix haute : ta meilleure nuit (sans les noms). 20 secondes.\",\n  \"Décris en détail, à voix haute : ton premier baiser complet. 20 secondes.\",\n  \"Décris en détail, à voix haute : ta douche préférée de ta vie. 20 secondes.\",\n  \"Décris en détail, à voix haute : la tenue que tu portes maintenant. 20 secondes.\",\n  \"Décris en détail, à voix haute : ton dernier rêve chaud. 20 secondes.\",\n  \"Décris en détail, à voix haute : la personne la plus attirante que tu aies croisée. 20 secondes.\",\n  \"Décris en détail, à voix haute : ta soirée de rêve si tout était permis. 20 secondes.\",\n  \"Décris en détail, à voix haute : le lit parfait selon toi. 20 secondes.\",\n  \"Décris en détail, à voix haute : ton lieu chaud préféré. 20 secondes.\",\n  \"Décris en détail, à voix haute : ton rituel avant de dormir. 20 secondes.\",\n  \"Décris en détail, à voix haute : ta façon de séduire, étape par étape. 20 secondes.\",\n  \"Décris en détail, à voix haute : la dernière fois que tu as trop osé. 20 secondes.\",\n  \"Décris en détail, à voix haute : le massage parfait selon toi. 20 secondes.\",\n  \"Décris en détail, à voix haute : ton réveil idéal avec quelqu'un. 20 secondes.\",\n  \"Décris en détail, à voix haute : la voix qui te fait craquer. 20 secondes.\",\n  \"Décris en détail, à voix haute : le parfum qui te rend fou/folle. 20 secondes.\",\n  \"Décris en détail, à voix haute : ton dernier fou rire intime. 20 secondes.\",\n  \"Décris en détail, à voix haute : ton plus beau câlin de ta vie. 20 secondes.\",\n  \"Décris en détail, à voix haute : la nuit que tu referais sans changer un détail. 20 secondes.\",\n  \"Décris en détail, à voix haute : ta plus belle erreur qui a fini très bien. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les sextos du soir. 20 secondes.\",\n  \"Décris les sextos du soir comme un commentateur sportif. 20 secondes.\",\n  \"Explique les playlists chaudes comme une notice de montage. 20 secondes.\",\n  \"Décris les talons au lit comme un commentateur sportif. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les lumières tamisées. 20 secondes.\",\n  \"Montre le geste parfait pour les chemises ouvertes. 10 secondes.\",\n  \"Explique les lendemains qui chantent comme une notice de montage. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les morsures légères. Le groupe devine.\",\n  \"Raconte ton meilleur souvenir avec les salles de bain embuées. 20 secondes.\",\n  \"Montre le geste parfait pour les playlists chaudes. 10 secondes.\",\n  \"Montre le geste parfait pour les miroirs. 10 secondes.\",\n  \"Explique les miroirs comme une notice de montage. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les flirts au bureau. Slogan obligatoire.\",\n  \"Raconte ton meilleur souvenir avec les disputes qui finissent au lit. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les jeux de mains. Slogan obligatoire.\",\n  \"Montre le geste parfait pour les douches à deux. 10 secondes.\",\n  \"Raconte ton meilleur souvenir avec les sous-vêtements sexy. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les souffles courts. Le groupe devine.\",\n  \"Imite quelqu'un qui découvre les cuisines en pleine nuit. Le groupe devine.\",\n  \"Imite quelqu'un qui découvre les jambes qui tremblent. Le groupe devine.\",\n  \"Raconte ton meilleur souvenir avec les silences qui disent tout. 20 secondes.\",\n  \"Explique les chemises ouvertes comme une notice de montage. 20 secondes.\",\n  \"Explique les fuites du matin comme une notice de montage. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les jambes qui tremblent. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les préliminaires longs. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les souffles courts. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les massages sensuels. 20 secondes.\",\n  \"Explique les balcons en plein air comme une notice de montage. 20 secondes.\",\n  \"Décris les hôtels de passage comme un commentateur sportif. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les fuites du matin. Slogan obligatoire.\",\n  \"Montre le geste parfait pour les morsures légères. 10 secondes.\",\n  \"Mime ta plus belle scène avec les sextos du soir. 15 secondes.\",\n  \"Fais une pub de 15 secondes pour les lumières tamisées. Slogan obligatoire.\",\n  \"Raconte ton meilleur souvenir avec les plans qui commencent par un massage. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les balcons en plein air. Le groupe devine.\",\n  \"Mime ta plus belle scène avec les plumes et la glace. 15 secondes.\",\n  \"Fais une pub de 15 secondes pour les tenues sous le manteau. Slogan obligatoire.\",\n  \"Montre le geste parfait pour les bandeaux sur les yeux. 10 secondes.\",\n  \"Mime ta plus belle scène avec les plages la nuit. 15 secondes.\",\n  \"Montre le geste parfait pour les salles de bain embuées. 10 secondes.\",\n  \"Décris les préliminaires longs comme un commentateur sportif. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les lits trop petits. Slogan obligatoire.\",\n  \"Fais deviner les jambes qui tremblent en 3 mimes maximum.\",\n  \"Montre le geste parfait pour les mots murmurés à l'oreille. 10 secondes.\",\n  \"Fais deviner les baisers dans le dos en 3 mimes maximum.\",\n  \"Décris les doigts qui glissent comme un commentateur sportif. 20 secondes.\",\n  \"Montre le geste parfait pour les photos prises au bon angle. 10 secondes.\",\n  \"Fais deviner les vidéos qui donnent envie en 3 mimes maximum.\",\n  \"Décris les nuits sans sommeil comme un commentateur sportif. 20 secondes.\",\n  \"Mime ta plus belle scène avec les gémissements discrets. 15 secondes.\",\n  \"Raconte ton meilleur souvenir avec les week-ends hors de la ville. 20 secondes.\",\n  \"Décris les plumes et la glace comme un commentateur sportif. 20 secondes.\",\n  \"Mime ta plus belle scène avec les jeux de mains. 15 secondes.\",\n  \"Explique les morsures légères comme une notice de montage. 20 secondes.\",\n  \"Fais deviner les plans qui commencent par un massage en 3 mimes maximum.\",\n  \"Mime ta plus belle scène avec les lendemains qui chantent. 15 secondes.\",\n  \"Raconte ton meilleur souvenir avec les fuites du matin. 20 secondes.\",\n  \"Montre le geste parfait pour les vocaux chauds. 10 secondes.\",\n  \"Fais deviner les caresses lentes en 3 mimes maximum.\",\n  \"Raconte ton meilleur souvenir avec les morsures légères. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les dîners qui finissent tôt. Le groupe devine.\",\n  \"Montre le geste parfait pour les week-ends hors de la ville. 10 secondes.\",\n  \"Montre le geste parfait pour les nuits sans sommeil. 10 secondes.\",\n  \"Montre le geste parfait pour les souffles courts. 10 secondes.\",\n  \"Imite quelqu'un qui découvre les chemises ouvertes. Le groupe devine.\",\n  \"Raconte ton meilleur souvenir avec les bandeaux sur les yeux. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les plumes et la glace. Le groupe devine.\",\n  \"Raconte ton meilleur souvenir avec les playlists chaudes. 20 secondes.\",\n  \"Décris les dîners qui finissent tôt comme un commentateur sportif. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les plans qui commencent par un massage. Slogan obligatoire.\",\n  \"Fais une pub de 15 secondes pour les cuisines en pleine nuit. Slogan obligatoire.\",\n  \"Explique les dîners qui finissent tôt comme une notice de montage. 20 secondes.\",\n  \"Montre le geste parfait pour les pauses déjeuner chaudes. 10 secondes.\",\n  \"Mime ta plus belle scène avec les photos prises au bon angle. 15 secondes.\",\n  \"Décris les sous-vêtements sexy comme un commentateur sportif. 20 secondes.\",\n  \"Fais deviner les cravates en 3 mimes maximum.\",\n  \"Mime ta plus belle scène avec les préliminaires longs. 15 secondes.\",\n  \"Mime ta plus belle scène avec les pauses déjeuner chaudes. 15 secondes.\",\n  \"Mime ta plus belle scène avec les playlists chaudes. 15 secondes.\",\n  \"Décris les positions contre le mur comme un commentateur sportif. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les vocaux chauds. Slogan obligatoire.\",\n  \"Décris les réveils à 5 h comme un commentateur sportif. 20 secondes.\",\n  \"Montre le geste parfait pour les dîners qui finissent tôt. 10 secondes.\",\n  \"Raconte ton meilleur souvenir avec les câlins de réconciliation. 20 secondes.\",\n  \"Montre le geste parfait pour les sextos du soir. 10 secondes.\",\n  \"Fais deviner les doigts qui glissent en 3 mimes maximum.\",\n  \"Explique les jambes qui tremblent comme une notice de montage. 20 secondes.\",\n  \"Montre le geste parfait pour les draps froissés. 10 secondes.\",\n  \"Explique les caresses lentes comme une notice de montage. 20 secondes.\",\n  \"Montre le geste parfait pour les balcons en plein air. 10 secondes.\",\n  \"Décris les bandeaux sur les yeux comme un commentateur sportif. 20 secondes.\",\n  \"Mime ta plus belle scène avec les nudes assumés. 15 secondes.\",\n  \"Imite quelqu'un qui découvre les silences qui disent tout. Le groupe devine.\",\n  \"Mime ta plus belle scène avec les balcons en plein air. 15 secondes.\",\n  \"Fais une pub de 15 secondes pour les positions contre le mur. Slogan obligatoire.\",\n  \"Montre le geste parfait pour les talons au lit. 10 secondes.\",\n  \"Imite quelqu'un qui découvre les draps froissés. Le groupe devine.\",\n  \"Raconte ton meilleur souvenir avec les plages la nuit. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les chemises ouvertes. 20 secondes.\",\n  \"Explique les week-ends hors de la ville comme une notice de montage. 20 secondes.\",\n  \"Mime ta plus belle scène avec les chemises ouvertes. 15 secondes.\",\n  \"Mime ta plus belle scène avec les dîners qui finissent tôt. 15 secondes.\",\n  \"Imite quelqu'un qui découvre les vocaux chauds. Le groupe devine.\",\n  \"Décris les baisers dans le dos comme un commentateur sportif. 20 secondes.\",\n  \"Fais deviner les fuites du matin en 3 mimes maximum.\",\n  \"Fais deviner les silences qui disent tout en 3 mimes maximum.\",\n  \"Décris les sièges arrière de voiture comme un commentateur sportif. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les draps froissés. 20 secondes.\",\n  \"Montre le geste parfait pour les caresses lentes. 10 secondes.\",\n  \"Explique les disputes qui finissent au lit comme une notice de montage. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les tenues sous le manteau. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les caresses lentes. Slogan obligatoire.\",\n  \"Fais deviner les lits trop petits en 3 mimes maximum.\",\n  \"Raconte ton meilleur souvenir avec les hôtels de passage. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les sous-vêtements sexy. Le groupe devine.\",\n  \"Fais deviner les lumières tamisées en 3 mimes maximum.\",\n  \"Mime ta plus belle scène avec les vidéos qui donnent envie. 15 secondes.\",\n  \"Mime ta plus belle scène avec les douches à deux. 15 secondes.\",\n  \"Montre le geste parfait pour les cravates. 10 secondes.\",\n  \"Fais une pub de 15 secondes pour les jambes qui tremblent. Slogan obligatoire.\",\n  \"Montre le geste parfait pour les lendemains qui chantent. 10 secondes.\",\n  \"Imite quelqu'un qui découvre les caresses lentes. Le groupe devine.\",\n  \"Imite quelqu'un qui découvre les gémissements discrets. Le groupe devine.\",\n  \"Fais une pub de 15 secondes pour les préliminaires longs. Slogan obligatoire.\",\n  \"Explique les tenues sous le manteau comme une notice de montage. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les nudes assumés. Slogan obligatoire.\",\n  \"Raconte ton meilleur souvenir avec les cravates. 20 secondes.\",\n  \"Fais deviner les salles de bain embuées en 3 mimes maximum.\",\n  \"Mime ta plus belle scène avec les week-ends hors de la ville. 15 secondes.\",\n  \"Décris les week-ends hors de la ville comme un commentateur sportif. 20 secondes.\",\n  \"Décris les jambes qui tremblent comme un commentateur sportif. 20 secondes.\",\n  \"Fais deviner les balcons en plein air en 3 mimes maximum.\",\n  \"Mime ta plus belle scène avec les miroirs. 15 secondes.\",\n  \"Explique les doigts qui glissent comme une notice de montage. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les câlins de réconciliation. Le groupe devine.\",\n  \"Fais deviner les disputes qui finissent au lit en 3 mimes maximum.\",\n  \"Montre le geste parfait pour les massages sensuels. 10 secondes.\",\n  \"Fais une pub de 15 secondes pour les mots murmurés à l'oreille. Slogan obligatoire.\",\n  \"Mime ta plus belle scène avec les câlins de réconciliation. 15 secondes.\",\n  \"Décris les draps froissés comme un commentateur sportif. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les lumières tamisées. Le groupe devine.\",\n  \"Fais deviner les pauses déjeuner chaudes en 3 mimes maximum.\",\n  \"Fais deviner les miroirs en 3 mimes maximum.\",\n  \"Imite quelqu'un qui découvre les mots murmurés à l'oreille. Le groupe devine.\",\n  \"Mime ta plus belle scène avec les vocaux chauds. 15 secondes.\",\n  \"Mime ta plus belle scène avec les positions contre le mur. 15 secondes.\",\n  \"Fais deviner les sous-vêtements sexy en 3 mimes maximum.\",\n  \"Décris les câlins de réconciliation comme un commentateur sportif. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les nuits sans sommeil. Slogan obligatoire.\",\n  \"Raconte ton meilleur souvenir avec les douches à deux. 20 secondes.\",\n  \"Fais deviner les playlists chaudes en 3 mimes maximum.\",\n  \"Fais une pub de 15 secondes pour les week-ends hors de la ville. Slogan obligatoire.\",\n  \"Explique les flirts au bureau comme une notice de montage. 20 secondes.\",\n  \"Explique les cuisines en pleine nuit comme une notice de montage. 20 secondes.\",\n  \"Décris les lumières tamisées comme un commentateur sportif. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les pauses déjeuner chaudes. 20 secondes.\",\n  \"Fais deviner les regards interdits en 3 mimes maximum.\",\n  \"Décris les douches à deux comme un commentateur sportif. 20 secondes.\",\n  \"Mime ta plus belle scène avec les cuisines en pleine nuit. 15 secondes.\",\n  \"Fais une pub de 15 secondes pour les dîners qui finissent tôt. Slogan obligatoire.\",\n  \"Mime ta plus belle scène avec les regards interdits. 15 secondes.\",\n  \"Raconte ton meilleur souvenir avec les positions contre le mur. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les positions contre le mur. Le groupe devine.\",\n  \"Décris les plans qui commencent par un massage comme un commentateur sportif. 20 secondes.\",\n  \"Montre le geste parfait pour les doigts qui glissent. 10 secondes.\",\n  \"Décris les vocaux chauds comme un commentateur sportif. 20 secondes.\",\n  \"Décris les miroirs comme un commentateur sportif. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les douches à deux. Le groupe devine.\",\n  \"Mime ta plus belle scène avec les réveils à 5 h. 15 secondes.\",\n  \"Décris les cravates comme un commentateur sportif. 20 secondes.\",\n  \"Mime ta plus belle scène avec les caresses lentes. 15 secondes.\",\n  \"Fais deviner les cuisines en pleine nuit en 3 mimes maximum.\",\n  \"Fais deviner les vocaux chauds en 3 mimes maximum.\",\n  \"Fais une pub de 15 secondes pour les massages sensuels. Slogan obligatoire.\",\n  \"Décris les massages sensuels comme un commentateur sportif. 20 secondes.\",\n  \"Explique les bandeaux sur les yeux comme une notice de montage. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les doigts qui glissent. Slogan obligatoire.\",\n  \"Montre le geste parfait pour les cuisines en pleine nuit. 10 secondes.\",\n  \"Explique les taxis qui s'attardent comme une notice de montage. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les réveils à 5 h. Le groupe devine.\",\n  \"Fais une pub de 15 secondes pour les baisers dans le dos. Slogan obligatoire.\",\n  \"Explique les massages sensuels comme une notice de montage. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les nuits sans sommeil. 20 secondes.\",\n  \"Explique les hôtels de passage comme une notice de montage. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les baisers dans le dos. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les miroirs. Slogan obligatoire.\",\n  \"Explique les lumières tamisées comme une notice de montage. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les flirts au bureau. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les taxis qui s'attardent. Slogan obligatoire.\",\n  \"Raconte ton meilleur souvenir avec les vidéos qui donnent envie. 20 secondes.\",\n  \"Explique les nuits sans sommeil comme une notice de montage. 20 secondes.\",\n  \"Fais deviner les souffles courts en 3 mimes maximum.\",\n  \"Montre le geste parfait pour les positions contre le mur. 10 secondes.\",\n  \"Fais deviner les câlins de réconciliation en 3 mimes maximum.\",\n  \"Raconte ton meilleur souvenir avec les dîners qui finissent tôt. 20 secondes.\",\n  \"Montre le geste parfait pour les fuites du matin. 10 secondes.\",\n  \"Imite quelqu'un qui découvre les hôtels de passage. Le groupe devine.\",\n  \"Mime ta plus belle scène avec les doigts qui glissent. 15 secondes.\",\n  \"Fais une pub de 15 secondes pour les souffles courts. Slogan obligatoire.\",\n  \"Explique les mots murmurés à l'oreille comme une notice de montage. 20 secondes.\",\n  \"Décris les flirts au bureau comme un commentateur sportif. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les flirts au bureau. Le groupe devine.\",\n  \"Fais une pub de 15 secondes pour les playlists chaudes. Slogan obligatoire.\",\n  \"Raconte ton meilleur souvenir avec les gémissements discrets. 20 secondes.\",\n  \"Fais deviner les jeux de mains en 3 mimes maximum.\",\n  \"Décris les cuisines en pleine nuit comme un commentateur sportif. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les vocaux chauds. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les sièges arrière de voiture. Slogan obligatoire.\",\n  \"Montre le geste parfait pour les baisers dans le dos. 10 secondes.\",\n  \"Mime ta plus belle scène avec les mots murmurés à l'oreille. 15 secondes.\",\n  \"Montre le geste parfait pour les nudes assumés. 10 secondes.\",\n  \"Montre le geste parfait pour les gémissements discrets. 10 secondes.\",\n  \"Fais deviner les draps froissés en 3 mimes maximum.\",\n  \"Explique les plages la nuit comme une notice de montage. 20 secondes.\",\n  \"Montre le geste parfait pour les jeux de mains. 10 secondes.\",\n  \"Fais une pub de 15 secondes pour les cravates. Slogan obligatoire.\",\n  \"Explique les gémissements discrets comme une notice de montage. 20 secondes.\",\n  \"Montre le geste parfait pour les plumes et la glace. 10 secondes.\",\n  \"Raconte ton meilleur souvenir avec les miroirs. 20 secondes.\",\n  \"Décris les gémissements discrets comme un commentateur sportif. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les réveils à 5 h. Slogan obligatoire.\",\n  \"Imite quelqu'un qui découvre les doigts qui glissent. Le groupe devine.\",\n  \"Décris les nudes assumés comme un commentateur sportif. 20 secondes.\",\n  \"Mime ta plus belle scène avec les massages sensuels. 15 secondes.\",\n  \"Imite quelqu'un qui découvre les pauses déjeuner chaudes. Le groupe devine.\",\n  \"Explique les positions contre le mur comme une notice de montage. 20 secondes.\",\n  \"Explique les vocaux chauds comme une notice de montage. 20 secondes.\",\n  \"Explique les sous-vêtements sexy comme une notice de montage. 20 secondes.\",\n  \"Montre le geste parfait pour les câlins de réconciliation. 10 secondes.\",\n  \"Mime ta plus belle scène avec les disputes qui finissent au lit. 15 secondes.\",\n  \"Mime ta plus belle scène avec les nuits sans sommeil. 15 secondes.\",\n  \"Décris les lendemains qui chantent comme un commentateur sportif. 20 secondes.\",\n  \"Fais deviner les flirts au bureau en 3 mimes maximum.\",\n  \"Fais deviner les photos prises au bon angle en 3 mimes maximum.\",\n  \"Décris les taxis qui s'attardent comme un commentateur sportif. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les sièges arrière de voiture. 20 secondes.\",\n  \"Décris les disputes qui finissent au lit comme un commentateur sportif. 20 secondes.\",\n  \"Explique les regards interdits comme une notice de montage. 20 secondes.\",\n  \"Mime ta plus belle scène avec les tenues sous le manteau. 15 secondes.\",\n  \"Montre le geste parfait pour les vidéos qui donnent envie. 10 secondes.\",\n  \"Mime ta plus belle scène avec les sièges arrière de voiture. 15 secondes.\",\n  \"Décris les morsures légères comme un commentateur sportif. 20 secondes.\",\n  \"Mime ta plus belle scène avec les taxis qui s'attardent. 15 secondes.\",\n  \"Fais deviner les sièges arrière de voiture en 3 mimes maximum.\",\n  \"Explique les douches à deux comme une notice de montage. 20 secondes.\",\n  \"Explique les câlins de réconciliation comme une notice de montage. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les chemises ouvertes. Slogan obligatoire.\",\n  \"Fais une pub de 15 secondes pour les douches à deux. Slogan obligatoire.\",\n  \"Explique les pauses déjeuner chaudes comme une notice de montage. 20 secondes.\",\n  \"Mime ta plus belle scène avec les jambes qui tremblent. 15 secondes.\",\n  \"Fais deviner les gémissements discrets en 3 mimes maximum.\",\n  \"Fais deviner les sextos du soir en 3 mimes maximum.\",\n  \"Imite quelqu'un qui découvre les baisers dans le dos. Le groupe devine.\",\n  \"Fais une pub de 15 secondes pour les bandeaux sur les yeux. Slogan obligatoire.\",\n  \"Montre le geste parfait pour les hôtels de passage. 10 secondes.\",\n  \"Raconte ton meilleur souvenir avec les lendemains qui chantent. 20 secondes.\",\n  \"Mime ta plus belle scène avec les plans qui commencent par un massage. 15 secondes.\",\n  \"Imite quelqu'un qui découvre les cravates. Le groupe devine.\",\n  \"Fais deviner les positions contre le mur en 3 mimes maximum.\",\n  \"Décris les tenues sous le manteau comme un commentateur sportif. 20 secondes.\",\n  \"Décris les plages la nuit comme un commentateur sportif. 20 secondes.\",\n  \"Explique les cravates comme une notice de montage. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les regards interdits. Le groupe devine.\",\n  \"Imite quelqu'un qui découvre les taxis qui s'attardent. Le groupe devine.\",\n  \"Fais une pub de 15 secondes pour les vidéos qui donnent envie. Slogan obligatoire.\",\n  \"Imite quelqu'un qui découvre les plages la nuit. Le groupe devine.\",\n  \"Décris les balcons en plein air comme un commentateur sportif. 20 secondes.\",\n  \"Explique les plans qui commencent par un massage comme une notice de montage. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les playlists chaudes. Le groupe devine.\",\n  \"Décris les chemises ouvertes comme un commentateur sportif. 20 secondes.\",\n  \"Fais deviner les dîners qui finissent tôt en 3 mimes maximum.\",\n  \"Fais deviner les plages la nuit en 3 mimes maximum.\",\n  \"Explique les silences qui disent tout comme une notice de montage. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les miroirs. Le groupe devine.\",\n  \"Imite quelqu'un qui découvre les préliminaires longs. Le groupe devine.\",\n  \"Montre le geste parfait pour les silences qui disent tout. 10 secondes.\",\n  \"Montre le geste parfait pour les réveils à 5 h. 10 secondes.\",\n  \"Raconte ton meilleur souvenir avec les caresses lentes. 20 secondes.\",\n  \"Explique les nudes assumés comme une notice de montage. 20 secondes.\",\n  \"Montre le geste parfait pour les préliminaires longs. 10 secondes.\",\n  \"Explique les souffles courts comme une notice de montage. 20 secondes.\",\n  \"Mime ta plus belle scène avec les talons au lit. 15 secondes.\",\n  \"Imite quelqu'un qui découvre les week-ends hors de la ville. Le groupe devine.\",\n  \"Imite quelqu'un qui découvre les lits trop petits. Le groupe devine.\",\n  \"Fais deviner les douches à deux en 3 mimes maximum.\",\n  \"Fais deviner les mots murmurés à l'oreille en 3 mimes maximum.\",\n  \"Montre le geste parfait pour les tenues sous le manteau. 10 secondes.\",\n  \"Imite quelqu'un qui découvre les photos prises au bon angle. Le groupe devine.\",\n  \"Raconte ton meilleur souvenir avec les lits trop petits. 20 secondes.\",\n  \"Mime ta plus belle scène avec les sous-vêtements sexy. 15 secondes.\",\n  \"Montre le geste parfait pour les jambes qui tremblent. 10 secondes.\",\n  \"Imite quelqu'un qui découvre les nudes assumés. Le groupe devine.\",\n  \"Décris les photos prises au bon angle comme un commentateur sportif. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les mots murmurés à l'oreille. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les balcons en plein air. Slogan obligatoire.\",\n  \"Fais deviner les taxis qui s'attardent en 3 mimes maximum.\",\n  \"Montre le geste parfait pour les sous-vêtements sexy. 10 secondes.\",\n  \"Montre le geste parfait pour les taxis qui s'attardent. 10 secondes.\",\n  \"Décris les pauses déjeuner chaudes comme un commentateur sportif. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les hôtels de passage. Slogan obligatoire.\"\n]\n  },\n  3: {\n    verite: [\n  \"C'est la chose la plus folle que tu aies faite au lit ? Sans filtre.\",\n  \"As-tu déjà eu une aventure avec quelqu'un déjà pris(e) ?\",\n  \"Ta position préférée ? Le groupe exige les détails.\",\n  \"As-tu déjà fantasmé sur quelqu'un présent dans cette partie ? Qui ?\",\n  \"Le plus grand nombre de rounds en une seule nuit ? Le chiffre.\",\n  \"As-tu déjà simulé l'orgasme pour sauver la situation ? Raconte.\",\n  \"Ta plus courte aventure : combien de temps ça a duré ?\",\n  \"C'est ton plus grand secret entre les draps ?\",\n  \"La personne de cette partie que tu emmènerais direct chez toi ?\",\n  \"As-tu déjà laissé ou reçu une morsure marqueuse ? Où exactement ?\",\n  \"Le plus bizarre qu'on t'ait demandé au lit... et tu as dit oui ?\",\n  \"Décris ta dernière fois : quand, où, combien de temps.\",\n  \"C'est quoi ton préliminaire préféré, étape par étape ?\",\n  \"Combien de temps tu tiens en moyenne ? Sois honnête.\",\n  \"Tu préfères donner ou recevoir ? Pourquoi ?\",\n  \"Raconte ta pire panne au lit. Toute l'histoire.\",\n  \"Le mot sale qui te fait perdre le contrôle ?\",\n  \"As-tu déjà testé les sextoys ? Lequel et verdict ?\",\n  \"C'est le bruit de ton/ta partenaire qui te fait le plus craquer ?\",\n  \"Décris ton dernier rêve X en détail.\",\n  \"Où exactement tu aimes être embrassé(e) ? Montre sur toi.\",\n  \"As-tu déjà fait l'amour pendant les règles ? Ton avis franc ?\",\n  \"Ta plus grosse frousse de surprise pendant l'action ?\",\n  \"Combien de nudes tu as dans ton téléphone en ce moment ?\",\n  \"As-tu déjà couché avec le/la ex d'un(e) ami(e) ?\",\n  \"Décris ta façon de toucher préférée : lente, ferme ou rapide ?\",\n  \"Qu'est-ce que tu penses quand tu te touches ? La vraie image.\",\n  \"Ta dernière recherche dans l'historique de vidéos X ? Mot pour mot.\",\n  \"As-tu déjà eu un plan avec quelqu'un de ton quartier ? Qui le sait ?\",\n  \"Le lieu le plus risqué où tu as fait l'amour ? Presque surpris(e) ?\",\n  \"Raconte ta nuit la plus longue : de l'heure de départ à la fin.\",\n  \"Tu préfères être mordu(e), griffé(e) ou soufflé(e) dans l'oreille ?\",\n  \"Combien de personnes du groupe tu trouverais chaudes si tu étais en mode chasse ?\",\n  \"Décris la dernière fois que tu as perdu le contrôle. Tout.\",\n  \"Quel est ton record de nuits enchaînées avec la même personne ?\",\n  \"As-tu déjà testé la fessée ? Ton verdict technique ?\",\n  \"C'est le compliment sexuel qui te touche le plus ? Mot exact.\",\n  \"As-tu déjà crié sans le vouloir ? Les voisins ont dit quoi ?\",\n  \"Ton pire déshabillage raté ? Détails comiques acceptés.\",\n  \"As-tu déjà eu un plan sans jamais connaître le prénom ?\",\n  \"Décris la tenue qui te fait perdre la tête sur quelqu'un.\",\n  \"Combien de temps tes préliminaires ont duré au maximum ?\",\n  \"As-tu déjà fini une soirée direct à l'hôtel ? Avec qui (initiale) ?\",\n  \"La chose que ton ex faisait et que tu cherches encore ailleurs ?\",\n  \"Décris ta façon de baiser en 3 adjectifs seulement.\",\n  \"As-tu déjà gémi le nom de quelqu'un d'autre ? Ça s'est vu ?\",\n  \"Quel est le message chaud le plus direct que tu aies envoyé ? Copie-le.\",\n  \"Ton avis franc : la lumière allumée change tout ou pas ?\",\n  \"As-tu déjà testé deux personnes la même nuit ? Comment tu as géré ?\",\n  \"C'est ta zone la plus sensible ? Désigne-la sur toi.\",\n  \"As-tu déjà utilisé de la nourriture au lit ? Laquelle ?\",\n  \"Raconte le plan le plus désordonné de ta vie : lieu, durée, fin.\",\n  \"Tu préfères le matin, l'après-midi ou 3 h du matin ? Pourquoi ?\",\n  \"As-tu déjà été bloqué(e) chez quelqu'un toute la nuit à cause d'une panne ?\",\n  \"Décris ton orgasm parfait en une phrase précise.\",\n  \"Ta réaction si quelqu'un d'ici t'envoyait un nude maintenant ?\",\n  \"As-tu déjà couché pour régler une dispute ? Ça a marché ?\",\n  \"Le fantasme que tu cacherais même à ton/ta partenaire de vie ?\",\n  \"As-tu déjà filmé le plafond en te remémorant une nuit ? Laquelle ?\",\n  \"Ton avis franc sur les plans à trois : oui, non, condition ?\",\n  \"Décris le dernier son qui t'a réveillé(e) chez quelqu'un.\",\n  \"Ta plus grosse dépense pour une nuit (hôtel, tenue, transport) ?\",\n  \"As-tu déjà pris une douche avec quelqu'un sans rien faire ? C'était intense ?\",\n  \"Décris ton niveau de contrôle ce soir sur 10, la preuve.\",\n  \"Le dernier mot que tu as murmuré après l'action ?\",\n  \"As-tu déjà pleuré de plaisir ? Raconte la scène.\",\n  \"C'est ta façon signature d'embrasser ? Démontre en le décrivant.\",\n  \"Combien de douches après une nuit avec la même personne ? Record ?\",\n  \"Décris ta dernière fois : quand et où ? Tous les détails.\",\n  \"Décris ta dernière fois : la position de départ et la position de fin ? Tous les détails.\",\n  \"Décris ta dernière fois : la durée totale ? Tous les détails.\",\n  \"Décris ta dernière fois : le nombre de rounds ? Tous les détails.\",\n  \"Décris ta dernière fois : le bruit que vous avez fait ? Tous les détails.\",\n  \"Décris ta dernière fois : la chose la plus folle de la nuit ? Tous les détails.\",\n  \"Décris ta dernière fois : le moment où tu as perdu le contrôle ? Tous les détails.\",\n  \"Décris ta dernière fois : la phrase qui a tout lancé ? Tous les détails.\",\n  \"Décris ta dernière fois : ce que tu portes au moment où on te l'a demandé ? Tous les détails.\",\n  \"Décris ta dernière fois : la chose que tu as regrettée ? Tous les détails.\",\n  \"Décris ta dernière fois : la chose que tu as adorée ? Tous les détails.\",\n  \"Décris ta dernière fois : le moment le plus gênant ? Tous les détails.\",\n  \"Décris ta dernière fois : le mot qui a été murmuré à la fin ? Tous les détails.\",\n  \"Décris ta dernière fois : la marque laissée sur ta peau ? Tous les détails.\",\n  \"Décris ta dernière fois : ce que vous avez regardé pendant ? Tous les détails.\",\n  \"Décris ta dernière fois : la chose que tu as mangée après ? Tous les détails.\",\n  \"Décris ta dernière fois : le message envoyé juste après ? Tous les détails.\",\n  \"Décris ta dernière fois : la douche de fin : courte ou interminable ? Tous les détails.\",\n  \"Décris ta dernière fois : le rêve que tu as fait après ? Tous les détails.\",\n  \"Décris ta dernière fois : la première chose que tu as dite au réveil ? Tous les détails.\",\n  \"Décris ta dernière fois : la chose que tu n'as pas osé demander ? Tous les détails.\",\n  \"Décris ta dernière fois : l'endroit exact de la pièce où ça a commencé ? Tous les détails.\",\n  \"Décris ta dernière fois : la tenue au départ et son état à la fin ? Tous les détails.\",\n  \"Décris ta dernière fois : le bruit du lit et des voisins ? Tous les détails.\",\n  \"Décris ta dernière fois : la faute de goût de la nuit (musique, lumière, odeur) ? Tous les détails.\",\n  \"Décris ta dernière fois : le geste que tu as repris la fois suivante ? Tous les détails.\",\n  \"Décris ta dernière fois : le secret que tu as gardé de cette nuit ? Tous les détails.\",\n  \"Décris ta dernière fois : la phrase de départ et la phrase de fin ? Tous les détails.\",\n  \"Décris ta dernière fois : ce que tu as pensé à ce moment précis ? Tous les détails.\",\n  \"Décris ta dernière fois : la chose que tu voudrais refaire tout de suite ? Tous les détails.\",\n  \"Décris ta dernière fois : le niveau sur 10 et pourquoi ? Tous les détails.\",\n  \"Décris ta dernière fois : la photo prise pendant ou après ? Tous les détails.\",\n  \"Décris ta dernière fois : le fou rire du milieu de la nuit ? Tous les détails.\",\n  \"Décris ta dernière fois : la chute ou le crash comique de la nuit ? Tous les détails.\",\n  \"Décris ta dernière fois : le temps avant de vous rendormir ? Tous les détails.\",\n  \"Décris ta dernière fois : le réveil : collage ou fuite rapide ? Tous les détails.\",\n  \"Décris ta dernière fois : le déjeuner du lendemain ensemble ou pas ? Tous les détails.\",\n  \"Décris ta dernière fois : le nom que tu as évité de prononcer ? Tous les détails.\",\n  \"Décris ta dernière fois : la main qui a tremblé à un moment ? Tous les détails.\",\n  \"Décris ta dernière fois : le mot « encore » : dit combien de fois ? Tous les détails.\",\n  \"As-tu déjà couché avec quelqu'un du cercle d'amis ? Détaille tout.\",\n  \"As-tu déjà couché avec un(e) voisin(e) toujours visible aujourd'hui ? Détaille tout.\",\n  \"As-tu déjà fini dans les bras d'un(e) inconnu(e) après une dispute ? Détaille tout.\",\n  \"As-tu déjà essayé une position trouvée sur Internet ? Détaille tout.\",\n  \"As-tu déjà testé le bandana sur les yeux ? Détaille tout.\",\n  \"As-tu déjà testé les poignets tenus fermement ? Détaille tout.\",\n  \"As-tu déjà mordu(e) quelqu'un jusqu'à la marque ? Détaille tout.\",\n  \"As-tu déjà crié le mauvais prénom ? Détaille tout.\",\n  \"As-tu déjà pleuré pendant l'action (de plaisir ou pas) ? Détaille tout.\",\n  \"As-tu déjà ri aux éclats en pleine action ? Détaille tout.\",\n  \"As-tu déjà arrêté(e) en plein milieu par un appel de tes parents ? Détaille tout.\",\n  \"As-tu déjà couché avec un(e) ami(e) qui veut plus après ? Détaille tout.\",\n  \"As-tu déjà couché avec un(e) ex deux fois le même week-end ? Détaille tout.\",\n  \"As-tu déjà eu un plan dans un lieu religieux ou à côté ? Détaille tout.\",\n  \"As-tu déjà eu un plan juste après le mariage d'un(e) autre ? Détaille tout.\",\n  \"As-tu déjà couché avec quelqu'un pendant qu'il pleuvait très fort ? Détaille tout.\",\n  \"As-tu déjà été démasqué(e) par un(e) voisin(e) bavard(e) ? Détaille tout.\",\n  \"As-tu déjà couché pendant qu'une série jouait à côté ? Détaille tout.\",\n  \"As-tu déjà reçu la visite d'un(e) voisin(e) à cause du bruit ? Détaille tout.\",\n  \"As-tu déjà couché dans une voiture en mouvement (conducteur arrêté) ? Détaille tout.\",\n  \"As-tu déjà couché avec quelqu'un qui ronflait juste après ? Détaille tout.\",\n  \"As-tu déjà couché avec la lumière du téléphone qui restait allumée ? Détaille tout.\",\n  \"As-tu déjà couché avec quelqu'un qui parlait de son ex ? Détaille tout.\",\n  \"As-tu déjà couché avec une playlist honteuse ? Détaille tout.\",\n  \"As-tu déjà couché avec quelqu'un de très bavard ? Détaille tout.\",\n  \"As-tu déjà couché avec quelqu'un qui a dormi tout de suite ? Détaille tout.\",\n  \"As-tu déjà couché sur le sol car le lit était trop petit ? Détaille tout.\",\n  \"As-tu déjà couché dans une chambre avec un bébé qui dormait ? Détaille tout.\",\n  \"As-tu déjà couché pendant que la nourriture brûlait ? Détaille tout.\",\n  \"As-tu déjà couché avec quelqu'un qui photographiait (avec accord) ? Détaille tout.\",\n  \"As-tu déjà couché avec quelqu'un qui a laissé des traces rouges partout ? Détaille tout.\",\n  \"As-tu déjà couché avec quelqu'un qui a brisé quelque chose ? Détaille tout.\",\n  \"As-tu déjà couché avec quelqu'un qui a répété « pardonne-moi » après ? Détaille tout.\",\n  \"As-tu déjà couché avec quelqu'un qui a parlé de mariage ? Détaille tout.\",\n  \"As-tu déjà couché avec quelqu'un qui a pleuré après ? Détaille tout.\",\n  \"As-tu déjà couché avec quelqu'un qui a filé à l'aube ? Détaille tout.\",\n  \"As-tu déjà couché avec quelqu'un qui a téléphoné à sa mère dans le dos ? Détaille tout.\",\n  \"As-tu déjà couché avec quelqu'un qui a demandé un score sur 10 ? Détaille tout.\",\n  \"As-tu déjà couché avec quelqu'un qui a gardé ses chaussettes et son bonnet ? Détaille tout.\",\n  \"As-tu déjà couché avec quelqu'un qui a mis 20 minutes à trouver la porte ? Détaille tout.\",\n  \"Qu'est-ce qui t'excite le plus : un baiser dans le cou ou dans le dos ? Décris précisément.\",\n  \"Qu'est-ce qui t'excite le plus : les mains qui descendent ou les mains qui montent ? Décris précisément.\",\n  \"Qu'est-ce qui t'excite le plus : une voix grave ou une voix douce ? Décris précisément.\",\n  \"Qu'est-ce qui t'excite le plus : les mots sales à l'oreille ou les regards longs ? Décris précisément.\",\n  \"Qu'est-ce qui t'excite le plus : être dominé(e) ou dominer ? Décris précisément.\",\n  \"Qu'est-ce qui t'excite le plus : le début des préliminaires ou le moment final ? Décris précisément.\",\n  \"Qu'est-ce qui t'excite le plus : la lumière qui reste ou la nuit totale ? Décris précisément.\",\n  \"Qu'est-ce qui t'excite le plus : un bisou lent ou une morsure rapide ? Décris précisément.\",\n  \"Qu'est-ce qui t'excite le plus : le souffle dans l'oreille ou sur le cou ? Décris précisément.\",\n  \"Qu'est-ce qui t'excite le plus : les griffures légères ou les pressions fortes ? Décris précisément.\",\n  \"Qu'est-ce qui t'excite le plus : la peau douce ou les mains rugueuses ? Décris précisément.\",\n  \"Qu'est-ce qui t'excite le plus : les vêtements qui craquent ou le silence ? Décris précisément.\",\n  \"Qu'est-ce qui t'excite le plus : le nom murmuré ou le mot « encore » ? Décris précisément.\",\n  \"Qu'est-ce qui t'excite le plus : le danger d'être surpris(e) ou le confort total ? Décris précisément.\",\n  \"Qu'est-ce qui t'excite le plus : l'odeur du parfum ou l'odeur de la peau ? Décris précisément.\",\n  \"Qu'est-ce qui t'excite le plus : le sourire au milieu ou les yeux fermés ? Décris précisément.\",\n  \"Qu'est-ce qui t'excite le plus : la vitesse lente ou la vitesse montée ? Décris précisément.\",\n  \"Qu'est-ce qui t'excite le plus : la nuit entière ou l'heure rapide du matin ? Décris précisément.\",\n  \"Qu'est-ce qui t'excite le plus : les préliminaires à la bouche ou aux mains ? Décris précisément.\",\n  \"Qu'est-ce qui t'excite le plus : le teasing long ou l'action directe ? Décris précisément.\",\n  \"Qu'est-ce qui t'excite le plus : les jambes qui tremblent ou le souffle coupé ? Décris précisément.\",\n  \"Qu'est-ce qui t'excite le plus : la marque sur la peau ou le souvenir dans la tête ? Décris précisément.\",\n  \"Qu'est-ce qui t'excite le plus : la douche avant ou la douche à deux ? Décris précisément.\",\n  \"Qu'est-ce qui t'excite le plus : le lit douillet ou le lieu interdit ? Décris précisément.\",\n  \"Qu'est-ce qui t'excite le plus : le réveil en pleine nuit ou le réveil du matin ? Décris précisément.\",\n  \"Qu'est-ce qui t'excite le plus : le taxi collé-collé ou le canapé seul au monde ? Décris précisément.\",\n  \"Qu'est-ce qui t'excite le plus : la robe qui glisse ou la chemise ouverte ? Décris précisément.\",\n  \"Qu'est-ce qui t'excite le plus : les mains dans les cheveux ou les mains sur la taille ? Décris précisément.\",\n  \"Qu'est-ce qui t'excite le plus : le mot doux public ou le mot sale privé ? Décris précisément.\",\n  \"Qu'est-ce qui t'excite le plus : le control parfait ou le chaos total ? Décris précisément.\",\n  \"Le groupe exige : le chiffre exact de personnes avec qui tu as couché. Réponds sans contourner.\",\n  \"Le groupe exige : ton record de fois en une nuit. Réponds sans contourner.\",\n  \"Le groupe exige : la durée exacte de ta plus longue nuit. Réponds sans contourner.\",\n  \"Le groupe exige : la durée de ta plus courte aventure. Réponds sans contourner.\",\n  \"Le groupe exige : l'heure la plus tardive où tu as écrit pour un plan. Réponds sans contourner.\",\n  \"Le groupe exige : le nombre de nudes actuellement dans ton téléphone. Réponds sans contourner.\",\n  \"Le groupe exige : le nombre de personnes d'ici que tu as déjà imaginées au lit. Réponds sans contourner.\",\n  \"Le groupe exige : le nombre de positions que tu maîtrises vraiment. Réponds sans contourner.\",\n  \"Le groupe exige : le nombre de personnes qui t'ont déjà fait perdre le contrôle. Réponds sans contourner.\",\n  \"Le groupe exige : le nombre d'organes... non : le nombre de lieux différents où tu as fait l'amour. Réponds sans contourner.\",\n  \"Le groupe exige : le nombre de fois où tu as simulé (estimation honnête). Réponds sans contourner.\",\n  \"Le groupe exige : le nombre de douches à deux de ta vie. Réponds sans contourner.\",\n  \"Le groupe exige : le nombre de marques laissées ou reçues. Réponds sans contourner.\",\n  \"Le groupe exige : le nombre de plans qui ont fini en fuite à l'aube. Réponds sans contourner.\",\n  \"Le groupe exige : le nombre de fois où tu as crié le mauvais nom. Réponds sans contourner.\",\n  \"Le groupe exige : le nombre de fois où tu as dit oui sans envie. Réponds sans contourner.\",\n  \"Le groupe exige : le nombre de plans conclus par un simple « ok » à 2 h du matin. Réponds sans contourner.\",\n  \"Le groupe exige : le nombre de soirs où tu as pensé à quelqu'un d'ici. Réponds sans contourner.\",\n  \"Le groupe exige : le nombre de messages chauds envoyés cette semaine. Réponds sans contourner.\",\n  \"Le groupe exige : le nombre de vidéos X regardées ce mois-ci. Réponds sans contourner.\",\n  \"Le groupe exige : le nombre de jouets ou d'accessoires chez toi. Réponds sans contourner.\",\n  \"Le groupe exige : le nombre de nuits blanches à cause de quelqu'un. Réponds sans contourner.\",\n  \"Le groupe exige : le nombre d'histoires que tes amis connaissent déjà sur toi. Réponds sans contourner.\",\n  \"Le groupe exige : le nombre de fois où tu as été presque surpris(e). Réponds sans contourner.\",\n  \"Le groupe exige : le nombre de fois où tu as repensé à une nuit en te douchant. Réponds sans contourner.\",\n  \"Le groupe exige : le nombre de personnes qui t'ont demandé un plan cette année. Réponds sans contourner.\",\n  \"Le groupe exige : le nombre de fois où tu as pleuré de plaisir. Réponds sans contourner.\",\n  \"Le groupe exige : le nombre de fois où tu as ris en pleine action. Réponds sans contourner.\",\n  \"Le groupe exige : le nombre de tenues « spéciales nuit » dans ton placard. Réponds sans contourner.\",\n  \"Le groupe exige : le nombre de bougies ou de lampes d'ambiance chez toi. Réponds sans contourner.\",\n  \"Ta confession la plus crue sur : ton fantasme le plus précis. Le groupe ferme les yeux.\",\n  \"Ta confession la plus crue sur : ta pire envie jamais réprimée. Le groupe ferme les yeux.\",\n  \"Ta confession la plus crue sur : la chose que tu as faite sans le dire à personne. Le groupe ferme les yeux.\",\n  \"Ta confession la plus crue sur : le lieu interdit où tu as éprouvé une envie. Le groupe ferme les yeux.\",\n  \"Ta confession la plus crue sur : le contenu de ta dernière recherche X. Le groupe ferme les yeux.\",\n  \"Ta confession la plus crue sur : la personne la plus inattendue dans tes rêves. Le groupe ferme les yeux.\",\n  \"Ta confession la plus crue sur : ton plus grand mensonge au lit. Le groupe ferme les yeux.\",\n  \"Ta confession la plus crue sur : la chose que tu voudrais qu'on te fasse ce soir. Le groupe ferme les yeux.\",\n  \"Ta confession la plus crue sur : la chose que tu voudrais faire à quelqu'un d'ici. Le groupe ferme les yeux.\",\n  \"Ta confession la plus crue sur : ton plus grand raté sexuel jamais caché. Le groupe ferme les yeux.\",\n  \"Ta confession la plus crue sur : la phrase que tu as dite uniquement pour exciter. Le groupe ferme les yeux.\",\n  \"Ta confession la plus crue sur : ton odeur préférée sur une peau. Le groupe ferme les yeux.\",\n  \"Ta confession la plus crue sur : tonRecord de messages chauds en une nuit. Le groupe ferme les yeux.\",\n  \"Ta confession la plus crue sur : la partie de ton corps la plus réactive. Le groupe ferme les yeux.\",\n  \"Ta confession la plus crue sur : la première image qui te vient quand tu fermes les yeux. Le groupe ferme les yeux.\",\n  \"Ta confession la plus crue sur : la chose que tu as cachée à tes amis le lendemain. Le groupe ferme les yeux.\",\n  \"Ta confession la plus crue sur : le plan dont tu es le plus fier/fière. Le groupe ferme les yeux.\",\n  \"Ta confession la plus crue sur : le plan dont tu as le plus honte. Le groupe ferme les yeux.\",\n  \"Ta confession la plus crue sur : la nuit que tu refais en boucle dans ta tête. Le groupe ferme les yeux.\",\n  \"Ta confession la plus crue sur : le geste que tu répètes seul(e) et que tu ne dévoiles jamais. Le groupe ferme les yeux.\",\n  \"Ta confession la plus crue sur : la chose que tu as volée comme souvenir d'une nuit. Le groupe ferme les yeux.\",\n  \"Ta confession la plus crue sur : la promesse que tu as faite sans jamais la tenir. Le groupe ferme les yeux.\",\n  \"Ta confession la plus crue sur : le prénom que tu as murmuré sans le vouloir. Le groupe ferme les yeux.\",\n  \"Ta confession la plus crue sur : l'excuse bidon pour quitter le lit à l'aube. Le groupe ferme les yeux.\",\n  \"Ta confession la plus crue sur : la chose la plus sale dite par texto. Le groupe ferme les yeux.\",\n  \"Ta confession la plus crue sur : la photo jamais montrée que tu gardes depuis longtemps. Le groupe ferme les yeux.\",\n  \"Ta confession la plus crue sur : le lieu public où tu as eu la plus grosse envie. Le groupe ferme les yeux.\",\n  \"Ta confession la plus crue sur : la chose que tu as cassée en pleine action. Le groupe ferme les yeux.\",\n  \"Ta confession la plus crue sur : le bruit que tu as fait sans le vouloir. Le groupe ferme les yeux.\",\n  \"Ta confession la plus crue sur : la confesse que tu n'as jamais faite à ton/ta partenaire. Le groupe ferme les yeux.\",\n  \"Ton avis franc et direct sur : les plans à trois. Une phrase claire.\",\n  \"Ton avis franc et direct sur : les échanges de partenaires. Une phrase claire.\",\n  \"Ton avis franc et direct sur : la fessée. Une phrase claire.\",\n  \"Ton avis franc et direct sur : les menottes. Une phrase claire.\",\n  \"Ton avis franc et direct sur : le bandeau sur les yeux. Une phrase claire.\",\n  \"Ton avis franc et direct sur : les sextoys en couple. Une phrase claire.\",\n  \"Ton avis franc et direct sur : la filme de ses nuits (avec accord). Une phrase claire.\",\n  \"Ton avis franc et direct sur : les relations ouvertes. Une phrase claire.\",\n  \"Ton avis franc et direct sur : coucher au premier rendez-vous. Une phrase claire.\",\n  \"Ton avis franc et direct sur : les plans qui deviennent amour. Une phrase claire.\",\n  \"Ton avis franc et direct sur : les massages nus. Une phrase claire.\",\n  \"Ton avis franc et direct sur : la douche à deux. Une phrase claire.\",\n  \"Ton avis franc et direct sur : les marques sur la peau. Une phrase claire.\",\n  \"Ton avis franc et direct sur : les mots sales à voix haute. Une phrase claire.\",\n  \"Ton avis franc et direct sur : les vocaux chauds. Une phrase claire.\",\n  \"Ton avis franc et direct sur : les sextos le matin. Une phrase claire.\",\n  \"Ton avis franc et direct sur : le sexe sans conversation après. Une phrase claire.\",\n  \"Ton avis franc et direct sur : le silence total pendant l'action. Une phrase claire.\",\n  \"Ton avis franc et direct sur : la musique forte pendant. Une phrase claire.\",\n  \"Ton avis franc et direct sur : la lumière rouge. Une phrase claire.\",\n  \"Ton avis franc et direct sur : les tenues (lingerie, déguisement). Une phrase claire.\",\n  \"Ton avis franc et direct sur : les talons au lit. Une phrase claire.\",\n  \"Ton avis franc et direct sur : les jeux de rôle au lit. Une phrase claire.\",\n  \"Ton avis franc et direct sur : les rôles inversés (domination). Une phrase claire.\",\n  \"Ton avis franc et direct sur : le sexe en pleine nature. Une phrase claire.\",\n  \"Ton avis franc et direct sur : le sexe en vacances avec un(e) inconnu(e). Une phrase claire.\",\n  \"Ton avis franc et direct sur : les rappels à 2 h du matin. Une phrase claire.\",\n  \"Ton avis franc et direct sur : les douches qui durent 30 minutes. Une phrase claire.\",\n  \"Ton avis franc et direct sur : les câlins sans suite. Une phrase claire.\",\n  \"Ton avis franc et direct sur : les promesses de minuit. Une phrase claire.\",\n  \"Tu recommencerais avec les poignets tenus ? Pourquoi ?\",\n  \"C'est quoi ton meilleur souvenir avec les croisées de la salle de sport ?\",\n  \"As-tu déjà testé les serveurs et serveuses trop beaux ? Raconte.\",\n  \"les hôtels où l'on revient : oui, non, ou tu rêves ?\",\n  \"Qu'est-ce qui change avec les bureaux après les heures selon la personne ?\",\n  \"C'est quoi ton avis sur les chutes du lit ? Sois honnête.\",\n  \"C'est quoi ton meilleur souvenir avec les huiles de massage ?\",\n  \"Qu'est-ce qui change avec les miroirs au plafond selon la personne ?\",\n  \"As-tu déjà testé les cabines de plage ? Raconte.\",\n  \"Ton record avec les bains de minuit ? Le groupe demande le chiffre.\",\n  \"Ton record avec les tentes qui bougent ? Le groupe demande le chiffre.\",\n  \"Tu recommencerais avec les lendemains sans prénom ? Pourquoi ?\",\n  \"As-tu déjà testé les douches à trois températures ? Raconte.\",\n  \"Tu recommencerais avec les buanderies improvisées ? Pourquoi ?\",\n  \"les voitures embuées : oui, non, ou tu rêves ?\",\n  \"Ton record avec les voisins curieux ? Le groupe demande le chiffre.\",\n  \"Ton pire souvenir avec les cris étouffés ? Raconte.\",\n  \"Ton record avec les cabines de plage ? Le groupe demande le chiffre.\",\n  \"C'est quoi ton avis sur les liens en soie ? Sois honnête.\",\n  \"Qu'est-ce qui change avec les promesses de 4 h du matin selon la personne ?\",\n  \"Ton record avec les morsures qui marquent ? Le groupe demande le chiffre.\",\n  \"C'est quoi ton meilleur souvenir avec les glaçons qui fondent ?\",\n  \"C'est quoi ton meilleur souvenir avec les salles de réunion vides ?\",\n  \"C'est quoi ton avis sur les douches à trois températures ? Sois honnête.\",\n  \"C'est quoi ton avis sur les amis avec avantages ? Sois honnête.\",\n  \"les cris étouffés : oui, non, ou tu rêves ?\",\n  \"C'est quoi ton avis sur les piscines nocturnes ? Sois honnête.\",\n  \"C'est quoi ton meilleur souvenir avec les appels interrompus ?\",\n  \"Tu recommencerais avec les serveurs et serveuses trop beaux ? Pourquoi ?\",\n  \"les huiles de massage : oui, non, ou tu rêves ?\",\n  \"les poignets tenus : oui, non, ou tu rêves ?\",\n  \"Tu recommencerais avec les tentes qui bougent ? Pourquoi ?\",\n  \"C'est quoi ton meilleur souvenir avec les griffures dans le dos ?\",\n  \"les serveurs et serveuses trop beaux : oui, non, ou tu rêves ?\",\n  \"As-tu déjà testé les griffures dans le dos ? Raconte.\",\n  \"C'est quoi ton avis sur les messages à 3 h du matin ? Sois honnête.\",\n  \"Qu'est-ce qui change avec les griffures dans le dos selon la personne ?\",\n  \"Ton pire souvenir avec les salles de réunion vides ? Raconte.\",\n  \"Qu'est-ce qui change avec les bains de minuit selon la personne ?\",\n  \"les piscines nocturnes : oui, non, ou tu rêves ?\",\n  \"Tu recommencerais avec les orgasmes simulés ? Pourquoi ?\",\n  \"Tu recommencerais avec les appels interrompus ? Pourquoi ?\",\n  \"Ton pire souvenir avec les messages à 3 h du matin ? Raconte.\",\n  \"Ton pire souvenir avec les promesses de 4 h du matin ? Raconte.\",\n  \"Qu'est-ce qui change avec les buanderies improvisées selon la personne ?\",\n  \"les messages à 3 h du matin : oui, non, ou tu rêves ?\",\n  \"Ton record avec les marques sur la nuque ? Le groupe demande le chiffre.\",\n  \"C'est quoi ton meilleur souvenir avec les liens en soie ?\",\n  \"les collègues trop proches : oui, non, ou tu rêves ?\",\n  \"Ton record avec les collègues trop proches ? Le groupe demande le chiffre.\",\n  \"Ton pire souvenir avec les ascenseurs bloqués ? Raconte.\",\n  \"Tu recommencerais avec les croisées de la salle de sport ? Pourquoi ?\",\n  \"Tu recommencerais avec les records battus ? Pourquoi ?\",\n  \"Qu'est-ce qui change avec les morsures qui marquent selon la personne ?\",\n  \"Ton record avec les soirées qui dégénèrent ? Le groupe demande le chiffre.\",\n  \"Tu recommencerais avec les messages à 3 h du matin ? Pourquoi ?\",\n  \"C'est quoi ton meilleur souvenir avec les cabines de plage ?\",\n  \"Ton pire souvenir avec les garages bruyants ? Raconte.\",\n  \"Ton pire souvenir avec les goûts qui surprennent ? Raconte.\",\n  \"Qu'est-ce qui change avec les collègues trop proches selon la personne ?\",\n  \"Qu'est-ce qui change avec les lits qui craquent selon la personne ?\",\n  \"Qu'est-ce qui change avec les jambes qui lâchent selon la personne ?\",\n  \"les cages d'escalier : oui, non, ou tu rêves ?\",\n  \"les terrasses à minuit : oui, non, ou tu rêves ?\",\n  \"C'est quoi ton avis sur les promesses de 4 h du matin ? Sois honnête.\",\n  \"As-tu déjà testé les chutes du lit ? Raconte.\",\n  \"As-tu déjà testé les buanderies improvisées ? Raconte.\",\n  \"C'est quoi ton meilleur souvenir avec les buanderies improvisées ?\",\n  \"Ton record avec les serveurs et serveuses trop beaux ? Le groupe demande le chiffre.\",\n  \"Qu'est-ce qui change avec les orgasmes simulés selon la personne ?\",\n  \"Ton pire souvenir avec les positions acrobatiques ? Raconte.\",\n  \"As-tu déjà testé les voitures embuées ? Raconte.\",\n  \"les cabines de plage : oui, non, ou tu rêves ?\",\n  \"As-tu déjà testé les gémissements forts ? Raconte.\",\n  \"Ton pire souvenir avec les soirées qui dégénèrent ? Raconte.\",\n  \"Ton record avec les miroirs au plafond ? Le groupe demande le chiffre.\",\n  \"Qu'est-ce qui change avec les records battus selon la personne ?\",\n  \"Qu'est-ce qui change avec les garages bruyants selon la personne ?\",\n  \"As-tu déjà testé les défis d'endurance ? Raconte.\",\n  \"Qu'est-ce qui change avec les amis avec avantages selon la personne ?\",\n  \"As-tu déjà testé les salles de réunion vides ? Raconte.\",\n  \"Tu recommencerais avec les odeurs intimes ? Pourquoi ?\",\n  \"Ton record avec les hôtels où l'on revient ? Le groupe demande le chiffre.\",\n  \"Qu'est-ce qui change avec les terrasses à minuit selon la personne ?\",\n  \"Ton record avec les croisées de la salle de sport ? Le groupe demande le chiffre.\",\n  \"C'est quoi ton meilleur souvenir avec les cheveux tirés (gentiment) ?\",\n  \"As-tu déjà testé les odeurs intimes ? Raconte.\",\n  \"Ton pire souvenir avec les liens en soie ? Raconte.\",\n  \"les salles de réunion vides : oui, non, ou tu rêves ?\",\n  \"C'est quoi ton meilleur souvenir avec les ascenseurs bloqués ?\",\n  \"C'est quoi ton avis sur les morsures qui marquent ? Sois honnête.\",\n  \"Qu'est-ce qui change avec les gémissements forts selon la personne ?\",\n  \"les douches à trois températures : oui, non, ou tu rêves ?\",\n  \"As-tu déjà testé les piscines nocturnes ? Raconte.\",\n  \"Tu recommencerais avec les bains de minuit ? Pourquoi ?\",\n  \"les lendemains sans prénom : oui, non, ou tu rêves ?\",\n  \"Ton record avec les garages bruyants ? Le groupe demande le chiffre.\",\n  \"les tentes qui bougent : oui, non, ou tu rêves ?\",\n  \"C'est quoi ton avis sur les poignets tenus ? Sois honnête.\",\n  \"les positions acrobatiques : oui, non, ou tu rêves ?\",\n  \"les chutes du lit : oui, non, ou tu rêves ?\",\n  \"C'est quoi ton avis sur les bandeaux serrés ? Sois honnête.\",\n  \"Ton record avec les lits qui craquent ? Le groupe demande le chiffre.\",\n  \"Ton pire souvenir avec les odeurs intimes ? Raconte.\",\n  \"Qu'est-ce qui change avec les salles de réunion vides selon la personne ?\",\n  \"Tu recommencerais avec les essais trouvés sur Internet ? Pourquoi ?\",\n  \"C'est quoi ton avis sur les voisins curieux ? Sois honnête.\",\n  \"C'est quoi ton avis sur les ordres doux ? Sois honnête.\",\n  \"Qu'est-ce qui change avec les liens en soie selon la personne ?\",\n  \"Qu'est-ce qui change avec les voitures embuées selon la personne ?\",\n  \"les odeurs intimes : oui, non, ou tu rêves ?\",\n  \"Ton record avec les amis avec avantages ? Le groupe demande le chiffre.\",\n  \"As-tu déjà testé les amis avec avantages ? Raconte.\",\n  \"Ton record avec les salles de réunion vides ? Le groupe demande le chiffre.\",\n  \"Ton record avec les buanderies improvisées ? Le groupe demande le chiffre.\",\n  \"Ton pire souvenir avec les hôtels où l'on revient ? Raconte.\",\n  \"Qu'est-ce qui change avec les ascenseurs bloqués selon la personne ?\",\n  \"Qu'est-ce qui change avec les voisins curieux selon la personne ?\",\n  \"Ton pire souvenir avec les appels interrompus ? Raconte.\",\n  \"C'est quoi ton meilleur souvenir avec les amis avec avantages ?\",\n  \"les plans express : oui, non, ou tu rêves ?\",\n  \"As-tu déjà testé les lits qui craquent ? Raconte.\",\n  \"As-tu déjà testé les promesses de 4 h du matin ? Raconte.\",\n  \"As-tu déjà testé les morsures qui marquent ? Raconte.\",\n  \"Ton pire souvenir avec les orgasmes simulés ? Raconte.\",\n  \"Ton pire souvenir avec les cheveux tirés (gentiment) ? Raconte.\",\n  \"les jambes qui lâchent : oui, non, ou tu rêves ?\",\n  \"Tu recommencerais avec les marques sur la nuque ? Pourquoi ?\",\n  \"As-tu déjà testé les liens en soie ? Raconte.\",\n  \"C'est quoi ton avis sur les griffures dans le dos ? Sois honnête.\",\n  \"Tu recommencerais avec les nuits à 4 rounds ? Pourquoi ?\",\n  \"Tu recommencerais avec les douches à trois températures ? Pourquoi ?\",\n  \"Ton record avec les essais trouvés sur Internet ? Le groupe demande le chiffre.\",\n  \"Qu'est-ce qui change avec les glaçons qui fondent selon la personne ?\",\n  \"C'est quoi ton meilleur souvenir avec les marques sur la nuque ?\",\n  \"C'est quoi ton avis sur les gémissements forts ? Sois honnête.\",\n  \"Tu recommencerais avec les liens en soie ? Pourquoi ?\",\n  \"Tu recommencerais avec les amis avec avantages ? Pourquoi ?\",\n  \"As-tu déjà testé les bureaux après les heures ? Raconte.\",\n  \"C'est quoi ton avis sur les goûts qui surprennent ? Sois honnête.\",\n  \"C'est quoi ton avis sur les odeurs intimes ? Sois honnête.\",\n  \"les bureaux après les heures : oui, non, ou tu rêves ?\",\n  \"Ton record avec les piscines nocturnes ? Le groupe demande le chiffre.\",\n  \"les lits qui craquent : oui, non, ou tu rêves ?\",\n  \"Ton record avec les ascenseurs bloqués ? Le groupe demande le chiffre.\",\n  \"C'est quoi ton avis sur les croisées de la salle de sport ? Sois honnête.\",\n  \"Ton record avec les nuits à 4 rounds ? Le groupe demande le chiffre.\",\n  \"C'est quoi ton meilleur souvenir avec les bureaux après les heures ?\",\n  \"C'est quoi ton avis sur les lits qui craquent ? Sois honnête.\",\n  \"As-tu déjà testé les huiles de massage ? Raconte.\",\n  \"Ton pire souvenir avec les tentes qui bougent ? Raconte.\",\n  \"Qu'est-ce qui change avec les poignets tenus selon la personne ?\",\n  \"les orgasmes simulés : oui, non, ou tu rêves ?\",\n  \"C'est quoi ton meilleur souvenir avec les soirées qui dégénèrent ?\",\n  \"C'est quoi ton avis sur les hôtels où l'on revient ? Sois honnête.\",\n  \"Qu'est-ce qui change avec les ex de retour pour une nuit selon la personne ?\",\n  \"C'est quoi ton avis sur les terrasses à minuit ? Sois honnête.\",\n  \"les bandeaux serrés : oui, non, ou tu rêves ?\",\n  \"Ton record avec les cages d'escalier ? Le groupe demande le chiffre.\",\n  \"C'est quoi ton meilleur souvenir avec les jambes qui lâchent ?\",\n  \"As-tu déjà testé les poignets tenus ? Raconte.\",\n  \"Tu recommencerais avec les positions acrobatiques ? Pourquoi ?\",\n  \"C'est quoi ton meilleur souvenir avec les cages d'escalier ?\",\n  \"C'est quoi ton avis sur les tentes qui bougent ? Sois honnête.\",\n  \"C'est quoi ton meilleur souvenir avec les terrasses à minuit ?\",\n  \"les miroirs au plafond : oui, non, ou tu rêves ?\",\n  \"Qu'est-ce qui change avec les nuits à 4 rounds selon la personne ?\",\n  \"As-tu déjà testé les bandeaux serrés ? Raconte.\",\n  \"Ton record avec les appels interrompus ? Le groupe demande le chiffre.\",\n  \"Qu'est-ce qui change avec les douches à trois températures selon la personne ?\",\n  \"C'est quoi ton avis sur les marques sur la nuque ? Sois honnête.\",\n  \"Tu recommencerais avec les voitures embuées ? Pourquoi ?\",\n  \"C'est quoi ton avis sur les records battus ? Sois honnête.\",\n  \"Qu'est-ce qui change avec les soirées qui dégénèrent selon la personne ?\",\n  \"As-tu déjà testé les tentes qui bougent ? Raconte.\",\n  \"C'est quoi ton meilleur souvenir avec les goûts qui surprennent ?\",\n  \"As-tu déjà testé les records battus ? Raconte.\",\n  \"C'est quoi ton meilleur souvenir avec les voisins curieux ?\",\n  \"C'est quoi ton meilleur souvenir avec les poignets tenus ?\",\n  \"Ton record avec les glaçons qui fondent ? Le groupe demande le chiffre.\",\n  \"C'est quoi ton meilleur souvenir avec les chutes du lit ?\",\n  \"Tu recommencerais avec les miroirs au plafond ? Pourquoi ?\",\n  \"Qu'est-ce qui change avec les plans express selon la personne ?\",\n  \"C'est quoi ton meilleur souvenir avec les positions acrobatiques ?\",\n  \"C'est quoi ton meilleur souvenir avec les défis d'endurance ?\",\n  \"Qu'est-ce qui change avec les cris étouffés selon la personne ?\",\n  \"C'est quoi ton avis sur les lendemains sans prénom ? Sois honnête.\",\n  \"As-tu déjà testé les messages à 3 h du matin ? Raconte.\",\n  \"C'est quoi ton meilleur souvenir avec les tentes qui bougent ?\",\n  \"Ton pire souvenir avec les records battus ? Raconte.\",\n  \"Qu'est-ce qui change avec les piscines nocturnes selon la personne ?\",\n  \"Qu'est-ce qui change avec les huiles de massage selon la personne ?\",\n  \"As-tu déjà testé les appels interrompus ? Raconte.\",\n  \"As-tu déjà testé les ex de retour pour une nuit ? Raconte.\",\n  \"C'est quoi ton meilleur souvenir avec les records battus ?\",\n  \"Qu'est-ce qui change avec les cheveux tirés (gentiment) selon la personne ?\",\n  \"Tu recommencerais avec les salles de réunion vides ? Pourquoi ?\",\n  \"Tu recommencerais avec les glaçons qui fondent ? Pourquoi ?\",\n  \"Qu'est-ce qui change avec les cabines de plage selon la personne ?\",\n  \"As-tu déjà testé les soirées qui dégénèrent ? Raconte.\",\n  \"C'est quoi ton avis sur les nuits à 4 rounds ? Sois honnête.\",\n  \"Qu'est-ce qui change avec les essais trouvés sur Internet selon la personne ?\",\n  \"C'est quoi ton avis sur les ex de retour pour une nuit ? Sois honnête.\",\n  \"As-tu déjà testé les bains de minuit ? Raconte.\",\n  \"C'est quoi ton avis sur les serveurs et serveuses trop beaux ? Sois honnête.\",\n  \"Tu recommencerais avec les collègues trop proches ? Pourquoi ?\",\n  \"As-tu déjà testé les voisins curieux ? Raconte.\",\n  \"Qu'est-ce qui change avec les positions acrobatiques selon la personne ?\",\n  \"Tu recommencerais avec les ordres doux ? Pourquoi ?\",\n  \"C'est quoi ton meilleur souvenir avec les ordres doux ?\",\n  \"Tu recommencerais avec les griffures dans le dos ? Pourquoi ?\",\n  \"Tu recommencerais avec les jambes qui lâchent ? Pourquoi ?\",\n  \"Ton pire souvenir avec les poignets tenus ? Raconte.\",\n  \"les essais trouvés sur Internet : oui, non, ou tu rêves ?\",\n  \"Ton record avec les cris étouffés ? Le groupe demande le chiffre.\",\n  \"Qu'est-ce qui change avec les goûts qui surprennent selon la personne ?\",\n  \"C'est quoi ton avis sur les collègues trop proches ? Sois honnête.\",\n  \"C'est quoi ton avis sur les jambes qui lâchent ? Sois honnête.\",\n  \"Tu recommencerais avec les terrasses à minuit ? Pourquoi ?\",\n  \"C'est quoi ton meilleur souvenir avec les morsures qui marquent ?\",\n  \"As-tu déjà testé les hôtels où l'on revient ? Raconte.\",\n  \"les nuits à 4 rounds : oui, non, ou tu rêves ?\",\n  \"les garages bruyants : oui, non, ou tu rêves ?\",\n  \"Ton pire souvenir avec les serveurs et serveuses trop beaux ? Raconte.\",\n  \"C'est quoi ton avis sur les appels interrompus ? Sois honnête.\",\n  \"As-tu déjà testé les lendemains sans prénom ? Raconte.\",\n  \"Tu recommencerais avec les soirées qui dégénèrent ? Pourquoi ?\",\n  \"Tu recommencerais avec les cris étouffés ? Pourquoi ?\",\n  \"As-tu déjà testé les jambes qui lâchent ? Raconte.\",\n  \"Tu recommencerais avec les chutes du lit ? Pourquoi ?\",\n  \"Ton record avec les ordres doux ? Le groupe demande le chiffre.\",\n  \"Tu recommencerais avec les lits qui craquent ? Pourquoi ?\"\n],\n    action: [\n  \"Envoie un audio « chaud » de 15 secondes à la personne que le groupe choisit.\",\n  \"Envoie le sexto que tu n'as jamais osé écrire. Copie-le ici.\",\n  \"Décris ce que tu ferais à la personne de ton choix ici, si elle était là.\",\n  \"Fais 10 pompes... en sous-vêtements. Le groupe compte à voix haute.\",\n  \"Gémis le prénom de la personne à ta droite comme dans un film. Deux fois.\",\n  \"Envoie une photo de toi dans la tenue que tu portes VRAIMENT maintenant.\",\n  \"Imite (voix + visage) ton orgasme... version cinéma muet.\",\n  \"Fais un lap dance sur une chaise. Cam ouverte.\",\n  \"Raconte ta meilleure nuit en la chantant.\",\n  \"Déclare ton « plan de la nuit » à la personne désignée par le groupe.\",\n  \"Strip-tease : enlève deux vêtements, lentement, sans rien montrer d'interdit.\",\n  \"Décris ton dernier rapport à voix haute : début, milieu, fin. 30 secondes.\",\n  \"Chuchote à la caméra le mot sale qui t'excite le plus. 3 fois.\",\n  \"Mime la position que tu n'as jamais testée. Le groupe devine.\",\n  \"Lèche ton doigt, touche ta lèvre en regardant la cam. 10 secondes. Silence total.\",\n  \"Fais deviner ton niveau d'endurance en imitant ton souffle de fin.\",\n  \"Décris la première image qui te vient quand tu fermes les yeux. Directement.\",\n  \"Envoie un vocal où tu comptes de 10 à 1 avec une voix de plus en plus basse.\",\n  \"Montre le dernier emoji que tu as envoyé à quelqu'un chaud et explique.\",\n  \"Mime comment tu touches quelqu'un la première fois : lent, hésitant, puis sûr.\",\n  \"Envoie un message vocal où tu répètes « je suis sage » de façon de moins en moins crédible.\",\n  \"Imite la voix que tu fais quand tu demandes « encore ».\",\n  \"Décris la tenue que tu enlèverais en premier chez la personne en face.\",\n  \"Fais deviner ton fantasme avec 3 mots-indices. 2 essais pour le groupe.\",\n  \"Mime un déshabillage qui tourne mal (comédie totale).\",\n  \"Chuchote ton fantasme du moment comme si le groupe était ton amoureux secret.\",\n  \"Envoie un vocal de rire qui finit en gémissement. Le groupe juge la transition.\",\n  \"Décris ton rituel avant une nuit chaude, mimes compris.\",\n  \"Mime ce que tu ferais si tu étais seul(e) ce soir. 20 secondes, sans gêne.\",\n  \"Envoie ta routine de réveil version torride : 15 secondes de cam matinale.\",\n  \"Fais un vocal en chuchotant comme si quelqu'un dormait juste à côté de toi.\",\n  \"Prends la pose exacte de ta meilleure photo chaude. 10 secondes, immobile.\",\n  \"Mime un baiser lent avec la main de quelqu'un d'ici (avec son accord).\",\n  \"Décris ton menu de nuit : entrée, plat, dessert... version intime.\",\n  \"Écris un sexto de 3 lignes ici. Le joueur à droite note sur 10.\",\n  \"Raconte ta première fois en 5 mots exactement. Le groupe devine le reste.\",\n  \"Montre comment tu embrasserais quelqu'un de plus grand que toi. Support : coussin.\",\n  \"Imite ta démarche après une nuit parfaite. 15 secondes de satisfaction visible.\",\n  \"Fais la promo d'un faux parfum nommé « Toi ce soir ». Slogan obligatoire.\",\n  \"Laisse le groupe choisir un mot : dis-le de la manière la plus sensuelle possible.\",\n  \"Fais deviner une zone de ton corps en la touchant. 3 essais pour le groupe.\",\n  \"Mime ta plus grosse honte intime. Le groupe devine l'histoire complète.\",\n  \"Décris ce que tu regardes en premier chez un corps nu. Sois précis.\",\n  \"Envoie un vocal où tu répètes « là, tout de suite, maintenant » de 3 façons.\",\n  \"Imite ta réaction si quelqu'un te surprenait dans un moment intime. Théâtre complet.\",\n  \"Décris ton dernier baiser détaillé au millimètre. 20 secondes.\",\n  \"Montre comment tu ôtes une robe ou une chemise de façon irrésistible (sur toi).\",\n  \"Fais un commentaire sportif complet de ta dernière nuit. Score final autorisé.\",\n  \"Mime le moment exact où tu perds le contrôle. 10 secondes.\",\n  \"Chante le mot « encore » comme un refrain de mariage.\",\n  \"Envoie un vocal où tu décris ce que tu ferais ce soir à la personne de ton choix, sans censure. 20 secondes maximum.\",\n  \"Envoie un vocal où tu gémis de la manière la plus réaliste possible, le groupe note sur 10. 20 secondes maximum.\",\n  \"Envoie un vocal où tu chuchotes le prénom d'un joueur comme au lit, 5 fois. 20 secondes maximum.\",\n  \"Envoie un vocal où tu racontes ta dernière nuit en chuchotant à l'oreille de la caméra. 20 secondes maximum.\",\n  \"Envoie un vocal où tu répètes « encore » en montant d'intensité à chaque fois. 20 secondes maximum.\",\n  \"Envoie un vocal où tu imites ton souffle du moment exact avant la fin. 20 secondes maximum.\",\n  \"Envoie un vocal où tu décris la tenue que tu portes en ce moment, ton la plus intime. 20 secondes maximum.\",\n  \"Envoie un vocal où tu fais deviner ta position favorite uniquement par des sons. 20 secondes maximum.\",\n  \"Envoie un vocal où tu imites la voix que tu fais quand tu demandes un service chaud. 20 secondes maximum.\",\n  \"Envoie un vocal où tu racontes ce que tu regardes chez un corps, du haut vers le bas. 20 secondes maximum.\",\n  \"Envoie un vocal où tu chuchotes un secret que tu n'as jamais dit à voix haute. 20 secondes maximum.\",\n  \"Envoie un vocal où tu répètes « je suis à toi » de 3 façons différentes. 20 secondes maximum.\",\n  \"Envoie un vocal où tu imites une soirée qui dégénère : rire, soupir, gémissement. 20 secondes maximum.\",\n  \"Envoie un vocal où tu décris ton odeur de peau du moment comme une pub de parfum. 20 secondes maximum.\",\n  \"Envoie un vocal où tu chantes un slow en remplaçant tous les mots par « toi ». 20 secondes maximum.\",\n  \"Envoie un vocal où tu imites la dernière phrase que tu as dite après l'action. 20 secondes maximum.\",\n  \"Envoie un vocal où tu racontes ta panne la plus honteuse en mode actualité télé. 20 secondes maximum.\",\n  \"Envoie un vocal où tu décris les mains parfaites : où elles commencent, où elles finissent. 20 secondes maximum.\",\n  \"Envoie un vocal où tu fais une météo du désir : « aujourd'hui, fortes envies sur la côte… ». 20 secondes maximum.\",\n  \"Envoie un vocal où tu imites l'appel que tu ferais à 2 h du matin. 20 secondes maximum.\",\n  \"Envoie un vocal où tu chuchotes « je ne devrais pas dire ça » puis dis-le quand même. 20 secondes maximum.\",\n  \"Envoie un vocal où tu décris en 5 mots exactement ton niveau ce soir. 20 secondes maximum.\",\n  \"Envoie un vocal où tu imites le répondeur de ton plan : « laisse un message après le bip ». 20 secondes maximum.\",\n  \"Envoie un vocal où tu fais deviner un mot sale par ta seule intonation. 20 secondes maximum.\",\n  \"Envoie un vocal où tu racontes ta dernière envie en pleine journée, où et avec qui. 20 secondes maximum.\",\n  \"Envoie un vocal où tu chuchotes ta promesse de nuit comme un serment. 20 secondes maximum.\",\n  \"Envoie un vocal où tu imites un slow radio en le transformant en déclaration directe. 20 secondes maximum.\",\n  \"Envoie un vocal où tu décris le bruit parfait du lit, du mur et du voisin. 20 secondes maximum.\",\n  \"Envoie un vocal où tu répètes « chut » comme si la maison était pleine. 20 secondes maximum.\",\n  \"Envoie un vocal où tu fais l'annonce officielle de ton « talent caché » de la nuit. 20 secondes maximum.\",\n  \"Envoie un vocal où tu imites ta réaction à un nude reçu : 3 sons, 3 étages. 20 secondes maximum.\",\n  \"Envoie un vocal où tu décris la nuit parfaite en 20 secondes chrono, du début à la fin. 20 secondes maximum.\",\n  \"Envoie un vocal où tu chuchotes ce que tu enlèverais en premier, puis en deuxième. 20 secondes maximum.\",\n  \"Envoie un vocal où tu imites un commentateur de match pendant 10 secondes d'action. 20 secondes maximum.\",\n  \"Envoie un vocal où tu racontes la nuit dont tes amis ne connaissent rien. 20 secondes maximum.\",\n  \"Fais un lap dance complet sur une chaise. Cam ouverte, sans gêne. Le groupe juge.\",\n  \"Fais un strip des deux vêtements choisis par le groupe (rien d'interdit à montrer). Cam ouverte, sans gêne. Le groupe juge.\",\n  \"Fais le mime exact de ta position préférée. Cam ouverte, sans gêne. Le groupe juge.\",\n  \"Fais le regard « viens » le plus profond de ta vie, 10 secondes. Cam ouverte, sans gêne. Le groupe juge.\",\n  \"Fais le mime d'un baiser qui monte en intensité, 15 secondes. Cam ouverte, sans gêne. Le groupe juge.\",\n  \"Fais la démonstration de ta main sur ta propre nuque puis ton épaule. Cam ouverte, sans gêne. Le groupe juge.\",\n  \"Fais le mime de « presque » : t'arrêtes juste avant la morsure. Cam ouverte, sans gêne. Le groupe juge.\",\n  \"Fais le miroir : ton imitation de toi-même qui se prépare pour une nuit. Cam ouverte, sans gêne. Le groupe juge.\",\n  \"Fais la pose de ta plus belle photo chaude, 3 angles. Cam ouverte, sans gêne. Le groupe juge.\",\n  \"Fais le soupir le plus réaliste après une longue nuit. Cam ouverte, sans gêne. Le groupe juge.\",\n  \"Fais la marche du retour à l'aube : démarche complète. Cam ouverte, sans gêne. Le groupe juge.\",\n  \"Fais le mime d'une main qui glisse sous une chemise (la tienne). Cam ouverte, sans gêne. Le groupe juge.\",\n  \"Fais la démonstration de comment tu mordrais (sur ton poignet). Cam ouverte, sans gêne. Le groupe juge.\",\n  \"Fais le silence : 10 secondes de regard qui dit tout. Cam ouverte, sans gêne. Le groupe juge.\",\n  \"Fais le mime d'un bouton qu'on n'arrive pas à défaire, tension maximale. Cam ouverte, sans gêne. Le groupe juge.\",\n  \"Fais la démonstration de ton massage signature (sur ton propre bras). Cam ouverte, sans gêne. Le groupe juge.\",\n  \"Fais le miroir : le regard du lendemain matin, sourire inclus. Cam ouverte, sans gêne. Le groupe juge.\",\n  \"Fais le mime du « chut » avec le doigt sur les lèvres, 10 secondes. Cam ouverte, sans gêne. Le groupe juge.\",\n  \"Fais la démonstration du sourire qui excuse tout. Cam ouverte, sans gêne. Le groupe juge.\",\n  \"Fais la pose de la personne qui attend dans le noir. Cam ouverte, sans gêne. Le groupe juge.\",\n  \"Fais le mime du frisson quand on te souffle dans le cou. Cam ouverte, sans gêne. Le groupe juge.\",\n  \"Fais la démonstration de comment tu montres ton accord sans un mot. Cam ouverte, sans gêne. Le groupe juge.\",\n  \"Fais le regard qui monte puis qui descend : deux secondes chaque. Cam ouverte, sans gêne. Le groupe juge.\",\n  \"Fais le mime du câlin qui ne veut pas lâcher, 15 secondes. Cam ouverte, sans gêne. Le groupe juge.\",\n  \"Fais la démonstration de ta façon d'ouvrir une porte le soir. Cam ouverte, sans gêne. Le groupe juge.\",\n  \"Fais le mime du téléphone posé en mode « ne me dérange plus ». Cam ouverte, sans gêne. Le groupe juge.\",\n  \"Fais la démonstration de ta façon d'attendre contre un mur. Cam ouverte, sans gêne. Le groupe juge.\",\n  \"Fais le mime de la chute douce sur le lit, 3 secondes. Cam ouverte, sans gêne. Le groupe juge.\",\n  \"Fais la démonstration de ta respiration du début à la fin. Cam ouverte, sans gêne. Le groupe juge.\",\n  \"Fais le regard du « dernière question : chez toi ou chez moi ? ». Cam ouverte, sans gêne. Le groupe juge.\",\n  \"Fais le mime de la ceinture qu'on défait d'un geste sec. Cam ouverte, sans gêne. Le groupe juge.\",\n  \"Fais la démonstration de ta façon de boire en regardant quelqu'un. Cam ouverte, sans gêne. Le groupe juge.\",\n  \"Fais le mime du vêtement qui glisse tout seul. Cam ouverte, sans gêne. Le groupe juge.\",\n  \"Fais la pose du réveil : étirement complet, 10 secondes. Cam ouverte, sans gêne. Le groupe juge.\",\n  \"Fais le mime du dernier regard avant d'éteindre. Cam ouverte, sans gêne. Le groupe juge.\",\n  \"Écris ici, en public, sans t'arrêter : un sexto de 3 lignes. Le groupe valide ou tu recommences.\",\n  \"Écris ici, en public, sans t'arrêter : la phrase la plus directe que tu n'as jamais osé envoyer. Le groupe valide ou tu recommences.\",\n  \"Écris ici, en public, sans t'arrêter : tout ce que tu ferais ce soir en 5 étapes. Le groupe valide ou tu recommences.\",\n  \"Écris ici, en public, sans t'arrêter : la description exacte de ton ideal physique en 4 lignes. Le groupe valide ou tu recommences.\",\n  \"Écris ici, en public, sans t'arrêter : le message qui ferait craquer le joueur de ton choix. Le groupe valide ou tu recommences.\",\n  \"Écris ici, en public, sans t'arrêter : ta dernière envie précise avec le lieu et l'heure. Le groupe valide ou tu recommences.\",\n  \"Écris ici, en public, sans t'arrêter : le compliment physique le plus chaud sur chaque joueur. Le groupe valide ou tu recommences.\",\n  \"Écris ici, en public, sans t'arrêter : la promesse la plus folle que tu peux tenir. Le groupe valide ou tu recommences.\",\n  \"Écris ici, en public, sans t'arrêter : le mot sale qui t'excite le plus, répété 3 fois avec des variations. Le groupe valide ou tu recommences.\",\n  \"Écris ici, en public, sans t'arrêter : ta définition d'une nuit parfaite en une phrase unique. Le groupe valide ou tu recommences.\",\n  \"Écris ici, en public, sans t'arrêter : la phrase qui te fait dire oui immédiatement. Le groupe valide ou tu recommences.\",\n  \"Écris ici, en public, sans t'arrêter : le texte de la voix que tu envoierais à 2 h du matin. Le groupe valide ou tu recommences.\",\n  \"Écris ici, en public, sans t'arrêter : ton menu du soir : 3 plats, version intime. Le groupe valide ou tu recommences.\",\n  \"Écris ici, en public, sans t'arrêter : la lettre d'amour en 3 lignes qui finit très chaud. Le groupe valide ou tu recommences.\",\n  \"Écris ici, en public, sans t'arrêter : la phrase que tu murmures quand tu perds le contrôle. Le groupe valide ou tu recommences.\",\n  \"Écris ici, en public, sans t'arrêter : le compliment sur la voix du joueur le plus silencieux. Le groupe valide ou tu recommences.\",\n  \"Écris ici, en public, sans t'arrêter : la confession la plus directe jamais écrite ici. Le groupe valide ou tu recommences.\",\n  \"Écris ici, en public, sans t'arrêter : la phrase d'ouverture parfaite pour un plan. Le groupe valide ou tu recommences.\",\n  \"Écris ici, en public, sans t'arrêter : le script de tes 10 premières secondes avec la personne désirée. Le groupe valide ou tu recommences.\",\n  \"Écris ici, en public, sans t'arrêter : le mot que tu serais incapable de dire devant tes parents. Le groupe valide ou tu recommences.\",\n  \"Imite ton orgasme version cinéma muet. Le groupe note le réalisme sur 10.\",\n  \"Imite le rire qui finit en gémissement. Le groupe note le réalisme sur 10.\",\n  \"Imite la voix de quelqu'un qui demande encore. Le groupe note le réalisme sur 10.\",\n  \"Imite le réveil en pleine nuit par un câlin surprise. Le groupe note le réalisme sur 10.\",\n  \"Imite le moment où tu as failli être surpris(e). Le groupe note le réalisme sur 10.\",\n  \"Imite la marche du lendemain après une longue nuit. Le groupe note le réalisme sur 10.\",\n  \"Imite la discussion de couloir entre deux voisines curieuses. Le groupe note le réalisme sur 10.\",\n  \"Imite le son de ta ceinture qui tombe en pleine action. Le groupe note le réalisme sur 10.\",\n  \"Imite le silence radio quand on te demande « tu as fait quoi hier ? ». Le groupe note le réalisme sur 10.\",\n  \"Imite le visage de la personne qui découvre ton secret. Le groupe note le réalisme sur 10.\",\n  \"Imite l'appel de ta mère au pire moment. Le groupe note le réalisme sur 10.\",\n  \"Imite le fou rire au pire moment. Le groupe note le réalisme sur 10.\",\n  \"Imite le moment où le lit crie plus fort que vous. Le groupe note le réalisme sur 10.\",\n  \"Imite la personne qui fait semblant de dormir. Le groupe note le réalisme sur 10.\",\n  \"Imite le soupir du soulagement à la fin. Le groupe note le réalisme sur 10.\",\n  \"Imite le frisson du premier contact glacial. Le groupe note le réalisme sur 10.\",\n  \"Imite le regard paniqué quand la porte s'ouvre. Le groupe note le réalisme sur 10.\",\n  \"Imite le faux départ : prêt puis plus rien. Le groupe note le réalisme sur 10.\",\n  \"Imite le résumé télé de ta semaine : « il paraît que tu… ». Le groupe note le réalisme sur 10.\",\n  \"Imite la voisinne qui répète tout ce qu'elle a entendu. Le groupe note le réalisme sur 10.\",\n  \"Imite le moment où tu dis oui sans réfléchir. Le groupe note le réalisme sur 10.\",\n  \"Imite l'hésitation : trois faux départs avant d'embrasser. Le groupe note le réalisme sur 10.\",\n  \"Imite la tête de la personne qui ouvre le cadeau bizarre. Le groupe note le réalisme sur 10.\",\n  \"Imite le regard innocent après avoir fait une bêtise. Le groupe note le réalisme sur 10.\",\n  \"Imite le « je fais quoi là ? » du matin suivant. Le groupe note le réalisme sur 10.\",\n  \"Décris à voix haute, précisément : le corps parfait selon toi, de la tête aux pieds. 30 secondes.\",\n  \"Décris à voix haute, précisément : ta nuit parfaite, minute par minute. 30 secondes.\",\n  \"Décris à voix haute, précisément : ce que tu ferais avec 24 heures et la personne de ton choix. 30 secondes.\",\n  \"Décris à voix haute, précisément : ton préliminaire préféré comme une recette de cuisine. 30 secondes.\",\n  \"Décris à voix haute, précisément : la dernière fois que tu as perdu la tête. 30 secondes.\",\n  \"Décris à voix haute, précisément : le lieu de tes rêves pour ce soir. 30 secondes.\",\n  \"Décris à voix haute, précisément : la tenue parfaite sur la personne parfaite. 30 secondes.\",\n  \"Décris à voix haute, précisément : le massage complet que tu offrerais. 30 secondes.\",\n  \"Décris à voix haute, précisément : le son le plus excitant du monde selon toi. 30 secondes.\",\n  \"Décris à voix haute, précisément : ton rituel complet avant une nuit chaude. 30 secondes.\",\n  \"Décris à voix haute, précisément : le baiser parfait, du regard à la fin. 30 secondes.\",\n  \"Décris à voix haute, précisément : la façon exacte dont tu aimes être touché(e). 30 secondes.\",\n  \"Décris à voix haute, précisément : ta position favorite et son plan de bataille. 30 secondes.\",\n  \"Décris à voix haute, précisément : le réveil parfait à côté de quelqu'un. 30 secondes.\",\n  \"Décris à voix haute, précisément : la soirée parfaite qui finit dans les draps. 30 secondes.\",\n  \"Décris à voix haute, précisément : le dernier détail que tu as remarqué sur quelqu'un. 30 secondes.\",\n  \"Décris à voix haute, précisément : le lieu public où l'envie t'a gagné(e) et comment tu as tenu. 30 secondes.\",\n  \"Décris à voix haute, précisément : la promesse que tu ferais pour une nuit inoubliable. 30 secondes.\",\n  \"Décris à voix haute, précisément : le téléphone du matin : premier message, ton mot exact. 30 secondes.\",\n  \"Décris à voix haute, précisément : le trou noir de 3 h du matin : à quoi tu penses exactement. 30 secondes.\",\n  \"Explique les amis avec avantages comme une notice de montage. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les messages à 3 h du matin. Le groupe devine.\",\n  \"Raconte ton meilleur souvenir avec les douches à trois températures. 20 secondes.\",\n  \"Explique les piscines nocturnes comme une notice de montage. 20 secondes.\",\n  \"Mime ta plus belle scène avec les douches à trois températures. 15 secondes.\",\n  \"Mime ta plus belle scène avec les appels interrompus. 15 secondes.\",\n  \"Décris les huiles de massage comme un commentateur sportif. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les hôtels où l'on revient. 20 secondes.\",\n  \"Fais deviner les voitures embuées en 3 mimes maximum.\",\n  \"Explique les promesses de 4 h du matin comme une notice de montage. 20 secondes.\",\n  \"Mime ta plus belle scène avec les croisées de la salle de sport. 15 secondes.\",\n  \"Mime ta plus belle scène avec les salles de réunion vides. 15 secondes.\",\n  \"Fais deviner les marques sur la nuque en 3 mimes maximum.\",\n  \"Décris les bandeaux serrés comme un commentateur sportif. 20 secondes.\",\n  \"Fais deviner les bandeaux serrés en 3 mimes maximum.\",\n  \"Fais deviner les bureaux après les heures en 3 mimes maximum.\",\n  \"Mime ta plus belle scène avec les marques sur la nuque. 15 secondes.\",\n  \"Fais une pub de 15 secondes pour les appels interrompus. Slogan obligatoire.\",\n  \"Fais deviner les essais trouvés sur Internet en 3 mimes maximum.\",\n  \"Fais deviner les ascenseurs bloqués en 3 mimes maximum.\",\n  \"Montre le geste parfait pour les poignets tenus. 10 secondes.\",\n  \"Décris les essais trouvés sur Internet comme un commentateur sportif. 20 secondes.\",\n  \"Montre le geste parfait pour les positions acrobatiques. 10 secondes.\",\n  \"Mime ta plus belle scène avec les orgasmes simulés. 15 secondes.\",\n  \"Explique les jambes qui lâchent comme une notice de montage. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les terrasses à minuit. Slogan obligatoire.\",\n  \"Imite quelqu'un qui découvre les cages d'escalier. Le groupe devine.\",\n  \"Fais une pub de 15 secondes pour les cheveux tirés (gentiment). Slogan obligatoire.\",\n  \"Mime ta plus belle scène avec les bains de minuit. 15 secondes.\",\n  \"Imite quelqu'un qui découvre les miroirs au plafond. Le groupe devine.\",\n  \"Fais une pub de 15 secondes pour les orgasmes simulés. Slogan obligatoire.\",\n  \"Fais une pub de 15 secondes pour les liens en soie. Slogan obligatoire.\",\n  \"Explique les voisins curieux comme une notice de montage. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les lits qui craquent. Le groupe devine.\",\n  \"Raconte ton meilleur souvenir avec les collègues trop proches. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les soirées qui dégénèrent. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les cages d'escalier. Slogan obligatoire.\",\n  \"Raconte ton meilleur souvenir avec les appels interrompus. 20 secondes.\",\n  \"Décris les bains de minuit comme un commentateur sportif. 20 secondes.\",\n  \"Mime ta plus belle scène avec les liens en soie. 15 secondes.\",\n  \"Décris les garages bruyants comme un commentateur sportif. 20 secondes.\",\n  \"Mime ta plus belle scène avec les lendemains sans prénom. 15 secondes.\",\n  \"Montre le geste parfait pour les liens en soie. 10 secondes.\",\n  \"Montre le geste parfait pour les jambes qui lâchent. 10 secondes.\",\n  \"Décris les lits qui craquent comme un commentateur sportif. 20 secondes.\",\n  \"Mime ta plus belle scène avec les cris étouffés. 15 secondes.\",\n  \"Imite quelqu'un qui découvre les huiles de massage. Le groupe devine.\",\n  \"Décris les odeurs intimes comme un commentateur sportif. 20 secondes.\",\n  \"Explique les ascenseurs bloqués comme une notice de montage. 20 secondes.\",\n  \"Fais deviner les ex de retour pour une nuit en 3 mimes maximum.\",\n  \"Fais deviner les buanderies improvisées en 3 mimes maximum.\",\n  \"Montre le geste parfait pour les voisins curieux. 10 secondes.\",\n  \"Fais une pub de 15 secondes pour les défis d'endurance. Slogan obligatoire.\",\n  \"Décris les serveurs et serveuses trop beaux comme un commentateur sportif. 20 secondes.\",\n  \"Décris les cabines de plage comme un commentateur sportif. 20 secondes.\",\n  \"Fais deviner les appels interrompus en 3 mimes maximum.\",\n  \"Montre le geste parfait pour les essais trouvés sur Internet. 10 secondes.\",\n  \"Montre le geste parfait pour les morsures qui marquent. 10 secondes.\",\n  \"Décris les miroirs au plafond comme un commentateur sportif. 20 secondes.\",\n  \"Montre le geste parfait pour les plans express. 10 secondes.\",\n  \"Fais deviner les serveurs et serveuses trop beaux en 3 mimes maximum.\",\n  \"Montre le geste parfait pour les collègues trop proches. 10 secondes.\",\n  \"Fais une pub de 15 secondes pour les buanderies improvisées. Slogan obligatoire.\",\n  \"Fais deviner les tentes qui bougent en 3 mimes maximum.\",\n  \"Explique les miroirs au plafond comme une notice de montage. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les griffures dans le dos. Slogan obligatoire.\",\n  \"Mime ta plus belle scène avec les bureaux après les heures. 15 secondes.\",\n  \"Fais deviner les gémissements forts en 3 mimes maximum.\",\n  \"Fais une pub de 15 secondes pour les croisées de la salle de sport. Slogan obligatoire.\",\n  \"Explique les cris étouffés comme une notice de montage. 20 secondes.\",\n  \"Montre le geste parfait pour les appels interrompus. 10 secondes.\",\n  \"Fais une pub de 15 secondes pour les voisins curieux. Slogan obligatoire.\",\n  \"Montre le geste parfait pour les soirées qui dégénèrent. 10 secondes.\",\n  \"Imite quelqu'un qui découvre les chutes du lit. Le groupe devine.\",\n  \"Fais deviner les cabines de plage en 3 mimes maximum.\",\n  \"Raconte ton meilleur souvenir avec les bandeaux serrés. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les chutes du lit. Slogan obligatoire.\",\n  \"Raconte ton meilleur souvenir avec les marques sur la nuque. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les messages à 3 h du matin. Slogan obligatoire.\",\n  \"Raconte ton meilleur souvenir avec les voisins curieux. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les morsures qui marquent. Le groupe devine.\",\n  \"Explique les serveurs et serveuses trop beaux comme une notice de montage. 20 secondes.\",\n  \"Décris les plans express comme un commentateur sportif. 20 secondes.\",\n  \"Décris les amis avec avantages comme un commentateur sportif. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les amis avec avantages. Le groupe devine.\",\n  \"Décris les jambes qui lâchent comme un commentateur sportif. 20 secondes.\",\n  \"Fais deviner les hôtels où l'on revient en 3 mimes maximum.\",\n  \"Mime ta plus belle scène avec les messages à 3 h du matin. 15 secondes.\",\n  \"Explique les hôtels où l'on revient comme une notice de montage. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les morsures qui marquent. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les bains de minuit. 20 secondes.\",\n  \"Décris les douches à trois températures comme un commentateur sportif. 20 secondes.\",\n  \"Explique les poignets tenus comme une notice de montage. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les voitures embuées. 20 secondes.\",\n  \"Mime ta plus belle scène avec les tentes qui bougent. 15 secondes.\",\n  \"Fais deviner les lendemains sans prénom en 3 mimes maximum.\",\n  \"Montre le geste parfait pour les défis d'endurance. 10 secondes.\",\n  \"Décris les collègues trop proches comme un commentateur sportif. 20 secondes.\",\n  \"Décris les glaçons qui fondent comme un commentateur sportif. 20 secondes.\",\n  \"Montre le geste parfait pour les piscines nocturnes. 10 secondes.\",\n  \"Imite quelqu'un qui découvre les ascenseurs bloqués. Le groupe devine.\",\n  \"Fais deviner les nuits à 4 rounds en 3 mimes maximum.\",\n  \"Fais deviner les garages bruyants en 3 mimes maximum.\",\n  \"Raconte ton meilleur souvenir avec les plans express. 20 secondes.\",\n  \"Décris les cages d'escalier comme un commentateur sportif. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les garages bruyants. Le groupe devine.\",\n  \"Explique les soirées qui dégénèrent comme une notice de montage. 20 secondes.\",\n  \"Explique les salles de réunion vides comme une notice de montage. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les lits qui craquent. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les cheveux tirés (gentiment). 20 secondes.\",\n  \"Explique les odeurs intimes comme une notice de montage. 20 secondes.\",\n  \"Montre le geste parfait pour les miroirs au plafond. 10 secondes.\",\n  \"Explique les buanderies improvisées comme une notice de montage. 20 secondes.\",\n  \"Montre le geste parfait pour les promesses de 4 h du matin. 10 secondes.\",\n  \"Imite quelqu'un qui découvre les bandeaux serrés. Le groupe devine.\",\n  \"Mime ta plus belle scène avec les essais trouvés sur Internet. 15 secondes.\",\n  \"Mime ta plus belle scène avec les ordres doux. 15 secondes.\",\n  \"Fais deviner les chutes du lit en 3 mimes maximum.\",\n  \"Fais deviner les morsures qui marquent en 3 mimes maximum.\",\n  \"Imite quelqu'un qui découvre les cheveux tirés (gentiment). Le groupe devine.\",\n  \"Montre le geste parfait pour les records battus. 10 secondes.\",\n  \"Explique les morsures qui marquent comme une notice de montage. 20 secondes.\",\n  \"Fais deviner les goûts qui surprennent en 3 mimes maximum.\",\n  \"Montre le geste parfait pour les voitures embuées. 10 secondes.\",\n  \"Montre le geste parfait pour les lits qui craquent. 10 secondes.\",\n  \"Explique les liens en soie comme une notice de montage. 20 secondes.\",\n  \"Mime ta plus belle scène avec les ex de retour pour une nuit. 15 secondes.\",\n  \"Montre le geste parfait pour les hôtels où l'on revient. 10 secondes.\",\n  \"Explique les goûts qui surprennent comme une notice de montage. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les essais trouvés sur Internet. 20 secondes.\",\n  \"Montre le geste parfait pour les glaçons qui fondent. 10 secondes.\",\n  \"Raconte ton meilleur souvenir avec les miroirs au plafond. 20 secondes.\",\n  \"Explique les tentes qui bougent comme une notice de montage. 20 secondes.\",\n  \"Décris les goûts qui surprennent comme un commentateur sportif. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les amis avec avantages. 20 secondes.\",\n  \"Explique les huiles de massage comme une notice de montage. 20 secondes.\",\n  \"Mime ta plus belle scène avec les lits qui craquent. 15 secondes.\",\n  \"Raconte ton meilleur souvenir avec les tentes qui bougent. 20 secondes.\",\n  \"Décris les salles de réunion vides comme un commentateur sportif. 20 secondes.\",\n  \"Décris les cris étouffés comme un commentateur sportif. 20 secondes.\",\n  \"Montre le geste parfait pour les tentes qui bougent. 10 secondes.\",\n  \"Mime ta plus belle scène avec les buanderies improvisées. 15 secondes.\",\n  \"Mime ta plus belle scène avec les huiles de massage. 15 secondes.\",\n  \"Décris les cheveux tirés (gentiment) comme un commentateur sportif. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les records battus. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les croisées de la salle de sport. 20 secondes.\",\n  \"Explique les lits qui craquent comme une notice de montage. 20 secondes.\",\n  \"Fais deviner les piscines nocturnes en 3 mimes maximum.\",\n  \"Fais une pub de 15 secondes pour les ex de retour pour une nuit. Slogan obligatoire.\",\n  \"Décris les poignets tenus comme un commentateur sportif. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les défis d'endurance. 20 secondes.\",\n  \"Mime ta plus belle scène avec les cages d'escalier. 15 secondes.\",\n  \"Fais deviner les jambes qui lâchent en 3 mimes maximum.\",\n  \"Mime ta plus belle scène avec les hôtels où l'on revient. 15 secondes.\",\n  \"Mime ta plus belle scène avec les amis avec avantages. 15 secondes.\",\n  \"Fais une pub de 15 secondes pour les amis avec avantages. Slogan obligatoire.\",\n  \"Montre le geste parfait pour les odeurs intimes. 10 secondes.\",\n  \"Montre le geste parfait pour les bandeaux serrés. 10 secondes.\",\n  \"Fais deviner les cages d'escalier en 3 mimes maximum.\",\n  \"Montre le geste parfait pour les goûts qui surprennent. 10 secondes.\",\n  \"Imite quelqu'un qui découvre les douches à trois températures. Le groupe devine.\",\n  \"Explique les croisées de la salle de sport comme une notice de montage. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les appels interrompus. Le groupe devine.\",\n  \"Imite quelqu'un qui découvre les tentes qui bougent. Le groupe devine.\",\n  \"Raconte ton meilleur souvenir avec les buanderies improvisées. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les collègues trop proches. Le groupe devine.\",\n  \"Raconte ton meilleur souvenir avec les nuits à 4 rounds. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les collègues trop proches. Slogan obligatoire.\",\n  \"Raconte ton meilleur souvenir avec les huiles de massage. 20 secondes.\",\n  \"Explique les garages bruyants comme une notice de montage. 20 secondes.\",\n  \"Fais deviner les croisées de la salle de sport en 3 mimes maximum.\",\n  \"Imite quelqu'un qui découvre les lendemains sans prénom. Le groupe devine.\",\n  \"Explique les cages d'escalier comme une notice de montage. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les promesses de 4 h du matin. Slogan obligatoire.\",\n  \"Fais deviner les huiles de massage en 3 mimes maximum.\",\n  \"Imite quelqu'un qui découvre les buanderies improvisées. Le groupe devine.\",\n  \"Fais deviner les glaçons qui fondent en 3 mimes maximum.\",\n  \"Montre le geste parfait pour les ex de retour pour une nuit. 10 secondes.\",\n  \"Fais deviner les records battus en 3 mimes maximum.\",\n  \"Mime ta plus belle scène avec les positions acrobatiques. 15 secondes.\",\n  \"Mime ta plus belle scène avec les voisins curieux. 15 secondes.\",\n  \"Fais deviner les collègues trop proches en 3 mimes maximum.\",\n  \"Raconte ton meilleur souvenir avec les bureaux après les heures. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les garages bruyants. Slogan obligatoire.\",\n  \"Fais deviner les amis avec avantages en 3 mimes maximum.\",\n  \"Mime ta plus belle scène avec les voitures embuées. 15 secondes.\",\n  \"Raconte ton meilleur souvenir avec les jambes qui lâchent. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les orgasmes simulés. Le groupe devine.\",\n  \"Explique les ex de retour pour une nuit comme une notice de montage. 20 secondes.\",\n  \"Fais deviner les terrasses à minuit en 3 mimes maximum.\",\n  \"Fais deviner les défis d'endurance en 3 mimes maximum.\",\n  \"Mime ta plus belle scène avec les ascenseurs bloqués. 15 secondes.\",\n  \"Fais une pub de 15 secondes pour les records battus. Slogan obligatoire.\",\n  \"Décris les terrasses à minuit comme un commentateur sportif. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les essais trouvés sur Internet. Le groupe devine.\",\n  \"Montre le geste parfait pour les cages d'escalier. 10 secondes.\",\n  \"Décris les ascenseurs bloqués comme un commentateur sportif. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les voitures embuées. Slogan obligatoire.\",\n  \"Explique les bains de minuit comme une notice de montage. 20 secondes.\",\n  \"Explique les cabines de plage comme une notice de montage. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les salles de réunion vides. 20 secondes.\",\n  \"Décris les liens en soie comme un commentateur sportif. 20 secondes.\",\n  \"Mime ta plus belle scène avec les poignets tenus. 15 secondes.\",\n  \"Fais une pub de 15 secondes pour les lits qui craquent. Slogan obligatoire.\",\n  \"Fais une pub de 15 secondes pour les jambes qui lâchent. Slogan obligatoire.\",\n  \"Raconte ton meilleur souvenir avec les gémissements forts. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les gémissements forts. Slogan obligatoire.\",\n  \"Décris les voitures embuées comme un commentateur sportif. 20 secondes.\",\n  \"Montre le geste parfait pour les cris étouffés. 10 secondes.\",\n  \"Fais une pub de 15 secondes pour les serveurs et serveuses trop beaux. Slogan obligatoire.\",\n  \"Explique les essais trouvés sur Internet comme une notice de montage. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les odeurs intimes. Slogan obligatoire.\",\n  \"Imite quelqu'un qui découvre les serveurs et serveuses trop beaux. Le groupe devine.\",\n  \"Décris les hôtels où l'on revient comme un commentateur sportif. 20 secondes.\",\n  \"Montre le geste parfait pour les lendemains sans prénom. 10 secondes.\",\n  \"Fais deviner les soirées qui dégénèrent en 3 mimes maximum.\",\n  \"Mime ta plus belle scène avec les records battus. 15 secondes.\",\n  \"Raconte ton meilleur souvenir avec les ex de retour pour une nuit. 20 secondes.\",\n  \"Fais deviner les promesses de 4 h du matin en 3 mimes maximum.\",\n  \"Raconte ton meilleur souvenir avec les liens en soie. 20 secondes.\",\n  \"Explique les plans express comme une notice de montage. 20 secondes.\",\n  \"Décris les messages à 3 h du matin comme un commentateur sportif. 20 secondes.\",\n  \"Décris les morsures qui marquent comme un commentateur sportif. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les cris étouffés. Le groupe devine.\",\n  \"Décris les griffures dans le dos comme un commentateur sportif. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les promesses de 4 h du matin. Le groupe devine.\",\n  \"Explique les lendemains sans prénom comme une notice de montage. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les griffures dans le dos. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les poignets tenus. Le groupe devine.\",\n  \"Explique les terrasses à minuit comme une notice de montage. 20 secondes.\",\n  \"Montre le geste parfait pour les marques sur la nuque. 10 secondes.\",\n  \"Explique les défis d'endurance comme une notice de montage. 20 secondes.\",\n  \"Décris les appels interrompus comme un commentateur sportif. 20 secondes.\",\n  \"Explique les glaçons qui fondent comme une notice de montage. 20 secondes.\",\n  \"Mime ta plus belle scène avec les goûts qui surprennent. 15 secondes.\",\n  \"Fais une pub de 15 secondes pour les douches à trois températures. Slogan obligatoire.\",\n  \"Raconte ton meilleur souvenir avec les cris étouffés. 20 secondes.\",\n  \"Fais deviner les liens en soie en 3 mimes maximum.\",\n  \"Montre le geste parfait pour les ascenseurs bloqués. 10 secondes.\",\n  \"Mime ta plus belle scène avec les nuits à 4 rounds. 15 secondes.\",\n  \"Fais une pub de 15 secondes pour les cris étouffés. Slogan obligatoire.\",\n  \"Raconte ton meilleur souvenir avec les poignets tenus. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les odeurs intimes. Le groupe devine.\",\n  \"Mime ta plus belle scène avec les morsures qui marquent. 15 secondes.\",\n  \"Explique les bandeaux serrés comme une notice de montage. 20 secondes.\",\n  \"Décris les soirées qui dégénèrent comme un commentateur sportif. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les odeurs intimes. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les goûts qui surprennent. Le groupe devine.\",\n  \"Mime ta plus belle scène avec les odeurs intimes. 15 secondes.\",\n  \"Fais une pub de 15 secondes pour les tentes qui bougent. Slogan obligatoire.\",\n  \"Fais une pub de 15 secondes pour les miroirs au plafond. Slogan obligatoire.\",\n  \"Raconte ton meilleur souvenir avec les piscines nocturnes. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les soirées qui dégénèrent. Slogan obligatoire.\",\n  \"Fais une pub de 15 secondes pour les marques sur la nuque. Slogan obligatoire.\",\n  \"Fais une pub de 15 secondes pour les piscines nocturnes. Slogan obligatoire.\",\n  \"Décris les records battus comme un commentateur sportif. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les jambes qui lâchent. Le groupe devine.\",\n  \"Montre le geste parfait pour les chutes du lit. 10 secondes.\",\n  \"Décris les bureaux après les heures comme un commentateur sportif. 20 secondes.\",\n  \"Fais deviner les messages à 3 h du matin en 3 mimes maximum.\",\n  \"Fais une pub de 15 secondes pour les plans express. Slogan obligatoire.\",\n  \"Décris les positions acrobatiques comme un commentateur sportif. 20 secondes.\",\n  \"Explique les ordres doux comme une notice de montage. 20 secondes.\",\n  \"Mime ta plus belle scène avec les chutes du lit. 15 secondes.\",\n  \"Montre le geste parfait pour les terrasses à minuit. 10 secondes.\",\n  \"Explique les voitures embuées comme une notice de montage. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les piscines nocturnes. Le groupe devine.\",\n  \"Mime ta plus belle scène avec les serveurs et serveuses trop beaux. 15 secondes.\",\n  \"Montre le geste parfait pour les ordres doux. 10 secondes.\",\n  \"Fais deviner les griffures dans le dos en 3 mimes maximum.\",\n  \"Décris les croisées de la salle de sport comme un commentateur sportif. 20 secondes.\",\n  \"Explique les chutes du lit comme une notice de montage. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les serveurs et serveuses trop beaux. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les essais trouvés sur Internet. Slogan obligatoire.\",\n  \"Explique les orgasmes simulés comme une notice de montage. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les croisées de la salle de sport. Le groupe devine.\",\n  \"Montre le geste parfait pour les garages bruyants. 10 secondes.\",\n  \"Décris les lendemains sans prénom comme un commentateur sportif. 20 secondes.\",\n  \"Mime ta plus belle scène avec les plans express. 15 secondes.\",\n  \"Imite quelqu'un qui découvre les positions acrobatiques. Le groupe devine.\",\n  \"Mime ta plus belle scène avec les gémissements forts. 15 secondes.\",\n  \"Imite quelqu'un qui découvre les gémissements forts. Le groupe devine.\",\n  \"Fais une pub de 15 secondes pour les bandeaux serrés. Slogan obligatoire.\",\n  \"Imite quelqu'un qui découvre les défis d'endurance. Le groupe devine.\",\n  \"Fais une pub de 15 secondes pour les positions acrobatiques. Slogan obligatoire.\",\n  \"Raconte ton meilleur souvenir avec les ordres doux. 20 secondes.\",\n  \"Montre le geste parfait pour les buanderies improvisées. 10 secondes.\",\n  \"Imite quelqu'un qui découvre les records battus. Le groupe devine.\",\n  \"Décris les chutes du lit comme un commentateur sportif. 20 secondes.\",\n  \"Montre le geste parfait pour les salles de réunion vides. 10 secondes.\",\n  \"Imite quelqu'un qui découvre les bains de minuit. Le groupe devine.\",\n  \"Explique les griffures dans le dos comme une notice de montage. 20 secondes.\",\n  \"Montre le geste parfait pour les orgasmes simulés. 10 secondes.\",\n  \"Imite quelqu'un qui découvre les liens en soie. Le groupe devine.\",\n  \"Imite quelqu'un qui découvre les plans express. Le groupe devine.\",\n  \"Explique les messages à 3 h du matin comme une notice de montage. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les bureaux après les heures. Slogan obligatoire.\",\n  \"Fais deviner les lits qui craquent en 3 mimes maximum.\",\n  \"Imite quelqu'un qui découvre les ordres doux. Le groupe devine.\",\n  \"Fais deviner les miroirs au plafond en 3 mimes maximum.\",\n  \"Imite quelqu'un qui découvre les marques sur la nuque. Le groupe devine.\",\n  \"Fais une pub de 15 secondes pour les morsures qui marquent. Slogan obligatoire.\",\n  \"Mime ta plus belle scène avec les glaçons qui fondent. 15 secondes.\",\n  \"Fais une pub de 15 secondes pour les nuits à 4 rounds. Slogan obligatoire.\",\n  \"Raconte ton meilleur souvenir avec les lendemains sans prénom. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les terrasses à minuit. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les hôtels où l'on revient. Slogan obligatoire.\",\n  \"Explique les records battus comme une notice de montage. 20 secondes.\",\n  \"Décris les défis d'endurance comme un commentateur sportif. 20 secondes.\",\n  \"Fais deviner les salles de réunion vides en 3 mimes maximum.\",\n  \"Mime ta plus belle scène avec les collègues trop proches. 15 secondes.\",\n  \"Fais deviner les poignets tenus en 3 mimes maximum.\",\n  \"Fais une pub de 15 secondes pour les ascenseurs bloqués. Slogan obligatoire.\",\n  \"Imite quelqu'un qui découvre les salles de réunion vides. Le groupe devine.\",\n  \"Imite quelqu'un qui découvre les voitures embuées. Le groupe devine.\"\n]\n  },\n  4: {\n    verite: [\n  \"C'est ton fantasme le plus torride que tu n'as JAMAIS raconté ? Détails obligatoires.\",\n  \"Décris la dernière fois que tu as baisé : quand, où, comment. Sans sauter une étape.\",\n  \"Quelle position tu pratiques le plus ? Et celle que tu n'oses pas tester ?\",\n  \"Le nombre EXACT de personnes avec qui tu as couché. Le vrai chiffre.\",\n  \"Raconte ton meilleur coup de ta vie. Pourquoi c'était inoubliable ?\",\n  \"As-tu déjà couché avec quelqu'un d'ici ? Qui ? (les autres ferment les yeux)\",\n  \"C'est le truc le plus pervers qu'on t'ait demandé... et que tu as accepté ?\",\n  \"Combien de temps tu tiens ? Le groupe veut une estimation honnête.\",\n  \"Bande son ou silence total au lit ? Décris ce que tu aimes entendre.\",\n  \"Ton pire échec au lit ? Panne, finition express... Raconte le drame.\",\n  \"Où est l'endroit LE PLUS risqué où tu as baisé ? Presque surpris(e) ?\",\n  \"Si tu devais coucher avec 2 personnes de cette partie, lesquelles ?\",\n  \"As-tu déjà utilisé un jouet intime avec quelqu'un ? Raconte la scène complète.\",\n  \"C'est le bruit de ton/ta partenaire qui te fait le plus craquer ?\",\n  \"Quelle odeur te met instantanément d'humeur ? Raconte la dernière fois.\",\n  \"As-tu déjà couché avec quelqu'un pour de l'argent ou un cadeau ? Assume.\",\n  \"Ta jalousie au lit : qu'est-ce qui te rend furieux/furieuse ? Sois vrai(e).\",\n  \"As-tu déjà eu un rêve érotique avec quelqu'un de CE salon ? Raconte.\",\n  \"Ta scène de film X préférée ? Décris l'image exacte qui te revient.\",\n  \"As-tu déjà testé la glace, la plume ou la cire au lit ? Verdict honnête.\",\n  \"As-tu déjà baisé dans un avion ou un train ? Le club très fermé ?\",\n  \"Tes préliminaires en vrai : combien de minutes ? Chronomètre mental.\",\n  \"La chose que ton/ta partenaire fait sans le savoir et qui te rend fou/folle ?\",\n  \"Sextoys : lequel tu utilises ou tu rêves d'utiliser ? Détails techniques.\",\n  \"As-tu déjà filmé un rapport (avec accord) ? C'était comment ?\",\n  \"Ton plus grand regret : celui/celle que tu as laissé(e) filer sans rien tenter ?\",\n  \"As-tu déjà été attiré(e) par le/la copain/copine d'un proche ? Ça s'est su ?\",\n  \"Ta réaction VRAIE si un(e) joueur d'ici t'envoyait un nude ce soir ?\",\n  \"As-tu déjà laissé quelqu'un regarder ? Ou regardé ? Raconte la scène.\",\n  \"Ton rapport le plus rapide de ta vie ? Chronomètre honnête.\",\n  \"Ta plus grande faiblesse physique : nuque, oreilles, dos ? L'endroit exact.\",\n  \"As-tu déjà pleuré après un rapport ? Le vrai pourquoi.\",\n  \"Quelle chanson t'a déjà mis d'humeur en pleine soirée ?\",\n  \"As-tu déjà réalisé un fantasme pendant que quelqu'un conduisait ?\",\n  \"Le miroir pendant l'action : oui, non, pourquoi ? Sois graphique.\",\n  \"Quelle est la promesse la plus folle que tu as faite au lit ? Tenue ou pas ?\",\n  \"As-tu déjà dormi collé(e) à quelqu'un sans rien faire alors que ça brûlait ?\",\n  \"Ton record de temps SANS y penser ? Personne ne te croit.\",\n  \"Qu'est-ce qui te fait dire oui plus vite : un regard, un mot ou une main ?\",\n  \"Ta première réaction quand on t'embrasse le bas du dos ? Décris la montée.\",\n  \"As-tu déjà été surpris(e) en train de te toucher ? Scène complète.\",\n  \"Ton moment préféré : l'avant, le pendant ou l'après ? Pourquoi ?\",\n  \"As-tu déjà enchaîné deux personnes le même week-end ? Énergie légendaire ?\",\n  \"Quel est le compliment au lit que tu voudrais entendre tout le temps ?\",\n  \"Ta plus grosse dépense cochonne (hôtel, lingerie, jouet) ? Le ticket de caisse.\",\n  \"As-tu déjà flirté avec deux personnes du même groupe d'amis ? Lesquelles ?\",\n  \"Ton sexto le plus osé envoyé ? Résume-le ici, censure interdite.\",\n  \"Qu'est-ce que tu regardes EN PREMIER chez quelqu'un nu ? Sois précis.\",\n  \"As-tu déjà simulé pour raccourcir ? Ou pour ne pas blesser ? Raconte.\",\n  \"La position où tu tiens le plus longtemps ? Et celle où tu lâches en 2 minutes ?\",\n  \"As-tu déjà testé les menottes ou le bandage des yeux ? Ce que ça a changé ?\",\n  \"Ton fantasme qui restera à jamais non réalisé ? Et pourquoi ?\",\n  \"Ta plus grande phobie au lit ? Panne, rire mal placé, fatigue soudaine ?\",\n  \"As-tu déjà enchaîné une soirée et un plan sans dormir ? Raconte la nuit blanche.\",\n  \"Le dernier truc coquin que tu as cherché sur ton téléphone ? L'historique parle.\",\n  \"As-tu déjà pensé à quelqu'un d'ici pendant un moment intime ? Initiales acceptées.\",\n  \"Ta plus longue abstinence ? Ce que la libération a donné ?\",\n  \"Quel est ton pire achat coquin ? Description complète demandée.\",\n  \"As-tu déjà eu un plan qui a fini en relation sérieuse ? Retournement complet ?\",\n  \"Ton premier réflexe quand quelqu'un glisse une main dans ton dos ?\",\n  \"As-tu déjà dit je t'aime au moment le moins approprié ? Le moment exact.\",\n  \"La phrase chuchotée qui te fait fondre à 100 % ? Dis-la au groupe.\",\n  \"As-tu déjà testé les jeux de rôle au lit (docteur, patron, prof) ? Raconte.\",\n  \"Ta partie préférée du corps d'une femme ? D'un homme ? Sois clinique.\",\n  \"Le plus de fois en une nuit : ton record réel et l'âge que tu avais.\",\n  \"As-tu déjà avalé ou fait avaler ? Tu en penses quoi, vraiment ?\",\n  \"Ta technique signature avec la langue ? Le groupe demande des détails.\",\n  \"As-tu déjà eu envie de quelqu'un dans cette pièce il y a moins d'une heure ?\",\n  \"C'est ton side chaud préféré : la voix, la bouche, les mains ou les hanches ?\",\n  \"Décris, sans filtre : la dernière fois que tu as baiser : position de départ et de fin. Le groupe exige la vérité.\",\n  \"Décris, sans filtre : ton orgasme le plus mémorable et ce qui l'a causé. Le groupe exige la vérité.\",\n  \"Décris, sans filtre : la chose la plus sale jamais dite dans ton oreille. Le groupe exige la vérité.\",\n  \"Décris, sans filtre : la marque la plus visible jamais laissée sur toi. Le groupe exige la vérité.\",\n  \"Décris, sans filtre : le rapport le plus bruyant de ta vie et les voisins. Le groupe exige la vérité.\",\n  \"Décris, sans filtre : ta façon exacte de te toucher quand tu es seul(e). Le groupe exige la vérité.\",\n  \"Décris, sans filtre : le sextoy de tes rêves et ce que tu en ferais. Le groupe exige la vérité.\",\n  \"Décris, sans filtre : la nuit où tu as le plus osé : chaque étape. Le groupe exige la vérité.\",\n  \"Décris, sans filtre : la chose que tu as avalée ou fait avaler sans le dire. Le groupe exige la vérité.\",\n  \"Décris, sans filtre : le moment où tu as perdu le contrôle complètement. Le groupe exige la vérité.\",\n  \"Décris, sans filtre : la position que tu jugeais nulle et qui t'a surpris(e). Le groupe exige la vérité.\",\n  \"Décris, sans filtre : le plus long préliminaire jamais fait : la durée exacte. Le groupe exige la vérité.\",\n  \"Décris, sans filtre : la partie du corps où tu aimes jouir ou faire jouir. Le groupe exige la vérité.\",\n  \"Décris, sans filtre : le bruit que tu fais quand c'est trop bon. Le groupe exige la vérité.\",\n  \"Décris, sans filtre : la nuit où tu as pleuré de plaisir. Le groupe exige la vérité.\",\n  \"Décris, sans filtre : le rapport le plus rapide jamais réussi. Le groupe exige la vérité.\",\n  \"Décris, sans filtre : le rapport le plus raté de ta vie. Le groupe exige la vérité.\",\n  \"Décris, sans filtre : la première fois que tu as vu un corps nu en vrai. Le groupe exige la vérité.\",\n  \"Décris, sans filtre : la première image X que tu as vue et l'effet produit. Le groupe exige la vérité.\",\n  \"Décris, sans filtre : la chose que ton corps réclame quand tu bois. Le groupe exige la vérité.\",\n  \"Décris, sans filtre : le fantasme lié à un lieu public précis. Le groupe exige la vérité.\",\n  \"Décris, sans filtre : la chose que tu regardes dans une vidéo X en premier. Le groupe exige la vérité.\",\n  \"Décris, sans filtre : le mot sale qui déclenche tout chez toi. Le groupe exige la vérité.\",\n  \"Décris, sans filtre : l'odeur corporelle qui te fait perdre la tête. Le groupe exige la vérité.\",\n  \"Décris, sans filtre : le réveil le plus chaud de ta vie. Le groupe exige la vérité.\",\n  \"Décris, sans filtre : la douche la plus longue jamais partagée. Le groupe exige la vérité.\",\n  \"Décris, sans filtre : le message vocal le plus osé jamais envoyé. Le groupe exige la vérité.\",\n  \"Décris, sans filtre : la promesse cochonne jamais tenue. Le groupe exige la vérité.\",\n  \"Décris, sans filtre : le mensonge le plus gros dit pour coucher. Le groupe exige la vérité.\",\n  \"Décris, sans filtre : la chose la plus étrange jamais faite au lit. Le groupe exige la vérité.\",\n  \"Décris, sans filtre : le fou rire le plus mal placé pendant l'action. Le groupe exige la vérité.\",\n  \"Décris, sans filtre : la chute ou la casse la plus spectaculaire au lit. Le groupe exige la vérité.\",\n  \"Décris, sans filtre : le moment où tu as cru que la maison allait s'effondrer de bruit. Le groupe exige la vérité.\",\n  \"Décris, sans filtre : le lieu le plus inconfortable jamais utilisé. Le groupe exige la vérité.\",\n  \"Décris, sans filtre : la fatigue la plus extrême pendant l'action. Le groupe exige la vérité.\",\n  \"Décris, sans filtre : la faim la plus soudaine au pire moment. Le groupe exige la vérité.\",\n  \"Décris, sans filtre : le téléphone qui a sonné au pire moment. Le groupe exige la vérité.\",\n  \"Décris, sans filtre : la honte la plus grande jamais ressentie au lit. Le groupe exige la vérité.\",\n  \"Décris, sans filtre : le jouet ou l'objet improvisé le plus fou. Le groupe exige la vérité.\",\n  \"Décris, sans filtre : la tenue qui t'a fait dire oui tout de suite. Le groupe exige la vérité.\",\n  \"As-tu déjà baisé dans la même pièce que des amis endormis ? Assume à 100 %.\",\n  \"As-tu déjà baisé pendant que quelqu'un appelait et répondu normal ? Assume à 100 %.\",\n  \"As-tu déjà testé la domination complète ( donner et recevoir les ordres) ? Assume à 100 %.\",\n  \"As-tu déjà mordu jusqu'au sang, presque ? Assume à 100 %.\",\n  \"As-tu déjà griffé le dos jusqu'aux traces blanches ? Assume à 100 %.\",\n  \"As-tu déjà testé la fessée à main nue et avec un objet ? Assume à 100 %.\",\n  \"As-tu déjà lié ou été ligoté(e) (foulard, menottes) ? Assume à 100 %.\",\n  \"As-tu déjà bandé les yeux ou été aveuglé(e) ? Assume à 100 %.\",\n  \"As-tu déjà eu un plan à trois ou refusé une proposition ? Assume à 100 %.\",\n  \"As-tu déjà échangé un regard chaud avec un(e) autre en couple ? Assume à 100 %.\",\n  \"As-tu déjà filmé un rapport ou regardé la vidéo ensuite ? Assume à 100 %.\",\n  \"As-tu déjà envoyé un vocal gémissant par erreur à ta famille ? Assume à 100 %.\",\n  \"As-tu déjà couché sur un balcon ou une terrasse la nuit ? Assume à 100 %.\",\n  \"As-tu déjà couché sous une table ou derrière un comptoir ? Assume à 100 %.\",\n  \"As-tu déjà interrompu une réunion ou un cours par une envie impossible ? Assume à 100 %.\",\n  \"As-tu déjà couché avec quelqu'un qui parlait une autre langue ? Assume à 100 %.\",\n  \"As-tu déjà couché avec une différence d'âge de plus de 15 ans ? Assume à 100 %.\",\n  \"As-tu déjà couché avec le/la patron(ne) ou un(e) employé(e) ? Assume à 100 %.\",\n  \"As-tu déjà couché avec un(e) livreur, chauffeur ou serveur(se) ? Assume à 100 %.\",\n  \"As-tu déjà couché juste après une grosse dispute (version maquillage) ? Assume à 100 %.\",\n  \"As-tu déjà couché pour faire taire un fou rire ? Assume à 100 %.\",\n  \"As-tu déjà couché par vengeance sur un(e) ex ? Assume à 100 %.\",\n  \"As-tu déjà couché pour oublier quelqu'un ? Assume à 100 %.\",\n  \"As-tu déjà couché avec la personne que ton groupe déteste ? Assume à 100 %.\",\n  \"As-tu déjà couché avec le/la fameux ex d'un(e) ami(e) ? Assume à 100 %.\",\n  \"As-tu déjà couché le jour d'un enterrement ou d'un mariage ? Assume à 100 %.\",\n  \"As-tu déjà couché dans la voiture de ta mère ou de ton père ? Assume à 100 %.\",\n  \"As-tu déjà couché avec une tenue complète de jeu de rôle ? Assume à 100 %.\",\n  \"As-tu déjà utilisé de la nourriture (chocolat, crème, glace) ? Assume à 100 %.\",\n  \"As-tu déjà utilisé de la glace sur un corps qui brûle ? Assume à 100 %.\",\n  \"As-tu déjà testé les liens de soie ou les foulards ? Assume à 100 %.\",\n  \"As-tu déjà testé le sexe contre une fenêtre en pleine ville ? Assume à 100 %.\",\n  \"As-tu déjà testé le sexe sous la pluie battante ? Assume à 100 %.\",\n  \"As-tu déjà testé le sexe avec la télé allumée sur un dessin animé ? Assume à 100 %.\",\n  \"As-tu déjà testé le sexe avec quelqu'un qui ne parle pas ta langue ? Assume à 100 %.\",\n  \"As-tu déjà crié un prénom inventé pour cacher le vrai ? Assume à 100 %.\",\n  \"As-tu déjà fait semblant d'un orgasme complet avec théâtre ? Assume à 100 %.\",\n  \"As-tu déjà eu un orgasme juste par un baiser long ? Assume à 100 %.\",\n  \"As-tu déjà eu un orgasme pendant un rêve ? Assume à 100 %.\",\n  \"As-tu déjà eu une envie pendant un enterrement ou un moment grave ? Assume à 100 %.\",\n  \"Le groupe veut le détail brut sur : ta taille préférée chez l'autre. Une phrase claire, pas de poésie.\",\n  \"Le groupe veut le détail brut sur : la chose que tu adores faire avec ta langue. Une phrase claire, pas de poésie.\",\n  \"Le groupe veut le détail brut sur : l'endroit exact où tu aimes être touché(e) au maximum. Une phrase claire, pas de poésie.\",\n  \"Le groupe veut le détail brut sur : le geste qui te rend fou/folle en moins de 10 secondes. Une phrase claire, pas de poésie.\",\n  \"Le groupe veut le détail brut sur : la position qui te fait jouir le plus vite. Une phrase claire, pas de poésie.\",\n  \"Le groupe veut le détail brut sur : le bruit que fait ton corps quand tu lâches prise. Une phrase claire, pas de poésie.\",\n  \"Le groupe veut le détail brut sur : la durée exacte de ton préliminaire parfait. Une phrase claire, pas de poésie.\",\n  \"Le groupe veut le détail brut sur : le nombre de doigts ou de mains dont tu as besoin pour tout comprendre. Une phrase claire, pas de poésie.\",\n  \"Le groupe veut le détail brut sur : la partie de la bite ou de la chatte que tu préfères (tu connais la tienne). Une phrase claire, pas de poésie.\",\n  \"Le groupe veut le détail brut sur : le goût que tu préfères ou que tu redoutes. Une phrase claire, pas de poésie.\",\n  \"Le groupe veut le détail brut sur : le parfum d'entrejambe : tabou ou excitation. Une phrase claire, pas de poésie.\",\n  \"Le groupe veut le détail brut sur : la façon exacte dont tu aimes être mordu(e). Une phrase claire, pas de poésie.\",\n  \"Le groupe veut le détail brut sur : la force parfaite d'une poigne sur tes hanches. Une phrase claire, pas de poésie.\",\n  \"Le groupe veut le détail brut sur : le rythme parfait : lent du début ou montée progressive. Une phrase claire, pas de poésie.\",\n  \"Le groupe veut le détail brut sur : l'angle parfait que personne ne trouve jamais. Une phrase claire, pas de poésie.\",\n  \"Le groupe veut le détail brut sur : le mot le plus sale que tu as déjà gémi. Une phrase claire, pas de poésie.\",\n  \"Le groupe veut le détail brut sur : le surnom cochonne que tu donnes ou aimes recevoir. Une phrase claire, pas de poésie.\",\n  \"Le groupe veut le détail brut sur : le moment exact où tu sais que ça va jouir. Une phrase claire, pas de poésie.\",\n  \"Le groupe veut le détail brut sur : la chose que tu fais toujours juste avant la fin. Une phrase claire, pas de poésie.\",\n  \"Le groupe veut le détail brut sur : la façon dont tu récupères après : minutes exactes. Une phrase claire, pas de poésie.\",\n  \"Le groupe veut le détail brut sur : la partie de la nuit où tu es le/la plus bruyant(e). Une phrase claire, pas de poésie.\",\n  \"Le groupe veut le détail brut sur : la chose que ton corps fait sans ton permission quand c'est trop bon. Une phrase claire, pas de poésie.\",\n  \"Le groupe veut le détail brut sur : le réveil le plus chaud : la scène exacte. Une phrase claire, pas de poésie.\",\n  \"Le groupe veut le détail brut sur : la chose que tu as jamais faite par pure envie de transgresser. Une phrase claire, pas de poésie.\",\n  \"Le groupe veut le détail brut sur : la chose que tu ne feras JAMAIS même pour un million. Une phrase claire, pas de poésie.\",\n  \"Le groupe veut le détail brut sur : le fantasme le plussale que tu oses décrire ici. Une phrase claire, pas de poésie.\",\n  \"Le groupe veut le détail brut sur : la chose que tu regardes en premier dans un film X. Une phrase claire, pas de poésie.\",\n  \"Le groupe veut le détail brut sur : le son de la fin : décrit-le pour le groupe. Une phrase claire, pas de poésie.\",\n  \"Le groupe veut le détail brut sur : la chose que tu as promise à quelqu'un dans le noir. Une phrase claire, pas de poésie.\",\n  \"Le groupe veut le détail brut sur : le détail de ta dernière douche solitaire sans le dire à personne. Une phrase claire, pas de poésie.\",\n  \"Ta réaction sincère si un(e) joueur d'ici t'embrassait maintenant ? Réponds vrai ou faux, sans détour.\",\n  \"Ta réaction sincère si on t'envoyait un nude dans les 10 secondes ? Réponds vrai ou faux, sans détour.\",\n  \"Ta réaction sincère si le groupe choisissait une personne pour coucher avec toi ? Réponds vrai ou faux, sans détour.\",\n  \"Ta réaction sincère si ton ex t'écrivait « je suis à côté, ouvre » ? Réponds vrai ou faux, sans détour.\",\n  \"Ta réaction sincère si on te proposait un plan à trois ce soir ? Réponds vrai ou faux, sans détour.\",\n  \"Ta réaction sincère si on te proposait de l'argent pour une nuit ? Réponds vrai ou faux, sans détour.\",\n  \"Ta réaction sincère si quelqu'un d'ici avait déjà rêvé de toi (et le raconte) ? Réponds vrai ou faux, sans détour.\",\n  \"Ta réaction sincère si la personne en face de toi se déshabillait lentement ? Réponds vrai ou faux, sans détour.\",\n  \"Ta réaction sincère si on te demandait un nude maintenant ? Réponds vrai ou faux, sans détour.\",\n  \"Ta réaction sincère si le groupe lisait ton dernier message chaud à voix haute ? Réponds vrai ou faux, sans détour.\",\n  \"Ta réaction sincère si quelqu'un te mordait le cou pendant un câlin innocent ? Réponds vrai ou faux, sans détour.\",\n  \"Ta réaction sincère si ton/ta partenaire te demandait les menottes ? Réponds vrai ou faux, sans détour.\",\n  \"Ta réaction sincère si le voisin tapait au mur au bon moment ? Réponds vrai ou faux, sans détour.\",\n  \"Ta réaction sincère si quelqu'un filmait (avec ton accord) et la vidéo fuyait ? Réponds vrai ou faux, sans détour.\",\n  \"Ta réaction sincère si on te chuchotait le mot sale au milieu d'un diner de famille ? Réponds vrai ou faux, sans détour.\",\n  \"Ta réaction sincère si la personne de tes rêves disait « je suis à toi ce soir » ? Réponds vrai ou faux, sans détour.\",\n  \"Ta réaction sincère si on te demandait de géminer le prénom de quelqu'un d'ici ? Réponds vrai ou faux, sans détour.\",\n  \"Ta réaction sincère si le groupe décidait ta tenue pour un rencard chaud ? Réponds vrai ou faux, sans détour.\",\n  \"Ta réaction sincère si on te proposait une nuit d'hôtel avec la personne en face ? Réponds vrai ou faux, sans détour.\",\n  \"Ta réaction sincère si quelqu'un te prenait la main et la posait sur sa cuisse ? Réponds vrai ou faux, sans détour.\",\n  \"Ta réaction sincère si on te demandait ton chiffre réel devant tes parents ? Réponds vrai ou faux, sans détour.\",\n  \"Ta réaction sincère si la personne à ta droite se penchait à ton oreille maintenant ? Réponds vrai ou faux, sans détour.\",\n  \"Ta réaction sincère si on te demandait d'écrire ton sexto le plus osé en public ? Réponds vrai ou faux, sans détour.\",\n  \"Ta réaction sincère si ton crush de toujours disait oui à tout ce soir ? Réponds vrai ou faux, sans détour.\",\n  \"Ta réaction sincère si on te proposait un week-end complet sans règles ? Réponds vrai ou faux, sans détour.\",\n  \"Ta réaction sincère si on te montrait la photo la plus chaude de ton/ta ex ? Réponds vrai ou faux, sans détour.\",\n  \"Ta réaction sincère si quelqu'un d'ici avouait penser à toi en se touchant ? Réponds vrai ou faux, sans détour.\",\n  \"Ta réaction sincère si le groupe te forçait à choisir : jamais de baise ou jamais d'amour ? Réponds vrai ou faux, sans détour.\",\n  \"Ta réaction sincère si on t'enfermait 2 heures avec la personne la plus chaude d'ici ? Réponds vrai ou faux, sans détour.\",\n  \"Ta réaction sincère si on te demandait de refaire ta meilleure nuit en direct audio ? Réponds vrai ou faux, sans détour.\",\n  \"Ton secret le plus lourd sur : la personne interdite à qui tu as pensé hier soir. Le groupe jure de se taire.\",\n  \"Ton secret le plus lourd sur : le plan que tu as caché à tout le monde jusqu'ici. Le groupe jure de se taire.\",\n  \"Ton secret le plus lourd sur : la chose que tu as faite seule(se) en pensant à quelqu'un d'ici. Le groupe jure de se taire.\",\n  \"Ton secret le plus lourd sur : le message que tu as supprimé par honte. Le groupe jure de se taire.\",\n  \"Ton secret le plus lourd sur : la photo que tu gardes et que personne ne doit voir. Le groupe jure de se taire.\",\n  \"Ton secret le plus lourd sur : le lieu où tu as eu la plus grosse envie de ta vie. Le groupe jure de se taire.\",\n  \"Ton secret le plus lourd sur : la chose que tu as faite pour un(e) ex et jamais avouée. Le groupe jure de se taire.\",\n  \"Ton secret le plus lourd sur : le mensonge le plus gros dit au lit. Le groupe jure de se taire.\",\n  \"Ton secret le plus lourd sur : le prénom que tu as gémi en pensant à un(e) autre. Le groupe jure de se taire.\",\n  \"Ton secret le plus lourd sur : la chose que ton corps a faite sans ta permission. Le groupe jure de se taire.\",\n  \"Ton secret le plus lourd sur : le rapport que tu as arrêté et le vrai pourquoi. Le groupe jure de se taire.\",\n  \"Ton secret le plus lourd sur : la personne que tu as fait attendre trop longtemps. Le groupe jure de se taire.\",\n  \"Ton secret le plus lourd sur : la promesse cochonne que tu n'as pas tenue. Le groupe jure de se taire.\",\n  \"Ton secret le plus lourd sur : la nuit dont tu as changé tous les détails en la racontant. Le groupe jure de se taire.\",\n  \"Ton secret le plus lourd sur : la chose que tu as testée seule(se) avant d'oser le dire. Le groupe jure de se taire.\",\n  \"Ton secret le plus lourd sur : le jouet ou l'objet que tu caches encore. Le groupe jure de se taire.\",\n  \"Ton secret le plus lourd sur : la vidéo ou la photo jamais montrée. Le groupe jure de se taire.\",\n  \"Ton secret le plus lourd sur : le plan qui a failli tout casser avec tes amis. Le groupe jure de se taire.\",\n  \"Ton secret le plus lourd sur : la chose que tu as acceptée juste pour la curiosité. Le groupe jure de se taire.\",\n  \"Ton secret le plus lourd sur : le fantasme lié à quelqu'un de ta famille éloignée ou d'un cercle interdit. Le groupe jure de se taire.\",\n  \"Ton secret le plus lourd sur : le son que tu refais tout seul(se) en te rappelant une nuit. Le groupe jure de se taire.\",\n  \"Ton secret le plus lourd sur : la chose que tu as faite dans le noir que personne ne sait. Le groupe jure de se taire.\",\n  \"Ton secret le plus lourd sur : la raison exacte d'une fuite à l'aube. Le groupe jure de se taire.\",\n  \"Ton secret le plus lourd sur : le mot que tu as inventé pour cacher ta jouissance. Le groupe jure de se taire.\",\n  \"Ton secret le plus lourd sur : la chose que tu as dite uniquement pour exciter et qui a trop marché. Le groupe jure de se taire.\",\n  \"Ton secret le plus lourd sur : le profil secret que tu as utilisé pour draguer. Le groupe jure de se taire.\",\n  \"Ton secret le plus lourd sur : la chose que tu as volée comme souvenir de nuit. Le groupe jure de se taire.\",\n  \"Ton secret le plus lourd sur : le lieu où tu t'es touché(e) en public sans te faire prendre. Le groupe jure de se taire.\",\n  \"Ton secret le plus lourd sur : la chose que tu as envoyée à la mauvaise personne et la suite. Le groupe jure de se taire.\",\n  \"Ton secret le plus lourd sur : le souvenir que tu rejoues en boucle depuis des mois. Le groupe jure de se taire.\",\n  \"Tu recommencerais avec les glaçons sur la peau chaude ? Pourquoi ?\",\n  \"C'est quoi ton avis sur les quêtes d'orgasme simultané ? Sois honnête.\",\n  \"Qu'est-ce qui change avec les morsures jusqu'aux marques selon la personne ?\",\n  \"Ton record avec les cris sans voisin pour juger ? Le groupe demande le chiffre.\",\n  \"C'est quoi ton avis sur les chevilles attachées ? Sois honnête.\",\n  \"Ton pire souvenir avec les envies exprimées sans honte ? Raconte.\",\n  \"les douches qui brûlent la peau : oui, non, ou tu rêves ?\",\n  \"Tu recommencerais avec les dominations totales ? Pourquoi ?\",\n  \"Tu recommencerais avec les promesses cochonnes tenues ? Pourquoi ?\",\n  \"Qu'est-ce qui change avec les huiles partout selon la personne ?\",\n  \"C'est quoi ton meilleur souvenir avec les douches qui brûlent la peau ?\",\n  \"C'est quoi ton avis sur les mains liées dans le dos ? Sois honnête.\",\n  \"C'est quoi ton avis sur les morsures jusqu'aux marques ? Sois honnête.\",\n  \"les marques visibles au bureau : oui, non, ou tu rêves ?\",\n  \"Qu'est-ce qui change avec les corps qu'on redemande selon la personne ?\",\n  \"Qu'est-ce qui change avec les ordres obéis sans question selon la personne ?\",\n  \"Ton record avec les transpirations partagées ? Le groupe demande le chiffre.\",\n  \"C'est quoi ton meilleur souvenir avec les défis de 24 h au lit ?\",\n  \"Tu recommencerais avec les nuits qui marquent une vie ? Pourquoi ?\",\n  \"C'est quoi ton avis sur les contacts dans la foule ? Sois honnête.\",\n  \"C'est quoi ton meilleur souvenir avec les films maison ?\",\n  \"Ton record avec les films maison ? Le groupe demande le chiffre.\",\n  \"Ton record avec les glaçons sur la peau chaude ? Le groupe demande le chiffre.\",\n  \"Ton pire souvenir avec les quêtes d'orgasme simultané ? Raconte.\",\n  \"C'est quoi ton avis sur les griffures profondes ? Sois honnête.\",\n  \"Qu'est-ce qui change avec les soirs où tout est permis selon la personne ?\",\n  \"les murs qui tremblent : oui, non, ou tu rêves ?\",\n  \"les interdits qu'on franchit enfin : oui, non, ou tu rêves ?\",\n  \"les fantasmes à trois : oui, non, ou tu rêves ?\",\n  \"les contacts dans la foule : oui, non, ou tu rêves ?\",\n  \"les mains liées dans le dos : oui, non, ou tu rêves ?\",\n  \"Ton record avec les corps offerts ? Le groupe demande le chiffre.\",\n  \"As-tu déjà testé les ordres obéis sans question ? Raconte.\",\n  \"Ton record avec les orgasmes multiples ? Le groupe demande le chiffre.\",\n  \"C'est quoi ton meilleur souvenir avec les cris sans voisin pour juger ?\",\n  \"C'est quoi ton avis sur les secrets jamais racontés ? Sois honnête.\",\n  \"Qu'est-ce qui change avec les positions du Kamasutra non testées selon la personne ?\",\n  \"C'est quoi ton avis sur les films maison ? Sois honnête.\",\n  \"As-tu déjà testé les plages de rêve sans vêtements ? Raconte.\",\n  \"les envies exprimées sans honte : oui, non, ou tu rêves ?\",\n  \"Qu'est-ce qui change avec les murs qui tremblent selon la personne ?\",\n  \"C'est quoi ton meilleur souvenir avec les ordres obéis sans question ?\",\n  \"Ton record avec les morsures jusqu'aux marques ? Le groupe demande le chiffre.\",\n  \"C'est quoi ton avis sur les yeux bandés toute la nuit ? Sois honnête.\",\n  \"Ton record avec les réveils de 4 h du matin ? Le groupe demande le chiffre.\",\n  \"Qu'est-ce qui change avec les douches qui brûlent la peau selon la personne ?\",\n  \"As-tu déjà testé les huiles partout ? Raconte.\",\n  \"Ton pire souvenir avec les fellations mémorables ? Raconte.\",\n  \"Ton record avec les huiles partout ? Le groupe demande le chiffre.\",\n  \"Ton pire souvenir avec les dominations totales ? Raconte.\",\n  \"les langues expertes : oui, non, ou tu rêves ?\",\n  \"As-tu déjà testé les promesses cochonnes tenues ? Raconte.\",\n  \"les matelas qui tombent : oui, non, ou tu rêves ?\",\n  \"Ton record avec les contacts dans la foule ? Le groupe demande le chiffre.\",\n  \"As-tu déjà testé les yeux bandés toute la nuit ? Raconte.\",\n  \"Ton pire souvenir avec les morsures jusqu'aux marques ? Raconte.\",\n  \"C'est quoi ton avis sur les fantasmes à trois ? Sois honnête.\",\n  \"C'est quoi ton avis sur les soirées sans aucun sommeil ? Sois honnête.\",\n  \"Qu'est-ce qui change avec les films maison selon la personne ?\",\n  \"C'est quoi ton avis sur les huiles partout ? Sois honnête.\",\n  \"Qu'est-ce qui change avec les fessées assumées selon la personne ?\",\n  \"As-tu déjà testé les films maison ? Raconte.\",\n  \"Ton pire souvenir avec les huiles partout ? Raconte.\",\n  \"Qu'est-ce qui change avec les interdits qu'on franchit enfin selon la personne ?\",\n  \"Tu recommencerais avec les griffures profondes ? Pourquoi ?\",\n  \"C'est quoi ton meilleur souvenir avec les nudes archivés ?\",\n  \"les dominations totales : oui, non, ou tu rêves ?\",\n  \"Ton record avec les secrets jamais racontés ? Le groupe demande le chiffre.\",\n  \"Tu recommencerais avec les matelas qui tombent ? Pourquoi ?\",\n  \"Tu recommencerais avec les quêtes d'orgasme simultané ? Pourquoi ?\",\n  \"Qu'est-ce qui change avec les fellations mémorables selon la personne ?\",\n  \"Tu recommencerais avec les yeux bandés toute la nuit ? Pourquoi ?\",\n  \"les huiles partout : oui, non, ou tu rêves ?\",\n  \"Qu'est-ce qui change avec les cris sans voisin pour juger selon la personne ?\",\n  \"Ton record avec les fessées jusqu'au rouge ? Le groupe demande le chiffre.\",\n  \"les orgasmes multiples : oui, non, ou tu rêves ?\",\n  \"C'est quoi ton meilleur souvenir avec les fessées jusqu'au rouge ?\",\n  \"Ton record avec les mains liées dans le dos ? Le groupe demande le chiffre.\",\n  \"C'est quoi ton meilleur souvenir avec les gémissements profonds ?\",\n  \"Tu recommencerais avec les fessées jusqu'au rouge ? Pourquoi ?\",\n  \"As-tu déjà testé les fellations mémorables ? Raconte.\",\n  \"C'est quoi ton meilleur souvenir avec les griffures profondes ?\",\n  \"Ton pire souvenir avec les transpirations partagées ? Raconte.\",\n  \"les piscines sans maillot : oui, non, ou tu rêves ?\",\n  \"Tu recommencerais avec les plages de rêve sans vêtements ? Pourquoi ?\",\n  \"C'est quoi ton avis sur les corps qu'on redemande ? Sois honnête.\",\n  \"les réveils de 4 h du matin : oui, non, ou tu rêves ?\",\n  \"C'est quoi ton meilleur souvenir avec les soirs où tout est permis ?\",\n  \"Tu recommencerais avec les réveils de 4 h du matin ? Pourquoi ?\",\n  \"C'est quoi ton meilleur souvenir avec les promesses cochonnes tenues ?\",\n  \"Tu recommencerais avec les mains liées dans le dos ? Pourquoi ?\",\n  \"Tu recommencerais avec les murs qui tremblent ? Pourquoi ?\",\n  \"C'est quoi ton avis sur les douches qui brûlent la peau ? Sois honnête.\",\n  \"les chevilles attachées : oui, non, ou tu rêves ?\",\n  \"C'est quoi ton avis sur les défis de 24 h au lit ? Sois honnête.\",\n  \"As-tu déjà testé les corps offerts ? Raconte.\",\n  \"Tu recommencerais avec les fessées assumées ? Pourquoi ?\",\n  \"C'est quoi ton meilleur souvenir avec les balcons entièrement nus ?\",\n  \"Ton record avec les corps qu'on redemande ? Le groupe demande le chiffre.\",\n  \"les transpirations partagées : oui, non, ou tu rêves ?\",\n  \"les fessées jusqu'au rouge : oui, non, ou tu rêves ?\",\n  \"les corps offerts : oui, non, ou tu rêves ?\",\n  \"Ton record avec les liens et les menottes ? Le groupe demande le chiffre.\",\n  \"C'est quoi ton meilleur souvenir avec les échanges de partenaires ?\",\n  \"Ton pire souvenir avec les orgasmes multiples ? Raconte.\",\n  \"Qu'est-ce qui change avec les draps déchirés selon la personne ?\",\n  \"As-tu déjà testé les fessées jusqu'au rouge ? Raconte.\",\n  \"C'est quoi ton avis sur les ordres obéis sans question ? Sois honnête.\",\n  \"As-tu déjà testé les murs qui tremblent ? Raconte.\",\n  \"Tu recommencerais avec les orgasmes multiples ? Pourquoi ?\",\n  \"As-tu déjà testé les jouets bruyants ? Raconte.\",\n  \"C'est quoi ton meilleur souvenir avec les mains liées dans le dos ?\",\n  \"As-tu déjà testé les mains liées dans le dos ? Raconte.\",\n  \"Qu'est-ce qui change avec les nudes archivés selon la personne ?\",\n  \"C'est quoi ton meilleur souvenir avec les quêtes d'orgasme simultané ?\",\n  \"les nudes archivés : oui, non, ou tu rêves ?\",\n  \"Ton pire souvenir avec les interdits qu'on franchit enfin ? Raconte.\",\n  \"Qu'est-ce qui change avec les contacts dans la foule selon la personne ?\",\n  \"As-tu déjà testé les gémissements profonds ? Raconte.\",\n  \"As-tu déjà testé les corps qu'on redemande ? Raconte.\",\n  \"Tu recommencerais avec les morsures jusqu'aux marques ? Pourquoi ?\",\n  \"C'est quoi ton meilleur souvenir avec les yeux bandés toute la nuit ?\",\n  \"les positions du Kamasutra non testées : oui, non, ou tu rêves ?\",\n  \"Ton record avec les jouets bruyants ? Le groupe demande le chiffre.\",\n  \"Qu'est-ce qui change avec les chevilles attachées selon la personne ?\",\n  \"Tu recommencerais avec les reprises après 10 minutes ? Pourquoi ?\",\n  \"As-tu déjà testé les interdits qu'on franchit enfin ? Raconte.\",\n  \"Ton pire souvenir avec les marques visibles au bureau ? Raconte.\",\n  \"Qu'est-ce qui change avec les secrets jamais racontés selon la personne ?\",\n  \"As-tu déjà testé les mots les plus sales ? Raconte.\",\n  \"Ton record avec les piscines sans maillot ? Le groupe demande le chiffre.\",\n  \"Qu'est-ce qui change avec les griffures profondes selon la personne ?\",\n  \"C'est quoi ton avis sur les plages de rêve sans vêtements ? Sois honnête.\",\n  \"Ton record avec les fessées assumées ? Le groupe demande le chiffre.\",\n  \"C'est quoi ton meilleur souvenir avec les marques visibles au bureau ?\",\n  \"Qu'est-ce qui change avec les fessées jusqu'au rouge selon la personne ?\",\n  \"les films maison : oui, non, ou tu rêves ?\",\n  \"Tu recommencerais avec les douches qui brûlent la peau ? Pourquoi ?\",\n  \"Ton record avec les chevilles attachées ? Le groupe demande le chiffre.\",\n  \"C'est quoi ton meilleur souvenir avec les plages de rêve sans vêtements ?\",\n  \"les corps qu'on redemande : oui, non, ou tu rêves ?\",\n  \"As-tu déjà testé les liens et les menottes ? Raconte.\",\n  \"Qu'est-ce qui change avec les mains liées dans le dos selon la personne ?\",\n  \"As-tu déjà testé les cunnilingus interminables ? Raconte.\",\n  \"Ton record avec les plages de rêve sans vêtements ? Le groupe demande le chiffre.\",\n  \"Tu recommencerais avec les envies exprimées sans honte ? Pourquoi ?\",\n  \"C'est quoi ton meilleur souvenir avec les huiles partout ?\",\n  \"Ton record avec les mots les plus sales ? Le groupe demande le chiffre.\",\n  \"Ton record avec les nudes archivés ? Le groupe demande le chiffre.\",\n  \"C'est quoi ton avis sur les cunnilingus interminables ? Sois honnête.\",\n  \"C'est quoi ton avis sur les liens et les menottes ? Sois honnête.\",\n  \"Tu recommencerais avec les défis de 24 h au lit ? Pourquoi ?\",\n  \"C'est quoi ton avis sur les gémissements profonds ? Sois honnête.\",\n  \"Ton pire souvenir avec les jouets bruyants ? Raconte.\",\n  \"Tu recommencerais avec les positions du Kamasutra non testées ? Pourquoi ?\",\n  \"Ton record avec les griffures profondes ? Le groupe demande le chiffre.\",\n  \"Ton record avec les envies exprimées sans honte ? Le groupe demande le chiffre.\",\n  \"C'est quoi ton meilleur souvenir avec les matelas qui tombent ?\",\n  \"C'est quoi ton meilleur souvenir avec les contacts dans la foule ?\",\n  \"les soirs où tout est permis : oui, non, ou tu rêves ?\",\n  \"Tu recommencerais avec les piscines sans maillot ? Pourquoi ?\",\n  \"As-tu déjà testé les dominations totales ? Raconte.\",\n  \"As-tu déjà testé les soirs où tout est permis ? Raconte.\",\n  \"As-tu déjà testé les matelas qui tombent ? Raconte.\",\n  \"C'est quoi ton avis sur les langues expertes ? Sois honnête.\",\n  \"les glaçons sur la peau chaude : oui, non, ou tu rêves ?\",\n  \"Tu recommencerais avec les cunnilingus interminables ? Pourquoi ?\",\n  \"C'est quoi ton avis sur les draps déchirés ? Sois honnête.\",\n  \"As-tu déjà testé les réveils de 4 h du matin ? Raconte.\",\n  \"As-tu déjà testé les griffures profondes ? Raconte.\",\n  \"Tu recommencerais avec les contacts dans la foule ? Pourquoi ?\",\n  \"C'est quoi ton avis sur les marques visibles au bureau ? Sois honnête.\",\n  \"C'est quoi ton meilleur souvenir avec les soirées sans aucun sommeil ?\",\n  \"Ton pire souvenir avec les défis de 24 h au lit ? Raconte.\",\n  \"As-tu déjà testé les contacts dans la foule ? Raconte.\",\n  \"Ton record avec les gémissements profonds ? Le groupe demande le chiffre.\",\n  \"C'est quoi ton meilleur souvenir avec les langues expertes ?\",\n  \"As-tu déjà testé les défis de 24 h au lit ? Raconte.\",\n  \"C'est quoi ton meilleur souvenir avec les corps qu'on redemande ?\",\n  \"C'est quoi ton meilleur souvenir avec les glaçons sur la peau chaude ?\",\n  \"Ton pire souvenir avec les murs qui tremblent ? Raconte.\",\n  \"Tu recommencerais avec les secrets jamais racontés ? Pourquoi ?\",\n  \"Ton record avec les soirs où tout est permis ? Le groupe demande le chiffre.\",\n  \"C'est quoi ton avis sur les balcons entièrement nus ? Sois honnête.\",\n  \"C'est quoi ton avis sur les jouets bruyants ? Sois honnête.\",\n  \"Ton record avec les séries de rounds sans pause ? Le groupe demande le chiffre.\",\n  \"C'est quoi ton avis sur les dominations totales ? Sois honnête.\",\n  \"Qu'est-ce qui change avec les séries de rounds sans pause selon la personne ?\",\n  \"As-tu déjà testé les fessées assumées ? Raconte.\",\n  \"As-tu déjà testé les morsures jusqu'aux marques ? Raconte.\",\n  \"Tu recommencerais avec les langues expertes ? Pourquoi ?\",\n  \"Ton record avec les fantasmes à trois ? Le groupe demande le chiffre.\",\n  \"Ton pire souvenir avec les positions du Kamasutra non testées ? Raconte.\",\n  \"Tu recommencerais avec les balcons entièrement nus ? Pourquoi ?\",\n  \"les plages de rêve sans vêtements : oui, non, ou tu rêves ?\",\n  \"Ton record avec les langues expertes ? Le groupe demande le chiffre.\",\n  \"Ton record avec les dominations totales ? Le groupe demande le chiffre.\",\n  \"Ton pire souvenir avec les matelas qui tombent ? Raconte.\",\n  \"As-tu déjà testé les soirées sans aucun sommeil ? Raconte.\",\n  \"As-tu déjà testé les quêtes d'orgasme simultané ? Raconte.\",\n  \"C'est quoi ton avis sur les nuits qui marquent une vie ? Sois honnête.\",\n  \"Qu'est-ce qui change avec les cunnilingus interminables selon la personne ?\",\n  \"Ton pire souvenir avec les glaçons sur la peau chaude ? Raconte.\",\n  \"Qu'est-ce qui change avec les jeux de rôle intimes selon la personne ?\",\n  \"Qu'est-ce qui change avec les promesses cochonnes tenues selon la personne ?\",\n  \"les griffures profondes : oui, non, ou tu rêves ?\",\n  \"C'est quoi ton avis sur les séries de rounds sans pause ? Sois honnête.\",\n  \"C'est quoi ton meilleur souvenir avec les interdits qu'on franchit enfin ?\",\n  \"Ton pire souvenir avec les fessées jusqu'au rouge ? Raconte.\",\n  \"C'est quoi ton avis sur les murs qui tremblent ? Sois honnête.\",\n  \"C'est quoi ton meilleur souvenir avec les chevilles attachées ?\",\n  \"Tu recommencerais avec les transpirations partagées ? Pourquoi ?\",\n  \"Tu recommencerais avec les mots les plus sales ? Pourquoi ?\",\n  \"les morsures jusqu'aux marques : oui, non, ou tu rêves ?\",\n  \"C'est quoi ton meilleur souvenir avec les positions du Kamasutra non testées ?\",\n  \"C'est quoi ton meilleur souvenir avec les nuits qui marquent une vie ?\",\n  \"Qu'est-ce qui change avec les piscines sans maillot selon la personne ?\",\n  \"As-tu déjà testé les fantasmes à trois ? Raconte.\",\n  \"les soirées sans aucun sommeil : oui, non, ou tu rêves ?\",\n  \"Qu'est-ce qui change avec les liens et les menottes selon la personne ?\",\n  \"Tu recommencerais avec les films maison ? Pourquoi ?\",\n  \"Tu recommencerais avec les fellations mémorables ? Pourquoi ?\",\n  \"Qu'est-ce qui change avec les plages de rêve sans vêtements selon la personne ?\",\n  \"Qu'est-ce qui change avec les orgasmes multiples selon la personne ?\",\n  \"les liens et les menottes : oui, non, ou tu rêves ?\",\n  \"C'est quoi ton avis sur les transpirations partagées ? Sois honnête.\",\n  \"C'est quoi ton avis sur les mots les plus sales ? Sois honnête.\",\n  \"C'est quoi ton avis sur les réveils de 4 h du matin ? Sois honnête.\",\n  \"C'est quoi ton avis sur les cris sans voisin pour juger ? Sois honnête.\",\n  \"Qu'est-ce qui change avec les nuits qui marquent une vie selon la personne ?\",\n  \"Ton pire souvenir avec les draps déchirés ? Raconte.\",\n  \"C'est quoi ton avis sur les piscines sans maillot ? Sois honnête.\",\n  \"les gémissements profonds : oui, non, ou tu rêves ?\",\n  \"C'est quoi ton avis sur les envies exprimées sans honte ? Sois honnête.\",\n  \"Ton record avec les yeux bandés toute la nuit ? Le groupe demande le chiffre.\",\n  \"C'est quoi ton meilleur souvenir avec les orgasmes multiples ?\",\n  \"Ton record avec les fellations mémorables ? Le groupe demande le chiffre.\",\n  \"As-tu déjà testé les nudes archivés ? Raconte.\",\n  \"As-tu déjà testé les reprises après 10 minutes ? Raconte.\",\n  \"les ordres obéis sans question : oui, non, ou tu rêves ?\",\n  \"Ton record avec les marques visibles au bureau ? Le groupe demande le chiffre.\",\n  \"Ton record avec les matelas qui tombent ? Le groupe demande le chiffre.\",\n  \"As-tu déjà testé les échanges de partenaires ? Raconte.\",\n  \"Tu recommencerais avec les ordres obéis sans question ? Pourquoi ?\",\n  \"Qu'est-ce qui change avec les corps offerts selon la personne ?\",\n  \"Ton record avec les draps déchirés ? Le groupe demande le chiffre.\",\n  \"Qu'est-ce qui change avec les réveils de 4 h du matin selon la personne ?\",\n  \"As-tu déjà testé les envies exprimées sans honte ? Raconte.\",\n  \"Ton record avec les balcons entièrement nus ? Le groupe demande le chiffre.\",\n  \"Tu recommencerais avec les corps qu'on redemande ? Pourquoi ?\",\n  \"les cris sans voisin pour juger : oui, non, ou tu rêves ?\",\n  \"les fessées assumées : oui, non, ou tu rêves ?\",\n  \"Ton pire souvenir avec les plages de rêve sans vêtements ? Raconte.\",\n  \"As-tu déjà testé les langues expertes ? Raconte.\",\n  \"Ton record avec les murs qui tremblent ? Le groupe demande le chiffre.\",\n  \"C'est quoi ton avis sur les reprises après 10 minutes ? Sois honnête.\",\n  \"Ton pire souvenir avec les contacts dans la foule ? Raconte.\",\n  \"Ton pire souvenir avec les séries de rounds sans pause ? Raconte.\",\n  \"Ton pire souvenir avec les liens et les menottes ? Raconte.\",\n  \"As-tu déjà testé les orgasmes multiples ? Raconte.\",\n  \"Ton pire souvenir avec les échanges de partenaires ? Raconte.\"\n],\n    action: [\n  \"Envoie un vocal de 20 secondes décrivant ce que tu ferais ce soir à la personne de ton choix ici. Sans censure.\",\n  \"Décris en détail, à voix haute, ton dernier rapport. Le groupe juge les détails.\",\n  \"Fais un strip COMPLET, cam ouverte. 30 secondes chrono.\",\n  \"Gémis de la manière la plus réaliste possible pendant 10 secondes. Le groupe note sur 10.\",\n  \"Envoie une photo de ta tenue complète du moment. Le groupe évalue la chaleur.\",\n  \"Chuchote à la caméra le mot sale qui t'excite le plus. Prononce-le 3 fois.\",\n  \"Mime la position que tu rêves de tester. Aucune censure, mimes réalistes.\",\n  \"Décris ce que tu ferais à la personne en face si vous étiez seuls. 20 secondes.\",\n  \"Envoie un vocal où tu gémins le prénom du joueur de ton choix. 5 fois de suite.\",\n  \"Montre la zone de ton corps la plus sensible en la désignant précisément.\",\n  \"Fais deviner ton fantasme le plus fou avec 3 mots-indices. 2 essais au groupe.\",\n  \"Décris ton dernier rêve X comme un commentaire de match. Score final inclus.\",\n  \"Envoie un message vocal : « je suis ton plan ce soir » en ta meilleure voix.\",\n  \"Mime comment tu enlèverais la chemise de quelqu'un. Sans la chemise de quelqu'un.\",\n  \"Décris ton corps préféré chez l'autre en le traçant sur le tien. Partie par partie.\",\n  \"Fais 20 secondes de simulation complète du « à côté de toi ». Coussin obligatoire.\",\n  \"Envoie un vocal où tu répètes « là, tout de suite » en montant à chaque fois.\",\n  \"Raconte ta meilleure nuit comme une recette : ingrédients, temps de cuisson, dégustation.\",\n  \"Chante un slow en remplaçant chaque mot par « baise-moi » version radio famille (essaie).\",\n  \"Mime le massage complet de la personne en face : dos, épaules, puis plus bas (mimes).\",\n  \"Décris ton niveau ce soir sur 10 et prouve-le avec un regard de 10 secondes.\",\n  \"Envoie ta plus belle pose de lit en photo. Le groupe note la chaleur sur 10.\",\n  \"Imite le son exact que fait ton lit quand tu y vas fort.\",\n  \"Décris l'ordre exact dans lequel tu enlèverais les vêtements de la personne en face.\",\n  \"Fais deviner le mot sale de ta vie en mimes uniquement. 3 essais au groupe.\",\n  \"Envoie un vocal où tu souffles puis gémis puis souffles. Rythme imposé : 5 secondes.\",\n  \"Décris la première minute parfaite avec la personne de tes rêves. Minute par minute.\",\n  \"Mime ta technique signature avec la langue. Le groupe a les yeux bandés (blague).\",\n  \"Envoie un vocal en mode répondeur : « le plan est annulé » ta plus grande déception.\",\n  \"Chuchote la promesse cochonne que tu ferais pour une nuit inoubliable.\",\n  \"Décris comment tu embrasses le cou en traçant ton chemin avec ton doigt.\",\n  \"Fais une météo du désir : annonce la chaleur du salon et le taux d'humidité.\",\n  \"Envoie un vocal où tu comptes tes 3 zones favorites en les nommant.\",\n  \"Mime le moment où tu perds le contrôle. 10 secondes de théâtre pur.\",\n  \"Décris ta technique pour faire mouiller ou durcir en une phrase de 10 mots.\",\n  \"Envoie un vocal : « viens chez moi maintenant » version menaçante adorable.\",\n  \"Prends la pose exacte de ta nuit la plus sauvage. 10 secondes, immobile.\",\n  \"Décris le parfum que tu porterais ce soir et où tu voudrais qu'il soit senti.\",\n  \"Mime un baiser qui descend : front, joue, cou... jusqu'à ce que le groupe crie stop.\",\n  \"Envoie un vocal où tu fais le test : soupir, gémissement, cri. 3 niveaux.\",\n  \"Décris ce que tu regardes en premier chez un corps nu en traçant l'ordre avec ton doigt.\",\n  \"Fais deviner ta position de prédilection avec un seul son répété. 2 essais.\",\n  \"Envoie un message au joueur de ton choix : décris-lui sa plus belle qualité physique.\",\n  \"Chante « encore » comme un refrain de mariage avec une gestuelle complète.\",\n  \"Mime la scène exacte de ta première fois. Le groupe devine l'année.\",\n  \"Décris ton plan parfait à trois : qui, où, quel ordre. En supposant tout le monde d'accord.\",\n  \"Envoie un vocal de 15 secondes : ton meilleur bruit de fin, version longue.\",\n  \"Décris la tenue de nuit que tu mettrais ce soir et ce qu'elle laisserait voir.\",\n  \"Mime comment tu tiendrais quelqu'un contre le mur. Coussin à la place de la personne.\",\n  \"Envoie un vocal où tu expliques pourquoi tu es dangereux(se) ce soir.\",\n  \"Envoie un vocal où tu gémis le prénom d'un joueur comme si tu étais au sommet. 20 secondes. Zéro censure.\",\n  \"Envoie un vocal où tu décris ce que ta langue ferait en premier. 20 secondes. Zéro censure.\",\n  \"Envoie un vocal où tu chuchotes l'ordre la plus sale que tu oses donner. 20 secondes. Zéro censure.\",\n  \"Envoie un vocal où tu racontes ta dernière baise en mode audio-book sensuel. 20 secondes. Zéro censure.\",\n  \"Envoie un vocal où tu répètes « plus fort » de 5 façons différentes. 20 secondes. Zéro censure.\",\n  \"Envoie un vocal où tu imites ton bruit de fin, version intégrale. 20 secondes. Zéro censure.\",\n  \"Envoie un vocal où tu décris la bite ou la chatte parfaite selon toi, sans détour. 20 secondes. Zéro censure.\",\n  \"Envoie un vocal où tu fais deviner ta position par des sons uniquement. 20 secondes. Zéro censure.\",\n  \"Envoie un vocal où tu chuchotes « je mouille » ou « je bande » avec ta meilleure intonation. 20 secondes. Zéro censure.\",\n  \"Envoie un vocal où tu racontes ce que tu ferais avec 30 minutes et la personne en face. 20 secondes. Zéro censure.\",\n  \"Envoie un vocal où tu décris ton préliminaire préféré comme un coach sportif. 20 secondes. Zéro censure.\",\n  \"Envoie un vocal où tu imites un rapport téléphonique complet avec la personne fictive en face. 20 secondes. Zéro censure.\",\n  \"Envoie un vocal où tu chuchotes ta promesse si on te donne la personne de ton choix ce soir. 20 secondes. Zéro censure.\",\n  \"Envoie un vocal où tu décris la marque que tu laisserais et où exactement. 20 secondes. Zéro censure.\",\n  \"Envoie un vocal où tu répètes « baise-moi » version chuchotée puis version criée. 20 secondes. Zéro censure.\",\n  \"Envoie un vocal où tu racontes la scène exacte de ta nuit de rêve : minute par minute. 20 secondes. Zéro censure.\",\n  \"Envoie un vocal où tu imites le réveil parfait : soupir, étirement, main qui cherche. 20 secondes. Zéro censure.\",\n  \"Envoie un vocal où tu décris le goût que tu préfères ou que tu cherches encore. 20 secondes. Zéro censure.\",\n  \"Envoie un vocal où tu chuchotes ce que tu ferais si le groupe éteignait la lumière maintenant. 20 secondes. Zéro censure.\",\n  \"Envoie un vocal où tu décris la première chose que tu regardes quand un(e) partenaire se déshabille. 20 secondes. Zéro censure.\",\n  \"Envoie un vocal où tu imites l'appel de 2 h du matin le plus direct de ta vie. 20 secondes. Zéro censure.\",\n  \"Envoie un vocal où tu fais la météo de ton corps ce soir : températures locales. 20 secondes. Zéro censure.\",\n  \"Envoie un vocal où tu racontes ton meilleur coup en 20 secondes chrono. 20 secondes. Zéro censure.\",\n  \"Envoie un vocal où tu décris comment tu serres les draps quand c'est trop bon. 20 secondes. Zéro censure.\",\n  \"Envoie un vocal où tu chuchotes le secret que tu ne dirais jamais à voix haute normalement. 20 secondes. Zéro censure.\",\n  \"Envoie un vocal où tu imites ta respiration du début, du milieu et de la fin. 20 secondes. Zéro censure.\",\n  \"Envoie un vocal où tu décris l'endroit exact où tu voudrais être mordu(e) maintenant. 20 secondes. Zéro censure.\",\n  \"Envoie un vocal où tu racontes la nuit que tu referais sans changer un seul geste. 20 secondes. Zéro censure.\",\n  \"Envoie un vocal où tu décris l'orgasme parfait selon toi comme un musicien décrit un accord. 20 secondes. Zéro censure.\",\n  \"Envoie un vocal où tu chuchotes « après ce message, tu penses à moi toute la nuit ». 20 secondes. Zéro censure.\",\n  \"Envoie un vocal où tu imites ta tête ET ta voix quand tu demandes pardon après une bêtise chaude. 20 secondes. Zéro censure.\",\n  \"Envoie un vocal où tu décris la main parfaite : force, vitesse, destination. 20 secondes. Zéro censure.\",\n  \"Envoie un vocal où tu fais l'annonce radio : « ce soir, un seul gagnant… ». 20 secondes. Zéro censure.\",\n  \"Envoie un vocal où tu racontes la fois où tu as dû te taire à tout prix : l'histoire du silence. 20 secondes. Zéro censure.\",\n  \"Envoie un vocal où tu décris la tenue de nuit parfaite et ce qu'elle cacherait encore. 20 secondes. Zéro censure.\",\n  \"Fais un strip complet jusqu'à ta limite, 30 secondes chrono, cam ouverte. Le groupe note sur 10.\",\n  \"Fais un lap dance comme si la personne désirée était sur la chaise, cam ouverte. Le groupe note sur 10.\",\n  \"Fais le mime intégral de ta position favorite, cam ouverte. Le groupe note sur 10.\",\n  \"Fais la démonstration complète de ton baiser : lent, moyen, sauvage, cam ouverte. Le groupe note sur 10.\",\n  \"Fais le regard qui monte du visage aux pieds et remonte, 10 secondes, cam ouverte. Le groupe note sur 10.\",\n  \"Fais le mime du « mur » : tu prends quelqu'un d'imaginaire contre le mur, cam ouverte. Le groupe note sur 10.\",\n  \"Fais la marche de fin de nuit : démarche complète avec sourire, cam ouverte. Le groupe note sur 10.\",\n  \"Fais le mime du câlin possessif avec un coussin, 15 secondes, cam ouverte. Le groupe note sur 10.\",\n  \"Fais le regard de fin : 10 secondes qui disent tout, cam ouverte. Le groupe note sur 10.\",\n  \"Fais la démonstration de ta main dans tes cheveux puis sur ta nuque, cam ouverte. Le groupe note sur 10.\",\n  \"Fais le mime de la ceinture arrachée, tension maximum, cam ouverte. Le groupe note sur 10.\",\n  \"Fais la pose du matin après une nuit forte : étirement complet, cam ouverte. Le groupe note sur 10.\",\n  \"Fais le mime du frisson complet quand on te souffle dans le cou, cam ouverte. Le groupe note sur 10.\",\n  \"Fais la démonstration de ta façon de mordre ton propre poignet, cam ouverte. Le groupe note sur 10.\",\n  \"Fais le mime du « chut » avec montée du regard, 10 secondes, cam ouverte. Le groupe note sur 10.\",\n  \"Fais la démonstration du sourire qui pardonne tout, cam ouverte. Le groupe note sur 10.\",\n  \"Fais le mime d'un baiser qui descend : front, joue, cou, stop au signal, cam ouverte. Le groupe note sur 10.\",\n  \"Fais la pose du réveil de la personne qui ne veut pas partir, cam ouverte. Le groupe note sur 10.\",\n  \"Fais le mime du vêtement qui glisse seul, 10 secondes, cam ouverte. Le groupe note sur 10.\",\n  \"Fais la démonstration de ta façon de boire en fixant quelqu'un, cam ouverte. Le groupe note sur 10.\",\n  \"Fais le mime du téléphone jeté parce que la personne est arrivée, cam ouverte. Le groupe note sur 10.\",\n  \"Fais la pose « je t'attends depuis 20 minutes » version sexy, cam ouverte. Le groupe note sur 10.\",\n  \"Fais le mime du soupir de soulagement le plus réaliste, cam ouverte. Le groupe note sur 10.\",\n  \"Fais la démonstration du regard qui demande la permission, cam ouverte. Le groupe note sur 10.\",\n  \"Fais le mime de la main qui glisse sous le drap (ton drap), cam ouverte. Le groupe note sur 10.\",\n  \"Fais le regard de « dernière chance » avant de tourner la page, cam ouverte. Le groupe note sur 10.\",\n  \"Fais le mime du câlin qui refuse de lâcher, 15 secondes, cam ouverte. Le groupe note sur 10.\",\n  \"Fais la démonstration de ta respiration complète : début, montée, fin, cam ouverte. Le groupe note sur 10.\",\n  \"Fais la pose exacte de ta meilleure photo jamais envoyée, cam ouverte. Le groupe note sur 10.\",\n  \"Fais le mime du « viens » avec le doigt, version lente, cam ouverte. Le groupe note sur 10.\",\n  \"Fais la démonstration du « surprise » : un câlin par derrière avec un coussin, cam ouverte. Le groupe note sur 10.\",\n  \"Fais le mime de la porte fermée à clé : geste sec et regard, cam ouverte. Le groupe note sur 10.\",\n  \"Fais le regard de « j'ai tout entendu » version voisin(e), cam ouverte. Le groupe note sur 10.\",\n  \"Fais la pose du « c'est mon tour » : main tendue, regard fixe, cam ouverte. Le groupe note sur 10.\",\n  \"Fais le mime du dernier baiser de la nuit : lent, long, coupé net, cam ouverte. Le groupe note sur 10.\",\n  \"Écris ici, en public, sans filtre : ton sexto le plus osé jamais écrit. Le groupe valide ou tu recommences.\",\n  \"Écris ici, en public, sans filtre : tout ce que tu ferais ce soir en 6 étapes chronologiques. Le groupe valide ou tu recommences.\",\n  \"Écris ici, en public, sans filtre : la description brute de ton corps préféré. Le groupe valide ou tu recommences.\",\n  \"Écris ici, en public, sans filtre : la phrase la plus sale de ton répertoire. Le groupe valide ou tu recommences.\",\n  \"Écris ici, en public, sans filtre : ta nuit parfaite du coucher au lever, en 5 lignes. Le groupe valide ou tu recommences.\",\n  \"Écris ici, en public, sans filtre : le compliment sexuel le plus direct au joueur de ton choix. Le groupe valide ou tu recommences.\",\n  \"Écris ici, en public, sans filtre : la promesse cochonne que tu tiendras vraiment. Le groupe valide ou tu recommences.\",\n  \"Écris ici, en public, sans filtre : le mot qui te fait dire oui en 1 seconde. Le groupe valide ou tu recommences.\",\n  \"Écris ici, en public, sans filtre : la chose exacte que tu voudrais qu'on te fasse maintenant. Le groupe valide ou tu recommences.\",\n  \"Écris ici, en public, sans filtre : le message qui ferait craquer même un(e) saint(e). Le groupe valide ou tu recommences.\",\n  \"Écris ici, en public, sans filtre : ta technique signature en 3 phrases techniques. Le groupe valide ou tu recommences.\",\n  \"Écris ici, en public, sans filtre : la description de ta marque de fiel favorite à laisser. Le groupe valide ou tu recommences.\",\n  \"Écris ici, en public, sans filtre : le résumé de ta vie sexuelle en une phrase qui choque. Le groupe valide ou tu recommences.\",\n  \"Écris ici, en public, sans filtre : le fantasme n°1 que tu cacherais à ton/ta partenaire de vie. Le groupe valide ou tu recommences.\",\n  \"Écris ici, en public, sans filtre : la phrase de fin de nuit qui rend accro. Le groupe valide ou tu recommences.\",\n  \"Écris ici, en public, sans filtre : le surnom cochonne que tu donnerais au joueur à ta droite. Le groupe valide ou tu recommences.\",\n  \"Écris ici, en public, sans filtre : la chose que tu ferais pour un week-end avec la personne de tes rêves. Le groupe valide ou tu recommences.\",\n  \"Écris ici, en public, sans filtre : le script complet de tes 60 premières secondes avec ta star préférée. Le groupe valide ou tu recommences.\",\n  \"Écris ici, en public, sans filtre : la confession la plus crue jamais écrite dans ce salon. Le groupe valide ou tu recommences.\",\n  \"Écris ici, en public, sans filtre : le mot que tu chuchoterais à l'oreille pour tout déclencher. Le groupe valide ou tu recommences.\",\n  \"Décris à voix haute, sans détour : ta nuit la plus sauvage, acte par acte. 30 secondes. Le groupe écoute.\",\n  \"Décris à voix haute, sans détour : le corps de tes rêves, zone par zone, de la tête aux pieds. 30 secondes. Le groupe écoute.\",\n  \"Décris à voix haute, sans détour : ton meilleur coup : lieu, durée, bruit, fin. 30 secondes. Le groupe écoute.\",\n  \"Décris à voix haute, sans détour : ta technique avec la langue comme un mode d'emploi. 30 secondes. Le groupe écoute.\",\n  \"Décris à voix haute, sans détour : la façon exacte dont tu aimes jouir ou faire jouir. 30 secondes. Le groupe écoute.\",\n  \"Décris à voix haute, sans détour : le plan à trois parfait : qui, où, dans quel ordre. 30 secondes. Le groupe écoute.\",\n  \"Décris à voix haute, sans détour : le massage qui finit toujours au même endroit, étape par étape. 30 secondes. Le groupe écoute.\",\n  \"Décris à voix haute, sans détour : ta première fois : lieu, âge, durée, verdict. 30 secondes. Le groupe écoute.\",\n  \"Décris à voix haute, sans détour : le rapport le plus risqué de ta vie : lieu, danger, fin. 30 secondes. Le groupe écoute.\",\n  \"Décris à voix haute, sans détour : ton réveil parfait : chaque minute, chaque geste. 30 secondes. Le groupe écoute.\",\n  \"Décris à voix haute, sans détour : la nuit où tu as dit oui à tout : tout, tout, tout. 30 secondes. Le groupe écoute.\",\n  \"Décris à voix haute, sans détour : la scène de film X qui t'a le plus marqué(e), image par image. 30 secondes. Le groupe écoute.\",\n  \"Décris à voix haute, sans détour : le son le plus excitant du monde selon toi et pourquoi. 30 secondes. Le groupe écoute.\",\n  \"Décris à voix haute, sans détour : la promesse que tu ferais pour la personne en face, à voix haute. 30 secondes. Le groupe écoute.\",\n  \"Décris à voix haute, sans détour : la façon dont tu te touches : technique complète, pas de honte. 30 secondes. Le groupe écoute.\",\n  \"Décris à voix haute, sans détour : le baiser parfait selon toi : durée, langue, mains, souffle. 30 secondes. Le groupe écoute.\",\n  \"Décris à voix haute, sans détour : le vêtement que tu déchirerais en premier et pourquoi. 30 secondes. Le groupe écoute.\",\n  \"Décris à voix haute, sans détour : ton rituel de séduction complet, du regard à la fin. 30 secondes. Le groupe écoute.\",\n  \"Décris à voix haute, sans détour : la chose que tu n'as jamais osé demander et à qui. 30 secondes. Le groupe écoute.\",\n  \"Décris à voix haute, sans détour : le plan idéal avec quelqu'un d'ici, en supposant que tout le monde accepte. 30 secondes. Le groupe écoute.\",\n  \"Fais une pub de 15 secondes pour les huiles partout. Slogan obligatoire.\",\n  \"Mime ta plus belle scène avec les reprises après 10 minutes. 15 secondes.\",\n  \"Fais une pub de 15 secondes pour les corps qu'on redemande. Slogan obligatoire.\",\n  \"Décris les matelas qui tombent comme un commentateur sportif. 20 secondes.\",\n  \"Mime ta plus belle scène avec les liens et les menottes. 15 secondes.\",\n  \"Fais une pub de 15 secondes pour les mots les plus sales. Slogan obligatoire.\",\n  \"Imite quelqu'un qui découvre les huiles partout. Le groupe devine.\",\n  \"Raconte ton meilleur souvenir avec les plages de rêve sans vêtements. 20 secondes.\",\n  \"Montre le geste parfait pour les échanges de partenaires. 10 secondes.\",\n  \"Montre le geste parfait pour les corps qu'on redemande. 10 secondes.\",\n  \"Décris les soirs où tout est permis comme un commentateur sportif. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les films maison. 20 secondes.\",\n  \"Fais deviner les envies exprimées sans honte en 3 mimes maximum.\",\n  \"Fais deviner les douches qui brûlent la peau en 3 mimes maximum.\",\n  \"Montre le geste parfait pour les mots les plus sales. 10 secondes.\",\n  \"Mime ta plus belle scène avec les fessées jusqu'au rouge. 15 secondes.\",\n  \"Raconte ton meilleur souvenir avec les ordres obéis sans question. 20 secondes.\",\n  \"Décris les interdits qu'on franchit enfin comme un commentateur sportif. 20 secondes.\",\n  \"Décris les réveils de 4 h du matin comme un commentateur sportif. 20 secondes.\",\n  \"Décris les cunnilingus interminables comme un commentateur sportif. 20 secondes.\",\n  \"Décris les langues expertes comme un commentateur sportif. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les nudes archivés. Slogan obligatoire.\",\n  \"Montre le geste parfait pour les séries de rounds sans pause. 10 secondes.\",\n  \"Montre le geste parfait pour les jeux de rôle intimes. 10 secondes.\",\n  \"Mime ta plus belle scène avec les échanges de partenaires. 15 secondes.\",\n  \"Fais deviner les griffures profondes en 3 mimes maximum.\",\n  \"Fais une pub de 15 secondes pour les balcons entièrement nus. Slogan obligatoire.\",\n  \"Montre le geste parfait pour les quêtes d'orgasme simultané. 10 secondes.\",\n  \"Fais deviner les fessées jusqu'au rouge en 3 mimes maximum.\",\n  \"Montre le geste parfait pour les fantasmes à trois. 10 secondes.\",\n  \"Décris les nudes archivés comme un commentateur sportif. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les langues expertes. Le groupe devine.\",\n  \"Explique les fellations mémorables comme une notice de montage. 20 secondes.\",\n  \"Mime ta plus belle scène avec les mots les plus sales. 15 secondes.\",\n  \"Raconte ton meilleur souvenir avec les interdits qu'on franchit enfin. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les jouets bruyants. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les cris sans voisin pour juger. Slogan obligatoire.\",\n  \"Explique les films maison comme une notice de montage. 20 secondes.\",\n  \"Montre le geste parfait pour les réveils de 4 h du matin. 10 secondes.\",\n  \"Décris les morsures jusqu'aux marques comme un commentateur sportif. 20 secondes.\",\n  \"Explique les matelas qui tombent comme une notice de montage. 20 secondes.\",\n  \"Mime ta plus belle scène avec les jeux de rôle intimes. 15 secondes.\",\n  \"Explique les cunnilingus interminables comme une notice de montage. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les gémissements profonds. Le groupe devine.\",\n  \"Explique les ordres obéis sans question comme une notice de montage. 20 secondes.\",\n  \"Montre le geste parfait pour les cunnilingus interminables. 10 secondes.\",\n  \"Montre le geste parfait pour les ordres obéis sans question. 10 secondes.\",\n  \"Fais une pub de 15 secondes pour les jouets bruyants. Slogan obligatoire.\",\n  \"Raconte ton meilleur souvenir avec les liens et les menottes. 20 secondes.\",\n  \"Explique les douches qui brûlent la peau comme une notice de montage. 20 secondes.\",\n  \"Décris les yeux bandés toute la nuit comme un commentateur sportif. 20 secondes.\",\n  \"Mime ta plus belle scène avec les glaçons sur la peau chaude. 15 secondes.\",\n  \"Raconte ton meilleur souvenir avec les jeux de rôle intimes. 20 secondes.\",\n  \"Fais deviner les marques visibles au bureau en 3 mimes maximum.\",\n  \"Raconte ton meilleur souvenir avec les mots les plus sales. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les dominations totales. Le groupe devine.\",\n  \"Fais deviner les draps déchirés en 3 mimes maximum.\",\n  \"Montre le geste parfait pour les soirées sans aucun sommeil. 10 secondes.\",\n  \"Raconte ton meilleur souvenir avec les gémissements profonds. 20 secondes.\",\n  \"Mime ta plus belle scène avec les plages de rêve sans vêtements. 15 secondes.\",\n  \"Fais deviner les cris sans voisin pour juger en 3 mimes maximum.\",\n  \"Imite quelqu'un qui découvre les marques visibles au bureau. Le groupe devine.\",\n  \"Montre le geste parfait pour les glaçons sur la peau chaude. 10 secondes.\",\n  \"Explique les défis de 24 h au lit comme une notice de montage. 20 secondes.\",\n  \"Fais deviner les promesses cochonnes tenues en 3 mimes maximum.\",\n  \"Mime ta plus belle scène avec les ordres obéis sans question. 15 secondes.\",\n  \"Mime ta plus belle scène avec les dominations totales. 15 secondes.\",\n  \"Montre le geste parfait pour les morsures jusqu'aux marques. 10 secondes.\",\n  \"Mime ta plus belle scène avec les balcons entièrement nus. 15 secondes.\",\n  \"Montre le geste parfait pour les soirs où tout est permis. 10 secondes.\",\n  \"Explique les échanges de partenaires comme une notice de montage. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les cris sans voisin pour juger. 20 secondes.\",\n  \"Fais deviner les orgasmes multiples en 3 mimes maximum.\",\n  \"Fais deviner les glaçons sur la peau chaude en 3 mimes maximum.\",\n  \"Montre le geste parfait pour les nuits qui marquent une vie. 10 secondes.\",\n  \"Explique les interdits qu'on franchit enfin comme une notice de montage. 20 secondes.\",\n  \"Mime ta plus belle scène avec les secrets jamais racontés. 15 secondes.\",\n  \"Explique les balcons entièrement nus comme une notice de montage. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les défis de 24 h au lit. 20 secondes.\",\n  \"Décris les nuits qui marquent une vie comme un commentateur sportif. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les corps offerts. Le groupe devine.\",\n  \"Décris les liens et les menottes comme un commentateur sportif. 20 secondes.\",\n  \"Fais deviner les dominations totales en 3 mimes maximum.\",\n  \"Mime ta plus belle scène avec les quêtes d'orgasme simultané. 15 secondes.\",\n  \"Explique les cris sans voisin pour juger comme une notice de montage. 20 secondes.\",\n  \"Montre le geste parfait pour les draps déchirés. 10 secondes.\",\n  \"Fais une pub de 15 secondes pour les quêtes d'orgasme simultané. Slogan obligatoire.\",\n  \"Fais une pub de 15 secondes pour les séries de rounds sans pause. Slogan obligatoire.\",\n  \"Fais deviner les chevilles attachées en 3 mimes maximum.\",\n  \"Raconte ton meilleur souvenir avec les reprises après 10 minutes. 20 secondes.\",\n  \"Montre le geste parfait pour les chevilles attachées. 10 secondes.\",\n  \"Explique les jeux de rôle intimes comme une notice de montage. 20 secondes.\",\n  \"Explique les griffures profondes comme une notice de montage. 20 secondes.\",\n  \"Montre le geste parfait pour les interdits qu'on franchit enfin. 10 secondes.\",\n  \"Fais deviner les fellations mémorables en 3 mimes maximum.\",\n  \"Explique les envies exprimées sans honte comme une notice de montage. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les corps qu'on redemande. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les mains liées dans le dos. 20 secondes.\",\n  \"Fais deviner les nudes archivés en 3 mimes maximum.\",\n  \"Explique les nuits qui marquent une vie comme une notice de montage. 20 secondes.\",\n  \"Montre le geste parfait pour les plages de rêve sans vêtements. 10 secondes.\",\n  \"Explique les corps qu'on redemande comme une notice de montage. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les soirées sans aucun sommeil. Slogan obligatoire.\",\n  \"Fais une pub de 15 secondes pour les marques visibles au bureau. Slogan obligatoire.\",\n  \"Explique les nudes archivés comme une notice de montage. 20 secondes.\",\n  \"Décris les douches qui brûlent la peau comme un commentateur sportif. 20 secondes.\",\n  \"Mime ta plus belle scène avec les cris sans voisin pour juger. 15 secondes.\",\n  \"Explique les séries de rounds sans pause comme une notice de montage. 20 secondes.\",\n  \"Fais deviner les murs qui tremblent en 3 mimes maximum.\",\n  \"Imite quelqu'un qui découvre les nudes archivés. Le groupe devine.\",\n  \"Imite quelqu'un qui découvre les promesses cochonnes tenues. Le groupe devine.\",\n  \"Raconte ton meilleur souvenir avec les corps offerts. 20 secondes.\",\n  \"Décris les draps déchirés comme un commentateur sportif. 20 secondes.\",\n  \"Mime ta plus belle scène avec les huiles partout. 15 secondes.\",\n  \"Explique les marques visibles au bureau comme une notice de montage. 20 secondes.\",\n  \"Fais deviner les transpirations partagées en 3 mimes maximum.\",\n  \"Décris les transpirations partagées comme un commentateur sportif. 20 secondes.\",\n  \"Explique les dominations totales comme une notice de montage. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les matelas qui tombent. Slogan obligatoire.\",\n  \"Décris les corps qu'on redemande comme un commentateur sportif. 20 secondes.\",\n  \"Décris les cris sans voisin pour juger comme un commentateur sportif. 20 secondes.\",\n  \"Explique les promesses cochonnes tenues comme une notice de montage. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les glaçons sur la peau chaude. 20 secondes.\",\n  \"Mime ta plus belle scène avec les douches qui brûlent la peau. 15 secondes.\",\n  \"Fais une pub de 15 secondes pour les cunnilingus interminables. Slogan obligatoire.\",\n  \"Montre le geste parfait pour les films maison. 10 secondes.\",\n  \"Mime ta plus belle scène avec les fellations mémorables. 15 secondes.\",\n  \"Décris les orgasmes multiples comme un commentateur sportif. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les reprises après 10 minutes. Slogan obligatoire.\",\n  \"Imite quelqu'un qui découvre les nuits qui marquent une vie. Le groupe devine.\",\n  \"Fais deviner les séries de rounds sans pause en 3 mimes maximum.\",\n  \"Imite quelqu'un qui découvre les piscines sans maillot. Le groupe devine.\",\n  \"Montre le geste parfait pour les murs qui tremblent. 10 secondes.\",\n  \"Raconte ton meilleur souvenir avec les balcons entièrement nus. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les dominations totales. 20 secondes.\",\n  \"Décris les mains liées dans le dos comme un commentateur sportif. 20 secondes.\",\n  \"Montre le geste parfait pour les langues expertes. 10 secondes.\",\n  \"Montre le geste parfait pour les fessées assumées. 10 secondes.\",\n  \"Décris les jouets bruyants comme un commentateur sportif. 20 secondes.\",\n  \"Fais deviner les fessées assumées en 3 mimes maximum.\",\n  \"Imite quelqu'un qui découvre les échanges de partenaires. Le groupe devine.\",\n  \"Explique les secrets jamais racontés comme une notice de montage. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les promesses cochonnes tenues. Slogan obligatoire.\",\n  \"Fais une pub de 15 secondes pour les fessées assumées. Slogan obligatoire.\",\n  \"Imite quelqu'un qui découvre les réveils de 4 h du matin. Le groupe devine.\",\n  \"Fais une pub de 15 secondes pour les jeux de rôle intimes. Slogan obligatoire.\",\n  \"Décris les défis de 24 h au lit comme un commentateur sportif. 20 secondes.\",\n  \"Décris les séries de rounds sans pause comme un commentateur sportif. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les orgasmes multiples. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les morsures jusqu'aux marques. 20 secondes.\",\n  \"Mime ta plus belle scène avec les défis de 24 h au lit. 15 secondes.\",\n  \"Explique les chevilles attachées comme une notice de montage. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les murs qui tremblent. Le groupe devine.\",\n  \"Fais une pub de 15 secondes pour les draps déchirés. Slogan obligatoire.\",\n  \"Explique les contacts dans la foule comme une notice de montage. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les envies exprimées sans honte. Slogan obligatoire.\",\n  \"Fais une pub de 15 secondes pour les nuits qui marquent une vie. Slogan obligatoire.\",\n  \"Fais une pub de 15 secondes pour les liens et les menottes. Slogan obligatoire.\",\n  \"Fais une pub de 15 secondes pour les films maison. Slogan obligatoire.\",\n  \"Explique les gémissements profonds comme une notice de montage. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les positions du Kamasutra non testées. Le groupe devine.\",\n  \"Mime ta plus belle scène avec les nudes archivés. 15 secondes.\",\n  \"Mime ta plus belle scène avec les matelas qui tombent. 15 secondes.\",\n  \"Fais une pub de 15 secondes pour les interdits qu'on franchit enfin. Slogan obligatoire.\",\n  \"Fais une pub de 15 secondes pour les défis de 24 h au lit. Slogan obligatoire.\",\n  \"Mime ta plus belle scène avec les piscines sans maillot. 15 secondes.\",\n  \"Mime ta plus belle scène avec les draps déchirés. 15 secondes.\",\n  \"Raconte ton meilleur souvenir avec les séries de rounds sans pause. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les matelas qui tombent. 20 secondes.\",\n  \"Explique les fantasmes à trois comme une notice de montage. 20 secondes.\",\n  \"Décris les huiles partout comme un commentateur sportif. 20 secondes.\",\n  \"Fais deviner les corps offerts en 3 mimes maximum.\",\n  \"Montre le geste parfait pour les balcons entièrement nus. 10 secondes.\",\n  \"Montre le geste parfait pour les marques visibles au bureau. 10 secondes.\",\n  \"Raconte ton meilleur souvenir avec les soirées sans aucun sommeil. 20 secondes.\",\n  \"Décris les secrets jamais racontés comme un commentateur sportif. 20 secondes.\",\n  \"Mime ta plus belle scène avec les cunnilingus interminables. 15 secondes.\",\n  \"Imite quelqu'un qui découvre les plages de rêve sans vêtements. Le groupe devine.\",\n  \"Imite quelqu'un qui découvre les séries de rounds sans pause. Le groupe devine.\",\n  \"Mime ta plus belle scène avec les nuits qui marquent une vie. 15 secondes.\",\n  \"Raconte ton meilleur souvenir avec les langues expertes. 20 secondes.\",\n  \"Mime ta plus belle scène avec les séries de rounds sans pause. 15 secondes.\",\n  \"Raconte ton meilleur souvenir avec les chevilles attachées. 20 secondes.\",\n  \"Fais deviner les plages de rêve sans vêtements en 3 mimes maximum.\",\n  \"Fais une pub de 15 secondes pour les contacts dans la foule. Slogan obligatoire.\",\n  \"Explique les mains liées dans le dos comme une notice de montage. 20 secondes.\",\n  \"Décris les positions du Kamasutra non testées comme un commentateur sportif. 20 secondes.\",\n  \"Fais deviner les langues expertes en 3 mimes maximum.\",\n  \"Raconte ton meilleur souvenir avec les positions du Kamasutra non testées. 20 secondes.\",\n  \"Explique les reprises après 10 minutes comme une notice de montage. 20 secondes.\",\n  \"Décris les glaçons sur la peau chaude comme un commentateur sportif. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les corps qu'on redemande. Le groupe devine.\",\n  \"Fais une pub de 15 secondes pour les langues expertes. Slogan obligatoire.\",\n  \"Imite quelqu'un qui découvre les mains liées dans le dos. Le groupe devine.\",\n  \"Montre le geste parfait pour les gémissements profonds. 10 secondes.\",\n  \"Montre le geste parfait pour les nudes archivés. 10 secondes.\",\n  \"Fais une pub de 15 secondes pour les morsures jusqu'aux marques. Slogan obligatoire.\",\n  \"Explique les mots les plus sales comme une notice de montage. 20 secondes.\",\n  \"Mime ta plus belle scène avec les mains liées dans le dos. 15 secondes.\",\n  \"Raconte ton meilleur souvenir avec les cunnilingus interminables. 20 secondes.\",\n  \"Fais deviner les mains liées dans le dos en 3 mimes maximum.\",\n  \"Fais deviner les soirs où tout est permis en 3 mimes maximum.\",\n  \"Montre le geste parfait pour les orgasmes multiples. 10 secondes.\",\n  \"Décris les corps offerts comme un commentateur sportif. 20 secondes.\",\n  \"Montre le geste parfait pour les liens et les menottes. 10 secondes.\",\n  \"Explique les réveils de 4 h du matin comme une notice de montage. 20 secondes.\",\n  \"Fais deviner les positions du Kamasutra non testées en 3 mimes maximum.\",\n  \"Décris les chevilles attachées comme un commentateur sportif. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les envies exprimées sans honte. 20 secondes.\",\n  \"Explique les murs qui tremblent comme une notice de montage. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les réveils de 4 h du matin. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les fessées assumées. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les plages de rêve sans vêtements. Slogan obligatoire.\",\n  \"Montre le geste parfait pour les positions du Kamasutra non testées. 10 secondes.\",\n  \"Imite quelqu'un qui découvre les glaçons sur la peau chaude. Le groupe devine.\",\n  \"Fais une pub de 15 secondes pour les corps offerts. Slogan obligatoire.\",\n  \"Montre le geste parfait pour les mains liées dans le dos. 10 secondes.\",\n  \"Raconte ton meilleur souvenir avec les douches qui brûlent la peau. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les transpirations partagées. Slogan obligatoire.\",\n  \"Fais une pub de 15 secondes pour les piscines sans maillot. Slogan obligatoire.\",\n  \"Montre le geste parfait pour les secrets jamais racontés. 10 secondes.\",\n  \"Imite quelqu'un qui découvre les liens et les menottes. Le groupe devine.\",\n  \"Raconte ton meilleur souvenir avec les quêtes d'orgasme simultané. 20 secondes.\",\n  \"Explique les orgasmes multiples comme une notice de montage. 20 secondes.\",\n  \"Décris les dominations totales comme un commentateur sportif. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les fessées jusqu'au rouge. 20 secondes.\",\n  \"Montre le geste parfait pour les dominations totales. 10 secondes.\",\n  \"Raconte ton meilleur souvenir avec les fantasmes à trois. 20 secondes.\",\n  \"Décris les piscines sans maillot comme un commentateur sportif. 20 secondes.\",\n  \"Explique les draps déchirés comme une notice de montage. 20 secondes.\",\n  \"Explique les piscines sans maillot comme une notice de montage. 20 secondes.\",\n  \"Décris les fantasmes à trois comme un commentateur sportif. 20 secondes.\",\n  \"Mime ta plus belle scène avec les fessées assumées. 15 secondes.\",\n  \"Mime ta plus belle scène avec les corps offerts. 15 secondes.\",\n  \"Mime ta plus belle scène avec les orgasmes multiples. 15 secondes.\",\n  \"Imite quelqu'un qui découvre les soirs où tout est permis. Le groupe devine.\",\n  \"Explique les fessées assumées comme une notice de montage. 20 secondes.\",\n  \"Montre le geste parfait pour les piscines sans maillot. 10 secondes.\",\n  \"Mime ta plus belle scène avec les fantasmes à trois. 15 secondes.\",\n  \"Raconte ton meilleur souvenir avec les huiles partout. 20 secondes.\",\n  \"Décris les mots les plus sales comme un commentateur sportif. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les murs qui tremblent. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les griffures profondes. Slogan obligatoire.\",\n  \"Décris les échanges de partenaires comme un commentateur sportif. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les fellations mémorables. Slogan obligatoire.\",\n  \"Fais une pub de 15 secondes pour les soirs où tout est permis. Slogan obligatoire.\",\n  \"Fais deviner les réveils de 4 h du matin en 3 mimes maximum.\",\n  \"Imite quelqu'un qui découvre les défis de 24 h au lit. Le groupe devine.\",\n  \"Mime ta plus belle scène avec les envies exprimées sans honte. 15 secondes.\",\n  \"Montre le geste parfait pour les défis de 24 h au lit. 10 secondes.\",\n  \"Mime ta plus belle scène avec les transpirations partagées. 15 secondes.\",\n  \"Fais une pub de 15 secondes pour les fantasmes à trois. Slogan obligatoire.\",\n  \"Fais deviner les mots les plus sales en 3 mimes maximum.\",\n  \"Explique les positions du Kamasutra non testées comme une notice de montage. 20 secondes.\",\n  \"Fais deviner les reprises après 10 minutes en 3 mimes maximum.\",\n  \"Explique les quêtes d'orgasme simultané comme une notice de montage. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les secrets jamais racontés. Le groupe devine.\",\n  \"Explique les glaçons sur la peau chaude comme une notice de montage. 20 secondes.\",\n  \"Montre le geste parfait pour les jouets bruyants. 10 secondes.\",\n  \"Mime ta plus belle scène avec les griffures profondes. 15 secondes.\",\n  \"Fais une pub de 15 secondes pour les dominations totales. Slogan obligatoire.\",\n  \"Imite quelqu'un qui découvre les balcons entièrement nus. Le groupe devine.\",\n  \"Montre le geste parfait pour les huiles partout. 10 secondes.\",\n  \"Fais une pub de 15 secondes pour les douches qui brûlent la peau. Slogan obligatoire.\",\n  \"Imite quelqu'un qui découvre les envies exprimées sans honte. Le groupe devine.\",\n  \"Décris les reprises après 10 minutes comme un commentateur sportif. 20 secondes.\",\n  \"Montre le geste parfait pour les promesses cochonnes tenues. 10 secondes.\",\n  \"Fais deviner les morsures jusqu'aux marques en 3 mimes maximum.\",\n  \"Imite quelqu'un qui découvre les interdits qu'on franchit enfin. Le groupe devine.\",\n  \"Explique les corps offerts comme une notice de montage. 20 secondes.\",\n  \"Fais deviner les quêtes d'orgasme simultané en 3 mimes maximum.\",\n  \"Raconte ton meilleur souvenir avec les promesses cochonnes tenues. 20 secondes.\",\n  \"Décris les quêtes d'orgasme simultané comme un commentateur sportif. 20 secondes.\",\n  \"Explique les soirées sans aucun sommeil comme une notice de montage. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les quêtes d'orgasme simultané. Le groupe devine.\",\n  \"Explique les liens et les menottes comme une notice de montage. 20 secondes.\",\n  \"Mime ta plus belle scène avec les murs qui tremblent. 15 secondes.\",\n  \"Fais deviner les balcons entièrement nus en 3 mimes maximum.\",\n  \"Mime ta plus belle scène avec les soirs où tout est permis. 15 secondes.\",\n  \"Raconte ton meilleur souvenir avec les piscines sans maillot. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les orgasmes multiples. Slogan obligatoire.\",\n  \"Décris les jeux de rôle intimes comme un commentateur sportif. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les soirées sans aucun sommeil. Le groupe devine.\",\n  \"Explique les plages de rêve sans vêtements comme une notice de montage. 20 secondes.\",\n  \"Mime ta plus belle scène avec les morsures jusqu'aux marques. 15 secondes.\",\n  \"Décris les contacts dans la foule comme un commentateur sportif. 20 secondes.\",\n  \"Fais deviner les interdits qu'on franchit enfin en 3 mimes maximum.\",\n  \"Fais une pub de 15 secondes pour les yeux bandés toute la nuit. Slogan obligatoire.\",\n  \"Fais une pub de 15 secondes pour les ordres obéis sans question. Slogan obligatoire.\",\n  \"Mime ta plus belle scène avec les soirées sans aucun sommeil. 15 secondes.\",\n  \"Raconte ton meilleur souvenir avec les échanges de partenaires. 20 secondes.\",\n  \"Raconte ton meilleur souvenir avec les contacts dans la foule. 20 secondes.\",\n  \"Fais deviner les soirées sans aucun sommeil en 3 mimes maximum.\",\n  \"Imite quelqu'un qui découvre les cris sans voisin pour juger. Le groupe devine.\",\n  \"Raconte ton meilleur souvenir avec les nuits qui marquent une vie. 20 secondes.\",\n  \"Mime ta plus belle scène avec les langues expertes. 15 secondes.\",\n  \"Mime ta plus belle scène avec les interdits qu'on franchit enfin. 15 secondes.\",\n  \"Imite quelqu'un qui découvre les jeux de rôle intimes. Le groupe devine.\",\n  \"Décris les soirées sans aucun sommeil comme un commentateur sportif. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les orgasmes multiples. Le groupe devine.\",\n  \"Fais deviner les jouets bruyants en 3 mimes maximum.\",\n  \"Montre le geste parfait pour les matelas qui tombent. 10 secondes.\",\n  \"Raconte ton meilleur souvenir avec les marques visibles au bureau. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les jouets bruyants. Le groupe devine.\",\n  \"Décris les envies exprimées sans honte comme un commentateur sportif. 20 secondes.\",\n  \"Mime ta plus belle scène avec les marques visibles au bureau. 15 secondes.\",\n  \"Raconte ton meilleur souvenir avec les draps déchirés. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les fantasmes à trois. Le groupe devine.\",\n  \"Fais deviner les films maison en 3 mimes maximum.\",\n  \"Mime ta plus belle scène avec les contacts dans la foule. 15 secondes.\",\n  \"Montre le geste parfait pour les envies exprimées sans honte. 10 secondes.\",\n  \"Fais une pub de 15 secondes pour les secrets jamais racontés. Slogan obligatoire.\",\n  \"Fais deviner les piscines sans maillot en 3 mimes maximum.\",\n  \"Explique les transpirations partagées comme une notice de montage. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les morsures jusqu'aux marques. Le groupe devine.\",\n  \"Montre le geste parfait pour les fessées jusqu'au rouge. 10 secondes.\",\n  \"Explique les langues expertes comme une notice de montage. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les mains liées dans le dos. Slogan obligatoire.\",\n  \"Montre le geste parfait pour les douches qui brûlent la peau. 10 secondes.\",\n  \"Raconte ton meilleur souvenir avec les griffures profondes. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les griffures profondes. Le groupe devine.\",\n  \"Fais deviner les matelas qui tombent en 3 mimes maximum.\",\n  \"Fais deviner les corps qu'on redemande en 3 mimes maximum.\",\n  \"Fais deviner les nuits qui marquent une vie en 3 mimes maximum.\",\n  \"Décris les ordres obéis sans question comme un commentateur sportif. 20 secondes.\",\n  \"Imite quelqu'un qui découvre les fessées assumées. Le groupe devine.\",\n  \"Imite quelqu'un qui découvre les reprises après 10 minutes. Le groupe devine.\",\n  \"Mime ta plus belle scène avec les promesses cochonnes tenues. 15 secondes.\",\n  \"Mime ta plus belle scène avec les positions du Kamasutra non testées. 15 secondes.\",\n  \"Imite quelqu'un qui découvre les draps déchirés. Le groupe devine.\",\n  \"Montre le geste parfait pour les fellations mémorables. 10 secondes.\",\n  \"Décris les gémissements profonds comme un commentateur sportif. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les échanges de partenaires. Slogan obligatoire.\",\n  \"Fais deviner les contacts dans la foule en 3 mimes maximum.\",\n  \"Montre le geste parfait pour les reprises après 10 minutes. 10 secondes.\",\n  \"Fais deviner les jeux de rôle intimes en 3 mimes maximum.\",\n  \"Mime ta plus belle scène avec les chevilles attachées. 15 secondes.\",\n  \"Décris les griffures profondes comme un commentateur sportif. 20 secondes.\",\n  \"Fais une pub de 15 secondes pour les fessées jusqu'au rouge. Slogan obligatoire.\",\n  \"Décris les fessées jusqu'au rouge comme un commentateur sportif. 20 secondes.\"\n]\n  }\n};\n/* ⭐ Ajout perso facile : colle ici tes questions, elles s'ajoutent automatiquement ⭐ */\nconst PERSO = { 1:{verite:[],action:[]}, 2:{verite:[],action:[]}, 3:{verite:[],action:[]}, 4:{verite:[],action:[]} };\nObject.keys(PERSO).forEach(d => { QUESTIONS[d].verite.push(...PERSO[d].verite); QUESTIONS[d].action.push(...PERSO[d].action); });\nlet TOT = 0; Object.keys(QUESTIONS).forEach(d => { TOT += QUESTIONS[d].verite.length + QUESTIONS[d].action.length; });\nconsole.log('📚 Banque v31 : ' + TOT + ' questions réelles — 1000 par niveau');\n";

app.get('/bank.js', (_, res) => {
  res.set('Content-Type', 'application/javascript');
  res.set('Cache-Control', 'no-store');   /* v31 : la banque 4000 arrive toujours fraîche */
  res.send(BANK_SRC);
});
app.get('/manifest.webmanifest', (_, res) => {
  res.set('Content-Type', 'application/manifest+json');
  res.set('Cache-Control', 'no-store');
  res.send(JSON.stringify({
    name: 'Vérité ou Action 🌶️ 18+',
    short_name: 'V ou A 🌶️',
    description: 'Vérité ou Action entre adultes : la roue, les gages, le feu 🔥',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#14090f',
    theme_color: '#14090f',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  }));
});
app.get('/sw.js', (_, res) => {
  res.set('Content-Type', 'application/javascript');
  res.set('Cache-Control', 'no-store');
  res.send("const C = 'voa-v31';\nself.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(['/', '/bank.js', '/icon-192.png', '/icon-512.png', '/manifest.webmanifest']))); self.skipWaiting(); });\nself.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); });\n/* v30 : RESEAU D'ABORD — chaque deploiement apparait immediatement ; le cache ne sert qu'en mode hors ligne */\nself.addEventListener('fetch', e => {\n  if (e.request.method !== 'GET') return;\n  const u = new URL(e.request.url);\n  const track = e.request.mode === 'navigate' || ['/bank.js', '/icon-192.png', '/icon-512.png', '/manifest.webmanifest'].indexOf(u.pathname) >= 0;\n  if (!track) return;\n  e.respondWith(fetch(e.request).then(r => { const cl = r.clone(); caches.open(C).then(c => c.put(e.request, cl)); return r; }).catch(() => caches.match(e.request, { ignoreSearch: e.request.mode === 'navigate' }).then(hit => hit || caches.match('/'))));\n});");
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
      io.to(socket.id).emit('feed:init', { feed: room.feed.slice(-40), seen: room.seen || {} });
      sys(room, name + ' est de retour 🔄');
      io.to(room.code).emit('player:back', { name });
      return broadcast(room);
    }
    if (room.players.size >= MAX_PLAYERS) return socket.emit('error:msg', { key: 'full' });
    if (Date.now() >= room.inviteAt + INVITE_TTL) return socket.emit('error:msg', { key: 'expired' });
    room.pending = room.pending.filter(r => r.name.toLowerCase() !== name.toLowerCase());
    room.pending.push({ id: socket.id, name, gender: data.gender === 'femme' ? 'femme' : 'homme', at: Date.now() });
    room.pending = room.pending.filter(r => Date.now() - r.at < 300000).slice(-4);
    socket.join(room.code);
    socket.emit('join:waiting', { code: room.code });
    io.to(room.code).emit('join:pending', { pending: room.pending.map(r => ({ id: r.id, name: r.name })) });
  });

  socket.on('pending:list', () => {
    const room = socketRoom.get(socket.id); if (!room) return;
    const me = room.players.get(socket.id); if (!me || !me.isAdmin) return;
    room.pending = room.pending.filter(r => Date.now() - r.at < 300000 && io.sockets.sockets.get(r.id));
    socket.emit('join:pending', { pending: room.pending.map(r => ({ id: r.id, name: r.name })) });
  });

  socket.on('join:respond', ({ id, ok } = {}) => {
    const room = socketRoom.get(socket.id); if (!room) return;
    const me = room.players.get(socket.id); if (!me || !me.isAdmin) return;
    const req = room.pending.find(r => r.id === id);
    if (!req) { socket.emit('join:expired'); return; }
    room.pending = room.pending.filter(r => r.id !== id);
    io.to(room.code).emit('join:pending', { pending: room.pending.map(r => ({ id: r.id, name: r.name })) });
    const sock = io.sockets.sockets.get(id);
    if (!ok || !sock) { io.to(id).emit('join:rejected'); return; }
    if (room.players.size >= MAX_PLAYERS) { io.to(id).emit('error:msg', { key: 'full' }); return; }
    addPlayer(room, sock, req.name, false, req.gender);
    sock.emit('joined', { code: room.code });
    io.to(id).emit('feed:init', { feed: room.feed.slice(-40), seen: room.seen || {} });
    broadcast(room);
  });

  const THEMES = ['grenade', 'sunset', 'honey', 'velvet', 'ocean', 'lavender', 'mint', 'coffee', 'neon', 'gold'];
  const THEMES_N = { grenade: '🌶️ Grenade', sunset: '🌅 Coucher de soleil', honey: '🍯 Miel doré', velvet: '🍷 Velours', ocean: '🌊 Océan', lavender: '💜 Lavande', mint: '🌿 Menthe', coffee: '☕ Café', neon: '🌌 Néon', gold: '👑 Or' };
  socket.on('theme', ({ t } = {}) => {
    const room = socketRoom.get(socket.id); if (!room) return;
    const me = room.players.get(socket.id); if (!me || !me.isAdmin) return;
    if (!THEMES.includes(t) || t === room.theme) return;
    room.theme = t;
    sys(room, '🎨 ' + me.name + ' change le thème : ' + THEMES_N[t] + ' (il restera pour le mode hors ligne !)');
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

  /* ═══ v30 : Vu · réactions · « écrit… » ═══ */
  socket.on('feed:seen', () => {
    const room = socketRoom.get(socket.id); if (!room) return;
    const p = room.players.get(socket.id); if (!p) return;
    if (!room.feed.length) return;
    const last = room.feed[room.feed.length - 1].id;
    if (room.seen[p.name] === last) return;
    room.seen[p.name] = last;
    io.to(room.code).emit('feed:seen', { name: p.name, id: last });
  });
  const RE_OK = ['❤️', '😂', '😮', '😢', '🔥', '👍'];
  socket.on('chat:react', ({ id, emoji } = {}) => {
    const room = socketRoom.get(socket.id); if (!room) return;
    const p = room.players.get(socket.id); if (!p) return;
    if (!RE_OK.includes(emoji)) return;
    const it = room.feed.find(x => x.id === String(id)); if (!it) return;
    it.re = it.re || {};
    const arr = it.re[emoji] = it.re[emoji] || [];
    const i = arr.indexOf(p.name);
    if (i >= 0) arr.splice(i, 1); else arr.push(p.name);
    if (!arr.length) delete it.re[emoji];
    io.to(room.code).emit('feed:re', { id: it.id, re: it.re });
  });
  socket.on('chat:typing', () => {
    const room = socketRoom.get(socket.id); if (!room) return;
    const p = room.players.get(socket.id); if (!p) return;
    socket.to(room.code).emit('feed:typing', { name: p.name });
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
    /* v30.3 : s'il ne reste qu'une personne (salon à 2), le salon se ferme → l'autre joueur retourne à l'accueil */
    if (room.players.size <= 1) { closeRoom(room, 'parti'); return; }
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

try { module.exports = { QUESTIONS, drawQuestion }; } catch (e) {}
server.listen(process.env.PORT || 3000, '0.0.0.0', () => {
  console.log('🌶️ Vérité ou Action v31 — démarré sur le port', process.env.PORT || 3000);
  if (process.env.GROQ_API_KEY) {
    console.log('🤖 IA Groq : CLÉ TROUVÉE ✅ — question FAVORITE, illimitée, français simple');
    fetch('https://api.groq.com/openai/v1/models', { headers: { Authorization: 'Bearer ' + process.env.GROQ_API_KEY }, signal: AbortSignal.timeout(8000) })
      .then(r => { if (!r.ok) { console.log('🤖 IA vérification clé : HTTP', r.status, r.status === 401 ? '→ CLÉ INVALIDE, recrée-la sur console.groq.com' : ''); return null; } return r.json(); })
      .then(j => { if (j && j.data) console.log('🤖 IA vérification clé : OK ✅ — modèles dispo :', j.data.map(m => m.id).slice(0, 6).join(', ')); })
      .catch(e => console.log('🤖 IA vérification clé : injoignable', e.message));
  } else {
    console.log('🤖 IA : ABSENTE — mode banque locale 4000 questions');
  }
});
