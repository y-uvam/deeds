import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { appImages, fontFamily } from "../../assets";
import { colors, scales } from "../../utils";
import { CustomSwitch } from "../CustomSwitch/CustomSwitch";

export const NextButton = ({
  leftIcon,
  label,
  onPress,
  rightIcon,
  isSelected,
  isSwitch = false,
  switchValue = false,
  onSwitchChange,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={isSwitch ? () => onSwitchChange?.(!switchValue) : onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftContainer}>
        {leftIcon && (
          <Image
            source={leftIcon}
            style={styles.leftIcon}
            resizeMode="contain"
          />
        )}
        <Text style={[styles.label]}>{label}</Text>
      </View>
      {isSwitch ? (
        <CustomSwitch
          value={switchValue}
          onValueChange={onSwitchChange}
          activeColor={colors.blue}
        />
      ) : (
        <Image
          style={[
            styles.next,
            rightIcon
              ? {
                  transform: [{ rotate: "0deg" }],
                  tintColor: colors.blue,
                  height: scales(20),
                  width: scales(20),
                }
              : {},
          ]}
          source={rightIcon || appImages.backarrow}
          resizeMode="contain"
        />
      )}
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: scales(10),
    marginVertical: scales(5),
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: scales(10),
  },
  leftIcon: {
    height: 25,
    width: 25,
    tintColor: colors.white,
  },
  label: {
    fontFamily: fontFamily.regular,
    color: colors.white,
    fontSize: scales(16),
  },
  next: {
    height: 15,
    width: 15,
    tintColor: colors.white,
    transform: [{ rotate: "180deg" }],
  },
});
