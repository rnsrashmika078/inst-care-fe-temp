import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Bg from '../../assets/images/hero-bg-5.jpg';
import { API_BASE } from "../../config";

export default function LoginPage() {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(""); // 🔹 error state
  const [showPassword, setShowPassword] = useState(false); // 🔹 toggle password visibility

  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      // console.log("Login data:", loginData);
      const result = await response.json();
      // console.log("Login Response:", result);

      if (result.message === "Login successful") {

        setError(""); // clear error if success

        sessionStorage.setItem("isLoggedIn", "true");     //  mark logged-in
        sessionStorage.setItem("role", String(result.role));
        sessionStorage.setItem("user_id", String(result.id));
        sessionStorage.setItem("technician_id", String(result.technician_id));
        sessionStorage.setItem("token", result.token);

        if (result.role === 8 || result.role === 9 || result.role === 7 || result.role === 6 || result.role === 5 || result.role === 4 || result.role === 3 || result.role === 2) {
          navigate("/user/dashboard");
        } else if (result.role === 10) {
          navigate("/tech/dashboard");
        } else if (result.role === 1) {
          navigate("/admin/dashboard");
        } else {
          setError("Unauthorized role!");
        }
      } else {
        setError("Invalid username or password!"); //  show error
      }

    } catch (err) {
      console.error("Login failed:", err);
      setError("Something went wrong. Please try again!"); //  network/server error
    }
  };

  return (
    <div className="relative w-screen h-screen flex items-center justify-center m-0 p-0">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${Bg})` }}
      ></div>

      {/* Main Login Container */}
      <div className="relative z-10 w-full max-w-6xl flex flex-col md:flex-row bg-gray-50 bg-opacity-90 shadow-2xl rounded-none md:rounded-2xl overflow-hidden transform -translate-y-[5vh]">

        {/* Left Panel - Sign In */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-6 py-6 sm:px-10 md:px-16 md:py-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-center md:text-left">
            Sign In
          </h2>

          {/* Important Notice */}
          <div className="bg-yellow/70 border-2 border-red-500 rounded-xl p-3 sm:p-4 flex flex-col items-center text-center mb-5">
            <h4 className="text-lg sm:text-xl font-bold text-gray-900">
              Important
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed mt-2">
              This system is integrated with the{" "}
              <b>National Instrument Database (NID)</b>. Use your existing{" "}
              <b>NID username</b> and <b>password</b> to sign in. No need to
              create a new account.
            </p>
          </div>

          <p className="text-sm sm:text-md text-gray-500 mb-4 text-center">
            Please log in to access the Instrument Care System.
          </p>

          {/* 🔹 Error Notification */}
          {error && (
            <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded-md text-center">
              {error}
            </div>
          )}

          <input
            type="username"
            placeholder="Username or Email"
            className="w-full mb-4 p-3 sm:p-4 border rounded-md text-md"
            value={loginData.username}
            onChange={(e) =>
              setLoginData({ ...loginData, username: e.target.value })
            }
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 sm:p-4 border rounded-md text-md pr-10"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
            </button>
          </div>

          <div className="w-full flex justify-between items-center mb-5">
            <Link to="/auth/user-registration">
              <button className="text-sm text-blue-600 cursor-pointer">
                If you don't have account? SIGN UP
              </button>
            </Link>

            <Link to="/auth/email-entry-forgot-password">
              <button className="text-sm text-blue-600 cursor-pointer">
                Forget Your Password?
              </button>
            </Link>
          </div>


          <button
            className="w-full bg-orange-400 text-white py-3 rounded-md text-lg font-semibold hover:bg-orange-500"
            onClick={handleLogin}
          >
            SIGN IN
          </button>
        </div>

        {/* Right Panel - Technician Join */}
        <div
          className="hidden md:flex w-1/2 flex-col justify-center items-center px-12 text-white"
          style={{
            background: "linear-gradient(135deg, #e78f0c, #e78f0c)",
            borderTopLeftRadius: "120px",
            borderBottomLeftRadius: "120px",
          }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            Join as a Technician
          </h2>
          <p className="text-lg text-center mb-8">
            Ready to help others and grow your career? Set up your technician
            profile and start accepting service requests!
          </p>
          <Link to="/auth/tech-registration">
            <button className="border border-white px-8 py-2 rounded-md hover:bg-white hover:text-orange-600 transition text-lg font-semibold">
              I'M TECHNICIAN
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
