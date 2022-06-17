import React, { useState, useCallback, useEffect } from "react"
import {
    View,
    Text,
    StyleSheet
} from "react-native"
// Components
import MainLogo from "../../assets/logo.svg"
import Button from "../Components/Button"
import Avatar from "../Components/Avatar"
// Provider
import { useUser } from "../../Providers/UserProvider"
import { useSetRoom } from "../../Providers/RoomProvider"
// Utilities 
import { socket } from "../Utilities/SocketConnection"
import { moderateScale, scale } from "react-native-size-matters"


export default HomeScreen = ({ navigation }) => {
    const [createRoomLoading, setCreateRoomLoaidng] = useState(false)
    const user = useUser()
    const setRoomData = useSetRoom()

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            setCreateRoomLoaidng(false)
        });

        return unsubscribe
    }, [navigation])

    const createRomm = () => {
        if (createRoomLoading) return;
        setCreateRoomLoaidng(true)

        socket.emit("generate-room", room => {
            setRoomData(room)
            navigation.navigate("WaitingScreen")
        })
    }

    return (
        <View style={HomeScreenStyles.screenView}>
            <View style={HomeScreenStyles.logo}>
                <MainLogo
                    height={moderateScale(150, -0.5)}
                    width={moderateScale(150, -0.5)}
                />
            </View>
            <View style={HomeScreenStyles.body}>
                <View style={HomeScreenStyles.profile}>
                    <Avatar xml={user.avatarXML} width={moderateScale(135, -1.5)} height={moderateScale(135, -1.5)} />
                    <Text style={HomeScreenStyles.username}>{user.name}</Text>
                </View>
                <View style={HomeScreenStyles.actionSection}>
                    <Button title={"أنشاء غرفة جديدة"} onPress={createRomm} loading={createRoomLoading} />
                    <Button title={"الدخول إلى غرفة "} onPress={() => navigation.navigate("JoinScreen")} />
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