import React, { useEffect, useContext } from "react";
import { Store } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebars.css";

interface SidebarProps {
  sidebar: boolean;
  setSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebars: React.FC<SidebarProps> = ({ sidebar, setSidebar }) => {
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();

  const signoutHandler = () => {
    dispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  // Toggle sidebar open/close state
  const toggleSidebar = () => {
    setSidebar((prev) => !prev);
  };

  // Manage the menu button icon change based on sidebar state
  useEffect(() => {
    const closeBtn = document.querySelector("#btn") as HTMLElement;
    if (closeBtn) {
      if (sidebar) {
        closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");
      } else {
        closeBtn.classList.replace("bx-menu-alt-right", "bx-menu");
      }
    }
  }, [sidebar]);

  return (
    <div className={`sidebar ${sidebar ? "open" : ""}`}>
      <div className="logo_details">
        <div className="logo_name">Construction App</div>
        <i
          className={`bx ${sidebar ? "bx-menu-alt-right" : "bx-menu"}`}
          id="btn"
          onClick={toggleSidebar}
        ></i>
      </div>
      <ul className="nav-list">
        <li>
          <Link to="/">
            <i className="bx bx-home-alt"></i>
            <span className="link_name">Home</span>
          </Link>
          <span className="tooltip">Home</span>
        </li>
        {userInfo?.isAdmin && (
          <li>
            <Link to="/admin/dashboard">
              <i className="bx bx-grid-alt"></i>
              <span className="link_name">Dashboard</span>
            </Link>
            <span className="tooltip">Dashboard</span>
          </li>
        )}
        {userInfo?.isAdmin && (
          <li>
            <Link to="/admin/projects">
              <i className="bx bx-folder"></i>
              <span className="link_name">My Projects</span>
            </Link>
            <span className="tooltip">My Projects</span>
          </li>
        )}
        {userInfo?.isAdmin && (
          <li>
            <Link to="/admin/add-projects">
              <i className="bx bx-folder-plus"></i>
              <span className="link_name">Add Project</span>
            </Link>
            <span className="tooltip">Add Project</span>
          </li>
        )}
        {userInfo?.isAdmin && (
          <li>
            <Link to="/admin/register">
              <i className="bx bx-user-plus"></i>
              <span className="link_name">Register User</span>
            </Link>
            <span className="tooltip">Register User</span>
          </li>
        )}
        {userInfo && (
          <li>
            <Link to="/supervisor/view-materials">
              <i className="bx bx-cube"></i>
              <span className="link_name">Materials</span>
            </Link>
            <span className="tooltip">Materials</span>
          </li>
        )}
        {!userInfo && (
          <li>
            <Link to="/login">
              <i className="bx bx-log-in" id="log_in"></i>
              <span className="link_name">Sign In</span>
            </Link>
            <span className="tooltip">Sign In</span>
          </li>
        )}
        {userInfo && (
          <li>
            <Link to="/supervisor/view-labour">
              <i className="bx bx-group"></i>
              <span className="link_name">Labours</span>
            </Link>
            <span className="tooltip">Labours</span>
          </li>
        )}

        <li className="profile">
          <div className="profile_details">
            {/* <img src="profile.jpeg" alt="profile" /> */}
            <div className="profile_content">
              <div className="name">{userInfo?.name}</div>
              <div className="designation">
                {!userInfo ? "" : userInfo.isAdmin ? "Admin" : "Supervisor"}
              </div>
            </div>
          </div>
          {!userInfo ? (
            ""
          ) : (
            <i
              className="bx bx-log-out"
              id="log_out"
              onClick={signoutHandler}
            ></i>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Sidebars;
