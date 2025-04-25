import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import * as Clipboard from "expo-clipboard";
import { useWallet } from "@crossmint/client-sdk-react-native-ui";
import { router } from "expo-router";

export default function Deposit() {
  const { wallet } = useWallet();

  const copyAddress = async () => {
    if (wallet?.address) {
      await Clipboard.setStringAsync(wallet.address);
      Alert.alert("Success", "Wallet address copied to clipboard", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    }
  };

  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerPlaceholder} />
        <Text style={styles.title}>Deposit</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <Feather
            name="x"
            style={styles.closeButtonText}
            size={24}
            color="black"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={styles.text}>
          This feature is coming soon. You can send USDC to this wallet address:
        </Text>

        <View style={styles.walletAddressContainer}>
          <Text style={styles.walletAddress}>
            {wallet ? formatWalletAddress(wallet.address) : "Loading..."}
          </Text>
          <TouchableOpacity onPress={copyAddress} style={styles.copyButton}>
            <Feather name="copy" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerPlaceholder: {
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    fontSize: 18,
    color: "#000",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  text: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  walletAddressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  walletAddress: {
    fontSize: 16,
    fontWeight: "500",
  },
  copyButton: {
    padding: 8,
  },
});
