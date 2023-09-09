import {
  Pressable,
  View,
  Modal,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import { Text, Icon, Button } from "galio-framework";
import { useState } from "react";
import { BlurView } from "expo-blur";
import {
  FontAwesome,
  AntDesign,
  MaterialIcons,
  Feather,
} from "@expo/vector-icons";

function SectionOpt({ icon, callback, text }) {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={callback}>
      <View
        className="p-10 items-center"
        style={{
          gap: 5,
          borderRadius: 20,
          minWidth: 150,
          backgroundColor: "#6934BF",
        }}
      >
        {icon}
        <Text color="white">{text}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function BotNav({
  navigation,
  route,
  carouselIdx,
  disabled,
}) {
  const [pops, showPop] = useState(false);
  return (
    <View
      style={{
        borderColor: "#845EC2",
        borderTopWidth: 1,
        paddingVertical: 5,
        paddingHorizontal: 20,
        width: "100%",
      }}
    >
      <Modal
        visible={pops}
        transparent={true}
        onRequestClose={() => showPop(false)}
        animationType="slide"
      >
        <BlurView intensity={100} style={{ height: "100%" }}>
          <View
            className="w-full self-center py-10 px-5 rounded-lg"
            style={{ gap: 20 }}
          >
            <View
              className="items-center"
              style={{
                gap: 10,
                marginTop: Dimensions.get("screen").height / 4.5,
              }}
            >
              <Text color="#6934BF" h3>
                Create a new:
              </Text>
              <View
                className="flex-row items-center self-center"
                style={{ gap: 20 }}
              >
                <SectionOpt
                  text="Transaction"
                  icon={<FontAwesome name="money" size={24} color="white" />}
                  callback={() => {
                    showPop(false);
                    navigation.navigate("AddTransac", {
                      budgetID: carouselIdx,
                    });
                  }}
                />
                <SectionOpt
                  text="Budget."
                  icon={<AntDesign name="wallet" size={24} color="white" />}
                  callback={() => {
                    showPop(false);
                    navigation.navigate("Setup");
                  }}
                />
              </View>
              <View
                className="flex-row items-center self-center"
                style={{ gap: 20 }}
              >
                <SectionOpt
                  text="Category."
                  icon={
                    <MaterialIcons name="category" size={24} color="white" />
                  }
                  callback={() => {
                    showPop(false);
                    navigation.navigate("AddCat", {
                      budgetID: carouselIdx,
                    });
                  }}
                />
                <SectionOpt
                  text="Goal."
                  icon={<Feather name="flag" size={24} color="white" />}
                  callback={() => {
                    showPop(false);
                    navigation.navigate("AddGoal", {
                      budget_idx: carouselIdx,
                    });
                  }}
                />
              </View>
            </View>
          </View>
        </BlurView>
      </Modal>

      <View className="self-center flex-row mt-2" style={{ gap: 30 }}>
        <Pressable onPress={() => navigation.navigate("Home")}>
          <Icon
            name="home"
            family="antdesign"
            size={30}
            color={route.name === "Home" ? "#845EC2" : "grey"}
          />
        </Pressable>
        <Button
          icon="plus"
          iconFamily="antdesign"
          style={{
            bottom: "14%",
            width: 50 * 1.25,
            elevation: 10,
            height: 50 * 1.25,
          }}
          onPress={() => {
            if (disabled) {
              Alert.alert(
                "Can't access menu",
                "Looks like you didn't initialize a budget."
              );
            } else {
              showPop(true);
            }
          }}
          onlyIcon
        />
        <Pressable onPress={() => navigation.navigate("Settings")}>
          <Icon
            name="setting"
            family="antdesign"
            size={30}
            color={route.name === "Settings" ? "#845EC2" : "grey"}
          />
        </Pressable>
      </View>
    </View>
  );
}
