import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { apiGet } from "../api-client/client.js";
import type {
  AgentListItem,
  PaginatedResponse,
  TrendingResponse,
  LeaderboardItem,
} from "../api-client/types.js";

export function registerSearchTools(server: McpServer): void {
  server.tool(
    "search_agents",
    "Search ERC-8004 AI agents with rich combinable filters across 21+ blockchain networks. " +
      "Supports text search (name, description, address), network, OASF skill/domain, owner wallet, " +
      "quality tier, reputation, endpoint status, date range, and sorting.",
    {
      query: z.string().optional().describe("Text search across name, description, and wallet address"),
      network: z.string().optional().describe("Network slug (ethereum, base, arbitrum, bsc, polygon, monad, celo, etc.)"),
      skill: z.string().optional().describe("OASF skill filter (partial match, e.g. 'defi', 'coding', 'agent_orchestration')"),
      domain: z.string().optional().describe("OASF domain filter (partial match, e.g. 'finance', 'healthcare', 'scientific')"),
      owner: z.string().optional().describe("Owner wallet address (exact match, 0x...)"),
      quality: z.enum(["all", "basic", "verified"]).optional().describe("'all', 'basic' (has name+description), or 'verified' (has reputation)"),
      has_reputation: z.boolean().optional().describe("True to show only agents with feedback/reputation"),
      has_endpoints: z.boolean().optional().describe("True to show only agents with working endpoints"),
      reputation_min: z.number().optional().describe("Minimum reputation score"),
      created_after: z.string().optional().describe("ISO date string, e.g. '2026-03-01'"),
      created_before: z.string().optional().describe("ISO date string, e.g. '2026-03-31'"),
      sort_field: z.enum(["created_at", "name", "reputation_score", "reputation_count"]).default("created_at"),
      sort_order: z.enum(["asc", "desc"]).default("desc"),
      page: z.number().int().min(1).default(1),
      page_size: z.number().int().min(1).max(100).default(20),
    },
    async (params) => {
      const data = await apiGet<PaginatedResponse<AgentListItem>>("/agents", params);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "find_similar_agents",
    "Find agents similar to a given agent based on shared skills, domains, and network. " +
      "Useful for discovering alternatives or related agents.",
    {
      agent_id: z.string().describe("The agent's UUID"),
      limit: z.number().int().min(1).max(50).default(10),
    },
    async ({ agent_id, limit }) => {
      const data = await apiGet<AgentListItem[]>(`/agents/similar/${agent_id}`, { limit });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "get_trending_agents",
    "Get trending, top-ranked (by reputation), and featured (most reviews) agents. " +
      "Great for discovering popular and high-quality agents.",
    {
      limit: z.number().int().min(1).max(20).default(5).describe("Max agents per category"),
    },
    async ({ limit }) => {
      const data = await apiGet<TrendingResponse>("/agents/trending", { limit });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "get_leaderboard",
    "Get ranked agent leaderboard with composite scores. " +
      "Agents are scored on: service (working endpoints), usage (feedback count), " +
      "freshness (recent reputation updates), and profile (name, description, skills).",
    {
      network: z.string().optional().describe("Filter by network slug"),
      sort_by: z.enum(["score", "service", "usage", "freshness", "profile"]).default("score"),
      page: z.number().int().min(1).default(1),
      page_size: z.number().int().min(1).max(100).default(20),
    },
    async (params) => {
      const data = await apiGet<PaginatedResponse<LeaderboardItem>>("/leaderboard", params);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );
}
