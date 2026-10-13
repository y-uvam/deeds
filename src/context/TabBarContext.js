import React, { createContext, useContext } from "react";
import { useSharedValue } from "react-native-reanimated";
import { useAnimatedScrollHandler, withTiming, Easing } from "react-native-reanimated";

const TabBarContext = createContext(null);

export const TabBarProvider = ({ children }) => {
  const lastScrollY = useSharedValue(0);
  const isCollapsed = useSharedValue(0);

  return (
    <TabBarContext.Provider value={{ lastScrollY, isCollapsed }}>
      {children}
    </TabBarContext.Provider>
  );
};

export const useTabBar = () => {
  const ctx = useContext(TabBarContext);
  if (!ctx) throw new Error("useTabBar must be used inside TabBarProvider");
  return ctx;
};

// Hook every scrollable screen uses to drive the collapse animation
export const useTabBarScrollHandler = () => {
  const { lastScrollY, isCollapsed } = useTabBar();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const y = event.contentOffset.y;
      const diff = y - lastScrollY.value;

      // Collapse after just 12px of downward scroll
      if (diff > 12 && y > 20) {
        isCollapsed.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.quad) });
      } else if (diff < -8 || y < 10) {
        isCollapsed.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.quad) });
      }

      lastScrollY.value = y;
    },
  });

  return scrollHandler;
};
