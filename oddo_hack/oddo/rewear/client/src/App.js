// rewear/client/src/App.js (FULL FILE)

import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import CatalogPage from "./pages/CatalogPage";

// Import components
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ItemDetailPage from "./pages/ItemDetailPage";
import AddItemPage from "./pages/AddItemPage";
import AdminPanelPage from "./pages/AdminPanel";
import Navbar from "./components/common/Navbar";
import { useAuth } from "./contexts/AuthContext";

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  // Add effect for logo loading verification
  useEffect(() => {
    console.log(
      "Checking if logo exists:",
      process.env.PUBLIC_URL + "/logo.png"
    );

    // This creates a test image object to check if the logo can be loaded
    const img = new Image();
    img.onload = () => console.log("Logo loaded successfully");
    img.onerror = () =>
      console.error(
        "Error loading logo - file may not exist or path may be incorrect"
      );
    img.src = process.env.PUBLIC_URL + "/logo.png";
  }, []);

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/items/:id" element={<ItemDetailPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/items/new"
          element={
            <ProtectedRoute>
              <AddItemPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanelPage />
            </ProtectedRoute>
          }
        />
        <Route path="/catalog" element={<CatalogPage />} />
      </Routes>
    </div>
  );
}

export default App;
