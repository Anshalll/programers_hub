import React, { useState } from 'react'
import { useSendDataMutation } from '../redux/apis/slice'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import {useProfiledata} from '../hooks/useProfiledata'
import toast from 'react-hot-toast';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch } from 'react-redux';
import {setuserpost} from '../redux/userdata/slice'
import Inputcomment from './Inputcomment';

export default function UpdatePost({setSelectedPost ,  SelectedPost, setUpdate }) {
  const {post} = useProfiledata()
  const [hideLikes, sethideLikes] = useState(SelectedPost.hidelikecount === 0 ? false : true)
  const [AllowComments, setAllowComments] = useState(SelectedPost.allowcomments === 0 ? false : true)
  const [Desc, setDesc] = useState(SelectedPost.description)
  const [Datasend] = useSendDataMutation()
  const dispatch = useDispatch()
  const PostUpdated = () => toast.success("Post updated!", {
    duration: 2000,
    position: 'top-center'
  });

  const ErrorUpdate = () => toast.error("Failed to update.", {
    duration: 2000,
    position: 'top-center'
  });

  const UpdateImageRedux = () => {
    let data = JSON.parse(JSON.stringify(post))
    let postdata = data.find((item) => item.uniqueid === SelectedPost.uniqueid) 
    if (Object.keys(postdata).length > 0) {
      postdata.description = Desc
      postdata.hidelikecount = hideLikes ? 1: 0
      postdata.allowcomments = AllowComments ? 1: 0
      dispatch(setuserpost(data))
      setSelectedPost(postdata)
    }
  }


  const UpdatePost = async () => {
    const formdata = new FormData()
    formdata.append("description", Desc)
    formdata.append("hide_like_count", hideLikes)
    formdata.append("allow_comments", AllowComments)
    formdata.append("uniqueid", SelectedPost.uniqueid)
    const response = await Datasend({ url: "/updatepost", method: "PATCH", data: Object.fromEntries(formdata.entries()) })

    if (response.data) {
      PostUpdated()
      setUpdate(false)
      UpdateImageRedux()
    }
    if (response.error?.data.error) {
      ErrorUpdate()
    }
  }




  return (
    <div className='flex flex-col  text-white w-[50%] h-full gap-[20px]'>


      <Inputcomment Position={"top-[130px]"} row={5} rounded={"lg"} type={"textarea"} ShowBtn={false} Text={Desc} setText={setDesc} placeholder={"Write a description..."} />

     

      <div className="flex flex-col items-center w-full gap-4 mt-3">
        <label className="flex items-center w-full gap-1 cursor-pointer">

          <input
            type="checkbox"
            className=""
            checked={hideLikes}
            onChange={() => sethideLikes(!hideLikes)}
          />
          Hide Like Counts
        </label>
        <label className="flex items-center w-full gap-1 cursor-pointer">

          <input
            type="checkbox"
            className=""
            checked={AllowComments}
            onChange={() => setAllowComments(!AllowComments)}
          />
          Allow comments
        </label>

        {/* <label className="flex items-center w-full gap-1 cursor-pointer">
             
              <input
                type="checkbox"
                className=""
                checked={ShareTocommunity}
                onChange={() => setShareTocommunity(!ShareTocommunity)}
              />
             Share to community
            </label> */}
        <div className='flex items-center gap-[10px] w-full'>

          <button onClick={() => UpdatePost()} className='bg-green-500 text-white rounded-lg px-[15px] py-[3px]'><CheckCircleOutlineIcon sx={{ fontSize: 15 }} /></button>
          <button onClick={() => setUpdate(false)} className='bg-[crimson] text-white rounded-lg px-[15px] py-[3px]'><CloseIcon sx={{ fontSize: 15 }} /></button>
        </div>
      </div>

    </div>
  )
}
