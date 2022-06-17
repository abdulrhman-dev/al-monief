import { useContext, createContext, useState, useEffect, useCallback } from "react";
import { useNetInfo } from "@react-native-community/netinfo";
// Context Provider
import { useStoreUser } from "./UserProvider"
// Utilties
import { socket } from "../src/Utilities/SocketConnection"
import AsyncStorage from "@react-native-async-storage/async-storage"

const ConnectionContext = createContext({})

export const useConnection = () => {
    return useContext(ConnectionContext)
}

export default ConnectionProvider = ({ children }) => {
    const netInfo = useNetInfo()
    const setUser = useStoreUser()

    const [connection, setConnection] = useState({})

    const reconnectListener = useCallback(async () => {
        console.log("socket reconnected...")
        const value = await AsyncStorage.getItem("user")
        if (value) {
            socket.emit("configure-user", JSON.parse(value), socketUser => {
                setUser(socketUser)
            })
        }
    }, [])


    useEffect(() => {
        console.log(netInfo.isInternetReachable ? "Connected to the internet" : "Nope my guy can't connect")
    }, [netInfo])

    useEffect(() => {
        socket.io.on("reconnect", reconnectListener)

        socket.io.on("reconnect_error", (error) => {
            console.log(error)
        });
        socket.io.on("error", (error) => {
            console.log(error)
        });
        return () => {
            socket.io.off("reconnect", reconnectListener)
        }
    }, [socket])

    return (
        <ConnectionContext.Provider value={connection}>
            {children}
        </ConnectionContext.Provider>
    )
}