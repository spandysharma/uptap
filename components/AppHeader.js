import { View, Text, StyleSheet, Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Button, Icon } from "@rneui/themed";
import { setUserstatus } from "../app/userSlice";

import { getAuthUser, signOut } from "../app/firebase";

const AppHeader = ({navigation}) => {
  const currentAuthUser = getAuthUser();
  const dispatch=useDispatch();
  const { userData, userStatus, userError } = useSelector(
    (state) => state.user
  );

  return (
    <View style={styles.appHeader}>
      <View style={styles.userContainer}>
        <Icon name="user-circle" type="font-awesome"></Icon>
        <Text style={{ marginLeft: 8 }}>
          {currentAuthUser && currentAuthUser.email}
        </Text>
      </View>
      <Button
        onPress={async () => {
          try {
            await signOut();
            dispatch(setUserstatus("loading"));
            navigation.navigate("Login"); // Navigate to the "Login" screen
          } catch (error) {
            Alert.alert("Sign Out Error", error.message, [{ text: "OK" }]);
          }
        }}
        color="error"
      >
        Sign out!
      </Button>
    </View>
  );
};

const styles=StyleSheet.create({
    appHeader: {
        flexDirection: "row",
        width: '100%',
        // borderWidth: 2,
        alignItems: "center",
        justifyContent: "space-between",
        // paddingHorizontal: "4%",
        paddingVertical: '2%',
        marginTop: '4%',
        height: '120%'
      },
      userContainer:{
        flexDirection: "row",
        alignItems: 'center',
      },
})

export default AppHeader;
