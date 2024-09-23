import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Context from "../../context/Context";
import { CloseOutlined } from "@ant-design/icons";
import { Drawer, Button, Form, Input } from "antd";
//api called
import { BASE_URL_V2, org_id } from "../../config";
import axios from "axios";
import Cookies from "universal-cookie";
import { beatAddService } from "../../redux/action/beatAction";
import moment from "moment";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

const AddBeatPlanDetails = ({ beatName, start, end, datesArray }) => {
  const cookies = new Cookies();

  const [pageNo, setPageNo] = useState(1);
  const [newData, setNewData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectValue, setSelectValue] = useState("");

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
  const { addBeatPlanDetailsOpen, setAddBeatPlanDetailsOpen } = context;
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

  let getStaff_Id = [];

  useEffect(() => {
    if (state.staff.data !== "") {
      if (state.staff.data.data.error === false) {
        setAssignStaff([...assign_staff, ...state.staff.data.data.data]);
      }
    }
  }, [state]);

  const onClose = () => {
    setAddBeatPlanDetailsOpen(false);
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

  const handleSelectionChange = (e) => {
    setSelectValue(e.target.value);
  };

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
        open={addBeatPlanDetailsOpen}
        style={{ overflowY: "auto" }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "30px",
            // marginBottom: "30px",
            // borderBottom: "1px solid #D9D9D9",
          }}
        >
          <div>
            <label style={{ color: "#B8B8B8", fontSize: "18px" }}>
              Beat Plan Name
            </label>
            <p
              style={{
                margin: "10px 0px 0px 0px",
                fontWeight: "600",
                fontSize: "18px",
              }}
            >
              {beatName}
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "row", gap: "100px" }}>
            <div>
              <label style={{ color: "#B8B8B8", fontSize: "18px" }}>
                Start Date
              </label>
              <p
                style={{
                  margin: "10px 0px 0px 0px",
                  fontWeight: "600",
                  fontSize: "18px",
                }}
              >
                {start}
              </p>
            </div>
            <div>
              <label style={{ color: "#B8B8B8", fontSize: "18px" }}>
                End Date
              </label>
              <p
                style={{
                  margin: "10px 0px 0px 0px",
                  fontWeight: "600",
                  fontSize: "18px",
                }}
              >
                {end}
              </p>
            </div>
          </div>
          <hr
            style={{
              borderBottom: "1px solid #D9D9D9",
              width: "505px",
              marginLeft: "-22px",
            }}
          />
        </div>

        <div>
          {datesArray &&
            datesArray.map((date, i) => (
              <div key={i}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                  }}
                >
                  <p
                    style={{
                      margin: "10px 0px 0px 0px",
                      fontWeight: "600",
                      fontSize: "16px",
                    }}
                  >
                    {date}
                  </p>
                  {selectValue === "beat" && (
                    <Link
                      to=""
                      style={{
                        color: "#1677FF",
                        fontSize: "14px",
                      }}
                    >
                      Select Customers
                    </Link>
                  )}
                </div>
                <div>
                  <div
                    style={{
                      display: "flex",
                      gap: "20px",
                      marginBottom: "20px",
                    }}
                  >
                    <select
                      onChange={(e) => handleSelectionChange(e)}
                      style={style.select_box}
                    >
                      <option value="beat">Beat</option>
                      <option value="location">New Location</option>
                      <option value="holiday">Leave</option>
                    </select>
                    <Input
                      disabled={selectValue === "holiday"}
                      placeholder="Select Beat..."
                      style={{ width: "50%" }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "20px",
                      marginBottom: "20px",
                    }}
                  >
                    <Input
                      disabled={selectValue === "holiday"}
                      placeholder="Night Stay"
                      style={{ width: "33%" }}
                    />
                    <Input
                      disabled={selectValue === "holiday"}
                      placeholder="Purpose"
                      style={{ width: "43%" }}
                    />
                    <Input
                      disabled={selectValue === "holiday"}
                      placeholder="New Visit"
                      style={{ width: "23%" }}
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* <SelectInput datesArray={datesArray} /> */}

        <Form {...layout} onFinish={onFinish} onFinishFailed={onFinishFailed}>
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
              Back
            </Button>
            <Button
              style={{ width: 200, height: "40px" }}
              type="primary"
              onClick={onFinish}
            >
              Save
            </Button>
          </div>
        </Form>
      </Drawer>
    </>
  );
};
export default AddBeatPlanDetails;

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
  select_box: {
    borderRadius: "8px",
    border: "1px solid #d9d9d9",
    width: "50%",
    paddingLeft: "10px",
  },
};
