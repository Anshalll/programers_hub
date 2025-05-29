import {createSlice} from '@reduxjs/toolkit'


let initialState = {
  
    data : {},
    post: [],
    activechat: []

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
        setuseractivechat : (state, action) => {
            state.activechat = action.payload
        }
    }
    
})


export default userdataSlice.reducer
export const {setudata , setuserpost , setuseractivechat} = userdataSlice.actions