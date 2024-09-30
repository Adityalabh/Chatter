
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:"user",
    initialState:{
        user:null,
        otherUser:null,
        currProfile:null,
        userRefresh:false,
        otherUserRefresh:false,
        profilerefresh:false,
        // naya:true
    },
    reducers:{
        getUser:(state,action)=>{
            state.user = action.payload;
        },

        getOtherUser:(state,action)=>{
            state.otherUser = action.payload;
        },

        getcurrProfile:(state,action)=>{
            state.currProfile = action.payload;
        },
        
        getuserRefresh:(state)=>{
            state.userRefresh = !state.userRefresh;
        },
        getotherUserRefresh:(state)=>{
            state.otherUserRefresh = !state.otherUserRefresh ;
        },
        getProfileReresh:(state)=>{
            state.profilerefresh = !state.profilerefresh;
        }
    }
});

export const {getUser,getOtherUser,getcurrProfile,getuserRefresh,getotherUserRefresh,getProfileReresh} =   userSlice.actions;
export default userSlice.reducer;