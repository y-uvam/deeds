import React, { useState, forwardRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { CustomBottomSheet, Spacer, CustomButton } from "../../components";
import { colors, scales } from "../../utils";
import { fontFamily, appImages } from "../../assets";
import { navigate } from "../../navigation/navigationServices";
import { routesConstants } from "../../navigation/routeConstants";

const CONTENT_TYPES = [
  {
    id: "bites",
    label: "Bites",
    subtitle: "Trailers, BTS, or your best shots",
    icon: appImages.reels,
    accent: colors.orange,
  },
  {
    id: "movie",
    label: "Projects",
    subtitle: "Long-form video content",
    icon: appImages.slate,
    accent: colors.storyRing,
  },
  {
    id: "story",
    label: "Slates",
    subtitle: "Share your thoughts with the world",
    icon: appImages.project,
    accent: colors.lightRed,
  },
];

const TypeCard = ({ item, isSelected, onPress }) => (
  <TouchableOpacity
    style={[styles.typeCard, isSelected && { borderColor: item.accent }]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={[styles.iconCircle, { backgroundColor: item.accent + "22" }]}>
      <Image
        source={item.icon}
        style={[styles.typeIcon, { tintColor: item.accent }]}
        resizeMode="contain"
      />
    </View>
    <View style={styles.typeTextBlock}>
      <Text style={[styles.typeLabel, isSelected && { color: item.accent }]}>
        {item.label}
      </Text>
      <Text style={styles.typeSubtitle}>{item.subtitle}</Text>
    </View>
    <View
      style={[styles.radioOuter, isSelected && { borderColor: item.accent }]}
    >
      {isSelected && (
        <View style={[styles.radioInner, { backgroundColor: item.accent }]} />
      )}
    </View>
  </TouchableOpacity>
);

export const ContentTypeSheet = forwardRef((props, ref) => {
  const [selected, setSelected] = useState(null);

  const handleNext = () => {
    if (!selected) return;
    ref.current?.dismiss();
    navigate(routesConstants.selectMedia, { contentType: selected });
  };

  return (
    <CustomBottomSheet
      ref={ref}
      snapPoints={["60%"]}
      enablePanDownToClose={true}
      useBlur={true}
    >
      <View style={styles.content}>
        <Text style={styles.heading}>What are you creating?</Text>
        <Text style={styles.subheading}>Choose a type to get started</Text>
        <Spacer height={scales(24)} />

        {CONTENT_TYPES.map((item) => (
          <TypeCard
            key={item.id}
            item={item}
            isSelected={selected?.id === item.id}
            onPress={() => setSelected(item)}
          />
        ))}
      </View>

      <View style={styles.footer}>
        <CustomButton
          label="Continue"
          onPress={handleNext}
          // disable={!selected}
        />
      </View>
      <Spacer height={scales(20)} />
    </CustomBottomSheet>
  );
});

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  heading: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(22),
  },
  subheading: {
    color: colors.transparentWhite40,
    fontFamily: fontFamily.regular,
    fontSize: scales(13),
    marginTop: scales(4),
  },
  typeCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.transparentWhite15,
    borderRadius: scales(16),
    paddingHorizontal: scales(16),
    paddingVertical: scales(16),
    marginBottom: scales(12),
    backgroundColor: colors.transparentWhite5,
    gap: scales(14),
  },
  iconCircle: {
    width: scales(48),
    height: scales(48),
    borderRadius: scales(24),
    justifyContent: "center",
    alignItems: "center",
  },
  typeIcon: {
    width: scales(22),
    height: scales(22),
  },
  typeTextBlock: {
    flex: 1,
  },
  typeLabel: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(16),
  },
  typeSubtitle: {
    color: colors.transparentWhite40,
    fontFamily: fontFamily.regular,
    fontSize: scales(12),
    marginTop: scales(2),
  },
  radioOuter: {
    width: scales(20),
    height: scales(20),
    borderRadius: scales(10),
    borderWidth: 2,
    borderColor: colors.transparentWhite40,
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: scales(10),
    height: scales(10),
    borderRadius: scales(5),
  },
  footer: {
    // paddingBottom: scales(30),
  },
});
