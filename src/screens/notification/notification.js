import React, { useCallback } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView } from "react-native";
import { AppBackground, Header } from "../../components";
import { colors, scales } from "../../utils";
import { fontFamily, appImages } from "../../assets";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";

const HIGH_PRIORITY_DATA = [
  {
    id: "hp1",
    type: "mention",
    user: "alex_design",
    action: "Mentioned you in a Project",
    time: "10m",
    icon: appImages.chat,
    color: colors.blue,
  },
  {
    id: "hp2",
    type: "follow",
    user: "sarah_creates",
    action: "Started following you",
    time: "1h",
    icon: appImages.follow,
    color: colors.green,
  },
];

const TIMELINE_DATA = [
  {
    id: "t1",
    type: "like",
    user: "mike_builds",
    action: "Appreciated your recent Slate",
    time: "2h ago",
    icon: appImages.heart,
    read: false,
  },
  {
    id: "t2",
    type: "comment",
    user: "jessica_art",
    action: "Commented: 'This is absolutely stunning!'",
    time: "5h ago",
    icon: appImages.comment,
    read: true,
  },
  {
    id: "t3",
    type: "like",
    user: "david_ux",
    action: "Appreciated your Project 'Neon Dreams'",
    time: "1d ago",
    icon: appImages.heart,
    read: true,
  },
  {
    id: "t4",
    type: "tag",
    user: "emma_studio",
    action: "Tagged you in a Bite",
    time: "2d ago",
    icon: appImages.tag,
    read: true,
  },
];

const HighPriorityCard = ({ item, index }) => (
  <Animated.View 
    entering={FadeInRight.delay(index * 100).springify()} 
    style={[styles.hpCard, { borderTopColor: item.color }]}
  >
    <View style={styles.hpHeader}>
      <View style={[styles.hpIconWrap, { backgroundColor: item.color + "20" }]}>
        <Image source={item.icon} style={[styles.hpIcon, { tintColor: item.color }]} />
      </View>
      <Text style={styles.hpTime}>{item.time}</Text>
    </View>
    <Text style={styles.hpUser}>{item.user}</Text>
    <Text style={styles.hpAction} numberOfLines={2}>{item.action}</Text>
  </Animated.View>
);

const TimelineItem = ({ item, index }) => (
  <Animated.View entering={FadeInDown.delay(index * 100 + 300).springify()} style={styles.timelineWrapper}>
    <View style={styles.timelineLeft}>
      <View style={[styles.timelineDot, !item.read && styles.timelineDotUnread]} />
      <View style={styles.timelineLine} />
    </View>
    <TouchableOpacity activeOpacity={0.7} style={[styles.timelineCard, !item.read && styles.timelineCardUnread]}>
      <View style={styles.timelineCardHeader}>
        <Image source={appImages.dummyuser} style={styles.avatar} />
        <View style={styles.timelineTextContent}>
          <Text style={styles.timelineUser}>{item.user}</Text>
          <Text style={styles.timelineAction}>{item.action}</Text>
        </View>
        <Image source={item.icon} style={styles.timelineIconType} />
      </View>
      <Text style={styles.timelineTime}>{item.time}</Text>
    </TouchableOpacity>
  </Animated.View>
);

export const Notification = () => {
  const renderTimelineItem = useCallback(({ item, index }) => <TimelineItem item={item} index={index} />, []);

  return (
    <AppBackground>
      <Header label="UPDATES" showBackButton={true} filterIcon={false} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* High Priority Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PRIORITY</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hpScroll}>
            {HIGH_PRIORITY_DATA.map((item, index) => (
              <HighPriorityCard key={item.id} item={item} index={index} />
            ))}
          </ScrollView>
        </View>

        {/* Timeline Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACTIVITY TIMELINE</Text>
          <View style={styles.timelineContainer}>
            {TIMELINE_DATA.map((item, index) => (
              <TimelineItem key={item.id} item={item} index={index} />
            ))}
          </View>
        </View>

      </ScrollView>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: scales(100),
  },
  section: {
    marginTop: scales(20),
  },
  sectionTitle: {
    fontFamily: fontFamily.bold,
    fontSize: scales(11),
    color: colors.transparentWhite40,
    letterSpacing: 2.5,
    marginLeft: scales(20),
    marginBottom: scales(16),
  },
  hpScroll: {
    paddingHorizontal: scales(20),
    gap: scales(16),
  },
  hpCard: {
    width: scales(150),
    backgroundColor: colors.transparentWhite5,
    borderRadius: scales(20),
    padding: scales(16),
    borderTopWidth: 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.transparentWhite10,
  },
  hpHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: scales(16),
  },
  hpIconWrap: {
    width: scales(36),
    height: scales(36),
    borderRadius: scales(18),
    justifyContent: "center",
    alignItems: "center",
  },
  hpIcon: {
    width: scales(18),
    height: scales(18),
    resizeMode: "contain",
  },
  hpTime: {
    fontFamily: fontFamily.medium,
    fontSize: scales(12),
    color: colors.transparentWhite40,
  },
  hpUser: {
    fontFamily: fontFamily.bold,
    fontSize: scales(14),
    color: colors.white,
    marginBottom: scales(4),
  },
  hpAction: {
    fontFamily: fontFamily.regular,
    fontSize: scales(12),
    color: colors.transparentWhite85,
    lineHeight: scales(18),
  },
  timelineContainer: {
    paddingHorizontal: scales(20),
  },
  timelineWrapper: {
    flexDirection: "row",
    marginBottom: scales(16),
  },
  timelineLeft: {
    width: scales(30),
    alignItems: "center",
  },
  timelineDot: {
    width: scales(10),
    height: scales(10),
    borderRadius: scales(5),
    backgroundColor: colors.transparentWhite15,
    marginTop: scales(16),
    zIndex: 1,
  },
  timelineDotUnread: {
    backgroundColor: colors.white,
    shadowColor: colors.white,
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 5,
  },
  timelineLine: {
    position: "absolute",
    top: scales(26),
    bottom: -scales(26),
    width: 2,
    backgroundColor: colors.transparentWhite5,
  },
  timelineCard: {
    flex: 1,
    backgroundColor: colors.transparentWhite5,
    borderRadius: scales(20),
    padding: scales(16),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.transparentWhite10,
  },
  timelineCardUnread: {
    backgroundColor: colors.transparentWhite10,
    borderColor: colors.transparentWhite40,
  },
  timelineCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: scales(12),
  },
  avatar: {
    width: scales(40),
    height: scales(40),
    borderRadius: scales(20),
    marginRight: scales(12),
  },
  timelineTextContent: {
    flex: 1,
  },
  timelineUser: {
    fontFamily: fontFamily.bold,
    fontSize: scales(14),
    color: colors.white,
    marginBottom: scales(2),
  },
  timelineAction: {
    fontFamily: fontFamily.regular,
    fontSize: scales(13),
    color: colors.transparentWhite85,
  },
  timelineIconType: {
    width: scales(18),
    height: scales(18),
    tintColor: colors.transparentWhite40,
    resizeMode: "contain",
  },
  timelineTime: {
    fontFamily: fontFamily.medium,
    fontSize: scales(11),
    color: colors.transparentWhite40,
    alignSelf: "flex-end",
  },
});
