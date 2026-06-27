/**
 * Selected Ad Context — Manages the selected ad variation across screens.
 *
 * When a user selects an ad variation from the AI Creator screen,
 * it's stored here so the campaign creation screen can access it.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AdVariation } from "@/server/adGeneratorRouter";

const SELECTED_AD_KEY = "@clickeros:selected_ad";

/**
 * Save the selected ad variation to AsyncStorage.
 */
export async function saveSelectedAd(ad: AdVariation & { campaignObjective: string }): Promise<void> {
  try {
    console.log("[SelectedAdContext] Saving selected ad:", ad.id);
    await AsyncStorage.setItem(SELECTED_AD_KEY, JSON.stringify(ad));
  } catch (error) {
    console.error("[SelectedAdContext] Failed to save selected ad:", error);
    throw error;
  }
}

/**
 * Load the selected ad variation from AsyncStorage.
 */
export async function loadSelectedAd(): Promise<(AdVariation & { campaignObjective: string }) | null> {
  try {
    const raw = await AsyncStorage.getItem(SELECTED_AD_KEY);
    if (!raw) return null;

    const ad = JSON.parse(raw);
    console.log("[SelectedAdContext] Loaded selected ad:", ad.id);
    return ad;
  } catch (error) {
    console.error("[SelectedAdContext] Failed to load selected ad:", error);
    return null;
  }
}

/**
 * Clear the selected ad variation.
 */
export async function clearSelectedAd(): Promise<void> {
  try {
    console.log("[SelectedAdContext] Clearing selected ad");
    await AsyncStorage.removeItem(SELECTED_AD_KEY);
  } catch (error) {
    console.error("[SelectedAdContext] Failed to clear selected ad:", error);
  }
}
