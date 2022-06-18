import React from "react"
import {
    View,
    StyleSheet
} from "react-native"
import { fillEmpty } from "../../Utilities/lib"

const ROUND_NUMBER = 5
export default RoundBar = ({ round, roundNumber = ROUND_NUMBER }) => {

    return (
        <View style={styles.roundBarContainer}>
            {fillEmpty(new Array(round).fill(true), roundNumber).map((round, index) => (
                <View key={index} style={[styles.bar, round ? [styles.barActive] : null, { width: `${(100 / roundNumber) - 0.3}%` }]} />
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
        width: "19.7 - 0.3%",
        backgroundColor: "lightgrey",
        height: 35
    },
    barActive: {
        backgroundColor: "#e06394"
    }
})