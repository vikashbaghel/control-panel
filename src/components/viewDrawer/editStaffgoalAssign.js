import React, { useEffect, useState } from "react";
import { Button, Checkbox, DatePicker, Drawer, Input } from "antd";
import { CloseOutlined, DownOutlined } from "@ant-design/icons";
import { useContext } from "react";
import Context from "../../context/Context";
import styles from "./styles/goal.module.css";
import { BASE_URL_V2, org_id } from "../../config";
import Cookies from "universal-cookie";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import {
  getGoalById,
  getUserGoalDetails,
  searchGoalTemplate,
  updateStaffTarget,
} from "../../redux/action/goals";
import { selectDuration } from "./createGoalView";
import SelectProduct from "../../views/goal/selectProduct";

const EditStaffGoalAssign = ({ targetList }) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const context = useContext(Context);
  const { editStaffTargetAssign, setEditStaffTargetAssign, productData } =
    context;
  const cookies = new Cookies();

  let initialValue = {
    name: "",
    duration_string: "",
    target_sales_amount: 0,
    target_payment_collection: 0,
    target_new_leads: 0,
    target_new_customers: 0,
    target_customer_visits: 0,
    recurring: false,
    start_date: "",
    user_id_list: [],
  };
  const initialCheckbox = {
    sales: false,
    payment: false,
    lead: false,
    visit: false,
    customer: false,
    product: false,
  };
  const [commonOrCustom, setCommonOrCustom] = useState("custom");
  const [formValueCustom, setFormValueCustom] = useState(initialValue);
  const [formValueCommon, setFormValueCommon] = useState(initialValue);
  const [checkBox, setCheckBox] = useState(initialCheckbox);
  const [goalDropDown, setGoalDropDown] = useState(false);

  const [goalList, setGoalList] = useState([]);
  const [pageNoGoal, setPageNoGoal] = useState(1);
  const [hasMoreGoal, setHasMoreGoal] = useState(true);

  const [goalSearchInput, setGoalSearchInput] = useState("");
  const [goalSearchList, setGoalSearchList] = useState([]);

  const [target_product_metrics, setTarget_product_metrics] = useState([]);

  const fetchMoreDataGoal = () => {
    const url = `${BASE_URL_V2}/organization/${org_id}/target/template/`;
    const headers = { Authorization: cookies.get("rupyzToken") };
    const params = { page_no: pageNoGoal };
    axios.get(url, { headers }).then((response) => {
      setGoalList(goalList.concat(response.data.data));
      setPageNoGoal(pageNoGoal + 1);
      if (response.data.data.length !== 30) {
        setHasMoreGoal(false);
      }
    });
  };

  useEffect(() => {
    fetchMoreDataGoal();
  }, [editStaffTargetAssign]);

  useEffect(() => {
    // form userID setting
    if (targetList) {
      setFormValueCommon((prevState) => ({
        ...prevState,
        user_id_list: [targetList.user],
      }));
      setFormValueCustom((prevState) => ({
        ...prevState,
        user_id_list: [targetList.user],
      }));
    }
    // for Common target
    if (!targetList) return;
    setFormValueCommon((prevState) => ({
      ...prevState,
      duration_string: targetList.duration_string,
    }));
    setFormValueCommon((prevState) => ({
      ...prevState,
      name: targetList.name,
    }));
    setFormValueCommon((prevState) => ({
      ...prevState,
      target_sales_amount: targetList.target_sales_amount,
    }));
    setFormValueCommon((prevState) => ({
      ...prevState,
      target_payment_collection: targetList.target_payment_collection,
    }));
    setFormValueCommon((prevState) => ({
      ...prevState,
      target_new_leads: targetList.target_new_leads,
    }));
    setFormValueCommon((prevState) => ({
      ...prevState,
      target_new_customers: targetList.target_new_customers,
    }));
    setFormValueCommon((prevState) => ({
      ...prevState,
      target_customer_visits: targetList.target_customer_visits,
    }));
    setFormValueCommon((prevState) => ({
      ...prevState,
      recurring: targetList.recurring,
    }));
    setFormValueCommon((prevState) => ({
      ...prevState,
      start_date: targetList.start_date,
    }));
  }, [editStaffTargetAssign]);

  useEffect(() => {
    // for Custom target
    if (!targetList) return;
    setFormValueCustom((prevState) => ({
      ...prevState,
      duration_string: targetList.duration_string,
    }));
    setFormValueCustom((prevState) => ({
      ...prevState,
      name: targetList.name,
    }));
    setFormValueCustom((prevState) => ({
      ...prevState,
      target_sales_amount: targetList.target_sales_amount,
    }));
    setFormValueCustom((prevState) => ({
      ...prevState,
      target_payment_collection: targetList.target_payment_collection,
    }));
    setFormValueCustom((prevState) => ({
      ...prevState,
      target_new_leads: targetList.target_new_leads,
    }));
    setFormValueCustom((prevState) => ({
      ...prevState,
      target_new_customers: targetList.target_new_customers,
    }));
    setFormValueCustom((prevState) => ({
      ...prevState,
      target_customer_visits: targetList.target_customer_visits,
    }));
    setFormValueCustom((prevState) => ({
      ...prevState,
      recurring: targetList.recurring,
    }));
    setFormValueCustom((prevState) => ({
      ...prevState,
      start_date: targetList.start_date,
    }));
    setTarget_product_metrics(targetList.product_metrics);

    // for the checkbox of custom
    setCheckBox((prevState) => ({
      ...prevState,
      sales: targetList.target_sales_amount > 0 ? true : false,
    }));
    setCheckBox((prevState) => ({
      ...prevState,
      payment: targetList.target_payment_collection > 0 ? true : false,
    }));
    setCheckBox((prevState) => ({
      ...prevState,
      lead: targetList.target_new_leads > 0 ? true : false,
    }));
    setCheckBox((prevState) => ({
      ...prevState,
      customer: targetList.target_new_customers > 0 ? true : false,
    }));
    setCheckBox((prevState) => ({
      ...prevState,
      visit: targetList.target_customer_visits > 0 ? true : false,
    }));
    setCheckBox((prevState) => ({
      ...prevState,
      product: targetList.product_metrics.length > 0 ? true : false,
    }));
  }, [editStaffTargetAssign]);

  const onClose = () => {
    setEditStaffTargetAssign(false);
    setFormValueCommon(initialValue);
    setFormValueCustom(initialValue);
    setCheckBox(initialCheckbox);
    setCommonOrCustom("common");
    setTarget_product_metrics([]);
  };

  const handleGoalDetails = (data) => {
    dispatch(getGoalById(data.id));
  };

  const handleChange = (e) => {
    setFormValueCustom((perState) => {
      return {
        ...perState,
        [e.target.name]:
          e.target.name === "name" ||
          e.target.name === "duration_string" ||
          e.target.name === "recurring" ||
          e.target.name === "start_date"
            ? e.target.value
            : parseFloat(e.target.value),
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let apiData = formValueCustom;
    if (commonOrCustom === "common") {
      dispatch(updateStaffTarget(targetList.id, formValueCommon));
      onClose();
      setTimeout(() => {
        dispatch(getUserGoalDetails(targetList.user));
      }, 500);
      return;
    }
    if (!checkBox.sales) {
      Object.assign(apiData, { target_sales_amount: 0 });
    }
    if (!checkBox.payment) {
      Object.assign(apiData, { target_payment_collection: 0 });
    }
    if (!checkBox.lead) {
      Object.assign(apiData, { target_new_leads: 0 });
    }
    if (!checkBox.customer) {
      Object.assign(apiData, { target_new_customers: 0 });
    }
    if (!checkBox.visit) {
      Object.assign(apiData, { target_customer_visits: 0 });
    }
    if (!checkBox.product) {
      Object.assign(apiData, { product_metrics: [] });
    } else {
      Object.assign(apiData, { product_metrics: productData });
    }
    dispatch(updateStaffTarget(targetList.id, apiData));
    onClose();
    setTimeout(() => {
      dispatch(getUserGoalDetails(targetList.user));
    }, 500);
  };

  useEffect(() => {
    // For getting the goal details
    if (state.getGoalById.data !== "") {
      if (state.getGoalById.data.data.error === false)
        setFormValueCommon((prevState) => ({
          ...prevState,
          duration_string: state.getGoalById.data.data.data.duration_string,
        }));
      setFormValueCommon((prevState) => ({
        ...prevState,
        name: state.getGoalById.data.data.data.name,
      }));
      setFormValueCommon((prevState) => ({
        ...prevState,
        target_sales_amount:
          state.getGoalById.data.data.data.target_sales_amount,
      }));
      setFormValueCommon((prevState) => ({
        ...prevState,
        target_payment_collection:
          state.getGoalById.data.data.data.target_payment_collection,
      }));
      setFormValueCommon((prevState) => ({
        ...prevState,
        target_new_leads: state.getGoalById.data.data.data.target_new_leads,
      }));
      setFormValueCommon((prevState) => ({
        ...prevState,
        target_new_customers:
          state.getGoalById.data.data.data.target_new_customers,
      }));
      setFormValueCommon((prevState) => ({
        ...prevState,
        target_customer_visits:
          state.getGoalById.data.data.data.target_customer_visits,
      }));
    }

    // for searched goal
    if (state.searchGoalTemplate.data !== "") {
      if (state.searchGoalTemplate.data.data.error === false) {
        setGoalSearchList(state.searchGoalTemplate.data.data.data);
      }
    }
  }, [state]);

  const handleGoalSearch = (e) => {
    setGoalSearchInput(e.target.value);
    dispatch(searchGoalTemplate(e.target.value));
  };

  return (
    <div>
      {targetList ? (
        <Drawer
          title={
            <div style={{ alignItems: "center", display: "flex" }}>
              <CloseOutlined onClick={onClose} style={{ fontSize: 25 }} />
              &nbsp;&nbsp;&nbsp; Update Assign Target
            </div>
          }
          width={630}
          closable={false}
          onClose={onClose}
          open={editStaffTargetAssign}
          style={{ overflowY: "auto" }}
          className="goal_assigment_view"
        >
          <div className={styles.view_header}>
            <div
              className={commonOrCustom === "common" ? "" : styles.active}
              onClick={() => setCommonOrCustom("common")}
            >
              Common
            </div>
            <div
              className={commonOrCustom === "custom" ? "" : styles.active}
              onClick={() => setCommonOrCustom("custom")}
            >
              Custom
            </div>
          </div>
          {commonOrCustom === "common" ? (
            <>
              <div
                className={styles.goal_selecter}
                style={{ position: "relative" }}
              >
                <label>Select Goal</label>
                <div>
                  <div
                    onMouseEnter={() => setGoalDropDown(true)}
                    onMouseLeave={() => setGoalDropDown(false)}
                  >
                    <Input
                      size="large"
                      placeholder="Please select a goal ..."
                      value={goalSearchInput}
                      onChange={handleGoalSearch}
                      onFocus={() => {
                        setGoalSearchInput("");
                        setGoalSearchList([]);
                      }}
                      onMouseEnter={() => setGoalSearchList([])}
                    />
                    <DownOutlined />
                  </div>
                  <div
                    className={`${styles.dropdown} ${
                      goalDropDown ? styles.active : ""
                    }`}
                    onMouseEnter={() => setGoalDropDown(true)}
                    onMouseLeave={() => setGoalDropDown(false)}
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: 5,
                      width: "93.5%",
                      marginTop: 11,
                    }}
                  >
                    {goalSearchInput.length > 1 && goalSearchList.length > 0 ? (
                      <>
                        {" "}
                        <ul>
                          {goalSearchList.map((data, index) => (
                            <li
                              key={index}
                              onClick={() => {
                                handleGoalDetails(data);
                                setGoalDropDown(false);
                                setGoalSearchInput(data.name);
                              }}
                            >
                              {data.name}
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <InfiniteScroll
                        dataLength={goalList.length}
                        next={fetchMoreDataGoal}
                        hasMore={hasMoreGoal}
                        height={200}
                        loader={
                          <h4 style={{ textAlign: "center", color: "blue" }}>
                            Loading...
                          </h4>
                        }
                        scrollableTarget="scrollableDiv"
                      >
                        <div id="scrollableDiv">
                          <ul>
                            {goalList.map((data, index) => (
                              <li
                                key={index}
                                onClick={() => {
                                  handleGoalDetails(data);
                                  setGoalDropDown(false);
                                }}
                              >
                                {data.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </InfiniteScroll>
                    )}
                  </div>
                </div>
              </div>
              <div
                className={styles.goal_selecter}
                style={{ position: "relative" }}
              >
                <label>Select User</label>
                <div style={{ padding: "13px 10px", background: "#f3f3f3" }}>
                  {targetList.user_name}
                </div>
              </div>

              <div className={styles.view_footer}>
                <label>
                  Start Date :
                  <span style={{ fontSize: 12, color: "rgb(141 141 141)" }}>
                    ({formValueCommon.start_date})
                  </span>
                </label>
                <div>
                  <DatePicker
                    size="large"
                    style={{ width: "100%" }}
                    format="YYYY-MM-DD"
                    onChange={(date, dateString) => {
                      if (!dateString) return;
                      setFormValueCommon((prevState) => ({
                        ...prevState,
                        start_date: dateString,
                      }));
                    }}
                  />
                  <div>
                    <Checkbox
                      onChange={(e) =>
                        setFormValueCommon((prevState) => ({
                          ...prevState,
                          recurring: e.target.checked,
                        }))
                      }
                      checked={formValueCommon.recurring}
                    />
                    <span>Recurring Goal</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {" "}
              <div
                className={styles.goal_selecter}
                style={{ position: "relative" }}
              >
                <label>User Name</label>
                <div style={{ padding: "13px 10px", background: "#f3f3f3" }}>
                  {targetList.user_name}
                </div>
              </div>
              <div className={styles.custom_goals}>
                <label>Goals</label>
                <div className={styles.input_group}>
                  <div>
                    <div className={styles.input_checkbox_list}>
                      <Checkbox
                        onChange={() =>
                          setCheckBox((prevState) => ({
                            ...prevState,
                            sales: !checkBox.sales,
                          }))
                        }
                        checked={checkBox.sales}
                      />
                      <div>Sales Amount</div>
                    </div>
                    <div className={styles.input_control_icon}>
                      <samp className={checkBox.sales ? styles.active : ""}>
                        ₹
                      </samp>
                      <input
                        type="number"
                        pattern="^[0-9]*[1-9][0-9]*$"
                        size="large"
                        name="target_sales_amount"
                        disabled={!checkBox.sales}
                        onChange={handleChange}
                        value={formValueCustom.target_sales_amount}
                      />
                    </div>
                  </div>
                  <div>
                    <div className={styles.input_checkbox_list}>
                      <Checkbox
                        onChange={() =>
                          setCheckBox((prevState) => ({
                            ...prevState,
                            payment: !checkBox.payment,
                          }))
                        }
                        checked={checkBox.payment}
                      />
                      <div>Payment Collection</div>
                    </div>
                    <div className={styles.input_control_icon}>
                      <samp className={checkBox.payment ? styles.active : ""}>
                        ₹
                      </samp>
                      <input
                        type="number"
                        pattern="^[0-9]*[1-9][0-9]*$"
                        size="large"
                        name="target_payment_collection"
                        disabled={!checkBox.payment}
                        onChange={handleChange}
                        value={formValueCustom.target_payment_collection}
                      />
                    </div>
                  </div>
                  <div>
                    <div className={styles.input_checkbox_list}>
                      <Checkbox
                        onChange={() =>
                          setCheckBox((prevState) => ({
                            ...prevState,
                            lead: !checkBox.lead,
                          }))
                        }
                        checked={checkBox.lead}
                      />
                      <div>
                        New Lead <span>(Count)</span>
                      </div>
                    </div>
                    <input
                      className={styles.input_control}
                      type="number"
                      pattern="^[0-9]*[1-9][0-9]*$"
                      size="large"
                      name="target_new_leads"
                      disabled={!checkBox.lead}
                      onChange={(e) => {
                        if (e.target.value.match(/^\d*$/)) {
                          handleChange(e);
                        }
                      }}
                      value={formValueCustom.target_new_leads}
                    />
                  </div>
                  <div>
                    <div className={styles.input_checkbox_list}>
                      <Checkbox
                        onChange={() =>
                          setCheckBox((prevState) => ({
                            ...prevState,
                            customer: !checkBox.customer,
                          }))
                        }
                        checked={checkBox.customer}
                      />
                      <div>
                        New Customer <span>(Count)</span>
                      </div>
                    </div>
                    <input
                      className={styles.input_control}
                      type="number"
                      pattern="^[0-9]*[1-9][0-9]*$"
                      size="large"
                      disabled={!checkBox.customer}
                      onChange={(e) => {
                        if (e.target.value.match(/^\d*$/)) {
                          handleChange(e);
                        }
                      }}
                      name="target_new_customers"
                      value={formValueCustom.target_new_customers}
                    />
                  </div>
                  <div>
                    <div className={styles.input_checkbox_list}>
                      <Checkbox
                        onChange={() =>
                          setCheckBox((prevState) => ({
                            ...prevState,
                            visit: !checkBox.visit,
                          }))
                        }
                        checked={checkBox.visit}
                      />
                      <div>
                        Customer Visit <span>(Count)</span>
                      </div>
                    </div>
                    <input
                      className={styles.input_control}
                      type="number"
                      pattern="^[0-9]*[1-9][0-9]*$"
                      size="large"
                      disabled={!checkBox.visit}
                      onChange={(e) => {
                        if (e.target.value.match(/^\d*$/)) {
                          handleChange(e);
                        }
                      }}
                      name="target_customer_visits"
                      value={formValueCustom.target_customer_visits}
                    />
                  </div>
                  <div>
                    <div
                      className={styles.input_checkbox_list}
                      style={{ margin: "10px 0" }}
                    >
                      <Checkbox
                        onChange={() =>
                          setCheckBox((prevState) => ({
                            ...prevState,
                            product: !checkBox.product,
                          }))
                        }
                        checked={checkBox.product}
                      />
                      <div>Product wise sales</div>
                    </div>
                  </div>
                  <div
                    style={{
                      paddingLeft: 35,
                      display: checkBox.product ? "block" : "none",
                    }}
                  >
                    <SelectProduct
                      data={target_product_metrics}
                      isOpen={editStaffTargetAssign}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.custom_footer}>
                <div>
                  <label>Days / Duration</label>
                  <div>
                    <select
                      placeholder="Select Duration"
                      size="large"
                      style={{ width: "100%" }}
                      onChange={(e) =>
                        setFormValueCustom((prevState) => ({
                          ...prevState,
                          duration_string: e.target.value,
                        }))
                      }
                      value={formValueCustom.duration_string}
                    >
                      {selectDuration.map((data, index) => (
                        <option key={index} value={data}>
                          {data}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label>
                    Start Date :
                    <span style={{ fontSize: 12, color: "rgb(141 141 141)" }}>
                      ({formValueCommon.start_date})
                    </span>
                  </label>
                  <div>
                    <DatePicker
                      size="large"
                      style={{ width: "100%" }}
                      format="YYYY-MM-DD"
                      onChange={(date, dateString) => {
                        if (!dateString) return;
                        setFormValueCustom((prevState) => ({
                          ...prevState,
                          start_date: dateString,
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.custom_footer_checkbox_group}>
                <Checkbox
                  name="recurring"
                  onChange={(e) =>
                    setFormValueCustom((prevState) => ({
                      ...prevState,
                      recurring: e.target.checked,
                    }))
                  }
                  checked={formValueCustom.recurring}
                />
                <span>Recurring Goal</span>
              </div>
            </>
          )}
          <div className={styles.footer_btn}>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </Drawer>
      ) : (
        <></>
      )}
    </div>
  );
};

export default EditStaffGoalAssign;
