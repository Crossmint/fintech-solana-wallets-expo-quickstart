import { useState, useEffect, createContext, useContext } from "react";
import { useWallet } from "@crossmint/client-sdk-react-native-ui";

interface LuloAccountResponse {
  totalUsdValue: number;
  lusdUsdBalance: number;
  pusdUsdBalance: number;
  maxWithdrawable: {
    protected: {
      [key: string]: number;
    };
    regular: {
      [key: string]: number;
    };
  };
  totalInterestEarned: number;
  protectedInterestEarned: number;
  regularInterestEarned: number;
  blockTime: number;
}

interface LuloAccountContextType {
  data: LuloAccountResponse | null;
  error: Error | null;
  loading: boolean;
  fetchAccount: () => Promise<void>;
}

const LuloAccountContext = createContext<LuloAccountContextType | null>(null);

export function LuloAccountProvider({ children }: { children: React.ReactNode }) {
  const { wallet } = useWallet();
  const [data, setData] = useState<LuloAccountResponse | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAccount = async () => {
    if (!wallet?.address) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://api.lulo.fi/v1/account.getAccount?owner=${wallet.address}`,
        {
          method: "GET",
          headers: {
            "x-api-key": process.env.EXPO_PUBLIC_LULO_API_KEY || "",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch Lulo account data");
      }

      const jsonData = await response.json();
      setData(jsonData);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Unknown error occurred")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccount();
  }, [wallet?.address]);

  const value = {
    data,
    error,
    loading,
    fetchAccount,
  };

  return (
    <LuloAccountContext.Provider value={value}>
      {children}
    </LuloAccountContext.Provider>
  );
}

export function useLuloAccount() {
  const context = useContext(LuloAccountContext);
  if (!context) {
    throw new Error("useLuloAccount must be used within a LuloAccountProvider");
  }
  return context;
}
