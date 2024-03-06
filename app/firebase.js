import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as fbSignOut,
  initializeAuth,
  getReactNativePersistence,
  onAuthStateChanged,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "../Secrets";

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

let auth;

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch (error) {
  auth = getAuth(app); // if auth already initialized
}

const signIn = async (email, password) => {
  await signInWithEmailAndPassword(auth, email, password);
};

const signOut = async () => {
  await fbSignOut(auth);
};

const getAuthUser = () => {
  return auth.currentUser;
};

const signUp = async (displayName, email, password) => {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCred.user, { displayName: displayName });
  return userCred.user;
};

let unsubscribeFromAuthChanges = undefined;

const subscribeToAuthChanges = (navigation) => {
  if (unsubscribeFromAuthChanges) {
    unsubscribeFromAuthChanges();
  }

  try {
    unsubscribeFromAuthChanges = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User sign in successful
        navigation.navigate("PostLogin");
      } else {
        // User sign out successful
        navigation.navigate("Login");
      }
    });
  } catch (error) {
    console.error("Error subscribing to auth changes:", error);
  }
};

export {
  app,
  db,
  signIn,
  signOut,
  signUp,
  getAuthUser,
  subscribeToAuthChanges,
};
