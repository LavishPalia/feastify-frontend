// src/components/Navbar.tsx
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { FaLocationDot } from "react-icons/fa6";
import { FiShoppingCart } from "react-icons/fi";
import { IoIosSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { LuLoaderCircle } from "react-icons/lu";
import useGetUserLocation from "../hooks/useGetUserLocation";
import axios from "axios";
import { clearUser } from "../redux/slices/user.slice";
import { FaList, FaPlus, FaSignOutAlt, FaTruck, FaUser } from "react-icons/fa";
import { TbReceipt } from "react-icons/tb";
import useGetRestaurantDetails from "../hooks/useGetRestaurantDetails";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const NAV_ITEMS = {
    user: {
      showSearch: true,
      showCart: true,
      buttons: [
        { label: "My Orders", icon: <FaList size={12} />, onClick: undefined },
      ],
    },
    owner: {
      showSearch: false,
      showCart: false,
      buttons: [
        {
          label: "Add Food Item",
          icon: <FaPlus size={12} />,
          onClick: () => navigate("/add-food-item"),
        },
        {
          label: "Pending Orders",
          icon: <TbReceipt size={12} />,
          onclick: undefined,
        },
      ],
    },
    deliveryBoy: {
      showSearch: false,
      showCart: false,
      buttons: [
        {
          label: "My Deliveries",
          icon: <FaTruck size={12} />,
          onClick: undefined,
        },
      ],
    },
  };
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const [popupPos, setPopupPos] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  useGetRestaurantDetails();
  const { loading: loadingLocation } = useGetUserLocation();

  const { user, location } = useAppSelector((state) => state.user);
  const { restaurant } = useAppSelector((state) => state.restaurant);

  console.log(restaurant);

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const profileBtnRef = useRef<HTMLDivElement>(null);

  const handleToggleProfilePopup = () => {
    if (!profileBtnRef.current) return;
    const rect = profileBtnRef.current.getBoundingClientRect();
    setPopupPos({
      top: rect.bottom + 12,
      left: rect.left - 130,
    });
    setShowProfilePopup((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
      dispatch(clearUser());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (!profileBtnRef.current || !showProfilePopup) return;
      const rect = profileBtnRef.current.getBoundingClientRect();
      setPopupPos({
        top: rect.bottom + 12,
        left: rect.left - 130,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [showProfilePopup]);

  const role = user?.role || "user";
  const navConfig =
    role === "owner"
      ? {
          ...NAV_ITEMS.owner,
          buttons: restaurant
            ? NAV_ITEMS.owner.buttons
            : NAV_ITEMS.owner.buttons.slice(1),
        }
      : NAV_ITEMS[role as keyof typeof NAV_ITEMS];

  return (
    <div className="w-full h-[80px] flex items-center justify-between md:justify-around gap-[30px] px-[20px] fixed top-0 z-[9999] bg-background">
      {/* mobile search */}
      {showSearch && navConfig.showSearch && (
        <div className="fixed top-20 left-[5%] w-[90%] h-[55px] bg-white shadow-xl rounded-lg flex items-center gap-[20px] md:hidden">
          <div className="flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-[2px] border-gray-400">
            <FaLocationDot size={25} className="text-primary" />
            {loadingLocation ? (
              <LuLoaderCircle size={25} className="animate-spin text-primary" />
            ) : (
              <p className="w-[80%] truncate text-gray-600">{location?.city}</p>
            )}
          </div>
          <div className="flex items-center gap-[10px]">
            <IoIosSearch size={25} className="text-primary" />
            <input
              type="text"
              placeholder="Search delicious food"
              className="px-[10px] text-gray-700 w-full outline-0"
            />
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-2 text-primary">Feastify</h1>

      {/* desktop search for customers */}
      {navConfig.showSearch && (
        <div className="md:w-[60%] lg:w-[40%] h-[55px] bg-white shadow-xl rounded-lg hidden md:flex items-center gap-[20px]">
          <div className="flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-[2px] border-gray-400">
            <FaLocationDot size={25} className="text-primary" />
            {loadingLocation ? (
              <LuLoaderCircle size={25} className="animate-spin text-primary" />
            ) : (
              <p className="w-[80%] truncate text-gray-600">{location?.city}</p>
            )}
          </div>
          <div className="flex items-center gap-[10px]">
            <IoIosSearch size={25} className="text-primary" />
            <input
              type="text"
              placeholder="Search delicious food"
              className="px-[10px] text-gray-700 w-full outline-0"
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-[20px]">
        {navConfig.showSearch &&
          (showSearch ? (
            <RxCross2
              size={25}
              className="text-primary md:hidden"
              onClick={() => setShowSearch(false)}
            />
          ) : (
            <IoIosSearch
              size={25}
              className="text-primary md:hidden"
              onClick={() => setShowSearch(true)}
            />
          ))}

        {/* cart for customers */}
        {navConfig.showCart && (
          <div className="relative cursor-pointer">
            <FiShoppingCart size={25} className="text-primary" />
            <span className="absolute top-[-12px] right-[-9px] bg-red-500 text-white w-[20px] h-[20px] text-xs rounded-full flex items-center justify-center">
              0
            </span>
          </div>
        )}

        {navConfig.buttons.map(({ label, icon, onClick }) => (
          <div key={label} className="relative">
            <button
              className="px-3 py-2 cursor-pointer rounded-lg bg-primary/10 text-primary font-medium flex items-center gap-[10px]"
              onClick={onClick}
            >
              {icon}
              <span className="hidden md:inline">{label}</span>
            </button>

            {/* Badge only for Pending Orders */}
            {label === "Pending Orders" && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-[20px] h-[20px] rounded-full flex items-center justify-center">
                0
              </span>
            )}
          </div>
        ))}

        {/* profile button */}
        <div
          className="size-[40px] rounded-full flex items-center justify-center bg-primary text-white text-lg shadow-xl font-semibold cursor-pointer"
          onClick={handleToggleProfilePopup}
          ref={profileBtnRef}
        >
          {user?.fullname
            ?.split(" ")
            .map((part) => part[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()}
        </div>

        {/* profile popup */}
        {showProfilePopup && (
          <div
            className="fixed w-[180px] bg-white py-2 shadow-2xl rounded-xl flex flex-col gap-2.5 z-[9999]"
            style={{ top: popupPos.top, left: popupPos.left }}
          >
            <div className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2">
              <FaUser />
              <span className="text-[17px] font-semibold truncate">
                {user?.fullname}
              </span>
            </div>
            {navConfig.buttons.map(({ label, icon, onClick }) => (
              <div
                key={label}
                className="md:hidden font-semibold cursor-pointer flex gap-2 items-center px-3 py-2 hover:bg-gray-100"
                onClick={onClick}
              >
                {icon}
                <span className="">{label}</span>
              </div>
            ))}
            <div
              className="text-primary font-semibold cursor-pointer flex gap-2 items-center px-3 py-2 hover:bg-gray-100"
              onClick={handleLogout}
            >
              <FaSignOutAlt />
              Logout
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
