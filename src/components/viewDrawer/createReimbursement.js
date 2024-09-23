import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Context from "../../context/Context";
import { CloseOutlined } from "@ant-design/icons";
import { Drawer, Button, Select, Form, Input, DatePicker, Space } from "antd";
//api called
import TextArea from "antd/es/input/TextArea";
import {
  reibursementService,
  reimbursementAddService,
} from "../../redux/action/reimbursementAction";
import moment from "moment";
import dayjs from "dayjs";

const CreateReimbursement = () => {
  const context = useContext(Context);
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const [form] = Form.useForm();
  const { createReimbursementOpen, setCreateReimbursementOpen } = context;
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const onClose = () => {
    setCreateReimbursementOpen(false);
    form.resetFields();
  };

  const onFinish = (values) => {
    if (values.name !== "") {
      const apiData = {
        name: values.name,
        description: values.description !== "" ? values.description : "",
        start_date_time: moment(startDate).format("YYYY-MM-DDTh:mm:ss"),
        end_date_time: endDate
          ? moment(endDate).format("YYYY-MM-DDTh:mm:ss")
          : "",
      };
      dispatch(reimbursementAddService(apiData));
      setTimeout(() => {
        dispatch(reibursementService());
      }, 400);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
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

  useEffect(() => {
    if (state.addReibursement.data !== "") {
      if (state.addReibursement.data.data.error === false) {
        onClose();
      }
    }
  }, [state]);

  return (
    <>
      <Drawer
        className="container"
        title={
          <>
            <CloseOutlined onClick={onClose} />
            &nbsp;&nbsp;&nbsp;<span>Add Expense Head</span>{" "}
          </>
        }
        width={500}
        closable={false}
        onClose={onClose}
        // open={createReimbursementOpen}
        style={{ overflowY: "auto" }}
      >
        <Form
          form={form}
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 500,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            style={{ fontWeight: "600" }}
            label="Expense Head"
            name="name"
            required
          >
            <Input required />
          </Form.Item>

          <Form.Item
            style={{ fontWeight: "600" }}
            label="Description"
            name="description"
          >
            <TextArea />
          </Form.Item>

          <Form.Item
            style={{ fontWeight: "600" }}
            label="Start Date"
            name="start_date_time"
            required
          >
            <Space direction="vertical" width={200} required="true">
              <DatePicker
                format={dateFormat}
                style={{ width: "200px" }}
                onChange={onSelectStartDate}
                disabledDate={disabledStartDate}
                required="true"
              />
            </Space>
          </Form.Item>

          <Form.Item
            style={{ fontWeight: "600" }}
            label="End date"
            name="end_date_time"
          >
            <Space direction="vertical" width={200}>
              <DatePicker
                format={dateFormat}
                style={{ width: "200px" }}
                onChange={onSelectEndDate}
                disabledDate={disabledEndDate}
                required
              />
            </Space>
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Create
            </Button>
            <Button style={{ margin: "50px 0 20px 20px" }} onClick={onClose}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};
export default CreateReimbursement;
