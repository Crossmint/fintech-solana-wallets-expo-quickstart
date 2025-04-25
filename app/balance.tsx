import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useWalletBalances } from "@/lib/providers/balance";

export default function Balance() {
  const { formattedBalance } = useWalletBalances();

  return (
    <View>
      <Text style={styles.balanceLabel}>Your balance</Text>
      <Text style={styles.balanceAmount}>${formattedBalance}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  balanceLabel: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
    textAlign: "center",
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
});
