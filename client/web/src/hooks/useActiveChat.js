import {useSelector} from 'react-redux'


export const useActiveChat = () => {
    const {activechat} = useSelector((state) => state.UdataSlice )
    return {activechat}
}