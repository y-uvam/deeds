import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  AppBackground,
  Header,
  Spacer,
  CustomInput,
  CustomButton,
} from "../../components";
import { colors, scales } from "../../utils";
import { fontFamily, appImages } from "../../assets";
import { navigate } from "../../navigation/navigationServices";
import { routesConstants } from "../../navigation/routeConstants";

const TAG_SUGGESTIONS = ["#wellness", "#growth", "#motivation", "#lifestyle", "#art", "#travel"];

const SectionLabel = ({ label }) => (
  <Text style={styles.sectionLabel}>{label}</Text>
);

const TagChip = ({ tag, isSelected, onPress }) => (
  <TouchableOpacity
    style={[styles.chip, isSelected && styles.chipSelected]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
      {tag}
    </Text>
  </TouchableOpacity>
);

const MediaPreviewStrip = ({ media }) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.previewStrip}>
    {media.map((item, i) => (
      <View key={item.id} style={styles.previewThumb}>
        <Image source={{ uri: item.uri }} style={styles.previewImage} />
        {i === 0 && <View style={styles.coverBadge}><Text style={styles.coverText}>Cover</Text></View>}
      </View>
    ))}
  </ScrollView>
);

const getBitesFields = (form, set) => (
  <>
    <SectionLabel label="Caption" />
    <CustomInput
      placeholder="Write a caption..."
      value={form.caption}
      onChangeText={(v) => set({ ...form, caption: v })}
      multiline
      height={90}
    />
    <SectionLabel label="Tags" />
    <View style={styles.tagsRow}>
      {TAG_SUGGESTIONS.map((tag) => (
        <TagChip
          key={tag}
          tag={tag}
          isSelected={form.tags?.includes(tag)}
          onPress={() => {
            const tags = form.tags ?? [];
            set({
              ...form,
              tags: tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag],
            });
          }}
        />
      ))}
    </View>
    <SectionLabel label="Audio" />
    <TouchableOpacity style={styles.audioRow} activeOpacity={0.8}>
      <Image source={appImages.play} style={styles.audioIcon} tintColor={colors.blue} />
      <Text style={styles.audioLabel}>Add audio / music</Text>
    </TouchableOpacity>
  </>
);

const getMovieFields = (form, set) => (
  <>
    <SectionLabel label="Title" />
    <CustomInput
      placeholder="Movie title"
      value={form.title}
      onChangeText={(v) => set({ ...form, title: v })}
    />
    <SectionLabel label="Description" />
    <CustomInput
      placeholder="Tell viewers what this is about..."
      value={form.description}
      onChangeText={(v) => set({ ...form, description: v })}
      multiline
      height={110}
    />
    <SectionLabel label="Genre / Tags" />
    <View style={styles.tagsRow}>
      {TAG_SUGGESTIONS.map((tag) => (
        <TagChip
          key={tag}
          tag={tag}
          isSelected={form.tags?.includes(tag)}
          onPress={() => {
            const tags = form.tags ?? [];
            set({
              ...form,
              tags: tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag],
            });
          }}
        />
      ))}
    </View>
    <SectionLabel label="Visibility" />
    <View style={styles.visibilityRow}>
      {["Public", "Followers", "Private"].map((opt) => (
        <TouchableOpacity
          key={opt}
          style={[styles.visOpt, form.visibility === opt && styles.visOptSelected]}
          onPress={() => set({ ...form, visibility: opt })}
          activeOpacity={0.8}
        >
          <Text style={[styles.visText, form.visibility === opt && styles.visTextSelected]}>
            {opt}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </>
);

const getStoryFields = (form, set) => (
  <>
    <SectionLabel label="Your Thought" />
    <CustomInput
      placeholder="What's on your mind?"
      value={form.text}
      onChangeText={(v) => set({ ...form, text: v })}
      multiline
      height={140}
    />
    <SectionLabel label="Mood" />
    <View style={styles.tagsRow}>
      {["🔥 Trending", "💡 Insightful", "😂 Funny", "❤️ Heartfelt", "🌍 Awareness"].map((m) => (
        <TagChip
          key={m}
          tag={m}
          isSelected={form.mood === m}
          onPress={() => set({ ...form, mood: form.mood === m ? null : m })}
        />
      ))}
    </View>
    <SectionLabel label="Allow replies" />
    <View style={styles.visibilityRow}>
      {["Everyone", "Followers", "No one"].map((opt) => (
        <TouchableOpacity
          key={opt}
          style={[styles.visOpt, form.replies === opt && styles.visOptSelected]}
          onPress={() => set({ ...form, replies: opt })}
          activeOpacity={0.8}
        >
          <Text style={[styles.visText, form.replies === opt && styles.visTextSelected]}>
            {opt}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </>
);

export const MetaData = ({ route }) => {
  const { contentType, media = [] } = route.params ?? {};
  const [form, setForm] = useState({ visibility: "Public", replies: "Everyone" });

  const handlePost = useCallback(() => {
    navigate(routesConstants.upload, { contentType, media, metadata: form });
  }, [form, contentType, media]);

  const renderFields = () => {
    switch (contentType?.id) {
      case "bites": return getBitesFields(form, setForm);
      case "movie": return getMovieFields(form, setForm);
      case "story": return getStoryFields(form, setForm);
      default: return null;
    }
  };

  return (
    <AppBackground>
      <Header label={contentType?.label ?? "Details"} showBackButton />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {media.length > 0 && <MediaPreviewStrip media={media} />}
          <View style={styles.fields}>{renderFields()}</View>
          <Spacer height={scales(20)} />
          <View style={styles.footer}>
            <CustomButton label="Post" onPress={handlePost} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: scales(40),
  },
  previewStrip: {
    paddingHorizontal: scales(16),
    paddingVertical: scales(12),
  },
  previewThumb: {
    width: scales(70),
    height: scales(70),
    borderRadius: scales(10),
    marginRight: scales(8),
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  coverBadge: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.transparentBlack30,
    alignItems: "center",
    paddingVertical: scales(2),
  },
  coverText: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: scales(9),
  },
  fields: {
    paddingHorizontal: scales(20),
  },
  sectionLabel: {
    color: colors.transparentWhite85,
    fontFamily: fontFamily.semiBold,
    fontSize: scales(13),
    marginTop: scales(14),
    marginBottom: scales(2),
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: scales(8),
    marginTop: scales(6),
  },
  chip: {
    paddingHorizontal: scales(12),
    paddingVertical: scales(6),
    borderRadius: scales(20),
    borderWidth: 1,
    borderColor: colors.transparentWhite15,
    backgroundColor: colors.transparentWhite5,
  },
  chipSelected: {
    borderColor: colors.blue,
    backgroundColor: colors.blue + "22",
  },
  chipText: {
    color: colors.transparentWhite40,
    fontFamily: fontFamily.medium,
    fontSize: scales(12),
  },
  chipTextSelected: {
    color: colors.blue,
  },
  audioRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scales(10),
    paddingVertical: scales(12),
    paddingHorizontal: scales(14),
    borderRadius: scales(12),
    borderWidth: 1,
    borderColor: colors.transparentWhite12,
    backgroundColor: colors.transparentWhite5,
    marginTop: scales(6),
  },
  audioIcon: {
    width: scales(18),
    height: scales(18),
    resizeMode: "contain",
  },
  audioLabel: {
    color: colors.blue,
    fontFamily: fontFamily.medium,
    fontSize: scales(13),
  },
  visibilityRow: {
    flexDirection: "row",
    gap: scales(8),
    marginTop: scales(6),
  },
  visOpt: {
    flex: 1,
    paddingVertical: scales(10),
    borderRadius: scales(10),
    borderWidth: 1,
    borderColor: colors.transparentWhite15,
    backgroundColor: colors.transparentWhite5,
    alignItems: "center",
  },
  visOptSelected: {
    borderColor: colors.blue,
    backgroundColor: colors.blue + "22",
  },
  visText: {
    color: colors.transparentWhite40,
    fontFamily: fontFamily.medium,
    fontSize: scales(12),
  },
  visTextSelected: {
    color: colors.blue,
    fontFamily: fontFamily.bold,
  },
  footer: {
    paddingHorizontal: scales(20),
  },
});
