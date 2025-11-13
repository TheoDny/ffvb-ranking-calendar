# FFVB Ranking Calendar

> Application non officielle pour extraire les calendriers de matchs de la FFVB et générer des fichiers ICS

## 📋 Description

Ce projet permet d'extraire les données de calendrier depuis le site officiel de la FFVB (Fédération Française de Volleyball) et de générer des fichiers au format ICS (iCalendar) pour les importer dans votre calendrier préféré.

## 🏗️ Architecture

```
ffvb-ranking-calendar/
├── backend/                    # Code serveur TypeScript
│   ├── index.ts               # Point d'entrée Netlify Functions
│   ├── server.ts              # Serveur Express pour développement local
│   ├── routes/                # Routes API
│   │   ├── index.ts
│   │   ├── calendar.ts
│   │   └── info.ts
│   ├── controllers/           # Contrôleurs
│   │   ├── calendarController.ts
│   │   └── infoController.ts
│   ├── services/              # Services métier
│   │   └── extract.ts
│   ├── utils/                 # Utilitaires
│   │   ├── response.ts
│   │   ├── logger.ts
│   │   ├── utils.ts
│   │   ├── crawler.ts
│   │   └── convert.ts
│   └── types/                 # Types TypeScript (vide pour l'instant)
├── frontend/                  # Interface web
│   ├── index.html
│   ├── styles/
│   │   └── main.css
│   ├── scripts/
│   │   └── main.js
│   └── assets/
├── scripts/                   # Scripts de build
│   └── build-frontend.js
├── dist/                      # Fichiers compilés (généré)
│   └── backend/
├── package.json               # Configuration pnpm
├── tsconfig.json              # Configuration TypeScript
├── netlify.toml               # Configuration Netlify
├── .gitignore                 # Fichiers ignorés par Git
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
PORT=8080
URL_FFVB=https://www.ffvbbeach.org/ffvbapp/resu/vbspo_calendrier.php
NODE_ENV=development
```

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

### GET `/api/calendar/raw`

Récupère les données brutes du calendrier au format JSON.

**Paramètres :**
- `saison` : Saison (ex: 2024/2025)
- `codent` : Code entité
- `poule` : Numéro de poule

**Exemple :**
```
GET /api/calendar/raw?saison=2024/2025&codent=1234&poule=1
```

### GET `/api/calendar/ics`

Génère et télécharge un fichier ICS pour une équipe spécifique.

**Paramètres :**
- `saison` : Saison (ex: 2024/2025)
- `codent` : Code entité
- `poule` : Numéro de poule
- `team` : Nom de l'équipe

**Exemple :**
```
GET /api/calendar/ics?saison=2024/2025&codent=1234&poule=1&team=MonEquipe
```

### GET `/api/getteams`

Récupère la liste des équipes d'une poule.

**Paramètres :**
- `saison` : Saison (ex: 2024/2025)
- `codent` : Code entité
- `poule` : Numéro de poule

**Exemple :**
```
GET /api/getteams?saison=2024/2025&codent=1234&poule=1
```

## 🔍 Comment trouver les paramètres ?

Les informations nécessaires se trouvent dans l'URL du calendrier sur le site FFVB officiel :

```
https://www.ffvbbeach.org/ffvbapp/resu/vbspo_calendrier.php?saison=20XX/20XX&codent=XXXX&poule=XXX
```

## 🛠️ Technologies utilisées

- **Backend :** Node.js, Express, TypeScript
- **Web Scraping :** Crawler, Cheerio
- **Calendrier :** ics (génération de fichiers ICS)
- **Déploiement :** Netlify Functions
- **Frontend :** HTML, CSS, JavaScript vanilla

## 📝 Scripts disponibles

- `pnpm run build` - Compile le projet (backend + frontend)
- `pnpm run build:backend` - Compile uniquement le backend TypeScript
- `pnpm run build:frontend` - Prépare le frontend
- `pnpm run dev` - Lance le serveur en mode développement
- `pnpm run start` - Lance le serveur en production
- `pnpm run start:netlify` - Lance Netlify Dev
- `pnpm run deploy` - Déploie sur Netlify

## 📄 Licence

ISC

## 👤 Auteur

Theo Denoyelle

---

**Note :** Ce projet n'est pas officiel et n'est pas affilié à la FFVB.

