import { createContext, useContext, useEffect, useState } from "react"
import { generateLetters } from "../src/Utilities/lib"

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

    return (
        <GameContext.Provider value={game}>
            <StoreGameContext.Provider value={setGame}>
                {children}
            </StoreGameContext.Provider>
        </GameContext.Provider>
    )
}