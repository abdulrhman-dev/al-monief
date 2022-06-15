import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { generateLetters } from "../src/Utilities/lib"
import { socket } from "../src/Utilities/SocketConnection"

const initialState = {
    roundsLetters: [],
    roundWords: [],
    isCountdown: null
}

const GameContext = createContext(initialState)
const StoreGameContext = createContext()

export const useGame = () => useContext(GameContext)
export const useStoreGame = () => useContext(StoreGameContext)



export default GameProvider = ({ children }) => {
    const [game, setGame] = useState(initialState)

    const handleReceiveLeaderBoard = useCallback(userWords => {
        setGame({
            ...game,
            userWords
        })
    }, [game])

    useEffect(() => {
        socket.on("leaderboard-submit", handleReceiveLeaderBoard)

        return () => {
            socket.off("leaderboard-submit", handleReceiveLeaderBoard)
        }
    }, [game, setGame])

    return (
        <GameContext.Provider value={game}>
            <StoreGameContext.Provider value={setGame}>
                {children}
            </StoreGameContext.Provider>
        </GameContext.Provider>
    )
}