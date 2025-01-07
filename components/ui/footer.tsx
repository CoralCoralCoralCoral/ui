"use client"

import { useGameContext } from "@/game/GameContext"
// import { Button } from "./button"
import { useCallback } from "react"
import NewGame from "../NewGame"
import { Button, Flex, Spinner, TabNav, Text } from "@radix-ui/themes"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { updateView } from "@/store/navigation"

export default function Footer() {
    const {
        gameId,
        isLoading,
        isInitialized,
        isConnected,
        isPaused,
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
        <div className="bg-white border-t w-full py-2 px-8 flex justify-between items-center">
            <div className="w-full flex justify-between items-center py-2">
                {/* View Nav */}

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

                {/* Controls */}
                {gameId && !isLoading && isConnected && isInitialized && (
                    <div className="flex items-center space-x-4">
                        {isPaused ? (
                            <Button color="green" onClick={resumeGame}>
                                Resume
                            </Button>
                        ) : (
                            <Button color="orange" onClick={pauseGame}>
                                Pause
                            </Button>
                        )}

                        <Button color="red" onClick={handleQuit}>
                            Quit
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
