import React, { useEffect, useState } from 'react'
import { useSendDataMutation } from '../redux/apis/slice'
import { useProfiledata } from '../hooks/useProfiledata'
import Loading from './Loading'

export default function FollowUnfollow({followerscount  , setUserFollowers ,  username }) {

  const [Send_data] = useSendDataMutation()
  const { data } = useProfiledata()
  const [isLoading, setisLoading] = useState(false)
  const [Userdata, setUserdata] = useState({})

  useEffect(() => {
    if (Object.keys(data).length > 0) {
      setUserdata(data)
    }
  }, [data])

  const HandleFollowUser = async (type) => {
    setisLoading(true)
    const response = await Send_data({ url: "/followunfollow", method: "POST", data: { type, username } })
    if (response.data?.typeaction && response.data?.typeaction === "follow") {
      let myFollows = JSON.parse(Userdata.follows)
      myFollows.push(username)
      let udata = JSON.parse(JSON.stringify(Userdata))
      udata.follows = JSON.stringify(myFollows)
      setUserdata(udata)
      setUserFollowers(followerscount + 1)
      setisLoading(false)
    }
    if (response.data?.typeaction && response.data?.typeaction === "unfollow") {
      let udata = JSON.parse(JSON.stringify(Userdata))
      let filtered_data = JSON.stringify(JSON.parse(udata.follows).filter((e) => e !== username))
      udata.follows = filtered_data
      setUserdata(udata)
      setUserFollowers(followerscount - 1)
      setisLoading(false)

    }
  
  }

  return (
    <>
      {isLoading ?
        <div className='flex w-[30px] items-center justify-center h-[30px]'>
          <Loading />
        </div>
        : JSON.parse(!Userdata?.follows?.includes(username)) ? <button onClick={() => HandleFollowUser("follow")} className='bg-green-500 rounded-lg  p-[7px]'>Follow</button> : <button onClick={() => HandleFollowUser("unfollow")} className='bg-[#FF6500] text-white p-[7px] rounded-lg'>Following</button>}
    </>


  )
}
