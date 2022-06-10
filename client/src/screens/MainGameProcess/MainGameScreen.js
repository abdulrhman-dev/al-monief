import React, { useEffect } from "react"
import {
    View,
    StyleSheet
} from "react-native"
// Components 
import RoundBar from "./RoundBar"

export default MainGameScreen = ({ navigation }) => {


    useEffect(() => {
        const unsubscribe = navigation.addListener("beforeRemove", e => {
            // ? you'll only be able to leave in checkpoints only
            e.preventDefault();
        })

        return unsubscribe
    }, [navigation])

    return (
        <View style={MainGameScreenStyles.container}>
            <RoundBar round={1} />
        </View>
    )
}

const MainGameScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    }
})