import React, { useState, useCallback, useMemo, memo } from "react";
import {
  View,
  Text,
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
  CustomSwitch,
  CustomSearch,
} from "../../components";
import { colors, scales, commonText } from "../../utils";
import { appImages } from "../../assets";
import { navigate } from "../../navigation/navigationServices";
import { routesConstants } from "../../navigation/routeConstants";
import { styles } from "./metadataStyles";

const GENRE_OPTIONS = [
  "Action",
  "Drama",
  "Sci-Fi",
  "Thriller",
  "Horror",
  "Comedy",
  "Documentary",
  "Animation",
];

const RATING_OPTIONS = ["U/A 16+", "PG-13", "R (Mature)", "G (All Ages)"];
const VIDEO_QUALITY_OPTIONS = [
  "4K Ultra HD",
  "1080p Full HD",
  "IMAX Enhanced",
  "HDR10+",
];
const CAST_ROLES_LIST = [
  "Director",
  "Creator",
  "Producer",
  "Writer",
  "Lead Actor",
  "Lead Actress",
  "Supporting",
  "Cinematographer",
  "Music",
];

const COMMUNITY_USERS = [
  {
    id: "u1",
    name: "Kabir Khan",
    handle: "@kabir_dir",
    defaultRole: "Director",
    image: appImages.dummyuser,
  },
  {
    id: "u2",
    name: "Siddharth Roy",
    handle: "@siddharth_prod",
    defaultRole: "Producer",
    image: appImages.dummyuser,
  },
  {
    id: "u3",
    name: "Salim Khan",
    handle: "@salim_writes",
    defaultRole: "Writer",
    image: appImages.dummyuser,
  },
  {
    id: "u4",
    name: "Aarav Sharma",
    handle: "@aarav_actor",
    defaultRole: "Lead Actor",
    image: appImages.dummyuser,
  },
  {
    id: "u5",
    name: "Rhea Kapoor",
    handle: "@rhea_k",
    defaultRole: "Lead Actress",
    image: appImages.dummyuser,
  },
  {
    id: "u6",
    name: "Devendra Verma",
    handle: "@dev_verma",
    defaultRole: "Antagonist",
    image: appImages.dummyuser,
  },
  {
    id: "u7",
    name: "Karan Johar",
    handle: "@kjohar",
    defaultRole: "Creator",
    image: appImages.dummyuser,
  },
  {
    id: "u8",
    name: "Ananya Pandey",
    handle: "@ananya_p",
    defaultRole: "Supporting",
    image: appImages.dummyuser,
  },
  {
    id: "u9",
    name: "Pritam Chakraborty",
    handle: "@pritam_music",
    defaultRole: "Music",
    image: appImages.dummyuser,
  },
  {
    id: "u10",
    name: "Sudeep Chatterjee",
    handle: "@sudeep_dop",
    defaultRole: "Cinematographer",
    image: appImages.dummyuser,
  },
];

const BITE_HASHTAGS = [
  "#BTS",
  "#VFX",
  "#Cinematography",
  "#ActorLife",
  "#FilmRig",
  "#Director",
  "#Lighting",
  "#ColorGrade",
];

const SLATE_MOODS = [
  "🎬 Production Update",
  "💡 Film Critique",
  "🔥 Industry News",
  "❓ Casting Call",
  "🍿 Watchlist & Review",
  "🎙️ Director Notes",
];

const SectionLabel = memo(({ label }) => (
  <Text style={styles.sectionLabel}>{label}</Text>
));

const TagChip = memo(({ tag, isSelected, onPress }) => (
  <TouchableOpacity
    style={[styles.chip, isSelected && styles.chipSelected]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
      {tag}
    </Text>
  </TouchableOpacity>
));

const MediaPreviewStrip = memo(({ media }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={styles.previewStrip}
  >
    {media.map((item, i) => (
      <View key={item.id} style={styles.previewThumb}>
        <Image source={{ uri: item.uri }} style={styles.previewImage} />
        {item.type === "video" && (
          <View style={styles.previewVideoBadge}>
            <Image
              source={appImages.play}
              style={styles.previewPlayIcon}
              tintColor={colors.white}
            />
          </View>
        )}
        {i === 0 && (
          <View style={styles.coverBadge}>
            <Text style={styles.coverText}>Cover</Text>
          </View>
        )}
      </View>
    ))}
  </ScrollView>
));

const SwitchRow = memo(({ title, subtitle, icon, value, onValueChange }) => (
  <View style={styles.switchRow}>
    <View style={styles.switchRowLeft}>
      {icon && (
        <View style={styles.switchIconCircle}>
          <Image source={icon} style={styles.switchIcon} />
        </View>
      )}
      <View style={styles.switchTextContainer}>
        <Text style={styles.switchTitle}>{title}</Text>
        {subtitle && <Text style={styles.switchSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    <CustomSwitch
      value={value}
      onValueChange={onValueChange}
      activeColor={colors.storyRing}
    />
  </View>
));

const AssetDropzone = memo(
  ({ title, subtitle, icon, isSet, imageUri, onPress, badgeText }) => (
    <TouchableOpacity
      style={[styles.assetCard, isSet && { borderStyle: "solid" }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {isSet && imageUri ? (
        <>
          <Image source={imageUri} style={styles.assetImage} />
          <View style={styles.assetImageOverlay}>
            <View style={styles.checkedCircle}>
              <Image source={appImages.check} style={styles.checkedIcon} />
            </View>
            <Text style={styles.changeText}>Tap to change</Text>
          </View>
        </>
      ) : (
        <View style={styles.assetContent}>
          <View style={styles.assetIconCircle}>
            <Image source={icon} style={styles.assetIcon} />
          </View>
          <Text style={styles.assetTitle}>{title}</Text>
          <Text style={styles.assetSubtitle}>{subtitle}</Text>
        </View>
      )}
      {badgeText && (
        <View style={styles.assetRatioBadge}>
          <Text style={styles.assetRatioText}>{badgeText}</Text>
        </View>
      )}
    </TouchableOpacity>
  ),
);

const VideoDropRow = memo(
  ({ title, subtitle, icon, statusText, isSelected, onPress }) => (
    <TouchableOpacity
      style={styles.videoDropRow}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.videoDropLeft}>
        <View
          style={[
            styles.videoIconRing,
            isSelected && styles.videoIconRingSelected,
          ]}
        >
          <Image
            source={icon}
            style={[
              styles.videoDropIcon,
              isSelected && { tintColor: colors.lightGreen },
            ]}
          />
        </View>
        <View style={styles.videoDropTextWrapper}>
          <Text style={styles.videoDropTitle}>{title}</Text>
          <Text style={styles.videoDropSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <View
        style={[
          styles.videoStatusPill,
          isSelected && styles.videoStatusPillSelected,
        ]}
      >
        {isSelected && (
          <Image source={appImages.check} style={styles.miniCheckIcon} />
        )}
        <Text
          style={[
            styles.videoStatusText,
            isSelected && styles.videoStatusTextSelected,
          ]}
        >
          {statusText}
        </Text>
      </View>
    </TouchableOpacity>
  ),
);

const TagPeopleSection = memo(({ taggedPeople = [], onAdd, onRemove }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query) return COMMUNITY_USERS;
    const q = query.toLowerCase();
    return COMMUNITY_USERS.filter(
      (u) =>
        u.name.toLowerCase().includes(q) || u.handle.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <>
      <SectionLabel label="Tag People" />
      {taggedPeople.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tagPeopleStrip}
        >
          {taggedPeople.map((person, index) => (
            <View key={person.id + "_" + index} style={styles.tagPersonChip}>
              <Image
                source={person.image || appImages.dummyuser}
                style={styles.tagPersonAvatar}
              />
              <Text style={styles.tagPersonHandle}>
                {person.handle || person.name}
              </Text>
              <TouchableOpacity
                style={styles.removeCastBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                onPress={() => onRemove(index)}
              >
                <Text style={styles.removeCastText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
      {!isSearching ? (
        <TouchableOpacity
          style={styles.tagButton}
          onPress={() => setIsSearching(true)}
          activeOpacity={0.8}
        >
          <Image
            source={appImages.tag}
            style={{
              width: scales(16),
              height: scales(16),
              tintColor: colors.storyRing,
            }}
          />
          <Text style={styles.tagButtonText}>Tag People</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.searchContainer}>
          <CustomSearch
            placeholder="Search user by handle or name..."
            value={query}
            onChangeText={setQuery}
            containerStyle={{ paddingHorizontal: 0, marginVertical: scales(4) }}
            activeColor={colors.storyRing}
          />
          <ScrollView
            style={styles.searchResultsList}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
          >
            {filtered.map((u) => {
              const isAdded = taggedPeople.some((t) => t.id === u.id);
              return (
                <TouchableOpacity
                  key={u.id}
                  style={styles.userResultRow}
                  activeOpacity={0.8}
                  onPress={() => {
                    if (!isAdded) onAdd(u);
                  }}
                >
                  <View style={styles.userResultLeft}>
                    <Image source={u.image} style={styles.userResultAvatar} />
                    <View>
                      <Text style={styles.userResultName}>{u.name}</Text>
                      <Text style={styles.userResultHandle}>{u.handle}</Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.addUserActionPill,
                      isAdded && {
                        backgroundColor: "rgba(255,255,255,0.1)",
                        borderColor: "transparent",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.addUserActionText,
                        isAdded && { color: "rgba(255,255,255,0.5)" },
                      ]}
                    >
                      {isAdded ? "Tagged" : "+ Tag"}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <TouchableOpacity
            style={styles.closeSearchBtn}
            onPress={() => setIsSearching(false)}
          >
            <Text style={styles.closeSearchText}>Done Tagging</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
});

const getMovieFields = (form, set, castState) => (
  <>
    <SectionLabel label="Promotional Posters & Artwork" />
    <View style={styles.postersGrid}>
      <AssetDropzone
        title="Portrait Poster"
        subtitle="For feed & discovery"
        icon={appImages.imageupload || appImages.gallery}
        isSet={form.portraitSet}
        imageUri={appImages.poster1 || appImages.post}
        onPress={() => set({ ...form, portraitSet: !form.portraitSet })}
      />
      <AssetDropzone
        title="Landscape Backdrop"
        subtitle="For cinema banner"
        icon={appImages.gallery}
        isSet={form.landscapeSet}
        imageUri={appImages.intro1 || appImages.post}
        onPress={() => set({ ...form, landscapeSet: !form.landscapeSet })}
      />
    </View>

    <SectionLabel label="Production Video Files" />
    <VideoDropRow
      title="Official Trailer Teaser"
      subtitle="Recommended length: 1 to 3 minutes"
      icon={appImages.play}
      isSelected={form.trailerSet}
      statusText={form.trailerSet ? "Trailer Attached" : "Select Trailer"}
      onPress={() => set({ ...form, trailerSet: !form.trailerSet })}
    />

    <SectionLabel label="Project Title" />
    <CustomInput
      placeholder="Enter movie or production title..."
      value={form.title}
      onChangeText={(v) => set({ ...form, title: v })}
    />

    <SectionLabel label="Film Tagline" />
    <CustomInput
      placeholder="e.g. The rise and battle for supreme control."
      value={form.tagline}
      onChangeText={(v) => set({ ...form, tagline: v })}
    />

    <SectionLabel label="Synopsis & Storyline" />
    <CustomInput
      placeholder="Tell viewers about your plot, characters, and directorial vision..."
      value={form.description}
      onChangeText={(v) => set({ ...form, description: v })}
      multiline
      height={110}
    />

    <SectionLabel label="Cast & Crew (Shown on Movie Screen)" />
    {form.castAndCrew?.length > 0 && (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.castSelectedStrip}
      >
        {form.castAndCrew.map((person, index) => (
          <View key={person.id + "_" + index} style={styles.castMemberCard}>
            <Image
              source={person.image || appImages.dummyuser}
              style={styles.castAvatar}
            />
            <Text style={styles.castNameText}>{person.name}</Text>
            <View style={styles.castRoleBadge}>
              <Text style={styles.castRoleText}>{person.role}</Text>
            </View>
            <TouchableOpacity
              style={styles.removeCastBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              onPress={() => {
                const updated = [...form.castAndCrew];
                updated.splice(index, 1);
                set({ ...form, castAndCrew: updated });
              }}
            >
              <Text style={styles.removeCastText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    )}

    {!castState.isSearching ? (
      <TouchableOpacity
        style={styles.addCastButton}
        onPress={() => castState.setIsSearching(true)}
        activeOpacity={0.8}
      >
        <Image
          source={appImages.plus || appImages.browse}
          style={{
            width: scales(16),
            height: scales(16),
            tintColor: colors.storyRing,
          }}
        />
        <Text style={styles.addCastButtonText}>
          Add Actor, Director, Creator or Crew
        </Text>
      </TouchableOpacity>
    ) : (
      <View style={styles.searchContainer}>
        <Text style={styles.searchHeaderTitle}>Select Role to Assign</Text>
        <View style={styles.roleFilterRow}>
          {CAST_ROLES_LIST.map((r) => (
            <TouchableOpacity
              key={r}
              style={[
                styles.roleChip,
                castState.selectedRole === r && styles.roleChipActive,
              ]}
              onPress={() => castState.setSelectedRole(r)}
            >
              <Text
                style={[
                  styles.roleChipText,
                  castState.selectedRole === r && styles.roleChipTextActive,
                ]}
              >
                {r}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <CustomSearch
          placeholder="Search creator by name or role..."
          value={castState.query}
          onChangeText={castState.setQuery}
          containerStyle={{ paddingHorizontal: 0, marginVertical: scales(4) }}
          activeColor={colors.storyRing}
        />

        <ScrollView
          style={styles.searchResultsList}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
        >
          {COMMUNITY_USERS.filter(
            (u) =>
              u.name.toLowerCase().includes(castState.query.toLowerCase()) ||
              u.handle.toLowerCase().includes(castState.query.toLowerCase()) ||
              u.defaultRole
                .toLowerCase()
                .includes(castState.query.toLowerCase()),
          ).map((u) => {
            const isAlreadyAdded = form.castAndCrew?.some(
              (c) => c.name === u.name && c.role === castState.selectedRole,
            );
            return (
              <TouchableOpacity
                key={u.id}
                style={styles.userResultRow}
                activeOpacity={0.8}
                onPress={() => {
                  if (!isAlreadyAdded) {
                    set({
                      ...form,
                      castAndCrew: [
                        ...(form.castAndCrew || []),
                        {
                          id: u.id + "_" + Date.now(),
                          name: u.name,
                          role: castState.selectedRole,
                          image: u.image,
                        },
                      ],
                    });
                  }
                }}
              >
                <View style={styles.userResultLeft}>
                  <Image source={u.image} style={styles.userResultAvatar} />
                  <View>
                    <Text style={styles.userResultName}>{u.name}</Text>
                    <Text style={styles.userResultHandle}>
                      {u.handle} • {u.defaultRole}
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.addUserActionPill,
                    isAlreadyAdded && {
                      backgroundColor: "rgba(255,255,255,0.1)",
                      borderColor: "transparent",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.addUserActionText,
                      isAlreadyAdded && { color: "rgba(255,255,255,0.5)" },
                    ]}
                  >
                    {isAlreadyAdded
                      ? "Added"
                      : "+ Add as " + castState.selectedRole}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <TouchableOpacity
          style={styles.closeSearchBtn}
          onPress={() => castState.setIsSearching(false)}
        >
          <Text style={styles.closeSearchText}>Done Adding Cast & Crew</Text>
        </TouchableOpacity>
      </View>
    )}

    <TagPeopleSection
      taggedPeople={form.taggedPeople}
      onAdd={(user) =>
        set({
          ...form,
          taggedPeople: [...(form.taggedPeople || []), user],
        })
      }
      onRemove={(index) => {
        const updated = [...(form.taggedPeople || [])];
        updated.splice(index, 1);
        set({ ...form, taggedPeople: updated });
      }}
    />

    <SectionLabel label="Release Year & Estimated Duration" />
    <View style={styles.specsRow}>
      <View style={styles.specInputBox}>
        <CustomInput
          placeholder="Release Year (2026)"
          value={form.releaseYear}
          onChangeText={(v) => set({ ...form, releaseYear: v })}
        />
      </View>
      <View style={styles.specInputBox}>
        <CustomInput
          placeholder="Duration (2h 15m)"
          value={form.duration}
          onChangeText={(v) => set({ ...form, duration: v })}
        />
      </View>
    </View>

    <SectionLabel label="Video Format / Resolution" />
    <View style={styles.tagsRow}>
      {VIDEO_QUALITY_OPTIONS.map((vq) => (
        <TagChip
          key={vq}
          tag={vq}
          isSelected={form.videoQuality === vq}
          onPress={() => set({ ...form, videoQuality: vq })}
        />
      ))}
    </View>

    <SectionLabel label="Primary Genre" />
    <View style={styles.tagsRow}>
      {GENRE_OPTIONS.map((g) => (
        <TagChip
          key={g}
          tag={g}
          isSelected={form.genre === g}
          onPress={() => set({ ...form, genre: g })}
        />
      ))}
    </View>

    <SectionLabel label="Content Age Rating" />
    <View style={styles.visibilityRow}>
      {RATING_OPTIONS.map((opt) => (
        <TouchableOpacity
          key={opt}
          style={[
            styles.visOpt,
            form.contentRating === opt && styles.visOptSelected,
          ]}
          onPress={() => set({ ...form, contentRating: opt })}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.visText,
              form.contentRating === opt && styles.visTextSelected,
            ]}
          >
            {opt}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
    <Spacer height={scales(10)} />
    <SwitchRow
      title="Enable Tip Button"
      subtitle="Allow viewers & fans to send financial appreciation"
      icon={appImages.donation || appImages.monetize}
      value={form.tipEnabled}
      onValueChange={(val) => set({ ...form, tipEnabled: val })}
    />
  </>
);

const getBitesFields = (form, set) => (
  <>
    <SectionLabel label="Bite Caption & Details" />
    <CustomInput
      placeholder="Write an engaging caption for your short..."
      value={form.caption}
      onChangeText={(v) => set({ ...form, caption: v })}
      multiline
      height={90}
    />

    <TagPeopleSection
      taggedPeople={form.taggedPeople}
      onAdd={(user) =>
        set({
          ...form,
          taggedPeople: [...(form.taggedPeople || []), user],
        })
      }
      onRemove={(index) => {
        const updated = [...(form.taggedPeople || [])];
        updated.splice(index, 1);
        set({ ...form, taggedPeople: updated });
      }}
    />

    <SectionLabel label="Audio & Sound Design" />
    <TouchableOpacity style={styles.audioRow} activeOpacity={0.8}>
      <View style={styles.audioLeft}>
        <Image
          source={appImages.mic || appImages.play}
          style={styles.audioIcon}
        />
        <View>
          <Text style={styles.audioTitle}>Original Studio Sound</Text>
          <Text style={styles.audioSub}>Tap to select music track or mix</Text>
        </View>
      </View>
      <Image
        source={appImages.browse || appImages.skipForward}
        style={styles.audioArrow}
      />
    </TouchableOpacity>

    <SectionLabel label="Creator Hashtags" />
    <View style={styles.tagsRow}>
      {BITE_HASHTAGS.map((tag) => (
        <TagChip
          key={tag}
          tag={tag}
          isSelected={form.tags?.includes(tag)}
          onPress={() => {
            const tags = form.tags ?? [];
            set({
              ...form,
              tags: tags.includes(tag)
                ? tags.filter((t) => t !== tag)
                : [...tags, tag],
            });
          }}
        />
      ))}
    </View>

    <Spacer height={scales(10)} />

    <SwitchRow
      title="Enable Comments"
      subtitle="Enable community feedback and discussions"
      icon={appImages.comment}
      value={form.commentsEnabled}
      onValueChange={(val) => set({ ...form, commentsEnabled: val })}
    />
  </>
);

const getStoryFields = (form, set) => (
  <>
    <SectionLabel label="Your Studio Thought or Update" />
    <CustomInput
      placeholder="Share production updates, casting news, or thoughts..."
      value={form.text}
      onChangeText={(v) => set({ ...form, text: v })}
      multiline
      height={140}
    />

    <TagPeopleSection
      taggedPeople={form.taggedPeople}
      onAdd={(user) =>
        set({
          ...form,
          taggedPeople: [...(form.taggedPeople || []), user],
        })
      }
      onRemove={(index) => {
        const updated = [...(form.taggedPeople || [])];
        updated.splice(index, 1);
        set({ ...form, taggedPeople: updated });
      }}
    />

    <SectionLabel label="Slate Topic & Mood" />
    <View style={styles.tagsRow}>
      {SLATE_MOODS.map((m) => (
        <TagChip
          key={m}
          tag={m}
          isSelected={form.mood === m}
          onPress={() => set({ ...form, mood: form.mood === m ? null : m })}
        />
      ))}
    </View>

    <SectionLabel label="Studio Location or Film Set" />
    <View style={styles.locationInputWrapper}>
      <CustomInput
        placeholder="Tag studio stage, cinema, or filming location..."
        value={form.locationTag}
        onChangeText={(v) => set({ ...form, locationTag: v })}
      />
    </View>
  </>
);

export const MetaData = ({ route }) => {
  const { contentType, media = [] } = route.params ?? {};
  const [form, setForm] = useState({
    title: "",
    tagline: "",
    description: "",
    releaseYear: "2026",
    duration: "2h 15m",
    videoQuality: "4K Ultra HD",
    contentRating: "U/A 16+",
    genre: "Drama",
    castAndCrew: [
      {
        id: "c_1",
        name: "Kabir Khan",
        role: "Director",
        image: appImages.dummyuser,
      },
      {
        id: "c_2",
        name: "Siddharth Roy",
        role: "Producer",
        image: appImages.dummyuser,
      },
      {
        id: "c_3",
        name: "Aarav Sharma",
        role: "Lead Actor",
        image: appImages.dummyuser,
      },
    ],
    taggedPeople: [],
    caption: "",
    text: "",
    tags: ["#BTS", "#Cinematography"],
    visibility: "Public",
    replies: "Everyone",
    mood: "🎬 Production Update",
    locationTag: "",
    portraitSet: false,
    landscapeSet: false,
    trailerSet: false,
    movieSet: false,
    tipEnabled: true,
    reviewsEnabled: true,
    earlyAccess: false,
    linkToProject: false,
    linkedProjectTitle: "",
    duetsEnabled: true,
    commentsEnabled: true,
    pinToStudio: false,
  });

  const [isSearchingCast, setIsSearchingCast] = useState(false);
  const [castSearchQuery, setCastSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("Actor / Creator");
  const [agreeOwnership, setAgreeOwnership] = useState(false);

  const castState = useMemo(
    () => ({
      isSearching: isSearchingCast,
      setIsSearching: setIsSearchingCast,
      query: castSearchQuery,
      setQuery: setCastSearchQuery,
      selectedRole,
      setSelectedRole,
    }),
    [isSearchingCast, castSearchQuery, selectedRole],
  );

  const handlePost = useCallback(() => {
    if (!agreeOwnership) return;
    navigate(routesConstants.upload, { contentType, media, metadata: form });
  }, [form, contentType, media, agreeOwnership]);

  const renderFields = () => {
    const typeId = contentType?.id?.toLowerCase() || "";
    if (typeId === "movie" || typeId === "projects") {
      return getMovieFields(form, setForm, castState);
    }
    if (typeId === "bites") {
      return getBitesFields(form, setForm);
    }
    return getStoryFields(form, setForm);
  };

  return (
    <AppBackground>
      <Header label={contentType?.label ?? commonText.details} showBackButton />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        // keyboardVerticalOffset={80}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {media.length > 0 && <MediaPreviewStrip media={media} />}
          <View style={styles.fields}>{renderFields()}</View>
          <Spacer height={scales(16)} />
          <TouchableOpacity
            style={styles.ownershipRow}
            onPress={() => setAgreeOwnership(!agreeOwnership)}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.checkBox,
                agreeOwnership && styles.checkBoxChecked,
              ]}
            >
              {agreeOwnership && (
                <Image source={appImages.check} style={styles.checkBoxIcon} />
              )}
            </View>
            <Text style={styles.ownershipText}>
              {commonText.contentOwnershipConfirmation}
            </Text>
          </TouchableOpacity>

          <Spacer height={scales(24)} />
          <View
            style={[styles.footer, !agreeOwnership && styles.disabledButton]}
          >
            <CustomButton
              label={
                contentType?.id === "movie"
                  ? commonText.publishProject
                  : commonText.postContent
              }
              onPress={handlePost}
              disable={!agreeOwnership}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppBackground>
  );
};
