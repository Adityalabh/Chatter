import { createSlice } from "@reduxjs/toolkit";

const chattingSlice = createSlice({
    name:'chat',
    initialState:{
        onlineUser:[],
        chattings:[],
    },
    reducers:{
        setOnlineUsers:(state,action)=>{
            state.onlineUser = action.payload;
        },
        setChatting:(state,action)=>{
            state.chattings = action.payload;
        },

    }
});

export const {setOnlineUsers ,setChatting} = chattingSlice.actions;
export default chattingSlice.reducer;