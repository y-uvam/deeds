import React, { useState, forwardRef, memo, useCallback } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { CustomBottomSheet, Spacer, CustomButton } from "../../components";
import { colors, scales, commonText } from "../../utils";
import { appImages } from "../../assets";
import { navigate } from "../../navigation/navigationServices";
import { routesConstants } from "../../navigation/routeConstants";
import { styles } from "./contentTypeStyles";

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
    icon: appImages.project,
    accent: colors.storyRing,
  },
  {
    id: "slates",
    label: "Slates",
    subtitle: "Share your thoughts with the world",
    icon: appImages.slate,
    accent: colors.lightRed,
  },
  // {
  //   id: "story",
  //   label: "Story",
  //   subtitle: "Share quick updates & moments with fans",
  //   icon: appImages.camera || appImages.gallery,
  //   accent: colors.purple,
  // },
];

const TypeCard = memo(({ item, isSelected, onPress }) => (
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
));

export const ContentTypeSheet = forwardRef((props, ref) => {
  const [selected, setSelected] = useState(null);

  const handleNext = useCallback(() => {
    if (!selected) return;
    ref.current?.dismiss();
    navigate(routesConstants.selectMedia, { contentType: selected });
  }, [selected, ref]);

  const handleSelect = useCallback((item) => {
    setSelected(item);
  }, []);

  return (
    <CustomBottomSheet
      ref={ref}
      snapPoints={["75%"]}
      enablePanDownToClose={true}
      useBlur={true}
    >
      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        <Text style={styles.heading}>{commonText.whatAreYouCreating}</Text>
        <Text style={styles.subheading}>
          {commonText.chooseATypeToGetStarted}
        </Text>
        <Spacer height={scales(20)} />

        {CONTENT_TYPES.map((item) => (
          <TypeCard
            key={item.id}
            item={item}
            isSelected={selected?.id === item.id}
            onPress={() => handleSelect(item)}
          />
        ))}
      </ScrollView>

      <View>
        <CustomButton
          label={commonText.continue}
          onPress={handleNext}
          disable={!selected}
        />
      </View>
      <Spacer height={scales(20)} />
    </CustomBottomSheet>
  );
});
