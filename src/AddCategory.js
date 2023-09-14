import { View, Alert } from "react-native";
import { Text, Input, Button } from "galio-framework";
import { SafeAreaView } from "react-native-safe-area-context";
import { Budgets } from "./DBOp";
import { useState } from "react";

export default function AddCategory({ navigation, route }) {
  const { addCat, budgetIdx } = Budgets();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  return (
    <SafeAreaView style={{ backgroundColor: "#E5DDF0", height: "100%" }}>
      <View className="w-5/6 self-center items-center my-8" style={{ gap: 20 }}>
        <Text color="#6934BF" h1>
          Add category.
        </Text>
        <Input onChangeText={setName} placeholder="Name" />
        <Input onChangeText={setDesc} placeholder="Description" />
        <View className="flex-row">
          <Button
            onPress={() => navigation.goBack()}
            style={{ borderColor: "#6934BF" }}
            color="transparent"
          >
            <Text color="#6934BF">Cancel.</Text>
          </Button>
          <Button
            onPress={() => {
              if (name === "" || desc === 0) {
                Alert.alert(
                  "Couldn't add category",
                  "plz fill the blanks before adding anything smh."
                );
              } else {
                addCat(budgetIdx, {
                  name: name,
                  desc: desc,
                  date: new Date().toISOString(),
                });
                navigation.goBack();
              }
            }}
          >
            Create.
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
