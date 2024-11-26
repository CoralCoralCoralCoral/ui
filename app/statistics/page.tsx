import React from "react";
import Menu from "@/components/ui/menu";
import Footer from "@/components/ui/footer";

export default function StatisticsPage() {

  return (
    <div className="flex flex-col h-screen">
      {/* Top Menu Bar */}
     <Menu />

      {/* Main Content */}
      <div className="flex flex-1 px-8 py-4 gap-8">
        {/* Left Column: Table */}
        <div className="w-1/2 bg-white rounded-md shadow border p-4">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="font-bold text-sm border-b pb-2">Statistic</th>
                <th className="font-bold text-sm border-b pb-2">Data</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr>
                <td className="py-2">Infected</td>
                <td className="py-2">1,234,567</td>
              </tr>
              <tr>
                <td className="py-2">Dead</td>
                <td className="py-2">684,734</td>
              </tr>
              <tr className="bg-gray-300">
                <td className="py-2">Immune</td>
                <td className="py-2">454,213</td>
              </tr>
              <tr>
                <td className="py-2">Vaccinated</td>
                <td className="py-2">0</td>
              </tr>
              <tr>
                <td className="py-2">People Entering City</td>
                <td className="py-2">213,513</td>
              </tr>
              <tr>
                <td className="py-2">People Exiting City</td>
                <td className="py-2">282,942</td>
              </tr>
              <tr>
                <td className="py-2">GDP</td>
                <td className="py-2">£1,234,567,890</td>
              </tr>
              <tr>
                <td className="py-2">GDP % Change</td>
                <td className="py-2 text-red-500">-17%</td>
              </tr>
              <tr>
                <td className="py-2">Budget</td>
                <td className="py-2">£30,000,000</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Right Column: Map */}
        <div className="w-1/2 flex justify-center items-center">
          <div className="w-96 h-96 border border-gray-300 rounded-md overflow-hidden">
            <h1>MAP</h1>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
