import axios from "axios";
import React, { useEffect, useState } from "react";
import Avatar from "react-avatar";
import styled from "styled-components";

const UserDiv = styled.div`
  background: ${({ theme }) => theme.bgLight};
`;
let Hr = styled.hr`
  border: 1px solid ${({ theme }) => theme.textSecondary};
`;
const MarkedMessg = ({ bookmarkedMessg, user }) => {
  const [markedMessg, setMarkedMessg] = useState("");
  useEffect(() => {
    axios.get(`/message/messgById/${bookmarkedMessg}`).then((res) => {
      setMarkedMessg(res.data);
    });
  }, []);
  console.log('markedMessg',markedMessg.length);

  return (
    <div className="">
      {markedMessg  && (
        <div className="">
          <UserDiv className="flex items-center gap-2 my-2 bg-gray-200 p-2 rounded-[1rem] w-2/3">
            <div>
              <Avatar src={user?.profileImage} round={true} size="30" />
            </div>
            <div>
              <h1 className="font-bold -mb-2">{user?.userName}</h1>
              <h3 className="text-gray-400">{user?.email}</h3>
            </div>
          </UserDiv>

          <div className="p-2">
            <h1 className="font-bold">{markedMessg.description}</h1>
            <img
              src={markedMessg.postImage}
              alt="post image"
              className="w-[400px] rounded-xl mt-2"
            />
          </div>
          <Hr className=" mt-4 w-full " />
        </div>
      )}
    </div>
  );
};

export default MarkedMessg;
