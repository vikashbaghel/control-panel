import React, { useContext, useEffect, useState } from "react";
import styles from "./markAttendance.module.css";
import { Clock } from "../../assets/attendance";
import { getattandanceDetail } from "../../redux/action/attendance";
import moment from "moment";
import Context from "../../context/Context";
import StartEndDayModal from "./startEndDayModal";
import Cookies from "universal-cookie";

const MarkAttendance = () => {
  const context = useContext(Context);
  const { setAttendanceModalAction } = context;
  const cookies = new Cookies();
  const admin = cookies.get("rupyzAccessType") === "WEB_SARE360";
  const format = "HH : mm : ss";

  const [attendanceModalOpen, setAttendanceModalOpen] = useState({
    open: false,
    type: "",
  });
  const [details, setDetails] = useState({});
  const [countdown, setCountdown] = useState(0);

  const handleAttendanceModal = (type) => {
    setAttendanceModalOpen({ open: true, type });
  };

  const callingAttandenceDetailAPI = async () => {
    const res = await getattandanceDetail();
    callingAttendanceModal(res);
    setDetails(res);
  };

  const callingAttendanceModal = (res) => {
    if (admin) return;
    if (!Object.keys(res).length) {
      setAttendanceModalAction({
        open: true,
        handleAction: () => callingAttandenceDetailAPI(),
      });
    }
  };

  useEffect(() => {
    if (!attendanceModalOpen.open) {
      callingAttandenceDetailAPI();
    }
  }, [attendanceModalOpen.open]);

  useEffect(() => {
    const targetTime = new Date(details.checkin_time);
    if (details.checkout_time) {
      const currentTime = new Date(details.checkout_time);
      targetTime.setMilliseconds(0);
      currentTime.setMilliseconds(0);
      const difference = currentTime.getTime() - targetTime.getTime();
      if (difference <= 0) {
        setCountdown(0);
      } else {
        setCountdown(Math.floor(difference / 1000)); // Convert milliseconds to seconds
      }
      return;
    }
    if (details.checkin_time) {
      const intervalId = setInterval(() => {
        const currentTime = details.checkout_time
          ? new Date(details.checkout_time)
          : new Date();
        targetTime.setMilliseconds(0);
        currentTime.setMilliseconds(0);
        const difference = currentTime.getTime() - targetTime.getTime();
        if (difference <= 0) {
          clearInterval(intervalId);
          setCountdown(0);
        } else {
          setCountdown(Math.floor(difference / 1000)); // Convert milliseconds to seconds
        }
      }, 30000);

      return () => clearInterval(intervalId); // Cleanup interval on unmount
    }
  }, [details]);

  return (
    <div>
      <div className={styles.conatiner}>
        {details.attendance_type === "MARK_LEAVE" ? (
          <div
            style={{
              color: "#f00",
              fontWeight: 600,
              borderRadius: "10px",
              cursor: "not-allowed",
              width: "100%",
            }}
          >
            On a Leave
          </div>
        ) : (
          <>
            <div
              onClick={() =>
                !details?.checkin_time && handleAttendanceModal("start")
              }
              className={styles.start_end_label}
              style={
                details?.checkin_time
                  ? { cursor: "not-allowed" }
                  : { background: "#eee", color: "#312b81" }
              }
            >
              {details?.checkin_time ? (
                <>
                  Day Started :{" "}
                  <span className={styles.time_label}>
                    {moment(details.checkin_time).format(format)}
                  </span>
                </>
              ) : (
                <>
                  <img src={Clock} alt="clock" /> Start day
                </>
              )}
            </div>
            <div className={styles.start_end_label}>
              Duration :{" "}
              {details.checkin_time ? (
                <span
                  className={styles.time_label}
                  style={{ color: details.checkout_time ? "#309F35" : "" }}
                >
                  {formatTime(countdown)}
                </span>
              ) : (
                " --/--"
              )}
            </div>
            <div
              onClick={() => {
                !details?.checkout_time &&
                  Object.keys(details).length !== 0 &&
                  handleAttendanceModal("end");
              }}
              className={styles.start_end_label}
              style={
                details?.checkout_time || Object.keys(details).length === 0
                  ? { cursor: "not-allowed" }
                  : { background: "#eee", color: "#312b81" }
              }
            >
              {details.checkout_time ? (
                <>
                  Day Ended :{" "}
                  <span className={styles.time_label}>
                    {moment(details.checkout_time).format(format)}
                  </span>
                </>
              ) : (
                <>
                  <img src={Clock} alt="clock" /> End day
                </>
              )}
            </div>
          </>
        )}
      </div>
      <StartEndDayModal {...{ attendanceModalOpen, setAttendanceModalOpen }} />
    </div>
  );
};

export default MarkAttendance;

// Format remaining time as HH:MM:SS
const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `${formattedHours} : ${formattedMinutes}`;
};
