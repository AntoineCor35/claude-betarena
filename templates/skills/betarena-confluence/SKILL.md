---
name: betarena-confluence
description: BetArena Atlassian (Jira + Confluence) integration helpers — load when working on a Jira ticket, looking for a feature spec, an ADR (Architecture Decision Record), the métier glossary, or any team documentation that lives on Confluence. Use proactively when the user references a ticket ID like BA-XXX, asks about "the spec", "what does <business term> mean", "the glossary", or when /bet-new-feature / /bet-discuss-phase / /bet-plan-phase need richer context than the codebase offers.
---

# BetArena Confluence — Skill Reference

This skill is loaded when you need to consult Atlassian (Jira tickets, Confluence pages) on the BetArena project. The Atlassian MCP server (`mcp-atlassian`) must be configured in `.mcp.json` — set up via `/bet-onboarding` Phase 3.1.

**If the MCP is not available** (no `mcp__atlassian__*` tools exposed): tell the user they need to run `/bet-onboarding` and configure Atlassian, then move on without it. Don't fail the parent command — best-effort.

---

## Tenant

- **Domain** : `betarena.atlassian.net`
- **Confluence root** : `https://betarena.atlassian.net/wiki`
- **Jira project key** : `BA` (tickets are `BA-XXX`)

The exact space keys, page hierarchy, and ADR location are *not* hard-coded here — discover them on first use, then cache findings in `.planning/codebase/CONFLUENCE.md` (created on demand) so future runs are faster.

---

## Common operations

### 1. Fetch a Jira ticket

When the user references `BA-XXX`, fetch:
- Title
- Description
- Status
- Acceptance criteria (often in the description body)
- Linked Confluence pages (smart links / linked issues panel)
- Comments (last 5, for context)

Use the `mcp__atlassian__jira_get_issue` tool (or equivalent — adapt to the actual tool name exposed by your MCP server install). If unavailable, ask the user to paste the ticket content.

### 2. Find the spec for a feature

Order of search:
1. Jira ticket → linked Confluence pages → if exactly one, that's the spec
2. Confluence search by title containing the feature name or ticket ID
3. Ask the user for the page URL if discovery fails

Read the spec **once**, summarize it in 5-10 bullets, and store the summary in `.planning/<feature>/SPEC-RECAP.md` so further phases don't re-fetch.

### 3. Resolve a métier term

When the user (or a previous phase summary) references a domain term you're unsure about — `bet`, `stake`, `odds`, `parlay`, `combiné`, `salary`, `streak`, `achievement`, etc. — search Confluence for "Glossaire" / "Glossary" first. If found, cache the relevant entries in `.planning/codebase/GLOSSARY.md` for the rest of the session.

### 4. Architecture decision lookups

When `/bet-discuss-phase` or `/bet-plan-phase` raises a "we already decided this" feeling, search for `ADR` or `Decision Record` in Confluence. Cite the page URL in the planning docs so traceability is preserved.

### 5. Creating an ADR (proposal)

When the agent and user reach a notable architectural decision during a phase plan, **propose** to create an ADR:

> "Cette décision (utiliser Redis Sorted Sets pour le leaderboard plutôt que SQL) mérite un ADR. Tu veux que je crée la page Confluence ? (yes / no)"

Only create the page on explicit user approval. Use the `mcp__atlassian__confluence_create_page` tool. Format:

```
Title:    ADR-NNN — <decision title>
Parent:   ADR space root (find on first use, cache the page ID)
Content:
  ## Context
  ## Decision
  ## Alternatives considered
  ## Consequences
  ## Status   (Proposed | Accepted | Deprecated | Superseded)
  ## Date     <today>
  ## Related
  - Jira: BA-XXX
  - Phase: <feature>/phase-NN
```

Link the ADR back to the Jira ticket as a "linked issue".

---

## Caching strategy

Atlassian calls are slow and rate-limited. Cache aggressively :

| Lookup | Cache file | Refresh policy |
|--------|-----------|----------------|
| Jira ticket details | `.planning/<feature>/JIRA.md` | Re-fetch when user explicitly asks "is the ticket up to date?" or `/bet-progress` is called after >24h |
| Feature spec | `.planning/<feature>/SPEC-RECAP.md` | Same as above |
| Métier glossary | `.planning/codebase/GLOSSARY.md` | Re-fetch on `/bet-refresh` |
| Confluence space map (root pages, ADR location, glossary location) | `.planning/codebase/CONFLUENCE.md` | Re-fetch on `/bet-refresh` |
| ADR list | `.planning/codebase/ADR-INDEX.md` | Re-fetch on `/bet-refresh` |

Always note the fetch date in the cache file frontmatter or first line.

---

## Don'ts

- **Don't auto-create pages** without explicit approval. Confluence pollution is hard to clean up.
- **Don't write secrets** (API tokens, credentials) into any cached file. The `.mcp.json` already holds them in clear; that's enough exposure.
- **Don't paste full Confluence pages** verbatim in the conversation — summarize. Pages can be huge.
- **Don't assume page hierarchy** — discover it once per project, cache, reuse.

---

## When in doubt, ask the user

Atlassian setups vary wildly between teams. If a search returns 0 or >5 candidates, **ask the user**:
> "J'ai trouvé N pages potentiellement liées à <X>. Laquelle est la bonne ?
>   1. <title> — <space> — <last edit date>
>   2. ...
>   (ou : 'aucune' si je dois chercher autrement)"

Better to ask once and cache the answer than to guess and pollute the workflow with bad context.
