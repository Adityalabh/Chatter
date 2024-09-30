// import { CircularProgress } from "@mui/material";
// import axios from "axios";
// import React, { useState } from "react";
// import { Link, Navigate } from "react-router-dom";
// import { toast } from "react-toastify";

// const register = () => {
//   const [input, setInput] = useState({
//     userName: "",
//     email: "",
//     password: "",
//     description: "",
//   });

//   const [redirect, setRedirect] = useState(false);
//   const [loading, setloading] = useState(false);

//   function handleInput(e) {
//     setInput({ ...input, [e.target.name]: e.target.value });
//   }

//   let handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setloading(true);
//       const res = await axios.post("/user/signup", input);
//       console.log(res.data);
//       toast.success("register successfull");
//       setRedirect(true);
//     } catch (err) {
//       toast.error("register unsuccesfull");
//       console.log(err.message);
//     } finally {
//       setloading(false);  
//     }
//     setInput({
//       userName: "",
//       email: "",
//       password: "",
//       description: "",
//     });
//   };

//   if (redirect) {
//     return <Navigate to={"/login"} />;
//   }


//   return (
//     <div>
//       {loading==true ? (
//         <div className=" flex justify-center gap-24  items-center  min-h-screen w-[100%] ">
//           <div className="">
//             <img
//               src="/chat.png"
//               alt="chat image"
//               className="max-h-[19rem]  w-[16rem]"
//             />
//           </div>
//           <form onSubmit={handleSubmit}>
//             <div className="flex flex-col ">
//               <h1 className="text-4xl font-bold my-2">Happening now.</h1>
//               <h3 className=" font-bold text-xl">SignUp</h3>
//               <input
//                 type="text"
//                 placeholder=" Username "
//                 name="userName"
//                 className="focus:border-2 focus:border-red-400 py-1 px-1"
//                 value={input.userName}
//                 onChange={handleInput}
//                 required
//               />
//               <input
//                 type="email"
//                 placeholder=" Email"
//                 name="email"
//                 className="focus:border-2 focus:border-red-400 py-1 px-1"
//                 value={input.email}
//                 onChange={handleInput}
//                 required
//               />
//               <textarea
//                 placeholder="Description...."
//                 name="description"
//                 className="p-1 px-2"
//                 value={input.description}
//                 onChange={handleInput}
//               ></textarea>
//               <input
//                 type="password"
//                 name="password"
//                 placeholder="Password"
//                 className="focus:border-2 focus:border-red-400 py-1 px-1"
//                 value={input.password}
//                 onChange={handleInput}
//                 required
//               />
//               <button type="submit" className="bg-red-500 text-white font-bold">
//                 Create account
//               </button>
//               <p className="my-1 text-center">
//                 Already a member ?{" "}
//                 <Link
//                   to={"/login"}
//                   className="underline text-red-600 font-bold"
//                 >
//                   Login
//                 </Link>
//               </p>
//             </div>
//           </form>
//         </div>
//       ) : (
//         <div className=" flex justify-center  items-center  min-h-screen w-[100%] ">
//           <CircularProgress />
//         </div>
//       )}
//     </div>
//   );
// };

// export default register;

import { CircularProgress } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const [input, setInput] = useState({
    userName: "",
    email: "",
    password: "",
    description: "",
  });

  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    setLoading(false);
  },[]);

  function handleInput(e) {
    setInput({ ...input, [e.target.name]: e.target.value });
  }
  console.log(loading);

  let handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post("/user/signup", input);
      console.log(res.data);
      toast.success("Register successful");
      setRedirect(true);
    } catch (err) {
      toast.error("Register unsuccessful");
      console.log(err.message);
    } finally {
      setLoading(false);  
      console.log(loading);
    }
    setInput({
      userName: "",
      email: "",
      password: "",
      description: "",
    });
  };

  if (redirect) {
    return <Navigate to={"/login"} />;
  }

  return (
    <div>
      {!loading ? (
        <div className="flex justify-center gap-24 items-center min-h-screen w-full">
          <div>
            <img
              src="/chat.png"
              alt="chat image"
              className="max-h-[19rem] w-[16rem]"
            />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <h1 className="text-4xl font-bold my-2">Happening now.</h1>
              <h3 className="font-bold text-xl">Sign Up</h3>
              <input
                type="text"
                placeholder="Username"
                name="userName"
                className="focus:border-2 focus:border-red-400 py-1 px-1"
                value={input.userName}
                onChange={handleInput}
                required
              />
              <input
                type="email"
                placeholder="Email"
                name="email"
                className="focus:border-2 focus:border-red-400 py-1 px-1"
                value={input.email}
                onChange={handleInput}
                required
              />
              <textarea
                placeholder="Description...."
                name="description"
                className="p-1 px-2"
                value={input.description}
                onChange={handleInput}
              ></textarea>
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="focus:border-2 focus:border-red-400 py-1 px-1"
                value={input.password}
                onChange={handleInput}
                required
              />
              <button type="submit" className="bg-red-500 text-white font-bold">
                Create account
              </button>
              <p className="my-1 text-center">
                Already a member?{" "}
                <Link to={"/login"} className="underline text-red-600 font-bold">
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-screen w-full">
          <CircularProgress />
        </div>
      )}
    </div>
  );
};

export default Register;
