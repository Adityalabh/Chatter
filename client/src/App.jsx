import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Register from "./page/register";
import Home from "./page/Home";
import axios from "axios";
import Profile from "./component/Profile";
import Feed from "./component/Feed";
import Login from "./page/login";
import Post from "./component/Post";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChatUser from "./component/ChatUser";
import RightPanel from "./component/RightPanel";
import MainLayout from "./page/MainLayout";

import io from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "./redux/socketSlice";
import { setOnlineUsers } from "./redux/chattingSlice";
import RtNotificSlice, { setLikenotification } from "./redux/RtNotificSlice";
import Bookmarks from "./component/Bookmarks";

axios.defaults.baseURL = "http://localhost:3000";
// axios.defaults.baseURL = "https://chatter-8.onrender.com";
axios.defaults.withCredentials = true;

function App() {
  const { user } = useSelector((store) => store.user);
  const { socket } = useSelector((store) => store.socketio);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      // for socket handshaking with server socket
      const socketio = io("http://localhost:3000", {
        query: {
          id: user?._id,
        },
        transports: ["websocket"],
      });
      dispatch(setSocket(socketio));

      // listen all events
      socketio.on("getOnlineUser", (onlineUser) => {
        dispatch(setOnlineUsers(onlineUser));
      });

      socketio.on("notification", (notification) => {
        dispatch(setLikenotification(notification));
      });

      // if user not close the connection properly
      return () => {
          socketio.close();
          dispatch(setSocket(null));
      };
      // if no user
    } else if (socket) {
      socket.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);

  return (
    <div className="">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/" element={<Feed />} />

            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/chatusers" element={<ChatUser />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/post" element={<Post />} />
        </Routes>
        <ToastContainer position="top-center" />
      </BrowserRouter>
      {/* </ThemeProvider> */}
    </div>
  );
}

export default App;
