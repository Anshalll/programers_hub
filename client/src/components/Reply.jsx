import React, { useState } from 'react'
import Inputcomment from './Inputcomment'
import CloseIcon from '@mui/icons-material/Close';
import { useSendDataMutation } from '../redux/apis/slice'
export default function Reply({ ReplyUsername, CloseReply, ReplyState }) {

  const [ReplyMessage, setReplyMessage] = useState("")
  const [DataSend] = useSendDataMutation()


  const HandleReply = async () => {
    if (ReplyMessage.trim() !== "") {
     
      const response = await DataSend( {url:"reply" , method: "POST" ,  data: { user: ReplyUsername, cid: ReplyState.cid, pid: ReplyState.id  , message: ReplyMessage} })

      
      console.log(response)

    }


  }

  return (
    <div className='flex w-full flex-col gap-[10px]'>
      <div className='flex w-full bg-gray-900 rounded-lg items-center justify-between'>
        <p className='text-[12px]'>@{ReplyUsername}</p>
        <button onClick={() => CloseReply()}><CloseIcon sx={{ fontSize: 13 }} /></button>
      </div>
      <Inputcomment placeholder={`Reply to ${ReplyUsername}`} ActionFunction={HandleReply} Text={ReplyMessage} setText={setReplyMessage} />

    </div>

  )
}
