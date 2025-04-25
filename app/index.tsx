import React, { useEffect } from "react";
import {
  View,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Image,
} from "react-native";
import { Redirect } from "expo-router";
import {
  useCrossmintAuth,
  useWallet,
} from "@crossmint/client-sdk-react-native-ui";
import * as Linking from "expo-linking";
import Home from "./home";
import Logout from "./logout";

export default function Index() {
  const { createAuthSession, status, user } = useCrossmintAuth();
  const { getOrCreateWallet, wallet } = useWallet();
  const url = Linking.useURL();

  useEffect(() => {
    if (url != null) {
      createAuthSession(url);
    }
  }, [url, createAuthSession]);

  useEffect(() => {
    if (wallet == null && user != null) {
      getOrCreateWallet({
        type: "solana-smart-wallet",
        args: {},
      });
    }
  }, [wallet, getOrCreateWallet, user]);

  if (status === "initializing" || status === "in-progress") {
    console.log("status", status);
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (status !== "logged-in" || user == null) {
    return <Redirect href="/login" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/images/crossmint-logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Logout />
      </View>
      <Home />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 30,
  },
});
