import React from "react"
import {
    Text,
    Pressable,
    StyleSheet,
    ActivityIndicator
} from "react-native"

export default Button = ({ onPress, title, type, style = {}, loading = false, children }) => {

    // Disabled Logic
    onPress = type === "disabled" ? null : onPress

    function getButtonStyle() {
        if (loading) return [styles.button, styles.disabled]
        if (!type) return styles.button

        return {
            ...styles.button,
            ...styles[type]
        }
    }

    function getTextStyle() {
        if (!type) return styles.text

        return {
            ...styles.text,
            ...styles[type + "text"]
        }
    }

    return (
        <Pressable style={[getButtonStyle(), style]} onPress={onPress}>
            {
                loading
                    ? <ActivityIndicator size={28} color="white" />
                    : ((title ? <Text style={getTextStyle()}>{title}</Text> : children))
            }
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
        backgroundColor: "#e9aac3"
    },
    primary: {
        backgroundColor: "#e06394"
    },
    secondary: {
        backgroundColor: "#f9fafb"
    },
    secondarytext: {
        color: "#1c1c1b"
    }
})