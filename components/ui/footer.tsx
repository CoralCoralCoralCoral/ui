"use client"

import { useGameContext } from "@/game/GameContext"
import { Button } from "./button"
import { useCallback } from "react"

export default function Footer() {
    const {
        gameId,
        isLoading,
        isInitialized,
        isConnected,
        isPaused,
        startGame,
        sendCommand,
        pauseGame,
        resumeGame
    } = useGameContext()

    const handleQuit = useCallback(() => {
        sendCommand({
            type: "quit"
        })
    }, [sendCommand])

    return (
        <div className="bg-gray-200 w-full py-2 px-8 flex justify-between items-center">
            {/* Stats */}
            {/* <div className="flex space-x-8">
                <p className="text-sm font-medium">Total Infected: 1,234,567</p>
                <p className="text-sm font-medium">GDP: £1,234,567,890</p>
                <p className="text-sm font-medium">Budget: £30,000,000</p>
            </div> */}

            {/* Controls */}
            <div className="w-full flex justify-between items-center py-2">
                <div className="flex space-x-2">
                    {!gameId && !isLoading && !isConnected ? (
                        <Button
                            className="bg-green-400 py-1 px-3 rounded-md hover:bg-green-500"
                            onClick={startGame}
                        >
                            Start Game
                        </Button>
                    ) : isPaused ? (
                        <Button
                            className="bg-gray-400 py-1 px-3 rounded-md hover:bg-gray-500"
                            onClick={resumeGame}
                        >
                            Resume
                        </Button>
                    ) : (
                        <Button
                            className="bg-gray-400 py-1 px-3 rounded-md hover:bg-gray-500"
                            onClick={pauseGame}
                        >
                            Pause
                        </Button>
                    )}
                </div>
                <div>
                    {isLoading && <span>Creating game. Please wait...</span>}
                    {gameId && !isLoading && isConnected && !isInitialized && (
                        <span>Initializing game. Please wait...</span>
                    )}
                    {gameId && !isLoading && isConnected && isInitialized && (
                        <div className="flex items-center space-x-4">
                            <span>
                                Connected to game: <span>{gameId}</span>
                            </span>
                            <Button
                                className="bg-red-600 py-1 px-3 rounded-md hover:bg-red-700"
                                onClick={handleQuit}
                            >
                                Quit
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
