import React, { useState, useEffect, memo, useCallback, forwardRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
  withRepeat,
  withSequence,
} from "react-native-reanimated";
import { colors, scales } from "../../utils";
import { fontFamily } from "../../assets";
import { CustomBottomSheet } from "../customBottomSheet/customBottomSheet";

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const FilterPill = memo(({ label, isActive, onPress }) => {
  const progress = useSharedValue(isActive ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isActive ? 1 : 0, { duration: 300 });
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [colors.transparentWhite10, colors.white]
    ),
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      [colors.transparentWhite15, colors.white]
    ),
  }));

  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      progress.value,
      [0, 1],
      [colors.white, colors.black]
    ),
  }));

  return (
    <AnimatedTouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.pill, animatedStyle]}
    >
      <Animated.Text style={[styles.pillText, textStyle]}>
        {label}
      </Animated.Text>
    </AnimatedTouchableOpacity>
  );
});

const SkeletonPill = () => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 800 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.skeletonPill, animatedStyle]} />;
};

export const Filter = memo(
  forwardRef(({ onFilterChange, isLoading = false }, ref) => {
    const [activeContent, setActiveContent] = useState("Bites");
    const [activeGenre, setActiveGenre] = useState("All");
    const [activeSort, setActiveSort] = useState("Newest");

    const contentTypes = ["Bites", "Slates", "Projects"];
    const genres = ["All", "Drama", "Horror", "Experimental", "Comedy", "Action"];
    const sortOptions = ["Newest", "For You"];

    const handleApply = useCallback(() => {
      if (onFilterChange) {
        onFilterChange({
          content: activeContent,
          genre: activeGenre,
          sort: activeSort,
        });
      }
      ref?.current?.dismiss();
    }, [activeContent, activeGenre, activeSort, onFilterChange, ref]);

    const renderSkeleton = () => (
      <View style={styles.content}>
        {[1, 2, 3].map((sectionIndex) => (
          <View key={`skeleton-section-${sectionIndex}`} style={styles.sectionContainer}>
            <Animated.View style={[styles.skeletonLabel, { opacity: 0.5 }]} />
            <View style={styles.pillGroup}>
              {[1, 2, 3, 4].map((pillIndex) => (
                <SkeletonPill key={`skeleton-pill-${sectionIndex}-${pillIndex}`} />
              ))}
            </View>
          </View>
        ))}
      </View>
    );

    const renderContent = () => (
      <View style={styles.content}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>CONTENT TYPE</Text>
          <View style={styles.pillGroup}>
            {contentTypes.map((item) => (
              <FilterPill
                key={`content-${item}`}
                label={item}
                isActive={activeContent === item}
                onPress={() => setActiveContent(item)}
              />
            ))}
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>GENRE</Text>
          <View style={styles.pillGroup}>
            {genres.map((item) => (
              <FilterPill
                key={`genre-${item}`}
                label={item}
                isActive={activeGenre === item}
                onPress={() => setActiveGenre(item)}
              />
            ))}
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>SORT BY</Text>
          <View style={styles.pillGroup}>
            {sortOptions.map((item) => (
              <FilterPill
                key={`sort-${item}`}
                label={item}
                isActive={activeSort === item}
                onPress={() => setActiveSort(item)}
              />
            ))}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
            <Text style={styles.applyBtnText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    );

    return (
      <CustomBottomSheet
        ref={ref}
        title="Filters"
        snapPoints={["60%"]}
        enablePanDownToClose={true}
        useBlur={true}
      >
        {isLoading ? renderSkeleton() : renderContent()}
      </CustomBottomSheet>
    );
  })
);

const styles = StyleSheet.create({
  content: {
    paddingBottom: scales(20),
  },
  sectionContainer: {
    marginBottom: scales(24),
  },
  sectionLabel: {
    fontFamily: fontFamily.bold,
    fontSize: scales(12),
    color: colors.transparentWhite85,
    letterSpacing: 1.5,
    marginBottom: scales(12),
  },
  pillGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: scales(10),
  },
  pill: {
    paddingHorizontal: scales(18),
    paddingVertical: scales(10),
    borderRadius: scales(24),
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: "center",
    alignItems: "center",
  },
  pillText: {
    fontFamily: fontFamily.semiBold,
    fontSize: scales(13),
    letterSpacing: 0.5,
  },
  skeletonPill: {
    width: scales(80),
    height: scales(36),
    borderRadius: scales(24),
    backgroundColor: colors.transparentWhite15,
  },
  skeletonLabel: {
    width: scales(100),
    height: scales(14),
    borderRadius: scales(4),
    backgroundColor: colors.transparentWhite15,
    marginBottom: scales(12),
  },
  buttonContainer: {
    marginTop: scales(10),
  },
  applyBtn: {
    width: "100%",
    backgroundColor: colors.white,
    paddingVertical: scales(16),
    borderRadius: scales(30),
    alignItems: "center",
  },
  applyBtnText: {
    color: colors.black,
    fontFamily: fontFamily.bold,
    fontSize: scales(16),
  },
});

export default Filter;
