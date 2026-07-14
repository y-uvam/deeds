import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import {
  Spacer,
  CustomSwitch,
  PostItem,
  AppBackground,
  Header,
} from "../../components";
import { colors, scales } from "../../utils";
import { appImages } from "../../assets";
import { useState } from "react";
import { navigate, routesConstants } from "../../navigation";

const DATA = [
  {
    id: "1",
    price: "$600",
    pickupTime: "1 hour",
    type: "Hourly",
    date: "Today",
    pickupLoc: "123 Main St, Downtown",
    dropLoc: "456 Park Ave, Uptown",
  },
  {
    id: "2",
    price: "$250",
    pickupTime: "30 mins",
    type: "One Way",
    date: "Tomorrow",
    pickupLoc: "789 Broadway, West Side",
    dropLoc: "101 Fifth Ave, Midtown",
  },
];

export const Home = () => {
  const [isOnline, setIsOnline] = useState(false);

  return (
    <AppBackground>
      <Header
        isHome={true}
        leftButton={appImages.plus}
        leftButtonPress={() => {
          navigate(routesConstants.Home);
        }}
      />
      <FlatList
        data={DATA}
        renderItem={({ item }) => <PostItem item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={style.listContent}
        showsVerticalScrollIndicator={false}
      />
    </AppBackground>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
  },

  listContent: {
    paddingBottom: scales(300),
    gap: scales(20),
  },
});
