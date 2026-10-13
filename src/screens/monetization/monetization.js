import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import LottieView from "lottie-react-native";
import {
  AppBackground,
  Header,
  CustomInput,
  CustomButton,
  Spacer,
} from "../../components";
import { commonText } from "../../utils";
import { appImages } from "../../assets";
import { animations } from "../../animations/animations";
import { goBack } from "../../navigation/navigationServices";
import { styles } from "./monetizationStyles";

const CheckboxItem = ({ checked, label, onToggle }) => (
  <TouchableOpacity
    style={styles.agreementRow}
    onPress={onToggle}
    activeOpacity={0.8}
  >
    <View style={[styles.checkBox, checked && styles.checkBoxChecked]}>
      {checked && (
        <Image source={appImages.check} style={styles.checkBoxIcon} />
      )}
    </View>
    <Text style={styles.agreementText}>{label}</Text>
  </TouchableOpacity>
);

export const Monetization = () => {
  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("");
  const [payoutEmail, setPayoutEmail] = useState("");
  const [agreeCopyright, setAgreeCopyright] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      fullName.trim().length > 0 &&
      country.trim().length > 0 &&
      payoutEmail.trim().length > 0 &&
      agreeCopyright &&
      agreeTerms
    );
  }, [fullName, country, payoutEmail, agreeCopyright, agreeTerms]);

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return;
    setSubmitted(true);
  }, [canSubmit]);

  return (
    <AppBackground showAuthAnimation={true}>
      <Header label={commonText.monetization} showBackButton={true} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {submitted ? (
            <View style={styles.successContainer}>
              <LottieView
                source={animations.success}
                autoPlay
                loop={false}
                style={styles.lottieIcon}
              />
              <Text style={styles.successTitle}>
                {commonText.applicationSubmittedTitle}
              </Text>
              <Text style={styles.successDescription}>
                {commonText.applicationSubmittedDesc}
              </Text>
              <View style={styles.returnButtonWrapper}>
                <CustomButton
                  label={commonText.returnToSettings}
                  onPress={() => goBack()}
                />
              </View>
            </View>
          ) : (
            <>
              {/* Hero Title and Subtitle */}
              <View style={styles.heroContainer}>
                <Text style={styles.title}>
                  {commonText.monetizeMasterpieces}
                </Text>
                <Text style={styles.subtitle}>
                  {commonText.monetizationSubtitle}
                </Text>
              </View>

              {/* Eligibility Checklist Card */}
              <Text style={styles.sectionTitle}>
                {commonText.eligibilityChecklist}
              </Text>
              <View style={styles.card}>
                <View style={styles.checkRow}>
                  <View style={styles.checkCircle}>
                    <Image source={appImages.check} style={styles.checkIcon} />
                  </View>
                  <Text style={styles.checkText}>{commonText.reqViews}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.checkRow}>
                  <View style={styles.checkCircle}>
                    <Image source={appImages.check} style={styles.checkIcon} />
                  </View>
                  <Text style={styles.checkText}>{commonText.reqOriginal}</Text>
                </View>
              </View>

              {/* Application Form */}
              <Text style={styles.sectionTitle}>
                {commonText.applicationForm}
              </Text>
              <View style={styles.card}>
                <View style={styles.inputSpacing}>
                  <CustomInput
                    label={commonText.fullLegalName}
                    placeholder={commonText.enterLegalName}
                    value={fullName}
                    onChangeText={setFullName}
                  />
                </View>
                <View style={styles.inputSpacing}>
                  <CustomInput
                    label={commonText.countryOfResidence}
                    placeholder={commonText.enterCountry}
                    value={country}
                    onChangeText={setCountry}
                  />
                </View>
                <View>
                  <CustomInput
                    label={commonText.payoutEmail}
                    placeholder={commonText.enterPayoutEmail}
                    value={payoutEmail}
                    onChangeText={setPayoutEmail}
                  />
                </View>
              </View>

              {/* Legal Agreements */}
              <Text style={styles.sectionTitle}>
                {commonText.legalAgreements}
              </Text>
              <View style={styles.card}>
                <CheckboxItem
                  checked={agreeCopyright}
                  label={commonText.copyrightAgreement}
                  onToggle={() => setAgreeCopyright(!agreeCopyright)}
                />
                <View style={styles.divider} />
                <Spacer height={16} />
                <CheckboxItem
                  checked={agreeTerms}
                  label={commonText.termsAgreement}
                  onToggle={() => setAgreeTerms(!agreeTerms)}
                />
              </View>

              {/* Submit Action */}
              <View
                style={[
                  styles.submitButtonWrapper,
                  !canSubmit && styles.disabledButton,
                ]}
              >
                <CustomButton
                  label={commonText.submitApplication}
                  onPress={handleSubmit}
                  disable={!canSubmit}
                />
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </AppBackground>
  );
};
