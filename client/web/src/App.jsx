import React, { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useFetchDataQuery } from './redux/apis/slice.js'
import { useDispatch } from "react-redux";
import { setAuthuser } from "./redux/auth/slice.js";
import ProtectedRoutes from "./ProtectedRoutes.jsx";
import { useAuthSlice } from "./hooks/useAuthSlice.js";
import Loading from "./components/Loading.jsx";
import { setudata, setuserpost } from './redux/userdata/slice.js'
import CreatePost from "./pages/CreatePost.jsx";
import { useSocket } from './socket/SocketConnection'

export default function App() {

  const { auth } = useAuthSlice()
  const Home = lazy(() => import("./pages/Home.jsx"));
  const Profile = lazy(() => import("./pages/Profile.jsx"));
  const Login = lazy(() => import("./pages/Login.jsx"));
  const Register = lazy(() => import("./pages/Register.jsx"));
  const Communities = lazy(() => import("./pages/Communities.jsx"));
  const Passwordreset = lazy(() => import("./pages/Passwordreset.jsx"))
  const Chat = lazy(() => import("./pages/Chat.jsx"))
  const socket = useSocket()



  const Resetpass = lazy(() => import("./pages/Resetpass.jsx"))
  const CommunityRanking = lazy(() => import("./pages/CommunityRanking.jsx"))

  const dispatch = useDispatch()
  const { isLoading, data, error } = useFetchDataQuery("/index")

  useEffect(() => {
    if (!isLoading) {

      if (!error) {

        dispatch(setAuthuser(data.logged));
        if (data.logged) {
          dispatch(setudata(data.data[0]))
          dispatch(setuserpost(data.data[1]))
        }
      }
      else {
        dispatch(setAuthuser(error.data.logged))

      }
    }

  }, [isLoading, data, error, dispatch])

  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      if (socket.id) {
          console.log(socket.id )
      }


    };
  
    socket.on("connect", handleConnect);
    
    return () => {
      socket.off("connect", handleConnect);
    };
  }, [socket]);



  return (
    <>
      {!isLoading ? <Router>
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen w-[100vw] bg-black">
          <Loading />
        </div>}>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route element={<ProtectedRoutes user={auth} />} >

              <Route path="/profile" element={<Profile />} />
              <Route path="/createpost" element={<CreatePost />} />
              <Route path="/community" element={<Communities />} />
              <Route path="/rankings/community" element={<CommunityRanking />} />
              <Route path="/chat" element={<Chat />} />


            </Route>

            <Route element={<ProtectedRoutes user={!auth} redirect="/" />}>

              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgotpassword" element={<Passwordreset />} />
              <Route path="/resetpass" element={<Resetpass />} />

            </Route>

          </Routes>
        </Suspense>
      </Router> : <div className="flex items-center justify-center min-h-screen w-[100vw] bg-black">
        <Loading />
      </div>}

    </>

  );
}
