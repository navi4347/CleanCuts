// src/routes/routes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../features/dashboard/Dashboard";
import Sales from "../features/sales/Sales"; 
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
     <Route path="/sales" element={<Sales />} />

      {/* Add more routes here as needed */}
    </Routes>
  );
};

export default AppRoutes;
