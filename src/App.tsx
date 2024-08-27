import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar/Navbar";
import { useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";

function App() {
  const [sidebar, setSidebar] = useState(true);
  return (
    <div>
      <ToastContainer position="bottom-center" limit={5} />
      <header>
        <Navbar setSidebar={setSidebar} />
      </header>
      <main>
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
        {/* placeholder for the routes we define in createBrowserRouter */}
        <div className={`container ${sidebar ? "" : "large-container"}`}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default App;
