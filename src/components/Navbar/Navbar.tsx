import "./Navbar.css";
import { Link } from "react-router-dom";
interface NavbarProps {
  setSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ setSidebar }) => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to={"/"} className="brand">
          Construction App
        </Link>
      </div>
      <div className="navbar-right">
        <div>
          <Link
            to="#"
            className="link"
            onClick={() => setSidebar((prev) => !prev)}
          >
            <i className="fas fa-bars icon-bars"></i>
          </Link>
        </div>

        <Link to={"/"} className="link-home">
          <i className="fa fa-home home-icon" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
