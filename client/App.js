import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RNBootSplash from "react-native-bootsplash";

export default function App() {

  useEffect(async () => {

    await RNBootSplash.hide({ fade: true });
    console.log("Bootsplash has been hidden successfully");

  }, []);

  return (
    <View style={styles.container}>
      <Text>Finally!!!!!!!!!!!!!!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
});
