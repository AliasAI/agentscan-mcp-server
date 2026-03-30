import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { apiGet } from "../api-client/client.js";
import type {
  NetworkInfo,
  EndpointHealthStats,
} from "../api-client/types.js";

export function registerNetworkTools(server: McpServer): void {
  server.tool(
    "list_networks",
    "List all supported blockchain networks and their configurations — " +
      "chain IDs, explorer URLs, and ERC-8004 contract addresses.",
    {},
    async () => {
      const data = await apiGet<NetworkInfo[]>("/networks");
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "get_endpoint_health_stats",
    "Get platform-wide endpoint health overview — total scanned agents, " +
      "agents with working endpoints, health rate, and top agents by reputation.",
    {
      network: z.string().optional().describe("Filter by network slug"),
    },
    async ({ network }) => {
      const data = await apiGet<EndpointHealthStats>(
        "/endpoint-health/quick-stats",
        network ? { network } : undefined,
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );
}
