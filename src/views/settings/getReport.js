import React, { useEffect, useState } from "react";
import styles from "./settings.module.css";
import { Content } from "antd/es/layout/layout";
import { Email, WhatsApp } from "../../assets/settings";
import { numberValidation } from "../../helpers/regex";
import { DeleteOutlineIcon } from "../../assets/globle";
import { notification } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  addPreferencesAction,
  preferencesAction,
} from "../../redux/action/preferencesAction";

const GetReportsComponent = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { performance } = state;

  const [permission, setPermission] = useState(false);
  const [reportDuration, setReportDuration] = useState("");

  const [error, setError] = useState(false);
  const [number, setNumber] = useState("");
  const [dailyNumberList, setDailyNumberList] = useState([]);
  const [weeklyNumberList, setWeeklyNumberList] = useState([]);
  const [monthlyNumberList, setMonthlyNumberList] = useState([]);

  const [email, setEmail] = useState("");
  const [dailyEmailList, setDailyEmailList] = useState([]);
  const [weeklyEmailList, setWeeklyEmailList] = useState([]);
  const [monthlyEmailList, setMonthlyEmailList] = useState([]);

  useEffect(() => {
    dispatch(preferencesAction());
  }, []);

  useEffect(() => {
    if (performance.data && !performance.data.data.error) {
      setDailyNumberList(
        performance.data.data.data.daily_report_whatsapp_mobiles
      );
      setDailyEmailList(
        performance.data.data.data.daily_report_email_addresses
      );
      setWeeklyNumberList(
        performance.data.data.data.weekly_report_whatsapp_mobiles
      );
      setWeeklyEmailList(
        performance.data.data.data.weekly_report_email_addresses
      );
      setMonthlyNumberList(
        performance.data.data.data.monthly_report_whatsapp_mobiles
      );
      setMonthlyEmailList(
        performance.data.data.data.monthly_report_email_addresses
      );
      if (
        performance.data.data.data.monthly_report_email_addresses.length > 0 ||
        performance.data.data.data.monthly_report_whatsapp_mobiles.length > 0 ||
        performance.data.data.data.weekly_report_email_addresses.length > 0 ||
        performance.data.data.data.weekly_report_whatsapp_mobiles.length > 0 ||
        performance.data.data.data.daily_report_email_addresses.length > 0 ||
        performance.data.data.data.daily_report_whatsapp_mobiles.length > 0
      ) {
        setPermission(true);
      }
    }
  }, [state]);

  const handleAddList = (value) => {
    resetError();
    if (value === "email") {
      if (!email)
        return notification.warning({
          message: "Please Enter Email Before Adding",
        });
      if (!isValidEmail(email))
        return notification.warning({
          message: "Please Enter Valid Email",
        });
      if (emailErrorHandler())
        return notification.warning({
          message: "Already Adding to Emails List",
        });
      if (reportDuration === "Daily") {
        setDailyEmailList((prev) => [...prev, email]);
      }
      if (reportDuration === "Weekly") {
        setWeeklyEmailList((prev) => [...prev, email]);
      }
      if (reportDuration === "Monthly") {
        setMonthlyEmailList((prev) => [...prev, email]);
      }
      setEmail("");
      return;
    }

    if (!number) {
      notification.warning({
        message: "Please Enter Number Before Adding",
      });
      setError(true);
      return;
    }
    if (number[0] === "0") {
      notification.warning({ message: "Number cannot start with 0" });
      setError(true);
      return;
    }
    if (number.length < 10) {
      notification.warning({ message: "Please enter a valid number" });
      setError(true);
      return;
    }
    if (numberErrorHandler())
      return notification.warning({
        message: "Already Adding to WhatsApp Numbers List",
      });
    if (reportDuration === "Daily") {
      setDailyNumberList((prev) => [...prev, number]);
    }
    if (reportDuration === "Weekly") {
      setWeeklyNumberList((prev) => [...prev, number]);
    }
    if (reportDuration === "Monthly") {
      setMonthlyNumberList((prev) => [...prev, number]);
    }
    setNumber("");
  };

  const resetError = () => {
    setTimeout(() => {
      setError(false);
    }, 4000);
  };

  const numberErrorHandler = () => {
    if (reportDuration === "Daily") {
      let tempEmailList = dailyNumberList.filter((ele) => ele === number);
      if (tempEmailList.length !== 0) {
        return true;
      }
      return false;
    }
    if (reportDuration === "Weekly") {
      let tempEmailList = weeklyNumberList.filter((ele) => ele === number);
      if (tempEmailList.length !== 0) {
        return true;
      }
      return false;
    }
    if (reportDuration === "Monthly") {
      let tempEmailList = monthlyNumberList.filter((ele) => ele === number);
      if (tempEmailList.length !== 0) {
        return true;
      }
      return false;
    }
  };

  const emailErrorHandler = () => {
    if (reportDuration === "Daily") {
      let tempEmailList = dailyEmailList.filter((ele) => ele === email);
      if (tempEmailList.length !== 0) {
        return true;
      }
      return false;
    }
    if (reportDuration === "Weekly") {
      let tempEmailList = weeklyEmailList.filter((ele) => ele === email);
      if (tempEmailList.length !== 0) {
        return true;
      }
      return false;
    }
    if (reportDuration === "Monthly") {
      let tempEmailList = monthlyEmailList.filter((ele) => ele === email);
      if (tempEmailList.length !== 0) {
        return true;
      }
      return false;
    }
  };

  const handleDelete = (value, data) => {
    if (value === "email") {
      if (reportDuration === "Daily") {
        let tempList = dailyEmailList.filter((ele) => ele !== data);
        setDailyEmailList(tempList);
      }
      if (reportDuration === "Weekly") {
        let tempList = weeklyEmailList.filter((ele) => ele !== data);
        setWeeklyEmailList(tempList);
      }
      if (reportDuration === "Monthly") {
        let tempList = monthlyEmailList.filter((ele) => ele !== data);
        setMonthlyEmailList(tempList);
      }
      return;
    }
    if (reportDuration === "Daily") {
      let tempList = dailyNumberList.filter((ele) => ele !== data);
      setDailyNumberList(tempList);
    }
    if (reportDuration === "Weekly") {
      let tempList = weeklyNumberList.filter((ele) => ele !== data);
      setWeeklyNumberList(tempList);
    }
    if (reportDuration === "Monthly") {
      let tempList = monthlyNumberList.filter((ele) => ele !== data);
      setMonthlyNumberList(tempList);
    }
  };

  const handleSubmit = () => {
    if (!reportDuration)
      return notification.error({
        message: "Please select duration of report",
      });
    const apiData =
      reportDuration === "Daily"
        ? {
            daily_report_email_addresses: dailyEmailList,
            daily_report_whatsapp_mobiles: dailyNumberList,
          }
        : reportDuration === "Weekly"
        ? {
            weekly_report_email_addresses: weeklyEmailList,
            weekly_report_whatsapp_mobiles: weeklyNumberList,
          }
        : {
            monthly_report_email_addresses: monthlyEmailList,
            monthly_report_whatsapp_mobiles: monthlyNumberList,
          };
    dispatch(addPreferencesAction(apiData));
  };

  return (
    <>
      <div className="table_list position-rel">
        <Content
          style={{
            padding: "0px 24px",
            margin: 0,
            height: "82vh",
            background: "transparent",
          }}
        >
          <div className={styles.report_header_container}>
            <div>
              <span>Schedule Reports</span>
              <div
                className={`custom-toggle-container ${
                  permission ? "active" : ""
                }`}
                onClick={() => setPermission(!permission)}
              >
                <div
                  className={`custom-toggle-track ${
                    permission ? "active" : ""
                  }`}
                >
                  <div
                    className={`custom-toggle-thumb ${
                      permission ? "active" : ""
                    }`}
                  />
                </div>
              </div>
            </div>
            <br />
            <div
              style={!permission ? { opacity: 0.3, cursor: "not-allowed" } : {}}
            >
              <span>
                Report Duration <span style={{ color: "red" }}>*</span>
              </span>
              <select
                className={!permission && styles.cross}
                style={{ padding: "5px 20px", width: 200 }}
                onChange={(event) => {
                  setReportDuration(event.target.value);
                  setEmail("");
                  setNumber("");
                }}
                value={reportDuration}
                disabled={!permission}
              >
                <option value="" disabled>
                  Select Duration
                </option>
                {duration.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <br />
          {reportDuration === "Daily" ? (
            <div
              className={styles.report_section}
              style={!permission ? { opacity: 0.3, cursor: "not-allowed" } : {}}
            >
              <div>
                <div className={styles.img_group}>
                  <img src={WhatsApp} alt="whatsapp" />
                  WhatsApp Number
                </div>
                <div className={styles.input_group}>
                  <input
                    className={!permission && styles.cross}
                    placeholder="Enter Number"
                    value={number}
                    onChange={(event) => setNumber(event.target.value)}
                    onKeyPress={numberValidation}
                    maxLength={10}
                    style={{ border: error && "2px solid red" }}
                  />
                  <button
                    className={`button_secondary ${
                      !permission && styles.cross
                    } ${
                      dailyNumberList.length === 5
                        ? "button_secondary_disabled"
                        : ""
                    }`}
                    disabled={dailyNumberList.length === 5}
                    onClick={() => handleAddList("number")}
                  >
                    Add
                  </button>
                </div>
                <div className={styles.warr_line}>* Upto 5 Numbers Only.</div>
                <ul className={styles.list}>
                  {dailyNumberList.map((ele, index) => (
                    <li key={index}>
                      <span>{ele}</span>
                      <img
                        src={DeleteOutlineIcon}
                        className={`clickable ${!permission && styles.cross}`}
                        alt="delete"
                        onClick={() => {
                          if (permission) {
                            handleDelete("number", ele);
                          }
                        }}
                      />
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className={styles.img_group}>
                  <img src={Email} alt="whatsapp" />
                  Email Id
                </div>
                <div className={styles.input_group}>
                  <input
                    className={!permission && styles.cross}
                    placeholder="Enter Email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                  <button
                    className={`button_secondary ${
                      !permission && styles.cross
                    }`}
                    disabled={!permission}
                    onClick={() => handleAddList("email")}
                  >
                    Add
                  </button>
                </div>
                <ul className={styles.list}>
                  {dailyEmailList.map((ele, index) => (
                    <li key={index}>
                      <span>{ele}</span>
                      <img
                        className={`clickable ${!permission && styles.cross}`}
                        src={DeleteOutlineIcon}
                        alt="delete"
                        onClick={() => {
                          if (permission) {
                            handleDelete("email", ele);
                          }
                        }}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : reportDuration === "Weekly" ? (
            <div
              className={styles.report_section}
              style={!permission ? { opacity: 0.3, cursor: "not-allowed" } : {}}
            >
              <div>
                <div className={styles.img_group}>
                  <img src={WhatsApp} alt="whatsapp" />
                  WhatsApp Number
                </div>
                <div className={styles.input_group}>
                  <input
                    className={!permission && styles.cross}
                    placeholder="Enter Number"
                    value={number}
                    onChange={(event) => setNumber(event.target.value)}
                    onKeyPress={numberValidation}
                    maxLength={10}
                    style={{ border: error && "2px solid red" }}
                  />
                  <button
                    className={`button_secondary ${
                      !permission && styles.cross
                    } ${
                      weeklyNumberList.length === 5
                        ? "button_secondary_disabled"
                        : ""
                    }`}
                    disabled={weeklyNumberList.length === 5}
                    onClick={() => handleAddList("number")}
                  >
                    Add
                  </button>
                </div>{" "}
                <div className={styles.warr_line}>* Upto 5 Numbers Only.</div>
                <ul className={styles.list}>
                  {weeklyNumberList.map((ele, index) => (
                    <li key={index}>
                      <span>{ele}</span>
                      <img
                        src={DeleteOutlineIcon}
                        className={`clickable ${!permission && styles.cross}`}
                        alt="delete"
                        onClick={() => {
                          if (permission) {
                            handleDelete("number", ele);
                          }
                        }}
                      />
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className={styles.img_group}>
                  <img src={Email} alt="whatsapp" />
                  Email Id
                </div>
                <div className={styles.input_group}>
                  <input
                    className={!permission && styles.cross}
                    placeholder="Enter Email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    type="email"
                  />
                  <button
                    className={`button_secondary ${
                      !permission && styles.cross
                    }`}
                    disabled={!permission}
                    onClick={() => handleAddList("email")}
                  >
                    Add
                  </button>
                </div>
                <ul className={styles.list}>
                  {weeklyEmailList.map((ele, index) => (
                    <li key={index}>
                      <span>{ele}</span>
                      <img
                        src={DeleteOutlineIcon}
                        className={`clickable ${!permission && styles.cross}`}
                        alt="delete"
                        onClick={() => {
                          if (permission) {
                            handleDelete("email", ele);
                          }
                        }}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            reportDuration === "Monthly" && (
              <div
                className={styles.report_section}
                style={
                  !permission ? { opacity: 0.3, cursor: "not-allowed" } : {}
                }
              >
                <div>
                  <div className={styles.img_group}>
                    <img src={WhatsApp} alt="whatsapp" />
                    WhatsApp Number
                  </div>
                  <div className={styles.input_group}>
                    <input
                      className={!permission && styles.cross}
                      placeholder="Enter Number"
                      value={number}
                      onChange={(event) => setNumber(event.target.value)}
                      onKeyPress={numberValidation}
                      maxLength={10}
                      style={{ border: error && "2px solid red" }}
                    />
                    <button
                      className={`button_secondary ${
                        !permission && styles.cross
                      } ${
                        monthlyNumberList.length === 5
                          ? "button_secondary_disabled"
                          : ""
                      }`}
                      disabled={monthlyNumberList.length === 5}
                      onClick={() => handleAddList("number")}
                    >
                      Add
                    </button>
                  </div>{" "}
                  <div className={styles.warr_line}>* Upto 5 Numbers Only.</div>
                  <ul className={styles.list}>
                    {monthlyNumberList.map((ele, index) => (
                      <li key={index}>
                        <span>{ele}</span>
                        <img
                          src={DeleteOutlineIcon}
                          className={`clickable ${!permission && styles.cross}`}
                          alt="delete"
                          onClick={() => {
                            if (permission) {
                              handleDelete("number", ele);
                            }
                          }}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className={styles.img_group}>
                    <img src={Email} alt="whatsapp" />
                    Email Id
                  </div>
                  <div className={styles.input_group}>
                    <input
                      className={!permission && styles.cross}
                      placeholder="Enter Email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      type="email"
                    />
                    <button
                      className={`button_secondary ${
                        !permission && styles.cross
                      } ${!permission ? "button_secondary_disabled" : ""}`}
                      disabled={!permission}
                      onClick={() => handleAddList("email")}
                    >
                      Add
                    </button>
                  </div>
                  <ul className={styles.list}>
                    {monthlyEmailList.map((ele, index) => (
                      <li key={index}>
                        <span>{ele}</span>
                        <img
                          src={DeleteOutlineIcon}
                          className={`clickable ${!permission && styles.cross}`}
                          alt="delete"
                          onClick={() => {
                            if (permission) {
                              handleDelete("email", ele);
                            }
                          }}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          )}
          <br />
          <button
            className={`button_primary`}
            style={{
              float: "right",
              width: 100,
              paddingLeft: 35,
              opacity: !permission ? 0.2 : 1,
              cursor: !permission ? "not-allowed" : "",
            }}
            onClick={handleSubmit}
            disabled={!permission}
          >
            {" "}
            Save
          </button>
        </Content>
      </div>
    </>
  );
};

export default GetReportsComponent;

const duration = ["Daily", "Weekly", "Monthly"];

function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}
