import { View, Alert } from "react-native";
import { Text, Input, Button } from "galio-framework";
import { SafeAreaView } from "react-native-safe-area-context";
import { Goals } from "./DBOp";
import { useState, useEffect } from "react";

export default function AddGoal({ route, navigation }) {
  const { budget_idx } = route.params;
  const { addGoal } = Goals();
  const [name, setName] = useState("");
  const [value, setValue] = useState(null);
  return (
    <SafeAreaView style={{ backgroundColor: "#E5DDF0", height: "100%" }}>
      <View className="w-5/6 self-center items-center my-8" style={{ gap: 20 }}>
        <Text color="#6934BF" h1>
          Add Goal.
        </Text>
        <Input onChangeText={setName} placeholder="Name" />
        <Input onChangeText={setValue} type="numeric" placeholder="Target" />
        <Button
          onPress={() => {
            if (name === "" || value === 0) {
              Alert.alert(
                "Couldn't add goal",
                "fr u trying adding an empty goal 💀."
              );
            } else {
              addGoal({
                budget_idx: budget_idx,
                name: name,
                value: value,
                date: new Date().toISOString(),
              });
              navigation.goBack();
            }
          }}
        >
          Create.
        </Button>
      </View>
    </SafeAreaView>
  );
}
