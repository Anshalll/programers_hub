import React, { useState , useRef} from 'react'
import { useSendDataMutation } from '../redux/apis/slice'
import { useNavigate } from 'react-router-dom'
import Hcaptcha from '../components/Hcaptcha';
import Loading from '../components/Loading';
export default function Passwordreset() {

    const [captchaToken, setCaptchaToken] = useState("");
    const [InputValue, setInputValue] = useState("")
    const [Postdata] = useSendDataMutation()
    const [Error, setError] = useState("")
    const [ShowDialog, setShowDialog] = useState(false)
    const [Email, setEmail] = useState("")
    const navigate = useNavigate()
    const [isLoading, setisLoading] = useState(false)
    const Refcaptcha = useRef(null)

    const HandleSubmit = async () => {
       
        if (!captchaToken) {
       
            setError("Please complete the captcha")
            setTimeout(() => {
                setError("")
            }, 3000)
            return

        }
        setisLoading(true)
        let resp = await Postdata({ url: "/forgotpassword", method: "POST", data: { uemail: InputValue, captcha: captchaToken } })

        if (resp.error?.data?.error) {
            setError(resp.error?.data?.error)
            Refcaptcha.current.resetCaptcha()
            setTimeout(() => {
                setError("")
            }, 3000)

        }
        if (resp.data?.message) {
            setShowDialog(true)
            setEmail(resp.data?.email)

        }
        setisLoading(false)
    }

    return (
        <div className='w-full h-[100vh] flex bg-white items-center justify-center'>
            {ShowDialog ? <div className='w-[400px] max-h-[250px] flex-col flex gap-[20px] p-[20px] bg-white rounded-lg shadow-lg'>
                <p className='text-center'>A password reset link has been sent to  <span className='font-bold'>{Email}</span> </p>
                <button onClick={() => navigate("/login")} className='font-medium border-t-2 p-[4px] border-black'>ok</button>
            </div> : <div className='w-[400px] min-h-[250px] flex-col flex gap-[20px] p-[20px] bg-white rounded-lg shadow-lg'>
                <p>Password reset</p>
                {Error && <p className='text-red-500'>{Error}</p>}
                <input value={InputValue} type="text" onChange={(e) => setInputValue(e.target.value)} className='w-full px-[10px] h-[40px] border-2 rounded-lg outline-none border-[#FF6500]' placeholder='Enter email or username.' />
                <div className="w-full flex items-center justify-center mb-[10px]">
                
                    <Hcaptcha ref={Refcaptcha} setCaptchaToken={setCaptchaToken} />
                
                </div>
                {isLoading ? <div className="flex items-center justify-center w-full p-[5px]">
              <Loading />
            </div> : <button disabled={InputValue.trim() === ""} className={`w-full h-[40px] ${InputValue.trim() !== "" ? "bg-[#FF6500]" : "bg-[#d67b3e]"} rounded-lg`} onClick={() => HandleSubmit()}>Submit</button>}
            </div>}
        </div>
    )
}
