import React, { useEffect, useState } from "react"
import {
    View,
    Text,
    StyleSheet,
    TextInput
} from "react-native"
import { useStoreUser } from "../../Providers/UserProvider"
// Components
import Button from "../Components/Button"
import Input from "../Components/Input"
import DicebearAvatar from "../Components/DicebearAvatar"
import { MaterialIcons } from '@expo/vector-icons';
// UUID
import "react-native-get-random-values"
import { v4 as uuidv4 } from "uuid";

let UNIQUE_NUMBER = String(Math.floor((Math.random() * 8000000)))
export default CreateUserScreen = () => {
    const [userLoading, setUserLoading] = useState(false)
    const [username, changeUsername] = useState("")
    const [avatar, storeAvatar] = useState()
    const [uniqueNumber, setUniqueNumber] = useState(UNIQUE_NUMBER)

    const storeUser = useStoreUser()

    useEffect(() => {
        changeUsername("")
        storeAvatar()
        UNIQUE_NUMBER = String(Math.floor((Math.random() * 8000000)))
        setUserLoading(false)
    }, [])


    function handleSubmit() {
        if (!username) return;
        if (userLoading) return;

        setUserLoading(true)
        storeUser({
            name: username,
            avatarSeed: avatar,
            generalId: uuidv4(),
            numberOfGames: 0,
            gamePlaces: []
        })
    }

    function handleRefreshAvatar() {
        setUniqueNumber(String(Math.floor((Math.random() * 8000000))))
    }

    return (
        <View style={CreateUserStyle.screenView}>
            <View style={CreateUserStyle.header}>
                <Text style={CreateUserStyle.screenText}>أنشاء حساب جديد</Text>
            </View>
            <View style={CreateUserStyle.body}>
                <View style={CreateUserStyle.avatarView}>
                    <DicebearAvatar
                        seed={uniqueNumber + username}
                        storeSeed={seed => storeAvatar(seed)}
                    />
                </View>
                <View style={CreateUserStyle.secionView}>
                    <Input
                        onChangeText={changeUsername}
                        value={username}
                        placeholder="أكتب أسمك"
                    />
                    <View style={CreateUserStyle.buttonView}>
                        <Button
                            onPress={handleSubmit}
                            style={{ width: "75%" }}
                            title={"أنشاء الحساب"}
                            loading={userLoading}
                        />
                        <Button
                            onPress={handleRefreshAvatar}
                            style={{ width: "20%" }}
                        >
                            <MaterialIcons name="refresh" size={24} color="white" />
                        </Button>
                    </View>

                </View>
            </View>
        </View>
    )
}

const CreateUserStyle = StyleSheet.create({
    screenView: {
        flex: 1,
        direction: "rtl"
    },
    screenText: {
        fontFamily: "NotoKufiArabic-ExtraBold",
        color: "white",
        fontSize: 25
    },
    header: {
        flex: 1.2,
        backgroundColor: "#323440",
        justifyContent: "center",
        alignItems: "center"
    },
    body: {
        flex: 4.8,
        justifyContent: "center",
        alignItems: "center"
    },
    avatarView: {
        flex: 3,
        justifyContent: "flex-end"
    },
    secionView: {
        justifyContent: "center",
        alignItems: "center",
        flex: 3
    },
    buttonView: {
        width: 260,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row"
    }
})