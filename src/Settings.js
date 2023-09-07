import { TouchableHighlight, View } from "react-native";
import { Text, Input, Button } from "galio-framework";
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo } from "@expo/vector-icons";

export default function Settings() {
  return (
    <View
      className="items-center relative w-full h-full"
      style={{ backgroundColor: "#E5DDF0" }}
    >
      <SafeAreaView style={{ width: "90%", alignItems: "flex-start" }}>
        <Text
          className="self-center mt-5"
          color="#6934BF"
          style={{ fontFamily: "Inter-Regular" }}
          h1
        >
          Settings
        </Text>
        <View className="self-center mt-20 w-full" style={{ gap: 30 }}>
          <View style={{ gap: 10 }}>
            <Text
              color="#6934BF"
              style={{ fontFamily: "Inter-Light", fontSize: 20 }}
            >
              Data Settings
            </Text>
            <View
              className="w-full py-2 px-5 rounded-lg"
              style={{ backgroundColor: "white" }}
            >
              <Input
                placeholder="Currency"
                style={{
                  backgroundColor: "rgba(0,0,0,0)",
                  color: "white",
                  borderColor: "#6934BF",
                }}
                placeholderTextColor="#6934BF"
              />
              <View className="flex-row items-center self-center">
                <Button
                  icon="upload"
                  iconFamily="antdesign"
                  iconColor="white"
                  style={{ width: 150 }}
                >
                  Export Data
                </Button>
                <Button
                  style={{ width: 150 }}
                  icon="download"
                  iconFamily="antdesign"
                  iconColor="white"
                >
                  Import Data
                </Button>
              </View>
              <Button
                icon="delete"
                iconFamily="antdesign"
                iconColor="white"
                className="self-center"
                style={{ width: 150 }}
              >
                Reset Data
              </Button>
            </View>
          </View>
          <View style={{ gap: 10 }}>
            <Text
              color="#6934BF"
              style={{ fontFamily: "Inter-Light", fontSize: 20 }}
            >
              Support
            </Text>
            <View
              className="w-full py-2 px-5 rounded-lg"
              style={{ backgroundColor: "white" }}
            >
              <Button className="w-full self-center" color="grey">
                <Text
                  className="self-start px-4"
                  color="#6934BF"
                  style={{ fontFamily: "Inter-Regular" }}
                >
                  Help
                </Text>
              </Button>
              <Button className="w-full self-center" color="grey">
                <Text
                  className="self-start px-4"
                  color="#6934BF"
                  style={{ fontFamily: "Inter-Regular" }}
                >
                  FAQ
                </Text>
              </Button>
              <Button className="w-full self-center" color="grey">
                <Text
                  className="self-start px-4"
                  color="#6934BF"
                  style={{ fontFamily: "Inter-Regular" }}
                >
                  Report A Bug
                </Text>
              </Button>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
