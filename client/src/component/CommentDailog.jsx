import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Avatar from "react-avatar";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getallcomments, getCommentRefresh } from "../redux/commentSlice";
import { getIsActive, getRefresh } from "../redux/messageSlice";

const ChatDialog = ({ open, setOpen, messg, allUser, user }) => {
  // const theme = useTheme();

  const handleClose = () => {
    setOpen(false);
  };

  const endOfMessagesRef = React.useRef(null);
  const [postComment, setPostComment] = React.useState("");
  const dispatch = useDispatch();
  const { commentRefresh, comments } = useSelector((store) => store.comments);

  React.useEffect(() => {
    async function getcomments() {
      try {
        const res = await axios.get(`/message/allComments/${messg?._id}`);
        dispatch(getallcomments(res?.data));
      } catch (err) {
        console.log(err.message);
      }
      console.log(messg._id, open);
    }
    if (open === true) {
      getcomments();
    }
  }, [messg?._id, commentRefresh]);

  React.useEffect(() => {
    // Scroll to the bottom of the messages container when messages change
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments]);

  // console.log(comment);

  let handleComment = async (id) => {
    try {
      const res = await axios.post(`/message/post/comment/${id}`, {
        text: postComment,
      });
      toast.success("comment added");
      setPostComment("");
      console.log(postComment, res?.data);
      dispatch(getCommentRefresh());
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  let handlecommentDelete = async (id) => {
    try {

      const result = await axios.post(`/message/commentDelete/${id}`, 
         {messageId:messg?._id}
      );

      dispatch(getCommentRefresh());
      dispatch(getRefresh());
      toast.success('message deleted');
      console.log("commentId", id, "messageId", messg._id);
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="scroll-dialog-title"
    >
      <DialogContent className="!p-0 relative">
        <div className="flex  gap-2 min-h-[200px] max-h-[27rem]   relative">
          {/* Image */}
          <div className="flex  flex-1 border-r border-gray-400 ">
            {messg?.postImage ? ( 
              <div className="h-full ">
                <img
                  src={messg?.postImage}
                  alt="image"
                  className=" h-full w-full object-contain bg-black"
                />
              </div>
            ) : (
              <div>
                {/* userMessage posted message if post image is not there*/}
                {!messg?.profileImage && (
                  <div className=" flex flex-col p-4 justify-between overflow-auto scrollbar-hide">
                    <div className="flex gap-2 items-center bg-gray-200 p-1 rounded-xl">
                      <div>
                        <Avatar
                          src={allUser?.profileImage}
                          size="40"
                          round={true}
                        />
                      </div>
                      <div className="flex flex-col">
                        {/* <p>rewara</p> */}
                        <div> {allUser?.email}</div>
                        <div className="-mt-2">{allUser?.userName}</div>
                      </div>
                    </div>

                    <div className=" mt-2 bg-gray-200 p-2 rounded-md">
                      <h1 className="font-bold text-lg">Message:</h1>
                      {messg?.description}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Commments */}
          <div className="flex flex-1  flex-col justify-between ">
            {/* <div className="overflow-y-auto"> */}
            {/* post creator message */}
            {messg?.postImage && (
              <div className="  ">
                <div className=" pt-2 flex items-center  gap-2">
                  <div>
                    <Avatar
                      src={allUser?.profileImage}
                      size="35"
                      round={true}
                    />
                  </div>

                  <div className="-mt-2 text-black  flex">
                    <div className="font-bold">{allUser?.userName}</div>
                    <div className="pl-2 ">{messg?.description}</div>
                  </div>
                  
                </div>
                <hr className="border border-gray-300 -ml-2 mt-2" />
              </div>
            )}

            {/* comments messages */}
            <div className="overflow-y-auto bg-gray-200 -ml-1">
              {comments?.map((comment) => (
                <div key={comment?._id}>
                  <div className="flex gap-1 mt-2 p-1 items-center">
                    <div>
                      <Avatar
                        src={comment.author?.profileImage}
                        size="35"
                        round={true}
                      />
                    </div>

                    {/* message */}
                    <div className="w-full flex justify-between">
                      <div className=" flex">
                        <div className="font-bold">
                          {comment?.author.userName}
                        </div>
                        <div className="pl-2 ">{comment?.text}</div>
                      </div>

                      {/* Comment delete */}
                      <div
                        className=" pr-2"
                        onClick={() => handlecommentDelete(comment?._id)}
                      >
                        {comment.author._id === user._id && <i className="fa-regular fa-trash-can p-2 text-red-600 cursor-pointer"></i>}
                      </div>
                    </div>
                    <div ref={endOfMessagesRef} />
                  </div>
                </div>
              ))}
            </div>

            <DialogActions className="">
              <div className="flex gap-2 items-center ">
                <div>
                  <Avatar src={user?.profileImage} size="35" round={true} />
                </div>
                <input
                  type="text"
                  placeholder="Enter Comment..."
                  value={postComment}
                  onChange={(e) => setPostComment(e.target.value)}
                  className="w-full p-1"
                />

                <Button
                  disabled={!postComment.trim()}
                  variant="contained"
                  color="error"
                  type="submit"
                  sx={{
                    paddingInline: "20px",
                    background: "rgb(	220 0,0)",
                    "&.Mui-disabled": {
                      backgroundColor: "gray",
                      color: "white",
                    },
                  }}
                  onClick={() => handleComment(messg?._id)}
                >
                  Post
                </Button>
              </div>
            </DialogActions>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatDialog;
