import { View, Text, StyleSheet, ScrollView } from "react-native";
import { AppBackground, Header, NextButton } from "../../components";
import { colors, scales, commonText } from "../../utils";
import { appImages, fontFamily } from "../../assets";

export const DataUsage = () => {
  const Section = ({ title, children }) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );

  return (
    <AppBackground>
      <Header label={commonText.dataUsage} showBackButton={true} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Section title="Media Quality">
          <NextButton leftIcon={appImages.dummyuser} label="Use Less Cellular Data" onPress={() => {}} />
          <NextButton leftIcon={appImages.dummyuser} label="High Quality Uploads" onPress={() => {}} />
        </Section>
        <Section title="Cache">
          <NextButton leftIcon={appImages.dummyuser} label="Clear Cache" onPress={() => {}} />
        </Section>
      </ScrollView>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: scales(20), paddingTop: scales(20) },
  sectionContainer: { marginHorizontal: scales(16), marginBottom: scales(24) },
  sectionTitle: {
    color: colors.white,
    fontFamily: fontFamily.semiBold,
    fontSize: scales(18),
    marginBottom: scales(12),
    marginLeft: scales(4),
  },
  sectionCard: {
    backgroundColor: colors.transparentWhite5,
    borderRadius: scales(20),
    paddingVertical: scales(5),
  },
});
