"use client"

import { useGameContext } from "@/game/GameContext"
import { Button } from "./button"
import { useCallback } from "react"
import NewGame from "../NewGame"
import { Flex, Spinner, TabNav, Text } from "@radix-ui/themes"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { updateView } from "@/store/navigation"

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

    const selectedView = useAppSelector(store => store.navigation.selectedView)

    const dispatch = useAppDispatch()

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
                        <NewGame />
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

                {/* View Nav */}
                <div>
                    <TabNav.Root>
                        <TabNav.Link
                            onClick={() => dispatch(updateView("map"))}
                            href="#"
                            active={selectedView == "map"}
                        >
                            Map View
                        </TabNav.Link>
                        <TabNav.Link
                            onClick={() => dispatch(updateView("table"))}
                            href="#"
                            active={selectedView == "table"}
                        >
                            Table View
                        </TabNav.Link>
                    </TabNav.Root>
                </div>

                <div>
                    {isLoading && <span>Creating game. Please wait...</span>}
                    {gameId && !isLoading && isConnected && !isInitialized && (
                        <Flex align="center" gap="4">
                            <Spinner />
                            <Text size="2">Initializing game, please wait</Text>
                        </Flex>
                    )}
                    {gameId && !isLoading && isConnected && isInitialized && (
                        <div className="flex items-center space-x-4">
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
