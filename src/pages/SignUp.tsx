import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAppDispatch } from "../redux/hooks";
import { setUser } from "../redux/slices/user.slice";

const signupFields = [
  {
    label: "Full Name",
    name: "fullname",
    labelClassNames: "block text-gray-700 font-medium mb-1",
    inputClassnames: `rounded-lg px-3 py-2 focus:outline-none 
            focus:border-orange-500 w-full border-[1px] border-border`,
    type: "text",
    placeholder: "Enter your full name",
    required: true,
    autoComplete: "name",
  },
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
    label: "Mobile",
    name: "mobile",
    labelClassNames: "block text-gray-700 font-medium mb-1",
    inputClassnames: `rounded-lg px-3 py-2 focus:outline-none 
            focus:border-orange-500 w-full border-[1px] border-border`,
    type: "tel",
    placeholder: "Enter your mobile number",
    required: true,
    autoComplete: "tel",
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

const roles = [
  { value: "user", label: "Customer" },
  { value: "owner", label: "Restaurant Owner" },
  { value: "deliveryBoy", label: "Delivery Partner" },
];

export const SERVER_URL = "http://localhost:8000/api/v1";

interface SignupData {
  fullname: string;
  email: string;
  mobile: string;
  password: string;
  role: string;
}

interface FormErrors {
  fullname?: string;
  email?: string;
  mobile?: string;
  password?: string;
  role?: string;
  submit?: string;
}

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState<SignupData>({
    email: "",
    fullname: "",
    mobile: "",
    password: "",
    role: "user",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleRoleChange = (role: string) => {
    setUserData((prev) => ({
      ...prev,
      role,
    }));
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/(?=.*[a-z])/.test(password))
      return "Password must contain a lowercase letter";
    if (!/(?=.*[A-Z])/.test(password))
      return "Password must contain an uppercase letter";
    if (!/(?=.*\d)/.test(password)) return "Password must contain a number";
    if (!/(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/.test(password))
      return "Password must contain a special character";
    return undefined;
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (userData.fullname.trim().length < 3) {
      newErrors.fullname = "Full name must be at least 3 characters";
    }

    if (!userData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = "Email is invalid";
    }

    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(userData.mobile.trim())) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number";
    }

    const passwordError = validatePassword(userData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    if (!userData.role) {
      newErrors.role = "Please select a role";
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
        `${SERVER_URL}/auth/create-new-account`,
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
        <p className="text-gray-500 mb-3 text-center">
          Create an account to start ordering your favorite meals.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {signupFields.map((field, index) => (
            <div className="mb-3 relative" key={index}>
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
                value={userData[field.name as keyof SignupData] as string}
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

          <div className="mb-3">
            <label
              htmlFor="role"
              className="block text-gray-700 font-medium mb-1"
            >
              Role <span className="text-red-500 ml-1">*</span>
            </label>

            <div className="flex gap-2">
              {roles.map((r, index) => (
                <button
                  key={index}
                  type="button"
                  name="role"
                  className={`flex-1 min-w-[100px] text-sm rounded-lg text-center font-medium px-3 py-2 focus:outline-none 
                    focus:border-orange-500 w-full border-[1px] cursor-pointer border-border transition-colors ${
                      r.value === userData.role
                        ? "bg-primary text-white"
                        : "hover:bg-gray-100"
                    }`}
                  onClick={() => handleRoleChange(r.value)}
                  aria-pressed={r.value === userData.role}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {errors.role && (
              <p id="role-error" className="text-red-500 text-sm mt-1">
                {errors.role}
              </p>
            )}
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
            className="w-full rounded-lg bg-primary text-white font-medium hover:bg-hover transition-all mt-3 px-3 py-2 focus:outline-none 
              focus:border-orange-500 border-[1px] cursor-pointer border-border disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="my-3 flex items-center">
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
          <span>Signup with Google</span>
        </button>

        <p className="mt-4 text-center text-base">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
