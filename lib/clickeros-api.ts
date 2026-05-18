/**
 * Clickeros AI API Client
 *
 * Typed client for the Clickeros AI backend API.
 * Uses the CLICKEROS_API_KEY environment variable for authentication.
 *
 * When no API key is configured, all methods return null and the
 * dashboardRouter falls back to mock data automatically.
 *
 * API Base URL: https://api.clickeros.ai/v1 (or CLICKEROS_API_URL env var)
 *
 * To enable live data:
 *   1. Set CLICKEROS_API_KEY in your environment secrets
 *   2. Optionally set CLICKEROS_API_URL if using a custom endpoint
 */

import axios, { type AxiosInstance } from "axios";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ClickerosCampaign {
  id: string;
  name: string;
  platform: string;
  status: "active" | "paused" | "scaling" | "stopped";
  dailyBudget: number;
  totalSpend: number;
  roas: number;
  ctr: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  createdAt: string;
  updatedAt: string;
}

export interface ClickerosDashboardStats {
  activeCampaigns: number;
  totalRevenue: number;
  avgRoas: number;
  ctr: number;
  totalSpend: number;
  totalImpressions: number;
  period: "today" | "7d" | "30d";
}

export interface ClickerosAnalyticsChannel {
  channel: string;
  sessions: number;
  conversions: number;
  revenue: number;
  roas: number;
}

export interface ClickerosTopContent {
  title: string;
  url: string;
  views: number;
  conversions: number;
  revenue: number;
}

export interface ClickerosAdGenerationRequest {
  businessName: string;
  productService: string;
  targetAudience: string;
  campaignObjective: string;
  tone: string;
  platform: string;
  offer?: string;
  cta: string;
  websiteUrl?: string;
  keywords?: string;
  count?: number;
}

export interface ClickerosAdVariation {
  headline: string;
  body: string;
  cta: string;
  platform: string;
  score: number;
}

// ── Client ────────────────────────────────────────────────────────────────────

class ClickerosApiClient {
  private client: AxiosInstance | null = null;
  private apiKey: string | null = null;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.CLICKEROS_API_KEY ?? null;
    this.baseUrl = (process.env.CLICKEROS_API_URL ?? "https://api.clickeros.ai/v1").replace(/\/$/, "");

    if (this.apiKey) {
      this.client = axios.create({
        baseURL: this.baseUrl,
        timeout: 15_000,
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "X-Client": "clickeros-mobile-app/1.0",
        },
      });

      // Request interceptor for logging
      this.client.interceptors.request.use((config) => {
        console.log(`[ClickerosAPI] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      });

      // Response interceptor for error handling
      this.client.interceptors.response.use(
        (response) => response,
        (error) => {
          const status = error.response?.status;
          const message = error.response?.data?.message ?? error.message;
          console.error(`[ClickerosAPI] Error ${status}: ${message}`);
          return Promise.reject(error);
        }
      );

      console.log("[ClickerosAPI] Initialized with API key");
    } else {
      console.log("[ClickerosAPI] No API key configured — using mock data");
    }
  }

  get isConfigured(): boolean {
    return !!this.client && !!this.apiKey;
  }

  // ── Dashboard ──────────────────────────────────────────────────────────────

  async getDashboardStats(period: "today" | "7d" | "30d" = "today"): Promise<ClickerosDashboardStats | null> {
    if (!this.client) return null;
    try {
      const { data } = await this.client.get<ClickerosDashboardStats>(`/dashboard/stats`, {
        params: { period },
      });
      return data;
    } catch (err) {
      console.error("[ClickerosAPI] getDashboardStats failed:", err);
      return null;
    }
  }

  // ── Campaigns ──────────────────────────────────────────────────────────────

  async getCampaigns(): Promise<ClickerosCampaign[] | null> {
    if (!this.client) return null;
    try {
      const { data } = await this.client.get<{ campaigns: ClickerosCampaign[] }>("/campaigns");
      return data.campaigns;
    } catch (err) {
      console.error("[ClickerosAPI] getCampaigns failed:", err);
      return null;
    }
  }

  async pauseCampaign(campaignId: string): Promise<boolean> {
    if (!this.client) return false;
    try {
      await this.client.post(`/campaigns/${campaignId}/pause`);
      return true;
    } catch {
      return false;
    }
  }

  async resumeCampaign(campaignId: string): Promise<boolean> {
    if (!this.client) return false;
    try {
      await this.client.post(`/campaigns/${campaignId}/resume`);
      return true;
    } catch {
      return false;
    }
  }

  async optimizeCampaign(campaignId: string): Promise<{ improvement: string } | null> {
    if (!this.client) return null;
    try {
      const { data } = await this.client.post<{ improvement: string }>(`/campaigns/${campaignId}/optimize`);
      return data;
    } catch {
      return null;
    }
  }

  // ── Analytics ──────────────────────────────────────────────────────────────

  async getAnalyticsMetrics(period: "7d" | "30d" | "90d" = "30d"): Promise<ClickerosDashboardStats | null> {
    if (!this.client) return null;
    try {
      const { data } = await this.client.get<ClickerosDashboardStats>("/analytics/metrics", {
        params: { period },
      });
      return data;
    } catch {
      return null;
    }
  }

  async getChannelBreakdown(): Promise<ClickerosAnalyticsChannel[] | null> {
    if (!this.client) return null;
    try {
      const { data } = await this.client.get<{ channels: ClickerosAnalyticsChannel[] }>("/analytics/channels");
      return data.channels;
    } catch {
      return null;
    }
  }

  async getTopContent(): Promise<ClickerosTopContent[] | null> {
    if (!this.client) return null;
    try {
      const { data } = await this.client.get<{ content: ClickerosTopContent[] }>("/analytics/top-content");
      return data.content;
    } catch {
      return null;
    }
  }

  // ── AI Ad Generation ───────────────────────────────────────────────────────

  async generateAds(request: ClickerosAdGenerationRequest): Promise<ClickerosAdVariation[] | null> {
    if (!this.client) return null;
    try {
      const { data } = await this.client.post<{ variations: ClickerosAdVariation[] }>("/ai/generate-ads", request);
      return data.variations;
    } catch {
      return null;
    }
  }
}

// Singleton instance
export const clickerosApi = new ClickerosApiClient();

/**
 * Check if the Clickeros API is configured and available.
 * Returns true if CLICKEROS_API_KEY is set.
 */
export function isApiConfigured(): boolean {
  return clickerosApi.isConfigured;
}
