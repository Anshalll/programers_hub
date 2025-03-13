import { useSelector } from "react-redux";


export const useAuthSlice = () => {
    const {auth} = useSelector((state) => state.AuthSlice)
    return {auth}
} 