import axios from "axios";
import React, { useEffect, useState } from "react";
import Avatar from "react-avatar";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { getRefresh } from "../redux/messageSlice";
import { toast } from "react-toastify";
import { getuserRefresh } from "../redux/userSlice";
import { useGetUser } from "../hooks/useGetUser";
import { timeSince } from "../utils/timesince";
// import { Message } from "../../../api/model/Message";
import ChatDialog from "./CommentDailog";

const ChatDiv = styled.div`
  color: ${({ theme }) => theme.textPrimary};
`;

const Description = styled.div`
  word-wrap: break-word; /* Ensure long words break */
  white-space: normal; /* Allow text to wrap onto the next line */
  font-weight: bold;
`;

const AvatarHead = styled.div`
  background: ${({ theme }) => theme.bgLight};
`;

const Chat = ({ messg }) => {
  let [iconClicked, setIconClicked] = useState({
    chatClicked: false,
    heartClicked: false,
    bookmarkClicked: false,
  });
  const dispatch = useDispatch();
  const [allUser, setAllUser] = useState([]);
  const { user } = useSelector((store) => store.user);
  const [open, setOpen] = React.useState(false);

  //for accessing user name from message senderId
  useEffect(() => {
    axios.get(`/user/profile/${messg?.senderId}`).then((res) => {
      setAllUser(res?.data);
    });
  }, [messg?._id]);

  useGetUser();

  let handleLike = async () => {
    try {
      const res = await axios.put(`/message/like/${messg._id}`);
      dispatch(getRefresh());
      console.log(res.data);
    } catch (error) {
      toast.error("some error occurred");
      console.log(error.message);
    }
  };

  let handleBookmark = async (id) => {
    try {
      const response = await axios.put(`/user/bookmark/${id}`);
      // useGetUser(id);
      dispatch(getuserRefresh());
      console.log(response.data);
      console.log("bookmark ", user.bookmark);
    } catch (error) {
      toast.error("some error occurred");
      console.log(error.message);
    }
  };

  let handleDelete = async (id) => {
    try {
      await axios.delete(`/message/delete/${id}`);
      dispatch(getRefresh());
      console.log("message deleted", id);
    } catch (error) {
      toast.error("user not authorized");
      console.log(error.message);
    }
  };

  let iconStyled = {
    glowStyle:
      " rounded-full transition-transform duration-300 transform p-1  hover:bg-red-200 hover:scale-105",
    // "text-gray-400 text-red-600 hover:scale-125 transform transition duration-300 ease-out",
  };

  return (
    <ChatDiv>
      <div className="m-2">
        <div>
          <AvatarHead className="flex  p-1 py-1 rounded-2xl max-w-[400px]">
            <div>
              <Avatar src={allUser?.profileImage} size="50" round={true} />
            </div>
            <div className="ml-2">
              <div className="flex">
                <h1 className="font-bold">{allUser?.userName}</h1>
                &nbsp;&nbsp;
                <h1 className="text-gray-400">
                  {allUser?.email} {timeSince(messg?.createdAt)}
                </h1>
              </div>
            </div>
          </AvatarHead>

          <div className="mt-3 ml-3">
            <Description>{messg?.description} </Description>
            <div className="mt-2">
              {messg?.postImage && (
                <div className="">
                  <img
                    src={messg?.postImage}
                    alt="image"
                    className="max-h-[250px]  mb-3 rounded-xl"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Icons */}
      <div className="flex justify-around text-lg ">
        <button className="cursor-pointer" onClick={() => setOpen(true)}>
          <i
            className={
              "fa-regular fa-comment text-red-500" + iconStyled.glowStyle
            }
          ></i>
          <span className="ml-2">{messg?.comments.length}</span>
        </button>
        {/* Chat Dialog componenet */}
        {open && (
          <ChatDialog
            open={open}
            setOpen={setOpen}
            messg={messg}
            user={user}
            allUser={allUser}
          />
        )}
        <button
          className="cursor-pointer "
          onClick={() => {
            handleLike();
          }}
        >
          {!messg.like?.includes(user?._id) ? (
            <span>
              <i
                className={
                  "fa-regular fa-heart text-red-500" + iconStyled.glowStyle
                }
              ></i>
            </span>
          ) : (
            <span>
              <i
                className={
                  "fa-solid fa-heart  text-red-600" + iconStyled.glowStyle
                }
              ></i>
            </span>
          )}
          <span className="ml-2">{messg?.like?.length}</span>
        </button>
        <button
          className="cursor-pointer"
          onClick={() => handleBookmark(messg._id)}
        >
          {!iconClicked.bookmarkClicked ? (
            <i
              className={
                "fa-regular fa-bookmark text-red-500" + iconStyled.glowStyle
              }
            ></i>
          ) : (
            <i
              className={
                "fa-solid fa-bookmark text-red-500" + iconStyled.glowStyle
              }
            ></i>
          )}
          {/* <span className="ml-2">{user?.bookmark.length}</span> */}
        </button>

        <button onClick={() => handleDelete(messg._id)}>
          {user?._id === messg.senderId ? (
            <i
              className="fa-regular fa-trash-can p-2 text-red-500
              rounded-full hover:shadow-[0_0_15px_rgba(0,0,0,(0.5))]
            hover:bg-red-200 "
            ></i>
          ) : (
            <div className="hidden"></div>
          )}
        </button>
      </div>
    </ChatDiv>
  );
};

export default Chat;
