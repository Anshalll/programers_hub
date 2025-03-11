import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

export default function App() {
  const Home = lazy(() => import("./pages/Home.jsx"));
  const Profile = lazy(() => import("./pages/Profile.jsx"));
  const Login = lazy(() => import("./pages/Login.jsx"));
  const Register = lazy(() => import("./pages/Register.jsx"));

  return (
    <Router>
      <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
        <Routes>
          
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

        </Routes>
      </Suspense>
    </Router>
  );
}
