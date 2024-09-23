import { theme } from "antd";
import React from "react";
import { useNavigate } from "react-router";
import RolesPermissionRoutes from "../../routes/rolesPermissionRoutes";
import { ArrowLeft } from "../../assets/globle";

const RolesPermission = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2
        className="page_title"
        style={{ display: "flex", alignItems: "center" }}
      >
        <img
          src={ArrowLeft}
          alt="arrow"
          className="clickable"
          onClick={() => navigate(-1)}
        />{" "}
        &nbsp;&nbsp; Create Staff Roles
      </h2>
      <RolesPermissionRoutes />
    </div>
  );
};

export default RolesPermission;
