import React from "react"
import {
    View,
    Text,
    StyleSheet
} from "react-native"
import { Feather } from '@expo/vector-icons';


export default NoInternetOverlay = () => {


    return (
        <View style={styles.container}>
            <Feather name="wifi-off" size={100} color="white" />
            <Text style={styles.text}>لا يوجد اتصال بالأنترنت</Text>
            <Text style={[styles.text, { fontFamily: "NotoKufiArabic-Thin", marginTop: 5, fontSize: 12 }]}>
                ستغلق هذه الشاشة تلقائياً عندما تتصل بالأنترنت
            </Text>

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