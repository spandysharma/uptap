import { useEffect, useState } from "react";
import { deleteUserTheirCard, fetchUserData } from "../app/userSlice";
import { colorCalculate } from "./PeopleHome";

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Button } from "@rneui/themed";
import { useSelector, useDispatch } from "react-redux";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../app/firebase";
import { getAuthUser } from "../app/firebase";

const TheirCardScreen = ({ route, navigation }) => {
  const card = route.params.card;
  const { userData, userStatus, userError } = useSelector(
    (state) => state.user
  );
  const currentAuthUser = getAuthUser();
  const dispatch = useDispatch();

  const theirCardDeleteHandler = async () => {
    dispatch(deleteUserTheirCard(card.id));
    const { their_cards_data_list, my_cards_data_list, ...pruned_user_data } =
      userData;
    let updatedTheirCards = [...pruned_user_data.theirCards];
    const indexOfTheirCardRemoved = pruned_user_data.theirCards.indexOf(
      card.id
    );
    updatedTheirCards.splice(indexOfTheirCardRemoved, 1);
    await setDoc(doc(db, "users", currentAuthUser.uid), {
      ...pruned_user_data,
      theirCards: updatedTheirCards,
    });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <View style={styles.theirCard}>
        <Text style={styles.cardTextHeaderStyle}>
          {card.firstName} {card.lastName}
        </Text>
        <Text style={styles.cardTextStyle}>Works at {card.company}</Text>
        {Object.entries(card).map(([keyName, value], index) => {
          if (
            keyName !== "firstName" &&
            keyName !== "lastName" &&
            keyName !== "id" &&
            keyName !== "company"
          ) {
            return (
              <Text style={styles.cardTextStyle} key={index}>
                {keyName}: {value}
              </Text>
            );
          }
        })}
      </View>
      <Button onPress={theirCardDeleteHandler}>Remove</Button>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  theirCard: {
    backgroundColor: colorCalculate(),
    flex: 0.5,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
  },
  bodyContainer: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "blue",
    color: "white",
  },
  cardTextStyle: {
    fontSize: 20,
  },
  cardTextHeaderStyle: {
    fontSize: 36,
  },
  backButton: {
    width: "85%",
    // fontSize: 24,
  },
  backButtonText: {
    fontSize: 24,
  },
});
export default TheirCardScreen;
