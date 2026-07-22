import { FlatList, StyleSheet } from "react-native";
import { PostItem, AppBackground, Header, Filter } from "../../components";
import { scales } from "../../utils";
import { appImages } from "../../assets";
import { navigate, routesConstants } from "../../navigation";
import { ContentTypeSheet } from "../../screens";
import { useTabBarScrollHandler } from "../../context/TabBarContext";
import { useCallback, useRef } from "react";
import Animated from "react-native-reanimated";

const DATA = [
  {
    id: "1",
    price: "$600",
    pickupTime: "1 hour",
    type: "Hourly",
    date: "Today",
    pickupLoc: "123 Main St, Downtown",
    dropLoc: "456 Park Ave, Uptown",
    postType: "project",
  },
  {
    id: "2",
    price: "$250",
    pickupTime: "30 mins",
    type: "One Way",
    date: "Tomorrow",
    pickupLoc: "789 Broadway, West Side",
    dropLoc: "101 Fifth Ave, Midtown",
    postType: "bite",
  },
  {
    id: "3",
    price: "$400",
    pickupTime: "45 mins",
    type: "Round Trip",
    date: "Friday",
    pickupLoc: "55 Ocean Blvd, Beachside",
    dropLoc: "22 Hill Rd, Northside",
    postType: "project",
  },
  {
    id: "4",
    price: "$180",
    pickupTime: "20 mins",
    type: "One Way",
    date: "Saturday",
    pickupLoc: "9 Lake St, Westend",
    dropLoc: "77 River Ave, Eastside",
    postType: "slate",
  },
];

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export const Home = () => {
  const scrollHandler = useTabBarScrollHandler();
  const filterRef = useRef(null);
  const contentTypeRef = useRef(null);

  const renderItem = useCallback(({ item }) => <PostItem item={item} />, []);

  return (
    <AppBackground>
      <Header
        isHome={true}
        leftButton={appImages.plus}
        leftButtonPress={() => contentTypeRef.current?.present()}
        onFilterPress={() => filterRef.current?.present()}
        filterIcon={true}
      />
      <AnimatedFlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={style.listContent}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      />
      <Filter
        ref={filterRef}
        onFilterChange={(filters) => console.log("Applied Filters:", filters)}
      />
      <ContentTypeSheet ref={contentTypeRef} />
    </AppBackground>
  );
};

const style = StyleSheet.create({
  listContent: {
    paddingBottom: scales(120),
    gap: scales(20),
  },
});
