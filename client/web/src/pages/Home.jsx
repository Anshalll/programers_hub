import React from 'react'
import Layout from '../Layout'
import HomeFeed from '../components/home/HomeFeed'
import Tabs from '../components/home/Tabs'
import Moments from '../components/home/Moments'


export default function Home() {
  return (
    <Layout>
      <div className='w-full text-white flex h-full p-[20px]'>
        <div className='flex flex-col w-full gap-[20px]   h-full'>
          <div className=' w-full  h-[40px]'>
            <Tabs />
          </div>
          <div className='Scroller flex-1 blackcomp flex flex-col  items-center gap-[20px] h-[calc(100vh - 40px)] overflow-y-auto'>

          <HomeFeed />
          </div>
        </div>

      <div className='w-[25rem] darkcomp h-full '>

        <Moments />
      </div>


      </div>
    </Layout>
  )
}
