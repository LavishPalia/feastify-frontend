import axios from "axios";
import { useEffect, useState } from "react";
import { setRestaurant } from "../redux/slices/restaurantSlice";
import { useAppDispatch } from "../redux/hooks";

const useGetRestaurantDetails = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/restaurants/details`,
          {
            withCredentials: true,
          }
        );

        dispatch(setRestaurant(data.data));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, []);

  return { loading };
};

export default useGetRestaurantDetails;
