/**
 * CampaignAlertSheet — Bottom sheet for configuring per-campaign alert overrides.
 *
 * Lets users set a custom ROAS threshold for a specific campaign,
 * overriding the global notification settings.
 *
 * Usage:
 *   <CampaignAlertSheet
 *     campaign={campaign}
 *     visible={sheetVisible}
 *     onClose={() => setSheetVisible(false)}
 *   />
 */
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  Switch,
  Animated,
} from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/use-colors";
import { useResponsive } from "@/hooks/use-responsive";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useToast } from "@/components/toast";
import { useSettingsSync } from "@/hooks/use-settings-sync";

const OVERRIDES_KEY = "@clickeros:campaign_alert_overrides";

// ── Storage Helpers ───────────────────────────────────────────────────────────

export interface CampaignAlertOverride {
  campaignId: string;
  enabled: boolean;
  roasDropThreshold: number | null; // null = use global
  budgetAlertEnabled: boolean;
  updatedAt: string;
}

export async function getCampaignAlertOverrides(): Promise<Record<string, CampaignAlertOverride>> {
  try {
    const raw = await AsyncStorage.getItem(OVERRIDES_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, CampaignAlertOverride>;
  } catch {
    return {};
  }
}

export async function saveCampaignAlertOverride(override: CampaignAlertOverride): Promise<void> {
  try {
    const existing = await getCampaignAlertOverrides();
    existing[override.campaignId] = override;
    await AsyncStorage.setItem(OVERRIDES_KEY, JSON.stringify(existing));
  } catch {}
}

export async function clearCampaignAlertOverride(campaignId: string): Promise<void> {
  try {
    const existing = await getCampaignAlertOverrides();
    delete existing[campaignId];
    await AsyncStorage.setItem(OVERRIDES_KEY, JSON.stringify(existing));
  } catch {}
}

export async function getCampaignAlertOverride(campaignId: string): Promise<CampaignAlertOverride | null> {
  const all = await getCampaignAlertOverrides();
  return all[campaignId] ?? null;
}

// ── ROAS Threshold Options ────────────────────────────────────────────────────

const ROAS_OPTIONS = [
  { value: null,  label: "Use Global",  desc: "Follow notification settings" },
  { value: 1.0,   label: "Below 1.0x",  desc: "Losing money" },
  { value: 1.5,   label: "Below 1.5x",  desc: "Low performance" },
  { value: 2.0,   label: "Below 2.0x",  desc: "Standard" },
  { value: 2.5,   label: "Below 2.5x",  desc: "Moderate" },
  { value: 3.0,   label: "Below 3.0x",  desc: "High standard" },
  { value: 4.0,   label: "Below 4.0x",  desc: "Very strict" },
];

// ── Component ─────────────────────────────────────────────────────────────────

interface CampaignAlertSheetProps {
  campaign: { id: string; name: string; roas: string; platform: string; color: string };
  visible: boolean;
  onClose: () => void;
}

export function CampaignAlertSheet({ campaign, visible, onClose }: CampaignAlertSheetProps) {
  const colors = useColors();
  const r = useResponsive();
  const { showToast } = useToast();
  const { syncOverrideToDb, deleteOverrideFromDb } = useSettingsSync();
  const translateY = useRef(new Animated.Value(400)).current;

  const [override, setOverride] = useState<CampaignAlertOverride>({
    campaignId: campaign.id,
    enabled: true,
    roasDropThreshold: null,
    budgetAlertEnabled: true,
    updatedAt: new Date().toISOString(),
  });
  const [hasOverride, setHasOverride] = useState(false);

  // Load existing override on open
  useEffect(() => {
    if (!visible) return;
    getCampaignAlertOverride(campaign.id).then((existing) => {
      if (existing) {
        setOverride(existing);
        setHasOverride(true);
      } else {
        setOverride({
          campaignId: campaign.id,
          enabled: true,
          roasDropThreshold: null,
          budgetAlertEnabled: true,
          updatedAt: new Date().toISOString(),
        });
        setHasOverride(false);
      }
    });
  }, [visible, campaign.id]);

  // Animate in/out
  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        tension: 60,
        friction: 10,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: 400,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleSave = useCallback(async () => {
    const updated = { ...override, updatedAt: new Date().toISOString() };
    // Save to AsyncStorage (local, offline-first)
    await saveCampaignAlertOverride(updated);
    // Sync to database in background (cross-device sync)
    syncOverrideToDb(updated).catch(() => {});
    setHasOverride(true);
    if (Platform.OS !== "web") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    showToast({
      type: "success",
      message: "Alert override saved ✅",
      subMessage: `Custom alerts set for "${campaign.name}". Synced across devices.`,
      duration: 3000,
    });
    onClose();
  }, [override, campaign.name, onClose, showToast, syncOverrideToDb]);

  const handleClearOverride = useCallback(async () => {
    // Remove from AsyncStorage (local)
    await clearCampaignAlertOverride(campaign.id);
    // Remove from database (cross-device sync)
    deleteOverrideFromDb(campaign.id).catch(() => {});
    setHasOverride(false);
    setOverride({
      campaignId: campaign.id,
      enabled: true,
      roasDropThreshold: null,
      budgetAlertEnabled: true,
      updatedAt: new Date().toISOString(),
    });
    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    showToast({
      type: "info",
      message: "Override cleared",
      subMessage: `"${campaign.name}" will use global alert settings.`,
      duration: 2500,
    });
    onClose();
  }, [campaign.id, campaign.name, onClose, showToast, deleteOverrideFromDb]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.45)" }}
        onPress={onClose}
        activeOpacity={1}
      />

      {/* Sheet */}
      <Animated.View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: colors.background,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingBottom: Platform.OS === "ios" ? 34 : 20,
          transform: [{ translateY }],
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.15,
          shadowRadius: 20,
          elevation: 20,
        }}
      >
        {/* Handle */}
        <View style={{ alignItems: "center", paddingTop: 12, paddingBottom: 4 }}>
          <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border }} />
        </View>

        {/* Header */}
        <View style={{ paddingHorizontal: r.px, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: `${campaign.color}15`, alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Text style={{ fontSize: 18 }}>🔔</Text>
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={{ color: colors.foreground, fontSize: r.fontSize.lg, fontWeight: "700" }} numberOfLines={1}>
                Alert Override
              </Text>
              <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, marginTop: 1 }} numberOfLines={1}>
                {campaign.name} · {campaign.platform}
              </Text>
            </View>
            {hasOverride && (
              <View style={{ backgroundColor: "#7C3AED15", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
                <Text style={{ color: "#7C3AED", fontSize: 10, fontWeight: "700" }}>CUSTOM</Text>
              </View>
            )}
          </View>
        </View>

        <ScrollView contentContainerStyle={{ padding: r.px, gap: 16 }} showsVerticalScrollIndicator={false}>
          {/* Enable/Disable alerts for this campaign */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: colors.surface, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: colors.border }}>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={{ color: colors.foreground, fontSize: r.fontSize.base, fontWeight: "600" }}>
                Alerts for this campaign
              </Text>
              <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, marginTop: 1 }}>
                {override.enabled ? "Alerts are on for this campaign" : "All alerts disabled for this campaign"}
              </Text>
            </View>
            <Switch
              value={override.enabled}
              onValueChange={(v) => setOverride((prev) => ({ ...prev, enabled: v }))}
              trackColor={{ false: colors.border, true: "#7C3AED" }}
              thumbColor={Platform.OS === "android" ? "#FFFFFF" : undefined}
            />
          </View>

          {/* ROAS Threshold */}
          <View style={{ opacity: override.enabled ? 1 : 0.4 }}>
            <Text style={{ color: colors.foreground, fontSize: r.fontSize.base, fontWeight: "700", marginBottom: 4 }}>
              ROAS Alert Threshold
            </Text>
            <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, marginBottom: 10 }}>
              Current ROAS: <Text style={{ color: colors.foreground, fontWeight: "600" }}>{campaign.roas}</Text>
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {ROAS_OPTIONS.map((opt) => {
                const sel = override.roasDropThreshold === opt.value;
                return (
                  <TouchableOpacity
                    key={String(opt.value)}
                    style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1.5, borderColor: sel ? "#7C3AED" : colors.border, backgroundColor: sel ? "#7C3AED10" : colors.background, alignItems: "center" }}
                    onPress={() => setOverride((prev) => ({ ...prev, roasDropThreshold: opt.value }))}
                    activeOpacity={0.7}
                    disabled={!override.enabled}
                  >
                    <Text style={{ color: sel ? "#7C3AED" : colors.foreground, fontSize: r.fontSize.sm, fontWeight: sel ? "700" : "500" }}>{opt.label}</Text>
                    <Text style={{ color: sel ? "#7C3AED" : colors.muted, fontSize: r.fontSize.xs, marginTop: 1, opacity: 0.8 }}>{opt.desc}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Budget Alert Toggle */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: colors.surface, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: colors.border, opacity: override.enabled ? 1 : 0.4 }}>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={{ color: colors.foreground, fontSize: r.fontSize.base, fontWeight: "600" }}>Budget Alerts</Text>
              <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, marginTop: 1 }}>
                Alert when budget is nearly exhausted
              </Text>
            </View>
            <Switch
              value={override.budgetAlertEnabled}
              onValueChange={(v) => setOverride((prev) => ({ ...prev, budgetAlertEnabled: v }))}
              disabled={!override.enabled}
              trackColor={{ false: colors.border, true: "#7C3AED" }}
              thumbColor={Platform.OS === "android" ? "#FFFFFF" : undefined}
            />
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={{ paddingHorizontal: r.px, paddingTop: 12, gap: 10 }}>
          <TouchableOpacity
            style={{ backgroundColor: "#7C3AED", borderRadius: 14, height: 52, alignItems: "center", justifyContent: "center" }}
            onPress={handleSave}
            activeOpacity={0.85}
          >
            <Text style={{ color: "#FFFFFF", fontSize: r.fontSize.lg, fontWeight: "700" }}>
              Save Override
            </Text>
          </TouchableOpacity>
          {hasOverride && (
            <TouchableOpacity
              style={{ backgroundColor: colors.surface, borderRadius: 14, height: 48, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border }}
              onPress={handleClearOverride}
              activeOpacity={0.7}
            >
              <Text style={{ color: colors.muted, fontSize: r.fontSize.base, fontWeight: "600" }}>
                Clear Override (Use Global Settings)
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </Modal>
  );
}
