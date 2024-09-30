import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import styled from "styled-components";
import { getRefresh } from "../redux/messageSlice";
import { getProfileReresh, getUser, getuserRefresh } from "../redux/userSlice";
import { readFileAsDataURL } from "../utils/readFileAsDataURL";
import { Dialog, DialogContent } from "@mui/material";

const EditDiv = styled.div`
  background: ${({ theme }) => theme.color};
  border-radius: 1rem;
  border: 1px solid ${({ theme }) => theme.bgLight};
  color: ${({ theme }) => theme.textPrimary};
`;

const Edit = ({  user, open, setOpen }) => {
  const [userName, setUserName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [bannerImage, setBannerimage] = React.useState("");
  const [preview, setPreview] = React.useState("");
  const imageRef = React.useRef();

  const dispatch = useDispatch();

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    try {
      setUserName(user?.userName || "");
      setEmail(user?.email || "");
      setDescription(user?.description || "");
      setBannerimage(user?.bannerImage || "");
      setPreview(user?.bannerImage || "");
    } catch (err) {
      console.log({
        message: "error in fetching profile data",
        details: err.message,
      });
    }
  }, [user._id]);

  let handleImage = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerimage(file);
      const dataurl = await readFileAsDataURL(file);
      setPreview(dataurl);
    }
  };

  async function handleEdit(e) {
    const id = user._id;
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("userName", userName);
      formData.append("email", email);
      formData.append("description", description);
      formData.append("bannerImage", bannerImage);

      const res = await axios.put(`/user/edit`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(email, userName, description);
      dispatch(getUser(res?.data));
      dispatch(getRefresh());
      dispatch(getProfileReresh());
    } catch (err) {
      toast(err.message);
      console.log(err.message);
    }
  }

  

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="scroll-dialog-title"
    
    >
      <DialogContent>
        <EditDiv>
          <form
            className="flex flex-col  p-4 px-9 w-[30rem]"
            onSubmit={handleEdit}
          >
            <div
              className="flex justify-end  text-2xl cursor-pointer"
              onClick={()=>setOpen(false)}
            >
              <i className="fa-solid fa-xmark "></i>
            </div>
            <h1 className="text-center text-2xl  font-semibold -mt-3">
              Edit Profile
            </h1>
            <div className="flex flex-col">
              <label htmlFor="name" className="font-semibold">
                Username:
              </label>
              <input
                type="text"
                id="name"
                className="p-2 text-black"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="email" className="font-semibold">
                Email:
              </label>
              <input
                type="email"
                className="p-2 text-black"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="description" className="font-semibold">
                Description:
              </label>
              <textarea
                type="text"
                id="description"
                className="p-2  text-black"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            {/* Image Preview */}
            <div className="flex flex-col">
              <p className="">
                <input
                  type="file"
                  className="hidden"
                  ref={imageRef}
                  onChange={handleImage}
                />
              </p>
              <div className="font-semibold flex justify-start gap-2 ">
                Banner Image:
                <div
                  className="bg-red-600 p-1 rounded-full text-white px-2 flex items-center gap-2 cursor-pointer"
                  onClick={() => imageRef.current.click()}
                >
                  <span>Upload</span>
                  <i className="fa-solid fa-image  "></i>
                </div>
              </div>
              {preview && (
                <p className="flex justify-center ">
                  <img
                    src={preview}
                    alt="image"
                    className="max-h-[150px] bg-gray-300 w-[60%] object-contain m-1 rounded-xl p-1"
                  />
                </p>
              )}
            </div>
            <div className="flex justify-center">
              <button className="w-[70%] mt-3 px-7 p-2 rounded-full bg-red-600 text-white font-bold hover:scale-105">
                Submit
              </button>
            </div>
          </form>
        </EditDiv>
      </DialogContent>
    </Dialog>
  );
};

export default Edit;
