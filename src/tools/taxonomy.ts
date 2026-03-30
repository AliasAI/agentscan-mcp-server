import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { apiGet } from "../api-client/client.js";
import type { TaxonomyDistribution, TaxonomyList } from "../api-client/types.js";

export function registerTaxonomyTools(server: McpServer): void {
  server.tool(
    "get_taxonomy_distribution",
    "Get OASF taxonomy distribution — skill and domain categories with agent counts " +
      "and percentages across all classified agents.",
    {},
    async () => {
      const data = await apiGet<TaxonomyDistribution>("/taxonomy/distribution");
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "list_taxonomy_skills",
    "List all 136 OASF skill categories with slugs. " +
      "Use these slugs as the 'skill' parameter in search_agents.",
    {},
    async () => {
      const data = await apiGet<TaxonomyList>("/taxonomy/skills");
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "list_taxonomy_domains",
    "List all OASF domain categories with slugs. " +
      "Use these slugs as the 'domain' parameter in search_agents.",
    {},
    async () => {
      const data = await apiGet<TaxonomyList>("/taxonomy/domains");
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );
}
