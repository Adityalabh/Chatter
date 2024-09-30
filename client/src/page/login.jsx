import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../redux/userSlice.js";
import { CircularProgress } from "@mui/material";
import { getIsActive } from "../redux/messageSlice.js";
// import { useGetUserProfile } from "../hooks/useGetUserProfile.js";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user } = useSelector((store) => store.user);
  // const [redirect, setRedirect] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // useEffect(()=>{
  //   if(user){
  //     navigate('/');
  //   }
  // },[]);
  useEffect(()=>{
    setLoading(false);
  },[]);

  async function handleLogin(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post("/user/login", { email, password });
      // alert("login Successfully");
      toast.success(`welcome  ${email}`);
      // setRedirect(true);
      setEmail("");
      setPassword("");
      dispatch(getUser(res?.data));
      console.log("loggin page user id-->", res?.data._id);
      navigate("/");
    } catch (err) {
      console.log(err.message);
      toast.error(`user not found`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {!loading ? (
        <div className=" flex justify-center items-center gap-8 min-h-screen ">
          <div>
            <img
              src="/chat.png"
              alt="chat image"
              className="max-h-[19rem]  w-[16rem]"
            />
          </div>
          <div>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col w-[17rem]">
                <h1 className="text-[2.2rem] font-semibold ">Happening now.</h1>
                <h3 className=" font-bold text-xl text-red-600">Login</h3>
                <input
                  type="email"
                  placeholder="Email"
                  className="border-red-400 py-1 px-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  className=" border-red-400 py-1 px-2"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="bg-red-500 text-white font-bold"
                >
                  Login
                </button>
                <p className="my-1 text-center">
                  Not signup yet ?&nbsp;
                  <Link
                    to={"/signup"}
                    className=" underline text-red-600 font-bold cursor-pointer"
                  >
                    Signup
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-screen ">
          <CircularProgress />
        </div>
      )}
    </div>
  );
};

export default Login;
