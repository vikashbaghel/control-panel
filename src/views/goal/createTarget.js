// https://team-1624359381274.atlassian.net/wiki/spaces/RUPYZ/pages/edit-v2/180748290#Create-New-Template-(Add/Edit)

import React, { useState } from "react";
import styles from "./createTarget.module.css";
import { Button, Checkbox, Form, Input, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "../../assets/globle";
import {
  createGoalTemplate as createGoalTemplateAPI,
  getGoalById as getGoalByIdAPI,
  getStaffGoalDetails,
} from "../../redux/action/goals";
import { useContext } from "react";
import Context from "../../context/Context";
import { useEffect } from "react";
import { decimalInputValidation } from "../../helpers/regex";
import FormInput from "../../components/form-elements/formInput";
import { removeEmpty } from "../../helpers/globalFunction";
import SelectProduct from "./selectProduct";

const CreateTarget = () => {
  const [form] = Form.useForm();

  const queryParameters = new URLSearchParams(window.location.search);
  const id = queryParameters.get("id");
  const staffId = queryParameters.get("staff_id");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { createGoalTemplate, getGoalById } = state;
  const context = useContext(Context);
  const { productData } = context;
  const [target_product_metrics, setTarget_product_metrics] = useState([]);
  const [isLoading, setiIsLoading] = useState(false);

  const initialInput = {
    sale: false,
    payment: false,
    lead: false,
    customer: false,
    visit: false,
  };
  const [checkBox, setCheckBox] = useState(initialInput);

  const handleCheckbox = (e) => {
    setCheckBox((prev) => ({ ...prev, [e.target.name]: e.target.checked }));
  };

  useEffect(() => {
    if (!checkBox.sale) {
      form.setFieldsValue({ target_sales_amount: "" });
    }
    if (!checkBox.payment) {
      form.setFieldsValue({ target_payment_collection: "" });
    }
    if (!checkBox.lead) {
      form.setFieldsValue({ target_new_leads: "" });
    }
    if (!checkBox.customer) {
      form.setFieldsValue({ target_new_customers: "" });
    }
    if (!checkBox.visit) {
      form.setFieldsValue({ target_customer_visits: "" });
    }
  }, [checkBox]);

  const handleSubmit = () => {
    setiIsLoading(true);
    let apiData = form.getFieldsValue();

    Object.assign(apiData, {
      target_customer_visits: Number(apiData.target_customer_visits),
      target_new_customers: Number(apiData.target_new_customers),
      target_new_leads: Number(apiData.target_new_leads),
      target_payment_collection: Number(apiData.target_payment_collection),
      target_sales_amount: Number(apiData.target_sales_amount),
      product_metrics: productData,
    });

    dispatch(createGoalTemplateAPI(id, removeEmpty(apiData)));
    setiIsLoading(false);
  };

  useEffect(() => {
    if (
      createGoalTemplate.data &&
      createGoalTemplate.data.data.error === false
    ) {
      navigate(-1);
    }
    if (getGoalById.data && getGoalById.data.data.error === false) {
      const tempData = getGoalById.data.data.data;
      form.setFieldsValue({
        duration_string: tempData.duration_string,
        name: tempData.name,
        target_sales_amount: tempData.target_sales_amount,
        target_payment_collection: tempData.target_payment_collection,
        target_new_leads: tempData.target_new_leads,
        target_new_customers: tempData.target_new_customers,
        target_customer_visits: tempData.target_customer_visits,
      });
      setTarget_product_metrics(tempData.product_metrics);
      setCheckBox((prevState) => ({
        ...prevState,
        sale: tempData?.target_sales_amount > 0 ? true : false,
        payment: tempData?.target_payment_collection > 0 ? true : false,
        lead: tempData?.target_new_leads > 0 ? true : false,
        customer: tempData?.target_new_customers > 0 ? true : false,
        visit: tempData?.target_customer_visits > 0 ? true : false,
      }));
    }
  }, [state]);

  useEffect(() => {
    id && dispatch(getGoalByIdAPI(id));
  }, [id]);

  useEffect(() => {
    staffId && dispatch(getStaffGoalDetails(staffId));
  }, [staffId]);

  return (
    <div className={styles.create_target_container}>
      <h2 style={{ display: "flex", alignItems: "center" }}>
        {" "}
        <img
          src={ArrowLeft}
          alt="arrow"
          onClick={() => navigate(-1)}
          style={{ cursor: "pointer" }}
        />
        &nbsp;{id ? "Edit Target Template" : "Create Target Template"}
      </h2>
      <Form
        form={form}
        layout="vertical"
        validateMessages={{
          required: "${label} is required.",
        }}
        initialValues={{ pics: [] }}
        requiredMark={(label, info) => (
          <div>
            {label} {info.required && <span style={{ color: "red" }}>*</span>}
          </div>
        )}
        onFinish={handleSubmit}
      >
        <div className={styles.form_container}>
          <Form.Item
            label="Target Name"
            name="name"
            rules={[{ required: true }]}
          >
            <FormInput
              type="businessName"
              params={{ placeholder: "Enter Name" }}
            />
          </Form.Item>
          <div>Target</div>
          <br />
          <div style={style}>
            <div style={{ display: "flex", gap: 20 }}>
              <Checkbox
                name="sale"
                onChange={handleCheckbox}
                checked={checkBox.sale}
              />
              <div style={{ width: 200 }}>Sales Amount</div>
            </div>
            <Form.Item label="" name="target_sales_amount">
              <Input
                placeholder="0"
                addonBefore={"₹"}
                disabled={!checkBox.sale}
                onKeyPress={decimalInputValidation}
              />
            </Form.Item>
          </div>
          <div style={style}>
            <div style={{ display: "flex", gap: 20 }}>
              <Checkbox
                name="payment"
                onChange={handleCheckbox}
                checked={checkBox.payment}
              />
              <div style={{ width: 200 }}>Payment Collection</div>
            </div>
            <Form.Item label="" name="target_payment_collection">
              <Input
                placeholder="0"
                addonBefore={"₹"}
                disabled={!checkBox.payment}
                onKeyPress={decimalInputValidation}
              />
            </Form.Item>
          </div>
          <div style={style}>
            <div style={{ display: "flex", gap: 20 }}>
              <Checkbox
                name="lead"
                onChange={handleCheckbox}
                checked={checkBox.lead}
              />
              <div style={{ width: 200 }}>New Lead</div>
            </div>
            <Form.Item label="" name="target_new_leads">
              <FormInput
                type="num"
                params={{
                  disabled: !checkBox.lead,
                  placeholder: "0",
                }}
              />
            </Form.Item>
          </div>
          <div style={style}>
            <div style={{ display: "flex", gap: 20 }}>
              <Checkbox
                name="customer"
                onChange={handleCheckbox}
                checked={checkBox.customer}
              />
              <div style={{ width: 200 }}>New Customer</div>
            </div>
            <Form.Item label="" name="target_new_customers">
              <FormInput
                type="num"
                params={{
                  disabled: !checkBox.customer,
                  placeholder: "0",
                }}
              />
            </Form.Item>
          </div>
          <div style={style}>
            <div style={{ display: "flex", gap: 20 }}>
              <Checkbox
                name="visit"
                onChange={handleCheckbox}
                checked={checkBox.visit}
              />
              <div style={{ width: 200 }}>Customer Visit</div>
            </div>
            <Form.Item label="" name="target_customer_visits">
              <FormInput
                type="num"
                params={{
                  disabled: !checkBox.visit,
                  placeholder: 0,
                }}
              />
            </Form.Item>
          </div>
          <div style={{ marginTop: 15, fontSize: 15 }}>Product wise sales</div>
          <SelectProduct data={target_product_metrics} />
          <Form.Item
            label="Day / Duration"
            name="duration_string"
            rules={[{ required: true }]}
          >
            <Select
              style={{ width: "100%" }}
              placeholder="Select Duration"
              options={durationOption}
            />
          </Form.Item>
          <br />
          {id && (
            <>
              <Form.Item
                label=""
                name="is_update_current_user_targets"
                valuePropName="checked"
              >
                <Checkbox style={{ color: "#727176" }}>
                  Update Current Target of Associated Staff with this Target
                  Template.
                </Checkbox>
              </Form.Item>
              <Form.Item
                label=""
                name="is_update_upcoming_user_targets"
                valuePropName="checked"
              >
                <Checkbox style={{ color: "#727176" }}>
                  Update All Upcoming Target of Associated Staff with this
                  Target Template.
                </Checkbox>
              </Form.Item>
            </>
          )}
        </div>
        <div className={styles.footer_btn}>
          <Button
            className="button_primary"
            htmlType="submit"
            loading={isLoading}
          >
            Submit
          </Button>
          <Button
            onClick={() => navigate(-1)}
            className="button_secondary"
            style={{ padding: "0 20px" }}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CreateTarget;

const durationOption = [
  { value: "1-Day", label: "1-Day" },
  { value: "Calendar Week", label: "Calendar Week" },
  { value: "Calendar Month", label: "Calendar Month" },
  { value: "Calendar Quarter", label: "Calendar Quarter" },
  { value: "Calendar Year", label: "Calendar Year" },
  { value: "Financial Year", label: "Financial Year" },
];

const style = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 20,
};
