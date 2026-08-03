import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  AppBackground,
  Header,
  NextButton,
  Spacer,
  CustomBottomSheet,
  CustomButton,
} from "../../components";
import { colors, scales, commonText } from "../../utils";
import { appImages, fontFamily } from "../../assets";
import { showCustomMessage } from "../../helper/FlashMessage";

export const DataUsage = () => {
  const [autoCleanDrafts, setAutoCleanDrafts] = useState(true);
  const [smartCompression, setSmartCompression] = useState(false);
  const [backgroundSync, setBackgroundSync] = useState(true);
  const [selectedTier, setSelectedTier] = useState("50GB");

  const upgradeSheetRef = useRef(null);

  const Section = ({ title, children }) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );

  const handleClearCache = () => {
    showCustomMessage("Freed up 340 MB of temporary media cache!", "success");
  };

  const handleOpenUpgradeSheet = useCallback(() => {
    upgradeSheetRef.current?.present();
  }, []);

  const handleConfirmUpgrade = () => {
    upgradeSheetRef.current?.dismiss();
    showCustomMessage(
      `Successfully selected the ${selectedTier} Cloud Plan!`,
      "success",
    );
  };

  const renderStorageCard = () => (
    <View style={styles.storageCard}>
      <View style={styles.cardHeaderRow}>
        <View style={styles.storageIconBox}>
          <Image
            source={appImages.dataUsage}
            style={styles.storageIcon}
            tintColor={colors.orange}
            resizeMode="contain"
          />
        </View>
        <View style={styles.cardTitleBox}>
          <Text style={styles.cardTitle}>Cloud Media Storage</Text>
          <Text style={styles.cardSubtitle}>Free Creator Tier (20 GB Max)</Text>
        </View>
      </View>

      <View style={styles.usageNumRow}>
        <Text style={styles.usedNum}>14.8 GB</Text>
        <Text style={styles.totalNum}> / 20 GB used</Text>
      </View>
      <Text style={styles.remainingText}>
        5.2 GB of free storage remaining to upload movies
      </Text>

      <View style={styles.progressBarBg}>
        <View style={styles.progressBarFill} />
      </View>

      <View style={styles.breakdownRow}>
        <View style={styles.breakdownItem}>
          <View style={[styles.dot, { backgroundColor: colors.orange }]} />
          <Text style={styles.breakdownText}>Videos (11.4 GB)</Text>
        </View>
        <View style={styles.breakdownItem}>
          <View style={[styles.dot, { backgroundColor: colors.blue }]} />
          <Text style={styles.breakdownText}>Posters (2.4 GB)</Text>
        </View>
        <View style={styles.breakdownItem}>
          <View
            style={[styles.dot, { backgroundColor: colors.transparentWhite60 }]}
          />
          <Text style={styles.breakdownText}>Drafts (1.0 GB)</Text>
        </View>
      </View>

      <Spacer height={scales(16)} />
      <TouchableOpacity
        style={styles.upgradeBtn}
        activeOpacity={0.8}
        onPress={handleOpenUpgradeSheet}
      >
        <Text style={styles.upgradeBtnText}>Upgrade Storage Capacity</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTierOption = (tierId, title, size, price, desc) => {
    const isSelected = selectedTier === tierId;
    return (
      <TouchableOpacity
        key={tierId}
        style={[styles.tierCard, isSelected && styles.tierCardActive]}
        activeOpacity={0.85}
        onPress={() => setSelectedTier(tierId)}
      >
        <View style={styles.tierHeader}>
          <View style={styles.tierTitleRow}>
            <Text
              style={[styles.tierName, isSelected && styles.tierNameActive]}
            >
              {title}
            </Text>
            <View
              style={[styles.sizeBadge, isSelected && styles.sizeBadgeActive]}
            >
              <Text
                style={[styles.sizeText, isSelected && styles.sizeTextActive]}
              >
                {size}
              </Text>
            </View>
          </View>
          <Text
            style={[styles.tierPrice, isSelected && styles.tierPriceActive]}
          >
            {price}
          </Text>
        </View>
        <Text style={styles.tierDesc}>{desc}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <AppBackground>
      <Header
        label={commonText.dataUsage || "Storage & Data"}
        showBackButton={true}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderStorageCard()}

        <Section title="Storage Cleanup & Management">
          <NextButton
            leftIcon={appImages.imageupload}
            label="Smart Media Compression"
            isSwitch={true}
            switchValue={smartCompression}
            onSwitchChange={(val) => {
              setSmartCompression(val);
              showCustomMessage(
                val
                  ? "Smart video compression enabled to save your 20 GB quota"
                  : "Uploading in raw uncompressed format",
                "info",
              );
            }}
          />

          <NextButton
            leftIcon={appImages.slate}
            label="Auto-Clean Unused Drafts"
            isSwitch={true}
            switchValue={autoCleanDrafts}
            onSwitchChange={(val) => {
              setAutoCleanDrafts(val);
              showCustomMessage(
                val
                  ? "Auto-cleaning of unused movie drafts enabled"
                  : "Auto-cleaning disabled",
                "info",
              );
            }}
          />
          {/* <NextButton
            leftIcon={appImages.archive}
            label="Review & Archive Older Movies"
            onPress={() =>
              showCustomMessage(
                "Scanning your video catalog for archival space...",
                "info",
              )
            }
          /> */}
          <NextButton
            leftIcon={appImages.bin}
            label="Clear Temporary App Cache"
            onPress={handleClearCache}
          />
        </Section>
      </ScrollView>

      <CustomBottomSheet
        ref={upgradeSheetRef}
        snapPoints={["62%"]}
        enablePanDownToClose={true}
        useBlur={true}
        showCloseButton={true}
        title="Upgrade Cloud Quota"
      >
        <View style={styles.sheetContainer}>
          <Text style={styles.sheetHeaderDesc}>
            You have used 14.8 GB of your 20 GB free tier. Choose a high-speed
            studio tier to continue uploading unlimited cinema slates and
            movies.
          </Text>

          <Spacer height={scales(16)} />
          {renderTierOption(
            "50GB",
            "Creator Plus",
            "50 GB",
            "$2.99 / mo",
            "Perfect for regular creators uploading weekly video content and trailers.",
          )}
          <Spacer height={scales(12)} />
          {renderTierOption(
            "200GB",
            "Studio Pro",
            "200 GB",
            "$7.99 / mo",
            "Designed for production studios with ultra-high definition movies & raw slates.",
          )}

          <Spacer height={scales(24)} />
          <CustomButton
            label={`Upgrade to ${selectedTier} Plan`}
            onPress={handleConfirmUpgrade}
          />
        </View>
      </CustomBottomSheet>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: scales(30),
    paddingTop: scales(10),
  },
  storageCard: {
    marginHorizontal: scales(16),
    marginBottom: scales(24),
    backgroundColor: colors.transparentWhite5,
    borderWidth: 1,
    borderColor: colors.transparentWhite12,
    borderRadius: scales(22),
    padding: scales(18),
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: scales(14),
  },
  storageIconBox: {
    width: scales(42),
    height: scales(42),
    borderRadius: scales(12),
    backgroundColor: colors.orange + "26",
    alignItems: "center",
    justifyContent: "center",
    marginRight: scales(12),
  },
  storageIcon: {
    width: scales(22),
    height: scales(22),
  },
  cardTitleBox: {
    flex: 1,
  },
  cardTitle: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(16),
  },
  cardSubtitle: {
    color: colors.orange,
    fontFamily: fontFamily.medium,
    fontSize: scales(12),
    marginTop: scales(2),
  },
  usageNumRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  usedNum: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(28),
  },
  totalNum: {
    color: colors.transparentWhite60,
    fontFamily: fontFamily.semiBold,
    fontSize: scales(15),
  },
  remainingText: {
    color: colors.transparentWhite60,
    fontFamily: fontFamily.regular,
    fontSize: scales(12),
    marginTop: scales(2),
  },
  progressBarBg: {
    height: scales(10),
    backgroundColor: colors.transparentWhite10,
    borderRadius: scales(5),
    overflow: "hidden",
    marginVertical: scales(16),
  },
  progressBarFill: {
    width: "74%",
    height: "100%",
    backgroundColor: colors.orange,
    borderRadius: scales(5),
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: scales(8),
  },
  breakdownItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: scales(8),
    height: scales(8),
    borderRadius: scales(4),
    marginRight: scales(6),
  },
  breakdownText: {
    color: colors.transparentWhite85,
    fontFamily: fontFamily.medium,
    fontSize: scales(11),
  },
  upgradeBtn: {
    backgroundColor: colors.orange + "26",
    borderWidth: 1,
    borderColor: colors.orange,
    paddingVertical: scales(12),
    borderRadius: scales(14),
    alignItems: "center",
  },
  upgradeBtnText: {
    color: colors.orange,
    fontFamily: fontFamily.bold,
    fontSize: scales(14),
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
  sectionCard: {
    backgroundColor: colors.transparentWhite5,
    borderRadius: scales(20),
    paddingVertical: scales(5),
    borderWidth: 1,
    borderColor: colors.transparentWhite8,
  },
  sheetContainer: {
    paddingHorizontal: scales(16),
    paddingBottom: scales(30),
  },
  sheetHeaderDesc: {
    color: colors.transparentWhite85,
    fontFamily: fontFamily.regular,
    fontSize: scales(13),
    lineHeight: scales(20),
  },
  tierCard: {
    backgroundColor: colors.transparentWhite5,
    borderWidth: 1,
    borderColor: colors.transparentWhite12,
    borderRadius: scales(16),
    padding: scales(16),
  },
  tierCardActive: {
    backgroundColor: colors.orange + "1A",
    borderColor: colors.orange,
  },
  tierHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: scales(6),
  },
  tierTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scales(8),
  },
  tierName: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(16),
  },
  tierNameActive: {
    color: colors.orange,
  },
  sizeBadge: {
    backgroundColor: colors.transparentWhite10,
    paddingHorizontal: scales(8),
    paddingVertical: scales(3),
    borderRadius: scales(8),
  },
  sizeBadgeActive: {
    backgroundColor: colors.orange,
  },
  sizeText: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(11),
  },
  sizeTextActive: {
    color: colors.black,
  },
  tierPrice: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(15),
  },
  tierPriceActive: {
    color: colors.orange,
  },
  tierDesc: {
    color: colors.transparentWhite60,
    fontFamily: fontFamily.regular,
    fontSize: scales(12),
    lineHeight: scales(18),
  },
});
