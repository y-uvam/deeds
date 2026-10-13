import React, { useState, useCallback, useRef, memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  AppBackground,
  Header,
  ProfileComponent,
  CustomBottomSheet,
} from "../../components";
import { colors, scales, commonText } from "../../utils";
import { appImages, fontFamily } from "../../assets";
import { goBack, navigate, routesConstants } from "../../navigation";
import { showCustomMessage } from "../../helper/FlashMessage";
import { useImagePicker } from "../../hooks/imagePicker";

const INITIAL_MESSAGES = [
  {
    id: "1",
    text: "Hey! How's it going with the new project?",
    sender: "other",
    time: "10:00 AM",
  },
  {
    id: "2",
    text: "It's going great! Just finished the chat UI.",
    sender: "me",
    time: "10:05 AM",
  },
  {
    id: "3",
    text: "That was fast! 🚀 Can you send over a screenshot?",
    sender: "other",
    time: "10:06 AM",
  },
  {
    id: "4",
    text: "Sure, let me just polish the animations first.",
    sender: "me",
    time: "10:10 AM",
  },
  {
    id: "5",
    text: "Sounds good, looking forward to it!",
    sender: "other",
    time: "10:12 AM",
  },
];

const MessageBubble = memo(({ message }) => {
  const isMe = message.sender === "me";
  return (
    <View
      style={[
        styles.bubbleWrapper,
        isMe ? styles.myBubbleWrapper : styles.otherBubbleWrapper,
      ]}
    >
      <View
        style={[styles.bubble, isMe ? styles.myBubble : styles.otherBubble]}
      >
        {message.image && (
          <Image
            source={{ uri: message.image }}
            style={styles.messageImage}
            resizeMode="cover"
          />
        )}
        {message.text ? (
          <Text
            style={[
              styles.messageText,
              isMe ? styles.myMessageText : styles.otherMessageText,
            ]}
          >
            {message.text}
          </Text>
        ) : null}
        <Text
          style={[
            styles.timeText,
            isMe ? styles.myTimeText : styles.otherTimeText,
          ]}
        >
          {message.time}
        </Text>
      </View>
    </View>
  );
});

export const ChatCard = () => {
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const flatListRef = useRef(null);
  const userOptionsSheetRef = useRef(null);
  const attachSheetRef = useRef(null);
  const { openGallery, openCamera } = useImagePicker();

  const ListItem = ({ image, label, onPress, isDestructive }) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={styles.listItem}
        activeOpacity={0.7}
      >
        <Image
          source={image}
          style={[styles.listImage, isDestructive && { tintColor: colors.red }]}
          resizeMode="contain"
          tintColor={isDestructive ? colors.red : colors.white}
        />
        <Text style={[styles.listText, isDestructive && { color: colors.red }]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const ImageOption = ({ label, icon, onPress, isDestructive }) => (
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
      <Text
        style={[styles.optionLabel, isDestructive && { color: colors.red }]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const sendMessage = (text, imageUri = null) => {
    const finalMsg = typeof text === "string" ? text : message;
    if (!imageUri && finalMsg.trim().length === 0) return;

    const newMessage = {
      id: Date.now().toString(),
      text: finalMsg.trim(),
      image: imageUri,
      sender: "me",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
    if (!imageUri && typeof text !== "string") setMessage("");

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handlePickCamera = async () => {
    attachSheetRef.current?.dismiss();
    const images = await openCamera({
      cropping: false,
      mediaType: "photo",
    });
    if (images && images.length > 0) {
      sendMessage("", images[0].path);
    }
  };

  const handlePickGallery = async () => {
    attachSheetRef.current?.dismiss();
    const images = await openGallery({
      cropping: false,
      mediaType: "any",
      multiple: false,
    });
    if (images && images.length > 0) {
      sendMessage("", images[0].path);
    }
  };

  const renderItem = useCallback(
    ({ item }) => <MessageBubble message={item} />,
    [],
  );

  return (
    <AppBackground showAuthAnimation={true}>
      <Header
        showBackButton={true}
        onBackPress={() => goBack()}
        customTitle={
          <ProfileComponent
            name="Alex Johnson"
            profileImage={appImages.dummyuser}
            style={{ paddingHorizontal: 0 }}
          />
        }
        rightIcon={appImages.threeDots}
        onRightPress={() => userOptionsSheetRef.current?.present()}
      />

      <KeyboardAvoidingView
        style={styles.flexContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          style={styles.flexList}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: false })
          }
        />

        <View
          style={[
            styles.inputWrapper,
            {
              paddingBottom: insets.bottom > 0 ? insets.bottom : scales(12),
            },
          ]}
        >
          <TouchableOpacity
            style={styles.attachBtn}
            onPress={() => attachSheetRef.current?.present()}
            activeOpacity={0.7}
          >
            <Image source={appImages.plus} style={styles.icon} />
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor={colors.gray}
              value={message}
              onChangeText={setMessage}
              multiline
            />
          </View>

          <TouchableOpacity
            style={[styles.sendBtn, !message.trim() && styles.sendBtnDisabled]}
            onPress={() => sendMessage(message)}
            disabled={!message.trim()}
            activeOpacity={0.8}
          >
            <Image
              source={appImages.send}
              style={[styles.icon, { tintColor: colors.white }]}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Attach Media Sheet */}
      <CustomBottomSheet
        ref={attachSheetRef}
        snapPoints={["32%"]}
        useBlur={true}
        enablePanDownToClose={true}
        enableBackdrop={true}
        showCloseButton={true}
        title="Share Content"
        subtitle="Select media to send in chat"
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
        </View>
      </CustomBottomSheet>

      {/* User Options Sheet */}
      <CustomBottomSheet
        ref={userOptionsSheetRef}
        snapPoints={["64%"]}
        useBlur={true}
        enablePanDownToClose={true}
        enableBackdrop={true}
        showCloseButton={true}
        title="User Options"
        subtitle="Select an action for Alex Johnson"
      >
        <View style={styles.listItemContainer}>
          <ListItem
            image={appImages.info}
            label="View Profile"
            onPress={() => {
              userOptionsSheetRef.current?.dismiss();
              navigate(routesConstants.Profile);
            }}
          />
          <ListItem
            image={appImages.follow}
            label="Follow Creator"
            onPress={() => {
              userOptionsSheetRef.current?.dismiss();
              showCustomMessage("Followed creator", "success");
            }}
          />
          <ListItem
            image={appImages.bell}
            label="Mute Creator"
            onPress={() => {
              userOptionsSheetRef.current?.dismiss();
              showCustomMessage("Muted creator messages", "info");
            }}
          />
          <ListItem
            image={appImages.pin}
            label="Pin Chat"
            onPress={() => {
              userOptionsSheetRef.current?.dismiss();
              showCustomMessage("Chat pinned to top", "success");
            }}
          />
          <ListItem
            image={appImages.bin}
            label="Delete Chat"
            isDestructive={true}
            onPress={() => {
              userOptionsSheetRef.current?.dismiss();
              showCustomMessage("Chat history deleted", "info");
            }}
          />
          <ListItem
            image={appImages.blocked}
            label="Block User"
            isDestructive={true}
            onPress={() => {
              userOptionsSheetRef.current?.dismiss();
              showCustomMessage("Blocked user", "danger");
            }}
          />
          <ListItem
            image={appImages.report}
            label="Report User"
            isDestructive={true}
            onPress={() => {
              userOptionsSheetRef.current?.dismiss();
              showCustomMessage(
                "Report submitted. Thank you for keeping IndieMate safe.",
                "danger",
              );
            }}
          />
        </View>
      </CustomBottomSheet>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  flexList: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: scales(20),
    paddingBottom: scales(16),
    paddingTop: scales(10),
  },
  bubbleWrapper: {
    marginBottom: scales(15),
    width: "100%",
  },
  myBubbleWrapper: {
    alignItems: "flex-end",
  },
  otherBubbleWrapper: {
    alignItems: "flex-start",
  },
  bubble: {
    maxWidth: "80%",
    paddingHorizontal: scales(15),
    paddingVertical: scales(10),
    borderRadius: scales(20),
  },
  myBubble: {
    backgroundColor: colors.blue,
    borderBottomRightRadius: scales(4),
  },
  otherBubble: {
    backgroundColor: colors.darkblack,
    borderBottomLeftRadius: scales(4),
  },
  messageImage: {
    width: scales(200),
    height: scales(150),
    borderRadius: scales(14),
    marginBottom: scales(6),
  },
  messageText: {
    fontSize: scales(15),
    fontFamily: fontFamily.regular,
    lineHeight: scales(20),
  },
  myMessageText: {
    color: colors.white,
  },
  otherMessageText: {
    color: colors.lightGray,
  },
  timeText: {
    fontSize: scales(10),
    fontFamily: fontFamily.regular,
    marginTop: scales(4),
    alignSelf: "flex-end",
  },
  myTimeText: {
    color: "rgba(255,255,255,0.7)",
  },
  otherTimeText: {
    color: "rgba(255,255,255,0.4)",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scales(15),
    paddingTop: scales(10),
    borderTopWidth: 1,
    borderTopColor: colors.transparentWhite15,
  },
  attachBtn: {
    width: scales(40),
    height: scales(40),
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: scales(22),
    marginHorizontal: scales(8),
    paddingHorizontal: scales(15),
    paddingVertical: Platform.OS === "ios" ? scales(10) : scales(4),
    minHeight: scales(44),
    maxHeight: scales(100),
    justifyContent: "center",
  },
  input: {
    color: colors.white,
    fontSize: scales(15),
    fontFamily: fontFamily.regular,
    paddingVertical: 0,
  },
  sendBtn: {
    width: scales(42),
    height: scales(42),
    backgroundColor: colors.blue,
    borderRadius: scales(21),
    justifyContent: "center",
    alignItems: "center",
  },
  sendBtnDisabled: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  icon: {
    width: scales(20),
    height: scales(20),
    resizeMode: "contain",
    tintColor: "rgba(255,255,255,0.6)",
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
    width: scales(22),
    height: scales(22),
    tintColor: colors.white,
  },
  optionLabel: {
    color: colors.white,
    fontSize: scales(16),
    fontFamily: fontFamily.medium,
  },
  listItemContainer: {
    paddingVertical: scales(4),
    gap: scales(10),
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: scales(12),
    paddingHorizontal: scales(14),
    borderRadius: scales(14),
    backgroundColor: colors.transparentWhite5,
    gap: scales(14),
  },
  listImage: {
    height: scales(20),
    width: scales(20),
  },
  listText: {
    color: colors.white,
    fontFamily: fontFamily.semiBold,
    fontSize: scales(14),
    letterSpacing: 0.5,
  },
});
