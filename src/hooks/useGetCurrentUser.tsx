import axios from "axios";
import { useEffect, useState } from "react";
import { SERVER_URL } from "../pages/SignUp";
import { clearUser, setUser } from "../redux/slices/user.slice";
import { useAppDispatch } from "../redux/hooks";

const useGetCurrentUser = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const { data } = await axios.get(`${SERVER_URL}/users/current`, {
          withCredentials: true,
        });

        dispatch(setUser(data.data));
      } catch (error) {
        console.log(error);
        dispatch(clearUser());
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  return { loading };
};

export default useGetCurrentUser;
