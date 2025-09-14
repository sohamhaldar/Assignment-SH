import { Button } from '@/components/ui/button';
import React from 'react'
import { InfiniteRibbon } from "@/components/ui/infinite-ribbon"
import Link from 'next/link';

function Landing() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 font-mono gap-2 w-full overflow-hidden relative'>
        <h1 className='text-7xl font-bold text-black'>Planify</h1>
        <p className='text-2xl text-center text-black'>Plan your weekends the right way</p>
        <Link href="/planner" className='hover:cursor-pointer hover:scale-110'><Button className='text-xl font-semibold mt-10 '>Plan Now</Button></Link>
        <InfiniteRibbon rotation={-45} className="absolute bottom-20 md:bottom-36  -right-36 bg-[#805c24] text-white py-2 whitespace-nowrap overflow-hidden w-[800px]">
            Monday &nbsp; &nbsp; &nbsp; &nbsp; Tuesday &nbsp; &nbsp; &nbsp; &nbsp; Wednesday &nbsp; &nbsp; &nbsp; &nbsp; Thursday &nbsp; &nbsp; &nbsp; &nbsp; Friday &nbsp; &nbsp; &nbsp; &nbsp; Saturday &nbsp; &nbsp; &nbsp; &nbsp; Sunday &nbsp; &nbsp; &nbsp; &nbsp;
        </InfiniteRibbon>
        <InfiniteRibbon rotation={-45} className="absolute top-20 md:top-36 -left-36 bg-black text-white py-2 whitespace-nowrap overflow-hidden w-[800px]">
            Monday &nbsp; &nbsp; &nbsp; &nbsp; Tuesday &nbsp; &nbsp; &nbsp; &nbsp; Wednesday &nbsp; &nbsp; &nbsp; &nbsp; Thursday &nbsp; &nbsp; &nbsp; &nbsp; Friday &nbsp; &nbsp; &nbsp; &nbsp; Saturday &nbsp; &nbsp; &nbsp; &nbsp; Sunday &nbsp; &nbsp; &nbsp; &nbsp;
        </InfiniteRibbon>
        <InfiniteRibbon rotation={45} className="absolute top-20 md:top-36 -right-36 bg-black text-white py-2 whitespace-nowrap overflow-hidden w-[800px]">
            Monday &nbsp; &nbsp; &nbsp; &nbsp; Tuesday &nbsp; &nbsp; &nbsp; &nbsp; Wednesday &nbsp; &nbsp; &nbsp; &nbsp; Thursday &nbsp; &nbsp; &nbsp; &nbsp; Friday &nbsp; &nbsp; &nbsp; &nbsp; Saturday &nbsp; &nbsp; &nbsp; &nbsp; Sunday &nbsp; &nbsp; &nbsp; &nbsp;
        </InfiniteRibbon>
        <InfiniteRibbon rotation={45} className="absolute bottom-20 md:bottom-36 -left-36 bg-amber-700 text-white py-2 whitespace-nowrap overflow-hidden w-[800px]">
            Monday &nbsp; &nbsp; &nbsp; &nbsp; Tuesday &nbsp; &nbsp; &nbsp; &nbsp; Wednesday &nbsp; &nbsp; &nbsp; &nbsp; Thursday &nbsp; &nbsp; &nbsp; &nbsp; Friday &nbsp; &nbsp; &nbsp; &nbsp; Saturday &nbsp; &nbsp; &nbsp; &nbsp; Sunday &nbsp; &nbsp; &nbsp; &nbsp;
        </InfiniteRibbon>
        
        
    </div>
  )
}

export default Landing;