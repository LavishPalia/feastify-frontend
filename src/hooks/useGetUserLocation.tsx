import axios from "axios";
import { useEffect, useState } from "react";
import { setLocation } from "../redux/slices/user.slice";
import { useAppDispatch } from "../redux/hooks";

const GEOLOCATION_API_ENDPOINT = "https://api.geoapify.com/v1/geocode/reverse";

const useGetUserLocation = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const { data } = await axios.get(
          `${GEOLOCATION_API_ENDPOINT}?lat=${latitude}&lon=${longitude}&format=json&apiKey=${
            import.meta.env.VITE_GEOLOCATION_API_KEY
          }`
        );

        dispatch(
          setLocation({
            city: data.results[0].city,
          })
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    });
  }, []);

  return { loading };
};

export default useGetUserLocation;
