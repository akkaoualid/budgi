import { View, Alert } from "react-native";
import { Text, Button, Input } from "galio-framework";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Fontisto } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Budgets } from "./DBOp";

export default function AddBudget({ navigation }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [value, setValue] = useState(null);

  const [date, setDate] = useState(new Date(Date.now()));
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const { addBudget } = Budgets();

  const onChange = (_, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };
  return (
    <SafeAreaView
      className="h-full items-center w-full"
      style={{ backgroundColor: "#E5DDF0", width: "100%" }}
    >
      <View className="mt-8 items-center w-5/6">
        <View>
          <Text className="my-8" color="#6934BF" h1={true}>
            Create a budget.
          </Text>
        </View>
        <View className="w-full">
          <Input
            placeholder="Display name. (ex. School)"
            onChangeText={(e) => {
              setName(e);
            }}
            icon="label"
            family="materialicons"
            style={{
              borderColor: "#6934BF",
            }}
          />
          <Input
            placeholder="Description. (ex. Budget related to this & that....)"
            onChangeText={(e) => {
              setDesc(e);
            }}
            icon="text"
            family="entypo"
            style={{
              borderColor: "#6934BF",
            }}
          />
          <Input
            placeholder="Value."
            type="numeric"
            onChangeText={setValue}
            icon="money"
            family="fontawesome"
            style={{
              borderColor: "#6934BF",
            }}
          />
        </View>
        <View className="items-start w-full">
          <View className="flex-row items-center">
            <Fontisto name="date" size={24} color="grey" />
            <Button
              onPress={() => {
                setMode("date");
                setShow(true);
              }}
              style={{
                borderColor: "#6934BF",
                backgroundColor: "white",
              }}
              color="transparent"
            >
              <Text>{date.toLocaleDateString()}</Text>
            </Button>
          </View>
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="numeric" size={24} color="grey" />
            <Button
              onPress={() => {
                setMode("time");
                setShow(true);
              }}
              style={{
                borderColor: "#6934BF",
                backgroundColor: "white",
              }}
              color="transparent"
            >
              <Text>{date.toLocaleTimeString()}</Text>
            </Button>
          </View>
        </View>
        {show && (
          <DateTimePicker
            value={date}
            mode={mode}
            is24Hour={true}
            onChange={onChange}
            textColor="#6934BF"
            style={{ backgroundColor: "#6934BF" }}
          />
        )}
        <View className="my-10 self-center flex-row">
          <Button
            style={{ borderColor: "#6934BF" }}
            color="transparent"
            onPress={() => navigation.goBack()}
          >
            <Text color="#6934BF">Cancel.</Text>
          </Button>
          <Button
            icon="plus"
            iconFamily="antdesign"
            onPress={() => {
              if (name === "" || desc === "" || value === null) {
                Alert.alert(
                  "Couldn't create budget",
                  "please make sure you filled all the inputs before adding."
                );
              } else {
                if (isNaN(parseFloat(value)) || value <= 0) {
                  Alert.alert(
                    "Invalid value",
                    `the value you supplied "${value}" is invalid`
                  );
                } else {
                  addBudget({
                    name: name,
                    desc: desc,
                    value: value,
                    oldvalue: value,
                    newvalue: value,
                    date: date.toISOString(),
                    transactions: [],
                    goals: [],
                    categories: [],
                  });
                  navigation.goBack();
                }
              }
            }}
          >
            Create
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
