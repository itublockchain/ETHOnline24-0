import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WalletScreen from "../screens/WalletScreen";
import ActivityScreen from "../screens/ActivityScreen";

export type RootStackParamList = {
  Wallet: undefined;
  Activity: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator
        initialRouteName="Wallet"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Wallet" component={WalletScreen} />
        <Stack.Screen name="Activity" component={ActivityScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
