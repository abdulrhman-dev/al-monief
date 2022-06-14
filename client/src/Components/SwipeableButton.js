import React from "react"
import {
    View,
    Text,
    StyleSheet
} from "react-native"
import { Swipeable } from "react-native-gesture-handler"

export default SwipeableButton = ({ title, type, reset, onLeft, onRight }) => {

    return (
        <Swipeable
            renderRightActions={() => rightActions(title)}
            renderLeftActions={() => leftActions(title)}
            onSwipeableClose={() => reset(title, type)}
            onSwipeableRightOpen={() => onRight(title, type)}
            onSwipeableLeftOpen={() => onLeft(title, type)}
        >
            <View style={styles.container}>
                <Text style={styles.titleText}>{title}</Text>
            </View>
        </Swipeable>
    )
}

const rightActions = (title) => {

    return (
        <View style={styles.rightAction}>
            <Text style={styles.rightActionText}>{title} صحيحة</Text>
        </View>
    )
}

const leftActions = (title) => {
    return (
        <View style={styles.leftAction}>
            <Text style={styles.leftActionText}>{title} خطأ</Text>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        width: "100%",
        backgroundColor: "white",
        height: 50,
        justifyContent: "center",
        alignItems: "center"
    },
    titleText: {
        fontFamily: "NotoKufiArabic-Bold",
        color: "black"
    },
    rightAction: {
        backgroundColor: "#4fdb74",
        justifyContent: "center",
        flex: 1
    },
    leftAction: {
        textAlign: "left",
        backgroundColor: "#db4f4f",
        justifyContent: "center",
        flex: 1
    },
    rightActionText: {
        padding: 5,
        color: "white",
        fontFamily: "NotoKufiArabic-Bold"
    },
    leftActionText: {
        padding: 5,
        textAlign: "left",
        color: "white",
        fontFamily: "NotoKufiArabic-Bold"
    }
})