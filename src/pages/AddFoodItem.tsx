import FoodForm from "../components/FoodForm";
import { useAppSelector } from "../redux/hooks";

const AddFoodItem = () => {
  const { restaurant } = useAppSelector((state) => state.restaurant);

  console.log(restaurant);

  return (
    <div>
      <FoodForm restaurantId={restaurant?._id || ""} mode="create" />
    </div>
  );
};

export default AddFoodItem;
