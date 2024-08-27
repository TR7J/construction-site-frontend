import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Store } from "../context/UserContext";

export default function AdminRoute() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  console.log("AdminRoute userInfo:", userInfo);
  console.log("AdminRoute isAdmin:", userInfo?.isAdmin);
  return userInfo && userInfo.isAdmin ? <Outlet /> : <Navigate to="/login" />;
}
