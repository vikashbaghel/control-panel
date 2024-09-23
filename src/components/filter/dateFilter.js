import React, { useEffect, useState } from "react";
import styles from "./filter.module.css";
import { CaretDownOutlined, CloseCircleFilled } from "@ant-design/icons";
// import { DateIcon } from "../../../assets/globle";
import { Calendar, Col, Dropdown, Input, Row, Select } from "antd";
import moment from "moment";
import filterService from "../../services/filter-service";
import { DateIcon } from "../../assets/globle";
import { DatePicker } from "antd";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const DateFilter = ({ activeFilters }) => {
  const [date, setdate] = useState({ start_date: "", end_date: "" });

  useEffect(() => {
    filterService.setFilters({
      start_date: date.start_date,
      end_date: date.end_date,
    });
  }, [date]);

  const handleRangeChange = (dates, dateStrings) => {
    console.log("Selected dates:", dates);
    console.log("Formatted date strings:", dateStrings);
    let formattedDate = dateStrings[0]
      ? {
          start_date: moment(dateStrings[0]).format("YYYY-MM-DD"),
          end_date: moment(dateStrings[1]).format("YYYY-MM-DD"),
        }
      : { start_date: "", end_date: "" };
    setdate(formattedDate);
  };
  const disableDates = (current) => {
    return current && current > moment().endOf("day");
  };

  useEffect(() => {
    if (activeFilters.start_date) {
      setdate({
        start_date: moment(activeFilters.start_date).format("YYYY-MM-DD"),
        end_date: moment(activeFilters.end_date).format("YYYY-MM-DD"),
      });
    }
  }, []);

  return (
    <div
      className="tertiary-button"
      style={{ width: 250, height: 40, color: "#727176", padding: 0 }}
    >
      <RangePicker
        onChange={handleRangeChange}
        allowClear
        value={[
          date.start_date ? dayjs(date.start_date) : "",
          date.end_date ? dayjs(date.end_date) : "",
        ]}
        suffixIcon={
          <img
            src={DateIcon}
            alt="filter"
            style={{
              height: 40,
              width: 40,
              position: "absolute",
              top: 2,
              right: -3,
            }}
          />
        }
        format={"DD MMM YY"}
        placeholder={["Start", "End"]}
        style={{ color: "#727176", height: 45, fontFamily: "Poppins" }}
        variant="borderless"
        disabledDate={disableDates}
      />
    </div>
  );
};

export default DateFilter;
