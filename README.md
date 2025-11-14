# FFVB Ranking Calendar

> Application non officielle pour extraire les calendriers de matchs de la FFVB et générer des fichiers ICS

## 📋 Description

Ce projet permet d'extraire les données de calendrier depuis le site officiel de la FFVB (Fédération Française de Volleyball) et de générer des fichiers au format ICS (iCalendar) pour les importer dans votre calendrier préféré.

### ✨ Fonctionnalités

- 🔒 **Sécurisé** : Validation des entrées, rate limiting, et headers de sécurité
- 📝 **Type-safe** : TypeScript avec types stricts et validation complète
- 🚀 **Production-ready** : Logging structuré, gestion d'erreurs robuste
- 🎨 **Code quality** : ESLint, Prettier, et conventions de code strictes
- 🛡️ **Protection** : Rate limiting pour éviter les abus (20 req/15min sur scraping)
- ✅ **Validation** : Validation côté client et serveur avec messages d'erreur clairs

## 🏗️ Architecture

```
ffvb-ranking-calendar/
├── backend/                    # Code serveur TypeScript
│   ├── index.ts               # Point d'entrée Netlify Functions
│   ├── server.ts              # Serveur Express pour développement local
│   ├── config/                # Configuration
│   │   └── env.ts             # Validation des variables d'environnement
│   ├── constants/             # Constantes de l'application
│   │   └── index.ts           # Messages d'erreur, indices, valeurs par défaut
│   ├── middleware/            # Middlewares Express
│   │   ├── errorHandler.ts   # Gestion globale des erreurs
│   │   ├── rateLimiter.ts    # Rate limiting
│   │   └── validation.ts     # Validation des requêtes
│   ├── routes/                # Routes API
│   │   ├── index.ts
│   │   ├── calendar.ts
│   │   └── info.ts
│   ├── controllers/           # Contrôleurs
│   │   ├── calendarController.ts
│   │   └── infoController.ts
│   ├── services/              # Services métier
│   │   └── extract.ts
│   ├── types/                 # Types TypeScript
│   │   └── index.ts           # Interfaces et types
│   └── utils/                 # Utilitaires
│       ├── response.ts        # Helpers de réponse HTTP
│       ├── logger.ts          # Logger Winston
│       ├── utils.ts           # Utilitaires généraux
│       ├── crawler.ts         # Parsing HTML
│       └── convert.ts         # Conversion vers ICS
├── frontend/                  # Interface web
│   ├── index.html
│   ├── styles/
│   │   └── main.css
│   ├── scripts/
│   │   └── main.js            # Avec validation et debouncing
│   └── assets/
├── dist/                      # Fichiers compilés (généré)
├── .prettierrc                # Configuration Prettier
├── eslint.config.mjs          # Configuration ESLint
├── package.json               # Configuration pnpm
├── tsconfig.json              # Configuration TypeScript
├── netlify.toml               # Configuration Netlify
└── README.md                  # Documentation complète
```

## 🚀 Installation

### Prérequis

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Installation des dépendances

```bash
pnpm install
```

### Configuration

Créez un fichier `.env` à la racine du projet :

```env
# Obligatoire
URL_FFVB=https://www.ffvbbeach.org/ffvbapp/resu/vbspo_calendrier.php

# Optionnel (avec valeurs par défaut)
PORT=8080
NODE_ENV=development
LOG_LEVEL=info
```

**⚠️ Important :** `URL_FFVB` est obligatoire. L'application ne démarrera pas sans cette variable et validera qu'il s'agit d'une URL valide.

## 💻 Utilisation

### Développement local

```bash
# Mode développement avec hot-reload
pnpm run dev
```

L'application sera accessible sur `http://localhost:8080`

### Build

```bash
# Compiler le projet
pnpm run build
```

### Production

```bash
# Démarrer le serveur en production
pnpm run start
```

### Déploiement Netlify

```bash
# Déployer sur Netlify
pnpm run deploy
```

## 📡 API Endpoints

Tous les endpoints sont protégés par :
- ✅ Validation automatique des paramètres
- 🛡️ Rate limiting (20 requêtes/15min pour scraping, 100/15min pour API générale)
- 🔒 Headers de sécurité (Helmet)

### GET `/api/calendar/raw`

Récupère les données brutes du calendrier au format JSON.

**Paramètres (tous obligatoires) :**
- `saison` : Saison au format `YYYY/YYYY` (ex: 2024/2025)
- `codent` : Code entité (non vide)
- `poule` : Numéro de poule (non vide)

**Exemple :**
```bash
curl "http://localhost:8080/api/calendar/raw?saison=2024/2025&codent=PTFL59&poule=AMB"
```

**Réponse :**
```json
{
  "message": "GET - 2024/2025 PTFL59 AMB",
  "data": [[["date", "time", "home", "away", "location"]]]
}
```

### GET `/api/calendar/ics`

Génère et télécharge un fichier ICS pour une équipe spécifique.

**Paramètres (tous obligatoires) :**
- `saison` : Saison au format `YYYY/YYYY` (ex: 2024/2025)
- `codent` : Code entité (non vide)
- `poule` : Numéro de poule (non vide)
- `team` : Nom exact de l'équipe (non vide)

**Exemple :**
```bash
curl "http://localhost:8080/api/calendar/ics?saison=2024/2025&codent=PTFL59&poule=AMB&team=MonEquipe" -o calendar.ics
```

**Réponse :** Fichier ICS téléchargeable

### GET `/api/getteams`

Récupère la liste des équipes d'une poule.

**Paramètres (tous obligatoires) :**
- `saison` : Saison au format `YYYY/YYYY` (ex: 2024/2025)
- `codent` : Code entité (non vide)
- `poule` : Numéro de poule (non vide)

**Exemple :**
```bash
curl "http://localhost:8080/api/getteams?saison=2024/2025&codent=PTFL59&poule=AMB"
```

**Réponse :**
```json
{
  "message": "GET - 2024/2025 PTFL59 AMB",
  "data": ["Équipe 1", "Équipe 2", "Équipe 3"]
}
```

### Codes d'erreur

- **400** : Paramètres manquants ou invalides (format saison incorrect, etc.)
- **429** : Trop de requêtes (rate limit dépassé)
- **500** : Erreur serveur ou timeout FFVB

## 🔍 Comment trouver les paramètres ?

Les informations nécessaires se trouvent dans l'URL du calendrier sur le site FFVB officiel :

```
https://www.ffvbbeach.org/ffvbapp/resu/vbspo_calendrier.php?saison=20XX/20XX&codent=XXXX&poule=XXX
```

## 🛠️ Technologies utilisées

### Backend
- **Runtime :** Node.js >= 18.0.0
- **Framework :** Express.js
- **Langage :** TypeScript (strict mode)
- **Web Scraping :** Cheerio
- **Calendrier :** ics (génération de fichiers ICS)
- **Déploiement :** Netlify Functions, serverless-http

### Sécurité & Qualité
- **Validation :** express-validator
- **Rate Limiting :** express-rate-limit
- **Sécurité :** helmet (headers de sécurité)
- **Logging :** winston (logging structuré)
- **Linting :** ESLint + @typescript-eslint
- **Formatting :** Prettier

### Frontend
- **HTML5, CSS3, JavaScript (ES6+)**
- **Validation côté client**
- **Debouncing pour les requêtes**

## 📝 Scripts disponibles

### Build & Démarrage
- `pnpm run build` - Compile le projet (backend + frontend)
- `pnpm run build:backend` - Compile uniquement le backend TypeScript
- `pnpm run build:frontend` - Prépare le frontend
- `pnpm run dev` - Lance le serveur en mode développement avec hot-reload
- `pnpm run start` - Lance le serveur en production
- `pnpm run start:netlify` - Lance Netlify Dev
- `pnpm run deploy` - Déploie sur Netlify

### Code Quality
- `pnpm run lint` - Vérifie le code avec ESLint
- `pnpm run lint:fix` - Corrige automatiquement les erreurs ESLint
- `pnpm run format` - Formate le code avec Prettier
- `pnpm run format:check` - Vérifie le formatage sans modifier les fichiers

## 🔧 Développement

### Workflow recommandé

1. **Avant de commencer :**
   ```bash
   pnpm install
   cp .env.example .env  # Puis éditer .env
   ```

2. **Pendant le développement :**
   ```bash
   pnpm run dev  # Terminal 1 : serveur avec hot-reload
   ```

3. **Avant de committer :**
   ```bash
   pnpm run format      # Formate le code
   pnpm run lint        # Vérifie les erreurs
   pnpm run build       # Vérifie la compilation
   ```

### Configuration IDE

Pour une meilleure expérience de développement :
- Installez les extensions ESLint et Prettier
- Activez "Format on Save"
- Définissez Prettier comme formateur par défaut

### Structure du code

- **Types TypeScript** : Tous les types sont définis dans `backend/types/`
- **Constants** : Valeurs magiques dans `backend/constants/`
- **Middleware** : Validation, rate limiting, erreurs dans `backend/middleware/`
- **Logging** : Utilisez `logger.info()`, `logger.error()` au lieu de `console.log`

## 🐛 Dépannage

### "Missing required environment variables: URL_FFVB"
Créez un fichier `.env` avec `URL_FFVB=https://www.ffvbbeach.org/ffvbapp/resu/vbspo_calendrier.php`

### "Validation failed: saison: saison must be in format YYYY/YYYY"
Le format de la saison doit être `2024/2025`, pas `2024-2025` ou autre.

### "Too many requests from this IP"
Vous avez dépassé la limite de requêtes (20/15min pour scraping). Attendez quelques minutes.

### Erreurs TypeScript
Exécutez `pnpm run build:backend` pour voir les erreurs détaillées.

## 📚 Documentation supplémentaire

- **MIGRATION.md** : Guide de migration et changements récents
- **Code comments** : Documentation inline pour la logique complexe

## 📄 Licence

ISC

## 👤 Auteur

Theo Denoyelle

---

**Note :** Ce projet n'est pas officiel et n'est pas affilié à la FFVB.

