import React, { useState } from 'react'
import Layout from '../Layout'
import ChatOptions from '../components/ChatOptions'
import ChatMessages from '../components/ChatMessages'

export default function Chat() {

  const [ChatUser, setChatUser] = useState({
    username: "John Doe",
    message: "Hello, how are you?",
    time: "10:30 AM",
    profilePic: "https://i.guim.co.uk/img/media/9b7412a06451584d8e594c9d08b3cd0623d23d02/0_32_1800_1081/master/1800.jpg?width=1200&quality=85&auto=format&fit=max&s=c852668beeb82679081ff608bef6734e",
    isOnline: true,
    newMessages: 2,
  })

  return (

    <Layout>

    <div className='flex w-full h-full'>

        <div className=' darkcomps flex-1 h-full'>
          <ChatMessages user={ChatUser}/>
        </div>

        <ChatOptions setChatUser={setChatUser} />
    </div>
    </Layout>
  )
}
