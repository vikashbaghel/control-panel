import {
  CaretDownOutlined,
  CaretLeftOutlined,
  CaretRightOutlined,
  CaretUpOutlined,
  CloseCircleFilled,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "./filterstyles.css";
import moment from "moment";
import styles from "./styles.module.css";
import { DatePicker, Divider, Dropdown, Space } from "antd";
import { useEffect, useRef, useState } from "react";
import { CrossIcon } from "../../../assets/globle";
import { BASE_URL_V1, BASE_URL_V2, org_id } from "../../../config";
import { Filter as filterIcon } from "../../../assets";
import { Calender, AddCalender } from "../../../assets/navbarImages";
import SingleSelectSearch from "../../../components/selectSearch/singleSelectSearch";
import { DatePickerInput } from "../../../components/form-elements/datePickerInput";
import WrapText from "../../../components/wrapText";
import customCaretup from "../../../assets/activities/teamActivity/custom-caretup.svg";
import customCaretdown from "../../../assets/activities/teamActivity/custom-caretdown.svg";

const { RangePicker } = DatePicker;

export function DateFilter({ onChange, value }) {
  const [isOpen, setIsOpen] = useState({ menuItems: false, datePicker: false });
  const [isDatePickerFocused, setIsDatePickerFocused] = useState(false);

  const dropdownRef = useRef(null);

  const dropdownItems = {
    TODAY: "Today",
    WEEK: "This Week",
    MONTH: "This Month",
    CUSTOM: "Custom Range",
  };

  const handleSelectedOption = () => {
    if (value?.by_date_range === "CUSTOM") {
      return `${value.start_date} to ${value.end_date}`;
    }
    return dropdownItems[value.by_date_range] || dropdownItems["TODAY"];
  };

  const handleDomClick = (e) => {
    if (!dropdownRef.current?.contains(e.target)) {
      setIsOpen({ menuItems: false, datePicker: false });
    }
  };

  useEffect(() => {
    if (isOpen.menuItems && !isDatePickerFocused)
      document.addEventListener("click", handleDomClick);
    return () => {
      document.removeEventListener("click", handleDomClick);
    };
  }, [isOpen.menuItems, isDatePickerFocused]);

  return (
    <div ref={dropdownRef} style={{ position: "relative", width: 220 }}>
      <div
        className={`${styles.filter_button}`}
        onMouseEnter={() =>
          !isOpen.menuItems && setIsOpen({ menuItems: true, datePicker: false })
        }
        onMouseLeave={() =>
          !isDatePickerFocused &&
          setIsOpen({ menuItems: false, datePicker: false })
        }
      >
        <img src={Calender} alt="calendar" />
        <div style={{ flex: 1, display: "flex", gap: 2 }}>
          <WrapText width={140}>{`Range - ${handleSelectedOption()}`}</WrapText>
        </div>
        <CaretDownOutlined style={{ color: "#727176" }} />
      </div>

      <div
        className={`${styles.range_filter_dd_menu} ${
          isOpen.menuItems ? styles.animate_dd_on_open : ""
        }`}
        onMouseEnter={() =>
          !isDatePickerFocused &&
          setIsOpen({ menuItems: true, datePicker: false })
        }
        onMouseLeave={() =>
          !isDatePickerFocused &&
          setIsOpen({ menuItems: false, datePicker: false })
        }
      >
        {Object.keys(dropdownItems).map((key) => (
          <div
            className={`${styles.dd_menu_options} ${styles.space_between}`}
            onClick={() => {
              if (key !== "CUSTOM") {
                onChange({
                  by_date_range: key,
                  start_date: "",
                  end_date: "",
                });
              }
              setIsOpen(
                key === "CUSTOM"
                  ? { ...isOpen, datePicker: !isOpen.datePicker }
                  : { menuItems: false, datePicker: false }
              );
            }}
          >
            {dropdownItems[key]}
            {key === "CUSTOM" && <img src={AddCalender} alt="calendar" />}
          </div>
        ))}
        {(isOpen.datePicker || value?.start_date) && (
          <RangePicker
            format="DD-MM-YYYY"
            value={
              value?.start_date
                ? [
                    dayjs(value?.start_date, "DD-MM-YYYY"),
                    dayjs(value?.end_date, "DD-MM-YYYY"),
                  ]
                : null
            }
            onChange={(_, dateString) => {
              onChange({
                by_date_range: dateString[0] ? "CUSTOM" : "TODAY",
                start_date: dateString[0],
                end_date: dateString[1],
              });

              setIsOpen({ menuItems: false, datePicker: false });
            }}
            disabledDate={(current, { from }) => {
              const today = moment().startOf("day");
              if (from) {
                return (
                  Math.abs(current.diff(from, "days")) >= 31 || current > today
                );
              }
              return current && current > today;
            }}
            onOpenChange={setIsDatePickerFocused}
            style={{ paddingBlock: 4, width: "100%" }}
          />
        )}
      </div>
    </div>
  );
}

export const DateFilterWithButtons = ({
  value,
  onChange,
  border = true,
  background = "#f4f4f4",
}) => {
  const dateFormat = "DD-MM-YYYY";
  const currentDate = moment(value || moment(), dateFormat).format(
    "DD-MM-YYYY"
  );

  const handleDate = (action, value = "") => {
    let updatedDate = "";
    if (action === "select") {
      updatedDate = value
        ? moment(value, "DD MMM YYYY").format(dateFormat)
        : value;
    } else if (action === "next") {
      if (currentDate === moment().format(dateFormat)) {
        return;
      }
      updatedDate = moment(currentDate, dateFormat)
        .add(1, "day")
        .format(dateFormat);
    } else {
      updatedDate = moment(currentDate, dateFormat)
        .subtract(1, "day")
        .format(dateFormat);
    }

    onChange({
      date: updatedDate,
    });
    return;
  };

  return (
    <div
      className="date-picker-with-btns"
      style={{ background, ...(!border && { border: "none" }) }}
    >
      <button
        type="button"
        className={styles.date_filter_btns}
        style={{ ...(border && { borderRight: "1px solid #dddddd" }) }}
        onClick={() => handleDate("prev")}
      >
        <CaretLeftOutlined style={{ color: "#727176" }} />
      </button>
      <DatePickerInput
        format="DD MMM YYYY"
        value={value ? moment(value, "DD-MM-YYYY").format("DD MMM YYYY") : ""}
        onChange={(v) => handleDate("select", v)}
        params={{
          placeholder: moment().format("DD MMM YYYY"),
          inputReadOnly: true,
          allowClear: false,
          variant: "borderless",
          disabledDate: (current) => current && current > moment().endOf("day"),
        }}
      />
      <button
        type="button"
        className={styles.date_filter_btns}
        onClick={() => handleDate("next")}
        style={{ ...(border && { borderLeft: "1px solid #dddddd" }) }}
        disabled={currentDate === moment().format("DD-MM-YYYY")}
      >
        <CaretRightOutlined style={{ color: "#727176" }} />
      </button>
    </div>
  );
};

export function FiltersBy({ value, onChange }) {
  const [roleList, setRoleList] = useState(
    value?.roles ? value.roles.split(",") : []
  );

  const handleRemove = (name) => {
    const filteredList = roleList.filter((v) => v !== name);
    setRoleList(filteredList);
    onChange({
      roles: filteredList.join(","),
    });
  };

  return (
    <Dropdown
      dropdownRender={(v) => (
        <div className="ant-dropdown-menu">
          <Space
            direction="vertical"
            size="small"
            style={{ width: 220, padding: 16 }}
          >
            <div>Role</div>

            <SingleSelectSearch
              apiUrl={`${BASE_URL_V1}/RBAC/${org_id}/role/?dd=true`}
              value={[]}
              optionFilter={(arr) =>
                arr.filter((ele) => !roleList.includes(ele.name))
              }
              onChange={(data) => {
                let arr = [...roleList, data.name];
                setRoleList(arr);
                onChange({
                  roles: arr.join(","),
                });
              }}
              params={{ placeholder: "Search" }}
            />

            <div className={`${styles.flex}`} style={{ flexWrap: "wrap" }}>
              {roleList.map((name, i) => (
                <div className={styles.selected_filter_option} key={i}>
                  {name}
                  <img
                    src={CrossIcon}
                    alt="cancel"
                    width={18}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleRemove(name)}
                  />
                </div>
              ))}
            </div>
          </Space>
          <Divider style={{ margin: 0, borderWidth: 2 }} />
          <Space
            direction="vertical"
            size="small"
            style={{ width: 220, padding: 16 }}
          >
            <div>Reporting to</div>
            <SingleSelectSearch
              apiUrl={`${BASE_URL_V2}/organization/${org_id}/staff/?dd=true`}
              value={value?.reporting_manager_name}
              onChange={(v) => {
                onChange({
                  reporting_manager: v?.id,
                  reporting_manager_name: v?.name,
                });
              }}
              params={{ placeholder: "Search" }}
            />
          </Space>
        </div>
      )}
    >
      <div className={`${styles.filter_button}`}>
        <img src={filterIcon} alt="filter" />
        Filters
        {roleList.length || value?.reporting_manager ? (
          <CloseCircleFilled
            onClick={() => {
              onChange({
                roles: "",
                reporting_manager: "",
                reporting_manager_name: "",
              });
              setRoleList([]);
            }}
          />
        ) : (
          <CaretDownOutlined />
        )}
      </div>
    </Dropdown>
  );
}

export function TableSortFilter({ onChange, value }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        cursor: "pointer",
      }}
    >
      <img
        src={customCaretup}
        alt="up"
        style={{ opacity: value === "ASC" ? 1 : 0.4 }}
        onClick={() => onChange("ASC")}
      />
      <img
        src={customCaretdown}
        alt="down"
        style={{ opacity: value === "DESC" ? 1 : 0.4 }}
        onClick={() => onChange("DESC")}
      />
    </div>
  );
}
