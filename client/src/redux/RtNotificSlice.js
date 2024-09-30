import { createSlice } from "@reduxjs/toolkit";

const RtNotificSlice = createSlice({
    name: "realTimeNotification",
    initialState: {
        likenotification:[],
    },
    reducers: {
        setLikenotification: (state,action) => {
            if (action.payload.type === 'like') {
                state.likenotification.push(action.payload);
            }
            // else if (action.payload.type === 'dislike') {
            //     state.likenotification.pull(action.payload);
            // }
            else if (action.payload.type === 'dislike') {
                state.likenotification = state.likenotification.filter((item) => item.userId !== action.payload.userId);
            }
            else if(action.payload.type === 'reset'){
                state.likenotification = [];
            }
        },
        
    }


}); 

export const {setLikenotification} = RtNotificSlice.actions;
export default RtNotificSlice.reducer;