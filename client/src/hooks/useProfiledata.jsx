import {useSelector} from 'react-redux'


export const useProfiledata = () => {
    const {data} = useSelector((state) => state.UdataSlice )
    return {data}
}