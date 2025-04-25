import { useCallback, useState, useEffect, createContext, useContext } from "react";
import { useWallet } from "@crossmint/client-sdk-react-native-ui";
import { WalletBalance } from "@crossmint/client-sdk-react-native-ui";

interface WalletBalancesContextType {
  balances: WalletBalance;
  usdcBalance: string;
  formattedBalance: string;
  fetchBalances: () => Promise<void>;
}

const WalletBalancesContext = createContext<WalletBalancesContextType | null>(null);

export function WalletBalancesProvider({ children }: { children: React.ReactNode }) {
  const { wallet, type } = useWallet();
  const [balances, setBalances] = useState<WalletBalance>([]);

  const fetchBalances = useCallback(async () => {
    if (wallet == null || type !== "solana-smart-wallet") {
      return;
    }

    try {
      const balances = await wallet.getBalances({
        tokens: ["usdc"],
      });
      setBalances(balances);
    } catch (error) {
      console.error("Error fetching wallet balances:", error);
      throw error;
    }
  }, [wallet, type]);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  const usdcBalance =
    balances?.find((t) => t.token === "usdc")?.balances.total || "0";
  const formattedBalance = (Number(usdcBalance) / 10 ** 6).toFixed(2);

  const value = {
    balances,
    usdcBalance,
    formattedBalance,
    fetchBalances,
  };

  return (
    <WalletBalancesContext.Provider value={value}>
      {children}
    </WalletBalancesContext.Provider>
  );
}

export function useWalletBalances() {
  const context = useContext(WalletBalancesContext);
  if (!context) {
    throw new Error("useWalletBalances must be used within a WalletBalancesProvider");
  }
  return context;
}
