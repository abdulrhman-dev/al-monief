import React, { useEffect } from "react"
import {
    View,
    Text,
    StyleSheet
} from "react-native"
// Components
import MainLogo from "../../assets/logo.svg"
import Button from "../Components/PrimaryButton"
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
        <View style={HomeScreenStyles.screenView}>
            <View style={HomeScreenStyles.logo}>
                <MainLogo
                    height={150}
                    width={150}
                />
            </View>

            <View style={HomeScreenStyles.body}>
                <View style={HomeScreenStyles.profile}>
                    <Avatar xml={user.avatarXML} width="120" height="120" />
                    <Text style={HomeScreenStyles.username}>{user.name}</Text>
                </View>
                <View style={HomeScreenStyles.actionSection}>
                    <Button title={"أنشاء غرفة جديدة"} />
                    <Button title={"الدخول إلى غرفة "} />
                </View>
            </View>
        </View>
    )
}

const HomeScreenStyles = StyleSheet.create({
    screenView: {
        flex: 1,
        direction: "rtl",
        justifyContent: "center",
        alignItems: "center"
    },
    logo: {
        flex: 2,
        justifyContent: "center",
        alignItems: "center",
    },
    body: {
        flex: 3.5,
        width: "100%",
    },
    profile: {
        width: "100%",
        flex: 2,
        justifyContent: "center",
        alignItems: "center"
    },
    username: {
        fontFamily: "NotoKufiArabic-Bold",
        marginTop: 10,
        fontSize: 20
    },
    actionSection: {
        flex: 4,
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: 25
    }
})