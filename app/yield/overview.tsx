import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useLuloAccount } from "@/lib/providers/lulo";
import { useLuloPools } from "@/lib/useLuloPools";
import Feather from "@expo/vector-icons/Feather";

export default function YieldOverview() {
  const { data: accountData } = useLuloAccount();
  const { data: poolsData } = useLuloPools();

  const stakedBalance = accountData?.pusdUsdBalance || 0;
  const earnedRewards = accountData?.protectedInterestEarned || 0;
  const apy = poolsData?.protected.apy
    ? (poolsData.protected.apy * 100).toFixed(2)
    : "0";

  const handleStake = () => {
    router.push("/yield/deposit");
  };

  const handleUnstake = () => {
    router.push("/yield/withdraw");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerPlaceholder} />
        <Text style={styles.title}>Earning</Text>
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
        <Text style={styles.earningTitle}>Earning</Text>
        <Text style={styles.earningAmount}>
          +${earnedRewards > 0 ? earnedRewards.toFixed(2) : "0.00"}
        </Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Deposited</Text>
            <Text style={styles.infoValue}>${stakedBalance.toFixed(2)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Earn rate</Text>
            <Text style={styles.infoValue}>Up to {apy}% APY</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleStake}>
            <Text style={styles.actionButtonText}>Deposit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.unstakeButton]}
            onPress={handleUnstake}
          >
            <Text style={[styles.actionButtonText, styles.unstakeButtonText]}>
              Withdraw
            </Text>
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
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  earningTitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  earningAmount: {
    fontSize: 48,
    fontWeight: "600",
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: "#666",
  },
  infoValue: {
    fontSize: 16,
    color: "#000",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: "auto",
    paddingVertical: 16,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#05B959",
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: "center",
  },
  unstakeButton: {
    backgroundColor: "#f5f5f5",
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  unstakeButtonText: {
    color: "black",
  },
});
