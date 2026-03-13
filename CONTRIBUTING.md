# Contributing

Thank you for contributing to BetArena 🎉

Please follow these simple rules to keep the project clean and organized.

---

## Table of Contents

1. [Branch Protection](#1-branch-protection)
2. [GitFlow Workflow](#2-gitflow-workflow)
3. [Commit Messages](#3-commit-messages)
4. [Pull Requests](#4-pull-requests)

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
