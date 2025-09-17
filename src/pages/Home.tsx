import Customer from "../components/Dashboards/Customer";
import DeliveryBoy from "../components/Dashboards/DeliveryBoy";
import RestaurantOwner from "../components/Dashboards/RestaurantOwner";
import { useAppSelector } from "../redux/hooks";

const Home = () => {
  const { user } = useAppSelector((state) => state.user);

  return (
    <>
      {user?.role === "user" && <Customer />}
      {user?.role === "owner" && <RestaurantOwner />}
      {user?.role === "deliveryBoy" && <DeliveryBoy />}
    </>
  );
};

export default Home;
