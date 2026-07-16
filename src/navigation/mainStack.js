import { createStackNavigator } from "@react-navigation/stack";
import { routesConstants } from "./routeConstants";
import { colors } from "../utils";
import {
  AccountPrivacy,
  Archive,
  Blocked,
  Browse,
  Chat,
  ChatCard,
  NewChat,
  Editprofile,
  Followers,
  Forgotpassword,
  Home,
  Login,
  Notification,
  OTP,
  Post,
  Profile,
  ResetPassword,
  SavedPosts,
  Settings,
  SignUp,
  Splash,
  YourActivity,
  Reels,
  ContentType,
  SelectMedia,
  Upload,
  MetaData,
} from "../screens";
import { BottomTab } from "./bottomTab";

const { Navigator, Screen } = createStackNavigator();

const MainStack = () => {
  return (
    <Navigator
      initialRouteName={routesConstants.Splash}
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
      <Screen name={routesConstants.Profile} component={Profile} />
      <Screen name={routesConstants.Settings} component={Settings} />
      <Screen name={routesConstants.Notification} component={Notification} />
      <Screen name={routesConstants.Browse} component={Browse} />
      <Screen name={routesConstants.Chat} component={Chat} />
      <Screen name={routesConstants.editProfile} component={Editprofile} />
      <Screen name={routesConstants.savedPosts} component={SavedPosts} />
      <Screen name={routesConstants.archive} component={Archive} />
      <Screen name={routesConstants.followers} component={Followers} />
      <Screen name={routesConstants.blocked} component={Blocked} />
      <Screen name={routesConstants.yourActivity} component={YourActivity} />
      <Screen name={routesConstants.chatCard} component={ChatCard} />
      <Screen name={routesConstants.newChat} component={NewChat} />
      <Screen name={routesConstants.post} component={Post} />
      <Screen name={routesConstants.reels} component={Reels} />
      <Screen name={routesConstants.contentType} component={ContentType} />
      <Screen name={routesConstants.selectMedia} component={SelectMedia} />
      <Screen name={routesConstants.upload} component={Upload} />
      <Screen name={routesConstants.metadata} component={MetaData} />
      <Screen
        name={routesConstants.accountPrivacy}
        component={AccountPrivacy}
      />
    </Navigator>
  );
};

export default MainStack;
