import React, { useEffect, useState } from "react";
import ChatInput from "./ChatInput";
import Chat from "./Chat";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const FeedDiv = styled.div`
  border-right: 1px solid ${({ theme }) => theme.bgLight};
`;
const Hr = styled.div`
  border: 1px solid ${({ theme }) => theme.bgLight};
`;
const Feed = () => {
  const { message } = useSelector((store) => store.message);
  const { user } = useSelector((store) => store.user);
  const navigate = useNavigate();
  return (
    <FeedDiv className="w-full min-w-[600px] lg:max-w-[50%] my-1 ml-48  pr-5 ">
      <ChatInput />

      {/* {!message || message?.length === 0 ? (
        <div className="flex justify-center items-center h-[400px]">
          <p className="text-xl text-gray-400">No Messages....😴</p>
        </div>
      ) : (
        message?.map((messg) => (
          <div key={messg?._id}>
            <Chat messg={messg} />
            <Hr className="-mr-5 -ml-6 mt-3" />
          </div>
        ))
       )} */}
       <div>hello</div>
    </FeedDiv>
  );
};

export default Feed;
