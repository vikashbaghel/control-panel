import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Context from "../../context/Context";
import { CloseOutlined } from "@ant-design/icons";
import { Drawer, Button, Select, Form, Input, Space, DatePicker } from "antd";
//api called
import TextArea from "antd/es/input/TextArea";
import {
  reibursementService,
  reimbursementEditService,
} from "../../redux/action/reimbursementAction";
import moment from "moment";
import dayjs from "dayjs";

const EditReimbursement = () => {
  const context = useContext(Context);
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const {
    editReimbursementOpen,
    setEditReimbursementOpen,
    editReimbursementData,
    setEditReimbursementData,
  } = context;
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const onClose = () => {
    setEditReimbursementOpen(false);
    setEditReimbursementData("");
  };

  const onFinish = (values) => {
    if (values.name !== "") {
      const apiData = {
        id: editReimbursementData.id,
        name: values.name,
        status: values.status,
        description: values.description !== "" ? values.description : "",
        start_date_time: startDate
          ? moment(startDate).format("YYYY-MM-DDTh:mm:ss")
          : moment(editReimbursementData.start_date_time).format(
              "YYYY-MM-DDTh:mm:ss"
            ),
        end_date_time: endDate
          ? moment(endDate).format("YYYY-MM-DDTh:mm:ss")
          : editReimbursementData.end_date_time
          ? moment(editReimbursementData.end_date_time).format(
              "YYYY-MM-DDTh:mm:ss"
            )
          : "",
      };
      dispatch(reimbursementEditService(apiData));
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
    return current && current > dayjs(endDate);
  };

  let defaultStartDate = moment(editReimbursementData.start_date_time).format(
    "YYYY-MM-DD"
  );
  let defaultEndDate = moment(editReimbursementData.end_date_time).format(
    "YYYY-MM-DD"
  );

  useEffect(() => {
    if (state.editReibursement.data !== "") {
      if (state.editReibursement.data.data.error === false) {
        onClose();
      }
    }
  }, [state]);

  return (
    <>
      {editReimbursementData && (
        <Drawer
          className="container"
          title={
            <>
              <CloseOutlined onClick={onClose} /> <span>Edit Expense Head</span>{" "}
            </>
          }
          width={500}
          closable={false}
          onClose={onClose}
          open={editReimbursementOpen}
          style={{ overflowY: "auto" }}
        >
          <Form
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
              <Input defaultValue={editReimbursementData.name} required />
            </Form.Item>

            <Form.Item
              style={{ fontWeight: "600" }}
              label="Description"
              name="description"
            >
              <TextArea defaultValue={editReimbursementData.description} />
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
                  defaultValue={dayjs(defaultStartDate, "YYYY-MM-DD")}
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
                  defaultValue={
                    defaultEndDate === "Invalid date"
                      ? ""
                      : dayjs(defaultEndDate, "YYYY-MM-DD")
                  }
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
                Update
              </Button>
              <Button style={{ margin: "50px 0 20px 20px" }} onClick={onClose}>
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </Drawer>
      )}
    </>
  );
};
export default EditReimbursement;
