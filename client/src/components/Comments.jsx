import React, { useEffect, useState , useRef } from 'react'
import { useFetchDataQuery, useSendDataMutation } from '../redux/apis/slice'
import toast, { Toaster } from 'react-hot-toast';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useProfiledata } from '../hooks/useProfiledata'
import { pink } from '@mui/material/colors';
import Loading from '../components/Loading'
import FavoriteIcon from '@mui/icons-material/Favorite';
import { setpostcomments } from '../redux/userdata/slice'
import { useDispatch } from 'react-redux';
import PushPinIcon from '@mui/icons-material/PushPin';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';


export default function Comments({ SelectedImage }) {

  const menuRef = useRef([]);

  const { isLoading, error, data, refetch } = useFetchDataQuery(`/getcomments/${SelectedImage.uniqueid}/`)
  const [Send_data] = useSendDataMutation()
  const { data: userdata, comments: Comments } = useProfiledata()
  const dispatch = useDispatch()
  const [isAdmin, setisAdmin] = useState(false)
  const [isOpenCommentop, setisOpenCommentop] = useState({ isOpen: false, id: null })


  const ErrorFetchingComments = () => toast.error("An error occured!", {
    duration: 1500,
    position: 'top-center'
  });

  const Errordeletingcomment = () => toast.error("An error occured!", {
    duration: 1500,
    position: 'top-center'
  });


  const CommentDeleted = () => toast.success("Comment deleted!", {
    duration: 1500,
    position: 'top-center'
  });



  const HandleCommentDelete = async (commentid , userid) => {

    const response = await Send_data({ url: "/comments", method: "DELETE", data: { commentid, userid , postid: SelectedImage.uniqueid } })
    if (response.data) {
      let coms = JSON.parse(JSON.stringify(Comments))
      let findings = coms.filter((e) => e.uniqueid !== commentid)
      dispatch(setpostcomments(findings))
      CommentDeleted()
    }
    else{
      Errordeletingcomment()
    }



  }
  

  useEffect(() => {
    if (SelectedImage.belongsto === userdata.id) {
      setisAdmin(true)
    }
    else {
      setisAdmin(false)
    }
  }, [SelectedImage, userdata])


  useEffect(() => {
    const handleClickOutside = (event) => {
      let clickedOutside = true;


      menuRef.current.forEach((ref) => {
        if (ref && ref.contains(event.target)) {
          clickedOutside = false;
        }
      });

      if (clickedOutside) {
        setisOpenCommentop({ isOpen: false, id: null });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const HandleCommOpts = (id) => {

    setisOpenCommentop({ isOpen: true, id })
  }


  const ErrorWhileLiking = () => toast.error("An error occured!", {
    duration: 1500,
    position: 'top-center'
  });


  useEffect(() => {
    if (SelectedImage.allowcomments === 1) {
      if (error) {
        ErrorFetchingComments()
      }

      if (!isLoading) {
        refetch()
        dispatch(setpostcomments(data.comments))
      }

    }
  }, [SelectedImage, isLoading, data, error, dispatch, refetch])

  const HandleCommentLike = async (type, id, action) => {

    const response = await Send_data({ url: "/likecomment", method: "POST", data: { type, id, action } })
    if (response.error) {
      ErrorWhileLiking()
    }
    if (response.data) {
      let coms = JSON.parse(JSON.stringify(Comments))
      let findings = coms.find((e) => e.uniqueid === id)
      if (action === "like") {

        findings.likes = findings.likes + 1
        findings.likedby = userdata.id

      }
      if (action === "unlike") {
        findings.likes = findings.likes - 1
        findings.likedby = null
      }

      dispatch(setpostcomments(coms))


    }

  }

  return (
    <div className='Scroller flex text-white flex-col gap-[10px] w-full overflow-y-auto h-full'>
      {Comments.length > 0 ? (
        isLoading ? (
          <div className='w-full flex items-center justify-center'>
            <Loading />
          </div>
        ) : (
          Comments.map((value, index) => (
            <div key={index} className='flex w-full'>
              <div className='flex gap-[20px] w-full'>
                <img
                  className='w-[25px] h-[25px] object-cover rounded-full'
                  src={`${import.meta.env.VITE_SERVERURL}/api/sendstatic/dp/${value.dp}`}
                  alt=''
                />
                <div className='flex flex-col gap-[3px] w-full'>
                  <a
                    className='text-[9px] text-gray-300'
                    href={`${import.meta.env.VITE_CLIENTLOCAL}/profile?user=${value.username}`}
                  >
                    {value.username}
                  </a>
                  <p className='text-[10px]'>{value.message}</p>
                  <div className='w-full flex items-center gap-[10px]'>
                    <button className='text-[9px] text-gray-300 font-light'>
                      Reply
                    </button>
                    <p className='text-[9px] text-[#FF6500] font-light'>
                      {value.postedon}
                    </p>
                  </div>
                </div>
                <div className='flex flex-col items-center gap-[3px]'>
                  {(isAdmin || value.uid === userdata.id) && (
                    <div className='flex relative' ref={(el) => (menuRef.current[index] = el)}>
                      <button
                        onClick={() => HandleCommOpts(index)}
                        className='text-[#FF6500]'
                      >
                        <MoreVertIcon sx={{ fontSize: 11 }} />
                      </button>
                      {isOpenCommentop.isOpen && index === isOpenCommentop.id ? (
                        <div className='absolute w-[60px] flex flex-col gap-[10px] p-[7px] bg-gray-800 rounded-md right-[20px] text-[9px] text-white'>
                          {isAdmin && (
                            <button   className='flex items-center gap-[3px]'>
                              <PushPinIcon sx={{ fontSize: 10 }} /> Pin
                            </button>
                          )}
                          {(isAdmin || value.uid === userdata.id) && (
                            <button onClick={() => HandleCommentDelete(value.uniqueid , userdata.id)}  className='flex text-[crimson] items-center gap-[3px]'>
                              <DeleteOutlineIcon sx={{ fontSize: 10 }} /> Delete
                            </button>
                          )}
                        </div>
                      ) : null}
                    </div>
                  )}
                  {value.likedby !== userdata.id ? (
                    <button
                      onClick={() =>
                        HandleCommentLike("comment", value.uniqueid, "like")
                      }
                    >
                      <FavoriteBorderOutlinedIcon sx={{ fontSize: 11 }} />
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        HandleCommentLike("comment", value.uniqueid, "unlike")
                      }
                    >
                      <FavoriteIcon sx={{ fontSize: 11, color: pink[500] }} />
                    </button>
                  )}
                  {value.likes > 0 && (
                    <p className='text-white text-[9px]'>{value.likes}</p>
                  )}
                </div>
              </div>
            </div>
          ))
        )
      ) : (
        <div className='w-full flex h-full items-center justify-center'>
          <h1 className='font-bold text-lg'>No comments</h1>
        </div>
      )}
      <Toaster />
    </div>
  );
}
