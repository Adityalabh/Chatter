import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getOtherUser } from "../redux/userSlice";
import axios from "axios";

export const useGetOtherUser = () => {
  const {user} = useSelector(store => store.user);
//   const id = user?._id;
    
    const dispatch = useDispatch();
    useEffect(() => {
        try {
            if(user){
                
                axios.get(`/user/otheruser`).then((res) => {
                    dispatch(getOtherUser(res?.data));
                });
            }
        } catch (error) {
            console.log(error.message);
        }   
    }, [user?.id]);
}

//  default useGetOtherUser;