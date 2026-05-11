import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform, useWindowDimensions } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  // Responsive bottom padding — respect safe area on notched devices
  const bottomPadding = Platform.OS === "web"
    ? 12
    : Math.max(insets.bottom, 8);

  // Slightly taller tab bar on large screens
  const tabBarHeight = width >= 768 ? 64 + bottomPadding : 56 + bottomPadding;

  // Responsive icon size
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
          // Prevent tab bar from causing layout overflow
          overflow: "hidden",
        },
        tabBarLabelStyle: {
          fontSize: width >= 768 ? 12 : 11,
          fontWeight: "500",
          marginTop: 2,
        },
        // Ensure tab bar items have minimum 44px touch area
        tabBarItemStyle: {
          minHeight: 44,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => <IconSymbol size={iconSize} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="campaigns"
        options={{
          title: "Campaigns",
          tabBarIcon: ({ color }) => <IconSymbol size={iconSize} name="megaphone.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="creator"
        options={{
          title: "AI Creator",
          tabBarIcon: ({ color }) => <IconSymbol size={iconSize} name="wand.and.stars" color={color} />,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: "Analytics",
          tabBarIcon: ({ color }) => <IconSymbol size={iconSize} name="chart.bar.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "More",
          tabBarIcon: ({ color }) => <IconSymbol size={iconSize} name="ellipsis.circle.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
