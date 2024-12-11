"use client"

import React, { createContext, ReactNode, useContext } from "react"
import useGame from "./useGame"
import GameContext, { GameContextType } from "./GameContext"

// Define the provider component
interface GameProviderProps {
    children: ReactNode
}

const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
    const {
        error,
        isLoading,
        isConnected,
        isPaused,
        gameId,
        sendCommand,
        startGame,
        pauseGame,
        resumeGame
    } = useGame()

    return (
        <GameContext.Provider
            value={{
                error,
                isConnected,
                isLoading,
                isPaused,
                gameId,
                sendCommand,
                startGame,
                pauseGame,
                resumeGame
            }}
        >
            {children}
        </GameContext.Provider>
    )
}

export default GameProvider
