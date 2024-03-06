import { View, Text, StyleSheet, FlatList, FlatListComponent } from "react-native"
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCardData } from "../app/cardsSlice";

const Links = () => {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((state) => state.cards);
  console.log(data)
  return (
    <View>
      {/* <FlatList
        data={data.links}
        renderItem={({ item }) => {
          return (
            <View>
              <Text style={styles.link}>link {item}</Text>
            </View>
          )
        }} /> */}
      {/* {data.links.forEach(element => {
        
      });} */}
      <View style={styles.link}>
        <Text>{data.links.Email}</Text>
      </View>
      <View style={styles.link}>
        <Text>{data.links.LinkedIn}</Text>
      </View>
      <View style={styles.link}>
        <Text>{data.links.Instagram}</Text>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  link: {
    flex: 1,
    width: "80%",
    padding: 10,
    margin: 5,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "black",
  }
})
export default Links