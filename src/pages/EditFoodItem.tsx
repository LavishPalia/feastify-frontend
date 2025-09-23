import { useLocation } from "react-router-dom";
import FoodItemForm from "../components/FoodForm";
import { useAppSelector } from "../redux/hooks";

const EditFoodItem = () => {
  const { restaurant } = useAppSelector((state) => state.restaurant);
  const location = useLocation();

  console.log(location);

  return (
    <div>
      <FoodItemForm
        restaurantId={restaurant?._id || ""}
        mode="edit"
        defaultValues={{ ...location.state.item }}
      />
    </div>
  );
};

export default EditFoodItem;
