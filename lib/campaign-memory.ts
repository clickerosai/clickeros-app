/**
 * Campaign Memory — persists the last campaign form values in AsyncStorage
 * so users don't have to re-enter everything when creating a new campaign.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";

const MEMORY_KEY = "@clickeros:last_campaign";
const HISTORY_KEY = "@clickeros:campaign_history";
const MAX_HISTORY = 10;

export interface CampaignMemory {
  businessName: string;
  productService: string;
  targetAudience: string;
  websiteUrl: string;
  keywords: string;
  location: string;
  tone: string;
  offer: string;
  cta: string;
  platform: string;
  objective: string;
  templateId: string | null;
  savedAt: string;
}

export interface CampaignHistoryEntry extends CampaignMemory {
  id: string;
  campaignName: string;
  dailyBudget: string;
  generatedAdsCount: number;
}

/**
 * Save the current campaign form to memory (overwrites last session).
 */
export async function saveCampaignMemory(data: Partial<CampaignMemory>): Promise<void> {
  try {
    const existing = await loadCampaignMemory();
    const now = new Date().toISOString();
    const merged: CampaignMemory = {
      businessName: "",
      productService: "",
      targetAudience: "",
      websiteUrl: "",
      keywords: "",
      location: "",
      tone: "casual",
      offer: "",
      cta: "",
      platform: "facebook",
      objective: "conversions",
      templateId: null,
      ...existing,
      ...data,
      savedAt: now,
    };
    await AsyncStorage.setItem(MEMORY_KEY, JSON.stringify(merged));
  } catch {
    // Silently fail — memory is non-critical
  }
}

/**
 * Load the last saved campaign form values.
 */
export async function loadCampaignMemory(): Promise<CampaignMemory | null> {
  try {
    const raw = await AsyncStorage.getItem(MEMORY_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CampaignMemory;
  } catch {
    return null;
  }
}

/**
 * Clear campaign memory (e.g., after a successful launch).
 */
export async function clearCampaignMemory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(MEMORY_KEY);
  } catch {}
}

/**
 * Save a completed campaign to history.
 */
export async function saveCampaignToHistory(entry: Omit<CampaignHistoryEntry, "id">): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    const history: CampaignHistoryEntry[] = raw ? JSON.parse(raw) : [];
    const newEntry: CampaignHistoryEntry = {
      ...entry,
      id: `campaign-${Date.now()}`,
    };
    // Prepend and keep only last MAX_HISTORY entries
    const updated = [newEntry, ...history].slice(0, MAX_HISTORY);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch {}
}

/**
 * Load campaign history.
 */
export async function loadCampaignHistory(): Promise<CampaignHistoryEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CampaignHistoryEntry[];
  } catch {
    return [];
  }
}
