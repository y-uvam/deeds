import React, { useState, memo, useCallback, forwardRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { colors, scales } from "../../utils";
import { fontFamily } from "../../assets";
import { CustomBottomSheet } from "../customBottomSheet/customBottomSheet";
import { CustomButton } from "../customButton/customButton";

const FilterPill = memo(({ label, isActive, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.pill, !isActive && styles.inactivePill]}
    >
      {isActive && (
        <LinearGradient
          colors={[colors.orange, colors.lightRed, colors.purple]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
      )}
      <Text
        style={[
          styles.pillText,
          isActive ? styles.activePillText : styles.inactivePillText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
});

export const Filter = memo(
  forwardRef(({ onFilterChange }, ref) => {
    const [activeContent, setActiveContent] = useState("Bites");
    const [activeGenre, setActiveGenre] = useState("All");
    const [activeSort, setActiveSort] = useState("Newest");

    const contentTypes = ["Bites", "Slates", "Projects"];
    const genres = [
      "All",
      "Drama",
      "Horror",
      "Experimental",
      "Comedy",
      "Action",
    ];
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

    return (
      <CustomBottomSheet
        ref={ref}
        title="Filters"
        snapPoints={["65%"]}
        enablePanDownToClose={true}
        useBlur={true}
      >
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
            <CustomButton label="Apply Filters" onPress={handleApply} />
          </View>
        </View>
      </CustomBottomSheet>
    );
  }),
);

const styles = StyleSheet.create({
  content: {
    paddingBottom: scales(30),
  },
  sectionContainer: {
    marginBottom: scales(20),
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
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },
  inactivePill: {
    borderWidth: 1,
    borderColor: colors.transparentWhite15,
    backgroundColor: colors.transparentWhite8,
  },
  pillText: {
    fontSize: scales(13),
    letterSpacing: 0.5,
    zIndex: 1,
  },
  activePillText: {
    fontFamily: fontFamily.bold,
    color: colors.white,
  },
  inactivePillText: {
    fontFamily: fontFamily.medium,
    color: colors.transparentWhite85,
  },
  buttonContainer: {
    marginTop: scales(12),
  },
});

export default Filter;
