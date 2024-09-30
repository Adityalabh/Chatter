import React, { useEffect, useState } from "react";
import RightPanel from "./RightPanel";
import { useSelector } from "react-redux";
import MarkedMessg from "./MarkedMessg";
import styled from "styled-components";

let BookmarkDiv = styled.div`
  background: ${({ theme }) => theme.color};
  color: ${({ theme }) => theme.textPrimary};
`;

let BookmarkCont = styled.div`
  border-right: 1px solid ${({ theme }) => theme.textSecondary};
`;

const Bookmarks = () => {
  const { user } = useSelector((store) => store.user);

  return (
    <BookmarkDiv className="flex justify-evenly w-full min-h-screen overflow-y-hidden ">
      <BookmarkCont className="flex flex-col ml-40 w-[45%] pr-2">
        <div className="h-16  border-b-2 border-red-500 font-bold text-2xl -ml-6 sticky z-50 top-0  p-4  shadow-md">
          Bookmark
        </div>
        <div className="overflow-y-auto">
          {user.bookmark.length === 0 && (
            <div className="flex justify-center items-center min-h-screen text-gray-400 text-xl">
              no bookmarks........
            </div>
          )}
          {user.bookmark.map((bookmarkedMessg) => (
            <div className="">
              <div className="">
                  <MarkedMessg bookmarkedMessg={bookmarkedMessg} user={user} />
                </div>
            </div>
          ))}
        </div>
      </BookmarkCont>
      <div className="relative lef">
        <RightPanel />
      </div>
    </BookmarkDiv>
  );
};

export default Bookmarks;
