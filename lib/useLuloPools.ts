import { useState, useEffect } from "react";

interface LuloPool {
  type: string;
  apy: number;
  maxWithdrawalAmount?: number;
  openCapacity?: number;
  price: number;
}

interface LuloPoolsResponse {
  regular: LuloPool;
  protected: LuloPool;
  averagePoolRate: number;
  totalLiquidity: number;
  availableLiquidity: number;
  regularLiquidityAmount: number;
  protectedLiquidityAmount: number;
  regularAvailableAmount: number;
}

export function useLuloPools() {
  const [data, setData] = useState<LuloPoolsResponse | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPools = async () => {
      try {
        const response = await fetch("https://api.lulo.fi/v1/pool.getPools", {
          method: "GET",
          headers: {
            "x-api-key": process.env.EXPO_PUBLIC_LULO_API_KEY || "",
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch Lulo pools data");
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

    fetchPools();
  }, []);

  return { data, error, loading };
}
