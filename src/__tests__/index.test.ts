import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock all tool registration modules
const mockRegisterSearch = vi.fn();
const mockRegisterAgentDetail = vi.fn();
const mockRegisterPortfolio = vi.fn();
const mockRegisterAnalytics = vi.fn();
const mockRegisterNetwork = vi.fn();
const mockRegisterTaxonomy = vi.fn();

vi.mock("../tools/search.js", () => ({ registerSearchTools: mockRegisterSearch }));
vi.mock("../tools/agent-details.js", () => ({ registerAgentDetailTools: mockRegisterAgentDetail }));
vi.mock("../tools/portfolio.js", () => ({ registerPortfolioTools: mockRegisterPortfolio }));
vi.mock("../tools/analytics.js", () => ({ registerAnalyticsTools: mockRegisterAnalytics }));
vi.mock("../tools/networks.js", () => ({ registerNetworkTools: mockRegisterNetwork }));
vi.mock("../tools/taxonomy.js", () => ({ registerTaxonomyTools: mockRegisterTaxonomy }));

// Mock transport to prevent stdio connection
vi.mock("@modelcontextprotocol/sdk/server/stdio.js", () => ({
  StdioServerTransport: vi.fn(),
}));

// Mock McpServer.connect to prevent actual connection
vi.mock("@modelcontextprotocol/sdk/server/mcp.js", async (importOriginal) => {
  const original = await importOriginal<typeof import("@modelcontextprotocol/sdk/server/mcp.js")>();
  return {
    ...original,
    McpServer: class MockMcpServer extends original.McpServer {
      override async connect() {
        // no-op
      }
    },
  };
});

describe("server registration", () => {
  it("calls all 6 register functions with the server", async () => {
    await import("../index.js");

    expect(mockRegisterSearch).toHaveBeenCalledOnce();
    expect(mockRegisterAgentDetail).toHaveBeenCalledOnce();
    expect(mockRegisterPortfolio).toHaveBeenCalledOnce();
    expect(mockRegisterAnalytics).toHaveBeenCalledOnce();
    expect(mockRegisterNetwork).toHaveBeenCalledOnce();
    expect(mockRegisterTaxonomy).toHaveBeenCalledOnce();
  });

  it("passes McpServer instance to each register function", async () => {
    await import("../index.js");

    // All register functions should receive the same server instance
    const server = mockRegisterSearch.mock.calls[0][0];
    expect(server).toBeDefined();
    expect(mockRegisterAgentDetail.mock.calls[0][0]).toBe(server);
    expect(mockRegisterPortfolio.mock.calls[0][0]).toBe(server);
    expect(mockRegisterAnalytics.mock.calls[0][0]).toBe(server);
    expect(mockRegisterNetwork.mock.calls[0][0]).toBe(server);
    expect(mockRegisterTaxonomy.mock.calls[0][0]).toBe(server);
  });
});
