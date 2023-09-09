import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Button } from "galio-framework";
import { LineChart, ProgressChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { Budgets, AppSettings } from "./DBOp";
import { getFriendlyFormat } from "./Utility";
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
        temp === undefined ? parseFloat(v.value) : temp + parseFloat(v.value);
    });
  return {
    labels: Object.keys(byDate),
    datasets: [{ data: Object.values(byDate) }],
  };
}

export default function Audit({ route, navigation }) {
  const { budget, budgetID } = route.params;
  const { settings } = AppSettings();
  const transacs = budget.transactions;
  const data = getCategoryPercentage(transacs);
  const lineData = getBudgetVariation(transacs);
  const monthData = getByMonth(transacs);
  const { delGoal, delBudget } = Budgets();
  const goals = Budgets().budgets[budgetID].goals || [];
  const newvalue = parseFloat(budget.newvalue);
  const oldvalue = parseFloat(budget.oldvalue);

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
            <Text color="#6934BF">{settings.currency}</Text>
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
              <View
                className="py-5 px-5 items-center rounded-lg mx-5"
                style={{ backgroundColor: "#6934BF" }}
              >
                <Text color="white" style={{ fontFamily: "Inter-Regular" }} h3>
                  Categories
                </Text>
                <View className="mr-20">
                  <ProgressChart
                    data={data}
                    width={screenWidth}
                    height={200}
                    strokeWidth={16}
                    radius={30}
                    chartConfig={chartConfig}
                    hideLegend={false}
                  />
                </View>
              </View>,
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
                  ></View>
                </View>
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
