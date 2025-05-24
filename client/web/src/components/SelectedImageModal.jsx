import { useEffect, useState, useRef } from 'react'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import { useProfiledata } from '../hooks/useProfiledata'
import { skipToken } from '@reduxjs/toolkit/query';
import { useSendDataMutation, useFetchDataQuery } from '../redux/apis/slice';
import toast, { Toaster } from 'react-hot-toast';
import UpdatePost from './UpdatePost';
import FavoriteIcon from '@mui/icons-material/Favorite';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import HandlePostLike from '../shared/HandlePostLike';
import Comments from './Comments';
import { setComments, setReplies } from '../redux/post/slice';
import { useDispatch } from 'react-redux';
import { usePostSliceData } from '../hooks/usePostSliceData'
import Loading from './Loading';


export default function SelectedImageModal({ userPosts: post, setselecteduserImage, selecteduserImage }) {

  const dispatch = useDispatch()
  const [Desc, setDesc] = useState("")
  const { data } = useProfiledata()
  const [isAdmin, setisAdmin] = useState(false)
  const [Datasend] = useSendDataMutation()
  const Optref = useRef(null)
  const [isOpen, setisOpen] = useState(false)
  const [Update, setUpdate] = useState(false)
  const { comments: PostComments, replies: PostReplies } = usePostSliceData()

  const [selectedImage, setSelectedImage] = useState({})
  const [ActiveIndex, setActiveIndex] = useState(0)
  const [IsPostLiked, setisPostLiked] = useState(false)

  const { isLoading, error, data: fetchedpostdata } = useFetchDataQuery(
    post[selecteduserImage] ? `/getpostdata/${post[selecteduserImage]?.uniqueid}/` : skipToken
  );


  useEffect(() => {
    if (fetchedpostdata?.comments) {
      dispatch(setComments(fetchedpostdata.comments))
    } else {
      dispatch(setComments([]))
    }

    if (fetchedpostdata?.replies) {
      dispatch(setReplies(fetchedpostdata.replies))
    } else {
      dispatch(setReplies([]))
    }
  }, [fetchedpostdata, dispatch])

  useEffect(() => {
    if (!isLoading && !error && fetchedpostdata) {

      setisPostLiked(fetchedpostdata.hasliked)

    }
  }, [isLoading, error, fetchedpostdata])


  const HandlePostClose = () => {
    setSelectedImage({})
    setselecteduserImage(null)
  }

  useEffect(() => {

    if (selecteduserImage !== null && selecteduserImage >= 0) {

      setSelectedImage(post[selecteduserImage])

    }


  }, [selecteduserImage, post])

  const clipboardcopy = () => toast.success('Copied to clipboard', {
    duration: 2000,
    position: 'top-center'
  });



  useEffect(() => {
    const locateuser = new URLSearchParams(window.location.search)
    let user = locateuser.get("user")
    if (user && data.username && data.username === user) {
      setisAdmin(true)
    }
  }, [data])

  const HandleMoreVert = () => {
    setisOpen(!isOpen)
  }

  const HandleDeletePost = async (uniqueid) => {

    if (uniqueid.trim() !== "") {

      const response = await Datasend({ url: "/deletepost", method: "DELETE", data: { uniqueid } })
      if (response.data) {
        window.location.reload()
      }
      if (response.error?.data.error) {
        alert(response.error.data.error)
      }
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (Optref.current && !Optref.current.contains(event.target)) {
        setisOpen(false)

      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])


  useEffect(() => {

    if (Object.keys(selectedImage).length > 0) {


      setDesc(selectedImage.description.slice(0, 200))

    }
  }, [selectedImage])

  const MoreDesc = () => {
    if (selectedImage.description) {
      setDesc(selectedImage.description)
    }
  }

  const LessDesc = () => {
    if (selectedImage.description) {
      setDesc(selectedImage.description.slice(0, 200))
    }
  }

  const CopyLink = (id) => {
    const link = `${import.meta.env.VITE_SERVERURL}/api/sendstatic/post/${id}`
    navigator.clipboard.writeText(link)
      .then(() => {

        clipboardcopy()
        setisOpen(false)
      })
      .catch((error) => {
        console.error("Error copying link: ", error)
      })
  }

  useEffect(() => {
    if (!Update) {
      setisOpen(false)
    }
  }, [Update])


  const PostLike = async (action) => {
    const { post, postlike } = await HandlePostLike(action, Datasend, selectedImage, data, setSelectedImage)
    setSelectedImage(post)
    setisPostLiked(postlike)

  }




  const HandleSelectedImage = (index) => {
    setselecteduserImage(index)

  }



  return (
    <>
      {Object.keys(selectedImage).length > 0 && !isLoading && <div className='w-[900px] relative p-[10px] gap-[20px] flex items-center justify-center rounded-lg h-[90%] bg-black'>

        {selecteduserImage !== null && selecteduserImage > 0 ? <button onClick={() => HandleSelectedImage(selecteduserImage - 1)} className="absolute left-[-10px] hover:text-[#FF6500] text-white bg-gray-900 rounded-full"><NavigateBeforeIcon /></button> : <></>}

        <div className='w-[50%] h-full'>
          <Toaster />
          <div className='flex gap-[10px] items-center w-full h-[80%]'>

            <div className='Scroller w-[15%] flex flex-col gap-[10px] h-[80%] overflow-y-auto'>
              {JSON.parse(selectedImage.filename).map((value, index) => (
                <div key={index}>

                  <button onClick={() => setActiveIndex(index)} className={`${ActiveIndex === index ? "border-2 border-[#FF6500]" : ""} w-[50px] h-[50px] rounded-lg object-cover`}>
                    <img src={`${import.meta.env.VITE_SERVERURL}/api/sendstatic/post/${value}`} className='h-full rounded-lg w-full object-cover' alt="" />
                  </button>
                </div>
              ))}
            </div>

            <img src={`${import.meta.env.VITE_SERVERURL}/api/sendstatic/post/${JSON.parse(selectedImage.filename)[ActiveIndex]}`} className="w-[85%] h-[80%] object-contain" alt="" />
          </div>

          <div className='w-full mt-[20px] h-[20%] flex flex-col items-center justify-between '>
            {selectedImage.description.trim() !== "" ? <p className='w-full text-white rounded-b-2 p-[10px] shadow-lg bg-gray-900'>{Desc}{(selectedImage.description.length > 200 && Desc.length <= 200) ? <span className='text-[#FF6500] cursor-pointer' onClick={() => MoreDesc()}>more</span> : selectedImage.description.length > 200 && Desc.length > 200 ? <span className='text-[#FF6500] cursor-pointer' onClick={() => LessDesc()}>less</span> : <></>} </p> : <></>}
            <div className='flex w-full  text-white justify-between items-center gap-[20px]'>

              <button onClick={() => PostLike(IsPostLiked ? "unlike" : "like", Datasend, selectedImage, setisPostLiked, data, setSelectedImage)} className='flex cursor-pointer items-center gap-[3px]'> {IsPostLiked ? <FavoriteIcon sx={{ fontSize: 16, color: "crimson" }} /> : <FavoriteBorderIcon sx={{ fontSize: 16 }} />} {selectedImage.hidelikecount !== 1 ? selectedImage.likes : <></>}</button>

              <button className='flex cursor-pointer items-center gap-[3px]'><ShareIcon sx={{ fontSize: 16 }} />{selectedImage.shares}</button>


              {selectedImage.allowcomments === 1 ? <button className='flex cursor-pointer items-center gap-[3px]'><CommentOutlinedIcon sx={{ fontSize: 16 }} />{PostComments.length + PostReplies.length}</button> : <></>}

              <button><SendOutlinedIcon sx={{ fontSize: 16 }} /></button>
            </div>

            <p className='text-gray-300 w-full text-[10px]'>{selectedImage.dateposted}</p>

          </div>

        </div>

        {!Update ? <div className='flex flex-col  text-white w-[50%] h-full gap-[20px]'>
          <div className='w-full flex border-b border-[#FF6500] items-center h-[30px] justify-between'>
            <div ref={Optref} className='flex flex-col relative'>

              <button onClick={() => HandleMoreVert()} className='cursor-pointer'><MoreVertOutlinedIcon sx={{ fontSize: 16 }} /></button>
              {isOpen ? <span className='flex flex-col gap-[10px] rounded-lg w-[100px] absolute top-[20px] bg-gray-800 p-[5px]'>
                <button onClick={() => CopyLink(selectedImage.filename)} className='hover:text-gray-200 text-[11px] text-white flex w-full items-center gap-[10px]'><InsertLinkIcon sx={{ fontSize: 16 }} />Copy link</button>


                {isAdmin ? <button onClick={() => setUpdate(true)} className='hover:text-gray-300 text-[11px] text-white flex w-full items-center gap-[10px]'><ModeEditOutlinedIcon sx={{ fontSize: 16 }} />Edit</button> : <></>}
                {isAdmin ? <button onClick={() => HandleDeletePost(selectedImage.uniqueid)} className='hover:text-red-700 text-[crimson] text-[11px]  flex w-full items-center gap-[10px]'><DeleteOutlineIcon sx={{ fontSize: 16 }} />Delete</button> : <></>}
              </span> : <></>}
            </div>
            <button className='cursor-pointer' onClick={() => HandlePostClose()}><CloseOutlinedIcon sx={{ fontSize: 16 }} /></button>
          </div>
          <div className='h-[calc(100%-20px)] flex flex-col gap-[20px]'>


            <p className='font-bold h-[40px]'>Comments</p>

            {selectedImage.allowcomments === 1 ? (isLoading ? 
              <div className='w-full flex items-center  h-[calc(100%-40px)] justify-center'>

              <Loading/> 
              </div>
              
              :  <Comments belongsto={selectedImage.belongsto} styling={"w-full h-[calc(100%-40px)]"} comments={fetchedpostdata.comments} postid={selectedImage.uniqueid} /> ): <p className='w-full h-full flex items-center justify-center font-bold text-xl'>Comments not allowed! </p> }


          </div>



        </div> : <UpdatePost setSelectedPost={setSelectedImage} SelectedPost={selectedImage} setUpdate={setUpdate} />
        }

        {(selecteduserImage !== null && selecteduserImage < post.length - 1) && <button onClick={() => HandleSelectedImage(selecteduserImage + 1)} className="absolute right-[-10px] hover:text-[#FF6500] text-white bg-gray-900 rounded-full"><NavigateNextIcon /></button>}




      </div>}
    </>

  )
}
