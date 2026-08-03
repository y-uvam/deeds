import React, { useState, useRef, useCallback, memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  AppBackground,
  Header,
  Spacer,
  CustomInput,
  CustomBottomSheet,
  CustomButton,
} from "../../components";
import { colors, commonText, scales } from "../../utils";
import { appImages, fontFamily } from "../../assets";
import { setProfileData } from "../../redux/slices/persistedSlice";

const InfoRow = memo(({ label, value, onPress, isLast }) => (
  <TouchableOpacity
    style={[styles.row, !isLast && styles.borderBottom]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.rowLabelContainer}>
      <Text style={styles.label}>{label}</Text>
    </View>
    <View style={styles.rowValueContainer}>
      <Text style={styles.value} numberOfLines={1}>
        {value || commonText.addPrefix + label}
      </Text>
      <Image source={appImages.backarrow} style={styles.chevron} />
    </View>
  </TouchableOpacity>
));

const ImageOption = memo(({ label, icon, onPress, isDestructive }) => (
  <TouchableOpacity
    style={styles.optionRow}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Image
      source={icon}
      style={[styles.optionIcon, isDestructive && { tintColor: colors.red }]}
    />

    <Text style={[styles.optionLabel, isDestructive && { color: colors.red }]}>
      {label}
    </Text>
  </TouchableOpacity>
));

export const Editprofile = () => {
  const dispatch = useDispatch();
  const profileData = useSelector((state) => state.persist.profileData);
  const editSheetRef = useRef(null);
  const imageSheetRef = useRef(null);

  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");

  const handleEditPress = useCallback(
    (field) => {
      setEditingField(field);
      setTempValue(profileData?.[field.key] || "");
      editSheetRef.current?.present();
    },
    [profileData],
  );

  const handleSave = useCallback(() => {
    if (editingField) {
      const updatedData = {
        ...(profileData || {}),
        [editingField.key]: tempValue,
      };
      dispatch(setProfileData(updatedData));
      editSheetRef.current?.dismiss();
    }
  }, [editingField, tempValue, profileData, dispatch]);

  const fields = [
    { key: "name", label: "Full Name", placeholder: "Enter your full name" },
    { key: "username", label: "Username", placeholder: "Enter username" },
    { key: "bio", label: "Bio", placeholder: "Enter bio", multiline: true },
    { key: "email", label: "Email", placeholder: "Enter email address" },
  ];

  return (
    <AppBackground>
      <Header label={commonText.editProfile} showBackButton={true} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={() => imageSheetRef.current?.present()}
          activeOpacity={0.8}
        >
          <View style={styles.avatarWrapper}>
            <Image
              source={profileData?.profileImage || appImages.dummyuser}
              style={styles.avatar}
            />
            <View style={styles.editIconBadge}>
              <Image source={appImages.edit} style={styles.plusIcon} />
            </View>
          </View>
          <Spacer height={scales(12)} />
          <Text style={styles.editAvatarText}>{commonText.uploadanimage}</Text>
        </TouchableOpacity>

        <Spacer height={scales(40)} />

        <View style={styles.infoContainer}>
          {fields.map((field, index) => (
            <InfoRow
              key={field.key}
              label={field.label}
              value={profileData?.[field.key] || ""}
              onPress={() => handleEditPress(field)}
              isLast={index === fields.length - 1}
            />
          ))}
        </View>
      </ScrollView>

      <CustomBottomSheet
        ref={editSheetRef}
        title={editingField?.label}
        subtitle={editingField?.placeholder}
        snapPoints={["45%"]}
        useBlur={true}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <CustomInput
            value={tempValue}
            onChangeText={setTempValue}
            placeholder={editingField?.placeholder}
            multiline={editingField?.multiline}
            height={editingField?.multiline ? scales(120) : scales(60)}
            isBottomSheet={true}
            autoFocus={true}
          />
          <Spacer height={scales(20)} />
          <CustomButton label={commonText.Update} onPress={handleSave} />
          <Spacer height={scales(20)} />
        </KeyboardAvoidingView>
      </CustomBottomSheet>

      <CustomBottomSheet
        ref={imageSheetRef}
        snapPoints={["35%"]}
        useBlur={true}
      >
        <View style={styles.optionsContainer}>
          <ImageOption
            label={commonText.takePhoto}
            icon={appImages.camera}
            onPress={() => {}}
          />
          <ImageOption
            label={commonText.chooseGallery}
            icon={appImages.gallery}
            onPress={() => {}}
          />
          {profileData?.profileImage && (
            <ImageOption
              label={commonText.removeCurrent}
              icon={appImages.bin}
              isDestructive={true}
              onPress={() => {}}
            />
          )}
        </View>
      </CustomBottomSheet>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: scales(40),
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: scales(20),
  },
  avatarWrapper: {
    padding: scales(3),
    borderRadius: scales(70),
    position: "relative",
  },
  avatar: {
    width: scales(80),
    height: scales(80),
    borderRadius: scales(40),
    backgroundColor: colors.darkblack,
  },
  editIconBadge: {
    position: "absolute",
    bottom: scales(2),
    right: scales(2),
    backgroundColor: colors.storyRing,
    width: scales(25),
    height: scales(25),
    borderRadius: scales(13),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: colors.black,
  },
  plusIcon: {
    width: scales(14),
    height: scales(14),
    tintColor: colors.white,
  },
  editAvatarText: {
    color: colors.blue,
    fontSize: scales(14),
    fontFamily: fontFamily.bold,
  },
  infoContainer: {
    backgroundColor: "rgba(255,255,255,0.03)",
    marginHorizontal: scales(20),
    borderRadius: scales(20),
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: scales(18),
    paddingHorizontal: scales(20),
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  rowLabelContainer: {
    flex: 0.35,
  },
  label: {
    color: "rgba(255,255,255,0.5)",
    fontSize: scales(14),
    fontFamily: fontFamily.medium,
  },
  rowValueContainer: {
    flex: 0.65,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  value: {
    color: colors.white,
    fontSize: scales(15),
    fontFamily: fontFamily.regular,
    marginRight: scales(8),
    flex: 1,
    textAlign: "right",
  },
  chevron: {
    width: scales(12),
    height: scales(12),
    tintColor: "rgba(255,255,255,0.3)",
    transform: [{ rotate: "180deg" }],
  },
  optionsContainer: {
    paddingBottom: scales(10),
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: scales(14),
    gap: scales(10),
  },
  optionIconCircle: {
    width: scales(44),
    height: scales(44),
    borderRadius: scales(22),
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: scales(15),
  },
  destructiveBg: {
    backgroundColor: "rgba(255,100,100,0.1)",
  },
  optionIcon: {
    width: scales(20),
    height: scales(20),
    tintColor: colors.white,
  },
  optionLabel: {
    color: colors.white,
    fontSize: scales(16),
    fontFamily: fontFamily.medium,
  },
});
