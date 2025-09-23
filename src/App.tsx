import { Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import useGetCurrentUser from "./hooks/useGetCurrentUser";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { LuLoaderCircle } from "react-icons/lu";
import CreateRestaurant from "./pages/CreateRestaurant";
import EditRestaurant from "./pages/EditRestaurant";
import AddFoodItem from "./pages/AddFoodItem";
import EditFoodItem from "./pages/EditFoodItem";

function App() {
  const { loading } = useGetCurrentUser();

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 h-screen bg-background">
        <LuLoaderCircle size={30} className="animate-spin" />
        <span className="text-3xl">Loading Home Screen...</span>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-restaurant"
        element={
          <ProtectedRoute>
            <CreateRestaurant />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-restaurant"
        element={
          <ProtectedRoute>
            <EditRestaurant />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-food-item"
        element={
          <ProtectedRoute>
            <AddFoodItem />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-food-item"
        element={
          <ProtectedRoute>
            <EditFoodItem />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
