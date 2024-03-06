import { useState, useEffect } from "react";

import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { Button, Dialog } from "@rneui/themed";

import { useDispatch, useSelector } from "react-redux";
import { BarCodeScanner } from "expo-barcode-scanner";

import {
  addUserTheirCards,
  fetchUserData,
  addUserTheirCardDataList,
} from "../app/userSlice";


import { db } from "../app/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getAuthUser } from "../app/firebase";

const QRScanScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const currentAuthUser = getAuthUser();

  const { userData, userStatus, userError } = useSelector(
    (state) => state.user
  );
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scanAgain, setScanAgain] = useState(false);
  const [scannedCard, setScannedCard] = useState("");
  const [scannedCardId, setScannedCardId] = useState("");

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const updateuserData = async () => {
    setVisible(false);
    if(!userData.theirCards.includes(scannedCardId))
    {
      dispatch(addUserTheirCards(scannedCardId));
    }
    const { their_cards_data_list, my_cards_data_list, ...pruned_user_data } =
      userData;
    if (!pruned_user_data.theirCards.includes(scannedCardId)) {
      pruned_user_data.theirCards = [...userData.theirCards, scannedCardId];
      await setDoc(doc(db, "users", currentAuthUser.uid), pruned_user_data);
      const docRef = doc(db, "cards", scannedCardId);
      const docSnapShot = await getDoc(docRef);
      dispatch(
        addUserTheirCardDataList({ id: scannedCardId, ...docSnapShot.data() })
      );
    }

    navigation.navigate("PeopleHome");
  };

  const handleBarCodeScanned = async ({ type, data: card_id }) => {
    setScanned(true);

    if (card_id.includes("//")) {
      alert("Invalid card ID. Try again with a valid QR from the UpTap App!");
      setScanAgain(true);
      return;
    }
    //data contains doc id of a card from the cards collection on firebase
    const docRef = doc(db, "cards", card_id);

    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      // alert(`Card identified: ${docSnapshot.data().nameOfCard}`);
      setScannedCard(docSnapshot.data());
      setScannedCardId(card_id);
      setVisible(true);
    } else {
      // docSnap.data() will be undefined in this case
      console.log(card_id)
      alert("Invalid card ID. Try again with a valid QR from the UpTap App!");
      setScanAgain(true);
      return;
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.caption}>Scan an UpTap QR Code!</Text>
      <Dialog isVisible={visible} onBackdropPress={() => setVisible(false)}>
        {/* <Dialog.Title>
          Card Identified
        </Dialog.Title> */}
        <Text>
          Card Identified! {scannedCard.nameOfCard} from {scannedCard.firstName}
        </Text>
        <Text>Do you want to add this card?</Text>
        <Dialog.Button onPress={updateuserData}>Yes</Dialog.Button>
        <Dialog.Button
          onPress={() => {
            setVisible(false);
            setScanAgain(true);
          }}
        >
          No
        </Dialog.Button>
      </Dialog>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={styles.cameraContainer}
      />
      {scanAgain && (
        <Button
          onPress={() => {
            setScanned(false);
            setScanAgain(false);
          }}
        >
          Scan Again
        </Button>
      )}
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
  cameraContainer: {
    height: '60%', // Adjust the height as needed
    width: '60%', // Take the full width of the parent container
  },
  caption:{
    fontSize: 24,
    marginBottom: 10,
  },
});
export default QRScanScreen;
