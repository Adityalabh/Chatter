import { Button, Dialog, DialogContent } from "@mui/material";
import axios from "axios";
// import { set } from "mongoose";
import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { getIsActive, getRefresh } from "../redux/messageSlice";
import { readFileAsDataURL } from "../utils/readFileAsDataURL";
import { toast } from "react-toastify";

const Post = ({ open, setOpen }) => {
  let [description, setDescription] = useState("");
  let [postImage, setPostImage] = useState();
  let [imagePreview, setImagePreview] = useState();
  let [loading, setLoading] = useState(true);

  const imageRef = useRef();
  const dispatch = useDispatch();

  const imageHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPostImage(file);
      const DataURI = await readFileAsDataURL(file);
      setImagePreview(DataURI);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("description", description);
      if (postImage) {
        formData.append("postImage", postImage);
      }

      await axios.post("/message/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(getRefresh());
      toast.success("message sent");
    } catch (err) {
      console.log({ error: "message is not sent", details: err.message });
      toast.error(err.message);
    } finally {
      setLoading(false);
      setDescription("");
      setPostImage(null);
      setImagePreview(null);
      imageRef.current.value = "";
    }
    setDescription("");
    // redirect(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    // <div className="z-20 fixed flex justify-center items-center bg-[rgba(0,0,0,0.7)] min-h-screen w-[100vw] shadow-sm">

    // </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="scroll-dialog-title"
        
      >
        <DialogContent className="max-h-[500px] w-[500px] p-4 bg-white  rounded-2xl  ">
          <div className="text-right text-xl -mt-3">
            <i
              className="fa-solid fa-xmark hover:bg-gray-300 rounded-2xl  cursor-pointer"
              onClick={handleClose}
            ></i>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mt-1">
              <textarea
                placeholder="What is happening now"
                className="text-xl placeholder:text-gray-500 px-3  bg-gray-200 w-full outline-none rounded-xl p-2 h-[100px]"
                rows={7}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="flex gap-2 items-center mt-1 mb-2">
              {/* Image inputs */}
              <input
                type="file"
                ref={imageRef}
                onChange={imageHandler}
                className="hidden"
              />
              <span className="font-bold">Upload:</span>
              <i
                className="fa-solid fa-image text-red-700 cursor-pointer"
                onClick={() => imageRef.current.click()}
              ></i>
            </div>
            <div>
              {imagePreview && (
                <div>
                  <div className="flex justify-center border-2 border-red-200 rounded-xl">
                    <img
                      src={imagePreview}
                      alt="image"
                      className="max-h-[150px] object-contain rounded-md m-2 "
                    />
                  </div>
                  <div className="text-right">
                    <button
                      className="text-red-600 font-bold bg-gray-300 p-1 rounded-md mt-2"
                      onClick={() => {
                        setPostImage(null);
                        setImagePreview(null);
                        imageRef.current.value = "";
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-center mt-3">
              <Button
                variant="contained"
                color="error"
                disabled={!description.trim()}
                sx={{
                  borderRadius: "10px",
                  paddingInline: "30px",
                  "&.Mui-disabled": {
                    backgroundColor: "rgba(255,120,127)",
                    color: "white",
                  },
                }}
                type="submit"
                // onClick={handleSubmit}
              >
                {loading ? <div>Post</div> : <div>Please wait</div>}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
  );
};

export default Post;
