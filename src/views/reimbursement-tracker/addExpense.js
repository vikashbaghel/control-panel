import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./expenses.module.css";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "../../assets/globle";
import { Button, Col, Form, Input, Row } from "antd";
import moment from "moment";
import {
  addReimbursementItemService,
  reibursementItemDetailsService,
  reibursementTrackerDetailsService,
  reimbursementItemEditService,
} from "../../redux/action/reimbursementAction";
import { DatePickerInput } from "../../components/form-elements/datePickerInput";
import ImageUploader from "../../components/image-uploader/ImageUploader";
import { singleUploadImage } from "../../helpers/uploadImage";
import { decimalInputValidation } from "../../helpers/regex";

const { TextArea } = Input;

const AddExpenseComponent = () => {
  const [form] = Form.useForm();

  const format = "YYYY-MM-DD";
  const queryParameters = new URLSearchParams(window.location.search);
  const expense_head_id = queryParameters.get("expense_head_id");
  const expense_head_name = queryParameters.get("expense_head_name");
  const expense_id = queryParameters.get("expense_id");
  const start_date = queryParameters.get("start_date");
  const end_date = queryParameters.get("end_date");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useSelector((state) => state);
  const {
    addReibursementItem,
    editReibursement,
    getReibursementItemEdit,
    getReibursementTrackerDetails,
    getReimbursementItemDetails,
  } = state;

  const [startDate, setStartDate] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (expense_head_id && expense_id) {
      dispatch(reibursementItemDetailsService(expense_id));
      dispatch(reibursementTrackerDetailsService(expense_head_id));
    }
  }, [expense_id]);

  const resetDatePickerValues = () => {
    navigate("/web/expense-tracker");
    form.resetFields();
  };

  useEffect(() => {
    if (
      (addReibursementItem.data && !addReibursementItem.data.data.error) ||
      (editReibursement.data && !editReibursement.data.data.error) ||
      (getReibursementItemEdit.data && !getReibursementItemEdit.data.data.error)
    ) {
      resetDatePickerValues();
    }
    if (
      getReibursementTrackerDetails.data &&
      !getReibursementTrackerDetails.data.data.error &&
      expense_id
    ) {
      handleExpenseHeadDetails(getReibursementTrackerDetails.data.data.data);
      setStartDate({
        start: moment(
          getReibursementTrackerDetails.data.data.data.start_date_time
        ).format("YYYY-MM-DD"),
        end: moment(
          getReibursementTrackerDetails.data.data.data.end_date_time
        ).format("YYYY-MM-DD"),
      });
    }
    if (
      getReimbursementItemDetails.data &&
      !getReimbursementItemDetails.data.data.error &&
      expense_head_id &&
      expense_id
    ) {
      handleExpenseHeadDetails(getReimbursementItemDetails.data.data.data);
    }
  }, [state]);

  const handleExpenseHeadDetails = (data) => {
    form.setFieldsValue({
      name: data.name,
      description: data.description,
      expense_date_time: data.expense_date_time,
      amount: data.amount,
      bill_proof: data.bill_proof_urls,
    });
  };

  const onHandleSubmit = async () => {
    let formValue = form.getFieldsValue();
    setIsLoading(true);
    let tempImgList = formValue.bill_proof?.filter((file) => !file.id);
    let tempImgId = formValue.bill_proof
      ?.filter((file) => file.id)
      .map((fileId) => fileId.id);

    let apiData = {
      name: formValue.name,
      description: formValue.description,
      amount: formValue.amount,
      expense_date_time: moment(formValue.expense_date_time).format(
        "YYYY-MM-DDTh:mm:ss"
      ),
      reimbursementtracker: expense_head_id,
    };

    if (tempImgList?.length !== 0) {
      for (let i = 0; i < tempImgList?.length; i++) {
        const file = await singleUploadImage(tempImgList[i]);
        tempImgId.push(file);
      }
    }
    let tempData = { ...apiData, bill_proof: tempImgId };
    if (expense_id) {
      dispatch(reimbursementItemEditService(tempData, expense_id));
    } else dispatch(addReimbursementItemService(tempData));
  };

  // only show dates which was in between the main expense details
  const disabledDate = (current) => {
    const today = new Date(start_date ? start_date : startDate.start);
    const endDate = new Date(end_date ? end_date : startDate.end);
    if (endDate) {
      return (
        current &&
        (current < moment(today).startOf("day") ||
          current > moment(endDate).endOf("day"))
      );
    }
    return current && current < today;
  };

  return (
    <>
      <div className={styles.add_edit_from_expense}>
        <h2>
          <img src={ArrowLeft} onClick={resetDatePickerValues} alt="arrow" />
          &nbsp;
          {expense_id ? `Update Expense (${expense_head_name})` : "Add Expense"}
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
              label="Title"
              name="name"
              style={{ font: 16 }}
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter Name" />
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
                  label="Expense Amount"
                  name="amount"
                  rules={[{ required: true }]}
                >
                  <Input
                    placeholder="Enter Amount"
                    onKeyPress={decimalInputValidation}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Expense Date" name="expense_date_time">
                  <DatePickerInput
                    format={format}
                    params={{
                      disabledDate: disabledDate,
                      style: { width: "100%", padding: "10px" },
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              label="Images (upload at-least 1 image and upto 6 images)"
              name="bill_proof"
              style={{ font: 16 }}
            >
              <ImageUploader maxCount={6} />
            </Form.Item>
          </div>
          <div className={styles.form_button}>
            <Button
              className="button_primary"
              htmlType="submit"
              loading={isLoading}
            >
              {expense_head_id && expense_id ? "Update" : "Create"}
            </Button>
            <Button
              className="button_secondary"
              onClick={resetDatePickerValues}
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

export default AddExpenseComponent;
