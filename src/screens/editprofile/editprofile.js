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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  AppBackground,
  Spacer,
  CustomInput,
  CustomBottomSheet,
  CustomButton,
} from "../../components";
import { colors, commonText, scales } from "../../utils";
import { appImages, fontFamily } from "../../assets";
import { setProfileData } from "../../redux/slices/persistedSlice";
import { useImagePicker } from "../../hooks/imagePicker";
import { goBack } from "../../navigation";

const CATEGORY_OPTIONS = [
  "Director",
  "Actor",
  "Producer",
  "Writer",
  "Cinematographer",
  "Film Editor",
  "Content Creator",
  "Sound Designer",
  "Musician / Composer",
  "Visual Effects (VFX)",
];

const GENDER_OPTIONS = ["Male", "Female", "Non-binary", "Prefer not to say"];

const SectionCard = ({ title, children }) => (
  <View style={styles.sectionWrapper}>
    {title && <Text style={styles.sectionTitle}>{title}</Text>}
    <View style={styles.infoContainer}>{children}</View>
  </View>
);

const InfoRow = memo(({ label, value, onPress, isLast, icon }) => (
  <TouchableOpacity
    style={[styles.row, !isLast && styles.borderBottom]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.rowLabelContainer}>
      {icon && <Image source={icon} style={styles.rowIcon} />}
      <Text style={styles.label}>{label}</Text>
    </View>
    <View style={styles.rowValueContainer}>
      <Text
        style={[styles.value, !value && styles.placeholderValue]}
        numberOfLines={1}
      >
        {value || `Add ${label}`}
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
      resizeMode="contain"
    />
    <Text style={[styles.optionLabel, isDestructive && { color: colors.red }]}>
      {label}
    </Text>
  </TouchableOpacity>
));

export const Editprofile = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const profileData = useSelector((state) => state.persist.profileData);
  const { openGallery, openCamera } = useImagePicker();

  const editSheetRef = useRef(null);
  const imageSheetRef = useRef(null);
  const selectOptionsSheetRef = useRef(null);

  const [activeImageType, setActiveImageType] = useState("avatar"); // 'avatar' | 'cover'
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [selectOptions, setSelectOptions] = useState({
    title: "",
    list: [],
    key: "",
  });

  const handleEditPress = useCallback(
    (field) => {
      setEditingField(field);
      setTempValue(profileData?.[field.key] || "");
      editSheetRef.current?.present();
    },
    [profileData],
  );

  const handleSelectOptionPress = useCallback((key, title, list) => {
    setSelectOptions({ key, title, list });
    selectOptionsSheetRef.current?.present();
  }, []);

  const handleSelectOptionValue = useCallback(
    (val) => {
      const updatedData = {
        ...(profileData || {}),
        [selectOptions.key]: val,
      };
      dispatch(setProfileData(updatedData));
      selectOptionsSheetRef.current?.dismiss();
    },
    [selectOptions, profileData, dispatch],
  );

  const handleSaveText = useCallback(() => {
    if (editingField) {
      const updatedData = {
        ...(profileData || {}),
        [editingField.key]: tempValue.trim(),
      };
      dispatch(setProfileData(updatedData));
      editSheetRef.current?.dismiss();
    }
  }, [editingField, tempValue, profileData, dispatch]);

  const openImagePickerFor = (type) => {
    setActiveImageType(type);
    imageSheetRef.current?.present();
  };

  const handlePickCamera = async () => {
    imageSheetRef.current?.dismiss();
    const images = await openCamera({
      cropping: true,
      width: activeImageType === "cover" ? 1200 : 500,
      height: activeImageType === "cover" ? 600 : 500,
      mediaType: "photo",
    });

    if (images && images.length > 0) {
      const updatedData = {
        ...(profileData || {}),
        [activeImageType === "cover" ? "coverImage" : "profileImage"]: {
          uri: images[0].path,
        },
      };
      dispatch(setProfileData(updatedData));
    }
  };

  const handlePickGallery = async () => {
    imageSheetRef.current?.dismiss();
    const images = await openGallery({
      cropping: true,
      width: activeImageType === "cover" ? 1200 : 600,
      height: activeImageType === "cover" ? 600 : 600,
      mediaType: "photo",
      multiple: false,
    });

    if (images && images.length > 0) {
      const updatedData = {
        ...(profileData || {}),
        [activeImageType === "cover" ? "coverImage" : "profileImage"]: {
          uri: images[0].path,
        },
      };
      dispatch(setProfileData(updatedData));
    }
  };

  const handleRemoveImage = () => {
    imageSheetRef.current?.dismiss();
    const updatedData = {
      ...(profileData || {}),
      [activeImageType === "cover" ? "coverImage" : "profileImage"]: null,
    };
    dispatch(setProfileData(updatedData));
  };

  const basicFields = [
    { key: "name", label: "Full Name", placeholder: "Enter your full name" },
    {
      key: "username",
      label: "Username",
      placeholder: "Enter username (e.g. yuvam_01)",
    },
    {
      key: "bio",
      label: "Bio",
      placeholder: "Write a short bio about yourself...",
      multiline: true,
    },
    {
      key: "website",
      label: "Website / Link",
      placeholder: "https://yourwebsite.com",
    },
    { key: "email", label: "Email Address", placeholder: "Enter your email" },
  ];

  const socialFields = [
    {
      key: "instagram",
      label: "Instagram",
      placeholder: "@username or profile link",
    },
    {
      key: "youtube",
      label: "YouTube",
      placeholder: "Channel link or @handle",
    },
    {
      key: "twitter",
      label: "Twitter / X",
      placeholder: "@handle or profile link",
    },
    {
      key: "imdb",
      label: "IMDb Profile",
      placeholder: "IMDb profile URL or name",
    },
  ];

  return (
    <AppBackground isTopInset={false} showAuthAnimation={true}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[styles.coverContainer, { height: scales(160) + insets.top }]}
        >
          <Image
            source={
              profileData?.coverImage
                ? typeof profileData.coverImage === "string"
                  ? { uri: profileData.coverImage }
                  : profileData.coverImage
                : appImages.poster1
            }
            style={styles.coverImage}
            resizeMode="cover"
          />
          <View style={styles.coverOverlay} />

          <View
            style={[styles.headerOverlayRow, { top: insets.top + scales(8) }]}
          >
            <TouchableOpacity
              style={styles.backCircleBtn}
              onPress={() => goBack()}
              activeOpacity={0.7}
            >
              <Image
                source={appImages.backarrow}
                style={styles.backIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <View style={styles.headerPlaceholder} />
          </View>

          <TouchableOpacity
            style={styles.editCoverBadge}
            onPress={() => openImagePickerFor("cover")}
            activeOpacity={0.8}
          >
            <Image source={appImages.camera} style={styles.coverBadgeIcon} />
            <Text style={styles.coverBadgeText}>Edit Cover</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.avatarSection}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={() => openImagePickerFor("avatar")}
            activeOpacity={0.8}
          >
            <View style={styles.avatarWrapper}>
              <Image
                source={
                  profileData?.profileImage
                    ? typeof profileData.profileImage === "string"
                      ? { uri: profileData.profileImage }
                      : profileData.profileImage
                    : appImages.dummyuser
                }
                style={styles.avatar}
              />
              <View style={styles.editIconBadge}>
                <Image source={appImages.edit} style={styles.plusIcon} />
              </View>
            </View>
            <Spacer height={scales(8)} />
            <Text style={styles.editAvatarText}>Change Profile Picture</Text>
          </TouchableOpacity>
        </View>

        <Spacer height={scales(20)} />

        <SectionCard title="Basic Information">
          {basicFields.map((field, index) => (
            <InfoRow
              key={field.key}
              label={field.label}
              value={profileData?.[field.key] || ""}
              onPress={() => handleEditPress(field)}
              isLast={false}
            />
          ))}
          <InfoRow
            label="Gender"
            value={profileData?.gender || ""}
            onPress={() =>
              handleSelectOptionPress("gender", "Select Gender", GENDER_OPTIONS)
            }
            isLast={true}
          />
        </SectionCard>
        <SectionCard title="Social Links & Portfolios">
          {socialFields.map((field, index) => (
            <InfoRow
              key={field.key}
              label={field.label}
              value={profileData?.[field.key] || ""}
              onPress={() => handleEditPress(field)}
              isLast={index === socialFields.length - 1}
            />
          ))}
        </SectionCard>
      </ScrollView>

      <CustomBottomSheet
        ref={editSheetRef}
        title={editingField?.label}
        subtitle={editingField?.placeholder}
        snapPoints={editingField?.multiline ? ["52%"] : ["40%"]}
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
            height={editingField?.multiline ? scales(120) : scales(56)}
            isBottomSheet={true}
            autoFocus={true}
          />
          <Spacer height={scales(20)} />
          <CustomButton label={commonText.Update} onPress={handleSaveText} />
          <Spacer height={scales(20)} />
        </KeyboardAvoidingView>
      </CustomBottomSheet>

      {/* Select Category / Gender Bottom Sheet */}
      <CustomBottomSheet
        ref={selectOptionsSheetRef}
        title={selectOptions.title}
        snapPoints={["60%"]}
        useBlur={true}
      >
        <View style={styles.optionsListContainer}>
          {selectOptions.list.map((option, idx) => {
            const isSelected = profileData?.[selectOptions.key] === option;
            return (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.selectOptionItem,
                  isSelected && styles.selectOptionItemSelected,
                ]}
                onPress={() => handleSelectOptionValue(option)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.selectOptionText,
                    isSelected && styles.selectOptionTextSelected,
                  ]}
                >
                  {option}
                </Text>
                {isSelected && (
                  <Image source={appImages.check} style={styles.checkIcon} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </CustomBottomSheet>

      <CustomBottomSheet
        ref={imageSheetRef}
        title={activeImageType === "cover" ? "Cover Banner" : "Profile Picture"}
        subtitle="Choose photo source"
        snapPoints={["32%"]}
        useBlur={true}
      >
        <View style={styles.optionsContainer}>
          <ImageOption
            label={commonText.takePhoto}
            icon={appImages.camera}
            onPress={handlePickCamera}
          />
          <ImageOption
            label={commonText.chooseGallery}
            icon={appImages.gallery}
            onPress={handlePickGallery}
          />
          {(activeImageType === "cover"
            ? profileData?.coverImage
            : profileData?.profileImage) && (
            <ImageOption
              label={
                activeImageType === "cover"
                  ? "Remove Cover Photo"
                  : commonText.removeCurrent
              }
              icon={appImages.bin}
              isDestructive={true}
              onPress={handleRemoveImage}
            />
          )}
        </View>
      </CustomBottomSheet>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: scales(60),
  },
  coverContainer: {
    width: "100%",
    position: "relative",
    backgroundColor: colors.transparentWhite5,
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },
  headerOverlayRow: {
    position: "absolute",
    left: scales(16),
    right: scales(16),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
  },
  backCircleBtn: {
    width: scales(38),
    height: scales(38),
    borderRadius: scales(19),
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  backIcon: {
    width: scales(18),
    height: scales(18),
    tintColor: colors.white,
  },
  headerTitle: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(18),
    letterSpacing: 0.3,
  },
  headerPlaceholder: {
    width: scales(38),
  },
  editCoverBadge: {
    position: "absolute",
    bottom: scales(12),
    right: scales(16),
    flexDirection: "row",
    alignItems: "center",
    gap: scales(6),
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    paddingVertical: scales(6),
    paddingHorizontal: scales(12),
    borderRadius: scales(16),
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  coverBadgeIcon: {
    width: scales(13),
    height: scales(13),
    tintColor: colors.white,
    resizeMode: "contain",
  },
  coverBadgeText: {
    color: colors.white,
    fontFamily: fontFamily.medium,
    fontSize: scales(11),
  },
  avatarSection: {
    alignItems: "center",
    marginTop: scales(-48),
    zIndex: 5,
  },
  avatarContainer: {
    alignItems: "center",
  },
  avatarWrapper: {
    padding: scales(4),
    borderRadius: scales(70),
    backgroundColor: colors.black,
    position: "relative",
  },
  avatar: {
    width: scales(94),
    height: scales(94),
    borderRadius: scales(47),
    backgroundColor: colors.darkblack,
  },
  editIconBadge: {
    position: "absolute",
    bottom: scales(2),
    right: scales(2),
    backgroundColor: colors.storyRing,
    width: scales(28),
    height: scales(28),
    borderRadius: scales(14),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2.5,
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
  sectionWrapper: {
    marginBottom: scales(22),
  },
  sectionTitle: {
    color: colors.transparentWhite40,
    fontSize: scales(12),
    fontFamily: fontFamily.bold,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginHorizontal: scales(24),
    marginBottom: scales(8),
  },
  infoContainer: {
    backgroundColor: "rgba(255,255,255,0.04)",
    marginHorizontal: scales(20),
    borderRadius: scales(18),
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: scales(16),
    paddingHorizontal: scales(18),
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  rowLabelContainer: {
    flex: 0.38,
    flexDirection: "row",
    alignItems: "center",
    gap: scales(8),
  },
  rowIcon: {
    width: scales(16),
    height: scales(16),
    tintColor: "rgba(255,255,255,0.5)",
  },
  label: {
    color: "rgba(255,255,255,0.6)",
    fontSize: scales(14),
    fontFamily: fontFamily.medium,
  },
  rowValueContainer: {
    flex: 0.62,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  value: {
    color: colors.white,
    fontSize: scales(14),
    fontFamily: fontFamily.regular,
    marginRight: scales(8),
    flex: 1,
    textAlign: "right",
  },
  placeholderValue: {
    color: "rgba(255,255,255,0.25)",
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
    gap: scales(12),
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
  optionsListContainer: {
    paddingVertical: scales(6),
    gap: scales(6),
  },
  selectOptionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: scales(14),
    paddingHorizontal: scales(16),
    borderRadius: scales(12),
    backgroundColor: colors.transparentWhite5,
  },
  selectOptionItemSelected: {
    backgroundColor: "rgba(0, 136, 255, 0.15)",
    borderWidth: 1,
    borderColor: colors.blue,
  },
  selectOptionText: {
    color: colors.white,
    fontFamily: fontFamily.medium,
    fontSize: scales(15),
  },
  selectOptionTextSelected: {
    color: colors.blue,
    fontFamily: fontFamily.bold,
  },
  checkIcon: {
    width: scales(16),
    height: scales(16),
    tintColor: colors.blue,
  },
});
