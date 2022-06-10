import React, { useState } from 'react'
import {
    View,
    StyleSheet,
    Text
} from "react-native"
// Components
import Input from "../Components/Input"
import Button from "../Components/Button"
// Provider
import { useSetRoom } from "../../Providers/RoomProvider"
// Socket
import { socket } from "../Utilities/SocketConnection"


export default JoinScreen = ({ navigation }) => {
    const setRoom = useSetRoom()
    const [roomId, setRoomId] = useState()
    const [errorText, setErrorText] = useState("")


    function joinRoom() {
        socket.emit("join-room", roomId, (err, room) => {
            if (err) return setErrorText(err.msg)
            setRoom(room)
            setErrorText("")
            navigation.navigate("WaitingScreen")
        })
    }

    return (
        <View style={JoinModalStyles.container}>
            <Text style={JoinModalStyles.titleText}>طرق الدخول إلى الغُرف</Text>


            <View style={JoinModalStyles.roomIdForm}>
                <Text style={JoinModalStyles.errorText}>{errorText}</Text>

                <Input
                    onChangeText={setRoomId}
                    value={roomId}
                    placeholder={"اكتب كود الغرفة"}
                />
                <Button title={"أدخل إلى الغرفة بأستخدام الكود"} onPress={joinRoom} />
            </View>

            <Button title={"أدخل إلى الغرفة بأستخدام QR Code"} />

        </View>
    )
}

const JoinModalStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    titleText: {
        fontFamily: "NotoKufiArabic-ExtraBold",
        color: "black",
        fontSize: 25,
        marginBottom: 200
    },
    errorText: {
        fontFamily: "NotoKufiArabic-Medium",
        fontSize: 12.5,
        color: "red",
        opacity: 0.5,
        height: 25
    },
    roomIdForm: {
        marginBottom: 20,
        justifyContent: "center",
        alignItems: "center"
    }
})