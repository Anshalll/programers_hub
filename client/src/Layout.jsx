import React from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
export default function Layout({ children }) {
  return (
    <div className="flex h-screen w-[100vw] text-[13px]">

        <div className='w-[20%] h-full '>
        <Sidebar/>
        </div>

      <div className='flex flex-col relative h-full w-[80%]'>
        <Navbar />

        {children}
      </div>
    </div>
  ) 
}
