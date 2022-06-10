import React, { useEffect, useState, useCallback } from "react"
import {
    View,
    Text,
    StyleSheet,
    Alert
} from "react-native"
// Utilities
import { socket } from "../Utilities/SocketConnection"
import { fillEmpty } from "../Utilities/lib"

// Context
import { useRoom, useSetRoom } from "../../Providers/RoomProvider"
// Components
import QRCode from "react-native-qrcode-svg";
import Button from "../Components/Button"
import Avatar from "../Components/Avatar"

let USER_LIMIT = 4;

export default WaitingScreen = ({ navigation }) => {
    const [isDisconnected, setDisconnected] = useState(false)
    const room = useRoom()
    const setRoom = useSetRoom()


    // fill empty slots with null
    let users = fillEmpty(room.users, USER_LIMIT)

    useEffect(() => {
        let listener = (e) => {
            console.log(isDisconnected)
            e.preventDefault();
            if (isDisconnected) return navigation.dispatch(e.data.action)


            Alert.alert(
                "الخروج من الغرفة",
                "هل تريد أن تخرج من الغرفة وتترك وراءك الكثير؟",
                [
                    { text: "ابقى هنا", style: "cancel", onPress: () => { } },
                    {
                        text: "أخرج من الغرفة",
                        style: 'destructive',
                        onPress: () => {
                            socket.emit("leave-room", room.id)
                            navigation.dispatch(e.data.action)
                        },
                    },
                ]
            );

        }

        navigation.addListener('beforeRemove', listener)

        return () => navigation.removeListener('beforeRemove', listener)
    }, [isDisconnected])


    const handleUserDisconnect = useCallback(() => {
        console.log("user disconnected")

        setRoom({ id: "disconnected", users: [] })
        setDisconnected(true)
    }, [])

    const handleUserLeave = useCallback(user => {
        let filterdUsers = room.users.filter(roomUser => roomUser.id !== user.id)

        setRoom({
            ...room,
            users: filterdUsers
        })
    }, [room])

    const handleUserJoin = useCallback(user => {
        setRoom({
            ...room,
            users: [...room.users, user]
        })
    }, [room])

    useEffect(() => {
        // sockets
        socket.on("user-joined", handleUserJoin)
        socket.on("user-left", handleUserLeave)
        socket.on("disconnect", handleUserDisconnect)

        return () => {
            socket.off("user-joined", handleUserJoin)
            socket.off("user-left", handleUserLeave)
            socket.off("disconnect", handleUserDisconnect)
        }
    }, [])

    useEffect(() => {
        if (isDisconnected) {
            console.log("Triggerd", isDisconnected)
            navigation.goBack()
        }
    }, [isDisconnected])

    return (
        <View style={WaitingScreenStyles.container}>
            <View style={WaitingScreenStyles.header}>
                <Text style={WaitingScreenStyles.titleText}>أدع أصدقائك للدوخل!</Text>
            </View>
            <View style={WaitingScreenStyles.body}>
                <View style={WaitingScreenStyles.mainbodyContent}>
                    <Text style={WaitingScreenStyles.text}>{room.id} :كود الغرفة</Text>

                    <QRCode
                        value={room.id}
                        size={200}
                    />
                </View>

                <View style={WaitingScreenStyles.avatarsBar}>
                    {users.map((user, index) => {
                        if (user === null) return <UnAvailableUser key={index} />

                        return <AvailableUser key={index} user={user} />
                    })}
                </View>

                <View style={WaitingScreenStyles.button}>
                    <Button
                        title={"أبدا اللعبة"}
                        type="disabled"
                    />
                </View>
            </View>
        </View>
    )
}


function AvailableUser({ user }) {
    return (
        <View style={AvatarBarStyles.availableUser}>
            <Avatar xml={user.avatarXML} width="70" height="70" />
            <View style={AvatarBarStyles.textContainer}>
                <Text
                    numberOfLines={1}
                    style={AvatarBarStyles.text}
                >
                    {user.name.split(" ")[0]}
                </Text>
            </View>
        </View>
    )
}

function UnAvailableUser() {
    return (
        <View style={AvatarBarStyles.unavailableUser} />
    )
}

const AvatarBarStyles = StyleSheet.create({
    availableUser: {
        position: "relative"
    },
    unavailableUser: {
        position: "relative",
        width: 70,
        height: 70,
        backgroundColor: "#f0f0f0",
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center"
    },
    textContainer: {
        position: "absolute",
        top: 75,
        width: "100%",
        height: 25,
        justifyContent: "center",
        alignItems: "center"
    },
    text: {
        fontFamily: "NotoKufiArabic-Medium",
        fontSize: 11.5
    }
})



const WaitingScreenStyles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    titleText: {
        fontFamily: "NotoKufiArabic-ExtraBold",
        color: "black",
        fontSize: 25
    },
    text: {
        fontFamily: "NotoKufiArabic-Bold",
        color: "black",
        fontSize: 20,
        margin: 20
    },
    header: {
        width: "100%",
        flex: 1.5,
        justifyContent: "center",
        alignItems: "center"
    },
    body: {
        width: "100%",
        flex: 4.5,
        justifyContent: "center",
        alignItems: "center"
    },
    mainbodyContent: {
        flex: 3.5,
        justifyContent: "center",
        alignItems: "center"
    },
    avatarsBar: {
        width: "90%",
        flex: 1.5,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center"
    },
    button: {
        flex: 1,
        justifyContent: "flex-end",
        marginBottom: 30
    }
})