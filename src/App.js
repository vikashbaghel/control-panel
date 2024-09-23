import "./App.css";
import Login from "./auth/login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardRoutes from "./routes/dashboardRoutes";
import { Provider } from "react-redux";
import store from "./redux/store";
import { PrivateRoute } from "./components/customRouters/privateRouter";
import { PublicRouter } from "./components/customRouters/publicRoute";
import ScrollTop from "./components/scrollToTop";
import Loader from "./components/loader/Loader";
import StaffLogin from "./auth/staffLogin";
import { useEffect, useState } from "react";
import { underMaintenance } from "./redux/action/authAction";
import MaintenancePage from "./views/mantenancePage";
import { LoadScript } from "@react-google-maps/api";
import { GOOGLE_MAPS_KEY } from "./config";

function App() {
  const [appStatus, setAppStatus] = useState({});

  const checkForMaintenance = async () => {
    const res = await underMaintenance();
    if (res && res.status === 200) {
      setAppStatus(res.data.data);
    }
  };

  useEffect(() => {
    checkForMaintenance();
  }, []);

  if (!Object.keys(appStatus).length) return <div />;
  else if (appStatus?.maintenance_status) return <MaintenancePage />;
  else
    return (
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_KEY} libraries={["places"]}>
        <div style={{ minWidth: 1200 }}>
          <BrowserRouter>
            <Provider store={store}>
              <ScrollTop>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <PublicRouter>
                        <Login />
                      </PublicRouter>
                    }
                  />
                  <Route path="/staff-login" element={<StaffLogin />} />
                  <Route
                    path="/web/*"
                    element={
                      <PrivateRoute>
                        <DashboardRoutes />
                      </PrivateRoute>
                    }
                  />
                </Routes>
                <Loader />
              </ScrollTop>
            </Provider>
          </BrowserRouter>
        </div>
      </LoadScript>
    );
}

export default App;
