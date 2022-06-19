import React from "react"
import {
    View,
    Text,
    BackHandler,
    StyleSheet
} from "react-native"
import { MaterialIcons } from '@expo/vector-icons';
import Button from "../Components/Button";


export default ErrorOverlay = () => {
    return (
        <View style={styles.container}>
            <MaterialIcons name="error" size={100} color="white" />
            <Text style={styles.text}>يوجد مشكلة في الأتصال بالخادم</Text>
            <Button
                title={"اغلاق التطبيق"}
                type={"secondary"}
                style={{ width: "50%", marginTop: 40 }}
                onPress={() => BackHandler.exitApp()}
            />
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
        fontSize: 18
    }
})