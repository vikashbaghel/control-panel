import React, { Suspense, useContext } from "react";
import { Col, Layout } from "antd";
import { Route, Routes } from "react-router-dom";
import TopNavbar from "../components/topNavbar";
import SideNavbar from "../components/sideNavbar";
import Context from "../context/Context";
import routes from "./routesConstant";
import { LoadingOutlined } from "@ant-design/icons";

const DashboardRoutes = () => {
  const context = useContext(Context);
  const { setIsProfileDropdownOpen, setIsNotificationOpen, setReminderIsOpen } =
    context;

  return (
    <Layout>
      <TopNavbar />
      <Layout
        onClick={() => {
          setIsProfileDropdownOpen(false);
          setIsNotificationOpen(false);
          setReminderIsOpen(false);
        }}
        style={{ marginTop: 45 }}
      >
        <SideNavbar />
        <div id="dashboard_layout" style={{ flex: 1, marginLeft: 80 }}>
          <Col
            style={{
              padding: "0 24px 24px",
            }}
          >
            <Suspense fallback={<LoadingOutlined />}>
              <Routes>
                {routes.map((route, index) => (
                  <Route
                    key={index}
                    path={route.path}
                    element={route.element}
                  />
                ))}
              </Routes>
            </Suspense>
          </Col>
        </div>
      </Layout>
    </Layout>
  );
};

export default DashboardRoutes;
