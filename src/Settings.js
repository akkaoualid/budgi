import {
  View,
  Modal,
  Dimensions,
  Linking,
  Alert,
  TurboModuleRegistry,
} from "react-native";
import { Text, Input, Button } from "galio-framework";
import { SafeAreaView } from "react-native-safe-area-context";
import { Accordion, Block } from "galio-framework";
import { BlurView } from "expo-blur";
import { useState } from "react";
import { AppSettings, Budgets } from "./DBOp";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Settings() {
  const { symbol, setSymbol, currency, setCurrency } = AppSettings();
  const { purgeAll, budgets } = Budgets();
  const [showFaq, setShowFaq] = useState(false);
  const [curr, setCurr] = useState("");
  const [sym, setSym] = useState("");
  const navigation = useNavigation();
  const faqs = [
    {
      title: "What is this and why do I need it ?",
      content:
        "A budget app useful if you keep forgetting how on earth you spent 800$ last week",
    },
    {
      title: "Free ?",
      content:
        "Completely free dw I don't train neural networks in the background",
    },
    {
      title: "Can I connect a bank account ?",
      content: "No lol",
    },
    {
      title: "What if .... ?",
      content: "Bruh you can do literally anything you want idc",
    },
    {
      title: "Useless Question ?",
      content: "Ye ik just want to have a FAQ so...",
    },
  ];
  return (
    <View
      className="items-center relative w-full h-full"
      style={{ backgroundColor: "#E5DDF0" }}
    >
      <SafeAreaView style={{ width: "90%", alignItems: "flex-start" }}>
        <View className="flex-row items-center w-full mt-5">
          <Feather
            name="arrow-left"
            color="#9c62dc"
            size={23}
            onPress={() => navigation.goBack()}
          />
          <Text color="#9c62dc" style={{ fontFamily: "Inter-Regular", marginLeft: "25%" }} h2>
            Settings
          </Text>
        </View>
        <Modal visible={showFaq} transparent={true} animationType="fade">
          <BlurView className="h-full items-center" intensity={100}>
            <View
              className="w-5/6 rounded-lg self-center"
              style={{
                backgroundColor: "white",
                marginTop: "50%",
                borderWidth: 1,
                borderColor: "#9c62dc",
              }}
            >
              <Block style={{ height: Dimensions.get("window").height / 3 }}>
                <Accordion
                  dataArray={faqs}
                  className="self-center"
                  style={{ gap: 10 }}
                  headerStyle={{
                    borderBottomWidth: 1,
                    borderColor: "rgba(0,0,0,0.1)",
                    paddingHorizontal: 10,
                    marginBottom: 5,
                  }}
                  contentStyle={{ color: "grey", marginLeft: "3%" }}
                />
              </Block>
            </View>
            <Button className="w-5/6" onPress={() => setShowFaq(false)}>
              Close
            </Button>
          </BlurView>
        </Modal>

        <View className="self-center mt-20 w-full" style={{ gap: 30 }}>
          <View style={{ gap: 10 }}>
            <Text
              color="#9c62dc"
              style={{ fontFamily: "Inter-Regular", fontSize: 20 }}
            >
              Data Settings
            </Text>
            <View
              className="w-full py-2 px-5 rounded-lg"
              style={{ backgroundColor: "white" }}
            >
              <Input
                placeholder={`Currency (current: ${currency})`}
                style={{
                  backgroundColor: "rgba(0,0,0,0)",
                  color: "white",
                  borderColor: "#9c62dc",
                }}
                onChangeText={setCurr}
                placeholderTextColor="#9c62dc"
              />
              <Input
                placeholder={`Symobl (current: ${symbol})`}
                style={{
                  backgroundColor: "rgba(0,0,0,0)",
                  color: "white",
                  borderColor: "#9c62dc",
                }}
                onChangeText={setSym}
                placeholderTextColor="#9c62dc"
              />
              <Button
                className="self-center"
                onPress={() => {
                  setCurrency(curr);
                  setSymbol(sym);
                }}
              >
                Save.
              </Button>
              <Button
                icon="delete"
                iconFamily="antdesign"
                iconColor="white"
                className="self-center"
                onPress={() => {
                  Alert.alert("u sure ?", "YOU SURE ??????????????", [
                    {
                      text: "YESYEYSYEYEYSYYEYYEYSYEYSY",
                      onPress: () => purgeAll(),
                    },
                    {
                      text: "NONONONONONONONNONONON",
                      style: "cancel",
                    },
                  ]);
                }}
              >
                Reset Data
              </Button>
            </View>
          </View>
          <View style={{ gap: 10 }}>
            <Text
              color="#9c62dc"
              style={{ fontFamily: "Inter-Regular", fontSize: 20 }}
            >
              Support
            </Text>
            <View
              className="w-full py-2 px-5 rounded-lg"
              style={{ backgroundColor: "white" }}
            >
              <Button
                className="w-full self-center"
                color="#9c62dc"
                onPress={() => setShowFaq(true)}
              >
                FAQ
              </Button>
              <Button
                className="w-full self-center"
                color="#9c62dc"
                onPress={async () =>
                  await Linking.openURL(
                    "https://oualid.me/arena/budgi#report-bug"
                  )
                }
              >
                Report A Bug
              </Button>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
