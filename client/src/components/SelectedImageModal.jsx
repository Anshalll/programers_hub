import React, { useEffect , useState } from 'react'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import {useProfiledata} from '../hooks/useProfiledata'
import { useSendDataMutation } from '../redux/apis/slice';
export default function SelectedImageModal({setSelectedPost,  selectedImage }) {


  const [Desc, setDesc] = useState("")
  const {data} = useProfiledata()
  const [isAdmin , setisAdmin] = useState(false)
  const [Datasend] = useSendDataMutation()

  useEffect(() => {
    const locateuser = new URLSearchParams(window.location.search)
    let user = locateuser.get("user")
    if (user && data.username && data.username === user) {
      setisAdmin(true)
    }
  } , [data])

  const HandleDeletePost = async (uniqueid) => {
    
    if(uniqueid.trim() !== ""){
      
      const response  = await Datasend({ url: "/deletepost" , method:"POST"  , data: {uniqueid} })
      if (response.data) {
          window.location.reload()
      }
      if (response.error?.data.error) {
          alert(response.error.data.error)
      }
    }
  }

  useEffect(() => {
    if (Object.keys(selectedImage).length > 0) {
      

          setDesc(selectedImage.description.slice(0 , 200))
       
    }
  } , [selectedImage])
  
  const MoreDesc = () => {
    if (selectedImage.description) {
      setDesc(selectedImage.description)
    }
  }

  const LessDesc = () => {
    if (selectedImage.description) {
      setDesc(selectedImage.description.slice(0,200))
    }
  }

  return (

    <div className='w-[700px] p-[10px] gap-[20px] flex items-center justify-center rounded-lg h-[500px] bg-black'>

      <div className='w-[50%] h-full'>

        <img  src={`${import.meta.env.VITE_SERVERURL}/api/sendstatic/post/${selectedImage.filename}`} className="w-full h-[90%] object-cover" alt="" />
        <div className='flex mt-[20px] text-white items-center gap-[20px]'>
         {  <button className='flex cursor-pointer items-center gap-[3px]'><FavoriteBorderIcon sx={{ fontSize: 16 }} />{selectedImage.hidelikecount !== 1 ?  selectedImage.likes : <></>}</button>}
          <button className='flex cursor-pointer items-center gap-[3px]'><ShareIcon sx={{ fontSize: 16 }} />{selectedImage.shares}</button>
         {selectedImage.allowcomments ?  <button className='flex cursor-pointer items-center gap-[3px]'><CommentOutlinedIcon sx={{ fontSize: 16 }} />440</button> : <></>}
          <button><SendOutlinedIcon sx={{ fontSize: 16 }} /></button>
        </div>
      </div>

      <div className='flex flex-col  text-white w-[50%] h-full gap-[20px]'>

        <div className='w-full flex border-b border-[#FF6500] items-center h-[30px] justify-between'>
          <div className='flex flex-col relative'>

          <button className='cursor-pointer'><MoreVertOutlinedIcon sx={{ fontSize: 16 }} /></button>
          <span className='flex flex-col gap-[10px] rounded-lg w-[100px] absolute top-[20px] bg-gray-800 p-[5px]'>
            <button className='hover:text-gray-200 text-[11px] text-white flex w-full items-center gap-[10px]'><InsertLinkIcon sx={{  fontSize: 16 }}/>Copy link</button>
           {isAdmin ?  <button className='hover:text-gray-300 text-[11px] text-white flex w-full items-center gap-[10px]'><ModeEditOutlinedIcon sx={{  fontSize: 16 }}/>Edit</button> : <></>}
          {isAdmin ?   <button onClick={() => HandleDeletePost(selectedImage.uniqueid)} className='hover:text-red-700 text-[crimson] text-[11px]  flex w-full items-center gap-[10px]'><DeleteOutlineIcon  sx={{  fontSize: 16 }}/>Delete</button> : <></>}
          </span>
          </div>
          <button className='cursor-pointer' onClick={() => setSelectedPost({})}><CloseOutlinedIcon sx={{ fontSize: 16 }} /></button>
        </div>
        <div className='h-[calc(100%-20px)]  overflow-y-auto flex flex-col gap-[20px]'>

        {selectedImage.description.trim() !== "" ?   <p>{Desc}...{(selectedImage.description.length > 200 && Desc.length <= 200) ?  <span className='text-[#FF6500] cursor-pointer' onClick={() => MoreDesc()}>more</span>: selectedImage.description.length  > 200 && Desc.length > 200 ?  <span className='text-[#FF6500] cursor-pointer' onClick={() => LessDesc()}>less</span> : <></>} </p> :  <></>}

         {selectedImage.allowcomments !== 0 ?  <div className='flex text-[12px]  text-gray-300 flex-col gap-[20px]'>
            <p>Comment 1</p>
            <p>Comment 1</p>
            <p>Comment 1</p>
            <p>Comment 1</p>
            <p>Comment 1</p>
            <p>Comment 1</p>
            <p>Comment 1</p>
            <p>Comment 1</p>
            <p>Comment 1</p>
            <p>Comment 1</p>
          </div> : <></>}

        </div>


      </div>

    </div>

  )
}
