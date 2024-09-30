import React, { useRef, useState } from "react";
import Avatar from "react-avatar";
import Button from "@mui/material/Button";
import { IoSend } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { getallMessage, getIsActive, getRefresh } from "../redux/messageSlice";
import { readFileAsDataURL } from "../utils/readFileAsDataURL";
// import { getAllmessage } from "../../../api/controllers/messageControler";

const ChatHead = styled.div`
  background: ${({ theme }) => theme.color};
  // border-bottom: 1px solid ${({ theme }) => theme.bgLight};
`;
const ChatButton = styled.div`
  &:focus {
    background-color: blue;
  }
`;

const Hr = styled.hr`
  border: 1px solid ${({ theme }) => theme.bgLight};
`;

// POST INPUT ///////////////////////////////////////////
const ChatInput = () => {
  let commonStyle = {
    chatButton: "py-[3px] -mb-[14px]",
  };
  const [description, setDescription] = useState("");
  const { user } = useSelector((store) => store.user);
  const [postImage, setPostImage] = useState("");
  const [imagePreview, setImagePreview] = useState();
  const { isActive } = useSelector((store) => store.message);
  const imageRef = useRef();
  const dispatch = useDispatch();
  // console.log("chatInput  isActive",isActive);

  let handleImage = async (e) => {
    const file = e.target.files?.[0];
    console.log(file);
    if (file) {
      setPostImage(file);
    }
    const Dataurl = await readFileAsDataURL(file); //for image preview
    setImagePreview(Dataurl);
  };

  let handleMessage = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("description", description);
      formData.append("postImage", postImage);

      await axios.post("/message/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      dispatch(getRefresh());
      toast.success("message sent");
    } catch (error) {
      toast.error("something went wrong!");
      console.log(error.message);
    }
    setDescription("");
    setPostImage("");
    setImagePreview("");
  };

  let handlefollomessg = () => {
    dispatch(getIsActive());
  };

  let handleforyou = () => {
    dispatch(getIsActive());
  };

  return (
    <div className="">
      <ChatHead className=" flex justify- text-center font-semibold text-gray-500 border-b border-gray-400">
        <ChatButton
          className={`  w-full flex justify-center items-center ${
            isActive ? "border-b-2 border-red-600 " : {}
          } `}
        >
          <button className={commonStyle.chatButton} onClick={handleforyou}>
            For you
          </button>
        </ChatButton>

        <ChatButton
          className={`py-2 w-full  ${
            !isActive ? "border-b-2 border-red-600 " : {}
          }`}
        >
          <button className={commonStyle.chatButton} onClick={handlefollomessg}>
            Following
          </button>
        </ChatButton>
      </ChatHead>

      <form onSubmit={handleMessage} className="pt-5 px-3">
        <div className={`flex items-center `}>
          <Avatar
            src={user?.profileImage}
            size="50"
            round={true}
            className="border border-gray-400"
          />
          <textarea
            type="text"
            placeholder="What is happening?!"
            className="border-none w-[70%] ml-3 bg-gray-200 outline-none rounded-xl p-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={1}
          />
        </div>

        {imagePreview && (
          <div className="flex justify-center border-2 border-red-400 rounded-lg m-2 bg-gray-200 ">
            <img src={imagePreview} alt="image" className="max-h-[200px]  rounded-lg m-1"/>
          </div>
        )}
        <div className="flex justify-between items-center ">
          <input
            type="file"
            className="hidden"
            onChange={handleImage}
            ref={imageRef}
          />
          <i
            className="fa-solid fa-image text-red-500 cursor-pointer"
            onClick={() => imageRef.current.click()}
          ></i>

          <Button
            variant="contained"
            color="error"
            type="submit"
            sx={{ borderRadius: "20px", paddingInline: "20px" ,
              "&.Mui-disabled":{
                backgroundColor:'rgb(	255 120 127)',
                color:'white'
              }
            }}
            disabled={!description.trim()}
            
          >
            Post&nbsp;&nbsp;
            <IoSend />
          </Button>
        </div>
      </form>
      <Hr className="-mr-5 -ml-5  mt-3" />
    </div>
  );
};

export default ChatInput;
