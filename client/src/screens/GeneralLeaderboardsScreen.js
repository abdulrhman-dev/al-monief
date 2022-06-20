import React, { useState } from "react"
import {
    View,
    FlatList,
    Text,
    StyleSheet,
    Dimensions
} from "react-native"
// Components
import Avatar from "../Components/Avatar"
import { MaterialCommunityIcons } from '@expo/vector-icons';
// Utilities
import { useLeaderboards, useSetLeaderboards } from "../../Providers/LeaderboardsProvider"
import { useUser } from "../../Providers/UserProvider"
import { getFirstPlaceNumber } from "../Utilities/lib";
import { socket } from "../Utilities/SocketConnection";

const { width } = Dimensions.get("window")

export default GeneratlLeaderboardsSCreen = () => {
    const [leaderboardsLoading, setLeaderboardsLoading] = useState(false)
    const leaderboards = useLeaderboards()
    const setLeaderboards = useSetLeaderboards()
    const user = useUser()

    const getLeaderboards = () => {
        if (leaderboardsLoading) return;
        setLeaderboardsLoading(true)

        socket.emit("get-leaderboards", leaderboards => {
            setLeaderboardsLoading(false)
            setLeaderboards(leaderboards)
        })
    }

    return (
        <View style={styles.container}>
            <Text style={styles.screenText}>قائمة المتصدرين</Text>
            <FlatList
                refreshing={leaderboardsLoading}
                onRefresh={getLeaderboards}

                contentContainerStyle={styles.flatListContainer}
                style={[styles.flatList]}
                keyExtractor={(item) => item.generalId}
                data={leaderboards}
                renderItem={({ item: cardUser }, index) => (
                    <View key={index} style={styles.card} >
                        <View style={styles.cardBody}>
                            <View style={{ borderColor: "#e06394", borderRadius: 50, borderWidth: cardUser.generalId === user.generalId ? 3 : 0 }}>
                                <Avatar
                                    seed={cardUser.avatarSeed}
                                    width="60"
                                    height="60"
                                />
                            </View>

                            <Text style={styles.text}>{cardUser.name}</Text>
                            <Text style={styles.points}>{cardUser.points}</Text>
                        </View>
                        <View style={styles.cardFooter}>
                            <Text style={styles.text}><Text style={styles.importantText}>عدد مرات اللعب: </Text>{cardUser.numberOfGames} </Text>
                            <View style={styles.winnerView}>
                                <MaterialCommunityIcons name="medal" size={24} color="black" />
                                <Text style={styles.winnerText}>{getFirstPlaceNumber(cardUser.gamePlaces)}</Text>
                            </View>
                        </View>

                    </View>
                )}
            />
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
    flatList: {
        width: "100%",
        height: "90%",
        flex: 1
    },
    flatListContainer: {
        flexDirection: "column",
        alignItems: "center"
    },
    card: {
        backgroundColor: "white",
        marginHorizontal: "auto",
        height: 160,
        borderRadius: 5,
        elevation: 3,
        margin: 10,
        width: width - 40
    },
    cardBody: {
        width: "100%",
        height: "65%",
        padding: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    cardFooter: {
        width: "100%",
        height: "35%",
        flexDirection: "row-reverse",
        justifyContent: "space-between",
        padding: 15,
    },
    importantText: {
        fontFamily: "NotoKufiArabic-Bold",
    },
    text: {
        fontFamily: "NotoKufiArabic-Medium",
        fontSize: 15
    },
    winnerView: {
        width: "20%",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        height: "100%",
    },
    winnerText: {
        color: "#4fdb74",
        fontFamily: "NotoKufiArabic-ExtraBold",
        marginLeft: 5
    },
    points: {
        fontFamily: "NotoKufiArabic-ExtraBold",
        color: "#e06394"
    }
})