import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Svg, {
  Text as SvgText,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from "react-native-svg";
import { appImages } from "../../assets";
import { colors, scales } from "../../utils";
import { fontFamily } from "../../assets";
import { goBack, navigate, routesConstants } from "../../navigation";
import { styles } from "./styles";

export const RoundIconButton = ({ icon, onPress }) => {
  if (!icon) return null;
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={styles.roundButtonWrapper}
    >
      <Image source={icon} style={styles.iconImage} tintColor={colors.white} />
    </TouchableOpacity>
  );
};

export const HeaderLogo = () => {
  return (
    <View style={styles.brandWrapper}>
      <Svg height={scales(28)} width={scales(140)}>
        <Defs>
          <SvgLinearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={colors.orange} />
            <Stop offset="50%" stopColor={colors.storyRing} />
            <Stop offset="100%" stopColor={colors.lightRed} />
          </SvgLinearGradient>
        </Defs>
        <SvgText
          fill="url(#brandGrad)"
          fontSize={scales(23)}
          fontWeight="900"
          x="0"
          y={scales(21)}
          fontFamily={fontFamily.black}
          letterSpacing="-0.5"
        >
          IndieMate
        </SvgText>
      </Svg>
    </View>
  );
};

export const HeaderPill = ({ label, isLogo }) => {
  if (!label && !isLogo) return null;

  if (isLogo) {
    return <HeaderLogo />;
  }

  return (
    <Text style={styles.headerTitle} numberOfLines={1}>
      {label}
    </Text>
  );
};

export const Header = ({
  label,
  showBackButton,
  rightIcon,
  onRightPress,
  isHome,
  leftButton,
  leftButtonPress,
  filterIcon = false,
  onFilterPress,
}) => {
  const hasLeftButton = showBackButton || leftButton;

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          {hasLeftButton && (
            <RoundIconButton
              icon={leftButton ? leftButton : appImages.backarrow}
              onPress={() => (leftButtonPress ? leftButtonPress() : goBack())}
            />
          )}
          <HeaderPill label={label} isLogo={isHome} />
        </View>

        <View style={styles.rightContainer}>
          {rightIcon ? (
            <RoundIconButton icon={rightIcon} onPress={onRightPress} />
          ) : (
            isHome && (
              <RoundIconButton
                icon={appImages.bell}
                onPress={() => navigate(routesConstants.Notification)}
              />
            )
          )}
          {filterIcon && (
            <RoundIconButton
              icon={appImages.filter}
              onPress={() => {
                if (onFilterPress) {
                  onFilterPress();
                }
              }}
            />
          )}
        </View>
      </View>
    </View>
  );
};
