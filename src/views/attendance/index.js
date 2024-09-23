import { Button, Space, Table, Tooltip, notification, theme } from "antd";
import { Content } from "antd/es/layout/layout";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./attendance.module.css";
import EditLogo from "../../assets/edit-logo.svg";
import EditDisable from "../../assets/editDisable.svg";
import EditModal from "./editModal";
import Context from "../../context/Context";
import { useDispatch, useSelector } from "react-redux";
import { getAttendance } from "../../redux/action/attendance";
import moment from "moment";
import Cookies from "universal-cookie";
import { checkInAction } from "../../redux/action/recordFollowUpAction";
import { LoadingOutlined } from "@ant-design/icons";
import { getStaffDetails } from "../../redux/action/staffAction";
import { getGeoLocationAndAddress } from "../../services/location-service";

const Attendance = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const cookies = new Cookies();
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [inputYear, setInputYear] = useState(new Date().getFullYear());
  const [attendanceList, setAttendanceList] = useState([]);

  const [editSelectDate, setEditSelectDate] = useState("");
  const [loader, setLoader] = useState(false);
  const [isChecked, setIsChecked] = useState(
    cookies.get("checkIn") === "Check In" ? true : false
  );
  const context = useContext(Context);
  const { setAttendanceModalOpen } = context;

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    dispatch(getStaffDetails());
  }, []);

  const columns = [
    {
      title: <div style={{ color: "#1677FF" }}>Date</div>,
      dataIndex: "date",
      render: (text, record) => {
        let disable = handleDisableingDate(record.date, month, year);
        return (
          <div style={{ color: disable ? "#C1C1C1" : "" }}>
            {text < 10 ? "0" + text : text}/
            {month + 1 < 10 ? "0" + (month + 1) : month + 1}/{year}
          </div>
        );
      },
      align: "center",
      key: "date",
    },
    {
      title: <div style={{ color: "#1677FF" }}>Day</div>,
      dataIndex: "day",
      render: (text, record) => {
        let disable = handleDisableingDate(record.date, month, year);
        return (
          <div style={{ color: disable ? "#C1C1C1" : "" }}>
            {text.slice(0, 3)}
          </div>
        );
      },
      align: "center",
      key: "day",
    },
    {
      title: <div style={{ color: "#1677FF" }}>Status</div>,
      dataIndex: "status",
      render: (text, record) => {
        let disable = handleDisableingDate(record.date, month, year);
        return (
          <div style={{ color: disable ? "#C1C1C1" : "" }}>
            {" "}
            {record && record.day === "Sunday"
              ? ""
              : statusData(record.date)
              ? statusData(record.date)
              : "- N/A -"}
          </div>
        );
      },
      align: "center",
      key: "status",
    },
    {
      title: <div style={{ color: "#1677FF" }}>Start Day</div>,
      dataIndex: "check_in",
      render: (text, record) => {
        let disable = handleDisableingDate(record.date, month, year);
        return (
          <div style={{ color: disable ? "#C1C1C1" : "" }}>
            {record && record.day === "Sunday"
              ? ""
              : checkInTime(record.date)
              ? checkInTime(record.date)
              : "- N/A -"}
          </div>
        );
      },
      align: "center",
      key: "check_in",
    },
    {
      title: <div style={{ color: "#1677FF" }}>End Day</div>,
      dataIndex: "check_out",
      render: (text, record) => {
        let disable = handleDisableingDate(record.date, month, year);
        return (
          <div style={{ color: disable ? "#C1C1C1" : "" }}>
            {record && record.day === "Sunday"
              ? "Weekend"
              : checkOutTime(record.date)
              ? checkOutTime(record.date)
              : "- N/A -"}
          </div>
        );
      },
      align: "center",
      key: "check_out",
    },
    {
      title: <div style={{ color: "#1677FF" }}>Duration</div>,
      dataIndex: "duration",
      render: (text, record) => {
        let disable = handleDisableingDate(record.date, month, year);
        return (
          <div style={{ color: disable ? "#C1C1C1" : "" }}>
            {record && record.day === "Sunday"
              ? ""
              : durationTime(record.date)
              ? durationTime(record.date)
              : "- N/A -"}
          </div>
        );
      },
      align: "center",
      key: "duration",
    },
    {
      title: <div style={{ color: "#1677FF", width: 150 }}>Remarks</div>,
      dataIndex: "remarks",
      render: (text, record) => {
        let disable = handleDisableingDate(record.date, month, year);
        return (
          <div style={{ width: 150 }}>
            <Tooltip
              title={`${
                record && record.day === "Sunday"
                  ? ""
                  : commentData(record.date)
                  ? commentData(record.date)
                  : ""
              }`}
            >
              <div
                style={{
                  color: disable ? "#C1C1C1" : "",
                }}
              >
                {record && record.day === "Sunday"
                  ? ""
                  : commentData(record.date)
                  ? commentData(record.date)
                  : "- N/A -"}
              </div>
            </Tooltip>
          </div>
        );
      },
      key: "remarks",
    },
    {
      title: <div style={{ color: "#1677FF" }}>Edit</div>,
      dataIndex: "edit",
      render: (text, record) => {
        let disable = handleDisableingDate(record.date, month, year);
        return disable ? (
          <div
            style={{
              fontSize: 16,
              color: "#1677FF",
            }}
          >
            <img src={EditDisable} alt="edit" width={16} />
          </div>
        ) : (
          <div
            style={{
              fontSize: 16,
              color: "#1677FF",
              cursor: "pointer",
            }}
            onClick={() => {
              setAttendanceModalOpen(true);
              setEditSelectDate(
                (record.date < 10 ? "0" + record.date : record.date) +
                  "/" +
                  (month + 1 < 10 ? "0" + (month + 1) : month + 1) +
                  "/" +
                  year
              );
            }}
          >
            <img src={EditLogo} alt="edit" width={20} />
          </div>
        );
      },
      align: "center",
      key: "edit",
    },
  ];

  const statusData = (date) => {
    let formatDate = date >= 10 ? date : "0" + date;
    for (let index = 0; index < attendanceList.length; index++) {
      if (formatDate == parseInt(attendanceList[index].date.slice(8, 10))) {
        return attendanceList[index].status;
      }
    }
  };

  const checkInTime = (date) => {
    let formatDate = date >= 10 ? date : "0" + date;
    for (let index = 0; index < attendanceList.length; index++) {
      if (formatDate == parseInt(attendanceList[index].date.slice(8, 10))) {
        const dateString = attendanceList[index].time_in;
        const date = new Date(dateString);
        return (
          moment(date)
            // .subtract(5, "hours")
            // .subtract(30, "minutes")
            .format("LT")
        );
      }
    }
  };

  const checkOutTime = (date) => {
    let formatDate = date >= 10 ? date : "0" + date;
    for (let index = 0; index < attendanceList.length; index++) {
      if (formatDate == parseInt(attendanceList[index].date.slice(8, 10))) {
        const dateString = attendanceList[index].time_out;
        if (dateString === null) return "- N/A -";
        const date = new Date(dateString);
        return (
          moment(date)
            // .subtract(5, "hours")
            // .subtract(30, "minutes")
            .format("LT")
        );
      }
    }
  };

  const durationTime = (date) => {
    let formatDate = date >= 10 ? date : "0" + date;
    for (let index = 0; index < attendanceList.length; index++) {
      if (formatDate == parseInt(attendanceList[index].date.slice(8, 10))) {
        let mins = attendanceList[index].total_time;
        if (mins === null) return "- N/A -";
        const hours = Math.floor(mins / 60);
        const minutes = mins % 60;
        return `${hours}${minutes !== 0 ? ":" + minutes : ""} Hrs`;
      }
    }
  };

  const commentData = (date) => {
    let formatDate = date >= 10 ? date : "0" + date;
    for (let index = 0; index < attendanceList.length; index++) {
      if (formatDate == parseInt(attendanceList[index].date.slice(8, 10))) {
        return attendanceList[index].comments;
      }
    }
  };

  const handleDisableingDate = (dd, mm, yyyy) => {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth(); // Note: January is 0!
    const year = currentDate.getFullYear();
    if (year < yyyy) return true;
    if (year === yyyy && month < mm) return true;
    if (month === mm && day < dd) return true;
  };

  const handleEnterClick = (e) => {
    if (e.key === "Enter") {
      if (inputYear <= 2030 && inputYear >= 2020) setYear(inputYear);
    }
  };

  const prevMonth = () => {
    if (month <= 0) {
      setYear(year - 1);
      setInputYear(year - 1);
      setMonth(11);
      return;
    }
    setMonth(month - 1);
  };

  const nextMonth = () => {
    if (month >= 11) {
      setYear(year + 1);
      setInputYear(year + 1);
      setMonth(0);
      return;
    }
    setMonth(month + 1);
  };

  useEffect(() => {
    dispatch(getAttendance(month + 1, year));
  }, [month, year]);

  useEffect(() => {
    if (state.getAttendance.data !== "") {
      if (state.getAttendance.data.data.error === false) {
        setAttendanceList(state.getAttendance.data.data.data);
      }
    }
  }, [state]);

  const handleCheckin = () => {
    setIsChecked(!isChecked);
    if (cookies.get("rupyzLocationEnable") === "true") {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "granted") {
          getGeoLocationAndAddress().then((response) => {
            dispatch(
              checkInAction({
                module_type: "Attendance",
                action:
                  cookies.get("checkIn") === "Check In"
                    ? "Check Out"
                    : "Check In",
                geo_location_lat: response.lat,
                geo_location_long: response.lng,
                geo_address: response.address,
                location_permission: true,
              })
            );
            setLoader(true);
            setTimeout(() => {
              setIsChecked(false);
            }, 500);
          });
          return;
        }
        // alert("Please turn-on location");
        openNotification(isChecked);
        // Don't do anything if the permission was denied.
      });
      return;
    }
    apiCallingWithoutGeolocation(isChecked);
  };

  const apiCallingWithoutGeolocation = () => {
    const apiData = {
      module_type: "Attendance",
      action: cookies.get("checkIn") === "Check In" ? "Check Out" : "Check In",
    };
    dispatch(checkInAction({ ...apiData, location_permission: false }));
    setLoader(true);
  };

  const [api, contextHolder] = notification.useNotification();
  const openNotification = (checked) => {
    const key = `open${Date.now()}`;
    const btn = (
      <Space>
        <button
          className="button_primary"
          onClick={() => {
            api.destroy();
            setTimeout(() => {
              setIsChecked(false);
            }, 400);
          }}
        >
          OK
        </button>
        <button
          className="button_secondary"
          onClick={() => {
            api.destroy(key);
            apiCallingWithoutGeolocation(checked);
          }}
        >
          Continue without Location
        </button>
      </Space>
    );
    api.open({
      message:
        "Location access is Blocked. Change your location settings in browser",
      btn,
      key,
    });
  };

  useEffect(() => {
    if (state.checkInAction.data !== "") {
      if (state.checkInAction.data.data.error === false) {
        setLoader(false);
      }
    }
  }, [state]);

  return (
    <div className="attendance">
      {contextHolder}
      <h2 className="page_title">
        Attendance
        <div className="breadcrumb">
          <span onClick={() => navigate("/web")}>Home </span>
          <span onClick={() => navigate("/web/attendance")}> / Attendance</span>
        </div>
      </h2>
      <Content
        style={{
          background: colorBgContainer,
        }}
        className={styles.attendance_top_content}
      >
        <div>
          <h3>Mark attendance for today ({todayDate()})</h3>
          <Button
            type="primary"
            onClick={handleCheckin}
            disabled={
              cookies.get("checkIn") === "Check In" ||
              cookies.get("checkIn") !== "Check out"
            }
          >
            {cookies.get("checkIn") !== "Check In" && loader ? (
              <LoadingOutlined />
            ) : (
              "Start Day"
            )}
          </Button>
        </div>
        <div>
          <p>
            You can mark your attendance for today. For any other day, please
            use the edit option below.
          </p>
          <Button
            type="primary"
            disabled={
              cookies.get("checkIn") !== "Check In" ||
              cookies.get("checkIn") === "Check out"
            }
            onClick={handleCheckin}
          >
            {cookies.get("checkIn") === "Check In" && loader ? (
              <LoadingOutlined />
            ) : (
              "End Day"
            )}
          </Button>
        </div>
      </Content>
      <br />
      <Content
        style={{
          padding: 0,
          margin: 0,
          minHeight: "82vh",
          background: colorBgContainer,
          borderRadius: 10,
        }}
        className={styles.table_container}
      >
        {" "}
        <div className={styles.table_header}>
          <div className="clickable" onClick={prevMonth}>
            {"<"} Prev
          </div>
          <div className={styles.month_header}>
            {months[parseInt(month)]}
            <input
              value={inputYear}
              max={4}
              onChange={(e) => setInputYear(e.target.value)}
              onKeyDown={handleEnterClick}
            />
          </div>
          <div className="clickable" onClick={nextMonth}>
            Next {">"}
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={getCalendar(month + 1, year)}
          pagination={false}
          style={{ fontWeight: 600 }}
        />
      </Content>
      <EditModal
        editSelectDate={editSelectDate}
        attendanceList={attendanceList}
        month={month}
        year={year}
      />
    </div>
  );
};

export default Attendance;

// for Date Array according to month
export function getCalendar(month, year) {
  const calendar = [];
  const daysInMonth = new Date(year, month, 0).getDate();
  for (let i = 1; i <= daysInMonth; i++) {
    calendar.push({
      date: i,
      day: new Date(year, month - 1, i).toLocaleDateString("en-US", {
        weekday: "long",
      }),
    });
  }
  return calendar;
}

// for Today Date with DD-MM-YYYY format
export const todayDate = (format) => {
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // Months start at 0!
  let dd = today.getDate();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  if (format) {
    return yyyy + "-" + mm + "-" + dd;
  }
  return dd + " " + months[parseInt(mm - 1)] + ", " + yyyy;
};

const months = [
  "Jan",
  "Feb",
  "March",
  "April",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];
