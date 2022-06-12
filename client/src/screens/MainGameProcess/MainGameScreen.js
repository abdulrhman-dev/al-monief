import React, { useEffect, useState } from "react"
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
import { MaterialIcons } from '@expo/vector-icons';
// data
import items from "./stageBarItems"


const LETTER = "أ"
const MAX_STAGE_NUMBER = 5
const MAX_ROUND_NUMBER = 5

export default MainGameScreen = ({ navigation }) => {
    const [stage, setStage] = useState(1)
    const [words, setWords] = useState(LETTER)
    const [finished, setFinished] = useState([])

    useEffect(() => {
        const unsubscribe = navigation.addListener("beforeRemove", e => {
            // ? you'll only be able to leave in checkpoints only
            // e.preventDefault();
        })

        return unsubscribe
    }, [navigation])

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

    useEffect(() => {
        console.log(finished)
    }, [finished])


    const handleProgress = () => {
        const value = words[items[stage - 1].title]


        if (value === LETTER || !value) return;

        setStage(stage + 1)

    }

    const handleSubmit = () => {

    }

    return (
        <View style={MainGameScreenStyles.container}>
            <View style={MainGameScreenStyles.header}>
                <RoundBar round={1} />
                <StageBar stage={stage} setStage={setStage} finished={finished} />
            </View>

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
                                style={{ backgroundColor: "#4fdb74", width: "100%" }}
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