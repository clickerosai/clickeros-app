import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  Platform,
  Alert,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useResponsive } from "@/hooks/use-responsive";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useToast } from "@/components/toast";
import {
  getStoredNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  clearAllNotifications,
  addNotification,
  type AppNotification,
  NOTIFICATION_ICONS,
  NOTIFICATION_COLORS,
} from "@/lib/notifications";

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function NotificationItem({
  item,
  onPress,
}: {
  item: AppNotification;
  onPress: (id: string) => void;
}) {
  const colors = useColors();
  const r = useResponsive();
  const icon = NOTIFICATION_ICONS[item.type] ?? "ℹ️";
  const color = NOTIFICATION_COLORS[item.type] ?? "#6B7280";

  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
        padding: r.isXs ? 14 : 16,
        backgroundColor: item.read ? colors.background : `${color}08`,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
      onPress={() => onPress(item.id)}
      activeOpacity={0.7}
    >
      {/* Icon */}
      <View
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          backgroundColor: `${color}15`,
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginTop: 1,
        }}
      >
        <Text style={{ fontSize: 20 }}>{icon}</Text>
      </View>

      {/* Content */}
      <View style={{ flex: 1, minWidth: 0 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 3 }}>
          <Text
            style={{
              color: colors.foreground,
              fontSize: r.fontSize.base,
              fontWeight: item.read ? "500" : "700",
              flex: 1,
            }}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          {!item.read && (
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: color,
                flexShrink: 0,
              }}
            />
          )}
        </View>
        <Text
          style={{
            color: colors.muted,
            fontSize: r.fontSize.sm,
            lineHeight: 20,
          }}
          numberOfLines={2}
        >
          {item.body}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 5 }}>
          {item.campaignName && (
            <>
              <View
                style={{
                  backgroundColor: `${color}15`,
                  borderRadius: 4,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                }}
              >
                <Text style={{ color, fontSize: 10, fontWeight: "600" }}>
                  {item.campaignName}
                </Text>
              </View>
              <Text style={{ color: colors.border }}>·</Text>
            </>
          )}
          <Text style={{ color: colors.muted, fontSize: r.fontSize.xs }}>
            {timeAgo(item.createdAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function NotificationsScreen() {
  const router = useRouter();
  const colors = useColors();
  const r = useResponsive();
  const { showToast } = useToast();

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const loadNotifications = useCallback(async () => {
    const stored = await getStoredNotifications();
    setNotifications(stored);
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const onRefresh = useCallback(async () => {
    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setIsRefreshing(true);
    await loadNotifications();
    setIsRefreshing(false);
  }, [loadNotifications]);

  const handleNotificationPress = useCallback(
    async (id: string) => {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    },
    []
  );

  const handleMarkAllRead = useCallback(async () => {
    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    await markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast({
      type: "success",
      message: "All notifications marked as read",
      duration: 2500,
    });
  }, [showToast]);

  const handleClearAll = useCallback(() => {
    Alert.alert(
      "Clear All Notifications",
      "This will permanently delete all notifications. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            await clearAllNotifications();
            setNotifications([]);
            showToast({
              type: "info",
              message: "All notifications cleared",
              duration: 2500,
            });
          },
        },
      ]
    );
  }, [showToast]);

  // Add sample notifications for demo purposes
  const handleAddSampleNotifications = useCallback(async () => {
    const samples = [
      {
        type: "roas_drop" as const,
        title: "⚠️ ROAS Drop — Summer Sale Facebook",
        body: "ROAS fell to 1.8x (below 2.0x threshold). Consider pausing or optimizing.",
        campaignId: "camp-1",
        campaignName: "Summer Sale — Facebook",
        data: { roas: 1.8, threshold: 2.0 } as Record<string, string | number>,
      },
      {
        type: "budget_exhausted" as const,
        title: "💸 Budget Alert — Google Search Q2",
        body: "92% of daily budget spent ($46 of $50). Campaign may stop soon.",
        campaignId: "camp-3",
        campaignName: "Google Search Q2",
        data: { spendPercent: 92, spend: 46, budget: 50 } as Record<string, string | number>,
      },
      {
        type: "optimization" as const,
        title: "✅ Optimization Applied — TikTok Brand",
        body: "ROAS improved by 0.8x. Budget reallocated for better performance.",
        campaignId: "camp-4",
        campaignName: "TikTok Brand Awareness",
      },
      {
        type: "achievement" as const,
        title: "🏆 Milestone Reached!",
        body: "Your campaigns have generated $50,000 in total revenue. Keep it up!",
      },
      {
        type: "system" as const,
        title: "ℹ️ New Feature Available",
        body: "AI Smart Scaling is now available for your Pro plan. Enable it in Campaign Settings.",
      },
    ];

    for (const sample of samples) {
      await addNotification(sample);
    }
    await loadNotifications();
    showToast({
      type: "success",
      message: "Sample notifications added",
      duration: 2000,
    });
  }, [loadNotifications, showToast]);

  return (
    <ScreenContainer>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: r.px,
          paddingTop: 16,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12, minHeight: 44 }}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <IconSymbol name="chevron.left" size={18} color={colors.muted} />
          <Text style={{ color: colors.muted, fontSize: r.fontSize.base }}>Back</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View>
            <Text style={{ color: colors.foreground, fontSize: r.fontSize["2xl"], fontWeight: "700" }}>
              Notifications
            </Text>
            <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, marginTop: 2 }}>
              {unreadCount > 0
                ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                : "All caught up ✅"}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={{ flexDirection: "row", gap: 8 }}>
            {unreadCount > 0 && (
              <TouchableOpacity
                style={{
                  backgroundColor: "#7C3AED15",
                  borderRadius: 8,
                  paddingHorizontal: 10,
                  height: 36,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={handleMarkAllRead}
                activeOpacity={0.7}
              >
                <Text style={{ color: "#7C3AED", fontSize: r.fontSize.xs, fontWeight: "600" }}>
                  Mark all read
                </Text>
              </TouchableOpacity>
            )}
            {notifications.length > 0 && (
              <TouchableOpacity
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 8,
                  paddingHorizontal: 10,
                  height: 36,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
                onPress={handleClearAll}
                activeOpacity={0.7}
              >
                <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, fontWeight: "600" }}>
                  Clear all
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
          {["All", "Alerts", "Optimizations", "System"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={{
                paddingHorizontal: 12,
                height: 32,
                borderRadius: 8,
                backgroundColor: tab === "All" ? "#7C3AED" : colors.surface,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: tab === "All" ? 0 : 1,
                borderColor: colors.border,
              }}
              activeOpacity={0.7}
            >
              <Text
                style={{
                  color: tab === "All" ? "#FFFFFF" : colors.muted,
                  fontSize: r.fontSize.xs,
                  fontWeight: "600",
                }}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Notification List */}
      {notifications.length === 0 ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 32 }}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>🔔</Text>
          <Text style={{ color: colors.foreground, fontSize: r.fontSize.xl, fontWeight: "700", textAlign: "center", marginBottom: 8 }}>
            No notifications yet
          </Text>
          <Text style={{ color: colors.muted, fontSize: r.fontSize.base, textAlign: "center", lineHeight: 22, marginBottom: 24, maxWidth: 280 }}>
            Campaign alerts, optimization results, and system messages will appear here.
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: "#7C3AED15",
              borderRadius: 12,
              paddingHorizontal: 20,
              height: 44,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={handleAddSampleNotifications}
            activeOpacity={0.7}
          >
            <Text style={{ color: "#7C3AED", fontSize: r.fontSize.base, fontWeight: "600" }}>
              Load sample notifications
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor="#7C3AED"
              colors={["#7C3AED"]}
            />
          }
          renderItem={({ item }) => (
            <NotificationItem item={item} onPress={handleNotificationPress} />
          )}
          ListFooterComponent={
            <View style={{ padding: 20, alignItems: "center" }}>
              <Text style={{ color: colors.muted, fontSize: r.fontSize.xs }}>
                {notifications.length} notification{notifications.length !== 1 ? "s" : ""} · Last 30 days
              </Text>
            </View>
          }
        />
      )}
    </ScreenContainer>
  );
}
