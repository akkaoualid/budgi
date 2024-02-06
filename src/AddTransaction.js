import { Text, Button, Input } from "galio-framework";
import {
  View,
  Switch,
  Alert,
  FlatList,
  Pressable,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Budgets } from "./DBOp";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { TagBox } from "./Utility";

export default function AddTransaction({ navigation }) {
  const [date, setDate] = useState(new Date(Date.now()));
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [categoryStr, setCategoryStr] = useState(null);
  const [selectedCat, setSelectedCat] = useState([]);
  const [expn, setExpn] = useState(false);

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [value, setValue] = useState("");

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
            Add transaction.
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
                  addTransac(budgetIdx, {
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
        <View>
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
          <Input
            placeholder="Details."
            icon="text"
            family="entypo"
            onChangeText={setDesc}
            multiline
            numberOfLines={20}
            style={{
              borderWidth: 0,
            }}
          />
          <Input
            type="number-pad"
            placeholder="Value."
            icon="money"
            onChangeText={setValue}
            family="MaterialIcons"
            style={{
              borderWidth: 0,
            }}
          />
          {/* <Text color="#6934BF" h5>
                  Date.
                </Text> */}
          <Text className="mt-5" color="#9c62dc" h5>
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
              textColor="#6934BF"
              style={{ backgroundColor: "#6934BF" }}
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
                    marginHorizontal: 2,
                    borderRadius: 20,
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
