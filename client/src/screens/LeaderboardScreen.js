import React, { useCallback, useEffect, useState } from "react"
import { View, Text, StyleSheet, Alert, ScrollView } from "react-native"
// Components
import Avatar from "../Components/Avatar"
import Button from "../Components/Button"
// Utilities
import { socket } from "../Utilities/SocketConnection"
import { useStoreGame, useGame } from "../../Providers/GameProvider"
import { useUser } from "../../Providers/UserProvider"
import { useRoom, useSetRoom } from "../../Providers/RoomProvider"


export default LeaderboardScreen = ({ navigation }) => {
    const [leaveRoomLoading, setLeaveRoomLoading] = useState(false)
    const [playAgainLoading, setPlayAgainLoading] = useState(false)
    const game = useGame()
    const user = useUser()
    const room = useRoom()
    const setRoom = useSetRoom()
    const setGame = useStoreGame()

    useEffect(() => {
        let unsubscribe = navigation.addListener('beforeRemove', (e) => {
            if (e.data.action.type !== "GO_BACK") return;

            e.preventDefault();

            if (game.results.length === 0) return;

            Alert.alert(
                "الخروج من الغرفة",
                "هل تريد أن تخرج من الغرفة؟",
                [
                    { text: "ابقى هنا", style: "cancel", onPress: () => { } },
                    {
                        text: "أخرج من الغرفة",
                        style: 'destructive',
                        onPress: () => {
                            setRoom({ id: "disconnected", users: [], leader: {} })
                            socket.emit("leave-room", room.id)
                            navigation.replace("HomeScreen")
                        },
                    },
                ]
            );

        })

        return unsubscribe
    }, [])

    useEffect(() => {
        socket.on("join-play-again", handleJoinPlayAgain)

        return () => {
            socket.off("join-play-again", handleJoinPlayAgain)
        }
    }, [socket])

    const handleJoinPlayAgain = useCallback(room => {
        setRoom(room)
        navigation.replace("WaitingScreen")
    }, [room])

    const handleReciveResults = useCallback(results => {
        setGame({
            ...game,
            results
        })
    }, [game])


    useEffect(() => {
        socket.on("show-results", handleReciveResults)

        return () => {
            socket.off("show-results", handleReciveResults)
        }
    }, [socket, game])

    const handleLeaveRoom = () => {
        if (leaveRoomLoading) return;

        setLeaveRoomLoading(true)
        socket.emit("leave-room", room.id, () => {
            navigation.replace("HomeScreen")
        })
    }

    const handlePlayAgain = () => {
        if (playAgainLoading) return;

        setPlayAgainLoading(true)
        socket.emit("play-again", room.id, (room) => {
            setRoom(room)
            navigation.replace("WaitingScreen")
        })
    }

    return (
        <View style={styles.container}>
            <Text style={styles.screenText}>النتيجة</Text>
            {
                game.results.length === 0
                &&
                <Text style={styles.loadingText}>يتم تصحيح النتيجة من قبل رئيس الغرفة</Text>
            }
            <ScrollView contentContainerStyle={styles.scrollViewContainer} style={styles.scrollView}>
                {game.results.map((card, index) => (
                    <View key={index} style={styles.card}>
                        <View style={{ borderColor: "#e06394", borderRadius: 50, borderWidth: card.user.id === user.id ? 3 : 0 }}>
                            <Avatar
                                xml={card.user.avatarXML}
                                width="60"
                                height="60"
                            />
                        </View>

                        <Text style={styles.text}>{card.user.name}</Text>
                        <Text style={styles.points}>{card.points}</Text>
                    </View>
                ))}
            </ScrollView>

            <View style={styles.buttonGroup}>
                {
                    user.id === room.leader.id

                    &&

                    <Button
                        onPress={handlePlayAgain}
                        title={"العب مرة اخرى"}
                        type={"success"}
                        loading={playAgainLoading}
                    />
                }
                {
                    game.results.length !== 0

                    &&

                    <Button
                        title={"اخرج من الخرفة"}
                        onPress={handleLeaveRoom}
                        type={"warning"}
                        loading={leaveRoomLoading}
                    />

                }


            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        backgroundColor: "#f7f7f7",
        flex: 1
    },
    screenText: {
        fontFamily: "NotoKufiArabic-ExtraBold",
        fontSize: 30,
        textAlign: "center",
        padding: 25,
    },
    loadingText: {
        fontFamily: "NotoKufiArabic-Bold",
        fontSize: 15,
        color: "#8A8A8A",
        textAlign: "center"
    },
    scrollView: {
        width: "85%",
        height: "50%"
    },
    scrollViewContainer: {
        flex: 3.5,
        flexDirection: "column",
        alignItems: "center",
    },
    card: {
        backgroundColor: "white",
        flexDirection: "row",
        width: "95%",
        marginHorizontal: "auto",
        height: 80,
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        borderRadius: 5,
        elevation: 3,
        margin: 10
    },
    text: {
        fontFamily: "NotoKufiArabic-Medium",
        fontSize: 15
    },
    points: {
        fontFamily: "NotoKufiArabic-ExtraBold",
        color: "#e06394"
    },
    buttonGroup: {
        width: "85%",
        padding: 25,
        justifyContent: "flex-end",
        alignItems: "center",
        flex: 1.5,
    }
})