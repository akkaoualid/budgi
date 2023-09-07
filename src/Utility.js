import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { Text } from "galio-framework";
import { AntDesign } from "@expo/vector-icons";

function HLine(props) {
  return (
    <View
      style={{
        borderBottomColor: props.color,
        borderBottomWidth: StyleSheet.hairlineWidth,
      }}
      className="w-full"
    ></View>
  );
}

function getFriendlyFormat(n) {
  if (n < 1000) {
    return n;
  } else if (n >= 1000 && n < 1_000_000) {
    return (n / 1000).toFixed(1) + "K";
  } else if (n >= 1_000_000 && n < 1_000_000_000) {
    return (n / 1_000_000).toFixed(1) + "M";
  } else if (n >= 1_000_000_000) {
    return (n / 1_000_000_000).toFixed(1) + "B+";
  }
}

function BButton(props) {
  return (
    <TouchableOpacity
      className="px-8 py-3 self-end rounded-full"
      style={{ backgroundColor: "#845EC2" }}
      onPress={props.onPress}
      activeOpacity={0.5}
    >
      <Text className="font-bold text-16 capitalize" style={{ color: "white" }}>
        {props.title}
      </Text>
    </TouchableOpacity>
  );
}

function Section(props) {
  return (
    <View className="flex-row items-center" style={{ gap: 15 }}>
      <Text style={props.style}>{props.title}</Text>
      <HLine />
    </View>
  );
}

function ExpCard({ text, desc, amount, unit, callback }) {
  return (
    <TouchableOpacity activeOpacity={0.5} onPress={callback}>
      <View
        style={{
          borderRadius: 20,
          flexDirection: "row",
          justifyContent: "space-between",
          width: "90%",
          backgroundColor: "rgba(0,0,0,0.05)",
        }}
        className="self-center px-10 py-7 items-center"
      >
        <View className="flex-row items-center" style={{ gap: 10 }}>
          <AntDesign
            name={amount >= 0 ? "up" : "down"}
            size={24}
            color={amount >= 0 ? "green" : "red"}
          />
          <View>
            <Text style={{ color: "black", flexShrink: 5 }} p>
              {text}
            </Text>
            <Text color="grey" style={{ width: 170 }}>
              {desc}
            </Text>
          </View>
        </View>
        <View
          style={{
            backgroundColor: "#DB9AFF",
            borderRadius: 100,
            minWidth: 80,
          }}
          className="p-2 px-3 self-end items-center"
        >
          <Text style={{ color: "white" }}>
            {getFriendlyFormat(parseInt(amount))}
            {unit}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
export { BButton, Section, ExpCard, HLine, getFriendlyFormat };