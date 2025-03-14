import React, { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useFetchDataQuery } from './redux/apis/slice.js'
import { useDispatch } from "react-redux";
import { setAuthuser } from "./redux/auth/slice.js";
import ProtectedRoutes from "./ProtectedRoutes.jsx";
import { useAuthSlice } from "./hooks/useAuthSlice.js";

export default function App() {

  const { auth } = useAuthSlice()
  const Home = lazy(() => import("./pages/Home.jsx"));
  const Profile = lazy(() => import("./pages/Profile.jsx"));
  const Login = lazy(() => import("./pages/Login.jsx"));
  const Register = lazy(() => import("./pages/Register.jsx"));


  const dispatch = useDispatch()
  const { isLoading, data, error } = useFetchDataQuery("/index")

  useEffect(() => {
    if (!isLoading) {
      
      if (!error) {

        dispatch(setAuthuser(data.logged));

      }
      else {
        dispatch(setAuthuser(error.data.logged))
      }
    }

  }, [isLoading, data, error, dispatch])

  return (
    <>
      {!isLoading ? <Router>
        <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
          <Routes>
          <Route path="/" element={<Home />} />

            <Route element={<ProtectedRoutes user={auth} />} >

              <Route path="/profile" element={<Profile />} />


            </Route>

            <Route element={<ProtectedRoutes user={!auth} redirect="/" />}>

              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

            </Route>

          </Routes>
        </Suspense>
      </Router> : <p className="text-white">{"Loading"}</p>}

    </>

  );
}
