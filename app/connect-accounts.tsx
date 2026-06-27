import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useState, useCallback } from "react";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useResponsive } from "@/hooks/use-responsive";
import { IconSymbol } from "@/components/ui/icon-symbol";

type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

interface Platform_ {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  features: string[];
  required: boolean;
}

const PLATFORMS: Platform_[] = [
  {
    id: "facebook",
    name: "Facebook & Instagram",
    icon: "👥",
    color: "#1877F2",
    description: "Run ads on Facebook and Instagram, sync audiences and pixel data",
    features: ["Ad campaigns", "Audience sync", "Pixel tracking", "Instagram ads"],
    required: true,
  },
  {
    id: "google",
    name: "Google Ads",
    icon: "🔍",
    color: "#4285F4",
    description: "Manage Google Search, Display, and YouTube campaigns",
    features: ["Search ads", "Display network", "YouTube ads", "Conversion tracking"],
    required: true,
  },
  {
    id: "tiktok",
    name: "TikTok Ads",
    icon: "🎵",
    color: "#010101",
    description: "Create and manage TikTok campaigns with trend-style creatives",
    features: ["In-feed ads", "Spark ads", "TikTok pixel", "Creative library"],
    required: false,
  },
  {
    id: "linkedin",
    name: "LinkedIn Ads",
    icon: "💼",
    color: "#0077B5",
    description: "B2B advertising with professional audience targeting",
    features: ["Sponsored content", "Lead gen forms", "Company targeting", "Job title targeting"],
    required: false,
  },
  {
    id: "pinterest",
    name: "Pinterest Ads",
    icon: "📌",
    color: "#E60023",
    description: "Visual discovery ads for lifestyle and e-commerce brands",
    features: ["Shopping ads", "Promoted pins", "Audience insights", "Catalog sync"],
    required: false,
  },
  {
    id: "analytics",
    name: "Google Analytics",
    icon: "📈",
    color: "#F9AB00",
    description: "Track website traffic, conversions, and revenue attribution",
    features: ["Traffic tracking", "Goal conversions", "Revenue attribution", "Audience data"],
    required: false,
  },
];

export default function ConnectAccountsScreen() {
  const router = useRouter();
  const colors = useColors();
  const r = useResponsive();

  const [connections, setConnections] = useState<Record<string, ConnectionStatus>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [footerHeight, setFooterHeight] = useState(0);

  const connectedCount = Object.values(connections).filter((s) => s === "connected").length;
  const requiredConnected = PLATFORMS.filter((p) => p.required).every(
    (p) => connections[p.id] === "connected"
  );

  const handleConnect = useCallback(async (platformId: string) => {
    if (connections[platformId] === "connected") {
      Alert.alert(
        "Disconnect Account",
        `Are you sure you want to disconnect this platform?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Disconnect",
            style: "destructive",
            onPress: () => setConnections((prev) => ({ ...prev, [platformId]: "disconnected" })),
          },
        ]
      );
      return;
    }

    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    setConnections((prev) => ({ ...prev, [platformId]: "connecting" }));

    // Simulate OAuth connection flow
    setTimeout(() => {
      setConnections((prev) => ({ ...prev, [platformId]: "connected" }));
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }, 1800);
  }, [connections]);

  const handleContinue = useCallback(() => {
    if (!requiredConnected && connectedCount === 0) {
      Alert.alert(
        "Connect at Least One Platform",
        "Please connect at least one ad platform to create campaigns. You can always add more later.",
        [
          { text: "Skip for Now", onPress: () => router.push("/create-campaign" as any) },
          { text: "Connect Now", style: "cancel" },
        ]
      );
      return;
    }
    router.push("/create-campaign" as any);
  }, [requiredConnected, connectedCount, router]);

  const getStatusColor = (status: ConnectionStatus) => {
    switch (status) {
      case "connected": return "#22C55E";
      case "connecting": return "#F59E0B";
      case "error": return "#EF4444";
      default: return colors.muted;
    }
  };

  const getStatusLabel = (status: ConnectionStatus) => {
    switch (status) {
      case "connected": return "Connected";
      case "connecting": return "Connecting…";
      case "error": return "Failed";
      default: return "Not Connected";
    }
  };

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: footerHeight + 20 }}>
        {/* Header */}
        <View style={{ paddingHorizontal: r.px, paddingTop: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 14, minHeight: 44 }}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <IconSymbol name="chevron.left" size={18} color={colors.muted} />
            <Text style={{ color: colors.muted, fontSize: r.fontSize.base }}>Back</Text>
          </TouchableOpacity>

          {/* Step indicator */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
            {["Sign Up", "Connect", "Campaign", "Generate", "Launch"].map((step, idx) => (
              <View key={step} style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{
                  width: 24, height: 24, borderRadius: 12,
                  backgroundColor: idx === 1 ? "#7C3AED" : idx < 1 ? "#22C55E" : colors.surface,
                  alignItems: "center", justifyContent: "center",
                  borderWidth: idx > 1 ? 1 : 0, borderColor: colors.border,
                }}>
                  {idx < 1 ? (
                    <IconSymbol name="checkmark" size={12} color="#FFFFFF" />
                  ) : (
                    <Text style={{ color: idx === 1 ? "#FFFFFF" : colors.muted, fontSize: 10, fontWeight: "700" }}>{idx + 1}</Text>
                  )}
                </View>
                {idx < 4 && <View style={{ width: 16, height: 1, backgroundColor: idx < 1 ? "#22C55E" : colors.border, marginHorizontal: 2 }} />}
              </View>
            ))}
          </View>

          <Text style={{ color: colors.foreground, fontSize: r.fontSize["2xl"], fontWeight: "700", marginBottom: 4 }}>
            Connect Your Accounts
          </Text>
          <Text style={{ color: colors.muted, fontSize: r.fontSize.base }}>
            Link your ad platforms to start creating campaigns.{" "}
            <Text style={{ color: "#7C3AED", fontWeight: "600" }}>{connectedCount} of {PLATFORMS.length} connected</Text>
          </Text>
        </View>

        {/* Platform Cards */}
        <View style={{ paddingHorizontal: r.px, marginTop: 16, gap: 12 }}>
          {PLATFORMS.map((platform) => {
            const status = connections[platform.id] ?? "disconnected";
            const isConnected = status === "connected";
            const isConnecting = status === "connecting";
            const isExpanded = expandedId === platform.id;

            return (
              <View
                key={platform.id}
                style={{
                  backgroundColor: colors.background,
                  borderRadius: 16, borderWidth: 1,
                  borderColor: isConnected ? `${platform.color}40` : colors.border,
                  overflow: "hidden",
                }}
              >
                <TouchableOpacity
                  style={{ padding: r.isXs ? 14 : 16, flexDirection: "row", alignItems: "center", gap: 12 }}
                  onPress={() => setExpandedId(isExpanded ? null : platform.id)}
                  activeOpacity={0.7}
                >
                  {/* Icon */}
                  <View style={{
                    width: 44, height: 44, borderRadius: 12,
                    backgroundColor: `${platform.color}15`,
                    alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <Text style={{ fontSize: 22 }}>{platform.icon}</Text>
                  </View>

                  {/* Info */}
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      <Text style={{ color: colors.foreground, fontSize: r.fontSize.base, fontWeight: "600" }} numberOfLines={1}>
                        {platform.name}
                      </Text>
                      {platform.required && (
                        <View style={{ backgroundColor: "#FEF9C3", borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2 }}>
                          <Text style={{ color: "#D97706", fontSize: 9, fontWeight: "700" }}>RECOMMENDED</Text>
                        </View>
                      )}
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 2 }}>
                      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: getStatusColor(status) }} />
                      <Text style={{ color: getStatusColor(status), fontSize: r.fontSize.xs, fontWeight: "500" }}>
                        {getStatusLabel(status)}
                      </Text>
                    </View>
                  </View>

                  {/* Connect Button */}
                  <TouchableOpacity
                    style={{
                      backgroundColor: isConnected ? "#DCFCE7" : isConnecting ? colors.surface : "#7C3AED",
                      borderRadius: 10, paddingHorizontal: 14, height: 40,
                      alignItems: "center", justifyContent: "center",
                      flexDirection: "row", gap: 6, flexShrink: 0,
                      minWidth: 90,
                    }}
                    onPress={() => handleConnect(platform.id)}
                    activeOpacity={0.8}
                    disabled={isConnecting}
                  >
                    {isConnecting ? (
                      <ActivityIndicator size="small" color={colors.muted} />
                    ) : isConnected ? (
                      <>
                        <IconSymbol name="checkmark" size={14} color="#16A34A" />
                        <Text style={{ color: "#16A34A", fontSize: r.fontSize.sm, fontWeight: "600" }}>Connected</Text>
                      </>
                    ) : (
                      <Text style={{ color: "#FFFFFF", fontSize: r.fontSize.sm, fontWeight: "600" }}>Connect</Text>
                    )}
                  </TouchableOpacity>
                </TouchableOpacity>

                {/* Expanded Features */}
                {isExpanded && (
                  <View style={{ paddingHorizontal: r.isXs ? 14 : 16, paddingBottom: 14, borderTopWidth: 1, borderTopColor: colors.border }}>
                    <Text style={{ color: colors.muted, fontSize: r.fontSize.sm, lineHeight: 20, marginTop: 10, marginBottom: 10 }}>
                      {platform.description}
                    </Text>
                    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                      {platform.features.map((feature) => (
                        <View key={feature} style={{ backgroundColor: `${platform.color}10`, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: `${platform.color}20` }}>
                          <Text style={{ color: platform.color, fontSize: r.fontSize.xs, fontWeight: "500" }}>{feature}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Fixed Bottom CTA */}
      <View
        onLayout={(event) => setFooterHeight(event.nativeEvent.layout.height)}
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
        backgroundColor: colors.background,
        paddingHorizontal: r.px, paddingTop: 12, paddingBottom: Platform.OS === "ios" ? 32 : 16,
        borderTopWidth: 1, borderTopColor: colors.border,
      }}>
        {connectedCount > 0 && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 10, justifyContent: "center" }}>
            <IconSymbol name="checkmark.circle.fill" size={14} color="#22C55E" />
            <Text style={{ color: "#22C55E", fontSize: r.fontSize.xs, fontWeight: "600" }}>
              {connectedCount} platform{connectedCount > 1 ? "s" : ""} connected
            </Text>
          </View>
        )}
        <TouchableOpacity
          style={{ backgroundColor: "#7C3AED", borderRadius: 14, height: 56, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 }}
          onPress={handleContinue}
          activeOpacity={0.85}
        >
          <Text style={{ color: "#FFFFFF", fontSize: r.fontSize.lg, fontWeight: "700" }}>
            {connectedCount === 0 ? "Skip for Now" : "Continue to Campaign"}
          </Text>
          <IconSymbol name="chevron.right" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}
