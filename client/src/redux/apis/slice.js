import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';

const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://127.0.0.1:8000/api',
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            return headers;
        }
    }),
    endpoints: (builder) => ({
        fetchData: builder.query({
            query: (path) => ({
                url: path
            }),
            transformResponse: (response) => response.data,    
            transformErrorResponse: (response) => response.error
        }),

        SendData: builder.mutation({
            query: ({ method, data, url }) => ({
                url,
                method,
                body: data
            }),
            transformResponse: (response) => response.data || response,    
            transformErrorResponse: (response) => response.error
        }),
    })
});

export default api;
export const { useFetchDataQuery, useSendDataMutation } = api;
