import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import RNBootSplash from "react-native-bootsplash";
// Fonts
import { useFonts } from "expo-font"
import ScreenNavigator from './src/Navigator/ScreenNavigator';
// Providers
import AppContextProvider from "./Providers/AppContextProvider"



export default function App() {
  let [fontsLoaded] = useFonts({
    "NotoKufiArabic-Thin": require("./assets/fonts/NotoKufiArabic-Thin.ttf"),
    "NotoKufiArabic-Medium": require("./assets/fonts/NotoKufiArabic-Medium.ttf"),
    "NotoKufiArabic-Bold": require("./assets/fonts/NotoKufiArabic-Bold.ttf"),
    "NotoKufiArabic-ExtraBold": require("./assets/fonts/NotoKufiArabic-ExtraBold.ttf")
  })

  useEffect(() => {
    hideSplashScreen()
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AppContextProvider>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <ScreenNavigator />
      </View>
    </AppContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});

async function hideSplashScreen() {
  try {
    await RNBootSplash.hide({ fade: true })
    console.log("Bootsplash has been hidden successfully");
  } catch (err) {
    console.log(err.message)
    return;
  }
}
