import React, { useState } from 'react'

export default function Tabs() {
    const [SelectedTab , setSelectedTab] = useState(0)

  return (
    <div className='flex justify-center items-center gap-[20px] w-full h-full  '>
        <button onClick={() => setSelectedTab(0)} className={`w-[200px] rounded-lg py-[5px] ${SelectedTab === 0 ?  "bg-cyan-500 text-black" : "darkcomp text-white"} `}>For you</button>
        <button onClick={() => setSelectedTab(1)} className={`w-[200px] rounded-lg py-[5px] ${SelectedTab === 1 ?  "bg-cyan-500 text-black" : "darkcomp text-white"} `}>Following</button>
        <button onClick={() => setSelectedTab(2)} className={`w-[200px] rounded-lg py-[5px] ${SelectedTab === 2 ?  "bg-cyan-500 text-black" : "darkcomp text-white"} `}>Communities</button>
        <button onClick={() => setSelectedTab(3)} className={`w-[200px] rounded-lg py-[5px] ${SelectedTab === 3 ?  "bg-cyan-500 text-black" : "darkcomp text-white"} `}>Mins</button>
    </div>
  )
}
