import React from "react";
import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import CrossmintProviders from "./providers";
import "@/lib/polyfills";
import { WalletBalancesProvider } from "@/lib/providers/balance";
import { LuloAccountProvider } from "@/lib/providers/lulo";
import { TransactionsProvider } from "../lib/providers/transactions";

export default function RootLayout() {
  return (
    <CrossmintProviders>
      <WalletBalancesProvider>
        <TransactionsProvider>
          <LuloAccountProvider>
            <View style={styles.container}>
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: {
                    flex: 1,
                  },
                }}
              >
                <Stack.Screen
                  name="login"
                  options={{
                    contentStyle: {
                      backgroundColor: "#FFFFFF",
                    },
                  }}
                />
                <Stack.Screen
                  name="transfer"
                  options={{
                    headerShown: false,
                    presentation: "modal",
                    animation: "slide_from_bottom",
                  }}
                />
                <Stack.Screen
                  name="deposit"
                  options={{
                    headerShown: false,
                    presentation: "modal",
                    animation: "slide_from_bottom",
                  }}
                />
                <Stack.Screen
                  name="yield/overview"
                  options={{
                    headerShown: false,
                    presentation: "modal",
                    animation: "slide_from_bottom",
                  }}
                />
                <Stack.Screen
                  name="yield/deposit"
                  options={{
                    headerShown: false,
                    presentation: "modal",
                    animation: "slide_from_bottom",
                  }}
                />
                <Stack.Screen
                  name="yield/withdraw"
                  options={{
                    headerShown: false,
                    presentation: "modal",
                    animation: "slide_from_bottom",
                  }}
                />
              </Stack>
            </View>
          </LuloAccountProvider>
        </TransactionsProvider>
      </WalletBalancesProvider>
    </CrossmintProviders>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
