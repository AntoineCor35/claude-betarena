# Docker

Guide d'utilisation de l'environnement Docker pour BetArena.

---

## Prérequis

- [Docker](https://docs.docker.com/get-docker/) (>= 24.0)
- [Docker Compose](https://docs.docker.com/compose/install/) (>= 2.20)

---

## Démarrage rapide (développement)

```bash
# 1. Copier la configuration d'environnement
cp .env.example .env

# 2. Lancer l'environnement de développement
docker compose -f docker-compose.dev.yml up -d

# 3. Vérifier que tout tourne
docker compose -f docker-compose.dev.yml ps
```

Les services sont accessibles sur :

| Service    | URL                          |
|------------|------------------------------|
| Frontend   | http://localhost:8080         |
| Backend    | http://localhost:3000         |
| PostgreSQL | localhost:5432               |

> Les ports sont configurables via le fichier `.env`.

---

## Commandes courantes

### Développement

```bash
# Démarrer tous les services
docker compose -f docker-compose.dev.yml up -d

# Démarrer avec rebuild des images (après modif de package.json, requirements.txt, etc.)
docker compose -f docker-compose.dev.yml up -d --build

# Voir les logs d'un service
docker compose -f docker-compose.dev.yml logs -f backend

# Redémarrer un service
docker compose -f docker-compose.dev.yml restart backend

# Arrêter tous les services
docker compose -f docker-compose.dev.yml down

# Arrêter et supprimer les volumes (reset complet des données)
docker compose -f docker-compose.dev.yml down -v

# Lancer le service data processing (profil optionnel)
docker compose -f docker-compose.dev.yml --profile data up -d data
```

### Production

```bash
# Démarrer l'environnement de production
docker compose -f docker-compose.prod.yml up -d

# Arrêter l'environnement de production
docker compose -f docker-compose.prod.yml down
```

> **Note** : en production, les images backend et frontend sont tirées depuis le registry Docker (poussées par la CI/CD). Aucun build local n'est effectué.

---

## Architecture Docker

### Fichiers

```
.
├── docker-compose.dev.yml      # Compose développement (build local)
├── docker-compose.prod.yml     # Compose production (images registry)
├── .env.example                # Variables d'environnement (template)
├── src/
│   ├── backend/Dockerfile      # Multi-stage : dev + prod
│   ├── frontend/Dockerfile     # Multi-stage : dev + prod
│   └── data/Dockerfile         # Multi-stage : dev + prod
```

### Services

| Service      | Dev                                  | Prod                                   |
|--------------|--------------------------------------|-----------------------------------------|
| **postgres** | Image `postgres:15-alpine`           | Image `postgres:15-alpine`              |
| **backend**  | Build local, hot-reload (tsx watch)  | Image registry, Node compilé            |
| **frontend** | Build local, HMR (Vite)             | Image registry, nginx + fichiers static |
| **data**     | Build local, profil optionnel        | Image registry                          |
| prometheus   | —                                    | Image `prom/prometheus:latest`          |
| grafana      | —                                    | Image `grafana/grafana:latest`          |

### Multi-stage Dockerfiles

Chaque Dockerfile contient deux sections indépendantes :

- **DEVELOPMENT** : image complète avec outils de dev (hot-reload, HMR, tsx watch)
- **PRODUCTION** : image minimale optimisée (nginx pour le front, JS compilé pour le back)

Le `docker-compose` cible le bon stage via la directive `target:` (dev) ou tire l'image pré-construite (prod).

---

## Hot-reload / HMR

En développement, le code source est monté en bind mount dans les conteneurs. Les modifications sont détectées automatiquement :

- **Backend** : `tsx watch` redémarre le serveur à chaque modification dans `src/`
- **Frontend** : Vite HMR applique les changements dans le navigateur sans rechargement

> **Quand rebuild ?** Uniquement si vous modifiez `package.json`, `requirements.txt`, un `Dockerfile`, ou un fichier de configuration non monté en volume.

---

## Volumes

| Volume                 | Usage                                              |
|------------------------|----------------------------------------------------|
| `postgres_data`        | Données PostgreSQL persistantes                    |
| `backend_node_modules` | node_modules du backend (isolé du host)            |
| `frontend_node_modules`| node_modules du frontend (isolé du host)           |

Les `node_modules` utilisent des **volumes nommés** pour :
- Persister entre les redémarrages (pas de `npm ci` à chaque `up`)
- Isoler les binaires natifs compilés pour le conteneur (Linux) de ceux du host

---

## Variables d'environnement

Toutes les variables sont définies dans `.env` (copié depuis `.env.example`).

| Variable              | Défaut            | Description                     |
|-----------------------|-------------------|---------------------------------|
| `POSTGRES_USER`       | `betarena`        | Utilisateur PostgreSQL          |
| `POSTGRES_PASSWORD`   | `betarena_secret` | Mot de passe PostgreSQL         |
| `POSTGRES_DB`         | `betarena`        | Nom de la base de données       |
| `POSTGRES_PORT`       | `5432`            | Port PostgreSQL exposé          |
| `API_PORT`            | `3000`            | Port de l'API backend           |
| `FRONTEND_PORT`       | `8080`            | Port du frontend (dev)          |
| `GRAFANA_ADMIN_USER`  | `admin`           | Utilisateur admin Grafana       |
| `GRAFANA_ADMIN_PASSWORD` | `admin`        | Mot de passe admin Grafana      |
| `GRAFANA_PORT`        | `3001`            | Port Grafana                    |
| `PROMETHEUS_PORT`     | `9090`            | Port Prometheus                 |

---

## Troubleshooting

### Un service ne démarre pas

```bash
# Vérifier les logs du service
docker compose -f docker-compose.dev.yml logs backend

# Vérifier l'état des conteneurs
docker compose -f docker-compose.dev.yml ps
```

### Le port est déjà utilisé

Modifier le port dans `.env` :

```env
API_PORT=3001
```

### Les node_modules sont corrompus

```bash
# Supprimer le volume et reconstruire
docker compose -f docker-compose.dev.yml down -v
docker compose -f docker-compose.dev.yml up -d --build
```

### Reset complet

```bash
# Supprimer conteneurs, volumes, et images custom
docker compose -f docker-compose.dev.yml down -v --rmi local
```
