import React, { useEffect } from "react"
// React Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// Screen s
import HomeScreen from "../Screens/HomeScreen";
import CreateUserScreen from "../Screens/CreateUserScreen";
import WaitingScreen from "../Screens/WaitingScreen";
import JoinScreen from "../Screens/JoinScreen";
import QrScannerScreen from "../Screens/QrScannerScreen";

// Context Provider
import { useUser, useStoreUser } from "../../Providers/UserProvider"
// Utilties
import { socket } from "../Utilities/SocketConnection"
import AsyncStorage from "@react-native-async-storage/async-storage"
import MainGameScreen from "../Screens/MainGameProcess/MainGameScreen";


const Stack = createNativeStackNavigator();

let round = 1

const ScreenNavigator = () => {
    const user = useUser()
    const setUser = useStoreUser()

    useEffect(() => {

        const reconnectListener = async () => {
            console.log("socket reconnected...")
            const value = await AsyncStorage.getItem("user")
            if (value) {
                socket.emit("configure-user", JSON.parse(value), socketUser => {
                    setUser(socketUser)
                })
            }
        }


        socket.io.on("reconnect", reconnectListener)

        return () => {
            socket.io.off("reconnect", reconnectListener)
        }
    }, [])



    if (user.loading) {
        return <></>
    }

    return (
        <NavigationContainer>
            {
                user.name ? <UserFound /> : <UserMissing />
            }
        </NavigationContainer>
    )
}

const UserFound = () => (
    <Stack.Navigator
        initialRouteName="HomeScreen"
        screenOptions={{
            headerShown: false
        }}
    >
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="WaitingScreen" component={WaitingScreen} />
        <Stack.Screen name="JoinScreen" component={JoinScreen} />
        <Stack.Screen name="QrScannerScreen" component={QrScannerScreen} />
        <Stack.Screen name="MainGameScreen" component={MainGameScreen} />
    </Stack.Navigator>
)

const UserMissing = () => (
    <Stack.Navigator
        initialRouteName="CreateUser"
        screenOptions={{
            headerShown: false
        }}
    >
        <Stack.Screen name="CreateUser" component={CreateUserScreen} />
    </Stack.Navigator>
)

export default ScreenNavigator;