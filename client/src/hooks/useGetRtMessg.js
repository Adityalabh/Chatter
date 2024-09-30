import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setChatting } from "../redux/chattingSlice";

export const useGetRtMessg = ()=>{
    const {socket} = useSelector(store => store.socketio);
    const {chattings} = useSelector(store => store.chat);
    const dispatch = useDispatch();
    useEffect(()=>{
        socket?.on('newMessage',(newChat)=>{
            dispatch(setChatting([...(Array.isArray(chattings) ? chattings : []), newChat]));
        });

        // if user leaves without proper closing 
        return()=>{
            socket?.off('newMessage');
        }
    },[chattings,setChatting]);
}