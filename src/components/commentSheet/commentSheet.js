import React, { forwardRef, useState, useCallback } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { CustomBottomSheet } from "../customBottomSheet/customBottomSheet";
import { CustomSkeleton } from "../customSkeleton/customSkeleton";
import { CustomInput } from "../customInput/customInput";
import { ProfileComponent } from "../profileComponent/profileComponent";
import { colors, scales } from "../../utils";
import { fontFamily, appImages } from "../../assets";

const DUMMY_COMMENTS = [
  {
    id: "1",
    user: "Yuvam",
    avatar: appImages.dummyuser,
    text: "This is an amazing post! 🔥 Keep it up.",
    time: "2h",
    likes: 12,
  },
  {
    id: "2",
    user: "Alex",
    avatar: appImages.dummyuser,
    text: "Can't wait to see more of this content.",
    time: "4h",
    likes: 3,
  },
  {
    id: "3",
    user: "Sarah",
    avatar: appImages.dummyuser,
    text: "Where was this taken?",
    time: "5h",
    likes: 0,
  },
  {
    id: "4",
    user: "Michael",
    avatar: appImages.dummyuser,
    text: "So cool! Absolutely love the details in this shot.",
    time: "8h",
    likes: 1,
  },
];

export const CommentSheet = forwardRef((props, ref) => {
  const [isLoading, setIsLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  const handleSheetChanges = useCallback((index) => {
    if (index >= 0 && isLoading) {
      setTimeout(() => {
        setComments(DUMMY_COMMENTS);
        setIsLoading(false);
      }, 1000);
    } else if (index === -1) {
      setIsLoading(true);
      setCommentText("");
      setComments([]);
    }
  }, [isLoading]);

  const renderComment = useCallback((item) => (
    <View key={item.id} style={styles.commentRow}>
      <View style={styles.commentContent}>
        <View style={styles.profileWrapper}>
          <ProfileComponent name={item.user} profileImage={item.avatar} />
        </View>
        <View style={styles.commentTextWrapper}>
          <Text style={styles.commentText}>{item.text}</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.replyText}>Reply • {item.time}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.likeButton} activeOpacity={0.7}>
        <Image source={appImages.heart} style={styles.heartIcon} />
        <Text style={styles.likeCount}>{item.likes}</Text>
      </TouchableOpacity>
    </View>
  ), []);

  const renderSkeleton = () => (
    <View style={styles.skeletonContainer}>
      {[1, 2, 3, 4].map((i) => (
        <CustomSkeleton key={i} variant="comment" />
      ))}
    </View>
  );

  return (
    <CustomBottomSheet
      ref={ref}
      title="Comments"
      snapPoints={["60%", "90%"]}
      useBlur={true}
      enablePanDownToClose={true}
      showCloseButton={true}
      onSheetChanges={handleSheetChanges}
    >
      <View style={styles.content}>
        {isLoading ? (
          renderSkeleton()
        ) : (
          <View style={styles.commentsList}>
            {comments.map(renderComment)}
          </View>
        )}

        <View style={styles.inputContainer}>
          <Image source={appImages.dummyuser} style={styles.inputAvatar} />
          <CustomInput
            isBottomSheet
            placeholder="Add a comment..."
            value={commentText}
            onChangeText={setCommentText}
            height={46}
            containerStyle={styles.inputWrapper}
          />
          <TouchableOpacity 
            style={[styles.sendButton, !commentText.trim() && { opacity: 0.4 }]} 
            disabled={!commentText.trim()}
          >
            <Image source={appImages.send} style={styles.sendIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </CustomBottomSheet>
  );
});

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  skeletonContainer: {
    marginTop: scales(10),
  },
  commentsList: {
    paddingBottom: scales(20),
  },
  commentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: scales(20),
  },
  profileWrapper: {
    height: scales(40),
    marginLeft: -scales(10), // Offset ProfileComponent's internal padding
  },
  commentContent: {
    flex: 1,
  },
  commentTextWrapper: {
    paddingLeft: scales(40), // Align with text next to avatar
    paddingRight: scales(10),
  },
  commentText: {
    color: colors.white,
    fontFamily: fontFamily.regular,
    fontSize: scales(14),
    lineHeight: scales(20),
    marginBottom: scales(6),
  },
  replyText: {
    color: colors.transparentWhite40,
    fontFamily: fontFamily.semiBold,
    fontSize: scales(12),
  },
  likeButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: scales(4),
    width: scales(40),
  },
  heartIcon: {
    width: scales(16),
    height: scales(16),
    tintColor: colors.transparentWhite40,
    marginBottom: scales(4),
  },
  likeCount: {
    color: colors.transparentWhite40,
    fontFamily: fontFamily.regular,
    fontSize: scales(11),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.transparentWhite15,
    paddingTop: scales(16),
    marginTop: scales(10),
  },
  inputAvatar: {
    width: scales(36),
    height: scales(36),
    borderRadius: scales(18),
    marginRight: scales(10),
  },
  inputWrapper: {
    flex: 1,
    marginBottom: 0,
  },
  sendButton: {
    width: scales(46),
    height: scales(46),
    borderRadius: scales(23),
    backgroundColor: colors.transparentWhite15,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: scales(10),
  },
  sendIcon: {
    width: scales(20),
    height: scales(20),
    tintColor: colors.white,
  },
});
