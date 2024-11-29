import React, { useEffect, useRef, useState } from "react";
import Avatar from "react-avatar";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useGetUserProfile } from "../hooks/useGetUserProfile";
import CircularProgress from "@mui/material/CircularProgress";
import styled from "styled-components";
import {
  getcurrProfile,
  getotherUserRefresh,
  getProfileReresh,
  getUser,
} from "../redux/userSlice";
import { getIsActive, getRefresh } from "../redux/messageSlice";
import { toast } from "react-toastify";
import Edit from "./Edit";
import RightPanel from "./RightPanel";

const ProfileDiv = styled.div`
  background: ${({ theme }) => theme.color};
  border-right: 1px solid ${({ theme }) => theme.bgLight};
  color: ${({ theme }) => theme.textPrimary};
`;

const Profilehead = styled.div`
  background-color: ${({ theme }) => theme.color};
  border-bottom:1px solid ${({theme}) => theme.bgLight};
`;

const ProfileCont = styled.div`
   border-right: 1px solid ${({ theme }) => theme.bgLight};
`;

const Postbody = styled.div`
  background: ${({ theme }) => theme.bgLight};
`;

const Avatardiv = styled.div`
  border: 4px solid ${({ theme }) => theme.color};
  background-color: ${({ theme }) => theme.color};
`;
const Profile = () => {
  const { user, currProfile } = useSelector((store) => store.user);
  const { message } = useSelector((store) => store.message);

  const [open, setOpen] = React.useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const userPostimage = message?.filter(
    (message) => message?.senderId === currProfile?._id
  );

  console.log("userPostimage", userPostimage);
  useGetUserProfile(id);

  const handleAvatarClick = () => {
    fileInputRef.current.click(); // Trigger file input click programmatically
  };

  let handlefollow = async (id, userName) => {
    try {
      axios.post(`/user/follow/${id}`).then((res) => {
        dispatch(getIsActive());
        dispatch(getRefresh());
        dispatch(getProfileReresh());
        toast.success(res.data + " " + `${userName}`);
      });
    } catch (error) {
      console.log(error.message);
      toast.error("something went wrong");
    }
  };

  let handleImage = async (e) => {
    e.preventDefault();
    const file = e.target.files?.[0];

    if (file) {
      const formData = new FormData();
      formData.append("profileImage", file);
      try {
        setLoading(true);
        const res = await axios.post(`/user/edit/profile`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        // console.log(response.data);
        dispatch(getProfileReresh());
        dispatch(getRefresh());
        dispatch(getUser(res?.data));

        toast.success("photo added");
        console.log("profileImage", profileImage);
      } catch (error) {
        console.log(error.message);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  if (showDialog) {
    return (
      <div>
        {showDialog && (
          <div className="-ml-24 z-50 fixed flex justify-center items-center bg-[rgba(0,0,0,0.84)] min-h-screen w-[100vw] shadow-sm">
            <div className="flex flex-col gap-2 h-[280px] w-[300px] p-4 bg-white  rounded-2xl border border-black">
              <h1 className="text-2xl font-bold">
                Unfollow @{currProfile.userName}
              </h1>
              <p className="font-semibold">
                Their posts will no longer show up in your For You timeline. You
                can still view their profile
              </p>
              <button
                className="px-7 py-2 rounded-full bg-red-600 text-white font-bold hover:scale-105"
                onClick={() => setShowDialog(false)}
              >
                Cancle
              </button>

              <button
                className="px-7 py-2 rounded-full bg-red-600 text-white font-bold hover:scale-105"
                onClick={() => {
                  handlefollow(currProfile._id, currProfile.userName);
                  setShowDialog(false);
                }}
              >
                Unfollow
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  {
    console.log(open);
  }

  return (
    <ProfileDiv className="w-full  ml-48  pr-5 ">
      {currProfile ? (
        <div className="flex gap- w-full ">
          <ProfileCont className="w-4/6 xl:w-3/6 border-r border-black pr-2 ">
            <Profilehead className="fixed w-3/6 flex items-center gap-3 px-3">
              <Link to={`/`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5 cursor-pointer hover:bg-gray-300 rounded-full"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                  />
                </svg>
              </Link>
              <div className="w-inherit">
                <h1 className=" text-xl  font-semibold font-sans ">
                  {currProfile.userName}
                </h1>
                <p>700 posts</p>
              </div>
            </Profilehead>

            {/* banner Image */}
            <div className="mt-9 pt-4">
              <img
                src={currProfile.bannerImage}
                alt="rocket"
                className="w-inherit  object-cover ml-1  rounded-md "
              />
              <div className="  flex justify-between items-center ">
                <Avatardiv className="flex  relative -top-12 left-3  w-[111px] h-[110px] rounded-full ">
                  {!loading ? (
                    <Avatar
                      src={currProfile?.profileImage}
                      size="105"
                      round={true}
                      className=" rounded-full bg-gray-300 "
                    />
                  ) : (
                    <CircularProgress className="m-6" />
                  )}
                  {/* + icon profileChager */}
                  {currProfile._id === user._id && !loading && (
                    <form className="relative">
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleImage}
                      />
                      <span>
                        <i
                          className="fa-solid fa-plus text-white bg-[rgba(255,0,0,0.7)] absolute right-1 rounded-full p-1 z-20  hover:bg-red-700 cursor-pointer"
                          onClick={() => fileInputRef.current.click()}
                        ></i>
                      </span>
                    </form>
                  )}
                </Avatardiv>
                <div className=" hover:bg-red-400 -mt-9  rounded-full hover:scale-105">
                  {currProfile._id === user._id ? (
                    <div>
                      <button
                        className="border border-gray-300 rounded-full p-2 px-3 bg-gray-400 hover:border hover:border-gray-700 font-bold"
                        onClick={() => setOpen(true)}
                      >
                        Edit Profile
                      </button>
                      {open && (
                        <Edit user={user} open={open} setOpen={setOpen} />
                      )}
                    </div>
                  ) : (
                    <div className=" px-7 py-2 rounded-full bg-red-600 text-white font-bold ">
                      {!currProfile.followers?.includes(user?._id) ? (
                        <button
                          onClick={() =>
                            handlefollow(currProfile._id, currProfile.userName)
                          }
                        >
                          Follow
                        </button>
                      ) : (
                        <button onClick={() => setShowDialog(true)}>
                          following
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="-mt-6 ml-4">
              <h1 className="text-2xl font-bold">{currProfile?.userName}</h1>
              <span className="font-semibold underline">
                <span className="font-bold">Following:</span>
                {currProfile?.following.length}
              </span>
              &nbsp;&nbsp;
              <span className="font-semibold underline">
                <span className="font-bold">Followers:</span>
                {currProfile?.followers.length}
              </span>
              <h3 className="text-gray-400">{`${currProfile?.email}`}</h3>
              <div>{currProfile?.description}</div>
            </div>
            <div className="h-auto w-inherit mb-2 mt-3">
              <hr />
              <div className="flex justify-center p-2">
                <h1 className="font-bold underline ">Posts</h1>
              </div>
              <Postbody className="flex flex-wrap w-full h-full">
                {userPostimage?.map((posts) => (
                  <div className=" p-3 " key={posts._id}>
                    <div className="relative">
                      <img
                        src={posts?.postImage}
                        className={`h-[150px] rounded-lg ${
                          !posts.postImage && "hidden" //this is for message with no post images
                        }`}
                      />
                      <div className="flex justify-center items-center text-white absolute inset-0 bg-black  bg-opacity-50 opacity-0 hover:opacity-90 transition-opacity duration-300">
                        <div className="flex gap-4">
                          <div className="flex items-center gap-1">
                            <span>
                              <i className={"fa-regular fa-heart "}></i>
                            </span>
                            <span>{posts.like.length}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <i className={"fa-regular fa-comment "} />
                            <span>{posts.comments.length}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* {posts.postImage === "" && (
                      <div className="w-inherit flex justify-center text-gray-400">
                        <div>😴No Posts.........</div>
                      </div>
                    )} */}
                  </div>
                ))}
              </Postbody>
            </div>
          </ProfileCont>
          <div className="hidden xl:block fixed right-8">
            <RightPanel />
          </div>
        </div>
      ) : (
        <div className="flex justify-center mt-7">
          <CircularProgress />
        </div>
      )}
    </ProfileDiv>
  );
};

export default Profile;
