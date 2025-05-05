import React, { useEffect , useState} from 'react'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import FollowButton from '../FollowButton'
import FollowingButton from '../FollowingButton'
import VerifiedUser from '../../assets/icons/verified.png'
import { useFetchDataQuery } from '../../redux/apis/slice';
import Loading from '../Loading';
import {useProfiledata} from '../../hooks/useProfiledata'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';


export default function HomeFeed() {
    const [UserPosts , setUserPosts] = useState([])
    const { data, isLoading, isError } = useFetchDataQuery("/gethomepost")
    const [SelectedPost, setSelectedPost] = useState(0)

    useEffect(() => {
        if (!isLoading && !isError) {
           console.log(data.posts)
           setUserPosts(data.posts)

        }
    } , [isLoading, isError, data])


    const {data : profiledata} = useProfiledata()

   
  return (
    <>
    
        {isLoading ? <div className='flex w-full h-full items-center justify-center'>
            <Loading/>
        </div> :  UserPosts.map((post, index) => (
            <div key={index} className='p-[20px] gap-[20px] w-[50%] rounded-lg darkcomp flex flex-col '>

                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-[20px]'>
                        <img src={`${import.meta.env.VITE_SERVERURL}/api/sendstatic/dp/${post.dp}`} className='w-[40px] h-[40px] rounded-full object-cover' alt="" />
                        <div className='flex flex-col gap-[1px]'>
                            <p className='flex items-center gap-[10px]'>{post.username} <span>{post.isVerified? <img src={VerifiedUser} className='w-[20px] h-[20px] object-contain' alt="" />  : <></> }</span> </p>
                            {/* <i className='text-gray-300 text-[12px]'>{JSON.parse(post.followedby).length} followers</i> */}
                            <p className='text-gray-300 text-[12px]'>{post.dateposted}</p>
                        </div>
                    </div>

                    {profiledata.username !== post.username ?(post.isfollowing ?  <FollowingButton/> : <FollowButton />) :  <p>You</p> }
                </div>
                
                <div className='w-full'>
                    <p>{post.post_description} {post.tags?.map((vals, index) => (
                        <span key={index} className='text-cyan-500'>#{vals}</span>
                    ))}</p>

                </div>
                <p className='w-full'>{post.description}</p>
                <div className='w-full h-[300px] flex  '>
                    <div className='w-[100px] flex flex-col gap-[20px]'>
                            {post.filename && JSON.parse(post.filename).map((vals, index) => (
                                <div className='' key={index}>
                                    <button onClick={() => setSelectedPost(index)} className={`${SelectedPost === index  && "border-2 border-cyan-500 rounded-lg" }`}><img src={`${import.meta.env.VITE_SERVERURL}/api/sendstatic/post/${vals}`} className='w-[50px] h-[50px] rounded-lg object-cover' alt="" /></button>
                                </div>
                            ))}
                    </div>
                    <img src={`${import.meta.env.VITE_SERVERURL}/api/sendstatic/post/${JSON.parse(post.filename)[SelectedPost]}`} className='rounded-lg object-contain h-full w-full' alt="" />
                </div>

                <div className='flex items-center justify-between w-full'>
                
                        <button className='flex items-center gap-[5px]'>{post.hasliked ? <FavoriteIcon sx={{ fontSize: 16, color: "crimson" }} /> : <FavoriteBorderIcon sx={{ fontSize: 16 }} />} <span>{post.likes}</span> </button>
                        <button><CommentOutlinedIcon sx={{ fontSize: 16 }}/></button>
                        <button><ShareOutlinedIcon sx={{ fontSize: 16 }}/></button>
                        <button><BookmarkBorderOutlinedIcon sx={{ fontSize: 16 }}/></button>
                </div>
            </div>

        )) }
    </>
  )
}
