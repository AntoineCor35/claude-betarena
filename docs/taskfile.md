# Taskfile

Guide d'utilisation du task runner pour BetArena.

---

## Prérequis

| Outil | Version requise | Pourquoi                                       |
|-------|-----------------|------------------------------------------------|
| **Node.js** | **24 LTS** (Krypton)   | Backend, frontend, mobile (Expo SDK 55)        |
| **npm**     | **11.13.0**            | Workspaces + overrides résolus correctement    |
| **Docker** + Docker Compose | >= 24.0 / >= 2.20 | Stack dev (back, front, db) |
| **Task**    | >= 3.x                 | Task runner — voir installation ci-dessous     |

> **Switch de version Node recommandé** via [nvm](https://github.com/nvm-sh/nvm) (Linux/macOS/WSL) ou [nvm-windows](https://github.com/coreybutler/nvm-windows) :
> ```bash
> nvm install 24 && nvm use 24
> npm install -g npm@11.13.0
> ```
>
> Si tu changes de version Node après une install, lance `task clean && task install` pour régénérer les binaires natifs.

### Installer Task

```bash
# macOS
brew install go-task

# Linux / WSL
sh -c "$(curl --location https://taskfile.dev/install.sh)" -- -d -b /usr/local/bin

# Windows (Scoop)
scoop install task

# Windows (winget)
winget install Task.Task
```

Vérifier :

```bash
task --version
```

---

## Démarrage rapide

```bash
# 1. Setup complet (génère .env + npm install)
task setup

# 2. Démarrer la stack Docker (back + front + db)
task dev:up

# 3. (optionnel) Lancer le mobile en local
task mobile:start    # puis scan le QR code avec Expo Go

# 4. Lister toutes les commandes disponibles
task --list
```

---

## Référence des commandes

### Setup

| Commande       | Description                                                            |
|----------------|------------------------------------------------------------------------|
| `task setup`   | Setup complet : génère `.env` (si absent) **+** `npm install` racine   |
| `task env`     | Crée uniquement le `.env` depuis `.env.example` (si absent)            |
| `task install` | Installe les dépendances npm de tous les workspaces                    |
| `task clean`   | Supprime tous les `node_modules` + `package-lock.json` (confirmation)  |

> **Quand utiliser `task clean` ?**
> - Après un changement de version Node (ex: passage à Node 24)
> - En cas de conflit de versions de dépendances (mismatch transitive)
> - Quand un coéquipier modifie le `package.json` racine ou ajoute des `overrides`
>
> Workflow type : `task clean` → `task install`

---

### Développement — Docker

| Commande                         | Description                                                    |
|----------------------------------|----------------------------------------------------------------|
| `task dev:up`                    | Démarre tous les services en arrière-plan                      |
| `task dev:build`                 | Démarre avec rebuild des images                                |
| `task dev:mobile`                | Démarre uniquement backend + postgres (pour dev mobile, allège la charge) |
| `task dev:down`                  | Arrête tous les services                                       |
| `task dev:reset`                 | Arrête et supprime les volumes (reset données + node_modules)  |
| `task dev:nuke`                  | Reset complet : conteneurs + volumes + images custom           |
| `task dev:ps`                    | Affiche l'état des conteneurs                                  |
| `task dev:logs -- <service>`     | Suit les logs d'un service en temps réel                       |
| `task dev:restart -- <service>`  | Redémarre un service                                           |
| `task dev:data`                  | Lance le service data processing (profil optionnel)            |

> Les services disponibles sont : `backend`, `frontend`, `postgres`, `data`.

**Exemples :**

```bash
task dev:logs -- backend
task dev:logs -- frontend
task dev:restart -- backend
```

---

### Production — Docker

| Commande                         | Description                               |
|----------------------------------|-------------------------------------------|
| `task prod:up`                   | Démarre l'environnement de production     |
| `task prod:down`                 | Arrête l'environnement de production      |
| `task prod:ps`                   | Affiche l'état des conteneurs en prod     |
| `task prod:logs -- <service>`    | Suit les logs d'un service en prod        |

> En production, les images sont tirées depuis le registry Docker (poussées par la CI/CD). Aucun build local n'est effectué.

---

### Frontend — Local (sans Docker)

| Commande              | Description                                    |
|-----------------------|------------------------------------------------|
| `task front:dev`      | Lance le serveur Vite (port 8080)              |
| `task front:build`    | Compile le frontend pour la production         |
| `task front:lint`     | Lint avec ESLint (--fix)                       |
| `task front:format`   | Formate le code avec Prettier                  |
| `task front:format-lint` | Formate puis lint                           |

---

### Backend — Local (sans Docker)

| Commande            | Description                                         |
|---------------------|-----------------------------------------------------|
| `task back:dev`     | Lance le serveur Fastify avec hot-reload (port 3000) |
| `task back:build`   | Compile le TypeScript (`tsc`)                       |
| `task back:preview` | Lance le backend compilé depuis `dist/`             |

---

### Mobile — Local (sans Docker)

| Commande              | Description                          |
|-----------------------|--------------------------------------|
| `task mobile:start`   | Lance le serveur de développement Expo |
| `task mobile:ios`     | Lance l'app sur iOS                  |
| `task mobile:android` | Lance l'app sur Android              |
| `task mobile:web`     | Lance l'app dans le navigateur       |
| `task mobile:lint`    | Lint le code mobile                  |

---

### Data pipeline — Local (sans Docker)

| Commande          | Description                                           |
|-------------------|-------------------------------------------------------|
| `task data:setup` | Crée le venv Python et installe les dépendances       |

---

## Flux de travail typiques

### Premier lancement

```bash
task setup       # Génère .env + npm install (workspaces)
task dev:up      # Démarre tout
```

### Après un changement de version Node ou un conflit de deps npm

```bash
task clean       # Supprime tous les node_modules + package-lock.json
task install     # Réinstalle proprement
```

### Après avoir modifié `package.json` ou un `Dockerfile`

```bash
task dev:build
```

### Déboguer un service

```bash
task dev:ps                  # Vérifier l'état des conteneurs
task dev:logs -- backend     # Suivre les logs en temps réel
task dev:restart -- backend  # Redémarrer si nécessaire
```

### Reset complet (base de données corrompue, node_modules cassés)

```bash
task dev:reset    # Supprime les volumes (données + node_modules)
task dev:build    # Repart de zéro avec rebuild
```

### Reset total (image corrompue ou changement majeur)

```bash
task dev:nuke     # Supprime tout (confirmation demandée)
task dev:build
```

---

## Commandes destructives

Trois commandes demandent une confirmation interactive avant de s'exécuter :

| Commande         | Ce qui est supprimé                                 |
|------------------|-----------------------------------------------------|
| `task clean`     | `node_modules` (racine + workspaces) + `package-lock.json` |
| `task dev:reset` | Volumes Docker (données PostgreSQL + node_modules)  |
| `task dev:nuke`  | Volumes + images custom (rebuild complet requis)    |

---

## Voir toutes les commandes disponibles

```bash
task --list
```

Exemple de sortie :

```
task: Available tasks for this project:
* back:build          Compile le backend TypeScript
* back:dev            Lance le serveur backend Fastify avec hot-reload (port 3000)
* back:preview        Lance le backend compilé depuis dist/
* clean               Supprime tous les node_modules et le package-lock.json racine
* data:setup          Crée le venv Python et installe les dépendances data
* dev:build           Démarre avec rebuild des images
* dev:data            Lance le service data processing (profil optionnel)
* dev:down            Arrête tous les services (dev)
* dev:logs            Suit les logs d'un service — ex: task dev:logs -- backend
* dev:mobile          Démarre uniquement backend + postgres (pour dev mobile)
* dev:nuke            Reset complet : conteneurs + volumes + images custom
* dev:ps              Affiche l'état des conteneurs (dev)
* dev:reset           Arrête et supprime les volumes (reset complet des données)
* dev:restart         Redémarre un service — ex: task dev:restart -- backend
* dev:up              Démarre tous les services en arrière-plan (dev)
* env                 Crée .env depuis .env.example si absent
* front:build         Compile le frontend pour la production
* front:dev           Lance le serveur de développement Vite (port 8080)
* front:format        Formate le code frontend (Prettier)
* front:format-lint   Formate puis lint le frontend
* front:lint          Lint le frontend (ESLint avec --fix)
* install             Installe les dépendances npm de tous les workspaces
* mobile:android      Lance l'app sur Android
* mobile:ios          Lance l'app sur iOS
* mobile:lint         Lint le code mobile
* mobile:start        Lance le serveur de développement Expo
* mobile:web          Lance l'app dans le navigateur
* prod:down           Arrête l'environnement de production
* prod:logs           Suit les logs d'un service en prod
* prod:ps             Affiche l'état des conteneurs (prod)
* prod:up             Démarre l'environnement de production
* setup               Setup complet : .env + npm install (workspaces)
```
