import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCardData } from "../app/cardsSlice";
import { StyleSheet, Text, View } from "react-native";
import Links from "./Links";
// import Avatar from "react-native-boring-avatars-pyt";

const CardDetail = () => {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((state) => state.cards);
  // useEffect(() => {
  //   console.log("detail")
  //   console.log(data)
  //   dispatch(fetchCardData());
  // }, [dispatch]);

  return (
    <View style={styles.cardContainer}>
      <View style={styles.infoContainer}>
        {/* <Text style={styles.profilePic}>Headshot</Text> */}
        {/* <Avatar
          size={20}
          name="Rena Shen"
          variant="bauhaus"
          colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
        /> */}
        <View style={styles.basicInfo}>
          <Text>{data.firstName} {data.lastName}</Text>
          <Text>{data.bio}</Text>
        </View>
      </View>
      <View style={styles.linkContainer}>
        <Links />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    height: "50%",
    width: "100%",
    justifyContent: "center",
    backgroundColor: "lightblue",
    borderRadius: 16,
    borderColor: "black",
    borderWidth: 2,
  },
  infoContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  profilePic: {
    justifyContent: "center",
  },
  basicInfo: {
    justifyContent: "center",
  },
  linkContainer: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
  },

})

export default CardDetail