import React, { createContext, useContext, useState, useCallback } from "react";
import { Alert } from "react-native";
import { useWallet } from "@crossmint/client-sdk-react-base";

export interface Transaction {
  type: "sent" | "received";
  amount: string;
  date: string;
  status?: "failed" | "canceled";
  fromAddress: string;
  toAddress: string;
}

interface TransactionsContextType {
  transactions: Transaction[];
  fetchTransactions: () => Promise<void>;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(
  undefined
);

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) {
    return "Just now";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInDays === 1) {
    return "Yesterday";
  } else if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  }
};

export function TransactionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { wallet } = useWallet();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const fetchTransactions = useCallback(async () => {
    if (wallet) {
      try {
        const address = wallet.address;
        const response = await fetch(
          `https://api.helius.xyz/v0/addresses/${address}/transactions?api-key=${process.env.EXPO_PUBLIC_HELIUS_API_KEY}&limit=10`
        );
        const data = await response.json();

        const usdcTransfers: Transaction[] = [];

        // Check if data is an array
        if (Array.isArray(data)) {
          for (const tx of data) {
            // Check if tokenTransfers exists and is an array
            if (
              tx.tokenTransfers &&
              Array.isArray(tx.tokenTransfers) &&
              tx.tokenTransfers.length > 0
            ) {
              const transfer = tx.tokenTransfers[0];
              if (transfer.mint === process.env.EXPO_PUBLIC_USDC_TOKEN_MINT) {
                const isReceived = transfer.toUserAccount === wallet.address;
                const tokenAmount = transfer.tokenAmount || 0;
                const amount = tokenAmount.toFixed(2); // Convert from lamports to USDC
                const date = formatDate(tx.timestamp);

                usdcTransfers.push({
                  type: isReceived ? "received" : "sent",
                  amount: isReceived ? `+$${amount}` : `-$${amount}`,
                  date,
                  fromAddress: transfer.fromUserAccount,
                  toAddress: transfer.toUserAccount,
                });
              }
            }
          }
        } else {
          console.error("Unexpected API response format:", data);
          Alert.alert("Error", "Unexpected response format from API");
        }

        setTransactions(usdcTransfers);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        Alert.alert("Error", "Failed to fetch transactions");
      }
    }
  }, [wallet]);

  return (
    <TransactionsContext.Provider value={{ transactions, fetchTransactions }}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionsContext);
  if (context === undefined) {
    throw new Error(
      "useTransactions must be used within a TransactionsProvider"
    );
  }
  return context;
}
