import { createStackNavigator } from "@react-navigation/stack";
import { routesConstants } from "./routeConstants";
import { colors } from "../utils";
import {
  AccountPrivacy,
  Blocked,
  Browse,
  Chat,
  ChatCard,
  NewChat,
  Editprofile,
  Followers,
  Home,
  Login,
  Notification,
  Post,
  Profile,
  SavedPosts,
  Settings,
  Splash,
  YourActivity,
  Reels,
  SelectMedia,
  Upload,
  MetaData,
  DataUsage,
  DevicePermissions,
  TagsAndMentions,
  Monetization,
  Movie,
  Intro,
  Video,
} from "../screens";
import { BottomTab } from "./bottomTab";
import { Ratings } from "../screens/ratings/ratings";

const { Navigator, Screen } = createStackNavigator();

const MainStack = () => {
  return (
    <Navigator
      initialRouteName={routesConstants.Splash}
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: "horizontal",
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
      <Screen name={routesConstants.Home} component={Home} />
      <Screen name={routesConstants.Profile} component={Profile} />
      <Screen name={routesConstants.Settings} component={Settings} />
      <Screen name={routesConstants.Notification} component={Notification} />
      <Screen name={routesConstants.Browse} component={Browse} />
      <Screen name={routesConstants.Chat} component={Chat} />
      <Screen name={routesConstants.editProfile} component={Editprofile} />
      <Screen name={routesConstants.savedPosts} component={SavedPosts} />

      <Screen name={routesConstants.followers} component={Followers} />
      <Screen name={routesConstants.blocked} component={Blocked} />
      <Screen name={routesConstants.yourActivity} component={YourActivity} />
      <Screen name={routesConstants.chatCard} component={ChatCard} />
      <Screen name={routesConstants.newChat} component={NewChat} />
      <Screen name={routesConstants.post} component={Post} />
      <Screen name={routesConstants.reels} component={Reels} />
      <Screen name={routesConstants.selectMedia} component={SelectMedia} />
      <Screen name={routesConstants.upload} component={Upload} />
      <Screen name={routesConstants.metadata} component={MetaData} />
      <Screen name={routesConstants.dataUsage} component={DataUsage} />
      <Screen
        name={routesConstants.devicePermissions}
        component={DevicePermissions}
      />
      <Screen name={routesConstants.mentions} component={TagsAndMentions} />
      <Screen name={routesConstants.monetization} component={Monetization} />
      <Screen name={routesConstants.movie} component={Movie} />
      <Screen name={routesConstants.ratings} component={Ratings} />
      <Screen name={routesConstants.intro} component={Intro} />
      <Screen
        name={routesConstants.video}
        component={Video}
        options={{
          animation: "slide_from_right",
        }}
      />
      <Screen
        name={routesConstants.accountPrivacy}
        component={AccountPrivacy}
      />
    </Navigator>
  );
};

export default MainStack;
