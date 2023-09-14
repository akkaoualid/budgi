import "react-native-gesture-handler";
import Home from "./src/Home.js";
import AddBudget from "./src/AddBudget.js";
import AddTransaction from "./src/AddTransaction.js";
import AddCategory from "./src/AddCategory.js";
import AddGoal from "./src/AddGoal.js";

import TransacView from "./src/TransacView.js";
import Settings from "./src/Settings.js";
import Audit from "./src/Audit.js";

import { GalioProvider } from "galio-framework";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";

const CTHEME = {
  COLORS: {
    PRIMARY: "#6934BF",
    SECONDARY: "#E5DDF0",
  },
};

const Stack = createNativeStackNavigator();

export default function App() {
  useFonts({
    "Inter-Bold": require("./assets/Inter-Bold.ttf"),
    "Inter-Regular": require("./assets/Inter-Regular.ttf"),
    "Jose-Regular": require("./assets/JosefinSans-Regular.ttf"),
  });
  return (
    <NavigationContainer>
      <GalioProvider theme={CTHEME}>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="Home"
        >
          <Stack.Screen name="Home" component={Home}/>
          <Stack.Screen name="Setup" component={AddBudget} />
          <Stack.Screen name="Budget" component={TransacView} />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="AddTransac" component={AddTransaction} />
          <Stack.Screen name="AddCat" component={AddCategory} />
          <Stack.Screen name="AddGoal" component={AddGoal} />
          <Stack.Screen name="Audit" component={Audit} />
        </Stack.Navigator>
      </GalioProvider>
    </NavigationContainer>
  );
}
