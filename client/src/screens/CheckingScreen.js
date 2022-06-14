import React, { useMemo, useState, useEffect } from "react"
import { ScrollView, View, Text, StyleSheet } from "react-native"
// Componenets
import Button from "../Components/Button"
// Utilities
import { useGame, useStoreGame } from "../../Providers/GameProvider"
import { useRoom } from "../../Providers/RoomProvider"
import { combineChecking, lengthOfObjectArrays } from "../Utilities/lib"
import { socket } from "../Utilities/SocketConnection"

export default CheckingScreen = ({ navigation }) => {
    const [results, setResults] = useState({})
    const [isDisabled, setIsDisabled] = useState(false)
    const game = useGame()
    const setGame = useStoreGame()
    const room = useRoom()
    const words = useMemo(() => {
        return combineChecking(game.userWords)
    }, [])

    useEffect(() => {
        const unsubscribe = navigation.addListener("beforeRemove", e => {
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

        setResults({
            ...results,
            [type]: [
                ...value,
                {
                    word,
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
                {Object.keys(words).map((key, index) => {
                    return (
                        <View key={index}>

                            <Text style={styles.sectionText}>{key}</Text>
                            {(words[key].map((word, index) => (
                                <SwipeableButton
                                    title={word}
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