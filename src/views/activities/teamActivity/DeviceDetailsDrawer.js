import moment from "moment";
import { Drawer } from "antd";
import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import WrapText from "../../../components/wrapText";
import noDataIcon from "../../../assets/globle/no-results.svg";
import { Staff as staffIcon } from "../../../assets/dashboardIcon";
import loginIcon from "../../../assets/activities/deviceLogs/log-in.svg";
import { getDeviceLogs } from "../../../redux/action/recordFollowUpAction";
import logoutIcon from "../../../assets/activities/deviceLogs/log-out.svg";
import batterLowIcon from "../../../assets/activities/deviceLogs/battery-low.svg";
import fakeLocationIcon from "../../../assets/activities/deviceLogs/fake-location.svg";
import batterNormalIcon from "../../../assets/activities/deviceLogs/battery-normal.svg";
import internetActiveIcon from "../../../assets/activities/deviceLogs/internet-active.svg";
import locationActiveIcon from "../../../assets/activities/deviceLogs/location-active.svg";
import internetInactiveIcon from "../../../assets/activities/deviceLogs/internet-inactive.svg";
import locationInactiveIcon from "../../../assets/activities/deviceLogs/location-inactive.svg";

export default function DeviceDetailsDrawer({ open, onClose, searchParams }) {
  const [logsList, setLogsList] = useState([]);

  const fetchData = async () => {
    setLogsList(
      (await getDeviceLogs(
        searchParams?.user_id,
        moment(searchParams?.date, "DD-MM-YYYY").format("YYYY-MM-DD")
      )) || []
    );
  };

  const logInfo = (item, key) => {
    const defaultSubTitle = [
      ...(item.is_system_power_saving
        ? [
            <div>
              Mobile battery saver mode :{" "}
              <span className={styles.bold_black}>On</span>
            </div>,
          ]
        : []),
      ...(item.is_app_power_saving
        ? [
            <div>
              App battery saver mode :{" "}
              <span className={styles.bold_black}>On</span>
            </div>,
          ]
        : []),
    ];

    if (item.activity_type) {
      return {
        title: `Logged ${item.activity_type === "LOGIN" ? "In" : "Out"}`,
        icon: item.activity_type === "LOGIN" ? loginIcon : logoutIcon,
        subTitle: [
          ...defaultSubTitle,
          <div>
            Device :{" "}
            <span
              className={styles.bold_black}
              style={{ textTransform: "capitalize" }}
            >
              {item.device_information?.manufacturer} -{" "}
              {item.device_information?.device}
            </span>
          </div>,
        ],
      };
    } else if (item.mock_location) {
      return {
        title: "Fake Location",
        icon: fakeLocationIcon,
        subTitle: [
          ...defaultSubTitle,
          <div>Used a location-altering apps or settings</div>,
        ],
      };
    } else if (!item.location_permission) {
      return {
        title: `Location ${item.location_permission ? "On" : "Off"}`,
        icon: item.location_permission
          ? locationActiveIcon
          : locationInactiveIcon,
        subTitle: defaultSubTitle,
        created_at: item.activity_timestamp,
      };
    } else if (item.location_permission_type) {
      return {
        title: "Permission Changed",
        icon: fakeLocationIcon,
        subTitle: [
          ...defaultSubTitle,
          <div>
            Location permission changed from
            <span className={styles.bold_black}>
              {item.location_permission_type === "BACKGROUND"
                ? " Allow while using this app to Always allow"
                : item.location_permission_type === "FOREGROUND"
                ? " Always allow to Allow while using the app"
                : " Allow while using this app to Don't Allow"}
            </span>
          </div>,
        ],
      };
    } else {
      return {
        title: `Internet ${item.internet_status ? "On" : "Off"}`,
        icon: item.internet_status ? internetActiveIcon : internetInactiveIcon,
        subTitle: defaultSubTitle,
      };
    }
  };

  useEffect(() => {
    if (open) fetchData();
  }, [open]);

  return (
    <Drawer
      {...{ open, onClose }}
      title={
        <div style={{ textAlign: "center" }}>
          <div className={styles.flex} style={{ justifyContent: "center" }}>
            <img
              className={styles.img_container_rounded}
              src={searchParams?.pic_url || staffIcon}
              alt={searchParams?.user_name}
            />
            <WrapText width={300}>{searchParams?.user_name}</WrapText>
          </div>
          <div style={{ fontSize: 14, paddingTop: ".5em" }}>Device Log</div>
        </div>
      }
      width={500}
      styles={{ header: { borderBottom: "none" } }}
    >
      <div
        style={{
          padding: "0 2em 2em 2em",
          display: "flex",
          flexDirection: "column",
          gap: "1em",
          ...(!logsList.length && {
            height: "90%",
            justifyContent: "center",
            alignItems: "center",
          }),
        }}
      >
        {!!logsList.length ? (
          logsList.map((ele) => {
            const log = logInfo(ele) || {};
            if (log?.title)
              return (
                <div
                  className={`${styles.gradient_background}`}
                  style={{
                    fontWeight: 500,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    className={styles.space_between}
                    style={{ padding: "1.5em", fontWeight: 600 }}
                  >
                    <div
                      className={`${styles.flex} ${styles.color_grey}`}
                      style={{ fontWeight: 600 }}
                    >
                      <img src={log.icon} alt={log.title} />
                      {log.title}
                    </div>
                    <div className={styles.flex}>
                      <img
                        src={
                          ele.battery_percent >= 20
                            ? batterNormalIcon
                            : batterLowIcon
                        }
                        alt="battery"
                      />
                      {ele.battery_percent}%
                    </div>
                    <div style={{ fontSize: 16 }}>
                      {moment(log?.created_at || ele.activity_timestamp).format(
                        "hh:mm A"
                      )}
                    </div>
                  </div>
                  {!!log?.subTitle?.length && (
                    <div
                      className={styles.color_grey}
                      style={{
                        borderTop: "1px solid #DDDDDD",
                        padding: "1em 1.5em",
                        display: "flex",
                        flexDirection: "column",
                        gap: ".5em",
                      }}
                    >
                      {log.subTitle.map((sub) => sub)}
                    </div>
                  )}
                </div>
              );
          })
        ) : (
          <>
            <img src={noDataIcon} alt="no-data" />
            <div className={styles.bold_black} style={{ fontSize: 18 }}>
              No Data Found
            </div>
          </>
        )}
      </div>
    </Drawer>
  );
}
