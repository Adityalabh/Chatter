import axios from "axios"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { setChatting } from "../redux/chattingSlice";

export const useGetAllChat = () => {
    const dispatch = useDispatch();
    const { chatSelectedUser,selectedUserRefresh } = useSelector(store => store.chatSelectedUser);

    useEffect(() => {

        try {
            const id = chatSelectedUser?._id;
            axios.get(`/chat/getchat/${id}`).then((res) => {
                dispatch(setChatting(res?.data));
            });
        } catch (error) {
            console.log(error.message);
        }
    }, [chatSelectedUser,selectedUserRefresh]);
}