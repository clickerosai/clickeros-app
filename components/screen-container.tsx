import { View, type ViewProps, Platform } from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";
import { useWindowDimensions } from "react-native";
import { cn } from "@/lib/utils";

export interface ScreenContainerProps extends ViewProps {
  /**
   * SafeArea edges to apply. Defaults to ["top", "left", "right"].
   * Bottom is typically handled by Tab Bar.
   */
  edges?: Edge[];
  /**
   * Tailwind className for the content area.
   */
  className?: string;
  /**
   * Additional className for the outer container (background layer).
   */
  containerClassName?: string;
  /**
   * Additional className for the SafeAreaView (content layer).
   */
  safeAreaClassName?: string;
  /**
   * When true, constrains content to a max-width on large screens (web/tablet/desktop).
   * Defaults to false for full-bleed mobile layouts.
   */
  constrained?: boolean;
}

/**
 * A container component that properly handles SafeArea, background colors,
 * and responsive layout across all device sizes.
 *
 * - On phones: full-width, edge-to-edge
 * - On tablets/desktop: optionally constrained to max-width with centered content
 * - Always handles safe area insets correctly
 * - Prevents content from going behind status bar or home indicator
 */
export function ScreenContainer({
  children,
  edges = ["top", "left", "right"],
  className,
  containerClassName,
  safeAreaClassName,
  constrained = false,
  style,
  ...props
}: ScreenContainerProps) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768 && width < 1024;
  const isLargeScreen = width >= 768;
  const isWeb = Platform.OS === "web";
  const maxWidth = isWeb && width >= 1024 ? 1200 : "100%";

  return (
    <View
      className={cn("flex-1 bg-background", containerClassName)}
      {...props}
    >
      <SafeAreaView
        edges={edges}
        className={cn("flex-1", safeAreaClassName)}
        style={style}
      >
        {constrained && (isLargeScreen || isWeb) ? (
          // On large screens, center content with responsive max-width
          <View
            style={{
              flex: 1,
              maxWidth: maxWidth,
              width: "100%",
              alignSelf: "center",
              paddingHorizontal: isTablet ? 24 : 0,
            }}
          >
            <View className={cn("flex-1", className)}>{children}</View>
          </View>
        ) : (
          <View className={cn("flex-1", className)}>{children}</View>
        )}
      </SafeAreaView>
    </View>
  );
}
