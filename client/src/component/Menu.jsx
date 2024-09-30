import React, { useState } from "react";
import { IoSend } from "react-icons/io5";
import { Link, Navigate, redirect, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { getcurrProfile, getOtherUser, getUser } from "../redux/userSlice";
import { getallMessage } from "../redux/messageSlice";
import Avatar from "react-avatar";
import Post from "./Post";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import { setLikenotification } from "../redux/RtNotificSlice";

const MenuCont = styled.div`
  background: ${({ theme }) => theme.color};
  color: ${({ theme }) => theme.textPrimary};
  border-right: 1px solid  ${({ theme }) => theme.textSecondary};
  // mode ? "hover:bg-gray-300" : "hover:bg-gray-100"
`;

const MenuDiv = styled.div`
  color: ${({ theme }) => theme.textPrimary};
  border-radius: 0.5rem;

  &:hover {
    background: ${({ theme }) => theme.bgLight};
  }
`;

const Menu = ({ redirect, mode, themeChng }) => {
  const dispatch = useDispatch();
  let commonStyle = {
    menuButton:
      "flex items-center gap-2 text-xl my-4 font-semibold cursor-pointer p-2 hover:rounded-md ",
  };

  const [open, setOpen] = React.useState(false);

  const navigate = useNavigate();
  const { user, currProfile } = useSelector((store) => store.user);
  const { likenotification } = useSelector(
    (store) => store.realTimeNotification
  );
  // useGetOtherUser(user?._id);

  // useGetUserProfile(user?._id);
  let handleLogout = async () => {
    try {
      await axios.post("/user/logout");
      // setRootRedirect(true);
      dispatch(getUser(null));
      dispatch(getallMessage(null));
      dispatch(getOtherUser(null));
      dispatch(getcurrProfile(null));
      navigate("/login");
    } catch (error) {
      console.log(error.message);
    }
  };

  let handleNotification = () => {
    dispatch(setLikenotification({ type: "reset" }));
  };

  return (
    <MenuCont
      className={` fixed  min-h-screen border-r  w-[12rem] pl-3`}
    >
      <div className="mt-3 flex items-center gap-2 text-xl ml-3 hover:scale-105">
        <img src="/chat.png" alt="chat image" className="h-[3rem] w-[3rem] " />
        <h1 className="font-bold text-red-600 font-mono">Chatter</h1>
      </div>

      <div>
        <MenuDiv className="">
          <Link to={"/"} className={commonStyle.menuButton}>
            <i className="fa-solid fa-house text-red-500"></i>
            <p>Home</p>
          </Link>
        </MenuDiv>
        <MenuDiv>
          <Link to={`/chatusers`} className={commonStyle.menuButton}>
            <i className="fa-solid fa-compass text-red-500"></i> <p>Message</p>
          </Link>
        </MenuDiv>

        <MenuDiv>
          <div className={commonStyle.menuButton}>
            <i className="fa-solid fa-bell text-red-500"></i>
            {likenotification?.length > 0 && (
              <div className="flex items-center gap-2">
                <PopupState variant="popover" popupId="demo-popup-popover">
                  {(popupState) => (
                    <div>
                      <div className="flex flex-start relative">
                        <button
                          // variant="contained"
                          {...bindTrigger(popupState)}
                          className="bg-red-600 text-white text-xs w-5 py-[2px] rounded-full absolute
                           bottom-1 right-1"
                        >
                          {likenotification?.length}
                        </button>
                      </div>
                      <Popover
                        {...bindPopover(popupState)}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "left",
                        }}
                      >
                        <Typography>
                          <div>
                            {likenotification.length === 0 ? (
                              <p>No new notification</p>
                            ) : (
                              likenotification.map((notification) => (
                                <div
                                  key={notification.userId}
                                  className="flex justify-evenly gap-2 bg-gray-200 p-2 cursor-pointer"
                                  onClick={() =>
                                    dispatch(
                                      setLikenotification({ type: "reset" })
                                    )
                                  }
                                >
                                  <Avatar
                                    src={notification.userDetails.profileImage}
                                    round={true}
                                    size="30"
                                  ></Avatar>
                                  <span>
                                    <span>
                                      <span className="font-semibold">
                                        {notification.userDetails.userName}
                                      </span>
                                      &nbsp;{notification.message}
                                    </span>
                                  </span>
                                </div>
                              ))
                            )}
                          </div>
                        </Typography>
                      </Popover>
                    </div>
                  )}
                </PopupState>
              </div>
            )}
            <p>Notification</p>
          </div>
        </MenuDiv>

        <MenuDiv>
          <Link to={`/bookmarks`} className={commonStyle.menuButton}>
            <i className="fa-solid fa-bookmark text-red-500"></i>
            <p>Bookmark</p>
          </Link>
        </MenuDiv>

        <MenuDiv>
          <div
            className={commonStyle.menuButton}
            onClick={() => {
              themeChng(false);
            }}
          >
            {!mode ? (
              <i className="fa-solid fa-sun text-red-500"></i>
            ) : (
              <i className="fa-solid fa-moon text-red-500"></i>
            )}
            {mode ? "Dark" : "Light"}
          </div>
        </MenuDiv>

        <MenuDiv>
          <Link
            to={`/profile/${user?._id}`}
            className={commonStyle.menuButton + "-ml-2"}
          >
            {/* <i className="fa-solid fa-user cursor-pointer text-red-500"></i> */}
            <Avatar src={user?.profileImage} size="30" round={true} />
            <p>Profile</p>
          </Link>
        </MenuDiv>

        <MenuDiv>
          <div onClick={handleLogout} className={commonStyle.menuButton}>
            <i className="fa-solid fa-right-from-bracket text-red-500"></i>
            Logout
          </div>
        </MenuDiv>

        <div className="hover:scale-105">
          <Button
            variant="contained"
            color="error"
            sx={{ borderRadius: "20px", paddingInline: "50px" }}
            onClick={() => {
              setOpen(true);
            }}
          >
            Post&nbsp;&nbsp;
            <IoSend />
          </Button>
          {open && <Post open={open} setOpen={setOpen} />}
        </div>
      </div>
    </MenuCont>
  );
};

export default Menu;
