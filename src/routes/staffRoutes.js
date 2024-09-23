import React from "react";
import { Route, Routes } from "react-router-dom";
import Staff from "../views/staff";
import StaffForm from "../views/staff/staffForm";

const StaffRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Staff />} />
      <Route path="/add-staff" element={<StaffForm />} />
    </Routes>
  );
};

export default StaffRoutes;
