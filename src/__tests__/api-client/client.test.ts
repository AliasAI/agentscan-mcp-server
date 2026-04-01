import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiGet, AgentScanApiError } from "../../api-client/client.js";

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

// Override config to use a test URL
vi.mock("../../config.js", () => ({
  config: {
    apiUrl: "https://test.agentscan.info",
    defaultChain: undefined,
    requestTimeoutMs: 5_000,
  },
}));

function jsonResponse(data: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? "OK" : "Error",
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  } as unknown as Response;
}

beforeEach(() => {
  fetchMock.mockReset();
});

describe("apiGet", () => {
  it("builds correct URL with /api prefix", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ ok: true }));
    await apiGet("/agents");
    const url = fetchMock.mock.calls[0][0];
    expect(url).toBe("https://test.agentscan.info/api/agents");
  });

  it("appends query params", async () => {
    fetchMock.mockResolvedValue(jsonResponse([]));
    await apiGet("/agents", { network: "base", page: 1 });
    const url = new URL(fetchMock.mock.calls[0][0]);
    expect(url.searchParams.get("network")).toBe("base");
    expect(url.searchParams.get("page")).toBe("1");
  });

  it("skips null and undefined params", async () => {
    fetchMock.mockResolvedValue(jsonResponse([]));
    await apiGet("/agents", { network: undefined, owner: null, page: 1 });
    const url = new URL(fetchMock.mock.calls[0][0]);
    expect(url.searchParams.has("network")).toBe(false);
    expect(url.searchParams.has("owner")).toBe(false);
    expect(url.searchParams.get("page")).toBe("1");
  });

  it("returns parsed JSON on success", async () => {
    const data = { items: [], total: 0 };
    fetchMock.mockResolvedValue(jsonResponse(data));
    const result = await apiGet("/agents");
    expect(result).toEqual(data);
  });

  it("throws AgentScanApiError on HTTP error", async () => {
    fetchMock.mockResolvedValue(jsonResponse("Not Found", 404));
    await expect(apiGet("/agents/bad-id")).rejects.toThrow(AgentScanApiError);
    try {
      await apiGet("/agents/bad-id");
    } catch (err) {
      const apiErr = err as AgentScanApiError;
      expect(apiErr.status).toBe(404);
    }
  });

  it("sends Accept: application/json header", async () => {
    fetchMock.mockResolvedValue(jsonResponse({}));
    await apiGet("/stats");
    const options = fetchMock.mock.calls[0][1];
    expect(options.headers.Accept).toBe("application/json");
  });

  it("uses GET method", async () => {
    fetchMock.mockResolvedValue(jsonResponse({}));
    await apiGet("/stats");
    const options = fetchMock.mock.calls[0][1];
    expect(options.method).toBe("GET");
  });

  it("passes AbortSignal for timeout", async () => {
    fetchMock.mockResolvedValue(jsonResponse({}));
    await apiGet("/stats");
    const options = fetchMock.mock.calls[0][1];
    expect(options.signal).toBeInstanceOf(AbortSignal);
  });
});
