import React, { useEffect, useState } from "react"
import {
    View,
    Text,
    StyleSheet
} from "react-native"
import { Swipeable, LongPressGestureHandler, State } from "react-native-gesture-handler"
import { MaterialIcons } from '@expo/vector-icons';

export default SwipeableButton = ({ title, type, reset, onLeft, onRight, handleDuplicate }) => {
    const [wasPressed, setWasPressed] = useState(false)

    const onLongPress = event => {
        if (event.nativeEvent.state === State.ACTIVE) {

            if (!wasPressed) {
                handleDuplicate(title, type)
            } else {
                reset(title, type)
            }

            setWasPressed(!wasPressed)
        }
    }

    return (

        <Swipeable
            renderRightActions={() => !wasPressed ? rightActions(title) : null}
            renderLeftActions={() => !wasPressed ? leftActions(title) : null}
            onSwipeableClose={() => reset(title, type)}
            onSwipeableRightOpen={() => onRight(title, type)}
            onSwipeableLeftOpen={() => onLeft(title, type)}
        >
            <LongPressGestureHandler
                onHandlerStateChange={onLongPress}
                minDurationMs={350}
            >
                {
                    !wasPressed ?
                        <View style={styles.container}>
                            <MaterialIcons name="drag-indicator" size={20} color="lightgrey" />
                            <Text style={styles.titleText}>{title}</Text>
                            <MaterialIcons name="drag-indicator" size={20} color="lightgrey" />
                        </View>

                        :
                        <View style={[styles.container, { backgroundColor: "#4fa3db", justifyContent: "center", alignItems: "center" }]}>
                            <Text style={[styles.titleText, { color: "white" }]}>{title}</Text>
                        </View>
                }
            </LongPressGestureHandler>

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
        justifyContent: "space-between",
        paddingHorizontal: 5,
        alignItems: "center",
        flexDirection: "row"
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