import React, { useState, useCallback, useRef } from "react";
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
import {
  AppBackground,
  Header,
  Spacer,
  ProfileComponent,
  CustomBottomSheet,
} from "../../components";
import { colors, scales } from "../../utils";
import { appImages, fontFamily } from "../../assets";
import { goBack, navigate, routesConstants } from "../../navigation";
import { showCustomMessage } from "../../helper/FlashMessage";

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

const MessageBubble = ({ message }) => {
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
        <Text
          style={[
            styles.messageText,
            isMe ? styles.myMessageText : styles.otherMessageText,
          ]}
        >
          {message.text}
        </Text>
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
};

const QUICK_REPLIES = [
  "I'm here.",
  "On my way!",
  "Where are you?",
  "Wait 5 mins.",
  "OK.",
  "Can't talk now.",
];

export const ChatCard = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const flatListRef = useRef(null);
  const userOptionsSheetRef = useRef(null);

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

  const sendMessage = (text) => {
    const finalMsg = typeof text === "string" ? text : message;
    if (finalMsg.trim().length === 0) return;

    const newMessage = {
      id: Date.now().toString(),
      text: finalMsg.trim(),
      sender: "me",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
    if (typeof text !== "string") setMessage("");

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderItem = useCallback(
    ({ item }) => <MessageBubble message={item} />,
    [],
  );

  return (
    <AppBackground>
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

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: false })
        }
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? scales(10) : 0}
      >
        <View style={styles.inputWrapper}>
          <TouchableOpacity style={styles.attachBtn}>
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
            onPress={sendMessage}
            disabled={!message.trim()}
          >
            <Image
              source={appImages.send}
              style={[styles.icon, { tintColor: colors.white }]}
            />
          </TouchableOpacity>
        </View>
        <Spacer height={Platform.OS === "ios" ? scales(30) : scales(10)} />
      </KeyboardAvoidingView>

      <CustomBottomSheet
        ref={userOptionsSheetRef}
        snapPoints={["54%"]}
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
  listContent: {
    paddingHorizontal: scales(20),
    paddingBottom: scales(20),
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
  messageText: {
    fontSize: scales(15),
    fontFamily: fontFamily.regular,
    lineHeight: scales(20),
  },
  myMessageText: {
    color: colors.white,
  },
  otherMessageText: {
    color: "#E5E5E5",
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
    alignItems: "flex-end",
    paddingHorizontal: scales(15),
    paddingVertical: scales(10),
  },
  attachBtn: {
    width: scales(44),
    height: scales(44),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: scales(2),
  },
  inputContainer: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: scales(22),
    marginHorizontal: scales(8),
    paddingHorizontal: scales(15),
    paddingVertical: Platform.OS === "ios" ? scales(10) : scales(2),
    minHeight: scales(44),
    maxHeight: scales(100),
    justifyContent: "center",
  },
  input: {
    color: colors.white,
    fontSize: scales(15),
    fontFamily: fontFamily.regular,
  },
  sendBtn: {
    width: scales(44),
    height: scales(44),
    backgroundColor: colors.blue,
    borderRadius: scales(22),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: scales(2),
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
