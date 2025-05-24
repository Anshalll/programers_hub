import React, { useEffect, useState } from 'react'
import { useSendDataMutation } from '../redux/apis/slice'
import toast, { Toaster } from 'react-hot-toast'
import { useProfiledata } from '../hooks/useProfiledata'
import Loading from './Loading'
import CloseIcon from '@mui/icons-material/Close';
import useFollowUnfollow from '../hooks/useFollowunfollow'
import { useDispatch } from 'react-redux';
import { setudata } from '../redux/userdata/slice'
import FollowButton from './FollowButton'
import FollowingButtton from './FollowingButton'


export default function Followers({ username, setTypeModelFollow }) {

  const [FollowersData, setFollowersData] = useState([])
  const { data: userdata } = useProfiledata()
  const [UserSearchTerm, setUserSearchTerm] = useState("")
  const [isLoading, setisLoading] = useState(false)
  const [data, setdata] = useState([])
  const dispatch = useDispatch()
  const { FollowUser, UnfollowUser, RmFollower } = useFollowUnfollow()

  const ErrorFetchingData = () => toast.error("An error occured!", {
    duration: 1500,
    position: 'top-center'
  })

  const [Send_data] = useSendDataMutation()

  useEffect(() => {
    const GetFollowers = async () => {
      try {
        setisLoading(true)
        const response = await Send_data({ url: "/getfollowers", method: "POST", data: { username } })

        if (response.error) {
          ErrorFetchingData()
        }
        if (response.data?.followers?.length > 0) {
          setdata(response.data.followers)
          setFollowersData(response.data.followers)
        }
      } catch (error) {
        console.error(error)
        ErrorFetchingData()
      }
      finally {
        setisLoading(false)

      }


    }



    GetFollowers()

  }, [Send_data, username])

  const CloseFollowUnfollowModel = () => {
    setTypeModelFollow("")
  }


  const UserSearch = (e) => {
    setisLoading(true)
    setUserSearchTerm(e.target.value)
    if (e.target.value.trim() === "") {
      setFollowersData(data)

    }
    else {
      let foundings = FollowersData.filter((vals) => {
        return vals.username?.toLowerCase().includes(e.target.value?.toLowerCase())
      })

      setFollowersData(foundings)
    }

    setisLoading(false)
  }


  const HandleUnfollowInModel = async (value) => {
    setisLoading(true)
    const resp = await UnfollowUser(value.username)
    if (resp.error) {
      ErrorFetchingData()
    }
    else {
      if (username === value.username) {
        setdata(prevData => prevData.filter(user => user.username !== value.username))
      }
      if (userdata?.follows && JSON.parse(userdata.follows).length > 0) {

        let follows_data = JSON.parse(userdata.follows).filter((e) => e !== value.username)

        let parse_data = JSON.parse(JSON.stringify(userdata))
        parse_data.follows = JSON.stringify(follows_data)
        dispatch(setudata(parse_data))

      }


    }

    setisLoading(false)
  }

  const HandlefollowInModel = async (value, index) => {
    setisLoading(true)
    const resp = await FollowUser(value.username)
    if (resp.error) {
      ErrorFetchingData()
    }
    else {

      if (username === value.username) {

        let parsed = JSON.parse(JSON.stringify(data))
        parsed.splice(index, 0, value)
        setdata(parsed)
      }

      if (!userdata.follows) {
        let follows = JSON.stringify([value.username])
        let parse_data = JSON.parse(JSON.stringify(userdata))
        parse_data.follows = follows
        dispatch(setudata(parse_data))

      }
      else {
        let follows_data = JSON.parse(userdata.follows)
        if (!follows_data.includes(value.username)) {
          follows_data.push(value.username)
          let parse_data = JSON.parse(JSON.stringify(userdata))
          parse_data.follows = JSON.stringify(follows_data)
          dispatch(setudata(parse_data))
        }

      }



    }
    setisLoading(true)
  }


  const RemoveUserFromFollowers = async (value) => {
    setisLoading(true)
    const resp = await RmFollower(value.username)
    if (resp.error) {
      ErrorFetchingData()
    }
    else {
      let parsed_followers = JSON.parse(userdata.followedby)

      let updated = parsed_followers.filter((e) => e !== value.username)
      let parsed = JSON.parse(JSON.stringify(userdata))
      if (updated.length === 0) {
        parsed.followedby = null
        dispatch(setudata(parsed))


      }
      else {
        parsed.followedby = JSON.stringify(updated)
        dispatch(setudata(parsed))

      }
      setFollowersData(prev => prev.filter((e) => e.username !== value.username))
      setdata(prev => prev.filter((e) => e.username !== value.username))

    }
    setisLoading(false)
  }

  return (
    <div className='w-[600px] h-[500px] p-[20px] flex flex-col gap-[20px] rounded-lg bg-black text-white'>
      <div className='flex w-full items-center justify-between h-[10px]'>
        <Toaster />
        <p className='text-md'>Followers</p>
        <button onClick={() => CloseFollowUnfollowModel()}><CloseIcon sx={{ fontSize: 15 }} /></button>

      </div>
      {isLoading ? <div className='w-full items-center flex justify-center h-[calc(100%-10px)]'>
        <Loading />
      </div> : <>
      {data?.length > 0 ?  <>

          <input type="text" value={UserSearchTerm} onChange={(e) => UserSearch(e)} placeholder='Search for someone.' className='w-full h-[30px] rounded-lg px-[10px] outline-none border-2 border-gray-300' />
          {FollowersData.length > 0 ? <div className='Scroller w-full h-[calc(100%-40px)] flex flex-col gap-[20px] overflow-y-auto'>
            {
              FollowersData.map((value, index) => (
                <div key={index} className='flex w-full justify-between items-center'>

                  <a className='flex w-full items-center gap-[10px]' href={`${import.meta.env.VITE_CLIENTLOCAL}/profile?user=${value.username}`} key={index}>
                    <img className='w-[40px] h-[40px] rounded-full object-cover' src={`${import.meta.env.VITE_SERVERURL}/api/sendstatic/dp/${value.dp}`} alt="" />
                    <div className='flex flex-col gap-[2px]'>
                      <p>{value.username}</p>
                      <p className='text-gray-300 text-[10px]'>{value.name}</p>
                    </div>
                  </a>

                  {userdata.username === value.username ? (
                    <p>You</p>
                  ) : (
                    <div className='flex items-center gap-[10px]'>
                      {userdata.username === username && (
                        <button onClick={() => RemoveUserFromFollowers(value)} className='border-2 border-white w-[80px] py-[5px] rounded-lg'>
                          Remove
                        </button>
                      )}
                      {(() => {
                        const isFollowing = userdata.follows && JSON.parse(userdata.follows)?.includes(value.username);
                        return (
                          isFollowing ? <FollowingButtton value={value} HandleUnfollowInModel={HandleUnfollowInModel} /> : <FollowButton value={value} HandlefollowInModel={HandlefollowInModel} />

                        );
                      })()}
                    </div>
                  )}
                </div>


              ))
            }

          </div> : <p className='flex w-full h-[calc(100%-40px)] text-lg font-bold items-center justify-center'>No user found!</p>}

        </>
        : <p className='flex w-full h-[calc(100%-40px)] text-lg font-bold items-center justify-center'>No Followers!</p>}
      </>}


    </div>
  )
}
