import moment from "moment";
import { useContext, useState } from "react";
import { Map } from "../../assets";
import styles from "./styles.module.css";
import { useNavigate } from "react-router";
import Context from "../../context/Context";
import { capitalizeFirst } from "../../views/distributor";
import AttendanceDetailView from "../attendance/attendanceDetailView";
import {
  DISTRIBUTOR_VISIT,
  FULL_DAY,
  HALF_DAY,
  JOINT_ACTIVITY,
  MARK_LEAVE,
  OFFICE_VISIT,
  OTHERS,
  REGULAR_BEAT,
} from "../../assets/attendance";
import Cookies from "universal-cookie";
import ViewRecordActivityComponent from "../activityModal/viewRecordActivityModal";

const cookies = new Cookies();

function ActivityCard({
  data,
  showCustomerDetail = false,
  editPermission = true,
  size = "large",
}) {
  const navigate = useNavigate();

  const [attendanceDetailOpen, setAttendanceDetailOpen] = useState({
    open: false,
    detail: {},
  });
  const [activityId, setActivityId] = useState();

  const context = useContext(Context);
  const { setOpenDistributorDrawer } = context;

  const handleClick = () => {
    switch (data.module_type) {
      case "Attendance":
        setAttendanceDetailOpen({ open: true, detail: data });
        break;
      case "Order":
        navigate(`/web/order/order-details?id=${data.module_id}`);
        break;
      case "Order Dispatch":
        navigate(
          `/web/order/order-details?id=${data.sub_module_id}&dispatch=${data.module_id}`
        );
        break;
      case "Lead":
        navigate(`/web/view-lead/?id=${data.module_id}`);
        break;
      case "Customer":
        setOpenDistributorDrawer(true);
        navigate(`/web/customer?id=${data.module_id}`);
        break;
      case "Payment":
        navigate(`/web/payment/?id=${data.module_id}`);
        break;
      default:
        setActivityId(data.id);
        break;
    }
  };

  const activityName = (value) => {
    let label =
      value["action"].toLowerCase() === "check in"
        ? "Day Started"
        : value["action"].toLowerCase() === "check out"
        ? "Day Ended"
        : value["module_type"] === "Customer Feedback" ||
          value["module_type"] === "Lead Feedback"
        ? value["feedback_type"]
        : value["module_type"] === "Order Dispatch"
        ? value["module_type"]
        : value["module_type"] === "Payment"
        ? "Payment Collected"
        : capitalizeFirst(value["action"]) + " " + value["module_type"];
    return label;
  };

  const activityList = {
    REGULAR_BEAT: {
      img: REGULAR_BEAT,
      label: "Regular Beat",
    },
    JOINT_ACTIVITY: {
      img: JOINT_ACTIVITY,
      label: "Joint Activity",
    },
    MARK_LEAVE: { img: MARK_LEAVE, label: "Mark Leave" },
    OFFICE_VISIT: {
      img: OFFICE_VISIT,
      label: "Ho / Office Visit",
    },
    DISTRIBUTOR_VISIT: {
      img: DISTRIBUTOR_VISIT,
      label:
        cookies.get("rupyzCustomerLevelConfig") &&
        `${cookies.get("rupyzCustomerLevelConfig")["LEVEL-1"]} / ${
          cookies.get("rupyzCustomerLevelConfig")["LEVEL-2"]
        } Visit`,
    },
    OTHERS: { img: OTHERS, label: "Others" },
    HALF_DAY: {
      img: HALF_DAY,
      label: "Half Day",
    },
    FULL_DAY: {
      img: FULL_DAY,
      label: "Full Day",
    },
  };

  return (
    <>
      <div
        className={styles.activity_card}
        style={size === "small" ? { padding: 0 } : {}}
        onClick={handleClick}
      >
        <div className={styles.row}>
          <p className={styles.activity_name} title={activityName(data)}>
            {activityName(data)}
          </p>
          <p className={styles.activity_date}>
            {size === "small"
              ? moment(data.created_at).format("hh:mm A")
              : moment(data.created_at).format("DD MMM YYYY, hh:mm a")}
          </p>
        </div>
        {data.module_type === "Attendance" && (
          <div className={styles.module_type}>
            {activityList[data.sub_module_type]?.label}
          </div>
        )}
        {data["action"].toLowerCase() === "check out" &&
          data.is_auto_time_out && <p>Day ended automatically</p>}
        <p className={styles.activity_created_by}>
          {showCustomerDetail
            ? data.customer_name || data.business_name
            : data.created_by_name}
        </p>
        <div
          className={`${styles.row} ${styles.extra_space}`}
          style={size === "small" ? { gap: "1em" } : {}}
        >
          <p className={styles.activity_address}>
            {data?.activity_geo_address || data?.geo_address}
          </p>

          <div className={styles.row}>
            {!!(
              data.geo_location_lat &&
              data.geo_location_long &&
              data.geo_location_lat !== 0 &&
              data.geo_location_long !== 0
            ) && (
              <a
                href={`https://maps.google.com/?q=${data?.geo_location_lat},${data?.geo_location_long}`}
                rel="noreferrer noopener"
                target="_blank"
                onClick={(e) => {
                  e.stopPropagation();
                  if (size === "small") e.preventDefault();
                }}
              >
                <img src={Map} alt="map" />
              </a>
            )}
          </div>
        </div>

        {data?.message && size !== "small" && (
          <p className={styles.activity_message}>{data?.message}</p>
        )}
      </div>
      <AttendanceDetailView
        {...{ attendanceDetailOpen, setAttendanceDetailOpen }}
      />
      <ViewRecordActivityComponent
        {...{ activityId, editPermission }}
        onClose={() => setActivityId("")}
      />
    </>
  );
}

export default ActivityCard;
