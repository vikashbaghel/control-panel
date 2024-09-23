import React, { useState, useContext } from "react";
import { Button, Checkbox, Drawer, Select, notification } from "antd";
import styles from "./styles/goal.module.css";
import Context from "../../context/Context";
import { CloseOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { createGoalTemplate, getGoalTemplate } from "../../redux/action/goals";
import SelectProduct from "../../views/goal/selectProduct";

const CreateGoalView = ({ pageCount }) => {
  const dispatch = useDispatch();
  const context = useContext(Context);
  const { createGoalViewOpen, setCreateGoalViewOpen, productData } = context;

  let initialValue = {
    name: "",
    duration_string: "Select Duration",
    target_sales_amount: 0,
    target_payment_collection: 0,
    target_new_leads: 0,
    target_new_customers: 0,
    target_customer_visits: 0,
  };
  const initialCheckbox = {
    sales: false,
    payment: false,
    lead: false,
    visit: false,
    customer: false,
  };
  const [formValue, setFormValue] = useState(initialValue);
  const [checkBox, setCheckBox] = useState(initialCheckbox);

  const handleChange = (e) => {
    setFormValue((perState) => {
      return {
        ...perState,
        [e.target.name]:
          e.target.name === "name" || e.target.name === "duration_string"
            ? e.target.value
            : parseFloat(e.target.value),
      };
    });
  };

  const onClose = () => {
    setCreateGoalViewOpen(false);
    setFormValue(initialValue);
    setCheckBox(initialCheckbox);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let apiData = formValue;
    if (formValue.name === "" || formValue.duration_string === "") {
      notification.warning({
        message: `Please fill required fields`,
      });
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
    if (productData[0].id === "") {
      Object.assign(apiData, { product_metrics: [] });
    } else {
      Object.assign(apiData, { product_metrics: productData });
    }
    dispatch(createGoalTemplate(apiData));
    onClose();
    setTimeout(() => {
      dispatch(getGoalTemplate(pageCount));
    }, 400);
  };

  return (
    <>
      <Drawer
        title={
          <div style={{ alignItems: "center", display: "flex" }}>
            <CloseOutlined onClick={onClose} style={{ fontSize: 25 }} />
            &nbsp;&nbsp;&nbsp; Create Goal
          </div>
        }
        width={630}
        closable={false}
        onClose={onClose}
        open={createGoalViewOpen}
        style={{ overflowY: "auto" }}
        className="goal_assigment_view"
      >
        <div className={styles.goal_selecter}>
          <label>
            Goal Name <b style={{ color: "red" }}>*</b>
          </label>
          <div>
            <input
              placeholder="Goal Name"
              size="large"
              name="name"
              onChange={handleChange}
              value={formValue.name}
            />
          </div>
        </div>
        <div className={styles.custom_goals}>
          <label>Goals</label>
          <div className={styles.input_group}>
            <div>
              <div className={styles.input_checkbox_list}>
                <Checkbox
                  checked={checkBox.sales}
                  onChange={() =>
                    setCheckBox((prevState) => ({
                      ...prevState,
                      sales: !checkBox.sales,
                    }))
                  }
                />
                <div>Sales Amount</div>
              </div>
              <div className={styles.input_control_icon}>
                <samp className={checkBox.sales ? styles.active : ""}>₹</samp>
                <input
                  type="number"
                  pattern="^[0-9]*[1-9][0-9]*$"
                  size="large"
                  name="target_sales_amount"
                  disabled={!checkBox.sales}
                  onChange={handleChange}
                  value={formValue.target_sales_amount}
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
                <samp className={checkBox.payment ? styles.active : ""}>₹</samp>
                <input
                  type="number"
                  pattern="^[0-9]*[1-9][0-9]*$"
                  size="large"
                  name="target_payment_collection"
                  disabled={!checkBox.payment}
                  onChange={handleChange}
                  value={formValue.target_payment_collection}
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
                value={formValue.target_new_leads}
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
                name="target_new_customers"
                disabled={!checkBox.customer}
                onChange={(e) => {
                  if (e.target.value.match(/^\d*$/)) {
                    handleChange(e);
                  }
                }}
                value={formValue.target_new_customers}
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
                name="target_customer_visits"
                disabled={!checkBox.visit}
                onChange={(e) => {
                  if (e.target.value.match(/^\d*$/)) {
                    handleChange(e);
                  }
                }}
                value={formValue.target_customer_visits}
              />
            </div>
            <div>
              <div
                className={styles.input_checkbox_list}
                style={{ margin: "10px 0" }}
              >
                {/* <Checkbox
                  onChange={() =>
                    setCheckBox((prevState) => ({
                      ...prevState,
                      product: !checkBox.product,
                    }))
                  }
                  checked={checkBox.product}
                /> */}
                <div></div>
                <div>Product wise sales -</div>
              </div>
            </div>
            <div style={{ paddingLeft: 35 }}>
              <SelectProduct />
            </div>
          </div>
        </div>
        <div className={styles.create_goal_footer}>
          <label>
            Days / Duration <b style={{ color: "red" }}>*</b>
          </label>
          <div>
            <select
              size="large"
              style={{ width: "45%" }}
              onChange={(e) =>
                setFormValue((prevState) => ({
                  ...prevState,
                  duration_string: e.target.value,
                }))
              }
              value={formValue.duration_string}
            >
              {selectDuration.map((data, index) => (
                <option
                  key={index}
                  value={data}
                  disabled={data === "Select Duration"}
                >
                  {data}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={styles.footer_btn}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
        <br />
        <br />
        <br />
        <br />
        <br />
      </Drawer>
    </>
  );
};

export default CreateGoalView;

export const selectDuration = [
  "Select Duration",
  "1-Day",
  "Calendar Week",
  "Calendar Month",
  "Calendar Quarter",
  "Calendar Year",
  "Financial Year",
];
