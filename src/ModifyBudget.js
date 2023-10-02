import { View, Alert } from "react-native";
import { Text, Button, Input } from "galio-framework";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Fontisto } from "@expo/vector-icons";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { Budgets } from "./DBOp";
import { LinearGradient } from "expo-linear-gradient";

export default function ModifyBudget({ navigation }) {
  const { updateBudget, budgetIdx, budgets, delBudget } = Budgets();

  const budget = budgets[budgetIdx];

  const [name, setName] = useState(budget.name);
  const [desc, setDesc] = useState(budget.desc);
  const [value, setValue] = useState(budget.newvalue);

  const [date, setDate] = useState(new Date(budget.date));
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

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
            Edit Budget.
          </Text>
          <Feather
            className="self-start"
            name="check"
            color="white"
            size={25}
            onPress={() => {
              if (name === "" || desc === "" || value === null) {
                Alert.alert(
                  "Couldn't modify budget",
                  "please make sure you filled all the inputs before adding."
                );
              } else {
                if (isNaN(parseFloat(value)) || value <= 0) {
                  Alert.alert(
                    "Invalid value",
                    `the value you supplied "${value}" is invalid`
                  );
                } else {
                  updateBudget(budgetIdx, {
                    name: name,
                    desc: desc,
                    value: parseFloat(value),
                    oldvalue: parseFloat(value),
                    newvalue: parseFloat(value),
                    date: date.toISOString(),
                  });
                  navigation.goBack();
                }
              }
            }}
          />
        </View>
      </LinearGradient>
      <View className="items-center w-[90%] my-8">
        <View className="w-full">
          <Input
            placeholder="Display name. (ex. School)"
            onChangeText={(e) => {
              setName(e);
            }}
            icon="label"
            family="materialicons"
            style={{
              borderWidth: 0,
            }}
            color="black"
          >
            {name}
          </Input>
          <Input
            placeholder="Description. (ex. Budget related to this & that....)"
            onChangeText={(e) => {
              setDesc(e);
            }}
            icon="text"
            family="entypo"
            style={{
              borderWidth: 0,
            }}
            color="black"
          >
            {desc}
          </Input>
          <Input
            placeholder="Value."
            type="numeric"
            onChangeText={setValue}
            icon="money"
            family="fontawesome"
            style={{
              borderWidth: 0,
            }}
            color="black"
          >
            {value}
          </Input>
        </View>
        <Text className="mt-5 pb-2 self-start" color="#9c62dc" h5>
          Date
        </Text>
        <View className="flex-row">
          <Button
            onPress={() => {
              setMode("date");
              setShow(true);
            }}
            style={{
              borderWidth: 0,
              backgroundColor: "white",
            }}
            color="transparent"
          >
            <Text>{date.toLocaleDateString()}</Text>
          </Button>
          <Button
            onPress={() => {
              setMode("time");
              setShow(true);
            }}
            style={{
              borderWidth: 0,
              backgroundColor: "white",
            }}
            color="transparent"
          >
            <Text>{date.toLocaleTimeString()}</Text>
          </Button>
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
      </View>
    </SafeAreaView>
  );
}
