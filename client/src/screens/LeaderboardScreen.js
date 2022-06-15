import React, { useCallback, useEffect } from "react"
import { View, Text, StyleSheet, Alert } from "react-native"
// Components
import Avatar from "../Components/Avatar"
// Utilities
import { socket } from "../Utilities/SocketConnection"
import { useStoreGame, useGame } from "../../Providers/GameProvider"
import { useUser } from "../../Providers/UserProvider"
import { useRoom, useSetRoom } from "../../Providers/RoomProvider"


export default LeaderboardScreen = ({ navigation }) => {
    const game = useGame()
    const user = useUser()
    const room = useRoom()
    const setRoom = useSetRoom()
    const setGame = useStoreGame()

    useEffect(() => {
        let unsubscribe = navigation.addListener('beforeRemove', (e) => {
            if (e.data.action.type !== "GO_BACK") return;

            e.preventDefault();

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

    return (
        <View style={styles.container}>
            <Text style={styles.screenText}>النتيجة</Text>
            {
                game.results.length === 0
                &&
                <Text style={styles.loadingText}>يتم تصحيح النتيجة من قبل رئيس الغرفة</Text>
            }
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
    card: {
        backgroundColor: "white",
        flexDirection: "row",
        width: "85%",
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
    }
})