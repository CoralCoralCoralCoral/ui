"use client"

import { useGameContext } from "@/game/GameContext"
import { Button } from "./button"
import { useCallback, useState } from "react"

export default function Footer() {
    const { gameId, isLoading, isConnected, startGame, sendCommand } =
        useGameContext()

    const [isPaused, setIsPaused] = useState(false)

    const handlePause = useCallback(() => {
        sendCommand({
            type: "pause"
        })

        setIsPaused(true)
    }, [sendCommand])

    const handleResume = useCallback(() => {
        sendCommand({
            type: "resume"
        })

        setIsPaused(false)
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
                    {!gameId && !isLoading && !isConnected && (
                        <Button
                            className="bg-green-400 py-1 px-3 rounded-md hover:bg-green-500"
                            onClick={startGame}
                        >
                            Start Game
                        </Button>
                    )}

                    {isPaused ? (
                        <Button
                            className="bg-gray-400 py-1 px-3 rounded-md hover:bg-gray-500"
                            onClick={handleResume}
                        >
                            Resume
                        </Button>
                    ) : (
                        <Button
                            className="bg-gray-400 py-1 px-3 rounded-md hover:bg-gray-500"
                            onClick={handlePause}
                        >
                            Pause
                        </Button>
                    )}
                </div>
                <div>
                    {isLoading && <span>Creating game. Please wait...</span>}
                    {gameId && !isLoading && isConnected && (
                        <span>
                            Connected to game: <span>{gameId}</span>
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}
