import { createContext, useContext, useState } from "react";

const LeaderboardsContext = createContext({})
const SetLeaderboardsContext = createContext({})


export const useLeaderboards = () => {
    return useContext(LeaderboardsContext)
}

export const useSetLeaderboards = () => {
    return useContext(SetLeaderboardsContext)
}


export default LeaderboardsProvider = ({ children }) => {
    const [leaderboards, setLeaderboards] = useState({})

    const changeLeaderboards = (value) => {
        setLeaderboards(value)
    }

    return (
        <LeaderboardsContext.Provider value={leaderboards}>
            <SetLeaderboardsContext.Provider value={changeLeaderboards}>
                {children}
            </SetLeaderboardsContext.Provider>
        </LeaderboardsContext.Provider>
    )
}