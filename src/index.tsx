import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import "./index.css";
import { StoreProvider } from "./context/UserContext";
import Login from "./pages/authentication/Login";
import Register from "./pages/authentication/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashBoard from "./pages/admin/AdminDashBoard/AdminDashboard";
import AdminRoute from "./components/AdminProtectedRoute";
import ManageTools from "./pages/admin/ManageTools";
import IssueMaterials from "./pages/supervisor/IssueMaterials";
import AddMaterials from "./pages/admin/Materials/AddMaterials";
import RecordRemainingMaterials from "./pages/supervisor/RecordRemainingMaterials";
import SupervisorDashboard from "./pages/supervisor/SupervisorDashboard";
import ViewIssuedMaterials from "./pages/supervisor/ViewIssuedMaterials";
import NotFound from "./pages/notfound/NotFound";
import Home from "./pages/home/home";
import ViewMaterials from "./pages/admin/Materials/ViewMaterials";
import EditMaterial from "./pages/admin/Materials/EditMaterial";
import AddLabour from "./pages/admin/Labours/AddLabours";
import ViewLabour from "./pages/admin/Labours/ViewLabour";
import EditLabour from "./pages/admin/Labours/EditLabour";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/" element={<Home />} />
      <Route element={<ProtectedRoute />}>
        {/*  <Route path="/supervisor/dashboard" element={<SupervisorDashboard />} /> */}
        {/*         <Route
          path="/supervisor/issue-materials"
          element={<IssueMaterials />}
        /> */}
        <Route path="/supervisor/add-materials" element={<AddMaterials />} />
        <Route
          path="/supervisor/edit-material/:id"
          element={<EditMaterial />}
        />
        <Route path="/supervisor/view-materials" element={<ViewMaterials />} />
        <Route path="/supervisor/add-labour" element={<AddLabour />} />
        <Route path="/supervisor/view-labour" element={<ViewLabour />} />
        <Route path="/supervisor/edit-labour/:id" element={<EditLabour />} />
      </Route>

      <Route element={<AdminRoute />}>
        <Route path="/admin/dashboard" element={<AdminDashBoard />} />
        <Route path="/admin/register" element={<Register />} />
        {/* <Route path="admin/manage-tools" element={<ManageTools />} /> */}
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <StoreProvider>
      <HelmetProvider>
        <RouterProvider router={router} />
      </HelmetProvider>
    </StoreProvider>
  </React.StrictMode>
);
