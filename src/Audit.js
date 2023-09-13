import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Button } from "galio-framework";
import { Dimensions } from "react-native";
import {
  BarChart,
  CurveType,
  LineChart,
} from "react-native-gifted-charts";
import { Budgets, AppSettings } from "./DBOp";
import { getFriendlyFormat } from "./Utility";
import Carousel from "react-native-reanimated-carousel";
import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

// get all categories and calculate the percentage by their occurence
function getCategoryPercentage(transacs) {
  let data = { labels: [], data: [] };
  let labels = transacs.map((v) => v.category).flat();
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
      temp === undefined ? parseFloat(v.value) : temp + parseFloat(v.value);
  });

  return {
    labels: Object.keys(byDate),
    datasets: [{ data: Object.values(byDate) }],
  };
}
function RenderCategoriesByProfit({ transacs, newvalue }) {
  let profit = {};
  transacs.forEach((v) => {
    profit[v.category] = 0;
  });

  for (let i = 0; i < transacs.length; ++i) {
    let value = parseFloat(transacs[i].value);
    let category = transacs[i].category;
    if (value < 0) continue;
    else profit[category] += value;
  }

  const barData = Object.keys(profit)
    .map((v) => {
      return [
        {
          value: 100 - ((newvalue - profit[v]) / newvalue) * 100,
          labelTextStyle: {
            color: "#6934BF",
            textTransform: "capitalize",
          },
          frontColor: "#6934BF",
          label: v,
        },
      ];
    })
    .flat();
  // {
  //   value: 40,
  //   label: 'Jan',
  //   spacing: 2,
  //   labelWidth: 30,
  //   labelTextStyle: {color: 'gray'},
  //   frontColor: '#177AD5',
  // },
  // {value: 20, frontColor: '#ED6665'},
  return (
    <View>
      <BarChart
        rotateLabel
        data={barData}
        barWidth={16}
        spacing={35}
        width={screenWidth / 1.4}
        height={screenHeight / 5}
        barBorderRadius={5}
        yAxisLabelSuffix={"%"}
        xAxisThickness={0}
        yAxisThickness={0}
        yAxisTextStyle={{ color: "#6934BF" }}
        isAnimated
        hideRules
      />
    </View>
  );
}

function categoriesByProfitLoss(transacs, newvalue) {
  let loss = {};
  let profit = {};
  transacs.forEach((v) => {
    loss[v.category] = 0;
    profit[v.category] = 0;
  });

  for (let i = 0; i < transacs.length; ++i) {
    let value = parseFloat(transacs[i].value);
    let category = transacs[i].category;
    if (value < 0) loss[category] += Math.abs(value);
    else profit[category] += value;
  }

  const PROFIT_COLOR = "#6934BF";
  const LOSS_COLOR = "#9987B5";
  const barData = Object.keys(profit)
    .map((v) => {
      return [
        {
          value: 100 - ((newvalue - profit[v]) / newvalue) * 100,
          label: v,
          spacing: 20,
          labelTextStyle: {
            color: "#6934BF",
            textTransform: "capitalize",
            width: screenWidth / 5,
            top: 0,
          },
          frontColor: PROFIT_COLOR,
        },
        {
          value: 100 - ((newvalue - loss[v]) / newvalue) * 100,
          frontColor: LOSS_COLOR,
        },
      ];
    })
    .flat();
  // {
  //   value: 40,
  //   label: 'Jan',
  //   spacing: 2,
  //   labelWidth: 30,
  //   labelTextStyle: {color: 'gray'},
  //   frontColor: '#177AD5',
  // },
  // {value: 20, frontColor: '#ED6665'},
  return barData;
}

function getThisWeek(transacs) {
  let loss = {};
  let profit = {};
  let currDay = new Date().getDate();
  let currMonth = new Date().getMonth();
  let currYear = new Date().getFullYear();

  for (let i = currDay - 7; i <= currDay; ++i) {
    let day = new Date(currYear, currMonth, i).getDate();
    profit[day] = 0;
    loss[day] = 0;
  }

  transacs.forEach((v) => {
    let transacDate = new Date(v.date);
    if (transacDate.getDate() >= currDay - 7) {
      let value = parseFloat(v.value);
      let day = transacDate.getDate();
      if (value < 0) {
        loss[day] += Math.abs(value);
      } else {
        profit[day] += value;
      }
    }
  });

  let thisWeekProfit = Object.keys(profit).map((v) => {
    return {
      label: v,
      value: parseFloat(profit[v]),
    };
  });
  let thisWeekLoss = Object.keys(loss).map((v) => {
    return {
      label: v,
      value: parseFloat(loss[v]),
    };
  });

  return { thisWeekProfit, thisWeekLoss };
}

function getThisDay(transacs) {
  let loss = {};
  let profit = {};
  let currDay = new Date().getDate();
  let currMonth = new Date().getMonth();
  let currYear = new Date().getFullYear();
  let currHour = new Date().getHours();
  for (let i = currHour - 24; i <= currHour; ++i) {
    let Hour = new Date(currYear, currMonth, currDay, i).getHours();
    profit[Hour] = 0;
    loss[Hour] = 0;
  }

  transacs.forEach((v) => {
    let date = new Date(v.date).getHours();
    if (date >= currHour - 24) {
      let value = parseFloat(v.value);
      if (value < 0) {
        loss[date] += Math.abs(value);
      } else {
        profit[date] += value;
      }
    }
  });
  let thisDayProfit = Object.keys(profit).map((v) => {
    return {
      label: v,
      value: parseFloat(profit[v]),
    };
  });
  let thisDayLoss = Object.keys(loss).map((v) => {
    return {
      value: parseFloat(loss[v]),
    };
  });

  return { thisDayProfit, thisDayLoss };
}

function getThisMonth(transacs) {
  let loss = {};
  let profit = {};
  let currDay = new Date().getDate();
  let currMonth = new Date().getMonth();
  let currYear = new Date().getFullYear();

  for (let i = currDay - 31; i <= currDay; ++i) {
    const date = new Date(currYear, currMonth, i).getDate();
    profit[date] = 0;
    loss[date] = 0;
  }
  transacs.forEach((v, i) => {
    let date = new Date(v.date).getDate();
    if (date >= currDay - 31) {
      let value = parseFloat(v.value);
      if (value < 0) loss[date] += Math.abs(value);
      else profit[date] += value;
    }
  });

  let thisMonthProfit = Object.keys(profit).map((v) => {
    return {
      label: v,
      value: parseFloat(profit[v]),
    };
  });
  let thisMonthLoss = Object.keys(loss).map((v) => {
    return {
      label: v,
      value: parseFloat(loss[v]),
    };
  });

  return { thisMonthProfit, thisMonthLoss };
}

function getThisYear(transacs) {
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

  let loss = {};
  let profit = {};
  let currDate = new Date();
  let currDay = currDate.getDate();
  let currMonth = currDate.getMonth();
  let currYear = currDate.getFullYear();

  for (let i = currMonth - 11; i <= currMonth; ++i) {
    let monthName = monthNames[new Date(currYear, i, currDay).getMonth()];
    profit[monthName] = 0;
    loss[monthName] = 0;
  }

  transacs.forEach((v) => {
    let transacDate = new Date(v.date);
    if (transacDate.getMonth() >= currMonth - 11) {
      let value = parseFloat(v.value);
      let monthName = monthNames[transacDate.getMonth()];
      if (value < 0) {
        loss[monthName] += Math.abs(value);
      } else {
        profit[monthName] += value;
      }
    }
  });

  let thisYearProfit = Object.keys(profit).map((v) => ({
    label: v.substring(0, 3),
    value: profit[v],
  }));

  let thisYearLoss = Object.keys(loss).map((v) => ({
    label: v.substring(0, 3),
    value: loss[v],
  }));

  return { thisYearProfit, thisYearLoss };
}

export default function Audit({ route, navigation }) {
  const { delGoal, delBudget } = Budgets();
  const { currency } = AppSettings();
  const { budget, budgetID } = route.params;

  const transacs = budget.transactions;
  const goals = Budgets().budgets[budgetID].goals || [];
  const newvalue = parseFloat(budget.newvalue);
  const oldvalue = parseFloat(budget.oldvalue);

  const { thisDayProfit, thisDayLoss } = getThisDay(transacs);
  const { thisWeekProfit, thisWeekLoss } = getThisWeek(transacs);
  const { thisMonthProfit, thisMonthLoss } = getThisMonth(transacs);
  const { thisYearProfit, thisYearLoss } = getThisYear(transacs);

  const filterByText = [
    "Categories",
    "Last 24 Hours",
    "Last 7 Days",
    "Last 30 Days",
    "Last 12 Months",
  ];

  const [carouselIdx, setCarouselIdx] = useState(0);

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
                name={newvalue >= oldvalue ? "caretup" : "caretdown"}
                color={newvalue >= oldvalue ? "green" : "red"}
              />
              <Text
                color={newvalue >= oldvalue ? "green" : "red"}
                style={{ fontSize: 10 }}
              >
                {
                  // we only want the profit compared to the last transaction

                  (((newvalue - oldvalue) / oldvalue) * 100).toFixed(2)
                }
                %
              </Text>
            </View>
            <Button
              icon="delete"
              iconFamily="antdesign"
              iconSize={12}
              color="grey"
              iconColor="#6934BF"
              onPress={() => {
                delBudget(budgetID);
                navigation.goBack();
              }}
              onlyIcon
            ></Button>
          </View>
          <Text
            color="#6934BF"
            style={{ fontFamily: "Jose-Regular", fontSize: 50 }}
          >
            {newvalue.toLocaleString()}
          </Text>
          <View
            className="flex-row items-center"
            style={{ justifyContent: "space-between" }}
          >
            <Text color="#6934BF">{currency}</Text>
          </View>
        </View>

        {transacs.length === 0 ? (
          <View
            className="rounded-lg w-full py-20 px-5 items-center"
            style={{ backgroundColor: "#6934BF" }}
          >
            <Text color="white">No data</Text>
          </View>
        ) : (
          <View className="w-full">
            <View
              className="flex-row items-center self-center w-full rounded-lg px-2 py-1 justify-between"
              style={{ backgroundColor: "white" }}
            >
              <Button
                icon="caretleft"
                iconFamily="antdesign"
                iconSize={15}
                color="#DFDFDF"
                iconColor="#6934BF"
                onPress={() => {
                  setCarouselIdx(carouselIdx === 0 ? 0 : carouselIdx - 1);
                }}
                onlyIcon
              ></Button>
              <Text color="#6934BF" h5>
                {filterByText[carouselIdx]}
              </Text>
              <Button
                icon="caretright"
                iconFamily="antdesign"
                iconSize={15}
                color="#DFDFDF"
                onPress={() => {
                  setCarouselIdx(
                    carouselIdx + 1 >= filterByText.length
                      ? carouselIdx
                      : carouselIdx + 1
                  );
                }}
                iconColor="#6934BF"
                onlyIcon
              ></Button>
            </View>
            <View className="items-center self-center py-5 mr-5">
              {
                [
                  <BarChart
                    data={categoriesByProfitLoss(transacs, newvalue)}
                    barWidth={16}
                    spacing={40}
                    width={screenWidth / 1.5}
                    barBorderRadius={5}
                    hideRules
                    yAxisLabelSuffix={"%"}
                    xAxisThickness={0}
                    yAxisThickness={0}
                    yAxisTextStyle={{ color: "#6934BF" }}
                    rulesColor="#6934BF"
                  />,
                  <LineChart
                    spacing={20}
                    xAxisLabelTextStyle={{ color: "#6934BF" }}
                    yAxisTextStyle={{ color: "#6934BF" }}
                    rulesColor="#9987B5"
                    verticalLinesColor="#9987B5"
                    data={thisDayProfit}
                    color1="#6934BF"
                    data2={thisDayLoss}
                    color2="white"
                    dataPointsColor1="#6934BF"
                    dataPointsColor2="white"
                    hideRules
                    showValuesAsDataPointsText
                    width={screenWidth / 1.4}
                    curveType={CurveType.QUADRATIC}
                    curved
                    yAxisThickness={0}
                    xAxisThickness={0}
                  />,
                  <LineChart
                    spacing={45}
                    xAxisLabelTextStyle={{ color: "#6934BF" }}
                    yAxisTextStyle={{ color: "#6934BF" }}
                    rulesColor="#9987B5"
                    verticalLinesColor="#9987B5"
                    data={thisWeekProfit}
                    color1="#6934BF"
                    data2={thisWeekLoss}
                    color2="white"
                    hideRules
                    dataPointsColor1="#6934BF"
                    dataPointsColor2="white"
                    curveType={CurveType.QUADRATIC}
                    width={screenWidth / 1.4}
                    curved
                    yAxisThickness={0}
                    xAxisThickness={0}
                  />,

                  <LineChart
                    spacing={20}
                    xAxisLabelTextStyle={{ color: "#6934BF" }}
                    yAxisTextStyle={{ color: "#6934BF" }}
                    rulesColor="#9987B5"
                    verticalLinesColor="#9987B5"
                    data={thisMonthProfit}
                    color1="#6934BF"
                    data2={thisMonthLoss}
                    color2="white"
                    dataPointsColor1="#6934BF"
                    dataPointsColor2="white"
                    hideRules
                    showValuesAsDataPointsText
                    width={screenWidth / 1.4}
                    curveType={CurveType.QUADRATIC}
                    curved
                    yAxisThickness={0}
                    xAxisThickness={0}
                  />,
                  <LineChart
                    spacing={30}
                    xAxisLabelTextStyle={{ color: "#6934BF" }}
                    yAxisTextStyle={{ color: "#6934BF" }}
                    rulesColor="#9987B5"
                    verticalLinesColor="#9987B5"
                    data={thisYearProfit}
                    color1="#6934BF"
                    data2={thisYearLoss}
                    color2="white"
                    dataPointsColor1="#6934BF"
                    dataPointsColor2="white"
                    hideRules
                    showValuesAsDataPointsText
                    width={screenWidth / 1.4}
                    curveType={CurveType.QUADRATIC}
                    curved
                    yAxisThickness={0}
                    xAxisThickness={0}
                  />,
                ][carouselIdx]
              }
            </View>
          </View>
        )}
        <Text
          className="self-start"
          style={{
            color: "#6934BF",
            fontSize: 40,
            fontFamily: "Inter-Regular",
          }}
        >
          Goals
        </Text>
        {goals.length === 0 ? (
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
            data={goals}
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
                <View
                  style={{
                    backgroundColor: "rgba(0,0,0,0)",
                    borderWidth: 1,
                    borderColor: "white",
                    height: "10%",
                    borderRadius: 5,
                    width: screenWidth * 0.8,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "white",
                      height: "100%",
                      borderRadius: 5,
                      width:
                        parseFloat(item.value) <= newvalue
                          ? "100%"
                          : `${
                              100 -
                              ((parseFloat(item.value) - newvalue) /
                                parseFloat(item.value)) *
                                100
                            }%`,
                    }}
                  >
                    
                  </View>
                </View>
                <View
                  className="flex-row w-full"
                  style={{ justifyContent: "space-between" }}
                >
                  <Text color="white" style={{ fontFamily: "Inter-Regular" }}>
                    0$
                  </Text>
                  <Text color="white" style={{ fontFamily: "Inter-Regular" }}>
                    {getFriendlyFormat(item.value)}$
                  </Text>
                </View>
                <Button
                  color="white"
                  style={{ width: 70, height: 30 }}
                  onPress={() => delGoal(budgetID, index)}
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
