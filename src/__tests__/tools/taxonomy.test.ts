import { describe, it, expect, vi, beforeEach } from "vitest";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { apiGet } from "../../api-client/client.js";
import { registerTaxonomyTools } from "../../tools/taxonomy.js";

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
  registerTaxonomyTools(server);
  return handlers;
}

describe("taxonomy tools", () => {
  let handlers: Map<string, (...args: unknown[]) => unknown>;

  beforeEach(() => {
    const server = new McpServer({ name: "test", version: "0.0.0" });
    handlers = getToolHandlers(server);
    apiGetMock.mockReset();
  });

  it("registers 3 tools", () => {
    expect(handlers.size).toBe(3);
    expect([...handlers.keys()]).toEqual([
      "get_taxonomy_distribution",
      "list_taxonomy_skills",
      "list_taxonomy_domains",
    ]);
  });

  it("get_taxonomy_distribution calls /taxonomy/distribution", async () => {
    apiGetMock.mockResolvedValue({ skills: [], domains: [] });
    await handlers.get("get_taxonomy_distribution")!({});
    expect(apiGetMock).toHaveBeenCalledWith("/taxonomy/distribution");
  });

  it("list_taxonomy_skills calls /taxonomy/skills", async () => {
    apiGetMock.mockResolvedValue({ count: 136, skills: [] });
    await handlers.get("list_taxonomy_skills")!({});
    expect(apiGetMock).toHaveBeenCalledWith("/taxonomy/skills");
  });

  it("list_taxonomy_domains calls /taxonomy/domains", async () => {
    apiGetMock.mockResolvedValue({ count: 10, domains: [] });
    await handlers.get("list_taxonomy_domains")!({});
    expect(apiGetMock).toHaveBeenCalledWith("/taxonomy/domains");
  });
});
