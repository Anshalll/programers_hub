import { configureStore } from '@reduxjs/toolkit'
import api from './apis/slice'

export const Store = configureStore({

    reducer: {
        [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),

})