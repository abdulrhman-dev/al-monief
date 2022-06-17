import React from "react"
import {
    View,
    Text,
    StyleSheet
} from "react-native"
import { MaterialIcons } from '@expo/vector-icons';


export default ErrorOverlay = () => {
    return (
        <View style={styles.container}>
            <MaterialIcons name="error" size={100} color="white" />
            <Text style={styles.text}>يوجد مشكلة في الأتصال بالخادم</Text>
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
    },
    text: {
        fontFamily: "NotoKufiArabic-ExtraBold",
        color: "white",
        marginTop: 20,
        fontSize: 15
    }
})