import React from "react";
import { Link } from "react-router-dom";
import { useSendDataMutation } from "../redux/apis/slice";

export default function Register() {

  const [DataMutate] = useSendDataMutation()

  const handleSubmit = async (e) => {


    e.preventDefault();
    const form = e.target;
    let formdata = new FormData(form);
    let resp = await DataMutate({ url: "/register" , method: "POST" , data: Object.fromEntries(formdata) })
    console.log(resp)

  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-white shadow-lg rounded-2xl flex max-w-4xl w-full">
        {/* Left Side - Form */}
        <div className="w-1/2 p-8">
          <h2 className="text-2xl font-semibold mb-2">Register</h2>
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
              <input
                type="password"
                name="password"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter Password"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Confirm Password"
                required
              />
            </div>
            <Link to="/forgotpass" className="text-right text-blue-500 text-sm mb-4 cursor-pointer">
              Forgot Password?
            </Link>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            >
              Register
            </button>
          </form>
          <div className="my-4 flex items-center">
            <div className="border-t w-full"></div>
            <span className="px-2 text-gray-500">OR</span>
            <div className="border-t w-full"></div>
          </div>
          <button className="w-full flex items-center justify-center gap-2 border py-3 rounded-lg hover:bg-gray-100">
            <img src="https://www.svgrepo.com/show/303108/google-icon-logo.svg" alt="Google" className="w-5 h-5" />
            Register with Google
          </button>
          <p className="text-sm text-gray-500 mt-4">
           Already have an account ? <Link to="/login" className="text-blue-500 cursor-pointer">Login</Link>
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