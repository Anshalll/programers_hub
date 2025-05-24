import { useSelector } from "react-redux"

export const usePostSliceData = () => {
    const {comments, isLiked , replies} = useSelector((state) => state.PostSlice)
    return {comments, isLiked , replies}
}