import RestaurantForm from "../components/RestaurantForm";
import { useAppSelector } from "../redux/hooks";

const EditRestaurant = () => {
  const { restaurant } = useAppSelector((state) => state.restaurant);

  const defaultValues = {
    name: restaurant?.name,
    image: restaurant?.image,
    address: restaurant?.address,
    city: restaurant?.city,
    state: restaurant?.state,
    _id: restaurant?._id,
  };

  return (
    <div>
      <RestaurantForm mode="edit" defaultValues={defaultValues} />
    </div>
  );
};

export default EditRestaurant;
