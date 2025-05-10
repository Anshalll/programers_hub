import React, { useEffect, useState } from 'react'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import VerifiedUser from '../../assets/icons/verified.png'
import { useFetchDataQuery, useSendDataMutation } from '../../redux/apis/slice';
import Loading from '../Loading';
import { useProfiledata } from '../../hooks/useProfiledata'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HandlePostLike from '../../shared/HandlePostLike';
import useFollowunfollow from '../../hooks/useFollowunfollow'
import { useDispatch } from 'react-redux';
import { setudata } from '../../redux/userdata/slice';
import PostComments from './FetchPostComments';

export default function HomeFeed() {

    const [UserPosts, setUserPosts] = useState([])
    const { data, isLoading, isError } = useFetchDataQuery("/gethomepost")
    const [ShowComments, setShowComments] = useState({ isOpen: false, postid: "" })
    const [SelectedPost, setSelectedPost] = useState(0)
    const [Datasend] = useSendDataMutation()
    const { FollowUser, UnfollowUser } = useFollowunfollow()
    const dispatch = useDispatch()
    const { data: profiledata } = useProfiledata()
    const [FollowLoading, setFollowLoading] = useState({ loading: false , user: "" })

    useEffect(() => {
        if (!isLoading && !isError) {

            setUserPosts(data.posts)

        }
    }, [isLoading, isError, data])

    const HandleFeedPostLike = async (type, value) => {


        const { post, postlike } = await HandlePostLike(type, Datasend, value, profiledata)
        if (post) {
            setUserPosts((prev) => prev.map((vals) => {
                if (vals.uniqueid === post.uniqueid) {
                    post.hasliked = postlike ? profiledata.id : null
                    return post
                } else {
                    return vals
                }
            }))
        }

    }


    const HandleFollow = async (value) => {
        setFollowLoading({  loading: true , user: value })
        const response = await FollowUser(value)
        if (response.data) {
            let user_data = JSON.parse(JSON.stringify(profiledata))
            let follows = JSON.parse(user_data.follows) || []
            if (!follows || !follows.includes(value)) {
                follows.push(value)
                user_data.follows = JSON.stringify(follows)
                dispatch(setudata(user_data))
            }


        }
        setFollowLoading({  loading: false , user: "" })


    }

    const HandleUnfollow = async (value) => {
        setFollowLoading({  loading: true , user: value })
        const response = await UnfollowUser(value)
        if (response.data) {
            let user_data = JSON.parse(JSON.stringify(profiledata))
            user_data.follows = JSON.stringify(JSON.parse(user_data.follows).filter((vals) => vals !== value))
            dispatch(setudata(user_data))
        }
        setFollowLoading({  loading: false , user: "" })
    }

    const DisplayComment = (postid) => {
        setShowComments({ isOpen: true, postid: postid })
        

    }

    return (
        <>

            {isLoading ? <div className='flex w-full h-full items-center justify-center'>
                <Loading />
            </div> : UserPosts.map((post, index) => (
                <div key={index} className='p-[20px] gap-[20px] w-[50%] rounded-lg darkcomp flex flex-col '>

                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-[20px]'>
                            <img src={`${import.meta.env.VITE_SERVERURL}/api/sendstatic/dp/${post.dp}`} className='w-[40px] h-[40px] rounded-full object-cover' alt="" />
                            <div className='flex flex-col gap-[1px]'>
                                <p className='flex items-center gap-[10px]'>{post.username} <span>{post.isVerified ? <img src={VerifiedUser} className='w-[20px] h-[20px] object-contain' alt="" /> : <></>}</span> </p>
                                <p className='text-gray-300 text-[12px]'>{post.dateposted}</p>
                            </div>
                        </div>


                        {FollowLoading.loading && FollowLoading.user === post.username ? (<Loading/>) :  (profiledata.username !== post.username ? (profiledata.follows && JSON.parse(profiledata.follows).includes(post.username) ? <button className='bg-green-500 rounded-lg  p-[7px]' onClick={() => HandleUnfollow(post.username)}>Unfollow</button> : <button className='bg-[#FF6500] text-white p-[7px] rounded-lg' onClick={() => HandleFollow(post.username)}>Follow</button>) : <p>You</p>)}
                    </div>

                    <div className='w-full'>
                        <p>{post.post_description} {post.tags?.map((vals, index) => (
                            <span key={index} className='text-cyan-500'>#{vals}</span>
                        ))}</p>

                    </div>
                    <p className='w-full'>{post.description}</p>
                    <div className='w-full h-[300px] flex  '>
                       { post.filename && JSON.parse(post.filename).length > 1 &&  <div className='w-[100px] flex flex-col gap-[20px]'>
                            {  JSON.parse(post.filename).map((vals, index) => (
                                <div className='' key={index}>
                                    <button onClick={() => setSelectedPost(index)} className={`${SelectedPost === index && "border-2 border-cyan-500 rounded-lg"}`}><img src={`${import.meta.env.VITE_SERVERURL}/api/sendstatic/post/${vals}`} className='w-[50px] h-[50px] rounded-lg object-cover' alt="" /></button>
                                </div>
                            ))}
                        </div>}
                        <img src={`${import.meta.env.VITE_SERVERURL}/api/sendstatic/post/${JSON.parse(post.filename)[SelectedPost]}`} className='rounded-lg object-contain h-full w-full' alt="" />
                    </div>

                    <div className='flex items-center justify-between w-full'>

                        <button onClick={() => HandleFeedPostLike(post.hasliked === profiledata.id ? "unlike" : "like", post
                        )} className='flex items-center gap-[5px]'>{post.hasliked === profiledata.id ? <FavoriteIcon sx={{ fontSize: 16, color: "crimson" }} /> : <FavoriteBorderIcon sx={{ fontSize: 16 }} />} <span>{post.likes}</span> </button>
                        <button onClick={() => DisplayComment(post.uniqueid)}><CommentOutlinedIcon sx={{ fontSize: 16 }} /></button>

                        <button><ShareOutlinedIcon sx={{ fontSize: 16 }} /></button>
                        <button><BookmarkBorderOutlinedIcon sx={{ fontSize: 16 }} /></button>
                    </div>

                    {ShowComments.isOpen && ShowComments.postid === post.uniqueid ? <PostComments postid={post.uniqueid} /> : <></>}
                </div>

            ))}
        </>
    )
}
