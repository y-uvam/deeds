import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  AppBackground,
  Header,
  Spacer,
  CustomInput,
  CustomSearch,
} from "../../components";
import { colors, commonText, scales } from "../../utils";
import { appImages, fontFamily } from "../../assets";
import { goBack, navigate, routesConstants } from "../../navigation";

const CONTACTS = [
  { id: "1", name: "Alex Johnson", status: "Driver", online: true },
  { id: "2", name: "Sarah Williams", status: "Customer", online: false },
  { id: "3", name: "Michael Chen", status: "Driver", online: true },
  { id: "4", name: "Jessica Smith", status: "Customer", online: true },
  { id: "5", name: "David Miller", status: "Driver", online: false },
  { id: "6", name: "Emily Brown", status: "Customer", online: true },
];

const ContactItem = ({ item }) => (
  <TouchableOpacity
    style={styles.contactRow}
    onPress={() => navigate(routesConstants.chatCard)}
  >
    <View style={styles.avatarWrapper}>
      <Image source={appImages.dummyuser} style={styles.avatar} />
      {item.online && <View style={styles.onlineBadge} />}
    </View>
    <View style={styles.contactInfo}>
      <Text style={styles.contactName}>{item.name}</Text>
      <Text style={styles.contactStatus}>{item.status}</Text>
    </View>
    <TouchableOpacity style={styles.messageIcon}>
      <Image source={appImages.chat} style={styles.icon} />
    </TouchableOpacity>
  </TouchableOpacity>
);

export const NewChat = () => {
  const [search, setSearch] = useState("");

  const filteredContacts = CONTACTS.filter((contact) =>
    contact.name.toLowerCase().includes(search.toLowerCase()),
  );

  const renderItem = useCallback(({ item }) => <ContactItem item={item} />, []);

  return (
    <AppBackground>
      <Header
        label="New Message"
        showBackButton={true}
        onBackPress={() => goBack()}
      />

      <CustomSearch
        placeholder={commonText.search}
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>SUGGESTED</Text>
      </View>

      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: scales(20),
    marginTop: scales(10),
  },
  sectionHeader: {
    paddingHorizontal: scales(25),
    marginTop: scales(20),
    marginBottom: scales(10),
  },
  sectionTitle: {
    fontSize: scales(12),
    fontFamily: fontFamily.bold,
    color: "rgba(255,255,255,0.4)",
    letterSpacing: 1,
  },
  listContent: {
    paddingHorizontal: scales(20),
    paddingBottom: scales(30),
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: scales(12),
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: scales(50),
    height: scales(50),
    borderRadius: scales(25),
    backgroundColor: colors.darkblack,
  },
  onlineBadge: {
    position: "absolute",
    bottom: scales(1),
    right: scales(1),
    width: scales(12),
    height: scales(12),
    borderRadius: scales(6),
    backgroundColor: "#00D15D",
    borderWidth: 2,
    borderColor: colors.black,
  },
  contactInfo: {
    flex: 1,
    marginLeft: scales(15),
  },
  contactName: {
    fontSize: scales(16),
    fontFamily: fontFamily.bold,
    color: colors.white,
  },
  contactStatus: {
    fontSize: scales(13),
    fontFamily: fontFamily.regular,
    color: "rgba(255,255,255,0.5)",
    marginTop: scales(2),
  },
  messageIcon: {
    width: scales(40),
    height: scales(40),
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: scales(20),
    height: scales(20),
    tintColor: colors.blue,
    resizeMode: "contain",
  },
});
