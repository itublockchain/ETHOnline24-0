import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";

interface DropdownMenuProps {
  visible: boolean;
  onClose: () => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ visible, onClose }) => {
  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <TouchableOpacity style={styles.overlay} onPress={onClose}>
        <View style={styles.menuContainer}>
          <Text style={styles.menuItem}>Option 1</Text>
          <Text style={styles.menuItem}>Option 2</Text>
          <Text style={styles.menuItem}>Option 3</Text>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer: {
    width: 200,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize: 18,
  },
});

export default DropdownMenu;
