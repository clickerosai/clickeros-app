import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform, View, useWindowDimensions } from "react-native";
import { useEffect, useState } from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { StaleDataStore } from "@/hooks/use-stale-data";

/**
 * A small dot badge shown on a tab icon when data is stale (>5 min old).
 * Positioned at the top-right of the icon.
 */
function StaleDot({ color }: { color: string }) {
  return (
    <View
      style={{
        position: "absolute",
        top: -2,
        right: -4,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#F59E0B",
        borderWidth: 1.5,
        borderColor: color,
      }}
    />
  );
}

/**
 * Tab icon wrapper that optionally shows a stale-data dot.
 */
function TabIcon({
  iconName,
  color,
  size,
  staleKey,
  bgColor,
}: {
  iconName: Parameters<typeof IconSymbol>[0]["name"];
  color: string;
  size: number;
  staleKey?: string;
  bgColor: string;
}) {
  const [isStale, setIsStale] = useState(false);

  useEffect(() => {
    if (!staleKey) return;
    // Seed initial stale state
    setIsStale(StaleDataStore.isStale(staleKey));
    // Subscribe to updates
    const unsub = StaleDataStore.subscribe((k, stale) => {
      if (k === staleKey) setIsStale(stale);
    });
    return () => { unsub(); };
  }, [staleKey]);

  return (
    <View style={{ position: "relative", alignItems: "center", justifyContent: "center" }}>
      <IconSymbol size={size} name={iconName} color={color} />
      {staleKey && isStale && <StaleDot color={bgColor} />}
    </View>
  );
}

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const bottomPadding = Platform.OS === "web"
    ? 12
    : Math.max(insets.bottom, 8);

  const tabBarHeight = width >= 768 ? 64 + bottomPadding : 56 + bottomPadding;
  const iconSize = width >= 768 ? 26 : 24;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          paddingTop: 8,
          paddingBottom: bottomPadding,
          height: tabBarHeight,
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
          overflow: "hidden",
        },
        tabBarLabelStyle: {
          fontSize: width >= 768 ? 12 : 11,
          fontWeight: "500",
          marginTop: 2,
        },
        tabBarItemStyle: {
          minHeight: 44,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <TabIcon
              iconName="house.fill"
              color={color}
              size={iconSize}
              staleKey="dashboard"
              bgColor={colors.background}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="campaigns"
        options={{
          title: "Campaigns",
          tabBarIcon: ({ color }) => (
            <TabIcon
              iconName="megaphone.fill"
              color={color}
              size={iconSize}
              staleKey="campaigns"
              bgColor={colors.background}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="creator"
        options={{
          title: "AI Creator",
          tabBarIcon: ({ color }) => (
            <TabIcon
              iconName="wand.and.stars"
              color={color}
              size={iconSize}
              bgColor={colors.background}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: "Analytics",
          tabBarIcon: ({ color }) => (
            <TabIcon
              iconName="chart.bar.fill"
              color={color}
              size={iconSize}
              bgColor={colors.background}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "More",
          tabBarIcon: ({ color }) => (
            <TabIcon
              iconName="ellipsis.circle.fill"
              color={color}
              size={iconSize}
              bgColor={colors.background}
            />
          ),
        }}
      />
    </Tabs>
  );
}
