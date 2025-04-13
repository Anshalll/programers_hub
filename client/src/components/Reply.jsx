import React, { useState } from 'react'
import Inputcomment from './Inputcomment'
export default function Reply({ ReplyUsername  }) {

    const [ReplyMessage, setReplyMessage] = useState("")

    const HandleReply = () => {

    }
    
  return (
    <Inputcomment placeholder={`Reply to ${ReplyUsername}`} ActionFunction={HandleReply} Text={ReplyMessage} setText={setReplyMessage}/>
  )
}
