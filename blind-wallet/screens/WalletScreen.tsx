import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../app/index";
import { SafeAreaView } from "react-native-safe-area-context";
import DropdownMenu from "../components/DropDownMenu";
import Tts from "react-native-tts";

type WalletScreenProps = NativeStackScreenProps<RootStackParamList, "Wallet">;
let balance = 10533;

// Sesli okuma fonksiyonu
const speak = (text: string) => {
  Tts.speak(text);
};

const WalletScreen: React.FC<WalletScreenProps> = ({ navigation }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setMenuVisible(true)}
          onLongPress={() => speak("Blind-Wallet")}
        >
          <Text style={styles.logo}>Blind-Wallet</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setMenuVisible(true)}
          onLongPress={() => speak("Menu")}
        >
          <Text style={styles.menu}>Menu</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.networkContainer}>
        <TouchableOpacity onLongPress={() => speak("Mainnet")}>
          <Text style={styles.networkText}>Mainnet</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Wallet")}
          onLongPress={() => speak("Wallet")}
          style={styles.tabButton}
        >
          <Text style={[styles.tabText, styles.activeTab]}>Wallet</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Activity")}
          onLongPress={() => speak("Activity")}
          style={styles.tabButton}
        >
          <Text style={styles.tabText}>Activity</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.balanceContainer}>
        <TouchableOpacity
          style={styles.balanceWrapper}
          onLongPress={() => speak(`Balance: ${balance} dollars`)}
        >
          <Text style={styles.dollarSign}>$</Text>
          <Text style={styles.balanceText}>{balance}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.depositButton]}
          onPress={() => console.log("Deposit Pressed")}
          onLongPress={() => speak("Deposit")}
        >
          <Text style={styles.buttonText}>DEPOSIT +</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.requestButton]}
          onPress={() => console.log("Request Pressed")}
          onLongPress={() => speak("Request")}
        >
          <Text style={[styles.buttonText, { color: "black" }]}>REQUEST +</Text>
        </TouchableOpacity>
      </View>

      <DropdownMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D8FF00",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
  },
  menu: {
    fontSize: 20,
    fontWeight: "bold",
  },
  networkContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  networkText: {
    fontSize: 18,
    fontWeight: "600",
    backgroundColor: "#FFFFFF",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 15,
    overflow: "hidden",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 40,
  },
  tabButton: {
    paddingHorizontal: 20,
  },
  tabText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#AAAAAA",
  },
  activeTab: {
    color: "#000000",
  },
  balanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
    padding: 10,
    borderRadius: 15,
  },
  dollarSign: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#AAAAAA",
    marginRight: 5,
  },

  balanceWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },

  balanceText: {
    fontSize: 72,
    fontWeight: "bold",
    color: "#000000",
  },

  buttonContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  button: {
    flex: 1,
    paddingVertical: 25,
    alignItems: "center",
    height: 200,
    justifyContent: "center",
  },
  depositButton: {
    backgroundColor: "#000000",
  },
  requestButton: {
    backgroundColor: "#FFFFFF",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});

export default WalletScreen;
