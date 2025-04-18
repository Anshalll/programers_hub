import React, { useRef , useState , useEffect } from 'react'
import { pink } from '@mui/material/colors'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

export default function CommentReplies({userid , HandleReplyDelete , HandleReplyLike , HandleReplyState ,  PostReplies , value }) {

  const replyRef = useRef([])
  const [isOpenReply, setisOpenReply] = useState({isOpen: false, id: null})


  
  const HandleReplyComp = (id) => {

    setisOpenReply({ isOpen: true, id })
  }


  useEffect(() => {
      const handleClickOutside = (event) => {
        let clickedOutside = true;
  
  
        replyRef.current.forEach((ref) => {
          if (ref && ref.contains(event.target)) {
            clickedOutside = false;
          }
        });
  
        if (clickedOutside) {
          setisOpenReply({ isOpen: false, id: null });
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
  
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);



  return (
    
    <div className='flex  flex-col text-[9px] gap-[20px] px-[50px]'>

    {PostReplies.map((replyvalue, index) => (
      replyvalue.cid === value.uniqueid && <div key={index} className=''>
        <div className='flex  gap-[10px] w-full'>
          <img className='w-[20px] h-[20px] rounded-full object-cover' src={`${import.meta.env.VITE_SERVERURL}/api/sendstatic/dp/${replyvalue.dp}`} alt="" />
          <div className='w-full items-center flex justify-between'>

            <div className='flex flex-col gap-[10px]'>

              <p>  {replyvalue.username}</p>
              <p className='flex itme-center gap-[3px]'><span className='replyuser p-[2px]'>@{replyvalue.mentioneduser}</span>{replyvalue.message}</p>
              <div className='w-full flex items-center gap-[10px]'>
                <button onClick={() => HandleReplyState(replyvalue.username, replyvalue.pid, replyvalue.cid)} className='text-[9px] text-gray-300 font-light'>
                  Reply
                </button>

                <p className='text-[9px]  text-[#FF6500] font-light'>
                  {replyvalue.postedon}
                </p>
              </div>

            </div>

            <div className='flex flex-col items-center gap-[3px]'>
              {/* {(isAdmin || replyvalue.whoReplied === userdata.username) && */}
              
              
              {/* ( */}
                <div className='flex relative' ref={(el) => (replyRef.current[index] = el)}>
                  <button
                    onClick={() => HandleReplyComp(index)}
                    className='text-[#FF6500]'
                  >
                    <MoreVertIcon sx={{ fontSize: 11 }} />
                  </button>
                  {isOpenReply.isOpen && index === isOpenReply.id ? (
                    <div className='absolute w-[60px] flex flex-col gap-[10px] p-[7px] bg-gray-800 rounded-md right-[20px] text-[9px] text-white'>

                   
                        <button onClick={() => HandleReplyDelete(replyvalue.uniqueid , replyvalue.pid)} className='flex text-[crimson] items-center gap-[3px]'>
                          <DeleteOutlineIcon sx={{ fontSize: 10 }} /> Delete
                        </button>
                   
                    </div>
                  ) : null}
                </div>
              {/* )
              
              } */}


              {replyvalue.hasliked === userid ? <button
                onClick={() =>
                  HandleReplyLike(replyvalue.uniqueid, "unlike")
                }
              >
                <FavoriteIcon sx={{ fontSize: 11, color: pink[500] }} />
              </button>
                : <button onClick={() => HandleReplyLike(replyvalue.uniqueid, "like")}

                >
                  <FavoriteBorderOutlinedIcon sx={{ fontSize: 11 }} />
                </button>}
              <p className='text-white text-[9px]'>{replyvalue.likes}</p>
            </div>

          </div>

        </div>
      </div>
    ))}
  </div>
  )
}
