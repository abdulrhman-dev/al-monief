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
            <StoreUserContext.Provider value={(value) => storeUser(value, setUser)}>
                {props.children}
            </StoreUserContext.Provider>
        </UserContext.Provider>
    )
}

async function getUser(setUser) {
    try {
        // ? Resets User Every time app loads
        // ? Useful for devs
        // await AsyncStorage.removeItem("user")
        setUser({ loading: true })

        const value = await AsyncStorage.getItem("user")

        if (value !== null) {
            let user = JSON.parse(value)

            socket.emit("configure-user", user, socketUser => {
                setUser(socketUser)
            })

        } else {
            setUser({})
        }
    } catch (err) {
        console.log(err)
    }
}

async function storeUser(value, setUser) {
    try {
        await AsyncStorage.setItem("user", JSON.stringify(value))

        socket.emit("configure-user", value, socketUser => {
            setUser(socketUser)
        })
    } catch (err) {
        console.log(err.message, value)
    }
}
