import { describe, it, expect, vi, beforeEach } from "vitest";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { apiGet } from "../../api-client/client.js";
import { registerAgentDetailTools } from "../../tools/agent-details.js";

vi.mock("../../api-client/client.js", () => ({
  apiGet: vi.fn(),
}));

const apiGetMock = vi.mocked(apiGet);

function getToolHandlers(server: McpServer) {
  const handlers = new Map<string, (...args: unknown[]) => unknown>();
  vi.spyOn(server, "tool").mockImplementation(
    (name: string, _desc: unknown, _schema: unknown, handler?: unknown) => {
      const fn = handler ?? _schema;
      handlers.set(name, fn as (...args: unknown[]) => unknown);
      return server;
    },
  );
  registerAgentDetailTools(server);
  return handlers;
}

describe("agent-details tools", () => {
  let handlers: Map<string, (...args: unknown[]) => unknown>;
  const agentId = "test-uuid-456";

  beforeEach(() => {
    const server = new McpServer({ name: "test", version: "0.0.0" });
    handlers = getToolHandlers(server);
    apiGetMock.mockReset();
  });

  it("registers 6 tools", () => {
    expect(handlers.size).toBe(6);
    expect([...handlers.keys()]).toEqual([
      "get_agent",
      "get_agent_reputation",
      "get_agent_feedbacks",
      "get_agent_activities",
      "get_agent_endpoint_health",
      "get_agent_transactions",
    ]);
  });

  it("get_agent calls /agents/:id", async () => {
    apiGetMock.mockResolvedValue({ id: agentId, name: "TestAgent" });
    await handlers.get("get_agent")!({ agent_id: agentId });
    expect(apiGetMock).toHaveBeenCalledWith(`/agents/${agentId}`);
  });

  it("get_agent_reputation calls /agents/:id/reputation-summary", async () => {
    apiGetMock.mockResolvedValue({ feedback_count: 5, average_score: 80 });
    await handlers.get("get_agent_reputation")!({ agent_id: agentId });
    expect(apiGetMock).toHaveBeenCalledWith(`/agents/${agentId}/reputation-summary`);
  });

  it("get_agent_feedbacks calls /agents/:id/feedbacks with pagination", async () => {
    apiGetMock.mockResolvedValue({ items: [], total: 0 });
    await handlers.get("get_agent_feedbacks")!({ agent_id: agentId, page: 2, page_size: 5 });
    expect(apiGetMock).toHaveBeenCalledWith(`/agents/${agentId}/feedbacks`, { page: 2, page_size: 5 });
  });

  it("get_agent_activities calls /activities/agent/:id", async () => {
    apiGetMock.mockResolvedValue([]);
    await handlers.get("get_agent_activities")!({ agent_id: agentId });
    expect(apiGetMock).toHaveBeenCalledWith(`/activities/agent/${agentId}`);
  });

  it("get_agent_endpoint_health calls with 60s timeout", async () => {
    apiGetMock.mockResolvedValue({ endpoints: [] });
    await handlers.get("get_agent_endpoint_health")!({ agent_id: agentId });
    expect(apiGetMock).toHaveBeenCalledWith(
      `/agents/${agentId}/endpoint-health`,
      undefined,
      60_000,
    );
  });

  it("get_agent_transactions calls /analytics/agent/:id/transactions", async () => {
    apiGetMock.mockResolvedValue({ total_transactions: 0 });
    await handlers.get("get_agent_transactions")!({ agent_id: agentId });
    expect(apiGetMock).toHaveBeenCalledWith(`/analytics/agent/${agentId}/transactions`);
  });
});
