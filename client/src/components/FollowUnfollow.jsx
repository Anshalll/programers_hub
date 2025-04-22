import React from 'react'
import {useSendDataMutation} from '../redux/apis/slice'
export default function FollowUnfollow({ username }) {

    const [Send_data] = useSendDataMutation()

    const HandleFollowUser = async () => {
            const response = await Send_data({ url: "/followunfollow" , method: "POST" , data: {type:"follow" , username  } })
            console.log(response)
    }

  return (
 
        <button onClick={() => HandleFollowUser()} className='bg-green-500 rounded-lg  p-[7px]'>Follow</button>
        
  
  )
}
