import { View, TouchableOpacity, FlatList, Dimensions } from "react-native";
import { Button, Text } from "galio-framework";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { HLine, ExpCard, getFriendlyFormat } from "./Utility";
import { Budgets, AppSettings } from "./DBOp";
import Carousel from "react-native-reanimated-carousel";
import BotNav from "./BotNav";
import { LinearGradient } from "expo-linear-gradient";

function TagBox({ onPress, content, selected }) {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      className="rounded-lg items-center"
      style={{
        backgroundColor: selected ? "#825DBD" : "#DEDEDE",
        width: Dimensions.get("screen").width / 4,
      }}
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

function BudgetCard({ name, value, callback, budgetID }) {
  const { currency } = AppSettings();
  const { delBudget } = Budgets();
  return (
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
            paddingHorizontal: 40,
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
        <Button
          icon="delete"
          iconFamily="antdesign"
          iconSize={12}
          color="grey"
          className="self-end"
          iconColor="#6934BF"
          onPress={() => {
            delBudget(budgetID);
          }}
          onlyIcon
        ></Button>
      </LinearGradient>
    </TouchableOpacity>
  );
}

function TransacsCard({ data, navigation, budgetID }) {
  const [filterBy, setFilterBy] = useState(null);
  const [renderedData, setRenderedData] = useState([]);
  const { currency } = AppSettings();
  const filterObj = {
    All: (__data) => __data,
    "This Day": (__data) =>
      __data.filter((v) => new Date(v.date).getDay() === new Date().getDay()),
    "This Week": (__data) =>
      __data.filter(
        (v) => new Date(v.date).getDay() >= new Date().getDay() - 7
      ),
    "This Month": (__data) =>
      __data.filter(
        (v) => new Date(v.date).getMonth() === new Date().getMonth()
      ),
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
        height: "71.5%",
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
            />
          )}
          contentContainerStyle={{ gap: 25 }}
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
                text={item.name}
                desc={item.desc}
                amount={item.value}
                unit={currency}
                callback={() =>
                  navigation.navigate("Budget", {
                    name: item.name,
                    budgetID: budgetID,
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
  const [budgetID, setBudgetID] = useState(0);
  const { budgets } = Budgets();

  const firstTime = budgets === undefined || budgets.length === 0;
  const dontHaveTransacs = !firstTime
    ? budgets[budgetID].transactions.length === 0
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
            <View style={{ width: "100%", alignItems: "center", gap: 45 }}>
              <Carousel
                loop={false}
                style={{ gap: 50 }}
                defaultIndex={budgetID}
                width={Dimensions.get("window").width - 20}
                height={Dimensions.get("window").width / 2}
                data={budgets}
                scrollAnimationDuration={100}
                onSnapToItem={(index) => setBudgetID(index)}
                renderItem={({ item }) => (
                  <BudgetCard
                    name={item.name}
                    budgetID={budgetID}
                    value={parseFloat(item.newvalue)}
                    callback={() =>
                      navigation.navigate("Audit", {
                        budgetID: budgetID,
                        budget: budgets[budgetID],
                        value: item.value,
                      })
                    }
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
                      budgetID: budgetID,
                    })
                  }
                  shadowColor="#6934BF"
                >
                  Add Transaction ➠
                </Button>
              </View>
            ) : (
              <TransacsCard
                data={budgets[budgetID].transactions || []}
                navigation={navigation}
                budgetID={budgetID}
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
              carouselIdx={budgetID}
              disabled={budgets.length === 0}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
