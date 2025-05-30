import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useSendDataMutation } from "../redux/apis/slice";
import Verifyotp from "../components/Verifyotp";
import PasswordField from "../components/PasswordField";
import Hcaptcha from "../components/Hcaptcha";
import Loading from "../components/Loading";
import GoogleAuth from '../components/GoogleAuth'
export default function Register() {

  const [captchaToken, setCaptchaToken] = useState("");
  const [DataMutate] = useSendDataMutation()
  const [Error, setError] = useState("")
  const [AuthOtp, setAuthOtp] = useState(false)
  const [Formdata, setFormdata] = useState(null)
  const [Isloading, setIsloading] = useState(false)
  const Refcaptcha = useRef(null)
  const handleSubmit = async (e) => {


    e.preventDefault();
    const form = e.target;

    if (!captchaToken) {
      setError("Please complete the captcha")
      setTimeout(() => {
        setError("")
      }, 3000)
      return

    }

    let formdata = new FormData(form);
    setIsloading(true)

    formdata.append("captcha", captchaToken)

    let resp = await DataMutate({ url: "/otpregister", method: "POST", data: Object.fromEntries(formdata) })

    if (resp.data?.success) {
      setFormdata(Object.fromEntries(formdata))
      setAuthOtp(true)
    }
    if (resp.error?.data?.error.toLowerCase() !== "max otp sent!") {
      setError(resp.error?.data?.error)
      Refcaptcha.current.resetCaptcha()
      setTimeout(() => {
        setError("")
      }, 3000)
    }
    else {
      setFormdata(Object.fromEntries(formdata))
      setAuthOtp(true)
    }


    setIsloading(false)

  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      {AuthOtp ? <Verifyotp registerdata={Formdata} /> : <div className="bg-white shadow-lg rounded-2xl flex max-w-4xl w-full">
        {/* Left Side - Form */}
        <div className="w-1/2 p-8">
          <h2 className="text-2xl font-semibold mb-2">Register</h2>
          {Error && <p className="text-red-500 mt-[10px] mb-[10px]">{Error}</p>}
          <p className="text-gray-500 text-sm mb-6">
            Create an account to get started
          </p>

          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">Name</label>
              <input
                type="text"
                name="name"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter Name"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">Username</label>
              <input
                type="text"
                name="username"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter Username"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter Email Address"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">Password</label>
              <PasswordField name={"password"} placeholder={"Enter password"} />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">Confirm Password</label>
              <PasswordField name={"confirmpassword"} placeholder={"Confirm password"} />
            </div>

            <div className="w-full flex items-center justify-center mb-[10px]">

            <Hcaptcha ref={Refcaptcha} setCaptchaToken={setCaptchaToken} />

            </div>


            {!Isloading ? <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            >
              Register
            </button> : <div className="flex items-center justify-center w-full p-[5px]">
              <Loading />
            </div>}
          </form>

      

          {!Isloading && <>
            <div className="my-4 flex items-center">
              <div className="border-t w-full"></div>
              <span className="px-2 text-gray-500">OR</span>
              <div className="border-t w-full"></div>
            </div>
            <GoogleAuth setError={setError} text={"Register"}/>
            <p className="text-sm text-gray-500 mt-4">
              Already have an account ? <Link to="/login" className="text-blue-500 cursor-pointer">Login</Link>
            </p>

            
          </>}

        </div>

        {/* Right Side - Image */}
        <div className="w-1/2 p-[20px]">
          <img
            src="bglogreg.jpg"
            alt="Coding setup"
            className="h-full w-full object-cover rounded-2xl"
          />
        </div>
      </div>}
    </div>
  );
}