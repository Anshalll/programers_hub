import { useEffect, useState } from 'react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useFetchDataQuery } from '../../redux/apis/slice';

export default function PostComments({ postid }) {

    const [CommentForPost, setCommentForPost] = useState("");
    const { data: commentdata, isLoading: isloadingComments, isError: isErrorInComments } = useFetchDataQuery(CommentForPost ? `/getpostdata/${CommentForPost}/` : skipToken)

    useEffect(() => {
        if (postid) {
            setCommentForPost(postid)
        }
    } , [postid])

    return (
        <div>
            {!isloadingComments && !isErrorInComments && commentdata && commentdata.comments && commentdata?.comments.map((vals,  index) => {
                console.log(vals, index)
            })}
        </div>
    )
}
