import React from "react";
import { EllipsisOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Card, Col, Descriptions, Row, Space } from "antd";
import MapIcon from "../../../assets/map_without_bg.svg";
import OrderAmountIcon from "../../../assets/amount.svg";

import moment from "moment";
import { useContext, useState } from "react";
import { Map } from "../../../assets";
import { useNavigate } from "react-router";
import Context from "../../../context/Context";
import { capitalizeFirst } from "../../../views/distributor";
import AttendanceDetailView from "../../attendance/attendanceDetailView";
import {
  DISTRIBUTOR_VISIT,
  FULL_DAY,
  HALF_DAY,
  JOINT_ACTIVITY,
  MARK_LEAVE,
  OFFICE_VISIT,
  OTHERS,
  REGULAR_BEAT,
} from "../../../assets/attendance";
import Cookies from "universal-cookie";
import ViewRecordActivityComponent from "../../activityModal/viewRecordActivityModal";

const cookies = new Cookies();

function CustomerActivityCard({
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
      <Card className="app-card-layout fadeIn clickable" onClick={handleClick}>
        <Row justify={"space-between"}>
          <Col flex={1}>
            <Space direction="vertical" size={"large"}>
              <h3 style={styles.heading}>{activityName(data)}</h3>
              <Space>
                <Avatar shape="circle" size={44} src={data.user_image_url}>
                  <UserOutlined />
                </Avatar>
                <div style={{ ...styles.subheading }}>
                  {data.created_by_name}
                </div>
              </Space>
            </Space>
          </Col>
          {data?.sub_module_type === "Order" && (
            <Col>
              <Space align="center">
                <img src={OrderAmountIcon} style={styles.orderAmountIcon} />
                <h3 style={{ margin: 0 }}>
                  ₹{(data.aggregated_order_data || {}).amount || 0}
                </h3>
              </Space>
            </Col>
          )}
          <Col flex={1} align="end">
            <Space direction="vertical" size="middle" align="end">
              <Space>
                <a
                  href={`https://maps.google.com/?q=${data?.geo_location_lat},${data?.geo_location_long}`}
                  rel="noreferrer noopener"
                  target="_blank"
                  {...(!!(
                    data.geo_location_lat &&
                    data.geo_location_long &&
                    data.geo_location_lat !== 0 &&
                    data.geo_location_long !== 0
                  )
                    ? {
                        onClick: (e) => {
                          e.stopPropagation();
                        },
                      }
                    : {
                        style: {
                          pointerEvents: "none",
                          opacity: 0.25,
                        },
                      })}
                >
                  <Col style={styles.mapIconCard}>
                    <img src={MapIcon} style={styles.mapIcon} />
                  </Col>
                </a>
              </Space>
              <div style={{ ...styles.subheading }}>
                {moment(data.created_at).format("DD MMM, hh:mm a")}
              </div>
            </Space>
          </Col>
        </Row>
      </Card>
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

const styles = {
  heading: {
    margin: 0,
  },
  subheading: {
    margin: 0,
    color: "#727176",
    fontWeight: "500",
  },
  mapIconCard: {
    backgroundColor: "#F4F4F4",
    border: "1px solid #DDDDDD",
    borderRadius: 4,
    padding: 8,
    paddingBottom: 4,
  },
  orderAmountIcon: {
    height: 20,
    width: 20,
    objectFit: "contain",
  },
  mapIcon: {
    height: 24,
    width: 24,
    objectFit: "contain",
    filter:
      "invert(44%) sepia(10%) saturate(149%) hue-rotate(212deg) brightness(97%) contrast(85%)",
  },
};

export default CustomerActivityCard;
