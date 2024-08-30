import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Slot } from "expo-router";

export type RootStackParamList = {
  Wallet: undefined;
  Activity: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Layout: React.FC = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator
        initialRouteName="Wallet"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Wallet" component={Slot} />
        <Stack.Screen name="Activity" component={Slot} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Layout;
