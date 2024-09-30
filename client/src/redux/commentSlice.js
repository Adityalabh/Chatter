import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const commentSlice = createSlice({
    name:"comments",
    initialState:{
        comments:[],
        commentRefresh:false,
    },
    reducers:{
        getallcomments:(state,action)=>{
            state.comments = action.payload;
        },
        getCommentRefresh:(state)=>{
            state.commentRefresh = !state.commentRefresh;
        }
    }
});

export const {getallcomments ,getCommentRefresh} = commentSlice.actions;
export default commentSlice.reducer;