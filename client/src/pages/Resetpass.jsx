import React, {useEffect, useState , useRef} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {useSendDataMutation} from '../redux/apis/slice'
import Hcaptcha from '../components/Hcaptcha'
import PasswordField from '../components/PasswordField'
export default function Resetpass() {
    
    const [captchaToken, setCaptchaToken] = useState("");
    const [ConfirmPass, setConfirmPass] = useState("")
    const [Pass, setPass] = useState("")
    const [Error, setError] = useState("")
    const [ShowPassreset, setShowpassreset] = useState(false)
    const navigate= useNavigate()
    const [Postdata] = useSendDataMutation()
    const [Token ,setToken] = useState("")
    const [ShowModel, setShowModel] = useState(false)
    const [isLoading , setisLoading] = useState(false)
    const Refcaptcha = useRef(null)

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
     
        if (!captchaToken) {
            setError("Please complete the captcha")
            setTimeout(() => {
                setError("")
            }, 3000)
            return

        }
        setisLoading(true)
        let response  = await Postdata({ url: "/resetpassword" , method: "POST" , data: {token: Token , cpass: ConfirmPass , password: Pass , captcha: captchaToken } })
        if (response.error?.data.error) {
            Refcaptcha.current.resetCaptcha()
            setError(response.error?.data.error)
        }
        if (response.data?.message) {
            setShowModel(true)
        }

        setisLoading(false)
    }

  return (
    <div className='w-full h-[100vh] flex bg-white items-center justify-center'>
         {ShowModel ? <div className='w-[400px] gap-[20px] flex p-[10px] flex-col items-center justify-center  h-[200px] bg-white rounded-lg shadow-lg'>
                <p>Password changed!</p>
                <Link to="/login"  className='flex items-center justify-center w-full font-bold'>ok</Link>
         </div> : <div className='w-[400px] min-h-[250px] flex-col flex gap-[20px] p-[20px] bg-white rounded-lg shadow-lg'>

            <p>Password reset</p>
            {Error && <p className='text-red-500'>{Error}</p> }

            <PasswordField type="valchange"  value={Pass} onChange={(e) => setPass(e.target.value)} name={"password"} placeholder='New password' />
            <PasswordField type="valchange"  value={ConfirmPass} onChange={(e) => setConfirmPass(e.target.value)} name={"cpass"} placeholder='Confirm password' />

            
                

                       <div className="w-full flex items-center justify-center mb-[10px]">
            
                        <Hcaptcha ref={Refcaptcha} setCaptchaToken={setCaptchaToken} />
            
                        </div>

            {!isLoading ?  <button disabled={!ShowPassreset} onClick={() => HandlePasswordReset()} className={`w-full h-[40px] ${ShowPassreset ? "bg-[#FF6500]" : "bg-[#d67b3e]"} rounded-lg`}>Reset</button> : "Loading..." }
         </div>}
    </div>
  )
}
