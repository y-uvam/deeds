import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { AppBackground, Spacer } from "../../components";
import { colors, scales } from "../../utils";
import { appImages, fontFamily } from "../../assets";
import { goBack } from "../../navigation";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * A StatCard component is used to display a statistic such as the number of trips taken, the number of kilometers travelled, etc.
 * It takes in the following props:
 * - label: the label to display for the statistic
 * - value: the value of the statistic
 * - subtext: the subtext to display for the statistic
 * - icon: the icon to display for the statistic
 * - backgroundColor: the background color of the component. If not provided, it defaults to white.
 */
/*******  7ea1fcd7-5bbc-4ae1-b68a-11fc2834ae13  *******/
const StatCard = ({ label, value, subtext, icon, backgroundColor }) => (
  <View
    style={[styles.statCard, { backgroundColor: backgroundColor || "white" }]}
  >
    <Text style={styles.statIcon}>{icon}</Text>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{subtext}</Text>
  </View>
);

const TripItem = ({ id, price, route, time, rating }) => (
  <View style={styles.tripItem}>
    <View style={styles.tripLeft}>
      <View style={styles.tripIconBg}>
        <Image
          source={appImages.car}
          style={styles.smallCar}
          resizeMode="contain"
        />
      </View>
      <View style={styles.tripInfo}>
        <Text style={styles.tripId}>Trip#{id}</Text>
        <Text style={styles.tripTime}>{time}</Text>
        <Text style={styles.tripRoute}>{route}</Text>
      </View>
    </View>
    <View style={styles.tripRight}>
      <Text style={styles.tripPrice}>{price}</Text>
      <Text style={styles.tripRating}>⭐️ {rating}</Text>
    </View>
  </View>
);

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("Week");

  return (
    <View style={styles.container}>
      {/* Header Area (Blue) */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => goBack()} style={styles.backBtn}>
          <Image source={appImages.backarrow} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Earnings</Text>
        <Text style={styles.headerDesc}>Track your income and trips</Text>
        <Image
          source={appImages.earnings}
          style={styles.headerIllustration}
          resizeMode="contain"
        />
      </View>

      {/* Acting Bottom Sheet Component */}
      <View style={styles.bottomSheetContainer}>
        <View style={styles.sheetHandle} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <StatCard
              value="$1,234"
              subtext="Today's Earnings"
              icon="💰"
              backgroundColor="#E8F1FF"
            />
            <StatCard
              value="$1,234"
              subtext="This Week"
              icon="📈"
              backgroundColor="#E8F1FF"
            />
          </View>
          <View style={styles.statsGrid}>
            <StatCard value="328" subtext="Total Trips" icon="🕒" />
            <StatCard value="4.9" subtext="Average Rating" icon="⭐️" />
          </View>

          {/* Monthly Summary */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryIcon}>📅</Text>
              <Text style={styles.summaryTitle}>Monthly Summary</Text>
            </View>
            <View style={styles.summaryData}>
              <Text style={styles.summaryMonth}>January 2026</Text>
              <Text style={styles.summaryAmount}>$3258</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFilled, { width: "75%" }]} />
            </View>
            <Text style={styles.summaryGoalText}>
              75% of monthly goal ($4500)
            </Text>
          </View>

          {/* Recent Trips */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Trips</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          <TripItem
            id="T001"
            price="$45"
            time="02:30pm"
            route="Downtown → Airport"
            rating="5"
          />
          <TripItem
            id="T002"
            price="$45"
            time="02:10pm"
            route="Downtown → Airport"
            rating="5"
          />
          <TripItem
            id="T003"
            price="$45"
            time="02:10pm"
            route="Downtown → Airport"
            rating="5"
          />

          {/* Segmented Control */}
          <View style={styles.segmentedContainer}>
            {["Today", "Week", "Month"].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.activeTab]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Final Summary Card */}
          <View style={styles.finalSummary}>
            <Text style={styles.finalAmount}>$4500</Text>
            <Text style={styles.finalSubtext}>
              28 trips completed this week
            </Text>
          </View>

          <Spacer height={scales(100)} />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.blue,
  },
  header: {
    height: SCREEN_HEIGHT * 0.35,
    paddingTop: scales(50),
    alignItems: "center",
  },
  backBtn: {
    position: "absolute",
    left: scales(20),
    top: scales(60),
    width: scales(30),
    height: scales(30),
  },
  backIcon: {
    width: "100%",
    height: "100%",
    tintColor: colors.white,
  },
  headerTitle: {
    fontSize: scales(24),
    fontFamily: fontFamily.bold,
    color: colors.white,
    marginTop: scales(10),
  },
  headerDesc: {
    fontSize: scales(14),
    fontFamily: fontFamily.regular,
    color: "rgba(255,255,255,0.7)",
    marginTop: scales(5),
  },
  headerIllustration: {
    width: "80%",
    height: scales(150),
    marginTop: scales(10),
  },
  // Acting Bottom Sheet
  bottomSheetContainer: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: scales(30),
    borderTopRightRadius: scales(30),
    marginTop: scales(-20),
    overflow: "hidden",
  },
  sheetHandle: {
    width: scales(40),
    height: scales(4),
    backgroundColor: colors.blue,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: scales(15),
  },
  scrollContent: {
    paddingHorizontal: scales(20),
    paddingTop: scales(20),
  },
  statsGrid: {
    flexDirection: "row",
    gap: scales(15),
    marginBottom: scales(15),
  },
  statCard: {
    flex: 1,
    padding: scales(15),
    borderRadius: scales(20),
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  statIcon: {
    fontSize: scales(24),
    marginBottom: scales(5),
  },
  statValue: {
    fontSize: scales(20),
    fontFamily: fontFamily.bold,
    color: colors.black,
  },
  statLabel: {
    fontSize: scales(12),
    fontFamily: fontFamily.regular,
    color: colors.gray,
    marginTop: scales(2),
  },
  summaryCard: {
    backgroundColor: "white",
    borderRadius: scales(20),
    padding: scales(20),
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    marginBottom: scales(20),
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: scales(10),
  },
  summaryIcon: {
    fontSize: scales(20),
  },
  summaryTitle: {
    fontSize: scales(16),
    fontFamily: fontFamily.bold,
    color: colors.black,
  },
  summaryData: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: scales(15),
  },
  summaryMonth: {
    fontSize: scales(14),
    color: colors.gray,
  },
  summaryAmount: {
    fontSize: scales(20),
    fontFamily: fontFamily.bold,
    color: colors.black,
  },
  progressBarBg: {
    height: scales(8),
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 4,
    marginTop: scales(10),
  },
  progressBarFilled: {
    height: "100%",
    backgroundColor: colors.blue,
    borderRadius: 4,
  },
  summaryGoalText: {
    fontSize: scales(10),
    color: colors.gray,
    marginTop: scales(10),
    textAlign: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: scales(15),
  },
  sectionTitle: {
    fontSize: scales(16),
    fontFamily: fontFamily.bold,
    color: colors.black,
  },
  viewAll: {
    fontSize: scales(12),
    color: colors.gray,
  },
  tripItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#E8F1FF",
    padding: scales(12),
    borderRadius: scales(15),
    marginBottom: scales(10),
  },
  tripLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: scales(12),
  },
  tripIconBg: {
    width: scales(40),
    height: scales(40),
    backgroundColor: "white",
    borderRadius: scales(10),
    justifyContent: "center",
    alignItems: "center",
  },
  smallCar: {
    width: scales(25),
    height: scales(20),
  },
  tripInfo: {
    gap: scales(2),
  },
  tripId: {
    fontSize: scales(14),
    fontFamily: fontFamily.bold,
    color: colors.black,
  },
  tripTime: {
    fontSize: scales(10),
    color: colors.gray,
  },
  tripRoute: {
    fontSize: scales(12),
    color: colors.gray,
  },
  tripRight: {
    alignItems: "flex-end",
    gap: scales(4),
  },
  tripPrice: {
    fontSize: scales(16),
    fontFamily: fontFamily.bold,
    color: colors.black,
  },
  tripRating: {
    fontSize: scales(10),
    color: colors.black,
  },
  segmentedContainer: {
    flexDirection: "row",
    backgroundColor: colors.blue,
    borderRadius: scales(15),
    padding: scales(5),
    marginTop: scales(20),
  },
  tab: {
    flex: 1,
    paddingVertical: scales(10),
    alignItems: "center",
    borderRadius: scales(12),
  },
  activeTab: {
    backgroundColor: "white",
  },
  tabText: {
    fontSize: scales(14),
    color: colors.white,
    fontFamily: fontFamily.medium,
  },
  activeTabText: {
    color: colors.blue,
  },
  finalSummary: {
    backgroundColor: "white",
    borderRadius: scales(20),
    padding: scales(25),
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    marginTop: scales(20),
    alignItems: "center",
  },
  finalAmount: {
    fontSize: scales(32),
    fontFamily: fontFamily.bold,
    color: colors.black,
  },
  finalSubtext: {
    fontSize: scales(12),
    color: colors.gray,
    marginTop: scales(5),
  },
});
