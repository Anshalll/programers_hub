

import React from 'react'
import { useGoogleLogin } from '@react-oauth/google';

export default function GoogleAuth() {


    const Gauth = useGoogleLogin({
        onSuccess : (res) => console.log(res), 
        onError: (error) => console.log(error)
    })

  return (
    <button onClick={() => Gauth()} className="w-full flex items-center justify-center gap-2 border py-3 rounded-lg hover:bg-gray-100">
    <img src="https://www.svgrepo.com/show/303108/google-icon-logo.svg" alt="Google" className="w-5 h-5" />
    Login with Google
  </button>
  )
}
