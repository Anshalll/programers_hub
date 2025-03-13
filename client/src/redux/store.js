import { configureStore } from '@reduxjs/toolkit'
import api from './apis/slice'
import AuthSlice from '../redux/auth/slice'

export const Store = configureStore({

    reducer: {
        [api.reducerPath]: api.reducer,
        AuthSlice: AuthSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),

})