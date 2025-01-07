"use client"

import React, { useCallback } from "react"
import Footer from "@/components/ui/footer"
import Overview from "@/components/ui/overview"
import { useGameContext } from "@/game/GameContext"
import { Flex, Spinner, Text } from "@radix-ui/themes"
import NewGame from "@/components/NewGame"
import Oracle from "@/components/Oracle"
import TableView from "@/components/TableView"
import MapView from "@/components/MapView"
import { useAppSelector } from "@/store/hooks"

export default function Home() {
    const { gameId, isLoading, isInitialized, isConnected } = useGameContext()
    const selectedView = useAppSelector(store => store.navigation.selectedView)

    return (
        <div className="flex justify-center items-center w-full h-screen">
            {gameId && !isLoading && isInitialized && (
                <div className="w-full flex">
                    <div className="flex flex-col flex-grow h-screen">
                        <div className="flex-grow relative overflow-y-auto">
                            {selectedView == "map" ? (
                                <MapView />
                            ) : selectedView == "table" ? (
                                <TableView />
                            ) : null}
                        </div>
                        <Footer />
                    </div>
                    <div className="h-screen w-1/3 overflow-y-auto">
                        <Overview />
                        <Oracle />
                    </div>
                </div>
            )}

            {isLoading && <span>Creating game. Please wait...</span>}
            {gameId && !isLoading && isConnected && !isInitialized && (
                <Flex align="center" gap="4">
                    <Spinner />
                    <Text size="2">Initializing game, please wait</Text>
                </Flex>
            )}

            {!gameId && !isLoading && !isConnected && (
                <div className="max-w-xl">
                    <Flex direction="column" gap="6">
                        <Text size="6">Epidemic Simulator</Text>
                        <Text size="3">
                            Help defeat an epidemic ravaging the Greater London
                            Area by using a combination of public health
                            surveillance and intervention strategies
                        </Text>
                        <NewGame />
                    </Flex>
                </div>
            )}
        </div>
    )
}
