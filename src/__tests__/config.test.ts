import { describe, it, expect, vi, beforeEach } from "vitest";

describe("config", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("defaults apiUrl to https://agentscan.info", async () => {
    delete process.env.AGENTSCAN_API_URL;
    delete process.env.AGENTSCAN_DEFAULT_CHAIN;
    const { config } = await import("../config.js");
    expect(config.apiUrl).toBe("https://agentscan.info");
  });

  it("reads AGENTSCAN_API_URL and strips trailing slashes", async () => {
    process.env.AGENTSCAN_API_URL = "https://custom.api.com///";
    const { config } = await import("../config.js");
    expect(config.apiUrl).toBe("https://custom.api.com");
    delete process.env.AGENTSCAN_API_URL;
  });

  it("reads AGENTSCAN_DEFAULT_CHAIN", async () => {
    process.env.AGENTSCAN_DEFAULT_CHAIN = "base";
    const { config } = await import("../config.js");
    expect(config.defaultChain).toBe("base");
    delete process.env.AGENTSCAN_DEFAULT_CHAIN;
  });

  it("defaults defaultChain to undefined", async () => {
    delete process.env.AGENTSCAN_DEFAULT_CHAIN;
    const { config } = await import("../config.js");
    expect(config.defaultChain).toBeUndefined();
  });

  it("has requestTimeoutMs of 30_000", async () => {
    const { config } = await import("../config.js");
    expect(config.requestTimeoutMs).toBe(30_000);
  });
});
