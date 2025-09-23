import { FaPen, FaUtensils } from "react-icons/fa";
import { useAppSelector } from "../../redux/hooks";
import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom";
import useGetRestaurantDetails from "../../hooks/useGetRestaurantDetails";
import { LuLoaderCircle } from "react-icons/lu";
import FoodItemCard from "../FoodItemCard";

export interface FoodItem {
  _id: string;
  name: string;
  image: string;
  category: string;
  price: number;
  description: string;
  type: string;
}

const RestaurantOwner = () => {
  const { restaurant } = useAppSelector((state) => state.restaurant);
  const { loading: loadingRestaurantDetails } = useGetRestaurantDetails();
  const navigate = useNavigate();

  if (loadingRestaurantDetails) {
    return (
      <div className="flex items-center justify-center gap-2 h-screen bg-background">
        <LuLoaderCircle size={30} className="animate-spin" />
        <span className="text-3xl">Loading Restaurant Details...</span>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-background">
      <Navbar />

      {!restaurant && (
        <div className="flex justify-center items-center p-4 sm:p-6 mt-16">
          <div
            className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 
          border border-gray-200 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex flex-col items-center text-center">
              <FaUtensils className="size-16 text-primary sm:size-20 mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Add your Restaurant
              </h2>
              <p className="text-gray-600 text-sm mb-4 sm:text-base">
                Join our delivery network and reach millions of customers every
                day.
              </p>
            </div>
            <button
              className="py-2 sm:py-3 px-5 sm:px-6 mx-auto block bg-primary text-white font-medium rounded-full shadow-md hover:bg-primary/90 transition-colors duration-300"
              onClick={() => navigate("/create-restaurant")}
            >
              Get Started
            </button>
          </div>
        </div>
      )}

      {restaurant && (
        <div className="w-full flex flex-col items-center gap-6 px-4 sm:px-6 py-2">
          <h1 className="flex text-2xl sm:text-3xl font-bold text-gray-900 items-center gap-3 mt-24 text-center">
            <FaUtensils className="size-16 text-primary sm:size-14" />
            <span>Welcome to {restaurant.name}</span>
          </h1>

          <div className="bg-white rounded-3xl shadow-xl border border-orange-100 hover:shadow-2xl transition-all duration-300 w-full max-w-3xl relative overflow-hidden">
            <div
              className="absolute top-4 right-4 bg-gradient-to-tr from-orange-500 to-primary text-white cursor-pointer p-3 rounded-full shadow-lg transition hover:scale-105 hover:from-orange-600 hover:to-primary"
              title="Edit Restaurant"
            >
              <FaPen size={20} onClick={() => navigate("/edit-restaurant")} />
            </div>

            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-full h-56 sm:h-72 object-cover"
            />

            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {restaurant.name}
              </h2>
              <div className="space-y-1">
                <p className="text-gray-500 font-medium">
                  {restaurant.address}
                </p>
                <p className="inline-block bg-gray-100 text-orange-600 py-1 px-3 rounded-full text-sm font-medium mr-2">
                  {restaurant.city}
                </p>
                <p className="inline-block bg-gray-100 text-primary py-1 px-3 rounded-full text-sm font-medium">
                  {restaurant.state}
                </p>
              </div>
            </div>
          </div>

          {restaurant.items.length === 0 && (
            <div className="flex justify-center items-center p-4 sm:p-6 mt-16">
              <div
                className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 
          border border-gray-200 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  <FaUtensils className="size-8 text-primary sm:size-12 mb-4" />
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                    Add Food Item
                  </h2>
                  <p className="text-gray-600 text-sm mb-4 sm:text-base">
                    Add your food items to your restaurant
                  </p>
                </div>
                <button
                  className="py-2 sm:py-3 px-5 sm:px-6 mx-auto block bg-primary text-white font-medium rounded-full shadow-md hover:bg-primary/90 transition-colors duration-300"
                  onClick={() => navigate("/add-food-item")}
                >
                  Add Food
                </button>
              </div>
            </div>
          )}

          {restaurant.items.length > 0 && (
            <div className="flex flex-col items-center gap-4 w-full max-w-3xl">
              {restaurant.items.map((item: FoodItem) => (
                <FoodItemCard key={item._id} item={item} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RestaurantOwner;
