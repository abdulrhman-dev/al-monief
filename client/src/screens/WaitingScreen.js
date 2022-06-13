import React, { useEffect, useState, useCallback } from "react"
import {
    View,
    Text,
    StyleSheet,
    Alert
} from "react-native"
// Utilities
import { socket } from "../Utilities/SocketConnection"
import { fillEmpty, generateLetters } from "../Utilities/lib"
// Context
import { useRoom, useSetRoom } from "../../Providers/RoomProvider"
import { useStoreGame, useGame } from "../../Providers/GameProvider"
import { useUser } from "../../Providers/UserProvider"
// Components
import QRCode from "react-native-qrcode-svg";
import Button from "../Components/Button"
import Avatar from "../Components/Avatar"
import { MaterialCommunityIcons } from '@expo/vector-icons'

let USER_LIMIT = 4;

export default WaitingScreen = ({ navigation }) => {
    const [isDisconnected, setDisconnected] = useState(false)
    const room = useRoom()
    const user = useUser()
    const setRoom = useSetRoom()
    const setGame = useStoreGame()

    // fill empty slots with null
    let users = fillEmpty(room.users, USER_LIMIT)

    useEffect(() => {
        let listener = (e) => {
            if (e.data.action.type !== "GO_BACK") return;

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
                            setRoom({ id: "disconnected", users: [], leader: {} })
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

        setRoom({ id: "disconnected", users: [], leader: {} })
        setDisconnected(true)
    }, [])

    const handleUserLeave = useCallback(({ roomData }) => {
        setRoom(roomData)
    }, [room])

    const handleUserJoin = useCallback(user => {
        console.log(room.users.map(user => user.name))
        setRoom({
            ...room,
            users: [...room.users, user]
        })
    }, [room])

    const handleOnStartGame = useCallback(game => {
        setGame(game)
        navigation.replace("MainGameScreen")
    }, [])

    useEffect(() => {
        // sockets
        socket.on("user-joined", handleUserJoin)
        socket.on("user-left", handleUserLeave)
        socket.on("emit-start-game", handleOnStartGame)
        socket.on("disconnect", handleUserDisconnect)

        return () => {
            socket.off("user-joined", handleUserJoin)
            socket.off("user-left", handleUserLeave)
            socket.off("emit-start-game", handleOnStartGame)
            socket.off("disconnect", handleUserDisconnect)
        }
    }, [room])

    useEffect(() => {
        if (isDisconnected) {
            console.log("Triggerd", isDisconnected)
            navigation.goBack()
        }
    }, [isDisconnected])

    const handleStartGame = () => {
        let game = {
            roundWords: [],
            isCountdown: null,
            roundsLetters: generateLetters(5)
        }

        setGame(game)

        socket.emit("start-game", { roomId: room.id, game }, () => {
            navigation.replace("MainGameScreen")
        })
    }

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
                    {users.map((roomUser, index) => {
                        if (roomUser === null) return <UnAvailableUser key={index} />

                        return <AvailableUser key={index} user={roomUser} leader={room.leader} border={roomUser.id === user.id} />
                    })}
                </View>

                {
                    room.leader.id === user.id

                    &&

                    <View style={WaitingScreenStyles.button}>
                        <Button
                            type={room.users.length >= 2 ? "primary" : "disabled"}
                            title={"أبدا اللعبة"}
                            onPress={handleStartGame}
                        />
                    </View>
                }


            </View>
        </View>
    )
}


function AvailableUser({ user, leader, border }) {
    return (
        <View style={[AvatarBarStyles.availableUser, border ? AvatarBarStyles.border : null]}>
            {
                leader.id === user.id

                &&

                <View style={AvatarBarStyles.leaderIcon} >
                    <MaterialCommunityIcons name="crown" size={28} color="#FFD700" />
                </View>
            }

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
        position: "relative",
        borderRadius: 50
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
    leaderIcon: {
        position: "absolute",
        zIndex: 2,
        width: "100%",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        top: -30
    },
    text: {
        fontFamily: "NotoKufiArabic-Medium",
        fontSize: 11.5
    },
    border: {
        borderColor: "#e06394",
        borderWidth: 3,
        borderRadius: 50
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
        alignItems: "center",
        margin: 15
    },
    button: {
        flex: 1,
        justifyContent: "flex-end",
        marginBottom: 30
    }
})