# Contributing

Thank you for contributing to BetArena 🎉

Please follow these simple rules to keep the project clean and organized.

---

## Table of Contents

1. [Branch Protection](#1-branch-protection)
2. [GitFlow Workflow](#2-gitflow-workflow)
3. [Commit Messages](#3-commit-messages)
4. [Pull Requests](#4-pull-requests)
5. [React Native Conventions](#5-react-native-conventions)
6. [Code Organization](#6-code-organization)

---

## 1. Branch Protection

Do **NOT** commit directly to `main` or `develop`.

All changes must go through branches and Pull Requests (PRs).

---

## 2. GitFlow Workflow

We follow the Git workflow named [GitFlow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow), please use the same workflow.

| Branch Type | Purpose                 | Merge Target |
|-------------|-------------------------|--------------|
| `feature/*` | New features            | `develop`    |
| `hotfix/*`  | Urgent production fixes | `main`       |

---

## 3. Commit Messages

We use conventional commit messages: `<type>(<scope>): <description>`

* **type** can be: [Conventional Commit Messages - Types](https://gist.github.com/qoomon/5dfcdf8eec66a051ecd85625518cfd13#types)
* **scope** can be: `global`, `front`, `back`, `mobile`, `data`, `db`

### Examples

- `feat(front): add user login page`
- `fix(back): resolve null pointer on bet creation`
- `chore(db): add migration for odds table`
- `refactor(mobile): extract bet card component`
- `docs(global): update README setup instructions`
- `test(back): add unit tests for auth service`

---

## 4. Pull Requests

Pull Requests (PRs) are mandatory for any integration into the main branches of the project:
- `feature/*` → `develop`
- `develop` → `main`
- `hotfix/*` → `main`

PRs ensure that:
- the project history stays clean and traceable,
- automated tests and CI/CD pipelines run correctly.

Additionally, PR titles should follow this schema: `[<SCOPE>] <Description>`
* **scope** can be: `GLOBAL`, `FRONT`, `BACK`, `MOBILE`, `DATA`, `DB`

The author must:
* Fill the description
* Assign the PR to themselves
* Add the corresponding labels to facilitate tracking and review.

### Reviewers

Reviewers are **optional**, only add one if you specifically want someone to look at your changes.

However, PRs targeting `main` **must** include at minimum:
- Antoine Cormier
- Maxence Guidez

### Examples

- `[FRONT] Add user login page`
- `[BACK] Fix null pointer on bet creation`
- `[DB] Add migration for odds table`
- `[MOBILE] Refactor bet card component`
- `[GLOBAL] Update CI/CD pipeline configuration`

### Exceptions

Update merges don’t require a Pull Request.
If you’re only updating your local branch with the latest changes from another branch (for example, keeping your feature branch up to date with develop), you can merge or rebase directly without opening a PR.

Examples:
- `develop` → `my-feature-branch` ✅ (no PR needed)
- `main` → `hotfix/bug-123` ✅ (no PR needed)

These merges don’t affect the main branches directly, so no formal review process is required.

---

## 5. React Native Conventions

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
- Use the project’s theme/design tokens for colors, spacing, and fonts
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

## 6. Code Organization

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
- **Colocate feature code.** If a component is only used by one screen, keep it in that feature’s folder.
- **Shared components** go in `src/components/shared/` only when used by 2+ features.
- **No business logic in components.** Extract to hooks or services.
