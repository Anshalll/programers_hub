
import React, { useEffect, useState } from 'react'
import {useSendDataMutation} from '../redux/apis/slice'
export default function Verifyotp({ registerdata }) {

    const [Error, setError] = useState("")
    const [ShowBtn , setShowBtn] = useState(false)
    const [SendData] = useSendDataMutation()
    const [InputVals, setInputVals] = useState([
      "" , "" , "" , "" , "" , "" 
    ])

    useEffect(() => {
        const allFilled = InputVals.every((val) => val !== "");
        setShowBtn(allFilled);
    } , [InputVals] )


    useEffect(() => {
        let element = document.getElementById("input0")
       
        if (element) {
            element.focus()

        }
    }, [])



    const HandleInput = (e, index) => {
        e.preventDefault()
        let arrvals = JSON.parse(JSON.stringify(InputVals))
       
        let value = e.target.value;
        if (value.trim() === "") {

            arrvals[index] = ""
         
            setInputVals(arrvals)
        }
        else {

            arrvals[index] = value.slice(-1);
            setInputVals(arrvals)
            let elementid = index + 1
            if (elementid !== 6) {
                let element = document.getElementById(`input${elementid}`)
                element.focus()
            }
        }


    }

    const HandleFormSubmit = async (e) => {
        e.preventDefault()
        let otp = InputVals.join("")
        registerdata.otp = otp
        
        const resp = await SendData({ url: "/register"  , method: "POST" , data: registerdata})
        if (resp.error?.data?.error) {
            
            setError(resp.error.data.error)
            setTimeout(() => {
                setError("")
            } ,3000)
        }
        else{
           window.location.href = `${import.meta.env.VITE_CLIENTURL}`
        }
    }

    return (
        <div className='w-full h-full  flex items-center justify-center'>
            <div className='flex flex-col gap-[20px]  p-[20px] w-[450px] h-[200px] shadow-lg  rounded-lg'>

                <p className='w-full h-[20px]'>otp verification</p>
                {Error && <p className='text-red-500 mb-[5px] mt-[5px]'>{Error}</p> } 
                <form onSubmit={(e) => HandleFormSubmit(e)} className='w-full h-[calc(100%-50px)] flex flex-col gap-[20px]'>
                    <div className='flex  items-center gap-[20px]'>

                    {InputVals.map((value, index) => (
                        <input type="number" onChange={(e) => HandleInput(e, index)} id={`input${index}`} className='w-[50px] px-[10px] h-[50px] rounded-lg border-2 border-black' value={value} key={index} />
                    ))}
                    </div>

                    <button type='submit' disabled={!ShowBtn} className={`w-full h-[30px] ${ShowBtn ? "bg-[#FF6500]" : "bg-[#d67b3e]"} rounded-lg`}>Verify</button>  

                </form>
            </div>

        </div>

    )
}
