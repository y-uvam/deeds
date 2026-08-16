import React, {
  forwardRef,
  useMemo,
  useCallback,
  useRef,
  useEffect,
  useImperativeHandle,
} from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  Keyboard,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
          blurAmount={25}
          reducedTransparencyFallbackColor={colors.background}
        />
      ) : (
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: colors.background },
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
      style,
      isScrollView = true,
      footerComponent,
      topInset: customTopInset,
      keyboardBehavior = "interactive",
    },
    ref,
  ) => {
    const internalRef = useRef(null);
    useImperativeHandle(ref, () => internalRef.current);

    useEffect(() => {
      const hideEvent =
        Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
      const sub = Keyboard.addListener(hideEvent, () => {
        internalRef.current?.snapToIndex(0);
      });
      return () => sub.remove();
    }, []);

    const insets = useSafeAreaInsets();
    const resolvedTopInset =
      customTopInset !== undefined ? customTopInset : insets.top + scales(6);
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

    const renderHeader = () => {
      if (!title && !subtitle && !showCloseButton) return null;
      return (
        <View style={styles.headerContainer}>
          <View style={styles.headerTextContainer}>
            {!!title && <Text style={styles.title}>{title}</Text>}
            {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
          {showCloseButton && (
            <TouchableOpacity
              onPress={() => internalRef.current?.dismiss()}
              style={styles.closeButton}
              activeOpacity={0.7}
            >
              <Image source={appImages.close} style={styles.closeIcon} />
            </TouchableOpacity>
          )}
        </View>
      );
    };

    return (
      <BottomSheetModal
        ref={internalRef}
        snapPoints={points}
        topInset={resolvedTopInset}
        onChange={onSheetChanges}
        backgroundComponent={renderBackground}
        backdropComponent={renderBackdrop}
        footerComponent={footerComponent}
        handleComponent={null}
        enableDynamicSizing={false}
        enablePanDownToClose={enablePanDownToClose}
        keyboardBehavior={keyboardBehavior}
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        style={[styles.sheet, style]}
        onDismiss={() => {}}
      >
        {isScrollView ? (
          <BottomSheetScrollView
            contentContainerStyle={[
              styles.contentContainer,
              { minHeight: points[0] },
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {renderHeader()}
            {children}
          </BottomSheetScrollView>
        ) : (
          <View style={styles.contentContainerFull}>
            {renderHeader()}
            {children}
          </View>
        )}
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
    borderTopLeftRadius: scales(28),
    borderTopRightRadius: scales(28),
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: "hidden",
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  handleIndicator: {
    width: scales(36),
    height: scales(4),
    borderRadius: scales(2),
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    alignSelf: "center",
    marginBottom: scales(14),
  },
  contentContainer: {
    paddingHorizontal: scales(20),
    paddingTop: scales(16),
    paddingBottom: scales(30),
  },
  contentContainerFull: {
    flex: 1,
    height: "100%",
    paddingHorizontal: scales(20),
    paddingTop: scales(16),
    paddingBottom: Platform.OS === "ios" ? scales(14) : scales(8),
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: scales(16),
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
    fontSize: scales(22),
    fontFamily: fontFamily.bold,
    color: colors.white,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: scales(14),
    fontFamily: fontFamily.regular,
    color: "rgba(255,255,255,0.55)",
    marginTop: scales(4),
    letterSpacing: 0.2,
  },
});
