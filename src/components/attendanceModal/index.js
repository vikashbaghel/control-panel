import React, { useContext, useEffect, useState } from "react";
import { Attendance_Modal } from "../../assets/globle";
import styles from "./attendanceModal.module.css";
import Cookies from "universal-cookie";
import { Modal } from "antd";
import Context from "../../context/Context";
import { INITIAL_ATTENDANCE_MODAL } from "../../generic/contextConstant";
import { LoadingOutlined } from "@ant-design/icons";
import { getattandanceDetail } from "../../redux/action/attendance";
import StartEndDayModal from "../attendance/startEndDayModal";

const cookies = new Cookies();

const AttendanceModal = () => {
  const admin = cookies.get("rupyzAccessType") === "WEB_SARE360" ? true : false;

  const context = useContext(Context);
  const { attendanceModalAction, setAttendanceModalAction } = context;

  const [openModal, setOpenModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [attendanceModalOpen, setAttendanceModalOpen] = useState({
    open: false,
    type: "",
  });

  const onSubmit = () => {
    attendanceModalAction.handleAction && attendanceModalAction.handleAction();
    onEmptyHandler();
  };

  const onEmptyHandler = () => {
    setAttendanceModalAction(INITIAL_ATTENDANCE_MODAL);
  };

  const callingAttandenceDetailAPI = async () => {
    if (admin) return onSubmit();
    const res = await getattandanceDetail();
    if (Object.keys(res).length === 0) {
      setOpenModal(true);
    } else {
      onSubmit();
    }
  };

  useEffect(() => {
    if (attendanceModalAction.open) {
      callingAttandenceDetailAPI();
    } else {
      setOpenModal(false);
    }
  }, [attendanceModalAction]);

  return (
    <Modal
      width={520}
      zIndex={9999}
      onCancel={() => {
        onEmptyHandler();
        setLoader(false);
      }}
      open={openModal}
      centered
      title={
        <div className={styles.modal_container}>
          <div>
            <img src={Attendance_Modal} alt="alert" />
          </div>
          <div className={styles.modal_head}>Mark Attendace for today.</div>
          <div
            style={{
              width: 115,
              margin: "auto",
            }}
          >
            {loader ? (
              <button className={"button_primary"}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <LoadingOutlined />
              </button>
            ) : (
              <button
                className={"button_primary"}
                onClick={() =>
                  setAttendanceModalOpen({
                    open: true,
                    type: "start",
                    callback: onSubmit,
                  })
                }
              >
                Start Day
              </button>
            )}
          </div>
        </div>
      }
      footer={[]}
    >
      {" "}
      <StartEndDayModal {...{ attendanceModalOpen, setAttendanceModalOpen }} />
    </Modal>
  );
};

export default AttendanceModal;
