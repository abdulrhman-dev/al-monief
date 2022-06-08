import React, { useState } from "react"
import {
    View,
    Text,
    StyleSheet,
    TextInput
} from "react-native"
import { useStoreUser } from "../../UserProvider"
// Components
import Button from "../Components/Button"
import Input from "../Components/Input"
import DicebearAvatar from "../Components/DicebearAvatar"
// UUID
import "react-native-get-random-values"
import { v4 as uuidv4 } from "uuid";

const uniqueNumber = String(Math.floor((Math.random() * 5000)))

export default CreateUserScreen = () => {
    const [username, changeUsername] = useState("")
    const [avatar, storeAvatar] = useState()
    const storeUser = useStoreUser()


    function handleSubmit() {
        if (!username) return;

        storeUser({
            name: username,
            avatarXML: avatar,
            userId: uuidv4()
        })
    }

    return (
        <View style={CreateUserStyle.screenView}>
            <View style={CreateUserStyle.header}>
                <Text style={CreateUserStyle.screenText}>أنشاء حساب جديد</Text>
            </View>
            <View style={CreateUserStyle.body}>
                <View style={CreateUserStyle.secionView}>
                    <DicebearAvatar
                        seed={uniqueNumber + username}
                        storeXML={xml => storeAvatar(xml)}
                    />
                </View>
                <View style={CreateUserStyle.secionView}>
                    <Input
                        onChangeText={changeUsername}
                        value={username}
                        placeholder="أكتب أسمك"
                    />
                    <Button
                        onPress={handleSubmit}
                        title={"أنشاء الحساب"}
                    />
                </View>
            </View>
        </View>
    )
}

const CreateUserStyle = StyleSheet.create({
    screenView: {
        flex: 1,
        direction: "rtl",

    },
    screenText: {
        fontFamily: "NotoKufiArabic-ExtraBold",
        color: "white",
        fontSize: 30
    },
    header: {
        flex: 1.8,
        backgroundColor: "#323440",
        justifyContent: "center",
        alignItems: "center"

    },
    body: {
        flex: 4.2,
        justifyContent: "center",
        alignItems: "center"
    },
    secionView: {
        justifyContent: "center",
        alignItems: "center",
        flex: 3
    }
})