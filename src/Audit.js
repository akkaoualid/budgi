import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Button } from "galio-framework";
import { Dimensions } from "react-native";
import { BarChart, CurveType, LineChart } from "react-native-gifted-charts";
import { Budgets, AppSettings } from "./DBOp";
import { ThreeDotsMenu, getFriendlyFormat } from "./Utility";
import Carousel from "react-native-reanimated-carousel";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useMemo, useState } from "react";

const screenWidth = Dimensions.get("window").width;

function categoriesByProfitLoss(transacs, newvalue, isExpn) {
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
  const barData = Object.keys(profit)
    .map((v) => {
      return [
        {
          value:
            100 -
            ((newvalue - (isExpn ? loss[v] : profit[v])) / newvalue) * 100,
          label: v,
          labelTextStyle: {
            color: "#9c62dc",
            textTransform: "capitalize",
            top: 0,
          },
          topLabelComponent: () => (
            <Text
              style={{
                width: "300%",
                alignSelf: "center",
                fontSize: 12,
                height: 25,
                color: "#9c62dc",
              }}
            >
              {(
                100 -
                ((newvalue - (isExpn ? loss[v] : profit[v])) / newvalue) * 100
              ).toFixed(2)}
              %
            </Text>
          ),
          frontColor: "#9c62dc",
        },
      ];
    })
    .flat();
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
    let date = new Date(v.date);
    if (
      date.getDate() >= currDay - 7 &&
      currMonth === date.getMonth() &&
      currYear === date.getFullYear()
    ) {
      let value = parseFloat(v.value);
      let day = date.getDate();
      if (value < 0) {
        loss[day] += Math.abs(value);
      } else {
        profit[day] += value;
      }
    }
  });

  let thisWeekMax = Math.max(
    Object.values(loss).reduce((a, b) => a + b, 0),
    Object.values(profit).reduce((a, b) => a + b, 0)
  );
  let thisWeekProfit = Object.keys(profit).map((v) => {
    return {
      label: v,
      dataPointText: getFriendlyFormat(parseFloat(profit[v])),
      value: parseFloat(profit[v]),
    };
  });
  let thisWeekLoss = Object.keys(loss).map((v) => {
    return {
      label: v,
      dataPointText: getFriendlyFormat(parseFloat(loss[v])),
      value: parseFloat(loss[v]),
    };
  });

  return { thisWeekProfit, thisWeekLoss, thisWeekMax };
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
    let date = new Date(v.date);
    if (
      date.getHours() >= currHour - 24 &&
      currDay === date.getDate() &&
      currMonth === date.getMonth() &&
      currYear === date.getFullYear()
    ) {
      let value = parseFloat(v.value);
      if (value < 0) {
        loss[date.getHours()] += Math.abs(value);
      } else {
        profit[date.getHours()] += value;
      }
    }
  });
  let thisDayMax = Math.max(
    Object.values(loss).reduce((a, b) => a + b, 0),
    Object.values(profit).reduce((a, b) => a + b, 0)
  );
  let thisDayProfit = Object.keys(profit).map((v) => {
    return {
      label: v,
      dataPointText: getFriendlyFormat(parseFloat(profit[v])),
      value: parseFloat(profit[v]),
    };
  });
  let thisDayLoss = Object.keys(loss).map((v) => {
    return {
      label: v,
      dataPointText: getFriendlyFormat(parseFloat(loss[v])),
      value: parseFloat(loss[v]),
    };
  });

  return { thisDayProfit, thisDayLoss, thisDayMax };
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
    let date = new Date(v.date);
    if (
      (date.getDate() >= currDay - 31 && currMonth === date.getMonth()) ||
      (currMonth === date.getMonth() - 1 && currYear === date.getFullYear())
    ) {
      let value = parseFloat(v.value);
      let day = date.getDate();
      if (value < 0) loss[day] += Math.abs(value);
      else profit[day] += value;
    }
  });

  let thisMonthMax = Math.max(
    Object.values(loss).reduce((a, b) => a + b, 0),
    Object.values(profit).reduce((a, b) => a + b, 0)
  );
  let thisMonthProfit = Object.keys(profit).map((v) => {
    return {
      label: v,
      dataPointText: getFriendlyFormat(parseFloat(profit[v])),
      value: parseFloat(profit[v]),
    };
  });
  let thisMonthLoss = Object.keys(loss).map((v) => {
    return {
      label: v,
      dataPointText: getFriendlyFormat(parseFloat(loss[v])),
      value: parseFloat(loss[v]),
    };
  });

  return { thisMonthProfit, thisMonthLoss, thisMonthMax };
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

  let thisYearMax = Math.max(
    Object.values(loss).reduce((a, b) => a + b, 0),
    Object.values(profit).reduce((a, b) => a + b, 0)
  );
  let thisYearProfit = Object.keys(profit).map((v) => ({
    label: v.substring(0, 3),
    dataPointText: getFriendlyFormat(parseFloat(profit[v])),
    value: profit[v],
  }));

  let thisYearLoss = Object.keys(loss).map((v) => ({
    label: v.substring(0, 3),
    dataPointText: getFriendlyFormat(parseFloat(loss[v])),
    value: loss[v],
  }));

  return { thisYearProfit, thisYearLoss, thisYearMax };
}

export default function Audit({ navigation }) {
  const { delGoal, delBudget, budgetIdx, budgets } = Budgets();
  const { currency, symbol } = AppSettings();
  const budget = budgets[budgetIdx];

  const transacs = budget.transactions;
  const goals = Budgets().budgets[budgetIdx].goals || [];
  const newvalue = parseFloat(budget.newvalue);
  const oldvalue = parseFloat(budget.oldvalue);

  const { thisDayProfit, thisDayLoss, thisDayMax } = useMemo(() =>
    getThisDay(transacs)
  );
  const { thisWeekProfit, thisWeekLoss, thisWeekMax } = useMemo(() =>
    getThisWeek(transacs)
  );
  const { thisMonthProfit, thisMonthLoss, thisMonthMax } = useMemo(() =>
    getThisMonth(transacs)
  );
  const { thisYearProfit, thisYearLoss, thisYearMax } = useMemo(() =>
    getThisYear(transacs)
  );

  const filterByText = [
    "Categories",
    "Last 24 Hours",
    "Last 7 Days",
    "Last 30 Days",
    "Last 12 Months",
  ];

  const [carouselIdx, setCarouselIdx] = useState(0);
  const [showExpn, setShowExpn] = useState(true);

  return (
    <SafeAreaView style={{ backgroundColor: "#E5DDF0", height: "100%" }}>
      <View className="w-5/6 self-center items-center my-8" style={{ gap: 5 }}>
        <View
          className="w-full px-3 py-2 rounded-lg"
          style={{ backgroundColor: "white" }}
        >
          <View
            className="flex-row items-center w-full"
            style={{ justifyContent: "space-between" }}
          >
            <Feather
              name="arrow-left"
              color="#9c62dc"
              size={23}
              onPress={() => navigation.goBack()}
            />
            <ThreeDotsMenu
              iconColor="#9c62dc"
              iconSize={18}
              onEditCallback={() => navigation.navigate("ModifyBudget")}
              onDeleteCallback={() => {
                delBudget(budgetIdx);
                navigation.navigate("Home");
              }}
            />
          </View>
          <View className="flex-row">
            <Text
              color="#9c62dc"
              style={{ fontFamily: "Jose-Regular", fontSize: 50 }}
            >
              {newvalue.toLocaleString()}
            </Text>
            <View
              className="flex-row items-center rounded-lg py-2 px-2 self-end"
              style={{
                gap: 5,
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
                {(((newvalue - oldvalue) / oldvalue) * 100).toFixed(2)}%
              </Text>
            </View>
          </View>
          <View
            className="flex-row items-center"
            style={{ justifyContent: "space-between" }}
          >
            <Text color="#9c62dc">{currency}</Text>
          </View>
        </View>

        {transacs.length === 0 ? (
          <View
            className="rounded-lg w-full py-20 px-5 items-center"
            style={{ backgroundColor: "#9c62dc" }}
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
                iconColor="#9c62dc"
                onPress={() => {
                  setCarouselIdx(carouselIdx === 0 ? 0 : carouselIdx - 1);
                }}
                onlyIcon
              ></Button>
              <Text color="#9c62dc" h5>
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
                iconColor="#9c62dc"
                onlyIcon
              ></Button>
            </View>
            <View className="flex-row items-center w-4/6">
              <Button
                onPress={() => setShowExpn(false)}
                className="rounded-lg mt-2 w-20"
                style={{
                  backgroundColor: !showExpn ? "#9c62dc" : "white",
                }}
              >
                <Text color={showExpn ? "#9c62dc" : "white"}>Incomes</Text>
              </Button>
              <Button
                onPress={() => setShowExpn(true)}
                className="rounded-lg mt-2 ml-2 w-20"
                style={{
                  backgroundColor: showExpn ? "#9c62dc" : "white",
                }}
              >
                <Text color={!showExpn ? "#9c62dc" : "white"}>Expeneses</Text>
              </Button>
            </View>
            <View className="flex-column items-center self-center py-5 w-full">
              {
                [
                  <BarChart
                    data={categoriesByProfitLoss(transacs, newvalue, showExpn)}
                    barWidth={16}
                    spacing={50}
                    barBorderRadius={5}
                    hideRules
                    yAxisLabelSuffix={"%"}
                    xAxisThickness={0}
                    yAxisThickness={0}
                    maxValue={120}
                    width={screenWidth / 1.2}
                    hideYAxisText
                    yAxisTextStyle={{ color: "#9c62dc" }}
                    rulesColor="#9c62dc"
                    isAnimated
                  />,
                  <LineChart
                    spacing={20}
                    xAxisLabelTextStyle={{ color: "#9c62dc" }}
                    yAxisTextStyle={{ color: "#9c62dc" }}
                    rulesColor="#9987B5"
                    verticalLinesColor="#9987B5"
                    data={showExpn ? thisDayLoss : thisDayProfit}
                    color="#9c62dc"
                    maxValue={thisDayMax + thisDayMax / 10}
                    scrollToIndex={new Date().getHours() - 5}
                    dataPointsColor="#9c62dc"
                    hideRules
                    width={screenWidth / 1.2}
                    curveType={CurveType.QUADRATIC}
                    curved
                    hideYAxisText
                    yAxisThickness={0}
                    dataPointsHeight={20}
                    dataPointsWidth1={20}
                    textFontSize={13}
                    textColor="#9c62dc"
                    xAxisThickness={0}
                  />,
                  <LineChart
                    spacing={45}
                    xAxisLabelTextStyle={{ color: "#9c62dc" }}
                    yAxisTextStyle={{ color: "#9c62dc" }}
                    rulesColor="#9987B5"
                    verticalLinesColor="#9987B5"
                    data={showExpn ? thisWeekLoss : thisWeekProfit}
                    maxValue={thisWeekMax + thisWeekMax / 10}
                    color="#9c62dc"
                    scrollToIndex={new Date().getDate() - 5}
                    hideRules
                    dataPointsColor1="#9c62dc"
                    curveType={CurveType.QUADRATIC}
                    width={screenWidth / 1.2}
                    curved
                    yAxisThickness={0}
                    xAxisThickness={0}
                    dataPointsHeight={20}
                    dataPointsWidth={15}
                    textFontSize={13}
                    textColor="#9c62dc"
                    hideYAxisText
                  />,

                  <LineChart
                    spacing={20}
                    xAxisLabelTextStyle={{ color: "#9c62dc" }}
                    yAxisTextStyle={{ color: "#9c62dc" }}
                    rulesColor="#9987B5"
                    data={showExpn ? thisMonthLoss : thisMonthProfit}
                    verticalLinesColor="#9987B5"
                    color1="#9c62dc"
                    maxValue={thisMonthMax + thisMonthMax / 10}
                    dataPointsColor1="#9c62dc"
                    scrollToIndex={new Date().getDate() - 5}
                    hideRules
                    width={screenWidth / 1.2}
                    curveType={CurveType.QUADRATIC}
                    curved
                    dataPointsHeight={20}
                    dataPointsWidth1={20}
                    textFontSize={13}
                    textColor="black"
                    hideYAxisText
                    yAxisThickness={0}
                    xAxisThickness={0}
                  />,
                  <LineChart
                    spacing={30}
                    xAxisLabelTextStyle={{ color: "#9c62dc" }}
                    yAxisTextStyle={{ color: "#9c62dc" }}
                    rulesColor="#9987B5"
                    verticalLinesColor="#9987B5"
                    data={showExpn ? thisYearLoss : thisYearProfit}
                    color1="#9c62dc"
                    scrollToIndex={new Date().getMonth()}
                    maxValue={thisYearMax + thisYearMax / 10}
                    dataPointsColor1="#9c62dc"
                    dataPointsColor2="white"
                    hideRules
                    width={screenWidth / 1.2}
                    curveType={CurveType.QUADRATIC}
                    curved
                    hideYAxisText
                    dataPointsHeight={20}
                    dataPointsWidth={20}
                    textFontSize={13}
                    textColor="black"
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
            color: "#9c62dc",
            fontSize: 40,
            fontFamily: "Inter-Regular",
          }}
        >
          Goals
        </Text>
        {goals.length === 0 ? (
          <View
            className="rounded-lg w-full py-20 px-5 items-center"
            style={{ backgroundColor: "#9c62dc" }}
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
                style={{ backgroundColor: "#9c62dc" }}
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
                  ></View>
                </View>
                <View
                  className="flex-row w-full"
                  style={{ justifyContent: "space-between" }}
                >
                  <Text color="white" style={{ fontFamily: "Inter-Regular" }}>
                    0 {symbol}
                  </Text>
                  <Text color="white" style={{ fontFamily: "Inter-Regular" }}>
                    {getFriendlyFormat(item.value)} {symbol}
                  </Text>
                </View>
                <Button
                  color="white"
                  style={{ width: 70, height: 30 }}
                  onPress={() => delGoal(budgetIdx, index)}
                >
                  <Text color="#9c62dc" style={{ fontSize: 12 }}>
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
