import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';

const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVERURL}/api`,
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            return headers;
        },
        credentials: "include"
    }),
    endpoints: (builder) => ({
        fetchData: builder.query({
            query: (path) => ({
                url: path,
                
            }),
            
        }),

        SendData: builder.mutation({
            query: ({ method, data, url }) => ({
                url,
                method,
                body: data
            }),

        }),
    })
});

export default api;
export const { useFetchDataQuery, useSendDataMutation } = api;
