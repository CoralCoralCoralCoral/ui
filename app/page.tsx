// "use client"

import React from "react";
import Menu from "@/components/ui/menu";
import Footer from "@/components/ui/footer";
import Overview from "@/components/ui/overview";
import GameMap from "@/components/ui/gameMap";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      {/* Menu Bar */}
      <div className="relative">
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
        <Footer />
      </div>
    </div>
  );
}
