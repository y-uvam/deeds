import { createStackNavigator } from "@react-navigation/stack";
import { routesConstants } from "./routeConstants";
import { colors } from "../utils";
import {
  Login,
  Splash,
} from "../screens";

const { Navigator, Screen } = createStackNavigator();

const MainStack = () => {
  return (
    <Navigator
      initialRouteName={routesConstants.Login}
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.white },
      }}
    >
      {/* <Screen
        screenOptions={{
          headerShown: false,
        }}
        name={routesConstants.Splash}
        component={Splash}
      /> */}
      <Screen name={routesConstants.Login} component={Login} />
      {/* <Screen
        name={routesConstants.ForgotPassword}
        component={Forgotpassword}
      />
      <Screen name={routesConstants.Checkinbox} component={CheckInbox} />
      <Screen name={routesConstants.BottomTabs} component={BottomTab} />
      <Screen name={routesConstants.Task} component={Tasks} />
      <Screen name={routesConstants.TaskDetails} component={TasksDetails} />
      <Screen name={routesConstants.ReportAnIssue} component={ReportIssue} />
      <Screen name={routesConstants.EditProfile} component={Editprofile} /> */}
    </Navigator>
  );
};

export default MainStack;
