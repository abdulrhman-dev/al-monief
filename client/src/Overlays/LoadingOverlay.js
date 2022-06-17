import React from "react"
import {
    View,
    ActivityIndicator,
    StyleSheet
} from "react-native"

export default LoadingOverlay = () => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size={60} color="white" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#323440",
        width: "100%",
        height: "100%",
        position: "absolute",
        justifyContent: "center",
        alignItems: "center"
    }
})