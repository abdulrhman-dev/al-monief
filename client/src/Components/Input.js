import React from "react"
import {
    TextInput,
    StyleSheet
} from "react-native"

export default Input = ({ onChangeText, value, placeholder }) => {

    return (
        <TextInput
            style={styles.input}
            onChangeText={onChangeText}
            value={value}
            placeholderTextColor="#c4c2c3"
            placeholder={placeholder}
            caretHidden={true}
        />
    )
}

const styles = StyleSheet.create({
    input: {
        height: 50,
        width: 260,
        margin: 20,
        borderWidth: 1.5,
        borderRadius: 5,
        borderColor: "#e06394",
        color: "#323440",
        padding: 10,
        fontFamily: "NotoKufiArabic-Medium"
    }
})