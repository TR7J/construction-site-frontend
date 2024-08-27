import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Store } from "../../context/UserContext";
import Loading from "../../components/Loading";
import axios from "../../axiosConfig";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState("supervisor");
  const [loading, setLoading] = useState(false);
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  const handleRegister = async (e: React.SyntheticEvent) => {
    setLoading(true);
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const { data } = await axios.post("/api/auth/register", {
        name,
        email,
        password,
        role,
      });

      toast.success("User created successfully!");
    } catch (error) {
      toast.error("Error registering user. Please try again.");
      console.error("Error registering", error);
    } finally {
      setLoading(false);
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="sign-up-page">
      <h1 className="sign-up-title">Create New User</h1>
      {loading && <Loading />}
      <div className="sign-up-container">
        <Helmet>
          <title>Sign Up</title>
        </Helmet>

        <form onSubmit={handleRegister}>
          <div className="sign-up-group">
            {/* <label>Name</label> */}
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              className="sign-up-input"
              required
              placeholder="Name"
            />
          </div>

          <div className="sign-up-group">
            {/* <label>Email</label> */}
            <input
              type="email"
              required
              className="sign-up-input"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
            />
          </div>

          <div className="sign-up-group password-group">
            {/* <label>Password</label> */}
            <input
              type={!showPassword ? "text" : "password"}
              required
              className="sign-up-input"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <span
              onClick={togglePasswordVisibility}
              className="password-toggle"
            >
              <i
                className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}
              ></i>
            </span>
          </div>

          <div className="sign-up-group password-group">
            {/* <label>Confirm Password</label> */}
            <input
              type={!showConfirmPassword ? "text" : "password"}
              className="sign-up-input"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm password"
            />

            <span
              onClick={toggleConfirmPasswordVisibility}
              className="password-toggle"
            >
              <i
                className={
                  showConfirmPassword ? "fas fa-eye-slash" : "fas fa-eye"
                }
              ></i>
            </span>
          </div>
          <div className="sign-up-group">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="sign-up-input-select"
            >
              <option value="supervisor">Supervisor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="sign-up-button-div">
            <button type="submit" className="sign-up-button">
              Register User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
