import { Text, Button, Input } from "galio-framework";
import { View, Alert, TouchableHighlight, FlatList, Pressable } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Budgets } from "./DBOp";
import { Feather } from "@expo/vector-icons";
import { TagBox } from "./Utility";
import { LinearGradient } from "expo-linear-gradient";

export default function ModifyTransaction({ route, navigation }) {
  const { transacIdx } = route.params;
  const { budgets, budgetIdx, updateTransac } = Budgets();
  const target = budgets[budgetIdx].transactions[transacIdx];
  const [date, setDate] = useState(new Date(target.date));
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [selectedCat, setSelectedCat] = useState(target.categories);
  const [expn, setExpn] = useState(target.value < 0);

  const [name, setName] = useState(target.name);
  const [desc, setDesc] = useState(target.desc);
  const [value, setValue] = useState(target.value);

  const [open, setOpen] = useState(false);
  const [_value, _setValue] = useState(0);

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
            Edit transaction.
          </Text>
          <Feather
            className="self-start"
            name="check"
            color="white"
            size={25}
            onPress={() => {
              if (desc === "" || value === "") {
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
                  updateTransac(transacIdx, {
                    name: name,
                    desc: desc,
                    value: expn
                      ? Math.abs(parseFloat(value)) * -1
                      : Math.abs(parseFloat(value)),
                    categories: selectedCat,
                    date: date.toISOString(),
                  });
                  navigation.goBack();
                }
              }
            }}
          />
        </View>
      </LinearGradient>
      <View className="w-5/6 items-center">
        <View
          start={[1, 1]}
          end={[0, 1]}
          colors={["#DB9AFF", "#6934BF"]}
          className="flex-row items-center justify-between px-2 py-2 my-5 self-center rounded-xl"
          style={{ gap: 10, backgroundColor: "#9c62dc" }}
        >
          <Pressable
            className="rounded-xl"
            onPress={() => setExpn(true)}
            activeOpacity={1}
          >
            <View
              className="px-3 py-1 rounded-xl"
              style={{
                backgroundColor: !expn ? "rgba(0,0,0,0)" : "white",
                borderWidth: 0.5,
                borderColor: "white",
              }}
            >
              <Text
                className="uppercase text-xs"
                style={{ color: !expn ? "white" : "#9c62dc", fontWeight: 400 }}
                p
              >
                Expense
              </Text>
            </View>
          </Pressable>
          <Pressable
            className="rounded-xl"
            onPress={() => setExpn(false)}
            activeOpacity={0.9}
          >
            <View
              className="p-3 py-1 rounded-xl"
              style={{
                backgroundColor: expn ? "rgba(0,0,0,0)" : "white",
                borderWidth: 0.5,
                borderColor: "white",
              }}
            >
              <Text
                className="uppercase text-xs"
                style={{
                  color: expn ? "white" : "#9c62dc",
                  fontWeight: 400,
                }}
                p
              >
                Income
              </Text>
            </View>
          </Pressable>
        </View>
        <View>
          <Input
            placeholder="Description."
            icon="text"
            family="entypo"
            onChangeText={setDesc}
            color="black"
            style={{
              borderWidth: 0,
            }}
            multiline
            numberOfLines={15}
          >
            {desc}
          </Input>
          <Input
            type="number-pad"
            placeholder="Value."
            icon="money"
            onChangeText={setValue}
            family="MaterialIcons"
            color="black"
            style={{
              borderWidth: 0,
            }}
          >
            {value}
          </Input>
          <Text className="mt-5 pb-2" color="#9c62dc" h5>
            Date
          </Text>
          <View className="flex-row w-full">
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
              textColor="#9c62dc"
              style={{ backgroundColor: "#9c62dc" }}
            />
          )}
          <Text className="mt-5 pb-2" color="#9c62dc" h5>
            Categories
          </Text>
          <View className="w-full self-center pb-5">
            <FlatList
              horizontal
              data={categories}
              keyExtractor={(a, i) => i}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TagBox
                  content={item.name}
                  bgColor="white"
                  selectedBgColor="#9c62dc"
                  onPress={() =>
                    selectedCat.find((v) => v === item.name)
                      ? setSelectedCat(
                          selectedCat.filter((v) => v !== item.name)
                        )
                      : setSelectedCat([...selectedCat, item.name])
                  }
                  selected={selectedCat.find((v) => v === item.name)}
                  style={{
                    borderRadius: 20,
                    marginHorizontal: 2,
                  }}
                />
              )}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
