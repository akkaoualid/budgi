import { Text, Button, Input, Checkbox } from "galio-framework";
import { View, Modal, Pressable, Switch, Alert } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import { BlurView } from "expo-blur";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Transaction, Budgets, Category } from "./DBOp";

export default function AddTransaction({ route, navigation }) {
  const { categories } = Category();
  const [date, setDate] = useState(new Date(Date.now()));
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [categoryIdx, setCategoryIdx] = useState(0);
  const [expn, setExpn] = useState(false);

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [value, setValue] = useState("");

  //const { addTransac } = Transaction();
  const { budgetID } = route.params;
  console.debug(budgetID);
  const { addTransac, budgets } = Budgets();
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };
  return (
    <SafeAreaView
      className="items-center"
      style={{ height: "100%", width: "100%", backgroundColor: "#E5DDF0" }}
    >
      <View className="mt-8 w-5/6 items-center">
        <Text color="#6934BF" h3>
          Add transaction.
        </Text>
        <View className="mt-8">
          <Input
            placeholder="Name."
            icon="label"
            family="materialicons"
            onChangeText={setName}
            style={{
              borderColor: "#6934BF",
            }}
          />
          <Input
            placeholder="Description."
            icon="text"
            family="entypo"
            onChangeText={setDesc}
            style={{
              borderColor: "#6934BF",
            }}
          />
          <Input
            type="numeric"
            placeholder="Value."
            icon="money"
            onChangeText={setValue}
            family="MaterialIcons"
            style={{
              borderColor: "#6934BF",
            }}
          />
          {/* <Text color="#6934BF" h5>
                  Date.
                </Text> */}
          <View className="flex-row w-full">
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
          <View className="flex-row pt-4 items-center">
            <Switch
              value={expn}
              onChange={() => setExpn(!expn)}
              thumbColor="#6934BF"
              trackColor={{ true: "#9174C0", false: "rgba(0,0,0,0.2)" }}
            />
            <Text>Expense</Text>
          </View>
          <View className="flex-row pb-5 items-center">
            <Switch
              value={!expn}
              onChange={() => setExpn(!expn)}
              thumbColor="#6934BF"
              trackColor={{ true: "#9174C0", false: "rgba(0,0,0,0.2)" }}
            />
            <Text>Income</Text>
          </View>
          <View style={{ gap: 20 }}>
            <SelectDropdown
              defaultButtonText="Select Category."
              data={categories.map((x) => x.name)}
              buttonStyle={{
                borderColor: "#6934BF",
                borderWidth: 1,
                borderRadius: 5,
                backgroundColor: "white",
              }}
              buttonTextStyle={{ color: "#6934BF" }}
              onSelect={(_, i) => setCategoryIdx(i)}
            />
          </View>
        </View>
        <View className="flex-row items-center mt-10">
          <Button
            onPress={() => navigation.goBack()}
            style={{ borderColor: "#6934BF" }}
            color="transparent"
          >
            <Text color="#6934BF">Cancel.</Text>
          </Button>
          <Button
            onPress={() => {
              if (name === "" || desc === "" || value === "") {
                Alert.alert(
                  "Couldn't add transaction",
                  "please make sure you filled all the inputs before adding."
                );
              } else if (
                expn &&
                Math.abs(parseInt(value)) > parseInt(budgets[budgetID].value)
              ) {
                Alert.alert(
                  "Couldn't add transaction",
                  "the expense value exceeds the budget."
                );
              } else {
                addTransac(budgetID, {
                  name: name,
                  desc: desc,
                  value: expn ? parseInt(value) * -1 : parseInt(value),
                  date: date.toISOString(),
                });
              }
            }}
          >
            Submit.
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
