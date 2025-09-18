import { FaPen, FaUtensils } from "react-icons/fa";
import { useAppSelector } from "../../redux/hooks";
import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom";

const RestaurantOwner = () => {
  const { restaurant } = useAppSelector((state) => state.restaurant);

  const navigate = useNavigate();

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
        <div className="w-full flex flex-col items-center gap-6 px-4 sm:px-6">
          <h1 className="flex text-2xl sm:text-3xl font-bold text-gray-900 items-center gap-3 mt-24 text-center">
            <FaUtensils className="size-16 text-primary sm:size-14" />
            <span>Welcome to {restaurant.name}</span>
          </h1>

          <div
            className="bg-white shadow-lg rounded-2xl overflow-hidden border border-orange-100
           hover:shadow-2xl transition-all duration-300 w-full max-w-3xl relative"
          >
            <div className="absolute top-4 right-4 bg-primary text-white cursor-pointer p-2 rounded-full shadow-md transition-colors hover:bg-orange-600">
              <FaPen size={20} onClick={() => navigate("/edit-restaurant")} />
            </div>
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-full h-48 sm:h-64 object-cover"
            />
            <div className="p-4 sm:p-6">
              <h2 className="text-xl font-semibold mb-2">{restaurant.name}</h2>
              <p className="text-gray-600 mb-2">{restaurant.address}</p>
              <p className="text-gray-600 mb-2">{restaurant.city}</p>
              <p className="text-gray-600 mb-2">{restaurant.state}</p>
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
                  onClick={() => navigate("/create-item")}
                >
                  Get Started
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RestaurantOwner;
