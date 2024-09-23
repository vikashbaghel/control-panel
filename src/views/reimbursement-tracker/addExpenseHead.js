import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./expenses.module.css";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "../../assets/globle";
import { Button, Col, Form, Input, Row } from "antd";
import moment from "moment";
import {
  reibursementTrackerDetailsService,
  reimbursementAddService,
  reimbursementEditService,
} from "../../redux/action/reimbursementAction";
import { DatePickerInput } from "../../components/form-elements/datePickerInput";
import { removeEmpty } from "../../helpers/globalFunction";
import FormInput from "../../components/form-elements/formInput";

const { TextArea } = Input;

const AddExpenseHeadComponent = () => {
  const [form] = Form.useForm();

  const queryParameters = new URLSearchParams(window.location.search);
  const id = queryParameters.get("id") || 0;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useSelector((state) => state);
  const { addReibursement, editReibursement, getReibursementTrackerDetails } =
    state;

  const format = "YYYY-MM-DD";

  const [isLoading, setIsLoading] = useState(false);
  const [expenseId, setExpenseId] = useState(null);

  const resetFormFields = () => {
    form.resetFields();
  };

  const handleExpenseHeadDetails = (data) => {
    form.setFieldsValue({
      name: data.name,
      description: data.description,
      start_date_time: data.start_date_time,
      end_date_time: data.end_date_time,
    });
    setExpenseId(data.id);
  };

  const onHandleSubmit = () => {
    setIsLoading(true);
    let values = form.getFieldsValue();
    Object.assign(values, {
      start_date_time: moment(values.start_date_time).format(
        "YYYY-MM-DDTh:mm:ss"
      ),
      end_date_time: values.end_date_time
        ? moment(values.end_date_time).format("YYYY-MM-DDTh:mm:ss")
        : "",
      id: expenseId,
    });
    if (id) dispatch(reimbursementEditService(values));
    else dispatch(reimbursementAddService(removeEmpty(values)));
    setIsLoading(false);
  };

  const disabledStartDate = (current) => {
    return (
      form.getFieldValue("end_date_time") &&
      current > moment(form.getFieldValue("end_date_time")).endOf("day")
    );
  };

  const disabledEndDate = (current) => {
    return (
      form.getFieldValue("start_date_time") &&
      current < moment(form.getFieldValue("start_date_time")).endOf("day")
    );
  };

  const onClose = () => {
    navigate("/web/expense-tracker");
    resetFormFields();
    setExpenseId(null);
  };

  useEffect(() => {
    id && dispatch(reibursementTrackerDetailsService(id));
  }, []);

  useEffect(() => {
    if (
      (addReibursement.data && !addReibursement.data.data.error) ||
      (editReibursement.data && !editReibursement.data.data.error)
    ) {
      onClose();
    }
    if (
      getReibursementTrackerDetails.data &&
      !getReibursementTrackerDetails.data.data.error
    ) {
      id &&
        handleExpenseHeadDetails(getReibursementTrackerDetails.data.data.data);
    }
  }, [state]);

  return (
    <>
      <div className={styles.add_edit_from}>
        <h2>
          <img src={ArrowLeft} onClick={onClose} alt="arrow" />
          &nbsp; {id ? "Update" : "Add"} Expense Head
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
          onFinish={onHandleSubmit}
        >
          <div className={styles.form}>
            <Form.Item
              label="Name"
              name="name"
              style={{ font: 16 }}
              rules={[{ required: true }]}
            >
              <FormInput
                type="aplhaDash"
                params={{ placeholder: "Enter Name" }}
              />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              style={{ font: 16 }}
            >
              <TextArea placeholder="Enter Description" />
            </Form.Item>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item
                  label="Start Date"
                  name="start_date_time"
                  required
                  rules={[{ required: true }]}
                >
                  <DatePickerInput
                    format={format}
                    params={{ disabledDate: disabledStartDate }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="End Date" name="end_date_time">
                  <DatePickerInput
                    format={format}
                    params={{ disabledDate: disabledEndDate }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
          <div className={styles.form_button}>
            <Button
              className="button_primary"
              htmlType="submit"
              loading={isLoading}
            >
              {id ? "Update" : "Create"}
            </Button>
            <Button
              className="button_secondary"
              onClick={onClose}
              style={{ padding: "0 20px" }}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default AddExpenseHeadComponent;
