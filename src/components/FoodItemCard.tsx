import { FaPen, FaTrashAlt } from "react-icons/fa";
import type { FoodItem } from "./Dashboards/RestaurantOwner";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setRestaurant } from "../redux/slices/restaurantSlice";

interface FoodItemCardProps {
  item: FoodItem;
}

const FoodItemCard = ({ item }: FoodItemCardProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { restaurant } = useAppSelector((state) => state.restaurant);

  const handleEdit = () => {
    navigate("/edit-food-item", {
      state: { item },
    });
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const { data } = await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/items/delete/${restaurant?._id}/${
          item._id
        }`,
        {
          withCredentials: true,
        }
      );

      dispatch(setRestaurant(data.data));
    } catch (error: any) {
      console.log(error);

      setError(error.response?.data.error || "Failed to delete item");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="relative flex bg-white rounded-2xl shadow-lg border border-gray-100 transition-shadow hover:shadow-2xl w-full max-w-2xl overflow-hidden">
      <div className="w-40 sm:w-44 bg-gray-200 flex-shrink-0 overflow-hidden rounded-l-2xl self-stretch">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />
      </div>
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{item.name}</h2>
          {item.description && (
            <p className="text-sm font-semibold text-gray-600 mb-3 line-clamp-2 max-w-sm">
              {item.description}
            </p>
          )}
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
              {item.category}
            </span>
            <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
              {item.type}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="font-extrabold text-lg text-primary">
            ₹ {item.price}{" "}
            <span className="text-xs font-normal text-gray-500">/ only</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              title="Edit"
              className="p-2 rounded-full bg-gray-100 text-primary transition hover:bg-primary hover:text-white"
              onClick={handleEdit}
            >
              <FaPen size={16} />
            </button>
            <button
              title="Delete"
              className="p-2 rounded-full bg-gray-100 text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <FaTrashAlt size={16} />
            </button>
          </div>
        </div>

        {error && (
          <div className="absolute top-1/4 right-1/3 flex items-center justify-center rounded-2xl">
            <div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg max-w-xs mx-auto text-center animate-fade-in">
              <div className="font-semibold mb-1">Error</div>
              <div className="text-sm">{error}</div>
              <div className="text-xs mt-2 opacity-80">
                Auto-closing in 1 second...
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodItemCard;
