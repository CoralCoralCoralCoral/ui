"use client"

import { Button } from "./button";
import pauseGame from "./create-game"


export default function Footer() {
    return(
        <div className="bg-gray-200 w-full py-2 px-8 flex justify-between items-center">
        {/* Stats */}
        <div className="flex space-x-8">
          <p className="text-sm font-medium">Total Infected: 1,234,567</p>
          <p className="text-sm font-medium">GDP: £1,234,567,890</p>
          <p className="text-sm font-medium">Budget: £30,000,000</p>
        </div>

        {/* Controls */}
        <div className="flex space-x-4">
          <Button className="bg-gray-400 py-1 px-3 rounded-md hover:bg-gray-500">
            Speed: x2
          </Button>
          <Button className="bg-gray-400 py-1 px-3 rounded-md hover:bg-gray-500" onClick={pauseGame}>
            Pause
          </Button>
        </div>
      </div>
    );
}