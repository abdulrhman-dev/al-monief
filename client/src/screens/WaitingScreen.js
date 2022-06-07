import React, { useEffect } from "react"
import {
    View,
    Text,
    StyleSheet,
    Alert
} from "react-native"
// Socket
import { socket } from "../Utilities/SocketConnection"
// Context
import { useRoom } from "../../RoomProvider"
// Components
import QRCode from "react-native-qrcode-svg";
import Button from "../Components/PrimaryButton"

export default WaitingScreen = ({ navigation }) => {
    const room = useRoom()

    useEffect(() => {
        navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();

            Alert.alert(
                "الخروج من الغرفة",
                "هل تريد أن تخرج من الغرفة وتترك وراءك الكثير؟",
                [
                    { text: "ابقى هنا", style: "cancel", onPress: () => { } },
                    {
                        text: "أخرج من الغرفة",
                        style: 'destructive',
                        onPress: () => {
                            socket.emit("leave-room", room.id)
                            navigation.dispatch(e.data.action)
                        },
                    },
                ]
            );
        })
    }, [navigation])

    return (
        <View style={WaitingScreenStyles.container}>

            <View style={WaitingScreenStyles.header}>
                <Text style={WaitingScreenStyles.titleText}>أدع أصدقائك للدوخل!</Text>
                <View style={WaitingScreenStyles.avatarsBar}>

                </View>
            </View>
            <View style={WaitingScreenStyles.body}>
                <View style={WaitingScreenStyles.mainbodyContent}>
                    <Text style={WaitingScreenStyles.text}>{room.id} :كود الغرفة</Text>

                    <QRCode
                        backgroundColor="#f2f2f2"
                        value={room.id}
                        size={200}
                    />
                </View>



                <View style={WaitingScreenStyles.button}>
                    <Button
                        title={"أبدا اللعبة"}
                        disabled
                    />
                </View>

            </View>


        </View>
    )
}

const WaitingScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    titleText: {
        fontFamily: "NotoKufiArabic-ExtraBold",
        color: "black",
        fontSize: 25
    },
    text: {
        fontFamily: "NotoKufiArabic-Bold",
        color: "black",
        fontSize: 20,
        margin: 20
    },
    header: {
        width: "100%",
        flex: 1.5,
        justifyContent: "center",
        alignItems: "center"
    },
    avatarsBar: {

    },
    body: {
        width: "100%",
        flex: 4.5,
        justifyContent: "center",
        alignItems: "center"
    },
    mainbodyContent: {
        flex: 4,
        justifyContent: "center",
        alignItems: "center"
    },
    button: {
        flex: 2,
        justifyContent: "flex-end",
        marginBottom: 30
    }
})