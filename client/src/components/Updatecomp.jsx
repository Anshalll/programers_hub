import React, { useRef, useState } from 'react'
import { useSendDataMutation, useSendImagedataMutation } from '../redux/apis/slice'
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

export default function Updatecomp({ data, setUpdateState }) {

  const [Senddata] = useSendDataMutation()
  const [SendImage] = useSendImagedataMutation()
  const [Username, setUsername] = useState(data.username)
  const [Name, setName] = useState(data.name)
  const [Bio, setBio] = useState(data.bio)
  const [Role, setRole] = useState(data.role)
  const [Location, setLocation] = useState(data.location)
  const [Bg, setBg] = useState(`${import.meta.env.VITE_SERVERURL}/api/sendstatic/bg/${data.bg}`)
  const [Dp, setDp] = useState(`${import.meta.env.VITE_SERVERURL}/api/sendstatic/dp/${data.dp}`)
  const [SocialMediaLinks, setSocialMediaLinks] = useState(data.socialmedialinks)
  const [BGtosend, setBGtosend] = useState("")
  const [DptoSend, setDptoSend] = useState("")
  const BGref = useRef(null)
  const Dpref = useRef(null)

  const [Error, setError] = useState("")

  const HanndleBGupload = (e) => {
    const readfile = new FileReader()
    readfile.readAsDataURL(e.target.files[0])
    readfile.onload = () => {
      setBg(readfile.result)
      setBGtosend(e.target.files[0])
    }
  }

  const HandleDpupload = (e) => {
    const readfile = new FileReader()
    readfile.readAsDataURL(e.target.files[0])
    readfile.onload = () => {
      setDp(readfile.result)
      setDptoSend(e.target.files[0])
    }
  }

  const HandleBGDelete = async () => {
    const response = await Senddata({
      url: "/deleteimage",
      method: "POST",
      data: { type: "bg" }
    });

    if (response.error) {
      setError(response.error.data.error);
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }
    else {


      setBg(`${import.meta.env.VITE_SERVERURL}/api/sendstatic/bg/defaultbg.jpg`);
      setBGtosend("");

    }

  };

  const HandleDPDelete = async () => {
    const response = await Senddata({
      url: "/deleteimage",
      method: "POST",
      data: { type: "dp" }
    });

    if (response.error) {
      setError(response.error.data.error);
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }
    else {


      setDp(`${import.meta.env.VITE_SERVERURL}/api/sendstatic/dp/defaultdp.jpg`);
      setDptoSend("");
    }
  };

  const HandleProfileSave = async () => {
    const response = await Senddata({ url: "/updateinfo", method: "POST", data: { username: Username, name: Name, bio: Bio, role: Role, location: Location, socialmedialinks: SocialMediaLinks } })

    if (BGtosend || DptoSend) {
      const formdata = new FormData();

      if (BGtosend) formdata.append("bg", BGtosend);
      if (DptoSend) formdata.append("dp", DptoSend);

      const respuploadimages = await SendImage({ url: "/uploadimages", method: "POST", data: formdata });

      if (respuploadimages.error?.data?.error) {
        setError(respuploadimages.error.data.error)
        setTimeout(() => {
          setError("")
        }, 3000)
        return
      }
    }
    if (response.error) {
      setError(response.error.data.error)
      setTimeout(() => {
        setError("")
      }, 3000)
      return
    }

    if (response.data) {
      window.location.reload()
    }
  }

  return (
    <div className='flex flex-col bg-white h-screen max-w-[1800px] overflow-y-auto p-[20px]'>

      <div className='w-full  relative h-[250px]'>

        <div className='w-full flex  h-[200px]'>
          <img src={Bg} alt="" className='object-cover h-full w-full rounded-lg' />
          <div className='flex absolute w-full h-[200px] rounded-lg'>
            <input type="file" onChange={(e) => HanndleBGupload(e)} ref={BGref} className='absolute hidden w-full h-full ' />
            <div className='flex opacity-[0.5] rounded-lg w-full absolute h-full gap-[10px]  bg-black items-center justify-center'>

              <button onClick={() => BGref.current.click()} className='text-white cursor-pointer'><FileUploadOutlinedIcon /></button>
              {Bg !== `${import.meta.env.VITE_SERVERURL}/api/sendstatic/bg/defaultbg.jpg` && (
                <button onClick={HandleBGDelete} className=' cursor-pointer  text-white   '><DeleteOutlineIcon sx={{ fontSize: 20 }} /></button>
              )}
            </div>

          </div>
        </div>
        <div className='w-max  h-max  flex absolute top-[40%]'>
          <img className='w-[150px] h-[150px] p-[3px]  object-cover rounded-full' src={Dp} alt="" />
          <input type="file" onChange={(e) => HandleDpupload(e)} ref={Dpref} className='absolute hidden w-full h-full ' />


          <div className='flex opacity-[0.5] w-full rounded-full absolute h-full gap-[10px]  bg-black items-center justify-center'>

            <button onClick={() => Dpref.current.click()} className='cursor-pointer  text-white '><FileUploadOutlinedIcon /></button>
            {Dp !== `${import.meta.env.VITE_SERVERURL}/api/sendstatic/dp/defaultdp.jpg` && (
              <button onClick={HandleDPDelete} className='cursor-pointer  text-white  '><DeleteOutlineIcon  sx={{ fontSize: 20 }} /></button>
            )}

          </div>

        </div>

        <button onClick={() => setUpdateState(false)} className='absolute hover:bg-red-700 cursor-pointer right-[10px] bottom-[4rem] px-[30px] rounded-lg text-white bg-[crimson]'>Cancel</button>

      </div>

      <div className='flex w-full mt-[20px] px-[20px] flex-col '>
        <div className='flex  items-center justify-between w-full'>
          <div className='flex flex-col gap-[20px]'>
            <input name='username' type='text' placeholder='Username' className='border-2 border-gray-300 px-[10px] rounded-lg py-[3px]' onChange={(e) => setUsername(e.target.value)} value={Username} />
            <input name='name' type='text' placeholder='Name' className='border-2 border-gray-300 px-[10px] rounded-lg py-[3px]' onChange={(e) => setName(e.target.value)} value={Name} />
            <input name='bio' type='text' placeholder='Bio' className='border-2 border-gray-300 px-[10px] rounded-lg py-[3px]' onChange={(e) => setBio(e.target.value)} value={Bio} />
            <input name='role' type='text' placeholder='Role' className='border-2 border-gray-300 px-[10px] rounded-lg py-[3px]' onChange={(e) => setRole(e.target.value)} value={Role} />
            <input name='location' type="text" placeholder='Location' className='border-2 border-gray-300 px-[10px] rounded-lg py-[3px]' onChange={(e) => setLocation(e.target.value)} value={Location} />
            <input name='socialmedialinks' type="text" placeholder='Enter link' className='border-2 border-gray-300 px-[10px] rounded-lg py-[3px]' onChange={(e) => setSocialMediaLinks(e.target.value)} value={SocialMediaLinks} />

            {Error && <p className='text-red-500'>{Error}</p>}
            <button onClick={() => HandleProfileSave()} className="bg-green-500  hover:bg-green-600 cursor-pointer text-white py-[3px] px-[30px] rounded-lg">Save</button>
          </div>
        </div>
      </div>
    </div>
  )
}
