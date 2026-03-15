import { createStackNavigator } from "@react-navigation/stack";
import { routesConstants } from "./routeConstants";
import { colors } from "../utils";
import {
  Browse,
  Forgotpassword,
  Home,
  Login,
  Notification,
  OTP,
  ResetPassword,
  Settings,
  SignUp,
  Splash,
} from "../screens";
import { BottomTab } from "./bottomTab";

const { Navigator, Screen } = createStackNavigator();

const MainStack = () => {
  return (
    <Navigator
      initialRouteName={routesConstants.BottomTabs}
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.white },
      }}
    >
      <Screen
        screenOptions={{
          headerShown: false,
        }}
        name={routesConstants.Splash}
        component={Splash}
      />
      <Screen name={routesConstants.Login} component={Login} />
      <Screen name={routesConstants.BottomTabs} component={BottomTab} />
      <Screen name={routesConstants.OTP} component={OTP} />
      <Screen name={routesConstants.ResetPassword} component={ResetPassword} />
       <Screen
        name={routesConstants.ForgotPassword}
        component={Forgotpassword}
      />
      <Screen name={routesConstants.SignUp} component={SignUp} />
      <Screen name={routesConstants.Home} component={Home} />
      <Screen name={routesConstants.Settings} component={Settings} />
      <Screen name={routesConstants.Notification} component={Notification} />
      <Screen name={routesConstants.Browse} component={Browse} />
    </Navigator>
  );
};

export default MainStack;
