import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Bg from '../../assets/images/hero-bg-5.jpg';
import { API_BASE } from "../../config";

export default function TechnicianRegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile_number: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false); // 🔹 toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // 🔹 toggle confirm password visibility

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleRegister = async () => {
    try {
      const response = await fetch(
        `${API_BASE}/api/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      console.log("Registration Response:", result);

      // ✅ Navigate to verify-email page with user_id
      if (result.message === "User registered successfully. Verification email sent.") {
        navigate("/auth/verify-email", { state: { userId: result.user_id, email: formData.email } });
      } else {
        alert(result.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration failed:", err);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="relative w-screen h-screen flex items-center justify-center m-0 p-0">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${Bg})` }}
      ></div>

      {/* Main Container */}
      <div className="relative h-150 z-10 w-full max-w-6xl flex flex-col md:flex-row bg-gray-50 bg-opacity-90 shadow-2xl rounded-none md:rounded-2xl overflow-hidden transform -translate-y-[5vh]">

        {/* Orange Side */}
        <div
          className="hidden md:flex w-1/2 flex-col justify-center items-center px-8 lg:px-12 text-white"
          style={{
            background: "linear-gradient(135deg, #e78f0c, #e78f0c)",
            borderTopRightRadius: "80px",
            borderBottomRightRadius: "80px",
          }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 font-poppins text-center">
            Join as a Technician
          </h2>
          <p className="text-lg text-center mb-8 font-poppins max-w-sm">
            Create your profile to start serving instrument owners.
          </p>
        </div>

        {/* Form Side */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-6 py-6 sm:px-10 md:px-16 md:py-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-center md:text-left font-poppins">
            Technician Registration
          </h2>

          <input
            type="text"
            placeholder="First Name"
            className="w-full mb-3 p-3 sm:p-4 border rounded-md text-md font-poppins"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Last Name"
            className="w-full mb-3 p-3 sm:p-4 border rounded-md text-md font-poppins"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-3 p-3 sm:p-4 border rounded-md text-md font-poppins"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            type="text"
            placeholder="Phone Number"
            className="w-full mb-3 p-3 sm:p-4 border rounded-md text-md font-poppins"
            value={formData.mobile_number}
            onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
          />
          <div className="relative mb-3">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 sm:p-4 border rounded-md text-md font-poppins pr-10"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
            </button>
          </div>
          <div className="relative mb-4">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full p-3 sm:p-4 border rounded-md text-md font-poppins pr-10"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
            </button>
          </div>

          <button
            onClick={handleRegister}
            className="w-full bg-orange-400 text-white py-3 rounded-md text-lg font-semibold font-poppins hover:bg-orange-600 transition"
          >
            REGISTER
          </button>
        </div>
      </div>
    </div>
  );
}
