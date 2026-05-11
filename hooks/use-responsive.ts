import { useWindowDimensions, Platform } from "react-native";
import { useMemo } from "react";

export type BreakpointKey = "xs" | "sm" | "md" | "lg" | "xl";

const BREAKPOINTS = {
  xs: 0,    // < 480px  — small phones
  sm: 480,  // 480–767px — large phones
  md: 768,  // 768–1023px — tablets
  lg: 1024, // 1024–1279px — laptops
  xl: 1280, // 1280px+ — desktop / ultrawide
} as const;

export function useResponsive() {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    const isXs = width < BREAKPOINTS.sm;
    const isSm = width >= BREAKPOINTS.sm && width < BREAKPOINTS.md;
    const isMd = width >= BREAKPOINTS.md && width < BREAKPOINTS.lg;
    const isLg = width >= BREAKPOINTS.lg && width < BREAKPOINTS.xl;
    const isXl = width >= BREAKPOINTS.xl;

    const isPhone = isXs || isSm;
    const isTablet = isMd;
    const isDesktop = isLg || isXl;
    const isWeb = Platform.OS === "web";

    // Responsive column count
    const cols = isXs ? 1 : isSm ? 2 : isMd ? 2 : isLg ? 3 : 4;

    // Responsive padding
    const px = isXs ? 12 : isSm ? 16 : isMd ? 20 : 24;
    const py = isXs ? 12 : 16;

    // Responsive font sizes
    const fontSize = {
      xs: isXs ? 10 : 11,
      sm: isXs ? 11 : 12,
      base: isXs ? 13 : 14,
      md: isXs ? 14 : 15,
      lg: isXs ? 15 : 16,
      xl: isXs ? 17 : 18,
      "2xl": isXs ? 19 : 20,
      "3xl": isXs ? 21 : 24,
      "4xl": isXs ? 24 : 28,
    };

    // Responsive card width for grid layouts
    const cardWidth = isXs
      ? width - px * 2
      : isSm
      ? (width - px * 2 - 10) / 2
      : isMd
      ? (width - px * 2 - 10) / 2
      : (width - px * 2 - 20) / 3;

    // Stat card width (2-column grid on phones, 4 on tablets+)
    const statCardWidth = isPhone
      ? (width - px * 2 - 10) / 2
      : (width - px * 2 - 30) / 4;

    // Touch target minimum
    const touchMin = 44;

    // Content max width (for web / large screens)
    const contentMaxWidth = isDesktop ? 860 : "100%";

    return {
      width,
      height,
      isXs,
      isSm,
      isMd,
      isLg,
      isXl,
      isPhone,
      isTablet,
      isDesktop,
      isWeb,
      cols,
      px,
      py,
      fontSize,
      cardWidth,
      statCardWidth,
      touchMin,
      contentMaxWidth,
      breakpoint: isXs ? "xs" : isSm ? "sm" : isMd ? "md" : isLg ? "lg" : "xl" as BreakpointKey,
    };
  }, [width, height]);
}
