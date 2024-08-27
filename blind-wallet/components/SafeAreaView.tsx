import { SafeAreaView as Area, Platform, StatusBar } from "react-native";
import React from "react";

const SafeAreaView = ({ children }: { children: React.ReactNode }) => {
  return (
    <Area
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <StatusBar barStyle="default" />
      {children}
    </Area>
  );
};

export default SafeAreaView;
