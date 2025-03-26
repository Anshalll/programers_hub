import { configureStore } from '@reduxjs/toolkit'
import api from './apis/slice'
import AuthSlice from '../redux/auth/slice'
import UdataSlice from '../redux/userdata/slice'
export const Store = configureStore({

    reducer: {
        [api.reducerPath]: api.reducer,
        AuthSlice: AuthSlice,
        UdataSlice: UdataSlice
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),

})