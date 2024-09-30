import axios from "axios"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getcurrProfile } from "../redux/userSlice"

export const useGetUserProfile = (id) => {
    const {profilerefresh} = useSelector(store=>store.user);
    const dispatch = useDispatch();
    useEffect(() => {
        try {
            axios.get(`/user/profile/${id}`).then((res) => {
                dispatch(getcurrProfile(res?.data));
            });
        } catch (error) {
            console.log(error.message);
        }
    }, [id,profilerefresh]);
}
