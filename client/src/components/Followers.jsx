import React, { useEffect, useState } from 'react'
import { useFetchDataQuery } from '../redux/apis/slice'
import toast, { Toaster } from 'react-hot-toast'
import { useProfiledata } from '../hooks/useProfiledata'
import Loading from './Loading'
import CloseIcon from '@mui/icons-material/Close';
export default function Followers({ setTypeModelFollow }) {

  const [FollowersData, setFollowersData] = useState([])
  const { data: userdata } = useProfiledata()
  const [UserSearchTerm, setUserSearchTerm] = useState("")

  const ErrorFetchingData = () => toast.error("An error occured!", {
    duration: 1500,
    position: 'top-center'
  })
  const { isLoading, data, error } = useFetchDataQuery("/getfollowers")
  useEffect(() => {

   
      if (!isLoading) {
        if (error) {
          ErrorFetchingData()
        }

        if (data?.followers?.length > 0) {
          setFollowersData(data.followers)
        }
      }
    
  }, [ isLoading, data, error])

  const CloseFollowUnfollowModel  = () => {
    setTypeModelFollow("")
  }


  const UserSearch = (e) => {
    setUserSearchTerm(e.target.value)
    if (e.target.value.trim() === "") {
      setFollowersData(data?.followers)

    }
    else {
      let foundings = FollowersData.filter((vals) => {
        return vals.username?.toLowerCase().includes(e.target.value?.toLowerCase())
      })
      
      setFollowersData(foundings)
    }


  }

  return (
    <div className='w-[400px] h-[500px] p-[20px] flex flex-col gap-[20px] rounded-lg bg-black text-white'>
      <div className='flex w-full items-center justify-between h-[10px]'>
        <Toaster />
        <p className='text-md'>Followers</p>
        <button onClick={() => CloseFollowUnfollowModel()}><CloseIcon sx={{ fontSize: 15 }}/></button>

      </div>
       {isLoading ? <div className='w-full items-center flex justify-center h-[calc(100%-10px)]'>
              <Loading />
            </div> : <>
              {data?.followers?.length > 0 ? <>
      
                <input type="text" value={UserSearchTerm} onChange={(e) => UserSearch(e)} placeholder='Search for someone.' className='w-full h-[30px] rounded-lg px-[10px] outline-none border-2 border-gray-300' />
                {FollowersData.length > 0 ? <div className='Scroller w-full h-[calc(100%-40px)] flex flex-col gap-[20px] overflow-y-auto'>
                  {
                    FollowersData.map((value, index) => (
                      <div key={index} className='flex w-full justify-between items-center'>
      
                        <a className='flex w-full items-center gap-[10px]' href={`${import.meta.env.VITE_CLIENTURL}/profile?user=${value.username}`} key={index}>
                          <img className='w-[40px] h-[40px] rounded-full object-cover' src={`${import.meta.env.VITE_SERVERURL}/api/sendstatic/dp/${value.dp}`} alt="" />
                          <div className='flex flex-col gap-[2px]'>
                            <p>{value.username}</p>
                            <p className='text-gray-300 text-[10px]'>{value.name}</p>
                          </div>
                        </a>
      
                        {(userdata.follows && JSON.parse(userdata.follows).includes(value.username)) ? "Following" : <button className='bg-[#FF6500] px-[20px] py-[5px] rounded-lg'>Follow</button>}
                      </div>

      
                    ))
                  }
      
                </div> : <p className='flex w-full h-[calc(100%-40px)] text-lg font-bold items-center justify-center'>No user found!</p>}
      
              </> : <p className='flex w-full h-[calc(100%-40px)] text-lg font-bold items-center justify-center'>No followings!</p>}
            </>}


    </div>
  )
}
