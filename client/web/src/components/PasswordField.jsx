import React, { useState } from 'react'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';


export default function PasswordField({type= "default", onChange, value,  name, placeholder }) {
    const [Type, setType] = useState(false)

    const HandleVisibile = (e) => {
        e.preventDefault()
        setType(!Type)
    }

    return (
        <div className='w-full p-3 flex items-center border rounded-lg'>

           {type === "default" ?  <input 

                type={!Type ? "password" : "text"}
                name={name}
                className="w-full  bg-transparent focus:outline-none "
                placeholder={placeholder}

            /> : 
            
            <input 
                value={value}
                onChange={onChange}
                type={!Type ? "password" : "text"}
                name={name}
                className="w-full  bg-transparent focus:outline-none "
                placeholder={placeholder}

            />

            }
           {Type ? <button onClick={(e) => HandleVisibile(e)}><VisibilityOutlinedIcon/></button> :  <button onClick={(e) => HandleVisibile(e)}><VisibilityOffOutlinedIcon/></button>}

        </div>

    )
}
