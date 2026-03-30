import { config } from "../config.js";

export class AgentScanApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    public readonly body: string,
  ) {
    super(`AgentScan API error ${status} ${statusText}: ${body}`);
    this.name = "AgentScanApiError";
  }
}

function buildUrl(path: string, params?: Record<string, unknown>): string {
  const url = new URL(`/api${path}`, config.apiUrl);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

export async function apiGet<T>(
  path: string,
  params?: Record<string, unknown>,
  timeoutMs?: number,
): Promise<T> {
  const url = buildUrl(path, params);
  const controller = new AbortController();
  const timer = setTimeout(
    () => controller.abort(),
    timeoutMs ?? config.requestTimeoutMs,
  );

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new AgentScanApiError(response.status, response.statusText, body);
    }

    return (await response.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}
