import React, { useState } from 'react'
import Layout from '../Layout'
import { useSendImagedataMutation } from '../redux/apis/slice'
import toast, { Toaster } from 'react-hot-toast';
import Inputcomment from '../components/Inputcomment';
import CreatePostUploaded from '../components/CreatePostUploaded';


export default function CreatePost() {



  const [description, setDescription] = useState("");
  const [hideLikes, setHideLikes] = useState(false);
  const [AllowComments, setAllowComments] = useState(true);
  const [ShareTocommunity, setShareTocommunity] = useState(false)
  const [Imagetosend, setImagetosend] = useState([])
  const [PostData] = useSendImagedataMutation()
  const [UploadedArr, setUploadedArr] = useState([])
  const [ActiveImage, setActiveImage] = useState(null)

  const handleImageUpload = (e) => {

    if (Object.keys(e.target.files).length > 0) {
      for (let imgs of e.target.files) {
        if (imgs) {
          const imgreaded = URL.createObjectURL(imgs)
          setUploadedArr((prev) => [...prev, imgreaded])
          setImagetosend((prev) => [...prev, imgs])
          
        }
      }
    }
  };


  const ErrorToast = (e) => toast.error(e, {
    duration: 1500,
    position: "top-center"
  })

  const UploadToast = (e) => toast.success(e, {
    duration: 1500,
    position: "top-center"
  })


  const handlePostData = async () => {
    if (Imagetosend.length !== 0) {
      let formdata = new FormData()
      Imagetosend.forEach((image) => {
        formdata.append("post", image)

      })
      formdata.append("description", description)
      formdata.append("hide_like_count", hideLikes)
      formdata.append("allow_comments", AllowComments)
      formdata.append("sharetocommunity", ShareTocommunity)
      const response = await PostData({ url: '/uploadpost', method: "POST", data: formdata })
      if (response.error?.data.error) {
        ErrorToast(response.error?.data.error)

      }
      else {
        setImagetosend(null)
        setActiveImage(null)
        setHideLikes(false)
        setAllowComments(true)
        setDescription("")
        setShareTocommunity(false)
        UploadToast("Post uploaded!")
        setUploadedArr([])
      }

    }
    else {
      ErrorToast("Please select a post to upload!")

    }
  }



  const RemovePost = async (index) => {
   
    setUploadedArr((prev) => prev.filter((_, key) => key !== index));
    setImagetosend((prev) => prev.filter((_, key) => key !== index));
    if (UploadedArr.length === 1) {
      setActiveImage(null)
    }
  }
 


  return (
    <Layout>

      <div className='flex items-center w-full h-full  justify-center'>
        <Toaster />

        <div className="w-[70%] flex flex-col gap-[20px]  p-4 h-[80%]  rounded-lg shadow-lg bg-black text-white">
          <div className='w-full flex  items-center justify-between'>

            <h2 className="  text-[#FF6500]">Create a Post</h2>

          </div>

          <div className="flex gap-4 h-full w-full">
            {/* Image Upload Section */}
            <div className='flex flex-col gap-[10px] w-1/2 h-full'>

              <div className="w-full h-[80%]  rounded-lg flex items-center justify-center  bg-gray-900">
                {ActiveImage !== null  ? (
                  <div className='w-[90%] h-[90%] '>
                     
                    <img src={UploadedArr[ActiveImage]} alt="Uploaded" className="w-full h-full object-contain rounded-lg" />
                  </div>
                ) : (
                  <div className='relative items-center justify-center flex flex-col w-full h-[90%]'>

                    <span className="text-gray-300">+ Upload Image</span>
                    <input type="file" className="opacity-0 cursor-pointer w-full h-full absolute" onChange={handleImageUpload} multiple accept="image/png , image/jpeg , image/gif" />
                  </div>

                )}
              </div>
              {UploadedArr.length > 0 && <div className='w-full h-[20%] flex items-center'>

                <CreatePostUploaded RemovePost={RemovePost} ActiveImage={ActiveImage} setActiveImage={setActiveImage} images={UploadedArr} />
              </div>}
            </div>

            {/* Post Details Section */}
            <div className="w-2/3">


              <Inputcomment Position={"top-[130px]"} row={5} rounded={"lg"} type={"textarea"} ShowBtn={false} Text={description} setText={setDescription} placeholder={"Write a description..."} />

              <div className="flex flex-col items-center w-full gap-4 mt-3">
                <label className="flex items-center w-full gap-1 cursor-pointer">

                  <input
                    type="checkbox"
                    className=""
                    checked={hideLikes}
                    onChange={() => setHideLikes(!hideLikes)}
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

                <label className="flex items-center w-full gap-1 cursor-pointer">

                  <input
                    type="checkbox"
                    className=""
                    checked={ShareTocommunity}
                    onChange={() => setShareTocommunity(!ShareTocommunity)}
                  />
                  Share to community
                </label>

              </div>
              <div className='flex items-center gap-[20px]'>

                <button onClick={() => handlePostData()} className="mt-4 bg-[#FF6500] text-white px-[30px] py-[5px] rounded-lg ">
                  Post
                </button>

                <button className='mt-4 text-[#FF6500] px-[20px] py-[5px] hover:rounded-lg hover:border hover:border-[#FF6500]'>Save as draft</button>

              </div>

            </div>
          </div>
        </div>
      </div>


    </Layout>
  )
}
