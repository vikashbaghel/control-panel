import { useEffect, useState } from "react";
import { DatePicker } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import moment from "moment";
import styles from "../../views/product/product.module.css";
import { Calender, AddCalender } from "../../assets/navbarImages";
import "./galleryStyles.css";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const GallerySorting = ({ value, selectedValue }) => {
  const sortingOptions = {
    Today: "Today",
    Week: "This Week",
    Month: "This Month",
    "Custom Range": "Custom Range",
  };

  const [filterShow, setFilterShow] = useState(false);

  const [showRangePicker, setShowRangePicker] = useState(false);
  const [isSelectingRange, setIsSelectingRange] = useState();

  const handleSort = (value) => {
    if (value === "Custom Range") {
      setShowRangePicker(true);
      setIsSelectingRange(true);
    } else {
      setShowRangePicker(false);
      setIsSelectingRange(false);
      selectedValue({
        by_date_range: value,
        start_date: null,
        end_date: null,
      });
      setFilterShow(false); // Close the dropdown
    }
  };

  const handleDateChange = (dates, dateString) => {
    selectedValue({
      by_date_range: dateString?.[0] ? "Custom Range" : "",
      start_date: dateString?.[0] || "",
      end_date: dateString?.[1] || "",
    });
    setFilterShow(false);
    setIsSelectingRange(false);
  };

  useEffect(() => {
    if (showRangePicker) {
      setFilterShow(true);
    }
  }, [showRangePicker]);

  const disabledFutureDates = (current) =>
    current && current > moment().endOf("day");

  return (
    <div className="filter_container">
      <div className={styles.filter_group}>
        <div
          style={{
            display: "flex",
            width: "330px",
            position: "relative",
            justifyContent: "space-around",
          }}
          onMouseOver={() => !isSelectingRange && setFilterShow(true)}
          onMouseOut={() => !isSelectingRange && setFilterShow(false)}
        >
          <span style={{ display: "flex", width: "290px", gap: "5px" }}>
            <img src={Calender} alt="calendar" /> Duration -{" "}
            {value?.by_date_range &&
            sortingOptions[value?.by_date_range] === "Custom Range"
              ? `${value?.start_date} to ${value?.end_date}`
              : sortingOptions[value?.by_date_range] || "Month"}
          </span>
          <span>
            <CaretDownOutlined style={{ color: "#727176" }} />
          </span>
        </div>
        <div
          className={`${styles.dropdown} ${
            filterShow ? styles.active_dropdown : ""
          }`}
          style={{
            width: "320px",
            position: "absolute",
            top: "100%",
            zIndex: 10,
          }}
          onMouseOver={() => setFilterShow(true)}
          onMouseOut={() => !isSelectingRange && setFilterShow(false)}
        >
          {Object.keys(sortingOptions).map((opt, ind) => (
            <div
              key={ind}
              onClick={() => handleSort(opt)}
              className={styles.list}
            >
              {opt === "Custom Range" ? (
                <span style={{ display: "flex", alignItems: "center" }}>
                  {opt}
                  <img
                    src={AddCalender}
                    alt="addcalendar"
                    style={{ color: "#727176", marginLeft: "auto" }}
                  />
                </span>
              ) : (
                sortingOptions[opt]
              )}
            </div>
          ))}
          {showRangePicker && (
            <RangePicker
              className="range-picker"
              format="YYYY-MM-DD"
              onChange={handleDateChange}
              value={
                value?.start_date
                  ? [
                      dayjs(value?.start_date, "YYYY-MM-DD"),
                      dayjs(value?.end_date, "YYYY-MM-DD"),
                    ]
                  : null
              }
              disabledDate={disabledFutureDates}
              style={{ marginTop: "10px", width: "100%" }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GallerySorting;
