import { Text, StatusBar, Platform } from "react-native";
import { SafeAreaView } from "@/components/";
export default function Index() {
  return (
    <SafeAreaView>
      <StatusBar barStyle="dark-content" />
      <Text>Hello Blind Wallet</Text>
    </SafeAreaView>
  );
}
