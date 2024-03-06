import { View, Text, TextInput, StyleSheet, Alert } from "react-native";

import { Icon } from "@rneui/themed";

// import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PeopleScreen from "./PeopleScreen";
import MeScreen from "./MeScreen";
import AppHeader from "../components/AppHeader";

const Tab = createBottomTabNavigator();

const PostLoginWrapper = ({ navigation }) => {
  return (
    <Tab.Navigator
      screenOptions={{
        // headerShown: false,
      }}
    >
      <Tab.Screen
        name="People"
        options={{
          tabBarIcon: ({ color }) => <Icon name="groups" color={color} />,
          headerTitle: () => <AppHeader navigation={navigation} />
        }}
        component={PeopleScreen}
      />
      <Tab.Screen
        name="Me"
        options={{
          tabBarIcon: ({ color }) => <Icon name="contacts" color={color} />,
          headerTitle: () => <AppHeader navigation={navigation} />
        }}
        component={MeScreen}
      />
    </Tab.Navigator>
  );
};

export default PostLoginWrapper;
