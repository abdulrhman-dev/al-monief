import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RNBootSplash from "react-native-bootsplash";
// Fonts
import { useFonts } from "expo-font"
import ScreenNavigator from './src/Navigator/ScreenNavigator';
import { UserProvider } from './UserProvider';


export default function App() {
  let [fontsLoaded, error] = useFonts({
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
    <UserProvider>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <ScreenNavigator />
      </View>
    </UserProvider>
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