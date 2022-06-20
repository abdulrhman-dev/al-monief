import React, { createContext, useContext, useEffect, useState } from "react"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { socket } from "../src/Utilities/SocketConnection";


const UserContext = createContext({})
const StoreUserContext = createContext()



export const useUser = () => {
    return useContext(UserContext)
}

export const useStoreUser = () => {
    return useContext(StoreUserContext)
}

export default UserProvider = (props) => {
    const [user, setUser] = useState({ loading: true })


    useEffect(() => {
        getUser(setUser)
    }, [])

    return (
        <UserContext.Provider value={user}>
            <StoreUserContext.Provider value={(value, ignoreConfigured) => storeUser(value, ignoreConfigured, setUser)}>
                {props.children}
            </StoreUserContext.Provider>
        </UserContext.Provider>
    )
}

async function getUser(setUser) {
    try {
        // ? Resets User Every time app loads
        // ? Useful for devs
        await AsyncStorage.removeItem("user")
        setUser({ loading: true })

        let value = await AsyncStorage.getItem("user")
        value = JSON.parse(value)

        if (value !== null && value.name) {
            socket.emit("configure-user", value, socketUser => {
                setUser(socketUser)
            })

        } else {
            setUser({})
        }
    } catch (err) {
        console.log(err)
    }
}

async function storeUser(value, ignoreConfigured, setUser) {
    try {
        if (!value.name) return
        await AsyncStorage.setItem("user", JSON.stringify(value))

        if (ignoreConfigured) return setUser(value)

        socket.emit("configure-user", value, socketUser => {
            setUser(socketUser)
        })
    } catch (err) {
        console.log(err.message, value)
    }
}
