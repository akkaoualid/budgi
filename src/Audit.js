import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Input, Button } from "galio-framework";
import { BarChart, LineChart, ProgressChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { useState } from "react";
import { Budgets, Transaction, Category, Goals } from "./DBOp";
import { Section, getFriendlyFormat } from "./Utility";
import * as Progress from "react-native-progress";
import Carousel from "react-native-reanimated-carousel";
import { AntDesign } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0,
  color: (opacity = 1) => `rgba(255,255,255, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
  decimalPlaces: 0,
  useShadowColorFromDataset: false,
};

function sumAllTransactions(transacs) {
  return transacs.map((v) => parseInt(v.value)).reduce((v1, v2) => v1 + v2, 0);
}

// get all categories and calculate the percentage by their occurence
function getCategoryPercentage(transacs) {
  const categories = transacs.categories;
  let data = { labels: [], data: [] };
  let labels = transacs
    .map((v) =>
      categories.filter((_, i) => v.category_idx === i).map((i) => i.name)
    )
    .flat();
  let occ = {};
  labels.forEach((v) => {
    let temp = occ[v];
    occ[v] = temp === undefined ? 1 : temp + 1;
  });
  Object.keys(occ).forEach((i) => (occ[i] = occ[i] / labels.length));
  data.labels = Object.keys(occ);
  data.data = Object.values(occ);
  return data;
}

function getBudgetVariation(transacs) {
  const byDate = {};
  transacs.forEach((v, _) => {
    const _date = new Date(v.date).toLocaleDateString();
    const temp = byDate[_date];
    byDate[_date] =
      temp === undefined ? parseInt(v.value) : temp + parseInt(v.value);
  });

  return {
    labels: Object.keys(byDate),
    datasets: [{ data: Object.values(byDate) }],
  };
}

function getByMonth(transacs) {
  const byDate = {};
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  transacs
    .filter((v) => new Date(v.date).getFullYear() === new Date().getFullYear())
    .forEach((v, _) => {
      const _date = monthNames[new Date(v.date).getMonth()];
      const temp = byDate[_date];
      byDate[_date] =
        temp === undefined ? parseInt(v.value) : temp + parseInt(v.value);
    });
  return {
    labels: Object.keys(byDate),
    datasets: [{ data: Object.values(byDate) }],
  };
}

export default function Audit({ route, navigation }) {
  
  const { budget, budgetID, name, value } = route.params;
  const transacs = budget.transactions;
  const budgetSpentSum = sumAllTransactions(transacs) || 0;
  //const data = getCategoryPercentage(transacs);
  const lineData = getBudgetVariation(transacs);
  const monthData = getByMonth(transacs);
  const { delGoal, goals } = Goals();
  const filteredGoals = goals.filter((v) => v.budget_idx === budget);

  console.debug(budgetSpentSum, value);

  return (
    <SafeAreaView style={{ backgroundColor: "#E5DDF0", height: "100%" }}>
      <View className="w-5/6 self-center items-center my-8" style={{ gap: 5 }}>
        <View
          className="w-full px-5 py-2 rounded-lg"
          style={{ backgroundColor: "white" }}
        >
          <View
            className="flex-row items-center self-end w-full"
            style={{ justifyContent: "space-between" }}
          >
            <View
              className="flex-row items-center rounded-lg py-2 px-2"
              style={{
                gap: 5,
                backgroundColor: "rgba(0,0,0,0.1)",
              }}
            >
              <AntDesign
                size={10}
                name={
                  budgetSpentSum + parseInt(value) >= value
                    ? "caretup"
                    : "caretdown"
                }
                color={
                  budgetSpentSum + parseInt(value) >= value ? "green" : "red"
                }
              />
              <Text
                color={
                  budgetSpentSum + parseInt(value) >= value ? "green" : "red"
                }
                style={{ fontSize: 10 }}
              >
                {((budgetSpentSum / parseInt(value)) * 100).toFixed(2)}%
              </Text>
            </View>
            <Button
              icon="delete"
              iconFamily="antdesign"
              iconSize={12}
              color="grey"
              iconColor="#6934BF"
              onPress={() => {
                transacs.forEach((v, i) =>
                  delTransac({ budget_idx: budget, idx: i })
                );
                goals.forEach((v, i) =>
                  delGoal({ budget_idx: budget, idx: i })
                );
                delBudget(budget);
              }}
              onlyIcon
            ></Button>
          </View>
          <Text
            color="#6934BF"
            style={{ fontFamily: "Jose-Regular", fontSize: 50 }}
          >
            {(parseInt(value) + budgetSpentSum).toLocaleString()}
          </Text>
          <View
            className="flex-row items-center"
            style={{ justifyContent: "space-between" }}
          >
            <Text color="#6934BF">USD</Text>
          </View>
        </View>
        <Text
          className="self-start"
          style={{ color: "#6934BF", fontSize: 40, fontFamily: "Inter-Light" }}
        >
          Audit
        </Text>
        {transacs.length === 0 ? (
          <View
            className="rounded-lg w-full py-20 px-5 items-center"
            style={{ backgroundColor: "#6934BF" }}
          >
            <Text color="white">No data</Text>
          </View>
        ) : (
          <Carousel
            loop={false}
            style={{ gap: 50 }}
            mode="stack"
            width={Dimensions.get("window").width}
            height={Dimensions.get("window").height / 3}
            data={[
              // <View
              //   className="py-5 px-5 items-center rounded-lg mx-5"
              //   style={{ backgroundColor: "#6934BF" }}
              // >
              //   <Text color="white" style={{ fontFamily: "Inter-Regular" }} h3>
              //     Categories
              //   </Text>
              //   <ProgressChart
              //     data={data}
              //     width={screenWidth - 80}
              //     height={200}
              //     strokeWidth={16}
              //     radius={32}
              //     chartConfig={chartConfig}
              //     hideLegend={false}
              //   />
              // </View>,
              <View
                className="py-5 px-5 rounded-lg items-center mx-5"
                style={{ backgroundColor: "#6934BF" }}
              >
                <Text color="white" style={{ fontFamily: "Inter-Regular" }} h3>
                  This Week
                </Text>
                <LineChart
                  data={lineData}
                  yAxisLabel="$"
                  yAxisInterval={1}
                  height={200}
                  width={screenWidth - 50}
                  chartConfig={chartConfig}
                  formatYLabel={(v) => getFriendlyFormat(v)}
                  fromZero
                  bezier
                />
              </View>,
              <View
                className="py-5 px-5 rounded-lg items-center mx-5"
                style={{ backgroundColor: "#6934BF" }}
              >
                <Text color="white" style={{ fontFamily: "Inter-Regular" }} h3>
                  By month
                </Text>
                <LineChart
                  data={monthData}
                  yAxisLabel="$"
                  height={200}
                  width={screenWidth - 50}
                  chartConfig={chartConfig}
                  formatYLabel={(v) => getFriendlyFormat(v)}
                  fromZero
                  bezier
                />
              </View>,
            ]}
            scrollAnimationDuration={1000}
            renderItem={({ item }) => item}
          />
        )}
        <Text
          className="self-start"
          style={{ color: "#6934BF", fontSize: 40, fontFamily: "Inter-Light" }}
        >
          Goals
        </Text>
        {filteredGoals.length === 0 ? (
          <View
            className="rounded-lg w-full py-20 px-5 items-center"
            style={{ backgroundColor: "#6934BF" }}
          >
            <Text color="white">No data</Text>
          </View>
        ) : (
          <Carousel
            loop={false}
            style={{ gap: 50 }}
            mode="stack"
            width={Dimensions.get("window").width}
            height={200}
            data={filteredGoals}
            renderItem={({ index, item }) => (
              <View
                className="mx-5 items-center py-5 px-5 rounded-lg"
                style={{ backgroundColor: "#6934BF" }}
              >
                <Text
                  color="white"
                  style={{ fontFamily: "Inter-Regular" }}
                  className="self-center py-2"
                >
                  {item.name}
                </Text>
                <Progress.Bar
                  progress={(parseInt(value) + budgetSpentSum) / item.value}
                  height={10}
                  width={300}
                  color="white"
                />
                <View
                  className="flex-row w-full"
                  style={{ justifyContent: "space-between" }}
                >
                  <Text color="white" style={{ fontFamily: "Inter-Light" }}>
                    0$
                  </Text>
                  <Text color="white" style={{ fontFamily: "Inter-Light" }}>
                    {getFriendlyFormat(item.value)}$
                  </Text>
                </View>
                <Button
                  color="white"
                  style={{ width: 70, height: 30 }}
                  onPress={() =>
                    delGoal({ budget_idx: budget, idx: index - 1 })
                  }
                >
                  <Text color="#6934BF" style={{ fontSize: 12 }}>
                    DELETE
                  </Text>
                </Button>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
