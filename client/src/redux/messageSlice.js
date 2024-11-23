import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
    name:"message",
    initialState:{
        message:[],
        isActive:true,
        refresh:false,
    },
    reducers:{
        getallMessage:(state,action)=>{
            state.message = action.payload || [];
        },
        getIsActive:(state)=>{
            state.isActive = !state.isActive;
        },
        getRefresh:(state)=>{
            state.refresh = !state.refresh;
        },
        
    }

});

export const {getallMessage ,getRefresh,getIsActive} = messageSlice.actions;

export default messageSlice.reducer;