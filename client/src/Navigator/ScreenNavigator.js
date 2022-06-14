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
import MainGameScreen from "../Screens/MainGameProcess/MainGameScreen";
import CheckingScreen from "../Screens/CheckingScreen";
import LeaderboardScreen from "../Screens/LeaderboardScreen";
// Context Provider
import { useUser, useStoreUser } from "../../Providers/UserProvider"
import { useGame } from "../../Providers/GameProvider"

// Utilties
import { socket } from "../Utilities/SocketConnection"
import AsyncStorage from "@react-native-async-storage/async-storage"


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

const UserFound = () => {
    const game = useGame()

    return (
        <Stack.Navigator
            initialRouteName="HomeScreen"
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Group>
                <Stack.Screen name="HomeScreen" component={HomeScreen} />
                <Stack.Screen name="WaitingScreen" component={WaitingScreen} />
                <Stack.Screen name="JoinScreen" component={JoinScreen} />
                <Stack.Screen name="QrScannerScreen" component={QrScannerScreen} />
            </Stack.Group>
            <Stack.Group>
                <Stack.Screen name="MainGameScreen" component={MainGameScreen} />
                <Stack.Screen name="CheckingScreen" component={CheckingScreen} />
                <Stack.Screen name="LeaderboardScreen" component={LeaderboardScreen} />
            </Stack.Group>
        </Stack.Navigator>
    )
}

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