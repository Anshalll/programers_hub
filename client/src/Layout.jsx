import React from 'react'
import Sidebar from './components/Sidebar'
export default function Layout({ children }) {
  return (
    <div className="flex h-screen w-[100vw] text-[13px]">

      <aside className='darkcomp w-[15%] h-full '>
        <Sidebar />
      </aside>

      <div className='flex flex-col relative h-full w-[85%]'>


        {children}
      </div>
    </div>
  )
}
