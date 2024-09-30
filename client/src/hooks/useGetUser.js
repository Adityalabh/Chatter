    import { useDispatch, useSelector } from "react-redux"
    import { getUser } from "../redux/userSlice";
    import { useEffect } from "react";
    import axios from "axios";

    export const useGetUser = () => {
        const { user, userRefresh } = useSelector(store => store.user);
        const dispatch = useDispatch();
        const id = user?._id;
        // console.log(user._id);
        useEffect(() => {
            if (id) {  // Only proceed if `id` is defined
                const fetchUser = async () => {
                    try {
                        const res = await axios.get(`/user/profile/${id}`);
                        dispatch(getUser(res?.data));  // Dispatch the updated user data
                    } catch (error) {
                        console.error("Error fetching user:", error.message);
                    }
                };
                fetchUser();  // Call the async fetch function
            }
        }, [userRefresh]); 
    }

