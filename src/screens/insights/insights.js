import React, { useState, useMemo, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { AppBackground, Header, Spacer } from "../../components";
import { colors, scales } from "../../utils";
import { fontFamily, appImages } from "../../assets";

const THEME_GRADIENT = [colors.orange, colors.storyRing, colors.lightRed];
const SUBTITLE_COLOR = colors.subtitleGray;
const DIM_LABEL_COLOR = colors.dimLabelGray;

const PERIOD_DATA = {
  "24 Hours": {
    totalViews: "12.4K",
    viewsTrend: "+8.2% vs avg",
    watchTime: "940 hrs",
    watchTrend: "+4.1% vs avg",
    engagement: "19.2%",
    engTrend: "+2.5% vs avg",
    shares: "412",
    sharesTrend: "+11.0% vs avg",
    chartTitle: "Hourly Views Distribution",
    selectedPointText: "Peak Traffic - 8 PM (2,480 Views)",
    bars: [
      { label: "12a", value: "34%", count: "420 Views" },
      { label: "4a", value: "15%", count: "180 Views" },
      { label: "8a", value: "55%", count: "980 Views" },
      { label: "12p", value: "75%", count: "1,450 Views" },
      { label: "4p", value: "85%", count: "1,980 Views" },
      { label: "8p", value: "95%", count: "2,480 Views" },
      { label: "11p", value: "65%", count: "1,240 Views" },
    ],
  },
  "7 Days": {
    totalViews: "184.2K",
    viewsTrend: "+24.8% vs last week",
    watchTime: "14.8K hrs",
    watchTrend: "+18.1% vs last week",
    engagement: "18.6%",
    engTrend: "+3.4% vs last week",
    shares: "4,210",
    sharesTrend: "+15.2% vs last week",
    chartTitle: "Daily Views Performance",
    selectedPointText: "Friday - Peak Day (42,850 Views)",
    bars: [
      { label: "Mon", value: "50%", count: "21,400 Views" },
      { label: "Tue", value: "65%", count: "28,200 Views" },
      { label: "Wed", value: "45%", count: "19,800 Views" },
      { label: "Thu", value: "78%", count: "34,100 Views" },
      { label: "Fri", value: "95%", count: "42,850 Views" },
      { label: "Sat", value: "88%", count: "38,400 Views" },
      { label: "Sun", value: "70%", count: "31,500 Views" },
    ],
  },
  "30 Days": {
    totalViews: "642.8K",
    viewsTrend: "+42.1% vs last month",
    watchTime: "58.4K hrs",
    watchTrend: "+34.5% vs last month",
    engagement: "21.0%",
    engTrend: "+5.1% vs last month",
    shares: "16.8K",
    sharesTrend: "+28.4% vs last month",
    chartTitle: "Weekly Views Trends",
    selectedPointText: "Week 3 - Record Traffic (194,200 Views)",
    bars: [
      { label: "W1", value: "60%", count: "142,000 Views" },
      { label: "W2", value: "75%", count: "168,400 Views" },
      { label: "W3", value: "95%", count: "194,200 Views" },
      { label: "W4", value: "82%", count: "174,000 Views" },
    ],
  },
  "All Time": {
    totalViews: "2.4M",
    viewsTrend: "Lifetime studio growth",
    watchTime: "248K hrs",
    watchTrend: "Total watch duration",
    engagement: "22.4%",
    engTrend: "Avg across catalog",
    shares: "84.5K",
    sharesTrend: "Total shares generated",
    chartTitle: "Monthly Historical Reach",
    selectedPointText: "July 2026 - Highest Reach (580,000 Views)",
    bars: [
      { label: "Apr", value: "45%", count: "240,000 Views" },
      { label: "May", value: "65%", count: "410,000 Views" },
      { label: "Jun", value: "80%", count: "510,000 Views" },
      { label: "Jul", value: "95%", count: "580,000 Views" },
      { label: "Aug", value: "88%", count: "540,000 Views" },
    ],
  },
};

const TOP_MOVIES = [
  {
    id: "m_1",
    title: "Dhanda Empire",
    genre: "Crime • Drama • 2026",
    poster: appImages.poster1,
    views: "94.8K Views",
    retention: "84% avg",
    rating: "5.0",
  },
  {
    id: "m_2",
    title: "Silent Horizon",
    genre: "Sci-Fi • Mystery • 2025",
    poster: appImages.poster2,
    views: "48.2K Views",
    retention: "76% avg",
    rating: "4.8",
  },
  {
    id: "m_3",
    title: "The Last Shadow",
    genre: "Action • Thriller • 2025",
    poster: appImages.poster3,
    views: "41.2K Views",
    retention: "79% avg",
    rating: "4.9",
  },
];

export const Insights = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("7 Days");
  const [activeBarIndex, setActiveBarIndex] = useState(4);

  const currentData = useMemo(
    () => PERIOD_DATA[selectedPeriod],
    [selectedPeriod],
  );

  const handleBarPress = useCallback((index, item) => {
    setActiveBarIndex(index);
  }, []);

  const handlePeriodChange = useCallback((period) => {
    setSelectedPeriod(period);
    setActiveBarIndex(period === "30 Days" ? 2 : 4);
  }, []);

  const renderPeriodSelector = () => (
    <View style={styles.periodRow}>
      {Object.keys(PERIOD_DATA).map((period) => {
        const isSel = selectedPeriod === period;
        return (
          <TouchableOpacity
            key={period}
            activeOpacity={0.85}
            onPress={() => handlePeriodChange(period)}
            style={styles.periodChipWrapper}
          >
            {isSel ? (
              <LinearGradient
                colors={THEME_GRADIENT}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.periodChip}
              >
                <Text style={styles.periodTextActive}>{period}</Text>
              </LinearGradient>
            ) : (
              <View style={[styles.periodChip, styles.periodChipInactive]}>
                <Text style={styles.periodText}>{period}</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderChartCard = () => {
    const activeBar = currentData.bars[activeBarIndex] || currentData.bars[0];
    return (
      <View style={styles.chartCard}>
        <View style={styles.chartHeaderRow}>
          <View style={styles.chartHeaderLeft}>
            <Text style={styles.chartTitle}>{currentData.chartTitle}</Text>
            <Text style={styles.chartSubtitle}>
              {activeBar
                ? `${activeBar.label} — ${activeBar.count}`
                : currentData.selectedPointText}
            </Text>
          </View>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Live Stats</Text>
          </View>
        </View>

        <View style={styles.graphContainer}>
          {currentData.bars.map((bar, idx) => {
            const isSelected = idx === activeBarIndex;
            return (
              <TouchableOpacity
                key={`bar-${idx}`}
                style={styles.barColumn}
                activeOpacity={0.8}
                onPress={() => handleBarPress(idx, bar)}
              >
                <View style={styles.barTrack}>
                  <LinearGradient
                    colors={THEME_GRADIENT}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={[
                      styles.barFill,
                      { height: bar.value, opacity: isSelected ? 1 : 0.75 },
                    ]}
                  />
                </View>
                <Text
                  style={[styles.barLabel, isSelected && styles.barLabelActive]}
                >
                  {bar.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const renderKpiGrid = () => (
    <View style={styles.kpiGrid}>
      <View style={styles.kpiCard}>
        <View style={styles.kpiIconRow}>
          <View style={styles.kpiIconBox}>
            <Image
              source={appImages.reels || appImages.play}
              style={styles.kpiIcon}
              tintColor={colors.white}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.trendBadge}>{currentData.viewsTrend}</Text>
        </View>
        <Text style={styles.kpiValue}>{currentData.totalViews}</Text>
        <Text style={styles.kpiLabel}>Total Video Views</Text>
      </View>

      <View style={styles.kpiCard}>
        <View style={styles.kpiIconRow}>
          <View style={styles.kpiIconBox}>
            <Image
              source={appImages.history || appImages.clock}
              style={styles.kpiIcon}
              tintColor={colors.white}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.trendBadge}>{currentData.watchTrend}</Text>
        </View>
        <Text style={styles.kpiValue}>{currentData.watchTime}</Text>
        <Text style={styles.kpiLabel}>Total Watch Time</Text>
      </View>

      <View style={styles.kpiCard}>
        <View style={styles.kpiIconRow}>
          <View style={styles.kpiIconBox}>
            <Image
              source={appImages.like}
              style={styles.kpiIcon}
              tintColor={colors.white}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.trendBadge}>{currentData.engTrend}</Text>
        </View>
        <Text style={styles.kpiValue}>{currentData.engagement}</Text>
        <Text style={styles.kpiLabel}>Engagement Rate</Text>
      </View>

      <View style={styles.kpiCard}>
        <View style={styles.kpiIconRow}>
          <View style={styles.kpiIconBox}>
            <Image
              source={appImages.share || appImages.saved}
              style={styles.kpiIcon}
              tintColor={colors.white}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.trendBadge}>{currentData.sharesTrend}</Text>
        </View>
        <Text style={styles.kpiValue}>{currentData.shares}</Text>
        <Text style={styles.kpiLabel}>Shares & Saves</Text>
      </View>
    </View>
  );

  const renderDetailedInsights = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Audience Traffic & Retention</Text>
      <View style={styles.breakdownCard}>
        <View style={styles.metricRow}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricTitle}>
              Average Movie Completion Rate
            </Text>
            <Text style={styles.metricPercent}>74%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <LinearGradient
              colors={THEME_GRADIENT}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressBarFill, { width: "74%" }]}
            />
          </View>
        </View>

        <View style={styles.metricRow}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricTitle}>
              Direct Profile & Studio Visits
            </Text>
            <Text style={styles.metricPercent}>14,280</Text>
          </View>
          <View style={styles.progressBarBg}>
            <LinearGradient
              colors={THEME_GRADIENT}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressBarFill, { width: "85%" }]}
            />
          </View>
        </View>

        <View style={styles.metricRow}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricTitle}>
              External Social Shares & Links
            </Text>
            <Text style={styles.metricPercent}>3,940</Text>
          </View>
          <View style={styles.progressBarBg}>
            <LinearGradient
              colors={THEME_GRADIENT}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressBarFill, { width: "52%" }]}
            />
          </View>
        </View>

        <View style={[styles.metricRow, { marginBottom: 0 }]}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricTitle}>
              Active Comment & Slate Discussions
            </Text>
            <Text style={styles.metricPercent}>1,120</Text>
          </View>
          <View style={styles.progressBarBg}>
            <LinearGradient
              colors={THEME_GRADIENT}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressBarFill, { width: "64%" }]}
            />
          </View>
        </View>
      </View>
    </View>
  );

  const renderTopMovies = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Top Performing Cinema Slates</Text>
      <View style={styles.moviesCard}>
        {TOP_MOVIES.map((item, idx) => (
          <View
            key={item.id}
            style={[
              styles.movieRow,
              idx < TOP_MOVIES.length - 1 && styles.movieBorder,
            ]}
          >
            <Image
              source={item.poster}
              style={styles.moviePoster}
              resizeMode="cover"
            />
            <View style={styles.movieInfo}>
              <Text style={styles.movieTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.movieGenre}>{item.genre}</Text>
              <View style={styles.statsRow}>
                <Text style={styles.viewsTag}>{item.views}</Text>
                <Text style={styles.retentionTag}>{item.retention}</Text>
              </View>
            </View>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingNum}>★ {item.rating}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <AppBackground>
      <Header label="Studio Insights & Analytics" showBackButton={true} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderPeriodSelector()}
        {renderChartCard()}
        {renderKpiGrid()}
        {renderDetailedInsights()}
        {renderTopMovies()}
      </ScrollView>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: scales(34),
    paddingTop: scales(12),
  },
  periodRow: {
    flexDirection: "row",
    paddingHorizontal: scales(16),
    marginBottom: scales(16),
    gap: scales(8),
  },
  periodChipWrapper: {
    flex: 1,
    borderRadius: scales(20),
    overflow: "hidden",
  },
  periodChip: {
    height: scales(42),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: scales(20),
    paddingHorizontal: scales(4),
  },
  periodChipInactive: {
    backgroundColor: colors.transparentWhite8,
    borderWidth: 1,
    borderColor: colors.transparentWhite15,
  },
  periodText: {
    color: SUBTITLE_COLOR,
    fontFamily: fontFamily.medium,
    fontSize: scales(12),
  },
  periodTextActive: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(12),
  },
  chartCard: {
    marginHorizontal: scales(16),
    marginBottom: scales(20),
    backgroundColor: colors.transparentWhite5,
    borderWidth: 1,
    borderColor: colors.transparentWhite12,
    borderRadius: scales(22),
    padding: scales(18),
  },
  chartHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: scales(20),
  },
  chartHeaderLeft: {
    flex: 1,
    marginRight: scales(10),
  },
  chartTitle: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(16),
  },
  chartSubtitle: {
    color: SUBTITLE_COLOR,
    fontFamily: fontFamily.medium,
    fontSize: scales(13),
    marginTop: scales(4),
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.transparentWhite12,
    paddingHorizontal: scales(10),
    paddingVertical: scales(6),
    borderRadius: scales(14),
    borderWidth: 1,
    borderColor: colors.transparentWhite15,
  },
  liveDot: {
    width: scales(7),
    height: scales(7),
    borderRadius: scales(3.5),
    backgroundColor: colors.orange,
    marginRight: scales(6),
  },
  liveText: {
    color: colors.white,
    fontFamily: fontFamily.semiBold,
    fontSize: scales(11),
  },
  graphContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: scales(150),
    paddingTop: scales(10),
  },
  barColumn: {
    flex: 1,
    alignItems: "center",
  },
  barTrack: {
    width: scales(18),
    height: scales(110),
    backgroundColor: colors.transparentWhite5,
    borderRadius: scales(9),
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barFill: {
    width: "100%",
    borderRadius: scales(9),
  },
  barLabel: {
    color: DIM_LABEL_COLOR,
    fontFamily: fontFamily.medium,
    fontSize: scales(12),
    marginTop: scales(8),
  },
  barLabelActive: {
    color: colors.white,
    fontFamily: fontFamily.bold,
  },
  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: scales(16),
    justifyContent: "space-between",
    gap: scales(12),
    marginBottom: scales(24),
  },
  kpiCard: {
    width: "48%",
    backgroundColor: colors.transparentWhite5,
    borderWidth: 1,
    borderColor: colors.transparentWhite10,
    borderRadius: scales(18),
    padding: scales(14),
  },
  kpiIconRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: scales(12),
  },
  kpiIconBox: {
    width: scales(36),
    height: scales(36),
    borderRadius: scales(10),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.transparentWhite10,
  },
  kpiIcon: {
    width: scales(18),
    height: scales(18),
  },
  trendBadge: {
    color: SUBTITLE_COLOR,
    fontFamily: fontFamily.medium,
    fontSize: scales(11),
    flex: 1,
    textAlign: "right",
    marginLeft: scales(6),
  },
  kpiValue: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(22),
  },
  kpiLabel: {
    color: SUBTITLE_COLOR,
    fontFamily: fontFamily.medium,
    fontSize: scales(13),
    marginTop: scales(2),
  },
  sectionContainer: {
    marginHorizontal: scales(16),
    marginBottom: scales(24),
  },
  sectionTitle: {
    color: colors.white,
    fontFamily: fontFamily.semiBold,
    fontSize: scales(17),
    marginBottom: scales(12),
    marginLeft: scales(4),
  },
  breakdownCard: {
    backgroundColor: colors.transparentWhite5,
    borderWidth: 1,
    borderColor: colors.transparentWhite10,
    borderRadius: scales(20),
    padding: scales(18),
  },
  metricRow: {
    marginBottom: scales(16),
  },
  metricHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: scales(6),
  },
  metricTitle: {
    color: colors.white,
    fontFamily: fontFamily.medium,
    fontSize: scales(13),
  },
  metricPercent: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(13),
  },
  progressBarBg: {
    height: scales(7),
    backgroundColor: colors.transparentWhite10,
    borderRadius: scales(4),
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: scales(4),
  },
  moviesCard: {
    backgroundColor: colors.transparentWhite5,
    borderWidth: 1,
    borderColor: colors.transparentWhite10,
    borderRadius: scales(20),
    padding: scales(14),
  },
  movieRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: scales(10),
  },
  movieBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.transparentWhite8,
  },
  moviePoster: {
    width: scales(46),
    height: scales(62),
    borderRadius: scales(8),
    marginRight: scales(12),
  },
  movieInfo: {
    flex: 1,
  },
  movieTitle: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(15),
  },
  movieGenre: {
    color: SUBTITLE_COLOR,
    fontFamily: fontFamily.medium,
    fontSize: scales(12),
    marginTop: scales(2),
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scales(10),
    marginTop: scales(6),
  },
  viewsTag: {
    color: colors.white,
    fontFamily: fontFamily.semiBold,
    fontSize: scales(12),
  },
  retentionTag: {
    color: SUBTITLE_COLOR,
    fontFamily: fontFamily.medium,
    fontSize: scales(12),
  },
  ratingBadge: {
    backgroundColor: colors.transparentWhite10,
    paddingHorizontal: scales(8),
    paddingVertical: scales(4),
    borderRadius: scales(8),
  },
  ratingNum: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(12),
  },
});
