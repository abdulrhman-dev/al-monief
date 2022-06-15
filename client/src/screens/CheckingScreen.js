import React, { useMemo, useState, useEffect } from "react"
import { ScrollView, View, Text, StyleSheet } from "react-native"
// Componenets
import Button from "../Components/Button"
// Utilities
import { useGame, useStoreGame } from "../../Providers/GameProvider"
import { useRoom } from "../../Providers/RoomProvider"
import { combineChecking, lengthOfObjectArrays, registerCount } from "../Utilities/lib"
import { socket } from "../Utilities/SocketConnection"

export default CheckingScreen = ({ navigation }) => {
    const [results, setResults] = useState({})
    const [isDisabled, setIsDisabled] = useState(false)
    const game = useGame()
    const setGame = useStoreGame()
    const room = useRoom()
    const words = useMemo(() => {
        return combineChecking(game.userWords, true)
    }, [game.userWords])

    useEffect(() => {
        const unsubscribe = navigation.addListener("beforeRemove", e => {
            if (e.data.action.type !== "GO_BACK") return;

            e.preventDefault();
        })

        return unsubscribe
    }, [navigation])

    useEffect(() => {
        setIsDisabled(lengthOfObjectArrays(results) === lengthOfObjectArrays(words))
    }, [words, results])

    const onLeft = (word, type) => {
        let value = [];
        if (results[type]) value = results[type]

        setResults({
            ...results,
            [type]: [
                ...value,
                {
                    word,
                    status: "wrong"
                }
            ]

        })
    }

    const onRight = (word, type) => {
        let value = [];
        if (results[type]) value = results[type]

        const match = words[type].find(item => item.word === word)

        setResults({
            ...results,
            [type]: [
                ...value,
                {
                    word,
                    count: match.count,
                    status: "right"
                }
            ]
        })
    }

    const reset = (word, type) => {
        if (!results[type]) return;
        setResults({
            ...results,
            [type]: results[type].filter(result => result.word !== word)
        })
    }

    const handleSubmitResults = () => {
        if (lengthOfObjectArrays(results) === lengthOfObjectArrays(words)) {
            socket.emit("submit-results", { results, roomId: room.id }, results => {
                setGame({
                    ...game,
                    results
                })
                navigation.replace("LeaderboardScreen")
            })
        }
    }

    return (
        <View style={styles.checkingScreenContainer}>
            <Text style={styles.screenText}>تصحيح النتيجة</Text>

            <ScrollView>

                {
                    Object.keys(words).length === 0

                    &&

                    <Text style={styles.loadingText}>ما زال هناك من هو في اللعبة</Text>
                }

                {Object.keys(words).map((key, index) => {
                    return (
                        <View key={index}>

                            <Text style={styles.sectionText}>{key}</Text>
                            {(words[key].map((obj, index) => (
                                <SwipeableButton
                                    title={obj.word}
                                    type={key}
                                    onLeft={onLeft}
                                    onRight={onRight}
                                    reset={reset}
                                    key={index}
                                />
                            )))}
                        </View>
                    )
                })}
            </ScrollView>
            <View style={styles.buttonContainer}>
                <Button
                    type={
                        !isDisabled
                            ? "disabled"
                            : "primary"
                    }
                    title={"تسليم النتيجة"}
                    onPress={handleSubmitResults}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    checkingScreenContainer: {
        flex: 1,
    },
    screenText: {
        fontFamily: "NotoKufiArabic-ExtraBold",
        fontSize: 30,
        textAlign: "center",
        padding: 25
    },
    loadingText: {
        fontFamily: "NotoKufiArabic-Bold",
        fontSize: 15,
        color: "#8A8A8A",
        textAlign: "center"
    },
    sectionText: {
        fontFamily: "NotoKufiArabic-Bold",
        backgroundColor: "#262626",
        color: "white",
        padding: 7
    },
    buttonContainer: {
        justifyContent: "center",
        alignItems: "center",
        height: "20%"
    }
})