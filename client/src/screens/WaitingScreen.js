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
import { moderateScale } from "react-native-size-matters"
import Share from "react-native-share";
// Context
import { useRoom, useSetRoom } from "../../Providers/RoomProvider"
import { useStoreGame } from "../../Providers/GameProvider"
import { useUser } from "../../Providers/UserProvider"
// Components
import QRCode from "react-native-qrcode-svg";
import Button from "../Components/Button"
import Avatar from "../Components/Avatar"
import { MaterialCommunityIcons } from '@expo/vector-icons'

import config from "../../config"

const { SHARE_URL } = config

let USER_LIMIT = 4;

export default WaitingScreen = ({ navigation }) => {
    const [isDisconnected, setDisconnected] = useState(false)
    const [startRoomLoading, setStartRoomLoading] = useState(false)
    const room = useRoom()
    const user = useUser()
    const setRoom = useSetRoom()
    const setGame = useStoreGame()

    // fill empty slots with null
    let users = fillEmpty(room.users, USER_LIMIT)

    useEffect(() => {
        let unsubscribe = navigation.addListener('beforeRemove', (e) => {
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

        })

        return unsubscribe
    }, [isDisconnected])


    const handleUserDisconnect = useCallback(() => {
        console.log("user disconnected")

        setRoom({ id: "disconnected", users: [], leader: {} })
        setDisconnected(true)
    }, [])

    const handleUserJoin = useCallback(newUser => {
        if (newUser.id === user.id) return;
        setRoom({
            ...room,
            users: [...room.users, newUser]
        })
    }, [room])

    const handleOnStartGame = useCallback(game => {
        setGame(game)
        navigation.replace("MainGameScreen")
    }, [])

    useEffect(() => {
        // sockets
        socket.on("user-joined", handleUserJoin)
        socket.on("emit-start-game", handleOnStartGame)
        socket.on("disconnect", handleUserDisconnect)

        return () => {
            socket.off("user-joined", handleUserJoin)
            socket.off("emit-start-game", handleOnStartGame)
            socket.off("disconnect", handleUserDisconnect)
        }
    }, [room])

    useEffect(() => {
        if (isDisconnected) {
            navigation.goBack()
        }
    }, [isDisconnected])

    const handleStartGame = () => {
        if (startRoomLoading) return;

        setStartRoomLoading(true)

        let game = {
            roundWords: [],
            isCountdown: null,
            roundsLetters: generateLetters(5),
            results: []
        }


        socket.emit("start-game", { roomId: room.id, game }, () => {
            setGame(game)
            navigation.replace("MainGameScreen")
        })
    }

    const handleShareRoom = async () => {
        let options = {
            message: `تم دعوتك من قبل ${user.name}` + `\n ${SHARE_URL}/room/${room.id}`
        }

        try {
            await Share.open(options)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <View style={WaitingScreenStyles.container}>
            <View style={WaitingScreenStyles.header}>
                <Text style={WaitingScreenStyles.titleText}>أدع أصدقائك للدخول!</Text>
            </View>
            <View style={WaitingScreenStyles.body}>
                <View style={WaitingScreenStyles.mainbodyContent}>
                    <View style={WaitingScreenStyles.roomIdBar}>
                        <Text style={WaitingScreenStyles.text}>{room.id} :كود الغرفة</Text>
                        <MaterialCommunityIcons name="share-circle" size={30} color="grey" style={{ margin: 5 }} onPress={handleShareRoom} />
                    </View>

                    <QRCode
                        value={room.id}
                        size={moderateScale(200, -0.85)}
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
                            // type={room.users.length >= 2 ? "primary" : "disabled"}
                            title={"أبدا اللعبة"}
                            loading={startRoomLoading}
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
                    <MaterialCommunityIcons name="crown" size={moderateScale(28, -1)} color="#FFD700" />
                </View>
            }

            <Avatar seed={user.avatarSeed} width={moderateScale(70, -0.9)} height={moderateScale(70, -0.9)} />
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
        width: moderateScale(70, -0.9),
        height: moderateScale(70, -0.9),
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
    },
    roomIdBar: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        height: 70
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