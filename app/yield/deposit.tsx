import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  Image,
} from "react-native";
import { router } from "expo-router";
import { useWallet } from "@crossmint/client-sdk-react-native-ui";
import { VersionedTransaction } from "@solana/web3.js";
import { useWalletBalances } from "@/lib/providers/balance";
import Feather from "@expo/vector-icons/Feather";
import { useLuloAccount } from "@/lib/providers/lulo";
import { useLuloPools } from "@/lib/useLuloPools";

export default function YieldDeposit() {
  const { wallet, type } = useWallet();
  const [amount, setAmount] = useState("");
  const [isPending, setIsPending] = useState(false);
  const { formattedBalance, fetchBalances } = useWalletBalances();
  const { fetchAccount } = useLuloAccount();
  const { data: poolsData } = useLuloPools();

  const isAmountExceedingBalance = Number(amount) > Number(formattedBalance);

  const apy = poolsData?.protected.apy
    ? (poolsData.protected.apy * 100).toFixed(2)
    : "0";

  const handleConfirm = async () => {
    if (wallet == null || type !== "solana-smart-wallet") {
      return;
    }

    if (isAmountExceedingBalance) {
      Alert.alert("Insufficient Balance", "Amount exceeds available balance");
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
          mintAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC mint address
          protectedAmount: Number(amount),
        }),
      };

      const response = await fetch(
        "https://api.lulo.fi/v1/generate.transactions.deposit",
        options
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error?.message || "Failed to generate deposit transaction"
        );
      }

      const transaction = VersionedTransaction.deserialize(
        Buffer.from(data.transaction, "base64")
      );

      const hash = await wallet.sendTransaction({
        transaction,
      });

      if (!hash) {
        throw new Error("Failed to submit transaction");
      }

      await Promise.all([fetchBalances(), fetchAccount()]);

      Alert.alert("Success", "Your deposit has been initiated");
      router.back();
    } catch (error) {
      console.error("Deposit error:", error);
      Alert.alert("Deposit Failed", `${error}`);
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
        <Text style={styles.title}>Deposit</Text>
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
          ${formattedBalance} in your wallet
        </Text>
        <View style={styles.card}>
          <Image
            source={require("@/assets/images/lulo.png")}
            style={styles.logo}
          />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Earn rewards</Text>
            <Text style={styles.cardSubtitle}>
              Grow your balance up to {apy}% per year just by holding your
              assets with Lulo. You can withdraw your USD at anytime.
            </Text>
          </View>
        </View>
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
  descriptionText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: -16,
    marginBottom: 16,
    paddingHorizontal: 20,
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
  card: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 32,
    flexDirection: "row",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 12,
    borderRadius: 20,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});
