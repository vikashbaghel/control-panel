import dayjs from "dayjs";
import moment from "moment";
import { DatePicker, Select, notification } from "antd";
import styles from "./styles.module.css";
import Context from "../../context/Context";
import "../../views/distributor/datePicker.css";
import tcIcon from "../../assets/beat/customer.svg";
import handleParams from "../../helpers/handleParams";
import { ActivityIcon } from "../../assets/staffImages";
import { useContext, useEffect, useRef, useState } from "react";
import { toIndianCurrency } from "../../helpers/convertCurrency";
import mapView from "../../assets/activity-details-header/map.svg";
import leadIcon from "../../assets/activity-details-header/lead.svg";
import pcIcon from "../../assets/activity-details-header/pcOrders.svg";
import orderIcon from "../../assets/activity-details-header/orderValue.svg";
import distanceIcon from "../../assets/activity-details-header/distance.svg";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import SalesReportDrawer from "../viewDrawer/sales-report-details/salesReportDrawer";
import liveLocationIcon from "../../assets/activity-details-header/live-location.svg";
import { getLiveLocation } from "../../redux/action/liveLocation";
import GoogleMapModal from "./googleMapModal";
import { capitalizeFirst } from "../../views/distributor";
import filterService from "../../services/filter-service";

var activityDetails = [];
const { Option } = Select;

export default function ActivityHeader({ data, showArrow = true }) {
  const { activity_modules, activity_list } = data;

  const context = useContext(Context);
  const { setSalesDrawerOpen } = context;
  const dateFormat = "YYYY-MM-DD";
  const queryParameters = new URLSearchParams(window.location.search);
  const date = queryParameters.get("date") || moment().format(dateFormat);

  const [handleGoogleModalAction, setHandleGoogleModalAction] = useState({
    open: false,
    data: [],
    type: null,
  });
  const [activeLocation, setActiveLocation] = useState([]);

  activityDetails = [
    {
      title: "TC (Meetings)",
      img: tcIcon,
      count: activity_modules?.meetings || 0,
    },
    {
      title: "PC (Orders)",
      img: pcIcon,
      count: activity_modules?.order_count || 0,
    },
    {
      title: "Order Value",
      img: orderIcon,
      count: activity_modules?.order_amount
        ? toIndianCurrency(activity_modules?.order_amount)
        : 0,
    },
    {
      title: "New Lead",
      img: leadIcon,
      count: activity_modules?.lead_count || 0,
    },
    {
      title: "Distance",
      img: distanceIcon,
      count: activity_modules?.distance_travelled || 0,
    },
  ];

  const [selectedDate, setSelectedDate] = useState(date);
  const [mapsDDToggle, setMapsDDToggle] = useState(false);

  //  handle next date
  const handleNextDate = () => {
    if (selectedDate === moment().format(dateFormat)) {
      return;
    }
    const nextDate = moment(selectedDate).add(1, "day").format(dateFormat);
    setSelectedDate(moment(nextDate).format(dateFormat));
    filterService.setFilters({ date: nextDate, page: "" });
  };

  // handle previous date
  const handlePreviousDate = () => {
    const previousDate = moment(selectedDate)
      .subtract(1, "day")
      .format(dateFormat);

    setSelectedDate(moment(previousDate).format(dateFormat));
    filterService.setFilters({ date: previousDate, page: "" });
  };

  //handle date when selected by date selector
  const handleDateChange = (date, dateString) => {
    setSelectedDate(dateString);
    filterService.setFilters({ date: dateString, page: "" });
  };

  // handle disabled dates
  const disabledDate = (current) => {
    return current && current > moment().endOf("day");
  };

  // close the dropdown if click outside that dropdown
  const node = useRef();
  const handleClickOutsideDD = (e) => {
    if (!node.current?.contains(e.target)) {
      setMapsDDToggle(false);
    }
  };

  const handleLocation = async (v = "activity") => {
    if (v === "activity") {
      const mapViewCoordinates = createCoordinatesForMap(
        activity_list,
        "geo_location_lat",
        "geo_location_long",
        "action"
      );
      setActiveLocation(
        mapViewCoordinates.filter((ele) => ele.lat !== 0).reverse()
      );
    } else {
      const liveLocation = await getLiveLocation(
        activity_modules?.user_id,
        date
      );
      const tempLiveLocation = createCoordinatesForMap(
        liveLocation?.data,
        "geo_lat",
        "geo_long"
      );
      const finalCoordinates = tempLiveLocation.filter((ele) => ele !== "0,0");
      return finalCoordinates;
    }
  };

  const handleLocationChange = async (e) => {
    let res;
    if (e === "live") {
      res = await handleLocation(e);
      if (res?.length === 0) {
        return notification.warning({
          message: "No Live Activity Found For This Date",
        });
      }
    }
    setHandleGoogleModalAction({
      open: true,
      data: e === "activity" ? activeLocation : res,
      type: e,
    });
  };

  useEffect(() => {
    handleLocation();
  }, [data]);

  useEffect(() => {
    if (mapsDDToggle) document.addEventListener("click", handleClickOutsideDD);
    return () => {
      document.removeEventListener("click", handleClickOutsideDD);
    };
  }, [mapsDDToggle]);

  return (
    <>
      <div className={styles.activity_header_card}>
        <div className={styles.activity_header}>
          <p className={styles.flex_5}>
            <img src={ActivityIcon} alt="Activity" />
            Activity
          </p>
          <div className={styles.flex_5}>
            {showArrow && (
              <button className={styles.date_btns}>
                <LeftOutlined onClick={handlePreviousDate} />
              </button>
            )}

            {moment(selectedDate).format("DD MMM YYYY")}
            {showArrow && (
              <button
                className={styles.date_btns}
                disabled={
                  moment(selectedDate).format(dateFormat) ===
                  moment().format(dateFormat)
                }
              >
                <RightOutlined onClick={handleNextDate} />
              </button>
            )}
          </div>
          {showArrow && (
            <div
              className="date_picker"
              style={{ display: "flex", alignItems: "center" }}
            >
              <DatePicker
                format={dateFormat}
                onChange={handleDateChange}
                disabledDate={disabledDate}
                value={dayjs(selectedDate, dateFormat)}
                allowClear={false}
              />
            </div>
          )}
        </div>
        <div className={styles.activity_details}>
          <div className={styles.activity_details_list}>
            {activityDetails?.map((ele) => (
              <div key={ele.title} className={styles.flex_5}>
                <img src={ele.img} alt={ele.title} width={24} />
                <div>
                  <p className={styles.activity_count}>{ele.count}</p>
                  <p>{ele.title}</p>
                </div>
              </div>
            ))}

            {activity_list?.length > 0 && (
              <div>
                <Select
                  style={{ width: 160 }}
                  size="small"
                  onChange={handleLocationChange}
                  value={null}
                  placeholder="Select Map"
                >
                  <Option value="activity">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      <img src={mapView} alt={"map"} /> Activity Map
                    </div>
                  </Option>
                  {activity_modules?.is_live_location_system_used && (
                    <Option value="live">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <img src={liveLocationIcon} alt={"live"} /> Live
                        Location
                      </div>
                    </Option>
                  )}
                </Select>
              </div>
            )}
          </div>
          <p
            className={styles.sales_report}
            onClick={() => {
              setSalesDrawerOpen({
                open: true,
                id: activity_modules?.user_id,
                pic_url: activity_modules?.pic_url,
              });
            }}
          >
            Daily Sales Report <RightOutlined />
          </p>
        </div>
      </div>
      <GoogleMapModal
        key={`map-${handleGoogleModalAction.open}`}
        action={handleGoogleModalAction}
        setAction={setHandleGoogleModalAction}
      />
      <SalesReportDrawer />
    </>
  );
}

export const activityLabel = (value) => {
  let label =
    value["action"].toLowerCase() === "check in"
      ? "Start Day"
      : value["action"].toLowerCase() === "check out"
      ? "End Day"
      : value["module_type"] === "Customer Feedback" ||
        value["module_type"] === "Lead Feedback"
      ? value["feedback_type"] +
        " , " +
        (value["customer_name"] || value["created_by_name"])
      : value["module_type"] === "Order Dispatch"
      ? value["module_type"] +
        " , " +
        (value["customer_name"] || value["created_by_name"])
      : value["module_type"] === "Payment"
      ? "Payment Collected" +
        " , " +
        (value["customer_name"] || value["created_by_name"])
      : capitalizeFirst(value["action"]) +
        " " +
        value["module_type"] +
        " , " +
        (value["customer_name"] || value["created_by_name"]);

  return label;
};

export const createCoordinatesForMap = (
  coordinatesArr = [],
  lat = "latitude",
  lng = "longitude",
  action = null
) => {
  let arr = coordinatesArr?.map((ele, index) => ({
    lat: ele[lat],
    lng: ele[lng],
    title: action ? activityLabel(ele) : "",
    activity_info: ele,
  }));

  const reultantCoordinates = arr?.filter((ele, index) => {
    if (
      ele.lat &&
      ele.lng &&
      (index === 0 ||
        ele.activity_info.id !== arr[index - 1].activity_info.id ||
        ele.lat !== arr[index - 1].lat ||
        ele.lng !== arr[index - 1].lng)
    ) {
      return ele;
    }
  });

  return reultantCoordinates;
  // arr = Array.from(new Set(arr.map((obj) => JSON.stringify(obj)))).map((str) =>
  //   JSON.parse(str)
  // );
  // return arr;
};
