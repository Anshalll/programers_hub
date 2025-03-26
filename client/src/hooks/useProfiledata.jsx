import {useSelector} from 'react-redux'


export const useProfiledata = () => {
    const {data , loading} = useSelector((state) => state.UdataSlice )
    return {data, loading}
}