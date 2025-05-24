import React, { useState } from 'react'

export default function Tabs() {
    const [SelectedTab , setSelectedTab] = useState(0)

  return (
    <div className='flex justify-center items-center gap-[20px] w-full h-full  '>
        <button onClick={() => setSelectedTab(0)} className={`w-[200px] rounded-lg py-[7px] ${SelectedTab === 0 ?  "btns text-black" : "darkbtns text-white"} `}>For you</button>
        <button onClick={() => setSelectedTab(1)} className={`w-[200px] rounded-lg py-[7px] ${SelectedTab === 1 ?  "btns text-black" : "darkbtns text-white"} `}>Following</button>
        <button onClick={() => setSelectedTab(2)} className={`w-[200px] rounded-lg py-[7px] ${SelectedTab === 2 ?  "btns text-black" : "darkbtns text-white"} `}>Communities</button>
        <button onClick={() => setSelectedTab(3)} className={`w-[200px] rounded-lg py-[7px] ${SelectedTab === 3 ?  "btns text-black" : "darkbtns text-white"} `}>Mins</button>
    </div>
  )
}
