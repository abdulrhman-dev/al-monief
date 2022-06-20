import React, { useMemo, useState, useEffect, useRef } from "react"
import { ScrollView, View, Text, StyleSheet, FlatList } from "react-native"
// Componenets
import Button from "../Components/Button"
import SwipeableButton from "../Components/SwipeableButton"
import LoadingOverlay from "../Overlays/LoadingOverlay"
// Utilities
import { useGame, useStoreGame } from "../../Providers/GameProvider"
import { useRoom } from "../../Providers/RoomProvider"
import { combineChecking, lengthOfObjectArrays, pointUsers } from "../Utilities/lib"
import { socket } from "../Utilities/SocketConnection"

export default CheckingScreen = ({ navigation }) => {
    const [submitLoading, setSubmitLoading] = useState(false)
    const [loadingItems, setLoadingItems] = useState(true)
    const [isDisabled, setIsDisabled] = useState(true)
    const results = useRef({})
    const game = useGame()
    const setGame = useStoreGame()
    const room = useRoom()
    const [words, setWords] = useState({})

    useEffect(() => {
        const unsubscribe = navigation.addListener("beforeRemove", e => {
            if (e.data.action.type !== "GO_BACK") return;

            e.preventDefault();
        })

        return unsubscribe
    }, [navigation])


    useEffect(() => {
        setWords(combineChecking(game.userWords))
    }, [game.userWords])

    useEffect(() => {
        if (lengthOfObjectArrays(words) !== 0) {
            setTimeout(() => {
                setLoadingItems(false)
            }, 1450)
        }
    }, [words])

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

        if (lengthOfObjectArrays(results.current) !== lengthOfObjectArrays(words)) return setIsDisabled(true)
        if (setIsDisabled) setIsDisabled(false)
    }

    const handleDuplicate = (word, type) => {
        let value = [];
        if (results.current[type]) value = results.current[type]

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
                    count: 2,
                    status: "right"
                }
            ]
        })

        if (lengthOfObjectArrays(results.current) !== lengthOfObjectArrays(words)) return setIsDisabled(true)
        if (setIsDisabled) setIsDisabled(false)
    }

    const handleSubmitResults = () => {
        if (lengthOfObjectArrays(results.current) !== lengthOfObjectArrays(words)) return;
        if (submitLoading) return;

        setIsDisabled(true)
        setSubmitLoading(true)
        setWords([])

        socket.emit("submit-results", { userWords: game.userWords, results: results.current, roomId: room.id }, (results, err) => {
            if (err) navigation.replace("HomeScreen")

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
            {
                loadingItems && Object.keys(words).length !== 0

                &&

                <View style={styles.placeholderView}>
                    <LoadingOverlay backgroundColor="#f2f2f2" color="grey" />
                </View>
            }

            {
                Object.keys(words).length === 0

                    ?
                    <View style={styles.placeholderView}>
                        {isDisabled && <Text style={styles.loadingText}>ما زال هناك من هو في اللعبة</Text>}
                    </View>

                    :

                    (
                        <FlatList
                            keyExtractor={(_, index) => index}
                            data={Object.keys(words)}
                            renderItem={({ item: key }, index) => (
                                <View key={index}>
                                    <Text style={styles.sectionText}>{key}</Text>
                                    <FlatList
                                        keyExtractor={(_, index) => index}
                                        data={words[key]}
                                        renderItem={({ item: obj }) => (
                                            <SwipeableButton
                                                title={obj.word}
                                                type={key}
                                                onLeft={onLeft}
                                                onRight={onRight}
                                                handleDuplicate={handleDuplicate}
                                                reset={reset}
                                                key={index}
                                            />
                                        )}
                                    />
                                </View>
                            )}
                        />
                    )
            }


            {
                Object.keys(words).length !== 0

                &&

                <View style={styles.buttonContainer}>
                    <Button
                        title={"تسليم النتيجة"}
                        type={isDisabled ? "disabled" : "primary"}
                        loading={submitLoading}
                        onPress={handleSubmitResults}
                    />
                </View>
            }
        </View >
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
    },
    placeholderView: {
        height: "90%",
        width: "100%"
    }
})