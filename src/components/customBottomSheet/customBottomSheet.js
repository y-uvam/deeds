import React, { forwardRef, useMemo, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  Keyboard,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { colors, scales } from "../../utils";
import { fontFamily, appImages } from "../../assets";
import { BlurView } from "@react-native-community/blur";

const CustomBackground = ({ style, blur }) => {
  return (
    <View style={[style, styles.background]}>
      {blur ? (
        <BlurView
          style={[StyleSheet.absoluteFill, { overflow: "hidden" }]}
          blurType="dark"
          blurAmount={20}
          reducedTransparencyFallbackColor="#121212"
        />
      ) : (
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: colors.darkblack || "#1E1E1E" },
          ]}
        />
      )}
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
      useBlur = false,
      showCloseButton = false,
      enableBackdrop = true,
      backdropOpacity = 0.5,
    },
    ref,
  ) => {
    const points = useMemo(() => snapPoints, [snapPoints]);

    const renderBackdrop = useCallback(
      (props) => {
        if (!enableBackdrop) return null;
        return (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            opacity={backdropOpacity}
            pressBehavior="close"
          />
        );
      },
      [enableBackdrop, backdropOpacity],
    );

    const renderBackground = useCallback(
      (props) => <CustomBackground {...props} blur={useBlur} />,
      [useBlur],
    );

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={points}
        onChange={onSheetChanges}
        backgroundComponent={renderBackground}
        backdropComponent={renderBackdrop}
        handleComponent={null}
        enableDynamicSizing={true}
        enablePanDownToClose={false}
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
          {(title || subtitle || showCloseButton) && (
            <View style={styles.headerContainer}>
              <View style={styles.headerTextContainer}>
                {!!title && <Text style={styles.title}>{title}</Text>}
                {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
              </View>
              {showCloseButton && (
                <TouchableOpacity
                  onPress={() => ref.current?.dismiss()}
                  style={styles.closeButton}
                  activeOpacity={0.7}
                >
                  <Image source={appImages.close} style={styles.closeIcon} />
                </TouchableOpacity>
              )}
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
    overflow: "hidden",
  },
  handleIndicator: {},
  contentContainer: {
    paddingHorizontal: scales(20),
    paddingTop: scales(20),
    paddingBottom: scales(30),
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: scales(20),
  },
  headerTextContainer: {
    flex: 1,
  },
  closeButton: {
    width: scales(24),
    height: scales(24),
    justifyContent: "center",
    alignItems: "center",
    marginLeft: scales(10),
  },
  closeIcon: {
    width: "100%",
    height: "100%",
    tintColor: colors.white,
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
