import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useWallet } from "@crossmint/client-sdk-react-native-ui";
import { createSendUSDCTransaction } from "@/lib/createTransaction";
import { useWalletBalances } from "@/lib/providers/balance";
import Feather from "@expo/vector-icons/build/Feather";
import { useTransactions } from "../lib/providers/transactions";

export default function Transfer() {
  const { wallet, type } = useWallet();
  const { formattedBalance, fetchBalances } = useWalletBalances();
  const { fetchTransactions } = useTransactions();
  const [amount, setAmount] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [isPending, setIsPending] = useState(false);

  const isAmountExceedingBalance = Number(amount) > Number(formattedBalance);

  const sendUSDC = useCallback(async () => {
    if (wallet == null || type !== "solana-smart-wallet") {
      return;
    }

    if (isAmountExceedingBalance) {
      Alert.alert("Insufficient Balance", "Amount exceeds available balance");
      return;
    }

    try {
      setIsPending(true);
      const transaction = await createSendUSDCTransaction(
        wallet.address,
        recipientAddress,
        Number(amount)
      );

      const hash = await wallet.sendTransaction({
        transaction,
      });
      if (hash) {
        await fetchBalances();
        await fetchTransactions();
        Alert.alert("Success", "Transfer completed successfully", [
          { text: "OK", onPress: () => router.back() },
        ]);
      }
    } catch (error) {
      console.error("Transfer error:", error);
      Alert.alert("Transfer Failed", `${error}`);
    } finally {
      setIsPending(false);
    }
  }, [
    wallet,
    type,
    recipientAddress,
    amount,
    isAmountExceedingBalance,
    fetchBalances,
    fetchTransactions,
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <View style={styles.headerPlaceholder} />
          <Text style={styles.title}>Send</Text>
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

          <View style={styles.recipientSection}>
            <Text
              style={[styles.recipientLabel, isPending && styles.disabledText]}
            >
              Send to
            </Text>
            <View
              style={[
                styles.inputContainer,
                isPending && styles.inputContainerDisabled,
              ]}
            >
              <TextInput
                style={[styles.input, isPending && styles.disabledText]}
                placeholder="Enter wallet address"
                value={recipientAddress}
                onChangeText={setRecipientAddress}
                placeholderTextColor="#666"
                editable={!isPending}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.sendButton,
              (!recipientAddress || amount === "0" || isPending) &&
                styles.sendButtonDisabled,
            ]}
            onPress={sendUSDC}
            disabled={!recipientAddress || amount === "0" || isPending}
          >
            <Text
              style={[
                styles.sendButtonText,
                (!recipientAddress || amount === "0" || isPending) &&
                  styles.sendButtonTextDisabled,
              ]}
            >
              {isPending ? "Sending..." : "Send"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  keyboardAvoid: {
    flex: 1,
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
  recipientSection: {
    marginBottom: 24,
  },
  recipientLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputContainerDisabled: {
    backgroundColor: "#f5f5f5",
    borderColor: "#e2e8f0",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  sendButton: {
    backgroundColor: "#05B959",
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  sendButtonDisabled: {
    backgroundColor: "#f5f5f5",
  },
  sendButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  sendButtonTextDisabled: {
    color: "#666",
  },
  balanceText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: -24,
    marginBottom: 32,
  },
  errorText: {
    color: "#ff3b30",
  },
  disabledText: {
    color: "#999",
  },
});
