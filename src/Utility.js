import {
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  Pressable,
  Dimensions,
} from "react-native";
import { Text, Button } from "galio-framework";
import { Feather, Entypo } from "@expo/vector-icons";
import { useState } from "react";

function TagBox({
  onPress,
  content,
  selected,
  bgColor,
  selectedBgColor,
  style,
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      className="items-center"
      style={[
        {
          backgroundColor: selected ? selectedBgColor : bgColor,
          width: Dimensions.get("screen").width / 4,
        },
        style,
      ]}
      onPress={() => onPress(content)}
    >
      <Text
        className="py-2 px-2"
        style={{ color: selected ? "white" : "black" }}
      >
        {content}
      </Text>
    </TouchableOpacity>
  );
}

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
    return (n / 1000).toFixed(2) + "K";
  } else if (n >= 1_000_000 && n < 1_000_000_000) {
    return (n / 1_000_000).toFixed(2) + "M";
  } else if (n >= 1_000_000_000) {
    return (n / 1_000_000_000).toFixed(2) + "B+";
  }
}

function ExpCard({ desc, amount, unit, callback }) {
  return (
    <TouchableOpacity activeOpacity={0.5} onPress={callback}>
      <View
        style={{
          backgroundColor: "rgba(0,0,0,0.05)",
        }}
        className="flex-row rounded-3xl justify-between w-5/6 items-center self-center px-3 py-8"
      >
        <View className="flex-row items-center" style={{ gap: 10 }}>
          <Feather
            name={amount >= 0 ? "plus" : "minus"}
            size={18}
            color={amount >= 0 ? "green" : "red"}
          />
          <Text color="black" style={{ width: 170 }} p>
            {desc.length >= 30 ? `${desc.substring(0, 30)}...` : desc}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: "#9c62dc",
            borderRadius: 100,
            minWidth: 80,
          }}
          className="p-2 px-3 self-end items-center"
        >
          <Text style={{ color: "white" }}>
            {amount < 0 ? "-" : ""}
            {getFriendlyFormat(Math.abs(parseFloat(amount)))} {unit}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function ThreeDotsMenu({
  iconColor,
  iconSize,
  onEditCallback,
  onDeleteCallback,
}) {
  const [show, setShow] = useState(false);
  const [showMenu, setShowMenu] = useState(true);
  const [position, setPosition] = useState({ x: 0, y: 0, width: 0 });
  const maxWidth = Dimensions.get("screen").width;
  return (
    <View>
      <Entypo
        name="dots-three-vertical"
        size={iconSize}
        color={iconColor}
        onLayout={(e) => {
          e.target.measure((x, y, width, height, pageX, pageY) => {
            setPosition({
              x: pageX + x,
              y: pageY + y,
              width: width,
              height: height,
            });
          });
        }}
        onPress={() => setShow(!show)}
      />
      <Modal
        visible={show}
        transparent
        animationType="fade"
        onRequestClose={() => setShow(false)}
      >
        <Pressable onPress={() => setShow(false)}>
          <View
            className="w-full h-full items-center"
            style={{
              backgroundColor: "rgba(0,0,0,0.2)",
            }}
          >
            {showMenu ? (
              <View
                className="rounded-lg"
                style={{
                  zIndex: 1000,
                  top: position.y,
                  left: maxWidth - position.x,
                  backgroundColor: "white",
                }}
              >
                <Button color="grey" onPress={onEditCallback}>
                  <Text>Edit</Text>
                </Button>
                <Button color="grey" onPress={onDeleteCallback}>
                  <Text>Delete</Text>
                </Button>
              </View>
            ) : (
              <></>
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

export { ExpCard, HLine, getFriendlyFormat, ThreeDotsMenu, TagBox };
