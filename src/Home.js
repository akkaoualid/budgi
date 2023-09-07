import { View, TouchableOpacity, FlatList, Dimensions } from "react-native";
import { Button, Text } from "galio-framework";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { HLine, ExpCard } from "./Utility";
import { Budgets, Transaction, Goals } from "./DBOp";
import Carousel from "react-native-reanimated-carousel";
import BotNav from "./BotNav";
import { LinearGradient } from "expo-linear-gradient";

function BudgetCard({ name, value, callback }) {
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
            {value}$
          </Text>
          <Text color="white" p>
            {name}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

function TransacsCard({ data, navigation, budgetID }) {
  return (
    <View
      style={{
        backgroundColor: "white",
        width: "120%",
        height: "73%",
        paddingBottom: 20,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
      }}
      className="self-center"
    >
      <View style={{ width: "100%", height: "81%", marginTop: 20 }}>
        <FlatList
          data={data}
          contentContainerStyle={{ gap: 25 }}
          renderItem={({ item, index }) => {
            return (
              <ExpCard
                text={item.name}
                desc={item.desc}
                amount={item.value}
                unit="$"
                callback={() =>
                  navigation.navigate("Budget", {
                    name: item.name,
                    budgetID: budgetID,
                    description: item.desc,
                    category: "qsd",
                    amount: item.value,
                    date: item.date,
                    tr_idx: index
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
  const { budgets } = Budgets();
  const [budgetID, setBudgetID] = useState(0);
  const { goals } = Goals();

  const firstTime = budgets === null || budgets.length === 0;
  const dontHaveTransacs = !firstTime ? budgets[budgetID].transactions.length === 0: true;

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
                    value={parseInt(item.value)}
                    callback={() =>
                      navigation.navigate("Audit", {
                        budgetID: budgetID,
                        budget: budgets[budgetID],
                        name: item.name,
                        value: item.value,
                        goals: goals.filter((i) => i.budget_idx === budgetID),
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
                data={budgets[budgetID].transactions}
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
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
