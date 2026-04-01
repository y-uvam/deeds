import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  AppBackground,
  CustomSkeleton,
  Header,
  PostItem,
  CustomRefreshController,
  FooterComponent,
} from "../../components";
import { colors, scales } from "../../utils";
import { useEffect, useState, useCallback } from "react";
import { appImages } from "../../assets";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  runOnJS,
} from "react-native-reanimated";
import { navigate, routesConstants } from "../../navigation";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export const Home = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useSharedValue(0);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2500);
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
    onEndDrag: (event) => {
      if (event.contentOffset.y < -80) {
        runOnJS(onRefresh)();
      }
    },
  });

  const renderItem = ({ item }) => {
    return loading ? (
      <CustomSkeleton variant="card" />
    ) : (
      <PostItem images={[appImages.post, appImages.post, appImages.post]} />
    );
  };

  return (
    <AppBackground>
      <CustomRefreshController scrollY={scrollY} refreshing={refreshing} />
      <Header
        label="Home"
        rightIcon={appImages.bell}
        onRightPress={() => {
          navigate(routesConstants.Notification);
        }}
      />
      <AnimatedFlatList
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        data={loading ? [1] : [1, 2, 3]}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: scales(10) }}
        ListFooterComponent={<FooterComponent height={scales(100)} />}
      />
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
});
