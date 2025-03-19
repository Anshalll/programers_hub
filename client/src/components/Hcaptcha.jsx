import React  from 'react'
import HCaptcha from "@hcaptcha/react-hcaptcha";


export default function Hcaptcha({ setCaptchaToken , ref}) {

  const handleOnverify = (token) => {
    setCaptchaToken(token)
  }
  
  return (
    


    <HCaptcha
    ref={ref}
    sitekey={import.meta.env.VITE_HCAPTCHA_SITE_KEY}
    onVerify={(token) => handleOnverify(token)}
  />
  )
}
