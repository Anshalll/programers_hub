import {io} from 'socket.io-client'
import { useMemo } from 'react'


export const SocketInit = () => {
    const socket = useMemo(() => io(import.meta.env.VITE_SERVERURL), [])

    return socket
}