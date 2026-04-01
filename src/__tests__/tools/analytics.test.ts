import { describe, it, expect, vi, beforeEach } from "vitest";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { apiGet } from "../../api-client/client.js";
import { registerAnalyticsTools } from "../../tools/analytics.js";

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
  registerAnalyticsTools(server);
  return handlers;
}

describe("analytics tools", () => {
  let handlers: Map<string, (...args: unknown[]) => unknown>;

  beforeEach(() => {
    const server = new McpServer({ name: "test", version: "0.0.0" });
    handlers = getToolHandlers(server);
    apiGetMock.mockReset();
  });

  it("registers 6 tools", () => {
    expect(handlers.size).toBe(6);
    expect([...handlers.keys()]).toEqual([
      "get_stats",
      "get_registration_trend",
      "get_analytics_overview",
      "get_network_distribution",
      "get_skill_ranking",
      "get_recent_activities",
    ]);
  });

  it("get_stats calls /stats with no params", async () => {
    apiGetMock.mockResolvedValue({ total_agents: 100 });
    await handlers.get("get_stats")!({});
    expect(apiGetMock).toHaveBeenCalledWith("/stats");
  });

  it("get_registration_trend passes days param", async () => {
    apiGetMock.mockResolvedValue({ data: [] });
    await handlers.get("get_registration_trend")!({ days: 7 });
    expect(apiGetMock).toHaveBeenCalledWith("/stats/registration-trend", { days: 7 });
  });

  it("get_analytics_overview passes days and network", async () => {
    apiGetMock.mockResolvedValue({ stats: {}, trend_data: [] });
    const params = { days: 30, network: "base" };
    await handlers.get("get_analytics_overview")!(params);
    expect(apiGetMock).toHaveBeenCalledWith("/analytics/overview", params);
  });

  it("get_network_distribution calls /stats/network-distribution", async () => {
    apiGetMock.mockResolvedValue({ networks: [] });
    await handlers.get("get_network_distribution")!({});
    expect(apiGetMock).toHaveBeenCalledWith("/stats/network-distribution");
  });

  it("get_skill_ranking passes limit", async () => {
    apiGetMock.mockResolvedValue({ skills: [] });
    await handlers.get("get_skill_ranking")!({ limit: 10 });
    expect(apiGetMock).toHaveBeenCalledWith("/stats/skill-ranking", { limit: 10 });
  });

  it("get_recent_activities passes pagination", async () => {
    apiGetMock.mockResolvedValue({ items: [], total: 0 });
    const params = { page: 1, page_size: 20 };
    await handlers.get("get_recent_activities")!(params);
    expect(apiGetMock).toHaveBeenCalledWith("/activities", params);
  });
});
