import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import {
  doc,
  setDoc,
} from "firebase/firestore";
import {
  addUserMyCardDataList,
  addUserMyCards,
  updateUserMyCardDataList,
} from "../app/userSlice";

import { db } from "../app/firebase";
import { getAuthUser } from "../app/firebase";

import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

function CardEditScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const currentAuthUser = getAuthUser();

  const card = route.params.card;
  // let { firstName, lastName, email, nameOfCard } = card;
  const { userData, userStatus, userError } = useSelector(
    (state) => state.user
  );
  const [firstNameInput, setFirstNameInput] = useState(card.firstName || "");
  const [lastNameInput, setLastNameInput] = useState(card.lastName || "");
  const [emailInput, setEmailInput] = useState(card.email || "");
  const [cardNameInput, setCardNameInput] = useState(card.nameOfCard || "");
  const [isCreate, setIsCreate] = useState(!card.id);
  const updateCard = async (updatedCard) => {
    dispatch(
      updateUserMyCardDataList({ id: card.id, updatedCard: updatedCard })
    );

    await setDoc(doc(db, "cards", card.id), updatedCard);
    navigation.navigate("MyCardScreen", {
      card: { id: card.id, ...updatedCard },
    });
  };
  const addCard = async (newCard) => {
    const newCardId = uuidv4();
    dispatch(addUserMyCards(newCardId));
    dispatch(addUserMyCardDataList({id:newCardId, ...newCard}));
    const { their_cards_data_list, my_cards_data_list, ...pruned_user_data } =
      userData;
    pruned_user_data.myCards = [...pruned_user_data.myCards, newCardId];
    try {
      await setDoc(doc(db, "cards", newCardId), newCard);
      await setDoc(doc(db, "users", currentAuthUser.uid), pruned_user_data);
    } catch (error) {
      console.log(error);
    }
    navigation.goBack();
  };
  return (
    <View style={styles.container}>
      <View style={styles.headerCenter}>
        <Text style={styles.headerTextBold}>
          {isCreate ? "Create" : "Edit"} Card
        </Text>
      </View>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.headerText}>Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.headerRight}>
          {isCreate ? (
            <TouchableOpacity
              onPress={() => {
                addCard({
                  firstName: firstNameInput,
                  lastName: lastNameInput,
                  email: emailInput,
                  nameOfCard: cardNameInput,
                });
              }}
            >
              <Text style={[styles.headerText, styles.highlight]}>Create</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                updateCard({
                  firstName: firstNameInput,
                  lastName: lastNameInput,
                  email: emailInput,
                  nameOfCard: cardNameInput,
                });
              }}
            >
              <Text style={[styles.headerText, styles.highlight]}>Save</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView style={styles.body}>
        <View style={styles.entryWithLabel}>
          <View>
            <View style={{ flex: 0.4 }}></View>
            <Text>First Name: </Text>
          </View>
          <View>
            <TextInput
              style={styles.textInput}
              placeholder="First Name"
              value={firstNameInput}
              onChangeText={(text) => setFirstNameInput(text)}
            />
          </View>
        </View>

        <View style={styles.entryWithLabel}>
          <View>
            <View style={{ flex: 0.4 }}></View>
            <Text>Last Name: </Text>
          </View>
          <View>
            <TextInput
              style={styles.textInput}
              placeholder="Last Name"
              value={lastNameInput}
              onChangeText={(text) => setLastNameInput(text)}
            />
          </View>
        </View>

        <View style={styles.entryWithLabel}>
          <View>
            <View style={{ flex: 0.4 }}></View>
            <Text>Card Name </Text>
          </View>
          <View>
            <TextInput
              style={styles.textInput}
              placeholder="Card Name"
              value={cardNameInput}
              onChangeText={(text) => setCardNameInput(text)}
            />
          </View>
        </View>

        <View style={styles.entryWithLabel}>
          <View>
            <View style={{ flex: 0.4 }}></View>
            <Text>Email </Text>
          </View>
          <View>
            <TextInput
              style={styles.textInput}
              placeholder="Email"
              value={emailInput}
              onChangeText={(text) => setEmailInput(text)}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    flex: 0.85,
    backgroundColor: "white",
    width: "100%",
    padding: "5%",
  },
  entryWithLabel: {
    padding: "2%",
  },
  header: {
    // flex: 0.15,
    flexDirection: "row",
    // backgroundColor: "lightgreen",
    alignItems: "flex-end",
    justifyContent: "space-between",
    width: "100%",
    padding: "5%",
  },
  headerLeft: {
    flex: 0.3,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerCenter: {
    // flex: 0.1,
    paddingTop: "4%",
    alignItems: "center",
    justifyContent: "center",
  },
  headerRight: {
    flex: 0.3,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 20,
    // fontWeight: "800",
  },
  headerTextBold: {
    fontSize: 20,
    fontWeight: "800",
  },
});

export default CardEditScreen;
