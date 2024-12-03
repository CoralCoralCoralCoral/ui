"use client"

import React, { useCallback } from "react"
import Menu from "@/components/ui/menu"
import Footer from "@/components/ui/footer"
import Overview from "@/components/ui/overview"
import GameMap from "@/components/ui/gameMap"
import useMessaging from "@/hooks/useMessaging"

export default function Home() {
    const { gameId, error, isConnected, sendCommand } = useMessaging()

    const handlePause = useCallback(() => {
        sendCommand({
            type: "pause",
            payload: {}
        })
    }, [sendCommand])

    return (
        <div className="flex flex-col h-screen">
            {/* Menu Bar */}
            <div className="relative">
                {error && (
                    <span>
                        error creating game <span>{error}</span>
                    </span>
                )}
                {isConnected && (
                    <span>
                        connected to game <span>{gameId}</span>
                    </span>
                )}
                <Menu />
            </div>

            {/* Map & Stats */}
            <div className="flex flex-1 overflow-hidden">
                <div className="flex relative w-full min-h-screen">
                    <GameMap />
                </div>
                <div className="flex relative z-20">
                    <Overview />
                </div>
            </div>

            {/* Footer */}
            <div className="relative z-20">
                <button onClick={handlePause}>Pause</button>
                <Footer />
            </div>
        </div>
    )
}
