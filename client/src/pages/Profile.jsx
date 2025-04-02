import React, { useEffect, useState } from 'react'
import { useProfiledata } from '../hooks/useProfiledata'
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import Layout from '../Layout'
import Updatecomp from '../components/Updatecomp';
import { useSendDataMutation } from '../redux/apis/slice';
import Loading from '../components/Loading';

export default function Profile() {

  const { data } = useProfiledata()

  const [UpdateState, setUpdateState] = useState(false)
  const [Datasend] = useSendDataMutation()
  const [Userdata, setUserdata] = useState({})
  const [Error, setError] = useState("")
  const [LoadingUser , setLoadingUser] = useState(true)
  const [Admin , setAdmin] = useState(false)


  useEffect(() => {
      if( Object.keys(data).length > 0){

        setUserdata(data)
      }
  } , [data])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (!params.get("user")){
      window.location.href = `${import.meta.env.VITE_CLIENTLOCAL}/profile?user=${data.username}`
    }
   
    


  } , [data.username])

  useEffect(() => {
    async function userget() {
      if (data.username) {
        const params = new URLSearchParams(window.location.search);
        
        const usernameParam = params.get("user");
        
        if (usernameParam ) {
         
          if ( usernameParam !== data.username) {
            const res = await Datasend({
              url: "/getuser",
              method: "POST",
              data: { username: usernameParam },
            });
    
            if (res.error?.data.error) {
              setError(res.error.data.error);
            }
            if (res.data) {
              setUserdata(res.data.data[0]);
              setAdmin(false)
            }
          }
          else{
            setAdmin(true)
          }
         
        }
      }

      setLoadingUser(false)
    }
  
    userget(); 
  
  }, [data.username, Datasend]);
  
  

  return (

    <>
{!LoadingUser  ?     <Layout>

      {!UpdateState ?
      Object.keys(Userdata).length > 0 &&
      <div className='flex flex-col bg-white h-screen max-w-[1800px] overflow-y-auto p-[20px]'>

        <div className='w-full  relative h-[250px]'>

          <div className='w-full h-[200px]'>
            <img src={`${import.meta.env.VITE_SERVERURL}/api/sendstatic/bg/${Userdata.bg}`} alt="" className='object-cover h-full w-full rounded-lg' />

          </div>
          <div className='w-max  h-max  absolute top-[40%]'>
            <img className='w-[150px] h-[150px] p-[3px]  bg-white object-cover rounded-full' src={`${import.meta.env.VITE_SERVERURL}/api/sendstatic/dp/${Userdata.dp}`} alt="" />
          </div>

        {Admin ?   <button onClick={() => setUpdateState(true)} className='absolute cursor-pointer hover:bg-green-600 right-[10px] bottom-[4rem] px-[30px] rounded-lg text-white bg-green-500'>Edit</button> : <></>}
        </div>
        {Error && <p className='text-white p-[3px] bg-[crimson]'>{Error}</p> }
        <div className='flex w-full mt-[20px] px-[20px] flex-col h-[20%]'>


          <div className='flex  items-center justify-between w-full'>

            <div className='flex flex-col gap-[20px]'>
              {Userdata.username && <p>{Userdata.username}</p>}
              {Userdata.name && <p>{Userdata.name}</p>}
              {Userdata.bio && <p>{Userdata.bio}</p>}
              { Userdata.role && <p>{Userdata.role}</p>}
              { Userdata.socialmedialinks && <a target='_blank' href={Userdata.socialmedialinks} className='text-blue-600 hover:text-blue-500 hover:border-b hover:border-blue-500'>{Userdata.socialmedialinks.slice(0, 30)}..</a>}
              
              {Userdata.location && <p className='flex items-center gap-[10px]'><LocationOnOutlinedIcon />{Userdata.location}</p>}
              {Userdata.joinedon && <p className='flex items-center gap-[20px]'><DateRangeOutlinedIcon />{Userdata.joinedon}</p>}
            </div>
            <div className='flex flex-col gap-[20px]'>
              <div className='flex items-center gap-[20px]'>
                {Userdata && <p className='text-center'>{Userdata.followers} <br /> <span>Followers</span> </p>}
                {Userdata && <p className='text-center'>{Userdata.following} <br /> <span>Following</span></p>}

              </div>
              {!Admin && <button className='bg-green-500 rounded-lg  p-[7px]'>Follow</button>}
            </div>



          </div>



        </div>



      </div>
      
      
      :

     <Updatecomp data={data} setUpdateState={setUpdateState}/>
    }

    </Layout> : <div className="flex items-center justify-center min-h-screen w-[100vw] bg-black">
            <Loading />
          </div> }
    </>

  )
}
