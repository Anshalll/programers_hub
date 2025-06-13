import React, { useState } from 'react'
import Layout from '../Layout'
import ChatOptions from '../components/chat/ChatOptions'
import ChatMessages from '../components/chat/ChatMessages'


export default function Chat() {

  const [ChatUser, setChatUser] = useState({type: null , data: null})


  return (

    <Layout>

    <div className='flex w-full h-full'>

        <div className=' darkcomps flex-1 h-full'>
          <ChatMessages selectedChat={ChatUser}/>
        </div>

        <ChatOptions setChatUser={setChatUser} />
    </div>
    </Layout>
  )
}
