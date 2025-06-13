import {io} from 'socket.io-client'
import { useMemo } from 'react'


export const useSocket = () => {
    const socket = useMemo(() => io("http://localhost:8000" , {
        withCredentials: true,
        transports: ['websocket'] // Force WebSocket if needed
    }), [])

    return socket
}