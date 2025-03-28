import React , {useState} from 'react'
import {useSendDataMutation} from '../redux/apis/slice'
export default function Updatecomp({ data , setUpdateState}) {

  const [Senddata] = useSendDataMutation()
  const [Username, setUsername] = useState(data.udata.username)
  const [Name, setName] = useState(data.udata.name)
  const [Bio, setBio] = useState(data.profile.bio)
  const [Role, setRole] = useState(data.profile.role)
  const [Location, setLocation] = useState(data.profile.location)
  const [SocialMediaLinks, setSocialMediaLinks] = useState(JSON.parse(data.profile.socialmedialinks))



  const HandleProfileSave = async () => {
    const response = await Senddata({ url: "/updateinfo", method: "POST", data: { username: Username, name: Name, bio: Bio, role: Role, location: Location, socialmedialinks: SocialMediaLinks } })

    console.log(response)
    // const response  = await Senddata({ path: "/updateinfo" , method: "POST" ,  })
  }

  return (
    <div  className='flex flex-col bg-white h-screen max-w-[1800px] overflow-y-auto p-[20px]'>

      <div className='w-full  relative h-[300px]'>

        <div className='w-full h-[200px]'>
          <img src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y29kaW5nJTIwYmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D" alt="" className='object-cover h-full w-full rounded-lg' />
        </div>
        <div className='w-max  h-max  absolute top-[30%]'>
          <img className='w-[200px] h-[200px] object-cover rounded-full' src="https://miro.medium.com/v2/resize:fit:1400/1*RRCdaxwb-ZB3GWCK8nz-bg.png" alt="" />
        </div>

        <button onClick={() => setUpdateState(false)}  className='absolute hover:bg-red-700 cursor-pointer right-[10px] bottom-[7rem] px-[30px] rounded-lg text-white bg-[crimson]'>Cancel</button>

      </div>

      <div className='flex w-full mt-[20px] px-[20px] flex-col '>


        <div className='flex  items-center justify-between w-full'>

          <div className='flex flex-col gap-[20px]'>
            <input name='username' type='text' placeholder='Username' className='border-2 border-gray-300 px-[10px] rounded-lg py-[3px]' onChange={(e) => setUsername(e.target.value)} value={Username} />
            <input name='name' type='text' placeholder='Name' className='border-2 border-gray-300 px-[10px] rounded-lg py-[3px]' onChange={(e) => setName(e.target.value)} value={Name} />
            <input name='bio' type='text' placeholder='Bio' className='border-2 border-gray-300 px-[10px] rounded-lg py-[3px]' onChange={(e) => setBio(e.target.value)} value={Bio} />
            <input name='role' type='text' placeholder='Role' className='border-2 border-gray-300 px-[10px] rounded-lg py-[3px]' onChange={(e) => setRole(e.target.value)} value={Role} />



            <input name='location' type="text" placeholder='Location' className='border-2 border-gray-300 px-[10px] rounded-lg py-[3px]'onChange={(e) => setLocation(e.target.value)} value={Location} />

            <button onClick={() => HandleProfileSave()} className="bg-green-500  hover:bg-green-600 cursor-pointer text-white py-[3px] px-[30px] rounded-lg">Save</button>


          </div>

          


        </div>



      </div>


    </div>
  )
}
