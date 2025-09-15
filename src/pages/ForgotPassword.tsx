import axios from "axios";
import { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { SERVER_URL } from "./SignUp";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState("");
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    let interval: number;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const navigate = useNavigate();

  const handleSendOtp = async () => {
    setIsSubmitting(true);
    setError("");
    try {
      const response = await axios.post(
        `${SERVER_URL}/auth/send-otp`,
        {
          email,
        },
        {
          withCredentials: true,
        }
      );

      console.log(response);

      setStep(2);
      setTimer(60);
    } catch (error: any) {
      console.log(`Error sending Otp mail`, error);

      setError(
        error.response.data.error || "OTP send failed. Please try again"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0) return;
    setIsResending(true);
    setError("");
    try {
      await axios.post(
        `${SERVER_URL}/auth/send-otp`,
        { email },
        { withCredentials: true }
      );
      setTimer(60);
    } catch (error: any) {
      console.log("Error resending Otp mail", error);

      setError(
        error.response.data.error || "OTP send failed. Please try again"
      );
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifyOtp = async () => {
    setIsSubmitting(true);
    setError("");
    try {
      const response = await axios.post(
        `${SERVER_URL}/auth/verify-otp`,
        {
          email,
          otp,
        },
        {
          withCredentials: true,
        }
      );

      console.log(response);

      setStep(3);
    } catch (error: any) {
      console.log(`Error verifying Otp`, error);
      setError(
        error.response.data.error || "OTP verification failed. Please try again"
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      const response = await axios.post(
        `${SERVER_URL}/auth/reset-password`,
        {
          email,
          newPassword,
        },
        {
          withCredentials: true,
        }
      );

      console.log(response);

      navigate("/login");
    } catch (error: any) {
      console.log(`Error resetting password`, error);
      setError(
        error.response.data.error || "Password Reset Failed. Please try again"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 w-full bg-background">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        <div className="flex items-center gap-16 mb-4">
          <button onClick={() => navigate("/login")} className="cursor-pointer">
            <IoIosArrowRoundBack size={30} className="text-primary" />
          </button>
          <h1 className="text-2xl font-bold text-center text-primary">
            Forgot Password
          </h1>
        </div>

        {step === 1 && (
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-1"
            >
              Email
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              id="email"
              type="email"
              name="email"
              className={`rounded-lg px-3 py-2 focus:outline-none
            focus:border-orange-500 w-full border-[1px] border-border`}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setError("");
                setEmail(e.target.value);
              }}
              required
            />

            {error && (
              <div className="my-4 p-3 bg-red-50 border border-red-200 rounded-lg">
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
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-primary text-white font-medium hover:bg-hover transition-all mt-4 px-3 py-2 focus:outline-none 
              focus:border-orange-500 border-[1px] cursor-pointer border-border disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
              onClick={handleSendOtp}
            >
              {isSubmitting ? "Sending...." : "Send OTP"}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="mb-6">
            <label
              htmlFor="otp"
              className="block text-gray-700 font-medium mb-1"
            >
              OTP
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              id="otp"
              type="otp"
              name="otp"
              className={`rounded-lg px-3 py-2 focus:outline-none
            focus:border-orange-500 w-full border-[1px] border-border`}
              placeholder="Enter 6 digit OTP"
              value={otp}
              onChange={(e) => {
                setError("");
                setOtp(e.target.value);
              }}
              required
            />

            {error && (
              <div className="my-4 p-3 bg-red-50 border border-red-200 rounded-lg">
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
                  {error}
                </p>
              </div>
            )}
            <button
              type="submit"
              className="w-full rounded-lg bg-primary text-white font-medium hover:bg-hover transition-all mt-4 px-3 py-2 focus:outline-none 
              focus:border-orange-500 border-[1px] cursor-pointer border-border disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
              onClick={handleVerifyOtp}
            >
              {isSubmitting ? "Verifying..." : "Verify"}
            </button>

            <p className="text-center text-gray-600 mt-4">
              Didn't receive the code?{" "}
              <button
                className="text-primary font-medium disabled:opacity-50"
                disabled={timer > 0 || isResending}
                onClick={handleResendOtp}
              >
                {timer > 0
                  ? `Resend in ${timer}s`
                  : isResending
                  ? "Resending..."
                  : "Resend"}
              </button>
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="mb-6">
            <label
              htmlFor="newPassword"
              className="block text-gray-700 font-medium mb-1"
            >
              New Password
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              id="newPassword"
              type="password"
              name="newPassword"
              className={`rounded-lg px-3 py-2 focus:outline-none
            focus:border-orange-500 w-full border-[1px] border-border mb-4`}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => {
                setError("");
                setNewPassword(e.target.value);
              }}
              required
            />

            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 font-medium mb-1"
            >
              Confirm New Password
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              className={`rounded-lg px-3 py-2 focus:outline-none
            focus:border-orange-500 w-full border-[1px] border-border`}
              placeholder="Enter new password again"
              value={confirmPassword}
              onChange={(e) => {
                setError("");
                setConfirmPassword(e.target.value);
              }}
              required
            />

            {error && (
              <div className="my-4 p-3 bg-red-50 border border-red-200 rounded-lg">
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
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-primary text-white font-medium hover:bg-hover transition-all mt-4 px-3 py-2 focus:outline-none 
              focus:border-orange-500 border-[1px] cursor-pointer border-border disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
              onClick={handleResetPassword}
            >
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
