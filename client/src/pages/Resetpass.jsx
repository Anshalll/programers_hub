import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import {useSendDataMutation} from '../redux/apis/slice'

export default function Resetpass() {

    const [ConfirmPass, setConfirmPass] = useState("")
    const [Pass, setPass] = useState("")
    const [Error, setError] = useState("")
    const [ShowPassreset, setShowpassreset] = useState(false)
    const navigate= useNavigate()
    const [Postdata] = useSendDataMutation()

   
    useEffect(() => {
        const query = new URLSearchParams(window.location.search)
        let token = query.get("token")


        if (token) {

            const ValidateToken = async () => {
        
                let response  = await Postdata({ url: "/validatetoken" , method: "POST" , data: {token} })
                console.log(response)
            }

            ValidateToken() 
        
        }
        else{
            navigate("/login")
        }

    } , [navigate , Postdata])

    useEffect(() => {
        if (ConfirmPass.trim() === "" || Pass.trim() === "") {
            
            setShowpassreset(false)
        }
        else{
            setShowpassreset(true)
        }
    } , [ConfirmPass, Pass])

  return (
    <div className='w-full h-[100vh] flex bg-white items-center justify-center'>
         <div className='w-[400px] max-h-[250px] flex-col flex gap-[20px] p-[20px] bg-white rounded-lg shadow-lg'>

            <p>Password reset</p>
            {Error && <p className='text-red-500'>{Error}</p> }

            <input value={Pass} onChange={(e) => setPass(e.target.value)} type="password" className='border-2 border-[#FF6500] px-[10px] h-[40px] rounded-lg' placeholder='New password' />
            <input value={ConfirmPass} onChange={(e) => setConfirmPass(e.target.value)} type="password" placeholder='Confirm password' className='border-2 border-[#FF6500] px-[10px] h-[40px] rounded-lg'/>
             <button disabled={!ShowPassreset} className={`w-full h-[40px] ${ShowPassreset ? "bg-[#FF6500]" : "bg-[#d67b3e]"} rounded-lg`}>Reset</button> 
         </div>
    </div>
  )
}
