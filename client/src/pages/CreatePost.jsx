import React ,   {useState} from 'react'
import Layout from '../Layout'
import { useSendImagedataMutation } from '../redux/apis/slice'
import toast, { Toaster } from 'react-hot-toast';
import Inputcomment from '../components/Inputcomment';



export default function CreatePost() {


  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [hideLikes, setHideLikes] = useState(false);
  const [AllowComments, setAllowComments] = useState(true);
  const [ShareTocommunity , setShareTocommunity] = useState(false)
  const [Imagetosend , setImagetosend] = useState(null)
  const [PostData] = useSendImagedataMutation()



  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      setImagetosend(file)
    } 
  };


  const ErrorToast = (e) => toast.error(e  , {
    duration: 1500,
    position: "top-center"
  })

  const UploadToast = (e) => toast.success(e  , {
    duration: 1500,
    position: "top-center"
  })


  const handlePostData = async () => {
    if (Imagetosend !== null) {
      let formdata = new FormData()
      formdata.append("post" , Imagetosend)
      formdata.append("description" , description)
      formdata.append("hide_like_count" , hideLikes)
      formdata.append("allow_comments" , AllowComments)
      formdata.append("sharetocommunity" , ShareTocommunity)
      const response = await PostData({  url: '/uploadpost' , method: "POST" , data: formdata })
      if (response.error?.data.error) {
        ErrorToast(response.error?.data.error)

      }
      else{
        setImagetosend(null)
        setImage("")
        setHideLikes(false)
        setAllowComments(true)
        setDescription("")
        setShareTocommunity(false)
        UploadToast("Post uploaded!")
      
      }

    }
    else{
      ErrorToast("Please select a post to upload!")
     
    }
  }


  return (
    <Layout>

    <div className='flex items-center w-full h-full  justify-center'>
    <Toaster/>

    <div className="w-[70%] flex flex-col gap-[20px]  p-4 h-[80%]  rounded-lg shadow-lg bg-black text-white">
      <div className='w-full flex  items-center justify-between'>

      <h2 className="  text-[#FF6500]">Create a Post</h2>
      
      </div>
      
      <div className="flex gap-4 h-full w-full">
        {/* Image Upload Section */}
        <div className="w-1/2  h-[90%] rounded-lg flex items-center justify-center p-2 bg-gray-900">
          {image ? (
            <div className='w-[90%] h-[90%] relative'>

            <img src={image} alt="Uploaded" className="w-full h-full object-contain rounded-lg" />
            </div>
          ) : (
              <div className='relative items-center justify-center flex flex-col w-full h-full'>

              <span className="text-gray-300">+ Upload Image</span>
              <input type="file" className="opacity-0 cursor-pointer w-full h-full absolute" onChange={handleImageUpload} />
              </div>
            
          )}
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
