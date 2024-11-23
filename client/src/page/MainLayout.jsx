import React, { useState } from "react";
import Menu from "../component/Menu";
import { Outlet } from "react-router-dom";
import { darkTheme, lightTheme } from "../utils/theme";
import styled, { ThemeProvider } from "styled-components";
import { useGetAllMessg } from "../hooks/useGetAllMessg";
import { useGetOtherUser } from "../hooks/useGetOtherUser";
import { useSelector } from "react-redux";

const MainLayoutDiv = styled.div`
  background: ${({ theme }) => theme.color};
`;

const MainLayout = () => {
  const [mode, setMode] = useState(true);
  const {user} = useSelector(store => store.user);
  const {message} = useSelector(store => store.message);
  
  useGetAllMessg(user?._id);
  useGetOtherUser(user?._id);

  console.log(message,user._id);

  let themeChng = () => {
    setMode(!mode);
  };

  return (
    <MainLayoutDiv className="min-h-screen overflow-x-hidden ">
      <ThemeProvider theme={mode ? lightTheme : darkTheme}>
        <div className="">
          <Menu mode={mode} themeChng={themeChng} />
          <div>
            <Outlet />
          </div>
        </div>
      </ThemeProvider>
    </MainLayoutDiv>
  );
};

export default MainLayout;
