
# 🎮 KIADISA - Qui a dit ça ?

[![Build Status](https://github.com/YOUR_USERNAME/kiadisa/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/YOUR_USERNAME/kiadisa/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Code Quality](https://img.shields.io/badge/code%20quality-A-brightgreen.svg)](https://github.com/YOUR_USERNAME/kiadisa)
[![Built with Lovable](https://img.shields.io/badge/Built%20with-Lovable-ff69b4.svg)](https://lovable.dev)

> Un jeu social multijoueur immersif, fun et stratégique où les révélations se mélangent au bluff ! 😲

## 🚀 Aperçu

KIADISA est une application mobile PWA qui propose 4 mini-jeux originaux pour découvrir les secrets de vos amis tout en s'amusant. Créé avec amour sur [Lovable.dev](https://lovable.dev), ce projet combine design moderne et gameplay addictif.

### ✨ Fonctionnalités

- 🎲 **4 Mini-jeux** : KiKaDi, KiDiVrai, KiDéjà, KiDeNous
- 👥 **Multijoueur** : 2 à 8 joueurs en temps réel
- 🎨 **Design moderne** : Glassmorphism + animations fluides
- 📱 **Mobile-first** : PWA optimisée pour mobile
- 🔒 **Sécurisé** : Authentification Supabase + RLS
- ⚡ **Temps réel** : Synchronisation instantanée entre joueurs

## 🛠️ Stack Technique

- **Frontend** : React 18 + TypeScript + Vite
- **Styling** : Tailwind CSS + shadcn/ui
- **Animations** : Framer Motion + GSAP
- **Backend** : Supabase (Auth + Realtime + Database)
- **Testing** : Vitest + Testing Library
- **CI/CD** : GitHub Actions
- **Deployment** : Lovable.dev + PWA

## 📦 Installation

### Prérequis
- Node.js 18+
- npm ou bun

### Démarrage rapide

```bash
# Cloner le repository
git clone https://github.com/YOUR_USERNAME/kiadisa.git
cd kiadisa

# Installer les dépendances
npm install

# Configurer Husky (hooks Git)
npm run prepare

# Démarrer en développement
npm run dev
```

### Scripts disponibles

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run preview      # Prévisualiser le build
npm run lint         # Vérifier le code (ESLint)
npm run format       # Formater le code (Prettier)
npm run format:check # Vérifier le formatage
npm run test         # Lancer les tests
npm run test:watch   # Tests en mode watch
npm run audit        # Audit de sécurité
npm run validate     # Lint + format + test + build
```

## 🎮 Comment jouer

1. **Créer une partie** : Choisissez le mode, l'ambiance et les mini-jeux
2. **Inviter des amis** : Partagez le code de partie (6 caractères)
3. **Jouer ensemble** : Chaque manche = 1 mini-jeu avec 5 phases
4. **Gagner des points** : Bluffez, devinez, accusez pour marquer
5. **Débloquer du contenu** : Utilisez vos pièces dans la boutique

## 📁 Structure du projet

```
src/
├── components/         # Composants UI réutilisables
│   ├── ui/            # shadcn/ui components
│   └── games/         # Composants de mini-jeux
├── pages/             # Pages de l'application
├── hooks/             # Hooks React personnalisés
├── lib/               # Utilitaires et helpers
├── types/             # Définitions TypeScript
└── __tests__/         # Tests unitaires
```

Voir [README_STRUCTURE.md](./README_STRUCTURE.md) pour plus de détails.

## 🤝 Contribution

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'Add amazing feature'`)
4. Pushez vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

### Standards de qualité

- Tests unitaires requis (`npm run test`)
- Code formaté avec Prettier (`npm run format`)
- Lint ESLint sans erreurs (`npm run lint`)
- Build sans erreurs (`npm run build`)

## 🔗 Liens utiles

- 🎨 **Lovable.dev** : [Editeur en ligne](https://lovable.dev)
- 📚 **Documentation** : [README_STRUCTURE.md](./README_STRUCTURE.md)
- 🐛 **Issues** : [GitHub Issues](https://github.com/YOUR_USERNAME/kiadisa/issues)
- 💬 **Discussions** : [GitHub Discussions](https://github.com/YOUR_USERNAME/kiadisa/discussions)

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🌟 Remerciements

- [Lovable.dev](https://lovable.dev) pour l'excellent environnement de développement
- [shadcn/ui](https://ui.shadcn.com) pour les composants UI
- [Supabase](https://supabase.com) pour le backend
- La communauté open source pour les outils utilisés

---

**Fait avec ❤️ et [Lovable.dev](https://lovable.dev)**
