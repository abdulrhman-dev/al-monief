import React, { useEffect } from "react"
import {
    Text,
    Pressable,
    StyleSheet
} from "react-native"

export default PrimaryButton = ({ onPress, title, disabled }) => {

    // Disabled Logic
    const buttonStyle = disabled ? styles.disabled : styles.button;

    onPress = disabled ? null : onPress

    return (
        <Pressable style={buttonStyle} onPress={onPress}>
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
        justifyContent: "center",
        marginTop: 10
    },
    text: {
        fontFamily: "NotoKufiArabic-Bold",
        color: "white"
    },
    disabled: {
        width: 260,
        height: 45,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        backgroundColor: "#bababa"
    }
})