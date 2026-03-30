import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { apiGet } from "../api-client/client.js";
import type { OwnerPortfolio } from "../api-client/types.js";

export function registerPortfolioTools(server: McpServer): void {
  server.tool(
    "get_owner_portfolio",
    "Get all ERC-8004 agents owned by a wallet address with cross-network portfolio summary. " +
      "Returns total agents, active networks, aggregated reputation, unique skills/domains.",
    {
      owner_address: z.string().describe("Owner wallet address (0x...)"),
    },
    async ({ owner_address }) => {
      const data = await apiGet<OwnerPortfolio>(`/agents/by-owner/${owner_address}`);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );
}
