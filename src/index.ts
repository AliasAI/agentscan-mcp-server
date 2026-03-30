#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerSearchTools } from "./tools/search.js";
import { registerAgentDetailTools } from "./tools/agent-details.js";
import { registerPortfolioTools } from "./tools/portfolio.js";
import { registerAnalyticsTools } from "./tools/analytics.js";
import { registerNetworkTools } from "./tools/networks.js";
import { registerTaxonomyTools } from "./tools/taxonomy.js";

const server = new McpServer({
  name: "agentscan",
  version: "0.1.0",
  description:
    "Search, explore, and evaluate ERC-8004 on-chain AI agents across 21+ blockchain networks. " +
    "Access agent metadata, reputation scores, endpoint health, leaderboards, " +
    "owner portfolios, and ecosystem analytics from AgentScan (agentscan.info).",
});

registerSearchTools(server);
registerAgentDetailTools(server);
registerPortfolioTools(server);
registerAnalyticsTools(server);
registerNetworkTools(server);
registerTaxonomyTools(server);

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
