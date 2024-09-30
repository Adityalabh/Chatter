import { createSlice } from "@reduxjs/toolkit";

const chatSelectedUserSlice = createSlice({
    name:'chatSelectedUser',
    initialState:{
        chatSelectedUser:null,
        selectedUserRefresh:false,
    },
    reducers:{
        getSelectedUser:(state,action)=>{
            state.chatSelectedUser = action.payload;
        },
        getSelectedUserRefresh:(state)=>{
            state.selectedUserRefresh = !state.selectedUserRefresh;
        }
    }
});

export const {getSelectedUser,getSelectedUserRefresh} = chatSelectedUserSlice.actions;
export default chatSelectedUserSlice.reducer;
