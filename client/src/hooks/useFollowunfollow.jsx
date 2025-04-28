import { useSendDataMutation } from '../redux/apis/slice'
function useFollowunfollow(){
    const [Send_data] =  useSendDataMutation()

    const FollowUser = async (username) => {
        const response = await Send_data({ url: "/followunfollow" , method: "POST" , data: {type: "follow" , username} })

        return response

    }

    const UnfollowUser = async (username) => {
        const response = await Send_data({ url: "/followunfollow" , method: "POST" , data: {type: "unfollow" , username} })

        return response
    }


    return {FollowUser , UnfollowUser}
}


export default useFollowunfollow