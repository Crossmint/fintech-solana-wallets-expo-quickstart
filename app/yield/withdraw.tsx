import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import { useWallet } from "@crossmint/client-sdk-react-native-ui";
import { VersionedTransaction } from "@solana/web3.js";
import { useLuloAccount } from "@/lib/providers/lulo";
import Feather from "@expo/vector-icons/Feather";
import { useWalletBalances } from "@/lib/providers/balance";

export default function YieldWithdraw() {
  const { wallet, type } = useWallet();
  const [amount, setAmount] = useState("");
  const [isPending, setIsPending] = useState(false);
  const { data: accountData } = useLuloAccount();
  const { fetchBalances } = useWalletBalances();
  const { fetchAccount } = useLuloAccount();

  const stakedBalance = accountData?.pusdUsdBalance || 0;
  const isAmountExceedingBalance = Number(amount) > stakedBalance;

  const handleConfirm = async () => {
    if (wallet == null || type !== "solana-smart-wallet") {
      return;
    }

    if (isAmountExceedingBalance) {
      Alert.alert("Insufficient Balance", "Amount exceeds staked balance");
      return;
    }

    try {
      setIsPending(true);

      const options = {
        method: "POST",
        headers: {
          "x-api-key": process.env.EXPO_PUBLIC_LULO_API_KEY || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          owner: wallet.address,
          mintAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
          amount: Number(amount),
        }),
      };

      const response = await fetch(
        "https://api.lulo.fi/v1/generate.transactions.withdrawProtected",
        options
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error?.message || "Failed to generate withdrawal transaction"
        );
      }

      // Execute first transaction
      const transaction = VersionedTransaction.deserialize(
        Buffer.from(data.transaction, "base64")
      );

      const hash = await wallet.sendTransaction({
        transaction,
      });

      if (!hash) {
        throw new Error("Failed to submit withdrawal transaction");
      }

      await Promise.all([fetchBalances(), fetchAccount()]);

      Alert.alert("Success", "Your withdrawal has been processed successfully");
      router.back();
    } catch (error) {
      console.error("Withdraw error:", error);
      Alert.alert("Withdraw Failed", `${error}`);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Feather
            name="arrow-left"
            style={styles.backButtonText}
            size={24}
            color="black"
          />
        </TouchableOpacity>
        <Text style={styles.title}>Withdraw</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.amountContainer}>
          <Text
            style={[
              styles.dollarSign,
              isAmountExceedingBalance && styles.errorText,
              isPending && styles.disabledText,
            ]}
          >
            $
          </Text>
          <TextInput
            style={[
              styles.amountInput,
              isAmountExceedingBalance && styles.errorText,
              isPending && styles.disabledText,
            ]}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor="#666"
            editable={!isPending}
          />
        </View>
        <Text style={[styles.balanceText, isPending && styles.disabledText]}>
          ${stakedBalance.toFixed(2)} available to withdraw
        </Text>

        <TouchableOpacity
          style={[
            styles.confirmButton,
            (!amount || amount === "0" || isPending) &&
              styles.confirmButtonDisabled,
          ]}
          onPress={handleConfirm}
          disabled={!amount || amount === "0" || isPending}
        >
          <Text
            style={[
              styles.confirmButtonText,
              (!amount || amount === "0" || isPending) &&
                styles.confirmButtonTextDisabled,
            ]}
          >
            {isPending ? "Processing..." : "Confirm"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    fontSize: 24,
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
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  dollarSign: {
    fontSize: 48,
    fontWeight: "600",
    marginRight: 8,
  },
  amountInput: {
    fontSize: 48,
    fontWeight: "600",
    textAlign: "center",
  },
  balanceText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: -24,
    marginBottom: 32,
  },
  confirmButton: {
    backgroundColor: "#05B959",
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 16,
  },
  confirmButtonDisabled: {
    backgroundColor: "#f5f5f5",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  confirmButtonTextDisabled: {
    color: "#666",
  },
  errorText: {
    color: "#ff3b30",
  },
  disabledText: {
    color: "#999",
  },
});
