import React from "react";
import Avatar from "react-avatar";
import { useGetAllChat } from "../hooks/useGetAllChats";
import { useSelector } from "react-redux";
import { useGetRtMessg } from "../hooks/useGetRtMessg";
import styled from "styled-components";


let MessageDiv = styled.div`
  background: ${({ theme }) => theme.bgLight};
  color: ${({ theme }) => theme.textPrimary};
`;

const ChatMessg = ({ chatSelectedUser }) => {
  useGetRtMessg(); //for getting real time messages
  useGetAllChat(); //for getting  messages
  const { chattings } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.user);
  return (
    <MessageDiv className="overflow-y-auto flex-1 flex flex-col ">
      {/* Image */}
      <div className="flex justify-center w-full pt-4">
        <div className="flex flex-col items-center justify-center">
          <Avatar
            src={chatSelectedUser.profileImage}
            round={true}
            className="border border-black"
          />
          <div className="font-bold">{chatSelectedUser.userName}</div>
          <div className="text-gray-400">{chatSelectedUser.email}</div>
        </div>
      </div>

      {/* Message */}
      <div className="flex flex-col gap-3 overflow-y-auto">
        {chattings &&
          chattings.map((chats) => (
            <div
              key={chats?._id}
              className={`flex ${
                chats?.senderId === user?._id
                  ? `justify-end  p-2 `
                  : `justify-start`
              }`}
            >
              <p
                className={`p-2 rounded w-fit m-1 break-words ${
                  chats?.senderId === user?._id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                {chats?.message}
              </p>
            </div>
          ))}
      </div>
    </MessageDiv>
  );
};

export default ChatMessg;
