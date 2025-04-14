import {useSelector} from 'react-redux'


export const useProfiledata = () => {
    const {data , post , comments , replies} = useSelector((state) => state.UdataSlice )
    return {data , post , comments , replies}
}