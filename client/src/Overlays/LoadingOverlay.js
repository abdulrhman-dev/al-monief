import React from "react"
import {
    View,
    ActivityIndicator,
    StyleSheet
} from "react-native"

export default LoadingOverlay = ({ backgroundColor = "#323440", color = "white" }) => {
    return (
        <View style={[styles.container, { backgroundColor }]}>
            <ActivityIndicator size={60} color={color} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        zIndex: 5,
        width: "100%",
        height: "100%",
        position: "absolute",
        justifyContent: "center",
        alignItems: "center"
    }
})