import { SafeAreaView, Text, StatusBar } from "react-native";

export default function Index() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <StatusBar barStyle="default" />
      <Text>Hello Blind Wallet</Text>
    </SafeAreaView>
  );
}
