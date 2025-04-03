import {useSelector} from 'react-redux'


export const useProfiledata = () => {
    const {data , post} = useSelector((state) => state.UdataSlice )
    return {data , post}
}