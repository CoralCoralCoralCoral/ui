import { createContext, useContext } from "react"

// Define the type for the context value
export interface GameContextType {
    error: string | null
    isLoading: boolean
    isConnected: boolean
    isInitialized: boolean
    isPaused: boolean
    gameId: string | null
    sendCommand: (payload: any) => void
    startGame: () => void
    pauseGame: () => void
    resumeGame: () => void
}

// Create the context with a default value of `undefined`
const GameContext = createContext<GameContextType | undefined>(undefined)

// Define a custom hook for consuming the context
export const useGameContext = (): GameContextType => {
    const context = useContext(GameContext)

    if (!context) {
        throw new Error("useGameContext must be used within a GameProvider")
    }

    return context
}

export default GameContext
