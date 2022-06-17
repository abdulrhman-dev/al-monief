import { useContext, createContext, useState, useEffect, useCallback } from "react";
import { useNetInfo } from "@react-native-community/netinfo";
// Context Provider
import { useStoreUser } from "./UserProvider"
import { useSetRoom } from "./RoomProvider"
import { useStoreGame } from "./GameProvider"
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
    const setRoom = useSetRoom()
    const setGame = useStoreGame()

    const [connection, setConnection] = useState({})

    const reconnectListener = useCallback(async () => {
        console.log("socket reconnected...")
        setUser({ loading: true })
        configureUser()
    }, [])

    const giveUserListener = useCallback(async callback => {
        setUser({ loading: true })
        configureUser(callback)
    }, [])

    const configureUser = useCallback(async (callback) => {
        let value = await AsyncStorage.getItem("user")
        value = JSON.parse(value)

        if (value !== null && value.name) {
            socket.emit("configure-user", value, socketUser => {
                setUser(socketUser, true)
                setConnection({
                    ...connection,
                    reconnected: true
                })

                if (callback) callback()
            })
        } else {
            setUser({})
            setConnection({
                ...connection,
                reconnected: true
            })
        }
    })

    const errorListener = useCallback(error => {
        {
            if (connection.isInternetReachable) {
                console.log(error)
                setConnection({
                    ...connection,
                    error
                })
            }
        }
    }, [connection])

    useEffect(() => {
        if (netInfo.isConnected !== null) {
            let reconnected = null
            if (netInfo.isInternetReachable === false) {
                setGame({})
                setRoom({})
                reconnected = false
            }

            setConnection({
                ...connection,
                reconnected,
                error: null,
                isInternetReachable: netInfo.isInternetReachable
            })
        }
    }, [netInfo])

    useEffect(() => {
        socket.io.on("reconnect", reconnectListener)
        socket.io.on("error", errorListener);
        socket.on("give-user", giveUserListener)


        return () => {
            socket.io.off("reconnect", reconnectListener)
            socket.io.off("error", errorListener)
            socket.off("give-user", giveUserListener)
        }
    }, [socket, connection])

    return (
        <ConnectionContext.Provider value={connection}>
            {children}
        </ConnectionContext.Provider>
    )
}