import axios from "axios";
import React from "react";
import Avatar from "react-avatar";
import { useDispatch, useSelector } from "react-redux";

import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getotherUserRefresh } from "../redux/userSlice";
import { getIsActive, getRefresh } from "../redux/messageSlice";
import styled from "styled-components";

const FollowDiv = styled.div`
    &:hover {
      background: ${({ theme }) => theme.bgLight};
    }
  `;

const Follows = ({ otherusers }) => {
  

  return (
    <FollowDiv>
      <Link
        to={`/profile/${otherusers?._id}`}
        className="flex items-center justify-evenly gap-3 my-2  p-1 rounded-lg"
      >
        <Avatar
          src={otherusers.profileImage}
          size="50"
          round={true}
          className="border border-gray-400 "
        />
        <div className="">
          <h3 className="font-bold ">{otherusers?.userName}</h3>
          <h3 className="text-gray-500">{otherusers?.email}</h3>
        </div>
        <button

          className="ml-9 px-7 py-2 rounded-full bg-red-600 text-white font-bold hover:scale-105"
        >
          
          Profile
        </button>
      </Link>
    </FollowDiv>
  );
};

export default Follows;
