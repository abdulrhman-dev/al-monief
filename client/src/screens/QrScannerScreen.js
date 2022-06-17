import { BarCodeScanner } from "expo-barcode-scanner"
import React, { useState, useEffect } from "react"
import {
    View,
    Text,
    StyleSheet
} from "react-native"
// Components 
import Button from "../Components/Button"
// Utilities
import { useSetRoom } from "../../Providers/RoomProvider"
import { socket } from "../Utilities/SocketConnection"


// original code for more info: https://www.youtube.com/watch?v=LtbuOgoQJAg

export default QrScannerScreen = ({ navigation }) => {
    const setRoom = useSetRoom()
    const [hasPermission, setHasPermission] = useState(null)
    const [scanned, setScanned] = useState(false)
    const [qrCode, setQrCode] = useState("")
    const [errorText, setErrorText] = useState("")
    const [joinLoading, setJoinLoading] = useState(false)

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            setHasPermission(null)
            setScanned(false)
            setErrorText("")
            setQrCode("")
            askForCameraPermission()
            setJoinLoading(false)
        });

        return unsubscribe
    }, [navigation])

    const askForCameraPermission = () => {
        (async () => {
            setHasPermission(null)
            const { status } = await BarCodeScanner.requestPermissionsAsync()
            setHasPermission(status === "granted")
        })()
    }

    useEffect(() => {
        setQrCode("")
        setScanned(false)
        setErrorText("")
        askForCameraPermission()
    }, [])

    const handleBarCodeScanned = ({ type, data }) => {
        console.log(type, data)
        if (type !== 256 && data.length > 8) return;

        setScanned(true)
        setQrCode(data)
    }

    const handleJoinRoom = () => {
        if (joinLoading) return;

        setJoinLoading(true)
        setScanned(false)
        setErrorText("")
        setQrCode("")

        socket.emit("join-room", qrCode, (err, room) => {
            if (err) {
                setJoinLoading(false)
                return setErrorText(err.msg)
            }
            setRoom(room)
            setErrorText("")
            navigation.navigate("WaitingScreen")
        })
    }


    if (hasPermission === null) {
        return (
            <View style={QrScannerScreenStyles.container}>
                <Text style={QrScannerScreenStyles.text}>يتم طلب السماح لأستخادم الكاميرا</Text>
            </View>
        )
    }

    if (hasPermission === false) {
        return (
            <View style={QrScannerScreenStyles.container}>
                <Text style={QrScannerScreenStyles.text}>غير مسموح أستخدام الكاميرا</Text>
                <Button
                    type="secondary"
                    title="أطلب السماح لأستخدام الكاميرا"
                    onPress={askForCameraPermission}
                />
            </View>
        )
    }



    return (
        <View style={QrScannerScreenStyles.container}>


            <View style={QrScannerScreenStyles.barcodeBox}>
                <BarCodeScanner
                    onBarCodeScanned={!scanned ? handleBarCodeScanned : null}
                    style={{ width: 500, height: 500 }}
                />
            </View>
            <Text style={QrScannerScreenStyles.errorText}>{errorText}</Text>
            <Button
                title={`${qrCode} ادخل الغرفة`}
                loading={joinLoading}
                type={!scanned ? "disabled" : "primary"}
                onPress={handleJoinRoom}
            />
            {
                scanned ?
                    <Button
                        title="اعد المحاولة"
                        type="secondary"
                        onPress={() => {
                            setQrCode("")
                            setScanned(false)
                        }}
                    />

                    :

                    null
            }
        </View>
    )
}

const QrScannerScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    barcodeBox: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "lightgrey",
        overflow: "hidden",
        borderRadius: 5,
        width: 250,
        height: 250
    },
    text: {
        fontFamily: "NotoKufiArabic-Bold",
        fontSize: 20,
        marginVertical: 20
    },
    errorText: {
        fontFamily: "NotoKufiArabic-Medium",
        fontSize: 12.5,
        color: "red",
        opacity: 0.5,
        height: 25
    }
})