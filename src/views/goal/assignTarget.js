// https://team-1624359381274.atlassian.net/wiki/spaces/RUPYZ/pages/edit-v2/180748290#ASSIGN-TARGET

import React, { useContext, useEffect, useState } from "react";
import { ArrowLeft, CrossIcon } from "../../assets/globle";
import { useNavigate } from "react-router-dom";
import styles from "./assignTarget.module.css";
import { BASE_URL_V2, org_id } from "../../config";
import { useDispatch, useSelector } from "react-redux";
import {
  customAssignGoals as customAssignGoalsAPI,
  getGoalById as getGoalByIdAPI,
  getTargetDetailsById as getTargetDetailsAPI,
  updateStaffTarget as updateStaffTargetAPI,
} from "../../redux/action/goals";
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  notification,
} from "antd";
import Context from "../../context/Context";
import dayjs from "dayjs";
import moment from "moment";
import { Staff as staffIcon } from "../../assets/navbarImages";
import SingleSelectSearch from "../../components/selectSearch/singleSelectSearch";
import FormInput from "../../components/form-elements/formInput";
import { decimalInputValidation } from "../../helpers/regex";
import { DatePickerInput } from "../../components/form-elements/datePickerInput";
import SelectProduct from "./selectProduct";

const AssignTarget = () => {
  const [form] = Form.useForm();

  const format = "YYYY-MM-DD";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { getGoalById, getTargetDetailsById, updateStaffTarget } = state;
  const { customAssignGoals } = state;
  const context = useContext(Context);
  const { productData } = context;
  const queryParameters = new URLSearchParams(window.location.search);
  const id = queryParameters.get("id");
  const name = queryParameters.get("name");
  const targetType = queryParameters.get("type");
  const targetId = queryParameters.get("target_id");

  const [commonOrCustom, setCommonOrCustom] = useState(
    targetId ? "custom" : "common"
  );

  const [profileInfo, setProfileInfo] = useState();

  const [checkBox, setCheckBox] = useState(initialCheckbox);

  const [formValueCommon, setFormValueCommon] = useState(initialValue);
  const [commonUserList, setCommonUserList] = useState([]);

  const [formValueCustom, setFormValueCustom] = useState(initialValue);
  const [customUser, setCustomUser] = useState(null);

  const [error, setError] = useState(errorInitialValue);

  const [isLoading, setIsLoading] = useState(false);
  const [userList, setUserList] = useState();
  const [customProductData, setCustomProductData] = useState([]);

  const handleGoalDetails = (data) => {
    if (data === 0)
      return setFormValueCommon((prev) => ({ ...prev, name: null }));
    dispatch(getGoalByIdAPI(data));
  };

  const handleDeleteUser = (data) => {
    let tempUserList = formValueCommon.user_id_list.filter(
      (id) => id !== data.id
    );
    setFormValueCommon((prevState) => ({
      ...prevState,
      user_id_list: tempUserList,
    }));

    let tempCommonUserList = commonUserList.filter((ele) => ele !== data);
    setCommonUserList(tempCommonUserList);
  };

  const handleSubmit = () => {
    let formValue = form.getFieldsValue();

    setIsLoading(true);
    if (commonOrCustom === "common") {
      if (!formValueCommon.name) {
        setError((prevState) => ({
          ...prevState,
          target: true,
        }));
        resetError();
      }
      if (formValueCommon.user_id_list.length === 0) {
        setError((prevState) => ({
          ...prevState,
          user: true,
        }));
        resetError();
      }
      if (!formValueCommon.start_date) {
        setError((prevState) => ({
          ...prevState,
          start_date: true,
        }));
        resetError();
      }
      if (
        formValueCommon.name &&
        formValueCommon.user_id_list.length > 0 &&
        formValueCommon.start_date
      )
        dispatch(customAssignGoalsAPI(formValueCommon));
      setIsLoading(false);
      return;
    }

    Object.assign(formValue, {
      target_customer_visits: Number(formValue.target_customer_visits),
      target_new_customers: Number(formValue.target_new_customers),
      target_new_leads: Number(formValue.target_new_leads),
      target_payment_collection: Number(formValue.target_payment_collection),
      target_sales_amount: Number(formValue.target_sales_amount),
      product_metrics: productData,
      user_id_list: [userList],
    });

    if (targetId) {
      dispatch(updateStaffTargetAPI(targetId, formValue));
    } else dispatch(customAssignGoalsAPI(formValue));
    setIsLoading(false);
  };

  const resetError = () => {
    setTimeout(() => {
      setError(errorInitialValue);
    }, 2000);
  };

  useEffect(() => {
    // For getting the goal details
    if (getGoalById.data && !getGoalById.data.data.error) {
      let tempData = getGoalById.data.data.data;
      setFormValueCommon((prevState) => ({
        ...prevState,
        target_template: tempData.id,
        duration_string: tempData.duration_string,
        name: tempData.name,
        target_sales_amount: tempData.target_sales_amount,
        target_payment_collection: tempData.target_payment_collection,
        target_new_leads: tempData.target_new_leads,
        target_new_customers: tempData.target_new_customers,
        target_customer_visits: tempData.target_customer_visits,
        product_metrics: tempData.product_metrics,
      }));
    }

    if (
      targetId &&
      getTargetDetailsById.data &&
      !getTargetDetailsById.data.data.error
    ) {
      let tempData = getTargetDetailsById.data.data.data;
      form.setFieldsValue({
        name: tempData.name,
        user_id_list: [tempData.user],
        start_date: tempData.start_date,
        recurring: tempData.recurring,
        target_sales_amount: tempData.target_sales_amount,
        target_payment_collection: tempData.target_payment_collection,
        target_new_leads: tempData.target_new_leads,
        target_new_customers: tempData.target_new_customers,
        target_customer_visits: tempData.target_customer_visits,
        duration_string: tempData.duration_string,
      });
      setCheckBox((prev) => ({
        ...prev,
        sale: tempData.target_sales_amount > 0 ? true : false,
        payment: tempData.target_payment_collection > 0 ? true : false,
        lead: tempData.target_new_leads > 0 ? true : false,
        visit: tempData.target_customer_visits > 0 ? true : false,
        customer: tempData.target_new_customers > 0 ? true : false,
      }));
      setCustomProductData(tempData.product_metrics);
      setCustomUser(tempData.user_name);
      setProfileInfo({
        name: tempData.name,
        imgUrl: tempData.profile_pic_url,
      });
    }

    if (updateStaffTarget.data && !updateStaffTarget.data.data.error) {
      navigate(-1);
    }
    if (customAssignGoals.data && customAssignGoals.data.data.error === false) {
      navigate(-1);
    }
  }, [state]);

  useEffect(() => {
    if (id) {
      setFormValueCustom((prevState) => ({
        ...prevState,
        user_id_list: [id],
      }));
      setFormValueCommon((prevState) => ({
        ...prevState,
        user_id_list: [id],
      }));
      setCommonUserList([{ id: id, name: name }]);
    }
  }, [id]);

  useEffect(() => {
    if (targetId) {
      dispatch(getTargetDetailsAPI(targetId));
    }
  }, [targetId]);

  const targetListAPI = `${BASE_URL_V2}/organization/${org_id}/target/template/`;
  const userListAPI = `${BASE_URL_V2}/organization/${org_id}/staff/`;

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

  return (
    <div className={styles.assign_target_container}>
      <h2 style={{ display: "flex", alignItems: "center", gap: ".5em" }}>
        <img
          src={ArrowLeft}
          alt="arrow"
          onClick={() => navigate(-1)}
          style={{ cursor: "pointer" }}
        />
        {targetId ? "Edit Target" : "Assign Target to User"}
      </h2>
      <Form
        form={form}
        layout="vertical"
        validateMessages={{
          required: "${label} is required.",
        }}
        initialValues={{ recurring: false, pics: [] }}
        requiredMark={(label, info) => (
          <div>
            {label} {info.required && <span style={{ color: "red" }}>*</span>}
          </div>
        )}
        onFinish={handleSubmit}
      >
        <div className={styles.form_container}>
          {!targetId ? (
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
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingInline: "20px",
              }}
            >
              <div className={styles.staff_name}>
                <label>
                  Staff Assigned <span style={{ color: "red" }}>*</span>
                </label>
                <p>
                  <img
                    src={profileInfo?.imgUrl || staffIcon}
                    alt={profileInfo?.name}
                  />
                  {customUser}
                </p>
              </div>
              {form.getFieldValue("name") && (
                <div className={styles.staff_name}>
                  <label>
                    Template Name <span style={{ color: "red" }}>*</span>
                  </label>
                  <p>{form.getFieldValue("name")}</p>
                </div>
              )}
            </div>
          )}
          {commonOrCustom === "common" ? (
            <div className={styles.common_container}>
              <label>
                Select Target <span style={{ color: "red" }}>*</span>
              </label>
              <SingleSelectSearch
                apiUrl={targetListAPI}
                onChange={(data) => handleGoalDetails(data?.id || 0)}
                value={formValueCommon.name}
                params={{
                  placeholder: "Search Target",
                  status: error.target && "error",
                }}
              />
              {!id && (
                <>
                  <br />
                  <br />
                  <label>
                    Select Users <span style={{ color: "red" }}>*</span>
                  </label>
                  <SingleSelectSearch
                    apiUrl={userListAPI}
                    onChange={(data) => {
                      if (formValueCommon.user_id_list.includes(data.user)) {
                        notification.warning({
                          message: "Already added to user list",
                        });
                      } else {
                        if (data.user !== undefined) {
                          setFormValueCommon((prevState) => ({
                            ...prevState,
                            user_id_list: [
                              ...formValueCommon.user_id_list,
                              data.user,
                            ],
                          }));
                          setCommonUserList(
                            commonUserList?.concat({
                              id: data.user,
                              name: data.name,
                            })
                          );
                        }
                      }
                    }}
                    value={null}
                    params={{
                      placeholder: "Search User",
                      status: error.user && "error",
                    }}
                  />
                </>
              )}
              <br />
              <br />
              {commonUserList.length > 0 && (
                <>
                  <label>Selected User</label>
                  <ol>
                    {commonUserList.map((data, index) => {
                      return (
                        <li key={index}>
                          <span>
                            {index + 1}. {data.name}
                          </span>
                          <span>
                            <img
                              src={CrossIcon}
                              className="clickable"
                              onClick={() => handleDeleteUser(data)}
                            />
                          </span>
                        </li>
                      );
                    })}
                  </ol>
                </>
              )}
              <div className={styles.view_footer}>
                <label>
                  Start Date <span style={{ color: "red" }}>*</span> :
                </label>
                <div>
                  <DatePicker
                    disabled={targetType?.toLowerCase() === "active" && true}
                    disabledDate={(currentDate) => {
                      return (
                        currentDate && currentDate < dayjs().startOf("day")
                      );
                    }}
                    style={{ width: "50%", height: 40 }}
                    format="YYYY-MM-DD"
                    onChange={(date, dateString) => {
                      setFormValueCommon((prevState) => ({
                        ...prevState,
                        start_date: dateString,
                      }));
                    }}
                    value={
                      formValueCommon.start_date
                        ? dayjs(formValueCommon.start_date)
                        : dayjs()
                    }
                    className={error.start_date ? styles.input_error : ""}
                  />
                  <Form.Item name="recurring">
                    <Checkbox
                      onChange={(e) =>
                        setFormValueCommon((prevState) => ({
                          ...prevState,
                          recurring: e.target.checked,
                        }))
                      }
                      checked={formValueCommon.recurring}
                    />
                    <span style={{ marginLeft: 20, marginRight: 10 }}>
                      Recurring Goal
                    </span>
                  </Form.Item>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.common_container}>
              {!targetId && (
                <Form.Item
                  label="User Name"
                  name="user_id_list"
                  rules={[{ required: true }]}
                >
                  {id ? (
                    <Input readOnly value={name} />
                  ) : (
                    <UserName setUserList={setUserList} />
                  )}
                </Form.Item>
              )}
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
                      placeholder: "0",
                    }}
                  />
                </Form.Item>
              </div>
              <div style={{ paddingLeft: 35, marginTop: 15 }}>
                Product wise sales
              </div>
              <SelectProduct data={customProductData} />
              <Row gutter={12}>
                <Col span={12}>
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
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Start Date"
                    name="start_date"
                    rules={[{ required: true }]}
                  >
                    <DatePickerInput
                      format={format}
                      params={{
                        disabledDate: (currentDate) =>
                          currentDate && currentDate < dayjs().startOf("day"),
                        style: { width: "100%", padding: " 11px" },
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="" name="recurring" valuePropName="checked">
                <Checkbox>Recurring Goal</Checkbox>
              </Form.Item>
            </div>
          )}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 20,
            gap: 20,
            justifyContent: "end",
          }}
        >
          <Button
            onClick={() => navigate(-1)}
            className="button_secondary"
            style={{ padding: "0 20px" }}
          >
            Cancel
          </Button>
          <Button
            className="button_primary"
            htmlType="submit"
            loading={isLoading}
          >
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AssignTarget;

let initialValue = {
  name: null,
  duration_string: "",
  target_sales_amount: "",
  target_payment_collection: "",
  target_new_leads: "",
  target_new_customers: "",
  target_customer_visits: "",
  recurring: false,
  start_date: moment().format("YYYY-MM-DD"),
  user_id_list: [],
  product_metrics: [],
  target_template: 0,
};

const initialCheckbox = {
  sale: false,
  payment: false,
  lead: false,
  visit: false,
  customer: false,
};

const errorInitialValue = {
  target: false,
  user: false,
  duration: false,
  start_date: false,
  product_error: { error: false, id: "" },
};

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

const UserName = ({ onChange, value, setUserList }) => {
  const userListAPI = `${BASE_URL_V2}/organization/${org_id}/staff/`;
  return (
    <>
      <SingleSelectSearch
        apiUrl={userListAPI}
        onChange={(data) => {
          if (onChange) {
            onChange(data?.name);
            setUserList(data?.user);
          }
        }}
        value={value}
        params={{ placeholder: "Search User" }}
      />
      <br />
    </>
  );
};
