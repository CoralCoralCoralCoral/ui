"use client"

import React, { useCallback } from "react"
import Menu from "@/components/ui/menu"
import Footer from "@/components/ui/footer"
import Overview from "@/components/ui/overview"
import GameMap from "@/components/ui/gameMap"

export default function Home() {
    return (
        <div className="h-screen w-full flex">
            <div className="flex flex-1 flex-col h-screen">
                {/* Menu Bar */}
                <div className="relative">
                    <Menu />
                </div>

                {/* Map & Stats */}
                <div className="flex flex-grow overflow-hidden">
                    <div className="flex relative w-full">
                        <GameMap />
                    </div>
                    {/* <div className="flex relative z-50">
                    <Overview />
                </div> */}
                </div>

                {/* Footer */}
                <div className="relative z-20">
                    <Footer />
                </div>
            </div>
            <div className="flex relative z-20">
                <Overview />
            </div>
        </div>
    )
}
