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
import Comments from '../Comments';
import { skipToken } from '@reduxjs/toolkit/query';
import { setComments, setReplies } from '../../redux/post/slice'
import { usePostSliceData } from '../../hooks/usePostSliceData'
import CloseIcon from '@mui/icons-material/Close';
import { Toaster } from 'react-hot-toast';
export default function HomeFeed() {

    const [UserPosts, setUserPosts] = useState([])
    const { data, isLoading, isError } = useFetchDataQuery("/gethomepost")
    const [ShowComments, setShowComments] = useState({ isOpen: false, id: "" })
    const [SelectedPost, setSelectedPost] = useState(0)
    const [Datasend] = useSendDataMutation()
    const { FollowUser, UnfollowUser } = useFollowunfollow()
    const dispatch = useDispatch()
    const { data: profiledata } = useProfiledata()
    const [FollowLoading, setFollowLoading] = useState({ loading: false, user: "" })
    const { comments: PostComments, replies: PostReplies } = usePostSliceData()



    const { isLoading: isLoadingComments, error, data: fetchedpostdata } = useFetchDataQuery(
        ShowComments.id ? `/getpostdata/${ShowComments.id}/` : skipToken
    )


    useEffect(() => {
        if (!isLoadingComments && !error && fetchedpostdata?.comments?.length > 0) {
            dispatch(setComments(fetchedpostdata.comments))
        }
        if (!isLoadingComments && !error && fetchedpostdata?.replies?.length > 0) {
            dispatch(setReplies(fetchedpostdata.replies))
        }

    }, [fetchedpostdata, isLoadingComments, error, dispatch])

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
        setFollowLoading({ loading: true, user: value })
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
        setFollowLoading({ loading: false, user: "" })


    }

    const HandleUnfollow = async (value) => {
        setFollowLoading({ loading: true, user: value })
        const response = await UnfollowUser(value)
        if (response.data) {
            let user_data = JSON.parse(JSON.stringify(profiledata))
            user_data.follows = JSON.stringify(JSON.parse(user_data.follows).filter((vals) => vals !== value))
            dispatch(setudata(user_data))
        }
        setFollowLoading({ loading: false, user: "" })
    }

    const DisplayComment = (postid) => {

        setShowComments({ isOpen: true, id: postid, cid: null })


    }


    return (
        <>

            {isLoading ? <div className='flex w-full h-full items-center justify-center'>
                <Loading />
            </div> : UserPosts.map((post, index) => (
                <div key={index} className='p-[20px] gap-[20px] w-[60%] rounded-lg darkcomp flex flex-col '>
                    <Toaster />
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-[20px]'>
                            <img src={`${import.meta.env.VITE_SERVERURL}/api/sendstatic/dp/${post.dp}`} className='w-[40px] h-[40px] rounded-full object-cover' alt="" />
                            <div className='flex flex-col gap-[1px]'>
                                <p className='flex items-center gap-[10px]'>{post.username} <span>{post.isVerified ? <img src={VerifiedUser} className='w-[20px] h-[20px] object-contain' alt="" /> : <></>}</span> </p>
                                <p className='text-gray-300 text-[12px]'>{post.dateposted}</p>
                            </div>
                        </div>


                        {FollowLoading.loading && FollowLoading.user === post.username ? (<Loading />) : (profiledata.username !== post.username ? (profiledata.follows && JSON.parse(profiledata.follows).includes(post.username) ? <button className='bg-green-500 rounded-lg  p-[7px]' onClick={() => HandleUnfollow(post.username)}>Unfollow</button> : <button className='bg-[#FF6500] text-white p-[7px] rounded-lg' onClick={() => HandleFollow(post.username)}>Follow</button>) : <p>You</p>)}
                    </div>

                    <div className='w-full'>
                        <p>{post.post_description} {post.tags?.map((vals, index) => (
                            <span key={index} className='text-cyan-500'>#{vals}</span>
                        ))}</p>

                    </div>
                    <p className='w-full'>{post.description}</p>
                    <div className='w-full h-[300px] flex  '>
                        {post.filename && JSON.parse(post.filename).length > 1 && <div className='w-[100px] flex flex-col gap-[20px]'>
                            {JSON.parse(post.filename).map((vals, index) => (
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
                        {post.allowcomments === 1 ? <button className='flex items-center gap-[5px]' onClick={() => DisplayComment(post.uniqueid)}><CommentOutlinedIcon sx={{ fontSize: 16 }} />
                            <span>


                                {(() => {
                                    if (PostComments.length === 0) {

                                        return post.commentcount + post.replycount

                                    }
                                    else {
                                        return PostComments.filter((e) => e.belongsto === post.uniqueid).length + PostReplies.filter((e) => e.pid === post.uniqueid).length
                                    }
                                })()

                                }
                            </span>

                        </button> : <></>}

                        <button><ShareOutlinedIcon sx={{ fontSize: 16 }} /></button>
                        <button><BookmarkBorderOutlinedIcon sx={{ fontSize: 16 }} /></button>
                    </div>
                    {(ShowComments.isOpen && ShowComments.id === post.uniqueid && !error) ?
                        <div className='max-h-[500px] flex gap-[10px] flex-col w-full'>
                            <div className='flex w-full items-center justify-between'>

                                <p className='font-bold h-[40px]'>Comments</p>
                                <button onClick={() => setShowComments({ isOpen: false, id: "" })}><CloseIcon sx={{ fontSize: 16 }} /></button>
                            </div>
                            {isLoadingComments ? <div className='w-full flex items-center justify-center h-[100px]'>
                                <Loading />
                            </div> : <Comments belongsto={post.belongsto} styling={"w-full h-[calc(100%-40px)] flex flex-col-reverse gap-[20px]"} postid={post.uniqueid} />}

                        </div>

                        : <></>}
                </div>

            ))}
        </>
    )
}
