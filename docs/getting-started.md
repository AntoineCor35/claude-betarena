# Getting Started

Lancement de BetArena sur un poste neuf, en partant de zéro.

---

## 1. Prérequis

| Outil | Version | Lien d'install |
|-------|---------|----------------|
| **Git** | n'importe quelle version récente | [git-scm.com](https://git-scm.com/downloads) |
| **Node.js** | **24 LTS** (Krypton) | via [nvm](https://github.com/nvm-sh/nvm) (Linux/macOS/WSL) ou [nvm-windows](https://github.com/coreybutler/nvm-windows) |
| **npm** | **11.13.0** | livré avec Node, à upgrader (voir ci-dessous) |
| **Docker Desktop** | >= 24.0 | [docs.docker.com](https://docs.docker.com/get-docker/) |
| **Task** | >= 3.x | voir [docs/taskfile.md](taskfile.md#installer-task) |

### Installer Node 24 + npm 11.13

```bash
# Avec nvm (recommandé)
nvm install 24
nvm use 24
nvm alias default 24

# Mettre à jour npm
npm install -g npm@11.13.0

# Vérifier
node --version    # v24.x
npm --version     # 11.13.0
```

### Installer Task

```bash
# macOS
brew install go-task

# Linux / WSL
sh -c "$(curl --location https://taskfile.dev/install.sh)" -- -d -b /usr/local/bin

# Windows (winget)
winget install Task.Task

# Windows (Scoop)
scoop install task
```

> 📚 Pour plus d'infos : [taskfile.dev/docs/installation](https://taskfile.dev/docs/installation)
>
> ⚠️ **Important** : redémarre ton terminal après l'install de Task pour recharger le PATH.

---

## 2. Cloner et lancer

> 💡 **Projet déjà cloné ?** Ignore l'étape `git clone`. Assure-toi simplement d'être sur la bonne branche et synchronisé avec le distant (`git pull`) avant d'exécuter `task setup`.

```bash
# (uniquement si pas encore cloné)
git clone git@github.com:EpitechMscProPromo2027/T-ESP-800-project-100883-REN_BetArena.git
cd T-ESP-800-project-100883-REN_BetArena

# Setup complet : génère .env + npm install (workspaces)
task setup

# Démarrer la stack Docker (backend + frontend + postgres)
task dev:up
```

> ⚠️ **Un port est déjà utilisé ?** (`bind: address already in use` ou erreur similaire)
>
> Le projet utilise par défaut : **8080** (frontend), **3000** (backend), **5432** (postgres).
>
> **Identifie ce qui occupe le port, puis libère-le :**
>
> ```bash
> # Linux / macOS
> lsof -i :8080              # affiche le PID du process
> kill -9 <PID>              # tue le process
>
> # Windows (PowerShell)
> Get-NetTCPConnection -LocalPort 8080 | Select-Object OwningProcess
> Stop-Process -Id <PID> -Force
>
> # Windows (Git Bash / cmd)
> netstat -ano | findstr :8080
> taskkill /PID <PID> /F
> ```
>
> 💡 **Cas fréquent : PostgreSQL local qui occupe le 5432.**
> Si tu as une instance PostgreSQL installée sur ta machine (paquet système, pas Docker), elle bloque le 5432. Sur Linux :
> ```bash
> sudo systemctl stop postgresql           # arrêt ponctuel
> sudo systemctl disable postgresql        # empêche le démarrage auto au boot (optionnel)
> ```
> Sur macOS (Homebrew) : `brew services stop postgresql`.
>
> 🐳 **Sur Windows** : avant de chercher ailleurs, ouvre **Docker Desktop** → onglet **Containers** et vérifie qu'aucun conteneur d'un autre projet ne tourne sur le port concerné. Stoppe-le directement depuis l'interface si c'est le cas.
>

Attends 10-30 secondes le temps que tout démarre, puis vérifie :

| Service    | URL                       |
|------------|---------------------------|
| Frontend   | http://localhost:8080     |
| Backend    | http://localhost:3000     |
| PostgreSQL | `localhost:5432`          |

```bash
task dev:ps   # affiche l'état des conteneurs
```

---

## 3. Mobile (optionnel)

Le mobile **n'est pas Dockerisé** (limitation iOS + UX émulateur). Il tourne en local via Expo.

```bash
# (optionnel) démarrer uniquement backend + postgres si le frontend web n'est pas nécessaire
task dev:mobile

# Lancer Expo
task mobile:start
```

Puis scanne le QR code affiché avec l'app **Expo Go** ([App Store](https://apps.apple.com/app/expo-go/id982107779) / [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)) — le téléphone doit être sur le **même WiFi** que le PC.

| Cas | Solution |
|-----|----------|
| Pas de téléphone sous la main | `task mobile:web` (preview navigateur) |
| Mac + simulateur iOS | `task mobile:ios` (nécessite Xcode) |
| Émulateur Android | `task mobile:android` (nécessite Android Studio) |
| Windows/Linux + iPhone | Expo Go obligatoire (simu iOS impossible hors Mac) |

---

## 4. Dépannage rapide

| Erreur | Solution |
|--------|----------|
| `task: command not found` après install | Redémarre ton terminal |
| `Docker n'est pas lancé` | Démarre Docker Desktop |
| Conflit de versions npm / WorkletsError mobile | `task clean && task install` |
| Port déjà utilisé | Modifier le port concerné dans `.env` |
| `node_modules` corrompus | `task clean && task install` |
| Reset complet de la stack Docker | `task dev:reset` (supprime volumes) ou `task dev:nuke` |

---

## 5. Pour aller plus loin

- **[docs/taskfile.md](taskfile.md)** — référence complète des commandes `task`
- **[docs/docker.md](docker.md)** — architecture Docker, multi-stage, volumes
- **[CONTRIBUTING.md](../CONTRIBUTING.md)** — workflow git, conventions de commit, PR
- **[README.md](../README.md)** — vision projet, documents de cadrage

---

*Si quelque chose ne marche pas et n'est pas dans le dépannage : envoyer un message sur Discord dans le salon dev-ops*
