import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import Balance from "./balance";
import YieldCard from "./yield/card";
import Transactions from "./transactions";
import { useWalletBalances } from "@/lib/providers/balance";
import { useTransactions } from "@/lib/providers/transactions";
import { useLuloAccount } from "@/lib/providers/lulo";

export default function Home() {
  const [refreshing, setRefreshing] = useState(false);
  const { fetchBalances } = useWalletBalances();
  const { fetchTransactions } = useTransactions();
  const { fetchAccount } = useLuloAccount();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([fetchBalances(), fetchTransactions(), fetchAccount()]);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  }, [fetchBalances, fetchTransactions, fetchAccount]);

  const goToDeposit = () => {
    router.push("/deposit");
  };

  const goToTransfer = () => {
    router.push("/transfer");
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#05B959"
          colors={["#05B959"]}
        />
      }
    >
      <View style={styles.balanceContainer}>
        <Balance />
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.depositButton} onPress={goToDeposit}>
            <Feather name="plus" size={24} color="white" />
            <Text style={styles.depositButtonText}>Deposit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendButton} onPress={goToTransfer}>
            <Feather name="arrow-up-right" size={24} color="black" />
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>

      <YieldCard />
      <Transactions />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  balanceContainer: {
    margin: 16,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  depositButton: {
    flex: 1,
    backgroundColor: "#05B959",
    padding: 14,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  sendButton: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 14,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  depositButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  sendButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "500",
  },
});
