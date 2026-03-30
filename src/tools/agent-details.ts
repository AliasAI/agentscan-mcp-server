import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { apiGet } from "../api-client/client.js";
import type {
  AgentDetail,
  ReputationSummary,
  FeedbackListResponse,
  ActivityItem,
  AgentEndpointHealth,
  AgentTransactions,
} from "../api-client/types.js";

export function registerAgentDetailTools(server: McpServer): void {
  server.tool(
    "get_agent",
    "Get full details of an ERC-8004 agent — metadata, OASF classification (skills/domains), " +
      "reputation score, owner address, agent wallet, endpoints, on-chain data, and sync status.",
    {
      agent_id: z.string().describe("The agent's UUID"),
    },
    async ({ agent_id }) => {
      const data = await apiGet<AgentDetail>(`/agents/${agent_id}`);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "get_agent_reputation",
    "Get reputation summary for an agent — feedback count, average score, and validation count. " +
      "Quick way to assess an agent's trustworthiness.",
    {
      agent_id: z.string().describe("The agent's UUID"),
    },
    async ({ agent_id }) => {
      const data = await apiGet<ReputationSummary>(`/agents/${agent_id}/reputation-summary`);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "get_agent_feedbacks",
    "Get individual feedback items for an agent — scores, tags (starred, uptime, successrate, " +
      "responsetime), client addresses, and transaction hashes. Shows the raw reputation data.",
    {
      agent_id: z.string().describe("The agent's UUID"),
      page: z.number().int().min(1).default(1),
      page_size: z.number().int().min(1).max(50).default(10),
    },
    async ({ agent_id, page, page_size }) => {
      const data = await apiGet<FeedbackListResponse>(
        `/agents/${agent_id}/feedbacks`,
        { page, page_size },
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "get_agent_activities",
    "Get on-chain activity history for an agent — registrations, reputation updates, " +
      "and validation events with timestamps, tx hashes, and descriptions.",
    {
      agent_id: z.string().describe("The agent's UUID"),
    },
    async ({ agent_id }) => {
      const data = await apiGet<ActivityItem[]>(`/activities/agent/${agent_id}`);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "get_agent_endpoint_health",
    "Check endpoint health for a specific agent — which URLs are reachable, " +
      "response times, HTTP status codes, and errors. Verifies if an agent is actually online.",
    {
      agent_id: z.string().describe("The agent's UUID"),
    },
    async ({ agent_id }) => {
      const data = await apiGet<AgentEndpointHealth>(
        `/agents/${agent_id}/endpoint-health`,
        undefined,
        60_000,
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "get_agent_transactions",
    "Get detailed transaction breakdown for an agent — gas used, fees, " +
      "transaction types, first and latest activity timestamps.",
    {
      agent_id: z.string().describe("The agent's UUID"),
    },
    async ({ agent_id }) => {
      const data = await apiGet<AgentTransactions>(
        `/analytics/agent/${agent_id}/transactions`,
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );
}
