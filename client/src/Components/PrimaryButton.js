import React from "react"
import {
    Text,
    Pressable,
    StyleSheet
} from "react-native"

export default PrimaryButton = ({ onPress, title }) => {

    return (
        <Pressable style={styles.button} onPress={onPress}>
            <Text style={styles.text}>{title}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#e06394",
        width: 260,
        height: 45,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center"
    },
    text: {
        fontFamily: "NotoKufiArabic-Bold",
        color: "white"
    }
})