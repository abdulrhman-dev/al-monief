import React from "react"
import {
    TextInput,
    StyleSheet
} from "react-native"

export default Input = (props) => {

    return (
        <TextInput
            style={styles.input}
            placeholderTextColor="#c4c2c3"
            {...props}
        />
    )
}

const styles = StyleSheet.create({
    input: {
        height: 50,
        width: 260,
        margin: 2.5,
        borderWidth: 1.5,
        borderRadius: 5,
        borderColor: "#e06394",
        color: "#323440",
        padding: 10,
        fontFamily: "NotoKufiArabic-Medium"
    }
})