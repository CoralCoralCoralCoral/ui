'use client'

import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import SidebarUI from "@/components/ui/sidebar-ui";

export default function Overview() {
    const [date, setDate] = React.useState<Date | undefined>(new Date());

    return(
      <div className='relative w-80'>
        <div className="absolute inset-y-0 z-10">
          <SidebarUI />
        </div>
        <div className="absolute inset-y-0 w-80 bg-gray-100 p-4 border-l border-gray-300 flex flex-col gap-4 z-20">
          <div className="flex justify-center items-center pt-2 pb-2">
            <h2 className="text-xl font-bold text-black">Statistics</h2>
          </div>

          {/* Calendar */}
          <div className="mb-4">
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
    )
}