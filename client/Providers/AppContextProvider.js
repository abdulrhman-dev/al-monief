import React from 'react';

const combineComponents = (...components) => {
    return components.reduce(
        (AccumulatedComponents, CurrentComponent) => {
            return ({ children }) => {
                return (
                    <AccumulatedComponents>
                        <CurrentComponent>{children}</CurrentComponent>
                    </AccumulatedComponents>
                );
            };
        },
        ({ children }) => <>{children}</>,
    );
};

// Providers
import RoomProvider from './RoomProvider';
import UserProvider from './UserProvider';
import GameProvider from './GameProvider';
import ConnectionProvider from './ConnectionProvider';
import LeaderboardsProvider from './LeaderboardsProvider';



const providers = [
    RoomProvider,
    UserProvider,
    GameProvider,
    ConnectionProvider,
    LeaderboardsProvider
]

export default AppContextProvider = combineComponents(...providers)