import React, { createContext, useContext, useState } from "react"

const RoomContext = createContext()
const SetRoomContext = createContext()

export const useRoom = () => {
    return useContext(RoomContext)
}

export const useSetRoom = () => {
    return useContext(SetRoomContext)
}

export default RoomProvider = ({ children }) => {
    const [room, setRoom] = useState()

    function setRoomData(data) {
        setRoom(data)
    }

    return (
        <RoomContext.Provider value={room}>
            <SetRoomContext.Provider value={setRoomData}>
                {children}
            </SetRoomContext.Provider>
        </RoomContext.Provider>
    )
}