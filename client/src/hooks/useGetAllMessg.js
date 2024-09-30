import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getallMessage } from "../redux/messageSlice";
import axios from "axios";
import { toast } from "react-toastify";


export const useGetAllMessg = (id) => {
    const { refresh, isActive } = useSelector((store) => store.message);
    const { user } = useSelector((store) => store.user);
    const dispatch = useDispatch();

    console.log("isActive", isActive ,"userID---->",id);

    const fetchfollowMessg = async () => {
        try {
            const res = await axios.get(`/message/followingmessg/${id}`);
            dispatch(getallMessage(res?.data));
            // console.log("useGetAllMessg data", res?.data);
        } catch (error) {
            console.log(error.message);
        }
    }

    const fetchallmessage = async () => {
        try {
            const res = await axios.get(`/message/allmessages/${id}`);
            // console.log("all messaages", res?.data);
            dispatch(getallMessage(res?.data));

        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        if (isActive) {
            fetchallmessage();
        } else {
            fetchfollowMessg();
        }
    }, [refresh, isActive]);
}

