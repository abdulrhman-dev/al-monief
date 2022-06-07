import React, { createContext, useContext, useEffect, useState } from "react"
import AsyncStorage from '@react-native-async-storage/async-storage';


const UserContext = createContext()
const StoreUserContext = createContext()



export const useUser = () => {
    return useContext(UserContext)
}

export const useStoreUser = () => {
    return useContext(StoreUserContext)
}

export const UserProvider = (props) => {
    const [user, setUser] = useState()

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
        // ? Useful for dev
        // await AsyncStorage.removeItem("user")
        setUser({ loading: true })
        const user = await AsyncStorage.getItem("user")
        setUser(JSON.parse(user))
    } catch (err) {
        console.log(err)
    }
}

async function storeUser(value, setUser) {
    try {
        value = JSON.stringify(value)
        await AsyncStorage.setItem("user", value)
        setUser(JSON.parse(value))
    } catch (err) {
        console.log(err.message, value)
    }
}