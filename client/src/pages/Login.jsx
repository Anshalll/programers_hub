import React, { useState } from "react";
import { Link } from "react-router-dom";
import {useSendDataMutation} from '../redux/apis/slice'
import PasswordField from "../components/PasswordField";
export default function LoginForm() {


  const [FormMutation] = useSendDataMutation()
  const [Error, setError] = useState("")
  const handleSubmit = async (e) => {
    e.preventDefault();
    let formdata = new FormData(e.target)
    let data = Object.fromEntries(formdata)
    let resp = await FormMutation({ url: "/login" , method: "POST" , data })
    if (!resp.error?.data.login) {
        setError(resp.error?.data.error)
        setTimeout(() => {
          setError("")
        } , 3000)
    } 

      
    if (resp.data?.login) {
        window.location.href = import.meta.env.VITE_CLIENTLOCAL
    }
    
   
    
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-white  shadow-lg rounded-2xl flex max-w-4xl w-full">
        {/* Left Side - Form */}
        <div className="w-1/2 p-8">
          <h2 className="text-2xl font-semibold mb-2">Login</h2>
          {Error && <p className="text-red-500 mt-[10px] mb-[10px]">{Error}</p> }
          <p className="text-gray-500 text-sm mb-6">
            If you have an account, please login
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">Email or Username</label>
              <input
                type="text"
                name="uemail"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter Email Address"
                
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">Password</label>
              <PasswordField name={"password"} placeholder={"Enter password"}   />
            </div>
            <Link to="/forgotpass" className="text-right text-blue-500 text-sm mb-4 cursor-pointer">
              Forgot Password?
            </Link>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            >
              Log In
            </button>
          </form>
          <div className="my-4 flex items-center">
            <div className="border-t w-full"></div>
            <span className="px-2 text-gray-500">OR</span>
            <div className="border-t w-full"></div>
          </div>
          <button className="w-full flex items-center justify-center gap-2 border py-3 rounded-lg hover:bg-gray-100">
            <img src="https://www.svgrepo.com/show/303108/google-icon-logo.svg" alt="Google" className="w-5 h-5" />
            Login with Google
          </button>
          <p className="text-sm text-gray-500 mt-4">
            If you don’t have an account... <Link to="/register" className="text-blue-500 cursor-pointer">Register</Link>
          </p>
        </div>
        {/* Right Side - Image */}
        <div className="w-1/2 p-[20px]">
          <img
            src="bglogreg.jpg"
            alt="Coding setup"
            className="h-full w-full object-cover rounded-2xl"
          />
        </div>
      </div>
    </div>
  );
}