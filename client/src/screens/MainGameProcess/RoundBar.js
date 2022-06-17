import React from "react"
import {
    View,
    StyleSheet
} from "react-native"
import { fillEmpty } from "../../Utilities/lib"

const ROUNDS_NUMBER = 5
export default RoundBar = ({ round }) => {

    return (
        <View style={styles.roundBarContainer}>
            {fillEmpty(new Array(round).fill(true), ROUNDS_NUMBER).map((round, index) => (
                <View key={index} style={[styles.bar, round ? styles.barActive : null]} />
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    roundBarContainer: {
        height: 11.25,
        overflow: "hidden",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    bar: {
        width: "19.7%",
        backgroundColor: "lightgrey",
        height: 35
    },
    barActive: {
        backgroundColor: "#e06394"
    }
})