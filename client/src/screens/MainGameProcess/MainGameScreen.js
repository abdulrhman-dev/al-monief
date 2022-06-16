import React, { useCallback, useEffect, useState } from "react"
import {
    View,
    Text,
    StyleSheet
} from "react-native"
// Components 
import RoundBar from "./RoundBar"
import StageBar from "./StageBar"
import Input from "../../Components/Input"
import Button from "../../Components/Button"
import Countdown from "./Countdown"
import { MaterialIcons } from '@expo/vector-icons';
// data
import items from "./stageBarItems"
// Utilities
import { useGame, useStoreGame } from "../../../Providers/GameProvider"
import { useRoom } from "../../../Providers/RoomProvider"
import { useUser } from "../../../Providers/UserProvider"
import { socket } from "../../Utilities/SocketConnection"


const MAX_STAGE_NUMBER = 5
const MAX_ROUND_NUMBER = 5

export default MainGameScreen = ({ navigation }) => {
    const game = useGame()
    const user = useUser()
    const room = useRoom()

    const setGame = useStoreGame()

    const [stage, setStage] = useState(1)

    const [words, setWords] = useState({})
    const [finished, setFinished] = useState([])
    const [round, setRound] = useState(1)
    const LETTER = game.roundsLetters[round - 1]

    const handleOnGameEnd = useCallback(() => {
        setGame({
            roundWords: [],
            isCountdown: null,
            roundsLetters: []
        })
        navigation.replace("HomeScreen")
    }, [])

    const handleStartCountdown = useCallback(() => {
        setGame({
            ...game,
            isCountdown: true
        })
    }, [game])

    useEffect(() => {

    }, [words])

    useEffect(() => {
        socket.on("game-ended", handleOnGameEnd)
        socket.on("start-countdown", handleStartCountdown)


        return () => {
            socket.off("game-ended", handleOnGameEnd)
            socket.off("start-countdown", handleStartCountdown)
        }
    }, [socket, game])

    useEffect(() => {
        const unsubscribe = navigation.addListener("beforeRemove", e => {
            if (e.data.action.type !== "GO_BACK") return;

            e.preventDefault();

            if (stage - 1 > 0) setStage(stage - 1)
        })

        return unsubscribe
    }, [navigation, stage])

    const handleWordChange = (e, name) => {
        let value = e.nativeEvent.text
        if (!value.startsWith(LETTER)) value = LETTER

        setWords({
            ...words,
            [name]: value
        })

        if (value !== LETTER && value) {
            let match = finished.find(finishedItem => finishedItem === name)

            if (match) return

            setFinished([...finished, name])
        } else {
            setFinished(finished.filter(finishedName => finishedName !== name))
        }

    }

    const handleProgress = () => {
        const value = words[items[stage - 1].title]


        if (value === LETTER || !value) return;

        if (stage + 1 > MAX_STAGE_NUMBER) {
            if (finished.length !== MAX_STAGE_NUMBER) return;

            return handleSubmit()
        }

        setStage(stage + 1)
    }

    const handleSubmit = () => {
        if (round + 1 > MAX_ROUND_NUMBER) {
            submitWords()
            return;
        }

        setGame({
            ...game,
            roundWords: [...game.roundWords, words]
        })
        setWords({})
        setStage(1)
        setFinished([])
        setRound(round + 1)
    }

    const handleCountDownFinish = () => {
        submitWords()
    }

    const submitWords = () => {
        let wordsArray = [words];

        if (game.roundWords.length > 0) {
            wordsArray = [...game.roundWords, words]
        }

        socket.emit("submit-game", { roomId: room.id, roundWords: wordsArray }, () => {
            if (user.id === room.leader.id) {
                return navigation.replace("CheckingScreen")
            }

            return navigation.replace("LeaderboardScreen")
        })
    }

    return (
        <View style={MainGameScreenStyles.container}>
            <View style={MainGameScreenStyles.header}>
                <RoundBar round={round} />
                <StageBar stage={stage} setStage={setStage} finished={finished} />
            </View>
            {game.isCountdown && <Countdown finish={handleCountDownFinish} startingCountdown={15} />}
            <View style={MainGameScreenStyles.mainBody}>
                <View style={MainGameScreenStyles.mainBodyHeader}>
                    <Text style={MainGameScreenStyles.mainText}>{`أكتب ${items[stage - 1].title} بحرف ال(${LETTER})`}</Text>

                    <Input
                        onSubmitEditing={handleProgress}
                        placeholder={"أكتب الكلمة"}
                        value={words[items[stage - 1].title]}
                        defaultValue={LETTER}
                        onChange={e => handleWordChange(e, items[stage - 1].title)}
                        autoFocus={true}
                        blurOnSubmit={false}
                    />
                </View>

                <View style={MainGameScreenStyles.controlGroup} >
                    {
                        stage === MAX_STAGE_NUMBER && finished.length === MAX_STAGE_NUMBER
                            ?
                            <Button
                                onPress={handleSubmit}
                                type={stage === 1 ? "disabled" : "secondary"}
                                style={{ backgroundColor: "#4fdb74", width: "90%" }}
                            >
                                <MaterialIcons name="check" size={28} color="white" />
                            </Button>
                            :
                            (
                                <>
                                    <Button
                                        onPress={() => setStage(stage - 1)}
                                        type={stage === 1 ? "disabled" : "secondary"}
                                        style={{ backgroundColor: "#adacaa", width: "40%" }}
                                    >
                                        <MaterialIcons
                                            name="keyboard-arrow-left"
                                            size={28}
                                            color="white"
                                        />
                                    </Button>
                                    <Button
                                        type={stage === MAX_STAGE_NUMBER ? "disabled" : "primary"}
                                        style={{ width: "40%" }}
                                        onPress={() => setStage(stage + 1)}
                                    >
                                        <MaterialIcons
                                            name="keyboard-arrow-right"
                                            size={28}
                                            color="white"
                                        />
                                    </Button>
                                </>
                            )
                    }
                </View>
            </View>

        </View>
    )
}



const MainGameScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    header: {
        flex: 1,
    },
    mainBody: {
        flex: 5,
        height: "100%"
    },
    mainBodyHeader: {
        width: "100%",
        flex: 4,
        justifyContent: "center",
        alignItems: "center"
    },
    controlGroup: {
        width: "100%",
        flex: 0.5,
        padding: 20,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center"
    },
    mainText: {
        fontFamily: "NotoKufiArabic-ExtraBold",
        fontSize: 25,
        marginBottom: 65
    }
})