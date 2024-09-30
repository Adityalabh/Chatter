import React, { useEffect } from "react";
import Follows from "./Follows";
import { useDispatch, useSelector } from "react-redux";
import { useGetOtherUser } from "../hooks/useGetOtherUser";
import styled from "styled-components";
import { getOtherUser } from "../redux/userSlice";

const RightDiv = styled.div`
  background: ${({ theme }) => theme.color};
  color: ${({ theme }) => theme.textPrimary};
`;
const SearchInp = styled.div`
  background: ${({ theme }) => theme.color};
`;

const RightPanel = () => {
  const { user, otherUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  

  return (
    <RightDiv className="w-fit hidden lg:block">
      <SearchInp className="px-2 w-full py-">
        <div className="flex gap-1 px-3 items-center  my-2  bg-gray-300 rounded-full">
          <i className="fa-solid fa-magnifying-glass text-red-600"></i>
          <input
            type="text"
            placeholder="Search"
            className="placeholder-gray-600 placeholder-font-bolder border-none bg-gray-300  "
          />
        </div>
      </SearchInp>

      <div className="pt-2">
        <h1 className="text-2xl font-bold mx-3 my-4">Who to follow</h1>
        {otherUser?.map((otherusers) => (
          <Follows key={otherusers._id} otherusers={otherusers} />
        ))}
      </div>
    </RightDiv>
  );
};

export default RightPanel;
