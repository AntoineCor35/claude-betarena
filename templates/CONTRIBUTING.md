# Contributing

Source de vérité des conventions BetArena (commits, PRs, branches, code). Pour la méthodologie projet complète — Scrum, Definition of Done, CI/CD, stratégie de test — se référer au **Plan Qualité** (`docs/quality-plan.md`).

---

## Sommaire

1. [Branch protection](#1-branch-protection)
2. [Git Flow simplifié](#2-git-flow-simplifié)
3. [Commits — Conventional Commits](#3-commits--conventional-commits)
4. [Pull Requests](#4-pull-requests)
5. [Code](#5-code)
6. [Langue](#6-langue)
7. [React Native Conventions](#7-react-native-conventions)
8. [Code Organization](#8-code-organization)
9. [Exceptions](#9-exceptions)

---

## 1. Branch protection

`main` et `develop` sont protégées. **Aucun commit direct.** Toute modification passe par une branche dédiée et une Pull Request.

---

## 2. Git Flow simplifié

```
main ─────────────────────────────── Production stable
  │
  └── develop ──────────────────── Branche d'intégration
        │
        ├── feature/BET-123-bet-placement   ← Nouvelle feature
        └── fix/BET-456-wallet-balance      ← Correction de bug
```

| Branche | Source | Cible (via PR) | Protection |
|---------|--------|----------------|-----------|
| `main` | — | — | PR depuis `develop`, CI verte, review approuvée |
| `develop` | `main` | `main` | PR obligatoire, CI verte |
| `feature/BET-XXX-<kebab-name>` | `develop` | `develop` | PR obligatoire |
| `fix/BET-XXX-<kebab-name>` | `develop` | `develop` | PR obligatoire |

**Nommage** : `<type>/BA-<ticket>-<kebab-name>`
- `BET-XXX` = ID du ticket Jira (obligatoire si un ticket existe)
- `<kebab-name>` : minuscules, tirets, pas d'espaces, pas d'accents
- Exemples : `feature/BET-123-add-bet-placement`, `fix/BET-789-resolve-wallet-bug`

---

## 3. Commits — Conventional Commits

Format : `<type>(<scope>): <description>`

```
<type>(<scope>): <description>

[optional body]
[optional footer]
```

### Types

| Type | Usage |
|------|-------|
| `feat` | Nouvelle fonctionnalité |
| `fix` | Correction de bug |
| `docs` | Documentation uniquement |
| `style` | Formatage (pas de changement de logique) |
| `refactor` | Refactoring (pas de changement fonctionnel) |
| `test` | Ajout/modification de tests |
| `chore` | Maintenance, CI/CD, dépendances |

### Scopes

| Scope | Périmètre |
|-------|-----------|
| `mobile` | App React Native / Expo |
| `backend` | API, logique métier, services |
| `shared` | Code partagé (types, utils, contrats) |
| `landing` | Site landing |
| `ci` | Pipeline CI/CD, GitHub Actions |
| `docs` | Documentation, livrables Epitech |

### Règles

- Description en **anglais**, présent, impératif, minuscule, sans point final
- Lignes du body < 80 caractères
- Footer optionnel (`BREAKING CHANGE:`, `Refs: BET-XXX`, etc.)

### Exemples

- `feat(backend): add bet resolution service`
- `fix(mobile): resolve wallet balance refresh bug`
- `test(shared): add unit tests for odds calculator`
- `docs(landing): update hero section copy`
- `chore(ci): bump GitHub Actions to v4`
- `refactor(backend): extract auth middleware`

---

## 4. Pull Requests

Toute fusion vers `develop` ou `main` passe par une PR.

### Titre

Format : `[<SCOPE>] BET-XXX <Description>`

- **Scope uppercase** : `MOBILE`, `BACKEND`, `SHARED`, `LANDING`, `CI`, `DOCS`
- **BET-XXX** : ticket Jira (omettre si pas de ticket associé)

Exemples :
- `[BACKEND] BET-123 Add bet placement endpoint`
- `[MOBILE] BET-456 Fix wallet balance refresh`
- `[CI] Update Node version to 20`

### Description

La description **doit** contenir :

```markdown
## What does this PR do?
<1-2 sentences>

## Jira
BET-XXX (or "N/A")

## How to test
1. <step>
2. <step>
3. Expected: <...>

## Screenshots
<if UI changes — otherwise "N/A">

## Tests
- [ ] CI passes (lint + tests)
- [ ] New tests added: <list>
- [ ] Existing tests pass

## Notes
<trade-offs, known limits, follow-ups — or "None">
```

### Auteur

L'auteur **doit** :
- Remplir la description (jamais vide)
- S'assigner la PR
- Ajouter le composant Jira en label

### Reviewers

- **Minimum 1 approbation** de l'équipe pour toute PR
- PRs **vers `main`** doivent inclure : **Antoine Cormier** + **Maxence Guidez**

### Merge

- **Squash merge** uniquement (un commit par PR sur la branche cible)
- **CI verte obligatoire** (lint + tests)
- Branche feature/fix **supprimée** après merge

---

## 5. Code

- **TypeScript strict** sur tout le monorepo (mobile, backend, shared)
- **ESLint + Prettier** : configs partagées (`@betarena/eslint-config`), formatage automatique au save
- **Imports** : alias TypeScript (`@shared/`, `@services/`, etc.) — pas de chemins relatifs profonds
- **Nommage** : `camelCase` (variables/fonctions), `PascalCase` (composants/types), `UPPER_SNAKE_CASE` (constantes)
- **Fichiers** : un composant ou un service par fichier, nommé comme l'export principal
- **Commentaires** : uniquement pour la logique non évidente. JSDoc pour les fonctions publiques de services. Pas de commentaires triviaux.

---

## 6. Langue

| Contexte | Langue |
|----------|--------|
| Code (variables, fonctions, commentaires, commits) | **Anglais** |
| Documentation projet, livrables Epitech, README | **Français** |
| Documents techniques | **Français**, termes techniques en anglais quand approprié |

---

## 7. React Native Conventions

### File Naming

| Type | Convention | Example |
|------|-----------|---------|
| Screens | `PascalCase` + `Screen` suffix | `LoginScreen.tsx`, `BetDetailScreen.tsx` |
| Components | `PascalCase`, one component per file | `BetCard.tsx`, `OddsDisplay.tsx` |
| Hooks | `camelCase` with `use` prefix | `useBetHistory.ts`, `useAuth.ts` |
| Services/API | `camelCase` | `authService.ts`, `betApi.ts` |
| Utils | `camelCase` | `formatOdds.ts`, `dateHelpers.ts` |
| Types/Interfaces | `PascalCase` | `Bet.ts`, `User.ts` |
| Constants | `UPPER_SNAKE_CASE` in file, `camelCase` filename | `colors.ts`, `routes.ts` |

### Navigation

- Route names use `PascalCase`: `Login`, `BetDetail`, `Home`
- Navigator names end with `Navigator`: `MainNavigator`, `AuthNavigator`
- Route params are typed with `ParamList` types: `RootStackParamList`

### State Management

- Local UI state: `useState` / `useReducer`
- Server state: React Query / TanStack Query (preferred for API caching)
- Global app state: Context API or Zustand (keep it minimal)
- Avoid storing derived data in state — compute it

### Styles

- Use `StyleSheet.create()` — always at the bottom of the file
- Group styles logically: `container`, `header`, `content`, `footer`
- Use the project's theme/design tokens for colors, spacing, and fonts
- No inline styles except for truly dynamic values

### Assets

- Images: `snake_case` — `login_background.png`, `bet_icon.png`
- Organize by type: `assets/images/`, `assets/icons/`, `assets/fonts/`
- Use `@2x` / `@3x` suffixes for resolution variants

### Device Permissions

- Declare all required permissions in `app.json` (Expo) or `Info.plist` / `AndroidManifest.xml`
- Request permissions lazily (only when the feature is used, not at launch)
- Always handle the "denied" case with a user-friendly fallback

---

## 8. Code Organization

### Recommended Structure

```
src/
  components/       # Reusable UI components
    shared/         # Cross-feature components (Button, Card, Modal...)
    <feature>/      # Feature-specific components
  screens/          # Screen components (one per route)
  navigation/       # Navigators and route config
  hooks/            # Custom hooks
  services/         # API calls, external services
  stores/           # Global state (Context/Zustand)
  types/            # TypeScript type definitions
  utils/            # Pure utility functions
  constants/        # App-wide constants (colors, routes, config)
  assets/           # Images, icons, fonts
```

### Rules

- **One component per file.** The filename matches the export name.
- **Colocate feature code.** If a component is only used by one screen, keep it in that feature's folder.
- **Shared components** go in `src/components/shared/` only when used by 2+ features.
- **No business logic in components.** Extract to hooks or services.

---

## 9. Exceptions

Les merges de **mise à jour** ne nécessitent **pas** de PR :

| Direction | PR ? |
|-----------|------|
| `develop` → `feature/BET-XXX-...` (sync de branche locale) | ❌ non requise |
| `main` → `develop` (sync) | ❌ non requise |
| `feature/*` → `develop` | ✅ obligatoire |
| `fix/*` → `develop` | ✅ obligatoire |
| `develop` → `main` | ✅ obligatoire |

Ces sync ne modifient pas les branches protégées dans le sens "intégration", donc pas de revue formelle nécessaire.
