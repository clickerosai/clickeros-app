import { useState, useEffect, useCallback } from "react";

const STALE_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Tracks whether data for a given key is stale (older than 5 minutes).
 * Used to show a dot badge on tab bar icons when data needs refreshing.
 *
 * Usage:
 *   const { isStale, markFresh } = useStaleData("dashboard");
 *
 * - Call `markFresh()` after a successful data refresh.
 * - `isStale` becomes true after STALE_THRESHOLD_MS without a refresh.
 */
export function useStaleData(key: string) {
  const [lastFreshAt, setLastFreshAt] = useState<number>(Date.now());
  const [isStale, setIsStale] = useState(false);

  const markFresh = useCallback(() => {
    setLastFreshAt(Date.now());
    setIsStale(false);
  }, []);

  useEffect(() => {
    // Check immediately
    const check = () => {
      const age = Date.now() - lastFreshAt;
      setIsStale(age > STALE_THRESHOLD_MS);
    };

    check();

    // Re-check every 30 seconds
    const interval = setInterval(check, 30_000);
    return () => clearInterval(interval);
  }, [lastFreshAt]);

  return { isStale, markFresh, lastFreshAt };
}

/**
 * Global stale-data store using a simple event emitter pattern.
 * Allows tab bar to subscribe to stale state without prop drilling.
 */
type Listener = (key: string, isStale: boolean) => void;
const listeners: Set<Listener> = new Set();
const staleMap: Map<string, boolean> = new Map();

export const StaleDataStore = {
  setStale(key: string, isStale: boolean) {
    staleMap.set(key, isStale);
    listeners.forEach((l) => l(key, isStale));
  },
  isStale(key: string): boolean {
    return staleMap.get(key) ?? false;
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

/**
 * Hook for components that need to read and react to global stale state.
 */
export function useGlobalStaleData(key: string) {
  const [isStale, setIsStale] = useState(() => StaleDataStore.isStale(key));

  useEffect(() => {
    const unsubscribe = StaleDataStore.subscribe((k, stale) => {
      if (k === key) setIsStale(stale);
    });
    return () => { unsubscribe(); };
  }, [key]);

  const markFresh = useCallback(() => {
    StaleDataStore.setStale(key, false);
  }, [key]);

  const markStale = useCallback(() => {
    StaleDataStore.setStale(key, true);
  }, [key]);

  return { isStale, markFresh, markStale };
}
