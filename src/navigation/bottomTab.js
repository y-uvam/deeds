import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {routesConstants} from './routeConstants';
import {appImages, fontFamily} from '../assets';
import {Dashboard, Newrepair, Notification, Settings} from '../screens';
import {colors, scales} from '../utils';

const Tab = createBottomTabNavigator();

export const BottomTab = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 100,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: colors.blue,
          paddingHorizontal: 20,
        },
        headerShown: false,
        tabBarButton: props => (
          <TouchableWithoutFeedback onPress={props.onPress}>
            <View style={props.style}>{props.children}</View>
          </TouchableWithoutFeedback>
        ),
        tabBarIcon: ({focused}) => {
          let iconSource;
          let tabName;

          switch (route.name) {
            case routesConstants.Dashboard:
              iconSource = appImages.dashboard;
              tabName = 'Dashboard';
              break;
            case routesConstants.NewRepair:
              iconSource = appImages.newRepairb;
              tabName = 'New Repair';
              break;
            case routesConstants.Notification:
              iconSource = appImages.Notification;
              tabName = 'Notification';
              break;
            case routesConstants.Settings:
              iconSource = appImages.Settings;
              tabName = 'Settings';
              break;
          }

          return (
            <View
              style={[styles.container, focused && styles.selectedContainer]}>
              <Image
                source={iconSource}
                style={[
                  styles.icon,
                  {tintColor: focused ? colors.white : colors.white},
                ]}
              />
              <Text
                style={[
                  styles.tabName,
                  {color: focused ? colors.white : colors.white},
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit>
                {tabName}
              </Text>
            </View>
          );
        },
      })}>
      <Tab.Screen name={routesConstants.Dashboard} component={Dashboard} />
      <Tab.Screen name={routesConstants.NewRepair} component={Newrepair} />
      <Tab.Screen
        name={routesConstants.Notification}
        component={Notification}
      />
      <Tab.Screen name={routesConstants.Settings} component={Settings} />
    </Tab.Navigator>
  );
};

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    maxWidth: width / 4 - 10,
    height: 64,
    width: 90,
    marginTop: '180%',
    marginHorizontal: '8%',
  },
  selectedContainer: {
    backgroundColor: '#4DA4FF',
    borderRadius: 10,
    height: 64,
    width: 90,
    marginTop: '180%',
  },
  icon: {
    width: 16,
    height: 20,
    resizeMode: 'contain',
  },
  tabName: {
    fontSize: scales(12),
    fontWeight: '500',
    textAlign: 'center',
    marginTop: '7%',
    fontFamily: fontFamily.bold,
  },
});
