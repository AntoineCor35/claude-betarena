---
description: Docker management commands (placeholder — not yet implemented)
disable-model-invocation: true
---

Docker management commands for running, testing, and debugging with containers.

**⚠ This command is a placeholder.** Docker integration will be configured once `docker-compose.yml` and container definitions are available in the project.

## Planned capabilities

When Docker is set up, this command will support:

- **`/bet-docker up`** — Start all containers
- **`/bet-docker down`** — Stop all containers
- **`/bet-docker logs <service>`** — Stream logs from a specific service
- **`/bet-docker test`** — Run tests inside containers (for integration/E2E tests)
- **`/bet-docker rebuild <service>`** — Rebuild a specific service
- **`/bet-docker status`** — Show container status and health checks

## Integration with the workflow

Once available, Docker will be used by:
- `/bet-execute` — to run the app and verify changes in real-time
- `/bet-test` — to run tests in containers with real dependencies (DB, cache, etc.)
- `/bet-refresh` — to detect docker-compose changes

## Current status

```
Docker integration: NOT CONFIGURED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Waiting for docker-compose.yml to be added to the project.
When ready, run /bet-onboarding to re-audit and detect Docker setup.
```
