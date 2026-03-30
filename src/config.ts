export const config = {
  apiUrl: process.env.AGENTSCAN_API_URL?.replace(/\/+$/, "") ?? "https://agentscan.info",
  defaultChain: process.env.AGENTSCAN_DEFAULT_CHAIN ?? undefined,
  requestTimeoutMs: 30_000,
} as const;
