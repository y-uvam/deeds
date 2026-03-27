import React, { forwardRef, useMemo, useCallback } from "react";
import { StyleSheet, View, Text, Keyboard } from "react-native";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { colors, scales } from "../../utils";
import { fontFamily } from "../../assets";
import { BlurView } from "@react-native-community/blur";

const CustomBackground = ({ style }) => {
  return (
    <View style={[style, styles.background]}>
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType="light"
        blurAmount={1}
        reducedTransparencyFallbackColor="white"
      />
    </View>
  );
};

export const CustomBottomSheet = forwardRef(
  (
    {
      children,
      snapPoints = ["50%"],
      onSheetChanges,
      enablePanDownToClose = false,
      title,
      subtitle,
    },
    ref,
  ) => {
    const points = useMemo(() => snapPoints, [snapPoints]);

    const renderBackdrop = useCallback(
      (props) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0}
        />
      ),
      [],
    );

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={points}
        onChange={onSheetChanges}
        backgroundComponent={CustomBackground}
        handleComponent={null}
        enableDynamicSizing={true}
        enablePanDownToClose={false}
        backdropComponent={renderBackdrop}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        style={styles.sheet}
        onDismiss={() => {}}
      >
        <BottomSheetScrollView
          contentContainerStyle={[
            styles.contentContainer,
            { minHeight: points[0] },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {(title || subtitle) && (
            <View style={styles.headerContainer}>
              {!!title && <Text style={styles.title}>{title}</Text>}
              {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
          )}

          {children}
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({
  sheet: {
    zIndex: 99,
  },
  background: {
    backgroundColor: "transparent",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    borderColor: colors.white,
    borderWidth: 1,
    overflow: "hidden",
  },
  handleIndicator: {},
  contentContainer: {
    paddingHorizontal: scales(20),
    paddingTop: scales(20),
    paddingBottom: scales(30),
  },
  headerContainer: {
    marginBottom: scales(20),
  },
  title: {
    fontSize: scales(24),
    fontFamily: fontFamily.bold,
    color: colors.white,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: scales(14),
    fontFamily: fontFamily.regular,
    color: "rgba(255,255,255,0.55)",
    marginTop: scales(6),
    letterSpacing: 0.2,
  },
});
