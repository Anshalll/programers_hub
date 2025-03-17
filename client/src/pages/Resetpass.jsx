import React, {useEffect, useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {useSendDataMutation} from '../redux/apis/slice'

export default function Resetpass() {

    const [ConfirmPass, setConfirmPass] = useState("")
    const [Pass, setPass] = useState("")
    const [Error, setError] = useState("")
    const [ShowPassreset, setShowpassreset] = useState(false)
    const navigate= useNavigate()
    const [Postdata] = useSendDataMutation()
    const [Token ,setToken] = useState("")
    const [ShowModel, setShowModel] = useState(false)


    useEffect(() => {
        const query = new URLSearchParams(window.location.search)
        let token = query.get("token")


        if (token) {

            const ValidateToken = async () => {
        
                let response  = await Postdata({ url: "/validatetoken" , method: "POST" , data: {token} })
      
                if (!response.data?.message) {
                    navigate("/login")
                }
                else{
                    setToken(token)
                }
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
    

    const HandlePasswordReset = async () => {
        let response  = await Postdata({ url: "/resetpassword" , method: "POST" , data: {token: Token , cpass: ConfirmPass , password: Pass } })
        if (response.error?.data.error) {
            setError(response.error?.data.error)
        }
        if (response.data?.message) {
            setShowModel(true)
        }
    }

  return (
    <div className='w-full h-[100vh] flex bg-white items-center justify-center'>
         {ShowModel ? <div className='w-[400px] gap-[20px] flex p-[10px] flex-col items-center justify-center  h-[200px] bg-white rounded-lg shadow-lg'>
                <p>Password changed!</p>
                <Link to="/login"  className='flex items-center justify-center w-full font-bold'>ok</Link>
         </div> : <div className='w-[400px] max-h-[250px] flex-col flex gap-[20px] p-[20px] bg-white rounded-lg shadow-lg'>

            <p>Password reset</p>
            {Error && <p className='text-red-500'>{Error}</p> }

            <input value={Pass} onChange={(e) => setPass(e.target.value)} type="password" className='border-2 border-[#FF6500] px-[10px] h-[40px] rounded-lg' placeholder='New password' />
            <input value={ConfirmPass} onChange={(e) => setConfirmPass(e.target.value)} type="password" placeholder='Confirm password' className='border-2 border-[#FF6500] px-[10px] h-[40px] rounded-lg'/>
             <button disabled={!ShowPassreset} onClick={() => HandlePasswordReset()} className={`w-full h-[40px] ${ShowPassreset ? "bg-[#FF6500]" : "bg-[#d67b3e]"} rounded-lg`}>Reset</button> 
         </div>}
    </div>
  )
}
