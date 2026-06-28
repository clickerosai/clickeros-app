import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform, useWindowDimensions } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  // Adjust bottom padding for tablets/larger screens
  const isTablet = width >= 768; // Assuming 768px as a common tablet breakpoint
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, isTablet ? 12 : 8);
  const tabBarHeight = 56 + bottomPadding;

  return (
    <ScreenContainer edges={["top", "left", "right"]} bottomOffset={tabBarHeight}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            paddingTop: 8,
            paddingBottom: bottomPadding,
            height: tabBarHeight,
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            borderTopWidth: 0.5,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
      </Tabs>
    </ScreenContainer>
  );
}
