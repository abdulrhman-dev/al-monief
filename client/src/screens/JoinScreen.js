import React, { useEffect, useState } from 'react'
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
// Utilities
import { socket } from "../Utilities/SocketConnection"
import { useDebounce } from '../Utilities/hooks'


export default JoinScreen = ({ navigation }) => {
    const setRoom = useSetRoom()
    const [roomId, setRoomId] = useState()
    const [loading, setLoading] = useState()
    const [errorText, setErrorText] = useState("")
    const { debounce } = useDebounce()

    useEffect(() => {
        setLoading(false)
    }, [])

    function joinRoom() {
        setLoading(true)

        socket.emit("join-room", roomId, (err, room) => {
            setLoading(false)

            if (err) return setErrorText(err.msg)
            setRoom(room)
            setErrorText("")
            navigation.navigate("WaitingScreen")
        })
    }

    return (
        <View style={JoinScreenStyles.container}>
            <Text style={JoinScreenStyles.titleText}>طرق الدخول إلى الغُرف</Text>


            <View style={JoinScreenStyles.roomIdForm}>
                <Text style={JoinScreenStyles.errorText}>{errorText}</Text>

                <Input
                    onChangeText={setRoomId}
                    value={roomId}
                    placeholder={"اكتب كود الغرفة"}
                />
                <Button type={loading ? "disabled" : "primary"} title={"أدخل إلى الغرفة بأستخدام الكود"} onPress={() => debounce(joinRoom)} />
            </View>

            <Button title={"أدخل إلى الغرفة بأستخدام QR Code"} onPress={() => navigation.navigate("QrScannerScreen")} />

        </View>
    )
}

const JoinScreenStyles = StyleSheet.create({
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