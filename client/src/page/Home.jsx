import React, { useEffect, useState } from "react";
import Feed from "../component/Feed";
import RightPanel from "../component/RightPanel";
import Menu from "../component/Menu";
import { Outlet, useNavigate } from "react-router-dom";
import Post from "../component/Post";
import { ThemeProvider } from "styled-components";
// import { darkTheme, lightTheme } from "../utils/theme";
import { useSelector } from "react-redux";
// import { useGetAllMessg } from "../hooks/useGetAllMessg";
import styled from "styled-components";
// import { useGetOtherUser } from "../hooks/useGetOtherUser";

const HomeDiv = styled.div`
  background: ${({ theme }) => theme.color};
`;

const PHomeDiv = styled.div`
  background: ${({ theme }) => theme.color};
`;

const Home = () => {
  const [postRedirect, setPostRedirect] = useState(false);
  // const [mode, setMode] = useState(true);
  const navigate = useNavigate();

  const { user } = useSelector((store) => store.user);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, []);
  // console.log(user._id);

  // useGetAllMessg(user?._id);
  // useGetOtherUser(user?._id);

  const redirect = (newredirect) => {
    setPostRedirect(newredirect);
  };

  let themeChng = () => {
    setMode(!mode);
  };

  return (
    <PHomeDiv //parent home div
      className={`w-full min-h-screen transition ease-linear duration-100`}
    >
      <HomeDiv className={`flex  w-full`}>
        <div className="flex ">
          <Feed />
          {/* <Menu redirect={redirect} mode={mode} themeChng={themeChng} /> */}
          <Outlet />
        </div>

        <div className="flex justify-start w-full"> 
          <RightPanel />
        </div>
        {postRedirect && <Post redirect={redirect} />}
      </HomeDiv>
    </PHomeDiv>
  );
};

export default Home;
