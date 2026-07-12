import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { Spacer, CustomSwitch } from "../../components";
import { colors, scales } from "../../utils";
import { appImages } from "../../assets";
import { useState } from "react";

const DATA = [
  {
    id: "1",
    price: "$600",
    pickupTime: "1 hour",
    type: "Hourly",
    date: "Today",
    pickupLoc: "123 Main St, Downtown",
    dropLoc: "456 Park Ave, Uptown",
  },
  {
    id: "2",
    price: "$250",
    pickupTime: "30 mins",
    type: "One Way",
    date: "Tomorrow",
    pickupLoc: "789 Broadway, West Side",
    dropLoc: "101 Fifth Ave, Midtown",
  },
];

const CardItem = ({ item }) => {
  return (
    <View style={cardStyles.card}>
      <View style={cardStyles.topRow}>
        <Text style={cardStyles.price}>{item.price}</Text>
        <Image
          source={appImages.car}
          style={cardStyles.carImage}
          resizeMode="contain"
        />
      </View>

      <View style={cardStyles.pillRow}>
        <View style={cardStyles.pill}>
          <Text style={cardStyles.pillText}>🕒 Pickup: {item.pickupTime}</Text>
        </View>
        <View style={cardStyles.pill}>
          <Text style={cardStyles.pillText}>Type: {item.type}</Text>
        </View>
      </View>

      <View style={cardStyles.dateRow}>
        <Text style={cardStyles.dateText}>📅 {item.date}</Text>
      </View>

      <View style={cardStyles.routeContainer}>
        <View style={cardStyles.timeline}>
          <View style={[cardStyles.dot, { backgroundColor: colors.green }]} />
          <View style={cardStyles.line} />
          <View style={[cardStyles.dot, { backgroundColor: colors.red }]} />
        </View>
        <View style={cardStyles.locationContainer}>
          <View>
            <Text style={cardStyles.label}>Pickup</Text>
            <Text style={cardStyles.location}>{item.pickupLoc}</Text>
          </View>
          <Spacer height={scales(20)} />
          <View>
            <Text style={cardStyles.label}>Drop</Text>
            <Text style={cardStyles.location}>{item.dropLoc}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export const Home = () => {
  const [isOnline, setIsOnline] = useState(false);

  return (
    <View style={style.container}>
      <View style={style.onlineContainer}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: scales(10),
          }}
        >
          <Image
            source={appImages.dummyuser}
            style={{ height: scales(50), width: scales(50) }}
          />
          <View>
            <Text style={{ color: colors.white, fontSize: scales(16) }}>
              Sam
            </Text>
            <Text style={{ color: colors.white, fontSize: scales(14) }}>
              4.9 (328 trips)
            </Text>
          </View>
        </View>
        <CustomSwitch
          value={isOnline}
          onValueChange={(val) => setIsOnline(val)}
          activeColor={colors.green}
          inactiveColor={colors.gray}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginHorizontal: scales(10),
          alignSelf: "center",
          width: "90%",
        }}
      >
        <Text>Available Requests</Text>
        <View
          style={{
            borderColor: colors.borderColor,
            borderWidth: 1,
            paddingHorizontal: scales(15),
            paddingVertical: scales(5),
            borderRadius: scales(20),
            flexDirection: "row",
            alignItems: "center",
            gap: scales(5),
          }}
        >
          <View
            style={{
              height: 10,
              width: 10,
              borderRadius: 10,
              backgroundColor: colors.red,
            }}
          />
          <Text>Offline</Text>
        </View>
      </View>
      <Spacer height={scales(20)} />
      {isOnline ? (
        <FlatList
          data={DATA}
          renderItem={({ item }) => <CardItem item={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={style.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={style.offlineWrapper}>
          <View style={style.offlineCard}>
            <Text style={style.offlineText}>You are currently offline</Text>
            <Text style={style.offlineSubtext}>
              Turn on the switch to start receiving trips
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offwhite || "#F6F5FB",
    paddingTop: scales(20),
  },
  onlineContainer: {
    backgroundColor: colors.blue,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    alignSelf: "center",
    padding: scales(15),
    borderRadius: scales(20),
    marginBottom: scales(20),
  },
  listContent: {
    paddingHorizontal: "5%",
    paddingBottom: scales(30),
    gap: scales(20),
  },
  offlineWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: "10%",
  },
  offlineCard: {
    backgroundColor: "white",
    padding: scales(30),
    borderRadius: scales(20),
    alignItems: "center",
    width: "100%",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  offlineText: {
    fontSize: scales(18),
    fontWeight: "bold",
    color: colors.black,
    marginBottom: scales(5),
  },
  offlineSubtext: {
    fontSize: scales(14),
    color: colors.gray,
    textAlign: "center",
  },
});

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: scales(25),
    padding: scales(20),
    width: "100%",
    borderColor: colors.borderColor,
    borderWidth: 1,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: scales(28),
    fontWeight: "bold",
    color: colors.black,
  },
  carImage: {
    width: scales(120),
    height: scales(60),
  },
  pillRow: {
    flexDirection: "row",
    gap: scales(10),
    marginTop: scales(15),
  },
  pill: {
    borderColor: colors.borderColor,
    borderWidth: 1,
    borderRadius: scales(30),
    paddingVertical: scales(10),
    paddingHorizontal: scales(10),
    flex: 1,
    alignItems: "center",
  },
  pillText: {
    fontSize: scales(12),
    fontWeight: "600",
    color: colors.black,
  },
  dateRow: {
    marginTop: scales(20),
  },
  dateText: {
    fontSize: scales(16),
    fontWeight: "bold",
    color: colors.black,
  },
  routeContainer: {
    flexDirection: "row",
    marginTop: scales(20),
    marginLeft: scales(5),
  },
  timeline: {
    alignItems: "center",
    width: scales(30),
  },
  dot: {
    width: scales(14),
    height: scales(14),
    borderRadius: scales(7),
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: colors.borderColor,
    marginVertical: scales(5),
  },
  locationContainer: {
    flex: 1,
    marginLeft: scales(10),
  },
  label: {
    fontSize: scales(12),
    color: colors.gray,
    marginBottom: scales(2),
  },
  location: {
    fontSize: scales(16),
    fontWeight: "bold",
    color: colors.black,
  },
});
