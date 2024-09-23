import React, { useState, useContext, useEffect } from "react";
import { Typography } from "antd";
import "./galleryStyles.css";
import moment from "moment";
import { useNavigate } from "react-router";
import Context from "../../context/Context";
import { useDispatch, useSelector } from "react-redux";
import { dispatchHistory as dispatchHistoryAPI } from "../../redux/action/orderAction";
import { DispatchDetails } from "../order/dispatchHistory";
import { capitalizeFirstLetter } from "../roles-permission/staffRolesPermision";
import { preference } from "../../services/preference-service";

const { Text } = Typography;

const PicDetail = ({ data, setActivityId }) => {
  const dispatch = useDispatch();
  const { dispatchHistory } = useSelector((state) => state);
  const context = useContext(Context);
  const { setOpenDistributorDrawer } = context;
  const navigate = useNavigate();

  const [dispatchDetails, setDispatchDetails] = useState({});

  let distributor = preference.get("customer_level_config");

  const activityName = (name) => {
    switch (name) {
      case "OFFICE_VISIT":
        return "Ho / Office Visit";
      case "DISTRIBUTOR_VISIT":
        return `${distributor["LEVEL-1"]} / ${distributor["LEVEL-2"]} Visit`;
      default:
        return capitalizeFirstLetter(name);
    }
  };

  useEffect(() => {
    if (dispatchHistory.data && dispatchHistory.data.data.error === false) {
      setDispatchDetails(dispatchHistory.data.data.data);
    }
  }, [dispatchHistory]);

  if (!data) {
    return null; // Return null if data is undefined
  }

  const handleClick = () => {
    switch (data.module_type) {
      case "Order":
        navigate(`/web/order/order-details?id=${data.module_id}`);
        break;
      case "Order Dispatch":
        dispatch(dispatchHistoryAPI(0, data.module_id));
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
        setActivityId(data.module_id);
        break;
    }
  };

  return (
    <div className="pic-detail" size="small">
      <div style={{ textAlign: "center" }}>
        <h3>Picture Detail</h3>
        <hr />
      </div>
      <p className="line">
        <span className="title">Activity:</span>
        <Text style={{ width: "65%" }}>
          {data.module_type === "Attendance"
            ? data.sub_module_type === "HALF_DAY" ||
              data.sub_module_type === "FULL_DAY"
              ? `Day Ended ( ${activityName(data.sub_module_type)} )`
              : `Day Started ( ${activityName(data.sub_module_type)} )`
            : activityName(data.sub_module_type || data.module_type)}
        </Text>
      </p>
      <p className="line">
        <span className="title">Date and time:</span>
        <Text style={{ width: "65%" }}>
          {data.created_at &&
            moment(data.created_at).format("DD-MMM-YYYY, hh:mm A")}
        </Text>
      </p>
      {data.geo_address && (
        <div className="line">
          <span className="title">Created at:</span>
          <Text style={{ width: "65%" }}>
            <Text href="" target="_blank">
              {data.geo_address}
            </Text>
          </Text>
        </div>
      )}
      <button className="gallery-button" onClick={handleClick}>
        Activity Detail
      </button>
      <DispatchDetails {...{ dispatchDetails, setDispatchDetails }} />
    </div>
  );
};

export default PicDetail;
