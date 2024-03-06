import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { db } from "./firebase";
import { db } from "./firebase";
import { doc, getDoc, getDocs, collection, query } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { getAuthUser } from "./firebase";

export const fetchUserData = createAsyncThunk(
  "users/fetchUserData",
  async () => {
    const currentAuthUser = getAuthUser();
    const docRef1 = doc(db, "users", currentAuthUser.uid);
    const docSnapshot1 = await getDoc(docRef1);

    let their_cards_data_list = [];

    // Assuming docSnapshot1.data().theirCards is an array of card IDs
    const theirCardIds = docSnapshot1.data().theirCards;

    // Use Promise.all to wait for all async operations to complete
    await Promise.all(
      theirCardIds.map(async (card_id) => {
        const docRef = doc(db, "cards", card_id);
        const docSnapShot = await getDoc(docRef);

        if (docSnapShot.exists()) {
          their_cards_data_list.push({ id: card_id, ...docSnapShot.data() });
        } else {
          // Handle the case where the document does not exist
          console.log(`Document with ID ${card_id} does not exist.`);
        }
      })
    );

    // Now process myCards
    let my_cards_data_list = [];

    // Assuming docSnapshot1.data().myCards is an array of card IDs
    const myCardIds = docSnapshot1.data().myCards;

    // Use Promise.all to wait for all async operations to complete
    await Promise.all(
      myCardIds.map(async (card_id) => {
        const docRef = doc(db, "cards", card_id);
        const docSnapShot = await getDoc(docRef);

        if (docSnapShot.exists()) {
          my_cards_data_list.push({ id: card_id, ...docSnapShot.data() });
        } else {
          // Handle the case where the document does not exist
          console.log(`Document with ID ${card_id} does not exist.`);
        }
      })
    );

    return {
      ...docSnapshot1.data(),
      their_cards_data_list: their_cards_data_list,
      my_cards_data_list: my_cards_data_list,
    };
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: {
      displayName: "",
      email: "",
      myCards: [],
      theirCards: [],
      their_cards_data_list: [],
      my_cards_data_list: [],
    },
    userStatus: "idle",
  },
  reducers: {
    addUserTheirCards: (state, action) => {
      if (!state.userData.theirCards.includes(action.payload)) {
        state.userData.theirCards.push(action.payload);
      }
    },
    addUserMyCards: (state, action) => {
      if (!state.userData.myCards.includes(action.payload)) {
        state.userData.myCards.push(action.payload);
      }
    },
    addUserTheirCardDataList: (state, action) => {
      if (!state.userData.their_cards_data_list.includes(action.payload)) {
        state.userData.their_cards_data_list = [
          ...state.userData.their_cards_data_list,
          action.payload,
        ];
      }
    },
    addUserMyCardDataList: (state, action) => {
      if (!state.userData.my_cards_data_list.includes(action.payload)) {
        state.userData.my_cards_data_list = [
          ...state.userData.my_cards_data_list,
          action.payload,
        ];
      }
    },
    updateUserMyCardDataList: (state, action) => {
      const cardIndex = state.userData.my_cards_data_list.findIndex(
        (card_data) => card_data.id === action.payload.id
      );
      // console.log(state.userData.my_cards_data_list)
      if (cardIndex !== -1) {
        state.userData.my_cards_data_list[cardIndex] = {
          ...action.payload.updatedCard,
          id: action.payload.id,
        };
      }
    },
    setUserstatus: (state, action) => {
      state.userStatus = action.payload;
    },
    deleteUserTheirCard: (state, action) => {
      const cardIndex = state.userData.theirCards.findIndex(
        (card_id) => card_id === action.payload
      );
      if (cardIndex !== -1) {
        state.userData.theirCards.splice(cardIndex, 1)
      }
      const cardDataIndex = state.userData.their_cards_data_list.findIndex(
        (card) => card.id === action.payload
      );
      if (cardDataIndex !== -1) {
        state.userData.their_cards_data_list.splice(cardDataIndex, 1)
      }
    },
    deleteUserMyCard: (state, action) => {
      const cardIndex = state.userData.myCards.findIndex(
        (card_id) => card_id === action.payload
      );
      if (cardIndex !== -1) {
        state.userData.myCards.splice(cardIndex, 1)
      }
      const cardDataIndex = state.userData.my_cards_data_list.findIndex(
        (card) => card.id === action.payload
      );
      if (cardDataIndex !== -1) {
        state.userData.my_cards_data_list.splice(cardDataIndex, 1)
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.userStatus = "loading";
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.userData = { ...action.payload };
        state.userStatus = "succeeded";
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.userStatus = "failed";
        state.userError = action.error.message;
      });
  },
});

export const {
  setUserstatus,
  addUserTheirCards,
  addUserTheirCardDataList,
  addUserMyCards,
  addUserMyCardDataList,
  updateUserMyCardDataList,
  deleteUserTheirCard,
  deleteUserMyCard
} = userSlice.actions;

export default userSlice.reducer;
