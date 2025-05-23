import { createSlice } from "@reduxjs/toolkit";

let initialState = {

    auth: null,


}

const AuthSlice = createSlice({
    name: "authslice",
    initialState,
    reducerPath: "authslice",
    reducers: {
        setAuthuser: (state, action) => {
            state.auth = action.payload
        }
    }

})

export const {setAuthuser} = AuthSlice.actions
export default AuthSlice.reducer
