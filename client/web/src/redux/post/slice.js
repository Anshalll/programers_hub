import {createSlice} from '@reduxjs/toolkit'


let initialState = {
    comments: [],
    replies: [],
    isLiked: false
}


const PostSlice = createSlice({
    name: "postslice",
    initialState,
    reducerPath: "postslice",
    reducers: {
        setComments: (state, action) => {
            state.comments = action.payload
        },
        setReplies: (state, action) => {
            state.replies = action.payload
        },
        

    }

})

export default PostSlice.reducer
export const {setComments , setReplies} = PostSlice.actions
