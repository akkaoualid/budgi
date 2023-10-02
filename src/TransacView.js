import { SafeAreaView } from "react-native-safe-area-context";
import { View, FlatList } from "react-native";
import { Text, Button } from "galio-framework";
import { getFriendlyFormat, ThreeDotsMenu } from "./Utility";
import { AntDesign, Feather } from "@expo/vector-icons";
import { AppSettings, Budgets } from "./DBOp";

export default function TransacView({ route, navigation }) {
  const { budgetIdx, tr_idx } = route.params;
  const { delTransac, budgets } = Budgets();
  const { currency } = AppSettings();
  const name = budgets[budgetIdx].transactions[tr_idx].name;
  const description = budgets[budgetIdx].transactions[tr_idx].desc;
  const date = budgets[budgetIdx].transactions[tr_idx].date;
  const categories = budgets[budgetIdx].transactions[tr_idx].categories;
  const amount = budgets[budgetIdx].transactions[tr_idx].value;
  return (
    <SafeAreaView style={{ backgroundColor: "#E5DDF0" }}>
      <View
        className="w-5/6 items-center self-center mt-8 "
        style={{ gap: 20, height: "100%", backgroundColor: "#E5DDF0" }}
      >
        <View className="flex-row items-center w-full justify-between">
          <Feather
            name="arrow-left"
            color="#9c62dc"
            size={23}
            onPress={() => navigation.goBack()}
          />
          <ThreeDotsMenu
            iconColor="#9c62dc"
            iconSize={20}
            onEditCallback={() => {
              navigation.navigate("ModifyTransaction", {
                transacIdx: tr_idx,
              });
            }}
            onDeleteCallback={() => {
              delTransac(budgetIdx, tr_idx, parseFloat(amount));
              navigation.navigate("Home");
            }}
          />
        </View>
        <View
          className="items-center px-5 py-5"
          style={{
            backgroundColor: "rgba(0,0,0,0.075)",
            borderRadius: 100,
          }}
        >
          <AntDesign
            name={parseFloat(amount) >= 0 ? "upcircleo" : "downcircleo"}
            color="#9c62dc"
            size={50}
          />
        </View>
        <Text h1 color="#9c62dc" style={{ fontFamily: "Inter-Regular" }}>
          {amount < 0 ? "Expense" : "Income"}
        </Text>
        <View
          className="items-center w-full rounded-lg py-8"
          style={{ backgroundColor: "white", gap: 20 }}
        >
          <View className="flex-column w-5/6 justify-between">
            <Text color="grey">Name</Text>
            <Text style={{ fontFamily: "Inter-Bold" }}>{name}</Text>
          </View>
          <View className="flex-column w-5/6 justify-between">
            <Text color="grey">Details</Text>
            <Text style={{ fontFamily: "Inter-Bold" }}>{description}</Text>
          </View>
          <View className="flex-column w-5/6 justify-between">
            <Text color="grey">Date Issued</Text>
            <Text style={{ fontFamily: "Inter-Bold" }}>
              {new Date(date).toLocaleDateString()}
            </Text>
          </View>
          <View className="flex-column w-5/6 justify-between">
            <Text color="grey">Time Issued</Text>
            <Text style={{ fontFamily: "Inter-Bold" }}>
              {new Date(date).toLocaleTimeString()}
            </Text>
          </View>
          <View className="flex-column w-5/6 justify-between">
            <Text className="pb-2" color="grey">
              Categories
            </Text>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={categories}
              contentContainerStyle={{ flexDirection: "row" }}
              renderItem={({ item }) => (
                <View
                  className="rounded-3xl mr-2 w-[80px] p-2 items-center"
                  style={{ backgroundColor: "rgba(0,0,0,0.1)" }}
                >
                  <Text>{item}</Text>
                </View>
              )}
            />
          </View>
          <View className="flex-column items-center w-5/6 justify-between mt-10">
            <Text style={{ fontFamily: "Inter-Bold", color: "#9c62dc" }} h4>
              {parseFloat(amount) < 0
                ? parseFloat(amount) * -1
                : parseFloat(amount)}{" "}
              {currency}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
