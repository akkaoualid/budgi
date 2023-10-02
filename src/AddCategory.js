import { View, Alert, FlatList, TextInput } from "react-native";
import { Text, Input, Button } from "galio-framework";
import { SafeAreaView } from "react-native-safe-area-context";
import { Budgets } from "./DBOp";
import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { HLine } from "./Utility";

export default function AddCategory({ navigation, route }) {
  const { addCat, delCat, budgetIdx, budgets } = Budgets();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const categories = budgets[budgetIdx].categories;
  return (
    <SafeAreaView
      className="items-center"
      style={{ height: "100%", width: "100%", backgroundColor: "#E5DDF0" }}
    >
      <LinearGradient
        start={[1, 1]}
        end={[0, 1]}
        colors={["#DB9AFF", "#6934BF"]}
        className="rounded-lg w-[90%] items-center py-5 mt-5"
      >
        <View
          className="flex-row items-center self-start w-5/6 self-center"
        >
          <Feather
            className="self-start"
            name="x"
            color="white"
            size={25}
            onPress={() => navigation.goBack()}
          />
          <Text color="white" className="ml-[25%]" h5>
            Add Category.
          </Text>
        </View>
      </LinearGradient>
      <View className="w-5/6 self-center items-center">
        <View className="flex-row w-full justify-between items-center mt-5">
          <TextInput
            className="w-5/6 rounded-lg p-2"
            style={{
              borderWidth: 0.5,
              backgroundColor: "white",
              borderColor: "grey",
            }}
            onChangeText={setName}
            placeholder="Value"
          >
            {name}
          </TextInput>
          <Button
            icon="plus"
            iconFamily="entypo"
            color="white"
            iconColor="#9c62dc"
            style={{ borderWidth: 0.5, borderColor: "grey" }}
            onlyIcon
            onPress={() => {
              if (name === "") {
                Alert.alert(
                  "Couldn't add category",
                  "plz fill the blanks before adding anything smh."
                );
              } else {
                addCat(budgetIdx, {
                  name: name,
                  date: new Date().toISOString(),
                });
                setName("");
              }
            }}
          />
        </View>
        <View
          className="my-4"
          style={{ height: 1, width: "100%", backgroundColor: "#9c62dc" }}
        ></View>
        <Text color="#9c62dc" h4>
          Categories
        </Text>
        <View className="w-full h-[60%] mt-8">
          <FlatList
            data={categories}
            contentContainerStyle={{ gap: 5 }}
            renderItem={({ item, index }) => (
              <View
                className="flex-row items-center justify-between w-full pl-4 rounded-lg"
                style={{
                  borderWidth: 0.5,
                  borderColor: "grey",
                  backgroundColor: "white",
                }}
              >
                <Text>{item.name}</Text>
                <Button
                  color="white"
                  iconColor="#9c62dc"
                  iconFamily="entypo"
                  icon="trash"
                  iconSize={14}
                  onlyIcon
                  style={{ borderColor: "#9c62dc", borderWidth: 0.5 }}
                  onPress={() => delCat(budgetIdx, index)}
                />
              </View>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
