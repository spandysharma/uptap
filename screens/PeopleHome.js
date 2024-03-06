import { useEffect, useState } from "react";
import { fetchUserData } from "../app/userSlice";

import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Button } from "@rneui/themed";

import { useDispatch, useSelector } from "react-redux";
import { getAuthUser } from "../app/firebase";

// import TheirCardScreen from "./TheirCardScreen";
export const colorCalculate = () => {
  const colorHex = (Math.random() * 0xfffff * 1000000).toString(16).slice(0, 6);
  return "#" + colorHex;
};

const PeopleHome = ({ navigation }) => {
  const dispatch = useDispatch();
  const currentAuthUser = getAuthUser();
  // const [imgPath, setImgPath] = useState("../assets/cardAvatar1.png");
  const { userData, userStatus, userError } = useSelector(
    (state) => state.user
  );

  const imgPaths = [
    "../assets/cardAvatar0.png",
    "../assets/cardAvatar1.png",
    "../assets/cardAvatar2.png",
  ];

  const theirCardViewHandler = (card) => {
    navigation.navigate("TheirCardScreen", { card: card });
  };

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Collected Cards</Text>
      <View style={styles.cardList}>
        {currentAuthUser &&
          userStatus === "succeeded" &&
          userData.their_cards_data_list.map((card, index) => (
            <TouchableOpacity
              onPress={() => theirCardViewHandler(card)}
              key={card.id}
              style={[
                styles.cardContainer,
                { backgroundColor: colorCalculate() },
              ]}
            >
              <View>
                <Image
                  style={styles.cardAvatar}
                  source={require("../assets/cardAvatar0.png")}
                ></Image>
              </View>
              <View style={styles.cardText}>
                <Text style={styles.headerText}>
                  {card.firstName} {card.lastName}
                </Text>
                <Text>{card.email}</Text>
                {/* <Text>{card.company}</Text> */}
              </View>
            </TouchableOpacity>
          ))}
      </View>
      <Button
        buttonStyle={{ width: "60%" }}
        containerStyle={{ justifyContent: "center", alignItems: "center" }}
        onPress={() => navigation.navigate("QRScan")}
      >
        Scan QR Code
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: "10%",
  },
  cardList:{
    flex: 0.8,
  },
  appHeader: {
    flexDirection: "row",
    // borderWidth: 2,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: "4%",
    paddingVertical: "2%",
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  bodyContainer: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 25,
    paddingHorizontal: '4%'
  },
  headerText: {
    fontSize: 18,
  },
  cardContainer: {
    flex: 0.1,
    justifyContent: "space-around",
    alignItems:'center',
    flexDirection: "row",
    width: "90%",
    alignItems: "center",
    backgroundColor: "#F7C6C8",
    padding: "5%",
    borderRadius: 15,
    marginLeft: 16,
    marginVertical: 8,
  },
  cardText: {
    alignItems: "flex-start",
  },
  cardAvatar: {
    width: 50,
    height: 50,
  },
});
export default PeopleHome;
