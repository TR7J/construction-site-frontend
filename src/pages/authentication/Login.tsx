import React, { useContext, useState } from "react";
import { Store } from "../../context/UserContext";
import axios from "../../axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./authentication.css";
import { Helmet } from "react-helmet-async";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post("/api/auth/login", {
        email,
        password,
      });

      // Dispatch the USER_SIGNIN action to update the userInfo in the context
      dispatch({ type: "USER_SIGNIN", payload: data });

      // Optionally, store userInfo in localStorage for persistence
      localStorage.setItem("userInfo", JSON.stringify(data));

      // Display success toast
      toast.success("Login successful!");

      if (userInfo?.isAdmin) {
        navigate("/admin/dashboard");
      }
    } catch (error) {
      toast.error("Login failed. Please check your credentials and try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sign-up-page">
      <h1 className="sign-up-title">Sign In</h1>

      <div className="sign-up-container">
        <Helmet>
          <title>Sign In</title>
        </Helmet>

        <form onSubmit={handleLogin}>
          <div className="sign-up-group">
            <input
              className="sign-up-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              placeholder="Email"
            />
          </div>
          <div className="sign-up-group password-group">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              placeholder="Password"
              className="sign-up-input"
              disabled={loading}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {/*  <div className="sign-up-button-div"> */}
          <button type="submit" className="sign-up-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          {/*          </div> */}
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Login;
