import { describe, it, expect, vi, beforeEach } from "vitest";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { apiGet } from "../../api-client/client.js";
import { registerSearchTools } from "../../tools/search.js";

vi.mock("../../api-client/client.js", () => ({
  apiGet: vi.fn(),
}));

const apiGetMock = vi.mocked(apiGet);

// Helper: extract registered tool handlers from McpServer
function getToolHandlers(server: McpServer) {
  const handlers = new Map<string, (...args: unknown[]) => unknown>();
  vi.spyOn(server, "tool").mockImplementation(
    (name: string, _desc: unknown, _schema: unknown, handler?: unknown) => {
      // server.tool has overloads; handler is the last arg
      const fn = handler ?? _schema;
      handlers.set(name, fn as (...args: unknown[]) => unknown);
      return server;
    },
  );
  registerSearchTools(server);
  return handlers;
}

describe("search tools", () => {
  let server: McpServer;
  let handlers: Map<string, (...args: unknown[]) => unknown>;

  beforeEach(() => {
    server = new McpServer({ name: "test", version: "0.0.0" });
    handlers = getToolHandlers(server);
    apiGetMock.mockReset();
  });

  it("registers 4 tools", () => {
    expect(handlers.size).toBe(4);
    expect([...handlers.keys()]).toEqual([
      "search_agents",
      "find_similar_agents",
      "get_trending_agents",
      "get_leaderboard",
    ]);
  });

  describe("search_agents", () => {
    it("calls /agents with params", async () => {
      const mockData = { items: [], total: 0, page: 1, page_size: 20, total_pages: 0 };
      apiGetMock.mockResolvedValue(mockData);
      const params = { network: "base", page: 1, page_size: 20, sort_field: "created_at", sort_order: "desc" };
      const result = await handlers.get("search_agents")!(params);
      expect(apiGetMock).toHaveBeenCalledWith("/agents", params);
      expect(result).toEqual({
        content: [{ type: "text", text: JSON.stringify(mockData, null, 2) }],
      });
    });
  });

  describe("find_similar_agents", () => {
    it("calls /agents/similar/:id", async () => {
      const mockData = [{ id: "a1", name: "Agent1" }];
      apiGetMock.mockResolvedValue(mockData);
      await handlers.get("find_similar_agents")!({ agent_id: "uuid-123", limit: 5 });
      expect(apiGetMock).toHaveBeenCalledWith("/agents/similar/uuid-123", { limit: 5 });
    });
  });

  describe("get_trending_agents", () => {
    it("calls /agents/trending", async () => {
      apiGetMock.mockResolvedValue({ trending: [], top_ranked: [], featured: [] });
      await handlers.get("get_trending_agents")!({ limit: 5 });
      expect(apiGetMock).toHaveBeenCalledWith("/agents/trending", { limit: 5 });
    });
  });

  describe("get_leaderboard", () => {
    it("calls /leaderboard with params", async () => {
      const mockData = { items: [], total: 0 };
      apiGetMock.mockResolvedValue(mockData);
      const params = { sort_by: "score", page: 1, page_size: 20 };
      await handlers.get("get_leaderboard")!(params);
      expect(apiGetMock).toHaveBeenCalledWith("/leaderboard", params);
    });
  });
});
