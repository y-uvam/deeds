import React, { useRef, useEffect, useState, useMemo } from "react";
import { View, Animated, Dimensions, StyleSheet } from "react-native";
import { scales } from "../../utils";

const { width } = Dimensions.get("window");

export const CustomCarousel = ({
  data,
  renderItem,
  itemWidth = width - scales(32),
  autoPlayInterval = 4000,
}) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  
  // Duplicate data heavily to create a flawless infinite scroll without rewinds
  const loopCount = 50; 
  const extendedData = useMemo(() => {
    return Array.from({ length: loopCount }).flatMap((_, loopIndex) => 
      data.map((item, dataIndex) => ({ 
        ...item, 
        uniqueKey: `${item.id}_${loopIndex}_${dataIndex}` 
      }))
    );
  }, [data]);

  const originalLength = data.length;
  // Start deeply inside the duplicated list
  const initialIndex = Math.floor(loopCount / 2) * originalLength;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Auto-play engine
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = prev + 1;
        if (flatListRef.current) {
          flatListRef.current.scrollToOffset({
            offset: nextIndex * itemWidth,
            animated: true,
          });
        }
        return nextIndex;
      });
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [itemWidth, autoPlayInterval]);

  const renderAnimatedItem = ({ item, index }) => {
    // 3D Stack / Tinder Effect interpolations
    const inputRange = [
      (index - 3) * itemWidth,
      (index - 2) * itemWidth,
      (index - 1) * itemWidth,
      index * itemWidth,
      (index + 1) * itemWidth,
    ];

    // The active card sits at 0 translation.
    // The previous card (index+1) slides to the left normally (0 translation inside its normal frame).
    // The next cards stack directly behind by pulling them strongly to the left, with slight offsets.
    const translateX = scrollX.interpolate({
      inputRange,
      outputRange: [
        -(3 * itemWidth),
        -(2 * itemWidth),
        -(1 * itemWidth),
        0,
        0,
      ],
      extrapolate: "clamp",
    });

    const translateY = scrollX.interpolate({
      inputRange,
      outputRange: [
        -scales(30),
        -scales(20),
        -scales(10),
        0,
        0,
      ],
      extrapolate: "clamp",
    });

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.7, 0.8, 0.9, 1, 1],
      extrapolate: "clamp",
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0, 0.3, 0.7, 1, 0], // Previous fades out fast
      extrapolate: "clamp",
    });

    // Ensure earlier items (the active ones) render physically above the later items
    const zIndex = extendedData.length - index;

    return (
      <Animated.View
        style={{
          width: itemWidth,
          height: scales(230),
          zIndex,
          opacity,
          transform: [{ translateX }, { translateY }, { scale }],
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {renderItem({ item })}
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={extendedData}
        keyExtractor={(item) => item.uniqueKey}
        horizontal
        pagingEnabled={false}
        snapToInterval={itemWidth}
        snapToAlignment="center"
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={initialIndex}
        contentContainerStyle={{
          paddingHorizontal: (width - itemWidth) / 2,
        }}
        getItemLayout={(data, index) => ({
          length: itemWidth,
          offset: itemWidth * index,
          index,
        })}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / itemWidth);
          setCurrentIndex(newIndex);
        }}
        renderItem={renderAnimatedItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: scales(230),
    alignItems: "center",
    justifyContent: "center",
  },
});
