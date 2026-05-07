---
description: Docker stack management — thin wrapper around the project's Task commands
argument-hint: "<action> [-- <service>]"
allowed-tools: Bash(task *)
disable-model-invocation: true
---

Docker stack management — thin wrapper around the project's Task commands.

Usage: `/bet-docker <action> [-- <service>]`

This command never invokes `docker compose` directly. Everything goes through Task (per `docs/taskfile.md` and the project's CLAUDE.md "Task runner — obligatoire" section).

## Setup

1. Read `.planning/codebase/STACK.md` if present — confirm `Taskfile.yml` exists.
2. If Task or Docker is not installed/running, **stop** and tell the user — point them to `docs/getting-started.md`.

## Actions

Parse `$ARGUMENTS`. Recognized verbs (mirror `docs/taskfile.md`):

| Verb | Maps to |
|------|---------|
| `up` | `task dev:up` — start backend + frontend + postgres |
| `up --build` | `task dev:build` — start with image rebuild (after `package.json`/`Dockerfile` changes) |
| `mobile` | `task dev:mobile` — start backend + postgres only (lighter for mobile dev) |
| `data` | `task dev:data` — start the data processing service (optional profile) |
| `down` | `task dev:down` — stop everything |
| `ps` | `task dev:ps` — show container state |
| `logs <service>` | `task dev:logs -- <service>` — follow logs (services: backend, frontend, postgres, data) |
| `restart <service>` | `task dev:restart -- <service>` |
| `reset` | `task dev:reset` — stop + drop volumes (⚠ destructive: data + node_modules wiped) |
| `nuke` | `task dev:nuke` — full reset: containers + volumes + custom images (⚠ very destructive) |
| `prod:up` / `prod:down` / `prod:ps` / `prod:logs <service>` | corresponding `task prod:*` commands |

## Safety prompts

Before running **destructive** actions, **ask the user to confirm**:

- `reset` :
  > "⚠ `task dev:reset` will drop **all Docker volumes** (PostgreSQL data + node_modules). Confirm? (yes / no)"
- `nuke` :
  > "⚠ `task dev:nuke` will drop volumes **and** custom images — full rebuild required after. Confirm? (yes / no)"
- `prod:up` / `prod:down` :
  > "You're about to operate the **production** stack on this machine. Confirm? (yes / no)"

Wait for explicit `yes` before proceeding. The Task commands themselves also prompt, but surfacing the prompt at the agent level prevents accidental approvals.

## Output handling

- Run the Task command and stream output verbatim.
- After `up` / `up --build` / `mobile`, wait ~10s then run `task dev:ps` and show container health.
- After `logs`, follow until the user interrupts.

## Common flows

**First start of the day:**
```
/bet-docker up         → task dev:up
```

**After modifying package.json / Dockerfile:**
```
/bet-docker up --build → task dev:build
```

**Debugging a failing service:**
```
/bet-docker ps            → task dev:ps
/bet-docker logs backend  → task dev:logs -- backend
/bet-docker restart backend
```

**Hard reset after broken state:**
```
/bet-docker reset       → task dev:reset (confirms first)
/bet-docker up --build
```

## Rules

- **Never bypass Task.** No raw `docker compose ...`.
- **Never run a destructive action without explicit user confirmation.**
- If a verb is unknown, list the supported verbs and stop.
- Mobile is **not Dockerized** — if user asks for "mobile docker", redirect them to `task mobile:start` and `docs/getting-started.md` §3.
