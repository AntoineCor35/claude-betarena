# Bet Arena — Plan Qualité, Méthodologie & Outils

> **Date** : Février 2026
> **Projet** : Bet Arena — Simulateur de paris e-sportifs gamifié
> **Version** : 1.0

---

## 1. Objectif du Plan Qualité

Ce document décrit la méthodologie, les outils de gestion et les efforts systématiques mis en place pour garantir que le produit Bet Arena livré répond aux exigences définies dans le PRD, respecte les standards de qualité de l'équipe, et satisfait les critères d'évaluation Epitech.

Le plan qualité couvre :
- La méthodologie de travail et les outils de gestion
- Les règles communes de l'équipe
- Les processus de développement collaboratif
- Les mécanismes de test et de validation
- La montée en compétences (ramp-up)
- La Definition of Done

---

## 2. Méthodologie : Agile Scrum

### 2.1 Choix de la méthodologie

Nous avons choisi la **méthodologie Agile**, et plus précisément le framework **Scrum**, pour les raisons suivantes :

| Critère | Justification |
|---------|---------------|
| **Nature du projet** | Produit logiciel itératif avec des fonctionnalités évolutives — le backlog sera amené à évoluer au fil des retours |
| **Équipe étudiante** | Besoin de cycles courts pour maintenir la dynamique et la visibilité sur l'avancement |
| **Feedback régulier** | Les reviews avec l'intervenant Epitech permettent de valider la direction à chaque itération |
| **Adaptabilité** | Les incertitudes techniques (accès aux API e-sport notamment) imposent une approche flexible |

### 2.2 Cadence des sprints

Tant que le projet est en **phase de planification** (l'école nous demande de ne pas coder avant l'année prochaine), la durée d'un sprint correspond à **l'intervalle entre chaque review avec l'intervenant Epitech**. Cette cadence sera réévaluée lors du passage en phase de développement, où des sprints de durée fixe (1 à 2 semaines) seront probablement adoptés.

---

## 3. Outils de Gestion : Jira (Suite Atlassian)

Notre outil principal de gestion de projet est **Jira** (Atlassian). Tous les membres du groupe y ont accès pour gérer les tâches, suivre les livrables et assurer la traçabilité du travail.

### 3.1 Configuration de l'espace

L'espace Jira est configuré en mode **Scrum** (modèle proposé par Jira) et **géré par l'entreprise** afin d'avoir accès aux **composants**.

![Configuration espace Scrum](images/jira-espace-scrum.png)

![Configuration espace Team](images/jira-espace-team.png)

![Composants Jira](images/jira-composants.png)

### 3.2 Composants

Les composants permettent de catégoriser les tickets par domaine technique :

| Composant      | Périmètre                                                 |
|----------------|-----------------------------------------------------------|
| **Management** | Gestion de projet, documentation, livrables Epitech       |
| **Frontend**   | Interface utilisateur, pixel art, responsive mobile-first |
| **Backend**    | API, logique métier, système de paris                     |
| **Data**       | Intégration API e-sport, traitement des données de matchs |
| **DevOps**     | CI/CD, déploiement, infrastructure                        |
| **Web3**       | Éventuelle intégration blockchain / tokens                |

> D'autres composants pourront être ajoutés selon les besoins du projet.

### 3.3 Vues utilisées

| Vue                        | Usage                                                                                 |
|----------------------------|---------------------------------------------------------------------------------------|
| **Backlog**                | Visualiser le backlog complet et organiser les sprints                                |
| **Sprints actifs**         | Tableau Kanban du sprint en cours (activé lors du Sprint Planning via la vue Backlog) |
| **Chronologie**            | Vue Gantt basée sur les champs *Start date* et *Date d'échéance*                      |
| **Liste**                  | Vision globale de l'ensemble des tickets                                              |
| **Rapports** *(plus tard)* | Graphiques et statistiques d'avancement (velocity, burndown, etc.)                    |

![Vues de l'espace](images/jira-vues.png)

### 3.4 Types de tickets & hiérarchie

La hiérarchie des tickets, que nous avons décidé de suivre, est la suivante :

![Hiérarchie des tickets](images/jira-hierarchie-tickets.png)

Tous les types de tickets utilisent exactement la **même disposition** :

![Disposition des tickets](images/jira-disposition-tickets.png)

### 3.5 Priorités

Nous utilisons les **5 niveaux de priorité par défaut** de Jira :

![Priorités de l'espace](images/jira-priorities.png)

---

## 4. Règles Communes de l'Équipe

### 4.1 Conventions de Code

| Règle | Détail |
|-------|--------|
| **Langage** | TypeScript strict sur tout le monorepo (mobile + backend + shared) |
| **Linting** | ESLint avec configuration partagée (`@betarena/eslint-config`) |
| **Formatting** | Prettier avec configuration partagée — formatage automatique au save |
| **Nommage** | camelCase pour variables/fonctions, PascalCase pour composants/types, UPPER_SNAKE_CASE pour constantes |
| **Commentaires** | Uniquement pour la logique non évidente (pas de commentaires triviaux). JSDoc pour les fonctions publiques des services |
| **Imports** | Chemins absolus via aliases TypeScript (`@shared/`, `@services/`, etc.) |
| **Fichiers** | Un composant/service par fichier, nommé comme l'export principal |

### 4.2 Structure des Commits

Format des messages de commit : **Conventional Commits**

```
<type>(<scope>): <description>

[optional body]
[optional footer]
```

| Type | Usage |
|------|-------|
| `feat` | Nouvelle fonctionnalité |
| `fix` | Correction de bug |
| `docs` | Documentation |
| `style` | Formatage (pas de changement de logique) |
| `refactor` | Refactoring (pas de changement fonctionnel) |
| `test` | Ajout/modification de tests |
| `chore` | Maintenance, CI/CD, dépendances |

**Scope** : `mobile`, `backend`, `shared`, `landing`, `ci`, `docs`

Exemple : `feat(backend): add bet resolution service`

### 4.3 Langue

- **Code** : Anglais (variables, fonctions, commentaires, commits)
- **Documentation projet** : Français (livrables Epitech)
- **PRD et documents techniques** : Français avec termes techniques en anglais quand approprié

---

## 5. Processus de Développement

### 5.1 Workflow Git (Git Flow simplifié)

```
main ─────────────────────────────────────────── Production stable
  │
  └── develop ────────────────────────────────── Branche d'intégration
        │
        ├── feature/BA-123-add-bet-placement ──── Feature branches
        ├── feature/BA-456-leaderboard-api
        └── fix/BA-789-wallet-balance-error ──── Fix branches
```

| Branche | Usage | Protection |
|---------|-------|------------|
| `main` | Code en production, toujours stable | PR obligatoire, CI verte, review approuvée |
| `develop` | Branche d'intégration des features | PR obligatoire, CI verte |
| `feature/*` | Développement d'une feature (liée à un ticket Jira) | Merge vers develop via PR |
| `fix/*` | Correction d'un bug | Merge vers develop via PR |

### 5.2 Processus de Pull Request

Chaque modification du code passe par une **Pull Request** :

1. **Création** : Le développeur crée une PR depuis sa branche feature/fix vers `develop`
2. **Description** : La PR contient une description du changement, le numéro du ticket Jira, et des screenshots si changement UI
3. **CI automatique** : Le pipeline CI (lint + tests) s'exécute automatiquement
4. **Code Review** : Au minimum **1 approbation** requise d'un autre membre de l'équipe
5. **Merge** : Squash merge vers develop après approbation et CI verte
6. **Cleanup** : La branche feature est supprimée après merge

### 5.3 Critères de Review

Le reviewer vérifie :
- [ ] Le code compile et les tests passent
- [ ] Le code respecte les conventions (lint + formatting)
- [ ] La logique est correcte et couvre les edge cases
- [ ] Les tests unitaires couvrent les cas nominaux et d'erreur
- [ ] Pas de données sensibles en dur (secrets, credentials)
- [ ] Le code est lisible et maintenable (nommage clair, pas de duplication excessive)

---

## 6. Stratégie de Test

### 6.1 Niveaux de Test

| Niveau | Quoi | Outil | Quand | Couverture cible |
|--------|------|-------|-------|-----------------|
| **Tests unitaires** | Logique métier isolée (calcul cotes, résolution paris, wallet, achievements) | Jest | À chaque commit (CI) | 70% sur logique métier |
| **Tests d'intégration** | Endpoints API complets (auth flow, placement de paris, résolution) | Jest + Supertest | À chaque PR (CI) | Tous les endpoints critiques |
| **Tests manuels** | Parcours utilisateur sur simulateurs et devices réels | Manuel | À chaque fin de sprint | Tous les parcours critiques |
| **Tests de régression** | Vérification que les corrections ne cassent pas l'existant | Jest (automatisé) + Manuel | Avant chaque release | Tests existants repassés |

### 6.2 Ce qui est testé en priorité (logique métier critique)

| Domaine | Exemples de tests |
|---------|-------------------|
| **Économie virtuelle** | Débit/crédit atomique, solde insuffisant, débits concurrents, salaire hebdomadaire |
| **Calcul de cotes** | Cas nominal, données insuffisantes, cas limites (cotes min/max) |
| **Résolution de paris** | Pari simple gagné/perdu, combiné partiellement résolu, combiné full win, match annulé |
| **Achievements** | Conditions de déclenchement, unicité, streaks (incrémentation/reset) |
| **Auth** | Inscription, login, refresh token, validation des inputs |

### 6.3 Tests pas prévus au MVP

- **Tests E2E automatisés mobile** (Detox) — évaluation post-MVP
- **Tests de charge/performance** — tests manuels de base, pas de load testing automatisé au MVP
- **Tests de sécurité automatisés** — audit manuel des flux critiques (auth, transactions)

---

## 7. Pipeline CI/CD

### 7.1 Pipeline d'Intégration Continue

Déclenché à chaque **push** et **pull request** sur `develop` et `main` :

```
┌─────────┐    ┌──────────┐    ┌──────────────┐    ┌──────────────┐
│  Lint   │ →  │  Tests   │ →  │ Build        │ →  │ Build        │
│ (ESLint │    │ unitaires│    │ backend      │    │ mobile (Expo)│
│ Prettier)│    │ + intég. │    │              │    │              │
└─────────┘    └──────────┘    └──────────────┘    └──────────────┘
```

- **Échec du lint ou des tests** → Pipeline en échec → PR non mergeable
- **Temps cible** : < 10 minutes pour le pipeline complet
- **Secrets** : Gérés via GitHub Secrets (clés API, credentials)

### 7.2 Pipeline de Déploiement

| Environnement | Déclencheur | Validation |
|---------------|-------------|------------|
| **Staging** | Merge sur `develop` | Automatique |
| **Production** | Merge sur `main` | Manuelle (approbation PM) |
| **Stores** | Release tag | Build EAS + soumission manuelle |

---

## 8. Montée en Compétences (Ramp-up)

### 8.1 Onboarding Nouveau Membre

| Étape | Contenu | Durée |
|-------|---------|-------|
| 1 | Lire le brief (`docs/brief.md`) et le PRD (`docs/prd.md`) | 1h |
| 2 | Lire les choix technologiques (`docs/choice-techno.md`) | 30 min |
| 3 | Cloner le monorepo, installer les dépendances, lancer le projet en local | 30 min |
| 4 | Comprendre la structure du code (README, architecture modules) | 30 min |
| 5 | Réaliser une première PR de familiarisation (fix mineur ou ajout de test) | 1-2h |
| 6 | Pair programming avec le lead du domaine assigné | 1 session |

### 8.2 Montées en Compétences Identifiées

| Compétence | Qui | Comment | Quand |
|------------|-----|---------|-------|
| **APIs PandaScore / Liquipedia** | Yannis, Antoine | Documentation officielle + POC d'intégration | Phase 1 (Discovery) |
| **Expo managed workflow** | Sarah, Sally, Maxence | Tutoriel Expo + setup d'un projet de test | Phase 1 |
| **Prisma ORM** | Benjamin, Stéphane | Documentation + migration de test | Phase 1 |
| **Redis (Sorted Sets, cache)** | Yannis, Théo | Documentation + POC leaderboard | Phase 1 |
| **Solidity / Smart Contracts** | Sally, Théo, Yannis | Tutoriels Hardhat + POC token ERC-20 | Post-MVP |

---

## 9. Definition of Done (DoD)

Une fonctionnalité est considérée comme **Done** lorsque :

### 9.1 DoD — Story

- [ ] Le code est mergé sur `develop` via une PR approuvée
- [ ] Le pipeline CI passe (lint + tests)
- [ ] Les tests unitaires couvrent les cas nominaux et d'erreur de la story
- [ ] Les tests d'intégration couvrent les endpoints concernés (si backend)
- [ ] Le ticket Jira est mis à jour avec le statut "Done"
- [ ] La fonctionnalité est testable sur un simulateur/device
- [ ] La fonctionnalité respecte les acceptance criteria définis dans le PRD/ticket

### 9.2 DoD — Sprint

- [ ] Toutes les stories engagées dans le sprint sont "Done" ou explicitement reportées
- [ ] Pas de bug critique ouvert non adressé
- [ ] Le code sur `develop` compile et l'app démarre sans erreur
- [ ] Une démo des fonctionnalités livrées est présentée en sprint review
- [ ] Le backlog est mis à jour pour le sprint suivant

### 9.3 DoD — Release (Mise en Production)

- [ ] Le code sur `main` est stable et testé
- [ ] Les tests manuels des parcours critiques sont passés sur iOS et Android
- [ ] Les builds EAS (iOS + Android) sont générés et testés sur devices réels
- [ ] Le PM valide le go/no-go
- [ ] Les notes de version sont documentées

---

## 10. Gestion des Bugs

### 10.1 Classification

| Priorité | Description | Délai de résolution |
|----------|-------------|-------------------|
| **P0 — Bloquant** | L'app crash, données corrompues, perte de crédits | Immédiat (drop everything) |
| **P1 — Critique** | Fonctionnalité majeure cassée (pari impossible, auth KO) | Sprint en cours |
| **P2 — Majeur** | Fonctionnalité dégradée (affichage incorrect, lenteur) | Sprint suivant |
| **P3 — Mineur** | Cosmétique, texte incorrect, amélioration mineure | Backlog |

### 10.2 Processus

1. Bug reporté dans Jira (titre, étapes de reproduction, résultat attendu vs obtenu, screenshot)
2. Priorisé par le PM selon la classification ci-dessus
3. Assigné au développeur du domaine concerné
4. Corrigé, testé, PR créée
5. Validé par le reporter + review code
6. Mergé et ticket fermé

---

## 11. Revue Qualité des Documents

| Critère | Vérification |
|---------|-------------|
| **Clarté** | Le document est compréhensible par un lecteur externe (jury Epitech) |
| **Concision** | Pas d'information redondante ou hors sujet |
| **Cohérence** | Les informations sont alignées avec les autres documents du projet |
| **Complétude** | Les sections requises sont toutes renseignées |
| **Orthographe** | Relecture croisée par un autre membre de l'équipe |
| **Diagrammes** | Les schémas sont lisibles et à jour |

Processus : **relecture croisée** — chaque document est relu par au moins un membre qui ne l'a pas rédigé, avant soumission.

---

*Document généré en février 2026 — Projet Bet Arena, Epitech*
