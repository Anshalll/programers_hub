import { configureStore } from '@reduxjs/toolkit'
import api from './apis/slice'
import AuthSlice from '../redux/auth/slice'
import UdataSlice from '../redux/userdata/slice'
import PostSlice from './post/slice'

export const Store = configureStore({

    reducer: {
        [api.reducerPath]: api.reducer,
        AuthSlice: AuthSlice,
        UdataSlice: UdataSlice,
        PostSlice: PostSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),

})