import React, { useRef, useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { useNavigationState, useFocusEffect } from "@react-navigation/native";
import { navigate } from "../../navigation/navigationServices";
import { appImages } from "../../assets";
import { scales, colors } from "../../utils";
import { routesConstants } from "../../navigation";
import { styles } from "./styles";
import { BlurView } from "@react-native-community/blur";
import { CreateMenu } from "./CreateMenu";

const TABS = [
  {
    id: 1,
    icon: appImages.dashboard,
    route: routesConstants.Home,
    label: "Home",
  },
  {
    id: 2,
    icon: appImages.browse,
    route: routesConstants.Browse,
    label: "Browse",
  },
  {
    id: 3,
    icon: appImages.plus,
    route: routesConstants.Notification,
    label: "+",
  },
  {
    id: 4,
    icon: appImages.bell,
    route: routesConstants.Settings,
    label: "Notifications",
  },
  {
    id: 5,
    icon: appImages.dummyuser,
    route: routesConstants.Profile,
    label: "Profile",
  },
];

const ICON_CONTAINER = scales(50);

const TabItem = ({ tab, isFocused, onPress }) => {
  const animatedValue = useRef(new Animated.Value(isFocused ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isFocused ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  const tabWidth = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [ICON_CONTAINER, scales(75)],
  });

  const textWidth = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, scales(40)],
  });

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(0,136,255,0)", colors.blue],
  });

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <Animated.View
        style={[styles.tabItemContainer, { width: tabWidth, backgroundColor }]}
      >
        <Image
          source={tab.icon}
          resizeMode="contain"
          style={[
            styles.icon,
            { tintColor: tab.id === 5 ? null : colors.white },
          ]}
        />
        <Animated.View
          style={{
            width: textWidth,
            overflow: "hidden",
            opacity: animatedValue,
            justifyContent: "center",
          }}
        >
          <Text style={styles.label} numberOfLines={1}>
            {tab.label}
          </Text>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const PLUS_TAB_ID = 3;

export const BottomBar = () => {
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [menuVisible, setMenuVisible] = useState(false);

  const currentRouteName = useNavigationState(
    (state) => state.routes[state.index].name,
  );

  useFocusEffect(
    React.useCallback(() => {
      const tab = TABS.find((t) => t.route === currentRouteName);
      if (tab) setSelectedIndex(tab.id);
    }, [currentRouteName]),
  );

  const handleTabPress = (tab) => {
    if (tab.id === PLUS_TAB_ID) {
      setMenuVisible(true);
      return;
    }
    setSelectedIndex(tab.id);
    navigate(tab.route);
  };

  return (
    <>
      <View style={styles.container}>
        <BlurView
          style={styles.absoluteBlur}
          blurType="light"
          blurAmount={4}
          reducedTransparencyFallbackColor="light"
        />
        <View style={styles.innerContainer}>
          {TABS.map((tab) => (
            <TabItem
              key={tab.id}
              tab={tab}
              isFocused={selectedIndex === tab.id && tab.id !== PLUS_TAB_ID}
              onPress={() => handleTabPress(tab)}
            />
          ))}
        </View>
      </View>

      <CreateMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </>
  );
};
