import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import { Text, Button } from "galio-framework";
import { LinearGradient } from "expo-linear-gradient";
import { HLine, getFriendlyFormat } from "./Utility";
import { Entypo, MaterialIcons, AntDesign } from "@expo/vector-icons";
import { Budgets } from "./DBOp";

export default function TransacView({ route, navigation }) {
  const { budgetID, tr_idx, name, description, category, amount, date } = route.params;
  const { delTransac } = Budgets();
  return (
    <SafeAreaView style={{ backgroundColor: "#E5DDF0" }}>
      <View
        className="w-5/6 items-center self-center mt-8 "
        style={{ gap: 20, height: "100%", backgroundColor: "#E5DDF0" }}
      >
        <View
          className="items-center px-5 py-5"
          style={{
            backgroundColor: "rgba(0,0,0,0.075)",
            borderRadius: 100,
          }}
        >
          <AntDesign
            name={parseInt(amount) >= 0 ? "upcircleo" : "downcircleo"}
            color="#6934BF"
            size={50}
          />
        </View>
        <Text h1 color="#6934BF" style={{ fontFamily: "Inter-Light" }}>
          {amount < 0 ? "Expense": "Income"}
        </Text>
        <View
          className="items-center w-full rounded-lg py-8"
          style={{ backgroundColor: "white", gap: 5 }}
        >
          <View className="flex-row items-center w-5/6 justify-between">
            <Text color="grey">Name</Text>
            <Text style={{ fontFamily: "Inter-Bold" }}>{name}</Text>
          </View>
          <View className="flex-row items-center w-5/6 justify-between">
            <Text color="grey">Details</Text>
            <Text style={{ fontFamily: "Inter-Bold" }}>{description}</Text>
          </View>
          <View className="flex-row items-center w-5/6 justify-between">
            <Text color="grey">Date Issued</Text>
            <Text style={{ fontFamily: "Inter-Bold" }}>
              {new Date(date).toLocaleDateString()}
            </Text>
          </View>
          <View className="flex-row items-center w-5/6 justify-between">
            <Text color="grey">Time Issued</Text>
            <Text style={{ fontFamily: "Inter-Bold" }}>
              {new Date(date).toLocaleTimeString()}
            </Text>
          </View>
          <View className="flex-row items-center w-5/6 justify-between mt-10">
            <Text color="grey" h5>
              Amount
            </Text>
            <Text style={{ fontFamily: "Inter-Bold" }} h5>
              {getFriendlyFormat(parseInt(amount) < 0 ? parseInt(amount) * -1 : parseInt(amount))} USD
            </Text>
          </View>
          <Button className="mt-5" color="#6934BF" onPress={() => delTransac(budgetID, tr_idx)}>
            DELETE
          </Button>
        </View>
        <View className="flex-row items-center" style={{ }}>
          <Button color="white" onPress={navigation.goBack}>
            <Text color="#6934BF">BACK</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
