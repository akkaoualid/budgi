import { View, Alert } from "react-native";
import { Text, Input, Button } from "galio-framework";
import { SafeAreaView } from "react-native-safe-area-context";
import { Budgets } from "./DBOp";
import { useState } from "react";

export default function AddGoal({ navigation }) {
  const { addGoal, budgetIdx } = Budgets();
  const [name, setName] = useState("");
  const [value, setValue] = useState(0);
  return (
    <SafeAreaView style={{ backgroundColor: "#E5DDF0", height: "100%" }}>
      <View className="w-5/6 self-center items-center my-8" style={{ gap: 20 }}>
        <Text color="#6934BF" h1>
          Add Goal.
        </Text>
        <Input onChangeText={setName} placeholder="Name" />
        <Input onChangeText={setValue} type="numeric" placeholder="Target" />
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
          >
            Create.
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
