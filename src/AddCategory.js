import { View, Alert } from "react-native";
import { Text, Input, Button } from "galio-framework";
import { SafeAreaView } from "react-native-safe-area-context";
import { Category } from "./DBOp";
import { useState, useEffect } from "react";

export default function AddCategory({ navigation }) {
  const { addCategory } = Category();
  const [name, setName] = useState("");
  const [cats, setCats] = useState(null);
  const [desc, setDesc] = useState("");
  return (
    <SafeAreaView style={{ backgroundColor: "#E5DDF0", height: "100%" }}>
      <View className="w-5/6 self-center items-center my-8" style={{ gap: 20 }}>
        <Text color="#6934BF" h1>
          Add category.
        </Text>
        <Input onChangeText={setName} placeholder="Name" />
        <Input onChangeText={setDesc} placeholder="Description" />
        <Button
          onPress={() =>
            {if (name === "" || value === 0) {
              Alert.alert(
                "Couldn't add category",
                "plz fill the blanks before adding anything smh."
              );
            } else {
            addCategory({
              name: name,
              desc: desc,
              date: new Date().toISOString(),
            })
            navigation.goBack();
          }}
        }
        >
          Create.
        </Button>
      </View>
    </SafeAreaView>
  );
}
