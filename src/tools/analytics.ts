import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { apiGet } from "../api-client/client.js";
import type {
  StatsResponse,
  RegistrationTrendResponse,
  AnalyticsResponse,
  NetworkDistribution,
  SkillRanking,
  PaginatedResponse,
  ActivityItem,
} from "../api-client/types.js";

export function registerAnalyticsTools(server: McpServer): void {
  server.tool(
    "get_stats",
    "Get platform-wide statistics — total agents, active agents, number of networks, " +
      "total activities, and multi-network blockchain sync status.",
    {},
    async () => {
      const data = await apiGet<StatsResponse>("/stats");
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "get_registration_trend",
    "Get daily agent registration counts over a time period. " +
      "Shows how many new agents were registered each day.",
    {
      days: z.number().int().min(1).max(365).default(30).describe("Number of days to look back"),
    },
    async ({ days }) => {
      const data = await apiGet<RegistrationTrendResponse>(
        "/stats/registration-trend",
        { days },
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "get_analytics_overview",
    "Get comprehensive analytics — transaction stats, daily trends by tx type " +
      "(registered, reputation_update, validation_complete), per-network breakdown, " +
      "gas/fee totals, quality rates, and recent activities.",
    {
      days: z.number().int().min(1).max(365).default(30).describe("Lookback period in days"),
      network: z.string().optional().describe("Filter by network slug"),
    },
    async (params) => {
      const data = await apiGet<AnalyticsResponse>("/analytics/overview", params);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "get_network_distribution",
    "Get agent distribution across all blockchain networks — total agents, " +
      "quality agents, and agents with reputation per network. " +
      "Shows which networks have the most and best agents.",
    {},
    async () => {
      const data = await apiGet<NetworkDistribution>("/stats/network-distribution");
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "get_skill_ranking",
    "Get most popular OASF skills by agent count — which capabilities are most common " +
      "across all classified agents.",
    {
      limit: z.number().int().min(1).max(136).default(30).describe("Number of top skills to return"),
    },
    async ({ limit }) => {
      const data = await apiGet<SkillRanking>("/stats/skill-ranking", { limit });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "get_recent_activities",
    "Get recent platform-wide activities — new agent registrations, reputation updates, " +
      "and validation events across all networks.",
    {
      page: z.number().int().min(1).default(1),
      page_size: z.number().int().min(1).max(100).default(20),
    },
    async (params) => {
      const data = await apiGet<PaginatedResponse<ActivityItem>>("/activities", params);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );
}
