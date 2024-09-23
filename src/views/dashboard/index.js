import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DashboardOverViewCard from "../../components/card/dashboardCard";
import OrderView from "../../components/viewDrawer/orderView";
import { FCM_VAPID_KEY } from "../../config";
import { preferencesAction } from "../../redux/action/preferencesAction";
import styles from "./dashboard.module.css";
import { getStaffDetails } from "../../redux/action/staffAction";
import { messaging } from "../../services/firebase";
import { getToken } from "@firebase/messaging";
import { fcmPushNotification } from "../../redux/action/authAction";
import MarkAttendance from "../../components/attendance/markAttendance";
import Analytics from "./Analytics";
import filterService from "../../services/filter-service";
import Cookies from "universal-cookie";

const Dashboard = () => {
  const cookies = new Cookies();
  const dispatch = useDispatch();
  const [analyticsPermission, setAnalyticsPermission] = useState(false);
  const [activeParams, setActiveParams] = useState({
    tab: "home",
    ...filterService.getFilters(),
  });

  const state = useSelector((state) => state);

  const isAdmin = cookies.get("rupyzAccessType") === "WEB_SARE360";

  const requestPermission = async () => {
    const token = await getToken(messaging, { vapidKey: FCM_VAPID_KEY });
    let apiData = {
      device_type: "web",
      device_manufacture: "web-browser",
      os_type: "web-browser",
      device_model: "web-browser",
      fcm_token: token,
    };
    dispatch(fcmPushNotification(apiData));
  };

  useEffect(() => {
    if (
      state.performance.data &&
      !state.performance.data.data.error &&
      isAdmin
    ) {
      setAnalyticsPermission(
        state.performance.data.data.data.enable_power_bi_analytics
      );
    }
  }, [state]);

  useEffect(() => {
    dispatch(preferencesAction());
    dispatch(getStaffDetails());
    requestPermission();
    filterService.setEventListener(setActiveParams);
  }, []);

  return (
    <div className={`dashboard ${styles.dashboard_page}`}>
      <div className={styles.tab_options}>
        {["home", ...(analyticsPermission ? ["analytics dashboard"] : [])].map(
          (ele) => (
            <div
              key={ele}
              className={`${styles.tab_option} ${
                activeParams?.tab === ele && styles.active_tab
              }`}
              onClick={() => filterService.setFilters({ tab: ele, page: "" })}
            >
              {ele}
            </div>
          )
        )}
      </div>
      <br />
      {activeParams?.tab === "home" ? (
        <>
          <div className={styles.dashboard_container}>
            <MarkAttendance />
            <br />
            <DashboardOverViewCard />
          </div>
          <OrderView />
        </>
      ) : (
        <Analytics />
      )}
    </div>
  );
};

export default Dashboard;

export const capitalizeFirst = (str) => {
  return str?.charAt(0)?.toUpperCase() + str?.slice(1);
};
