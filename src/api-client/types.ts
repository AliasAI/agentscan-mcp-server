// ── Pagination ───────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// ── Agent ────────────────────────────────────────────────────────────

export interface AgentListItem {
  id: string;
  name: string;
  address: string;
  description: string;
  reputation_score: number;
  reputation_count: number;
  status: "active" | "inactive" | "validating";
  network_id: string;
  network_name: string;
  created_at: string;
  updated_at: string;
  token_id: number;
  owner_address: string;
  skills: string[];
  domains: string[];
  classification_source: string | null;
  is_active: boolean | null;
}

export interface AgentDetail extends AgentListItem {
  metadata_uri: string | null;
  on_chain_data: Record<string, unknown> | null;
  last_synced_at: string | null;
  sync_status: string;
  agent_wallet: string | null;
  reputation_last_updated: string | null;
  metadata_refreshed_at: string | null;
}

// ── Trending ─────────────────────────────────────────────────────────

export interface TrendingResponse {
  top_ranked: AgentListItem[];
  featured: AgentListItem[];
  trending: AgentListItem[];
}

// ── Leaderboard ──────────────────────────────────────────────────────

export interface LeaderboardItem {
  rank: number;
  agent_id: string;
  agent_name: string;
  token_id: number;
  network_key: string;
  score: number;
  service_score: number;
  usage_score: number;
  freshness_score: number;
  profile_score: number;
  reputation_score: number;
  reputation_count: number;
  has_working_endpoints: boolean;
}

// ── Reputation ───────────────────────────────────────────────────────

export interface ReputationSummary {
  feedback_count: number;
  average_score: number;
  validation_count: number;
}

// ── Feedback ─────────────────────────────────────────────────────────

export interface FeedbackItem {
  id: string;
  value: number;
  value_decimals: number;
  display_value: string;
  client_address: string;
  feedback_index: number;
  tag1: string | null;
  tag2: string | null;
  endpoint: string | null;
  feedback_uri: string | null;
  feedback_hash: string | null;
  is_revoked: boolean;
  timestamp: string;
  block_number: number;
  transaction_hash: string;
}

export interface FeedbackListResponse extends PaginatedResponse<FeedbackItem> {
  subgraph_available: boolean;
  data_source: string;
}

// ── Activity ─────────────────────────────────────────────────────────

export interface ActivityItem {
  id: string;
  agent_id: string;
  activity_type: "registered" | "reputation_update" | "validation_complete";
  description: string;
  tx_hash: string;
  created_at: string;
  gas_used: number | null;
  gas_price: number | null;
  transaction_fee: number | null;
}

// ── Endpoint Health ──────────────────────────────────────────────────

export interface EndpointCheck {
  url: string;
  status: "healthy" | "unhealthy" | "timeout";
  response_time_ms: number | null;
  status_code: number | null;
  error: string | null;
}

export interface AgentEndpointHealth {
  agent_id: string;
  agent_name: string;
  total_endpoints: number;
  healthy_endpoints: number;
  endpoints: EndpointCheck[];
  checked_at: string;
}

// ── Transactions ─────────────────────────────────────────────────────

export interface AgentTransactions {
  agent_id: string;
  agent_name: string;
  total_transactions: number;
  transactions_by_type: Record<string, unknown[]>;
  first_activity: string | null;
  latest_activity: string | null;
}

// ── Owner Portfolio ──────────────────────────────────────────────────

export interface OwnerSummary {
  total_agents: number;
  networks: string[];
  networks_count: number;
  total_reputation: number;
  total_feedbacks: number;
  unique_skills: string[];
  unique_domains: string[];
}

export interface OwnerPortfolio {
  owner: string;
  summary: OwnerSummary;
  agents: AgentListItem[];
  page: number;
  page_size: number;
}

// ── Stats ────────────────────────────────────────────────────────────

export interface NetworkSyncInfo {
  network_name: string;
  network_key: string;
  current_block: number;
  latest_block: number;
  sync_progress: number;
  is_syncing: boolean;
  last_synced_at: string | null;
}

export interface StatsResponse {
  total_agents: number;
  active_agents: number;
  total_networks: number;
  total_activities: number;
  updated_at: string;
  multi_network_sync: {
    overall_progress: number;
    is_syncing: boolean;
    networks: NetworkSyncInfo[];
  };
}

// ── Registration Trend ───────────────────────────────────────────────

export interface RegistrationTrendResponse {
  data: Array<{ date: string; count: number }>;
}

// ── Analytics ────────────────────────────────────────────────────────

export interface AnalyticsStats {
  total_transactions: number;
  total_agents_with_tx: number;
  active_agents: number;
  agents_with_reputation: number;
  agents_with_working_endpoints: number;
  quality_rate: number;
  transactions_by_type: Record<string, number>;
  avg_tx_per_agent: number;
  total_gas_used: number;
  total_fees_wei: number;
  total_fees_eth: number;
  avg_fee_per_tx_eth: number;
}

export interface AnalyticsResponse {
  stats: AnalyticsStats;
  recent_activities: unknown[];
  trend_data: Array<{
    date: string;
    total: number;
    registered: number;
    reputation_update: number;
    validation_complete: number;
  }>;
  network_stats: Array<{
    network_key: string;
    network_name: string;
    total_transactions: number;
    total_agents: number;
    avg_tx_per_agent: number;
  }>;
}

// ── Network Distribution ─────────────────────────────────────────────

export interface NetworkDistribution {
  networks: Array<{
    network_id: string;
    network_name: string;
    total_agents: number;
    quality_agents: number;
    agents_with_reputation: number;
  }>;
  total_networks: number;
}

// ── Skill Ranking ────────────────────────────────────────────────────

export interface SkillRanking {
  skills: Array<{ slug: string; agent_count: number }>;
  total_classified: number;
}

// ── Networks ─────────────────────────────────────────────────────────

export interface NetworkInfo {
  id: string;
  name: string;
  chain_id: number;
  rpc_url: string;
  explorer_url: string;
  contracts: Record<string, string>;
  created_at: string;
}

export interface NetworkWithStats {
  id: string;
  name: string;
  chain_id: number;
  explorer_url: string;
  agent_count: number;
}

// ── Endpoint Health Stats ────────────────────────────────────────────

export interface EndpointHealthStats {
  summary: {
    total_agents: number;
    agents_scanned: number;
    agents_with_working_endpoints: number;
    agents_with_feedbacks: number;
    total_endpoints: number;
    healthy_endpoints: number;
    endpoint_health_rate: number;
    total_feedbacks: number;
  };
  working_agents: unknown[];
  top_reputation_agents: unknown[];
  generated_at: string;
}

// ── Taxonomy ─────────────────────────────────────────────────────────

export interface TaxonomyDistribution {
  skills: Array<{
    category: string;
    slug: string;
    count: number;
    percentage: number;
  }>;
  domains: Array<{
    category: string;
    slug: string;
    count: number;
    percentage: number;
  }>;
  total_classified: number;
  total_agents: number;
}

export interface TaxonomyList {
  count: number;
  skills?: Array<{ slug: string; display_name: string }>;
  domains?: Array<{ slug: string; display_name: string }>;
}
