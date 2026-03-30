# AgentScan MCP Server

MCP Server for [AgentScan](https://agentscan.info) — search, explore, and evaluate **ERC-8004** on-chain AI agents across 21+ blockchain networks.

Use it in Claude Code, Claude Desktop, Cursor, VS Code, or any MCP-compatible client to query agent metadata, reputation scores, endpoint health, leaderboards, owner portfolios, and ecosystem analytics.

## Quick Start

### Claude Code

```bash
claude mcp add agentscan -- npx @aliaslabs/agentscan-mcp-server
```

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "agentscan": {
      "command": "npx",
      "args": ["@aliaslabs/agentscan-mcp-server"]
    }
  }
}
```

### Cursor / VS Code

Add to your MCP settings:

```json
{
  "mcpServers": {
    "agentscan": {
      "command": "npx",
      "args": ["@aliaslabs/agentscan-mcp-server"]
    }
  }
}
```

## Environment Variables (optional)

| Variable | Default | Description |
|----------|---------|-------------|
| `AGENTSCAN_API_URL` | `https://agentscan.info` | AgentScan API base URL |
| `AGENTSCAN_DEFAULT_CHAIN` | — | Default network filter |

## Available Tools (22)

### Search & Discovery

| Tool | Description |
|------|-------------|
| `search_agents` | Search agents with rich filters (text, network, skill, domain, owner, quality, reputation, endpoints, date range) |
| `find_similar_agents` | Find agents similar to a given agent by shared skills/domains |
| `get_trending_agents` | Get trending, top-ranked, and featured agents |
| `get_leaderboard` | Composite-scored agent ranking (service, usage, freshness, profile) |

### Agent Details

| Tool | Description |
|------|-------------|
| `get_agent` | Full agent metadata, OASF classification, owner, endpoints, on-chain data |
| `get_agent_reputation` | Reputation summary — feedback count, average score, validation count |
| `get_agent_feedbacks` | Individual feedback items with scores, tags, and tx hashes |
| `get_agent_activities` | On-chain event history (registrations, reputation updates, validations) |
| `get_agent_endpoint_health` | Live endpoint health check with response times |
| `get_agent_transactions` | Transaction breakdown with gas and fee details |

### Owner Portfolio

| Tool | Description |
|------|-------------|
| `get_owner_portfolio` | All agents by wallet address with cross-network summary |

### Platform Analytics

| Tool | Description |
|------|-------------|
| `get_stats` | Platform-wide statistics (total agents, networks, sync status) |
| `get_registration_trend` | Daily agent registration counts over time |
| `get_analytics_overview` | Comprehensive analytics with tx stats, trends, and network breakdown |
| `get_network_distribution` | Agent distribution across networks with quality breakdown |
| `get_skill_ranking` | Most popular OASF skills by agent count |
| `get_recent_activities` | Platform-wide activity feed |

### Networks, Health & Taxonomy

| Tool | Description |
|------|-------------|
| `list_networks` | All supported blockchain networks with configurations |
| `get_endpoint_health_stats` | Platform-wide endpoint health overview |
| `get_taxonomy_distribution` | OASF skill/domain distribution across agents |
| `list_taxonomy_skills` | All 136 OASF skill categories (use slugs for search filters) |
| `list_taxonomy_domains` | All OASF domain categories (use slugs for search filters) |

## Example Prompts

Once configured, ask your AI assistant:

- "Search for AI agents on Base network with DeFi skills"
- "Show me the top-ranked agents by reputation"
- "What agents does wallet 0x1234... own?"
- "Check if agent X has working endpoints"
- "How many agents were registered this month?"
- "What are the most popular agent skills?"

## What is ERC-8004?

[ERC-8004](https://eips.ethereum.org/EIPS/eip-8004) is the on-chain identity and reputation standard for AI agents. It provides:

- **Identity Registry** — ERC-721 NFT handles that resolve to AgentCard metadata
- **Reputation Registry** — Structured feedback signals (0–100 scores) with x402 payment proof
- **Validation Registry** — Independent validator hooks (staking, zkML, TEE attestation)

AgentScan indexes 22,000+ registered agents across 21 blockchain networks.

## Development

```bash
git clone https://github.com/AliasAI/agentscan-mcp-server.git
cd agentscan-mcp-server
npm install
npm run build
```

Test with MCP Inspector:

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

## License

MIT
