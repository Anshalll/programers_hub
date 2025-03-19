import React  from 'react'
import HCaptcha from "@hcaptcha/react-hcaptcha";


export default function Hcaptcha({ setCaptchaToken }) {


  return (
    


    <HCaptcha
    sitekey={import.meta.env.VITE_HCAPTCHA_SITE_KEY}
    onVerify={(token) => setCaptchaToken(token)}
  />
  )
}
