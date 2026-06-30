import { View, Text, TouchableOpacity, ViewProps } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { useResponsive } from "@/hooks/use-responsive";
import { IconSymbol } from "@/components/ui/icon-symbol";

export interface ScreenHeaderProps extends ViewProps {
  title: string;
  subtitle?: string;
  rightAction?: {
    icon: string;
    onPress: () => void;
    label?: string;
  };
  showStatus?: boolean;
  statusText?: string;
  isLoading?: boolean;
  isRefreshing?: boolean;
}

export function ScreenHeader({
  title,
  subtitle,
  rightAction,
  showStatus = false,
  statusText,
  isLoading = false,
  isRefreshing = false,
  style,
  ...props
}: ScreenHeaderProps) {
  const colors = useColors();
  const r = useResponsive();

  return (
    <View
      style={[
        {
          paddingHorizontal: r.px,
          paddingTop: r.isXs ? 10 : 12,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        style,
      ]}
      {...props}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        {/* Left: Title and Subtitle */}
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text
            style={{
              color: colors.foreground,
              fontSize: r.isXs ? r.fontSize.lg : r.fontSize.xl,
              fontWeight: "700",
            }}
            numberOfLines={1}
          >
            {title}
          </Text>

          {/* Subtitle or Status */}
          {(subtitle || showStatus) && (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 3 }}>
              {isLoading ? (
                <View
                  style={{
                    width: 11,
                    height: 11,
                    borderRadius: 5.5,
                    backgroundColor: colors.muted,
                    opacity: 0.5,
                  }}
                />
              ) : (
                <IconSymbol
                  name={isRefreshing ? "arrow.triangle.2.circlepath" : "checkmark.circle.fill"}
                  size={11}
                  color={isRefreshing ? colors.muted : "#22C55E"}
                />
              )}
              <Text
                style={{
                  color: colors.muted,
                  fontSize: r.fontSize.xs,
                }}
                numberOfLines={1}
              >
                {statusText || subtitle}
              </Text>
            </View>
          )}
        </View>

        {/* Right: Action Button */}
        {rightAction && (
          <TouchableOpacity
            style={{
              backgroundColor: "#7C3AED",
              borderRadius: 10,
              paddingHorizontal: 14,
              height: 44,
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              flexShrink: 0,
            }}
            onPress={rightAction.onPress}
            activeOpacity={0.8}
          >
            <IconSymbol
              name={rightAction.icon as any}
              size={18}
              color="#FFFFFF"
            />
            {rightAction.label && (
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: r.fontSize.sm,
                  fontWeight: "600",
                }}
                numberOfLines={1}
              >
                {rightAction.label}
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
