'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Menu() {
    const pathname = usePathname();

    return(
        <div className="bg-gray-200 w-full py-4 px-8 flex flex-row justify-center items-center">
        <div className="flex space-x-14">

          <Link href="./">
            <button className={`text-black font-medium border-b-2 ${
              pathname === '/' ? 'border-red-500' : 'border-transparent'
            } hover:border-red-500`}>
                Map View
            </button>
          </Link>

          <Link href="statistics">
            <button className={`text-black font-medium border-b-2 ${
              pathname === '/statistics' ? 'border-red-500' : 'border-transparent'
            } hover:border-red-500`}>
                Statistics
            </button>
          </Link>

          <Link href="policy_overview">
            <button className={`text-black font-medium border-b-2 ${
              pathname === '/policy_overview' ? 'border-red-500' : 'border-transparent'
            } hover:border-red-500`}>
                Policy Overview
            </button>
          </Link>

          <Link href="research">
            <button className={`text-black font-medium border-b-2 ${
              pathname === '/research' ? 'border-red-500' : 'border-transparent'
            } hover:border-red-500`}>
                Research
            </button>
          </Link>

          <Link href="history">
            <button className={`text-black font-medium border-b-2 ${
              pathname === '/history' ? 'border-red-500' : 'border-transparent'
            } hover:border-red-500`}>
                History
            </button>
          </Link>

          <Link href="settings">
            <button className={`text-black font-medium border-b-2 ${
              pathname === '/settings' ? 'border-red-500' : 'border-transparent'
            } hover:border-red-500`}>
                Settings
            </button>
          </Link>

        </div>
      </div>
    );
}