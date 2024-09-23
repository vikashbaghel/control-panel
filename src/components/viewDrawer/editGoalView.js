import React, { useState, useContext, useEffect } from "react";
import { Button, Checkbox, Drawer, notification } from "antd";
import styles from "./styles/goal.module.css";
import Context from "../../context/Context";
import { CloseOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  getGoalById as getGoalDetailAPI,
  getGoalTemplate,
  updateGoalTemplate,
} from "../../redux/action/goals";
import { selectDuration } from "./createGoalView";
import SelectProduct from "../../views/goal/selectProduct";

const UpdateGoalView = ({ selectedGoal, pageCount }) => {
  const dispatch = useDispatch();
  const context = useContext(Context);
  const { updateGoalViewOpen, setUpdateGoalViewOpen, productData } = context;
  const { getGoalById, searchProduct } = useSelector((state) => state);

  const [editDate, setEditDate] = useState([]);
  let initialValue = {
    name: "",
    duration_string: "",
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

  const [target_product_metrics, setTarget_product_metrics] = useState([]);

  useEffect(() => {
    if (updateGoalViewOpen) {
      dispatch(getGoalDetailAPI(selectedGoal.id));
    }
  }, [updateGoalViewOpen]);

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
    setUpdateGoalViewOpen(false);
    setFormValue(initialValue);
    setCheckBox(initialCheckbox);
    setEditDate([]);
    setTarget_product_metrics([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let apiData = formValue;
    if (apiData.name === "" || apiData.duration_string === "") {
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
    dispatch(updateGoalTemplate(selectedGoal.id, apiData));
    onClose();
    setTimeout(() => {
      dispatch(getGoalTemplate(pageCount));
    }, 400);
  };

  useEffect(() => {
    if (getGoalById.data !== "") {
      if (getGoalById.data.data.error === false)
        setEditDate(getGoalById.data.data.data);
      setFormValue((prevState) => ({
        ...prevState,
        duration_string: getGoalById.data.data.data.duration_string,
      }));
      setFormValue((prevState) => ({
        ...prevState,
        name: getGoalById.data.data.data.name,
      }));
      setFormValue((prevState) => ({
        ...prevState,
        target_sales_amount: getGoalById.data.data.data.target_sales_amount,
      }));
      setFormValue((prevState) => ({
        ...prevState,
        target_payment_collection:
          getGoalById.data.data.data.target_payment_collection,
      }));
      setFormValue((prevState) => ({
        ...prevState,
        target_new_leads: getGoalById.data.data.data.target_new_leads,
      }));
      setFormValue((prevState) => ({
        ...prevState,
        target_new_customers: getGoalById.data.data.data.target_new_customers,
      }));
      setFormValue((prevState) => ({
        ...prevState,
        target_customer_visits:
          getGoalById.data.data.data.target_customer_visits,
      }));
      setTarget_product_metrics(getGoalById.data.data.data.product_metrics);
      setCheckBox((prevState) => ({
        ...prevState,
        sales:
          getGoalById.data.data.data.target_sales_amount > 0 ? true : false,
      }));
      setCheckBox((prevState) => ({
        ...prevState,
        payment:
          getGoalById.data.data.data.target_payment_collection > 0
            ? true
            : false,
      }));
      setCheckBox((prevState) => ({
        ...prevState,
        lead: getGoalById.data.data.data.target_new_leads > 0 ? true : false,
      }));
      setCheckBox((prevState) => ({
        ...prevState,
        customer:
          getGoalById.data.data.data.target_new_customers > 0 ? true : false,
      }));
      setCheckBox((prevState) => ({
        ...prevState,
        visit:
          getGoalById.data.data.data.target_customer_visits > 0 ? true : false,
      }));
    }
  }, [getGoalById]);

  return (
    <>
      {editDate && (
        <Drawer
          title={
            <div style={{ alignItems: "center", display: "flex" }}>
              <CloseOutlined onClick={onClose} style={{ fontSize: 25 }} />
              &nbsp;&nbsp;&nbsp; Update Goal
            </div>
          }
          width={630}
          closable={false}
          onClose={onClose}
          open={updateGoalViewOpen}
          style={{ overflowY: "auto" }}
          className="goal_assigment_view"
        >
          <div className={styles.goal_selecter}>
            <label>
              Goal Name <span style={{ color: "red" }}>*</span>
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
              <div
                style={{
                  paddingLeft: 35,
                }}
              >
                <SelectProduct data={target_product_metrics} />
              </div>
            </div>
          </div>
          <div className={styles.create_goal_footer}>
            <label>
              Days / Duration <span style={{ color: "red" }}>*</span>
            </label>
            <div>
              <select
                placeholder="Select Duration"
                size="large"
                style={{ width: "45%" }}
                onChange={(e) => {
                  setFormValue((prevState) => ({
                    ...prevState,
                    duration_string: e.target.value,
                  }));
                }}
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
        </Drawer>
      )}
    </>
  );
};

export default UpdateGoalView;
