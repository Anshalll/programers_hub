import React, { useState } from 'react'

export default function ChatOptions() {

  const [Selected , setSelected] = useState(0)

  return (
    <div className='w-[350px]  h-full darkcomp p-[20px]'>
      <div className='w-full h-[50px] flex items-center justify-around'>

        <button onClick={() => setSelected(0)} className={`${Selected === 0 ? "btnorg text-black" : "bg-black text-white"} h-[40px] w-[45%] shadow-lg rounded-lg`}>Chat</button>
        <button onClick={() => setSelected(1)} className={`${Selected === 1 ? "btnorg text-black" : "bg-black text-white"} h-[40px] w-[45%] shadow-lg rounded-lg`}>Group</button>

      </div>
    </div>
  )
}
