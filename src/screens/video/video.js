import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  PanResponder,
  Animated,
  StatusBar,
  StyleSheet,
} from "react-native";
import RNVideo from "react-native-video";
import { BlurView } from "@react-native-community/blur";
import LinearGradient from "react-native-linear-gradient";
import {
  lockToLandscape,
  lockToPortrait,
} from "react-native-fast-orientation-locker";
import { goBack } from "../../navigation";
import { colors, scales } from "../../utils";
import { appImages } from "../../assets";
import { CustomBottomSheet } from "../../components";
import { styles } from "./styles";

const VIDEO_SOURCE = {
  uri: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
};
const HIDE_DELAY_MS = 3000;
const SEEK_SECONDS = 10;

const SPLASH_GRADIENT = [
  colors.orange,
  colors.storyRing,
  colors.lightRed,
  colors.purple,
  colors.magenta,
];

const QUALITY_OPTIONS = [
  { label: "Auto", value: "auto", desc: "Recommended" },
  { label: "1080p", value: 1080, desc: "Full HD" },
  { label: "720p", value: 720, desc: "HD" },
  { label: "480p", value: 480, desc: "SD" },
  { label: "360p", value: 360, desc: "Low" },
];

const SPEED_OPTIONS = [
  { label: "0.5x", value: 0.5 },
  { label: "0.75x", value: 0.75 },
  { label: "1.0x (Normal)", value: 1.0 },
  { label: "1.25x", value: 1.25 },
  { label: "1.5x", value: 1.5 },
  { label: "2.0x", value: 2.0 },
];

const SUBTITLE_OPTIONS = [
  { label: "Off", value: "off" },
  { label: "English (CC)", value: "en" },
  { label: "Spanish", value: "es" },
];

const formatTime = (secs) => {
  const s = Math.floor(secs) || 0;
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

const Scrubber = React.memo(({ progress, onSeek, onSeeking }) => {
  const containerRef = useRef(null);
  const trackWidth = useRef(1);
  const containerPageX = useRef(0);
  const isDragging = useRef(false);
  const seekRatio = useRef(progress);
  const fillAnim = useRef(new Animated.Value(progress)).current;

  useEffect(() => {
    if (!isDragging.current) {
      Animated.timing(fillAnim, {
        toValue: progress,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [progress, fillAnim]);

  const measureLayout = useCallback(() => {
    containerRef.current?.measure((x, y, width, height, pageX) => {
      if (width > 0) trackWidth.current = width;
      if (pageX !== undefined) containerPageX.current = pageX;
    });
  }, []);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt, gestureState) => {
          isDragging.current = true;
          onSeeking && onSeeking();
          measureLayout();
          const touchX = gestureState.x0 - containerPageX.current;
          const ratio = Math.max(0, Math.min(1, touchX / trackWidth.current));
          seekRatio.current = ratio;
          fillAnim.setValue(ratio);
        },
        onPanResponderMove: (evt, gestureState) => {
          const touchX = gestureState.moveX - containerPageX.current;
          const ratio = Math.max(0, Math.min(1, touchX / trackWidth.current));
          seekRatio.current = ratio;
          fillAnim.setValue(ratio);
        },
        onPanResponderRelease: () => {
          onSeek(seekRatio.current);
          setTimeout(() => {
            isDragging.current = false;
          }, 300);
        },
        onPanResponderTerminate: () => {
          isDragging.current = false;
        },
      }),
    [onSeek, onSeeking, fillAnim, measureLayout],
  );

  return (
    <View
      ref={containerRef}
      style={styles.scrubberHitArea}
      onLayout={() => measureLayout()}
      {...panResponder.panHandlers}
    >
      <View style={styles.trackBg} />
      <Animated.View
        style={[
          styles.trackFill,
          {
            width: fillAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ["0%", "100%"],
              extrapolate: "clamp",
            }),
          },
        ]}
      >
        <LinearGradient
          colors={SPLASH_GRADIENT}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.thumbDot,
          {
            left: fillAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ["0%", "100%"],
              extrapolate: "clamp",
            }),
          },
        ]}
      >
        <LinearGradient
          colors={SPLASH_GRADIENT}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.thumbDotGradient}
        />
      </Animated.View>
    </View>
  );
});

export const Video = () => {
  const videoRef = useRef(null);
  const hideTimer = useRef(null);
  const controlsOpacity = useRef(new Animated.Value(1)).current;

  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentSecs, setCurrentSecs] = useState(0);
  const [durationSecs, setDurationSecs] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(true);

  const [selectedQuality, setSelectedQuality] = useState(QUALITY_OPTIONS[0]);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedSubtitle, setSelectedSubtitle] = useState(SUBTITLE_OPTIONS[0]);
  const [activeSubMenu, setActiveSubMenu] = useState(null);

  const qualitySheetRef = useRef(null);
  const isSeeking = useRef(false);

  const selectedVideoTrack = useMemo(() => {
    if (selectedQuality.value === "auto") {
      return { type: "auto" };
    }
    return { type: "resolution", value: selectedQuality.value };
  }, [selectedQuality]);

  const selectedTextTrack = useMemo(() => {
    if (selectedSubtitle.value === "off") {
      return { type: "disabled" };
    }
    return { type: "language", value: selectedSubtitle.value };
  }, [selectedSubtitle]);

  useEffect(() => {
    lockToLandscape();
    return () => {
      lockToPortrait();
    };
  }, []);

  const clearHideTimer = useCallback(() => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  }, []);

  const startHideTimer = useCallback(() => {
    clearHideTimer();
    if (paused) return;
    hideTimer.current = setTimeout(() => {
      Animated.timing(controlsOpacity, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }).start(() => setShowControls(false));
    }, HIDE_DELAY_MS);
  }, [clearHideTimer, controlsOpacity, paused]);

  const revealControls = useCallback(() => {
    setShowControls(true);
    controlsOpacity.setValue(1);
    startHideTimer();
  }, [controlsOpacity, startHideTimer]);

  const openQualitySheet = useCallback(() => {
    setActiveSubMenu(null);
    qualitySheetRef.current?.present();
    clearHideTimer();
  }, [clearHideTimer]);

  const handleVideoTap = useCallback(() => {
    if (showControls) {
      clearHideTimer();
      Animated.timing(controlsOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => setShowControls(false));
    } else {
      revealControls();
    }
  }, [showControls, clearHideTimer, controlsOpacity, revealControls]);

  const handlePlayPause = useCallback(() => {
    setPaused((prev) => {
      const nextPaused = !prev;
      if (nextPaused) {
        clearHideTimer();
      } else {
        startHideTimer();
      }
      return nextPaused;
    });
  }, [clearHideTimer, startHideTimer]);

  const handleSeek = useCallback(
    (ratio) => {
      if (!durationSecs) return;
      const seekTo = ratio * durationSecs;
      isSeeking.current = false;
      videoRef.current?.seek(seekTo);
      setCurrentSecs(seekTo);
      setProgress(ratio);
      startHideTimer();
    },
    [durationSecs, startHideTimer],
  );

  const handleSeeking = useCallback(() => {
    isSeeking.current = true;
    clearHideTimer();
  }, [clearHideTimer]);

  const handleSkipBack = useCallback(() => {
    const newSecs = Math.max(0, currentSecs - SEEK_SECONDS);
    videoRef.current?.seek(newSecs);
    setCurrentSecs(newSecs);
    if (durationSecs > 0) setProgress(newSecs / durationSecs);
    startHideTimer();
  }, [currentSecs, durationSecs, startHideTimer]);

  const handleSkipForward = useCallback(() => {
    const newSecs = Math.min(durationSecs, currentSecs + SEEK_SECONDS);
    videoRef.current?.seek(newSecs);
    setCurrentSecs(newSecs);
    if (durationSecs > 0) setProgress(newSecs / durationSecs);
    startHideTimer();
  }, [currentSecs, durationSecs, startHideTimer]);

  const handleLoad = useCallback(
    (data) => {
      setDurationSecs(data.duration || 0);
      setIsBuffering(false);
      revealControls();
    },
    [revealControls],
  );

  const handleProgress = useCallback(
    (data) => {
      if (isSeeking.current) return;
      const cur = data.currentTime || 0;
      setCurrentSecs(cur);
      setProgress(durationSecs > 0 ? cur / durationSecs : 0);
    },
    [durationSecs],
  );

  const handleBuffer = useCallback(({ isBuffering: buf }) => {
    setIsBuffering(buf);
  }, []);

  const handleError = useCallback((err) => {
    console.warn("[VideoPlayer] Error:", err);
    setIsBuffering(false);
  }, []);

  const handleEnd = useCallback(() => {
    setPaused(true);
    setProgress(1);
    revealControls();
  }, [revealControls]);

  useEffect(() => {
    startHideTimer();
    return () => {
      clearHideTimer();
    };
  }, [startHideTimer, clearHideTimer]);

  const currentFormatted = useMemo(
    () => formatTime(currentSecs),
    [currentSecs],
  );
  const leftFormatted = useMemo(
    () => `-${formatTime(Math.max(0, durationSecs - currentSecs))}`,
    [currentSecs, durationSecs],
  );

  return (
    <View style={styles.root}>
      <StatusBar hidden />

      <TouchableWithoutFeedback onPress={handleVideoTap}>
        <View style={styles.root}>
          <RNVideo
            ref={videoRef}
            source={VIDEO_SOURCE}
            style={styles.root}
            resizeMode="contain"
            paused={paused}
            rate={playbackRate}
            muted={isMuted}
            selectedVideoTrack={selectedVideoTrack}
            selectedTextTrack={selectedTextTrack}
            onLoad={handleLoad}
            onProgress={handleProgress}
            onBuffer={handleBuffer}
            onError={handleError}
            onEnd={handleEnd}
            progressUpdateInterval={500}
            repeat={false}
            ignoreSilentSwitch="ignore"
            playInBackground={false}
            playWhenInactive={false}
            controls={false}
          />
        </View>
      </TouchableWithoutFeedback>

      {isBuffering && (
        <View style={styles.bufferOverlay} pointerEvents="none">
          <View style={styles.bufferRing} />
        </View>
      )}

      {showControls && (
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.root,
            {
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              opacity: controlsOpacity,
              backgroundColor: "transparent",
            },
          ]}
        >
          <View style={styles.topDeck}>
            <View style={styles.topInner}>
              <BlurView
                style={styles.blurPill}
                blurType="dark"
                blurAmount={22}
                reducedTransparencyFallbackColor="rgba(15,15,15,0.92)"
              >
                <TouchableOpacity style={styles.backBtn} onPress={goBack}>
                  <Image
                    source={appImages.backarrow}
                    style={styles.headerIcon}
                    tintColor={colors.white}
                  />
                </TouchableOpacity>
              </BlurView>

              <View style={styles.headerCenter}>
                <Text style={styles.headerTitle} numberOfLines={1}>
                  IndieMate Project
                </Text>
              </View>

              <BlurView
                style={styles.blurPill}
                blurType="dark"
                blurAmount={22}
                reducedTransparencyFallbackColor="rgba(15,15,15,0.92)"
              >
                <TouchableOpacity
                  style={styles.settingsBtn}
                  onPress={openQualitySheet}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <Image
                    source={appImages.settings}
                    style={styles.headerIcon}
                    tintColor={colors.white}
                  />
                </TouchableOpacity>
              </BlurView>
            </View>
          </View>

          <View style={styles.centerControlsContainer} pointerEvents="box-none">
            <BlurView
              style={[styles.blurPill, styles.centerSkipBtn]}
              blurType="dark"
              blurAmount={4}
              reducedTransparencyFallbackColor="rgba(15,15,15,0.92)"
            >
              <TouchableOpacity
                onPress={handleSkipBack}
                style={styles.centerSkipBtn}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Image
                  source={appImages.skipBack}
                  style={[
                    styles.centerSkipIcon,
                    { transform: [{ scaleX: -1 }] },
                  ]}
                  tintColor={colors.white}
                />
              </TouchableOpacity>
            </BlurView>

            <TouchableOpacity
              onPress={handlePlayPause}
              activeOpacity={0.8}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <LinearGradient
                colors={SPLASH_GRADIENT}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.centerPlayBtn}
              >
                <Image
                  source={paused ? appImages.play : appImages.pause}
                  style={styles.centerPlayIcon}
                  tintColor={colors.white}
                />
              </LinearGradient>
            </TouchableOpacity>

            <BlurView
              style={[styles.blurPill, styles.centerSkipBtn]}
              blurType="dark"
              blurAmount={22}
              reducedTransparencyFallbackColor="rgba(15,15,15,0.92)"
            >
              <TouchableOpacity
                onPress={handleSkipForward}
                style={styles.centerSkipBtn}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Image
                  source={appImages.skipForward}
                  style={styles.centerSkipIcon}
                  tintColor={colors.white}
                />
              </TouchableOpacity>
            </BlurView>
          </View>

          <View style={styles.bottomDeck}>
            <BlurView
              style={styles.blurPill}
              blurType="dark"
              blurAmount={22}
              reducedTransparencyFallbackColor="rgba(15,15,15,0.92)"
            >
              <View style={styles.bottomRow}>
                <Text style={styles.timecode}>{currentFormatted}</Text>

                <View style={styles.scrubberWrapper}>
                  <Scrubber
                    progress={progress}
                    onSeek={handleSeek}
                    onSeeking={handleSeeking}
                  />
                </View>

                <Text style={styles.timecode}>{leftFormatted}</Text>
              </View>
            </BlurView>
          </View>
        </Animated.View>
      )}

      <CustomBottomSheet
        ref={qualitySheetRef}
        snapPoints={["50%"]}
        enablePanDownToClose={true}
        useBlur={true}
        style={{ marginHorizontal: scales(50) }}
      >
        <View style={styles.sheetTopHeader}>
          {activeSubMenu !== null ? (
            <TouchableOpacity
              style={styles.backHeaderBtn}
              onPress={() => setActiveSubMenu(null)}
              activeOpacity={0.7}
            >
              <Image
                source={appImages.backarrow}
                style={[styles.headerIcon, { width: 14, height: 14 }]}
                tintColor={colors.white}
              />
              <Text style={styles.backText}>All Settings</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.sheetHeaderTitle}>Video Settings</Text>
          )}

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              qualitySheetRef.current?.dismiss();
              setActiveSubMenu(null);
              startHideTimer();
            }}
          >
            <LinearGradient
              colors={SPLASH_GRADIENT}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.topDoneGradientBtn}
            >
              <Text style={styles.topDoneText} numberOfLines={1}>
                Done
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {activeSubMenu === null && (
          <>
            <TouchableOpacity
              style={styles.settingRow}
              activeOpacity={0.7}
              onPress={() => setActiveSubMenu("quality")}
            >
              <View style={styles.settingRowLeft}>
                <Text style={styles.settingLabel}>Video Quality</Text>
              </View>
              <Text style={styles.settingRightValue}>
                {selectedQuality.label} ›
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingRow}
              activeOpacity={0.7}
              onPress={() => setActiveSubMenu("speed")}
            >
              <View style={styles.settingRowLeft}>
                <Text style={styles.settingLabel}>Playback Speed</Text>
              </View>
              <Text style={styles.settingRightValue}>
                {playbackRate === 1.0 ? "Normal" : `${playbackRate}x`} ›
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingRow}
              activeOpacity={0.7}
              onPress={() => setIsMuted((prev) => !prev)}
            >
              <View style={styles.settingRowLeft}>
                <Text style={styles.settingLabel}>Audio</Text>
              </View>
              <Image
                source={isMuted ? appImages.mute : appImages.unmute}
                style={styles.actionIcon}
                tintColor={colors.white}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingRow}
              activeOpacity={0.7}
              onPress={() => setActiveSubMenu("subtitles")}
            >
              <View style={styles.settingRowLeft}>
                <Text style={styles.settingLabel}>Subtitles & CC</Text>
              </View>
              <Text style={styles.settingRightValue}>
                {selectedSubtitle.label} ›
              </Text>
            </TouchableOpacity>
          </>
        )}

        {activeSubMenu === "quality" &&
          QUALITY_OPTIONS.map((item) => {
            const isSelected = selectedQuality.value === item.value;
            return (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.qualityOption,
                  isSelected && styles.qualityOptionSelected,
                ]}
                activeOpacity={0.7}
                onPress={() => setSelectedQuality(item)}
              >
                <View style={styles.qualityOptionLeft}>
                  <Text
                    style={[
                      styles.qualityText,
                      isSelected && styles.qualityTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                  <Text style={styles.qualityDesc}>{item.desc}</Text>
                </View>
                {isSelected && (
                  <LinearGradient
                    colors={SPLASH_GRADIENT}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.checkBadge}
                  >
                    <Image
                      source={appImages.check}
                      style={styles.checkIcon}
                      tintColor={colors.white}
                    />
                  </LinearGradient>
                )}
              </TouchableOpacity>
            );
          })}

        {activeSubMenu === "speed" &&
          SPEED_OPTIONS.map((item) => {
            const isSelected = playbackRate === item.value;
            return (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.qualityOption,
                  isSelected && styles.qualityOptionSelected,
                ]}
                activeOpacity={0.7}
                onPress={() => setPlaybackRate(item.value)}
              >
                <Text
                  style={[
                    styles.qualityText,
                    isSelected && styles.qualityTextSelected,
                  ]}
                >
                  {item.label}
                </Text>
                {isSelected && (
                  <LinearGradient
                    colors={SPLASH_GRADIENT}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.checkBadge}
                  >
                    <Image
                      source={appImages.check}
                      style={styles.checkIcon}
                      tintColor={colors.white}
                    />
                  </LinearGradient>
                )}
              </TouchableOpacity>
            );
          })}

        {activeSubMenu === "subtitles" &&
          SUBTITLE_OPTIONS.map((item) => {
            const isSelected = selectedSubtitle.value === item.value;
            return (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.qualityOption,
                  isSelected && styles.qualityOptionSelected,
                ]}
                activeOpacity={0.7}
                onPress={() => setSelectedSubtitle(item)}
              >
                <Text
                  style={[
                    styles.qualityText,
                    isSelected && styles.qualityTextSelected,
                  ]}
                >
                  {item.label}
                </Text>
                {isSelected && (
                  <LinearGradient
                    colors={SPLASH_GRADIENT}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.checkBadge}
                  >
                    <Image
                      source={appImages.check}
                      style={styles.checkIcon}
                      tintColor={colors.white}
                    />
                  </LinearGradient>
                )}
              </TouchableOpacity>
            );
          })}
      </CustomBottomSheet>
    </View>
  );
};
