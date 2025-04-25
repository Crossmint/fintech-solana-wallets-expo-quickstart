import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useLuloPools } from "@/lib/useLuloPools";
import { useLuloAccount } from "@/lib/providers/lulo";
import { router } from "expo-router";

export default function YieldCard() {
  const { data: poolsData } = useLuloPools();
  const { data: accountData } = useLuloAccount();

  const handleYield = () => {
    if (hasDeposits) {
      router.push("/yield/overview");
    } else {
      router.push("/yield/deposit");
    }
  };

  const apy = poolsData?.protected.apy
    ? (poolsData.protected.apy * 100).toFixed(2)
    : "0";
  const balance = accountData?.pusdUsdBalance || 0;
  const earnedRewards = accountData?.protectedInterestEarned || 0;
  const hasDeposits = balance > 0;
  const formattedEarnings =
    earnedRewards > 0 ? `+$${earnedRewards.toFixed(2)}` : "";

  return (
    <TouchableOpacity style={styles.yieldCard} onPress={handleYield}>
      <View style={styles.yieldLeft}>
        <Image
          source={require("@/assets/images/reward.png")}
          style={styles.yieldIcon}
        />
        <View>
          <Text style={styles.yieldTitle}>
            {hasDeposits ? "Earning" : "Earn rewards"}
          </Text>
          <Text style={styles.yieldSubtitle}>
            {hasDeposits ? `${apy}% APY` : `Earn up to ${apy}% annually`}
          </Text>
        </View>
      </View>
      <View style={styles.yieldRight}>
        {hasDeposits && (
          <View style={styles.amountContainer}>
            <Text style={styles.amount}>${balance.toFixed(2)}</Text>
            {formattedEarnings && (
              <Text style={styles.earnings}>{formattedEarnings}</Text>
            )}
          </View>
        )}
        <Feather
          name="chevron-right"
          style={styles.chevron}
          size={24}
          color="#666"
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  yieldCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  yieldLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  yieldRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  yieldIcon: {
    width: 32,
    height: 32,
  },
  yieldTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  yieldSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  amountContainer: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 16,
    fontWeight: "500",
  },
  earnings: {
    fontSize: 14,
    color: "#62C560",
  },
  chevron: {
    fontSize: 24,
    color: "#666",
  },
});
