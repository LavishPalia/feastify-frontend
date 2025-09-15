import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { SERVER_URL } from "./SignUp";
import { setUser } from "../redux/slices/user.slice";
import { useAppDispatch } from "../redux/hooks";

const loginFields = [
  {
    label: "Email",
    name: "email",
    labelClassNames: "block text-gray-700 font-medium mb-1",
    inputClassnames: `rounded-lg px-3 py-2 focus:outline-none 
            focus:border-orange-500 w-full border-[1px] border-border`,
    type: "email",
    placeholder: "Enter your email",
    required: true,
    autoComplete: "email",
  },
  {
    label: "Password",
    name: "password",
    labelClassNames: "block text-gray-700 font-medium mb-1",
    inputClassnames: `rounded-lg px-3 py-2 focus:outline-none 
            focus:border-orange-500 w-full border-[1px] border-border pr-10`, // Added padding for eye icon
    type: "password",
    placeholder: "Enter your password",
    required: true,
    autoComplete: "new-password",
  },
];

interface LoginData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  submit?: string;
}

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handlePasswordToggle = () => {
    setShowPassword((prev) => !prev);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
      submit: undefined,
    }));
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return "Password is required";
    // if (password.length < 8) return "Password must be at least 8 characters";
    return undefined;
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!userData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = "Email is invalid";
    }

    const passwordError = validatePassword(userData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    setErrors(newErrors);
    return {
      isValid: Object.keys(newErrors).length === 0,
      errors: newErrors,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateForm();
    if (!validation.isValid) {
      const firstErrorField = Object.keys(validation.errors)[0];
      if (firstErrorField) {
        document.getElementById(firstErrorField)?.focus();
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await axios.post(
        `${SERVER_URL}/auth/login`,
        {
          ...userData,
        },
        {
          withCredentials: true,
        }
      );

      dispatch(setUser(data.data.user));
    } catch (error: any) {
      console.error("Signup failed:", error);

      if (error.response.data.errors.length > 0) {
        error.response.data.errors.forEach((error: any) => {
          setErrors((prev) => ({
            ...prev,
            [error.path]: error.msg,
          }));
        });
      }
      setErrors((prev) => ({
        ...prev,
        submit: error.response.data.error || "Signup failed. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-[490px] px-4 py-4 border-[1px] border-border">
        <h1 className="text-2xl font-bold mb-2 text-primary text-center">
          Feastify
        </h1>
        <p className="text-gray-500 mb-8 text-center">
          Login to start enjoying your favorite meals.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {loginFields.map((field, index) => (
            <div className="mb-4 relative" key={index}>
              <label htmlFor={field.name} className={field.labelClassNames}>
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                id={field.name}
                type={
                  field.type === "password"
                    ? showPassword
                      ? "text"
                      : "password"
                    : field.type
                }
                name={field.name}
                className={`${field.inputClassnames} ${
                  errors[field.name as keyof FormErrors] ? "border-red-500" : ""
                }`}
                placeholder={field.placeholder}
                value={userData[field.name as keyof LoginData] as string}
                onChange={handleInputChange}
                required={field.required}
                autoComplete={field.autoComplete}
                aria-invalid={
                  errors[field.name as keyof FormErrors] ? "true" : "false"
                }
                aria-describedby={
                  errors[field.name as keyof FormErrors]
                    ? `${field.name}-error`
                    : undefined
                }
              />

              {field.type === "password" && (
                <button
                  type="button"
                  className="absolute right-3 top-[38px] cursor-pointer text-gray-500 focus:outline-none"
                  onClick={handlePasswordToggle}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <FaEyeSlash size={20} />
                  ) : (
                    <FaEye size={20} />
                  )}
                </button>
              )}

              {errors[field.name as keyof FormErrors] && (
                <p
                  id={`${field.name}-error`}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors[field.name as keyof FormErrors]}
                </p>
              )}
            </div>
          ))}

          <div
            className="text-primary/75 font-medium cursor-pointer mx-auto w-fit mr-0"
            onClick={() => navigate("/forgot-password")}
          >
            <p>Forgot Password ?</p>
          </div>

          {errors.submit && (
            <div className="my-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-500 text-sm flex justify-center items-center gap-2">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.submit}
              </p>
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-primary text-white font-medium hover:bg-hover transition-all mt-4 px-3 py-2 focus:outline-none 
              focus:border-orange-500 border-[1px] cursor-pointer border-border disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging In..." : "Login"}
          </button>
        </form>

        <div className="my-4 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <button
          className="w-full flex items-center gap-2 justify-center rounded-lg
            text-black font-medium hover:bg-gray-100 
            transition duration-200 px-4 py-2 focus:outline-none 
           cursor-pointer border-[1px] border-gray-400"
          type="button"
        >
          <FcGoogle size={20} />
          <span>Login with Google</span>
        </button>

        <p className="mt-6 text-center text-base">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
