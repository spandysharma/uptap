import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";

import { useSelector, useDispatch } from "react-redux";
import { getAuthUser } from "../app/firebase";
import QRCode from "react-native-qrcode-svg";
import { colorCalculate } from "./PeopleHome";
import { deleteUserMyCard } from "../app/userSlice";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../app/firebase";

import { Button } from "@rneui/themed";

const MyCardScreen = ({ route, navigation }) => {
  const card = route.params.card;
  const { userData, userStatus, userError } = useSelector(
    (state) => state.user
  );
  const currentAuthUser=getAuthUser();
  const dispatch=useDispatch();
  
  const myCardDeleteHandler = async () => {
    dispatch(deleteUserMyCard(card.id));
    const { their_cards_data_list, my_cards_data_list, ...pruned_user_data } =
      userData;
    let updatedMyCards = [...pruned_user_data.myCards];
    const indexOfMyCardRemoved = pruned_user_data.myCards.indexOf(
      card.id
    );
    updatedMyCards.splice(indexOfMyCardRemoved, 1);
    await setDoc(doc(db, "users", currentAuthUser.uid), {
      ...pruned_user_data,
      myCards: updatedMyCards,
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

      <View style={styles.cardContainer}>
        <View style={styles.QRContainer}>
          <QRCode value={card.id} size={150} />
        </View>
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
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("CardEditScreen", {
            card: card,
          })
        }
      >
        <Text style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>
      <Button color="error" onPress={myCardDeleteHandler}>Delete Card</Button>
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
  bodyContainer: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "blue",
    color: "white",
  },
  QRContainer:{
    backgroundColor: '#FFF',
    // borderWidth: 2,
    padding: '4%',
    marginBottom: '5%',
    borderRadius: 10,
  },
  theirCard: {
    backgroundColor: colorCalculate(),
    flex: 0.5,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
  },
  cardTextStyle: {
    marginVertical: 5,
    fontSize: 20,
  },
  cardTextHeaderStyle: {
    fontSize: 36,
  },
  cardContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colorCalculate(),
    padding: "5%",
    height: "60%",
    width: "90%",
    borderRadius: 18,
  },
  editButtonText: {
    fontSize: 24,
    marginTop: 15,
  },
  backButton: {
    width: "85%",
    // fontSize: 24,
  },
  backButtonText: {
    fontSize: 24,
  },
});

export default MyCardScreen;
