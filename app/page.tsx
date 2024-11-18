"use client"

import { Calendar } from "@/components/ui/calendar"
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";



export default function Home() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="flex flex-col h-screen">
      {/* Menu */}
      <div className="bg-gray-200 w-full py-4 px-8 flex flex-row justify-center items-center">
        <div className="flex space-x-14">
          <button className="text-black font-medium border-b-2 border-red-500">
            Map View
          </button>
          <button className="text-black font-medium border-b-2 border-transparent hover:border-red-500">
            Statistics
          </button>
          <button className="text-black font-medium border-b-2 border-transparent hover:border-red-500">
            Policy Overview
          </button>
          <button className="text-black font-medium border-b-2 border-transparent hover:border-red-500">
            Research
          </button>
          <button className="text-black font-medium border-b-2 border-transparent hover:border-red-500">
            Settings
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 bg-gray-50 p-8 overflow-hidden" />

        {/* Overview */}
        <div className="w-80 bg-gray-100 p-4 border-l border-gray-300 flex flex-col gap-4">
          <div className="flex justify-center items-center pt-2 pb-2">
            <h2 className="text-xl font-bold text-black">Overview</h2>
          </div>

          {/* Calendar */}
          <div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </div>

          {/* Prog bars*/}
          <div className="flex flex-col gap-3 mt-0">
            <div>
              <p className="text-sm font-medium">Vaccine Research</p>
              <Progress value={37} />
            </div>
            <div>
              <p className="text-sm font-medium">Policy Acceptance</p>
              <Progress value={14} />
            </div>
            <div>
              <p className="text-sm font-medium">Gov. Approval Rating</p>
              <Progress value={73} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4">
            <Button>Social Policy</Button>
            <Button>Upgrade Infrastructure</Button>
            <Button>Vaccine Investment</Button>
            <Button className="bg-red-500 text-white font-medium py-2 px-4 rounded-md">
              Lockdown
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
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
          <Button className="bg-gray-400 py-1 px-3 rounded-md hover:bg-gray-500">
            Pause
          </Button>
        </div>
      </div>
    </div>
  );
}
