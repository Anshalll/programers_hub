import {createSlice} from '@reduxjs/toolkit'


let initialState = {
    loading: true,
    data : {}
}

const userdataSlice = createSlice({

    name: "userdata",
    initialState,
    reducerPath: "userdata",
    reducers: {
        setudata : (state, action) => {
            state.loading= false,
            state.data = action.payload
        }
    }
    
})


export default userdataSlice.reducer
export const {setudata} = userdataSlice.actions