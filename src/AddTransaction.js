import { Text, Button, Input } from "galio-framework";
import { View, Switch, Alert, Dimensions } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Budgets } from "./DBOp";

export default function AddTransaction({ navigation }) {
  const [date, setDate] = useState(new Date(Date.now()));
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [categoryStr, setCategoryStr] = useState(null);
  const [expn, setExpn] = useState(false);

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [value, setValue] = useState("");

  const [open, setOpen] = useState(false);
  const [_value, _setValue] = useState(90);

  const { addTransac, budgets, budgetIdx } = Budgets();
  const categories = budgets[budgetIdx].categories || [];
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
            type="number-pad"
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
          <View className="w-full" style={{ gap: 20 }}>
            <DropDownPicker
            placeholder="Choose a Category."
              style={{
                borderWidth: 0,
                zIndex: 1000,
                borderBottomWidth: 1,
                width: "100%",
                borderColor: "#6934BF",
                alignSelf: "center"
              }}
              containerStyle={{
                borderWidth: 0,
                borderColor: "white",
                zIndex: 1000,
                height: Dimensions.get("screen").height * 0.2,
              }}
              textStyle={{ color: "#6934BF", fontSize: 15, borderWidth: 0 }}
              dropDownContainerStyle={{
                color: "#6934BF",
                borderWidth: 0,
                backgroundColor: "white",
                zIndex: 1000,
                paddingBottom: 5,
              }}
              listItemContainerStyle={{
                backgroundColor: "rgba(0,0,0,0.05)",
                paddingHorizontal: 2,
                paddingVertical: 2,
                borderRadius: 5,
                marginTop: 2,
                width: "98%",
                alignSelf: "center",
              }}
              open={open}
              value={_value}
              setOpen={setOpen}
              setValue={_setValue}
              onSelectItem={(s) => setCategoryStr(s["label"])}
              items={categories.map((v, i) => {
                return { label: v.name, value: i };
              })}
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
                Math.abs(parseFloat(value)) >
                  parseFloat(budgets[budgetIdx].newvalue)
              ) {
                Alert.alert(
                  "Couldn't add transaction",
                  "the expense value exceeds the budget."
                );
              } else {
                if (isNaN(parseFloat(value))) {
                  Alert.alert(
                    "Invalid value",
                    `the value you supplied "${value}" is invalid`
                  );
                } else {
                  addTransac(budgetIdx, {
                    name: name,
                    desc: desc,
                    value: expn
                      ? Math.abs(parseFloat(value)) * -1
                      : Math.abs(parseFloat(value)),
                    category: categoryStr || "Uncategorized",
                    date: date.toISOString(),
                  });
                  navigation.goBack();
                }
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
