import React, { useState, useEffect } from "react"
import {
    View,
    Text,
    StyleSheet
} from "react-native"
import { MaterialIcons } from '@expo/vector-icons';
import Button from "../Components/Button";
import { useRoom, useSetRoom } from "../../Providers/RoomProvider";
import { socket } from "../Utilities/SocketConnection";


export default TransferringScreen = ({ route, navigation }) => {
    const setRoom = useSetRoom()
    const room = useRoom()
    const [error, setError] = useState("")
    const {
        params: { id },
    } = route;


    function joinRoom() {
        if (room && room.id === id) return navigation.navigate("WaitingScreen")

        socket.emit("join-room", id, (err, room) => {
            if (err) return setError(err.msg)

            setRoom(room)
            setError("")
            navigation.navigate("WaitingScreen")
        })
    }
    return (
        <View style={styles.container}>
            <MaterialIcons name="directions" size={100} color="white" />
            <Text style={styles.text}>{!error ? `يتم نقلك إلى الغرفة ${id}` : `لقد فشل توصيلك الى ${id}`} </Text>

            {
                error === ""

                &&

                <Button
                    title={`اذهب الى الغرفة ${id}`}
                    type={"secondary"}
                    style={{ width: "50%", marginTop: 40 }}
                    onPress={joinRoom}
                />
            }

            {
                error !== ""

                &&

                <>
                    <Text style={styles.error}>{error}</Text>

                    <Button
                        title={"ارجع الى الشاشة الأساسية"}
                        type={"secondary"}
                        style={{ width: "50%", marginTop: 40 }}
                        onPress={() => navigation.replace("HomeScreen")}
                    />
                </>
            }

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
    },
    error: {
        color: "#db4f4f",
        fontFamily: "NotoKufiArabic-Medium",
        marginTop: 15
    }
})