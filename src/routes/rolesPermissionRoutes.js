import React from "react";
import { Route, Routes } from "react-router-dom";
import CreateNewStaffRole from "../views/roles-permission/createRole";
import StaffRolesPermission from "../views/roles-permission/staffRolesPermision";

const RolesPermissionRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<StaffRolesPermission />} />
      <Route path="/create-roles" element={<CreateNewStaffRole />} />
    </Routes>
  );
};

export default RolesPermissionRoutes;
