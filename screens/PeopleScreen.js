import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
// import { Button } from "@rneui/themed";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchData } from "../app/profileSlice";

import PeopleHome from "./PeopleHome";
import QRScanScreen from "./QRScanScreen";

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TheirCardScreen from "./TheirCardScreen";


const PeopleScreen = ({navigation}) => {
  const Stack = createNativeStackNavigator();


  return (
    // <NavigationContainer independent={true}>
    <Stack.Navigator initialRouteName='PeopleHome' 
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name='PeopleHome' component={PeopleHome}/>
      <Stack.Screen name='QRScan' component={QRScanScreen}/>
      <Stack.Screen name='TheirCardScreen' component={TheirCardScreen}/>
    </Stack.Navigator>
  // </NavigationContainer>
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
