import {createSlice} from '@reduxjs/toolkit'


let initialState = {
  
    data : {}
}

const userdataSlice = createSlice({

    name: "userdata",
    initialState,
    reducerPath: "userdata",
    reducers: {
        setudata : (state, action) => {
      
            state.data = action.payload
        }
    }
    
})


export default userdataSlice.reducer
export const {setudata} = userdataSlice.actions