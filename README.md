# ⚡ AG Performance

Mon appli de sport en mode jeu vidéo : je fais mes séances, je gagne de l'XP, je monte de niveau. 100 % pensée pour le mobile.

## 🎮 Ce qu'elle fait

- **Niveaux & XP** — chaque série validée rapporte des points, avec rangs (🥚 Recrue → 👑 Légende), série de jours 🔥, quêtes de la semaine et trophées à débloquer.
- **Séance jour par jour** — je note mes kg et mes reps set par set, l'appli détecte mes records 🏆 et sauvegarde tout automatiquement.
- **Programme modifiable** — j'ajoute, supprime ou réorganise mes jours et mes exercices (séries, reps, temps de repos, emoji, couleur).
- **Chrono de repos** — se lance tout seul quand je valide une série, et à la fin il **vibre, sonne et envoie une notification** sur le téléphone.
- **Journal** — VTT (km, D+, calories), padel (score en 3 sets) ou n'importe quelle autre séance, avec la date de mon choix.

Tout est stocké en local sur le téléphone (localStorage), aucun compte, aucun serveur.

## 🚀 Lancer le projet

```bash
npm install
npm run dev
```

Puis http://localhost:3000

## 📱 Sur le téléphone

L'appli est une PWA : ouvrir le site, puis « Ajouter à l'écran d'accueil ». Dans l'onglet profil, bouton **🔔 Autoriser** pour activer les notifications du chrono, et **🧪 Tester** pour vérifier que ça sonne bien.

## 🧱 Stack

Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS · Framer Motion · lucide-react

## 📁 Fichiers

```text
app/          page principale, layout, styles
components/   les écrans (accueil, séance, programme, journal, profil) + chrono
lib/          programme par défaut, calcul XP/badges, stockage, alertes
public/       service worker (notifications), manifest, icône
```
