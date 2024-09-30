import React, { useEffect, useState } from "react";
import Avatar from "react-avatar";
import { useDispatch, useSelector } from "react-redux";

import {
  getSelectedUser,
  getSelectedUserRefresh,
} from "../redux/chatSelectUserSlice";

import ChatMessg from "./chatMessg";
import { Button } from "@mui/material";
import axios from "axios";
import { setChatting } from "../redux/chattingSlice";
import styled from "styled-components";

let OtherUserDiv = styled.div`
  background: ${({ theme }) => theme.color};
  color: ${({ theme }) => theme.textPrimary};
    border-right:1px solid ${({theme})=> theme.textSecondary};

`;

let SelectedDiv = styled.div`
  background: ${({ theme }) => theme.bgLight};
  color: ${({ theme }) => theme.textPrimary};
  border-right: ${({ theme }) => theme.bgLight};
`;
let Selectedinput = styled.div`
  background: ${({ theme }) => theme.color};
`;
let Hr = styled.hr`
  border: 1px solid ${({ theme }) => theme.textSecondary};
`;

let AllUsers = styled.div`
  &:hover {
    background: ${({ theme }) => theme.bgLight};
    border-left:2px solid ${({theme})=> theme.textSecondary};
  }
`;

const ChatUser = () => {
  const { otherUser, user } = useSelector((store) => store.user);
  const { chatSelectedUser } = useSelector((store) => store.chatSelectedUser);
  const { onlineUser } = useSelector((store) => store.chat);
  const { chattings } = useSelector((store) => store.chat);
  const [chatInput, setChatInput] = useState("");
  const dispatch = useDispatch();

  //   console.log(chatSelectedUser?._id);
  let handleChatInput = async () => {
    try {
      const id = chatSelectedUser?._id;
      const res = await axios.post(`/chat/send/${id}`, { message: chatInput });
      dispatch(setChatting([...chattings, res.data.newChat]));
      dispatch(getSelectedUserRefresh());
      setChatInput("");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    dispatch(getSelectedUser(null));
  }, []);

  return (
    <div className="min-h-screen  ml-48 grid grid-cols-[1fr_6fr]">
      {/*  You Profile*/}
      <OtherUserDiv className="min-h-screen min-w-[200px] w-[270px] bg-gray-100   flex flex-col gap-3">
        <div className="flex flex-col">
          <div className="p-2 flex items-center gap-2">
            <Avatar src={user?.profileImage} size="60" round={true} />
            <div className="font-bold text-xl">{user?.userName}</div>
          </div>
          <div className="-mt-2 px-2">Your profile</div>
          <Hr className="" />
        </div>

        {/* all User */}
        <div>
          {otherUser?.map((user) => (
            <AllUsers
              className=" flex items-center gap-2 cursor-pointer  p-2"
              key={user._id}
              onClick={() => dispatch(getSelectedUser(user))}
            >
              <Avatar
                src={user.profileImage}
                size="50"
                round={true}
                className="border border-black rounded"
              />
              <div>
                <p className="font-bold ">{user.userName}</p>
                <p
                  className={
                    onlineUser.includes(user._id)
                      ? "text-green-700 text-sm font-bold"
                      : "text-red-500 text-sm font-bold"
                  }
                >
                  {!onlineUser.includes(user._id) ? "offline" : "online"}
                </p>
              </div>
            </AllUsers>
          ))}
        </div>
      </OtherUserDiv>

      {/* Selected User  */}
      <div className=" ">
        {!chatSelectedUser ? (
          <SelectedDiv className="flex  flex-col justify-center  items-center pr-7 overflow-y-hidden min-h-screen">
            <i className="fa-regular fa-message text-6xl text-red-600"></i>
            <div className="font-semibold">Your messages are here</div>
          </SelectedDiv>
        ) : (
          <div className="flex flex-col w-full h-full ">
            {/* Nav */}
            <OtherUserDiv
              className={`flex p-2  items-center sticky top-0 gap-2 bg-white  z-10`}
            >
              <Avatar
                src={chatSelectedUser.profileImage}
                size="50"
                round={true}
                className="border border-black rounded"
              />
              <p className="font-bold ">{chatSelectedUser.userName}</p>
            </OtherUserDiv>

            <ChatMessg chatSelectedUser={chatSelectedUser} />

            {/* Inputs */}
            <Selectedinput className="text-black">
              <div className="flex sticky z-10 items-center border-t border-gray-300 px-3">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="w-full p-1  mx-4 border !border-black !rounded-md"
                />
                <Button
                  variant="contained"
                  color="primary"
                  className="p-2 rounded-lg"
                  onClick={handleChatInput}
                >
                  Send
                </Button>
              </div>
            </Selectedinput>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatUser;
