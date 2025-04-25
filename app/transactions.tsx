import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useTransactions } from "../lib/providers/transactions";

const TransactionItem = ({
  type,
  amount,
  date,
  status,
  fromAddress,
  toAddress,
}: {
  type: string;
  amount: string;
  date: string;
  status?: "failed" | "canceled";
  fromAddress: string;
  toAddress: string;
}) => {
  const isNegative = amount.startsWith("-");
  const getIcon = () => {
    switch (type) {
      case "Deposit":
        return "plus";
      case "Sent":
        return "arrow-up-right";
      case "Transfer":
        return "repeat";
      default:
        return "circle";
    }
  };

  const truncateAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 3)}...${address.slice(-3)}`;
  };

  const getTransactionTitle = () => {
    if (type === "Deposit") {
      return `Received from ${truncateAddress(fromAddress)}`;
    }
    return `Sent to ${truncateAddress(toAddress)}`;
  };

  return (
    <View style={styles.transactionItem}>
      <View style={styles.transactionLeft}>
        <View
          style={[
            styles.transactionIcon,
            status && styles.transactionIconError,
          ]}
        >
          <Feather name={getIcon()} size={20} color="#666" />
        </View>
        <View>
          <Text style={styles.transactionType}>{getTransactionTitle()}</Text>
          <Text style={styles.transactionDate}>{date}</Text>
        </View>
      </View>
      <View style={styles.transactionRight}>
        <Text
          style={[
            styles.transactionAmount,
            isNegative ? styles.negativeAmount : styles.positiveAmount,
          ]}
        >
          {amount || "0"}
        </Text>
        <Text style={styles.currency}>USD</Text>
      </View>
    </View>
  );
};

export default function Transactions() {
  const { transactions, fetchTransactions } = useTransactions();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <View style={styles.activitySection}>
      <Text style={styles.activityTitle}>Last activity</Text>
      {transactions.map((tx, index) => (
        <TransactionItem
          key={index}
          type={tx.type === "received" ? "Deposit" : "Sent"}
          amount={tx.amount}
          date={tx.date}
          status={tx.status}
          fromAddress={tx.fromAddress}
          toAddress={tx.toAddress}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  activitySection: {
    backgroundColor: "white",
    borderRadius: 16,
    margin: 16,
    marginTop: 8,
    padding: 16,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 16,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  transactionIconError: {
    backgroundColor: "#ffebee",
  },
  transactionType: {
    fontSize: 14,
    fontWeight: "500",
  },
  transactionDate: {
    fontSize: 14,
    color: "#666",
  },
  transactionRight: {
    alignItems: "flex-end",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "500",
  },
  positiveAmount: {
    color: "#05B959",
  },
  negativeAmount: {
    color: "#000",
  },
  currency: {
    fontSize: 14,
    color: "#666",
  },
  transactionAddress: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
});
