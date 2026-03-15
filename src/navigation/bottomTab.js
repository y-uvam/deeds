import {routesConstants} from './routeConstants';
import {Home, Browse, Notification, Settings} from '../screens';
import {BottomBar} from '../components';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

export const BottomTab = () => {
  return (
    <Tab.Navigator
    tabBar={props=> <BottomBar {...props} />}
      screenOptions={{headerShown: false}}
      backBehavior="history">
      <Tab.Screen name={routesConstants.Home} component={Home} />
      <Tab.Screen name={routesConstants.Browse} component={Browse} />
      <Tab.Screen name={routesConstants.Notification} component={Notification} />
      <Tab.Screen name={routesConstants.Settings} component={Settings} />
    </Tab.Navigator>
  );
};

