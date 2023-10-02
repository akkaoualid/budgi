import { View, Alert } from "react-native";
import { Text, Input, Button } from "galio-framework";
import { SafeAreaView } from "react-native-safe-area-context";
import { Budgets } from "./DBOp";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";

export default function AddGoal({ navigation }) {
  const { addGoal, budgetIdx } = Budgets();
  const [name, setName] = useState("");
  const [value, setValue] = useState(0);
  return (
    <SafeAreaView
      className="items-center"
      style={{ backgroundColor: "#E5DDF0", height: "100%" }}
    >
      <LinearGradient
        start={[1, 1]}
        end={[0, 1]}
        colors={["#DB9AFF", "#6934BF"]}
        className="rounded-lg w-[90%] items-center py-5 mt-5"
      >
        <View className="flex-row justify-between items-center self-start w-5/6 self-center">
          <Feather
            className="self-start"
            name="x"
            color="white"
            size={25}
            onPress={() => navigation.goBack()}
          />
          <Text color="white" h5>
            Add Goal.
          </Text>
          <Feather
            className="self-start"
            name="check"
            color="white"
            size={25}
            onPress={() => {
              if (name === "" || value === 0) {
                Alert.alert(
                  "Couldn't add goal",
                  "fr u trying adding an empty goal 💀."
                );
              } else {
                if (value < 0) {
                  Alert.alert("huh?", "negative goal 💀");
                } else {
                  addGoal(budgetIdx, {
                    name: name,
                    value: parseFloat(value),
                    date: new Date().toISOString(),
                  });
                  navigation.goBack();
                }
              }
            }}
          />
        </View>
      </LinearGradient>
      <View className="w-5/6 self-center items-center my-8" style={{ gap: 20 }}>
        <Input
          onChangeText={setName}
          placeholder="Name"
          style={{ borderWidth: 0 }}
        />
        <Input
          onChangeText={setValue}
          type="numeric"
          placeholder="Target"
          style={{ borderWidth: 0 }}
        />
      </View>
    </SafeAreaView>
  );
}
