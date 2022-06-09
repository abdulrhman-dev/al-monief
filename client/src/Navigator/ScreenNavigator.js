import React, { useEffect } from "react"
// React Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// Screen s
import HomeScreen from "../screens/HomeScreen";
import CreateUserScreen from "../screens/CreateUserScreen";
import WaitingScreen from "../screens/WaitingScreen";
import JoinModal from "../screens/JoinScreen";
// Context Provider
import { useUser } from "../../Providers/UserProvider"
// Utilties
import { socket } from "../Utilities/SocketConnection"
import AsyncStorage from "@react-native-async-storage/async-storage"



const Stack = createNativeStackNavigator();

const ScreenNavigator = () => {

    useEffect(() => {

        const reconnectListener = async () => {
            console.log("socket reconnected...")
            const value = await AsyncStorage.getItem("user")
            if (value) {
                socket.emit("configure-user", JSON.parse(value))
            }
        }


        socket.io.on("reconnect", reconnectListener)

        return () => {
            socket.io.off("reconnect", reconnectListener)
        }
    }, [])

    const user = useUser()


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
        <Stack.Screen name="JoinModal" component={JoinModal} />
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