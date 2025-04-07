import {createSlice} from '@reduxjs/toolkit'


let initialState = {
  
    data : {},
    post: [],
    comments: [],
}

const userdataSlice = createSlice({

    name: "userdata",
    initialState,
    reducerPath: "userdata",
    reducers: {
        setudata : (state, action) => {
      
            state.data = action.payload
        },
        setuserpost : (state, action) => {
            state.post = action.payload
        },
        setpostcomments: (state, action) => {
            state.comments = action.payload
        }
    }
    
})


export default userdataSlice.reducer
export const {setudata , setuserpost , setpostcomments} = userdataSlice.actions