import { describe, it, expect, vi, beforeEach } from "vitest";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { apiGet } from "../../api-client/client.js";
import { registerPortfolioTools } from "../../tools/portfolio.js";

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
  registerPortfolioTools(server);
  return handlers;
}

describe("portfolio tools", () => {
  let handlers: Map<string, (...args: unknown[]) => unknown>;

  beforeEach(() => {
    const server = new McpServer({ name: "test", version: "0.0.0" });
    handlers = getToolHandlers(server);
    apiGetMock.mockReset();
  });

  it("registers 1 tool", () => {
    expect(handlers.size).toBe(1);
    expect([...handlers.keys()]).toEqual(["get_owner_portfolio"]);
  });

  it("calls /agents/by-owner/:address", async () => {
    const addr = "0xAbC123";
    const mockData = { owner: addr, summary: {}, agents: [] };
    apiGetMock.mockResolvedValue(mockData);
    const result = await handlers.get("get_owner_portfolio")!({ owner_address: addr });
    expect(apiGetMock).toHaveBeenCalledWith(`/agents/by-owner/${addr}`);
    expect(result).toEqual({
      content: [{ type: "text", text: JSON.stringify(mockData, null, 2) }],
    });
  });
});
