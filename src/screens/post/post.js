import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import { AppBackground, Header, PostItem, Spacer } from "../../components";
import { commonText, scales } from "../../utils";
import { appImages } from "../../assets";

export const Post = ({ route }) => {
  const {
    images = [appImages.post],
    description = "Living life one deed at a time 🌟 Grateful for the small moments that make everything worthwhile.",
    likes = 248,
    comments = 36,
    shares = 12,
  } = route?.params || {};

  return (
    <AppBackground>
      <Header label={commonText.posts} showBackButton={true} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <PostItem
          images={images}
          description={description}
          likes={likes}
          comments={comments}
          shares={shares}
        />
        <Spacer height={scales(40)} />
      </ScrollView>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: scales(60),
  },
});
