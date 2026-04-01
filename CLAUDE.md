# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

An MCP (Model Context Protocol) server that exposes 22 tools for querying the AgentScan API — the explorer for ERC-8004 on-chain AI agents across 21+ blockchain networks. Published as `@aliasai2026/agentscan-mcp-server` on npm.

## Commands

- **Build:** `npm run build` (runs `tsc`)
- **Dev (watch mode):** `npm run dev`
- **Run locally:** `npm start` (starts stdio transport)
- **Test:** `npm test` (vitest, 44 tests across 9 files)
- **Test (watch mode):** `npm run test:watch`
- **Test single file:** `npx vitest run src/__tests__/api-client/client.test.ts`
- **Test with MCP Inspector:** `npx @modelcontextprotocol/inspector node dist/index.js`

## Architecture

The server is a TypeScript ESM project using `@modelcontextprotocol/sdk` and `zod` for tool schema validation.

### Key layers

1. **Entry point** (`src/index.ts`) — Creates `McpServer`, registers all tool groups, connects via `StdioServerTransport`.

2. **API client** (`src/api-client/`) — Thin HTTP wrapper around the AgentScan REST API (`https://agentscan.info/api/...`).
   - `client.ts`: Single `apiGet<T>()` function with timeout via `AbortController`. All API paths are prefixed with `/api`.
   - `types.ts`: TypeScript interfaces for every API response shape.

3. **Tool modules** (`src/tools/`) — Each file exports a `register*Tools(server)` function that calls `server.tool()` to register MCP tools with zod schemas. Six modules:
   - `search.ts` — `search_agents`, `find_similar_agents`, `get_trending_agents`, `get_leaderboard`
   - `agent-details.ts` — `get_agent`, `get_agent_reputation`, `get_agent_feedbacks`, `get_agent_activities`, `get_agent_endpoint_health`, `get_agent_transactions`
   - `portfolio.ts` — `get_owner_portfolio`
   - `analytics.ts` — `get_stats`, `get_registration_trend`, `get_analytics_overview`, `get_network_distribution`, `get_skill_ranking`, `get_recent_activities`
   - `networks.ts` — `list_networks`, `get_endpoint_health_stats`
   - `taxonomy.ts` — `get_taxonomy_distribution`, `list_taxonomy_skills`, `list_taxonomy_domains`

4. **Config** (`src/config.ts`) — Reads `AGENTSCAN_API_URL` and `AGENTSCAN_DEFAULT_CHAIN` from env vars.

### Adding a new tool

1. Add response types to `src/api-client/types.ts`.
2. Add `server.tool()` call in the appropriate `src/tools/*.ts` file (or create a new module and register it in `src/index.ts`).
3. Each tool handler calls `apiGet<T>(path, params)` and returns `{ content: [{ type: "text", text: JSON.stringify(data, null, 2) }] }`.

## Publishing

Automated via GitHub Actions (`.github/workflows/publish.yml`): creating a GitHub release triggers `npm publish --provenance --access public`. Requires `NPM_TOKEN` secret.
