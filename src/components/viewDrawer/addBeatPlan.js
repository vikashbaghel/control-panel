import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Context from "../../context/Context";
import { CloseOutlined, CloseCircleTwoTone } from "@ant-design/icons";
import {
  Drawer,
  Button,
  Select,
  Form,
  Input,
  List,
  Checkbox,
  DatePicker,
  Space,
} from "antd";
//api called
import { auth_token, BASE_URL_V2, org_id } from "../../config";
import axios from "axios";
import Cookies from "universal-cookie";
import { beatAddService } from "../../redux/action/beatAction";
import moment from "moment";
import dateIcon from "../../assets/dateIcon.svg";
import dayjs from "dayjs";
import AddBeatPlanDetails from "./addBeatPlanDetails";
import styles from "../viewDrawer/order.module.css";

const AddBeatPlan = () => {
  const { Search } = Input;
  const cookies = new Cookies();

  const [pageNo, setPageNo] = useState(1);
  const [newData, setNewData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [stepPageNo, setStepPageNo] = useState(1);

  const fetchMoreData = () => {
    const url = `${BASE_URL_V2}/organization/${org_id}/beat/0/mapping/?page_no=${Number(
      pageNo
    )}`;
    const headers = { Authorization: cookies.get("rupyzToken") };
    axios.get(url, { headers }).then((response) => {
      setNewData(newData.concat(response.data.data));
      setPageNo(pageNo + 1);
      if (response.data.data.length !== 30) {
        setHasMore(false);
      }
    });
  };

  useEffect(() => {
    fetchMoreData();
  }, []);

  const context = useContext(Context);
  const dispatch = useDispatch();
  const {
    addBeatPlanOpen,
    setAddBeatPlanOpen,
    addBeatPlanDetailsOpen,
    setAddBeatPlanDetailsOpen,
    beatPlanData,
    setBeatPlanDa,
  } = context;
  const state = useSelector((state) => state);
  const [assign_staff, setAssignStaff] = useState("");
  const [name, setName] = useState("");

  const [staffAssignList, setStaffAssignList] = useState("");

  const [allSelectValue, setAllSelectValue] = useState(false);

  const [exclude_set, setExcludeSet] = useState([]);

  const [add_set, setAddSet] = useState([]);

  const [remove_set, setRemoveSet] = useState([]);

  const [disallow_all, setDisallow_all] = useState(false);

  const [hasDisabled, setHasDisabled] = useState(false);
  const [leadIncomingData, setLeadIncomingData] = useState([]);

  const [daysDiffrence, setDaysDiffrence] = useState("");

  let getStaff_Id = [];

  const handleRemove = (item) => {
    let filteredStaffList = staffAssignList.filter((ele) => {
      return item.id !== ele.id;
    });
    setStaffAssignList(filteredStaffList);
  };

  useEffect(() => {
    if (state.staff.data !== "") {
      if (state.staff.data.data.error === false) {
        setAssignStaff([...assign_staff, ...state.staff.data.data.data]);
      }
    }
  }, [state]);

  const onClose = () => {
    setAddBeatPlanOpen(false);
  };

  //hit distributor add api
  const onFinish = (values) => {
    const apiData1 = {
      name: name,
      add_set: add_set,
      disallow_all: !allSelectValue,
    };
    const apiData2 = {
      name: name,
      allow_all: allSelectValue,
      disallow_all: disallow_all,
      exclude_set: exclude_set,
      add_set: add_set,
      remove_set: remove_set,
    };
    let apiData =
      !allSelectValue &&
      exclude_set.length === 0 &&
      add_set.length === 0 &&
      remove_set.length === 0
        ? apiData1
        : apiData2;
    dispatch(beatAddService(apiData));
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  //checkbox handle get customer Id
  function checkBoxHandle(e, idx) {
    if (e.target.checked === true) {
      const index = exclude_set.indexOf(idx);
      if (index > -1) {
        exclude_set.splice(index, idx);
      }
      getStaff_Id = [...getStaff_Id, idx];
      setStaffAssignList([
        ...staffAssignList,
        { id: idx, name: e.target.value },
      ]);
      if (add_set !== "") {
        setAddSet([...add_set, idx]);
      }
    } else if (e.target.checked === false) {
      getStaff_Id = getStaff_Id.filter((ele) => ele !== idx);
      let newStaffAssign = staffAssignList.filter((ele) => ele.id !== idx);

      setStaffAssignList(newStaffAssign);
      if (allSelectValue === true) {
        setExcludeSet([...exclude_set, idx]);
      }
      if (add_set !== "") {
        setRemoveSet([...remove_set, idx]);
      }
    }
  }

  const onSearch = (value) => {
    let serachValue = newData.filter((data) => data.name.includes(value));
    setSearchValue(serachValue);
  };

  const onChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setHasDisabled(true);
      setStaffAssignList(newData);
      setAllSelectValue(true);
    } else {
      setHasDisabled(false);
      setStaffAssignList("");
      setAllSelectValue(false);
    }
  };

  const dateFormat = "YYYY-MM-DD";

  const onSelectStartDate = (date, dateString) => {
    setStartDate(dateString);
  };

  const onSelectEndDate = (date, dateString) => {
    setEndDate(dateString);
  };

  const disabledEndDate = (current) => {
    return current && current < dayjs(startDate);
  };

  const disabledStartDate = (current) => {
    return (
      current &&
      (current > dayjs(endDate) ||
        current < moment().subtract(1, "day").endOf("day"))
    );
  };

  let daysCounts = "";

  function DaysCount() {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dates = [];

    // Loop through each date and push to the dates array
    for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
      // dates.push( moment(date).format("DD.MM.YYYY")new Date(date));
      dates.push(moment(date).format("DD-MMM-YYYY"));
    }

    setDaysDiffrence(dates);

    // return <div>Days Count: {daysCount}</div>;
  }

  return (
    <>
      <Drawer
        className="container"
        title={
          <>
            <CloseOutlined onClick={onClose} /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span>Add Beat Plan</span>{" "}
          </>
        }
        width={520}
        closable={false}
        onClose={onClose}
        open={addBeatPlanOpen}
        style={{ overflowY: "auto" }}
      >
        <div className={styles.stepper_container_Beat}>
          <div
            className={`${style.first_step_Beat} ${
              stepPageNo === 2 ? style.first_step_active_Beat : ""
            }`}
          >
            1
          </div>
          <div
            className={`${styles.second_step_Beat} ${
              stepPageNo === 3 ? styles.second_step_active_Beat : ""
            }${stepPageNo === 2 ? styles.active_step_Beat : ""}`}
          >
            2
          </div>
        </div>

        <Form {...layout} onFinish={onFinish} onFinishFailed={onFinishFailed}>
          <Form.Item style={{ fontWeight: "600" }} name="name">
            <label>Beat Plan Name :</label>
            <Input
              style={{ fontWeight: "600", width: "470px", height: "40px" }}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
            />
          </Form.Item>

          {/* start date and end date input */}
          <div style={style.date}>
            <Form.Item style={{ fontWeight: "600" }} name="start_date_time">
              <label>
                Start Date:<sup style={{ color: "red" }}>*</sup>
              </label>
              <Space direction="vertical" width={100}>
                <DatePicker
                  format={dateFormat}
                  style={{ width: "217px", height: "40px" }}
                  onChange={onSelectStartDate}
                  disabledDate={disabledStartDate}
                  suffixIcon={
                    <div
                      style={{
                        borderLeft: "1px solid #D9D9D9",
                        padding: "9px",
                      }}
                    >
                      <img src={dateIcon} style={{ width: "20px" }} />
                    </div>
                  }
                />
              </Space>
            </Form.Item>

            <Form.Item style={{ fontWeight: "600" }} name="end_date_time">
              <label>
                End Date:<sup style={{ color: "red" }}>*</sup>
              </label>
              <Space direction="vertical" width={"70px"}>
                <DatePicker
                  format={dateFormat}
                  style={{ width: "217px", height: "40px" }}
                  onChange={onSelectEndDate}
                  disabledDate={disabledEndDate}
                  suffixIcon={
                    <div
                      style={{
                        borderLeft: "1px solid #D9D9D9",
                        padding: "9px",
                      }}
                    >
                      <img src={dateIcon} style={{ width: "20px" }} />
                    </div>
                  }
                />
              </Space>
            </Form.Item>
          </div>
          <div>
            <p style={{ margin: "0px", color: "#B8B8B8" }}>*Maximum 31 Days</p>
          </div>

          <div
            style={{
              position: "fixed",
              display: "flex",
              width: "478px",
              gap: "20px",
              justifyContent: "center",
              bottom: 1,
              padding: 20,
              backgroundColor: "white",
              border: "1px solid #D9D9D9",
              marginLeft: "-24px",
            }}
          >
            <Button onClick={onClose} style={{ width: 200, height: "40px" }}>
              Cancel
            </Button>
            <Button
              style={{ width: 200, height: "40px" }}
              type="primary"
              onClick={() => {
                name !== "" &&
                  (startDate !== "") & (endDate !== "") &&
                  setAddBeatPlanDetailsOpen(true);
                setStepPageNo(stepPageNo + 1);
                DaysCount(startDate, endDate);
              }}
            >
              Proceed
            </Button>
          </div>
          <AddBeatPlanDetails
            beatName={name}
            start={startDate}
            end={endDate}
            stepNo={stepPageNo}
            datesArray={daysDiffrence}
          />
        </Form>
      </Drawer>
    </>
  );
};
export default AddBeatPlan;

const style = {
  date: {
    display: "flex",
    gap: "24px",
  },
  dateInput: {
    height: "40px",
  },
  category: {
    border: "1px solid #D9D9D9",
    borderRadius: "8px",
  },
  first_step_active_Beat: {
    background: "#1677ff !important",
    color: "white !important",
  },
};
