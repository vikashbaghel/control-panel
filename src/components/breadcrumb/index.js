import { Breadcrumb } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

const BreadcrumbHeader = ({ title, branch }) => {
  const navigate = useNavigate();

  return (
    <Breadcrumb
      style={{
        margin: "16px 0",
      }}
    >
      <Breadcrumb.Item>
        <span className="clickable" onClick={() => navigate(`/`)}>
          {title}
        </span>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <span className="clickable" onClick={() => navigate("/web")}>
          {branch}
        </span>
      </Breadcrumb.Item>
    </Breadcrumb>
  );
};

export default BreadcrumbHeader;
