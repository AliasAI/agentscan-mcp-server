import { describe, it, expect, vi, beforeEach } from "vitest";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { apiGet } from "../../api-client/client.js";
import { registerNetworkTools } from "../../tools/networks.js";

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
  registerNetworkTools(server);
  return handlers;
}

describe("network tools", () => {
  let handlers: Map<string, (...args: unknown[]) => unknown>;

  beforeEach(() => {
    const server = new McpServer({ name: "test", version: "0.0.0" });
    handlers = getToolHandlers(server);
    apiGetMock.mockReset();
  });

  it("registers 2 tools", () => {
    expect(handlers.size).toBe(2);
    expect([...handlers.keys()]).toEqual(["list_networks", "get_endpoint_health_stats"]);
  });

  it("list_networks calls /networks", async () => {
    apiGetMock.mockResolvedValue([]);
    await handlers.get("list_networks")!({});
    expect(apiGetMock).toHaveBeenCalledWith("/networks");
  });

  it("get_endpoint_health_stats calls /endpoint-health/quick-stats", async () => {
    apiGetMock.mockResolvedValue({ summary: {} });
    await handlers.get("get_endpoint_health_stats")!({ network: undefined });
    expect(apiGetMock).toHaveBeenCalledWith("/endpoint-health/quick-stats", undefined);
  });

  it("get_endpoint_health_stats passes network filter", async () => {
    apiGetMock.mockResolvedValue({ summary: {} });
    await handlers.get("get_endpoint_health_stats")!({ network: "base" });
    expect(apiGetMock).toHaveBeenCalledWith("/endpoint-health/quick-stats", { network: "base" });
  });
});
