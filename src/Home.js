import {
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Modal,
} from "react-native";
import { Button, Text } from "galio-framework";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  HLine,
  ExpCard,
  getFriendlyFormat,
  ThreeDotsMenu,
  TagBox,
} from "./Utility";
import { Budgets, AppSettings } from "./DBOp";
import Carousel from "react-native-reanimated-carousel";
import BotNav from "./BotNav";
import { LinearGradient } from "expo-linear-gradient";
import { EvilIcons } from "@expo/vector-icons";

function BudgetCard({ navigation, name, value, callback }) {
  const { currency } = AppSettings();
  const { delBudget, budgetIdx } = Budgets();
  return (
    <View>
      <TouchableOpacity activeOpacity={0.5} onPress={callback} className="mx-4">
        <LinearGradient
          start={[0, 0]}
          end={[1, 1]}
          colors={["#DB9AFF", "#6934BF"]}
          style={{ borderRadius: 20 }}
        >
          <View
            className="items-center"
            style={{
              gap: 20,
              paddingHorizontal: 30,
              paddingVertical: 20,
              borderRadius: 20,
            }}
          >
            <Text
              color="white"
              style={{ fontSize: 45, fontFamily: "Jose-Regular" }}
            >
              {getFriendlyFormat(parseFloat(value))} {currency}
            </Text>
            <Text color="white" p>
              {name}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

function TransacsCard({ data, navigation, budgetIdx }) {
  const [filterBy, setFilterBy] = useState(null);
  const [renderedData, setRenderedData] = useState([]);
  const { currency } = AppSettings();
  const filterObj = {
    All: (__data) => __data,
    "This Day": (__data) => {
      let currMonth = new Date().getMonth();
      let currYear = new Date().getFullYear();
      let currDay = new Date().getDate();
      return __data.filter((v) => {
        let date = new Date(v.date);
        return (
          date.getDate() === currDay &&
          date.getFullYear() === currYear &&
          date.getMonth() === currMonth
        );
      });
    },
    "This Week": (__data) => {
      let currMonth = new Date().getMonth();
      let currYear = new Date().getFullYear();
      let _7Days = new Date().getDate() - 7;
      return __data.filter((v) => {
        let date = new Date(v.date);
        return (
          date.getDate() >= _7Days &&
          date.getFullYear() === currYear &&
          date.getMonth() === currMonth
        );
      });
    },
    "This Month": (__data) => {
      let currMonth = new Date().getMonth();
      let currYear = new Date().getFullYear();
      return __data.filter((v) => {
        let date = new Date(v.date);
        return date.getFullYear() === currYear && date.getMonth() === currMonth;
      });
    },
    "This Year": (__data) =>
      __data.filter(
        (v) => new Date(v.date).getFullYear() === new Date().getFullYear()
      ),
  };
  useEffect(
    () => setRenderedData(filterBy === null ? data : filterObj[filterBy](data)),
    [filterBy, data]
  );
  return (
    <View
      style={{
        backgroundColor: "white",
        width: "120%",
        height: "72%",
        paddingBottom: 20,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
      }}
      className="self-center"
    >
      <View className="py-5 px-5">
        <FlatList
          keyExtractor={(item) => item}
          data={Object.keys(filterObj)}
          renderItem={({ item }) => (
            <TagBox
              content={item}
              onPress={(i) => setFilterBy(i)}
              selected={item === filterBy}
              selectedBgColor="#9c62dc"
              bgColor="#DEDEDE"
              style={{borderRadius: 20}}
            />
          )}
          contentContainerStyle={{ gap: 15 }}
          showsHorizontalScrollIndicator={false}
          horizontal
        />
      </View>
      <View style={{ width: "100%", height: "75%", marginTop: 20 }}>
        <FlatList
          contentContainerStyle={{ gap: 25 }}
          data={renderedData}
          keyExtractor={(item, index) => index + item.date}
          renderItem={({ item, index }) => {
            return (
              <ExpCard
                desc={item.desc}
                amount={item.value}
                unit={currency}
                callback={() =>
                  navigation.navigate("Budget", {
                    name: item.name,
                    budgetIdx: budgetIdx,
                    description: item.desc,
                    category: item.category,
                    amount: item.value,
                    date: item.date,
                    tr_idx: index,
                  })
                }
              />
            );
          }}
        />
      </View>
    </View>
  );
}

export default function Home({ route, navigation }) {
  const { budgets, budgetIdx, setBudgetIdx } = Budgets();

  const firstTime = budgets === undefined || budgets.length === 0;
  const dontHaveTransacs =
    !firstTime && budgetIdx !== null
      ? budgets[budgetIdx].transactions.length === 0
      : true;

  return (
    <View
      style={{
        backgroundColor: "#E5DDF0",
        width: "100%",
        height: "100%",
        flex: 1,
      }}
      className="items-center"
    >
      <SafeAreaView className="items-center w-full">
        <StatusBar style="auto" />
        <View
          className="w-5/6 items-center"
          style={{ marginTop: "5%", gap: 20 }}
        >
          {firstTime ? (
            <View className="items-center">
              <Text style={{ fontSize: 70, width: "250%" }}>
                HI HI HI HI HI HI HI HI HI HI
              </Text>
              <Text style={{ fontSize: 30, color: "grey" }}>
                Budgi, your little expenses accountant.
              </Text>
              <HLine />
            </View>
          ) : (
            <View style={{ width: "100%", alignItems: "center", gap: 10 }}>
              <View
                className="self-end rounded-full p-2"
                backgroundColor="whitesmoke"
              >
                <ThreeDotsMenu
                  iconColor="#6934BF"
                  iconSize={18}
                  onEditCallback={() => navigation.navigate("ModifyBudget")}
                  onDeleteCallback={() => delBudget(budgetIdx)}
                />
              </View>
              <Carousel
                loop={false}
                style={{ gap: 50 }}
                defaultIndex={budgetIdx}
                width={Dimensions.get("window").width - 20}
                height={Dimensions.get("window").height / 5.5}
                data={budgets}
                scrollAnimationDuration={100}
                onSnapToItem={(index) => setBudgetIdx(index)}
                renderItem={({ item }) => (
                  <BudgetCard
                    navigation={navigation}
                    name={item.name}
                    budgetIdx={budgetIdx}
                    value={parseFloat(item.newvalue)}
                    callback={() => navigation.navigate("Audit")}
                  />
                )}
              />
            </View>
          )}
          {!firstTime ? (
            dontHaveTransacs ? (
              <View className="items-center" style={{ gap: 20 }}>
                <Text h4>Looks like you've created a budget already.</Text>
                <Button
                  onPress={() =>
                    navigation.navigate("AddTransac", {
                      budgetIdx: budgetIdx,
                    })
                  }
                  shadowColor="#6934BF"
                >
                  Add Transaction ➠
                </Button>
              </View>
            ) : (
              <TransacsCard
                data={budgets[budgetIdx].transactions || []}
                navigation={navigation}
                budgetIdx={budgetIdx}
              />
            )
          ) : (
            <View style={{ alignItems: "center", width: "100%", gap: 20 }}>
              <Text style={{ fontSize: 20 }}>
                No data found, start by setting up a budget and adding
                transactions.
              </Text>
              <Button
                shadowColor="#6934BF"
                color="transparent"
                style={{
                  borderColor: "#6934BF",
                  backgroundColor: "rgba(0,0,0,0)",
                }}
                onPress={() => navigation.navigate("Setup")}
              >
                <Text color="#6934BF">Create Budget ➠</Text>
              </Button>
            </View>
          )}
          <View
            style={{
              position: "absolute",
              top: Dimensions.get("window").height - 80,
              width: "120%",
            }}
          >
            <BotNav
              navigation={navigation}
              route={route}
              carouselIdx={budgetIdx}
              disabled={budgets.length === 0}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
