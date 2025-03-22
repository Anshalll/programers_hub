import React from 'react'
import { useGoogleLogin } from '@react-oauth/google';
import { useSendDataMutation } from '../redux/apis/slice'
import { useNavigate } from 'react-router-dom';
export default function GoogleAuth({ setError , text}) {

    const [sendMutation] = useSendDataMutation()
    const navigate = useNavigate()

    const ErrorHandler = () => {
      setError("An error occured!")
      setTimeout(() => {
          setError("")
      } , 3000)
    }



    const ValidateToken = async (res) => {
        let resp = await sendMutation({ url: "/googleauth" , method: "POST" , data: {"access_token" : res.access_token}})
        if (resp.data?.logged) {
            navigate("/")
        }
        else{
            setError("An error occured!")
            setTimeout(() => {
                setError("")
            } , 3000)
        }
    }

   
    const Gauth = useGoogleLogin({
        onSuccess : (res) => ValidateToken(res), 
        onError: () => ErrorHandler()
    })

  return (
    <button onClick={() => Gauth()} className="w-full flex items-center justify-center gap-2 border py-3 rounded-lg hover:bg-gray-100">
    <img src="https://www.svgrepo.com/show/303108/google-icon-logo.svg" alt="Google" className="w-5 h-5" />
    {text} with Google
  </button>
  )
}
