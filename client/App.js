import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RNBootSplash from "react-native-bootsplash";
// Fonts
import { useFonts } from "expo-font"

export default function App() {
  let [fontsLoaded, error] = useFonts({
    "NotoKufiArabic-Medium": require("./assets/fonts/NotoKufiArabic-Medium.ttf")
  })

  useEffect(() => {
    hideSplashScreen()
  }, []);

  if (!fontsLoaded) {
    return null;
  }




  return (
    <View style={styles.container}>
      <Text style={styles.text}>شوية كلام</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: "NotoKufiArabic-Medium"
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