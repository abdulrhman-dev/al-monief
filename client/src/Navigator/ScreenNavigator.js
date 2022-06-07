import React from "react"
// import { View, Text } from "react-native"
// React Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// Screen s
import HomeScreen from "../screens/HomeScreen";
import CreateUserScreen from "../screens/CreateUserScreen";
import WaitingScreen from "../screens/WaitingScreen";
// Context Provider
import { useUser } from "../../UserProvider"


const Stack = createNativeStackNavigator();

const ScreenNavigator = () => {
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
        initialRouteName="Home"
        screenOptions={{
            headerShown: false
        }}
    >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="WaitingScreen" component={WaitingScreen} />
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