import React, { useEffect } from "react"
import {
    View,
    Text,
    StyleSheet
} from "react-native"

import MainLogo from "../../assets/logo.svg"
// Provider
import { useUser } from "../../UserProvider"
import Avatar from "../Components/Avatar"
// Socket 
import { socket } from "../Utilities/SocketConnection"


export default HomeScreen = () => {
    const user = useUser()

    useEffect(() => {
        if (user.name) {
            socket.emit("configure-user", user)
        }
    }, [])

    return (
        <View style={HomeScreenStyle.screenView}>
            <MainLogo
                height={150}
                width={150}
            />
            <Avatar xml={user.avatarXML} width="100" height="100" />
            <Text>{user.name}</Text>
            <Text>{user.userId}</Text>
        </View>
    )
}

const HomeScreenStyle = StyleSheet.create({
    screenView: {
        flex: 1,
        direction: "rtl",
        justifyContent: "center",
        alignItems: "center"
    },
    screenText: {
        fontFamily: "NotoKufiArabic-Medium",
        color: "white",
        fontSize: 30
    }
})