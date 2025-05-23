import React, { useState } from 'react'
import ChatLists from './ChatLists'
import CommunitiesList from './CommunitiesList'

export default function ChatOptions() {

  const [Selected , setSelected] = useState(0)
  
  return (
    <div className='w-[350px]  h-full darkcomp '>
      <div className='w-full h-[60px]  flex items-center justify-around'>

        <button onClick={() => setSelected(0)} className={`${Selected === 0 ? "btnorg text-black" : "bg-black text-white"} h-[40px] w-[40%] shadow-lg rounded-lg`}>Chat</button>
        <button onClick={() => setSelected(1)} className={`${Selected === 1 ? "btnorg text-black" : "bg-black text-white"} h-[40px] w-[40%] shadow-lg rounded-lg`}>Group</button>

      </div>

     
        {Selected === 0 ? <ChatLists /> : <CommunitiesList />}
    
    </div>
  )
}
