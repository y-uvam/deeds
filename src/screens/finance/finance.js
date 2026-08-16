import React, { useState, useCallback, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { AppBackground, Header, Spacer } from "../../components";
import { colors, scales } from "../../utils";
import { fontFamily, appImages } from "../../assets";
import { showCustomMessage } from "../../helper/FlashMessage";

const { width } = Dimensions.get("window");
const THEME_GRADIENT = [colors.orange, colors.storyRing, colors.lightRed];
const SUBTITLE_COLOR = colors.subtitleGray;
const DIM_LABEL_COLOR = colors.dimLabelGray;

const EARNINGS_LIST = [
  {
    id: "e_1",
    title: "Dhanda Empire",
    source: "184K Premium Streaming Views",
    amount: "$2,140.50",
    status: "Available",
    date: "August 2026",
    poster: appImages.poster1,
  },
  {
    id: "e_2",
    title: "Silent Horizon",
    source: "94K Premium Streaming Views",
    amount: "$1,420.00",
    status: "Available",
    date: "July 2026",
    poster: appImages.poster2,
  },
  {
    id: "e_3",
    title: "The Last Shadow",
    source: "65K Premium Streaming Views",
    amount: "$894.90",
    status: "Paid Out",
    date: "June 2026",
    poster: appImages.poster3,
  },
  {
    id: "e_4",
    title: "Galactic Chronicles",
    source: "28K Premium Streaming Views",
    amount: "$370.00",
    status: "Paid Out",
    date: "May 2026",
    poster: appImages.poster4,
  },
];

const DONATION_MOVIES_LIST = [
  {
    id: "dm_1",
    title: "Dhanda Empire",
    source: "Direct Fan Support & Tips",
    amount: "$640.00",
    status: "Credited",
    date: "August 2026",
    poster: appImages.poster1,
  },
  {
    id: "dm_2",
    title: "Silent Horizon",
    source: "Direct Fan Support & Tips",
    amount: "$380.00",
    status: "Credited",
    date: "July 2026",
    poster: appImages.poster2,
  },
  {
    id: "dm_3",
    title: "The Last Shadow",
    source: "Direct Fan Support & Tips",
    amount: "$150.00",
    status: "Paid Out",
    date: "June 2026",
    poster: appImages.poster3,
  },
  {
    id: "dm_4",
    title: "Galactic Chronicles",
    source: "Direct Fan Support & Tips",
    amount: "$70.00",
    status: "Paid Out",
    date: "May 2026",
    poster: appImages.poster4,
  },
];

export const Finance = () => {
  const [activeTab, setActiveTab] = useState("Earnings");
  const scrollViewRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleWithdraw = useCallback(() => {
    showCustomMessage(
      "Withdrawal request of $4,825.40 initiated to your linked direct deposit bank account!",
      "success",
    );
  }, []);

  const handlePayoutMethods = useCallback(() => {
    showCustomMessage(
      "Active Deposit Account: Bank ending in ****4210 (Verified)",
      "info",
    );
  }, []);

  const handleDonationGoal = useCallback(() => {
    showCustomMessage(
      "Donation Goal: 'Next Feature Film Equipment ($2,000)' is currently 62% funded!",
      "info",
    );
  }, []);

  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
    if (tabName === "Earnings") {
      scrollViewRef.current?.scrollTo({ x: 0, animated: true });
    } else {
      scrollViewRef.current?.scrollTo({ x: width, animated: true });
    }
  };

  const handleMomentumScrollEnd = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    const newTab = index === 0 ? "Earnings" : "Donations";
    if (newTab !== activeTab) {
      setActiveTab(newTab);
    }
  };

  const translateX = scrollX.interpolate({
    inputRange: [0, width],
    outputRange: [0, width / 2],
    extrapolate: "clamp",
  });

  const renderPeriodSelector = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => handleTabPress("Earnings")}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === "Earnings" && styles.activeTabText,
          ]}
        >
          Streaming Earnings
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => handleTabPress("Donations")}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === "Donations" && styles.activeTabText,
          ]}
        >
          Fan Donations
        </Text>
      </TouchableOpacity>

      <Animated.View
        style={[
          styles.tabIndicator,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );

  const renderEarningsSection = () => (
    <>
      <View style={styles.heroCard}>
        <View style={styles.heroHeader}>
          <View style={styles.heroHeaderLeft}>
            <Text style={styles.heroTitle}>Total Available Balance</Text>
            <Text style={styles.heroSubtitle}>
              Scheduled automated payout on Aug 15, 2026
            </Text>
          </View>
          <View style={styles.badgeBox}>
            <Text style={styles.badgeText}>+18.4%</Text>
          </View>
        </View>

        <Text style={styles.heroAmount}>$4,825.40</Text>
        <Text style={styles.payoutNote}>
          Lifetime earned across all studio cinema streams: $18,450.00
        </Text>

        <View style={styles.actionBtnRow}>
          <TouchableOpacity
            style={styles.btnPrimaryWrapper}
            activeOpacity={0.85}
            onPress={handleWithdraw}
          >
            <LinearGradient
              colors={THEME_GRADIENT}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.btnPrimary}
            >
              <Text style={styles.btnPrimaryText}>Withdraw Funds</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnSecondary}
            activeOpacity={0.85}
            onPress={handlePayoutMethods}
          >
            <Text style={styles.btnSecondaryText}>Payout Account</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Streaming Revenue by Movie</Text>
      </View>

      <View style={styles.listCard}>
        {EARNINGS_LIST.map((item, idx) => (
          <View
            key={item.id}
            style={[
              styles.rowItem,
              idx < EARNINGS_LIST.length - 1 && styles.rowBorder,
            ]}
          >
            <Image
              source={item.poster}
              style={styles.posterThumb}
              resizeMode="cover"
            />
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.itemSource}>{item.source}</Text>
              <Text style={styles.itemDate}>{item.date}</Text>
            </View>
            <View style={styles.itemEnd}>
              <Text style={styles.itemAmount}>{item.amount}</Text>
              <View style={styles.statusTag}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </>
  );

  const renderDonationsSection = () => (
    <>
      <View style={styles.heroCard}>
        <View style={styles.heroHeader}>
          <View style={styles.heroHeaderLeft}>
            <Text style={styles.heroTitle}>Total Direct Supporter Tips</Text>
            <Text style={styles.heroSubtitle}>
              100% of fan donations are credited directly to you
            </Text>
          </View>
          <View style={styles.badgeBox}>
            <Text style={styles.badgeText}>84 Fans</Text>
          </View>
        </View>

        <Text style={styles.heroAmount}>$1,240.00</Text>
        <Text style={styles.payoutNote}>
          Average community support contribution: $14.75 per tip
        </Text>

        <Spacer height={scales(18)} />
        <TouchableOpacity
          style={styles.goalBtnWrapper}
          activeOpacity={0.85}
          onPress={handleDonationGoal}
        >
          <LinearGradient
            colors={THEME_GRADIENT}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.goalBtn}
          >
            <Text style={styles.goalBtnText} numberOfLines={1}>
              Check Active Production Goal (62% Funded)
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Streaming Donations by Movie</Text>
      </View>

      <View style={styles.listCard}>
        {DONATION_MOVIES_LIST.map((item, idx) => (
          <View
            key={item.id}
            style={[
              styles.rowItem,
              idx < DONATION_MOVIES_LIST.length - 1 && styles.rowBorder,
            ]}
          >
            <Image
              source={item.poster}
              style={styles.posterThumb}
              resizeMode="cover"
            />
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.itemSource}>{item.source}</Text>
              <Text style={styles.itemDate}>{item.date}</Text>
            </View>
            <View style={styles.itemEnd}>
              <Text style={styles.itemAmount}>{item.amount}</Text>
              <View style={styles.statusTag}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </>
  );

  return (
    <AppBackground showAuthAnimation={true}>
      <Header label="Finance & Earnings" showBackButton={true} />
      {renderPeriodSelector()}
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true },
        )}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        style={styles.horizontalScroll}
      >
        <View style={{ width }}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {renderEarningsSection()}
          </ScrollView>
        </View>
        <View style={{ width }}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {renderDonationsSection()}
          </ScrollView>
        </View>
      </Animated.ScrollView>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  horizontalScroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: scales(40),
    paddingTop: scales(14),
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: scales(4),
    position: "relative",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: scales(14),
  },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "50%",
    height: 2,
    backgroundColor: colors.white,
  },
  tabText: {
    fontFamily: fontFamily.medium,
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: scales(15),
  },
  activeTabText: {
    fontFamily: fontFamily.bold,
    color: colors.white,
  },
  heroCard: {
    marginHorizontal: scales(16),
    marginBottom: scales(24),
    backgroundColor: colors.transparentWhite5,
    borderWidth: 1,
    borderColor: colors.transparentWhite12,
    borderRadius: scales(22),
    padding: scales(20),
  },
  heroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  heroHeaderLeft: {
    flex: 1,
    marginRight: scales(12),
  },
  heroTitle: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(16),
  },
  heroSubtitle: {
    color: SUBTITLE_COLOR,
    fontFamily: fontFamily.medium,
    fontSize: scales(12),
    marginTop: scales(4),
  },
  badgeBox: {
    backgroundColor: colors.transparentWhite10,
    paddingHorizontal: scales(10),
    paddingVertical: scales(6),
    borderRadius: scales(12),
    borderWidth: 1,
    borderColor: colors.transparentWhite15,
  },
  badgeText: {
    color: colors.white,
    fontFamily: fontFamily.semiBold,
    fontSize: scales(11),
  },
  heroAmount: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(34),
    marginTop: scales(14),
  },
  payoutNote: {
    color: SUBTITLE_COLOR,
    fontFamily: fontFamily.medium,
    fontSize: scales(12),
    marginTop: scales(6),
  },
  actionBtnRow: {
    flexDirection: "row",
    gap: scales(12),
    marginTop: scales(18),
  },
  btnPrimaryWrapper: {
    flex: 1,
    borderRadius: scales(14),
    overflow: "hidden",
  },
  btnPrimary: {
    height: scales(48),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: scales(14),
    width: "100%",
  },
  btnPrimaryText: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(13.5),
    textAlign: "center",
  },
  btnSecondary: {
    flex: 1,
    height: scales(48),
    backgroundColor: colors.transparentWhite10,
    borderWidth: 1,
    borderColor: colors.transparentWhite15,
    borderRadius: scales(14),
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: scales(8),
  },
  btnSecondaryText: {
    color: colors.white,
    fontFamily: fontFamily.semiBold,
    fontSize: scales(13.5),
    textAlign: "center",
  },
  goalBtnWrapper: {
    borderRadius: scales(14),
    overflow: "hidden",
    width: "100%",
  },
  goalBtn: {
    height: scales(48),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: scales(14),
    width: "100%",
  },
  goalBtnText: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(13),
    textAlign: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginHorizontal: scales(20),
    marginBottom: scales(12),
  },
  sectionTitle: {
    color: colors.white,
    fontFamily: fontFamily.semiBold,
    fontSize: scales(17),
  },
  listCard: {
    marginHorizontal: scales(16),
    backgroundColor: colors.transparentWhite5,
    borderWidth: 1,
    borderColor: colors.transparentWhite10,
    borderRadius: scales(20),
    paddingHorizontal: scales(16),
    paddingVertical: scales(6),
  },
  rowItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: scales(14),
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.transparentWhite8,
  },
  posterThumb: {
    width: scales(48),
    height: scales(64),
    borderRadius: scales(10),
    marginRight: scales(14),
  },
  itemInfo: {
    flex: 1,
    marginRight: scales(12),
  },
  itemTitle: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(15),
  },
  itemSource: {
    color: SUBTITLE_COLOR,
    fontFamily: fontFamily.medium,
    fontSize: scales(12),
    marginTop: scales(3),
  },
  itemDate: {
    color: DIM_LABEL_COLOR,
    fontFamily: fontFamily.medium,
    fontSize: scales(11),
    marginTop: scales(4),
  },
  itemEnd: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  itemAmount: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(16),
    marginBottom: scales(6),
  },
  statusTag: {
    paddingHorizontal: scales(10),
    paddingVertical: scales(4),
    borderRadius: scales(10),
    backgroundColor: colors.transparentWhite10,
  },
  statusText: {
    color: colors.white,
    fontFamily: fontFamily.medium,
    fontSize: scales(11),
  },
});
