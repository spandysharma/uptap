import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
// import { Button } from "@rneui/themed";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchData } from "../app/profileSlice";

import MeHome from "./MeHome";
import MyCardScreen from "./MyCardScreen";
import CardEdit from "./CardEdit";

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const PeopleScreen = ({ navigation }) => {
  const Stack = createNativeStackNavigator();


  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName='MeHome'
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name='MeHome' component={MeHome} />
        <Stack.Screen name='MyCardScreen' component={MyCardScreen} />
        <Stack.Screen name='CardEditScreen' component={CardEdit} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: "5%",
    justifyContent: "center",
    alignItems: "center",
    // borderWidth: 1,
  },
  cameraContainer: {
    height: 250, // Adjust the height as needed
    width: 250, // Take the full width of the parent container
  },
});

export default PeopleScreen;
