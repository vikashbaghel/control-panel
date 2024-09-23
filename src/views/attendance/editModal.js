import React, { useContext, useEffect, useState } from "react";
import { Button, DatePicker, Modal, Popconfirm, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import styles from "./attendance.module.css";
import { useDispatch, useSelector } from "react-redux";
import Context from "../../context/Context";
import moment from "moment";
import {
  deleteAttendance,
  getAttendance,
  updateAttendance,
} from "../../redux/action/attendance";

const { Option } = Select;

const EditModal = ({ editSelectDate, attendanceList, month, year }) => {
  const context = useContext(Context);
  const dispatch = useDispatch();
  const { AttendanceModalOpen, setAttendanceModalOpen } = context;
  const [userData, setUserData] = useState([]);
  const [status, setStatus] = useState("Present");
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [remarks, setRemarks] = useState("");

  const userDataList = (date) => {
    let formatDate = date.split("/")[0];
    for (let index = 0; index < attendanceList.length; index++) {
      if (formatDate == parseInt(attendanceList[index].date.slice(8, 10))) {
        setRemarks(attendanceList[index].comments);
        return attendanceList[index];
      }
    }
  };

  useEffect(() => {
    if (!AttendanceModalOpen) {
      setStatus("Present");
      setCheckInTime("");
      setCheckOutTime("");
      setRemarks("");
    }
  }, [AttendanceModalOpen]);

  useEffect(() => {
    setUserData(userDataList(editSelectDate));
  }, [editSelectDate]);

  const onOkCheckIn = (value) => {
    let newValue = new Date(value.$d);
    setCheckInTime(moment(newValue).format(`YYYY-MM-DDTHH:mm:ss`));
  };
  const onOkCheckOut = (value) => {
    let newValue = new Date(value.$d);
    setCheckOutTime(moment(newValue).format(`YYYY-MM-DDTHH:mm:ss`));
  };

  function removeEmpty(obj) {
    Object.keys(obj).forEach((key) => {
      if (obj[key] === "" || obj[key] === null) {
        delete obj[key];
      }
    });
    return obj;
  }

  const handleSubmit = () => {
    let apiData = {
      attendance_type: status,
      time_in: checkInTime ? checkInTime : "",
      time_out: checkOutTime ? checkOutTime : "",
      comments: remarks ? remarks : "",
      date: moment(editSelectDate).format("YYYY-DD-MM"),
    };
    dispatch(updateAttendance(removeEmpty(apiData)));
    updatingAttendanceTable();
  };

  const handleTimeFormat = (date) => {
    return moment(date).format("YYYY-MM-DD HH:mm:ss");
  };

  const handleDeleteAttendance = () => {
    dispatch(deleteAttendance(userData.id));
    updatingAttendanceTable();
  };

  const updatingAttendanceTable = () => {
    setTimeout(() => {
      dispatch(getAttendance(month + 1, year));
      setAttendanceModalOpen(false);
      setUserData([]);
      setCheckInTime("");
      setCheckOutTime("");
      setRemarks("");
      setStatus("Present");
    }, 500);
  };

  return userData ? (
    <Modal
      title={<h2 style={{ margin: 0, paddingTop: 0 }}>Change Attendance</h2>}
      centered
      open={AttendanceModalOpen}
      onCancel={() => setAttendanceModalOpen(false)}
      width={600}
      footer={[
        <div className={styles.button}>
          <Button type="primary" size="large" onClick={handleSubmit}>
            Send Request
          </Button>
          <Button size="large" onClick={() => setAttendanceModalOpen(false)}>
            Cancel
          </Button>
          <Button
            style={{ background: " #DD3333", color: "#fff" }}
            size="large"
          >
            <Popconfirm
              title="Are You Sure, You want to Delete Attendance ?"
              okText="Yes"
              placement="leftTop"
              onConfirm={() => handleDeleteAttendance()}
            >
              Delete Attendance
            </Popconfirm>
          </Button>
        </div>,
      ]}
    >
      <div className={styles.edit_modal}>
        <div className={styles.date}>
          Change your attendance on {editSelectDate}.
        </div>
        <div className={styles.lable}>Status</div>

        <Select
          size="large"
          className={styles.select}
          onChange={(e) => setStatus(e)}
          defaultValue={userData ? userData.attendance_type : "Present"}
        >
          <Option value="Present">Present</Option>
          <Option value="Casual Leave">Casual Leave</Option>
          <Option value="Half Casual Leave">Half Casual Leave</Option>
          <Option value="Unpaid Leave">Unpaid Leave</Option>
          <Option value="Unpaid Half Day">Unpaid Half Day</Option>
        </Select>
        <br />
        <br />
        <div className={styles.lable}>Start Day</div>
        <DatePicker
          className={styles.date_picker}
          showTime={{ format: "hh:mm" }}
          onOk={onOkCheckIn}
          size="large"
          placeholder={
            userData ? handleTimeFormat(userData.time_in) : "Select Date"
          }
        />
        <br />
        <br />
        <div className={styles.lable}>End Day</div>
        <DatePicker
          className={styles.date_picker}
          showTime={{ format: "hh:mm" }}
          onOk={onOkCheckOut}
          size="large"
          placeholder={
            userData ? handleTimeFormat(userData.time_out) : "Select Date"
          }
        />
        <br />
        <br />
        <div className={styles.lable}>Remark</div>
        <TextArea
          rows={4}
          onChange={(e) => setRemarks(e.target.value)}
          value={remarks}
        />
        <br />
        <br />
      </div>
    </Modal>
  ) : (
    <Modal
      title={<h2 style={{ margin: 0, paddingTop: 0 }}>Change Attendance</h2>}
      centered
      open={AttendanceModalOpen}
      onCancel={() => setAttendanceModalOpen(false)}
      width={600}
      footer={[
        <div className={styles.button}>
          <Button type="primary" size="large" onClick={handleSubmit}>
            Send Request
          </Button>
          <Button size="large" onClick={() => setAttendanceModalOpen(false)}>
            Cancel
          </Button>
          <Button
            style={{ background: " #DD3333", color: "#fff" }}
            size="large"
          >
            <Popconfirm
              title="Are You Sure, You want to Delete Attendance ?"
              okText="Yes"
              placement="leftTop"
              onConfirm={() => handleDeleteAttendance()}
            >
              Delete Attendance
            </Popconfirm>
          </Button>
        </div>,
      ]}
    >
      <div className={styles.edit_modal}>
        <div className={styles.date}>
          Change your attendance on {editSelectDate}.
        </div>
        <div className={styles.lable}>Status</div>
        <Select
          size="large"
          className={styles.select}
          onChange={(e) => setStatus(e)}
          defaultValue={"Present"}
        >
          <Option value="Present">Present</Option>
          <Option value="Casual Leave">Casual Leave</Option>
          <Option value="Half Casual Leave">Half Casual Leave</Option>
          <Option value="Unpaid Leave">Unpaid Leave</Option>
          <Option value="Unpaid Half Day">Unpaid Half Day</Option>
        </Select>
        <br />
        <br />
        <div className={styles.lable}>Start Day</div>
        <DatePicker
          className={styles.date_picker}
          showTime={{ format: "hh:mm" }}
          onOk={onOkCheckIn}
          size="large"
          placeholder={"Select Date"}
        />
        <br />
        <br />
        <div className={styles.lable}>End Day</div>
        <DatePicker
          className={styles.date_picker}
          showTime={{ format: "hh:mm" }}
          onOk={onOkCheckOut}
          size="large"
          placeholder={"Select Date"}
        />
        <br />
        <br />
        <div className={styles.lable}>Remark</div>
        <TextArea rows={4} onChange={(e) => setRemarks(e.target.value)} />
        <br />
        <br />
      </div>
    </Modal>
  );
};

export default EditModal;
