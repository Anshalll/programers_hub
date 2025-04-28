import React, { useEffect, useState } from 'react'
import { useSendDataMutation } from '../redux/apis/slice'
import toast, { Toaster } from 'react-hot-toast'
import Loading from './Loading'
import CloseIcon from '@mui/icons-material/Close';
import { useProfiledata } from '../hooks/useProfiledata'
import useFollowUnfollow from '../hooks/useFollowunfollow'
import { setudata } from '../redux/userdata/slice'
import { useDispatch } from 'react-redux';
import UnFollowButton from './UnFollowButton';
import FollowButton from './FollowButton'
import FollowingButtton from './FollowingButton'

export default function Followings({ username, setTypeModelFollow }) {

  const [FollowingsData, setFollowingsData] = useState([])
  const [UserSearchTerm, setUserSearchTerm] = useState("")
  const [data, setdata] = useState([])
  const [isLoading, setisLoading] = useState(false)
  const { data: userdata } = useProfiledata()
  const { FollowUser, UnfollowUser } = useFollowUnfollow()
  const dispatch = useDispatch()


  const ErrorFetchingData = () => toast.error("An error occured!", {
    duration: 1500,
    position: 'top-center'
  })
  const [Send_data] = useSendDataMutation()

  useEffect(() => {
    const GetFollowings = async () => {
      try {
        setisLoading(true)
        const response = await Send_data({ url: "/getfollowings", method: "POST", data: { username } })

        if (response.error) {
          ErrorFetchingData()
        }
        if (response.data?.followings?.length > 0) {
          setdata(response.data.followings)
          setFollowingsData(response.data.followings)
        }
      } catch (error) {
        console.error(error)
        ErrorFetchingData()
      }
      finally {
        setisLoading(false)

      }


    }



    GetFollowings()

  }, [Send_data, username])


  const CloseFollowUnfollowModel = () => {
    setTypeModelFollow("")
  }

  const UserSearch = (e) => {
    setUserSearchTerm(e.target.value)
    if (e.target.value.trim() === "") {
      setFollowingsData(data)

    }
    else {
      let foundings = data.filter((vals) => {
        return vals.username?.toLowerCase().includes(e.target.value?.toLowerCase())
      })

      setFollowingsData(foundings)
    }


  }


  const HandleUnfollowInModel = async (value) => {
    const resp = await UnfollowUser(value.username)
    if (resp.error) {
      ErrorFetchingData()
    }
    else {
      if (username === value.username) {
       setdata(prevData => prevData.filter(user => user.username !== value.username))
      }
      if (userdata && userdata.follows) {
        
        let follows_data = JSON.parse(userdata.follows).filter((e) => e !== value.username)
        let parse_data = JSON.parse(JSON.stringify(userdata))
        parse_data.follows = JSON.stringify(follows_data)
        dispatch(setudata(parse_data))
      }

    }
  }

  const HandlefollowInModel = async (value, index) => {
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
        let follows = JSON.stringify([username])
        let parse_data = JSON.parse(JSON.stringify(userdata))
        parse_data.follows = JSON.stringify(follows)
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
  }

  return (
    <div className='w-[600px] h-[500px] p-[20px] flex flex-col gap-[20px] rounded-lg bg-black text-white'>

      <div className='flex w-full items-center justify-between h-[10px]'>
        <Toaster />
        <p className='text-md'>Followings</p>
        <button onClick={() => CloseFollowUnfollowModel()}><CloseIcon sx={{ fontSize: 15 }} /></button>

      </div>
      {isLoading ? <div className='w-full items-center flex justify-center h-[calc(100%-10px)]'>
        <Loading />
      </div> : <>


        <input type="text" value={UserSearchTerm} onChange={(e) => UserSearch(e)} placeholder='Search for someone.' className='w-full h-[30px] rounded-lg px-[10px] outline-none border-2 border-gray-300' />
        {FollowingsData.length > 0 ? <div className='Scroller w-full h-[calc(100%-40px)] flex flex-col gap-[20px] overflow-y-auto'>
          {
            FollowingsData.map((value, index) => (
              <div key={index} className='flex w-full justify-between items-center'>

                <a className='flex w-full items-center gap-[10px]' href={`${import.meta.env.VITE_CLIENTLOCAL}/profile?user=${value.username}`} key={index}>
                  <img className='w-[40px] h-[40px] rounded-full object-cover' src={`${import.meta.env.VITE_SERVERURL}/api/sendstatic/dp/${value.dp}`} alt="" />
                  <div className='flex flex-col gap-[2px]'>
                    <p>{value.username}</p>
                    <p className='text-gray-300 text-[10px]'>{value.name}</p>
                  </div>
                </a>

                {(() => {
                  if (userdata.username === value.username) {
                    return <p>You</p>;
                  }

                  if (userdata.username !== username) {
                    return JSON.parse(userdata.follows)?.includes(value.username)
                      ? <FollowingButtton HandleUnfollowInModel={HandleUnfollowInModel} value={value} />
                      : <FollowButton HandlefollowInModel={HandlefollowInModel} value={value} index={index} />;
                  }

                  return JSON.parse(userdata.follows).filter(e => e === value.username).length > 0
                    ? <UnFollowButton HandleUnfollowInModel={HandleUnfollowInModel} value={value} />
                    : <FollowButton HandlefollowInModel={HandlefollowInModel} value={value} index={index} />;
                })()}
              </div>


            ))
          }

        </div> : <p className='flex w-full h-[calc(100%-40px)] text-lg font-bold items-center justify-center'>No user found!</p>}


      </>}
    </div>
  )
}
