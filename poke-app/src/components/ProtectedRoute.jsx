import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

export default function ProtectedRoute({ children }) {
  const { userLoggedIn } = useAuth();

  if (!userLoggedIn) {
    // If the user is not logged in, redirect to login
    return <Navigate to="/login" />;
  }

  // If logged in, render the requested route
  return children;
}
