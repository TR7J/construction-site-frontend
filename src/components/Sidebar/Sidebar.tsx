import React, { useEffect, useContext } from "react";
import { Store } from "../../context/UserContext";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import {
  FaHome,
  FaToolbox,
  FaUsers,
  FaChartPie,
  FaUserPlus,
  FaSignInAlt,
  FaSignOutAlt,
  FaProjectDiagram,
  FaFolderOpen,
} from "react-icons/fa";

interface SidebarProps {
  sidebar: boolean;
  setSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebar, setSidebar }) => {
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  const signoutHandler = () => {
    dispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    window.location.href = "/login";
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
    <div className={`sidebar ${sidebar ? "" : "small-sidebar"}`}>
      <div className={"sortcut-links"}>
        <div className="side-link">
          <Link
            to="/"
            onClick={() => setSidebar(false)}
            className="side-link-Link"
          >
            <div className={`icon-links ${sidebar ? "" : "small-icon-links"}`}>
              <FaHome size={24} />
            </div>{" "}
            <span>Home</span>
          </Link>
        </div>
        {userInfo?.isAdmin && (
          <div className="side-link">
            <Link
              to="/admin/projects"
              onClick={() => setSidebar(false)}
              className="side-link-Link"
            >
              <div
                className={`icon-links ${sidebar ? "" : "small-icon-links"}`}
              >
                <FaFolderOpen size={24} />
              </div>{" "}
              <span>My Projects</span>
            </Link>
          </div>
        )}
        {userInfo?.isAdmin && (
          <div className="side-link">
            <Link
              to="/admin/add-projects"
              onClick={() => setSidebar(false)}
              className="side-link-Link"
            >
              <div
                className={`icon-links ${sidebar ? "" : "small-icon-links"}`}
              >
                <FaProjectDiagram size={24} />
              </div>{" "}
              <span>Add Project</span>
            </Link>
          </div>
        )}
        {userInfo?.isAdmin && (
          <div className="side-link">
            <Link
              to="/admin/dashboard"
              onClick={() => setSidebar(false)}
              className="side-link-Link"
            >
              <div
                className={`icon-links ${sidebar ? "" : "small-icon-links"}`}
              >
                <FaChartPie size={24} />
              </div>{" "}
              <span>Admin</span>
            </Link>
          </div>
        )}
        {userInfo && (
          <div className="side-link">
            <Link
              to="/supervisor/view-materials"
              onClick={() => setSidebar(false)}
              className="side-link-Link material"
            >
              <div
                className={`icon-links ${sidebar ? "" : "small-icon-links"}`}
              >
                <FaToolbox size={24} />
              </div>{" "}
              <span>Materials</span>
            </Link>
          </div>
        )}
        {userInfo && (
          <div className="side-link">
            <Link
              to="/supervisor/view-labour"
              onClick={() => setSidebar(false)}
              className="side-link-Link"
            >
              <div
                className={`icon-links ${sidebar ? "" : "small-icon-links"}`}
              >
                <FaUsers size={24} />
              </div>{" "}
              <span>Labours</span>
            </Link>
          </div>
        )}
        {userInfo?.isAdmin && (
          <div className="side-link">
            <Link
              to="/admin/register"
              onClick={() => setSidebar(false)}
              className="side-link-Link"
            >
              <div
                className={`icon-links ${sidebar ? "" : "small-icon-links"}`}
              >
                <FaUserPlus size={24} />
              </div>{" "}
              <span>Register</span>
            </Link>
          </div>
        )}
        {userInfo ? (
          <div className="side-link">
            <Link
              to="/signout"
              className="sidebar-link side-link-Link"
              onClick={() => {
                signoutHandler();
              }}
            >
              <div
                className={`icon-links ${sidebar ? "" : "small-icon-links"}`}
              >
                <FaSignOutAlt className="icon-signout" size={24} />
              </div>
              <span>Sign out</span>
            </Link>
          </div>
        ) : (
          <div className="side-link">
            <Link to="/login" className="sidebar-link side-link-Link">
              <div
                className={`icon-links ${sidebar ? "" : "small-icon-links"}`}
              >
                <FaSignInAlt className="icon-signin" size={24} />
              </div>
              <span>Sign In</span>
            </Link>
          </div>
        )}
      </div>

      {/*  <div className="subscribed-list">
  <h3>Subscribed</h3>
  <div className="side-link">
    <img src="" alt="" />
    <p>Home</p>
  </div>
</div> */}
    </div>
  );
};

export default Sidebar;
