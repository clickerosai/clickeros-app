import { publicProcedure, router } from "./_core/trpc";

// ── Types ────────────────────────────────────────────────────────────────────

export interface DashboardStat {
  label: string;
  value: string;
  change: string;
  positive: boolean;
}

export interface Campaign {
  id: string;
  name: string;
  platform: string;
  status: "Active" | "Paused" | "Scaling" | "Stopped";
  budget: string;
  spend: string;
  roas: string;
  ctr: string;
  impressions: string;
  color: string;
}

export interface AnalyticMetric {
  label: string;
  value: string;
  change: string;
  positive: boolean;
}

export interface ChannelBreakdown {
  channel: string;
  revenue: string;
  sessions: string;
  roas: string;
  share: number;
  color: string;
}

export interface TopContent {
  rank: number;
  title: string;
  traffic: string;
  revenue: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Simulate slight random variation on each fetch to show live data feel */
function vary(base: number, pct = 0.05): number {
  const delta = base * pct * (Math.random() * 2 - 1);
  return Math.round((base + delta) * 100) / 100;
}

function fmtCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

function fmtK(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${n}`;
}

// ── Router ───────────────────────────────────────────────────────────────────

export const dashboardRouter = router({
  /**
   * GET /api/trpc/dashboard.stats
   * Returns the four KPI cards on the Dashboard screen.
   */
  stats: publicProcedure.query((): DashboardStat[] => {
    const revenue = vary(48200);
    const roas = vary(3.8, 0.04);
    const ctr = vary(4.7, 0.06);
    const campaigns = Math.round(vary(12, 0.08));

    return [
      {
        label: "Active Campaigns",
        value: String(campaigns),
        change: `+${Math.max(1, Math.round(vary(3, 0.3)))}`,
        positive: true,
      },
      {
        label: "Total Revenue",
        value: fmtCurrency(revenue),
        change: `+${vary(18, 0.1).toFixed(0)}%`,
        positive: true,
      },
      {
        label: "Avg. ROAS",
        value: `${roas.toFixed(1)}x`,
        change: `+${vary(0.4, 0.2).toFixed(1)}`,
        positive: true,
      },
      {
        label: "CTR",
        value: `${ctr.toFixed(1)}%`,
        change: `+${vary(1.2, 0.15).toFixed(1)}%`,
        positive: true,
      },
    ];
  }),

  /**
   * GET /api/trpc/dashboard.campaigns
   * Returns the recent campaigns list.
   */
  campaigns: publicProcedure.query((): Campaign[] => {
    return [
      {
        id: "1",
        name: "Summer Sale — Facebook",
        platform: "Facebook",
        status: "Active",
        budget: "$50/day",
        spend: fmtCurrency(vary(1240, 0.05)),
        roas: `${vary(4.2, 0.04).toFixed(1)}x`,
        ctr: `${vary(5.1, 0.05).toFixed(1)}%`,
        impressions: fmtK(vary(48200, 0.05)),
        color: "#1877F2",
      },
      {
        id: "2",
        name: "Product Launch — Instagram",
        platform: "Instagram",
        status: "Active",
        budget: "$30/day",
        spend: fmtCurrency(vary(890, 0.05)),
        roas: `${vary(3.8, 0.04).toFixed(1)}x`,
        ctr: `${vary(4.7, 0.05).toFixed(1)}%`,
        impressions: fmtK(vary(32100, 0.05)),
        color: "#E1306C",
      },
      {
        id: "3",
        name: "Google Search Q2",
        platform: "Google",
        status: "Paused",
        budget: "$80/day",
        spend: fmtCurrency(vary(2100, 0.03)),
        roas: `${vary(2.9, 0.04).toFixed(1)}x`,
        ctr: `${vary(3.2, 0.05).toFixed(1)}%`,
        impressions: fmtK(vary(91400, 0.03)),
        color: "#4285F4",
      },
      {
        id: "4",
        name: "TikTok Brand Awareness",
        platform: "TikTok",
        status: "Active",
        budget: "$25/day",
        spend: fmtCurrency(vary(560, 0.06)),
        roas: `${vary(5.1, 0.04).toFixed(1)}x`,
        ctr: `${vary(6.8, 0.05).toFixed(1)}%`,
        impressions: fmtK(vary(124700, 0.05)),
        color: "#010101",
      },
      {
        id: "5",
        name: "YouTube Pre-Roll",
        platform: "YouTube",
        status: "Scaling",
        budget: "$60/day",
        spend: fmtCurrency(vary(1780, 0.05)),
        roas: `${vary(6.2, 0.04).toFixed(1)}x`,
        ctr: `${vary(7.3, 0.05).toFixed(1)}%`,
        impressions: fmtK(vary(87300, 0.04)),
        color: "#FF0000",
      },
      {
        id: "6",
        name: "Retargeting — All Platforms",
        platform: "Multi",
        status: "Active",
        budget: "$40/day",
        spend: fmtCurrency(vary(980, 0.05)),
        roas: `${vary(8.4, 0.04).toFixed(1)}x`,
        ctr: `${vary(9.1, 0.05).toFixed(1)}%`,
        impressions: fmtK(vary(22600, 0.05)),
        color: "#7C3AED",
      },
    ];
  }),

  /**
   * GET /api/trpc/dashboard.analyticsMetrics
   * Returns the 6 KPI metric cards on the Analytics screen.
   */
  analyticsMetrics: publicProcedure.query((): AnalyticMetric[] => {
    return [
      { label: "Total Revenue", value: fmtCurrency(vary(48240, 0.04)), change: `+${vary(18, 0.1).toFixed(0)}%`, positive: true },
      { label: "Total Sessions", value: fmtK(vary(142800, 0.04)), change: `+${vary(24, 0.1).toFixed(0)}%`, positive: true },
      { label: "Conversions", value: fmtK(vary(3847, 0.05)), change: `+${vary(31, 0.1).toFixed(0)}%`, positive: true },
      { label: "Avg. ROAS", value: `${vary(3.8, 0.04).toFixed(1)}x`, change: `+${vary(0.4, 0.15).toFixed(1)}`, positive: true },
      { label: "Total Clicks", value: fmtK(vary(28400, 0.05)), change: `+${vary(15, 0.1).toFixed(0)}%`, positive: true },
      { label: "Avg. CPA", value: `$${vary(12.54, 0.05).toFixed(2)}`, change: `-${vary(8, 0.1).toFixed(0)}%`, positive: true },
    ];
  }),

  /**
   * GET /api/trpc/dashboard.channelBreakdown
   * Returns the channel breakdown for the Analytics screen.
   */
  channelBreakdown: publicProcedure.query((): ChannelBreakdown[] => {
    return [
      { channel: "Facebook Ads", revenue: fmtCurrency(vary(18420, 0.04)), sessions: fmtK(vary(52100, 0.04)), roas: `${vary(4.2, 0.04).toFixed(1)}x`, share: 38, color: "#1877F2" },
      { channel: "Google Ads", revenue: fmtCurrency(vary(14200, 0.04)), sessions: fmtK(vary(41300, 0.04)), roas: `${vary(3.1, 0.04).toFixed(1)}x`, share: 29, color: "#4285F4" },
      { channel: "Organic SEO", revenue: fmtCurrency(vary(9840, 0.04)), sessions: fmtK(vary(31200, 0.04)), roas: "∞", share: 20, color: "#22C55E" },
      { channel: "TikTok Ads", revenue: fmtCurrency(vary(5780, 0.04)), sessions: fmtK(vary(18200, 0.04)), roas: `${vary(5.1, 0.04).toFixed(1)}x`, share: 13, color: "#010101" },
    ];
  }),

  /**
   * GET /api/trpc/dashboard.topContent
   * Returns the top content by revenue for the Analytics screen.
   */
  topContent: publicProcedure.query((): TopContent[] => {
    return [
      { rank: 1, title: "10 AI Tools That Replace Your Marketing Team", traffic: fmtK(vary(12400, 0.05)), revenue: fmtCurrency(vary(4820, 0.05)) },
      { rank: 2, title: "How to 3x Your ROAS with Retargeting", traffic: fmtK(vary(8700, 0.05)), revenue: fmtCurrency(vary(3210, 0.05)) },
      { rank: 3, title: "Complete Guide to Programmatic SEO", traffic: fmtK(vary(6200, 0.05)), revenue: fmtCurrency(vary(2140, 0.05)) },
      { rank: 4, title: "Facebook Ads vs Google Ads in 2025", traffic: fmtK(vary(5100, 0.05)), revenue: fmtCurrency(vary(1890, 0.05)) },
    ];
  }),
});
