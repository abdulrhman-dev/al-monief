import React, { useMemo, useState, useEffect, useRef } from "react"
import { ScrollView, View, Text, StyleSheet } from "react-native"
// Componenets
import Button from "../Components/Button"
import SwipeableButton from "../Components/SwipeableButton"
// Utilities
import { useGame, useStoreGame } from "../../Providers/GameProvider"
import { useRoom } from "../../Providers/RoomProvider"
import { combineChecking, lengthOfObjectArrays } from "../Utilities/lib"
import { socket } from "../Utilities/SocketConnection"

export default CheckingScreen = ({ navigation }) => {
    const [submitLoading, setSubmitLoading] = useState(false)
    const [isDisabled, setIsDisabled] = useState(true)
    const results = useRef({})
    const game = useGame()
    const setGame = useStoreGame()
    const room = useRoom()
    const words = useMemo(() => combineChecking(game.userWords), [game.userWords])

    useEffect(() => {
        const unsubscribe = navigation.addListener("beforeRemove", e => {
            if (e.data.action.type !== "GO_BACK") return;

            e.preventDefault();
        })

        return unsubscribe
    }, [navigation])

    const onLeft = (word, type) => {
        if (results.current[type]) {
            const exist = results.current[type].find(item => item.word === word)

            if (exist) return;
        }

        let value = [];
        if (results.current[type]) value = results.current[type]

        results.current = ({
            ...results.current,
            [type]: [
                ...value,
                {
                    word,
                    status: "wrong"
                }
            ]

        })

        if (lengthOfObjectArrays(results.current) !== lengthOfObjectArrays(words)) return setIsDisabled(true)
        if (setIsDisabled) setIsDisabled(false)
    }

    const onRight = (word, type) => {
        let value = [];
        if (results.current[type]) value = results.current[type]

        const match = words[type].find(item => item.word === word)

        if (results.current[type]) {
            const exist = results.current[type].find(item => item.word === word)

            if (exist) return;
        }


        results.current = ({
            ...results.current,
            [type]: [
                ...value,
                {
                    word,
                    count: match.count,
                    status: "right"
                }
            ]
        })

        if (lengthOfObjectArrays(results.current) !== lengthOfObjectArrays(words)) return setIsDisabled(true)
        if (setIsDisabled) setIsDisabled(false)
    }

    const reset = (word, type) => {

        if (!results.current[type]) return;


        results.current = ({
            ...results.current,
            [type]: results.current[type].filter(result => result.word !== word)
        })
    }

    const handleSubmitResults = () => {
        if (lengthOfObjectArrays(results.current) !== lengthOfObjectArrays(words)) return;
        if (submitLoading) return;

        setSubmitLoading(true)

        socket.emit("submit-results", { results: results.current, roomId: room.id }, results => {
            setGame({
                ...game,
                results
            })
            navigation.replace("LeaderboardScreen")
        })
    }

    return (
        <View style={styles.checkingScreenContainer}>
            <Text style={styles.screenText}>تصحيح النتيجة</Text>

            <ScrollView style={styles.scrollView}>

                {
                    Object.keys(words).length === 0

                        ?

                        <Text style={styles.loadingText}>ما زال هناك من هو في اللعبة</Text>
                        :
                        Object.keys(words).map((key, index) => (
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
                        ))
                }


            </ScrollView>
            <View style={styles.buttonContainer}>
                <Button
                    title={"تسليم النتيجة"}
                    type={isDisabled ? "disabled" : "primary"}
                    loading={submitLoading}
                    onPress={handleSubmitResults}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    checkingScreenContainer: {
        flex: 1
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
        backgroundColor: "lightgrey",
        color: "white",
        padding: 7
    },
    buttonContainer: {
        justifyContent: "center",
        alignItems: "center",
        height: "15%"
    }
})